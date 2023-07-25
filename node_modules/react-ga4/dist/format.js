"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = format;
var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
function toTitleCase(string) {
  return string.toString().trim().replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (match, index, title) {
    if (index > 0 && index + match.length !== title.length && match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" && (title.charAt(index + match.length) !== "-" || title.charAt(index - 1) === "-") && title.charAt(index - 1).search(/[^\s-]/) < 0) {
      return match.toLowerCase();
    }
    if (match.substr(1).search(/[A-Z]|\../) > -1) {
      return match;
    }
    return match.charAt(0).toUpperCase() + match.substr(1);
  });
}

// See if s could be an email address. We don't want to send personal data like email.
// https://support.google.com/analytics/answer/2795983?hl=en
function mightBeEmail(s) {
  // There's no point trying to validate rfc822 fully, just look for ...@...
  return typeof s === "string" && s.indexOf("@") !== -1;
}
var redacted = "REDACTED (Potential Email Address)";
function redactEmail(string) {
  if (mightBeEmail(string)) {
    console.warn("This arg looks like an email address, redacting.");
    return redacted;
  }
  return string;
}
function format() {
  var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var titleCase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var redactingEmail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var _str = s || "";
  if (titleCase) {
    _str = toTitleCase(s);
  }
  if (redactingEmail) {
    _str = redactEmail(_str);
  }
  return _str;
}