"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = styleConsole;

function styleConsole(backgroundColor) {
  var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'white';
  var styles = "background-color: ".concat(backgroundColor, "; border-radius: 4px; padding: 2px 4px;");

  if (color) {
    styles += " color: ".concat(color, ";");
  }

  return [styles, ''];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9zdHlsZUNvbnNvbGUuanMiXSwibmFtZXMiOlsic3R5bGVDb25zb2xlIiwiYmFja2dyb3VuZENvbG9yIiwiY29sb3IiLCJzdHlsZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBZSxTQUFTQSxZQUFULENBQXNCQyxlQUF0QixFQUF3RDtBQUFBLE1BQWpCQyxLQUFpQix1RUFBVCxPQUFTO0FBQ3JFLE1BQUlDLE1BQU0sK0JBQXdCRixlQUF4Qiw0Q0FBVjs7QUFFQSxNQUFJQyxLQUFKLEVBQVc7QUFDVEMsSUFBQUEsTUFBTSxzQkFBZUQsS0FBZixNQUFOO0FBQ0Q7O0FBRUQsU0FBTyxDQUFDQyxNQUFELEVBQVMsRUFBVCxDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdHlsZUNvbnNvbGUoYmFja2dyb3VuZENvbG9yLCBjb2xvciA9ICd3aGl0ZScpIHtcbiAgbGV0IHN0eWxlcyA9IGBiYWNrZ3JvdW5kLWNvbG9yOiAke2JhY2tncm91bmRDb2xvcn07IGJvcmRlci1yYWRpdXM6IDRweDsgcGFkZGluZzogMnB4IDRweDtgO1xuXG4gIGlmIChjb2xvcikge1xuICAgIHN0eWxlcyArPSBgIGNvbG9yOiAke2NvbG9yfTtgO1xuICB9XG5cbiAgcmV0dXJuIFtzdHlsZXMsICcnXTtcbn1cbiJdfQ==