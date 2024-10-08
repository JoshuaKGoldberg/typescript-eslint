import type { TSESTree } from '@typescript-eslint/utils';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule, isDefinitionFile } from '../util';

function isEmptyExport(
  node: TSESTree.Node,
): node is TSESTree.ExportNamedDeclaration {
  return (
    node.type === AST_NODE_TYPES.ExportNamedDeclaration &&
    node.specifiers.length === 0 &&
    !node.declaration
  );
}

const exportOrImportNodeTypes = new Set([
  AST_NODE_TYPES.ExportAllDeclaration,
  AST_NODE_TYPES.ExportDefaultDeclaration,
  AST_NODE_TYPES.ExportNamedDeclaration,
  AST_NODE_TYPES.ExportSpecifier,
  AST_NODE_TYPES.ImportDeclaration,
  AST_NODE_TYPES.TSExportAssignment,
  AST_NODE_TYPES.TSImportEqualsDeclaration,
]);

export default createRule({
  name: 'no-useless-empty-export',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        "Disallow empty exports that don't change anything in a module file",
    },
    fixable: 'code',
    hasSuggestions: false,
    messages: {
      uselessExport: 'Empty export does nothing and can be removed.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // In a definition file, export {} is necessary to make the module properly
    // encapsulated, even when there are other exports
    // https://github.com/typescript-eslint/typescript-eslint/issues/4975
    if (isDefinitionFile(context.filename)) {
      return {};
    }
    function checkNode(
      node: TSESTree.Program | TSESTree.TSModuleDeclaration,
    ): void {
      if (!Array.isArray(node.body)) {
        return;
      }

      const emptyExports: TSESTree.ExportNamedDeclaration[] = [];
      let foundOtherExport = false;

      for (const statement of node.body) {
        if (isEmptyExport(statement)) {
          emptyExports.push(statement);
        } else if (exportOrImportNodeTypes.has(statement.type)) {
          foundOtherExport = true;
        }
      }

      if (foundOtherExport) {
        for (const emptyExport of emptyExports) {
          context.report({
            node: emptyExport,
            messageId: 'uselessExport',
            fix: fixer => fixer.remove(emptyExport),
          });
        }
      }
    }

    return {
      Program: checkNode,
      TSModuleDeclaration: checkNode,
    };
  },
});
