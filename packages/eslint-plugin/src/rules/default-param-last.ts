import type { TSESTree } from '@typescript-eslint/utils';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../util';

export default createRule({
  name: 'default-param-last',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce default parameters to be last',
      extendsBaseRule: true,
    },
    messages: {
      shouldBeLast: 'Default parameters should be last.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    /**
     * checks if node is optional parameter
     * @param node the node to be evaluated
     * @private
     */
    function isOptionalParam(node: TSESTree.Parameter): boolean {
      return (
        (node.type === AST_NODE_TYPES.ArrayPattern ||
          node.type === AST_NODE_TYPES.AssignmentPattern ||
          node.type === AST_NODE_TYPES.Identifier ||
          node.type === AST_NODE_TYPES.ObjectPattern ||
          node.type === AST_NODE_TYPES.RestElement) &&
        node.optional
      );
    }

    /**
     * checks if node is plain parameter
     * @param node the node to be evaluated
     * @private
     */
    function isPlainParam(node: TSESTree.Parameter): boolean {
      return !(
        node.type === AST_NODE_TYPES.AssignmentPattern ||
        node.type === AST_NODE_TYPES.RestElement ||
        isOptionalParam(node)
      );
    }

    function checkDefaultParamLast(
      node:
        | TSESTree.ArrowFunctionExpression
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression,
    ): void {
      let hasSeenPlainParam = false;
      for (let i = node.params.length - 1; i >= 0; i--) {
        const current = node.params[i];
        const param =
          current.type === AST_NODE_TYPES.TSParameterProperty
            ? current.parameter
            : current;

        if (isPlainParam(param)) {
          hasSeenPlainParam = true;
          continue;
        }

        if (
          hasSeenPlainParam &&
          (isOptionalParam(param) ||
            param.type === AST_NODE_TYPES.AssignmentPattern)
        ) {
          context.report({ node: current, messageId: 'shouldBeLast' });
        }
      }
    }

    return {
      ArrowFunctionExpression: checkDefaultParamLast,
      FunctionDeclaration: checkDefaultParamLast,
      FunctionExpression: checkDefaultParamLast,
    };
  },
});
