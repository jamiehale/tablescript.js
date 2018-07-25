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

const mapFormalParameters = (formalParameters, parameters) => parameters.reduce((acc, p, i) => ({ ...acc, [formalParameters[i]]: p }), {});

export const mapFunctionParameters = (context, formalParameters, parameters) => ({
  ...mapFormalParameters(formalParameters, R.take(formalParameters.length, parameters)),
  'arguments': context.factory.createArrayValue(parameters),
});
