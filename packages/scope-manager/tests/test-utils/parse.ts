import * as tseslint from '@typescript-eslint/typescript-estree';

import type { AnalyzeOptions } from '../../src/analyze';

import { analyze } from '../../src/analyze';

export type SourceType = AnalyzeOptions['sourceType'];

const DEFAULT_PARSER_OPTIONS = {
  // the analyser requires ranges to work
  range: true,
};
const DEFAULT_ANALYZE_OPTIONS = {
  // include no libs so we don't pollute tests
  lib: [],
};

export function parse(
  code: string,
  sourceTypeOrParserOptions:
    | SourceType
    | tseslint.TSESTreeOptions = DEFAULT_PARSER_OPTIONS,
): ReturnType<typeof tseslint.parse> {
  return tseslint.parse(code, {
    ...DEFAULT_PARSER_OPTIONS,
    ...(typeof sourceTypeOrParserOptions === 'string'
      ? {
          sourceType: sourceTypeOrParserOptions,
        }
      : sourceTypeOrParserOptions),
  });
}

export interface ParseAndAnalyze {
  ast: ReturnType<typeof tseslint.parse>;
  scopeManager: ReturnType<typeof analyze>;
}
export function parseAndAnalyze(
  code: string,
  sourceType: SourceType,
): ParseAndAnalyze;
export function parseAndAnalyze(
  code: string,
  analyzeOptions?: AnalyzeOptions,
  parserOptions?: tseslint.TSESTreeOptions,
): ParseAndAnalyze;
export function parseAndAnalyze(
  code: string,
  sourceTypeOrAnalyzeOption:
    | AnalyzeOptions
    | SourceType = DEFAULT_ANALYZE_OPTIONS,
  parserOptions: tseslint.TSESTreeOptions = DEFAULT_PARSER_OPTIONS,
): ParseAndAnalyze {
  const ast = parse(code, { ...parserOptions });

  const analyzeOptions = {
    ...DEFAULT_ANALYZE_OPTIONS,
    ...(typeof sourceTypeOrAnalyzeOption === 'string'
      ? { sourceType: sourceTypeOrAnalyzeOption }
      : sourceTypeOrAnalyzeOption),
  };
  const scopeManager = analyze(ast, analyzeOptions);

  return { ast, scopeManager };
}

export type { AnalyzeOptions } from '../../src/analyze';
