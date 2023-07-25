declare type XHRSendInput = unknown;
export interface SentryWrappedXMLHttpRequest {
    __sentry_xhr_v2__?: SentryXhrData;
    __sentry_own_request__?: boolean;
}
export interface SentryXhrData {
    method?: string;
    url?: string;
    status_code?: number;
    body?: XHRSendInput;
    request_body_size?: number;
    response_body_size?: number;
    request_headers: Record<string, string>;
}
export interface HandlerDataXhr {
    args: [string, string];
    xhr: SentryWrappedXMLHttpRequest;
    startTimestamp?: number;
    endTimestamp?: number;
}
interface SentryFetchData {
    method: string;
    url: string;
    request_body_size?: number;
    response_body_size?: number;
}
export interface HandlerDataFetch {
    args: any[];
    fetchData: SentryFetchData;
    startTimestamp: number;
    endTimestamp?: number;
    response?: unknown;
}
export {};
//# sourceMappingURL=instrument.d.ts.map