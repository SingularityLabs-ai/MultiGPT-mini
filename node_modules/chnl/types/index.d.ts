import RealChannel = require('./channel');
import RealEventEmitter = require('./event-emitter');
import RealSubscription = require('./subscription');
import RealReactSubscription = require('./react-subscription');

export = chnl;

declare class chnl extends RealChannel {}

declare namespace chnl {
    // exporting classes is only possible via extends FakeName
    // see (for example): https://github.com/GoogleChrome/puppeteer/blob/master/lib/externs.d.ts
    export class EventEmitter extends RealEventEmitter {}
    export class Subscription extends RealSubscription {}
    export class ReactSubscription extends RealReactSubscription {}
}
