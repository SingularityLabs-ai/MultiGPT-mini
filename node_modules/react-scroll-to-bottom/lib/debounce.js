"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = _default;

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

function _default(fn, ms) {
  if (!ms) {
    return fn;
  }

  var last = 0;
  var timeout = null;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var now = (0, _now["default"])();

    if (now - last > ms) {
      fn.apply(void 0, args);
      last = now;
    } else {
      clearTimeout(timeout);
      timeout = (0, _setTimeout2["default"])(function () {
        fn.apply(void 0, args);
        last = (0, _now["default"])();
      }, Math.max(0, ms - now + last));
    }
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWJvdW5jZS5qcyJdLCJuYW1lcyI6WyJmbiIsIm1zIiwibGFzdCIsInRpbWVvdXQiLCJhcmdzIiwibm93IiwiY2xlYXJUaW1lb3V0IiwiTWF0aCIsIm1heCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFlLGtCQUFVQSxFQUFWLEVBQWNDLEVBQWQsRUFBa0I7QUFDL0IsTUFBSSxDQUFDQSxFQUFMLEVBQVM7QUFDUCxXQUFPRCxFQUFQO0FBQ0Q7O0FBRUQsTUFBSUUsSUFBSSxHQUFHLENBQVg7QUFDQSxNQUFJQyxPQUFPLEdBQUcsSUFBZDtBQUVBLFNBQU8sWUFBYTtBQUFBLHNDQUFUQyxJQUFTO0FBQVRBLE1BQUFBLElBQVM7QUFBQTs7QUFDbEIsUUFBTUMsR0FBRyxHQUFHLHNCQUFaOztBQUVBLFFBQUlBLEdBQUcsR0FBR0gsSUFBTixHQUFhRCxFQUFqQixFQUFxQjtBQUNuQkQsTUFBQUEsRUFBRSxNQUFGLFNBQU1JLElBQU47QUFDQUYsTUFBQUEsSUFBSSxHQUFHRyxHQUFQO0FBQ0QsS0FIRCxNQUdPO0FBQ0xDLE1BQUFBLFlBQVksQ0FBQ0gsT0FBRCxDQUFaO0FBRUFBLE1BQUFBLE9BQU8sR0FBRyw2QkFBVyxZQUFNO0FBQ3pCSCxRQUFBQSxFQUFFLE1BQUYsU0FBTUksSUFBTjtBQUNBRixRQUFBQSxJQUFJLEdBQUcsc0JBQVA7QUFDRCxPQUhTLEVBR1BLLElBQUksQ0FBQ0MsR0FBTCxDQUFTLENBQVQsRUFBWVAsRUFBRSxHQUFHSSxHQUFMLEdBQVdILElBQXZCLENBSE8sQ0FBVjtBQUlEO0FBQ0YsR0FkRDtBQWVEIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGZuLCBtcykge1xuICBpZiAoIW1zKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgbGV0IGxhc3QgPSAwO1xuICBsZXQgdGltZW91dCA9IG51bGw7XG5cbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcblxuICAgIGlmIChub3cgLSBsYXN0ID4gbXMpIHtcbiAgICAgIGZuKC4uLmFyZ3MpO1xuICAgICAgbGFzdCA9IG5vdztcbiAgICB9IGVsc2Uge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGZuKC4uLmFyZ3MpO1xuICAgICAgICBsYXN0ID0gRGF0ZS5ub3coKTtcbiAgICAgIH0sIE1hdGgubWF4KDAsIG1zIC0gbm93ICsgbGFzdCkpO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==