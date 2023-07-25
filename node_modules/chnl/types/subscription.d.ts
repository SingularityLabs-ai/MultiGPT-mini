import {SubscriptionItemParams} from './subscription-item';

export = Subscription;

declare class Subscription {
    constructor(items: SubscriptionItemParams[]);
    on(): this;
    off(): this;
}
