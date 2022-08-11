import { Stream, Duplex } from 'stream';

import { deepmerge } from 'deepmerge-ts';
import { isEmpty, isMap, isNil, isObject } from 'lodash';

import { ConvertOptions, Method } from '../common';

import { isValid, isValidArray, isValidDict, isValidString } from './validate';

/**
 * The process that carries out the transition.
 *
 * @tips There are two outcomes that return the `default`: `default` is entered and either the condition fails or the value is null.
 *
 * @param data Data that needs to be transformed.
 * @param options Options in transformation processing.
 * @returns `T` | `any`
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
 * @returns string
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
 * @returns number
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
/**
 * Convert `Stream` data to `Buffer`.
 *
 * @param stream Data that needs to be transformed.
 * @returns Promise<Buffer>
 *
 * @publicApi
 */
export async function toBuffer(stream: Stream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buffers: Uint8Array[] = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
}
/**
 * Convert `Buffer` data to `Stream`.
 *
 * @param buffer Data that needs to be transformed.
 * @param encoding The encoding type.
 * @returns Promise<Duplex>
 *
 * @publicApi
 */
export async function toStream(buffer: Buffer, encoding?: BufferEncoding): Promise<Duplex> {
  const stream = new Duplex();
  stream.push(buffer, encoding);
  stream.push(null, encoding);
  return stream;
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
