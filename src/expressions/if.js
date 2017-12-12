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

import { createUndefined } from '../values/undefined';
import { defaultExpression } from './default';
import { expressionTypes } from './types';

export const createIfExpression = (context, condition, ifBlock, elseBlock) => {
  
  const evaluate = async scope => {
    const expressionValue = await condition.evaluate(scope);
    if (expressionValue.asNativeBoolean(context)) {
      return await ifBlock.evaluate(scope);
    } else {
      if (elseBlock) {
        return await elseBlock.evaluate(scope);
      }
      return createUndefined();
    }
  };

  const getReferencedSymbols = () => {
    return [
      ...condition.getReferencedSymbols(),
      ...ifBlock.getReferencedSymbols(),
      ...(elseBlock ? elseBlock.getReferencedSymbols() : []),
    ];
  };

  return {
    ...defaultExpression(expressionTypes.IF, evaluate, getReferencedSymbols),
  };
};