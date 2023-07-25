Object.defineProperty(exports, '__esModule', { value: true });

const hub = require('../hub.js');
const utils = require('@sentry/utils');

/** Grabs active transaction off scope, if any */
function getActiveTransaction(maybeHub) {
  const hub$1 = maybeHub || hub.getCurrentHub();
  const scope = hub$1.getScope();
  return scope.getTransaction() ;
}

exports.TRACEPARENT_REGEXP = utils.TRACEPARENT_REGEXP;
exports.extractTraceparentData = utils.extractTraceparentData;
exports.stripUrlQueryAndFragment = utils.stripUrlQueryAndFragment;
exports.getActiveTransaction = getActiveTransaction;
//# sourceMappingURL=utils.js.map
