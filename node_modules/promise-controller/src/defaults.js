/**
 * @typedef {Object} Options
 *
 * @property {Number} [timeout=0] - Timeout in ms after that promise will be rejected automatically.
 * @property {String|Function} [timeoutReason] - Rejection reason for timeout.
 * Promise will be rejected with {@link PromiseController.TimeoutError} and this message. The message can contain
 * placeholder `{timeout}` for actual timeout value. If timeoutReason is a function,
 * it will be evaluated and returned value will be used as message.
 * @property {String|Function} [resetReason] - Rejection reason used when `.reset()` is called while promise is pending.
 * Promise will be rejected with {@link PromiseController.ResetError} and this message. If resetReason is a function,
 * it will be evaluated and returned value will be used as message.
 */

module.exports = {
  timeout: 0,
  timeoutReason: 'Promise rejected by PromiseController timeout {timeout} ms.',
  resetReason: 'Promise rejected by PromiseController reset.',
};
