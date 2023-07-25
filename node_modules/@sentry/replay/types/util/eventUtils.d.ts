import type { ErrorEvent, Event, ReplayEvent, TransactionEvent } from '@sentry/types';
/** If the event is an error event */
export declare function isErrorEvent(event: Event): event is ErrorEvent;
/** If the event is a transaction event */
export declare function isTransactionEvent(event: Event): event is TransactionEvent;
/** If the event is an replay event */
export declare function isReplayEvent(event: Event): event is ReplayEvent;
//# sourceMappingURL=eventUtils.d.ts.map