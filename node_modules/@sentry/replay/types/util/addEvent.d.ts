import type { AddEventResult, RecordingEvent, ReplayContainer } from '../types';
/**
 * Add an event to the event buffer.
 * `isCheckout` is true if this is either the very first event, or an event triggered by `checkoutEveryNms`.
 */
export declare function addEvent(replay: ReplayContainer, event: RecordingEvent, isCheckout?: boolean): Promise<AddEventResult | null>;
//# sourceMappingURL=addEvent.d.ts.map