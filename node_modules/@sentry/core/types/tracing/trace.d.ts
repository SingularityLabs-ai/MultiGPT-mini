import type { TransactionContext } from '@sentry/types';
import type { Span } from './span';
/**
 * Wraps a function with a transaction/span and finishes the span after the function is done.
 *
 * Note that if you have not enabled tracing extensions via `addTracingExtensions`, this function
 * will not generate spans, and the `span` returned from the callback may be undefined.
 *
 * This function is meant to be used internally and may break at any time. Use at your own risk.
 *
 * @internal
 * @private
 */
export declare function trace<T>(context: TransactionContext, callback: (span?: Span) => T, onError?: (error: unknown) => void): T;
//# sourceMappingURL=trace.d.ts.map