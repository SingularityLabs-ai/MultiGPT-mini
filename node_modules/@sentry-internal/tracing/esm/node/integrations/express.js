import { _optionalChain } from '@sentry/utils/esm/buildPolyfills';
import { logger, getNumberOfUrlSegments, stripUrlQueryAndFragment, extractPathForTransaction, isRegExp } from '@sentry/utils';
import { shouldDisableAutoInstrumentation } from './utils/node-utils.js';

/**
 * Express integration
 *
 * Provides an request and error handler for Express framework as well as tracing capabilities
 */
class Express  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Express';}

  /**
   * @inheritDoc
   */
   __init() {this.name = Express.id;}

  /**
   * Express App instance
   */

  /**
   * @inheritDoc
   */
   constructor(options = {}) {Express.prototype.__init.call(this);
    this._router = options.router || options.app;
    this._methods = (Array.isArray(options.methods) ? options.methods : []).concat('use');
  }

  /**
   * @inheritDoc
   */
   setupOnce(_, getCurrentHub) {
    if (!this._router) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && logger.error('ExpressIntegration is missing an Express instance');
      return;
    }

    if (shouldDisableAutoInstrumentation(getCurrentHub)) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && logger.log('Express Integration is skipped because of instrumenter configuration.');
      return;
    }

    instrumentMiddlewares(this._router, this._methods);
    instrumentRouter(this._router );
  }
}Express.__initStatic();

/**
 * Wraps original middleware function in a tracing call, which stores the info about the call as a span,
 * and finishes it once the middleware is done invoking.
 *
 * Express middlewares have 3 various forms, thus we have to take care of all of them:
 * // sync
 * app.use(function (req, res) { ... })
 * // async
 * app.use(function (req, res, next) { ... })
 * // error handler
 * app.use(function (err, req, res, next) { ... })
 *
 * They all internally delegate to the `router[method]` of the given application instance.
 */
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
function wrap(fn, method) {
  const arity = fn.length;

  switch (arity) {
    case 2: {
      return function ( req, res) {
        const transaction = res.__sentry_transaction;
        if (transaction) {
          const span = transaction.startChild({
            description: fn.name,
            op: `middleware.express.${method}`,
          });
          res.once('finish', () => {
            span.finish();
          });
        }
        return fn.call(this, req, res);
      };
    }
    case 3: {
      return function (

        req,
        res,
        next,
      ) {
        const transaction = res.__sentry_transaction;
        const span = _optionalChain([transaction, 'optionalAccess', _2 => _2.startChild, 'call', _3 => _3({
          description: fn.name,
          op: `middleware.express.${method}`,
        })]);
        fn.call(this, req, res, function ( ...args) {
          _optionalChain([span, 'optionalAccess', _4 => _4.finish, 'call', _5 => _5()]);
          next.call(this, ...args);
        });
      };
    }
    case 4: {
      return function (

        err,
        req,
        res,
        next,
      ) {
        const transaction = res.__sentry_transaction;
        const span = _optionalChain([transaction, 'optionalAccess', _6 => _6.startChild, 'call', _7 => _7({
          description: fn.name,
          op: `middleware.express.${method}`,
        })]);
        fn.call(this, err, req, res, function ( ...args) {
          _optionalChain([span, 'optionalAccess', _8 => _8.finish, 'call', _9 => _9()]);
          next.call(this, ...args);
        });
      };
    }
    default: {
      throw new Error(`Express middleware takes 2-4 arguments. Got: ${arity}`);
    }
  }
}

/**
 * Takes all the function arguments passed to the original `app` or `router` method, eg. `app.use` or `router.use`
 * and wraps every function, as well as array of functions with a call to our `wrap` method.
 * We have to take care of the arrays as well as iterate over all of the arguments,
 * as `app.use` can accept middlewares in few various forms.
 *
 * app.use([<path>], <fn>)
 * app.use([<path>], <fn>, ...<fn>)
 * app.use([<path>], ...<fn>[])
 */
function wrapMiddlewareArgs(args, method) {
  return args.map((arg) => {
    if (typeof arg === 'function') {
      return wrap(arg, method);
    }

    if (Array.isArray(arg)) {
      return arg.map((a) => {
        if (typeof a === 'function') {
          return wrap(a, method);
        }
        return a;
      });
    }

    return arg;
  });
}

/**
 * Patches original router to utilize our tracing functionality
 */
function patchMiddleware(router, method) {
  const originalCallback = router[method];

  router[method] = function (...args) {
    return originalCallback.call(this, ...wrapMiddlewareArgs(args, method));
  };

  return router;
}

/**
 * Patches original router methods
 */
function instrumentMiddlewares(router, methods = []) {
  methods.forEach((method) => patchMiddleware(router, method));
}

/**
 * Patches the prototype of Express.Router to accumulate the resolved route
 * if a layer instance's `match` function was called and it returned a successful match.
 *
 * @see https://github.com/expressjs/express/blob/master/lib/router/index.js
 *
 * @param appOrRouter the router instance which can either be an app (i.e. top-level) or a (nested) router.
 */
function instrumentRouter(appOrRouter) {
  // This is how we can distinguish between app and routers
  const isApp = 'settings' in appOrRouter;

  // In case the app's top-level router hasn't been initialized yet, we have to do it now
  if (isApp && appOrRouter._router === undefined && appOrRouter.lazyrouter) {
    appOrRouter.lazyrouter();
  }

  const router = isApp ? appOrRouter._router : appOrRouter;

  if (!router) {
    /*
    If we end up here, this means likely that this integration is used with Express 3 or Express 5.
    For now, we don't support these versions (3 is very old and 5 is still in beta). To support Express 5,
    we'd need to make more changes to the routing instrumentation because the router is no longer part of
    the Express core package but maintained in its own package. The new router has different function
    signatures and works slightly differently, demanding more changes than just taking the router from
    `app.router` instead of `app._router`.
    @see https://github.com/pillarjs/router

    TODO: Proper Express 5 support
    */
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && logger.debug('Cannot instrument router for URL Parameterization (did not find a valid router).');
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && logger.debug('Routing instrumentation is currently only supported in Express 4.');
    return;
  }

  const routerProto = Object.getPrototypeOf(router) ;

  const originalProcessParams = routerProto.process_params;
  routerProto.process_params = function process_params(
    layer,
    called,
    req,
    res,
    done,
  ) {
    // Base case: We're in the first part of the URL (thus we start with the root '/')
    if (!req._reconstructedRoute) {
      req._reconstructedRoute = '';
    }

    // If the layer's partial route has params, is a regex or an array, the route is stored in layer.route.
    const { layerRoutePath, isRegex, isArray, numExtraSegments } = getLayerRoutePathInfo(layer);

    if (layerRoutePath || isRegex || isArray) {
      req._hasParameters = true;
    }

    // Otherwise, the hardcoded path (i.e. a partial route without params) is stored in layer.path
    const partialRoute = layerRoutePath || layer.path || '';

    // Normalize the partial route so that it doesn't contain leading or trailing slashes
    // and exclude empty or '*' wildcard routes.
    // The exclusion of '*' routes is our best effort to not "pollute" the transaction name
    // with interim handlers (e.g. ones that check authentication or do other middleware stuff).
    // We want to end up with the parameterized URL of the incoming request without any extraneous path segments.
    const finalPartialRoute = partialRoute
      .split('/')
      .filter(segment => segment.length > 0 && (isRegex || isArray || !segment.includes('*')))
      .join('/');

    // If we found a valid partial URL, we append it to the reconstructed route
    if (finalPartialRoute && finalPartialRoute.length > 0) {
      // If the partial route is from a regex route, we append a '/' to close the regex
      req._reconstructedRoute += `/${finalPartialRoute}${isRegex ? '/' : ''}`;
    }

    // Now we check if we are in the "last" part of the route. We determine this by comparing the
    // number of URL segments from the original URL to that of our reconstructed parameterized URL.
    // If we've reached our final destination, we update the transaction name.
    const urlLength = getNumberOfUrlSegments(req.originalUrl || '') + numExtraSegments;
    const routeLength = getNumberOfUrlSegments(req._reconstructedRoute);

    if (urlLength === routeLength) {
      if (!req._hasParameters) {
        if (req._reconstructedRoute !== req.originalUrl) {
          req._reconstructedRoute = req.originalUrl ? stripUrlQueryAndFragment(req.originalUrl) : req.originalUrl;
        }
      }

      const transaction = res.__sentry_transaction;
      if (transaction && transaction.metadata.source !== 'custom') {
        // If the request URL is '/' or empty, the reconstructed route will be empty.
        // Therefore, we fall back to setting the final route to '/' in this case.
        const finalRoute = req._reconstructedRoute || '/';

        transaction.setName(...extractPathForTransaction(req, { path: true, method: true, customRoute: finalRoute }));
      }
    }

    return originalProcessParams.call(this, layer, called, req, res, done);
  };
}

/**
 * Extracts and stringifies the layer's route which can either be a string with parameters (`users/:id`),
 * a RegEx (`/test/`) or an array of strings and regexes (`['/path1', /\/path[2-5]/, /path/:id]`). Additionally
 * returns extra information about the route, such as if the route is defined as regex or as an array.
 *
 * @param layer the layer to extract the stringified route from
 *
 * @returns an object containing the stringified route, a flag determining if the route was a regex
 *          and the number of extra segments to the matched path that are additionally in the route,
 *          if the route was an array (defaults to 0).
 */
function getLayerRoutePathInfo(layer) {
  const lrp = _optionalChain([layer, 'access', _10 => _10.route, 'optionalAccess', _11 => _11.path]);

  const isRegex = isRegExp(lrp);
  const isArray = Array.isArray(lrp);

  if (!lrp) {
    return { isRegex, isArray, numExtraSegments: 0 };
  }

  const numExtraSegments = isArray
    ? Math.max(getNumberOfArrayUrlSegments(lrp ) - getNumberOfUrlSegments(layer.path || ''), 0)
    : 0;

  const layerRoutePath = getLayerRoutePathString(isArray, lrp);

  return { layerRoutePath, isRegex, isArray, numExtraSegments };
}

/**
 * Returns the number of URL segments in an array of routes
 *
 * Example: ['/api/test', /\/api\/post[0-9]/, '/users/:id/details`] -> 7
 */
function getNumberOfArrayUrlSegments(routesArray) {
  return routesArray.reduce((accNumSegments, currentRoute) => {
    // array members can be a RegEx -> convert them toString
    return accNumSegments + getNumberOfUrlSegments(currentRoute.toString());
  }, 0);
}

/**
 * Extracts and returns the stringified version of the layers route path
 * Handles route arrays (by joining the paths together) as well as RegExp and normal
 * string values (in the latter case the toString conversion is technically unnecessary but
 * it doesn't hurt us either).
 */
function getLayerRoutePathString(isArray, lrp) {
  if (isArray) {
    return (lrp ).map(r => r.toString()).join(',');
  }
  return lrp && lrp.toString();
}

export { Express };
//# sourceMappingURL=express.js.map
