
import Channel = require('./channel');
import {Listener} from './general';

export interface SubscriptionItemParams {
    channel: Channel;
    listener: Listener;
    event?: string;
}

export class SubscriptionItem {
    constructor(params: SubscriptionItemParams);
    on(): void;
    off(): void;
}
