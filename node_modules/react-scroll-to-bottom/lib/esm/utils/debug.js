import _slicedToArray from "@babel/runtime-corejs3/helpers/slicedToArray";
import _toConsumableArray from "@babel/runtime-corejs3/helpers/toConsumableArray";
import _concatInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/concat";
import _Array$isArray from "@babel/runtime-corejs3/core-js-stable/array/is-array";
import _forEachInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/for-each";

/* eslint no-console: ["off"] */
import styleConsole from './styleConsole';

function format(category, arg0) {
  var _context, _context2;

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return _concatInstanceProperty(_context = [_concatInstanceProperty(_context2 = "%c".concat(category, "%c ")).call(_context2, arg0)]).call(_context, _toConsumableArray(styleConsole('green', 'white')), args);
}

export default function debug(category) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$force = _ref.force,
      force = _ref$force === void 0 ? false : _ref$force;

  if (!force) {
    return function () {
      return 0;
    };
  }

  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (!args.length) {
      return;
    }

    var _args = args,
        _args2 = _slicedToArray(_args, 1),
        arg0 = _args2[0];

    if (typeof arg0 === 'function') {
      args = arg0();
    }

    var lines = _Array$isArray(args[0]) ? args : [args];
    var oneLiner = lines.length === 1;

    _forEachInstanceProperty(lines).call(lines, function (line, index) {
      if (oneLiner) {
        var _console, _context3;

        (_console = console).log.apply(_console, _toConsumableArray(format.apply(void 0, _concatInstanceProperty(_context3 = [category]).call(_context3, _toConsumableArray(line)))));
      } else if (index) {
        var _console2;

        (_console2 = console).log.apply(_console2, _toConsumableArray(_Array$isArray(line) ? line : [line]));
      } else {
        var _console3, _context4;

        (_console3 = console).groupCollapsed.apply(_console3, _toConsumableArray(format.apply(void 0, _concatInstanceProperty(_context4 = [category]).call(_context4, _toConsumableArray(line)))));
      }
    });

    oneLiner || console.groupEnd();
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9kZWJ1Zy5qcyJdLCJuYW1lcyI6WyJzdHlsZUNvbnNvbGUiLCJmb3JtYXQiLCJjYXRlZ29yeSIsImFyZzAiLCJhcmdzIiwiZGVidWciLCJmb3JjZSIsImxlbmd0aCIsImxpbmVzIiwib25lTGluZXIiLCJsaW5lIiwiaW5kZXgiLCJjb25zb2xlIiwibG9nIiwiZ3JvdXBDb2xsYXBzZWQiLCJncm91cEVuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFFQSxPQUFPQSxZQUFQLE1BQXlCLGdCQUF6Qjs7QUFFQSxTQUFTQyxNQUFULENBQWdCQyxRQUFoQixFQUEwQkMsSUFBMUIsRUFBeUM7QUFBQTs7QUFBQSxvQ0FBTkMsSUFBTTtBQUFOQSxJQUFBQSxJQUFNO0FBQUE7O0FBQ3ZDLDZGQUFhRixRQUFiLDBCQUEyQkMsSUFBM0Isc0NBQXNDSCxZQUFZLENBQUMsT0FBRCxFQUFVLE9BQVYsQ0FBbEQsR0FBeUVJLElBQXpFO0FBQ0Q7O0FBRUQsZUFBZSxTQUFTQyxLQUFULENBQWVILFFBQWYsRUFBaUQ7QUFBQSxpRkFBSixFQUFJO0FBQUEsd0JBQXRCSSxLQUFzQjtBQUFBLE1BQXRCQSxLQUFzQiwyQkFBZCxLQUFjOztBQUM5RCxNQUFJLENBQUNBLEtBQUwsRUFBWTtBQUNWLFdBQU87QUFBQSxhQUFNLENBQU47QUFBQSxLQUFQO0FBQ0Q7O0FBRUQsU0FBTyxZQUFhO0FBQUEsdUNBQVRGLElBQVM7QUFBVEEsTUFBQUEsSUFBUztBQUFBOztBQUNsQixRQUFJLENBQUNBLElBQUksQ0FBQ0csTUFBVixFQUFrQjtBQUNoQjtBQUNEOztBQUVELGdCQUFlSCxJQUFmO0FBQUE7QUFBQSxRQUFPRCxJQUFQOztBQUVBLFFBQUksT0FBT0EsSUFBUCxLQUFnQixVQUFwQixFQUFnQztBQUM5QkMsTUFBQUEsSUFBSSxHQUFHRCxJQUFJLEVBQVg7QUFDRDs7QUFFRCxRQUFNSyxLQUFLLEdBQUcsZUFBY0osSUFBSSxDQUFDLENBQUQsQ0FBbEIsSUFBeUJBLElBQXpCLEdBQWdDLENBQUNBLElBQUQsQ0FBOUM7QUFDQSxRQUFNSyxRQUFRLEdBQUdELEtBQUssQ0FBQ0QsTUFBTixLQUFpQixDQUFsQzs7QUFFQSw2QkFBQUMsS0FBSyxNQUFMLENBQUFBLEtBQUssRUFBUyxVQUFDRSxJQUFELEVBQU9DLEtBQVAsRUFBaUI7QUFDN0IsVUFBSUYsUUFBSixFQUFjO0FBQUE7O0FBQ1osb0JBQUFHLE9BQU8sRUFBQ0MsR0FBUixvQ0FBZVosTUFBTSxNQUFOLDhDQUFPQyxRQUFQLHNDQUFvQlEsSUFBcEIsR0FBZjtBQUNELE9BRkQsTUFFTyxJQUFJQyxLQUFKLEVBQVc7QUFBQTs7QUFDaEIscUJBQUFDLE9BQU8sRUFBQ0MsR0FBUixxQ0FBZ0IsZUFBY0gsSUFBZCxJQUFzQkEsSUFBdEIsR0FBNkIsQ0FBQ0EsSUFBRCxDQUE3QztBQUNELE9BRk0sTUFFQTtBQUFBOztBQUNMLHFCQUFBRSxPQUFPLEVBQUNFLGNBQVIscUNBQTBCYixNQUFNLE1BQU4sOENBQU9DLFFBQVAsc0NBQW9CUSxJQUFwQixHQUExQjtBQUNEO0FBQ0YsS0FSSSxDQUFMOztBQVVBRCxJQUFBQSxRQUFRLElBQUlHLE9BQU8sQ0FBQ0csUUFBUixFQUFaO0FBQ0QsR0F6QkQ7QUEwQkQiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQgbm8tY29uc29sZTogW1wib2ZmXCJdICovXG5cbmltcG9ydCBzdHlsZUNvbnNvbGUgZnJvbSAnLi9zdHlsZUNvbnNvbGUnO1xuXG5mdW5jdGlvbiBmb3JtYXQoY2F0ZWdvcnksIGFyZzAsIC4uLmFyZ3MpIHtcbiAgcmV0dXJuIFtgJWMke2NhdGVnb3J5fSVjICR7YXJnMH1gLCAuLi5zdHlsZUNvbnNvbGUoJ2dyZWVuJywgJ3doaXRlJyksIC4uLmFyZ3NdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWJ1ZyhjYXRlZ29yeSwgeyBmb3JjZSA9IGZhbHNlIH0gPSB7fSkge1xuICBpZiAoIWZvcmNlKSB7XG4gICAgcmV0dXJuICgpID0+IDA7XG4gIH1cblxuICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICBpZiAoIWFyZ3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgW2FyZzBdID0gYXJncztcblxuICAgIGlmICh0eXBlb2YgYXJnMCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYXJncyA9IGFyZzAoKTtcbiAgICB9XG5cbiAgICBjb25zdCBsaW5lcyA9IEFycmF5LmlzQXJyYXkoYXJnc1swXSkgPyBhcmdzIDogW2FyZ3NdO1xuICAgIGNvbnN0IG9uZUxpbmVyID0gbGluZXMubGVuZ3RoID09PSAxO1xuXG4gICAgbGluZXMuZm9yRWFjaCgobGluZSwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChvbmVMaW5lcikge1xuICAgICAgICBjb25zb2xlLmxvZyguLi5mb3JtYXQoY2F0ZWdvcnksIC4uLmxpbmUpKTtcbiAgICAgIH0gZWxzZSBpZiAoaW5kZXgpIHtcbiAgICAgICAgY29uc29sZS5sb2coLi4uKEFycmF5LmlzQXJyYXkobGluZSkgPyBsaW5lIDogW2xpbmVdKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKC4uLmZvcm1hdChjYXRlZ29yeSwgLi4ubGluZSkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgb25lTGluZXIgfHwgY29uc29sZS5ncm91cEVuZCgpO1xuICB9O1xufVxuIl19