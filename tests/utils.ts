export function areArraysEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }

    return arr1.every((v, i) => Object.is(v, arr2[i]));
}
