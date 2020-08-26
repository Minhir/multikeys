interface ValueHandler<K extends object, V> {
    val?: V;
    next: WeakMap<K, this>;
}

function createNewValueHandler<K extends object, V>(): ValueHandler<K, V> {
    return {
        next: new WeakMap()
    };
}

// TODO: move to inner utils
function getLastValueHandler<K extends object, V>(handler: ValueHandler<K, V>, keys: readonly K[], createNewNodes = false): ValueHandler<K, V> | undefined {
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
class MKWeakMap<K extends object = object, V = any> {
    private _root = createNewValueHandler<K, V>();

    constructor(iterable?: Iterable<readonly [readonly K[], V]>) {
        if (!iterable) {
            return;
        }

        for (const [keys, value] of iterable) {
            this.set(keys, value);
        }
    }

    get length(): 0 {
        return 0;
    }

    delete(keys: readonly K[]): boolean {
        const len = keys.length;

        const f = (handler: ValueHandler<K, V>, ind: number): boolean => {
            if (ind === len) {
                if (!handler.hasOwnProperty('val')) {
                    return false;
                }

                delete handler['val'];

                return true;
            }

            const key = keys[ind];
            const nextHandler = handler.next.get(key);

            if (!nextHandler) {
                return false;
            }

            return f(nextHandler, ind + 1);
        }

        return f(this._root, 0);
    }

    get(keys: readonly K[]): V | undefined {
        const handler = getLastValueHandler(this._root, keys);

        return handler?.val;
    }

    has(keys: readonly K[]): boolean {
        const handler = getLastValueHandler(this._root, keys);

        return handler ? handler.hasOwnProperty('val') : false;
    }

    set(keys: readonly K[], val: V): this {
        const handler = getLastValueHandler(this._root, keys, true);

        /* istanbul ignore next */
        if (!handler) {
            throw new Error('Multikeys: can\'t set keys. There is some internal problem.'); // Should never be called
        }

        handler.val = val;

        return this;
    }
}

export default MKWeakMap;
