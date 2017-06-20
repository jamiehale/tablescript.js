import chai from 'chai';
const expect = chai.expect;

import { valueTypes } from '../../src/interpreter/types';
import { createStringValue } from '../../src/interpreter/string';
import { createNumericValue } from '../../src/interpreter/numeric';
import { createBooleanValue } from '../../src/interpreter/boolean';
import { createUndefined } from '../../src/interpreter/undefined';
import { createArrayValue } from '../../src/interpreter/array';
import { TablescriptError } from '../../src/error';

describe('array', () => {
  const nonEmptyArray = () => createArrayValue([createStringValue('I have a ham radio'), createNumericValue(12), createBooleanValue(false)]);
  const emptyArray = () => createArrayValue([]);

  describe('with an initial value', () => {
    let value;

    beforeEach(() => {
      value = nonEmptyArray();
    });

    it('has an ARRAY type', () => {
      expect(value.type).to.equal(valueTypes.ARRAY);
    });

    it('throws if cast as a number', () => {
      expect(() => value.asNativeNumber()).to.throw('Cannot cast array to number');
    });

    it('has a JSON-ish string representation', () => {
      expect(value.asNativeString()).to.equal('["I have a ham radio",12,false]');
    });

    it('is true', () => {
      expect(value.asNativeBoolean()).to.be.true;
    });

    it('has a native array representation', () => {
      expect(value.asNativeArray()).to.eql(['I have a ham radio', 12, false]);
    });

    describe('equality', () => {
      it('is unimplemented', () => {
        expect(() => value.equals()).to.throw('Array equality unimplemented');
      });
    });

    describe('properties', () => {
      it('returns undefined for non-method properties', () => {
        expect(value.getProperty({}, createStringValue('not there')).type).to.equal(valueTypes.UNDEFINED);
      });

      describe('set', () => {

      });
    });
  });

  describe('empty', () => {
  });

  describe('methods', () => {
    describe('length', () => {
      let value;
      let property;

      describe('non-empty', () => {
        beforeEach(() => {
          value = nonEmptyArray();
          property = value.getProperty({}, createStringValue('length'));
        });

        it('is numeric', () => {
          expect(property.type).to.equal(valueTypes.NUMBER);
        });

        it('has the right count', () => {
          expect(property.asNativeNumber()).to.equal(3);
        });
      });

      describe('empty', () => {
        beforeEach(() => {
          value = emptyArray();
          property = value.getProperty({}, createStringValue('length'));
        });

        it('is numeric', () => {
          expect(property.type).to.equal(valueTypes.NUMBER);
        });

        it('has the right count', () => {
          expect(property.asNativeNumber()).to.equal(0);
        });
      });
    });

    describe('includes', () => {
      let value;
      let method;
      let result;

      describe('non-empty', () => {
        beforeEach(() => {
          value = nonEmptyArray();
          method = value.getProperty({}, createStringValue('includes'));
        });

        it('is a function', () => {
          expect(method.type).to.equal(valueTypes.FUNCTION);
        });

        describe('when called with no parameters', () => {
          beforeEach(() => {
            result = method.callFunction({}, {}, []);
          });

          it('returns undefined', () => {
            expect(result.type).to.equal(valueTypes.UNDEFINED);
          });
        });

        describe('when called with a parameter that matches an element', () => {
          beforeEach(() => {
            result = method.callFunction({}, {}, [createStringValue('I have a ham radio')]);
          });

          it('returns a boolean', () => {
            expect(result.type).to.equal(valueTypes.BOOLEAN);
          });

          it('returns true', () => {
            expect(result.asNativeBoolean()).to.be.true;
          });
        });

        describe('when called with a parameter that does not match an element', () => {
          beforeEach(() => {
            result = method.callFunction({}, {}, [createStringValue('not there')]);
          });

          it('returns a boolean', () => {
            expect(result.type).to.equal(valueTypes.BOOLEAN);
          });

          it('returns false', () => {
            expect(result.asNativeBoolean()).to.be.false;
          });
        });
      });

      describe('empty', () => {
        beforeEach(() => {
          value = emptyArray();
          method = value.getProperty({}, createStringValue('includes'));
        });

        it('is a function', () => {
          expect(method.type).to.equal(valueTypes.FUNCTION);
        });

        describe('when called with no parameters', () => {
          beforeEach(() => {
            result = method.callFunction({}, {}, []);
          });

          it('returns undefined', () => {
            expect(result.type).to.equal(valueTypes.UNDEFINED);
          });
        });

        describe('when called with a parameter that does not match an element', () => {
          beforeEach(() => {
            result = method.callFunction({}, {}, [createStringValue('not there')]);
          });

          it('returns a boolean', () => {
            expect(result.type).to.equal(valueTypes.BOOLEAN);
          });

          it('returns false', () => {
            expect(result.asNativeBoolean()).to.be.false;
          });
        });
      });
    });

    describe('map', () => {
      let value;
      let method;
      let mockCallback;

      describe('non-empty', () => {
        beforeEach(() => {
          value = nonEmptyArray();
          method = value.getProperty({}, createStringValue('map'));
          mockCallback = {
            callValues: [],
            callFunction: (context, scope, parameters) => {
              mockCallback.callValues.push(parameters);
              return createBooleanValue(true);
            }
          };
        });

        it('is a function', () => {
          expect(method.type).to.equal(valueTypes.FUNCTION);
        });

        it('calls the callback once for each element', () => {
          method.callFunction({}, {}, [mockCallback]);
          expect(mockCallback.callValues.length).to.equal(3);
        });

        describe('calling callback for each element', () => {
          const firstParameterForCall = (array, call) => array[call][0].asNativeValue();

          beforeEach(() => {
            method.callFunction({}, {}, [mockCallback]);
          });

          it('calls with the first element', () => {
            expect(firstParameterForCall(mockCallback.callValues, 0)).to.equal('I have a ham radio');
          });

          it('calls with the second element', () => {
            expect(firstParameterForCall(mockCallback.callValues, 1)).to.equal(12);
          });

          it('calls with the third element', () => {
            expect(firstParameterForCall(mockCallback.callValues, 2)).to.equal(false);
          });
        });

        describe('returning', () => {
          let result;

          beforeEach(() => {
            mockCallback = {
              callCount: 0,
              callFunction: (context, scope) => {
                const result = mockCallback.callCount;
                mockCallback.callCount += 1;
                return createNumericValue(result);
              }
            };
            result = method.callFunction({}, {}, [mockCallback]);
          });

          it('returns an array', () => {
            expect(result.type).to.equal(valueTypes.ARRAY);
          });

          it('returns an array built with the results of the callback calls', () => {
            expect(result.asNativeArray()).to.eql([0, 1, 2]);
          });
        });
      });

      describe('empty', () => {
        beforeEach(() => {
          value = emptyArray();
          method = value.getProperty({}, createStringValue('map'));
          mockCallback = {
            callValues: [],
            callFunction: (context, scope, parameters) => {
              mockCallback.callValues.push(parameters);
              return createBooleanValue(true);
            }
          };
        });

        it('is a function', () => {
          expect(method.type).to.equal(valueTypes.FUNCTION);
        });

        it('does not call the callback', () => {
          method.callFunction({}, {}, [mockCallback]);
          expect(mockCallback.callValues.length).to.equal(0);
        });

        describe('returning', () => {
          let result;

          beforeEach(() => {
            mockCallback = {};
            result = method.callFunction({}, {}, [mockCallback]);
          });

          it('returns an array', () => {
            expect(result.type).to.equal(valueTypes.ARRAY);
          });

          it('returns an empty array', () => {
            expect(result.asNativeArray().length).to.equal(0);
          });
        });
      });
    });

    describe('reduce', () => {
      let value;
      let method;
      let mockCallback;

      describe('non-empty', () => {
        beforeEach(() => {
          value = nonEmptyArray();
          method = value.getProperty({}, createStringValue('reduce'));
          mockCallback = {
            callValues: [],
            callFunction: (context, scope, parameters) => {
              mockCallback.callValues.push(parameters);
              return parameters[1];
            }
          };
        });

        it('is a function', () => {
          expect(method.type).to.equal(valueTypes.FUNCTION);
        });

        it('calls the callback once for each element', () => {
          method.callFunction({}, {}, [mockCallback]);
          expect(mockCallback.callValues.length).to.equal(3);
        });

        describe('calling callback for each element', () => {
          const firstParameterForCall = (array, call) => array[call][0].asNativeValue();
          const secondParameterForCall = (array, call) => array[call][1].asNativeValue();

          beforeEach(() => {
            method.callFunction({}, {}, [mockCallback, createStringValue('first')]);
          });

          it('calls with the initial value and first element', () => {
            expect(firstParameterForCall(mockCallback.callValues, 0)).to.equal('first');
            expect(secondParameterForCall(mockCallback.callValues, 0)).to.equal('I have a ham radio');
          });

          it('calls with the first element and second element', () => {
            expect(firstParameterForCall(mockCallback.callValues, 1)).to.equal('I have a ham radio');
            expect(secondParameterForCall(mockCallback.callValues, 1)).to.equal(12);
          });

          it('calls with the second element and third element', () => {
            expect(firstParameterForCall(mockCallback.callValues, 2)).to.equal(12);
            expect(secondParameterForCall(mockCallback.callValues, 2)).to.equal(false);
          });
        });

        describe('returning', () => {
          let result;

          beforeEach(() => {
            result = method.callFunction({}, {}, [mockCallback, createUndefined()]);
          });

          it('returns a boolean', () => {
            expect(result.type).to.equal(valueTypes.BOOLEAN);
          });

          it('returns the last value', () => {
            expect(result.asNativeBoolean()).to.equal(false);
          });
        });
      });

      describe('empty', () => {
        beforeEach(() => {
          value = emptyArray();
          method = value.getProperty({}, createStringValue('reduce'));
          mockCallback = {
            callValues: [],
            callFunction: (context, scope, parameters) => {
              mockCallback.callValues.push(parameters);
              return parameters[1];
            }
          };
        });

        it('is a function', () => {
          expect(method.type).to.equal(valueTypes.FUNCTION);
        });

        it('never calls the callback', () => {
          method.callFunction({}, {}, [mockCallback, createStringValue('initial value')]);
          expect(mockCallback.callValues.length).to.equal(0);
        });

        describe('returning', () => {
          let result;

          beforeEach(() => {
            result = method.callFunction({}, {}, [mockCallback, createStringValue('initial value')]);
          });

          it('returns a string', () => {
            expect(result.type).to.equal(valueTypes.STRING);
          });

          it('returns the initial value', () => {
            expect(result.asNativeString()).to.equal('initial value');
          });
        });
      });
    });

    describe('filter', () => {
      let value;
      let method;
      let mockCallback;

      describe('non-empty', () => {
        beforeEach(() => {
          value = nonEmptyArray();
          method = value.getProperty({}, createStringValue('filter'));
          mockCallback = {
            callValues: [],
            callFunction: (context, scope, parameters) => {
              mockCallback.callValues.push(parameters);
              return createBooleanValue(true);
            }
          };
        });

        it('is a function', () => {
          expect(method.type).to.equal(valueTypes.FUNCTION);
        });

        it('calls the callback once for each element', () => {
          method.callFunction({}, {}, [mockCallback]);
          expect(mockCallback.callValues.length).to.equal(3);
        });

        describe('calling callback for each element', () => {
          const firstParameterForCall = (array, call) => array[call][0].asNativeValue();

          beforeEach(() => {
            method.callFunction({}, {}, [mockCallback]);
          });

          it('calls with the first element', () => {
            expect(firstParameterForCall(mockCallback.callValues, 0)).to.equal('I have a ham radio');
          });

          it('calls with the second element', () => {
            expect(firstParameterForCall(mockCallback.callValues, 1)).to.equal(12);
          });

          it('calls with the third element', () => {
            expect(firstParameterForCall(mockCallback.callValues, 2)).to.equal(false);
          });
        });

        describe('returning', () => {
          let result;

          beforeEach(() => {
            mockCallback = {
              callFunction: (context, scope, parameters) => {
                return createBooleanValue(parameters[0].asNativeString() === 'I have a ham radio');
              }
            };
            result = method.callFunction({}, {}, [mockCallback]);
          });

          it('returns an array', () => {
            expect(result.type).to.equal(valueTypes.ARRAY);
          });

          it('returns an array built with the results of the callback calls', () => {
            expect(result.asNativeArray()).to.eql(['I have a ham radio']);
          });
        });
      });

      describe('empty', () => {
        beforeEach(() => {
          value = emptyArray();
          method = value.getProperty({}, createStringValue('map'));
          mockCallback = {
            callValues: [],
            callFunction: (context, scope, parameters) => {
              mockCallback.callValues.push(parameters);
              return createBooleanValue(true);
            }
          };
        });

        it('is a function', () => {
          expect(method.type).to.equal(valueTypes.FUNCTION);
        });

        it('does not call the callback', () => {
          method.callFunction({}, {}, [mockCallback]);
          expect(mockCallback.callValues.length).to.equal(0);
        });

        describe('returning', () => {
          let result;

          beforeEach(() => {
            mockCallback = {};
            result = method.callFunction({}, {}, [mockCallback]);
          });

          it('returns an array', () => {
            expect(result.type).to.equal(valueTypes.ARRAY);
          });

          it('returns an empty array', () => {
            expect(result.asNativeArray().length).to.equal(0);
          });
        });
      });
    });
  });
});
