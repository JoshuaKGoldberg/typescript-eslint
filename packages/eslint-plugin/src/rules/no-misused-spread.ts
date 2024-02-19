import { type TSESTree } from '@typescript-eslint/utils';
import * as tsutils from 'ts-api-utils';
import * as ts from 'typescript';

import {
  createRule,
  getConstrainedTypeAtLocation,
  getParserServices,
  isBuiltinSymbolLike,
  isTypeFlagSet,
} from '../util';

type MessageIds =
  | 'noStringSpreadInArray'
  | 'noSpreadInObject'
  | 'noFunctionSpreadInObject';

export default createRule<[], MessageIds>({
  name: 'no-misused-spread',
  meta: {
    type: 'problem',
    docs: {
      description:
        "Disallow using the spread operator on types that can't be spread",
      recommended: 'strict',
      requiresTypeChecking: true,
    },
    messages: {
      noStringSpreadInArray:
        "Using the spread operator on a string is not allowed in an array. Use `String.split('')` instead.",

      noSpreadInObject:
        'Using the spread operator on `{{type}}` is not allowed in an object.',

      noFunctionSpreadInObject:
        'Using the spread operator on `Function` without properties is not allowed in an object. Did you forget to call the function?',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();

    function checkArraySpread(node: TSESTree.SpreadElement): void {
      const type = getConstrainedTypeAtLocation(services, node.argument);

      if (isString(type, checker)) {
        context.report({
          node,
          messageId: 'noStringSpreadInArray',
        });

        return;
      }
    }

    function checkObjectSpread(node: TSESTree.SpreadElement): void {
      const type = getConstrainedTypeAtLocation(services, node.argument);

      if (isArray(type, checker)) {
        context.report({
          node,
          messageId: 'noSpreadInObject',
          data: {
            type: 'Array',
          },
        });

        return;
      }

      if (isBuiltinSymbolLike(services.program, type, 'Set')) {
        context.report({
          node,
          messageId: 'noSpreadInObject',
          data: {
            type: 'Set',
          },
        });

        return;
      }

      if (isBuiltinSymbolLike(services.program, type, 'Map')) {
        context.report({
          node,
          messageId: 'noSpreadInObject',
          data: {
            type: 'Map',
          },
        });

        return;
      }

      const symbol = type.getSymbol();

      if (
        symbol &&
        tsutils.isSymbolFlagSet(symbol, ts.SymbolFlags.Function) &&
        type.getProperties().length === 0
      ) {
        context.report({
          node,
          messageId: 'noFunctionSpreadInObject',
        });

        return;
      }

      if (isIterable(type, checker)) {
        context.report({
          node,
          messageId: 'noSpreadInObject',
          data: {
            type: 'Iterator',
          },
        });

        return;
      }
    }

    return {
      'ArrayExpression > SpreadElement': checkArraySpread,
      'ObjectExpression > SpreadElement': checkObjectSpread,
    };
  },
});

function isArray(type: ts.Type, checker: ts.TypeChecker): boolean {
  if (type.isUnion()) {
    return type.types.every(t => isArray(t, checker));
  }

  return checker.isArrayType(type) || checker.isTupleType(type);
}

function isIterable(type: ts.Type, checker: ts.TypeChecker): boolean {
  if (type.isUnion()) {
    return type.types.every(t => isIterable(t, checker));
  }

  const iterator = tsutils.getWellKnownSymbolPropertyOfType(
    type,
    'iterator',
    checker,
  );

  return iterator !== undefined;
}

function isString(type: ts.Type, checker: ts.TypeChecker): boolean {
  if (type.isIntersection()) {
    return type.types.some(t => isString(t, checker));
  }

  return isTypeFlagSet(type, ts.TypeFlags.StringLike);
}