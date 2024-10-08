import type { TSESTree } from '@typescript-eslint/typescript-estree';

import type { ParserOptions } from '../../src/parser';

import * as parser from '../../src/parser';

const defaultConfig = {
  comment: true,
  errorOnUnknownASTType: true,
  loc: true,
  range: true,
  raw: true,
  sourceType: 'module' as const,
  tokens: true,
};

/**
 * Returns a raw copy of the given AST
 * @param ast the AST object
 * @returns copy of the AST object
 */
function getRaw(ast: TSESTree.Program): TSESTree.Program {
  return JSON.parse(
    JSON.stringify(ast, (key, value) => {
      if ((key === 'start' || key === 'end') && typeof value === 'number') {
        return undefined;
      }
      return value;
    }),
  );
}

/**
 * Returns a function which can be used as the callback of a Jest test() block,
 * and which performs an assertion on the snapshot for the given code and config.
 * @param code The source code to parse
 * @param config the parser configuration
 * @returns callback for Jest test() block
 */
export function createSnapshotTestBlock(
  code: string,
  config: ParserOptions = {},
): () => void {
  config = { ...defaultConfig, ...config };

  /**
   * @returns the AST object
   */
  function parse(): TSESTree.Program {
    const ast = parser.parseForESLint(code, config).ast;
    return getRaw(ast);
  }

  return (): void => {
    try {
      const result = parse();
      expect(result).toMatchSnapshot();
    } catch (error) {
      /**
       * If we are deliberately throwing because of encountering an unknown
       * AST_NODE_TYPE, we rethrow to cause the test to fail
       */
      if ((error as Error).message.includes('Unknown AST_NODE_TYPE')) {
        throw error;
      }
      expect(parse).toThrowErrorMatchingSnapshot();
    }
  };
}

/**
 * @param code The code being parsed
 * @param config The configuration object for the parser
 */
export function testServices(code: string, config: ParserOptions = {}): void {
  config = { ...defaultConfig, ...config };

  const services = parser.parseForESLint(code, config).services;
  expect(services).toBeDefined();
  expect(services.program).toBeDefined();
  expect(services.esTreeNodeToTSNodeMap).toBeDefined();
  expect(services.tsNodeToESTreeNodeMap).toBeDefined();
}

export function formatSnapshotName(
  filename: string,
  fixturesDir: string,
  fileExtension = '.js',
): string {
  return `fixtures/${filename
    .replace(`${fixturesDir}/`, '')
    .replace(fileExtension, '')}`;
}
