import { Stream } from 'stream';

import { isArray, isBuffer, isFunction, isMap, isNil, isObject, isRegExp, isSet, isString, isSymbol } from 'lodash';

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
 *  toMatch({ job: { name: 'job' }}, 'job.name') // 'job'
 * ```
 *
 * @publicApi
 */
export function toMatch<T = any>(obj: any, token: string, rule = '.'): T {
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
 *  toRestore('job', 'job.name') // { job: { name: 'job' }}
 * ```
 *
 * @publicApi
 */
export function toRestore<T = object>(value: any, token: string, rule = '.'): T {
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
