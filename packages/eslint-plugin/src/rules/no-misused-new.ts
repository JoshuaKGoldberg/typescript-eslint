import type { TSESTree } from '@typescript-eslint/utils';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../util';

export default createRule({
  name: 'no-misused-new',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce valid definition of `new` and `constructor`',
      recommended: 'recommended',
    },
    messages: {
      errorMessageClass: 'Class cannot have method named `new`.',
      errorMessageInterface: 'Interfaces cannot be constructed, only classes.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    /**
     * @param node type to be inspected.
     * @returns name of simple type or null
     */
    function getTypeReferenceName(
      node:
        | TSESTree.EntityName
        | TSESTree.TSTypeAnnotation
        | TSESTree.TypeNode
        | undefined,
    ): string | null {
      if (node) {
        switch (node.type) {
          case AST_NODE_TYPES.TSTypeAnnotation:
            return getTypeReferenceName(node.typeAnnotation);
          case AST_NODE_TYPES.TSTypeReference:
            return getTypeReferenceName(node.typeName);
          case AST_NODE_TYPES.Identifier:
            return node.name;
          default:
            break;
        }
      }
      return null;
    }

    /**
     * @param parent parent node.
     * @param returnType type to be compared
     */
    function isMatchingParentType(
      parent:
        | TSESTree.ClassDeclaration
        | TSESTree.ClassExpression
        | TSESTree.Identifier
        | TSESTree.TSInterfaceDeclaration
        | undefined,
      returnType: TSESTree.TSTypeAnnotation | undefined,
    ): boolean {
      if (
        parent &&
        (parent.type === AST_NODE_TYPES.ClassDeclaration ||
          parent.type === AST_NODE_TYPES.ClassExpression ||
          parent.type === AST_NODE_TYPES.TSInterfaceDeclaration) &&
        parent.id
      ) {
        return getTypeReferenceName(returnType) === parent.id.name;
      }
      return false;
    }

    return {
      "ClassBody > MethodDefinition[key.name='new']"(
        node: TSESTree.MethodDefinition,
      ): void {
        if (
          node.value.type === AST_NODE_TYPES.TSEmptyBodyFunctionExpression &&
          isMatchingParentType(node.parent.parent, node.value.returnType)
        ) {
          context.report({
            node,
            messageId: 'errorMessageClass',
          });
        }
      },
      'TSInterfaceBody > TSConstructSignatureDeclaration'(
        node: TSESTree.TSConstructSignatureDeclaration,
      ): void {
        if (
          isMatchingParentType(
            node.parent.parent as TSESTree.TSInterfaceDeclaration,
            node.returnType,
          )
        ) {
          // constructor
          context.report({
            node,
            messageId: 'errorMessageInterface',
          });
        }
      },
      "TSMethodSignature[key.name='constructor']"(
        node: TSESTree.TSMethodSignature,
      ): void {
        context.report({
          node,
          messageId: 'errorMessageInterface',
        });
      },
    };
  },
});
