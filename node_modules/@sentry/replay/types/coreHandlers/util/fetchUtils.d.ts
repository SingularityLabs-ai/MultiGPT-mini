import type { Breadcrumb, FetchBreadcrumbData, TextEncoderInternal } from '@sentry/types';
import type { FetchHint, ReplayContainer, ReplayNetworkOptions } from '../../types';
/**
 * Capture a fetch breadcrumb to a replay.
 * This adds additional data (where approriate).
 */
export declare function captureFetchBreadcrumbToReplay(breadcrumb: Breadcrumb & {
    data: FetchBreadcrumbData;
}, hint: FetchHint, options: ReplayNetworkOptions & {
    textEncoder: TextEncoderInternal;
    replay: ReplayContainer;
}): Promise<void>;
/**
 * Enrich a breadcrumb with additional data.
 * This has to be sync & mutate the given breadcrumb,
 * as the breadcrumb is afterwards consumed by other handlers.
 */
export declare function enrichFetchBreadcrumb(breadcrumb: Breadcrumb & {
    data: FetchBreadcrumbData;
}, hint: FetchHint, options: {
    textEncoder: TextEncoderInternal;
}): void;
//# sourceMappingURL=fetchUtils.d.ts.map