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

import { expressionTypes } from './types';
import { valueTypes } from '../values/types';
import {
  createArrayElementLeftHandSideValue,
  createObjectPropertyLeftHandSideValue
} from '../values/left-hand-side';
import { throwRuntimeError } from '../error';
import { createExpression } from './default';

const evaluate = (location, objectExpression, propertyNameExpression) => async (scope, options) => {
  const objectValue = await objectExpression.evaluate(scope, options);
  const propertyNameValue = await propertyNameExpression.evaluate(scope, options);
  if (propertyNameValue.type === valueTypes.NUMBER) {
    return await objectValue.getElement(location, propertyNameValue);
  }
  return objectValue.getProperty(location, propertyNameValue);
};

const evaluateAsLeftHandSide = (objectExpression, propertyNameExpression) => async (location, scope, options) => {
  const objectValue = await objectExpression.evaluate(scope, options);
  if (!(objectValue.type === valueTypes.OBJECT || objectValue.type === valueTypes.ARRAY)) {
    throwRuntimeError('Cannot assign to non-object non-array type', location);
  }
  const propertyNameValue = await propertyNameExpression.evaluate(scope, options);
  if (propertyNameValue.type === valueTypes.NUMBER) {
    return createArrayElementLeftHandSideValue(objectValue, propertyNameValue);
  }
  if (propertyNameValue.type === valueTypes.STRING) {
    return createObjectPropertyLeftHandSideValue(objectValue, propertyNameValue);
  }
  throwRuntimeError('Cannot access property or element', location);
};

export const createObjectPropertyExpression = (location, objectExpression, propertyNameExpression) => createExpression(
  expressionTypes.OBJECT_PROPERTY,
  evaluate(location, objectExpression, propertyNameExpression),
  evaluateAsLeftHandSide(objectExpression, propertyNameExpression),
);
