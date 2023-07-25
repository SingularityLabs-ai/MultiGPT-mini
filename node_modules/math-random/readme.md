# math-random

math-random is an isomorphic, drop-in replacement for `Math.random` that uses cryptographically secure random number generation, where available

[![ci](https://travis-ci.org/michaelrhodes/math-random.svg?branch=master)](https://travis-ci.org/michaelrhodes/math-random)

## install
```sh
npm install math-random
```

## use
```js
console.log(require('math-random')())
=> 0.584293719381094

console.log(require('math-random/is-secure'))
=> true || false
```

## obey
[CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/)
