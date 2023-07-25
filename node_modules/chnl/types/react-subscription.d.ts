
import Subscription from './subscription';
import {SubscriptionItemParams} from './subscription-item';

export = ReactSubscription;

declare class ReactSubscription extends Subscription {
    constructor(component: object, items: SubscriptionItemParams[]);
}
