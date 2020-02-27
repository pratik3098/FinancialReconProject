[![npm version](https://badge.fury.io/js/async-counter.svg)](https://www.npmjs.com/package/async-counter)
[![Build Status](https://api.travis-ci.org/assister-ai/async-counter.svg?branch=master)](https://travis-ci.org/assister-ai/async-counter)

# async-counter

An asynchronous counter with a sync interface

### Install

```sh
npm i --save async-counter
```

### Usage

```js
import asyncCounter from 'async-counter';

const counter = asyncCounter(2);

// Inside an async block
const logWhenFinished = async () => console.log(`Finished counting to ${await counter}!`);

// Somewhere else, async code
setTimeout(() => counter.count(), 500);
setTimeout(() => counter.count(), 1000);
// `counter` resolves the second time `counter.count` is called

logWhenFinished();
// Output after a second:
// Finished counting to 2!
```

### API

```js
const counter = asyncCounter(3, {
  onFinished: max => console.log(`Finished counting to ${max}!`),
  onCount: ({payload, max, current}) => console.log(`${payload.date.toString()}: ${current} of ${max} times`)
});

for (let i = 0; i < 3; i++) {
  setTimeout(() => counter.count({date: new Date()}), i * 1000);
}
// Output:
// Wed Feb 27 2019 04:40:05 GMT-0500 (Eastern Standard Time): 1 of 3 times
// Wed Feb 27 2019 04:40:06 GMT-0500 (Eastern Standard Time): 2 of 3 times
// Wed Feb 27 2019 04:40:07 GMT-0500 (Eastern Standard Time): 3 of 3 times
// Finished counting to 3!
```

### License
[MIT](https://github.com/assister-ai/async-counter/blob/master/LICENSE)
