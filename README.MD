# Vodyani utils

😁 Provides common utility functions used in server-side development.

[![Npm](https://img.shields.io/npm/v/@vodyani/utils/latest.svg)](https://www.npmjs.com/package/@vodyani/utils)
[![Npm](https://img.shields.io/npm/v/@vodyani/utils/beta.svg)](https://www.npmjs.com/package/@vodyani/utils)
[![Npm](https://img.shields.io/npm/dm/@vodyani/utils)](https://www.npmjs.com/package/@vodyani/utils)
[![License](https://img.shields.io/github/license/vodyani/utils)](LICENSE)
<br>
![Workflow](https://github.com/vodyani/utils/actions/workflows/release.yml/badge.svg)
[![codecov](https://codecov.io/gh/vodyani/utils/branch/master/graph/badge.svg?token=CI3WEJUN6L)](https://codecov.io/gh/vodyani/utils)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

## Installation

```sh
npm install @vodyani/utils
```

## Usage

|Features|Type|Description|
|:-:|:-:|:-:|
|[isDictionary](#isdictionary)|object|Checks whether the current object is a dictionary object.|
|[isKeyof](#iskeyof)|object|Determines whether the object contains the current attribute.|
|[toDeepMatch](#todeepmatch)|object|Walks deeply through the object and returns the property value corresponding to the specified parameter.|
|[toDeepRestore](#todeeprestore)|object|Restores to the corresponding object based on the depth of the specified property and property value.|
|[toDeepMerge](#todeepmerge)|object|Deep comparison and fusion are performed on the two incoming data.|
|[toDeepConvertProperty](#todeepconvertproperty)|object|Formatting properties of the object in the data.|
|[toDelay](#todelay)|promise|Wait during an asynchronous function call.|
|[toCycle](#tocycle)|promise|Create a recurring scheduled task.|
|[toRetry](#toretry)|promise|Create a caller that can retry the callback function.|

### isDictionary

Checks whether the current object is a dictionary object.

⚠️ Dictionary is not in (`Map`/`Set`/`Symbol`/`Buffer`/`Array`/`Stream`/`RegExp`/`Function`/`String`/`Number`/`Boolean`).

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`dict`|`any`|*The object to judge.*|

**Return**

`boolean`

**Example**
```ts
isDictionary({}) // true
isDictionary(Object()) // true
isDictionary({ name: 'dict' }) // true
isDictionary(new String()) // false
isDictionary(new Number()) // false
isDictionary(new Boolean()) // false
isDictionary(new Map()) // false
isDictionary(new Set()) // false
isDictionary(new Array()) // false
isDictionary(Buffer.from([])) // false
isDictionary(new Stream()) // false
isDictionary(null) // false
isDictionary(undefined) // false
```

### isKeyof

Determines whether the object contains the current attribute.

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`obj`|`object`|*The object to judge.*|
|`key`|`string`/`number`/`symbol`|*The property of object.*|

**Return**

`boolean`

**Example**

```ts
const sym = Symbol(1);
const obj = { test: 'test' };
const obj1 = { 0: 'test' };
const obj2 = { [sym]: 'test' };

isKeyof(obj, 'test') // true
isKeyof(obj, 'test1') // false
isKeyof(obj1, 0) // true
isKeyof(obj2, sym) // true
```

### toDeepMatch

Walks deeply through the object and returns the property value corresponding to the specified parameter.

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`obj`|`any`|*The object to judge.*|
|`token`|`string`|*The properties of the object and splice them with `rule`.*|
|`rule`|`string`|*The rules for splicing, by default, are `.`*|

**Return**

`T` | `any`

**Example**

```ts
toDeepMatch({ job: { name: 'job' }}, 'job.name') // 'job'
toDeepMatch({ cat: { info: { name: 'mimi' } }}, 'cat.info.name') // 'mimi'
```

### toDeepRestore

Restores to the corresponding object based on the depth of the specified property and property value.

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`value`|`any`|*The object properties value.*|
|`token`|`string`|*The properties of the object and splice them with `rule`.*|
|`rule`|`string`|*The rules for splicing, by default, are `.`*|

**Return**

`T` | `any`

**Example**

```ts
toDeepRestore('job', 'job.name') // { job: { name: 'job' }}
toDeepRestore('mimi', 'cat.info.name') // { cat: { info: { name: 'mimi' } }
```

### toDeepMerge

Deep comparison and fusion are performed on the two incoming data.

**tips:**

- `base` will be deeply copied before merging, so it will not be changed. 😛
- To learn how merging works, visit: [deepmerge-ts](https://github.com/RebeccaStevens/deepmerge-ts).

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`base`|`any`|*The underlying data being compared.*|
|`source`|`any`|*New data merged into the underlying data.*|

**Return**

`T` | `any`

**Example**

```ts
const base = { a: 1, b: 2 };
const source = { a: 3, c: 4 };
toDeepMerge(base, source) // { a: 3, b: 2, c: 4 };

const base1 = { a: [{ b: 3 }], b: { c: [{ d: 1 }, { e: 2 }] }};
const source1 = { a: [{ b: 3, g: 6 }, { c: 4 }], b: { c: [{ d: 3 }, { e: 4 }] }};
toDeepMerge(base1, source1) // { 'a': [{ 'b': 3 }, { 'b': 3, 'g': 6 }, { 'c': 4 }], 'b': { 'c': [{ 'd': 1 }, { 'e': 2 }, { 'd': 3 }, { 'e': 4 }] }};

const base2 = [1, 2, 3, { b: 1 }];
const source2 = [4, 5, 6, { a: 1 }, 7];
toDeepMerge(base2, source2) // [1, 2, 3, { 'b': 1 }, 4, 5, 6, { 'a': 1 }, 7];
```

### toDeepConvertProperty

Formatting properties of the object in the data.

**tips:**

This is a higher-order method that you usually need to use in conjunction with other utility functions. 😛

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`data`|`any`|*The source data (`Array`|`Object`|`Map`).*|
|`transformer`|`Function`|*A callback function used to convert properties.*|

**Return**

`any`

**Example**

```ts
import { camelCase } from 'lodash';

const toDeepCamelCase = (data: any) => toDeepConvertProperty(data, camelCase);

toDeepCamelCase({ 'user_info': { 'user_name': 'name' }}) // { 'userInfo': { 'userName': 'name' }}
```

### toDelay

Wait during an asynchronous function call.

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`delay`|`number`|*The waiting time (The time unit is milliseconds).*|

**Return**

`Promise<void>`

**Example**

```ts
await toDelay(2000) // To waiting 2000 milliseconds ...
```

### toCycle

Create a recurring scheduled task.

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`callback`|`Function`|*A callback function that needs to be called periodically.*|
|`options`|`CycleOptions`|*Configuration options when triggered.*|

*CycleOptions*

```ts
export interface CycleOptions {
  /** The cycle time, default 1000 (The time unit is milliseconds). */
  interval: number;
  /** The callback argument. */
  args?: any[];
}
```

**Return**

`CycleClearHandler` Returns a method that closes timed calls.

*CycleClearHandler*

```ts
export interface CycleClearHandler {
  /** The closes timed calls. */
  close: () => void
}
```

**Example**

```ts
await toCycle(fn, { interval: 1000 }) // The fn function is executed every 2000 milliseconds ...
```

### toRetry

Create a recurring scheduled task.

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`callback`|`Function`|*The callback function to call.*|
|`options`|`RetryOptions`|*Configuration options when triggered.*|

*RetryOptions*

```ts
export interface RetryOptions {
  /** The retry count. */
  count: number;
  /** The waiting time (The time unit is milliseconds). */
  delay: number;
  /** The callback argument.*/
  args?: any[];
}
```

**Return**

`Promise<T>` | `Promise<any>`

**Example**

```ts
await toRetry(fn, { delay: 100, count: 3 }) // The `fn` will wait 100 milliseconds after a failure and then call again three times
```

## Team

|[![ChoGathK](https://github.com/chogathK.png?size=100)](https://github.com/chogathK)|
|:-:|
|[ChoGathK](https://github.com/chogathK)|

## License

Vodyani utils is [MIT licensed](LICENSE).
