export type Method<T = any> = (...args: any[]) => T;

export type PromiseMethod<T = any> = (...args: any[]) => Promise<T>;

export type Dictionary<T = any> = { [P in keyof T]: T[P]; };

export type SortRule = 'DESC' | 'ASC';
