import { PriorityElement } from '../common';
import { isValid, isValidNumber } from '../method';

export class PriorityQueue {
  private readonly sort: Function;

  private readonly data: PriorityElement[] = [];

  constructor(rule?: 'DESC' | 'ASC') {
    this.sort = (_before: number, _after: number) => {
      return rule === 'ASC' ? _before - _after : _after - _before;
    };
  }

  public push<T = any>(value: T, weight: number) {
    if (!isValid(value) || !isValidNumber(weight)) {
      return this.data.length;
    }

    const index = this.search(weight);

    this.data.splice(index, 0, { weight, value });

    return this.data.length;
  }

  public pop<T = any>(): PriorityElement<T> {
    return this.data.pop();
  }

  public peek<T = any>(): PriorityElement<T> {
    return this.data[this.data.length - 1];
  }

  public size() {
    return this.data.length;
  }

  public isEmpty() {
    return this.data.length === 0;
  }

  public toArray<T = any>() {
    return this.data.map(e => e.value) as T[];
  }

  private search(weight: number) {
    let low = 0;
    let high = this.data.length;

    while (low < high) {
      const mid = low + ((high - low) >> 1);
      const node = this.data[mid];

      if (this.sort(node.weight, weight) > 0) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }

    return low;
  }
}
