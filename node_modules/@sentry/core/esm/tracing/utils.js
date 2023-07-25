import { getCurrentHub } from '../hub.js';
export { TRACEPARENT_REGEXP, extractTraceparentData, stripUrlQueryAndFragment } from '@sentry/utils';

/** Grabs active transaction off scope, if any */
function getActiveTransaction(maybeHub) {
  const hub = maybeHub || getCurrentHub();
  const scope = hub.getScope();
  return scope.getTransaction() ;
}

export { getActiveTransaction };
//# sourceMappingURL=utils.js.map
