/**
 * Channel for events of particular type. Allows attach/detach listeners and dispatch event data.
 *
 * @param {String} [name]
 *
 * @example
 * import Channel from 'chnl';
 *
 * // create channel
 * const onClick = new Channel();
 * // listen
 * onClick.addListener(data => console.log(data));
 * // dispatch data
 * onClick.dispatch(data);
 */
export default class Channel {
  constructor(name) {
    this._listeners = [];
    this._mute = false;
    this._accumulate = false;
    this._accumulatedEvents = [];
    this._name = name || '';
    this._onListenerAdded = null;
    this._onFirstListenerAdded = null;
    this._onListenerRemoved = null;
    this._onLastListenerRemoved = null;
  }

  /**
   * Check for the passed listener is valid.
   *
   * @param {*} listener
   * @returns {Boolean}
   */
  static isValidListener(listener) {
    return typeof listener === 'function' || listener instanceof Channel;
  }

  /**
   * Triggers when listener is added to channel.
   *
   * @returns {Channel}
   */
  get onListenerAdded() {
    if (!this._onListenerAdded) {
      this._onListenerAdded = new Channel(`${this._name}:onListenerAdded`);
    }
    return this._onListenerAdded;
  }

  /**
   * Triggers when first listener is added to channel.
   *
   * @returns {Channel}
   */
  get onFirstListenerAdded() {
    if (!this._onFirstListenerAdded) {
      this._onFirstListenerAdded = new Channel(`${this._name}:onFirstListenerAdded`);
    }
    return this._onFirstListenerAdded;
  }

  /**
   * Triggers when listener is removed from channel.
   *
   * @returns {Channel}
   */
  get onListenerRemoved() {
    if (!this._onListenerRemoved) {
      this._onListenerRemoved = new Channel(`${this._name}:onListenerRemoved`);
    }
    return this._onListenerRemoved;
  }

  /**
   * Triggers when last listener is removed from channel.
   *
   * @returns {Channel}
   */
  get onLastListenerRemoved() {
    if (!this._onLastListenerRemoved) {
      this._onLastListenerRemoved = new Channel(`${this._name}:onLastListenerRemoved`);
    }
    return this._onLastListenerRemoved;
  }

  /**
   * Add listener for event.
   * @param {Function|Channel} callback
   * @param {Object} [context]
   */
  addListener(callback, context) {
    this._pushListener(callback, context, false);
  }

  /**
   * Add once listener for event.
   * @param {Function|Channel} callback
   * @param {Object} [context]
   */
  addOnceListener(callback, context) {
    this._pushListener(callback, context, true);
  }

  /**
   * Remove listener from event.
   * @param {Function|Channel} callback
   * @param {Object} [context]
   */
  removeListener(callback, context) {
    this._ensureListener(callback);
    const index = this._indexOfListener(callback, context);
    if (index >= 0) {
      this._spliceListener(index);
    }
  }

  /**
   * Remove all listeners from channel.
   */
  removeAllListeners() {
    while (this.hasListeners()) {
      this._spliceListener(0);
    }
  }

  /**
   * Is listener exist.
   * @param {Function|Channel} callback
   * @param {Object} [context]
   * @returns {Boolean}
   */
  hasListener(callback, context) {
    this._ensureListener(callback);
    return this._indexOfListener(callback, context) >= 0;
  }

  /**
   * Are there any listeners.
   * @returns {Boolean}
   */
  hasListeners() {
    return this._listeners.length > 0;
  }

  /**
   * Call all listeners with specified params.
   */
  dispatch(...args) {
    this._invokeListeners({args, async: false});
  }

  /**
   * Call all listeners with specified params asynchronously.
   */
  dispatchAsync(...args) {
    this._invokeListeners({args, async: true});
  }

  /**
   * Mute channel.
   * @param {Object} [options]
   * @param {Boolean} [options.accumulate] accumulate events and call listeners after .unmute()
   */
  mute(options = {}) {
    this._mute = true;
    if (options.accumulate) {
      this._accumulate = true;
    } else {
      this._accumulate = false;
      this._accumulatedEvents = [];
    }
  }

  /**
   * Unmute channel.
   */
  unmute() {
    this._mute = false;
    if (this._accumulate) {
      this._dispatchAccumulated();
      this._accumulate = false;
    }
  }

  /**
   * @param {Object} options
   * @param {Array} options.args
   * @param {Boolean} [options.async]
   * @private
   */
  _invokeListeners(options = {args: [], async: false}) {
    if (!this._mute) {
      const listenersToInvoke = this._listeners.slice();
      listenersToInvoke.forEach(listener => {
        this._invokeListener(listener, options);
        if (listener.once) {
          this.removeListener(listener.callback, listener.context)
        }
      });
    } else if (this._accumulate) {
      this._accumulatedEvents.push(options);
    }
  }

  /**
   * @param {Object} listener
   * @param {Object} options
   * @param {Array} options.args
   * @param {Boolean} options.async
   * @private
   */
  _invokeListener(listener, options) {
    const isListenerChannel = listener.callback instanceof Channel;
    if (options.async) {
      if (isListenerChannel) {
        listener.callback.dispatchAsync(...options.args);
      } else {
        setTimeout(() => listener.callback.apply(listener.context, options.args), 0);
      }
    } else {
      if (isListenerChannel) {
        listener.callback.dispatch(...options.args);
      } else {
        listener.callback.apply(listener.context, options.args);
      }
    }
  }

  /**
   * Ensure listener.
   * @param {Function|Channel} listener
   * @private
   */
  _ensureListener(listener) {
    if (!Channel.isValidListener(listener)) {
      throw new Error('Channel ' + this._name + ': listener is not a function and not a Channel');
    }
  }

  /**
   * Dispatch inner events when listener is added.
   * @private
   */
  _dispatchInnerAddEvents(...args) {
    if (this._onListenerAdded) {
      this._onListenerAdded.dispatch(...args);
    }
    if (this._onFirstListenerAdded && this._listeners.length === 1) {
      this._onFirstListenerAdded.dispatch(...args);
    }
  }

  /**
   * Dispatch inner events when listener is removed.
   * @private
   */
  _dispatchInnerRemoveEvents(...args) {
    if (this._onListenerRemoved) {
      this._onListenerRemoved.dispatch(...args);
    }
    if (this._onLastListenerRemoved && this._listeners.length === 0) {
      this._onLastListenerRemoved.dispatch(...args);
    }
  }

  /**
   * Find listener index.
   * @param {Function|Channel} callback
   * @param {Object} [context]
   * @private
   */
  _indexOfListener(callback, context) {
    for (let i = 0; i < this._listeners.length; i++) {
      const listener = this._listeners[i];
      const equalCallbacks = listener.callback === callback;
      const isListenerChannel = callback instanceof Channel;
      const emptyContexts = context === undefined && listener.context === undefined;
      const equalContexts = context === listener.context;
      if (equalCallbacks && (isListenerChannel || emptyContexts || equalContexts)) {
        return i;
      }
    }
  }

  /**
   * Dispatch accumulated events.
   * @private
   */
  _dispatchAccumulated() {
    this._accumulatedEvents.forEach(options => this._invokeListeners(options));
    this._accumulatedEvents = [];
  }

  /**
   * Pushes listener.
   * @param {Function|Channel} listener
   * @param {Object} context
   * @param {Boolean} once
   * @private
   */
  _pushListener(listener, context, once) {
    this._ensureListener(listener);
    this._checkForDuplicates(listener, context);
    this._listeners.push({callback: listener, context, once});
    this._dispatchInnerAddEvents(listener, context, once);
  }

  /**
   * Check for listeners duplicates
   * @param {Function|Channel} listener
   * @param {Object} context
   */
  _checkForDuplicates(listener, context) {
    if (this.hasListener(listener, context)) {
      throw new Error('Channel ' + this._name + ': duplicating listeners');
    }
  }

  /**
   * Splice listener under index.
   * @param {Number} index
   * @private
   */
  _spliceListener(index) {
    const {callback, context, once} = this._listeners[index];
    this._listeners.splice(index, 1);
    this._dispatchInnerRemoveEvents(callback, context, once);
  }
}
