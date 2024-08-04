/*
 * Copyright 2024 Yakay Verameyeu
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @description template for UUID generation in case the Crypto is not existing on window
 */
const uuidTemplate = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

/**
 * @description Generates unique identifier.
 * In modern browsers uses Crypto interface
 * If Crypto is unavailable, uses local implementation. It's not fully compatible with RFC for UUIDv4, but works for most tests
 * @returns {string} new UUID
 */
export const generateUUID = () => {
    // native implementation
    if (typeof window?.crypto?.randomUUID === "function") {
        return window.crypto.randomUUID();
    }
    // aka polyfill, native is available since 2021 tho
    return uuidTemplate.replace(/[xy]/g, function (c) {
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

/**
 * @description captures `{000}` or `\{000}` strings
 * Groups included
 * - optional prefix, if `"\"` - skip formatting the string
 * - index in brackets {000}
 * - index itself
 * Uses global flag to capture all inclusions
 */
const formatRegex = /(.{0,1})({(\d+)})/g;

const formatSkipPrefix = "//"

/**
 * Formats the string with trailing data. Placeholders are {XX} where XX is indexes of inputs starting from 0.
 * To skip the formatting, add a leading backslash
 * @param {string} template template to fill in with parameters
 * @param  {...any} params parameters, will be converted to strings
 * @example format("replaces \\{0} with {0}", "TEST"); => "replaces {0} with TEST"
 * @example format("{0} + {1} = {2}", 1, 2, 1+2); => "1 + 2 = 3"
 */
export const format = (template, ...params) => {
    return template.replace(formatRegex, (_match, prefix, brackets, index) => {
        // prefix is group 0 (any leading symbol or nothing in start of string)
        // brackets is group 1 ({00})
        // index is group 2 (00)
        if (prefix === formatSkipPrefix) {
            return brackets;
        }
        return prefix + params[index];
    });
}