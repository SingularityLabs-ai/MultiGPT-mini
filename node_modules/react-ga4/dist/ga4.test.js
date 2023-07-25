"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _gtag = _interopRequireDefault(require("./gtag"));
var _ga = _interopRequireDefault(require("./ga4"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var newDate = new Date("2020-01-01");
jest.mock("./gtag");
jest.useFakeTimers("modern").setSystemTime(newDate.getTime());
describe("GA4", function () {
  // Given
  var GA_MEASUREMENT_ID = "GA_MEASUREMENT_ID";
  beforeEach(function () {
    _gtag["default"].mockReset();
    _ga["default"].reset();
  });
  describe("GA4.initialize()", function () {
    it("initialize() default", function () {
      // When
      _ga["default"].initialize(GA_MEASUREMENT_ID);

      // Then
      expect(_gtag["default"]).toHaveBeenNthCalledWith(1, "js", newDate);
      expect(_gtag["default"]).toHaveBeenNthCalledWith(2, "config", GA_MEASUREMENT_ID);
      expect(_gtag["default"]).toHaveBeenCalledTimes(2);
    });
    it("initialize() with options", function () {
      // Given
      var options = {
        gaOptions: {
          cookieUpdate: false
        }
      };

      // When
      _ga["default"].initialize(GA_MEASUREMENT_ID, options);

      // Then
      expect(_gtag["default"]).toHaveBeenNthCalledWith(1, "js", newDate);
      expect(_gtag["default"]).toHaveBeenNthCalledWith(2, "config", GA_MEASUREMENT_ID, {
        cookie_update: false
      });
      expect(_gtag["default"]).toHaveBeenCalledTimes(2);
    });
    it("initialize() in test mode", function () {
      // Given
      var options = {
        testMode: true
      };
      var command = "send";
      var object = {
        hitType: "pageview"
      };

      // When
      _ga["default"].initialize(GA_MEASUREMENT_ID, options);
      _ga["default"].ga(command, object);

      // Then
      expect(_gtag["default"]).toHaveBeenCalledTimes(0);
    });
    it("initialize() multiple products", function () {
      // Given
      var GA_MEASUREMENT_ID2 = "GA_MEASUREMENT_ID2";
      var config = [{
        trackingId: GA_MEASUREMENT_ID
      }, {
        trackingId: GA_MEASUREMENT_ID2
      }];

      // When
      _ga["default"].initialize(config);

      // Then
      expect(_gtag["default"]).toHaveBeenNthCalledWith(1, "js", newDate);
      expect(_gtag["default"]).toHaveBeenNthCalledWith(2, "config", GA_MEASUREMENT_ID);
      expect(_gtag["default"]).toHaveBeenNthCalledWith(3, "config", GA_MEASUREMENT_ID2);
      expect(_gtag["default"]).toHaveBeenCalledTimes(3);
    });
  });
  describe("GA4.ga()", function () {
    it("ga() send pageview", function () {
      // Given
      var command = "send";
      var object = {
        hitType: "pageview"
      };

      // When
      _ga["default"].ga(command, object);

      // Then
      expect(_gtag["default"]).toHaveBeenNthCalledWith(1, "event", "page_view");
    });
    it("ga() send timing", function () {
      // Given
      var command = "send";
      var hitType = "timing";
      var timingCategory = "DOM";
      var timingVar = "first-contentful-paint";
      var timingValue = 120;

      // When
      _ga["default"].ga(command, hitType, timingCategory, timingVar, timingValue);

      // Then
      expect(_gtag["default"]).toHaveBeenNthCalledWith(1, "event", "timing_complete", {
        event_category: timingCategory,
        name: timingVar,
        value: timingValue
      });
    });
    it("ga() callback", function (done) {
      // Given
      var clientId = "clientId value";
      _gtag["default"].mockImplementationOnce(function (command, target, field_name, cb) {
        return cb(clientId);
      });
      var callback = jest.fn(function (tracker) {
        var trackerClientId = tracker.get("clientId");
        var trackerTrackingId = tracker.get("trackingId");
        var trackerApiVersion = tracker.get("apiVersion");
        expect(trackerClientId).toEqual(clientId);
        expect(trackerTrackingId).toEqual(GA_MEASUREMENT_ID);
        expect(trackerApiVersion).toEqual("1");
        done();
      });

      // When
      _ga["default"].ga(callback);

      // Then
      expect(_gtag["default"]).toHaveBeenNthCalledWith(1, "get", GA_MEASUREMENT_ID, "client_id", expect.any(Function));
    });
    it("ga() async callback", function (done) {
      // Given
      var clientId = "clientId value";
      _gtag["default"].mockImplementationOnce(function (command, target, field_name, cb) {
        return cb(clientId);
      });
      var callback = jest.fn( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(tracker) {
          var trackerClientId;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                trackerClientId = tracker.get("clientId");
                expect(trackerClientId).toEqual(clientId);
                done();
              case 3:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());

      // When
      _ga["default"].ga(callback);

      // Then
      expect(_gtag["default"]).toHaveBeenNthCalledWith(1, "get", GA_MEASUREMENT_ID, "client_id", expect.any(Function));
    });
    it("ga() callback queue", function (done) {
      // Given
      var clientId = "clientId value";
      _gtag["default"].mockImplementationOnce(function (command, target, field_name, cb) {
        setImmediate(function () {
          return cb(clientId);
        });
      });
      var callback = jest.fn(function () {
        _ga["default"].ga("send", {
          hitType: "pageview"
        });
        expect(_gtag["default"]).toHaveBeenNthCalledWith(2, "event", "page_view");
        done();
      });

      // When
      _ga["default"].ga(callback);
      _ga["default"].ga("send", "event", "category value");

      // Then
      expect(_gtag["default"]).toHaveBeenNthCalledWith(1, "get", GA_MEASUREMENT_ID, "client_id", expect.any(Function));
      expect(_gtag["default"]).toHaveBeenCalledTimes(1);
      expect(_ga["default"]._isQueuing).toBeTruthy();
      expect(_ga["default"]._queueGtag).toHaveLength(1);
      jest.runAllTimers();
      expect(_ga["default"]._isQueuing).toBeFalsy();
      expect(_ga["default"]._queueGtag).toHaveLength(0);
      expect(_gtag["default"]).toHaveBeenNthCalledWith(3, "event", undefined, {
        event_category: "category value"
      });
    });
  });
  describe("GA4.send()", function () {
    it("send() pageview", function () {
      // Given
      var object = {
        hitType: "pageview"
      };

      // When
      _ga["default"].send(object);

      // Then
      expect(_gtag["default"]).toHaveBeenNthCalledWith(1, "event", "page_view");
    });
  });
  describe("GA4.event()", function () {
    it("event() custom events", function () {
      // Given
      var eventName = "screen_view";
      var eventParams = {
        app_name: "myAppName",
        screen_name: "Home"
      };

      // When
      _ga["default"].event(eventName, eventParams);

      // Then
      expect(_gtag["default"]).toHaveBeenNthCalledWith(1, "event", eventName, eventParams);
    });
    it("event() simple", function () {
      // Given
      var object = {
        category: "category value",
        action: "action value",
        label: "label value",
        nonInteraction: true
      };

      // When
      _ga["default"].event(object);

      // Then
      expect(_gtag["default"]).toHaveBeenNthCalledWith(1, "event", "Action Value", {
        event_category: "Category Value",
        event_label: "Label Value",
        non_interaction: true
      });
    });
  });
  describe("GA4.set()", function () {
    it("set()", function () {
      // Given
      var object = {
        anonymizeIp: true,
        referrer: "/signup",
        allowAdFeatures: "allowAdFeatures value",
        allowAdPersonalizationSignals: "allowAdPersonalizationSignals value",
        page: "/home"
      };

      // When
      _ga["default"].set(object);

      // Then
      expect(_gtag["default"]).toHaveBeenNthCalledWith(1, "set", {
        anonymize_ip: true,
        referrer: "/signup",
        allow_google_signals: "allowAdFeatures value",
        allow_ad_personalization_signals: "allowAdPersonalizationSignals value",
        page_path: "/home"
      });
    });
  });
  describe("Reference", function () {
    it("pageview", function () {
      // Old https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
      // New https://developers.google.com/gtagjs/reference/event#page_view

      // Given
      var hitType = "pageview";
      var path = "/location-pathname";
      var title = "title value";

      // When / Then

      // Without parameters
      _ga["default"].send(hitType);
      expect(_gtag["default"]).toHaveBeenNthCalledWith(1, "event", "page_view");
      _ga["default"].send({
        hitType: hitType
      });
      expect(_gtag["default"]).toHaveBeenNthCalledWith(2, "event", "page_view");
      _ga["default"].ga("send", hitType);
      expect(_gtag["default"]).toHaveBeenNthCalledWith(3, "event", "page_view");

      // With path parameter
      _ga["default"].send({
        hitType: hitType,
        page: path
      });
      expect(_gtag["default"]).toHaveBeenNthCalledWith(4, "event", "page_view", {
        page_path: path
      });
      _ga["default"].ga("send", hitType, path);
      expect(_gtag["default"]).toHaveBeenNthCalledWith(5, "event", "page_view", {
        page_path: path
      });

      // With path and title parameter
      _ga["default"].send({
        hitType: hitType,
        page: path,
        title: title
      });
      expect(_gtag["default"]).toHaveBeenNthCalledWith(6, "event", "page_view", {
        page_path: path,
        page_title: title
      });
      _ga["default"].ga("send", hitType, path, {
        title: title
      });
      expect(_gtag["default"]).toHaveBeenNthCalledWith(7, "event", "page_view", {
        page_path: path,
        page_title: title
      });
    });
  });
  describe("Web vitals", function () {
    it("Web vitals", function () {
      // https://github.com/GoogleChrome/web-vitals/blob/main/README.md
      function sendToGoogleAnalytics(_ref2) {
        var name = _ref2.name,
          delta = _ref2.delta,
          value = _ref2.value,
          id = _ref2.id;
        _ga["default"].send({
          hitType: "event",
          eventCategory: "Web Vitals",
          eventAction: name,
          eventLabel: id,
          nonInteraction: true,
          // Built-in params:
          value: Math.round(name === "CLS" ? delta * 1000 : delta),
          // Use `delta` so the value can be summed.
          // Custom params:
          metric_id: id,
          // Needed to aggregate events.
          metric_value: value,
          // Optional.
          metric_delta: delta // Optional.

          // OPTIONAL: any additional params or debug info here.
          // See: https://web.dev/debug-web-vitals-in-the-field/
          // metric_rating: 'good' | 'ni' | 'poor',
          // debug_info: '...',
          // ...
        });
      }

      sendToGoogleAnalytics({
        name: "CLS",
        delta: 12.34,
        value: 1,
        id: "v2-1632380328370-6426221164013"
      });
      expect(_gtag["default"]).toHaveBeenNthCalledWith(1, "event", "CLS", {
        event_category: "Web Vitals",
        event_label: "v2-1632380328370-6426221164013",
        metric_delta: 12.34,
        metric_id: "v2-1632380328370-6426221164013",
        metric_value: 1,
        non_interaction: true,
        value: 12340
      });
    });
  });
});