Object.defineProperty(exports, '__esModule', { value: true });

const utils = require('@sentry/utils');

/**
 * Keeps track of finished spans for a given transaction
 * @internal
 * @hideconstructor
 * @hidden
 */
class SpanRecorder {
   __init() {this.spans = [];}

   constructor(maxlen = 1000) {SpanRecorder.prototype.__init.call(this);
    this._maxlen = maxlen;
  }

  /**
   * This is just so that we don't run out of memory while recording a lot
   * of spans. At some point we just stop and flush out the start of the
   * trace tree (i.e.the first n spans with the smallest
   * start_timestamp).
   */
   add(span) {
    if (this.spans.length > this._maxlen) {
      span.spanRecorder = undefined;
    } else {
      this.spans.push(span);
    }
  }
}

/**
 * Span contains all data about a span
 */
class Span  {
  /**
   * @inheritDoc
   */
   __init2() {this.traceId = utils.uuid4();}

  /**
   * @inheritDoc
   */
   __init3() {this.spanId = utils.uuid4().substring(16);}

  /**
   * @inheritDoc
   */

  /**
   * Internal keeper of the status
   */

  /**
   * @inheritDoc
   */

  /**
   * Timestamp in seconds when the span was created.
   */
   __init4() {this.startTimestamp = utils.timestampInSeconds();}

  /**
   * Timestamp in seconds when the span ended.
   */

  /**
   * @inheritDoc
   */

  /**
   * @inheritDoc
   */

  /**
   * @inheritDoc
   */
   __init5() {this.tags = {};}

  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
   __init6() {this.data = {};}

  /**
   * List of spans that were finalized
   */

  /**
   * @inheritDoc
   */

  /**
   * The instrumenter that created this span.
   */
   __init7() {this.instrumenter = 'sentry';}

  /**
   * You should never call the constructor manually, always use `Sentry.startTransaction()`
   * or call `startChild()` on an existing span.
   * @internal
   * @hideconstructor
   * @hidden
   */
   constructor(spanContext) {Span.prototype.__init2.call(this);Span.prototype.__init3.call(this);Span.prototype.__init4.call(this);Span.prototype.__init5.call(this);Span.prototype.__init6.call(this);Span.prototype.__init7.call(this);
    if (!spanContext) {
      return this;
    }
    if (spanContext.traceId) {
      this.traceId = spanContext.traceId;
    }
    if (spanContext.spanId) {
      this.spanId = spanContext.spanId;
    }
    if (spanContext.parentSpanId) {
      this.parentSpanId = spanContext.parentSpanId;
    }
    // We want to include booleans as well here
    if ('sampled' in spanContext) {
      this.sampled = spanContext.sampled;
    }
    if (spanContext.op) {
      this.op = spanContext.op;
    }
    if (spanContext.description) {
      this.description = spanContext.description;
    }
    if (spanContext.data) {
      this.data = spanContext.data;
    }
    if (spanContext.tags) {
      this.tags = spanContext.tags;
    }
    if (spanContext.status) {
      this.status = spanContext.status;
    }
    if (spanContext.startTimestamp) {
      this.startTimestamp = spanContext.startTimestamp;
    }
    if (spanContext.endTimestamp) {
      this.endTimestamp = spanContext.endTimestamp;
    }
    if (spanContext.instrumenter) {
      this.instrumenter = spanContext.instrumenter;
    }
  }

  /**
   * @inheritDoc
   */
   startChild(
    spanContext,
  ) {
    const childSpan = new Span({
      ...spanContext,
      parentSpanId: this.spanId,
      sampled: this.sampled,
      traceId: this.traceId,
    });

    childSpan.spanRecorder = this.spanRecorder;
    if (childSpan.spanRecorder) {
      childSpan.spanRecorder.add(childSpan);
    }

    childSpan.transaction = this.transaction;

    if ((typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && childSpan.transaction) {
      const opStr = (spanContext && spanContext.op) || '< unknown op >';
      const nameStr = childSpan.transaction.name || '< unknown name >';
      const idStr = childSpan.transaction.spanId;

      const logMessage = `[Tracing] Starting '${opStr}' span on transaction '${nameStr}' (${idStr}).`;
      childSpan.transaction.metadata.spanMetadata[childSpan.spanId] = { logMessage };
      utils.logger.log(logMessage);
    }

    return childSpan;
  }

  /**
   * @inheritDoc
   */
   setTag(key, value) {
    this.tags = { ...this.tags, [key]: value };
    return this;
  }

  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
   setData(key, value) {
    this.data = { ...this.data, [key]: value };
    return this;
  }

  /**
   * @inheritDoc
   */
   setStatus(value) {
    this.status = value;
    return this;
  }

  /**
   * @inheritDoc
   */
   setHttpStatus(httpStatus) {
    this.setTag('http.status_code', String(httpStatus));
    const spanStatus = spanStatusfromHttpCode(httpStatus);
    if (spanStatus !== 'unknown_error') {
      this.setStatus(spanStatus);
    }
    return this;
  }

  /**
   * @inheritDoc
   */
   isSuccess() {
    return this.status === 'ok';
  }

  /**
   * @inheritDoc
   */
   finish(endTimestamp) {
    if (
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
      // Don't call this for transactions
      this.transaction &&
      this.transaction.spanId !== this.spanId
    ) {
      const { logMessage } = this.transaction.metadata.spanMetadata[this.spanId];
      if (logMessage) {
        utils.logger.log((logMessage ).replace('Starting', 'Finishing'));
      }
    }

    this.endTimestamp = typeof endTimestamp === 'number' ? endTimestamp : utils.timestampInSeconds();
  }

  /**
   * @inheritDoc
   */
   toTraceparent() {
    let sampledString = '';
    if (this.sampled !== undefined) {
      sampledString = this.sampled ? '-1' : '-0';
    }
    return `${this.traceId}-${this.spanId}${sampledString}`;
  }

  /**
   * @inheritDoc
   */
   toContext() {
    return utils.dropUndefinedKeys({
      data: this.data,
      description: this.description,
      endTimestamp: this.endTimestamp,
      op: this.op,
      parentSpanId: this.parentSpanId,
      sampled: this.sampled,
      spanId: this.spanId,
      startTimestamp: this.startTimestamp,
      status: this.status,
      tags: this.tags,
      traceId: this.traceId,
    });
  }

  /**
   * @inheritDoc
   */
   updateWithContext(spanContext) {
    this.data = spanContext.data || {};
    this.description = spanContext.description;
    this.endTimestamp = spanContext.endTimestamp;
    this.op = spanContext.op;
    this.parentSpanId = spanContext.parentSpanId;
    this.sampled = spanContext.sampled;
    this.spanId = spanContext.spanId || this.spanId;
    this.startTimestamp = spanContext.startTimestamp || this.startTimestamp;
    this.status = spanContext.status;
    this.tags = spanContext.tags || {};
    this.traceId = spanContext.traceId || this.traceId;

    return this;
  }

  /**
   * @inheritDoc
   */
   getTraceContext() {
    return utils.dropUndefinedKeys({
      data: Object.keys(this.data).length > 0 ? this.data : undefined,
      description: this.description,
      op: this.op,
      parent_span_id: this.parentSpanId,
      span_id: this.spanId,
      status: this.status,
      tags: Object.keys(this.tags).length > 0 ? this.tags : undefined,
      trace_id: this.traceId,
    });
  }

  /**
   * @inheritDoc
   */
   toJSON()

 {
    return utils.dropUndefinedKeys({
      data: Object.keys(this.data).length > 0 ? this.data : undefined,
      description: this.description,
      op: this.op,
      parent_span_id: this.parentSpanId,
      span_id: this.spanId,
      start_timestamp: this.startTimestamp,
      status: this.status,
      tags: Object.keys(this.tags).length > 0 ? this.tags : undefined,
      timestamp: this.endTimestamp,
      trace_id: this.traceId,
    });
  }
}

/**
 * Converts a HTTP status code into a {@link SpanStatusType}.
 *
 * @param httpStatus The HTTP response status code.
 * @returns The span status or unknown_error.
 */
function spanStatusfromHttpCode(httpStatus) {
  if (httpStatus < 400 && httpStatus >= 100) {
    return 'ok';
  }

  if (httpStatus >= 400 && httpStatus < 500) {
    switch (httpStatus) {
      case 401:
        return 'unauthenticated';
      case 403:
        return 'permission_denied';
      case 404:
        return 'not_found';
      case 409:
        return 'already_exists';
      case 413:
        return 'failed_precondition';
      case 429:
        return 'resource_exhausted';
      default:
        return 'invalid_argument';
    }
  }

  if (httpStatus >= 500 && httpStatus < 600) {
    switch (httpStatus) {
      case 501:
        return 'unimplemented';
      case 503:
        return 'unavailable';
      case 504:
        return 'deadline_exceeded';
      default:
        return 'internal_error';
    }
  }

  return 'unknown_error';
}

exports.Span = Span;
exports.SpanRecorder = SpanRecorder;
exports.spanStatusfromHttpCode = spanStatusfromHttpCode;
//# sourceMappingURL=span.js.map
