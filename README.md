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
    * [new MKMap()](#new_MKMap_new)
    * [.size](#MKMap+size)
    * [.clear()](#MKMap+clear)
    * [.set()](#MKMap+set)
    * [.get()](#MKMap+get)
    * [.has()](#MKMap+has)
    * [.delete()](#MKMap+delete)
    * [.entries()](#MKMap+entries)
    * [.keys()](#MKMap+keys)
    * [.values()](#MKMap+values)
    * [.forEach()](#MKMap+forEach)
    * [._Symbol$iterator()](#MKMap+_Symbol$iterator)

<a name="new_MKMap_new"></a>

### new MKMap()
<p>Creates a new MKMap object.</p>
<p>Could be called with initial keys-values</p>
<pre class="prettyprint source"><code>const empty = new MKMap();
const withValues = new MKMap([
    [['key_1', 'key_2'], 'value'],
    [['key'], 'val']
]);
</code></pre>

<a name="MKMap+size"></a>

### mkMap.size
<p>Returns the number of keys/value pairs in the MKMap object.</p>

**Kind**: instance property of [<code>MKMap</code>](#MKMap)  
<a name="MKMap+clear"></a>

### mkMap.clear()
<p>Removes all keys-value pairs from the MKMap object.</p>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
<a name="MKMap+set"></a>

### mkMap.set()
<p>Sets the value for the keys in the MKMap object. Returns the MKMap object.</p>
<pre class="prettyprint source"><code>map.set(['foo'], 'bar');
</code></pre>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
<a name="MKMap+get"></a>

### mkMap.get()
<p>Returns the value associated to the keys, or undefined if there is none.</p>
<pre class="prettyprint source"><code>const map = new Map([['foo'], 'bar']);

map.get(['foo']); // => 'bar'
</code></pre>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
<a name="MKMap+has"></a>

### mkMap.has()
<p>Returns a boolean asserting whether a value has been associated to the keys in the MKMap object or not.</p>
<pre class="prettyprint source"><code>const map = new Map([['foo'], 'bar']);

map.has(['foo']); // => true
</code></pre>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
<a name="MKMap+delete"></a>

### mkMap.delete()
<p>Returns true if an element in the KMMap object existed and has been removed, or false if the element does not exist.</p>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
<a name="MKMap+entries"></a>

### mkMap.entries()
<p>Returns a new Iterator object that contains an array of [keys, value] for each element in the Map object.</p>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
<a name="MKMap+keys"></a>

### mkMap.keys()
<p>Returns a new Iterator object that contains the keys for each element in the MKMap.</p>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
<a name="MKMap+values"></a>

### mkMap.values()
<p>Returns a new Iterator object that contains the values for each element in the MKMap object.</p>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
<a name="MKMap+forEach"></a>

### mkMap.forEach()
<p>Calls callbackFn once for each keys-value pair present in the MKMap object.</p>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
<a name="MKMap+_Symbol$iterator"></a>

### mkMap.\_Symbol$iterator()
<p>Returns a new Iterator object that contains an array of [keys, value] for each element in the MKMap object.</p>

**Kind**: instance method of [<code>MKMap</code>](#MKMap)  
<a name="MKSet"></a>

## MKSet
**Kind**: global class  

* [MKSet](#MKSet)
    * [new MKSet()](#new_MKSet_new)
    * [.size](#MKSet+size)
    * [.add()](#MKSet+add)
    * [.clear()](#MKSet+clear)
    * [.delete()](#MKSet+delete)
    * [.has()](#MKSet+has)
    * [._Symbol$iterator()](#MKSet+_Symbol$iterator)
    * [.entries()](#MKSet+entries)
    * [.values()](#MKSet+values)
    * [.keys()](#MKSet+keys)
    * [.forEach()](#MKSet+forEach)

<a name="new_MKSet_new"></a>

### new MKSet()
<p>Creates a new MKSet object.</p>
<p>Could be called with initial keys.</p>
<pre class="prettyprint source"><code>const empty = new MKSet();
const withKeys = new MKSet([
    ['key'],
    ['few', 'keys']
]);
</code></pre>

<a name="MKSet+size"></a>

### mkSet.size
<p>Returns the number of values in the MKSet object.</p>

**Kind**: instance property of [<code>MKSet</code>](#MKSet)  
<a name="MKSet+add"></a>

### mkSet.add()
<p>Appends keys to the MKSet object.</p>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  
<a name="MKSet+clear"></a>

### mkSet.clear()
<p>Removes all elements from the MKSet object.</p>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  
<a name="MKSet+delete"></a>

### mkSet.delete()
<p>Removes the element associated to the keys and returns the value that MKSet.has(keys) would have previously returned. MKSet.has(keys) will return false afterwards.</p>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  
<a name="MKSet+has"></a>

### mkSet.has()
<p>Returns a boolean asserting whether an element is present with the given keys in the MKSet object or not.</p>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  
<a name="MKSet+_Symbol$iterator"></a>

### mkSet.\_Symbol$iterator()
<p>Returns a new Iterator object that yields the keys for each element in the MKSet object.</p>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  
<a name="MKSet+entries"></a>

### mkSet.entries()
<p>Returns a new Iterator object that contains an array of [keys, keys] for each element in the MKSet object.</p>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  
<a name="MKSet+values"></a>

### mkSet.values()
<p>Returns a new Iterator object that yields the keys for each element in the MKSet object. (this is the same as the keys() method.)</p>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  
<a name="MKSet+keys"></a>

### mkSet.keys()
<p>Returns a new Iterator object that yields the keys for each element in the MKSet object. (this is the same as the values() method.)</p>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  
<a name="MKSet+forEach"></a>

### mkSet.forEach()
<p>Calls callbackFn once for each value present in the MKSet object.</p>

**Kind**: instance method of [<code>MKSet</code>](#MKSet)  
<a name="MKWeakMap"></a>

## MKWeakMap
**Kind**: global class  

* [MKWeakMap](#MKWeakMap)
    * [new MKWeakMap()](#new_MKWeakMap_new)
    * [.delete()](#MKWeakMap+delete)
    * [.get()](#MKWeakMap+get)
    * [.has()](#MKWeakMap+has)
    * [.set()](#MKWeakMap+set)

<a name="new_MKWeakMap_new"></a>

### new MKWeakMap()
<p>Creates a new MKWeakMap object.</p>
<p>Could be called with initial keys-values</p>
<pre class="prettyprint source"><code>const empty = new MKWeakMap();
const withValues = new MKWeakMap([
    [[[1, 2], [3, 4]], 'value'],
    [[{foo: 'bar'}], 'val']
]);</code></pre>

<a name="MKWeakMap+delete"></a>

### mkWeakMap.delete()
<p>Removes any value associated to the keys. Returns true if an element in the MKWeakMap object has been removed successfully.</p>

**Kind**: instance method of [<code>MKWeakMap</code>](#MKWeakMap)  
<a name="MKWeakMap+get"></a>

### mkWeakMap.get()
<p>Returns the value associated to the keys, or undefined if there is none.</p>

**Kind**: instance method of [<code>MKWeakMap</code>](#MKWeakMap)  
<a name="MKWeakMap+has"></a>

### mkWeakMap.has()
<p>Returns a Boolean asserting whether a value has been associated to the keys in the MKWeakMap object or not.</p>

**Kind**: instance method of [<code>MKWeakMap</code>](#MKWeakMap)  
<a name="MKWeakMap+set"></a>

### mkWeakMap.set()
<p>Sets the value for the keys in the MKWeakMap object. Returns the MKWeakMap object.</p>

**Kind**: instance method of [<code>MKWeakMap</code>](#MKWeakMap)  
<a name="MKWeakSet"></a>

## MKWeakSet
**Kind**: global class  

* [MKWeakSet](#MKWeakSet)
    * [new MKWeakSet()](#new_MKWeakSet_new)
    * [.add()](#MKWeakSet+add)
    * [.delete()](#MKWeakSet+delete)
    * [.has()](#MKWeakSet+has)

<a name="new_MKWeakSet_new"></a>

### new MKWeakSet()
<p>Creates a new MKWeakSet object.</p>
<p>Could be called with initial keys</p>
<pre class="prettyprint source"><code>const empty = new MKWeakSet();
const withValues = new MKWeakSet([
    [[1, 2], [3, 4]],
    [{foo: 'bar'}]
]);</code></pre>

<a name="MKWeakSet+add"></a>

### mkWeakSet.add()
<p>Add keys to the MKWeakSet object.</p>

**Kind**: instance method of [<code>MKWeakSet</code>](#MKWeakSet)  
<a name="MKWeakSet+delete"></a>

### mkWeakSet.delete()
<p>Removes keys from the MKWeakSet. Returns true if keys has been removed successfully.</p>

**Kind**: instance method of [<code>MKWeakSet</code>](#MKWeakSet)  
<a name="MKWeakSet+has"></a>

### mkWeakSet.has()
<p>Returns true if an element with the specified keys exists in the MKWeakSet object.</p>

**Kind**: instance method of [<code>MKWeakSet</code>](#MKWeakSet)  
