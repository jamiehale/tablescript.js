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
import { createValue } from './default';
import { valueTypes } from './types';
import { createStringValue } from './string';
import { createBooleanValue } from './boolean';
import { mapFunctionParameters } from '../util/parameters';
import { replaceScope, pushStack } from '../context';

export const requiredParameter = (context, name) => {
  if (context.scope[name]) {
    return context.scope[name];
  }
  throwRuntimeError(`Missing required parameter ${name}`, context);
};

export const optionalParameter = (context, name) => context.scope[name];

export const optionalParameterOr = (context, name, value) => context.scope[name] ? context.scope[name] : value;

const sharedAsNativeString = type => () => `function(${type})`;
const asNativeBoolean = () => true;
const nativeEquals = () => false;
const equals = () => createBooleanValue(false);
const asBoolean = () => createBooleanValue(asNativeBoolean()); // asBoolean = R.pipe(asNativeBoolean, createBooleanValue) does not work wat

export const createNativeFunctionValue = (formalParameters, f) => {
  const asNativeString = sharedAsNativeString('native');
  const callFunction = async (context, parameters) => {
    const localContext = replaceScope(context, mapFunctionParameters(formalParameters, parameters));
    return f(localContext);
  };

  return createValue(
    valueTypes.FUNCTION,
    asNativeString,
    [],
    {
      asNativeString,
      asNativeBoolean,
      nativeEquals,
      asBoolean,
      callFunction,
      equals,
    },
  );
};

export const createFunctionValue = (formalParameters, body, closure) => {
  const asNativeString = sharedAsNativeString('tablescript');
  const callFunction = async (context, parameters) => {
    const localContext = pushStack(replaceScope(context, {
      ...context.scope,
      ...closure,
      ...mapFunctionParameters(formalParameters, parameters),
    }));
    return body.evaluate(localContext);
  };

  return createValue(
    valueTypes.FUNCTION,
    asNativeString,
    [],
    {
      asNativeString,
      asNativeBoolean,
      nativeEquals,
      asBoolean,
      callFunction,
      equals,
    }
  );
};
