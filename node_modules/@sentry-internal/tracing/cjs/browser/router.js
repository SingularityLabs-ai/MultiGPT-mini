Object.defineProperty(exports, '__esModule', { value: true });

const utils = require('@sentry/utils');
const types = require('./types.js');

/**
 * Default function implementing pageload and navigation transactions
 */
function instrumentRoutingWithDefaults(
  customStartTransaction,
  startTransactionOnPageLoad = true,
  startTransactionOnLocationChange = true,
) {
  if (!types.WINDOW || !types.WINDOW.location) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && utils.logger.warn('Could not initialize routing instrumentation due to invalid location');
    return;
  }

  let startingUrl = types.WINDOW.location.href;

  let activeTransaction;
  if (startTransactionOnPageLoad) {
    activeTransaction = customStartTransaction({
      name: types.WINDOW.location.pathname,
      // pageload should always start at timeOrigin (and needs to be in s, not ms)
      startTimestamp: utils.browserPerformanceTimeOrigin ? utils.browserPerformanceTimeOrigin / 1000 : undefined,
      op: 'pageload',
      metadata: { source: 'url' },
    });
  }

  if (startTransactionOnLocationChange) {
    utils.addInstrumentationHandler('history', ({ to, from }) => {
      /**
       * This early return is there to account for some cases where a navigation transaction starts right after
       * long-running pageload. We make sure that if `from` is undefined and a valid `startingURL` exists, we don't
       * create an uneccessary navigation transaction.
       *
       * This was hard to duplicate, but this behavior stopped as soon as this fix was applied. This issue might also
       * only be caused in certain development environments where the usage of a hot module reloader is causing
       * errors.
       */
      if (from === undefined && startingUrl && startingUrl.indexOf(to) !== -1) {
        startingUrl = undefined;
        return;
      }

      if (from !== to) {
        startingUrl = undefined;
        if (activeTransaction) {
          (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && utils.logger.log(`[Tracing] Finishing current transaction with op: ${activeTransaction.op}`);
          // If there's an open transaction on the scope, we need to finish it before creating an new one.
          activeTransaction.finish();
        }
        activeTransaction = customStartTransaction({
          name: types.WINDOW.location.pathname,
          op: 'navigation',
          metadata: { source: 'url' },
        });
      }
    });
  }
}

exports.instrumentRoutingWithDefaults = instrumentRoutingWithDefaults;
//# sourceMappingURL=router.js.map
