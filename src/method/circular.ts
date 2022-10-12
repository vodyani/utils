import { CircularHandler } from '../common';

/**
 * Create a recurring scheduled task.
 *
 * @param callback A callback function that needs to be called periodically.
 * @param interval number The cycle time, default 1000 (The time unit is milliseconds).
 * @param args any[]  The callback argument.
 *
 * @publicApi
 */
export function circular(callback: Function, interval: number, ...args: any[]): CircularHandler {
  let timer: NodeJS.Timeout = null;

  const close = () => {
    if (timer) clearTimeout(timer);
  };

  const regularly = () => {
    close();
    timer = setTimeout(regularlyHandler, interval);
  };

  const regularlyHandler = () => {
    callback(...args);
    regularly();
  };

  regularly();

  return { close };
}
