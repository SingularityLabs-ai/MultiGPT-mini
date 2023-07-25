import SubscriptionItem from './subscription-item';

/**
 * Utility class allowing dynamically attach/detach batch of listeners to event channels.
 *
 * @param {Array<{channel, event, listener}>} items
 *
 * @example
 * import Channel from 'chnl';
 * const subscription = new Channel.Subscription([
 *   {
 *     channel: chrome.tabs.onUpdated,
 *     listener: this._onTabUpdated.bind(this)
 *   }
 * ]);
 *
 * // attach listeners
 * subscription.on();
 * // detach listeners
 * subscription.off();
 */
export default class Subscription {
  constructor(items) {
    this._items = items.map(params => new SubscriptionItem(params));
  }

  /**
   * Turn on all listeners
   *
   * @returns {this}
   */
  on() {
    this._items.forEach(item => item.on());
    return this;
  }

  /**
   * Turn off all listeners
   *
   * @returns {this}
   */
  off() {
    this._items.forEach(item => item.off());
    return this;
  }
}
