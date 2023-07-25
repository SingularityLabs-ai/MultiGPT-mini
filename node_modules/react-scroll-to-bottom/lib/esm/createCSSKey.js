import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.string.replace.js";
import "core-js/modules/es.date.to-string.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.regexp.to-string.js";

/* eslint no-magic-numbers: "off" */
import random from 'math-random';
export default function useCSSKey() {
  return random().toString(26).substr(2, 5).replace(/[0-9]/g, function (value) {
    return String.fromCharCode(value.charCodeAt(0) + 65);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jcmVhdGVDU1NLZXkuanMiXSwibmFtZXMiOlsicmFuZG9tIiwidXNlQ1NTS2V5IiwidG9TdHJpbmciLCJzdWJzdHIiLCJyZXBsYWNlIiwidmFsdWUiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJjaGFyQ29kZUF0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUVBLE9BQU9BLE1BQVAsTUFBbUIsYUFBbkI7QUFFQSxlQUFlLFNBQVNDLFNBQVQsR0FBcUI7QUFDbEMsU0FBT0QsTUFBTSxHQUNWRSxRQURJLENBQ0ssRUFETCxFQUVKQyxNQUZJLENBRUcsQ0FGSCxFQUVNLENBRk4sRUFHSkMsT0FISSxDQUdJLFFBSEosRUFHWSxVQUFBQyxLQUFLO0FBQUEsV0FBSUMsTUFBTSxDQUFDQyxZQUFQLENBQW9CRixLQUFLLENBQUNHLFVBQU4sQ0FBaUIsQ0FBakIsSUFBc0IsRUFBMUMsQ0FBSjtBQUFBLEdBSGpCLENBQVA7QUFJRCIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludCBuby1tYWdpYy1udW1iZXJzOiBcIm9mZlwiICovXG5cbmltcG9ydCByYW5kb20gZnJvbSAnbWF0aC1yYW5kb20nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VDU1NLZXkoKSB7XG4gIHJldHVybiByYW5kb20oKVxuICAgIC50b1N0cmluZygyNilcbiAgICAuc3Vic3RyKDIsIDUpXG4gICAgLnJlcGxhY2UoL1xcZC9ndSwgdmFsdWUgPT4gU3RyaW5nLmZyb21DaGFyQ29kZSh2YWx1ZS5jaGFyQ29kZUF0KDApICsgNjUpKTtcbn1cbiJdfQ==