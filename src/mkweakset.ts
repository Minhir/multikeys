import MKWeakMap from './mkweakmap';


class MKWeakSet<K extends object> {
    private _map = new MKWeakMap<K, boolean>();

    constructor(iterable?: Iterable<readonly K[]>) {
        if (!iterable) {
            return;
        }

        for (const keys of iterable) {
            this.add(keys);
        }
    }

    add(keys: readonly K[]): void {
        this._map.set(keys, true);
    }

    delete(keys: readonly K[]): boolean {
        return this._map.delete(keys);
    }

    has(keys: readonly K[]): boolean {
        return this._map.has(keys);
    }
}

export default MKWeakSet;
