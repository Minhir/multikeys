import {MKMap} from '../src';

import {areArraysEqual} from './utils';


describe('MKMap', () => {
    const testData: [any[], any][] = [
        [[0], 1],
        [['0'], '1'],
        [[true], false],
        [[undefined], null],
        [[null], 2],
        [[{}], {}],
        [[[]], []],
        [[Symbol()], Symbol],
        [[1, [], 3, 'rf', 1], {}],
        [[], 'empty key'],
        [[1, 2, 3], '123'],
        [[1, 2, 3, 4], '1234'],
        [[1, 2, 3, 4, 5], '12345'],
        [[new Date()], 25]
    ];

    it('works with all keys kinds', () => {
        const map = new MKMap();

        testData.forEach(([keys, value]) => {
            expect(map.has(keys)).toEqual(false);

            map.set(keys, value);

            expect(map.has(keys)).toEqual(true);
            expect(map.get(keys)).toBe(value);
        });
    });

    it('counts size', () => {
        const map = new MKMap();

        testData.forEach(([keys, value], i) => {
            map.set(keys, value);

            expect(map.size).toEqual(i + 1);
        });

        testData.forEach(([keys, value]) => {
            map.set(keys, value);

            expect(map.size).toEqual(testData.length);
        });

        testData.forEach(([keys], i) => {
            map.delete(keys);

            expect(map.size).toEqual(testData.length - i - 1);
        });
    });

    it('clears map', () => {
        const map = new MKMap(testData);

        map.clear();

        expect(map.size).toEqual(0);

        testData.forEach(([keys]) => {
            expect(map.has(keys)).toEqual(false);
        });
    });

    it('deletes items', () => {
        const map = new MKMap(testData);

        testData.forEach(([keys]) => {
            expect(map.has(keys)).toEqual(true);

            map.delete(keys);

            expect(map.has(keys)).toEqual(false);
            expect(map.get(keys)).toEqual(undefined);
        });
    });

    it('returns true/false from delete', () => {
        const map = new MKMap();

        map.set([1, 2], 3);

        expect(map.delete([1])).toEqual(false);
        expect(map.delete([1, 2, 3])).toEqual(false);
        expect(map.delete([1, 2])).toEqual(true);
    });

    it('deletes all branch chain', () => {
        const map = new MKMap();

        map.set([1, 2, 3, 4, 5, 6, 7, 8], 'val0');
        map.set([1, 2, 3, 4, 5, 6], 'val1');
        map.set([1, 2, 3], 'val2');

        expect(map.delete([1, 2, 3, 4, 5, 6])).toEqual(true);
        expect(map.delete([1, 2, 3, 4, 5, 6, 7])).toEqual(false);

        expect(map.has([1, 2, 3])).toEqual(true);
        expect(map.get([1, 2, 3])).toEqual('val2');
        expect(map.has([1, 2, 3, 4, 5, 6])).toEqual(false);
        expect(map.get([1, 2, 3, 4, 5, 6])).toEqual(undefined);
        expect(map.has([1, 2, 3, 4, 5, 6, 7, 8])).toEqual(true);
        expect(map.get([1, 2, 3, 4, 5, 6, 7, 8])).toEqual('val0');

        expect(map.delete([1, 2, 3, 4, 5, 6, 7, 8])).toEqual(true);
        expect(map['_root'].next.get(1)!.next.get(2)!.next.get(3)!.next.size).toEqual(0);
        expect(map.delete([1, 2, 3])).toEqual(true);

        expect(map.has([1, 2, 3])).toEqual(false);
        expect(map.get([1, 2, 3])).toEqual(undefined);
        expect(map['_root'].next.size).toEqual(0);
    });

    it('iterates over', () => {
        const map = new MKMap(testData);
        const isVisited: boolean[] = new Array(testData.length).fill(false);

        for (const [keys, value] of map) {
            const ind = testData.findIndex(arr => areArraysEqual(arr[0], keys));
            const originalValue = testData[ind][1];

            expect(isVisited[ind]).toEqual(false);
            expect(value).toBe(originalValue);

            isVisited[ind] = true;
        }

        expect(isVisited.every(v => v)).toEqual(true);
    });

    it('returns entries', () => {
        const map = new MKMap(testData);
        const isVisited: boolean[] = new Array(testData.length).fill(false);

        for (const [keys, value] of map.entries()) {
            const ind = testData.findIndex(arr => areArraysEqual(arr[0], keys));
            const originalValue = testData[ind][1];

            expect(isVisited[ind]).toEqual(false);
            expect(value).toBe(originalValue);

            isVisited[ind] = true;
        }

        expect(isVisited.every(v => v)).toEqual(true);
    });

    it('iterates with forEach', () => {
        const map = new MKMap(testData);
        const isVisited: boolean[] = new Array(testData.length).fill(false);

        map.forEach((value, keys, m) => {
            const ind = testData.findIndex(arr => areArraysEqual(arr[0], keys));
            const originalValue = testData[ind][1];

            expect(isVisited[ind]).toEqual(false);
            expect(value).toBe(originalValue);
            expect(m).toBe(map);

            isVisited[ind] = true;
        });

        expect(isVisited.every(v => v)).toEqual(true);
    });

    it('iterates over values', () => {
        const map = new MKMap(testData);

        const values = [...map].map(([_, v]) => v);
        let i = 0;

        for (const value of map.values()) {
            expect(value).toBe(values[i]);
            i++;
        }

        expect(values.length).toEqual(i);
    });

    it('iterates over keys', () => {
        const map = new MKMap(testData);
        const keys = [...map].map(([k]) => k);
        let i = 0;

        for (const key of map.keys()) {
            expect(key).toEqual(keys[i]);
            i++;
        }

        expect(keys.length).toEqual(i);
    });

    it('works with empty key', () => {
        const map = new MKMap();
        const val = {};

        map.set([], val);

        expect(map.get([])).toBe(val);
        expect(map.has([])).toEqual(true);
        expect(map.size).toEqual(1);

        map.set([2, 3], 1);

        expect(map.get([])).toBe(val);
        expect(map.has([])).toEqual(true);
        expect(map.size).toEqual(2);

        expect(map.delete([])).toEqual(true);
        expect(map.get([])).toBe(undefined);
        expect(map.has([])).toEqual(false);
        expect(map.size).toEqual(1);

        expect(map.get([2, 3])).toBe(1);
    });
})
