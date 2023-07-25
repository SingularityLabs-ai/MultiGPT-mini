# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.2.0] - 2020-05-26

### Changed

- Bump dependencies, in PR [#29](https://github.com/compulim/simple-update-in/pulls/29)
   - [`@babel/cli@7.8.4`](https://npmjs.com/package/@babel/cli)
   - [`@babel/core@7.9.6`](https://npmjs.com/package/@babel/core)
   - [`@babel/plugin-proposal-object-rest-spread@7.9.6`](https://npmjs.com/package/@babel/plugin-proposal-object-rest-spread)
   - [`@babel/preset-env@7.9.6`](https://npmjs.com/package/@babel/preset-env)
   - [`babel-jest@26.0.1`](https://npmjs.com/package/babel-jest)
   - [`coveralls@3.1.0`](https://npmjs.com/package/coveralls)
   - [`jest@26.0.1`](https://npmjs.com/package/jest)
   - [`regenerator-runtime@0.13.5`](https://npmjs.com/package/regenerator-runtime)
   - [`rollup@2.10.9`](https://npmjs.com/package/rollup)
   - [`rollup-plugin-babel@4.4.0`](https://npmjs.com/package/rollup-plugin-babel)
   - [`rollup-plugin-uglify@6.0.4`](https://npmjs.com/package/rollup-plugin-uglify)

## [2.1.1] - 2019-08-01

### Changed

- Fix [#24](https://github.com/compulim/simple-update-in/issues/24), polyfill `Object.is` for IE11, in PR [#25](https://github.com/compulim/simple-update-in/pull/25)
   - Polyfill code is adopted from [`core-js`](https://npmjs.com/package/core-js) to maintain zero dependency

## [2.1.0] - 2019-07-18

### Changed

- Bump dependencies, in PR [#18](https://github.com/compulim/simple-update-in/pulls/18)
   - [`@babel/cli@^7.5.5`](https://www.npmjs.com/package/@babel/cli)
   - [`@babel/core@^7.5.5`](https://www.npmjs.com/package/@babel/core)
   - [`@babel/plugin-proposal-object-rest-spread@^7.5.5`](https://www.npmjs.com/package/@babel/plugin-proposal-object-rest-spread)
   - [`@babel/preset-env@^7.5.5`](https://www.npmjs.com/package/@babel/preset-env)
   - [`babel-core@^7.0.0-bridge.0`](https://www.npmjs.com/package/babel-core)
   - [`babel-jest@^24.8.0`](https://www.npmjs.com/package/babel-jest)
   - [`babel-plugin-add-module-exports@^1.0.2`](https://www.npmjs.com/package/babel-plugin-add-module-exports)
   - [`coveralls@^3.0.5`](https://www.npmjs.com/package/coveralls)
   - [`jest@^24.8.0`](https://www.npmjs.com/package/jest)
   - [`rollup@^1.17.0`](https://www.npmjs.com/package/rollup)
   - [`rollup-plugin-babel@^4.3.3`](https://www.npmjs.com/package/rollup-plugin-babel)
   - [`rollup-plugin-uglify@^6.0.2`](https://www.npmjs.com/package/rollup-plugin-uglify)
- Use `Object.is` instead of `===` to check if value is updated or not, in PR [#21](https://github.com/compulim/simple-update-in/pull/21)
   - `Object.is` correctly compare between `0` and `-0` (different), and `NaN` and `Number.NaN` (indifferent)

### Added

- Will skip paths containing `__proto__`, `constructor`, and `prototype`, in PR [#19](https://github.com/compulim/simple-update-in/pull/19)

## [2.0.2] - 2018-12-06

### Fixed

- Fix [#16](https://github.com/compulim/simple-update-in/issues/16), parents should not be removed when `updater` is or returned `undefined`, in PR [#17](https://github.com/compulim/simple-update-in/pull/17)

## [2.0.1] - 2018-12-03

### Added

- Emitting UMD bundle for browser
   - `<script src="https://unpkg.com/simple-update-in/dist/simple-update-in.production.min.js"></script>`
   - `<script>window.simpleUpdateIn({ abc: 123, def: 456 }, ['xyz'], () => 789);</script>`

## [2.0.0] - 2018-12-03

### Added

- Support async predicate
   - `await updateIn([1, 2, 3, 4, 5], [v => Promise.resolve(v % 2)], v => v * 10)` will return `[10, 2, 30, 4, 50]`
- Support async update
   - `await updateIn([1, 2, 3], [0], v => Promise.resolve(v * 10))` will return `[10, 2, 3]`

### Changed

- Use Node.js 10 and 11 for Travis CI

### Removed

- Removed array insertion using index number of `-1`
   - This introduces API inconfirmity: `-1` could means append, prepend, or the last item

## [1.4.0] - 2018-10-08

### Changed

- Add default exports for CommonJS
- Bump
   - `@babel/core@7.1.2`
   - `merge@1.2.1` (via `npm audit fix`)
   - `jest@23.6.0`

## [1.3.1] - 2018-10-05

### Fixed

- Using a predicate on a non-existing key/index should not throw error and return the original value as-is
   - `updateIn({}, ['Hello', () => true], () => 'World!'])` will return `{}`
   - `updateIn([], [0, () => true], () => 'Aloha'])` will return `[]`

## [1.3.0] - 2018-08-17

### Added

- Support predicate function
   - `updateIn([1, 2, 3, 4, 5], [v => v % 2], v => v * 10)` will return `[10, 2, 30, 4, 50]`
   - Predicate function can be used as branching function to update multiple subtrees in a single call

## [1.2.0] - 2018-04-14

### Added

- If after `updater` result in nothing change (triple-equal `===`), will return untouched
- `updater` returned `undefined` will be treated as removing the item

### Fixed

- Append not creating sub-structure correctly
   - `updateIn([1, 2], [-1, 0], 'Hello')` should return `[1, 2, ['Hello']]` instead of `[1, 2, 'Hello']`

## [1.1.1] - 2018-04-06

### Fixed

- Move `babel` and `gulp` into `devDependencies`

## [1.1.0] - 2018-03-31

### Added

- Automatic expansion
- Replace incompatible types
- Array insertion using index number of `-1`

## [1.0.0] - 2018-03-21

### Added

- Initial commit
