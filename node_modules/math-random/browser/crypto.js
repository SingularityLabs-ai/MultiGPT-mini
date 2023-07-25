var global = typeof window !== 'undefined' ? window : self
module.exports = global.crypto || global.msCrypto
