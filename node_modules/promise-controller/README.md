# promise-controller
[![Build Status](https://travis-ci.org/vitalets/promise-controller.svg?branch=master)](https://travis-ci.org/vitalets/promise-controller)
[![npm](https://img.shields.io/npm/v/promise-controller.svg)](https://www.npmjs.com/package/promise-controller)
[![license](https://img.shields.io/npm/l/promise-controller.svg)](https://www.npmjs.com/package/promise-controller)
<img align="right" src="https://user-images.githubusercontent.com/1473072/31122235-ad06e442-a843-11e7-8c7e-c24149b6eeda.png"/>

Advanced control of JavaScript promises.

## Installation
```bash
npm install promise-controller --save
```

## Usage
```js
import PromiseController from 'promise-controller';

const pc = new PromiseController();
const promise = pc.call(() => startAsyncProcess());
// ...when async process done
pc.resolve('done');
// or
pc.reject();
```

## Use cases

* [Easy access to `resolve` / `reject` callbacks](#easy-access-to-resolve--reject-callbacks)
* [Re-use of existing promise while operation is pending](#re-use-of-existing-promise-while-operation-is-pending)
* [Automatically reject after timeout](#automatically-reject-after-timeout)

### Easy access to `resolve` / `reject` callbacks
With bare Promise:
```js
let resolve, reject;

const asyncOperation = setTimeout(() => Math.random() > 0.5 ? resolve() : reject(), 100);

const promise = new Promise((_resolve, _reject) => {
   resolve = _resolve;
   reject = _reject;
   asyncOperation();
});
```

With PromiseController:
```js
const pc = new PromiseController();

const asyncOperation = setTimeout(() => Math.random() > 0.5 ? pc.resolve() : pc.reject(), 100);

const promise = pc.call(asyncOperation);
```

### Re-use of existing promise while operation is pending
With bare Promise:
```js
let promise = null;

function connectToDb() {
    if (!promise) {
        promise = mongoClient.open();
    }

    return promise;
}
```

With PromiseController:
```js
const pc = new PromiseController();

function connectToDb() {
    return pc.promise || pc.call(() => mongoClient.open());
}
```

### Automatically reject after timeout
With bare Promise:
```js
let resolve, timer;

const asyncOperation = setTimeout(() => {
    resolve();
    clearTimeout(timer);
}, 100);

const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    asyncOperation();
    timer = setTimeout(() => _reject(), 50);
});
```

With PromiseController:
```js
const pc = new PromiseController({
  timeout: 50
});

const asyncOperation = setTimeout(() => resolve(), 100);

const promise = pc.call(asyncOperation);
```

## API

### Classes

<dl>
<dt><a href="#PromiseController">PromiseController</a></dt>
<dd></dd>
</dl>

### Typedefs

<dl>
<dt><a href="#Options">Options</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="PromiseController"></a>

### PromiseController
**Kind**: global class  

* [PromiseController](#PromiseController)
    * [new PromiseController([options])](#new_PromiseController_new)
    * _instance_
        * [.promise](#PromiseController+promise) ⇒ <code>Promise</code>
        * [.value](#PromiseController+value) ⇒ <code>\*</code>
        * [.isPending](#PromiseController+isPending) ⇒ <code>Boolean</code>
        * [.isFulfilled](#PromiseController+isFulfilled) ⇒ <code>Boolean</code>
        * [.isRejected](#PromiseController+isRejected) ⇒ <code>Boolean</code>
        * [.isSettled](#PromiseController+isSettled) ⇒ <code>Boolean</code>
        * [.call([fn])](#PromiseController+call) ⇒ <code>Promise</code>
        * [.resolve([value])](#PromiseController+resolve)
        * [.reject([value])](#PromiseController+reject)
        * [.reset()](#PromiseController+reset)
        * [.configure(options)](#PromiseController+configure)
    * _static_
        * [.TimeoutError](#PromiseController.TimeoutError) : [<code>TimeoutError</code>](#PromiseController.TimeoutError)
        * [.ResetError](#PromiseController.ResetError) : [<code>ResetError</code>](#PromiseController.ResetError)

<a name="new_PromiseController_new"></a>

#### new PromiseController([options])
Creates promise controller. Unlike original Promise, it does not immediately call any function.
Instead it has [.call()](#PromiseController+call) method that calls provided function
and stores `resolve / reject` methods for future access.


| Param | Type |
| --- | --- |
| [options] | [<code>Options</code>](#Options) | 

<a name="PromiseController+promise"></a>

#### pc.promise ⇒ <code>Promise</code>
Returns promise itself.

**Kind**: instance property of [<code>PromiseController</code>](#PromiseController)  
<a name="PromiseController+value"></a>

#### pc.value ⇒ <code>\*</code>
Returns value with that promise was settled (fulfilled or rejected).

**Kind**: instance property of [<code>PromiseController</code>](#PromiseController)  
<a name="PromiseController+isPending"></a>

#### pc.isPending ⇒ <code>Boolean</code>
Returns true if promise is pending.

**Kind**: instance property of [<code>PromiseController</code>](#PromiseController)  
<a name="PromiseController+isFulfilled"></a>

#### pc.isFulfilled ⇒ <code>Boolean</code>
Returns true if promise is fulfilled.

**Kind**: instance property of [<code>PromiseController</code>](#PromiseController)  
<a name="PromiseController+isRejected"></a>

#### pc.isRejected ⇒ <code>Boolean</code>
Returns true if promise rejected.

**Kind**: instance property of [<code>PromiseController</code>](#PromiseController)  
<a name="PromiseController+isSettled"></a>

#### pc.isSettled ⇒ <code>Boolean</code>
Returns true if promise is fulfilled or rejected.

**Kind**: instance property of [<code>PromiseController</code>](#PromiseController)  
<a name="PromiseController+call"></a>

#### pc.call([fn]) ⇒ <code>Promise</code>
Calls `fn` and returns promise OR just returns existing promise from previous `call()` if it is still pending.
To fulfill returned promise you should use
[resolve](#PromiseController+resolve) / [reject](#PromiseController+reject) methods.
If `fn` itself returns promise, then external promise is attached to it and fulfills together.
If no `fn` passed - promiseController is initialized as well.

**Kind**: instance method of [<code>PromiseController</code>](#PromiseController)  

| Param | Type | Description |
| --- | --- | --- |
| [fn] | <code>function</code> | function to be called. |

<a name="PromiseController+resolve"></a>

#### pc.resolve([value])
Resolves pending promise with specified `value`.

**Kind**: instance method of [<code>PromiseController</code>](#PromiseController)  

| Param | Type |
| --- | --- |
| [value] | <code>\*</code> | 

<a name="PromiseController+reject"></a>

#### pc.reject([value])
Rejects pending promise with specified `value`.

**Kind**: instance method of [<code>PromiseController</code>](#PromiseController)  

| Param | Type |
| --- | --- |
| [value] | <code>\*</code> | 

<a name="PromiseController+reset"></a>

#### pc.reset()
Resets to initial state.
If promise is pending it will be rejected with [ResetError](#PromiseController.ResetError).

**Kind**: instance method of [<code>PromiseController</code>](#PromiseController)  
<a name="PromiseController+configure"></a>

#### pc.configure(options)
Re-assign one or more options.

**Kind**: instance method of [<code>PromiseController</code>](#PromiseController)  

| Param | Type |
| --- | --- |
| options | [<code>Options</code>](#Options) | 

<a name="PromiseController.TimeoutError"></a>

#### PromiseController.TimeoutError : [<code>TimeoutError</code>](#PromiseController.TimeoutError)
Error for rejection in case of timeout.

**Kind**: static property of [<code>PromiseController</code>](#PromiseController)  
<a name="PromiseController.ResetError"></a>

#### PromiseController.ResetError : [<code>ResetError</code>](#PromiseController.ResetError)
Error for rejection in case of call `.reset()` while promise is pending.

**Kind**: static property of [<code>PromiseController</code>](#PromiseController)  
<a name="Options"></a>

### Options : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [timeout] | <code>Number</code> | <code>0</code> | Timeout in ms after that promise will be rejected automatically. |
| [timeoutReason] | <code>String</code> \| <code>function</code> |  | Rejection reason for timeout. Promise will be rejected with [TimeoutError](#PromiseController.TimeoutError) and this message. The message can contain placeholder `{timeout}` for actual timeout value. If timeoutReason is a function, it will be evaluated and returned value will be used as message. |
| [resetReason] | <code>String</code> \| <code>function</code> |  | Rejection reason used when `.reset()` is called while promise is pending. Promise will be rejected with [ResetError](#PromiseController.ResetError) and this message. If resetReason is a function, it will be evaluated and returned value will be used as message. |

## Related projects
* [event-to-promise](https://github.com/JsCommunity/event-to-promise)
* [promise-events](https://github.com/yanickrochon/promise-events)

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)
