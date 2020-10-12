import {MKWeakMap} from '../src';


describe('MKWeakMap', () => {
    const obj1 = {};
    const obj2 = {};
    const obj3 = {};
    const obj4 = {};
    const obj5 = {};

    const testData: [object[], any][] = [
        [[{}], {}],
        [[[]], []],
        [[obj1, [], obj3, new Map(), obj1], {}],
        [[], 'empty key'],
        [[obj1, obj2, obj3], '123'],
        [[obj1, obj2, obj3, obj4], '1234'],
        [[obj1, obj2, obj3, obj4, obj5], '12345'],
        [[new Date(), new Set()], 25]
    ];

    it('works with all keys kinds', () => {
        const map = new MKWeakMap();

        testData.forEach(([keys, value]) => {
            expect(map.has(keys)).toEqual(false);

            map.set(keys, value);

            expect(map.has(keys)).toEqual(true);
            expect(map.get(keys)).toBe(value);
        });
    });

    it('deletes items', () => {
        const map = new MKWeakMap(testData);

        testData.forEach(([keys]) => {
            expect(map.has(keys)).toEqual(true);

            map.delete(keys);

            expect(map.has(keys)).toEqual(false);
            expect(map.get(keys)).toEqual(undefined);
        });
    });

    it('could use non-object keys for get and delete', () => {
        const map = new MKWeakMap<any, any>(testData);

        expect(map.get([1, ''])).toBe(undefined);
        expect(map.has([1, ''])).toBe(false);
    });

    it('returns true/false from delete', () => {
        const map = new MKWeakMap();

        const obj1 = {};
        const obj2 = {};
        const obj3 = {};

        map.set([obj1, obj2], 0);

        expect(map.get([obj1, obj2])).toBe(0);
        expect(map.delete([obj1])).toEqual(false);
        expect(map.delete([obj1, obj2, obj3])).toEqual(false);
        expect(map.delete([obj1, obj2])).toEqual(true);
        expect(map.get([obj1, obj2])).toBe(undefined);
    });

    it('returns undefined on non-existing keys', () => {
        const map = new MKWeakMap();

        expect(map.get([{}, []])).toBe(undefined);
    });

    it('works with empty key', () => {
        const map = new MKWeakMap();
        const val = {};
        const obj1 = {};
        const obj2 = {};

        map.set([], val);

        expect(map.get([])).toBe(val);
        expect(map.has([])).toEqual(true);

        map.set([obj1, obj2], 1);

        expect(map.get([])).toBe(val);
        expect(map.has([])).toEqual(true);

        expect(map.delete([])).toEqual(true);
        expect(map.get([])).toBe(undefined);
        expect(map.has([])).toEqual(false);

        expect(map.get([obj1, obj2])).toBe(1);
    });

    it('throws error on bad key type', () => {
        const map = new MKWeakMap();

        expect(() => new MKWeakMap([[[1 as any], 2]])).toThrow('Invalid value is used as weak key');
        expect(() => map.set([1 as any], 2)).toThrow('Invalid value is used as weak key');

        expect(() => map.set({} as any, 2)).toThrow('Keys should be an array');
        expect(() => new MKWeakMap([['23' as any, 2]])).toThrow('Keys should be an array');
    });
});
