Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@sentry/core');
const utils = require('@sentry/utils');
const types = require('./types.js');

/**
 * Add a listener that cancels and finishes a transaction when the global
 * document is hidden.
 */
function registerBackgroundTabDetection() {
  if (types.WINDOW && types.WINDOW.document) {
    types.WINDOW.document.addEventListener('visibilitychange', () => {
      const activeTransaction = core.getActiveTransaction() ;
      if (types.WINDOW.document.hidden && activeTransaction) {
        const statusType = 'cancelled';

        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
          utils.logger.log(
            `[Tracing] Transaction: ${statusType} -> since tab moved to the background, op: ${activeTransaction.op}`,
          );
        // We should not set status if it is already set, this prevent important statuses like
        // error or data loss from being overwritten on transaction.
        if (!activeTransaction.status) {
          activeTransaction.setStatus(statusType);
        }
        activeTransaction.setTag('visibilitychange', 'document.hidden');
        activeTransaction.finish();
      }
    });
  } else {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
      utils.logger.warn('[Tracing] Could not set up background tab detection due to lack of global document');
  }
}

exports.registerBackgroundTabDetection = registerBackgroundTabDetection;
//# sourceMappingURL=backgroundtab.js.map
