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

const _isDefined = (source) => {
    return source !== undefined && source !== null;
};

/**
 * @description returns true if argument is not `null` or `undefined`
 * @param {any} source value to check
 * @returns {boolean}
 */
export const isDefined = _isDefined;

/**
 * @description returns `true` if value is an object (not null/undefined)
 * @param {any} source value to check
 * @returns {boolean}
 */
export const isObject = (source) => {
    return _isDefined(source) && typeof source === "object"
};

/**
 * @description returns `true` if value is a normal number (not null/undef/NaN/Infinity)
 * @param {any} source value to check
 * @returns {source is number}
 */
export const isNumber = (source) => {
    return _isDefined(source) && typeof source === "number" && window.isFinite(source);
}

/**
 * @description returns `true` if value is a function
 * @param {any} source value to check
 * @returns {source is function}
 */
export const isFunction = (source) => {
    return _isDefined(source) && typeof source === "function";
}
