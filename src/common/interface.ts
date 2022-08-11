import { Method } from './type';

export interface RetryOptions {
  /** The retry count. */
  count: number;
  /** The waiting time (The time unit is milliseconds). */
  delay: number;
  /** The callback argument.*/
  args?: any[];
}

export interface CycleOptions {
  /** The cycle time, default 1000 (The time unit is milliseconds). */
  interval: number;
  /** The callback argument. */
  args?: any[];
}

export interface CycleClearHandler {
  /** The closes timed calls. */
  close: () => void
}

export interface ConvertOptions {
  /**
   * When the received value does not correspond to expectations, this value is returned.
   *
   * @default null
   */
  default?: any;
  /**
   * The conversion is carried out if the outcome of the conditional validation function execution is true.
   *
   * @empale (num: number) => num > 0
   */
  condition?: Method;
  /**
   * The process that carries out the transition.
   *
   * @empale (data: any) => Number(data)
   */
  transformer?: Method;
}

export class PriorityQueueElement<T = any> {
  public weight: number;

  public value: T;
}
