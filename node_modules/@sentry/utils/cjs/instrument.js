Object.defineProperty(exports, '__esModule', { value: true });

const is = require('./is.js');
const logger = require('./logger.js');
const object = require('./object.js');
const stacktrace = require('./stacktrace.js');
const supports = require('./supports.js');
const worldwide = require('./worldwide.js');
const supportsHistory = require('./vendor/supportsHistory.js');

// eslint-disable-next-line deprecation/deprecation
const WINDOW = worldwide.getGlobalObject();

const SENTRY_XHR_DATA_KEY = '__sentry_xhr_v2__';

/**
 * Instrument native APIs to call handlers that can be used to create breadcrumbs, APM spans etc.
 *  - Console API
 *  - Fetch API
 *  - XHR API
 *  - History API
 *  - DOM API (click/typing)
 *  - Error API
 *  - UnhandledRejection API
 */

const handlers = {};
const instrumented = {};

/** Instruments given API */
function instrument(type) {
  if (instrumented[type]) {
    return;
  }

  instrumented[type] = true;

  switch (type) {
    case 'console':
      instrumentConsole();
      break;
    case 'dom':
      instrumentDOM();
      break;
    case 'xhr':
      instrumentXHR();
      break;
    case 'fetch':
      instrumentFetch();
      break;
    case 'history':
      instrumentHistory();
      break;
    case 'error':
      instrumentError();
      break;
    case 'unhandledrejection':
      instrumentUnhandledRejection();
      break;
    default:
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && logger.logger.warn('unknown instrumentation type:', type);
      return;
  }
}

/**
 * Add handler that will be called when given type of instrumentation triggers.
 * Use at your own risk, this might break without changelog notice, only used internally.
 * @hidden
 */
function addInstrumentationHandler(type, callback) {
  handlers[type] = handlers[type] || [];
  (handlers[type] ).push(callback);
  instrument(type);
}

/** JSDoc */
function triggerHandlers(type, data) {
  if (!type || !handlers[type]) {
    return;
  }

  for (const handler of handlers[type] || []) {
    try {
      handler(data);
    } catch (e) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        logger.logger.error(
          `Error while triggering instrumentation handler.\nType: ${type}\nName: ${stacktrace.getFunctionName(handler)}\nError:`,
          e,
        );
    }
  }
}

/** JSDoc */
function instrumentConsole() {
  if (!('console' in WINDOW)) {
    return;
  }

  logger.CONSOLE_LEVELS.forEach(function (level) {
    if (!(level in WINDOW.console)) {
      return;
    }

    object.fill(WINDOW.console, level, function (originalConsoleMethod) {
      return function (...args) {
        triggerHandlers('console', { args, level });

        // this fails for some browsers. :(
        if (originalConsoleMethod) {
          originalConsoleMethod.apply(WINDOW.console, args);
        }
      };
    });
  });
}

/** JSDoc */
function instrumentFetch() {
  if (!supports.supportsNativeFetch()) {
    return;
  }

  object.fill(WINDOW, 'fetch', function (originalFetch) {
    return function (...args) {
      const { method, url } = parseFetchArgs(args);

      const handlerData = {
        args,
        fetchData: {
          method,
          url,
        },
        startTimestamp: Date.now(),
      };

      triggerHandlers('fetch', {
        ...handlerData,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return originalFetch.apply(WINDOW, args).then(
        (response) => {
          triggerHandlers('fetch', {
            ...handlerData,
            endTimestamp: Date.now(),
            response,
          });
          return response;
        },
        (error) => {
          triggerHandlers('fetch', {
            ...handlerData,
            endTimestamp: Date.now(),
            error,
          });
          // NOTE: If you are a Sentry user, and you are seeing this stack frame,
          //       it means the sentry.javascript SDK caught an error invoking your application code.
          //       This is expected behavior and NOT indicative of a bug with sentry.javascript.
          throw error;
        },
      );
    };
  });
}

function hasProp(obj, prop) {
  return !!obj && typeof obj === 'object' && !!(obj )[prop];
}

function getUrlFromResource(resource) {
  if (typeof resource === 'string') {
    return resource;
  }

  if (!resource) {
    return '';
  }

  if (hasProp(resource, 'url')) {
    return resource.url;
  }

  if (resource.toString) {
    return resource.toString();
  }

  return '';
}

/**
 * Parses the fetch arguments to find the used Http method and the url of the request
 */
function parseFetchArgs(fetchArgs) {
  if (fetchArgs.length === 0) {
    return { method: 'GET', url: '' };
  }

  if (fetchArgs.length === 2) {
    const [url, options] = fetchArgs ;

    return {
      url: getUrlFromResource(url),
      method: hasProp(options, 'method') ? String(options.method).toUpperCase() : 'GET',
    };
  }

  const arg = fetchArgs[0];
  return {
    url: getUrlFromResource(arg ),
    method: hasProp(arg, 'method') ? String(arg.method).toUpperCase() : 'GET',
  };
}

/** JSDoc */
function instrumentXHR() {
  if (!('XMLHttpRequest' in WINDOW)) {
    return;
  }

  const xhrproto = XMLHttpRequest.prototype;

  object.fill(xhrproto, 'open', function (originalOpen) {
    return function ( ...args) {
      const url = args[1];
      const xhrInfo = (this[SENTRY_XHR_DATA_KEY] = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        method: is.isString(args[0]) ? args[0].toUpperCase() : args[0],
        url: args[1],
        request_headers: {},
      });

      // if Sentry key appears in URL, don't capture it as a request
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (is.isString(url) && xhrInfo.method === 'POST' && url.match(/sentry_key/)) {
        this.__sentry_own_request__ = true;
      }

      const onreadystatechangeHandler = () => {
        // For whatever reason, this is not the same instance here as from the outer method
        const xhrInfo = this[SENTRY_XHR_DATA_KEY];

        if (!xhrInfo) {
          return;
        }

        if (this.readyState === 4) {
          try {
            // touching statusCode in some platforms throws
            // an exception
            xhrInfo.status_code = this.status;
          } catch (e) {
            /* do nothing */
          }

          triggerHandlers('xhr', {
            args: args ,
            endTimestamp: Date.now(),
            startTimestamp: Date.now(),
            xhr: this,
          } );
        }
      };

      if ('onreadystatechange' in this && typeof this.onreadystatechange === 'function') {
        object.fill(this, 'onreadystatechange', function (original) {
          return function ( ...readyStateArgs) {
            onreadystatechangeHandler();
            return original.apply(this, readyStateArgs);
          };
        });
      } else {
        this.addEventListener('readystatechange', onreadystatechangeHandler);
      }

      // Intercepting `setRequestHeader` to access the request headers of XHR instance.
      // This will only work for user/library defined headers, not for the default/browser-assigned headers.
      // Request cookies are also unavailable for XHR, as `Cookie` header can't be defined by `setRequestHeader`.
      object.fill(this, 'setRequestHeader', function (original) {
        return function ( ...setRequestHeaderArgs) {
          const [header, value] = setRequestHeaderArgs ;

          const xhrInfo = this[SENTRY_XHR_DATA_KEY];

          if (xhrInfo) {
            xhrInfo.request_headers[header.toLowerCase()] = value;
          }

          return original.apply(this, setRequestHeaderArgs);
        };
      });

      return originalOpen.apply(this, args);
    };
  });

  object.fill(xhrproto, 'send', function (originalSend) {
    return function ( ...args) {
      const sentryXhrData = this[SENTRY_XHR_DATA_KEY];
      if (sentryXhrData && args[0] !== undefined) {
        sentryXhrData.body = args[0];
      }

      triggerHandlers('xhr', {
        args,
        startTimestamp: Date.now(),
        xhr: this,
      });

      return originalSend.apply(this, args);
    };
  });
}

let lastHref;

/** JSDoc */
function instrumentHistory() {
  if (!supportsHistory.supportsHistory()) {
    return;
  }

  const oldOnPopState = WINDOW.onpopstate;
  WINDOW.onpopstate = function ( ...args) {
    const to = WINDOW.location.href;
    // keep track of the current URL state, as we always receive only the updated state
    const from = lastHref;
    lastHref = to;
    triggerHandlers('history', {
      from,
      to,
    });
    if (oldOnPopState) {
      // Apparently this can throw in Firefox when incorrectly implemented plugin is installed.
      // https://github.com/getsentry/sentry-javascript/issues/3344
      // https://github.com/bugsnag/bugsnag-js/issues/469
      try {
        return oldOnPopState.apply(this, args);
      } catch (_oO) {
        // no-empty
      }
    }
  };

  /** @hidden */
  function historyReplacementFunction(originalHistoryFunction) {
    return function ( ...args) {
      const url = args.length > 2 ? args[2] : undefined;
      if (url) {
        // coerce to string (this is what pushState does)
        const from = lastHref;
        const to = String(url);
        // keep track of the current URL state, as we always receive only the updated state
        lastHref = to;
        triggerHandlers('history', {
          from,
          to,
        });
      }
      return originalHistoryFunction.apply(this, args);
    };
  }

  object.fill(WINDOW.history, 'pushState', historyReplacementFunction);
  object.fill(WINDOW.history, 'replaceState', historyReplacementFunction);
}

const debounceDuration = 1000;
let debounceTimerID;
let lastCapturedEvent;

/**
 * Decide whether the current event should finish the debounce of previously captured one.
 * @param previous previously captured event
 * @param current event to be captured
 */
function shouldShortcircuitPreviousDebounce(previous, current) {
  // If there was no previous event, it should always be swapped for the new one.
  if (!previous) {
    return true;
  }

  // If both events have different type, then user definitely performed two separate actions. e.g. click + keypress.
  if (previous.type !== current.type) {
    return true;
  }

  try {
    // If both events have the same type, it's still possible that actions were performed on different targets.
    // e.g. 2 clicks on different buttons.
    if (previous.target !== current.target) {
      return true;
    }
  } catch (e) {
    // just accessing `target` property can throw an exception in some rare circumstances
    // see: https://github.com/getsentry/sentry-javascript/issues/838
  }

  // If both events have the same type _and_ same `target` (an element which triggered an event, _not necessarily_
  // to which an event listener was attached), we treat them as the same action, as we want to capture
  // only one breadcrumb. e.g. multiple clicks on the same button, or typing inside a user input box.
  return false;
}

/**
 * Decide whether an event should be captured.
 * @param event event to be captured
 */
function shouldSkipDOMEvent(event) {
  // We are only interested in filtering `keypress` events for now.
  if (event.type !== 'keypress') {
    return false;
  }

  try {
    const target = event.target ;

    if (!target || !target.tagName) {
      return true;
    }

    // Only consider keypress events on actual input elements. This will disregard keypresses targeting body
    // e.g.tabbing through elements, hotkeys, etc.
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return false;
    }
  } catch (e) {
    // just accessing `target` property can throw an exception in some rare circumstances
    // see: https://github.com/getsentry/sentry-javascript/issues/838
  }

  return true;
}

/**
 * Wraps addEventListener to capture UI breadcrumbs
 * @param handler function that will be triggered
 * @param globalListener indicates whether event was captured by the global event listener
 * @returns wrapped breadcrumb events handler
 * @hidden
 */
function makeDOMEventHandler(handler, globalListener = false) {
  return (event) => {
    // It's possible this handler might trigger multiple times for the same
    // event (e.g. event propagation through node ancestors).
    // Ignore if we've already captured that event.
    if (!event || lastCapturedEvent === event) {
      return;
    }

    // We always want to skip _some_ events.
    if (shouldSkipDOMEvent(event)) {
      return;
    }

    const name = event.type === 'keypress' ? 'input' : event.type;

    // If there is no debounce timer, it means that we can safely capture the new event and store it for future comparisons.
    if (debounceTimerID === undefined) {
      handler({
        event: event,
        name,
        global: globalListener,
      });
      lastCapturedEvent = event;
    }
    // If there is a debounce awaiting, see if the new event is different enough to treat it as a unique one.
    // If that's the case, emit the previous event and store locally the newly-captured DOM event.
    else if (shouldShortcircuitPreviousDebounce(lastCapturedEvent, event)) {
      handler({
        event: event,
        name,
        global: globalListener,
      });
      lastCapturedEvent = event;
    }

    // Start a new debounce timer that will prevent us from capturing multiple events that should be grouped together.
    clearTimeout(debounceTimerID);
    debounceTimerID = WINDOW.setTimeout(() => {
      debounceTimerID = undefined;
    }, debounceDuration);
  };
}

/** JSDoc */
function instrumentDOM() {
  if (!('document' in WINDOW)) {
    return;
  }

  // Make it so that any click or keypress that is unhandled / bubbled up all the way to the document triggers our dom
  // handlers. (Normally we have only one, which captures a breadcrumb for each click or keypress.) Do this before
  // we instrument `addEventListener` so that we don't end up attaching this handler twice.
  const triggerDOMHandler = triggerHandlers.bind(null, 'dom');
  const globalDOMEventHandler = makeDOMEventHandler(triggerDOMHandler, true);
  WINDOW.document.addEventListener('click', globalDOMEventHandler, false);
  WINDOW.document.addEventListener('keypress', globalDOMEventHandler, false);

  // After hooking into click and keypress events bubbled up to `document`, we also hook into user-handled
  // clicks & keypresses, by adding an event listener of our own to any element to which they add a listener. That
  // way, whenever one of their handlers is triggered, ours will be, too. (This is needed because their handler
  // could potentially prevent the event from bubbling up to our global listeners. This way, our handler are still
  // guaranteed to fire at least once.)
  ['EventTarget', 'Node'].forEach((target) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const proto = (WINDOW )[target] && (WINDOW )[target].prototype;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-prototype-builtins
    if (!proto || !proto.hasOwnProperty || !proto.hasOwnProperty('addEventListener')) {
      return;
    }

    object.fill(proto, 'addEventListener', function (originalAddEventListener) {
      return function (

        type,
        listener,
        options,
      ) {
        if (type === 'click' || type == 'keypress') {
          try {
            const el = this ;
            const handlers = (el.__sentry_instrumentation_handlers__ = el.__sentry_instrumentation_handlers__ || {});
            const handlerForType = (handlers[type] = handlers[type] || { refCount: 0 });

            if (!handlerForType.handler) {
              const handler = makeDOMEventHandler(triggerDOMHandler);
              handlerForType.handler = handler;
              originalAddEventListener.call(this, type, handler, options);
            }

            handlerForType.refCount++;
          } catch (e) {
            // Accessing dom properties is always fragile.
            // Also allows us to skip `addEventListenrs` calls with no proper `this` context.
          }
        }

        return originalAddEventListener.call(this, type, listener, options);
      };
    });

    object.fill(
      proto,
      'removeEventListener',
      function (originalRemoveEventListener) {
        return function (

          type,
          listener,
          options,
        ) {
          if (type === 'click' || type == 'keypress') {
            try {
              const el = this ;
              const handlers = el.__sentry_instrumentation_handlers__ || {};
              const handlerForType = handlers[type];

              if (handlerForType) {
                handlerForType.refCount--;
                // If there are no longer any custom handlers of the current type on this element, we can remove ours, too.
                if (handlerForType.refCount <= 0) {
                  originalRemoveEventListener.call(this, type, handlerForType.handler, options);
                  handlerForType.handler = undefined;
                  delete handlers[type]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
                }

                // If there are no longer any custom handlers of any type on this element, cleanup everything.
                if (Object.keys(handlers).length === 0) {
                  delete el.__sentry_instrumentation_handlers__;
                }
              }
            } catch (e) {
              // Accessing dom properties is always fragile.
              // Also allows us to skip `addEventListenrs` calls with no proper `this` context.
            }
          }

          return originalRemoveEventListener.call(this, type, listener, options);
        };
      },
    );
  });
}

let _oldOnErrorHandler = null;
/** JSDoc */
function instrumentError() {
  _oldOnErrorHandler = WINDOW.onerror;

  WINDOW.onerror = function (msg, url, line, column, error) {
    triggerHandlers('error', {
      column,
      error,
      line,
      msg,
      url,
    });

    if (_oldOnErrorHandler && !_oldOnErrorHandler.__SENTRY_LOADER__) {
      // eslint-disable-next-line prefer-rest-params
      return _oldOnErrorHandler.apply(this, arguments);
    }

    return false;
  };

  WINDOW.onerror.__SENTRY_INSTRUMENTED__ = true;
}

let _oldOnUnhandledRejectionHandler = null;
/** JSDoc */
function instrumentUnhandledRejection() {
  _oldOnUnhandledRejectionHandler = WINDOW.onunhandledrejection;

  WINDOW.onunhandledrejection = function (e) {
    triggerHandlers('unhandledrejection', e);

    if (_oldOnUnhandledRejectionHandler && !_oldOnUnhandledRejectionHandler.__SENTRY_LOADER__) {
      // eslint-disable-next-line prefer-rest-params
      return _oldOnUnhandledRejectionHandler.apply(this, arguments);
    }

    return true;
  };

  WINDOW.onunhandledrejection.__SENTRY_INSTRUMENTED__ = true;
}

exports.SENTRY_XHR_DATA_KEY = SENTRY_XHR_DATA_KEY;
exports.addInstrumentationHandler = addInstrumentationHandler;
exports.parseFetchArgs = parseFetchArgs;
//# sourceMappingURL=instrument.js.map
