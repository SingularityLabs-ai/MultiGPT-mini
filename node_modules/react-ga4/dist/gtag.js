"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var gtag = function gtag() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  if (typeof window !== "undefined") {
    var _window;
    if (typeof window.gtag === "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
    }
    (_window = window).gtag.apply(_window, args);
  }
};
var _default = gtag;
exports["default"] = _default;