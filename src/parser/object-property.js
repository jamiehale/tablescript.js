// Copyright 2017 Jamie Hale
//
// This file is part of Tablescript.js.
//
// Tablescript.js is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Tablescript.js is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Tablescript.js. If not, see <http://www.gnu.org/licenses/>.

import { valueTypes } from '../interpreter/types';
import {
  createArrayElementLeftHandSideValue,
  createObjectPropertyLeftHandSideValue
} from '../interpreter/left-hand-side';
import { throwRuntimeError } from '../error';

export const createObjectPropertyExpression = (context, objectExpression, propertyNameExpression) => {
  return {
    evaluate: async scope => {
      const objectValue = await objectExpression.evaluate(scope);
      const propertyNameValue = await propertyNameExpression.evaluate(scope);
      if (propertyNameValue.type === valueTypes.NUMBER) {
        return await objectValue.getElement(context, propertyNameValue);
      }
      return objectValue.getProperty(context, propertyNameValue);
    },
    evaluateAsLeftHandSide: async (context, scope) => {
      const objectValue = await objectExpression.evaluate(scope);
      if (!(objectValue.type === valueTypes.OBJECT || objectValue.type === valueTypes.ARRAY)) {
        throwRuntimeError('Cannot assign to non-object non-array type', context);
      }
      const propertyNameValue = await propertyNameExpression.evaluate(scope);
      if (propertyNameValue.type === valueTypes.NUMBER) {
        return createArrayElementLeftHandSideValue(objectValue, propertyNameValue);
      } else if (propertyNameValue.type === valueTypes.STRING) {
        return createObjectPropertyLeftHandSideValue(objectValue, propertyNameValue);
      } else {
        throwRuntimeError('Cannot access property or element', context);
      }
    },
    getReferencedSymbols: () => {
      return [
        ...objectExpression.getReferencedSymbols(),
        ...propertyNameExpression.getReferencedSymbols(),
      ];
    },
  };
};
