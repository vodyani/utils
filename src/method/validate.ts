import { Stream } from 'stream';

import { isArray, isBuffer, isMap, isNil, isNumber, isObject, isSet, isString, isSymbol } from 'lodash';

/**
 * Checks if the data is non-empty.
 *
 * @param data The data to be check.
 * @returns boolean
 *
 * @publicApi
 */
export function isValid(data: any): boolean {
  return !isNil(data);
}
/**
 * Checks if the data is non-empty string.
 *
 * @param data The data to be check.
 * @returns boolean
 *
 * @publicApi
 */
export function isValidString(data: string): boolean {
  return isValid(data) && isString(data) && data.length > 0;
}
/**
 * Checks if the data is non-empty number (Also it will not be NAN or plus or minus infinity).
 *
 * @param data The data to be check.
 * @returns boolean
 *
 * @publicApi
 */
export function isValidNumber(data: number): boolean {
  return isValid(data) && isNumber(data) && Number.isSafeInteger(data);
}
/**
 * Checks if the data is non-empty array.
 *
 * @param data The data to be check.
 * @returns boolean
 *
 * @publicApi
 */
export function isValidArray(data: any[]): boolean {
  return isValid(data) && isArray(data) && data.length > 0;
}
/**
 * Checks if the data is non-empty object.
 *
 * @param data The data to be check.
 * @returns boolean
 *
 * @publicApi
 */
export function isValidObject(data: any): boolean {
  return isValid(data) && isObject(data) && Object.keys(data).length > 0;
}
/**
 * Checks if the data is stream.
 *
 * @param data The data to be check.
 * @returns boolean
 *
 * @publicApi
 */
export function isValidStream(data: Stream) {
  return isValid(data) && data instanceof Stream;
}
/**
 * Checks if the data is buffer.
 *
 * @param data The data to be check.
 * @returns boolean
 *
 * @publicApi
 */
export function isValidBuffer(data: Buffer) {
  return isValid(data) && isBuffer(data);
}
/**
 * Checks whether the current object is a dictionary.
 *
 * Dictionary is not in (`Map`/`Set`/`Symbol`/`Array`/`String`/`Number`/`Boolean`).
 *
 * @param dict The object to judge.
 * @returns boolean
 *
 * @publicApi
 */
export function isValidDict(dict: any) {
  return isValidObject(dict)
    && !isMap(dict)
    && !isSet(dict)
    && !isArray(dict)
    && !isSymbol(dict)
    && !(dict instanceof String)
    && !(dict instanceof Number)
    && !(dict instanceof Boolean);
}
/**
 * Determines whether the object contains the current attribute.
 *
 * @param obj The object to judge.
 * @param key The property of object.
 * @returns (is keyof typeof obj)
 *
 * @publicApi
 */
export function isKeyof(obj: object, key: string | number): key is keyof typeof obj {
  return key in obj && Object.prototype.hasOwnProperty.call(obj, key);
}
