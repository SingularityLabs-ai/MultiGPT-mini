"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");

var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var ReactScrollToBottom = _interopRequireWildcard(require("./index"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// TODO: This is for testing only. Don't use it in production environment unless we have isomorphic React.
window.React = _react["default"];
window.ReactDOM = _reactDom["default"];
window.ReactScrollToBottom = ReactScrollToBottom;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9icm93c2VyLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIlJlYWN0IiwiUmVhY3RET00iLCJSZWFjdFNjcm9sbFRvQm90dG9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUE7QUFDQUEsTUFBTSxDQUFDQyxLQUFQLEdBQWVBLGlCQUFmO0FBQ0FELE1BQU0sQ0FBQ0UsUUFBUCxHQUFrQkEsb0JBQWxCO0FBRUFGLE1BQU0sQ0FBQ0csbUJBQVAsR0FBNkJBLG1CQUE3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0U2Nyb2xsVG9Cb3R0b20gZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5cbi8vIFRPRE86IFRoaXMgaXMgZm9yIHRlc3Rpbmcgb25seS4gRG9uJ3QgdXNlIGl0IGluIHByb2R1Y3Rpb24gZW52aXJvbm1lbnQgdW5sZXNzIHdlIGhhdmUgaXNvbW9ycGhpYyBSZWFjdC5cbndpbmRvdy5SZWFjdCA9IFJlYWN0O1xud2luZG93LlJlYWN0RE9NID0gUmVhY3RET007XG5cbndpbmRvdy5SZWFjdFNjcm9sbFRvQm90dG9tID0gUmVhY3RTY3JvbGxUb0JvdHRvbTtcbiJdfQ==