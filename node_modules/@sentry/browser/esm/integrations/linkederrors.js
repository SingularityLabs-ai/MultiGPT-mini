import { getCurrentHub, addGlobalEventProcessor } from '@sentry/core';
import { isInstanceOf } from '@sentry/utils';
import { exceptionFromError } from '../eventbuilder.js';

const DEFAULT_KEY = 'cause';
const DEFAULT_LIMIT = 5;

/** Adds SDK info to an event. */
class LinkedErrors  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'LinkedErrors';}

  /**
   * @inheritDoc
   */
    __init() {this.name = LinkedErrors.id;}

  /**
   * @inheritDoc
   */

  /**
   * @inheritDoc
   */

  /**
   * @inheritDoc
   */
   constructor(options = {}) {LinkedErrors.prototype.__init.call(this);
    this._key = options.key || DEFAULT_KEY;
    this._limit = options.limit || DEFAULT_LIMIT;
  }

  /**
   * @inheritDoc
   */
   setupOnce() {
    const client = getCurrentHub().getClient();
    if (!client) {
      return;
    }
    addGlobalEventProcessor((event, hint) => {
      const self = getCurrentHub().getIntegration(LinkedErrors);
      return self ? _handler(client.getOptions().stackParser, self._key, self._limit, event, hint) : event;
    });
  }
} LinkedErrors.__initStatic();

/**
 * @inheritDoc
 */
function _handler(
  parser,
  key,
  limit,
  event,
  hint,
) {
  if (!event.exception || !event.exception.values || !hint || !isInstanceOf(hint.originalException, Error)) {
    return event;
  }
  const linkedErrors = _walkErrorTree(parser, limit, hint.originalException , key);
  event.exception.values = [...linkedErrors, ...event.exception.values];
  return event;
}

/**
 * JSDOC
 */
function _walkErrorTree(
  parser,
  limit,
  error,
  key,
  stack = [],
) {
  if (!isInstanceOf(error[key], Error) || stack.length + 1 >= limit) {
    return stack;
  }
  const exception = exceptionFromError(parser, error[key]);
  return _walkErrorTree(parser, limit, error[key], key, [exception, ...stack]);
}

export { LinkedErrors, _handler, _walkErrorTree };
//# sourceMappingURL=linkederrors.js.map
