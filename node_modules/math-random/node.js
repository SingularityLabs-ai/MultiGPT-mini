module.exports = random

var crypto = require('./crypto')
var max = Math.pow(2, 32)

function random () {
  return crypto
    .randomBytes(4)
    .readUInt32BE(0) / max
}
