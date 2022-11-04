/*
 * Contains utility methods for working with arrays
 * Author Yakov Veromeev
 * License MIT
 */

// internal shortcut
const _isArray = Array.isArray;

/**
 * @description Checks if the variable is an array. The shortcut for `Array.isArray`
 * @param {any} probableArray
 * @return {probableArray is any[]}
 */
export const isArray = _isArray;

/**
 * @description Checks if the variable is an array and it has items
 * @param {any} probableArray the variable to test
 * @returns {boolean}
 */
export const isArrayFilled = (probableArray) => (_isArray(probableArray) && probableArray.length > 0);

/**
 * @description A filter and map at once. Filters an input array then transforms it
 * @template T source array element type
 * @template R result array element type
 * @param {T[]} source source array
 * @param {(element: T, index: number, array: T[]) => boolean} condition method to check
 * @param {(element: T, index: number, array: T[]) => R} transform mapper
 * @returns {R[]}
 */
export const filterMap = (source, condition, transform) => {
    if (!_isArray(source)) {
        return source;
    }
    const result = new Array(source.length);
    let resultIndex = 0;
    source.forEach((element, index, array) => {
        if (condition(element, index, array) === true) {
            result[resultIndex] = transform(element, resultIndex, array);
            resultIndex++
        }
    });
    result.length = resultIndex;
    return result;
}

/**
 * @description returns an array of the arrays that are parts of the source with the specified length.
 * If the source is not an array or the chunk size is invalid, returns source;
 * @template T
 * @param {T[]} source source array
 * @param {number} chunkSize size
 * @return {T[][]} array of chunk arrays
 */
export const splitIntoChunks = (source, chunkSize) => {
    if (!Number.isFinite(chunkSize) || chunkSize <= 0 || !isArray(source)) {
        //@ts-ignore
        return source;
    }
    const chunkCount = Math.ceil(source.length / chunkSize);
    return Array(chunkCount)
        .fill()
        .map((_, chunkIndex) => {
            const startIndex = chunkIndex * chunkSize;
            return source.slice(
                startIndex,
                startIndex + chunkSize);
        });
}

/**
 * @template T
 * @typedef {(element: T, index?: number, array?: T[]) => (string|number)} KeyFunction
 */

/**
 * @template T
 * @typedef {string|(KeyFunction<T>)} KeyParameter
 */


/**
 * @description groups array elements basing on key into groups. Groups can be composed by any rule and be any object
 *
 * @template T source array element type
 * @template V result value to store
 * @template G group type
 *
 * @param {T[]} source array to group
 * @param {KeyParameter<T>} key group key generator. If it returns undefined, the element is skipped
 * @param {(element: T, index?: number, array?: T[]) => V} value value generator, if not specified - returns the element itself
 * @param {(initialGroup: G, newValue: V) => G} regroup combine the new value and existing group. If the group was not in use before, it is undefined or result of optional getInitialGroup
 * @param {() => G} getInitialGroup optional function to initialize the group before first use
 *
 * @return { {[key: (string|number)] : G} }
 */
export const group = (source, key, value = undefined, regroup, getInitialGroup = undefined) => {
    // set default value function as identity
    if (value === undefined) {
        // @ts-ignore
        value = /** @type{(element:T)=>V} */ (element) =>  element;
    }

    // set key function in case key is string
    /** @type {KeyFunction<T>} */
    let keyFunction;
    if (typeof key === "string") {
        const objectField = key;
        keyFunction = (element) => ((typeof element === "object" && objectField in element) ? element[objectField] : undefined)
    } else {
        keyFunction = key;
    }

    return source.reduce(
        (groups, element, index, array) => {
            const elementKey = keyFunction(element, index, array);
            const elementValue = value(element, index, array);

            let currentGroup = groups[elementKey];
            if (
                currentGroup === undefined &&
                getInitialGroup !== undefined &&
                typeof getInitialGroup === "function"
            ) {
                currentGroup = getInitialGroup();
            }

            const newGroup = regroup(currentGroup, elementValue);

            groups[elementKey] = newGroup;

            return groups;
        },
        {}
    );
}

/**
 * @description default functions to simplify usage of `group` method
 * providing methods specified for commonly used scenarios
 */
const _defaultGroupFunctions = {
    /**
     * regroup method to collect items into array
     * @template V array value
     * @param {V[]} array initial array group
     * @param {V} element new element
     * @returns {V[]}
     */
    regroupToArray : (array, element) => {
        array.push(element);
        return array;
    },

    /**
     * @description returns the same value
     * @template T
     * @template G
     * @param {G} _group previous value
     * @param {T} element value to return
     * @returns {G}
     */
    regroupToUniqueElement: (_group, element) => {
        //@ts-ignore
        return element;
    },

    /**
     * @description regroup used to concat arrays into "group" array
     * @template T
     * @param {T[]} groupArray result array
     * @param {T[]} elementArray array of current element
     * @returns {T[]}
     */
    regroupConcatArrays: (groupArray, elementArray) => {
        return groupArray.concat(elementArray);
    },

    /**
     * @description returns an empty array to group into this array
     * @template T
     * @returns {T[]}
     */
    getInitialGroupArray: () => {
        return [];
    },
};

/**
 * @description group elements into arrays by the same key, useful if a key is a relationship identifier
 * @template T source array element type
 * @template V result value to store
 * @param {T[]} source
 * @param {KeyParameter<T>} key group key generator. If it returns undefined, the element is skipped
 * @param {(element: T, index?: number, array?: T[]) => V} value
 * @return {{[key: (string|number)] : V[]}}
 */
export const groupToArrays = (source, key, value = undefined) => {
    return group/**<T, V, V[]>*/(source, key, value, _defaultGroupFunctions.regroupToArray, _defaultGroupFunctions.getInitialGroupArray);
}


 /**
 * @description group elements into result of the element itself, useful when keys are unique
 * @template T source array element type
 * @template V result value to store
 * @param {T[]} source
 * @param {KeyParameter<T>} key group key generator. If it returns undefined, the element is skipped
 * @param {(element: T, index?: number, array?: T[]) => V} value
 * @return {{[key: (string|number)] : V}}
 */
export const groupToSingleValue = (source, key, value = undefined) => {
    return group/**<T, V, V>*/(source, key, value, _defaultGroupFunctions.regroupToUniqueElement);
}

 /**
 * @description group elements into result of the element itself, useful when keys are unique
 * @template T source array element type
 * @template V result value to store
 * @param {T[]} source
 * @param {KeyParameter<T>} key group key generator. If it returns undefined, the element is skipped
 * @param {(element: T, index?: number, array?: T[]) => V[]} value
 * @return {{[key: (string|number)] : V[]}}
 */

export const groupToConcatenateArrays = (source, key, value = undefined) => {
    return group/**<T, V[], V[]>*/(source, key, value, _defaultGroupFunctions.regroupConcatArrays, _defaultGroupFunctions.getInitialGroupArray);
}