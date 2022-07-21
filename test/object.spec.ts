/* eslint-disable no-buffer-constructor */
/* eslint-disable @typescript-eslint/no-array-constructor */
/* eslint-disable no-array-constructor */
/* eslint-disable no-new-wrappers */
/* eslint-disable no-undefined */
import { Stream } from 'stream';

import { range, camelCase } from 'lodash';
import { describe, it, expect } from '@jest/globals';

import { isDictionary, isKeyof, toDeepConvertProperty, toDeepMerge, toDeepMatch, toDeepRestore } from '../src';

describe('method.object', () => {
  it('isDictionary', async () => {
    expect(isDictionary({})).toBe(true);
    expect(isDictionary(Object())).toBe(true);
    expect(isDictionary({ name: 'dict' })).toBe(true);
    expect(isDictionary(new String())).toBe(false);
    expect(isDictionary(new Number())).toBe(false);
    expect(isDictionary(new Boolean())).toBe(false);
    expect(isDictionary(new Map())).toBe(false);
    expect(isDictionary(new Set())).toBe(false);
    expect(isDictionary(new Array())).toBe(false);
    expect(isDictionary(Buffer.from([]))).toBe(false);
    expect(isDictionary(new Stream())).toBe(false);
    expect(isDictionary(null)).toBe(false);
    expect(isDictionary(undefined)).toBe(false);
  });

  it('isKeyof', async () => {
    const sym = Symbol(1);
    const obj = { test: 'test' };
    const obj1 = { 0: 'test' };
    const obj2 = { [sym]: 'test' };
    expect(isKeyof(obj, 'test')).toBe(true);
    expect(isKeyof(obj, 'test1')).toBe(false);
    expect(isKeyof(obj1, 0)).toBe(true);
    expect(isKeyof(obj2, sym)).toBe(true);
  });

  it('test toDeepMatch', () => {
    const obj = { a: { b: { c: { d: { e: { f: [1] }}}}, c: { d: 2 }}};
    expect(toDeepMatch(obj, 'a.b.c.d.e.f', '.')).toEqual([1]);
    expect(toDeepMatch(obj, 'a.c.d')).toEqual(2);
    expect(toDeepMatch(null, 'a')).toBe(null);
    expect(toDeepMatch(obj, 'a:b')).toBe(null);

    const obj2 = { a: [{ name: 1 }], b: 2 };
    expect(toDeepMatch(obj2, 'a.name')).toBe(null);
    expect(toDeepMatch(obj2, 'b')).toBe(2);
  });

  it('test toDeepRestore', () => {
    expect(toDeepRestore(1, 'a.b.c.d.e.f.g.l')).toEqual({ 'a': { 'b': { 'c': { 'd': { 'e': { 'f': { 'g': { 'l': 1 }}}}}}}});
    expect(toDeepMatch(toDeepRestore(1, 'a.b.c.d.e.f.g.l'), 'a.b.c.d.e.f.g.l')).toBe(1);
    expect(toDeepRestore(1, 'a')).toEqual({ a: 1 });
    const deepKey = range(10000).join('.');
    expect(toDeepMatch(toDeepRestore(1, deepKey), deepKey)).toBe(1);
    expect(toDeepRestore(null, 'a')).toEqual({ a: null });
    expect(toDeepRestore('null', null as any)).toBe(null);
  });

  it('toDeepCamelCase', async () => {
    const toDeepCamelCase = (data: any) => toDeepConvertProperty(data, camelCase);

    expect(toDeepCamelCase({ 'user_id': 1 }).userId).toBe(1);
    expect(toDeepCamelCase({ 'user id': 1 }).userId).toBe(1);
    expect(toDeepCamelCase({ '_User Id': 1 }).userId).toBe(1);
    expect(toDeepCamelCase({ 'user-id': 1 }).userId).toBe(1);
    expect(toDeepCamelCase([{ 'user-id': 1 }])[0].userId).toBe(1);
    expect(toDeepCamelCase([{ 'user-id': [{ 'USER_ID': 2 }] }])[0].userId[0].userId).toBe(2);

    const data = { map: new Map() };
    data.map.set('USER_ID', 1);

    expect(toDeepCamelCase(data).map.get('userId')).toBe(1);
    expect(toDeepCamelCase(null)).toBe(null);
    expect(toDeepCamelCase({ 'user_info': { 'user_name': 'name' }})).toEqual({ 'userInfo': { 'userName': 'name' }});
  });

  it('toDeepMerge', async () => {
    const base = { a: 1, b: 2 };
    const source = { a: 3, c: 4 };
    expect(toDeepMerge(base, source)).toEqual({ a: 3, b: 2, c: 4 });
    expect((base as any).c).toBe(undefined);

    const base2 = { a: [{ b: 3 }], b: { c: [{ d: 1 }, { e: 2 }] }};
    const source2 = { a: [{ b: 3, g: 6 }, { c: 4 }], b: { c: [{ d: 3 }, { e: 4 }] }};
    expect(toDeepMerge(base2, source2)).toEqual({ 'a': [{ 'b': 3 }, { 'b': 3, 'g': 6 }, { 'c': 4 }], 'b': { 'c': [{ 'd': 1 }, { 'e': 2 }, { 'd': 3 }, { 'e': 4 }] }});
    expect(base2.a[1]).toBe(undefined);

    const base3 = { test: { test1: 1 }};
    const source3 = { test: { test1: '1', test2: 2 }};
    expect(toDeepMerge(base3, source3)).toEqual({ test: { test1: '1', test2: 2 }});

    const base4 = [1, 2, 3];
    const source4 = [4, 5, 6];
    expect(toDeepMerge(base4, source4)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(base4[0]).toBe(1);

    const base5 = [1, 2, 3, { b: 1 }];
    const source5 = [4, 5, 6, { a: 1 }, 7];
    expect(toDeepMerge(base5, source5)).toEqual([1, 2, 3, { 'b': 1 }, 4, 5, 6, { 'a': 1 }, 7]);
    expect(base5[0]).toBe(1);

    const base6 = 1;
    const source6 = 2;
    expect(toDeepMerge(base6, source6)).toBe(2);
    expect(base6).toBe(1);

    const base7 = 1;
    const source7: any = null;
    expect(toDeepMerge(base7, source7)).toBe(1);

    const source8 = 1;
    const base8: any = null;
    expect(toDeepMerge(base8, source8)).toBe(1);

    const base9 = [1];
    const source9 = [2];
    expect(toDeepMerge(base9, source9)).toEqual([1, 2]);

    const baseSet = new Set([1, 2, 3]);
    const sourceSet = new Set([1, 2, 4]);
    expect(toDeepMerge(baseSet, sourceSet)).toEqual(new Set([1, 2, 3, 4]));

    const baseMap = new Map();
    const sourceMap = new Map();
    const resultMap = new Map();

    baseMap.set(1, 1);
    sourceMap.set(2, 2);
    resultMap.set(1, 1);
    resultMap.set(2, 2);
    expect(toDeepMerge(baseMap, sourceMap)).toEqual(resultMap);
    expect(toDeepMerge({ foo: ['a', 'b', 'c'] }, { foo: ['d'] })).toEqual({ foo: ['a', 'b', 'c', 'd'] });

    const x = {
      record: {
        prop1: 'value1',
        prop2: 'value2',
      },
      array: [1, 2, 3],
      set: new Set([1, 2, 3]),
      map: new Map([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ]),
    };
    const y = {
      record: {
        prop1: 'changed',
        prop3: 'value3',
      },
      array: [2, 3, 4],
      set: new Set([2, 3, 4]),
      map: new Map([
        ['key2', 'changed'],
        ['key3', 'value3'],
      ]),
    };

    expect(toDeepMerge(x, y)).toEqual({
      'record': {
        'prop1': 'changed',
        'prop2': 'value2',
        'prop3': 'value3',
      },
      'array': [1, 2, 3, 2, 3, 4],
      'set': new Set([1, 2, 3, 4]),
      'map': new Map([
        ['key1', 'value1'],
        ['key2', 'changed'],
        ['key3', 'value3'],
      ]),
    });
  });
});
