/*
 * Contains utility methods for working with transformation of different types of objects
 * Author: Yakov Veromeev
 * License: MIT
 */

import { isObject } from "./utilsObjectValidation";

/**
 * @template T
 * @description removes proxy from object by serializing and deserializing it back.
 * WARNING: use it for only data objects, other types like regex and class instances will corrupt.
 * Naming - I took method name from https://docs.jboss.org/hibernate/orm/4.3/javadocs/org/hibernate/engine/spi/PersistenceContext.html#unproxy%28java.lang.Object%29
 * @param {T} object object to remove proxy from
 * @returns {T}
 */
export const unproxy = (object) => {
    if (typeof object === "object") {
        if (Array.isArray(object)) {
            const unproxied = object.map(entry => unproxy(entry));
            Object.setPrototypeOf(unproxied, Object.getPrototypeOf(object));
            return unproxied;
        } else if (isObject(object)) {
            const unproxied = Object.fromEntries(
                Object.entries(object)
                    .map(([key, value]) => [key, unproxy(value)])
            );
            Object.setPrototypeOf(unproxied, Object.getPrototypeOf(object));
            return unproxied;
        }
    }
    return object;
}

/**
 * @template T
 * @description
 * @param {{[key:ObjectKeyType]: T}} source source object
 * @param {ObjectAcceptorFunction<T, boolean>} filterer returns true if the property must remain
 * @returns {{[key:ObjectKeyType]: T}}
 */
const objectFilterPropertiesByFunction = (source, filterer) => {
    const entries = window.Object.entries(source);
    const filtered = entries.filter(([key, value]) => filterer(value, key, source));
    return window.Object.fromEntries(filtered);
};

/**
 * @template T
 * @description by an array of properties creates a filter function to filter only this name properties
 * @param {ObjectKeyType[]} keyArray properties to remain
 * @returns {ObjectAcceptorFunction<T, boolean>}
 */
const getFiltererFromArray = (keyArray) => (_value, key) => {
    return keyArray.includes(key);
}

/**
 * @template T
 * @description Filters object properties and returns object with only properties that match the filter
 * @param {{[key:ObjectKeyType]: T}} source source object
 * @param {ObjectAcceptorFunction<T, boolean>|ObjectKeyType[]} filterer filter function or property array
 * @returns {{[key:ObjectKeyType]: T}}
 */
export const objectFilterProperties = (source, filterer) => {
    if (!isObject(source)) {
        return source;
    }
    if (Array.isArray(filterer)) {
        return objectFilterPropertiesByFunction(source, getFiltererFromArray(filterer));
    }
    return objectFilterPropertiesByFunction(source, filterer);
};

/**
 * @template T extends V
 * @template V
 * @description Maps object properties by a function
 * @param {{[key:ObjectKeyType]: T}} source source object
 * @param {ObjectAcceptorFunction<T, {key?: ObjectKeyType, value: V}>} mapper a function, accept value and key returning {key, value}
 * @returns {{[key:ObjectKeyType]: V}} mapped object
 */
export const objectMapProperties = (source, mapper) => {
    if (!isObject(source)) {
        // @ts-ignore
        return source;
    }
    const entries = window.Object.entries(source);
    const mapped = entries.map(([key, value]) => {
        let {key: newKey, value: newValue} = mapper(value, key, source);
        if (newKey === undefined) {
            newKey = key;
        }
        return [newKey, newValue];
    });
    return window.Object.fromEntries(mapped);
}