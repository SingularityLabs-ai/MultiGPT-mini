export default function styleConsole(backgroundColor) {
  var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'white';
  var styles = "background-color: ".concat(backgroundColor, "; border-radius: 4px; padding: 2px 4px;");

  if (color) {
    styles += " color: ".concat(color, ";");
  }

  return [styles, ''];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9zdHlsZUNvbnNvbGUuanMiXSwibmFtZXMiOlsic3R5bGVDb25zb2xlIiwiYmFja2dyb3VuZENvbG9yIiwiY29sb3IiLCJzdHlsZXMiXSwibWFwcGluZ3MiOiJBQUFBLGVBQWUsU0FBU0EsWUFBVCxDQUFzQkMsZUFBdEIsRUFBd0Q7QUFBQSxNQUFqQkMsS0FBaUIsdUVBQVQsT0FBUztBQUNyRSxNQUFJQyxNQUFNLCtCQUF3QkYsZUFBeEIsNENBQVY7O0FBRUEsTUFBSUMsS0FBSixFQUFXO0FBQ1RDLElBQUFBLE1BQU0sc0JBQWVELEtBQWYsTUFBTjtBQUNEOztBQUVELFNBQU8sQ0FBQ0MsTUFBRCxFQUFTLEVBQVQsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3R5bGVDb25zb2xlKGJhY2tncm91bmRDb2xvciwgY29sb3IgPSAnd2hpdGUnKSB7XG4gIGxldCBzdHlsZXMgPSBgYmFja2dyb3VuZC1jb2xvcjogJHtiYWNrZ3JvdW5kQ29sb3J9OyBib3JkZXItcmFkaXVzOiA0cHg7IHBhZGRpbmc6IDJweCA0cHg7YDtcblxuICBpZiAoY29sb3IpIHtcbiAgICBzdHlsZXMgKz0gYCBjb2xvcjogJHtjb2xvcn07YDtcbiAgfVxuXG4gIHJldHVybiBbc3R5bGVzLCAnJ107XG59XG4iXX0=