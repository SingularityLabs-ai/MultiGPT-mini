import type { Hub } from '@sentry/core';
import type { EventProcessor } from '@sentry/types';
import type { LazyLoadedIntegration } from './lazy';
interface MysqlConnection {
    createQuery: () => void;
}
/** Tracing integration for node-mysql package */
export declare class Mysql implements LazyLoadedIntegration<MysqlConnection> {
    /**
     * @inheritDoc
     */
    static id: string;
    /**
     * @inheritDoc
     */
    name: string;
    private _module?;
    /** @inheritdoc */
    loadDependency(): MysqlConnection | undefined;
    /**
     * @inheritDoc
     */
    setupOnce(_: (callback: EventProcessor) => void, getCurrentHub: () => Hub): void;
}
export {};
//# sourceMappingURL=mysql.d.ts.map