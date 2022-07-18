# Vodyani utils

😁 Provides common utility functions used in server-side development.

[![Npm](https://img.shields.io/npm/v/@vodyani/utils/latest.svg)](https://www.npmjs.com/package/@vodyani/utils)
[![Npm](https://img.shields.io/npm/v/@vodyani/utils/beta.svg)](https://www.npmjs.com/package/@vodyani/utils)
[![Npm](https://img.shields.io/npm/dm/@vodyani/utils)](https://www.npmjs.com/package/@vodyani/utils)
[![License](https://img.shields.io/github/license/vodyani/utils)](LICENSE)
<br>
![Workflow](https://github.com/vodyani/utils/actions/workflows/release.yml/badge.svg)
[![codecov](https://codecov.io/gh/vodyani/utils/branch/master/graph/badge.svg?token=CI3WEJUN6L)](https://codecov.io/gh/vodyani/utils)

## Installation

```sh
npm install @vodyani/utils
```

## Usage

|Features|Type|Description|
|:-:|:-:|:-:|
|[isDictionary](#isdictionary)|object|Checks whether the current object is a dictionary object.|
|[isKeyof](#iskeyof)|object|Determines whether the object contains the current attribute.|
|[toMatch](#tomatch)|object|Walks deeply through the object and returns the property value corresponding to the specified parameter.|
|[toRestore](#torestore)|object|Restores to the corresponding object based on the depth of the specified property and property value.|
|[toBuffer](#tobuffer)|stream|Convert Stream data to buffer.|
|[toStream](#tostream)|stream|Convert Buffer data to stream.|
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

**return**

`boolean`

**example**
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

**param**

|param|type|description|
|:-:|:-:|:-:|
|`obj`|`object`|*The object to judge.*|
|`key`|`string`/`number`/`symbol`|*The property of object.*|

**return**

`boolean`

**example**

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

### toMatch

Walks deeply through the object and returns the property value corresponding to the specified parameter.

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`obj`|`any`|*The object to judge.*|
|`token`|`string`|*The properties of the object and splice them with `rule`.*|
|`rule`|`string`|*The rules for splicing, by default, are `.`*|

**return**

`T` | `any`

**example**

```ts
toMatch({ job: { name: 'job' }}, 'job.name') // 'job'
toMatch({ cat: { info: { name: 'mimi' } }}, 'cat.info.name') // 'mimi'
```

### toRestore

Restores to the corresponding object based on the depth of the specified property and property value.

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`value`|`any`|*The object properties value.*|
|`token`|`string`|*The properties of the object and splice them with `rule`.*|
|`rule`|`string`|*The rules for splicing, by default, are `.`*|

**return**

`T` | `any`

**example**

```ts
toRestore('job', 'job.name') // { job: { name: 'job' }}
toRestore('mimi', 'cat.info.name') // { cat: { info: { name: 'mimi' } }
```

### toBuffer

Convert Stream data to buffer.

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`stream`|`Stream`|*The stream data.*|

**return**

`Promise<Buffer>`

**example**

```ts
await toBuffer(data) // => stream data
```

### toStream

Convert Buffer data to stream.

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`buffer`|`Buffer`|*The buffer data.*|
|`encoding`|`ascii`/`utf8`/`utf-8`/`utf16le`/`ucs2`/`ucs-2`/`base64`/`base64url`/`latin1`/`binary`/`hex`|*The encoding type.*|

**return**

`Promise<Duplex>`

**example**

```ts
await toStream(data) // => buffer data
```

### toDelay

Wait during an asynchronous function call.

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`delay`|`number`|*The waiting time (The time unit is milliseconds).*|

**return**

`Promise<void>`

**example**

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

**return**

`CycleClearHandler` Returns a method that closes timed calls.

*CycleClearHandler*

```ts
export interface CycleClearHandler {
  /** The closes timed calls. */
  close: () => void
}
```

**example**

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

**return**

`Promise<T>` | `Promise<any>`

**example**

```ts
await toRetry(fn, { delay: 100, count: 3 }) // The `fn` will wait 100 milliseconds after a failure and then call again three times
```

## Team

|[![ChoGathK](https://github.com/chogathK.png?size=100)](https://github.com/chogathK)|
|:-:|
|[ChoGathK](https://github.com/chogathK)|

## License

Vodyani utils is [MIT licensed](LICENSE).
