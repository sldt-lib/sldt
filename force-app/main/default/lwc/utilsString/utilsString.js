/*
 * Contains utility methods for working with strings
 * Author: Yakov Veromeev
 * License: MIT
 */


/**
 * @description Generates unique identifier. Is not fully compatible with RFC for UUIDv4, but it works for most tests
 * @returns {string} new UUID
 */
export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * @description Checks that argument is a string
 * @param {any} probableString a value that might be a string
 * @returns {probableString is string} `true` if variable is a string
 */
export const isString = (probableString) => {
    return typeof probableString === 'string';
}

/**
 * @description Checks that argument is a string and it is filled with anything
 * @param {any} probableString a value that might be a string and needs the check
 * @returns {probableString is string}
 */
export const isStringFilled = (probableString) => {
    return (
        typeof probableString === 'string' &&
        probableString.length > 0
    )
};

/**
 * @description Checks that argument is a string and it is filled with not only whitespace characters.
 * Similar to `String.isNotBlank` in Apex.
 * @param {any} probableString a value that might be a string and needs the check
 * @returns {probableString is string}
 */
export const isStringNotBlank = (probableString) => {
    return (
        typeof probableString === 'string' &&
        probableString.trim().length > 0
    )
};