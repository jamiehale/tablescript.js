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

export const randomNumber = n => {
  return Math.floor(Math.random() * n) + 1;
};

export const nRolls = (n, max) => R.map(
  () => randomNumber(max),
  R.range(0, n)
);

export const nUniqueRolls = (n, max) => {
  let rolls = [];
  while (rolls.length < n) {
    rolls = R.uniq(R.append(randomNumber(max), rolls));
  }
  return rolls;
};
