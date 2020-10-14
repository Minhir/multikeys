import {getLastValueHandler, WeakValueHandler} from './utils';


function createNewValueHandler<K extends object, V>(): WeakValueHandler<K, V> {
    return {
        next: new WeakMap()
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class MKWeakMap<K extends object = object, V = any> {
    private _root = createNewValueHandler<K, V>();

    /**
     * Creates a new MKWeakMap object.
     *
     * Could be called with initial keys-values
     *
     * ```
     * const empty = new MKWeakMap();
     * const withValues = new MKWeakMap([
     *     [[[1, 2], [3, 4]], 'value'],
     *     [[{foo: 'bar'}], 'val']
     * ]);
     * ```
     *
     * @param iterable - Optional array of initial keys
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
     * @param keys - Array of keys
     * @returns True if an element was in the MKMap
     */
    delete(keys: readonly K[]): boolean {
        const len = keys.length;

        const f = (handler: WeakValueHandler<K, V>, ind: number): boolean => {
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

    /**
     * Returns the value associated to the keys, or undefined if there is none.
     *
     * @param keys - Array of keys
     * @returns Value or undefined
     */
    get(keys: readonly K[]): V | undefined {
        const handler = getLastValueHandler(this._root, keys);

        return handler?.val;
    }

    /**
     * Returns a Boolean asserting whether a value has been associated to the keys in the MKWeakMap object or not.
     *
     * @param keys - Array of keys
     * @returns True if MKMap contains keys
     */
    has(keys: readonly K[]): boolean {
        const handler = getLastValueHandler(this._root, keys);

        return handler ? handler.hasOwnProperty('val') : false;
    }

    /**
     * Sets the value for the keys in the MKWeakMap object. Returns the MKWeakMap object.
     *
     * @param keys - Array of keys
     * @param value - Value associated with keys
     * @returns MKWeakMap
     */
    set(keys: readonly K[], value: V): this {
        if (!Array.isArray(keys)) {
            throw new Error('Keys should be an array');
        }

        for (const key of keys) {
            if (key !== Object(key)) {
                throw new Error('Invalid value is used as weak key');
            }
        }

        const handler = getLastValueHandler(this._root, keys, createNewValueHandler);

        /* istanbul ignore next */
        if (!handler) {
            throw new Error('Multikeys: can\'t set keys. There is some internal problem.'); // Should never be called
        }

        handler.val = value;

        return this;
    }
}

export default MKWeakMap;
