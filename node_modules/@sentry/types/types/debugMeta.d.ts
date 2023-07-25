/**
 * Holds meta information to customize the behavior of Sentry's server-side event processing.
 **/
export interface DebugMeta {
    images?: Array<DebugImage>;
}
export declare type DebugImage = WasmDebugImage | SourceMapDebugImage;
interface WasmDebugImage {
    type: 'wasm';
    debug_id: string;
    code_id?: string | null;
    code_file: string;
    debug_file?: string | null;
}
interface SourceMapDebugImage {
    type: 'sourcemap';
    code_file: string;
    debug_id: string;
}
export {};
//# sourceMappingURL=debugMeta.d.ts.map