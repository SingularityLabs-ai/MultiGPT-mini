"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = useStateRef;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));

var _react = require("react");

function useStateRef(initialState) {
  var _useState = (0, _react.useState)(initialState),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var ref = (0, _react.useRef)();
  var setValue = (0, _react.useCallback)(function (nextValue) {
    if (typeof nextValue === 'function') {
      setValue(function (state) {
        nextValue = nextValue(state);
        ref.current = nextValue;
        return nextValue;
      });
    } else {
      ref.current = nextValue;
      setValue(nextValue);
    }
  }, [ref]);
  ref.current = state;
  return [state, setState, ref];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy9pbnRlcm5hbC91c2VTdGF0ZVJlZi5qcyJdLCJuYW1lcyI6WyJ1c2VTdGF0ZVJlZiIsImluaXRpYWxTdGF0ZSIsInN0YXRlIiwic2V0U3RhdGUiLCJyZWYiLCJzZXRWYWx1ZSIsIm5leHRWYWx1ZSIsImN1cnJlbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRWUsU0FBU0EsV0FBVCxDQUFxQkMsWUFBckIsRUFBbUM7QUFDaEQsa0JBQTBCLHFCQUFTQSxZQUFULENBQTFCO0FBQUE7QUFBQSxNQUFPQyxLQUFQO0FBQUEsTUFBY0MsUUFBZDs7QUFDQSxNQUFNQyxHQUFHLEdBQUcsb0JBQVo7QUFDQSxNQUFNQyxRQUFRLEdBQUcsd0JBQ2YsVUFBQUMsU0FBUyxFQUFJO0FBQ1gsUUFBSSxPQUFPQSxTQUFQLEtBQXFCLFVBQXpCLEVBQXFDO0FBQ25DRCxNQUFBQSxRQUFRLENBQUMsVUFBQUgsS0FBSyxFQUFJO0FBQ2hCSSxRQUFBQSxTQUFTLEdBQUdBLFNBQVMsQ0FBQ0osS0FBRCxDQUFyQjtBQUVBRSxRQUFBQSxHQUFHLENBQUNHLE9BQUosR0FBY0QsU0FBZDtBQUVBLGVBQU9BLFNBQVA7QUFDRCxPQU5PLENBQVI7QUFPRCxLQVJELE1BUU87QUFDTEYsTUFBQUEsR0FBRyxDQUFDRyxPQUFKLEdBQWNELFNBQWQ7QUFFQUQsTUFBQUEsUUFBUSxDQUFDQyxTQUFELENBQVI7QUFDRDtBQUNGLEdBZmMsRUFnQmYsQ0FBQ0YsR0FBRCxDQWhCZSxDQUFqQjtBQW1CQUEsRUFBQUEsR0FBRyxDQUFDRyxPQUFKLEdBQWNMLEtBQWQ7QUFFQSxTQUFPLENBQUNBLEtBQUQsRUFBUUMsUUFBUixFQUFrQkMsR0FBbEIsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZVN0YXRlUmVmKGluaXRpYWxTdGF0ZSkge1xuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKGluaXRpYWxTdGF0ZSk7XG4gIGNvbnN0IHJlZiA9IHVzZVJlZigpO1xuICBjb25zdCBzZXRWYWx1ZSA9IHVzZUNhbGxiYWNrKFxuICAgIG5leHRWYWx1ZSA9PiB7XG4gICAgICBpZiAodHlwZW9mIG5leHRWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBzZXRWYWx1ZShzdGF0ZSA9PiB7XG4gICAgICAgICAgbmV4dFZhbHVlID0gbmV4dFZhbHVlKHN0YXRlKTtcblxuICAgICAgICAgIHJlZi5jdXJyZW50ID0gbmV4dFZhbHVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHRWYWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWYuY3VycmVudCA9IG5leHRWYWx1ZTtcblxuICAgICAgICBzZXRWYWx1ZShuZXh0VmFsdWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW3JlZl1cbiAgKTtcblxuICByZWYuY3VycmVudCA9IHN0YXRlO1xuXG4gIHJldHVybiBbc3RhdGUsIHNldFN0YXRlLCByZWZdO1xufVxuIl19