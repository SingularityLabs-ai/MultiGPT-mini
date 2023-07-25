import _Date$now from "@babel/runtime-corejs3/core-js-stable/date/now";
import _setTimeout from "@babel/runtime-corejs3/core-js-stable/set-timeout";
export default function (fn, ms) {
  if (!ms) {
    return fn;
  }

  var last = 0;
  var timeout = null;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var now = _Date$now();

    if (now - last > ms) {
      fn.apply(void 0, args);
      last = now;
    } else {
      clearTimeout(timeout);
      timeout = _setTimeout(function () {
        fn.apply(void 0, args);
        last = _Date$now();
      }, Math.max(0, ms - now + last));
    }
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kZWJvdW5jZS5qcyJdLCJuYW1lcyI6WyJmbiIsIm1zIiwibGFzdCIsInRpbWVvdXQiLCJhcmdzIiwibm93IiwiY2xlYXJUaW1lb3V0IiwiTWF0aCIsIm1heCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxlQUFlLFVBQVVBLEVBQVYsRUFBY0MsRUFBZCxFQUFrQjtBQUMvQixNQUFJLENBQUNBLEVBQUwsRUFBUztBQUNQLFdBQU9ELEVBQVA7QUFDRDs7QUFFRCxNQUFJRSxJQUFJLEdBQUcsQ0FBWDtBQUNBLE1BQUlDLE9BQU8sR0FBRyxJQUFkO0FBRUEsU0FBTyxZQUFhO0FBQUEsc0NBQVRDLElBQVM7QUFBVEEsTUFBQUEsSUFBUztBQUFBOztBQUNsQixRQUFNQyxHQUFHLEdBQUcsV0FBWjs7QUFFQSxRQUFJQSxHQUFHLEdBQUdILElBQU4sR0FBYUQsRUFBakIsRUFBcUI7QUFDbkJELE1BQUFBLEVBQUUsTUFBRixTQUFNSSxJQUFOO0FBQ0FGLE1BQUFBLElBQUksR0FBR0csR0FBUDtBQUNELEtBSEQsTUFHTztBQUNMQyxNQUFBQSxZQUFZLENBQUNILE9BQUQsQ0FBWjtBQUVBQSxNQUFBQSxPQUFPLEdBQUcsWUFBVyxZQUFNO0FBQ3pCSCxRQUFBQSxFQUFFLE1BQUYsU0FBTUksSUFBTjtBQUNBRixRQUFBQSxJQUFJLEdBQUcsV0FBUDtBQUNELE9BSFMsRUFHUEssSUFBSSxDQUFDQyxHQUFMLENBQVMsQ0FBVCxFQUFZUCxFQUFFLEdBQUdJLEdBQUwsR0FBV0gsSUFBdkIsQ0FITyxDQUFWO0FBSUQ7QUFDRixHQWREO0FBZUQiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZm4sIG1zKSB7XG4gIGlmICghbXMpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICBsZXQgbGFzdCA9IDA7XG4gIGxldCB0aW1lb3V0ID0gbnVsbDtcblxuICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuXG4gICAgaWYgKG5vdyAtIGxhc3QgPiBtcykge1xuICAgICAgZm4oLi4uYXJncyk7XG4gICAgICBsYXN0ID0gbm93O1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG5cbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZm4oLi4uYXJncyk7XG4gICAgICAgIGxhc3QgPSBEYXRlLm5vdygpO1xuICAgICAgfSwgTWF0aC5tYXgoMCwgbXMgLSBub3cgKyBsYXN0KSk7XG4gICAgfVxuICB9O1xufVxuIl19