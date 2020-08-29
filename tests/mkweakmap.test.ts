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

    it('returns true/false from delete', () => {
        const map = new MKWeakMap();

        const obj1 = {};
        const obj2 = {};
        const obj3 = {};

        map.set([obj1, obj2], 0);

        expect(map.delete([obj1])).toEqual(false);
        expect(map.delete([obj1, obj2, obj3])).toEqual(false);
        expect(map.delete([obj1, obj2])).toEqual(true);
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
});
