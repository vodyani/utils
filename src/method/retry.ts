import { sleep } from './sleep';

/**
 * Create a caller that can retry the callback function.
 *
 * @param callback The callback function to call.
 * @param count The retry count.
 * @param delay The waiting time (The time unit is milliseconds).
 * @param args any[]  The callback argument.
 *
 * @publicApi
 */
export async function retry<T = any>(callback: Function, count: number, delay: number, ...args: any[]): Promise<T> {
  let result = null;
  let currentCount = count;

  try {
    result = await callback(...args);
  } catch (error) {
    currentCount--;

    if (currentCount === 0) throw new Error(error);

    if (delay) await sleep(delay);

    result = await retry(
      callback,
      currentCount,
      delay,
      ...args,
    );
  }

  return result;
}
