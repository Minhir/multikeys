interface ValueHandler<K, V> {
    val?: V;
    next: Map<K, this>;
}

function createNewValueHandler<K, V>(): ValueHandler<K, V> {
    return {
        next: new Map()
    };
}

function getLastValueHandler<K, V>(handler: ValueHandler<K, V>, keys: readonly K[], createNewNodes = false): ValueHandler<K, V> | undefined {
    let curHandler = handler;

    for (const key of keys) {
        let newHandler = curHandler.next.get(key);

        if (newHandler) {
            curHandler = newHandler;
            continue;
        }

        if (!createNewNodes) {
            return;
        }

        newHandler = createNewValueHandler();
        curHandler.next.set(key, newHandler);
        curHandler = newHandler;
    }

    return curHandler;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class MKMap<K = any, V = any> {
    private _size = 0;
    private _root = createNewValueHandler<K, V>();

    /**
     * Creates a new MKMap object.
     *
     * Could be called with initial keys-values
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
     * map.set(['foo'], 'bar');
     * ```
     */
    set(keys: readonly K[], val: V): this {
        const handler = getLastValueHandler(this._root, keys, true);

        /* istanbul ignore next */
        if (!handler) {
            throw new Error('Multikeys: can\'t set keys. There is some internal problem.'); // Should never be called
        }

        if (!handler.hasOwnProperty('val')) {
            this._size++;
        }

        handler.val = val;

        return this;
    }

    /**
     * Returns the value associated to the keys, or undefined if there is none.
     *
     * ```
     * const map = new Map([['foo'], 'bar']);
     *
     * map.get(['foo']); // => 'bar'
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
     * const map = new Map([['foo'], 'bar']);
     *
     * map.has(['foo']); // => true
     * ```
     */
    has(keys: readonly K[]): boolean {
        const handler = getLastValueHandler(this._root, keys);

        return handler ? handler.hasOwnProperty('val') : false;
    }

    /**
     * Returns true if an element in the KMMap object existed and has been removed, or false if the element does not exist.
     */
    delete(keys: readonly K[]): boolean {
        const len = keys.length;

        const f = (handler: ValueHandler<K, V>, ind: number): boolean => {
            if (ind === len) {
                if (!handler.hasOwnProperty('val')) {
                    return false;
                }

                this._size--;
                delete handler['val'];

                return true;
            }

            const key = keys[ind];
            const nextHandler = handler.next.get(key);

            if (!nextHandler) {
                return false;
            }

            const res = f(nextHandler, ind + 1);

            if (res && nextHandler.next.size === 0 && !nextHandler.hasOwnProperty('val')) {
                handler.next.delete(key);
            }

            return res;
        }

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
        const self = this;

        function* values() {
            for (const [, val] of self) {
                yield val;
            }
        }

        return values();
    }

    /**
     * Calls callbackFn once for each keys-value pair present in the MKMap object.
     */
    forEach(callbackfn: (value: V, keys: K[], map: this) => void): void {
        for (const [keys, value] of this) {
            callbackfn(value, keys, this);
        }
    }

    /**
     * Returns a new Iterator object that contains an array of [keys, value] for each element in the MKMap object.
     */
    [Symbol.iterator](): IterableIterator<[K[], V]> {
        const keys: K[] = [];

        function* dfs(handler: ValueHandler<K, V>): Generator<[K[], V]> {
            if (keys.length === 0 && handler.hasOwnProperty('val')) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                yield [[], handler.val!];
            }

            for (const [k, v] of handler.next) {
                keys.push(k);

                if (v.hasOwnProperty('val')) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
