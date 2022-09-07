import { describe, it, expect } from '@jest/globals';

import {
  sleep,
  retry,
  circular,
} from '../../src';

describe('promise', () => {
  it('sleep', async () => {
    const start = Date.now();
    await sleep(300);
    expect(Date.now() - start).toBeGreaterThanOrEqual(299);
  });

  it('retry', async () => {
    let count = 0;

    const fn = async () => {
      if (count < 1) {
        count += 1;
        throw new Error('error');
      }

      return count;
    };

    const result = await retry(fn, 3, 100);

    expect(result).toBe(1);
  });

  it('retry.error', async () => {
    let result = 0;

    const fn = async () => {
      throw new Error('async error');
    };

    try {
      result = await retry(fn, 3, 100);
    } catch (error) {
      expect(error.message).toBe('Error: async error');
    }

    expect(result).toBe(0);
  });

  it('circular', async () => {
    let count = 0;

    const fn = () => {
      count++;
    };

    const { close } = circular(fn, 100);

    await sleep(250);

    close();

    expect(count).toBeGreaterThanOrEqual(1);
  });

  it('circular.clear', async () => {
    let count = 0;

    const fn = () => {
      count++;
    };

    const { close } = circular(fn, 100);

    close();

    await sleep(300);

    expect(count).toBe(0);
  });
});
