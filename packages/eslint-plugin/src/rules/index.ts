import type { Linter } from '@typescript-eslint/utils/ts-eslint';

import adjacentOverloadSignatures from './adjacent-overload-signatures';
import arrayType from './array-type';
import awaitThenable from './await-thenable';
import banTsComment from './ban-ts-comment';
import banTslintComment from './ban-tslint-comment';
import classLiteralPropertyStyle from './class-literal-property-style';
import classMethodsUseThis from './class-methods-use-this';
import consistentGenericConstructors from './consistent-generic-constructors';
import consistentIndexedObjectStyle from './consistent-indexed-object-style';
import consistentReturn from './consistent-return';
import consistentTypeAssertions from './consistent-type-assertions';
import consistentTypeDefinitions from './consistent-type-definitions';
import consistentTypeExports from './consistent-type-exports';
import consistentTypeImports from './consistent-type-imports';
import defaultParamLast from './default-param-last';
import dotNotation from './dot-notation';
import explicitFunctionReturnType from './explicit-function-return-type';
import explicitMemberAccessibility from './explicit-member-accessibility';
import explicitModuleBoundaryTypes from './explicit-module-boundary-types';
import initDeclarations from './init-declarations';
import maxParams from './max-params';
import memberOrdering from './member-ordering';
import methodSignatureStyle from './method-signature-style';
import namingConvention from './naming-convention';
import noArrayConstructor from './no-array-constructor';
import noArrayDelete from './no-array-delete';
import noBaseToString from './no-base-to-string';
import confusingNonNullAssertionLikeNotEqual from './no-confusing-non-null-assertion';
import noConfusingVoidExpression from './no-confusing-void-expression';
import noDeprecated from './no-deprecated';
import noDupeClassMembers from './no-dupe-class-members';
import noDuplicateEnumValues from './no-duplicate-enum-values';
import noDuplicateTypeConstituents from './no-duplicate-type-constituents';
import noDynamicDelete from './no-dynamic-delete';
import noEmptyFunction from './no-empty-function';
import noEmptyInterface from './no-empty-interface';
import noEmptyObjectType from './no-empty-object-type';
import noExplicitAny from './no-explicit-any';
import noExtraNonNullAssertion from './no-extra-non-null-assertion';
import noExtraneousClass from './no-extraneous-class';
import noFloatingPromises from './no-floating-promises';
import noForInArray from './no-for-in-array';
import noImpliedEval from './no-implied-eval';
import noImportTypeSideEffects from './no-import-type-side-effects';
import noInferrableTypes from './no-inferrable-types';
import noInvalidThis from './no-invalid-this';
import noInvalidVoidType from './no-invalid-void-type';
import noLoopFunc from './no-loop-func';
import noLossOfPrecision from './no-loss-of-precision';
import noMagicNumbers from './no-magic-numbers';
import noMeaninglessVoidOperator from './no-meaningless-void-operator';
import noMisusedNew from './no-misused-new';
import noMisusedPromises from './no-misused-promises';
import noMisusedSpread from './no-misused-spread';
import noMixedEnums from './no-mixed-enums';
import noNamespace from './no-namespace';
import noNonNullAssertedNullishCoalescing from './no-non-null-asserted-nullish-coalescing';
import noNonNullAssertedOptionalChain from './no-non-null-asserted-optional-chain';
import noNonNullAssertion from './no-non-null-assertion';
import noRedeclare from './no-redeclare';
import noRedundantTypeConstituents from './no-redundant-type-constituents';
import noRequireImports from './no-require-imports';
import noRestrictedImports from './no-restricted-imports';
import noRestrictedTypes from './no-restricted-types';
import noShadow from './no-shadow';
import noThisAlias from './no-this-alias';
import noTypeAlias from './no-type-alias';
import noUnnecessaryBooleanLiteralCompare from './no-unnecessary-boolean-literal-compare';
import noUnnecessaryCondition from './no-unnecessary-condition';
import noUnnecessaryParameterPropertyAssignment from './no-unnecessary-parameter-property-assignment';
import noUnnecessaryQualifier from './no-unnecessary-qualifier';
import noUnnecessaryTemplateExpression from './no-unnecessary-template-expression';
import noUnnecessaryTypeArguments from './no-unnecessary-type-arguments';
import noUnnecessaryTypeAssertion from './no-unnecessary-type-assertion';
import noUnnecessaryTypeConstraint from './no-unnecessary-type-constraint';
import noUnnecessaryTypeConversion from './no-unnecessary-type-conversion';
import noUnnecessaryTypeParameters from './no-unnecessary-type-parameters';
import noUnsafeArgument from './no-unsafe-argument';
import noUnsafeAssignment from './no-unsafe-assignment';
import noUnsafeCall from './no-unsafe-call';
import noUnsafeDeclarationMerging from './no-unsafe-declaration-merging';
import noUnsafeEnumComparison from './no-unsafe-enum-comparison';
import noUnsafeFunctionType from './no-unsafe-function-type';
import noUnsafeMemberAccess from './no-unsafe-member-access';
import noUnsafeReturn from './no-unsafe-return';
import noUnsafeTypeAssertion from './no-unsafe-type-assertion';
import noUnsafeUnaryMinus from './no-unsafe-unary-minus';
import noUnusedExpressions from './no-unused-expressions';
import noUnusedVars from './no-unused-vars';
import noUseBeforeDefine from './no-use-before-define';
import noUselessConstructor from './no-useless-constructor';
import noUselessEmptyExport from './no-useless-empty-export';
import noVarRequires from './no-var-requires';
import noWrapperObjectTypes from './no-wrapper-object-types';
import nonNullableTypeAssertionStyle from './non-nullable-type-assertion-style';
import onlyThrowError from './only-throw-error';
import parameterProperties from './parameter-properties';
import preferAsConst from './prefer-as-const';
import preferDestructuring from './prefer-destructuring';
import preferEnumInitializers from './prefer-enum-initializers';
import preferFind from './prefer-find';
import preferForOf from './prefer-for-of';
import preferFunctionType from './prefer-function-type';
import preferIncludes from './prefer-includes';
import preferLiteralEnumMember from './prefer-literal-enum-member';
import preferNamespaceKeyword from './prefer-namespace-keyword';
import preferNullishCoalescing from './prefer-nullish-coalescing';
import preferOptionalChain from './prefer-optional-chain';
import preferPromiseRejectErrors from './prefer-promise-reject-errors';
import preferReadonly from './prefer-readonly';
import preferReadonlyParameterTypes from './prefer-readonly-parameter-types';
import preferReduceTypeParameter from './prefer-reduce-type-parameter';
import preferRegexpExec from './prefer-regexp-exec';
import preferReturnThisType from './prefer-return-this-type';
import preferStringStartsEndsWith from './prefer-string-starts-ends-with';
import preferTsExpectError from './prefer-ts-expect-error';
import promiseFunctionAsync from './promise-function-async';
import relatedGetterSetterPairs from './related-getter-setter-pairs';
import requireArraySortCompare from './require-array-sort-compare';
import requireAwait from './require-await';
import restrictPlusOperands from './restrict-plus-operands';
import restrictTemplateExpressions from './restrict-template-expressions';
import returnAwait from './return-await';
import sortTypeConstituents from './sort-type-constituents';
import strictBooleanExpressions from './strict-boolean-expressions';
import switchExhaustivenessCheck from './switch-exhaustiveness-check';
import tripleSlashReference from './triple-slash-reference';
import typedef from './typedef';
import unboundMethod from './unbound-method';
import unifiedSignatures from './unified-signatures';
import useUnknownInCatchCallbackVariable from './use-unknown-in-catch-callback-variable';

const rules = {
  'adjacent-overload-signatures': adjacentOverloadSignatures,
  'array-type': arrayType,
  'await-thenable': awaitThenable,
  'ban-ts-comment': banTsComment,
  'ban-tslint-comment': banTslintComment,
  'class-literal-property-style': classLiteralPropertyStyle,
  'class-methods-use-this': classMethodsUseThis,
  'consistent-generic-constructors': consistentGenericConstructors,
  'consistent-indexed-object-style': consistentIndexedObjectStyle,
  'consistent-return': consistentReturn,
  'consistent-type-assertions': consistentTypeAssertions,
  'consistent-type-definitions': consistentTypeDefinitions,
  'consistent-type-exports': consistentTypeExports,
  'consistent-type-imports': consistentTypeImports,
  'default-param-last': defaultParamLast,
  'dot-notation': dotNotation,
  'explicit-function-return-type': explicitFunctionReturnType,
  'explicit-member-accessibility': explicitMemberAccessibility,
  'explicit-module-boundary-types': explicitModuleBoundaryTypes,
  'init-declarations': initDeclarations,
  'max-params': maxParams,
  'member-ordering': memberOrdering,
  'method-signature-style': methodSignatureStyle,
  'naming-convention': namingConvention,
  'no-array-constructor': noArrayConstructor,
  'no-array-delete': noArrayDelete,
  'no-base-to-string': noBaseToString,
  'no-confusing-non-null-assertion': confusingNonNullAssertionLikeNotEqual,
  'no-confusing-void-expression': noConfusingVoidExpression,
  'no-deprecated': noDeprecated,
  'no-dupe-class-members': noDupeClassMembers,
  'no-duplicate-enum-values': noDuplicateEnumValues,
  'no-duplicate-type-constituents': noDuplicateTypeConstituents,
  'no-dynamic-delete': noDynamicDelete,
  'no-empty-function': noEmptyFunction,
  'no-empty-interface': noEmptyInterface,
  'no-empty-object-type': noEmptyObjectType,
  'no-explicit-any': noExplicitAny,
  'no-extra-non-null-assertion': noExtraNonNullAssertion,
  'no-extraneous-class': noExtraneousClass,
  'no-floating-promises': noFloatingPromises,
  'no-for-in-array': noForInArray,
  'no-implied-eval': noImpliedEval,
  'no-import-type-side-effects': noImportTypeSideEffects,
  'no-inferrable-types': noInferrableTypes,
  'no-invalid-this': noInvalidThis,
  'no-invalid-void-type': noInvalidVoidType,
  'no-loop-func': noLoopFunc,
  'no-loss-of-precision': noLossOfPrecision,
  'no-magic-numbers': noMagicNumbers,
  'no-meaningless-void-operator': noMeaninglessVoidOperator,
  'no-misused-new': noMisusedNew,
  'no-misused-promises': noMisusedPromises,
  'no-misused-spread': noMisusedSpread,
  'no-mixed-enums': noMixedEnums,
  'no-namespace': noNamespace,
  'no-non-null-asserted-nullish-coalescing': noNonNullAssertedNullishCoalescing,
  'no-non-null-asserted-optional-chain': noNonNullAssertedOptionalChain,
  'no-non-null-assertion': noNonNullAssertion,
  'no-redeclare': noRedeclare,
  'no-redundant-type-constituents': noRedundantTypeConstituents,
  'no-require-imports': noRequireImports,
  'no-restricted-imports': noRestrictedImports,
  'no-restricted-types': noRestrictedTypes,
  'no-shadow': noShadow,
  'no-this-alias': noThisAlias,
  'no-type-alias': noTypeAlias,
  'no-unnecessary-boolean-literal-compare': noUnnecessaryBooleanLiteralCompare,
  'no-unnecessary-condition': noUnnecessaryCondition,
  'no-unnecessary-parameter-property-assignment':
    noUnnecessaryParameterPropertyAssignment,
  'no-unnecessary-qualifier': noUnnecessaryQualifier,
  'no-unnecessary-template-expression': noUnnecessaryTemplateExpression,
  'no-unnecessary-type-arguments': noUnnecessaryTypeArguments,
  'no-unnecessary-type-assertion': noUnnecessaryTypeAssertion,
  'no-unnecessary-type-constraint': noUnnecessaryTypeConstraint,
  'no-unnecessary-type-conversion': noUnnecessaryTypeConversion,
  'no-unnecessary-type-parameters': noUnnecessaryTypeParameters,
  'no-unsafe-argument': noUnsafeArgument,
  'no-unsafe-assignment': noUnsafeAssignment,
  'no-unsafe-call': noUnsafeCall,
  'no-unsafe-declaration-merging': noUnsafeDeclarationMerging,
  'no-unsafe-enum-comparison': noUnsafeEnumComparison,
  'no-unsafe-function-type': noUnsafeFunctionType,
  'no-unsafe-member-access': noUnsafeMemberAccess,
  'no-unsafe-return': noUnsafeReturn,
  'no-unsafe-type-assertion': noUnsafeTypeAssertion,
  'no-unsafe-unary-minus': noUnsafeUnaryMinus,
  'no-unused-expressions': noUnusedExpressions,
  'no-unused-vars': noUnusedVars,
  'no-use-before-define': noUseBeforeDefine,
  'no-useless-constructor': noUselessConstructor,
  'no-useless-empty-export': noUselessEmptyExport,
  'no-var-requires': noVarRequires,
  'no-wrapper-object-types': noWrapperObjectTypes,
  'non-nullable-type-assertion-style': nonNullableTypeAssertionStyle,
  'only-throw-error': onlyThrowError,
  'parameter-properties': parameterProperties,
  'prefer-as-const': preferAsConst,
  'prefer-destructuring': preferDestructuring,
  'prefer-enum-initializers': preferEnumInitializers,
  'prefer-find': preferFind,
  'prefer-for-of': preferForOf,
  'prefer-function-type': preferFunctionType,
  'prefer-includes': preferIncludes,
  'prefer-literal-enum-member': preferLiteralEnumMember,
  'prefer-namespace-keyword': preferNamespaceKeyword,
  'prefer-nullish-coalescing': preferNullishCoalescing,
  'prefer-optional-chain': preferOptionalChain,
  'prefer-promise-reject-errors': preferPromiseRejectErrors,
  'prefer-readonly': preferReadonly,
  'prefer-readonly-parameter-types': preferReadonlyParameterTypes,
  'prefer-reduce-type-parameter': preferReduceTypeParameter,
  'prefer-regexp-exec': preferRegexpExec,
  'prefer-return-this-type': preferReturnThisType,
  'prefer-string-starts-ends-with': preferStringStartsEndsWith,
  'prefer-ts-expect-error': preferTsExpectError,
  'promise-function-async': promiseFunctionAsync,
  'related-getter-setter-pairs': relatedGetterSetterPairs,
  'require-array-sort-compare': requireArraySortCompare,
  'require-await': requireAwait,
  'restrict-plus-operands': restrictPlusOperands,
  'restrict-template-expressions': restrictTemplateExpressions,
  'return-await': returnAwait,
  'sort-type-constituents': sortTypeConstituents,
  'strict-boolean-expressions': strictBooleanExpressions,
  'switch-exhaustiveness-check': switchExhaustivenessCheck,
  'triple-slash-reference': tripleSlashReference,
  typedef,
  'unbound-method': unboundMethod,
  'unified-signatures': unifiedSignatures,
  'use-unknown-in-catch-callback-variable': useUnknownInCatchCallbackVariable,
} satisfies Linter.PluginRules;

export = rules;
