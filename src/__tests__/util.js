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

import R from 'ramda';
import { valueTypes } from '../values/types';

export const isBooleanValue = expected => value => {
  if (value.type !== valueTypes.BOOLEAN) {
    throw new Error(`Expecting a BOOLEAN but got ${value.type}`);
  }
  const actual = value.asNativeBoolean();
  if (actual !== expected) {
    throw new Error(`Expecting ${expected} but got ${actual}`);
  }
  return true;
};

export const isNumericValue = expected => value => {
  if (value.type !== valueTypes.NUMBER) {
    throw new Error(`Expecting a NUMBER but got ${value.type}`);
  }
  const actual = value.asNativeNumber();
  if (actual !== expected) {
    throw new Error(`Expecting ${expected} but got ${actual}`);
  }
  return true;
};

export const isStringValue = expected => value => {
  if (value.type !== valueTypes.STRING) {
    throw new Error(`Expecting a STRING but got ${value.type}`);
  }
  const actual = value.asNativeString();
  if (actual !== expected) {
    throw new Error(`Expecting ${expected} but got ${actual}`);
  }
  return true;
};

export const isArrayValue = expected => value => {
  if (value.type !== valueTypes.ARRAY) {
    throw new Error(`Expecting an ARRAY but got ${value.type}`);
  }
  const actual = value.asNativeArray();
  if (!R.equals(actual, expected)) {
    throw new Error(`Expecting ${expected} but got ${actual}`);
  }
  return true;
};

export const isUndefined = value => {
  if (value.type !== valueTypes.UNDEFINED) {
    throw new Error(`Expecting a UNDEFINED but got ${value.type}`);
  }
  return true;
};
