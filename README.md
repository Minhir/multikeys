# multikeys

[![](https://img.shields.io/npm/v/multikeys)](https://www.npmjs.com/package/multikeys)
![](https://img.shields.io/github/actions/workflow/status/minhir/multikeys/nodejs.yml?branch=main)
[![](https://img.shields.io/coveralls/github/Minhir/multikeys)](https://coveralls.io/github/Minhir/multikeys)
![](https://img.shields.io/github/license/minhir/multikeys?color=blue)

**Multikeys** is a TypeScript collection of trie‑based Map, Set, WeakMap, and WeakSet designed for high performance.

- ✨ TypeScript-first
- 🪶 Zero dependencies
- 🚀 Optimized trie-based implementation (see [benchmarks](./benchmark/maps.bench.ts))

Check [API Reference](https://minhir.github.io/multikeys/index.html).

## Example of usage

```javascript
const mkMap = new MKMap();

mkMap.set([1, 2, 3], "foo");
mkMap.set([3, 2, 1], "bar");

// order of keys matters
mkMap.get([1, 2, 3]); // => 'foo'
mkMap.get([3, 2, 1]); // => 'bar'

// an argument with empty keys is also valid
mkMap.set([], "zero");
mkMap.get([]); // => 'zero'
```

```javascript
const mkSet = new MKSet();
const obj = {};

mkSet.add([obj, 1]);
mkSet.has([{}, 1]); // => false, because {} is a new object, {} !== obj
mkSet.has([obj, 1]); // => true
```

Using MKMap we could simply add memoization to function with a variable number of arguments:

```javascript
const { MKMap } = require("multikeys");

function memoize(func) {
  const mkMap = new MKMap();

  return (...args) => {
    if (mkMap.has(args)) {
      return mkMap.get(args);
    }

    const res = func(...args);

    mkMap.set(args, res);

    return res;
  };
}
```

Also, we could replace `MKMap` with `MKWeakMap` and get `memoize` with auto garbage collection. In such case only objects could be `func` arguments.
