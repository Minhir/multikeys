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
     *     [{foo: 'bar'}]
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
     * Add keys to the MKWeakSet object.
     *
     * ```
     * const mkWeakSet = new MKWeakSet();
     * const obj = {};
     *
     * mkWeakSet.add([obj]);
     * mkWeakSet.has([obj]); // => 'true'
     * ```
     */
    add(keys: readonly K[]): void {
        this._map.set(keys, true);
    }

    /**
     * Removes keys from the MKWeakSet. Returns true if keys has been removed successfully.
     *
     * ```
     * const obj = {};
     * const mkWeakSet = new MKWeakSet([[obj]]);
     *
     * mkWeakSet.delete([obj]); // => true
     * mkWeakSet.delete([obj]); // => false
     * ```
     */
    delete(keys: readonly K[]): boolean {
        return this._map.delete(keys);
    }

    /**
     * Returns true if an element with the specified keys exists in the MKWeakSet object.
     *
     * ```
     * const obj = {};
     * const mkWeakSet = new MKWeakSet([[obj]]);
     *
     * mkWeakSet.has([obj]); // => 'true'
     * ```
     */
    has(keys: readonly K[]): boolean {
        return this._map.has(keys);
    }
}

export default MKWeakSet;
