import { CycleClearHandler, CycleOptions, RetryOptions } from '../common';

import { isValid } from './validate';

/**
 * Wait during an asynchronous function call.
 *
 * @param delay The waiting time (The time unit is milliseconds).
 * @returns Promise<void>
 *
 * @publicApi
 */
export function toDelay(delay: number) {
  return new Promise<void>(resolve => setTimeout(() => resolve(), delay));
}
/**
 * Create a recurring scheduled task.
 *
 * @param callback A callback function that needs to be called periodically.
 * @param options Configuration options when triggered.
 * @returns CycleClearHandler - Returns a method that closes timed calls.
 *
 * @publicApi
 */
export function toCycle(callback: Function, options: CycleOptions): CycleClearHandler {
  let timeOutHandler: NodeJS.Timeout = null;
  const args = options.args || [];

  const regularly = () => {
    close();
    timeOutHandler = setTimeout(regularlyHandler, options.interval);
  };

  const clearHandler = () => {
    clearTimeout(timeOutHandler);
    timeOutHandler = null;
  };

  const regularlyHandler = () => {
    callback(...args);
    regularly();
  };

  const close = () => {
    if (isValid(timeOutHandler)) clearHandler();
  };

  regularly();

  return { close };
}
/**
 * Create a caller that can retry the callback function.
 *
 * @param callback The callback function to call.
 * @param options Configuration options when triggered.
 * @returns T
 *
 * @publicApi
 */
export async function toRetry<T = any>(callback: Function, options: RetryOptions): Promise<T> {
  let result = null;
  let currentCount = options.count;
  const currentDelay = options.delay;
  const currentArgs = options.args || [];

  try {
    result = await callback(...currentArgs);
  } catch (error) {
    currentCount--;

    // No chance to try again
    if (currentCount === 0) throw new Error(error);

    // If need delay retry ...
    if (currentDelay) await toDelay(currentDelay);

    result = await toRetry(
      callback,
      { count: currentCount, delay: currentDelay, args: currentArgs },
    );
  }

  return result;
}
