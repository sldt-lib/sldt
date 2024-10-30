/*
 * Copyright 2024 Yakau Verameyeu
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

/*
 * Contains utility methods for working with strings
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