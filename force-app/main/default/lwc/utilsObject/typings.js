/**
 * @typedef {(string|number|symbol)} ObjectKeyType
 */

/**
 * @template T object property type
 * @template V return value
 * @typedef {(value: T, key?: ObjectKeyType, source?:{[key:ObjectKeyType]: T})=>V} ObjectAcceptorFunction
 */