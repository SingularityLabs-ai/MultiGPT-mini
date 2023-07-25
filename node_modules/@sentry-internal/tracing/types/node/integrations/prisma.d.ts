import type { Hub } from '@sentry/core';
import type { EventProcessor, Integration } from '@sentry/types';
/** Tracing integration for @prisma/client package */
export declare class Prisma implements Integration {
    /**
     * @inheritDoc
     */
    static id: string;
    /**
     * @inheritDoc
     */
    name: string;
    /**
     * Prisma ORM Client Instance
     */
    private readonly _client?;
    /**
     * @inheritDoc
     */
    constructor(options?: {
        client?: unknown;
    });
    /**
     * @inheritDoc
     */
    setupOnce(_: (callback: EventProcessor) => void, getCurrentHub: () => Hub): void;
}
//# sourceMappingURL=prisma.d.ts.map