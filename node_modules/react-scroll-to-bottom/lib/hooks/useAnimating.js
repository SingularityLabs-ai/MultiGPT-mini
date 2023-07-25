"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = useAnimating;

var _useStateContext2 = _interopRequireDefault(require("./internal/useStateContext"));

/* eslint no-magic-numbers: ["error", { "ignore": [2] }] */
function useAnimating() {
  var _useStateContext = (0, _useStateContext2["default"])(2),
      animating = _useStateContext.animating;

  return [animating];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ob29rcy91c2VBbmltYXRpbmcuanMiXSwibmFtZXMiOlsidXNlQW5pbWF0aW5nIiwiYW5pbWF0aW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFQTs7QUFGQTtBQUllLFNBQVNBLFlBQVQsR0FBd0I7QUFDckMseUJBQXNCLGtDQUFnQixDQUFoQixDQUF0QjtBQUFBLE1BQVFDLFNBQVIsb0JBQVFBLFNBQVI7O0FBRUEsU0FBTyxDQUFDQSxTQUFELENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludCBuby1tYWdpYy1udW1iZXJzOiBbXCJlcnJvclwiLCB7IFwiaWdub3JlXCI6IFsyXSB9XSAqL1xuXG5pbXBvcnQgdXNlU3RhdGVDb250ZXh0IGZyb20gJy4vaW50ZXJuYWwvdXNlU3RhdGVDb250ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlQW5pbWF0aW5nKCkge1xuICBjb25zdCB7IGFuaW1hdGluZyB9ID0gdXNlU3RhdGVDb250ZXh0KDIpO1xuXG4gIHJldHVybiBbYW5pbWF0aW5nXTtcbn1cbiJdfQ==