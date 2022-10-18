import { Stream } from 'stream';

import { isArray, isArrayBuffer, isBoolean, isBuffer, isMap, isNil, isNumber, isObject, isSet, isString, isSymbol } from 'lodash';

/**
 * Determines whether the object contains the current attribute.
 *
 * @param obj The object to judge.
 * @param key The property of object.
 *
 * @publicApi
 */
export function isKeyof(obj: object, key: any): key is keyof typeof obj {
  return key in obj && Object.prototype.hasOwnProperty.call(obj, key);
}
/**
 * Checks if the data is non-empty.
 *
 * @param data The data to be check.
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
 *
 * @publicApi
 */
export function isValidObject(data: any): boolean {
  return isValid(data) && isObject(data) && Object.keys(data).length > 0;
}
/**
 * Checks if the data is Stream.
 *
 * @param data The data to be check.
 *
 * @publicApi
 */
export function isValidStream(data: any) {
  return isValid(data) && data instanceof Stream;
}
/**
 * Checks if the data is Buffer.
 *
 * @param data The data to be check.
 *
 * @publicApi
 */
export function isValidBuffer(data: any) {
  return isValid(data) && isBuffer(data);
}
/**
 * Checks if the data is ArrayBuffer.
 *
 * @param data The data to be check.
 *
 * @publicApi
 */
export function isValidArrayBuffer(data: any) {
  return isValid(data) && isArrayBuffer(data);
}
/**
 * Checks whether the current object is a dictionary.
 *
 * Dictionary is not in (`Map`/`Set`/`Symbol`/`Array`/`String`/`Number`/`Boolean`).
 *
 * @param obj The object to judge.
 *
 * @publicApi
 */
export function isValidDict(obj: any) {
  return isValidObject(obj)
    && !isMap(obj)
    && !isSet(obj)
    && !isArray(obj)
    && !isSymbol(obj)
    && !isString(obj)
    && !isNumber(obj)
    && !isBoolean(obj);
}
