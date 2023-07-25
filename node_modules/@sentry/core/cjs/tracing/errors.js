Object.defineProperty(exports, '__esModule', { value: true });

const utils = require('@sentry/utils');
const utils$1 = require('./utils.js');

let errorsInstrumented = false;

/**
 * Configures global error listeners
 */
function registerErrorInstrumentation() {
  if (errorsInstrumented) {
    return;
  }

  errorsInstrumented = true;
  utils.addInstrumentationHandler('error', errorCallback);
  utils.addInstrumentationHandler('unhandledrejection', errorCallback);
}

/**
 * If an error or unhandled promise occurs, we mark the active transaction as failed
 */
function errorCallback() {
  const activeTransaction = utils$1.getActiveTransaction();
  if (activeTransaction) {
    const status = 'internal_error';
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && utils.logger.log(`[Tracing] Transaction: ${status} -> Global error occured`);
    activeTransaction.setStatus(status);
  }
}

// The function name will be lost when bundling but we need to be able to identify this listener later to maintain the
// node.js default exit behaviour
errorCallback.tag = 'sentry_tracingErrorCallback';

exports.registerErrorInstrumentation = registerErrorInstrumentation;
//# sourceMappingURL=errors.js.map
