export {
  type AST,
  parse,
  parseAndGenerateServices,
  type ParseAndGenerateServicesResult,
} from './parser';
export type {
  ParserServices,
  ParserServicesWithTypeInformation,
  ParserServicesWithoutTypeInformation,
  TSESTreeOptions,
} from './parser-options';
export { simpleTraverse } from './simple-traverse';
export * from './ts-estree';
export { createProgramFromConfigFile as createProgram } from './create-program/useProvidedPrograms';
export * from './create-program/getScriptKind';
export { getCanonicalFileName } from './create-program/shared';
export { typescriptVersionIsAtLeast } from './version-check';
export * from './getModifiers';
export { TSError } from './node-utils';
export * from './clear-caches';
export { withoutProjectParserOptions } from './withoutProjectParserOptions';

// note - cannot migrate this to an import statement because it will make TSC copy the package.json to the dist folder
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
export const version: string = require('../package.json').version;
