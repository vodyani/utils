import { isEmpty, isMap, isNil } from 'lodash';

import { ConvertOptions } from '../common';

import { isValid, isValidArray, isValidDict } from './validate';

/**
 * Formatting properties of the object in the data.
 *
 * @param data The source data (`Array`|`Object`|`Map`).
 * @param transformer A callback function used to convert properties.
 * @returns any
 *
 * @publicApi
 *
 * @tips Because this method uses recursion, it can cause stack overflows when the hierarchy is too deep !
 */
export function toDeepConvertProperty(data: any, transformer: Function): any {
  if (isNil(data)) return data;

  let result = null;

  const pipe = [
    {
      isAllowUse: isMap(data),
      use: () => {
        const result = new Map();
        (data as Map<any, any>).forEach((v, k) => result.set(transformer(k), v));
        return result;
      },
    },
    {
      isAllowUse: isValidArray(data),
      use: () => {
        return data.map((item: any) => toDeepConvertProperty(item, transformer));
      },
    },
    {
      isAllowUse: isValidDict(data),
      use: () => {
        const result = Object();
        Object.keys(data).forEach((key: any) => {
          result[transformer(key)] = toDeepConvertProperty(data[key], transformer);
        });
        return result;
      },
    },
  ];

  for (const { isAllowUse, use } of pipe) {
    if (isAllowUse) {
      result = use();
      break;
    }

    result = data;
  }

  return result;
}
/**
 * The process that carries out the transition.
 *
 * @tips There are two outcomes that return the `default`: `default` is entered and either the condition fails or the value is null.
 *
 * @param data Data that needs to be transformed.
 * @param options Options in transformation processing.
 *
 * @publicApi
 */
export function toConvert<T = any>(data: any, options?: ConvertOptions): T {
  const { condition, transformer, default: value } = options || Object();

  if (condition) {
    if (transformer && condition(data)) return transformer(data);
    if (isValid(value)) return value;
  }

  return isNil(data) && isValid(value) ? value : data;
}
/**
 * Convert data to string.
 *
 * @param data Data that needs to be transformed.
 * @param defaultValue This value is returned when the incoming value does not match expectations.
 *
 * @publicApi
 */
export function toString(data: any, defaultValue = ''): string {
  return toConvert(data, {
    transformer: String,
    default: defaultValue,
    condition: (data) => isValid(data) && !isEmpty(String(data)),
  });
}
/**
 * Convert data to number.
 *
 * @param data Data that needs to be transformed.
 * @param defaultValue This value is returned when the incoming value does not match expectations.
 *
 * @publicApi
 */
export function toNumber(data: any, defaultValue = 0): number {
  return toConvert(data, {
    transformer: Number,
    default: defaultValue,
    condition: (data) => isValid(data) && Number.isSafeInteger(Number(data)),
  });
}
