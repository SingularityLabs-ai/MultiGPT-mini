import Channel from './channel';

/**
 * Subscription item
 * @private
 */
export default class SubscriptionItem {
  /**
   * Constructor
   *
   * @param {Object} params
   * @param {Object} params.channel
   * @param {String} [params.event]
   * @param {Function|Channel} params.listener
   */
  constructor(params) {
    this._params = params;
    this._isOn = false;
    this._assertParams();
  }

  /**
   * Turn on listener of channel
   */
  on() {
    if (!this._isOn) {
      const {channel} = this._params;
      const method = channel.addListener || channel.addEventListener || channel.on;
      this._applyMethod(method);
      this._isOn = true;
    }
  }

  /**
   * Turn off listener of channel
   */
  off() {
    if (this._isOn) {
      const {channel} = this._params;
      const method = channel.removeListener || channel.removeEventListener || channel.off;
      this._applyMethod(method);
      this._isOn = false;
    }
  }

  _applyMethod(method) {
    const {channel, event, listener} = this._params;
    const args = event ? [event, listener] : [listener];
    method.apply(channel, args);
  }

  _assertParams() {
    const {channel, event, listener} = this._params;
    if (!channel || typeof channel !== 'object') {
      throw new Error('Channel should be object');
    }
    if (event && typeof event !== 'string') {
      throw new Error('Event should be string');
    }
    if (!listener || !Channel.isValidListener(listener)) {
      throw new Error('Listener should be function or Channel');
    }
  }
}
