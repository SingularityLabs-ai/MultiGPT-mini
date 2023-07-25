module.exports = (function (crypto) {
  if (!crypto) return Math.random

  var max = Math.pow(2, 32)
  var u32 = new Uint32Array(1)

  return function random () {
    return crypto.getRandomValues(u32)[0] / max
  }
})(require('./crypto'))
