/**
 * Wait during an asynchronous function call.
 *
 * @param delay The waiting time (The time unit is milliseconds).
 *
 * @publicApi
 */
export function sleep(delay: number) {
  return new Promise<void>(resolve => setTimeout(() => resolve(), delay));
}
