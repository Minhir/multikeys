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

    constructor(iterable?: Iterable<readonly [readonly K[], V]>) {
        if (iterable) {
            for (const [keys, value] of iterable) {
                this.set(keys, value);
            }
        }
    }

    get size(): number {
        return this._size;
    }

    clear(): void {
        this._root = createNewValueHandler();
        this._size = 0;
    }

    set(keys: readonly K[], val: V): this {
        const handler = getLastValueHandler(this._root, keys, true);

        if (!handler) {
            throw new Error('Multikeys: can\'t set keys. There is some internal problem.');
        }

        if (!handler.hasOwnProperty('val')) {
            this._size++;
        }

        handler.val = val;

        return this;
    }

    get(keys: readonly K[]): V | undefined {
        const handler = getLastValueHandler(this._root, keys);

        return handler?.val;
    }

    has(keys: readonly K[]): boolean {
        const handler = getLastValueHandler(this._root, keys);

        return handler ? handler.hasOwnProperty('val') : false;
    }

    delete(keys: readonly K[]): boolean {
        const len = keys.length;

        const f = (handler: ValueHandler<K, V>, ind: number): boolean => {
            if (ind === len) {
                if (handler.hasOwnProperty('val')) {
                    this._size--;
                    delete handler['val'];

                    return true;
                }

                return false;
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

    entries(): IterableIterator<[K[], V]> {
        return this[Symbol.iterator]();
    }

    keys(): IterableIterator<K[]> {
        const self = this;

        function* keys() {
            for (const [key] of self) {
                yield key;
            }
        }

        return keys();
    }

    values(): IterableIterator<V> {
        const self = this;

        function* values() {
            for (const [, val] of self) {
                yield val;
            }
        }

        return values();
    }

    forEach(callbackfn: (value: V, keys: K[], map: this) => void): void {
        for (const [keys, value] of this) {
            callbackfn(value, keys, this);
        }
    }

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
