// Copyright 2019 Jamie Hale
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

import { createExpression } from './default';
import { expressionTypes } from './types';
import { allOperators } from './binary-operators';
import { withSetLocation } from './util/context';

const evaluate = (operators, leftExpression, operator, rightExpression) => context => operators[operator](context, leftExpression, rightExpression);

export const createBinaryExpression = (
  location,
  leftExpression,
  operator,
  rightExpression
) => createExpression(
  expressionTypes.BINARY,
  withSetLocation(location, evaluate(allOperators, leftExpression, operator, rightExpression)),
);
