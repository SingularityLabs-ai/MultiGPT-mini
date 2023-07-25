import type { ReplayContainer } from '../types';
interface HistoryHandlerData {
    from: string;
    to: string;
}
/**
 * Returns a listener to be added to `addInstrumentationHandler('history', listener)`.
 */
export declare function handleHistorySpanListener(replay: ReplayContainer): (handlerData: HistoryHandlerData) => void;
export {};
//# sourceMappingURL=handleHistory.d.ts.map