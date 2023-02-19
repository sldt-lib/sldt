const _isDefined = (source) => {
    return source !== undefined && source !== null;
};

/**
 * @description returns true if argument is not `null` or `undefined`
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
