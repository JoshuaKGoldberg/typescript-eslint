import type { TSESTree } from '@typescript-eslint/utils';
import type * as ts from 'typescript';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import * as tsutils from 'ts-api-utils';

import { isTypeAnyType, isTypeUnknownType } from './predicates';

/**
 * Does a simple check to see if there is an any being assigned to a non-any type.
 *
 * This also checks generic positions to ensure there's no unsafe sub-assignments.
 * Note: in the case of generic positions, it makes the assumption that the two types are the same.
 *
 * @example See tests for examples
 *
 * @returns false if it's safe, or an object with the two types if it's unsafe
 */
export function isUnsafeAssignment(
  type: ts.Type,
  receiver: ts.Type,
  checker: ts.TypeChecker,
  senderNode: TSESTree.Node | null,
): false | { receiver: ts.Type; sender: ts.Type } {
  return isUnsafeAssignmentWorker(
    type,
    receiver,
    checker,
    senderNode,
    new Map(),
  );
}

function isUnsafeAssignmentWorker(
  type: ts.Type,
  receiver: ts.Type,
  checker: ts.TypeChecker,
  senderNode: TSESTree.Node | null,
  visited: Map<ts.Type, Set<ts.Type>>,
): false | { receiver: ts.Type; sender: ts.Type } {
  if (isTypeAnyType(type)) {
    // Allow assignment of any ==> unknown.
    if (isTypeUnknownType(receiver)) {
      return false;
    }

    if (!isTypeAnyType(receiver)) {
      return { receiver, sender: type };
    }
  }

  const typeAlreadyVisited = visited.get(type);

  if (typeAlreadyVisited) {
    if (typeAlreadyVisited.has(receiver)) {
      return false;
    }
    typeAlreadyVisited.add(receiver);
  } else {
    visited.set(type, new Set([receiver]));
  }

  if (tsutils.isTypeReference(type) && tsutils.isTypeReference(receiver)) {
    // TODO - figure out how to handle cases like this,
    // where the types are assignable, but not the same type
    /*
    function foo(): ReadonlySet<number> { return new Set<any>(); }

    // and

    type Test<T> = { prop: T }
    type Test2 = { prop: string }
    declare const a: Test<any>;
    const b: Test2 = a;
    */

    if (type.target !== receiver.target) {
      // if the type references are different, assume safe, as we won't know how to compare the two types
      // the generic positions might not be equivalent for both types
      return false;
    }

    if (
      senderNode?.type === AST_NODE_TYPES.NewExpression &&
      senderNode.callee.type === AST_NODE_TYPES.Identifier &&
      senderNode.callee.name === 'Map' &&
      senderNode.arguments.length === 0 &&
      senderNode.typeArguments == null
    ) {
      // special case to handle `new Map()`
      // unfortunately Map's default empty constructor is typed to return `Map<any, any>` :(
      // https://github.com/typescript-eslint/typescript-eslint/issues/2109#issuecomment-634144396
      return false;
    }

    const typeArguments = type.typeArguments ?? [];
    const receiverTypeArguments = receiver.typeArguments ?? [];

    for (let i = 0; i < typeArguments.length; i += 1) {
      const arg = typeArguments[i];
      const receiverArg = receiverTypeArguments[i];

      const unsafe = isUnsafeAssignmentWorker(
        arg,
        receiverArg,
        checker,
        senderNode,
        visited,
      );
      if (unsafe) {
        return { receiver, sender: type };
      }
    }

    return false;
  }

  return false;
}
