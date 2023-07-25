import type { Transaction } from '@sentry/types';
import type { Hub } from '../hub';
/**
 * The `extractTraceparentData` function and `TRACEPARENT_REGEXP` constant used
 * to be declared in this file. It was later moved into `@sentry/utils` as part of a
 * move to remove `@sentry/tracing` dependencies from `@sentry/node` (`extractTraceparentData`
 * is the only tracing function used by `@sentry/node`).
 *
 * These exports are kept here for backwards compatability's sake.
 *
 * TODO(v7): Reorganize these exports
 *
 * See https://github.com/getsentry/sentry-javascript/issues/4642 for more details.
 */
export { TRACEPARENT_REGEXP, extractTraceparentData } from '@sentry/utils';
/** Grabs active transaction off scope, if any */
export declare function getActiveTransaction<T extends Transaction>(maybeHub?: Hub): T | undefined;
export { stripUrlQueryAndFragment } from '@sentry/utils';
//# sourceMappingURL=utils.d.ts.map