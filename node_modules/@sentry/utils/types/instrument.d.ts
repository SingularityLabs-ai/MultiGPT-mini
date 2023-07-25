export declare const SENTRY_XHR_DATA_KEY = "__sentry_xhr_v2__";
export declare type InstrumentHandlerType = 'console' | 'dom' | 'fetch' | 'history' | 'sentry' | 'xhr' | 'error' | 'unhandledrejection';
export declare type InstrumentHandlerCallback = (data: any) => void;
/**
 * Add handler that will be called when given type of instrumentation triggers.
 * Use at your own risk, this might break without changelog notice, only used internally.
 * @hidden
 */
export declare function addInstrumentationHandler(type: InstrumentHandlerType, callback: InstrumentHandlerCallback): void;
/**
 * Parses the fetch arguments to find the used Http method and the url of the request
 */
export declare function parseFetchArgs(fetchArgs: unknown[]): {
    method: string;
    url: string;
};
//# sourceMappingURL=instrument.d.ts.map