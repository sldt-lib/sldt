import {
    isArray,
    isArrayFilled,
    filterMap,
    splitIntoChunks,
    group,
    groupToArrays,
    groupToSingleValue,
    groupToConcatenateArrays
} from 'c/utilsArray';

/**
 * @description creates a filled array with indexes as elements
 * @param {number} length array length
 * @returns {number[]}
 */
const createArray = (length) => {
    const emptyArray = new Array(length).fill();
    return emptyArray.map((_, index) => index);
}

describe('sldt-utils-array', () => {
    describe('isArray - check if variable is an array', () => {
        it("isArray - null/undef is not an array", () => {
            expect(isArray(null)).toBe(false);
            expect(isArray(undefined)).toBe(false);
        });
        it("isArray - number is not an array", () => {
            expect(isArray(NaN)).toBe(false);
            expect(isArray(1)).toBe(false);
        });
        it("isArray - string is not an array", () => {
            expect(isArray("")).toBe(false);
            expect(isArray("test")).toBe(false);
        });
        it("isArray - object is not an array", () => {
            expect(isArray({})).toBe(false);
            expect(isArray({0:0, length:1})).toBe(false);
        });
        it("isArray - empty array is an array", () => {
            expect(isArray([])).toBe(true);
        });
        it("isArray - filled array is an array", () => {
            expect(isArray([1,2,3])).toBe(true);
        });
    });
    describe('isArrayFilled - check if variable is an array and it has elements', () => {
        it("isArrayFilled - null/undef is not an array", () => {
            expect(isArrayFilled(null)).toBe(false);
            expect(isArrayFilled(undefined)).toBe(false);
        });
        it("isArrayFilled - number is not an array", () => {
            expect(isArrayFilled(NaN)).toBe(false);
            expect(isArrayFilled(1)).toBe(false);
        });
        it("isArrayFilled - string is not an array", () => {
            expect(isArrayFilled("")).toBe(false);
            expect(isArrayFilled("test")).toBe(false);
        });
        it("isArrayFilled - object is not an array", () => {
            expect(isArrayFilled({})).toBe(false);
            expect(isArrayFilled({0:0, length:1})).toBe(false);
        });
        it("isArrayFilled - empty array is not filled", () => {
            expect(isArrayFilled([])).toBe(false);
        });
        it("isArrayFilled - filled array is a filled array", () => {
            expect(isArrayFilled([1,2,3])).toBe(true);
        });
    });
    describe('filterMap - filter and map elements', () => {
        it("filterMap - filter and map the filled array at one call", () => {
            const array = createArray(100);
            const filter = jest.fn(item => item >= 50);
            const mapper = jest.fn(item => item * 2);

            const result = filterMap(array, filter, mapper);
            expect(filter).toBeCalledTimes(100);
            expect(mapper).toBeCalledTimes(50);
            expect(result.length).toBe(50);
            expect(result[0]).toBe(100);
            expect(result[49]).toBe(198);
        })
        it("filterMap - do not work if source is not filled array", () => {
            const filter = jest.fn(item => item >= 50);
            const mapper = jest.fn(item => item * 2);

            const notAnArrayResult = filterMap(undefined, filter, mapper);
            expect(notAnArrayResult).toBe(undefined);
            expect(filter).toBeCalledTimes(0);
            expect(mapper).toBeCalledTimes(0);

            const emptyArrayResult = filterMap([], filter, mapper);
            expect(emptyArrayResult).toStrictEqual([]);
            expect(filter).toBeCalledTimes(0);
            expect(mapper).toBeCalledTimes(0);
        });
    });
    describe('splitIntoChunks - split array into array of arrays', () => {
        it("splitIntoChunks - non-array and wrong chunk size cause the same return", () => {
            expect(splitIntoChunks({}, 1)).toEqual({});
            expect(splitIntoChunks([1,2], 0)).toEqual([1,2]);
            expect(splitIntoChunks("12", 1)).toEqual("12");
        });
        it("splitIntoChunks - split filled array into chunks (the array length is a multiple of the chunk length)", () => {
            const source = createArray(100);
            const result = splitIntoChunks(source, 10);
            expect(result.length).toBe(10);
            result.forEach(chunk => {
                expect(chunk.length).toBe(10);
            });
        });
        it("splitIntoChunks - split filled array into chunks (the array length is not a multiple of the chunk length)", () => {
            const source = createArray(95);
            const result = splitIntoChunks(source, 10);
            expect(result.length).toBe(10);
            result.slice(0,9).forEach(chunk => {
                expect(chunk.length).toBe(10);
            });
            expect(result[9].length).toBe(5);
        });
        it("splitIntoChunks - split filled array into chunks (the array length less than chunk length)", () => {
            const source = createArray(8);
            const result = splitIntoChunks(source, 10);
            expect(result.length).toBe(1);
            expect(result[0].length).toBe(8);
        });
        it("splitIntoChunks - split empty array - get empty array", () => {
            const source = [];
            const result = splitIntoChunks(source, 10);
            expect(result.length).toBe(0);
        });
    });
    describe("group - group array of elements by keys", () => {
        it("group - undefined keys are grouped", () => {
            const array = createArray(100);
            const key = (e) => (e%2 === 0 ? undefined : "1");
            const value = (e) => e;
            const regroup = (g, v) => ([...g, v]);

            const groups = group(array, key, value, regroup, ()=>[]);

            expect(Object.keys(groups).length).toBe(2);
            expect(groups["1"].length).toBe(50);
            expect(groups[undefined].length).toBe(50);
        });
        it("group - key as string means objectField to group by", () => {
            const array = createArray(100).map(i => ({identifier: i%4, result: i}));
            const key = "identifier";
            const value = element => element.result;
            const regroup = (g, v) => ([...g, v]);

            const groups = group(array, key, value, regroup, ()=>[]);

            expect(Object.keys(groups).length).toBe(4);
            expect(groups[0]).toContain(0);
            expect(groups[0]).toContain(4);
            expect(groups[1]).toContain(1);
            expect(groups[1]).toContain(5);
            expect(groups[2]).toContain(2);
            expect(groups[2]).toContain(6);
            expect(groups[3]).toContain(3);
            expect(groups[3]).toContain(7);
        });
        it("group - value() transforms the source values to the added ones", () => {
            const array = createArray(100);
            /** @type{(e: number) => string} */
            const key = (e) => ("g" + (e % 3));
            /** @type{(e:number)=>number} */
            const value = (e) => e + 100;
            /** @type{(g:number[], v:number)=>number[]} */
            const regroup = (g, v) => ([...g, v]);

            const groups = group(array, key, value, regroup, ()=>[]);

            expect(groups.g0).not.toBeUndefined();
            expect(groups.g1).not.toBeUndefined();
            expect(groups.g2).not.toBeUndefined();

            groups.g0.forEach(element => expect(element).toBeGreaterThan(99));
            groups.g1.forEach(element => expect(element).toBeGreaterThan(99));
            groups.g2.forEach(element => expect(element).toBeGreaterThan(99));
        });
        it("group - value() can be omitted to preserve initial elements", () => {
            const array = createArray(100);
            /** @type{(e: number) => string} */
            const key = (e) => ("g" + (e % 3));
            /** @type{(g:number[], v:number)=>number[]} */
            const regroup = (g, v) => ([...g, v]);

            const groups = group(array, key, undefined, regroup, ()=>[]);

            expect(groups.g0).not.toBeUndefined();
            expect(groups.g1).not.toBeUndefined();
            expect(groups.g2).not.toBeUndefined();

            groups.g0.forEach(element => expect(element).toBeGreaterThan(-1));
            groups.g1.forEach(element => expect(element).toBeGreaterThan(-1));
            groups.g2.forEach(element => expect(element).toBeGreaterThan(-1));
        });
        it("regroup - initiates the group by getInitialGroup and compose with regroup", () => {
            const array = createArray(100);
            /** @type{(e: number) => string} */
            const key = (e) => ("g" + (e % 3));
            /** @type{(e:number)=>number} */
            const value = (e) => e;
            /** @type{(g:object, v:number)=>object} */
            const regroup = (g, v) => ({...g, v: v});

            const groups = group(array, key, value, regroup, ()=>({}));

            expect(groups.g0).not.toBeUndefined();
            expect(groups.g1).not.toBeUndefined();
            expect(groups.g2).not.toBeUndefined();
            expect(groups.g0.v).toBe(99);
            expect(groups.g1.v).toBe(97);
            expect(groups.g2.v).toBe(98);

        });
    });
    describe("groupToArrays - group array of elements to arrays by key", () => {
        it("groupToArrays - if key is string, this field is taken from element as an identifier", () => {
            const source = createArray(10).map(i => ({_identifier: i %2, result: i}));
            const key = "_identifier";
            /** @type {(item: {_identifier: number, result: number}) => number} */
            const value = item => item.result + 1000;

            const grouped = groupToArrays(source, key, value);
            expect(grouped[0]).toEqual([1000, 1002, 1004, 1006, 1008]);
            expect(grouped[1]).toEqual([1001, 1003, 1005, 1007, 1009]);
        });
        it("groupToArrays - omitted value() saves initial elements", () => {
            const key = item => (item%2 === 0 ? "even" : "odd");
            const source = createArray(10);
            const grouped = groupToArrays(source, key);
            expect(grouped).toHaveProperty("even");
            expect(grouped).toHaveProperty("odd");
            expect(grouped.even).toEqual([0, 2, 4, 6, 8]);
            expect(grouped.odd).toEqual([1, 3, 5, 7, 9]);
        });
    });
    describe("groupToSingleValue - groups unique elements by unique keys", () => {
        it("groupToSingleValue - if key returns undefined the record is not in use", () => {
            const source = createArray(10).map(i => ({_identifier: i %2, result: i}));
            const key = "_identifier";
            /** @type {(item: {_identifier: number, result: number}) => number} */
            const value = item => item.result + 1000;

            const grouped = groupToSingleValue(source, key, value);

            expect(grouped[0]).toEqual(1008);
            expect(grouped[1]).toEqual(1009);
        });
        it("groupToSingleValue - omitted value() saves initial elements", () => {
            const key = item => (item > 20 ? (item%2 === 0 ? "even" : "odd") : undefined);
            const source = createArray(30);
            const grouped = groupToSingleValue(source, key);
            expect(grouped).toHaveProperty("even");
            expect(grouped).toHaveProperty("odd");
            expect(grouped.even).toEqual(28);
            expect(grouped.odd).toEqual(29);
        });
    });
    describe("groupToConcatenateArrays - groups arrays into one", () => {
        it("groupToSingleValue - if key returns undefined the record is not in use", () => {
            const source = createArray(10).map(i => ({_identifier: i %2, result: [i, i + 100, i + 200]}));
            const key = "_identifier";
            /** @type {(item: {_identifier: number, result: number[]}) => number[]} */
            const value = item => item.result;

            const grouped = groupToConcatenateArrays(source, key, value);

            expect(grouped[0]).toEqual([0,100,200,2,102,202,4,104,204,6,106,206,8,108,208,]);
            expect(grouped[1]).toEqual([1,101,201,3,103,203,5,105,205,7,107,207,9,109,209,]);
        });
        it("groupToConcatenateArrays - omitted value() saves initial elements", () => {
            const key = (_, index) => (index > 10 ? (index % 2 === 0 ? "even" : "odd") : undefined);
            const source = splitIntoChunks(createArray(30), 2);
            const grouped = groupToConcatenateArrays(source, key);
            expect(grouped).toHaveProperty("even");
            expect(grouped).toHaveProperty("odd");
            expect(grouped.even).toEqual([24, 25, 28, 29]);
            expect(grouped.odd).toEqual([22, 23, 26, 27]);
        });
    });
});
