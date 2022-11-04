import { generateUUID, isString, isStringFilled, isStringNotBlank } from 'c/utilsString';

describe('sldt-utils-string', () => {
    describe('generateUUID - Generates Unique UUIDS', () => {
        it('Generates UUIDS without duplicates', () => {
            const uuids = [];
            for (let i = 1; i <= 10000; i++) {
                uuids.push(generateUUID());
            }
            const duplicatesFound =
                uuids.reduce(
                    (found, val, index, sourceArray) => {
                        if (!found) {
                            const foundIndex = sourceArray.indexOf(val);
                            return foundIndex !== index;
                        }
                        return true;
                    },
                    false
                );
            expect(duplicatesFound).toBe(false);
        });
    })
    describe("isString - Assume variable is any string", () => {
        it('not string returns false', () => {
            expect(isString()).toBe(false);
            expect(isString(undefined)).toBe(false);
            expect(isString(null)).toBe(false);
            expect(isString(1)).toBe(false);
            expect(isString({})).toBe(false);
            expect(isString([])).toBe(false);
        });
        it ('any string returns true', () => {
            expect(isString("")).toBe(true);
            expect(isString(" ")).toBe(true);
            expect(isString("\n")).toBe(true);
            expect(isString("\t")).toBe(true);
            expect(isString("string")).toBe(true);
        });
    });
    describe("isStringFilled - Assume filled string with any characters", () => {
        it("not string returns false", () => {
            expect(isStringFilled()).toBe(false);
            expect(isStringFilled(undefined)).toBe(false);
            expect(isStringFilled(null)).toBe(false);
            expect(isStringFilled(1)).toBe(false);
            expect(isStringFilled({})).toBe(false);
            expect(isStringFilled([])).toBe(false);
        });
        it("empty string returns false", () => {
            expect(isStringFilled("")).toBe(false);
        });
        it("string with spaces returns true", () => {
            expect(isStringFilled(" ")).toBe(true);
            expect(isStringFilled("\n")).toBe(true);
            expect(isStringFilled("\t")).toBe(true);
        });
        it("string with anything but space returns true", () => {
            expect(isStringFilled("string")).toBe(true);
        });
    });
    describe("isStringNotBlank - Assume string not blank with at least one not-whitespace character", () => {
        it("not string returns false", () => {
            expect(isStringNotBlank()).toBe(false);
            expect(isStringNotBlank(undefined)).toBe(false);
            expect(isStringNotBlank(null)).toBe(false);
            expect(isStringNotBlank(1)).toBe(false);
            expect(isStringNotBlank({})).toBe(false);
            expect(isStringNotBlank([])).toBe(false);
        });
        it("empty string returns false", () => {
            expect(isStringNotBlank("")).toBe(false);
        });
        it("string with spaces returns false", () => {
            expect(isStringNotBlank(" ")).toBe(false);
            expect(isStringNotBlank("\n")).toBe(false);
            expect(isStringNotBlank("\t")).toBe(false);
        });
        it("string with anything but space returns true", () => {
            expect(isStringNotBlank("string")).toBe(true);
        });
    });
});