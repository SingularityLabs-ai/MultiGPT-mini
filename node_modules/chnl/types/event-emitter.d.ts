import Channel from './channel';
import {Listener} from './general';

type EventEmitterMethod = (event: string, callback: Listener, context?: any) => void;
type EventEmitterBooleanMethod = (event: string, callback: Listener, context?: any) => boolean;

export = EventEmitter;

declare class EventEmitter {
    constructor();
    addListener: EventEmitterMethod;
    addOnceListener: EventEmitterMethod;
    on: EventEmitterMethod;
    once: EventEmitterMethod;
    removeListener: EventEmitterMethod;
    off: EventEmitterMethod;
    hasListener: EventEmitterBooleanMethod;
    has: EventEmitterBooleanMethod;
    hasListeners(event: string): boolean;
    dispatch(event: string, ...args: any[]): void;
    emit(event: string, ...args: any[]): void;
}
