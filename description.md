# multikeys

[![](https://img.shields.io/npm/v/multikeys)](https://www.npmjs.com/package/multikeys)
![](https://img.shields.io/github/workflow/status/minhir/multikeys/NodeCI)
[![](https://img.shields.io/coveralls/github/Minhir/multikeys)](https://coveralls.io/github/Minhir/multikeys)
![](https://img.shields.io/github/license/minhir/multikeys?color=blue)

Multikeys data structures collection written in TypeScript: Map, Set, WeakMap and WeakSet. Based on trie data structure.

<details>
    <summary>Benchmarks :rocket:</summary>

Benchmarks are located in `./benchmark` directory.  You can modify `./benchmark/index.js` and run `npm i && npm start` to test your own use cases.

Results of calling `set` and `get` with random data (and random number of keys). You can find benchmark code in  `./benchmark/index.js`.

## Maximum number of keys is 10

| package                                                      | set and get (ops/sec) | normalized on `many-keys-map` |
|--------------------------------------------------------------|-----------------------|-------------------------------|
| [multikeymap](https://www.npmjs.com/package/multikeymap)     |       1.37 ±19.20%    | 0                             |
| [many-keys-map](https://www.npmjs.com/package/many-keys-map) |  27 795 ±0.84%        | 1                             |
| [multikey](https://www.npmjs.com/package/multikey)           |  79 355 ±1.37%        | 2.85                          |
| [multikey-map](https://www.npmjs.com/package/multikey-map)   | 153 616 ±1.32%        | 5.52                          |
| **multikeys**                                                | 185 565 ±1.70%        | 6.67                          |

## Maximum number of keys is 100

| package                                                      | set and get (ops/sec) | normalized on `many-keys-map` |
|--------------------------------------------------------------|-----------------------|-------------------------------|
| [multikeymap](https://www.npmjs.com/package/multikeymap)     | fall with OOM         | -                              |
| [many-keys-map](https://www.npmjs.com/package/many-keys-map) |  7 120 ±0.92%         | 1                              |
| [multikey](https://www.npmjs.com/package/multikey)           | 10 830 ±1.35%         | 1.52                           |
| [multikey-map](https://www.npmjs.com/package/multikey-map)   | 29 635 ±1.26%         | 4.16                           |
| **multikeys**                                                | 43 394 ±1.52%         | 6.09                           |

</details>

## Example of usage

```javascript
const mkMap = new MKMap();

mkMap.set([1, 2, 3], 'foo');
mkMap.set([3, 2, 1], 'bar');

// order of keys matters
mkMap.get([1, 2, 3]); // => 'foo'
mkMap.get([3, 2, 1]); // => 'bar'

// an argument with empty keys is also valid
mkMap.set([], 'zero');
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
const {MKMap} = require("multikeys");

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
