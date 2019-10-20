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

import * as R from 'ramda';
import { createValue } from './default';
import { valueTypes, isArray, isString } from './types';
import { throwRuntimeError } from '../error';
import { createNativeFunctionValue } from './function';
import { requiredParameter, optionalParameter } from '../util/parameters';
import { quickSort } from '../util/sort';

const entriesAsNativeValues = entries => entries.map(e => e.asNativeValue());

const identicalTo = entries => other => isArray(other) && entriesAsNativeValues(entries) == other.asNativeArray();

const asNativeString = entries => () => JSON.stringify(entriesAsNativeValues(entries));

const asNativeBoolean = () => true;

const asNativeArray = entries => () => entriesAsNativeValues(entries);

const nativeEquals = entries => (other) => {
  if (!isArray(other)) {
    return false;
  }
  const otherEntries = other.asArray();
  if (otherEntries.length !== entries.length) {
    return false;
  }
  return entries.reduce((result, entry, index) => result && entry.nativeEquals(otherEntries[index]), true);
};

const asArray = entries => () => entries;

const mapArrayIndex = (context, index, entries) => {
  const mappedIndex = index.asNativeNumber();
  if (mappedIndex < 0) {
    return entries.length + mappedIndex;
  }
  return mappedIndex;
};

const isValidIndex = (index, entries) => (index >= 0 && index < entries.length);

const setProperty = entries => (context, index, value) => {
  const indexValue = mapArrayIndex(context, index, entries);
  if (!isValidIndex(indexValue, entries)) {
    throwRuntimeError('Index out of range', context);
  }
  entries[indexValue] = value;
  return value;
};

const getElement = entries => (context, index) => {
  const indexValue = mapArrayIndex(context, index, entries);
  if (!isValidIndex(indexValue, entries)) {
    return context.factory.createUndefined();
  }
  return entries[indexValue];
};

const add = entries => (context, other) => createArrayValue([...entries, other]);

const multiplyBy = entries => (context, other) => createArrayValue(
  R.range(
    0,
    other.asNativeNumber()
  ).reduce((all,n) => ([...all, ...entries]), [])
);

const indexedReduce = R.addIndex(R.reduce);
const indexedMap = R.addIndex(R.map);
const indexedFilter = R.addIndex(R.filter);

const withRequiredParameter = parameter => f => (context, ...args) => f(context, requiredParameter(context, parameter), ...args)
const withOptionalParameter = parameter => f => (context, ...args) => f(context, optionalParameter(context, parameter), ...args);
const withNumericResult = f => (context, ...args) => context.factory.createNumericValue(f(context, ...args));
const withBooleanResult = f => (context, ...args) => context.factory.createBooleanValue(f(context, ...args));
const withArrayResult = f => (context, ...args) => context.factory.createArrayValue(f(context, ...args));

const each = entries => createNativeFunctionValue(
  ['f'],
  R.compose(
    withRequiredParameter('f'),
  )(
    (context, f) => indexedReduce(
      (_, entry, i) => f.callFunction(context, [entry, context.factory.createNumericValue(i)]),
      context.factory.createUndefined(),
      entries,
    ),
  ),
);

const reduce = entries => createNativeFunctionValue(
  ['reducer', 'initialValue'],
  R.compose(
    withRequiredParameter('initialValue'),
    withRequiredParameter('reducer'),
  )(
    (context, reducer, initialValue) => indexedReduce(
      (acc, entry, i) => reducer.callFunction(context, [acc, entry, context.factory.createNumericValue(i)]),
      initialValue,
      entries,
    ),
  ),
);

const map = entries => createNativeFunctionValue(
  ['mapf'],
  R.compose(
    withArrayResult,
    withRequiredParameter('mapf'),
  )(
    (context, f) => indexedMap(
      (entry, i) => f.callFunction(context, [entry, context.factory.createNumericValue(i)]),
      entries,
    ),
  ),
);

const filter = entries => createNativeFunctionValue(
  ['f'],
  R.compose(
    withArrayResult,
    withRequiredParameter('f'),
  )(
    (context, f) => indexedFilter(
      (entry, i) => f.callFunction(context, [entry, context.factory.createNumericValue(i)]).asNativeBoolean(),
      entries,
    ),
  ),
);

const includes = entries => createNativeFunctionValue(
  ['value'],
  R.compose(
    withBooleanResult,
    withRequiredParameter('value'),
  )(
    (context, value) => R.reduce((result, entry) => result || entry.nativeEquals(value), false, entries),
  ),
);

const indexOf = entries => createNativeFunctionValue(
  ['value'],
  R.compose(
    withNumericResult,
    withRequiredParameter('value'),
  )(
    (context, value) => R.findIndex(entry => entry.nativeEquals(value), entries),
  ),
);

const find = entries => createNativeFunctionValue(['f'], context => {
  const f = requiredParameter(context, 'f');
  for (let i = 0; i < entries.length; i++) {
    const testValue = f.callFunction(context, [entries[i]]);
    if (testValue.asNativeBoolean()) {
      return entries[i];
    }
  }
  return context.factory.createUndefined();
});

const findIndex = entries => createNativeFunctionValue(['f'], context => {
  const f = requiredParameter(context, 'f');
  for (let i = 0; i < entries.length; i++) {
    const testValue = f.callFunction(context, [entries[i]]);
    if (testValue.asNativeBoolean()) {
      return context.factory.createNumericValue(i);
    }
  }
  return context.factory.createNumericValue(-1);
});

const defaultSorter = createNativeFunctionValue(['a', 'b'], context => {
  return requiredParameter(context, 'a').compare(context, requiredParameter(context, 'b'));
});

const sort = entries => createNativeFunctionValue(['f'], context => {
  const f = optionalParameter(context, 'f');
  if (f) {
    return createArrayValue(quickSort(context, [...entries], f));
  }
  return createArrayValue(quickSort(context, [...entries], defaultSorter));
});

const join = entries => createNativeFunctionValue(['separator'], context => {
  const separator = optionalParameter(context, 'separator');
  if (separator) {
    if (!isString(separator)) {
      throwRuntimeError(`join([separator]) separator must be a string`, context);
    }
    return context.factory.createStringValue(entries.map(e => e.asNativeString()).join(separator.asNativeString()));
  }
  return context.factory.createStringValue(entries.map(e => e.asNativeString()).join());
});

const reverse = entries => createNativeFunctionValue([], context => {
  return createArrayValue([...entries].reverse());
});

const slice = entries => createNativeFunctionValue(['begin', 'end'], context => {
  const begin = optionalParameter(context, 'begin');
  if (begin) {
    const end = optionalParameter(context, 'end');
    if (end) {
      return createArrayValue(entries.slice(begin.asNativeNumber(), end.asNativeNumber()));
    }
    return createArrayValue(entries.slice(begin.asNativeNumber()));
  }
  return createArrayValue(entries.slice());
});

const unique = entries => createNativeFunctionValue([], context => {
  const results = [];
  for (const entry of entries) {
    if (!results.find(r => r.identicalTo(entry))) {
      results.push(entry);
      continue;
    }
  }
  return createArrayValue(results);
});

const length = entries => createNativeFunctionValue([], context => {
  return context.factory.createNumericValue(entries.length);
});

export const createArrayValue = entries => createValue(
  valueTypes.ARRAY,
  asNativeArray(entries),
  identicalTo(entries),
  nativeEquals(entries),
  {
    each: each(entries),
    reduce: reduce(entries),
    map: map(entries),
    filter: filter(entries),
    includes: includes(entries),
    indexOf: indexOf(entries),
    find: find(entries),
    findIndex: findIndex(entries),
    sort: sort(entries),
    join: join(entries),
    reverse: reverse(entries),
    slice: slice(entries),
    unique: unique(entries),
    length: length(entries),
  },
  {
    asNativeString: asNativeString(entries),
    asNativeBoolean,
    asNativeArray: asNativeArray(entries),
    asArray: asArray(entries),
    setProperty: setProperty(entries),
    getElement: getElement(entries),
    add: add(entries),
    multiplyBy: multiplyBy(entries),
  },
);
