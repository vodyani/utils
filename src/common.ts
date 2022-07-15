export interface RetryOptions {
  /** retry count. */
  count: number;
  /** waiting time (The time unit is milliseconds). */
  delay: number;
  /** callback argument. */
  args?: any[];
}

export interface CycleOptions {
  /** cycle time, default 1000 (The time unit is milliseconds). */
  interval: number;
  /** callback argument. */
  args?: any[];
}

export interface CycleClearHandler {
  /** closes timed calls */
  close: () => void
}
