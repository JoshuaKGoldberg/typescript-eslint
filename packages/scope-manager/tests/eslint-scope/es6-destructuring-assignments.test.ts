/* eslint-disable @typescript-eslint/dot-notation -- ['implicit'] is private */
import { AST_NODE_TYPES } from '@typescript-eslint/types';

import type { Reference } from '../../src/index.js';

import { DefinitionType, ScopeType } from '../../src/index.js';
import { getRealVariables, parseAndAnalyze } from '../test-utils/index.js';

describe('ES6 destructuring assignments', () => {
  it('Pattern in var in ForInStatement', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        for (var [a, b, c] in array);
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(1);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe('array');

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(4);
    expect(variables[0].name).toBe('arguments');
    expect(variables[1].name).toBe('a');
    expect(variables[2].name).toBe('b');
    expect(variables[3].name).toBe('c');
    expect(scope.references).toHaveLength(4);
    expect(scope.references[0].identifier.name).toBe('a');
    expect(scope.references[0].isWrite()).toBe(true);
    expect(scope.references[0].resolved).toBe(variables[1]);
    expect(scope.references[1].identifier.name).toBe('b');
    expect(scope.references[1].isWrite()).toBe(true);
    expect(scope.references[1].resolved).toBe(variables[2]);
    expect(scope.references[2].identifier.name).toBe('c');
    expect(scope.references[2].isWrite()).toBe(true);
    expect(scope.references[2].resolved).toBe(variables[3]);
    expect(scope.references[3].identifier.name).toBe('array');
    expect(scope.references[3].isWrite()).toBe(false);
  });

  it('Pattern in let in ForInStatement', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        for (let [a, b, c] in array);
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(3); // [global, function, for]

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(1);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe('array');

    scope = scopeManager.scopes[2];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.for);
    expect(variables).toHaveLength(3);
    expect(variables[0].name).toBe('a');
    expect(variables[1].name).toBe('b');
    expect(variables[2].name).toBe('c');
    expect(scope.references).toHaveLength(4);
    expect(scope.references[0].identifier.name).toBe('a');
    expect(scope.references[0].isWrite()).toBe(true);
    expect(scope.references[0].resolved).toBe(variables[0]);
    expect(scope.references[1].identifier.name).toBe('b');
    expect(scope.references[1].isWrite()).toBe(true);
    expect(scope.references[1].resolved).toBe(variables[1]);
    expect(scope.references[2].identifier.name).toBe('c');
    expect(scope.references[2].isWrite()).toBe(true);
    expect(scope.references[2].resolved).toBe(variables[2]);
    expect(scope.references[3].identifier.name).toBe('array');
    expect(scope.references[3].isWrite()).toBe(false);

    assert.isNull(scope.references[3].resolved);
  });

  it('Pattern with default values in var in ForInStatement', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        for (var [a, b, c = d] in array);
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(2);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe('d');
    expect(scope['implicit'].leftToBeResolved[1].identifier.name).toBe('array');

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(4);
    expect(variables[0].name).toBe('arguments');
    expect(variables[1].name).toBe('a');
    expect(variables[2].name).toBe('b');
    expect(variables[3].name).toBe('c');
    expect(scope.references).toHaveLength(6);
    expect(scope.references[0].identifier.name).toBe('c');
    expect(scope.references[0].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[0].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[0].writeExpr.name).toBe('d');
    expect(scope.references[0].resolved).toBe(variables[3]);
    expect(scope.references[1].identifier.name).toBe('d');
    expect(scope.references[1].isWrite()).toBe(false);
    expect(scope.references[2].identifier.name).toBe('a');
    expect(scope.references[2].isWrite()).toBe(true);
    expect(scope.references[2].resolved).toBe(variables[1]);
    expect(scope.references[3].identifier.name).toBe('b');
    expect(scope.references[3].isWrite()).toBe(true);
    expect(scope.references[3].resolved).toBe(variables[2]);
    expect(scope.references[4].identifier.name).toBe('c');
    expect(scope.references[4].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[4].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[4].writeExpr.name).toBe('array');
    expect(scope.references[4].resolved).toBe(variables[3]);
    expect(scope.references[5].identifier.name).toBe('array');
    expect(scope.references[5].isWrite()).toBe(false);
  });

  it('Pattern with default values in let in ForInStatement', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        for (let [a, b, c = d] in array);
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(3); // [global, function, for]

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(2);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe('d');
    assert.isScopeOfType(
      scope['implicit'].leftToBeResolved[0].from,
      ScopeType.for,
    );
    expect(scope['implicit'].leftToBeResolved[1].identifier.name).toBe('array');
    assert.isScopeOfType(
      scope['implicit'].leftToBeResolved[1].from,
      ScopeType.for,
    );

    scope = scopeManager.scopes[2];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.for);
    expect(variables).toHaveLength(3);
    expect(variables[0].name).toBe('a');
    expect(variables[1].name).toBe('b');
    expect(variables[2].name).toBe('c');
    expect(scope.references).toHaveLength(6);
    expect(scope.references[0].identifier.name).toBe('c');
    expect(scope.references[0].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[0].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[0].writeExpr.name).toBe('d');
    expect(scope.references[0].resolved).toBe(variables[2]);
    expect(scope.references[1].identifier.name).toBe('d');
    expect(scope.references[1].isWrite()).toBe(false);
    expect(scope.references[2].identifier.name).toBe('a');
    expect(scope.references[2].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[2].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[2].writeExpr.name).toBe('array');
    expect(scope.references[2].resolved).toBe(variables[0]);
    expect(scope.references[3].identifier.name).toBe('b');
    expect(scope.references[3].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[3].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[3].writeExpr.name).toBe('array');
    expect(scope.references[3].resolved).toBe(variables[1]);
    expect(scope.references[4].identifier.name).toBe('c');
    expect(scope.references[4].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[4].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[4].writeExpr.name).toBe('array');
    expect(scope.references[4].resolved).toBe(variables[2]);
    expect(scope.references[5].identifier.name).toBe('array');
    expect(scope.references[5].isWrite()).toBe(false);

    assert.isNull(scope.references[5].resolved);
  });

  it('Pattern with nested default values in var in ForInStatement', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        for (var [a, [b, c = d] = e] in array);
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(3);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe('d');
    expect(scope['implicit'].leftToBeResolved[1].identifier.name).toBe('e');
    expect(scope['implicit'].leftToBeResolved[2].identifier.name).toBe('array');

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(4);
    expect(variables[0].name).toBe('arguments');
    expect(variables[1].name).toBe('a');
    expect(variables[2].name).toBe('b');
    expect(variables[3].name).toBe('c');
    expect(scope.references).toHaveLength(9);
    expect(scope.references[0].identifier.name).toBe('b');
    expect(scope.references[0].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[0].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[0].writeExpr.name).toBe('e');
    expect(scope.references[0].resolved).toBe(variables[2]);
    expect(scope.references[1].identifier.name).toBe('c');
    expect(scope.references[1].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[1].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[1].writeExpr.name).toBe('e');
    expect(scope.references[1].resolved).toBe(variables[3]);
    expect(scope.references[2].identifier.name).toBe('c');
    expect(scope.references[2].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[2].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[2].writeExpr.name).toBe('d');
    expect(scope.references[2].resolved).toBe(variables[3]);
    expect(scope.references[3].identifier.name).toBe('d');
    expect(scope.references[3].isWrite()).toBe(false);
    expect(scope.references[4].identifier.name).toBe('e');
    expect(scope.references[4].isWrite()).toBe(false);
    expect(scope.references[5].identifier.name).toBe('a');
    expect(scope.references[5].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[5].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[5].writeExpr.name).toBe('array');
    expect(scope.references[5].resolved).toBe(variables[1]);
    expect(scope.references[6].identifier.name).toBe('b');
    expect(scope.references[6].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[6].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[6].writeExpr.name).toBe('array');
    expect(scope.references[6].resolved).toBe(variables[2]);
    expect(scope.references[7].identifier.name).toBe('c');
    expect(scope.references[7].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[7].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[7].writeExpr.name).toBe('array');
    expect(scope.references[7].resolved).toBe(variables[3]);
    expect(scope.references[8].identifier.name).toBe('array');
    expect(scope.references[8].isWrite()).toBe(false);
  });

  it('Pattern with nested default values in let in ForInStatement', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        for (let [a, [b, c = d] = e] in array);
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(3); // [global, function, for]

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(3);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe('d');
    assert.isScopeOfType(
      scope['implicit'].leftToBeResolved[0].from,
      ScopeType.for,
    );
    expect(scope['implicit'].leftToBeResolved[1].identifier.name).toBe('e');
    assert.isScopeOfType(
      scope['implicit'].leftToBeResolved[1].from,
      ScopeType.for,
    );
    expect(scope['implicit'].leftToBeResolved[2].identifier.name).toBe('array');
    assert.isScopeOfType(
      scope['implicit'].leftToBeResolved[2].from,
      ScopeType.for,
    );

    scope = scopeManager.scopes[2];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.for);
    expect(variables).toHaveLength(3);
    expect(variables[0].name).toBe('a');
    expect(variables[1].name).toBe('b');
    expect(variables[2].name).toBe('c');
    expect(scope.references).toHaveLength(9);
    expect(scope.references[0].identifier.name).toBe('b');
    expect(scope.references[0].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[0].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[0].writeExpr.name).toBe('e');
    expect(scope.references[0].resolved).toBe(variables[1]);
    expect(scope.references[1].identifier.name).toBe('c');
    expect(scope.references[1].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[1].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[1].writeExpr.name).toBe('e');
    expect(scope.references[1].resolved).toBe(variables[2]);
    expect(scope.references[2].identifier.name).toBe('c');
    expect(scope.references[2].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[2].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[2].writeExpr.name).toBe('d');
    expect(scope.references[2].resolved).toBe(variables[2]);
    expect(scope.references[3].identifier.name).toBe('d');
    expect(scope.references[3].isWrite()).toBe(false);
    expect(scope.references[4].identifier.name).toBe('e');
    expect(scope.references[4].isWrite()).toBe(false);
    expect(scope.references[5].identifier.name).toBe('a');
    expect(scope.references[5].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[5].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[5].writeExpr.name).toBe('array');
    expect(scope.references[5].resolved).toBe(variables[0]);
    expect(scope.references[6].identifier.name).toBe('b');
    expect(scope.references[6].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[6].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[6].writeExpr.name).toBe('array');
    expect(scope.references[6].resolved).toBe(variables[1]);
    expect(scope.references[7].identifier.name).toBe('c');
    expect(scope.references[7].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[7].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[7].writeExpr.name).toBe('array');
    expect(scope.references[7].resolved).toBe(variables[2]);
    expect(scope.references[8].identifier.name).toBe('array');
    expect(scope.references[8].isWrite()).toBe(false);

    assert.isNull(scope.references[8].resolved);
  });

  it('Pattern with default values in var in ForInStatement (separate declarations)', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        var a, b, c;
        for ([a, b, c = d] in array);
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(2);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe('d');
    expect(scope['implicit'].leftToBeResolved[1].identifier.name).toBe('array');

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(4);
    expect(variables[0].name).toBe('arguments');
    expect(variables[1].name).toBe('a');
    expect(variables[2].name).toBe('b');
    expect(variables[3].name).toBe('c');
    expect(scope.references).toHaveLength(6);
    expect(scope.references[0].identifier.name).toBe('a');
    expect(scope.references[0].isWrite()).toBe(true);
    expect(scope.references[0].resolved).toBe(variables[1]);
    expect(scope.references[1].identifier.name).toBe('b');
    expect(scope.references[1].isWrite()).toBe(true);
    expect(scope.references[1].resolved).toBe(variables[2]);
    expect(scope.references[2].identifier.name).toBe('c');
    expect(scope.references[2].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[2].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[2].writeExpr.name).toBe('d');
    expect(scope.references[2].resolved).toBe(variables[3]);
    expect(scope.references[3].identifier.name).toBe('c');
    expect(scope.references[3].isWrite()).toBe(true);
    assert.isNodeOfType(
      scope.references[3].writeExpr,
      AST_NODE_TYPES.Identifier,
    );
    expect(scope.references[3].writeExpr.name).toBe('array');
    expect(scope.references[3].resolved).toBe(variables[3]);
    expect(scope.references[4].identifier.name).toBe('d');
    expect(scope.references[4].isWrite()).toBe(false);
    expect(scope.references[5].identifier.name).toBe('array');
    expect(scope.references[5].isWrite()).toBe(false);
  });

  it('Pattern with default values in var in ForInStatement (separate declarations and with MemberExpression)', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        var obj;
        for ([obj.a, obj.b, obj.c = d] in array);
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(2);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe('d');
    expect(scope['implicit'].leftToBeResolved[1].identifier.name).toBe('array');

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(2);
    expect(variables[0].name).toBe('arguments');
    expect(variables[1].name).toBe('obj');
    expect(scope.references).toHaveLength(5);
    expect(scope.references[0].identifier.name).toBe('obj'); // obj.a
    expect(scope.references[0].isWrite()).toBe(false);
    expect(scope.references[0].isRead()).toBe(true);
    expect(scope.references[0].resolved).toBe(variables[1]);
    expect(scope.references[1].identifier.name).toBe('obj'); // obj.b
    expect(scope.references[1].isWrite()).toBe(false);
    expect(scope.references[1].isRead()).toBe(true);
    expect(scope.references[1].resolved).toBe(variables[1]);
    expect(scope.references[2].identifier.name).toBe('obj'); // obj.c
    expect(scope.references[2].isWrite()).toBe(false);
    expect(scope.references[2].isRead()).toBe(true);
    expect(scope.references[2].resolved).toBe(variables[1]);
    expect(scope.references[3].identifier.name).toBe('d');
    expect(scope.references[3].isWrite()).toBe(false);
    expect(scope.references[3].isRead()).toBe(true);
    expect(scope.references[4].identifier.name).toBe('array');
    expect(scope.references[4].isWrite()).toBe(false);
    expect(scope.references[4].isRead()).toBe(true);
  });

  it('ArrayPattern in var', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        var [a, b, c] = array;
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(1);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe('array');

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(4);
    expect(variables[0].name).toBe('arguments');
    expect(variables[1].name).toBe('a');
    expect(variables[2].name).toBe('b');
    expect(variables[3].name).toBe('c');
    expect(scope.references).toHaveLength(4);
    expect(scope.references[0].identifier.name).toBe('a');
    expect(scope.references[0].isWrite()).toBe(true);
    expect(scope.references[0].resolved).toBe(variables[1]);
    expect(scope.references[1].identifier.name).toBe('b');
    expect(scope.references[1].isWrite()).toBe(true);
    expect(scope.references[1].resolved).toBe(variables[2]);
    expect(scope.references[2].identifier.name).toBe('c');
    expect(scope.references[2].isWrite()).toBe(true);
    expect(scope.references[2].resolved).toBe(variables[3]);
    expect(scope.references[3].identifier.name).toBe('array');
    expect(scope.references[3].isWrite()).toBe(false);
  });

  it('SpreadElement in var', () => {
    let { scopeManager } = parseAndAnalyze(`
      (function () {
        var [a, b, ...rest] = array;
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(1);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe('array');

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(4);
    expect(variables[0].name).toBe('arguments');
    expect(variables[1].name).toBe('a');
    expect(variables[2].name).toBe('b');
    expect(variables[3].name).toBe('rest');
    expect(scope.references).toHaveLength(4);
    expect(scope.references[0].identifier.name).toBe('a');
    expect(scope.references[0].isWrite()).toBe(true);
    expect(scope.references[0].resolved).toBe(variables[1]);
    expect(scope.references[1].identifier.name).toBe('b');
    expect(scope.references[1].isWrite()).toBe(true);
    expect(scope.references[1].resolved).toBe(variables[2]);
    expect(scope.references[2].identifier.name).toBe('rest');
    expect(scope.references[2].isWrite()).toBe(true);
    expect(scope.references[2].resolved).toBe(variables[3]);
    expect(scope.references[3].identifier.name).toBe('array');
    expect(scope.references[3].isWrite()).toBe(false);

    ({ scopeManager } = parseAndAnalyze(`
      (function () {
        var [a, b, ...[c, d, ...rest]] = array;
      }());
    `));

    expect(scopeManager.scopes).toHaveLength(2);

    scope = scopeManager.scopes[0];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(1);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe('array');

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);

    expect(variables).toHaveLength(6);
    const expectedVariableNames = ['arguments', 'a', 'b', 'c', 'd', 'rest'];

    for (let index = 0; index < expectedVariableNames.length; index++) {
      expect(variables[index].name).toBe(expectedVariableNames[index]);
    }

    expect(scope.references).toHaveLength(6);
    const expectedReferenceNames = ['a', 'b', 'c', 'd', 'rest'];

    for (let index = 0; index < expectedReferenceNames.length; index++) {
      expect(scope.references[index].identifier.name).toBe(
        expectedReferenceNames[index],
      );
      expect(scope.references[index].isWrite()).toBe(true);
    }
    expect(scope.references[5].identifier.name).toBe('array');
    expect(scope.references[5].isWrite()).toBe(false);
  });

  it('ObjectPattern in var', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        var {
          shorthand,
          key: value,
          hello: {
            world
          }
        } = object;
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(1);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe(
      'object',
    );

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(4);
    expect(variables[0].name).toBe('arguments');
    expect(variables[1].name).toBe('shorthand');
    expect(variables[2].name).toBe('value');
    expect(variables[3].name).toBe('world');
    expect(scope.references).toHaveLength(4);
    expect(scope.references[0].identifier.name).toBe('shorthand');
    expect(scope.references[0].isWrite()).toBe(true);
    expect(scope.references[0].resolved).toBe(variables[1]);
    expect(scope.references[1].identifier.name).toBe('value');
    expect(scope.references[1].isWrite()).toBe(true);
    expect(scope.references[1].resolved).toBe(variables[2]);
    expect(scope.references[2].identifier.name).toBe('world');
    expect(scope.references[2].isWrite()).toBe(true);
    expect(scope.references[2].resolved).toBe(variables[3]);
    expect(scope.references[3].identifier.name).toBe('object');
    expect(scope.references[3].isWrite()).toBe(false);
  });

  it('complex pattern in var', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        var {
          shorthand,
          key: [ a, b, c, d, e ],
          hello: {
            world
          }
        } = object;
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(1);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe(
      'object',
    );

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(8);
    const expectedVariableNames = [
      'arguments',
      'shorthand',
      'a',
      'b',
      'c',
      'd',
      'e',
      'world',
    ];

    for (let index = 0; index < expectedVariableNames.length; index++) {
      expect(variables[index].name).toBe(expectedVariableNames[index]);
    }
    expect(scope.references).toHaveLength(8);
    const expectedReferenceNames = [
      'shorthand',
      'a',
      'b',
      'c',
      'd',
      'e',
      'world',
    ];

    for (let index = 0; index < expectedReferenceNames.length; index++) {
      expect(scope.references[index].identifier.name).toBe(
        expectedReferenceNames[index],
      );
      expect(scope.references[index].isWrite()).toBe(true);
    }
    expect(scope.references[7].identifier.name).toBe('object');
    expect(scope.references[7].isWrite()).toBe(false);
  });

  it('ArrayPattern in AssignmentExpression', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        [a, b, c] = array;
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(4);
    expect(
      scope['implicit'].leftToBeResolved.map(
        (left: Reference) => left.identifier.name,
      ),
    ).toStrictEqual(['a', 'b', 'c', 'array']);

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(1);
    expect(variables[0].name).toBe('arguments');
    expect(scope.references).toHaveLength(4);
    expect(scope.references[0].identifier.name).toBe('a');
    expect(scope.references[0].isWrite()).toBe(true);

    assert.isNull(scope.references[0].resolved);

    expect(scope.references[1].identifier.name).toBe('b');
    expect(scope.references[1].isWrite()).toBe(true);

    assert.isNull(scope.references[1].resolved);

    expect(scope.references[2].identifier.name).toBe('c');
    expect(scope.references[2].isWrite()).toBe(true);

    assert.isNull(scope.references[2].resolved);

    expect(scope.references[3].identifier.name).toBe('array');
    expect(scope.references[3].isWrite()).toBe(false);
  });

  it('ArrayPattern with MemberExpression in AssignmentExpression', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        var obj;
        [obj.a, obj.b, obj.c] = array;
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(1);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe('array');

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(2);
    expect(variables[0].name).toBe('arguments');
    expect(variables[1].name).toBe('obj');
    expect(scope.references).toHaveLength(4);
    expect(scope.references[0].identifier.name).toBe('obj');
    expect(scope.references[0].isWrite()).toBe(false);
    expect(scope.references[0].isRead()).toBe(true);
    expect(scope.references[0].resolved).toBe(variables[1]);
    expect(scope.references[1].identifier.name).toBe('obj');
    expect(scope.references[1].isWrite()).toBe(false);
    expect(scope.references[1].isRead()).toBe(true);
    expect(scope.references[1].resolved).toBe(variables[1]);
    expect(scope.references[2].identifier.name).toBe('obj');
    expect(scope.references[2].isWrite()).toBe(false);
    expect(scope.references[2].isRead()).toBe(true);
    expect(scope.references[2].resolved).toBe(variables[1]);
    expect(scope.references[3].identifier.name).toBe('array');
    expect(scope.references[3].isWrite()).toBe(false);
    expect(scope.references[3].isRead()).toBe(true);
  });

  it('SpreadElement in AssignmentExpression', () => {
    let { scopeManager } = parseAndAnalyze(`
      (function () {
        [a, b, ...rest] = array;
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(4);
    expect(
      scope['implicit'].leftToBeResolved.map(
        (left: Reference) => left.identifier.name,
      ),
    ).toStrictEqual(['a', 'b', 'rest', 'array']);

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(1);
    expect(variables[0].name).toBe('arguments');
    expect(scope.references).toHaveLength(4);
    expect(scope.references[0].identifier.name).toBe('a');
    expect(scope.references[0].isWrite()).toBe(true);

    assert.isNull(scope.references[0].resolved);

    expect(scope.references[1].identifier.name).toBe('b');
    expect(scope.references[1].isWrite()).toBe(true);

    assert.isNull(scope.references[1].resolved);

    expect(scope.references[2].identifier.name).toBe('rest');
    expect(scope.references[2].isWrite()).toBe(true);

    assert.isNull(scope.references[2].resolved);

    expect(scope.references[3].identifier.name).toBe('array');
    expect(scope.references[3].isWrite()).toBe(false);

    ({ scopeManager } = parseAndAnalyze(`
      (function () {
        [a, b, ...[c, d, ...rest]] = array;
      }());
    `));

    expect(scopeManager.scopes).toHaveLength(2);

    scope = scopeManager.scopes[0];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(6);
    expect(
      scope['implicit'].leftToBeResolved.map(
        (left: Reference) => left.identifier.name,
      ),
    ).toStrictEqual(['a', 'b', 'c', 'd', 'rest', 'array']);

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);

    expect(variables).toHaveLength(1);
    expect(variables[0].name).toBe('arguments');

    expect(scope.references).toHaveLength(6);
    const expectedReferenceNames = ['a', 'b', 'c', 'd', 'rest'];

    for (let index = 0; index < expectedReferenceNames.length; index++) {
      expect(scope.references[index].identifier.name).toBe(
        expectedReferenceNames[index],
      );
      expect(scope.references[index].isWrite()).toBe(true);

      assert.isNull(scope.references[index].resolved);
    }
    expect(scope.references[5].identifier.name).toBe('array');
    expect(scope.references[5].isWrite()).toBe(false);
  });

  it('SpreadElement with MemberExpression in AssignmentExpression', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        [a, b, ...obj.rest] = array;
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(4);
    expect(
      scope['implicit'].leftToBeResolved.map(
        (left: Reference) => left.identifier.name,
      ),
    ).toStrictEqual(['a', 'b', 'obj', 'array']);

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(1);
    expect(variables[0].name).toBe('arguments');
    expect(scope.references).toHaveLength(4);
    expect(scope.references[0].identifier.name).toBe('a');
    expect(scope.references[0].isWrite()).toBe(true);

    assert.isNull(scope.references[0].resolved);

    expect(scope.references[1].identifier.name).toBe('b');
    expect(scope.references[1].isWrite()).toBe(true);

    assert.isNull(scope.references[1].resolved);

    expect(scope.references[2].identifier.name).toBe('obj');
    expect(scope.references[2].isWrite()).toBe(false);
    expect(scope.references[3].identifier.name).toBe('array');
    expect(scope.references[3].isWrite()).toBe(false);
  });

  it('ObjectPattern in AssignmentExpression', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        ({
          shorthand,
          key: value,
          hello: {
            world
          }
        } = object);
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(4);
    expect(
      scope['implicit'].leftToBeResolved.map(
        (left: Reference) => left.identifier.name,
      ),
    ).toStrictEqual(['shorthand', 'value', 'world', 'object']);

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(1);
    expect(variables[0].name).toBe('arguments');
    expect(scope.references).toHaveLength(4);
    expect(scope.references[0].identifier.name).toBe('shorthand');
    expect(scope.references[0].isWrite()).toBe(true);

    assert.isNull(scope.references[0].resolved);

    expect(scope.references[1].identifier.name).toBe('value');
    expect(scope.references[1].isWrite()).toBe(true);

    assert.isNull(scope.references[1].resolved);

    expect(scope.references[2].identifier.name).toBe('world');
    expect(scope.references[2].isWrite()).toBe(true);

    assert.isNull(scope.references[2].resolved);

    expect(scope.references[3].identifier.name).toBe('object');
    expect(scope.references[3].isWrite()).toBe(false);
  });

  it('complex pattern in AssignmentExpression', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        ({
          shorthand,
          key: [ a, b, c, d, e ],
          hello: {
            world
          }
        } = object);
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);
    expect(scope['implicit'].leftToBeResolved).toHaveLength(8);
    expect(
      scope['implicit'].leftToBeResolved.map(
        (left: Reference) => left.identifier.name,
      ),
    ).toStrictEqual(['shorthand', 'a', 'b', 'c', 'd', 'e', 'world', 'object']);

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(1);
    expect(variables[0].name).toBe('arguments');
    expect(scope.references).toHaveLength(8);
    const expectedReferenceNames = [
      'shorthand',
      'a',
      'b',
      'c',
      'd',
      'e',
      'world',
    ];

    for (let index = 0; index < expectedReferenceNames.length; index++) {
      expect(scope.references[index].identifier.name).toBe(
        expectedReferenceNames[index],
      );
      expect(scope.references[index].isWrite()).toBe(true);
    }
    expect(scope.references[7].identifier.name).toBe('object');
    expect(scope.references[7].isWrite()).toBe(false);
  });

  it('ArrayPattern in parameters', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function ([a, b, c]) {
      }(array));
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(1);
    expect(scope.references[0].identifier.name).toBe('array');
    expect(scope['implicit'].leftToBeResolved).toHaveLength(1);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe('array');

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(4);
    expect(variables[0].name).toBe('arguments');
    expect(variables[1].name).toBe('a');
    expect(variables[2].name).toBe('b');
    expect(variables[3].name).toBe('c');
    expect(scope.references).toHaveLength(0);
  });

  it('SpreadElement in parameters', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function ([a, b, ...rest], ...rest2) {
      }(array));
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(1);
    expect(scope.references[0].identifier.name).toBe('array');
    expect(scope['implicit'].leftToBeResolved).toHaveLength(1);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe('array');

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(5);
    expect(variables[0].name).toBe('arguments');
    expect(variables[1].name).toBe('a');
    expect(variables[2].name).toBe('b');
    expect(variables[3].name).toBe('rest');
    assert.isDefinitionOfType(variables[3].defs[0], DefinitionType.Parameter);
    expect(variables[3].defs[0].rest).toBe(true);
    expect(variables[4].name).toBe('rest2');
    assert.isDefinitionOfType(variables[4].defs[0], DefinitionType.Parameter);
    expect(variables[4].defs[0].rest).toBe(true);
    expect(scope.references).toHaveLength(0);
  });

  it('ObjectPattern in parameters', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function ({
        shorthand,
        key: value,
        hello: {
          world
        }
      }) { } (object));
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(1);
    expect(scope.references[0].identifier.name).toBe('object');
    expect(scope['implicit'].leftToBeResolved).toHaveLength(1);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe(
      'object',
    );

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(4);
    expect(variables[0].name).toBe('arguments');
    expect(variables[1].name).toBe('shorthand');
    expect(variables[2].name).toBe('value');
    expect(variables[3].name).toBe('world');
    expect(scope.references).toHaveLength(0);
  });

  it('complex pattern in parameters', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function ({
        shorthand,
        key: [ a, b, c, d, e ],
        hello: {
          world
        }
      }) { } (object));
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(1);
    expect(scope.references[0].identifier.name).toBe('object');
    expect(scope['implicit'].leftToBeResolved).toHaveLength(1);
    expect(scope['implicit'].leftToBeResolved[0].identifier.name).toBe(
      'object',
    );

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(8);
    const expectedVariableNames = [
      'arguments',
      'shorthand',
      'a',
      'b',
      'c',
      'd',
      'e',
      'world',
    ];

    for (let index = 0; index < expectedVariableNames.length; index++) {
      expect(variables[index].name).toBe(expectedVariableNames[index]);
    }
    expect(scope.references).toHaveLength(0);
  });

  it('default values and patterns in var', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        var [a, b, c, d = 20 ] = array;
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(5);
    const expectedVariableNames = ['arguments', 'a', 'b', 'c', 'd'];

    for (let index = 0; index < expectedVariableNames.length; index++) {
      expect(variables[index].name).toBe(expectedVariableNames[index]);
    }
    expect(scope.references).toHaveLength(6);
    const expectedReferenceNames = [
      'a',
      'b',
      'c',
      'd', // assign 20
      'd', // assign array
      'array',
    ];

    for (let index = 0; index < expectedReferenceNames.length; index++) {
      expect(scope.references[index].identifier.name).toBe(
        expectedReferenceNames[index],
      );
    }
  });

  it('default values containing references and patterns in var', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        var [a, b, c, d = e ] = array;
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(5);
    const expectedVariableNames = ['arguments', 'a', 'b', 'c', 'd'];

    for (let index = 0; index < expectedVariableNames.length; index++) {
      expect(variables[index].name).toBe(expectedVariableNames[index]);
    }
    expect(scope.references).toHaveLength(7);
    const expectedReferenceNames = [
      'a', // assign array
      'b', // assign array
      'c', // assign array
      'd', // assign e
      'd', // assign array
      'e',
      'array',
    ];

    for (let index = 0; index < expectedReferenceNames.length; index++) {
      expect(scope.references[index].identifier.name).toBe(
        expectedReferenceNames[index],
      );
    }
  });

  it('nested default values containing references and patterns in var', () => {
    const { scopeManager } = parseAndAnalyze(`
      (function () {
        var [a, b, [c, d = e] = f ] = array;
      }());
    `);

    expect(scopeManager.scopes).toHaveLength(2);

    let scope = scopeManager.scopes[0];
    let variables = getRealVariables(scope.variables);

    assert.isScopeOfType(scope, ScopeType.global);
    expect(variables).toHaveLength(0);
    expect(scope.references).toHaveLength(0);

    scope = scopeManager.scopes[1];
    variables = getRealVariables(scope.variables);
    assert.isScopeOfType(scope, ScopeType.function);
    expect(variables).toHaveLength(5);
    const expectedVariableNames = ['arguments', 'a', 'b', 'c', 'd'];

    for (let index = 0; index < expectedVariableNames.length; index++) {
      expect(variables[index].name).toBe(expectedVariableNames[index]);
    }
    expect(scope.references).toHaveLength(10);
    const expectedReferenceNames = [
      'a', // assign array
      'b', // assign array
      'c', // assign f
      'c', // assign array
      'd', // assign f
      'd', // assign e
      'd', // assign array
      'e',
      'f',
      'array',
    ];

    for (let index = 0; index < expectedReferenceNames.length; index++) {
      expect(scope.references[index].identifier.name).toBe(
        expectedReferenceNames[index],
      );
    }
  });
});
