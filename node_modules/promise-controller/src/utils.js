
/**
 * Simple check for Promise.
 * @param {*} p
 * @returns {Boolean}
 * @ignore
 */
exports.isPromise = function (p) {
  return p && typeof p.then === 'function';
};

/**
 * Calls argument if it is function
 * @param {*} value
 * @returns {*}
 * @ignore
 */
exports.tryCall = function (value) {
  return typeof value === 'function' ? value() : value;
};

/**
 * Just `class MyError extends Error` does not work with transpiler.
 * See: https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
 * @ignore
 */
exports.createErrorType = function (name) {
  function E(message) {
    if (!Error.captureStackTrace) {
      this.stack = (new Error()).stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
    this.message = message;
  }
  E.prototype = new Error();
  E.prototype.name = name;
  E.prototype.constructor = E;
  return E;
};
