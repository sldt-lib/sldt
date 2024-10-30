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
import { filterMap } from "c/utilsArray";
import { isObject } from "c/utilsObject";

/**
 * @description converts CSS class string to array
 * @param {string?} classListString string with default classes
 * @returns {string[]}
 */
const _classListStringToArray = classListString => {
    if (isStringFilled(classListString)) {
        return classListString.split(/\s+/);
    }
    return [];
}

/**
 * @description Composes CSS class list by default string and object of additional classes to boolean values
 * @param {string} defaultClasses string with default class list
 * @param {{[className:string]: boolean}?} classMap additional classes with conditional adding
 * @returns {string}
 */
export const composeClasses = (defaultClasses, classMap) => {
    if (!isObject(classMap)) {
        classMap = {};
    }
    classMap[defaultClasses] = true;
    const classSet = new Set(
        filterMap(
            Object.entries(classMap),
            ([,isClassListVisible]) => isClassListVisible,
            ([classList]) => _classListStringToArray(classList)
        ).flat()
    );
    return Array.from(classSet).join(" ");
}