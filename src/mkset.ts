import MKMap from './mkmap';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
class MKSet<K = any> {
    private _map = new MKMap<K, boolean>();

    constructor(iterable?: Iterable<readonly K[]>) {
        if (iterable) {
            for (const keys of iterable) {
                this.add(keys);
            }
        }
    }

    get size(): number {
        return this._map.size;
    }

    add(keys: readonly K[]): void {
        this._map.set(keys, true);
    }

    clear(): void {
        this._map.clear();
    }

    delete(keys: readonly K[]): boolean {
        return this._map.delete(keys);
    }

    has(keys: readonly K[]): boolean {
        return this._map.has(keys);
    }

    [Symbol.iterator](): IterableIterator<K[]> {
        const map = this._map;

        function* keys() {
            for (const [keys] of map) {
                yield keys;
            }
        }

        return keys();
    }

    entries(): IterableIterator<[K[], K[]]> {
        const map = this._map;

        function* entries(): Generator<[K[], K[]]> {
            for (const [keys] of map) {
                yield [keys, keys];
            }
        }

        return entries();
    }

    values(): IterableIterator<K[]> {
        return this._map.keys();
    }

    keys(): IterableIterator<K[]> {
        return this.values();
    }

    forEach(callbackfn: (value: K[], key: K[], map: this) => void): void {
        for (const keys of this) {
            callbackfn(keys, keys, this);
        }
    }
}

export default MKSet;
