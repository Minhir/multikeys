import {MKSet} from '../src';

import {areArraysEqual} from './utils';


describe('MKSet', () => {
    const testData: any[][] = [
        [0, 1],
        ['0', '1'],
        [true, false],
        [undefined, null],
        [null, 2],
        [{}, {}],
        [[], []],
        [Symbol(), [], {}, ''],
        [1],
        [1, 2],
        [1, 2, 3],
        []
    ];

    it('counts size', () => {
        const set = new MKSet();

        testData.forEach((keys, i) => {
            set.add(keys);

            expect(set.size).toEqual(i + 1);
        });

        testData.forEach(keys => {
            set.add(keys);

            expect(set.size).toEqual(testData.length);
        });

        testData.forEach((keys, i) => {
            set.delete(keys);

            expect(set.size).toEqual(testData.length - i - 1);
        });
    });

    it('clears set', () => {
        const set = new MKSet(testData);

        set.clear();

        expect(set.size).toEqual(0);

        testData.forEach(keys => {
            expect(set.has(keys)).toEqual(false);
        });
    });

    it('iterates over keys', () => {
        const set = new MKSet(testData);
        const keys = [...set].map(k => k);
        let i = 0;

        for (const key of set.keys()) {
            expect(key).toEqual(keys[i]);
            i++;
        }

        expect(keys.length).toEqual(i);
    });

    it('iterates over values', () => {
        const set = new MKSet(testData);
        const keys = [...set].map(k => k);
        let i = 0;

        for (const key of set.values()) {
            expect(key).toEqual(keys[i]);
            i++;
        }

        expect(keys.length).toEqual(i);
    });

    it('returns entries', () => {
        const set = new MKSet(testData);
        const isVisited: boolean[] = new Array(testData.length).fill(false);

        for (const [keys, value] of set.entries()) {
            const ind = testData.findIndex(arr => areArraysEqual(arr, keys));
            const originalValue = testData[ind];

            expect(isVisited[ind]).toEqual(false);
            expect(keys).toEqual(value);
            expect(value).toEqual(originalValue);
            expect(keys).toEqual(originalValue);

            isVisited[ind] = true;
        }

        expect(isVisited.every(v => v)).toEqual(true);
    });

    it('iterates with forEach', () => {
        const set = new MKSet(testData);
        const isVisited: boolean[] = new Array(testData.length).fill(false);

        set.forEach((value, keys, s) => {
            const ind = testData.findIndex(arr => areArraysEqual(arr, keys));
            const originalValue = testData[ind];

            expect(isVisited[ind]).toEqual(false);
            expect(keys).toEqual(value);
            expect(value).toEqual(originalValue);
            expect(keys).toEqual(originalValue);
            expect(s).toEqual(set);

            isVisited[ind] = true;
        });

        expect(isVisited.every(v => v)).toEqual(true);
    });

    it('works with empty key', () => {
        const set = new MKSet();

        set.add([]);

        expect(set.has([])).toEqual(true);
        expect(set.size).toEqual(1);

        set.add([2, 3]);

        expect(set.has([])).toEqual(true);
        expect(set.size).toEqual(2);

        expect(set.delete([])).toEqual(true);
        expect(set.has([])).toEqual(false);
        expect(set.size).toEqual(1);

        expect(set.has([2, 3])).toEqual(true);
    });
});
