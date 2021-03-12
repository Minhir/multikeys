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

<a name="readmemd"></a>

## API

### Table of contents

#### Classes

- [MKMap](#classesmkmapmd)
- [MKSet](#classesmksetmd)
- [MKWeakMap](#classesmkweakmapmd)
- [MKWeakSet](#classesmkweaksetmd)


<a name="classesmkmapmd"></a>

## Class: MKMap<K, V\>

### Type parameters

Name | Default |
:------ | :------ |
`K` | *any* |
`V` | *any* |

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Accessors

- [size](#size)

#### Methods

- [[Symbol.iterator]](mkmap.md#[symbol.iterator])
- [clear](#clear)
- [delete](#delete)
- [entries](#entries)
- [forEach](#foreach)
- [get](#get)
- [has](#has)
- [keys](#keys)
- [set](#set)
- [values](#values)

### Constructors

#### constructor

\+ **new MKMap**<K, V\>(`iterable?`: *Iterable*<readonly readonly K[][]\>): [*MKMap*](#classesmkmapmd)<K, V\>

Creates a new MKMap object.

Could be called with initial keys-values.

```
const empty = new MKMap();
const withValues = new MKMap([
    [['key_1', 'key_2'], 'value'],
    [['key'], 'val']
]);
```

##### Type parameters:

Name | Default |
:------ | :------ |
`K` | *any* |
`V` | *any* |

##### Parameters:

Name | Type |
:------ | :------ |
`iterable?` | *Iterable*<readonly readonly K[][]\> |

**Returns:** [*MKMap*](#classesmkmapmd)<K, V\>

### Accessors

#### size

• get **size**(): *number*

Returns the number of keys/value pairs in the MKMap object.

**Returns:** *number*

### Methods

#### [Symbol.iterator]

▸ **[Symbol.iterator]**(): *IterableIterator*<[K[], V]\>

Returns a new Iterator object that contains an array of [keys, value] for each element in the MKMap object.

**Returns:** *IterableIterator*<[K[], V]\>

___

#### clear

▸ **clear**(): *void*

Removes all keys-value pairs from the MKMap object.

**Returns:** *void*

___

#### delete

▸ **delete**(`keys`: readonly K[]): *boolean*

Returns true if an element in the MKMap object existed and has been removed, or false if the element does not exist.

```
const mkMap = new MKMap([['foo'], 'bar']);

mkMap.delete(['foo']); // => true
mkMap.delete(['foo']); // => false
```

##### Parameters:

Name | Type |
:------ | :------ |
`keys` | readonly K[] |

**Returns:** *boolean*

___

#### entries

▸ **entries**(): *IterableIterator*<[K[], V]\>

Returns a new Iterator object that contains an array of [keys, value] for each element in the Map object.

**Returns:** *IterableIterator*<[K[], V]\>

___

#### forEach

▸ **forEach**(`callbackFn`: (`value`: V, `keys`: K[], `map`: [*MKMap*](#classesmkmapmd)<K, V\>) => *void*): *void*

Calls callbackFn once for each keys-value pair present in the MKMap object.

##### Parameters:

Name | Type |
:------ | :------ |
`callbackFn` | (`value`: V, `keys`: K[], `map`: [*MKMap*](#classesmkmapmd)<K, V\>) => *void* |

**Returns:** *void*

___

#### get

▸ **get**(`keys`: readonly K[]): *undefined* \| V

Returns the value associated to the keys, or undefined if there is none.

```
const mkMap = new MKMap([['foo'], 'bar']);

mkMap.get(['foo']); // => 'bar'
```

##### Parameters:

Name | Type |
:------ | :------ |
`keys` | readonly K[] |

**Returns:** *undefined* \| V

___

#### has

▸ **has**(`keys`: readonly K[]): *boolean*

Returns a boolean asserting whether a value has been associated to the keys in the MKMap object or not.

```
const mkMap = new MKMap([['foo'], 'bar']);

mkMap.has(['foo']); // => true
```

##### Parameters:

Name | Type |
:------ | :------ |
`keys` | readonly K[] |

**Returns:** *boolean*

___

#### keys

▸ **keys**(): *IterableIterator*<K[]\>

Returns a new Iterator object that contains the keys for each element in the MKMap.

**Returns:** *IterableIterator*<K[]\>

___

#### set

▸ **set**(`keys`: readonly K[], `value`: V): [*MKMap*](#classesmkmapmd)<K, V\>

Sets the value for the keys in the MKMap object. Returns the MKMap object.

```
mkMap.set(['foo'], 'bar');
```

##### Parameters:

Name | Type |
:------ | :------ |
`keys` | readonly K[] |
`value` | V |

**Returns:** [*MKMap*](#classesmkmapmd)<K, V\>

___

#### values

▸ **values**(): *IterableIterator*<V\>

Returns a new Iterator object that contains the values for each element in the MKMap object.

**Returns:** *IterableIterator*<V\>


<a name="classesmksetmd"></a>

## Class: MKSet<K\>

### Type parameters

Name | Default |
:------ | :------ |
`K` | *any* |

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Accessors

- [size](#size)

#### Methods

- [[Symbol.iterator]](mkset.md#[symbol.iterator])
- [add](#add)
- [clear](#clear)
- [delete](#delete)
- [entries](#entries)
- [forEach](#foreach)
- [has](#has)
- [keys](#keys)
- [values](#values)

### Constructors

#### constructor

\+ **new MKSet**<K\>(`iterable?`: *Iterable*<readonly K[]\>): [*MKSet*](#classesmksetmd)<K\>

Creates a new MKSet object.

Could be called with initial keys.

```
const empty = new MKSet();
const withKeys = new MKSet([
    ['key'],
    ['few', 'keys']
]);
```

##### Type parameters:

Name | Default |
:------ | :------ |
`K` | *any* |

##### Parameters:

Name | Type |
:------ | :------ |
`iterable?` | *Iterable*<readonly K[]\> |

**Returns:** [*MKSet*](#classesmksetmd)<K\>

### Accessors

#### size

• get **size**(): *number*

Returns the number of values in the MKSet object.

**Returns:** *number*

### Methods

#### [Symbol.iterator]

▸ **[Symbol.iterator]**(): *IterableIterator*<K[]\>

Returns a new Iterator object that yields the keys for each element in the MKSet object.

**Returns:** *IterableIterator*<K[]\>

___

#### add

▸ **add**(`keys`: readonly K[]): *void*

Appends keys to the MKSet object.

```
mkSet.add([1, 2, 3]);
```

##### Parameters:

Name | Type |
:------ | :------ |
`keys` | readonly K[] |

**Returns:** *void*

___

#### clear

▸ **clear**(): *void*

Removes all elements from the MKSet object.

**Returns:** *void*

___

#### delete

▸ **delete**(`keys`: readonly K[]): *boolean*

Removes the element associated to the keys and returns the value that MKSet.has(keys) would have previously returned. MKSet.has(keys) will return false afterwards.

```
const mkSet = new MKSet([['foo']]);

mkSet.delete(['foo']); // => true
mkSet.delete(['foo']); // => false
```

##### Parameters:

Name | Type |
:------ | :------ |
`keys` | readonly K[] |

**Returns:** *boolean*

___

#### entries

▸ **entries**(): *IterableIterator*<[K[], K[]]\>

Returns a new Iterator object that contains an array of [keys, keys] for each element in the MKSet object.

**Returns:** *IterableIterator*<[K[], K[]]\>

___

#### forEach

▸ **forEach**(`callbackFn`: (`value`: K[], `key`: K[], `map`: [*MKSet*](#classesmksetmd)<K\>) => *void*): *void*

Calls callbackFn once for each value present in the MKSet object.

##### Parameters:

Name | Type |
:------ | :------ |
`callbackFn` | (`value`: K[], `key`: K[], `map`: [*MKSet*](#classesmksetmd)<K\>) => *void* |

**Returns:** *void*

___

#### has

▸ **has**(`keys`: readonly K[]): *boolean*

Returns a boolean asserting whether an element is present with the given keys in the MKSet object or not.

```
const mkSet = new MKSet([['foo']]);

mkSet.has(['foo']); // => true
mkSet.has(['bar']); // => false
```

##### Parameters:

Name | Type |
:------ | :------ |
`keys` | readonly K[] |

**Returns:** *boolean*

___

#### keys

▸ **keys**(): *IterableIterator*<K[]\>

Returns a new Iterator object that yields the keys for each element in the MKSet object. (this is the same as the values() method.)

**Returns:** *IterableIterator*<K[]\>

___

#### values

▸ **values**(): *IterableIterator*<K[]\>

Returns a new Iterator object that yields the keys for each element in the MKSet object. (this is the same as the keys() method.)

**Returns:** *IterableIterator*<K[]\>


<a name="classesmkweakmapmd"></a>

## Class: MKWeakMap<K, V\>

### Type parameters

Name | Type | Default |
:------ | :------ | :------ |
`K` | *object* | *object* |
`V` | - | *any* |

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Methods

- [delete](#delete)
- [get](#get)
- [has](#has)
- [set](#set)

### Constructors

#### constructor

\+ **new MKWeakMap**<K, V\>(`iterable?`: *Iterable*<readonly readonly K[][]\>): [*MKWeakMap*](#classesmkweakmapmd)<K, V\>

Creates a new MKWeakMap object.

Could be called with initial keys-values

```
const empty = new MKWeakMap();
const withValues = new MKWeakMap([
    [[{foo: 'bar'}], 'val']
]);
```

##### Type parameters:

Name | Type | Default |
:------ | :------ | :------ |
`K` | *object* | *object* |
`V` | - | *any* |

##### Parameters:

Name | Type |
:------ | :------ |
`iterable?` | *Iterable*<readonly readonly K[][]\> |

**Returns:** [*MKWeakMap*](#classesmkweakmapmd)<K, V\>

### Methods

#### delete

▸ **delete**(`keys`: readonly K[]): *boolean*

Removes any value associated to the keys. Returns true if an element in the MKWeakMap object has been removed successfully.

```
const obj = {};
const mkWeakMap = new MKWeakMap([[obj, 'foo']]);

mkWeakMap.delete([obj]); // => true
mkWeakMap.delete([obj]); // => false
```

##### Parameters:

Name | Type |
:------ | :------ |
`keys` | readonly K[] |

**Returns:** *boolean*

___

#### get

▸ **get**(`keys`: readonly K[]): *undefined* \| V

Returns the value associated to the keys, or undefined if there is none.

```
const obj = {};
const mkWeakMap = new MKWeakMap([[obj, 'foo']]);

mkWeakMap.get([obj]); // => 'foo'
```

##### Parameters:

Name | Type |
:------ | :------ |
`keys` | readonly K[] |

**Returns:** *undefined* \| V

___

#### has

▸ **has**(`keys`: readonly K[]): *boolean*

Returns a Boolean asserting whether a value has been associated to the keys in the MKWeakMap object or not.

```
const obj = {};
const mkWeakMap = new MKWeakMap([[obj, 'foo']]);

mkWeakMap.has([obj]); // => 'true'
```

##### Parameters:

Name | Type |
:------ | :------ |
`keys` | readonly K[] |

**Returns:** *boolean*

___

#### set

▸ **set**(`keys`: readonly K[], `value`: V): [*MKWeakMap*](#classesmkweakmapmd)<K, V\>

Sets the value for the keys in the MKWeakMap object. Returns the MKWeakMap object.

```
const mkWeakMap = new MKWeakMap();
const obj = {};

mkWeakMap.set([obj], 'foo');
mkWeakMap.get([obj]); // => 'foo'
```

##### Parameters:

Name | Type |
:------ | :------ |
`keys` | readonly K[] |
`value` | V |

**Returns:** [*MKWeakMap*](#classesmkweakmapmd)<K, V\>


<a name="classesmkweaksetmd"></a>

## Class: MKWeakSet<K\>

### Type parameters

Name | Type |
:------ | :------ |
`K` | *object* |

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Methods

- [add](#add)
- [delete](#delete)
- [has](#has)

### Constructors

#### constructor

\+ **new MKWeakSet**<K\>(`iterable?`: *Iterable*<readonly K[]\>): [*MKWeakSet*](#classesmkweaksetmd)<K\>

Creates a new MKWeakSet object.

Could be called with initial keys

```
const empty = new MKWeakSet();
const withValues = new MKWeakSet([
    [{foo: 'bar'}]
]);
```

##### Type parameters:

Name | Type |
:------ | :------ |
`K` | *object* |

##### Parameters:

Name | Type |
:------ | :------ |
`iterable?` | *Iterable*<readonly K[]\> |

**Returns:** [*MKWeakSet*](#classesmkweaksetmd)<K\>

### Methods

#### add

▸ **add**(`keys`: readonly K[]): *void*

Add keys to the MKWeakSet object.

```
const mkWeakSet = new MKWeakSet();
const obj = {};

mkWeakSet.add([obj]);
mkWeakSet.has([obj]); // => 'true'
```

##### Parameters:

Name | Type |
:------ | :------ |
`keys` | readonly K[] |

**Returns:** *void*

___

#### delete

▸ **delete**(`keys`: readonly K[]): *boolean*

Removes keys from the MKWeakSet. Returns true if keys has been removed successfully.

```
const obj = {};
const mkWeakSet = new MKWeakSet([[obj]]);

mkWeakSet.delete([obj]); // => true
mkWeakSet.delete([obj]); // => false
```

##### Parameters:

Name | Type |
:------ | :------ |
`keys` | readonly K[] |

**Returns:** *boolean*

___

#### has

▸ **has**(`keys`: readonly K[]): *boolean*

Returns true if an element with the specified keys exists in the MKWeakSet object.

```
const obj = {};
const mkWeakSet = new MKWeakSet([[obj]]);

mkWeakSet.has([obj]); // => 'true'
```

##### Parameters:

Name | Type |
:------ | :------ |
`keys` | readonly K[] |

**Returns:** *boolean*
