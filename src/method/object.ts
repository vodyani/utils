import { deepmerge } from 'deepmerge-ts';
import { isNil, isObject } from 'lodash';

import { isValid, isValidDict, isValidString } from './validate';

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
  if (!isValidString(rule) || !isValidDict(obj)) return null;

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

    if (isValidDict(node)) {
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
  if (isNil(token) || !isValidString(token)) return null;

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
export function toDeepMerge<T = any>(base: any, source: any): T {
  if (isValid(base) && isNil(source)) return base;
  if (!(isObject(base) && isObject(source))) return source;

  return deepmerge(base, source) as any;
}
