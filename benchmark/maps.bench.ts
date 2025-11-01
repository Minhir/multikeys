import { faker } from "@faker-js/faker";
import ManyKeysMap from "many-keys-map";
import Multikey from "multikey";
import { MultikeyMap } from "multikey-map";
import { bench, describe } from "vitest";

import { MKMap } from "../src/index";

const generators = [
  () => faker.lorem.word(),
  () => faker.number.int({ min: -1000, max: 1000 }),
  () => faker.number.float({ min: -1000, max: 1000 }),
  () => faker.datatype.boolean(),
  () => faker.helpers.arrayElement([null, undefined, NaN, Symbol(), Infinity]),
  () => ({ foo: faker.lorem.word(), bar: faker.number.int() }),
  () => [faker.lorem.word(), faker.number.int()],
];

function getRandomValue() {
  const randomGenerator = faker.helpers.arrayElement(generators);

  return randomGenerator();
}

function generateKeysValue(maxLength: number): [unknown[], unknown] {
  const keysNum = faker.number.int({ min: 1, max: maxLength });

  const keys = Array.from({ length: keysNum }, () => getRandomValue());
  const value = getRandomValue();

  return [keys, value];
}

function generateData({
  size,
  maxLength,
}: {
  size: number;
  maxLength: number;
}): Array<[unknown[], unknown]> {
  return Array.from({ length: size }, () => generateKeysValue(maxLength));
}

interface MapLike {
  set(keys: unknown[], value: unknown): void;
  get(keys: unknown[]): unknown;
  has(keys: unknown[]): boolean;
  delete(keys: unknown[]): boolean;
}

function defineMap(name: string, createMap: () => MapLike) {
  return { name, createMap };
}

const libraries = [
  defineMap("multikey", () => new Multikey()),
  defineMap("multikey-map", () => new MultikeyMap()),
  defineMap("many-keys-map", () => new ManyKeysMap()),
  defineMap("multikeys", () => new MKMap()),
];

const datasets = [
  { name: "small", size: 100, maxLength: 3 },
  { name: "medium", size: 1_000, maxLength: 5 },
  { name: "large", size: 10_000, maxLength: 12 },
];

type Operation = {
  name: string;
  run: (params: {
    map: MapLike;
    testData: Array<[unknown[], unknown]>;
    shuffledData: Array<[unknown[], unknown]>;
  }) => void;
};

const operations: Operation[] = [
  {
    name: "write",
    run: ({ map, testData }) => {
      for (const [keys, value] of testData) {
        map.set(keys, value);
      }
    },
  },
  {
    name: "read",
    run: ({ map, testData, shuffledData }) => {
      for (const [keys, value] of testData) {
        map.set(keys, value);
      }

      for (const [keys] of shuffledData) {
        map.get(keys);
      }

      for (const [keys] of testData) {
        map.has(keys);
      }
    },
  },
  {
    name: "delete",
    run: ({ map, testData, shuffledData }) => {
      for (const [keys, value] of testData) {
        map.set(keys, value);
      }

      for (const [keys] of shuffledData) {
        map.delete(keys);
      }
    },
  },
];

describe.for(datasets)("Dataset: $name ($size items)", (dataset) => {
  faker.seed(123);

  const testData = generateData(dataset);
  const shuffledData = faker.helpers.shuffle(testData);

  describe.for(operations)("Operation: $name", (operation) => {
    for (const lib of libraries) {
      bench(
        lib.name,
        () => {
          const map = lib.createMap();

          operation.run({ map, testData, shuffledData });
        },
        { throws: true },
      );
    }
  });
});
