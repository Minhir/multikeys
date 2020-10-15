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

# API

## Index

### Classes

* [MKMap](#classesmkmapmd)
* [MKSet](#classesmksetmd)
* [MKWeakMap](#classesmkweakmapmd)
* [MKWeakSet](#classesmkweaksetmd)


<a name="classesmkmapmd"></a>

# Class: MKMap\<K, V>

## Type parameters

Name | Default |
------ | ------ |
`K` | any |
`V` | any |

## Hierarchy

* **MKMap**

## Index

### Constructors

* [constructor](#constructor)

### Accessors

* [size](#size)

### Methods

* [[Symbol.iterator]](mkmap.md#[symbol.iterator])
* [clear](#clear)
* [delete](#delete)
* [entries](#entries)
* [forEach](#foreach)
* [get](#get)
* [has](#has)
* [keys](#keys)
* [set](#set)
* [values](#values)

## Constructors

### constructor

\+ **new MKMap**(`iterable?`: Iterable\<readonly [readonly K[], V]>): [MKMap](#classesmkmapmd)

*Defined in [mkmap.ts:14](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkmap.ts#L14)*

Creates a new MKMap object.

Could be called with initial keys-values.

```
const empty = new MKMap();
const withValues = new MKMap([
    [['key_1', 'key_2'], 'value'],
    [['key'], 'val']
]);
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`iterable?` | Iterable\<readonly [readonly K[], V]> | Optional array of initial keys  |

**Returns:** [MKMap](#classesmkmapmd)

## Accessors

### size

• get **size**(): number

*Defined in [mkmap.ts:44](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkmap.ts#L44)*

**Returns:** number

Size of the MKMap object

## Methods

### [Symbol.iterator]

▸ **[Symbol.iterator]**(): IterableIterator\<[K[], V]>

*Defined in [mkmap.ts:243](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkmap.ts#L243)*

Returns a new Iterator object that contains an array of [keys, value] for each element in the MKMap object.

**Returns:** IterableIterator\<[K[], V]>

Iterator of [keys, value]

___

### clear

▸ **clear**(): void

*Defined in [mkmap.ts:51](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkmap.ts#L51)*

Removes all keys-value pairs from the MKMap object.

**Returns:** void

___

### delete

▸ **delete**(`keys`: readonly K[]): boolean

*Defined in [mkmap.ts:137](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkmap.ts#L137)*

Returns true if an element in the MKMap object existed and has been removed, or false if the element does not exist.

```
const mkMap = new MKMap([['foo'], 'bar']);

mkMap.delete(['foo']); // => true
mkMap.delete(['foo']); // => false
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`keys` | readonly K[] | Array of keys |

**Returns:** boolean

True if an element was in the MKMap

___

### entries

▸ **entries**(): IterableIterator\<[K[], V]>

*Defined in [mkmap.ts:176](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkmap.ts#L176)*

Returns a new Iterator object that contains an array of [keys, value] for each element in the Map object.

**Returns:** IterableIterator\<[K[], V]>

Iterator of [keys, value]

___

### forEach

▸ **forEach**(`callbackfn`: (value: V,keys: K[],map: this) => void): void

*Defined in [mkmap.ts:232](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkmap.ts#L232)*

Calls callbackFn once for each keys-value pair present in the MKMap object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`callbackfn` | (value: V,keys: K[],map: this) => void | Callback function  |

**Returns:** void

___

### get

▸ **get**(`keys`: readonly K[]): V \| undefined

*Defined in [mkmap.ts:100](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkmap.ts#L100)*

Returns the value associated to the keys, or undefined if there is none.

```
const mkMap = new MKMap([['foo'], 'bar']);

mkMap.get(['foo']); // => 'bar'
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`keys` | readonly K[] | Array of keys |

**Returns:** V \| undefined

Value or undefined

___

### has

▸ **has**(`keys`: readonly K[]): boolean

*Defined in [mkmap.ts:118](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkmap.ts#L118)*

Returns a boolean asserting whether a value has been associated to the keys in the MKMap object or not.

```
const mkMap = new MKMap([['foo'], 'bar']);

mkMap.has(['foo']); // => true
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`keys` | readonly K[] | Array of keys |

**Returns:** boolean

True if MKMap contains keys

___

### keys

▸ **keys**(): IterableIterator\<K[]>

*Defined in [mkmap.ts:185](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkmap.ts#L185)*

Returns a new Iterator object that contains the keys for each element in the MKMap.

**Returns:** IterableIterator\<K[]>

Iterator over keys

___

### set

▸ **set**(`keys`: readonly K[], `value`: V): this

*Defined in [mkmap.ts:67](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkmap.ts#L67)*

Sets the value for the keys in the MKMap object. Returns the MKMap object.

```
mkMap.set(['foo'], 'bar');
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`keys` | readonly K[] | Array of keys |
`value` | V | Value associated with keys |

**Returns:** this

MKMap

___

### values

▸ **values**(): IterableIterator\<V>

*Defined in [mkmap.ts:202](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkmap.ts#L202)*

Returns a new Iterator object that contains the values for each element in the MKMap object.

**Returns:** IterableIterator\<V>

Iterator over values


<a name="classesmksetmd"></a>

# Class: MKSet\<K>

## Type parameters

Name | Default |
------ | ------ |
`K` | any |

## Hierarchy

* **MKSet**

## Index

### Constructors

* [constructor](#constructor)

### Accessors

* [size](#size)

### Methods

* [[Symbol.iterator]](mkset.md#[symbol.iterator])
* [add](#add)
* [clear](#clear)
* [delete](#delete)
* [entries](#entries)
* [forEach](#foreach)
* [has](#has)
* [keys](#keys)
* [values](#values)

## Constructors

### constructor

\+ **new MKSet**(`iterable?`: Iterable\<readonly K[]>): [MKSet](#classesmksetmd)

*Defined in [mkset.ts:6](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkset.ts#L6)*

Creates a new MKSet object.

Could be called with initial keys.

```
const empty = new MKSet();
const withKeys = new MKSet([
    ['key'],
    ['few', 'keys']
]);
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`iterable?` | Iterable\<readonly K[]> | Optional array of initial keys  |

**Returns:** [MKSet](#classesmksetmd)

## Accessors

### size

• get **size**(): number

*Defined in [mkset.ts:38](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkset.ts#L38)*

Returns the number of values in the MKSet object.

**Returns:** number

Size of the MKMap object

## Methods

### [Symbol.iterator]

▸ **[Symbol.iterator]**(): IterableIterator\<K[]>

*Defined in [mkset.ts:101](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkset.ts#L101)*

Returns a new Iterator object that yields the keys for each element in the MKSet object.

**Returns:** IterableIterator\<K[]>

Iterator over keys

___

### add

▸ **add**(`keys`: readonly K[]): void

*Defined in [mkset.ts:51](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkset.ts#L51)*

Appends keys to the MKSet object.

```
mkSet.add([1, 2, 3]);
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`keys` | readonly K[] | Array of keys  |

**Returns:** void

___

### clear

▸ **clear**(): void

*Defined in [mkset.ts:58](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkset.ts#L58)*

Removes all elements from the MKSet object.

**Returns:** void

___

### delete

▸ **delete**(`keys`: readonly K[]): boolean

*Defined in [mkset.ts:75](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkset.ts#L75)*

Removes the element associated to the keys and returns the value that MKSet.has(keys) would have previously returned. MKSet.has(keys) will return false afterwards.

```
const mkSet = new MKSet([['foo']]);

mkSet.delete(['foo']); // => true
mkSet.delete(['foo']); // => false
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`keys` | readonly K[] | Array of keys |

**Returns:** boolean

True if an element was in the MKMap

___

### entries

▸ **entries**(): IterableIterator\<[K[], K[]]>

*Defined in [mkset.ts:118](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkset.ts#L118)*

Returns a new Iterator object that contains an array of [keys, keys] for each element in the MKSet object.

**Returns:** IterableIterator\<[K[], K[]]>

Iterator of [keys, keys]

___

### forEach

▸ **forEach**(`callbackfn`: (value: K[],key: K[],map: this) => void): void

*Defined in [mkset.ts:153](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkset.ts#L153)*

Calls callbackFn once for each value present in the MKSet object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`callbackfn` | (value: K[],key: K[],map: this) => void | Callback function  |

**Returns:** void

___

### has

▸ **has**(`keys`: readonly K[]): boolean

*Defined in [mkset.ts:92](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkset.ts#L92)*

Returns a boolean asserting whether an element is present with the given keys in the MKSet object or not.

```
const mkSet = new MKSet([['foo']]);

mkSet.has(['foo']); // => true
mkSet.has(['bar']); // => false
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`keys` | readonly K[] | Array of keys |

**Returns:** boolean

True if MKMap contains keys

___

### keys

▸ **keys**(): IterableIterator\<K[]>

*Defined in [mkset.ts:144](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkset.ts#L144)*

Returns a new Iterator object that yields the keys for each element in the MKSet object. (this is the same as the values() method.)

**Returns:** IterableIterator\<K[]>

Iterator over keys

___

### values

▸ **values**(): IterableIterator\<K[]>

*Defined in [mkset.ts:135](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkset.ts#L135)*

Returns a new Iterator object that yields the keys for each element in the MKSet object. (this is the same as the keys() method.)

**Returns:** IterableIterator\<K[]>

Iterator over keys


<a name="classesmkweakmapmd"></a>

# Class: MKWeakMap\<K, V>

## Type parameters

Name | Type | Default |
------ | ------ | ------ |
`K` | object | object |
`V` | - | any |

## Hierarchy

* **MKWeakMap**

## Index

### Constructors

* [constructor](#constructor)

### Methods

* [delete](#delete)
* [get](#get)
* [has](#has)
* [set](#set)

## Constructors

### constructor

\+ **new MKWeakMap**(`iterable?`: Iterable\<readonly [readonly K[], V]>): [MKWeakMap](#classesmkweakmapmd)

*Defined in [mkweakmap.ts:12](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkweakmap.ts#L12)*

Creates a new MKWeakMap object.

Could be called with initial keys-values

```
const empty = new MKWeakMap();
const withValues = new MKWeakMap([
    [[{foo: 'bar'}], 'val']
]);
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`iterable?` | Iterable\<readonly [readonly K[], V]> | Optional array of initial keys  |

**Returns:** [MKWeakMap](#classesmkweakmapmd)

## Methods

### delete

▸ **delete**(`keys`: readonly K[]): boolean

*Defined in [mkweakmap.ts:52](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkweakmap.ts#L52)*

Removes any value associated to the keys. Returns true if an element in the MKWeakMap object has been removed successfully.

```
const obj = {};
const mkWeakMap = new MKWeakMap([[obj, 'foo']]);

mkWeakMap.delete([obj]); // => true
mkWeakMap.delete([obj]); // => false
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`keys` | readonly K[] | Array of keys |

**Returns:** boolean

True if an element was in the MKMap

___

### get

▸ **get**(`keys`: readonly K[]): V \| undefined

*Defined in [mkweakmap.ts:92](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkweakmap.ts#L92)*

Returns the value associated to the keys, or undefined if there is none.

```
const obj = {};
const mkWeakMap = new MKWeakMap([[obj, 'foo']]);

mkWeakMap.get([obj]); // => 'foo'
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`keys` | readonly K[] | Array of keys |

**Returns:** V \| undefined

Value or undefined

___

### has

▸ **has**(`keys`: readonly K[]): boolean

*Defined in [mkweakmap.ts:111](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkweakmap.ts#L111)*

Returns a Boolean asserting whether a value has been associated to the keys in the MKWeakMap object or not.

```
const obj = {};
const mkWeakMap = new MKWeakMap([[obj, 'foo']]);

mkWeakMap.has([obj]); // => 'true'
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`keys` | readonly K[] | Array of keys |

**Returns:** boolean

True if MKMap contains keys

___

### set

▸ **set**(`keys`: readonly K[], `value`: V): this

*Defined in [mkweakmap.ts:132](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkweakmap.ts#L132)*

Sets the value for the keys in the MKWeakMap object. Returns the MKWeakMap object.

```
const mkWeakMap = new MKWeakMap();
const obj = {};

mkWeakMap.set([obj], 'foo');
mkWeakMap.get([obj]); // => 'foo'
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`keys` | readonly K[] | Array of keys |
`value` | V | Value associated with keys |

**Returns:** this

MKWeakMap


<a name="classesmkweaksetmd"></a>

# Class: MKWeakSet\<K>

## Type parameters

Name | Type |
------ | ------ |
`K` | object |

## Hierarchy

* **MKWeakSet**

## Index

### Constructors

* [constructor](#constructor)

### Methods

* [add](#add)
* [delete](#delete)
* [has](#has)

## Constructors

### constructor

\+ **new MKWeakSet**(`iterable?`: Iterable\<readonly K[]>): [MKWeakSet](#classesmkweaksetmd)

*Defined in [mkweakset.ts:5](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkweakset.ts#L5)*

Creates a new MKWeakSet object.

Could be called with initial keys

```
const empty = new MKWeakSet();
const withValues = new MKWeakSet([
    [{foo: 'bar'}]
]);
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`iterable?` | Iterable\<readonly K[]> | Optional array of initial keys  |

**Returns:** [MKWeakSet](#classesmkweaksetmd)

## Methods

### add

▸ **add**(`keys`: readonly K[]): void

*Defined in [mkweakset.ts:44](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkweakset.ts#L44)*

Add keys to the MKWeakSet object.

```
const mkWeakSet = new MKWeakSet();
const obj = {};

mkWeakSet.add([obj]);
mkWeakSet.has([obj]); // => 'true'
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`keys` | readonly K[] | Array of keys  |

**Returns:** void

___

### delete

▸ **delete**(`keys`: readonly K[]): boolean

*Defined in [mkweakset.ts:62](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkweakset.ts#L62)*

Removes keys from the MKWeakSet. Returns true if keys has been removed successfully.

```
const obj = {};
const mkWeakSet = new MKWeakSet([[obj]]);

mkWeakSet.delete([obj]); // => true
mkWeakSet.delete([obj]); // => false
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`keys` | readonly K[] | Array of keys |

**Returns:** boolean

True if an element was in the MKMap

___

### has

▸ **has**(`keys`: readonly K[]): boolean

*Defined in [mkweakset.ts:79](https://github.com/Minhir/multikeys/blob/bffabe4/src/mkweakset.ts#L79)*

Returns true if an element with the specified keys exists in the MKWeakSet object.

```
const obj = {};
const mkWeakSet = new MKWeakSet([[obj]]);

mkWeakSet.has([obj]); // => 'true'
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`keys` | readonly K[] | Array of keys |

**Returns:** boolean

True if MKMap contains keys
