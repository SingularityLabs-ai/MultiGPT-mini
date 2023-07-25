Object.defineProperty(exports, '__esModule', { value: true });

const utils = require('@sentry/utils');
const hub = require('../hub.js');

/**
 * Wraps a function with a transaction/span and finishes the span after the function is done.
 *
 * Note that if you have not enabled tracing extensions via `addTracingExtensions`, this function
 * will not generate spans, and the `span` returned from the callback may be undefined.
 *
 * This function is meant to be used internally and may break at any time. Use at your own risk.
 *
 * @internal
 * @private
 */
function trace(
  context,
  callback,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onError = () => {},
) {
  const ctx = { ...context };
  // If a name is set and a description is not, set the description to the name.
  if (ctx.name !== undefined && ctx.description === undefined) {
    ctx.description = ctx.name;
  }

  const hub$1 = hub.getCurrentHub();
  const scope = hub$1.getScope();

  const parentSpan = scope.getSpan();
  const activeSpan = parentSpan ? parentSpan.startChild(ctx) : hub$1.startTransaction(ctx);
  scope.setSpan(activeSpan);

  function finishAndSetSpan() {
    activeSpan && activeSpan.finish();
    hub$1.getScope().setSpan(parentSpan);
  }

  let maybePromiseResult;
  try {
    maybePromiseResult = callback(activeSpan);
  } catch (e) {
    activeSpan && activeSpan.setStatus('internal_error');
    onError(e);
    finishAndSetSpan();
    throw e;
  }

  if (utils.isThenable(maybePromiseResult)) {
    Promise.resolve(maybePromiseResult).then(
      () => {
        finishAndSetSpan();
      },
      e => {
        activeSpan && activeSpan.setStatus('internal_error');
        onError(e);
        finishAndSetSpan();
      },
    );
  } else {
    finishAndSetSpan();
  }

  return maybePromiseResult;
}

exports.trace = trace;
//# sourceMappingURL=trace.js.map
