import type { Transaction } from '@sentry/types';
/**
 * Safety wrapper for startTransaction for the unlikely case that transaction starts before tracing is imported -
 * if that happens we want to avoid throwing an error from profiling code.
 * see https://github.com/getsentry/sentry-javascript/issues/4731.
 *
 * @experimental
 */
export declare function onProfilingStartRouteTransaction(transaction: Transaction | undefined): Transaction | undefined;
/**
 * Patches startTransaction and stopTransaction with profiling logic.
 */
export declare function addProfilingExtensionMethods(): void;
//# sourceMappingURL=hubextensions.d.ts.map