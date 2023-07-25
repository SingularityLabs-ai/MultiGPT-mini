/**
 * @ignore
 */
const defaults = require('./defaults');
const {isPromise, createErrorType, tryCall} = require('./utils');

/**
 * @typicalname pc
 */
class PromiseController {
  /**
   * Creates promise controller. Unlike original Promise, it does not immediately call any function.
   * Instead it has [.call()](#PromiseController+call) method that calls provided function
   * and stores `resolve / reject` methods for future access.
   *
   * @param {Options} [options]
   */
  constructor(options) {
    this._options = Object.assign({}, defaults, options);
    this._resolve = null;
    this._reject = null;
    this._isPending = false;
    this._isFulfilled = false;
    this._isRejected = false;
    this._value = undefined;
    this._promise = null;
    this._timer = null;
  }

  /**
   * Returns promise itself.
   *
   * @returns {Promise}
   */
  get promise() {
    return this._promise;
  }

  /**
   * Returns value with that promise was settled (fulfilled or rejected).
   *
   * @returns {*}
   */
  get value() {
    return this._value;
  }

  /**
   * Returns true if promise is pending.
   *
   * @returns {Boolean}
   */
  get isPending() {
    return this._isPending;
  }

  /**
   * Returns true if promise is fulfilled.
   *
   * @returns {Boolean}
   */
  get isFulfilled() {
    return this._isFulfilled;
  }

  /**
   * Returns true if promise rejected.
   *
   * @returns {Boolean}
   */
  get isRejected() {
    return this._isRejected;
  }

  /**
   * Returns true if promise is fulfilled or rejected.
   *
   * @returns {Boolean}
   */
  get isSettled() {
    return this._isFulfilled || this._isRejected;
  }

  /**
   * Calls `fn` and returns promise OR just returns existing promise from previous `call()` if it is still pending.
   * To fulfill returned promise you should use
   * {@link PromiseController#resolve} / {@link PromiseController#reject} methods.
   * If `fn` itself returns promise, then external promise is attached to it and fulfills together.
   * If no `fn` passed - promiseController is initialized as well.
   *
   * @param {Function} [fn] function to be called.
   * @returns {Promise}
   */
  call(fn) {
    if (!this._isPending) {
      this.reset();
      this._createPromise();
      this._createTimer();
      this._callFn(fn);
    }
    return this._promise;
  }

  /**
   * Resolves pending promise with specified `value`.
   *
   * @param {*} [value]
   */
  resolve(value) {
    if (this._isPending) {
      if (isPromise(value)) {
        this._tryAttachToPromise(value);
      } else {
        this._settle(value);
        this._isFulfilled = true;
        this._resolve(value);
      }
    }
  }

  /**
   * Rejects pending promise with specified `value`.
   *
   * @param {*} [value]
   */
  reject(value) {
    if (this._isPending) {
      this._settle(value);
      this._isRejected = true;
      this._reject(value);
    }
  }

  /**
   * Resets to initial state.
   * If promise is pending it will be rejected with {@link PromiseController.ResetError}.
   */
  reset() {
    if (this._isPending) {
      const message = tryCall(this._options.resetReason);
      const error = new PromiseController.ResetError(message);
      this.reject(error);
    }
    this._promise = null;
    this._isPending = false;
    this._isFulfilled = false;
    this._isRejected = false;
    this._value = undefined;
    this._clearTimer();
  }

  /**
   * Re-assign one or more options.
   *
   * @param {Options} options
   */
  configure(options) {
    Object.assign(this._options, options);
  }

  _createPromise() {
    this._promise = new Promise((resolve, reject) => {
      this._isPending = true;
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  _handleTimeout() {
    const messageTpl = tryCall(this._options.timeoutReason);
    const message = typeof messageTpl === 'string' ? messageTpl.replace('{timeout}', this._options.timeout) : '';
    const error = new PromiseController.TimeoutError(message);
    this.reject(error);
  }

  _createTimer() {
    if (this._options.timeout) {
      this._timer = setTimeout(() => this._handleTimeout(), this._options.timeout);
    }
  }

  _clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  _settle(value) {
    this._isPending = false;
    this._value = value;
    this._clearTimer();
  }

  _callFn(fn) {
    if (typeof fn === 'function') {
      try {
        const result = fn();
        this._tryAttachToPromise(result);
      } catch (e) {
        this.reject(e);
      }
    }
  }

  _tryAttachToPromise(p) {
    if (isPromise(p)) {
      p.then(value => this.resolve(value), e => this.reject(e));
    }
  }
}

/**
 * Error for rejection in case of timeout.
 * @type {PromiseController.TimeoutError}
 */
PromiseController.TimeoutError = createErrorType('TimeoutError');

/**
 * Error for rejection in case of call `.reset()` while promise is pending.
 * @type {PromiseController.ResetError}
 */
PromiseController.ResetError = createErrorType('ResetError');

module.exports = PromiseController;
