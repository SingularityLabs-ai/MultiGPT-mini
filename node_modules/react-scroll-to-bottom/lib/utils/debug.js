"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = debug;

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _styleConsole = _interopRequireDefault(require("./styleConsole"));

/* eslint no-console: ["off"] */
function format(category, arg0) {
  var _context, _context2;

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return (0, _concat["default"])(_context = [(0, _concat["default"])(_context2 = "%c".concat(category, "%c ")).call(_context2, arg0)]).call(_context, (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('green', 'white')), args);
}

function debug(category) {
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
        _args2 = (0, _slicedToArray2["default"])(_args, 1),
        arg0 = _args2[0];

    if (typeof arg0 === 'function') {
      args = arg0();
    }

    var lines = (0, _isArray["default"])(args[0]) ? args : [args];
    var oneLiner = lines.length === 1;
    (0, _forEach["default"])(lines).call(lines, function (line, index) {
      if (oneLiner) {
        var _console, _context3;

        (_console = console).log.apply(_console, (0, _toConsumableArray2["default"])(format.apply(void 0, (0, _concat["default"])(_context3 = [category]).call(_context3, (0, _toConsumableArray2["default"])(line)))));
      } else if (index) {
        var _console2;

        (_console2 = console).log.apply(_console2, (0, _toConsumableArray2["default"])((0, _isArray["default"])(line) ? line : [line]));
      } else {
        var _console3, _context4;

        (_console3 = console).groupCollapsed.apply(_console3, (0, _toConsumableArray2["default"])(format.apply(void 0, (0, _concat["default"])(_context4 = [category]).call(_context4, (0, _toConsumableArray2["default"])(line)))));
      }
    });
    oneLiner || console.groupEnd();
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9kZWJ1Zy5qcyJdLCJuYW1lcyI6WyJmb3JtYXQiLCJjYXRlZ29yeSIsImFyZzAiLCJhcmdzIiwiZGVidWciLCJmb3JjZSIsImxlbmd0aCIsImxpbmVzIiwib25lTGluZXIiLCJsaW5lIiwiaW5kZXgiLCJjb25zb2xlIiwibG9nIiwiZ3JvdXBDb2xsYXBzZWQiLCJncm91cEVuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOztBQUZBO0FBSUEsU0FBU0EsTUFBVCxDQUFnQkMsUUFBaEIsRUFBMEJDLElBQTFCLEVBQXlDO0FBQUE7O0FBQUEsb0NBQU5DLElBQU07QUFBTkEsSUFBQUEsSUFBTTtBQUFBOztBQUN2Qyw2RkFBYUYsUUFBYiwwQkFBMkJDLElBQTNCLHVEQUFzQyw4QkFBYSxPQUFiLEVBQXNCLE9BQXRCLENBQXRDLEdBQXlFQyxJQUF6RTtBQUNEOztBQUVjLFNBQVNDLEtBQVQsQ0FBZUgsUUFBZixFQUFpRDtBQUFBLGlGQUFKLEVBQUk7QUFBQSx3QkFBdEJJLEtBQXNCO0FBQUEsTUFBdEJBLEtBQXNCLDJCQUFkLEtBQWM7O0FBQzlELE1BQUksQ0FBQ0EsS0FBTCxFQUFZO0FBQ1YsV0FBTztBQUFBLGFBQU0sQ0FBTjtBQUFBLEtBQVA7QUFDRDs7QUFFRCxTQUFPLFlBQWE7QUFBQSx1Q0FBVEYsSUFBUztBQUFUQSxNQUFBQSxJQUFTO0FBQUE7O0FBQ2xCLFFBQUksQ0FBQ0EsSUFBSSxDQUFDRyxNQUFWLEVBQWtCO0FBQ2hCO0FBQ0Q7O0FBRUQsZ0JBQWVILElBQWY7QUFBQTtBQUFBLFFBQU9ELElBQVA7O0FBRUEsUUFBSSxPQUFPQSxJQUFQLEtBQWdCLFVBQXBCLEVBQWdDO0FBQzlCQyxNQUFBQSxJQUFJLEdBQUdELElBQUksRUFBWDtBQUNEOztBQUVELFFBQU1LLEtBQUssR0FBRyx5QkFBY0osSUFBSSxDQUFDLENBQUQsQ0FBbEIsSUFBeUJBLElBQXpCLEdBQWdDLENBQUNBLElBQUQsQ0FBOUM7QUFDQSxRQUFNSyxRQUFRLEdBQUdELEtBQUssQ0FBQ0QsTUFBTixLQUFpQixDQUFsQztBQUVBLDZCQUFBQyxLQUFLLE1BQUwsQ0FBQUEsS0FBSyxFQUFTLFVBQUNFLElBQUQsRUFBT0MsS0FBUCxFQUFpQjtBQUM3QixVQUFJRixRQUFKLEVBQWM7QUFBQTs7QUFDWixvQkFBQUcsT0FBTyxFQUFDQyxHQUFSLHFEQUFlWixNQUFNLE1BQU4sOENBQU9DLFFBQVAsdURBQW9CUSxJQUFwQixHQUFmO0FBQ0QsT0FGRCxNQUVPLElBQUlDLEtBQUosRUFBVztBQUFBOztBQUNoQixxQkFBQUMsT0FBTyxFQUFDQyxHQUFSLHNEQUFnQix5QkFBY0gsSUFBZCxJQUFzQkEsSUFBdEIsR0FBNkIsQ0FBQ0EsSUFBRCxDQUE3QztBQUNELE9BRk0sTUFFQTtBQUFBOztBQUNMLHFCQUFBRSxPQUFPLEVBQUNFLGNBQVIsc0RBQTBCYixNQUFNLE1BQU4sOENBQU9DLFFBQVAsdURBQW9CUSxJQUFwQixHQUExQjtBQUNEO0FBQ0YsS0FSSSxDQUFMO0FBVUFELElBQUFBLFFBQVEsSUFBSUcsT0FBTyxDQUFDRyxRQUFSLEVBQVo7QUFDRCxHQXpCRDtBQTBCRCIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludCBuby1jb25zb2xlOiBbXCJvZmZcIl0gKi9cblxuaW1wb3J0IHN0eWxlQ29uc29sZSBmcm9tICcuL3N0eWxlQ29uc29sZSc7XG5cbmZ1bmN0aW9uIGZvcm1hdChjYXRlZ29yeSwgYXJnMCwgLi4uYXJncykge1xuICByZXR1cm4gW2AlYyR7Y2F0ZWdvcnl9JWMgJHthcmcwfWAsIC4uLnN0eWxlQ29uc29sZSgnZ3JlZW4nLCAnd2hpdGUnKSwgLi4uYXJnc107XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlYnVnKGNhdGVnb3J5LCB7IGZvcmNlID0gZmFsc2UgfSA9IHt9KSB7XG4gIGlmICghZm9yY2UpIHtcbiAgICByZXR1cm4gKCkgPT4gMDtcbiAgfVxuXG4gIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgIGlmICghYXJncy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBbYXJnMF0gPSBhcmdzO1xuXG4gICAgaWYgKHR5cGVvZiBhcmcwID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhcmdzID0gYXJnMCgpO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmVzID0gQXJyYXkuaXNBcnJheShhcmdzWzBdKSA/IGFyZ3MgOiBbYXJnc107XG4gICAgY29uc3Qgb25lTGluZXIgPSBsaW5lcy5sZW5ndGggPT09IDE7XG5cbiAgICBsaW5lcy5mb3JFYWNoKChsaW5lLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKG9uZUxpbmVyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKC4uLmZvcm1hdChjYXRlZ29yeSwgLi4ubGluZSkpO1xuICAgICAgfSBlbHNlIGlmIChpbmRleCkge1xuICAgICAgICBjb25zb2xlLmxvZyguLi4oQXJyYXkuaXNBcnJheShsaW5lKSA/IGxpbmUgOiBbbGluZV0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoLi4uZm9ybWF0KGNhdGVnb3J5LCAuLi5saW5lKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBvbmVMaW5lciB8fCBjb25zb2xlLmdyb3VwRW5kKCk7XG4gIH07XG59XG4iXX0=