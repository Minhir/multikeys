import {getLastValueHandler, WeakValueHandler} from './utils';


function createNewValueHandler<K extends object, V>(): WeakValueHandler<K, V> {
    return {
        next: new WeakMap()
    };
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

    get(keys: readonly K[]): V | undefined {
        const handler = getLastValueHandler(this._root, keys);

        return handler?.val;
    }

    has(keys: readonly K[]): boolean {
        const handler = getLastValueHandler(this._root, keys);

        return handler ? handler.hasOwnProperty('val') : false;
    }

    set(keys: readonly K[], val: V): this {
        const handler = getLastValueHandler(this._root, keys, createNewValueHandler);

        /* istanbul ignore next */
        if (!handler) {
            throw new Error('Multikeys: can\'t set keys. There is some internal problem.'); // Should never be called
        }

        handler.val = val;

        return this;
    }
}

export default MKWeakMap;
