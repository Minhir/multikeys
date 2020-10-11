import {MKMap} from '../src';


describe('memoization', () => {
    function memoize(func: (...args: any[]) => any) {
        const mkMap = new MKMap();

        return (...args: any[]) => {
            if (mkMap.has(args)) {
                return mkMap.get(args);
            }

            const res = func(...args);

            mkMap.set(args, res);

            return res;
        };
    }

    const func = jest.fn((...args) => args.reverse());

    beforeEach(() => {
        func.mockClear();
    })

    it('should return same value each time', () => {
        const memoized = memoize(func);

        const res1 = memoized(1, 2, 3);
        const res2 = memoized(5, 6, 7);


        expect(res1).toBe(memoized(1, 2, 3));
        expect(res2).toBe(memoized(5, 6, 7));
        expect(res1).toBe(memoized(1, 2, 3));
    });
});
