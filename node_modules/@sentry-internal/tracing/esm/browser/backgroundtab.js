import { getActiveTransaction } from '@sentry/core';
import { logger } from '@sentry/utils';
import { WINDOW } from './types.js';

/**
 * Add a listener that cancels and finishes a transaction when the global
 * document is hidden.
 */
function registerBackgroundTabDetection() {
  if (WINDOW && WINDOW.document) {
    WINDOW.document.addEventListener('visibilitychange', () => {
      const activeTransaction = getActiveTransaction() ;
      if (WINDOW.document.hidden && activeTransaction) {
        const statusType = 'cancelled';

        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
          logger.log(
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
      logger.warn('[Tracing] Could not set up background tab detection due to lack of global document');
  }
}

export { registerBackgroundTabDetection };
//# sourceMappingURL=backgroundtab.js.map
