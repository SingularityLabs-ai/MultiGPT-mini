import type { Breadcrumb, TextEncoderInternal, XhrBreadcrumbData } from '@sentry/types';
import type { ReplayContainer, ReplayNetworkOptions, XhrHint } from '../../types';
/**
 * Capture an XHR breadcrumb to a replay.
 * This adds additional data (where approriate).
 */
export declare function captureXhrBreadcrumbToReplay(breadcrumb: Breadcrumb & {
    data: XhrBreadcrumbData;
}, hint: XhrHint, options: ReplayNetworkOptions & {
    replay: ReplayContainer;
}): Promise<void>;
/**
 * Enrich a breadcrumb with additional data.
 * This has to be sync & mutate the given breadcrumb,
 * as the breadcrumb is afterwards consumed by other handlers.
 */
export declare function enrichXhrBreadcrumb(breadcrumb: Breadcrumb & {
    data: XhrBreadcrumbData;
}, hint: XhrHint, options: {
    textEncoder: TextEncoderInternal;
}): void;
//# sourceMappingURL=xhrUtils.d.ts.map