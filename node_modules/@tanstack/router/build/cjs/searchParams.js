/**
 * router
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var qss = require('./qss.js');

const defaultParseSearch = parseSearchWith(JSON.parse);
const defaultStringifySearch = stringifySearchWith(JSON.stringify);
function parseSearchWith(parser) {
  return searchStr => {
    if (searchStr.substring(0, 1) === '?') {
      searchStr = searchStr.substring(1);
    }
    let query = qss.decode(searchStr);

    // Try to parse any query params that might be json
    for (let key in query) {
      const value = query[key];
      if (typeof value === 'string') {
        try {
          query[key] = parser(value);
        } catch (err) {
          //
        }
      }
    }
    return query;
  };
}
function stringifySearchWith(stringify) {
  return search => {
    search = {
      ...search
    };
    if (search) {
      Object.keys(search).forEach(key => {
        const val = search[key];
        if (typeof val === 'undefined' || val === undefined) {
          delete search[key];
        } else if (val && typeof val === 'object' && val !== null) {
          try {
            search[key] = stringify(val);
          } catch (err) {
            // silent
          }
        }
      });
    }
    const searchStr = qss.encode(search).toString();
    return searchStr ? `?${searchStr}` : '';
  };
}

exports.defaultParseSearch = defaultParseSearch;
exports.defaultStringifySearch = defaultStringifySearch;
exports.parseSearchWith = parseSearchWith;
exports.stringifySearchWith = stringifySearchWith;
//# sourceMappingURL=searchParams.js.map
