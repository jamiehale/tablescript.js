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

import fs from 'fs';
import path from 'path';
import Tracer from 'pegjs-backtrace';

import parser from './peg-parser';
import { TablescriptError } from '../error';

const contextPath = (context, filename) => {
  if (filename.startsWith('./')) {
    return [path.dirname(context.path)];
  }
  return [];
};

const environmentPaths = () => (process.env.TS_PATH || '').split(':');

export const findAndParseFile = (context, filename) => {
  const paths = [...contextPath(context, filename), ...environmentPaths()];
  return paths.reduce((result, p) => result || parseFileIfExists(context, p, filename), undefined);
};

const readFile = (context, filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    throw new TablescriptError(e.name, e.message, context);
  }
};

const parseFileIfExists = (context, p, filename) => {
  const filePath = path.resolve(p, filename);
  return fs.existsSync(filePath) ? parse(filePath, readFile(context, filePath)) : undefined;
};

export const parseFile = filePath => {
  if (!fs.existsSync(filePath)) {
    throw new TablescriptError('IoError', 'File not found');
  }
  return parse(filePath, readFile(undefined, filePath));
};

const parse = (filePath, program) => {
  const tracer = new Tracer(program);
  try {
    return parser.parse(program, { tracer, path: filePath });
  } catch (e) {
    throw new TablescriptError(
      e.name,
      e.message,
      {
        path: filePath,
        line: e.location.start.line,
        column: e.location.start.column,
      },
      tracer.getBacktraceString()
    );
  }
};
