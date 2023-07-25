import type { TextEncoderInternal } from '@sentry/types';
import type { NetworkBody, NetworkRequestData, ReplayNetworkRequestData, ReplayNetworkRequestOrResponse, ReplayPerformanceEntry } from '../../types';
/** Get the size of a body. */
export declare function getBodySize(body: RequestInit['body'], textEncoder: TextEncoder | TextEncoderInternal): number | undefined;
/** Convert a Content-Length header to number/undefined.  */
export declare function parseContentLengthHeader(header: string | null | undefined): number | undefined;
/** Get the string representation of a body. */
export declare function getBodyString(body: unknown): string | undefined;
/** Convert ReplayNetworkRequestData to a PerformanceEntry. */
export declare function makeNetworkReplayBreadcrumb(type: string, data: ReplayNetworkRequestData | null): ReplayPerformanceEntry<NetworkRequestData> | null;
/** Get either a JSON network body, or a text representation. */
export declare function getNetworkBody(bodyText: string | undefined): NetworkBody | undefined;
/** Build the request or response part of a replay network breadcrumb that was skipped. */
export declare function buildSkippedNetworkRequestOrResponse(bodySize: number | undefined): ReplayNetworkRequestOrResponse;
/** Build the request or response part of a replay network breadcrumb. */
export declare function buildNetworkRequestOrResponse(headers: Record<string, string>, bodySize: number | undefined, body: string | undefined): ReplayNetworkRequestOrResponse | undefined;
/** Filter a set of headers */
export declare function getAllowedHeaders(headers: Record<string, string>, allowedHeaders: string[]): Record<string, string>;
/** Match an URL against a list of strings/Regex. */
export declare function urlMatches(url: string, urls: (string | RegExp)[]): boolean;
/** exported for tests */
export declare function getFullUrl(url: string, baseURI?: string): string;
//# sourceMappingURL=networkUtils.d.ts.map