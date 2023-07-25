import type { Hub } from '@sentry/core';
import type { EventProcessor } from '@sentry/types';
import type { LazyLoadedIntegration } from './lazy';
interface PgClient {
    prototype: {
        query: () => void | Promise<unknown>;
    };
}
interface PgOptions {
    usePgNative?: boolean;
}
declare type PGModule = {
    Client: PgClient;
    native: {
        Client: PgClient;
    };
};
/** Tracing integration for node-postgres package */
export declare class Postgres implements LazyLoadedIntegration<PGModule> {
    /**
     * @inheritDoc
     */
    static id: string;
    /**
     * @inheritDoc
     */
    name: string;
    private _usePgNative;
    private _module?;
    constructor(options?: PgOptions);
    /** @inheritdoc */
    loadDependency(): PGModule | undefined;
    /**
     * @inheritDoc
     */
    setupOnce(_: (callback: EventProcessor) => void, getCurrentHub: () => Hub): void;
}
export {};
//# sourceMappingURL=postgres.d.ts.map