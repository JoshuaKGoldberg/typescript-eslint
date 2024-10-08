import type { ParserOptions } from '@babel/core';

import { parse } from '@babel/eslint-parser';

import type { Fixture, ParserResponse } from './parser-types';

import { ParserResponseType } from './parser-types';

const PLUGINS: NonNullable<ParserOptions['plugins']> = [
  'decoratorAutoAccessors',
  // TODO - enable classFeatures instead of classProperties when we support it
  // 'classFeatures',
  'classProperties',
  'decorators-legacy',
  'explicitResourceManagement',
  'importAssertions',
  'typescript',
];

export function parseBabel(fixture: Fixture, contents: string): ParserResponse {
  const plugins = [...PLUGINS];
  if (fixture.isJSX) {
    plugins.push('jsx');
  }

  try {
    const result = parse(contents, {
      allowImportExportEverywhere: true,
      babelOptions: {
        parserOpts: {
          plugins,
        },
      },
      ecmaFeatures: {
        globalReturn: true,
      },
      requireConfigFile: false,
      sourceType: 'unambiguous',
    });
    const { comments: __, tokens: _, ...program } = result;

    return {
      ast: program,
      error: 'NO ERROR',
      tokens: result.tokens,
      type: ParserResponseType.NoError,
    };
  } catch (error: unknown) {
    return {
      error,
      type: ParserResponseType.Error,
    };
  }
}
