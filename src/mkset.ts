import MKMap from "./mkmap";

class MKSet<K = any> {
  private _map = new MKMap<K, boolean>();

  /**
   * Creates a new MKSet object.
   *
   * Could be called with initial keys.
   *
   * ```
   * const empty = new MKSet();
   * const withKeys = new MKSet([
   *     ['key'],
   *     ['few', 'keys']
   * ]);
   * ```
   */
  constructor(iterable?: Iterable<readonly K[]>) {
    if (!iterable) {
      return;
    }

    for (const keys of iterable) {
      this.add(keys);
    }
  }

  /**
   * Returns the number of values in the MKSet object.
   */
  get size(): number {
    return this._map.size;
  }

  /**
   * Appends keys to the MKSet object.
   *
   * ```
   * mkSet.add([1, 2, 3]);
   * ```
   */
  add(keys: readonly K[]): this {
    this._map.set(keys, true);

    return this;
  }

  /**
   * Removes all elements from the MKSet object.
   */
  clear(): void {
    this._map.clear();
  }

  /**
   * Removes the element associated to the keys and returns the value that MKSet.has(keys) would have previously returned. MKSet.has(keys) will return false afterwards.
   *
   * ```
   * const mkSet = new MKSet([['foo']]);
   *
   * mkSet.delete(['foo']); // => true
   * mkSet.delete(['foo']); // => false
   * ```
   */
  delete(keys: readonly K[]): boolean {
    return this._map.delete(keys);
  }

  /**
   * Returns a boolean asserting whether an element is present with the given keys in the MKSet object or not.
   *
   * ```
   * const mkSet = new MKSet([['foo']]);
   *
   * mkSet.has(['foo']); // => true
   * mkSet.has(['bar']); // => false
   * ```
   */
  has(keys: readonly K[]): boolean {
    return this._map.has(keys);
  }

  /**
   * Returns a new Iterator object that yields the keys for each element in the MKSet object.
   */
  [Symbol.iterator](): IterableIterator<K[]> {
    const map = this._map;

    function* keys() {
      for (const [keys] of map) {
        yield keys;
      }
    }

    return keys();
  }

  /**
   * Returns a new Iterator object that contains an array of [keys, keys] for each element in the MKSet object.
   */
  entries(): IterableIterator<[K[], K[]]> {
    const map = this._map;

    function* entries(): Generator<[K[], K[]]> {
      for (const [keys] of map) {
        yield [keys, keys];
      }
    }

    return entries();
  }

  /**
   * Returns a new Iterator object that yields the keys for each element in the MKSet object. (this is the same as the keys() method.)
   */
  values(): IterableIterator<K[]> {
    return this._map.keys();
  }

  /**
   * Returns a new Iterator object that yields the keys for each element in the MKSet object. (this is the same as the values() method.)
   */
  keys(): IterableIterator<K[]> {
    return this.values();
  }

  /**
   * Calls callbackFn once for each value present in the MKSet object.
   */
  forEach(callbackFn: (value: K[], key: K[], map: this) => void): void {
    for (const keys of this) {
      callbackFn(keys, keys, this);
    }
  }
}

export default MKSet;
