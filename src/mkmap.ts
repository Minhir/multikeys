import { getLastValueHandler, type ValueHandler } from "./utils";

/** @internal */
function createNewValueHandler<K, V>(): ValueHandler<K, V> {
  return {
    next: new Map(),
  };
}

class MKMap<K = any, V = any> {
  private _size = 0;
  private _root = createNewValueHandler<K, V>();

  /**
   * Creates a new MKMap object.
   *
   * Could be called with initial keys-values.
   *
   * ```
   * const empty = new MKMap();
   * const withValues = new MKMap([
   *     [['key_1', 'key_2'], 'value'],
   *     [['key'], 'val']
   * ]);
   * ```
   */
  constructor(iterable?: Iterable<readonly [readonly K[], V]>) {
    if (!iterable) {
      return;
    }

    for (const [keys, value] of iterable) {
      this.set(keys, value);
    }
  }

  /**
   * Returns the number of keys/value pairs in the MKMap object.
   */
  get size(): number {
    return this._size;
  }

  /**
   * Removes all keys-value pairs from the MKMap object.
   */
  clear(): void {
    this._root = createNewValueHandler();
    this._size = 0;
  }

  /**
   * Sets the value for the keys in the MKMap object. Returns the MKMap object.
   *
   * ```
   * mkMap.set(['foo'], 'bar');
   * ```
   */
  set(keys: readonly K[], value: V): this {
    if (!Array.isArray(keys)) {
      throw new Error("Keys should be an array");
    }

    const handler = getLastValueHandler(
      this._root,
      keys,
      createNewValueHandler,
    );

    if (!handler) {
      /* v8 ignore next 4 */
      throw new Error(
        "Multikeys: can't set keys. There is some internal problem.",
      ); // Should never be called
    }

    if (!handler.hasOwnProperty("val")) {
      this._size++;
    }

    handler.val = value;

    return this;
  }

  /**
   * Returns the value associated to the keys, or undefined if there is none.
   *
   * ```
   * const mkMap = new MKMap([['foo'], 'bar']);
   *
   * mkMap.get(['foo']); // => 'bar'
   * ```
   */
  get(keys: readonly K[]): V | undefined {
    const handler = getLastValueHandler(this._root, keys);

    return handler?.val;
  }

  /**
   * Returns a boolean asserting whether a value has been associated to the keys in the MKMap object or not.
   *
   * ```
   * const mkMap = new MKMap([['foo'], 'bar']);
   *
   * mkMap.has(['foo']); // => true
   * ```
   */
  has(keys: readonly K[]): boolean {
    const handler = getLastValueHandler(this._root, keys);

    return handler ? handler.hasOwnProperty("val") : false;
  }

  /**
   * Returns true if an element in the MKMap object existed and has been removed, or false if the element does not exist.
   *
   * ```
   * const mkMap = new MKMap([['foo'], 'bar']);
   *
   * mkMap.delete(['foo']); // => true
   * mkMap.delete(['foo']); // => false
   * ```
   */
  delete(keys: readonly K[]): boolean {
    const len = keys.length;

    const f = (handler: ValueHandler<K, V>, ind: number): boolean => {
      if (ind === len) {
        if (!handler.hasOwnProperty("val")) {
          return false;
        }

        this._size--;
        delete handler["val"];

        return true;
      }

      const key = keys[ind];
      const nextHandler = handler.next.get(key);

      if (!nextHandler) {
        return false;
      }

      const res = f(nextHandler, ind + 1);

      if (
        res &&
        nextHandler.next.size === 0 &&
        !nextHandler.hasOwnProperty("val")
      ) {
        handler.next.delete(key);
      }

      return res;
    };

    return f(this._root, 0);
  }

  /**
   * Returns a new Iterator object that contains an array of [keys, value] for each element in the Map object.
   */
  entries(): IterableIterator<[K[], V]> {
    return this[Symbol.iterator]();
  }

  /**
   * Returns a new Iterator object that contains the keys for each element in the MKMap.
   */
  keys(): IterableIterator<K[]> {
    const self = this;

    function* keys() {
      for (const [key] of self) {
        yield key;
      }
    }

    return keys();
  }

  /**
   * Returns a new Iterator object that contains the values for each element in the MKMap object.
   */
  values(): IterableIterator<V> {
    const keys: K[] = [];

    function* dfs(handler: ValueHandler<K, V>): Generator<V> {
      if (keys.length === 0 && handler.hasOwnProperty("val")) {
        yield handler.val!;
      }

      for (const [k, v] of handler.next) {
        keys.push(k);

        if (v.hasOwnProperty("val")) {
          yield v.val!;
        }

        yield* dfs(v);
        keys.pop();
      }
    }

    return dfs(this._root);
  }

  /**
   * Calls callbackFn once for each keys-value pair present in the MKMap object.
   */
  forEach(callbackFn: (value: V, keys: K[], map: this) => void): void {
    for (const [keys, value] of this) {
      callbackFn(value, keys, this);
    }
  }

  /**
   * Returns a new Iterator object that contains an array of [keys, value] for each element in the MKMap object.
   */
  [Symbol.iterator](): IterableIterator<[K[], V]> {
    const keys: K[] = [];

    function* dfs(handler: ValueHandler<K, V>): Generator<[K[], V]> {
      if (keys.length === 0 && handler.hasOwnProperty("val")) {
        yield [[], handler.val!];
      }

      for (const [k, v] of handler.next) {
        keys.push(k);

        if (v.hasOwnProperty("val")) {
          yield [[...keys], v.val!];
        }

        yield* dfs(v);
        keys.pop();
      }
    }

    return dfs(this._root);
  }
}

export default MKMap;
