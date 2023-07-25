import type { Event } from '@sentry/types';
/**
 * Creates a cache that evicts keys in fifo order
 * @param size {Number}
 */
export declare function makeProfilingCache<Key extends string, Value extends Event>(size: number): {
    get: (key: Key) => Value | undefined;
    add: (key: Key, value: Value) => void;
    delete: (key: Key) => boolean;
    clear: () => void;
    size: () => number;
};
export declare const PROFILING_EVENT_CACHE: {
    get: (key: string) => Event | undefined;
    add: (key: string, value: Event) => void;
    delete: (key: string) => boolean;
    clear: () => void;
    size: () => number;
};
//# sourceMappingURL=cache.d.ts.map