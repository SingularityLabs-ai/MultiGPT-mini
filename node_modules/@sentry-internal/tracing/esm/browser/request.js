import { hasTracingEnabled, getCurrentHub } from '@sentry/core';
import { addInstrumentationHandler, dynamicSamplingContextToSentryBaggageHeader, isInstanceOf, BAGGAGE_HEADER_NAME, SENTRY_XHR_DATA_KEY, stringMatchesSomePattern } from '@sentry/utils';

/* eslint-disable max-lines */

const DEFAULT_TRACE_PROPAGATION_TARGETS = ['localhost', /^\/(?!\/)/];

/** Options for Request Instrumentation */

const defaultRequestInstrumentationOptions = {
  traceFetch: true,
  traceXHR: true,
  // TODO (v8): Remove this property
  tracingOrigins: DEFAULT_TRACE_PROPAGATION_TARGETS,
  tracePropagationTargets: DEFAULT_TRACE_PROPAGATION_TARGETS,
};

/** Registers span creators for xhr and fetch requests  */
function instrumentOutgoingRequests(_options) {
  // eslint-disable-next-line deprecation/deprecation
  const { traceFetch, traceXHR, tracePropagationTargets, tracingOrigins, shouldCreateSpanForRequest } = {
    traceFetch: defaultRequestInstrumentationOptions.traceFetch,
    traceXHR: defaultRequestInstrumentationOptions.traceXHR,
    ..._options,
  };

  const shouldCreateSpan =
    typeof shouldCreateSpanForRequest === 'function' ? shouldCreateSpanForRequest : (_) => true;

  // TODO(v8) Remove tracingOrigins here
  // The only reason we're passing it in here is because this instrumentOutgoingRequests function is publicly exported
  // and we don't want to break the API. We can remove it in v8.
  const shouldAttachHeadersWithTargets = (url) =>
    shouldAttachHeaders(url, tracePropagationTargets || tracingOrigins);

  const spans = {};

  if (traceFetch) {
    addInstrumentationHandler('fetch', (handlerData) => {
      fetchCallback(handlerData, shouldCreateSpan, shouldAttachHeadersWithTargets, spans);
    });
  }

  if (traceXHR) {
    addInstrumentationHandler('xhr', (handlerData) => {
      xhrCallback(handlerData, shouldCreateSpan, shouldAttachHeadersWithTargets, spans);
    });
  }
}

/**
 * A function that determines whether to attach tracing headers to a request.
 * This was extracted from `instrumentOutgoingRequests` to make it easier to test shouldAttachHeaders.
 * We only export this fuction for testing purposes.
 */
function shouldAttachHeaders(url, tracePropagationTargets) {
  return stringMatchesSomePattern(url, tracePropagationTargets || DEFAULT_TRACE_PROPAGATION_TARGETS);
}

/**
 * Create and track fetch request spans
 */
function fetchCallback(
  handlerData,
  shouldCreateSpan,
  shouldAttachHeaders,
  spans,
) {
  if (!hasTracingEnabled() || !(handlerData.fetchData && shouldCreateSpan(handlerData.fetchData.url))) {
    return;
  }

  if (handlerData.endTimestamp) {
    const spanId = handlerData.fetchData.__span;
    if (!spanId) return;

    const span = spans[spanId];
    if (span) {
      if (handlerData.response) {
        // TODO (kmclb) remove this once types PR goes through
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        span.setHttpStatus(handlerData.response.status);

        const contentLength =
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          handlerData.response && handlerData.response.headers && handlerData.response.headers.get('content-length');

        const contentLengthNum = parseInt(contentLength);
        if (contentLengthNum > 0) {
          span.setData('http.response_content_length', contentLengthNum);
        }
      } else if (handlerData.error) {
        span.setStatus('internal_error');
      }
      span.finish();

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete spans[spanId];
    }
    return;
  }

  const currentScope = getCurrentHub().getScope();
  const currentSpan = currentScope && currentScope.getSpan();
  const activeTransaction = currentSpan && currentSpan.transaction;

  if (currentSpan && activeTransaction) {
    const { method, url } = handlerData.fetchData;
    const span = currentSpan.startChild({
      data: {
        url,
        type: 'fetch',
        'http.method': method,
      },
      description: `${method} ${url}`,
      op: 'http.client',
    });

    handlerData.fetchData.__span = span.spanId;
    spans[span.spanId] = span;

    const request = handlerData.args[0];

    // In case the user hasn't set the second argument of a fetch call we default it to `{}`.
    handlerData.args[1] = handlerData.args[1] || {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = handlerData.args[1];

    if (shouldAttachHeaders(handlerData.fetchData.url)) {
      options.headers = addTracingHeadersToFetchRequest(
        request,
        activeTransaction.getDynamicSamplingContext(),
        span,
        options,
      );
    }
  }
}

/**
 * Adds sentry-trace and baggage headers to the various forms of fetch headers
 */
function addTracingHeadersToFetchRequest(
  request, // unknown is actually type Request but we can't export DOM types from this package,
  dynamicSamplingContext,
  span,
  options

,
) {
  const sentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader(dynamicSamplingContext);
  const sentryTraceHeader = span.toTraceparent();

  const headers =
    typeof Request !== 'undefined' && isInstanceOf(request, Request) ? (request ).headers : options.headers;

  if (!headers) {
    return { 'sentry-trace': sentryTraceHeader, baggage: sentryBaggageHeader };
  } else if (typeof Headers !== 'undefined' && isInstanceOf(headers, Headers)) {
    const newHeaders = new Headers(headers );

    newHeaders.append('sentry-trace', sentryTraceHeader);

    if (sentryBaggageHeader) {
      // If the same header is appended multiple times the browser will merge the values into a single request header.
      // Its therefore safe to simply push a "baggage" entry, even though there might already be another baggage header.
      newHeaders.append(BAGGAGE_HEADER_NAME, sentryBaggageHeader);
    }

    return newHeaders ;
  } else if (Array.isArray(headers)) {
    const newHeaders = [...headers, ['sentry-trace', sentryTraceHeader]];

    if (sentryBaggageHeader) {
      // If there are multiple entries with the same key, the browser will merge the values into a single request header.
      // Its therefore safe to simply push a "baggage" entry, even though there might already be another baggage header.
      newHeaders.push([BAGGAGE_HEADER_NAME, sentryBaggageHeader]);
    }

    return newHeaders ;
  } else {
    const existingBaggageHeader = 'baggage' in headers ? headers.baggage : undefined;
    const newBaggageHeaders = [];

    if (Array.isArray(existingBaggageHeader)) {
      newBaggageHeaders.push(...existingBaggageHeader);
    } else if (existingBaggageHeader) {
      newBaggageHeaders.push(existingBaggageHeader);
    }

    if (sentryBaggageHeader) {
      newBaggageHeaders.push(sentryBaggageHeader);
    }

    return {
      ...(headers ),
      'sentry-trace': sentryTraceHeader,
      baggage: newBaggageHeaders.length > 0 ? newBaggageHeaders.join(',') : undefined,
    };
  }
}

/**
 * Create and track xhr request spans
 */
function xhrCallback(
  handlerData,
  shouldCreateSpan,
  shouldAttachHeaders,
  spans,
) {
  const xhr = handlerData.xhr;
  const sentryXhrData = xhr && xhr[SENTRY_XHR_DATA_KEY];

  if (
    !hasTracingEnabled() ||
    (xhr && xhr.__sentry_own_request__) ||
    !(xhr && sentryXhrData && shouldCreateSpan(sentryXhrData.url))
  ) {
    return;
  }

  // check first if the request has finished and is tracked by an existing span which should now end
  if (handlerData.endTimestamp) {
    const spanId = xhr.__sentry_xhr_span_id__;
    if (!spanId) return;

    const span = spans[spanId];
    if (span) {
      span.setHttpStatus(sentryXhrData.status_code);
      span.finish();

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete spans[spanId];
    }
    return;
  }

  const currentScope = getCurrentHub().getScope();
  const currentSpan = currentScope && currentScope.getSpan();
  const activeTransaction = currentSpan && currentSpan.transaction;

  if (currentSpan && activeTransaction) {
    const span = currentSpan.startChild({
      data: {
        ...sentryXhrData.data,
        type: 'xhr',
        'http.method': sentryXhrData.method,
        url: sentryXhrData.url,
      },
      description: `${sentryXhrData.method} ${sentryXhrData.url}`,
      op: 'http.client',
    });

    xhr.__sentry_xhr_span_id__ = span.spanId;
    spans[xhr.__sentry_xhr_span_id__] = span;

    if (xhr.setRequestHeader && shouldAttachHeaders(sentryXhrData.url)) {
      try {
        xhr.setRequestHeader('sentry-trace', span.toTraceparent());

        const dynamicSamplingContext = activeTransaction.getDynamicSamplingContext();
        const sentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader(dynamicSamplingContext);

        if (sentryBaggageHeader) {
          // From MDN: "If this method is called several times with the same header, the values are merged into one single request header."
          // We can therefore simply set a baggage header without checking what was there before
          // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader
          xhr.setRequestHeader(BAGGAGE_HEADER_NAME, sentryBaggageHeader);
        }
      } catch (_) {
        // Error: InvalidStateError: Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.
      }
    }
  }
}

export { DEFAULT_TRACE_PROPAGATION_TARGETS, addTracingHeadersToFetchRequest, defaultRequestInstrumentationOptions, fetchCallback, instrumentOutgoingRequests, shouldAttachHeaders, xhrCallback };
//# sourceMappingURL=request.js.map
