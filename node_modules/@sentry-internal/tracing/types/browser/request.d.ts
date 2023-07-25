import type { DynamicSamplingContext, Span } from '@sentry/types';
import { SENTRY_XHR_DATA_KEY } from '@sentry/utils';
export declare const DEFAULT_TRACE_PROPAGATION_TARGETS: (string | RegExp)[];
/** Options for Request Instrumentation */
export interface RequestInstrumentationOptions {
    /**
     * @deprecated Will be removed in v8.
     * Use `shouldCreateSpanForRequest` to control span creation and `tracePropagationTargets` to control
     * trace header attachment.
     */
    tracingOrigins: Array<string | RegExp>;
    /**
     * List of strings and/or regexes used to determine which outgoing requests will have `sentry-trace` and `baggage`
     * headers attached.
     *
     * Default: ['localhost', /^\//] {@see DEFAULT_TRACE_PROPAGATION_TARGETS}
     */
    tracePropagationTargets: Array<string | RegExp>;
    /**
     * Flag to disable patching all together for fetch requests.
     *
     * Default: true
     */
    traceFetch: boolean;
    /**
     * Flag to disable patching all together for xhr requests.
     *
     * Default: true
     */
    traceXHR: boolean;
    /**
     * This function will be called before creating a span for a request with the given url.
     * Return false if you don't want a span for the given url.
     *
     * Default: (url: string) => true
     */
    shouldCreateSpanForRequest?(this: void, url: string): boolean;
}
/** Data returned from fetch callback */
export interface FetchData {
    args: any[];
    fetchData?: {
        method: string;
        url: string;
        __span?: string;
    };
    response?: any;
    error?: unknown;
    startTimestamp: number;
    endTimestamp?: number;
}
/** Data returned from XHR request */
export interface XHRData {
    xhr?: {
        [SENTRY_XHR_DATA_KEY]?: {
            method: string;
            url: string;
            status_code: number;
            data: Record<string, any>;
        };
        __sentry_xhr_span_id__?: string;
        setRequestHeader?: (key: string, val: string) => void;
        getRequestHeader?: (key: string) => string;
        __sentry_own_request__?: boolean;
    };
    startTimestamp: number;
    endTimestamp?: number;
}
declare type PolymorphicRequestHeaders = Record<string, string | undefined> | Array<[string, string]> | {
    [key: string]: any;
    append: (key: string, value: string) => void;
    get: (key: string) => string | null | undefined;
};
export declare const defaultRequestInstrumentationOptions: RequestInstrumentationOptions;
/** Registers span creators for xhr and fetch requests  */
export declare function instrumentOutgoingRequests(_options?: Partial<RequestInstrumentationOptions>): void;
/**
 * A function that determines whether to attach tracing headers to a request.
 * This was extracted from `instrumentOutgoingRequests` to make it easier to test shouldAttachHeaders.
 * We only export this fuction for testing purposes.
 */
export declare function shouldAttachHeaders(url: string, tracePropagationTargets: (string | RegExp)[] | undefined): boolean;
/**
 * Create and track fetch request spans
 */
export declare function fetchCallback(handlerData: FetchData, shouldCreateSpan: (url: string) => boolean, shouldAttachHeaders: (url: string) => boolean, spans: Record<string, Span>): void;
/**
 * Adds sentry-trace and baggage headers to the various forms of fetch headers
 */
export declare function addTracingHeadersToFetchRequest(request: string | unknown, // unknown is actually type Request but we can't export DOM types from this package,
dynamicSamplingContext: Partial<DynamicSamplingContext>, span: Span, options: {
    headers?: {
        [key: string]: string[] | string | undefined;
    } | PolymorphicRequestHeaders;
}): PolymorphicRequestHeaders;
/**
 * Create and track xhr request spans
 */
export declare function xhrCallback(handlerData: XHRData, shouldCreateSpan: (url: string) => boolean, shouldAttachHeaders: (url: string) => boolean, spans: Record<string, Span>): void;
export {};
//# sourceMappingURL=request.d.ts.map