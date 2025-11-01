import { Node } from "./utils";

export class MKMap<K = any, V = any> {
  private _size = 0;
  private _root = new Node<K, V>(() => new Map());

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
    this._root = this._root.new();
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

    const node = this._root.getNodeOrCreateNew(keys);

    if (!node.has) {
      this._size++;
    }

    node.set(value);

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
    const node = this._root.getNode(keys);

    return node?.val;
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
    const node = this._root.getNode(keys);

    return node ? node.has : false;
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
    let currentNode = this._root;
    let nodeForRemoval: Node<K, V> | null = null;
    let prevNode: Node<K, V> | null = null;
    let keyIdxToRemove = 0;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const nextNode = currentNode.next.get(key);

      if (!nextNode) {
        return false;
      }

      if (currentNode.next.size > 1 || currentNode.has) {
        nodeForRemoval = null;
      } else if (!nodeForRemoval) {
        nodeForRemoval = prevNode;
        keyIdxToRemove = i - 1;
      }

      prevNode = currentNode;
      currentNode = nextNode;
    }

    if (!currentNode.has) {
      return false;
    }

    this._size--;

    if (nodeForRemoval && currentNode.next.size === 0) {
      nodeForRemoval.next.delete(keys[keyIdxToRemove]);
    } else {
      currentNode.removeValue();
    }

    return true;
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

    function* dfs(node: Node<K, V>): Generator<V> {
      if (keys.length === 0 && node.has) {
        yield node.val!;
      }

      for (const [k, v] of node.next) {
        keys.push(k);

        if (v.has) {
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

    function* dfs(node: Node<K, V>): Generator<[K[], V]> {
      if (keys.length === 0 && node.has) {
        yield [[], node.val!];
      }

      for (const [k, v] of node.next) {
        keys.push(k);

        if (v.has) {
          yield [[...keys], v.val!];
        }

        yield* dfs(v);
        keys.pop();
      }
    }

    return dfs(this._root);
  }
}
