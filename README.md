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

# API
## Classes

<dl>
<dt><a href="#MKMap">MKMap</a></dt>
<dd></dd>
<dt><a href="#MKSet">MKSet</a></dt>
<dd></dd>
<dt><a href="#MKWeakMap">MKWeakMap</a></dt>
<dd></dd>
<dt><a href="#MKWeakSet">MKWeakSet</a></dt>
<dd></dd>
</dl>

<a name="MKMap"></a>

## MKMap
**Kind**: global class  

* [MKMap](#MKMap)
    * [new MKMap(iterable)](#new_MKMap_new)
    * [.size](#MKMap+size) ⇒
    * [.clear()](#MKMap+clear)
    * [.set(keys, value)](#MKMap+set) ⇒
    * [.get(keys)](#MKMap+get) ⇒
    * [.has(keys)](#MKMap+has) ⇒
    * [.delete(keys)](#MKMap+delete) ⇒
    * [.entries()](#MKMap+entries) ⇒
    * [.keys()](#MKMap+keys) ⇒
    * [.values()](#MKMap+values) ⇒
    * [.forEach(callbackfn)](#MKMap+forEach)

<a name="new_MKMap_new"></a>

### new MKMap(iterable)
<p>Creates a new MKMap object.</p>
<p>Could be called with initial keys-values.</p>
<pre class="prettyprint source"><code>const empty = new MKMap();
const withValues = new MKMap([
    [['key_1', 'key_2'], 'value'],
    [['key'], 'val']
]);
</code></pre>


| Param | Description |
| --- | --- |
| iterable | <p>Optional array of initial keys</p> |

<a name="MKMap+size"></a>

### mkMap.size ⇒
**Kind**: instance property of [<code>MKMap</code>](#MKMap)  
**Returns**: <p>Size of the MKMap object</p>  
<a name="MKMap+clear"></a>

### mkMap.clear()
<p>Removes all keys-value pairs from the MKMap object.</p>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
<a name="MKMap+set"></a>

### mkMap.set(keys, value) ⇒
<p>Sets the value for the keys in the MKMap object. Returns the MKMap object.</p>
<pre class="prettyprint source"><code>mkMap.set(['foo'], 'bar');
</code></pre>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
**Returns**: <p>MKMap</p>  

| Param | Description |
| --- | --- |
| keys | <p>Array of keys</p> |
| value | <p>Value associated with keys</p> |

<a name="MKMap+get"></a>

### mkMap.get(keys) ⇒
<p>Returns the value associated to the keys, or undefined if there is none.</p>
<pre class="prettyprint source"><code>const mkMap = new MKMap([['foo'], 'bar']);

mkMap.get(['foo']); // => 'bar'
</code></pre>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
**Returns**: <p>Value or undefined</p>  

| Param | Description |
| --- | --- |
| keys | <p>Array of keys</p> |

<a name="MKMap+has"></a>

### mkMap.has(keys) ⇒
<p>Returns a boolean asserting whether a value has been associated to the keys in the MKMap object or not.</p>
<pre class="prettyprint source"><code>const mkMap = new MKMap([['foo'], 'bar']);

mkMap.has(['foo']); // => true
</code></pre>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
**Returns**: <p>True if MKMap contains keys</p>  

| Param | Description |
| --- | --- |
| keys | <p>Array of keys</p> |

<a name="MKMap+delete"></a>

### mkMap.delete(keys) ⇒
<p>Returns true if an element in the MKMap object existed and has been removed, or false if the element does not exist.</p>
<pre class="prettyprint source"><code>const mkMap = new MKMap([['foo'], 'bar']);

mkMap.delete(['foo']); // => true
mkMap.delete(['foo']); // => false
</code></pre>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
**Returns**: <p>True if an element was in the MKMap</p>  

| Param | Description |
| --- | --- |
| keys | <p>Array of keys</p> |

<a name="MKMap+entries"></a>

### mkMap.entries() ⇒
<p>Returns a new Iterator object that contains an array of [keys, value] for each element in the Map object.</p>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
**Returns**: <p>Iterator of [keys, value]</p>  
<a name="MKMap+keys"></a>

### mkMap.keys() ⇒
<p>Returns a new Iterator object that contains the keys for each element in the MKMap.</p>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
**Returns**: <p>Iterator over keys</p>  
<a name="MKMap+values"></a>

### mkMap.values() ⇒
<p>Returns a new Iterator object that contains the values for each element in the MKMap object.</p>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
**Returns**: <p>Iterator over values</p>  
<a name="MKMap+forEach"></a>

### mkMap.forEach(callbackfn)
<p>Calls callbackFn once for each keys-value pair present in the MKMap object.</p>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  

| Param | Description |
| --- | --- |
| callbackfn | <p>Callback function</p> |

<a name="MKSet"></a>

## MKSet
**Kind**: global class  

* [MKSet](#MKSet)
    * [new MKSet(iterable)](#new_MKSet_new)
    * [.size](#MKSet+size) ⇒
    * [.add(keys)](#MKSet+add)
    * [.clear()](#MKSet+clear)
    * [.delete(keys)](#MKSet+delete) ⇒
    * [.has(keys)](#MKSet+has) ⇒
    * [.entries()](#MKSet+entries) ⇒
    * [.values()](#MKSet+values) ⇒
    * [.keys()](#MKSet+keys) ⇒
    * [.forEach(callbackfn)](#MKSet+forEach)

<a name="new_MKSet_new"></a>

### new MKSet(iterable)
<p>Creates a new MKSet object.</p>
<p>Could be called with initial keys.</p>
<pre class="prettyprint source"><code>const empty = new MKSet();
const withKeys = new MKSet([
    ['key'],
    ['few', 'keys']
]);
</code></pre>


| Param | Description |
| --- | --- |
| iterable | <p>Optional array of initial keys</p> |

<a name="MKSet+size"></a>

### mkSet.size ⇒
<p>Returns the number of values in the MKSet object.</p>

**Kind**: instance property of [<code>MKSet</code>](#MKSet)  
**Returns**: <p>Size of the MKMap object</p>  
<a name="MKSet+add"></a>

### mkSet.add(keys)
<p>Appends keys to the MKSet object.</p>
<pre class="prettyprint source"><code>mkSet.add([1, 2, 3]);
</code></pre>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  

| Param | Description |
| --- | --- |
| keys | <p>Array of keys</p> |

<a name="MKSet+clear"></a>

### mkSet.clear()
<p>Removes all elements from the MKSet object.</p>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  
<a name="MKSet+delete"></a>

### mkSet.delete(keys) ⇒
<p>Removes the element associated to the keys and returns the value that MKSet.has(keys) would have previously returned. MKSet.has(keys) will return false afterwards.</p>
<pre class="prettyprint source"><code>const mkSet = new MKSet([['foo']]);

mkSet.delete(['foo']); // => true
mkSet.delete(['foo']); // => false
</code></pre>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  
**Returns**: <p>True if an element was in the MKMap</p>  

| Param | Description |
| --- | --- |
| keys | <p>Array of keys</p> |

<a name="MKSet+has"></a>

### mkSet.has(keys) ⇒
<p>Returns a boolean asserting whether an element is present with the given keys in the MKSet object or not.</p>
<pre class="prettyprint source"><code>const mkSet = new MKSet([['foo']]);

mkSet.has(['foo']); // => true
mkSet.has(['bar']); // => false
</code></pre>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  
**Returns**: <p>True if MKMap contains keys</p>  

| Param | Description |
| --- | --- |
| keys | <p>Array of keys</p> |

<a name="MKSet+entries"></a>

### mkSet.entries() ⇒
<p>Returns a new Iterator object that contains an array of [keys, keys] for each element in the MKSet object.</p>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  
**Returns**: <p>Iterator of [keys, keys]</p>  
<a name="MKSet+values"></a>

### mkSet.values() ⇒
<p>Returns a new Iterator object that yields the keys for each element in the MKSet object. (this is the same as the keys() method.)</p>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  
**Returns**: <p>Iterator over keys</p>  
<a name="MKSet+keys"></a>

### mkSet.keys() ⇒
<p>Returns a new Iterator object that yields the keys for each element in the MKSet object. (this is the same as the values() method.)</p>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  
**Returns**: <p>Iterator over keys</p>  
<a name="MKSet+forEach"></a>

### mkSet.forEach(callbackfn)
<p>Calls callbackFn once for each value present in the MKSet object.</p>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  

| Param | Description |
| --- | --- |
| callbackfn | <p>Callback function</p> |

<a name="MKWeakMap"></a>

## MKWeakMap
**Kind**: global class  

* [MKWeakMap](#MKWeakMap)
    * [new MKWeakMap(iterable)](#new_MKWeakMap_new)
    * [.delete(keys)](#MKWeakMap+delete) ⇒
    * [.get(keys)](#MKWeakMap+get) ⇒
    * [.has(keys)](#MKWeakMap+has) ⇒
    * [.set(keys, value)](#MKWeakMap+set) ⇒

<a name="new_MKWeakMap_new"></a>

### new MKWeakMap(iterable)
<p>Creates a new MKWeakMap object.</p>
<p>Could be called with initial keys-values</p>
<pre class="prettyprint source"><code>const empty = new MKWeakMap();
const withValues = new MKWeakMap([
    [[{foo: 'bar'}], 'val']
]);
</code></pre>


| Param | Description |
| --- | --- |
| iterable | <p>Optional array of initial keys</p> |

<a name="MKWeakMap+delete"></a>

### mkWeakMap.delete(keys) ⇒
<p>Removes any value associated to the keys. Returns true if an element in the MKWeakMap object has been removed successfully.</p>
<pre class="prettyprint source"><code>const obj = {};
const mkWeakMap = new MKWeakMap([[obj, 'foo']]);

mkWeakMap.delete([obj]); // => true
mkWeakMap.delete([obj]); // => false
</code></pre>

**Kind**: instance method of [<code>MKWeakMap</code>](#MKWeakMap)  
**Returns**: <p>True if an element was in the MKMap</p>  

| Param | Description |
| --- | --- |
| keys | <p>Array of keys</p> |

<a name="MKWeakMap+get"></a>

### mkWeakMap.get(keys) ⇒
<p>Returns the value associated to the keys, or undefined if there is none.</p>
<pre class="prettyprint source"><code>const obj = {};
const mkWeakMap = new MKWeakMap([[obj, 'foo']]);

mkWeakMap.get([obj]); // => 'foo'
</code></pre>

**Kind**: instance method of [<code>MKWeakMap</code>](#MKWeakMap)  
**Returns**: <p>Value or undefined</p>  

| Param | Description |
| --- | --- |
| keys | <p>Array of keys</p> |

<a name="MKWeakMap+has"></a>

### mkWeakMap.has(keys) ⇒
<p>Returns a Boolean asserting whether a value has been associated to the keys in the MKWeakMap object or not.</p>
<pre class="prettyprint source"><code>const obj = {};
const mkWeakMap = new MKWeakMap([[obj, 'foo']]);

mkWeakMap.has([obj]); // => 'true'
</code></pre>

**Kind**: instance method of [<code>MKWeakMap</code>](#MKWeakMap)  
**Returns**: <p>True if MKMap contains keys</p>  

| Param | Description |
| --- | --- |
| keys | <p>Array of keys</p> |

<a name="MKWeakMap+set"></a>

### mkWeakMap.set(keys, value) ⇒
<p>Sets the value for the keys in the MKWeakMap object. Returns the MKWeakMap object.</p>
<pre class="prettyprint source"><code>const mkWeakMap = new MKWeakMap();
const obj = {};

mkWeakMap.set([obj], 'foo');
mkWeakMap.get([obj]); // => 'foo'
</code></pre>

**Kind**: instance method of [<code>MKWeakMap</code>](#MKWeakMap)  
**Returns**: <p>MKWeakMap</p>  

| Param | Description |
| --- | --- |
| keys | <p>Array of keys</p> |
| value | <p>Value associated with keys</p> |

<a name="MKWeakSet"></a>

## MKWeakSet
**Kind**: global class  

* [MKWeakSet](#MKWeakSet)
    * [new MKWeakSet(iterable)](#new_MKWeakSet_new)
    * [.add(keys)](#MKWeakSet+add)
    * [.delete(keys)](#MKWeakSet+delete) ⇒
    * [.has(keys)](#MKWeakSet+has) ⇒

<a name="new_MKWeakSet_new"></a>

### new MKWeakSet(iterable)
<p>Creates a new MKWeakSet object.</p>
<p>Could be called with initial keys</p>
<pre class="prettyprint source"><code>const empty = new MKWeakSet();
const withValues = new MKWeakSet([
    [{foo: 'bar'}]
]);
</code></pre>


| Param | Description |
| --- | --- |
| iterable | <p>Optional array of initial keys</p> |

<a name="MKWeakSet+add"></a>

### mkWeakSet.add(keys)
<p>Add keys to the MKWeakSet object.</p>
<pre class="prettyprint source"><code>const mkWeakSet = new MKWeakSet();
const obj = {};

mkWeakSet.add([obj]);
mkWeakSet.has([obj]); // => 'true'
</code></pre>

**Kind**: instance method of [<code>MKWeakSet</code>](#MKWeakSet)  

| Param | Description |
| --- | --- |
| keys | <p>Array of keys</p> |

<a name="MKWeakSet+delete"></a>

### mkWeakSet.delete(keys) ⇒
<p>Removes keys from the MKWeakSet. Returns true if keys has been removed successfully.</p>
<pre class="prettyprint source"><code>const obj = {};
const mkWeakSet = new MKWeakSet([[obj]]);

mkWeakSet.delete([obj]); // => true
mkWeakSet.delete([obj]); // => false
</code></pre>

**Kind**: instance method of [<code>MKWeakSet</code>](#MKWeakSet)  
**Returns**: <p>True if an element was in the MKMap</p>  

| Param | Description |
| --- | --- |
| keys | <p>Array of keys</p> |

<a name="MKWeakSet+has"></a>

### mkWeakSet.has(keys) ⇒
<p>Returns true if an element with the specified keys exists in the MKWeakSet object.</p>
<pre class="prettyprint source"><code>const obj = {};
const mkWeakSet = new MKWeakSet([[obj]]);

mkWeakSet.has([obj]); // => 'true'
</code></pre>

**Kind**: instance method of [<code>MKWeakSet</code>](#MKWeakSet)  
**Returns**: <p>True if MKMap contains keys</p>  

| Param | Description |
| --- | --- |
| keys | <p>Array of keys</p> |

