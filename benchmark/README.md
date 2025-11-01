# Benchmarks

Benchmarks compare multikeys against several multi‑key Map libraries:

- `multikeys`
- `many-keys-map`
- `multikey`
- `multikey-map`

To run the benchmarks, run in the repo root:

```sh
npm run bench
```

## Results

Results vary by machine and environment.

```
multikeys - benchmark/maps.bench.ts > Dataset: 'small' (100 items) > Operation: 'write'
    1.58x faster than multikey-map
    1.95x faster than multikey
    4.83x faster than many-keys-map

multikeys - benchmark/maps.bench.ts > Dataset: 'small' (100 items) > Operation: 'read'
    1.75x faster than multikey-map
    2.30x faster than multikey
    6.77x faster than many-keys-map

multikeys - benchmark/maps.bench.ts > Dataset: 'small' (100 items) > Operation: 'delete'
    2.12x faster than multikey
    2.91x faster than multikey-map
    6.17x faster than many-keys-map

multikeys - benchmark/maps.bench.ts > Dataset: 'medium' (1000 items) > Operation: 'write'
    1.55x faster than multikey-map
    1.85x faster than multikey
    3.40x faster than many-keys-map

multikeys - benchmark/maps.bench.ts > Dataset: 'medium' (1000 items) > Operation: 'read'
    1.59x faster than multikey-map
    1.90x faster than multikey
    4.32x faster than many-keys-map

multikeys - benchmark/maps.bench.ts > Dataset: 'medium' (1000 items) > Operation: 'delete'
    1.76x faster than multikey
    2.05x faster than multikey-map
    3.86x faster than many-keys-map

multikeys - benchmark/maps.bench.ts > Dataset: 'large' (10000 items) > Operation: 'write'
    1.51x faster than multikey-map
    2.76x faster than many-keys-map
    4.32x faster than multikey

multikeys - benchmark/maps.bench.ts > Dataset: 'large' (10000 items) > Operation: 'read'
    1.34x faster than many-keys-map
    1.35x faster than multikey-map
    1.97x faster than multikey

multikeys - benchmark/maps.bench.ts > Dataset: 'large' (10000 items) > Operation: 'delete'
    3.03x faster than many-keys-map
    3.84x faster than multikey-map
    5.16x faster than multikey
```
