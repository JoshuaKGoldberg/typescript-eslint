import { createProgram } from '@typescript-eslint/typescript-estree';
import * as glob from 'glob';
import fs from 'node:fs';
import path from 'node:path';

import type { ParserOptions } from '../../src/parser';

import {
  createSnapshotTestBlock,
  formatSnapshotName,
  testServices,
} from '../test-utils/test-utils';

//------------------------------------------------------------------------------
// Setup
//------------------------------------------------------------------------------

const FIXTURES_DIR = './tests/fixtures/services';
const testFiles = glob.sync(`**/*.src.ts`, {
  cwd: FIXTURES_DIR,
});

function createConfig(filename: string): ParserOptions {
  return {
    filePath: filename,
    project: './tsconfig.json',
    tsconfigRootDir: path.resolve(FIXTURES_DIR),
  };
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe('services', () => {
  const program = createProgram(path.resolve(FIXTURES_DIR, 'tsconfig.json'));
  testFiles.forEach(filename => {
    const code = fs.readFileSync(path.join(FIXTURES_DIR, filename), 'utf8');
    const config = createConfig(filename);
    const snapshotName = formatSnapshotName(filename, FIXTURES_DIR, '.ts');
    it(snapshotName, createSnapshotTestBlock(code, config));
    it(`${snapshotName} services`, () => {
      testServices(code, config);
    });
    it(`${snapshotName} services with provided program`, () => {
      testServices(code, { ...config, program });
    });
  });
});
