import type { JSONSchema4 } from '@typescript-eslint/utils/json-schema';

import { findHeadingIndex } from '../../utils/rules';
import type { RuleDocsPage } from '../RuleDocsPage';

const knownSkippedRules = new Set([
  'array-type',
  'ban-ts-comment',
  'member-ordering',
]);

const emptyOptionDefaults = new Map<unknown, unknown>([
  ['boolean', false],
  ['array', []],
]);

export function insertRuleOptions(page: RuleDocsPage): void {
  if (
    knownSkippedRules.has(page.file.stem) ||
    !Array.isArray(page.rule.meta.schema)
  ) {
    return;
  }

  const optionProperties = getOptionProperties(
    (page.rule.meta.schema as JSONSchema4[]).at(0),
  );

  if (!optionProperties) {
    return;
  }

  const defaultOptions = (page.rule.defaultOptions[0] ?? {}) as Record<
    string,
    unknown
  >;

  for (const [optionName, option] of Object.entries(optionProperties)) {
    if (!option.description) {
      if (!page.rule.meta.docs.extendsBaseRule) {
        throw new Error(`Missing description for option ${optionName}.`);
      }
      return;
    }

    const existingHeadingIndex = findHeadingIndex(
      page.children,
      3,
      node => node.type === 'inlineCode' && node.value === optionName,
    );
    if (existingHeadingIndex === -1) {
      if (!page.rule.meta.docs.extendsBaseRule) {
        throw new Error(`Couldn't find h3 for option ${optionName}.`);
      }
      continue;
    }

    const defaultValue =
      defaultOptions[optionName] ?? emptyOptionDefaults.get(option.type);

    page.spliceChildren(
      existingHeadingIndex + 1,
      0,
      defaultValue !== undefined
        ? `${option.description} Default: \`${JSON.stringify(defaultValue)}\`.`
        : option.description,
    );
  }
}

function getOptionProperties(
  options: JSONSchema4 | undefined,
): Record<string, JSONSchema4> | undefined {
  if (!options) {
    return undefined;
  }

  if (options.type === 'object') {
    return options.properties;
  }

  if (options.oneOf) {
    return options.oneOf.reduce<Record<string, JSONSchema4>>(
      (previous, next) => ({
        ...previous,
        ...getOptionProperties(next),
      }),
      {},
    );
  }

  return undefined;
}
