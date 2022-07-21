import { Stream } from 'stream';

import { deepmerge } from 'deepmerge-ts';
import { isArray, isBuffer, isFunction, isMap, isNil, isObject, isRegExp, isSet, isString, isSymbol } from 'lodash';

import { Method } from '../common';

/**
 * Checks whether the current object is a dictionary.
 *
 * Dictionary is not in (`Map`/`Set`/`Symbol`/`Buffer`/`Array`/`Stream`/`RegExp`/`Function`/`String`/`Number`/`Boolean`).
 *
 * @param dict The object to judge.
 * @returns boolean
 *
 * @publicApi
 */
export function isDictionary(dict: any) {
  return isObject(dict)
    && !isNil(dict)
    && !isMap(dict)
    && !isSet(dict)
    && !isArray(dict)
    && !isBuffer(dict)
    && !isSymbol(dict)
    && !isRegExp(dict)
    && !isFunction(dict)
    && !(dict instanceof Stream)
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
export function isKeyof(obj: object, key: string | number | symbol): key is keyof typeof obj {
  return !isNil(obj) && isDictionary(obj) && key in obj && Object.prototype.hasOwnProperty.call(obj, key);
}
/**
 * Walks deeply through the object and returns the property value corresponding to the specified parameter.
 *
 * @param obj The object to judge.
 * @param token The properties of the object and splice them with `rule`.
 * @param rule The rules for splicing, by default, are `.`.
 * @returns T
 *
 * @example
 * ```ts
 *  toDeepMatch({ job: { name: 'job' }}, 'job.name') // 'job'
 * ```
 *
 * @publicApi
 */
export function toDeepMatch<T = any>(obj: any, token: string, rule = '.'): T {
  if (!isString(rule) || isNil(obj) || !isDictionary(obj)) return null;

  const stack = [];
  const factors = token.split(rule);

  let node;
  let nodeResult = null;
  let nodeDeepLevel = 0;

  stack.push(obj);

  while (stack.length > 0) {
    node = stack.pop();

    if (nodeDeepLevel === factors.length) {
      nodeResult = node;
      break;
    }

    if (isDictionary(node)) {
      for (const key of Object.keys(node)) {
        const indexResult = factors.indexOf(key);
        const factorResult = factors[nodeDeepLevel];

        if (key === factorResult && indexResult === nodeDeepLevel) {
          stack.push(node[key]);
          nodeDeepLevel += 1;
          break;
        }
      }
    }
  }

  return nodeResult;
}
/**
 * Restores to the corresponding object based on the depth of the specified property and property value.
 *
 * @param value The object properties value.
 * @param token The properties of the object and splice them with `rule`.
 * @param rule The rules for splicing, by default, are `.`.
 * @returns T
 *
 * @example
 * ```ts
 *  toDeepRestore('job', 'job.name') // { job: { name: 'job' }}
 * ```
 *
 * @publicApi
 */
export function toDeepRestore<T = object>(value: any, token: string, rule = '.'): T {
  if (isNil(token) || !isString(token)) return null;

  const object = Object();
  const factors = token.split(rule);

  let node = object;

  while (factors.length > 0) {
    const key = factors.shift();

    node[key] = Object();

    if (factors.length === 0) {
      node[key] = value;
    } else {
      node = node[key];
    }
  }

  return object;
}
/**
 * Deep comparison and fusion are performed on the two incoming data.
 *
 * @tips `base` will be deeply copied before merging, so it will not be changed.
 *
 * @param base The underlying data being compared.
 * @param source New data merged into the underlying data.
 * @returns `T` | `any`
 *
 * @publicApi
 */
export function toDeepMerge(base: any, source: any) {
  if (!isNil(base) && isNil(source)) return base;
  if (!(isObject(base) && isObject(source))) return source;
  return deepmerge(base, source);
}
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
export function toDeepConvertProperty(data: any, transformer: Method<string>): any {
  if (isNil(data)) return data;

  let result = null;

  const pipe = [
    {
      isAllowUse: isArray(data),
      use: () => {
        return data.map((item: any) => toDeepConvertProperty(item, transformer));
      },
    },
    {
      isAllowUse: isMap(data),
      use: () => {
        const result = new Map();
        (data as Map<any, any>).forEach((v, k) => result.set(transformer(k), v));
        return result;
      },
    },
    {
      isAllowUse: isDictionary(data),
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
