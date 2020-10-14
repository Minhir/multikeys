import MKWeakMap from './mkweakmap';


class MKWeakSet<K extends object> {
    private _map = new MKWeakMap<K, boolean>();

    /**
     * Creates a new MKWeakSet object.
     *
     * Could be called with initial keys
     *
     * ```
     * const empty = new MKWeakSet();
     * const withValues = new MKWeakSet([
     *     [[1, 2], [3, 4]],
     *     [{foo: 'bar'}]
     * ]);
     * ```
     *
     * @param iterable - Optional array of initial keys
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
     * Add keys to the MKWeakSet object.
     *
     * @param keys - Array of keys
     */
    add(keys: readonly K[]): void {
        this._map.set(keys, true);
    }

    /**
     * Removes keys from the MKWeakSet. Returns true if keys has been removed successfully.
     *
     * @param keys - Array of keys
     * @returns True if an element was in the MKMap
     */
    delete(keys: readonly K[]): boolean {
        return this._map.delete(keys);
    }

    /**
     * Returns true if an element with the specified keys exists in the MKWeakSet object.
     *
     * @param keys - Array of keys
     * @returns True if MKMap contains keys
     */
    has(keys: readonly K[]): boolean {
        return this._map.has(keys);
    }
}

export default MKWeakSet;
