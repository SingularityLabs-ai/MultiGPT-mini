"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = useCSSKey;

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

var _mathRandom = _interopRequireDefault(require("math-random"));

/* eslint no-magic-numbers: "off" */
function useCSSKey() {
  return (0, _mathRandom["default"])().toString(26).substr(2, 5).replace(/[0-9]/g, function (value) {
    return String.fromCharCode(value.charCodeAt(0) + 65);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jcmVhdGVDU1NLZXkuanMiXSwibmFtZXMiOlsidXNlQ1NTS2V5IiwidG9TdHJpbmciLCJzdWJzdHIiLCJyZXBsYWNlIiwidmFsdWUiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJjaGFyQ29kZUF0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0FBRkE7QUFJZSxTQUFTQSxTQUFULEdBQXFCO0FBQ2xDLFNBQU8sOEJBQ0pDLFFBREksQ0FDSyxFQURMLEVBRUpDLE1BRkksQ0FFRyxDQUZILEVBRU0sQ0FGTixFQUdKQyxPQUhJLENBR0ksUUFISixFQUdZLFVBQUFDLEtBQUs7QUFBQSxXQUFJQyxNQUFNLENBQUNDLFlBQVAsQ0FBb0JGLEtBQUssQ0FBQ0csVUFBTixDQUFpQixDQUFqQixJQUFzQixFQUExQyxDQUFKO0FBQUEsR0FIakIsQ0FBUDtBQUlEIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50IG5vLW1hZ2ljLW51bWJlcnM6IFwib2ZmXCIgKi9cblxuaW1wb3J0IHJhbmRvbSBmcm9tICdtYXRoLXJhbmRvbSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZUNTU0tleSgpIHtcbiAgcmV0dXJuIHJhbmRvbSgpXG4gICAgLnRvU3RyaW5nKDI2KVxuICAgIC5zdWJzdHIoMiwgNSlcbiAgICAucmVwbGFjZSgvXFxkL2d1LCB2YWx1ZSA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlKHZhbHVlLmNoYXJDb2RlQXQoMCkgKyA2NSkpO1xufVxuIl19