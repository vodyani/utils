import { Stream } from 'stream';

import { describe, it, expect } from '@jest/globals';

import { isKeyof, isValidDict, isValidBuffer, isValidStream, isValidNumber, isValid, isValidArray, isValidObject, isValidString } from '../../src';

describe('validate', () => {
  it('isValidDict', async () => {
    expect(isValidDict({ name: 'dict' })).toBe(true);
    expect(isValidDict({})).toBe(false);
    expect(isValidDict(Object())).toBe(false);
    expect(isValidDict(String())).toBe(false);
    expect(isValidDict(Number())).toBe(false);
    expect(isValidDict(Boolean())).toBe(false);
    expect(isValidDict(new Map())).toBe(false);
    expect(isValidDict(new Set())).toBe(false);
    expect(isValidDict([])).toBe(false);
    expect(isValidDict(Symbol(1))).toBe(false);
    expect(isValidDict(null)).toBe(false);
    expect(isValidDict(undefined)).toBe(false);
  });

  it('isValidBuffer', async () => {
    const buffer = Buffer.from([]);
    expect(isValidBuffer(buffer)).toBe(true);
    expect(isValidBuffer(Object())).toBe(false);
  });

  it('isValidStream', async () => {
    const stream = new Stream();
    expect(isValidStream(stream)).toBe(true);
    expect(isValidStream(Object())).toBe(false);
  });

  it('isValid', async () => {
    expect(isValid(undefined)).toBe(false);
    expect(isValid(null)).toBe(false);
    expect(isValid([])).toBe(true);
    expect(isValid({})).toBe(true);
    expect(isValid(0)).toBe(true);
    expect(isValid('')).toBe(true);
    expect(isValid(Number(''))).toBe(true);
  });

  it('isValidArray', async () => {
    expect(isValidArray(undefined as any)).toBe(false);
    expect(isValidArray(null as any)).toBe(false);
    expect(isValidArray([])).toBe(false);
    expect(isValidArray([{}])).toBe(true);
    expect(isValidArray([0])).toBe(true);
    expect(isValidArray([''])).toBe(true);
    expect(isValidArray([Number('')])).toBe(true);
  });

  it('isValidNumber', async () => {
    expect(isValidNumber(undefined as any)).toBe(false);
    expect(isValidNumber(null as any)).toBe(false);
    expect(isValidNumber(0)).toBe(true);
    expect(isValidNumber(('0' as unknown as number))).toBe(false);
    expect(isValidNumber(Infinity)).toBe(false);
    expect(isValidNumber(-Infinity)).toBe(false);
    expect(isValidNumber(Number('demo'))).toBe(false);
  });

  it('isValidObject', async () => {
    expect(isValidObject(undefined)).toBe(false);
    expect(isValidObject(null)).toBe(false);
    expect(isValidObject({})).toBe(false);
    expect(isValidObject({ test: 1 })).toBe(true);
  });

  it('isValidString', async () => {
    expect(isValidString(undefined as any)).toBe(false);
    expect(isValidString(null as any)).toBe(false);
    expect(isValidString('')).toBe(false);
    expect(isValidString('demo')).toBe(true);
  });

  it('isKeyof', async () => {
    expect(isKeyof({ test: 'test' }, 'test')).toBe(true);
    expect(isKeyof({ test: 'test' }, 'test1')).toBe(false);
    expect(isKeyof({ 0: 'test' }, 0)).toBe(true);
  });
});
