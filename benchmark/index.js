const Benchmark = require('benchmark');
const Multikey = require('multikey');
const {MultikeyMap} = require('multikey-map');
const {MKMap} = require('../lib/index');
const seedrandom = require('seedrandom');


const random = seedrandom('benchamrk');

function getRandomInt(max) {
    return Math.floor(random() * max);
}

function getRandomFloat() {
    const max = 1000000;

    return random() * 2 * max - max;
}

function getRandomString() {
    return '';
}

function getRandomVal() {
    const n = getRandomInt(9);

    switch (n) {
        case 0:
            return getRandomString();
        case 1:
            return getRandomInt(1000000);
        case 2:
            return getRandomFloat();
        case 3:
            return {};
        case 4:
            return Math.random() < 0.5;
        case 5:
            return [];
        case 6:
            return Symbol();
        case 7:
            return null;
        case 8:
            return undefined;
        default:
            throw new Error('Bad type number');
    }
}

function generateKeysValue() {
    let keysNum = getRandomInt(100);
    const value = getRandomVal();
    const keys = [];

    while (keysNum--) {
        keys.push(getRandomVal());
    }

    return [keys, value];
}

function generateData() {
    let keysValuesNum = 10;
    const data = [];

    while (keysValuesNum--) {
        data.push(generateKeysValue());
    }

    return data;
}

function runMapBenchmark() {
    const suite = new Benchmark.Suite;

    const data = generateData();

    const benchamrks = [
        {
            packageName: 'multikey',
            map: Multikey
        },
        {
            packageName: 'multikey-map',
            map: MultikeyMap
        },
        {
            packageName: 'multikeys',
            map: MKMap
        }
    ];

    for (const bench of benchamrks) {
        suite.add(`${bench.packageName}, set`, () => {
            const map = new bench.map;

            for (const [keys, value] of data) {
                map.set(keys, value);
            }
        });
    }

    for (const bench of benchamrks) {
        suite.add(`${bench.packageName}, set and get`, () => {
            const map = new bench.map;

            for (const [keys, value] of data) {
                map.set(keys, value);

                const val = map.get(keys);

                if (val !== value) {
                    console.error(`'multikey.map.set_and_get'. ${val} !== ${value}`);
                }
            }
        });
    }

    suite
        .on('cycle', (event) => console.log(String(event.target)))
        .run({async: true});
}

runMapBenchmark();
