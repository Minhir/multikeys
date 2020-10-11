# multikeys

[![](https://img.shields.io/npm/v/multikeys)](https://www.npmjs.com/package/multikeys)
![](https://img.shields.io/github/workflow/status/minhir/multikeys/NodeCI)
[![](https://img.shields.io/coveralls/github/Minhir/multikeys)](https://coveralls.io/github/Minhir/multikeys)
![](https://img.shields.io/github/license/minhir/multikeys?color=blue)

Multikeys data structures collection: Map, Set, WeakMap and WeakSet. Based on trie structure.

<details>
    <summary>Benchmarks :rocket:</summary>

Benchmarks located in `./benchmark` directory.  You can modify `./benchmark/index.js` and run `npm i && npm start` to test your own use cases.

Results of calling `set` and `get` with random data (random number of keys and keys values). You can find benchmark code in  `./benchmark/index.js`.

## With a maximum number of keys 10

| package                                                      | set and get (ops/sec) | normalized on `many-keys-map` |
|--------------------------------------------------------------|-----------------------|-------------------------------|
| [multikeymap](https://www.npmjs.com/package/multikeymap)     |       1.37 ±19.20%    | 0                             |
| [many-keys-map](https://www.npmjs.com/package/many-keys-map) |  27 795 ±0.84%        | 1                             |
| [multikey](https://www.npmjs.com/package/multikey)           |  79 355 ±1.37%        | 2.85                          |
| [multikey-map](https://www.npmjs.com/package/multikey-map)   | 153 616 ±1.32%        | 5.52                          |
| **multikeys**                                                | 185 565 ±1.70%        | 6.67                          |

## With a maximum number of keys 100

| package                                                      | set and get (ops/sec) | normalized on `many-keys-map` |
|--------------------------------------------------------------|-----------------------|-------------------------------|
| [multikeymap](https://www.npmjs.com/package/multikeymap)     | fall with OOM         | -                              |
| [many-keys-map](https://www.npmjs.com/package/many-keys-map) |  7 120 ±0.92%         | 1                              |
| [multikey](https://www.npmjs.com/package/multikey)           | 10 830 ±1.35%         | 1.52                           |
| [multikey-map](https://www.npmjs.com/package/multikey-map)   | 29 635 ±1.26%         | 4.16                           |
| **multikeys**                                                | 43 394 ±1.52%         | 6.09                           |

</details>

## Example of usage

Using MKMap we could simply add memoization to function with a variable number of arguments:

```javascript
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

# API
