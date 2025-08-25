import { beforeEach, describe, expect, it, vi } from "vitest";

import { MKMap, MKSet } from "../src";

describe("simple usage", () => {
  it("should depends on key order", () => {
    const mkMap = new MKMap();

    mkMap.set([1, 2, 3], "foo");
    mkMap.set([3, 2, 1], "bar");

    expect(mkMap.get([1, 2, 3])).toBe("foo");
    expect(mkMap.get([3, 2, 1])).toBe("bar");

    mkMap.set([], "zero");
    expect(mkMap.get([])).toBe("zero");

    const mkSet = new MKSet();
    const obj = {};

    mkSet.add([obj, 1]);
    expect(mkSet.has([{}, 1])).toBe(false);
    expect(mkSet.has([obj, 1])).toBe(true);
  });
});

describe("memoization", () => {
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

  const func = vi.fn((...args) => args.reverse());

  beforeEach(() => {
    func.mockClear();
  });

  it("should return same value each time", () => {
    const memoized = memoize(func);

    const res1 = memoized(1, 2, 3);
    const res2 = memoized(5, 6, 7);

    expect(res1).toBe(memoized(1, 2, 3));
    expect(res2).toBe(memoized(5, 6, 7));
    expect(res1).toBe(memoized(1, 2, 3));
  });
});
