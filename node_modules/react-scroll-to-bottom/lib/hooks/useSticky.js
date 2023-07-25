"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = useSticky;

var _useStateContext2 = _interopRequireDefault(require("./internal/useStateContext"));

/* eslint no-magic-numbers: ["error", { "ignore": [2] }] */
function useSticky() {
  var _useStateContext = (0, _useStateContext2["default"])(2),
      sticky = _useStateContext.sticky;

  return [sticky];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ob29rcy91c2VTdGlja3kuanMiXSwibmFtZXMiOlsidXNlU3RpY2t5Iiwic3RpY2t5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFQTs7QUFGQTtBQUllLFNBQVNBLFNBQVQsR0FBcUI7QUFDbEMseUJBQW1CLGtDQUFnQixDQUFoQixDQUFuQjtBQUFBLE1BQVFDLE1BQVIsb0JBQVFBLE1BQVI7O0FBRUEsU0FBTyxDQUFDQSxNQUFELENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludCBuby1tYWdpYy1udW1iZXJzOiBbXCJlcnJvclwiLCB7IFwiaWdub3JlXCI6IFsyXSB9XSAqL1xuXG5pbXBvcnQgdXNlU3RhdGVDb250ZXh0IGZyb20gJy4vaW50ZXJuYWwvdXNlU3RhdGVDb250ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlU3RpY2t5KCkge1xuICBjb25zdCB7IHN0aWNreSB9ID0gdXNlU3RhdGVDb250ZXh0KDIpO1xuXG4gIHJldHVybiBbc3RpY2t5XTtcbn1cbiJdfQ==