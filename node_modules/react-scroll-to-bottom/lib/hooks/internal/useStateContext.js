"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = useStateContext;

var _react = require("react");

var _State1Context = _interopRequireDefault(require("../../ScrollToBottom/State1Context"));

var _State2Context = _interopRequireDefault(require("../../ScrollToBottom/State2Context"));

var _StateContext = _interopRequireDefault(require("../../ScrollToBottom/StateContext"));

var stateContexts = [_StateContext["default"], _State1Context["default"], _State2Context["default"]];

function useStateContext(tier) {
  return (0, _react.useContext)(stateContexts[tier] || stateContexts[0]);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy9pbnRlcm5hbC91c2VTdGF0ZUNvbnRleHQuanMiXSwibmFtZXMiOlsic3RhdGVDb250ZXh0cyIsIlN0YXRlQ29udGV4dCIsIlN0YXRlMUNvbnRleHQiLCJTdGF0ZTJDb250ZXh0IiwidXNlU3RhdGVDb250ZXh0IiwidGllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBRUEsSUFBTUEsYUFBYSxHQUFHLENBQUNDLHdCQUFELEVBQWVDLHlCQUFmLEVBQThCQyx5QkFBOUIsQ0FBdEI7O0FBRWUsU0FBU0MsZUFBVCxDQUF5QkMsSUFBekIsRUFBK0I7QUFDNUMsU0FBTyx1QkFBV0wsYUFBYSxDQUFDSyxJQUFELENBQWIsSUFBdUJMLGFBQWEsQ0FBQyxDQUFELENBQS9DLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBTdGF0ZTFDb250ZXh0IGZyb20gJy4uLy4uL1Njcm9sbFRvQm90dG9tL1N0YXRlMUNvbnRleHQnO1xuaW1wb3J0IFN0YXRlMkNvbnRleHQgZnJvbSAnLi4vLi4vU2Nyb2xsVG9Cb3R0b20vU3RhdGUyQ29udGV4dCc7XG5pbXBvcnQgU3RhdGVDb250ZXh0IGZyb20gJy4uLy4uL1Njcm9sbFRvQm90dG9tL1N0YXRlQ29udGV4dCc7XG5cbmNvbnN0IHN0YXRlQ29udGV4dHMgPSBbU3RhdGVDb250ZXh0LCBTdGF0ZTFDb250ZXh0LCBTdGF0ZTJDb250ZXh0XTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlU3RhdGVDb250ZXh0KHRpZXIpIHtcbiAgcmV0dXJuIHVzZUNvbnRleHQoc3RhdGVDb250ZXh0c1t0aWVyXSB8fCBzdGF0ZUNvbnRleHRzWzBdKTtcbn1cbiJdfQ==