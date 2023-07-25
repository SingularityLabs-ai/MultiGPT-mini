import { addInstrumentationHandler, logger } from '@sentry/utils';
import { getActiveTransaction } from './utils.js';

let errorsInstrumented = false;

/**
 * Configures global error listeners
 */
function registerErrorInstrumentation() {
  if (errorsInstrumented) {
    return;
  }

  errorsInstrumented = true;
  addInstrumentationHandler('error', errorCallback);
  addInstrumentationHandler('unhandledrejection', errorCallback);
}

/**
 * If an error or unhandled promise occurs, we mark the active transaction as failed
 */
function errorCallback() {
  const activeTransaction = getActiveTransaction();
  if (activeTransaction) {
    const status = 'internal_error';
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && logger.log(`[Tracing] Transaction: ${status} -> Global error occured`);
    activeTransaction.setStatus(status);
  }
}

// The function name will be lost when bundling but we need to be able to identify this listener later to maintain the
// node.js default exit behaviour
errorCallback.tag = 'sentry_tracingErrorCallback';

export { registerErrorInstrumentation };
//# sourceMappingURL=errors.js.map
