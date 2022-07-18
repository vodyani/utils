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
