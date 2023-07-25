import {Listener} from "./general";

type ChannelMethod = (callback: Listener, context?: any) => void;
type ChannelBooleanMethod = (callback: Listener, context?: any) => boolean;

export = Channel;

declare class Channel {
    static Subscription: any;
    constructor(name?: string);
    addListener: ChannelMethod;
    addOnceListener: ChannelMethod;
    removeListener: ChannelMethod;
    removeAllListeners(): void;
    hasListener: ChannelBooleanMethod;
    hasListeners(): boolean;
    dispatch(...args: any[]): void;
    dispatchAsync(...args: any[]): void;
    mute(options?: object): void;
    unmute(): void;
    onListenerAdded: Channel;
    onListenerRemoved: Channel;
    onFirstListenerAdded: Channel;
    onLastListenerRemoved: Channel;
}
