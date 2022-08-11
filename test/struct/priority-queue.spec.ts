import { describe, it, expect } from '@jest/globals';

import { PriorityQueue } from '../../src';

describe('PriorityQueue', () => {
  it('ASC PriorityQueue', async () => {
    const queue = new PriorityQueue('ASC');

    queue.push<string>('element_09', 9);
    queue.push<string>('element_01', 1);
    queue.push<string>('element_08', 8);
    queue.push<string>('element_02', 2);

    expect(queue.size()).toBe(4);
    expect(queue.isEmpty()).toBe(false);

    expect(queue.peek<string>().value).toBe('element_09');
    expect(queue.pop<string>().value).toBe('element_09');

    expect(queue.size()).toBe(3);
    expect(queue.peek<string>().value).toBe('element_08');
    expect(queue.toArray<string>()).toEqual(['element_01', 'element_02', 'element_08']);

    queue.pop();
    queue.pop();
    queue.pop();
    expect(queue.isEmpty()).toBe(true);
  });

  it('DESC PriorityQueue', async () => {
    const queue = new PriorityQueue();

    queue.push<string>('element_09', 9);
    queue.push<string>('element_01', 1);
    queue.push<string>('element_08', 8);
    queue.push<string>('element_02', 2);

    expect(queue.size()).toBe(4);
    expect(queue.isEmpty()).toBe(false);

    expect(queue.peek<string>().value).toBe('element_01');
    expect(queue.pop<string>().value).toBe('element_01');

    expect(queue.size()).toBe(3);
    expect(queue.push(null, 3)).toBe(3);
    expect(queue.size()).toBe(3);
    expect(queue.peek<string>().value).toBe('element_02');
    expect(queue.toArray<string>()).toEqual(['element_09', 'element_08', 'element_02']);

    queue.pop();
    queue.pop();
    queue.pop();
    expect(queue.isEmpty()).toBe(true);
  });
});
