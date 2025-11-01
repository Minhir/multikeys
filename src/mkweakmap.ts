import { Node } from "./utils";

class MKWeakMap<K extends object = object, V = any> {
  private _root = new Node<K, V, "weak">(() => new WeakMap());

  /**
   * Creates a new MKWeakMap object.
   *
   * Could be called with initial keys-values
   *
   * ```
   * const empty = new MKWeakMap();
   * const withValues = new MKWeakMap([
   *     [[{foo: 'bar'}], 'val']
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
   * Removes any value associated to the keys. Returns true if an element in the MKWeakMap object has been removed successfully.
   *
   * ```
   * const obj = {};
   * const mkWeakMap = new MKWeakMap([[obj, 'foo']]);
   *
   * mkWeakMap.delete([obj]); // => true
   * mkWeakMap.delete([obj]); // => false
   * ```
   */
  delete(keys: readonly K[]): boolean {
    const node = this._root.getNode(keys);

    if (node?.has) {
      node.removeValue();
      return true;
    }

    return false;
  }

  /**
   * Returns the value associated to the keys, or undefined if there is none.
   *
   * ```
   * const obj = {};
   * const mkWeakMap = new MKWeakMap([[obj, 'foo']]);
   *
   * mkWeakMap.get([obj]); // => 'foo'
   * ```
   */
  get(keys: readonly K[]): V | undefined {
    const node = this._root.getNode(keys);

    return node?.has ? node.val! : undefined;
  }

  /**
   * Returns a Boolean asserting whether a value has been associated to the keys in the MKWeakMap object or not.
   *
   * ```
   * const obj = {};
   * const mkWeakMap = new MKWeakMap([[obj, 'foo']]);
   *
   * mkWeakMap.has([obj]); // => 'true'
   * ```
   */
  has(keys: readonly K[]): boolean {
    const node = this._root.getNode(keys);

    return node ? node.has : false;
  }

  /**
   * Sets the value for the keys in the MKWeakMap object. Returns the MKWeakMap object.
   *
   * ```
   * const mkWeakMap = new MKWeakMap();
   * const obj = {};
   *
   * mkWeakMap.set([obj], 'foo');
   * mkWeakMap.get([obj]); // => 'foo'
   * ```
   */
  set(keys: readonly K[], value: V): this {
    if (!Array.isArray(keys)) {
      throw new Error("Keys should be an array");
    }

    for (const key of keys) {
      if (key !== Object(key)) {
        throw new Error("Invalid value is used as weak key");
      }
    }

    const node = this._root.getNodeOrCreateNew(keys);

    node.has = true;
    node.val = value;

    return this;
  }
}

export default MKWeakMap;
