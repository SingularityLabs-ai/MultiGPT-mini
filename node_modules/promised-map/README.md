# promised-map
[![Actions Status](https://github.com/vitalets/promised-map/workflows/autotests/badge.svg)](https://github.com/vitalets/promised-map/actions)
[![npm](https://img.shields.io/npm/v/promised-map.svg)](https://www.npmjs.com/package/promised-map)
[![license](https://img.shields.io/npm/l/promised-map.svg)](https://www.npmjs.com/package/promised-map)

A map of promises that can be resolved or rejected by key.
Once promise is resolved/rejected, related key/value pair is automatically removed from map.

## Contents

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

<!-- tocstop -->

## Installation
```bash
npm install promised-map
```

## Usage
```js
import { PromisedMap } from 'promised-map';

const map = new PromisedMap();

// set key/value pair and retrieve related promise.
const promise = map.set('foo', 42);

// resolve promise later by key
map.resolve('foo', 'bar');

// reject promise by key
map.reject('foo', new Error('error'));

// check if promise is still pending
map.has('foo');

// resolve all promises and clear map
map.resolveAll('bar');

// reject all promises and clear map
map.rejectAll(new Error('error'));

// iterate all promises
map.forEach((value, key) => { /* ... */ });
```

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)
