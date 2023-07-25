"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = useObserveScrollPosition;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _react = require("react");

var _useInternalContext2 = _interopRequireDefault(require("./internal/useInternalContext"));

function useObserveScrollPosition(observer) {
  var _context;

  var deps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (observer && typeof observer !== 'function') {
    console.error('react-scroll-to-bottom: First argument passed to "useObserveScrollPosition" must be a function.');
  } else if (!(0, _isArray["default"])(deps)) {
    console.error('react-scroll-to-bottom: Second argument passed to "useObserveScrollPosition" must be an array if specified.');
  }

  var _useInternalContext = (0, _useInternalContext2["default"])(),
      observeScrollPosition = _useInternalContext.observeScrollPosition;
  /* eslint-disable-next-line react-hooks/exhaustive-deps */


  (0, _react.useEffect)(function () {
    return observer && observeScrollPosition(observer);
  }, (0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(deps), [!observer, observeScrollPosition]));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ob29rcy91c2VPYnNlcnZlU2Nyb2xsUG9zaXRpb24uanMiXSwibmFtZXMiOlsidXNlT2JzZXJ2ZVNjcm9sbFBvc2l0aW9uIiwib2JzZXJ2ZXIiLCJkZXBzIiwiY29uc29sZSIsImVycm9yIiwib2JzZXJ2ZVNjcm9sbFBvc2l0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFFZSxTQUFTQSx3QkFBVCxDQUFrQ0MsUUFBbEMsRUFBdUQ7QUFBQTs7QUFBQSxNQUFYQyxJQUFXLHVFQUFKLEVBQUk7O0FBQ3BFLE1BQUlELFFBQVEsSUFBSSxPQUFPQSxRQUFQLEtBQW9CLFVBQXBDLEVBQWdEO0FBQzlDRSxJQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyxpR0FBZDtBQUNELEdBRkQsTUFFTyxJQUFJLENBQUMseUJBQWNGLElBQWQsQ0FBTCxFQUEwQjtBQUMvQkMsSUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQ0UsNkdBREY7QUFHRDs7QUFFRCw0QkFBa0Msc0NBQWxDO0FBQUEsTUFBUUMscUJBQVIsdUJBQVFBLHFCQUFSO0FBRUE7OztBQUNBLHdCQUFVO0FBQUEsV0FBTUosUUFBUSxJQUFJSSxxQkFBcUIsQ0FBQ0osUUFBRCxDQUF2QztBQUFBLEdBQVYsNEZBQWlFQyxJQUFqRSxJQUF1RSxDQUFDRCxRQUF4RSxFQUFrRkkscUJBQWxGO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB1c2VJbnRlcm5hbENvbnRleHQgZnJvbSAnLi9pbnRlcm5hbC91c2VJbnRlcm5hbENvbnRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VPYnNlcnZlU2Nyb2xsUG9zaXRpb24ob2JzZXJ2ZXIsIGRlcHMgPSBbXSkge1xuICBpZiAob2JzZXJ2ZXIgJiYgdHlwZW9mIG9ic2VydmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgY29uc29sZS5lcnJvcigncmVhY3Qtc2Nyb2xsLXRvLWJvdHRvbTogRmlyc3QgYXJndW1lbnQgcGFzc2VkIHRvIFwidXNlT2JzZXJ2ZVNjcm9sbFBvc2l0aW9uXCIgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICB9IGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KGRlcHMpKSB7XG4gICAgY29uc29sZS5lcnJvcihcbiAgICAgICdyZWFjdC1zY3JvbGwtdG8tYm90dG9tOiBTZWNvbmQgYXJndW1lbnQgcGFzc2VkIHRvIFwidXNlT2JzZXJ2ZVNjcm9sbFBvc2l0aW9uXCIgbXVzdCBiZSBhbiBhcnJheSBpZiBzcGVjaWZpZWQuJ1xuICAgICk7XG4gIH1cblxuICBjb25zdCB7IG9ic2VydmVTY3JvbGxQb3NpdGlvbiB9ID0gdXNlSW50ZXJuYWxDb250ZXh0KCk7XG5cbiAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwcyAqL1xuICB1c2VFZmZlY3QoKCkgPT4gb2JzZXJ2ZXIgJiYgb2JzZXJ2ZVNjcm9sbFBvc2l0aW9uKG9ic2VydmVyKSwgWy4uLmRlcHMsICFvYnNlcnZlciwgb2JzZXJ2ZVNjcm9sbFBvc2l0aW9uXSk7XG59XG4iXX0=