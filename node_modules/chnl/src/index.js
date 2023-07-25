/**
 * Chnl entry point
 */

import Channel from './channel';
import EventEmitter from './event-emitter';
import Subscription from './subscription';
import ReactSubscription from './react-subscription';

/**
 * @private
 */
const chnl = Channel;
chnl.EventEmitter = EventEmitter;
chnl.Subscription = Subscription;
chnl.ReactSubscription = ReactSubscription;

export default chnl;

/*
 Can not export additional classes like:

 export {
 EventEmitter,
 Subscription,
 };

 because in that case babel's output is not compatible with pure commonjs
 See: http://stackoverflow.com/questions/33505992/babel-6-changes-how-it-exports-default
 */
