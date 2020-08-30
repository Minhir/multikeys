import {MKWeakSet} from '../src';


describe('MKWeakSet', () => {
    const obj1 = {};
    const obj2 = {};
    const obj3 = {};

    const testData: object[][] = [
        [new Map(), new Set()],
        [{}, {}],
        [[], []],
        [[], {}, new Date()],
        [obj1],
        [obj1, obj2],
        [obj1, obj2, obj3],
        []
    ];

    it('works with all keys kinds', () => {
        const set = new MKWeakSet();

        testData.forEach(keys => {
            expect(set.has(keys)).toEqual(false);

            set.add(keys);
        });

        testData.forEach(keys => {
            expect(set.has(keys)).toEqual(true);
            expect(set.delete(keys)).toEqual(true);
            expect(set.has(keys)).toEqual(false);
        });
    });


    it('returns true/false from delete', () => {
        const set = new MKWeakSet();

        set.add([ obj1,  obj2]);

        expect(set.delete([obj1])).toEqual(false);
        expect(set.delete([obj1, obj2, obj3])).toEqual(false);
        expect(set.delete([obj1,  obj2])).toEqual(true);

    });

    it('works with empty key', () => {
        const set = new MKWeakSet();

        set.add([]);

        expect(set.has([])).toEqual(true);

        set.add([obj1, obj2]);

        expect(set.has([])).toEqual(true);

        expect(set.delete([])).toEqual(true);
        expect(set.has([])).toEqual(false);

        expect(set.has([obj1, obj2])).toEqual(true);
    });
});
