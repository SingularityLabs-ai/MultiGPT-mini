import Channel from './channel';

/**
 * Event emitter similar to Node.js [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).
 * The main difference from single channel is that each method takes additional `event` argument.
 *
 * @example
 * import Channel from 'chnl';
 *
 * // create emitter
 * const emitter = new Channel.EventEmitter();
 * // listen 'myEvent'
 * emitter.on('myEvent', data => console.log(data));
 * // emit 'myEvent'
 * emitter.emit('myEvent', 'hello world!');
 */
export default class EventEmitter {
  constructor() {
    this._channels = new Map();
  }

  /**
   * Adds listener to specific event
   *
   * @param {String} event
   * @param {Function|Channel} callback
   * @param {Object} [context]
   */
  addListener(event, callback, context) {
    this._getChannel(event).addListener(callback, context);
  }

  /**
   * Adds listener to specific event (alias to addListener)
   *
   * @param {String} event
   * @param {Function|Channel} callback
   * @param {Object} [context]
   */
  on(event, callback, context) {
    this.addListener(event, callback, context);
  }

  /**
   * Adds once listener to specific event
   *
   * @param {String} event
   * @param {Function|Channel} callback
   * @param {Object} [context]
   */
  addOnceListener(event, callback, context) {
    this._getChannel(event).addOnceListener(callback, context);
  }

  /**
   * Adds once listener to specific event (alias to addOnceListener)
   *
   * @param {String} event
   * @param {Function|Channel} callback
   * @param {Object} [context]
   */
  once(event, callback, context) {
    this.addOnceListener(event, callback, context);
  }

  /**
   * Removes listener from specific event
   *
   * @param {String} event
   * @param {Function|Channel} callback
   * @param {Object} [context]
   */
  removeListener(event, callback, context) {
    this._getChannel(event).removeListener(callback, context);
  }

  /**
   * Removes listener from specific event (alias to removeListener)
   *
   * @param {String} event
   * @param {Function|Channel} callback
   * @param {Object} [context]
   */
  off(event, callback, context) {
    this.removeListener(event, callback, context);
  }

  /**
   * Is listener exist for specific event
   *
   * @param {String} event
   * @param {Function|Channel} callback
   * @param {Object} [context]
   * @returns {Boolean}
   */
  hasListener(event, callback, context) {
    return this._getChannel(event).hasListener(callback, context);
  }

  /**
   * Is listener exist for specific event (alias to hasListener)
   *
   * @param {String} event
   * @param {Function|Channel} callback
   * @param {Object} [context]
   * @returns {Boolean}
   */
  has(event, callback, context) {
    return this.hasListener(event, callback, context);
  }

  /**
   * Are there any listeners for specific event
   *
   * @returns {Boolean}
   */
  hasListeners(event) {
    return this._getChannel(event).hasListeners();
  }

  /**
   * Call all listeners for specific event
   *
   * @param {String} event
   * @param {*} args
   */
  dispatch(event, ...args) {
    this._getChannel(event).dispatch(...args);
  }

  /**
   * Call all listeners for specific event
   *
   * @param {String} event
   * @param {*} args
   */
  emit(event, ...args) {
    this.dispatch(event, ...args);
  }

  /**
   * Returns channe by event name
   *
   * @param {String} event
   * @returns {Channel}
   * @private
   */
  _getChannel(event) {
    if (!this._channels.has(event)) {
      this._channels.set(event, new Channel(event));
    }
    return this._channels.get(event);
  }
}
