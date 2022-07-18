/* eslint-disable no-buffer-constructor */
/* eslint-disable @typescript-eslint/no-array-constructor */
/* eslint-disable no-array-constructor */
/* eslint-disable no-new-wrappers */
/* eslint-disable no-undefined */
import { Stream } from 'stream';

import { range } from 'lodash';
import { describe, it, expect } from '@jest/globals';

import { isDictionary, isKeyof, toMatch, toRestore } from '../src';

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

  it('test toMatch', () => {
    const obj = { a: { b: { c: { d: { e: { f: [1] }}}}, c: { d: 2 }}};
    expect(toMatch(obj, 'a.b.c.d.e.f', '.')).toEqual([1]);
    expect(toMatch(obj, 'a.c.d')).toEqual(2);
    expect(toMatch(null, 'a')).toBe(null);
    expect(toMatch(obj, 'a:b')).toBe(null);

    const obj2 = { a: [{ name: 1 }], b: 2 };
    expect(toMatch(obj2, 'a.name')).toBe(null);
    expect(toMatch(obj2, 'b')).toBe(2);
  });

  it('test toRestore', () => {
    expect(toRestore(1, 'a.b.c.d.e.f.g.l')).toEqual({ 'a': { 'b': { 'c': { 'd': { 'e': { 'f': { 'g': { 'l': 1 }}}}}}}});
    expect(toMatch(toRestore(1, 'a.b.c.d.e.f.g.l'), 'a.b.c.d.e.f.g.l')).toBe(1);
    expect(toRestore(1, 'a')).toEqual({ a: 1 });
    const deepKey = range(10000).join('.');
    expect(toMatch(toRestore(1, deepKey), deepKey)).toBe(1);
    expect(toRestore(null, 'a')).toEqual({ a: null });
    expect(toRestore('null', null as any)).toBe(null);
  });
});
