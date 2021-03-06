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

import { createObjectValue } from '../values';
import { assertBuiltIn } from './assert';
import { exitBuiltIn } from './exit';
import {
  chooseBuiltIn,
  chooseNBuiltIn,
  chooseUniqueNBuiltIn,
} from './choose';
import {
  keysBuiltIn,
  valuesBuiltIn,
  toPairsBuiltIn,
  fromPairsBuiltIn,
  hasKeyBuiltIn,
} from './objects';
import { printBuiltIn } from './print';
import { rangeBuiltIn } from './range';
import { importBuiltIn } from './import';
import { strBuiltIn, intBuiltIn, floatBuiltIn, boolBuiltIn } from './convert';
import { initializeMath } from './math';
import { typeOfBuiltIn } from './typeof';
import { pipeBuiltIn, composeBuiltIn } from './fp';
import {
  isBooleanBuiltIn,
  isNumberBuiltIn,
  isStringBuiltIn,
  isObjectBuiltIn,
  isArrayBuiltIn,
  isFunctionBuiltIn,
  isTableBuiltIn,
  isUndefinedBuiltIn,
  isCallableBuiltIn,
} from './types';

export const initializeBuiltins = () => ({
  assert: assertBuiltIn,
  exit: exitBuiltIn,

  choose: chooseBuiltIn,
  chooseN: chooseNBuiltIn,
  chooseUniqueN: chooseUniqueNBuiltIn,

  keys: keysBuiltIn,
  values: valuesBuiltIn,
  toPairs: toPairsBuiltIn,
  fromPairs: fromPairsBuiltIn,
  hasKey: hasKeyBuiltIn,

  print: printBuiltIn,

  range: rangeBuiltIn,

  import: importBuiltIn,

  typeOf: typeOfBuiltIn,

  str: strBuiltIn,
  int: intBuiltIn,
  float: floatBuiltIn,
  bool: boolBuiltIn,

  pipe: pipeBuiltIn,
  compose: composeBuiltIn,

  isBoolean: isBooleanBuiltIn,
  isNumber: isNumberBuiltIn,
  isString: isStringBuiltIn,
  isObject: isObjectBuiltIn,
  isArray: isArrayBuiltIn,
  isFunction: isFunctionBuiltIn,
  isTable: isTableBuiltIn,
  isUndefined: isUndefinedBuiltIn,
  isCallable: isCallableBuiltIn,

  math: createObjectValue({
    ...initializeMath(),
  }),
});


