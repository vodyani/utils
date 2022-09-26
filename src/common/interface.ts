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
  condition?: (...args: any[]) => boolean;
  /**
   * The process that carries out the transition.
   *
   * @empale (data: any) => Number(data)
   */
  transformer?: Function;
}

export class PriorityElement<T = any> {
  /**
   * Priority Indicates the weight of the queue.
   */
  public weight: number;
  /**
   * The actual content.
   */
  public value: T;
}
