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

import { isStringFilled } from "c/utilsString";

/**
 * @description Composes CSS class list by default string and object of additional classes to boolean values
 * @param {string|Record<string, boolean>} defaultClassesOrMap string with default class list
 * @param {Record<string, boolean>?} additionalMap additional classes with conditional adding
 * @returns {string}
 * @public
 */
export const classMap = (defaultClassesOrMap, additionalMap = {}) => {
    /** @type {Record<string, boolean>} */
    let resultMap;

    if (isStringFilled(defaultClassesOrMap)) {
        resultMap = additionalMap ?? {};
        resultMap[defaultClassesOrMap] = true;
    } else {
        resultMap = defaultClassesOrMap ?? {};
    }

    return _composeClasses(resultMap);
}

const _composeClasses = (classMap) => {
    let result = [];
    for (let key of Object.keys(classMap)) {
        if (classMap[key]) {
            result.push(key);
        }
    }
    return result.join(" ");
}