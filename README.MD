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
|[isDict](#isdict)|object|Checks whether the current object is a dictionary object.|
|[isKeyof](#iskeyof)|object|Determines whether the object contains the current attribute.|
|[toMatch](#tomatch)|object|Walks deeply through the object and returns the property value corresponding to the specified parameter.|
|[toRestore](#torestore)|object|Restores to the corresponding object based on the depth of the specified property and property value.|
|[toBuffer](#tobuffer)|stream|Convert Stream data to buffer.|
|[toStream](#tostream)|stream|Convert Buffer data to stream.|
|[toDelay](#todelay)|promise|Wait during an asynchronous function call.|
|[toCycle](#tocycle)|promise|Create a recurring scheduled task.|
|[toRetry](#toretry)|promise|Create a caller that can retry the callback function.|

### isDict

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`dict`|`any`|*The object to judge.*|

**return**

`boolean`

**example**
```ts
isDict({}) // true
isDict({ name: 'dict' }) // true
isDict(new String()) // false
isDict(new Number()) // false
isDict(new Boolean()) // false
isDict(new Map()) // false
isDict(new Set()) // false
isDict(new Array()) // false
isDict(Buffer.from([])) // false
isDict(new Stream()) // false
isDict(null) // false
isDict(undefined) // false
```

### isKeyof

**param**

|param|type|description|
|:-:|:-:|:-:|
|`obj`|`object`|*The object to judge.*|
|`key`|`string`/`number`/`symbol`|*The property of object.*|

**return**

`is keyof typeof obj`

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
### toRestore
### toBuffer
### toStream
### toDelay
### toCycle
### toRetry

## Team

|[![ChoGathK](https://github.com/chogathK.png?size=100)](https://github.com/chogathK)|
|:-:|
|[ChoGathK](https://github.com/chogathK)|

## License

Vodyani utils is [MIT licensed](LICENSE).
