Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@sentry/core');
const utils = require('@sentry/utils');
const backgroundtab = require('./backgroundtab.js');
const index = require('./metrics/index.js');
const request = require('./request.js');
const router = require('./router.js');
const types = require('./types.js');

const BROWSER_TRACING_INTEGRATION_ID = 'BrowserTracing';

/** Options for Browser Tracing integration */

const DEFAULT_BROWSER_TRACING_OPTIONS = {
  ...core.TRACING_DEFAULTS,
  markBackgroundTransactions: true,
  routingInstrumentation: router.instrumentRoutingWithDefaults,
  startTransactionOnLocationChange: true,
  startTransactionOnPageLoad: true,
  enableLongTask: true,
  _experiments: {},
  ...request.defaultRequestInstrumentationOptions,
};

/**
 * The Browser Tracing integration automatically instruments browser pageload/navigation
 * actions as transactions, and captures requests, metrics and errors as spans.
 *
 * The integration can be configured with a variety of options, and can be extended to use
 * any routing library. This integration uses {@see IdleTransaction} to create transactions.
 */
class BrowserTracing  {
  // This class currently doesn't have a static `id` field like the other integration classes, because it prevented
  // @sentry/tracing from being treeshaken. Tree shakers do not like static fields, because they behave like side effects.
  // TODO: Come up with a better plan, than using static fields on integration classes, and use that plan on all
  // integrations.

  /** Browser Tracing integration options */

  /**
   * @inheritDoc
   */
   __init() {this.name = BROWSER_TRACING_INTEGRATION_ID;}

   constructor(_options) {BrowserTracing.prototype.__init.call(this);
    core.addTracingExtensions();

    this.options = {
      ...DEFAULT_BROWSER_TRACING_OPTIONS,
      ..._options,
    };

    // Special case: enableLongTask can be set in _experiments
    // TODO (v8): Remove this in v8
    if (this.options._experiments.enableLongTask !== undefined) {
      this.options.enableLongTask = this.options._experiments.enableLongTask;
    }

    // TODO (v8): remove this block after tracingOrigins is removed
    // Set tracePropagationTargets to tracingOrigins if specified by the user
    // In case both are specified, tracePropagationTargets takes precedence
    // eslint-disable-next-line deprecation/deprecation
    if (_options && !_options.tracePropagationTargets && _options.tracingOrigins) {
      // eslint-disable-next-line deprecation/deprecation
      this.options.tracePropagationTargets = _options.tracingOrigins;
    }

    this._collectWebVitals = index.startTrackingWebVitals();
    if (this.options.enableLongTask) {
      index.startTrackingLongTasks();
    }
    if (this.options._experiments.enableInteractions) {
      index.startTrackingInteractions();
    }
  }

  /**
   * @inheritDoc
   */
   setupOnce(_, getCurrentHub) {
    this._getCurrentHub = getCurrentHub;

    const {
      routingInstrumentation: instrumentRouting,
      startTransactionOnLocationChange,
      startTransactionOnPageLoad,
      markBackgroundTransactions,
      traceFetch,
      traceXHR,
      tracePropagationTargets,
      shouldCreateSpanForRequest,
      _experiments,
    } = this.options;

    instrumentRouting(
      (context) => {
        const transaction = this._createRouteTransaction(context);

        this.options._experiments.onStartRouteTransaction &&
          this.options._experiments.onStartRouteTransaction(transaction, context, getCurrentHub);

        return transaction;
      },
      startTransactionOnPageLoad,
      startTransactionOnLocationChange,
    );

    if (markBackgroundTransactions) {
      backgroundtab.registerBackgroundTabDetection();
    }

    if (_experiments.enableInteractions) {
      this._registerInteractionListener();
    }

    request.instrumentOutgoingRequests({
      traceFetch,
      traceXHR,
      tracePropagationTargets,
      shouldCreateSpanForRequest,
    });
  }

  /** Create routing idle transaction. */
   _createRouteTransaction(context) {
    if (!this._getCurrentHub) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        utils.logger.warn(`[Tracing] Did not create ${context.op} transaction because _getCurrentHub is invalid.`);
      return undefined;
    }

    const { beforeNavigate, idleTimeout, finalTimeout, heartbeatInterval } = this.options;

    const isPageloadTransaction = context.op === 'pageload';

    const sentryTraceMetaTagValue = isPageloadTransaction ? getMetaContent('sentry-trace') : null;
    const baggageMetaTagValue = isPageloadTransaction ? getMetaContent('baggage') : null;

    const traceParentData = sentryTraceMetaTagValue ? core.extractTraceparentData(sentryTraceMetaTagValue) : undefined;
    const dynamicSamplingContext = baggageMetaTagValue
      ? utils.baggageHeaderToDynamicSamplingContext(baggageMetaTagValue)
      : undefined;

    const expandedContext = {
      ...context,
      ...traceParentData,
      metadata: {
        ...context.metadata,
        dynamicSamplingContext: traceParentData && !dynamicSamplingContext ? {} : dynamicSamplingContext,
      },
      trimEnd: true,
    };

    const modifiedContext = typeof beforeNavigate === 'function' ? beforeNavigate(expandedContext) : expandedContext;

    // For backwards compatibility reasons, beforeNavigate can return undefined to "drop" the transaction (prevent it
    // from being sent to Sentry).
    const finalContext = modifiedContext === undefined ? { ...expandedContext, sampled: false } : modifiedContext;

    // If `beforeNavigate` set a custom name, record that fact
    finalContext.metadata =
      finalContext.name !== expandedContext.name
        ? { ...finalContext.metadata, source: 'custom' }
        : finalContext.metadata;

    this._latestRouteName = finalContext.name;
    this._latestRouteSource = finalContext.metadata && finalContext.metadata.source;

    if (finalContext.sampled === false) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        utils.logger.log(`[Tracing] Will not send ${finalContext.op} transaction because of beforeNavigate.`);
    }

    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && utils.logger.log(`[Tracing] Starting ${finalContext.op} transaction on scope`);

    const hub = this._getCurrentHub();
    const { location } = types.WINDOW;

    const idleTransaction = core.startIdleTransaction(
      hub,
      finalContext,
      idleTimeout,
      finalTimeout,
      true,
      { location }, // for use in the tracesSampler
      heartbeatInterval,
    );
    idleTransaction.registerBeforeFinishCallback(transaction => {
      this._collectWebVitals();
      index.addPerformanceEntries(transaction);
    });

    return idleTransaction ;
  }

  /** Start listener for interaction transactions */
   _registerInteractionListener() {
    let inflightInteractionTransaction;
    const registerInteractionTransaction = () => {
      const { idleTimeout, finalTimeout, heartbeatInterval } = this.options;
      const op = 'ui.action.click';

      const currentTransaction = core.getActiveTransaction();
      if (currentTransaction && currentTransaction.op && ['navigation', 'pageload'].includes(currentTransaction.op)) {
        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
          utils.logger.warn(
            `[Tracing] Did not create ${op} transaction because a pageload or navigation transaction is in progress.`,
          );
        return undefined;
      }

      if (inflightInteractionTransaction) {
        inflightInteractionTransaction.setFinishReason('interactionInterrupted');
        inflightInteractionTransaction.finish();
        inflightInteractionTransaction = undefined;
      }

      if (!this._getCurrentHub) {
        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && utils.logger.warn(`[Tracing] Did not create ${op} transaction because _getCurrentHub is invalid.`);
        return undefined;
      }

      if (!this._latestRouteName) {
        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
          utils.logger.warn(`[Tracing] Did not create ${op} transaction because _latestRouteName is missing.`);
        return undefined;
      }

      const hub = this._getCurrentHub();
      const { location } = types.WINDOW;

      const context = {
        name: this._latestRouteName,
        op,
        trimEnd: true,
        metadata: {
          source: this._latestRouteSource || 'url',
        },
      };

      inflightInteractionTransaction = core.startIdleTransaction(
        hub,
        context,
        idleTimeout,
        finalTimeout,
        true,
        { location }, // for use in the tracesSampler
        heartbeatInterval,
      );
    };

    ['click'].forEach(type => {
      addEventListener(type, registerInteractionTransaction, { once: false, capture: true });
    });
  }
}

/** Returns the value of a meta tag */
function getMetaContent(metaName) {
  // Can't specify generic to `getDomElement` because tracing can be used
  // in a variety of environments, have to disable `no-unsafe-member-access`
  // as a result.
  const metaTag = utils.getDomElement(`meta[name=${metaName}]`);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return metaTag ? metaTag.getAttribute('content') : null;
}

exports.BROWSER_TRACING_INTEGRATION_ID = BROWSER_TRACING_INTEGRATION_ID;
exports.BrowserTracing = BrowserTracing;
exports.getMetaContent = getMetaContent;
//# sourceMappingURL=browsertracing.js.map
