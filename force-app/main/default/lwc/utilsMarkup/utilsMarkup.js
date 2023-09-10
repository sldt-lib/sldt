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
        return classListString.split(/\s/);
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
    return [
        ..._classListStringToArray(defaultClasses),
        ...filterMap(
            Object.entries(classMap),
            ([,isClassListVisible]) => isClassListVisible,
            ([classList]) => _classListStringToArray(classList)
        ).flat()
    ].join(" ");
}