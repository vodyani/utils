import { describe, it, expect } from '@jest/globals';

import {
  toDelay,
  toRetry,
  toCycle,
} from '../../src';

describe('promise', () => {
  it('toDelay', async () => {
    const start = Date.now();
    await toDelay(300);
    expect(Date.now() - start).toBeGreaterThanOrEqual(299);
  });

  it('toRetry', async () => {
    let count = 0;

    const fn = async () => {
      if (count < 1) {
        count += 1;
        throw new Error('error');
      }

      return count;
    };

    const result = await toRetry(fn, { delay: 100, count: 3 });

    expect(result).toBe(1);
  });

  it('toRetry.error', async () => {
    let result = 0;

    const fn = async () => {
      throw new Error('async error');
    };

    try {
      result = await toRetry(fn, { delay: 100, count: 3 });
    } catch (error) {
      expect(error.message).toBe('Error: async error');
    }

    expect(result).toBe(0);
  });

  it('toCycle', async () => {
    let count = 0;

    const fn = () => {
      count++;
    };

    const { close } = toCycle(fn, { interval: 100 });

    await toDelay(250);

    close();

    expect(count).toBeGreaterThanOrEqual(1);
  });

  it('toCycle.clear', async () => {
    let count = 0;

    const fn = () => {
      count++;
    };

    const { close } = toCycle(fn, { interval: 100 });

    close();

    await toDelay(300);

    expect(count).toBe(0);
  });
});
