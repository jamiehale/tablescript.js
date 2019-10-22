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

import { createNativeFunctionValue } from '../native-function';
import { createStringValue } from '../string';
import { createNumericValue } from '../numeric';
import { createBooleanValue } from '../boolean';
import { createArrayValue } from '../array';
import { numericValue, booleanValue, arrayValue } from '../../__tests__/util';
import defaultFactory from '../../__tests__/factory';

describe('array', () => {
  const nonEmptyArray = () => createArrayValue([createStringValue('I have a ham radio'), createNumericValue(12), createBooleanValue(false)]);
  const nonEmptyNumericArray = () => createArrayValue([createNumericValue(4), createNumericValue(5), createNumericValue(6)]);
  const emptyArray = () => createArrayValue([]);

  let mockContext;

  beforeEach(() => {
    mockContext = {
      ...defaultFactory,
    };
  });

  xdescribe('methods', () => {
    describe('length', () => {
      const methodName = createStringValue('length');

      it('knows the length of non-empty arrays', () => {
        const f = nonEmptyArray().getProperty({}, methodName);
        expect(f.callFunction(mockContext, [])).toEqualTsNumber(3);
      });

      it('knows the length of empty arrays', () => {
        const f = emptyArray().getProperty({}, methodName);
        expect(f.callFunction(mockContext, [])).toEqualTsNumber(0);
      });
    });

    xdescribe('includes', () => {
      const methodName = createStringValue('includes');

      it('returns false for empty arrays', () => {
        const f = emptyArray().getProperty({}, methodName);
        return expect(f.callFunction({}, [createStringValue('Not gonna find it')])).to.eventually.satisfy(booleanValue(false));
      });

      it('returns false for non-empty arrays without a matching value', () => {
        const f = nonEmptyArray().getProperty({}, methodName);
        return expect(f.callFunction({}, [createStringValue('Not gonna find it')])).to.eventually.satisfy(booleanValue(false));
      });

      it('returns true for non-empty arrays with a matching value', () => {
        const f = nonEmptyArray().getProperty({}, methodName);
        return expect(f.callFunction({}, [createNumericValue(12)])).to.eventually.satisfy(booleanValue(true));
      });
    });

    xdescribe('map', () => {
      const methodName = createStringValue('map');
      let callback;

      beforeEach(() => {
        callback = createNativeFunctionValue(['n'], (context, scope) => {
          const n = scope['n'];
          return createNumericValue(n.asNativeNumber() + 1);
        });
      });

      describe('for an empty array', () => {
        let f;

        beforeEach(() => {
          f = emptyArray().getProperty({}, methodName);
        });

        it('returns an empty array when called on an empty array', () => {
          return expect(f.callFunction({}, [callback])).to.eventually.satisfy(arrayValue([]));
        });

        it('does not call the callback', async () => {
          chai.spy.on(callback, 'callFunction');
          await f.callFunction({}, [callback]);
          expect(callback.callFunction).not.to.have.been.called();
        });
      });

      describe('for a non-empty array', () => {
        let f;

        beforeEach(() => {
          f = nonEmptyNumericArray().getProperty({}, methodName);
        });

        it('returns an array of values mapped from the original array', () => {
          return expect(f.callFunction({}, [callback])).to.eventually.satisfy(arrayValue([5, 6, 7]));
        });

        it('calls the callback 3 times', async () => {
          chai.spy.on(callback, 'callFunction');
          await f.callFunction({}, [callback]);
          expect(callback.callFunction).to.have.been.called.exactly(3);
        });
      });
    });

    xdescribe('reduce', () => {
      const methodName = createStringValue('reduce');
      let callback;

      beforeEach(() => {
        callback = createNativeFunctionValue(['acc', 'n'], (context, scope) => {
          const acc = scope['acc'];
          const n = scope['n'];
          return createNumericValue(Math.max(acc.asNativeNumber(), n.asNativeNumber()));
        });
      });

      describe('for an empty array', () => {
        let f;

        beforeEach(() => {
          f = emptyArray().getProperty({}, methodName);
        });

        it('returns the initial value when called on an empty array', () => {
          return expect(f.callFunction({}, [callback, createNumericValue(0)])).to.eventually.satisfy(numericValue(0));
        });

        it('does not call the callback', async () => {
          chai.spy.on(callback, 'callFunction');
          await f.callFunction({}, [callback, createNumericValue(0)]);
          expect(callback.callFunction).not.to.have.been.called();
        });
      });

      describe('for a non-empty array', () => {
        let f;

        beforeEach(() => {
          f = nonEmptyNumericArray().getProperty({}, methodName);
        });

        it('returns the reduced value from the original array', () => {
          return expect(f.callFunction({}, [callback, createNumericValue(0)])).to.eventually.satisfy(numericValue(6));
        });

        it('calls the callback 3 times', async () => {
          chai.spy.on(callback, 'callFunction');
          await f.callFunction({}, [callback, createNumericValue(0)]);
          expect(callback.callFunction).to.have.been.called.exactly(3);
        });
      });
    });

    xdescribe('filter', () => {
      const methodName = createStringValue('filter');
      let callback;

      beforeEach(() => {
        callback = createNativeFunctionValue(['n'], (context, scope) => {
          const n = scope['n'];
          return createBooleanValue(n.asNativeNumber() % 2 === 0);
        });
      });

      describe('for an empty array', () => {
        let f;

        beforeEach(() => {
          f = emptyArray().getProperty({}, methodName);
        });

        it('returns an empty array when called on an empty array', () => {
          return expect(f.callFunction({}, [callback])).to.eventually.satisfy(arrayValue([]));
        });

        it('does not call the callback', async () => {
          chai.spy.on(callback, 'callFunction');
          await f.callFunction({}, [callback]);
          expect(callback.callFunction).not.to.have.been.called();
        });
      });

      describe('for a non-empty array', () => {
        let f;

        beforeEach(() => {
          f = nonEmptyNumericArray().getProperty({}, methodName);
        });

        it('returns an array of values mapped from the original array', () => {
          return expect(f.callFunction({}, [callback])).to.eventually.satisfy(arrayValue([4, 6]));
        });

        it('calls the callback 3 times', async () => {
          chai.spy.on(callback, 'callFunction');
          await f.callFunction({}, [callback]);
          expect(callback.callFunction).to.have.been.called.exactly(3);
        });
      });
    });
  });
});
