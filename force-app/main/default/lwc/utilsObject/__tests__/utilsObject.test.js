import {
    isDefined,
    isFunction,
    isNumber,
    isObject,
    objectFilterProperties,
    objectMapProperties,
    unproxy
} from 'c/utilsObject';

describe('sldt-utils-object', () => {
    describe("isDefined - check the value is not null/undef", () => {
        it('isDefined - null returns false', () => {
            expect(isDefined(null)).toBe(false);
        });
        it('isDefined - undefined returns false', () => {
            expect(isDefined(undefined)).toBe(false);
        });
        it('isDefined - NaN returns true', () => {
            expect(isDefined(NaN)).toBe(true);
        });
        it('isDefined - Infinity returns true', () => {
            expect(isDefined(Infinity)).toBe(true);
        });
        it('isDefined - 1 returns true', () => {
            expect(isDefined(1)).toBe(true);
        });
        it('isDefined - 0 returns true', () => {
            expect(isDefined(0)).toBe(true);
        });
        it('isDefined - \'\' returns true', () => {
            expect(isDefined('')).toBe(true);
        });
        it('isDefined - \'test\' returns true', () => {
            expect(isDefined('test')).toBe(true);
        });
        it('isDefined - {} returns true', () => {
            expect(isDefined({})).toBe(true);
        });
        it('isDefined - [] returns true', () => {
            expect(isDefined([])).toBe(true);
        });
    });
    describe("isNumber - check the value is a number but not nan/inf", () => {
        it('isNumber - null returns false', () => {
            expect(isNumber(null)).toBe(false);
        });
        it('isNumber - undefined returns false', () => {
            expect(isNumber(undefined)).toBe(false);
        });
        it('isNumber - NaN returns false', () => {
            expect(isNumber(NaN)).toBe(false);
        });
        it('isNumber - Infinity returns false', () => {
            expect(isNumber(Infinity)).toBe(false);
        });
        it('isNumber - 1 returns true', () => {
            expect(isNumber(1)).toBe(true);
        });
        it('isNumber - 0 returns true', () => {
            expect(isNumber(0)).toBe(true);
        });
        it('isNumber - \'\' returns false', () => {
            expect(isNumber('')).toBe(false);
        });
        it('isNumber - \'test\' returns false', () => {
            expect(isNumber('test')).toBe(false);
        });
        it('isNumber - {} returns false', () => {
            expect(isNumber({})).toBe(false);
        });
        it('isNumber - [] returns false', () => {
            expect(isNumber([])).toBe(false);
        });
    });
    describe("isObject - check the value is a number but not nan/inf", () => {
        it('isObject - null returns false', () => {
            expect(isObject(null)).toBe(false);
        });
        it('isObject - undefined returns false', () => {
            expect(isObject(undefined)).toBe(false);
        });
        it('isObject - NaN returns false', () => {
            expect(isObject(NaN)).toBe(false);
        });
        it('isObject - Infinity returns false', () => {
            expect(isObject(Infinity)).toBe(false);
        });
        it('isObject - 1 returns false', () => {
            expect(isObject(1)).toBe(false);
        });
        it('isObject - 0 returns false', () => {
            expect(isObject(0)).toBe(false);
        });
        it('isObject - \'\' returns false', () => {
            expect(isObject('')).toBe(false);
        });
        it('isObject - \'test\' returns false', () => {
            expect(isObject('test')).toBe(false);
        });
        it('isObject - {} returns true', () => {
            expect(isObject({})).toBe(true);
        });
        it('isObject - [] returns true', () => {
            expect(isObject([])).toBe(true);
        });
    });
    describe("isFunction - check the value is a number but not nan/inf", () => {
        it('isFunction - null returns false', () => {
            expect(isFunction(null)).toBe(false);
        });
        it('isFunction - undefined returns false', () => {
            expect(isFunction(undefined)).toBe(false);
        });
        it('isFunction - NaN returns false', () => {
            expect(isFunction(NaN)).toBe(false);
        });
        it('isFunction - Infinity returns false', () => {
            expect(isFunction(Infinity)).toBe(false);
        });
        it('isFunction - 1 returns false', () => {
            expect(isFunction(1)).toBe(false);
        });
        it('isFunction - 0 returns false', () => {
            expect(isFunction(0)).toBe(false);
        });
        it('isFunction - \'\' returns false', () => {
            expect(isFunction('')).toBe(false);
        });
        it('isFunction - \'test\' returns false', () => {
            expect(isFunction('test')).toBe(false);
        });
        it('isFunction - {} returns false', () => {
            expect(isFunction({})).toBe(false);
        });
        it('isFunction - [] returns false', () => {
            expect(isFunction([])).toBe(false);
        });
        it('isFunction - function(){} returns false', () => {
            expect(isFunction((function(){}))).toBe(true);
        });
        it('isFunction - ()=>{} returns false', () => {
            expect(isFunction((()=>{}))).toBe(true);
        });
    });
    describe('unproxy - remove proxy from object', () => {
        it('unproxy - remain primitives as is', () => {
            expect(unproxy(1)).toStrictEqual(1);
            expect(unproxy("a")).toStrictEqual("a");
            expect(unproxy(null)).toStrictEqual(null);
        });
        it('unproxy - remain data types as is', () => {
            expect(unproxy({})).toStrictEqual({});
            expect(unproxy([])).toStrictEqual([]);
            expect(unproxy({a: 1, b: [1,2,3,4,5]})).toStrictEqual({a: 1, b: [1,2,3,4,5]});
        });
        it('unproxy - don\'t care about other types', () => {
            expect(unproxy({a: 1, b: function(){}})["a"]).toStrictEqual(1);
        });
    })
    describe('objectFilterProperties - filter the properties of the object by list or function', () => {
        it('objectFilterProperties - filter empty object returns the same', () => {
            expect(objectFilterProperties(1, () => true)).toBe(1);
            expect(objectFilterProperties(undefined, () => true)).toBe(undefined);
            expect(objectFilterProperties({}, () => true)).toStrictEqual({});
        });
        it('objectFilterProperties - filter by a function, source object unchanged', () => {
            const source = {'a': 1, 'b': 2, 'c': 3};
            const res = objectFilterProperties(source, (_value, key) => {return key === 'a';})
            expect(source).toStrictEqual({'a': 1, 'b': 2, 'c': 3});
            expect(res).toStrictEqual({'a': 1});
        });
        it('objectFilterProperties - filter by a function, source value unchanged', () => {
            const source = {'a': [1,2,3,4,5], 'b': 2, 'c': 3};
            const res = objectFilterProperties(source, (_value, key) => {return key === 'a';})
            expect(res.a).toStrictEqual(source.a);
        });
        it('objectFilterProperties - filter by array, return existing keys, source unchanged', () => {
            const source = {'a': 1, 'b': 2, 'c': 3};
            const res = objectFilterProperties(source, ["a"])
            expect(source).toStrictEqual({'a': 1, 'b': 2, 'c': 3});
            expect(res).toStrictEqual({'a': 1});
        });
        it('objectFilterProperties - filter by array, do not add keys not present in source', () => {
            const source = {'a': [1,2,3,4,5], 'b': 2, 'c': 3};
            const res = objectFilterProperties(source, ["a", "x"])
            expect("x" in res).toBe(false);
        });
    });
    describe('objectMapProperties - map the properties of the object by function', () => {
        it('objectMapProperties - not an object returns itself', () => {
            const emptyMapper = () =>({key: 'a', value: 1});
            expect(objectMapProperties(1, emptyMapper)).toBe(1);
            expect(objectMapProperties(undefined, emptyMapper)).toBe(undefined);
            expect(objectMapProperties({}, emptyMapper)).toStrictEqual({});
        });
        it('objectMapProperties - map value to value', () => {
            expect(objectMapProperties(
                {'a': 1, 'b':2},
                (value) => ({value: value+2})
            ))
            .toStrictEqual({'a': 3, 'b': 4});
        });
        it('objectMapProperties - map k->v to k->v', () => {
            expect(objectMapProperties(
                {'a': 1, 'b':2},
                (value, key) => ({key: (''+key).toUpperCase(), value: value+2})
            ))
            .toStrictEqual({'A': 3, 'B': 4});
        });
    })
});