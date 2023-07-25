Object.defineProperty(exports, '__esModule', { value: true });

const browser = require('@sentry/browser');
const sdk = require('./sdk.js');
const profiler = require('./profiler.js');
const errorboundary = require('./errorboundary.js');
const redux = require('./redux.js');
const reactrouterv3 = require('./reactrouterv3.js');
const reactrouter = require('./reactrouter.js');
const reactrouterv6 = require('./reactrouterv6.js');



exports.init = sdk.init;
exports.Profiler = profiler.Profiler;
exports.useProfiler = profiler.useProfiler;
exports.withProfiler = profiler.withProfiler;
exports.ErrorBoundary = errorboundary.ErrorBoundary;
exports.withErrorBoundary = errorboundary.withErrorBoundary;
exports.createReduxEnhancer = redux.createReduxEnhancer;
exports.reactRouterV3Instrumentation = reactrouterv3.reactRouterV3Instrumentation;
exports.reactRouterV4Instrumentation = reactrouter.reactRouterV4Instrumentation;
exports.reactRouterV5Instrumentation = reactrouter.reactRouterV5Instrumentation;
exports.withSentryRouting = reactrouter.withSentryRouting;
exports.reactRouterV6Instrumentation = reactrouterv6.reactRouterV6Instrumentation;
exports.withSentryReactRouterV6Routing = reactrouterv6.withSentryReactRouterV6Routing;
exports.wrapCreateBrowserRouter = reactrouterv6.wrapCreateBrowserRouter;
exports.wrapUseRoutes = reactrouterv6.wrapUseRoutes;
for (const k in browser) {
  if (k !== 'default' && !exports.hasOwnProperty(k)) exports[k] = browser[k];
}
//# sourceMappingURL=index.js.map
