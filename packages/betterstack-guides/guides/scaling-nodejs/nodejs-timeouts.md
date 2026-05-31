# A Complete Guide to Timeouts in Node.js

Timeouts are a fundamental mechanism that prevents programs from indefinitely
waiting for operations to complete.

Infinite or overly long timeouts can be detrimental to your application's
performance and reliability. They might seem harmless at first until a
downstream service becomes unresponsive, leading to resource exhaustion and
potential crashes.

Many libraries unfortunately default to high or infinite timeouts to cater to a
wide range of use cases. For example, the Node.js `http.Server` class has an
infinite default inactivity timeout, which is rarely suitable for
production-grade services.

It could also leave your service vulnerable to resource-exhaustion attacks like
[Denial of Service (DoS)](https://en.wikipedia.org/wiki/Denial-of-service_attack)
or
[Event Handler Poisoning](https://davisjam.medium.com/a-sense-of-time-for-javascript-and-node-js-68c9114f5d48).

In this guide, we'll examine how to implement timeouts effectively in your
Node.js applications, covering:

- Setting limits on client interactions.
- Timing out outgoing HTTP requests.
- Applying timeouts to JavaScript promises.
- Strategies for determining appropriate time durations.
- How to handle timeout errors.

Let's get started!

[summary]
### Monitor timeout errors with Better Stack

Timeouts are critical for application reliability, but they're useless if you can't track when they occur. [Better Stack](https://betterstack.com/error-tracking) provides AI-native error tracking that automatically captures and groups timeout errors across your Node.js services—Sentry-compatible at 1/6th the price.

[Start free in minutes](https://betterstack.com/error-tracking)
[/summary]

![Better Stack error tracking dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/91d5b92f-4597-40cd-c51e-5a73c7b2ee00/lg1x =2350x1002)

## Why you need timeouts in Node.js

Node.js is all about handling requests swiftly, whether they come from users or
are sent to external resources. It's a juggling act of asynchronous tasks, and
timeouts are essential to keep everything running smoothly.

Without timeouts, requests could hang indefinitely, bogging down your
application. By setting time limits, you ensure responsiveness and avoid
resource bottlenecks.

### Types of Node.js Timeouts

There are two main categories of timeouts in Node.js:

1. **Incoming request timeouts**: If generating a response for a client takes
   too long, this timeout prevents the server from getting stuck.

2. **Outgoing request timeouts**: This safeguards your Node.js server from being
   held up indefinitely if an external service is slow.

Think of timeouts as a Goldilocks situation: you need a value that's not too
short (causing unnecessary errors) and not too long (making your app
unresponsive). The right timeout depends on what your application is doing and
how fast you need it to be. We'll discuss more about
[choosing the right timeout value](#how-to-choose-a-timeout-value) later on in
this article.

Let's now explore how to implement these timeouts in your Node.js code.

## Incoming HTTP requests timeouts (Server timeouts)

These timeouts are like a deadline for incoming client connections. If a client
takes too long complete a request or receive a response, the connection gets cut
off. This is helpful when dealing with slowpoke clients.

Since such incoming request timeouts are handled at the HTTP server level using
frameworks like Express or Fastify, or directly with the Node.js core HTTP/HTTPS
modules, they are commonly known as **Server timeouts**.

The following timeout settings are exposed in Node.js' `http.Sever` class:

- `server.requestTimeout`: This sets a limit for how long the server should wait
  to receive the entire request (including the body) from the client. It
  defaults to 300 seconds.
- `server.headersTimeout`: This specifically controls the time allowed for
  receiving request headers from the client. It defaults to the minimum between
  `server.requestTimeout` or 60 seconds.
- `server.timeout`: This is used to limit the inactivity period (no data sent or
  received) on an established socket connection. The default is 0, meaning no
  timeout, which can lead to connections hanging around forever.
- `server.keepAliveTimeout`: This controls how long a server holds a connection
  open after responding to a request. It's key for HTTP `Keep-Alive`, which
  allows multiple requests over a single connection, boosting efficiency. It
  defaults to 5 seconds and if no additional request arrives within that time,
  the socket connection closes.

For the `requestTimeout`, `headersTimeout`, and `timeout` options, exceeding the
set value will lead to a
[408 Request Timeout](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408)
response followed by the immediate termination of the connection.

### Dealing with server timeouts

Changing the default server timeouts can be done in different ways depending on
the framework you're using. I'll show to do this in vanilla Node.js, Express,
and Fastify:

#### 1. Vanilla Node.js

Here's how to change the server timeout values in a Node.js program using the
default `http` module:

```javascript
[label http_server.js]
import http from 'node:http';
const server = http.createServer((req, res) => {
  console.log('Got request');

  setTimeout(() => {
    res.end('Hello World!');
  }, 10000);
});

[highlight]
server.requestTimeout = 5000;
server.headersTimeout = 2000;
server.keepAliveTimeout = 3000;
server.timeout = 10000;
[/highlight]

server.listen(3000);
```

For detecting a connection that is timing out due to inactivity (as determined
by `server.timeout`), you can listen for the `timeout` event like this:

```javascript
server.on('timeout', (socket) => {
  console.log('timeout');
  socket.destroy();
});
```

Ensure to call `socket.destroy()` in the callback function so that the
connection is closed. Failure to do this can leave the connection open
indefinitely.

You can also use the `setTimeout()` method to update the `server.timeout` value
and specify the event listener for the `timeout` event as follows:

```javascript
server.setTimeout(10000, (socket) => {
  console.log('timeout');
  socket.destroy();
});
```

#### 2. Express

The above method of setting server timeouts also works with Express servers
since it also exposes the `http.Server` instance:

```javascript
[label express_server.js]
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  console.log('Got request');
  setTimeout(() => res.send('Hello world!'), 10000);
});

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

[highlight]
server.requestTimeout = 5000;
server.headersTimeout = 2000;
server.keepAliveTimeout = 3000;
server.setTimeout(10000, (socket) => {
  console.log('timeout');
  socket.destroy();
});
[/highlight]
```

If you want to override the `server.timeout` value on a particular route, use
the `req.setTimeout()` method as shown below:

```javascript
app.get('/', (req, res) => {
[highlight]
  req.setTimeout(20000);
[/highlight]
  console.log('Got request');
  setTimeout(() => res.send('Hello world!'), 10000);
});
```

This way, requests to the `/` route will timeout after 20 seconds of inactivity
instead of the 10 second default.

#### Fastify

To update server timeouts in Fastify, you can use the following code:

```javascript
import Fastify from 'fastify';

const fastify = Fastify({
  connectionTimeout: 10000, // Corresponds to server.timeout
  keepAliveTimeout: 3000, // Defaults to 72 secomds
  requestTimeout: 5000, // Defaults to no timeout
});

fastify.server.headersTimeout = 2000;
```

Fastify does not expose the `headersTimeout` option in its configuration object
so you have to set it directly through the `fastify.server` interface.

Setting route-level timeouts is currently not possible in Fastify, except
through the use of the
[AbortController API](https://developer.mozilla.org/en-US/docs/Web/API/AbortController):

```javascript
function setTimeoutOnRequest(request, reply, timeoutMs) {
  request.controller = new AbortController();
  request.signal = request.controller.signal;

  reply.raw.setTimeout(timeoutMs, () => {
    request.controller.abort();
    reply.code(408).send(new Error('Request Timedout'));
  });
}

fastify.get('/', async (request, reply) => {
  setTimeoutOnRequest(request, reply, 20000);
  // rest of the handler
});
```

Now that you have a good grasp on how server timeouts work, and how to configure
them in your Node.js framework, let's look at timeouts for outgoing requests
next.

## Outgoing HTTP request timeouts (Client timeouts)

Networks are inherently unpredictable, and external APIs often have performance
hiccups that can severely impact your application if you're not careful. To
prevent your Node.js app from getting caught in the crossfire, always set
timeouts for outgoing HTTP requests to ensure you know the absolute maximum
waiting time.

In this section, we'll cover how to implement timeouts for outgoing requests
through the built-in Fetch API, along with popular libraries like Axios and Got.

### Timing out a Fetch API request

In browsers, the Fetch API usually has a default timeout that varies across
browsers. For instance, Firefox uses 90 seconds, while Chromium uses 300
seconds.

Node.js follows the Chromium default of 300 seconds for `fetch()` requests. If a
request takes longer, you'll get a `HeadersTimeoutError`:

```text
Error creating post: TypeError: fetch failed
    at node:internal/deps/undici/undici:12502:13
    at async file:///home/dami/dev/demo/http-requests/fetch.js:2:20 {
  [cause]: HeadersTimeoutError: Headers Timeout Error
      at Timeout.onParserTimeout [as callback] (node:internal/deps/undici/undici:7569:32)
      at Timeout.onTimeout [as _onTimeout] (node:internal/deps/undici/undici:6659:17)
      at listOnTimeout (node:internal/timers:573:17)
      at process.processTimers (node:internal/timers:514:7) {
    code: 'UND_ERR_HEADERS_TIMEOUT'
  }
}
```

There's no global setting to change this, but you can use
`AbortSignal.timeout()` to set a custom timeout for each request:

```javascript
(async function getDadJoke() {
  try {
    const response = await fetch('https://icanhazdadjoke.com', {
      headers: {
        Accept: 'application/json',
      },
      [highlight]
      signal: AbortSignal.timeout(3000), // 3 seconds
      [/highlight]
    });

    const json = await response.json();
    console.log(json);
  } catch (err) {
    console.error(err);
  }
})();
```

If the timeout is exceeded, an `AbortError` will be thrown:

```text
[output]
AbortError: The operation was aborted
    at abortFetch (node:internal/deps/undici/undici:5623:21)
    at requestObject.signal.addEventListener.once (node:internal/deps/undici/undici:5560:9)
    at [nodejs.internal.kHybridDispatch] (node:internal/event_target:639:20)
    at AbortSignal.dispatchEvent (node:internal/event_target:581:26)
    at abortSignal (node:internal/abort_controller:291:10)
    at AbortController.abort (node:internal/abort_controller:321:5)
    at AbortSignal.abort (node:internal/deps/undici/undici:4958:36)
    at [nodejs.internal.kHybridDispatch] (node:internal/event_target:639:20)
    at AbortSignal.dispatchEvent (node:internal/event_target:581:26)
    at abortSignal (node:internal/abort_controller:291:10) {
  code: 'ABORT_ERR'
}
```

To simplify things, you can create a helper function to set a default timeout
for all your `fetch()` requests, but allow overrides when needed:

```javascript
async function fetchWithTimeout(url, options = {}) {
  const { timeoutMS = 3000 } = options;

  return await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(timeoutMS),
  });
}
```

### Setting timeouts in Axios

The [Axios package](https://www.npmjs.com/package/axios) is a popular choice for
making HTTP requests in Node.js. By default, it doesn't have a timeout, meaning
requests could potentially hang forever. However, it's easy to configure:

```javascript
import axios from 'axios';
axios.defaults.timeout = 5000;
```

Now, all Axios requests will automatically time out after 5 seconds unless you
specify otherwise. You can also override the default value per request in the
`config` object as shown below:

```javascript
const response = await axios.get(
  'https://jsonplaceholder.typicode.com/posts',
  {
    headers: {
      Accept: 'application/json',
    },
    timeout: 2000, // timeout after 2 seconds
  }
);
```

If a timeout occurs, an `ECONNABORTED` error is thrown.

### Setting timeouts in Got

[Got](https://www.npmjs.com/package/got) is another widely used Node.js HTTP
client, but similar to Axios, it doesn't have a default timeout. You need to
define one yourself for each request:

```javascript
import got from 'got';

const data = await got('https://jsonplaceholder.typicode.com/posts', {
  headers: {
    Accept: 'application/json',
  },
  timeout: {
    request: 2000,
  },
}).json();
```

Ensure to check out the
[relevant docs](https://github.com/sindresorhus/got/blob/HEAD/documentation/6-timeout.md)
for more information on timeouts in Got.

With these options, you can easily manage timeouts for outgoing requests to
ensure your Node.js application remains responsive and avoids hanging on slow or
unresponsive requests.

## Applying timeouts to JavaScript Promises

Promises are a great way for handling asynchronous tasks in Node.js. However,
they lack a built-in mechanism to cancel them if they don't resolve within a
specified timeframe.

While most asynchronous operations complete reasonably quickly, there's always
the risk of a promise taking an excessive amount of time, slowing down or even
hanging your application.

Here's an example that simulates a Promise that takes 10 seconds to resolve:

```javascript
import timersPromises from 'node:timers/promises';

function slowOperation() {
  // resolve in 10 seconds
  return timersPromises.setTimeout(10000);
}

(async function doSomethingAsync() {
  try {
    await slowOperation();
    console.log('Completed slow operation');
  } catch (err) {
    console.error('Failed to complete slow operation due to error:', err);
  }
})();
```

Here, `doSomethingAsync()` is at the mercy of `slowOperation()`, waiting a
minimum of 10 seconds to finish. If `slowOperation()` never resolves,
`doSomethingAsync()` will hang indefinitely, which is a recipe for trouble in a
high-performance server environment.

But there's a solution: we can race the slow operation against another promise
that resolves after a fixed time. This allows us to control the maximum waiting
time for `slowOperation()` and prevent our application from getting stuck.

The `Promise.race()` method acts like a competition between promises. You give
it a group of promises, and it returns a new promise that resolves or rejects as
soon as the first promise in the group does. The rest are disregarded.

This clever trick is the key to creating Promise timeouts in Node.js without
relying on external libraries:

```javascript
[label promise-with-timeout.js]
import timersPromises from 'node:timers/promises';

function slowOperation() {
  // resolve in 10 seconds
  return timersPromises.setTimeout(10000);
}

[highlight]
function promiseWithTimeout(promiseArg, timeoutMS) {
  let timer;
  const timeoutPromise = new Promise(
    (resolve, reject) =>
      (timer = setTimeout(
        () => reject(`Timed out after ${timeoutMS} ms.`),
        timeoutMS
      ))
  ).finally(() => clearTimeout(timer));

  return Promise.race([promiseArg, timeoutPromise]);
}
[/highlight]

(async function doSomethingAsync() {
  try {
    [highlight]
    await promiseWithTimeout(slowOperation(), 2000);
    [/highlight]
    console.log('Completed slow operation in 10 seconds');
  } catch (err) {
    console.error('Failed to complete slow operation due to error:', err);
  }
})();
```

The `promiseWithTimeout()` function takes two arguments: a Promise and a timeout
duration in milliseconds. It then creates another Promise that is designed to
reject after the specified timeout. These two promises are raced against each
other using `Promise.race()`, and the result of that race is returned to the
caller.

Here's how it plays out: if the original Promise takes longer than the timeout
duration to resolve, the `timeoutPromise()` will win the race and reject first.
This, in turn, causes `promiseWithTimeout()` to reject, signaling a timeout
error.

In the example with `doSomethingAsync()`, we applied a 2-second timeout to the
`slowOperation()` function, which is known to take 10 seconds. Since the slow
operation can't complete within the 2-second window, the timeout Promise takes
the lead, resulting in a logged error indicating that the operation timed out:

```text
[output]
Failed to complete slow operation due to error: Timed out after 2000 ms.
```

Here's the [TypeScript](https://betterstack.com/community/guides/scaling-nodejs/nodejs-typescript/) implementation of the
`promiseWithTimeout()` function:

```typescript
function promiseWithTimeout<T>(
  promiseArg: Promise<T>,
  timeoutMS: number
): Promise<T> {
  let timeout: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((resolve, reject) => {
    timeout = setTimeout(() => {
      reject(new TimeoutError(`Timed out after ${timeoutMS} ms.`));
    }, timeoutMS);
  });

  return Promise.race([promiseArg, timeoutPromise]).finally(() =>
    clearTimeout(timeout)
  );
}
```

However, there's a catch: even with the timeout, the script keeps running for
the full 10 seconds of the `slowOperation()`, even though it timed out after 2
seconds.

This happens because the `timersPromises.setTimeout()` method used in
`slowOperation()` keeps the Node.js event loop busy until its scheduled
10-second duration is complete. This wastes resources since the result has
already been discarded. Ideally, the scheduled timeout should be canceled as
well.

If you're in control of the function that creates the timeout, you can pass an
`AbortSignal` instance and cancel it in the `finally` block like this:

```javascript
function slowOperation(abortSignal) {
  // resolve in 10 seconds
  [highlight]
  return timersPromises.setTimeout(10000, null, { signal: abortSignal });
  [/highlight]
}

. . .

(async function doSomethingAsync() {
  [highlight]
  const ac = new AbortController();
  [/highlight]
  try {
  [highlight]
    await promiseWithTimeout(slowOperation(ac.signal), 2000);
  [/highlight]
    console.log('Completed slow operation in 10 seconds');
  } catch (err) {
    console.error('Failed to complete slow operation due to error:', err);
  } finally {
  [highlight]
    ac.abort();
  [/highlight]
  }
})();
```

## How to choose timeout values

We've covered how to set timeouts in Node.js, but it's just as crucial to
determine the appropriate timeout value for each situation. Setting it too low
can trigger unnecessary errors, while a value that's too high can make your
application sluggish during slowdowns or outages, and even expose it to attacks.

The arbitrary timeouts we used in this tutorial are just for demonstration
purposes. In a real-world application, you need a more strategic approach. Here
are some things to consider:

- Start by checking the Service Level Agreements (SLAs) provided by the API
  you're integrating with. However, keep in mind that not all services offer
  SLAs, and even if they do, it's wise to approach them with a healthy
  skepticism.

- Use an [API monitoring tool](https://betterstack.com/community/guides/monitoring/what-is-api-monitoring/) to track real-world
  metrics (such as latency) from the APIs you're interacting with. This will
  help you find your 99.9th percentile response times which can be multiplied by
  3 or 4 to get a reasonable baseline timeout.

- If a request affects the user interface, tie the specified timeout to how long
  you're willing to delay the interaction.

- Consider the complexity of the request and performance under high traffic
  conditions. You can conduct [load and stress testing](https://betterstack.com/community/guides/scaling-nodejs/artillery-intro/) to
  validate your timeout settings under realistic conditions.

- Consider implementing mechanisms to adjust timeout values dynamically based on
  real-time performance data.

Remember that there's no one-size-fits-all approach to choosing timeout values.
It's an ongoing process that requires experimentation, monitoring, and
refinement based on your application's requirements and observed behavior.

## Dealing with timeout errors

Your error handling for requests to external services should include code for
distinguishing timeout errors from other kinds of errors. For server timeouts,
you also need to detect when the connection times out, and log the error with
relevant information like the client's IP address, the requested URL, and the
duration of the connection.

This allow you to understand whether the timeouts are happening due to to slow
clients, resource exhaustion, or for other reasons. When such errors are
detected, you have a few options for how to proceed:

### 1. Inform the user

Provide user-friendly error messages explaining that the request timed out
(e.g., "The request took too long to complete") and use the appropriate HTTP
status code (usually 408).

### 2. Implement retry logic

Consider implementing automatic retries when timeouts are encountered for
[idempotent operations](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)
(ideally with
[exponential backoff](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/))
as timeouts are often due to transient network issues. However, ensure to set a
maximum number of retries to prevent infinite loops in case of persistent
failures.

### 3. Rate-limiting

If you suspect malicious actors are causing the timeouts, consider implementing
rate limiting to protect your server from excessive requests.

### 4. Implement the circuit breaker pattern

The
[circuit breaker](https://en.wikipedia.org/wiki/Circuit_breaker_design_pattern)
acts as a protective switch that "trips" open when timeout errors surpass a
certain limit. This temporarily blocks all further requests to the problematic
service, giving it time to recover.

After a set cooldown period, the it enters a "half-open" state, allowing a few
test requests through. If these succeed, the circuit breaker resets to its
"closed" state, restoring normal communication.

### 5. Adjust timeout values based on real-world data

Continuously monitoring timeout errors and response times (amongst other things)
allows you to set up alerts to notify you promptly if they surpass acceptable
levels, and analyze the trends in these errors so you can fine-tune your timeout
values based on real-world performance.


## Tracking timeout errors with Better Stack

Once you've implemented timeouts in your Node.js application, the next crucial step is tracking when they occur and understanding why. [Better Stack](https://betterstack.com/error-tracking) provides AI-native error tracking that automatically captures, groups, and analyzes timeout errors across your Node.js services.

Better Stack works with your existing Sentry SDK or native Node.js instrumentation. Every timeout error is captured with full context: **stack traces, request details, environment variables, and user sessions**. This lets you quickly identify whether timeouts are caused by slow external APIs, resource exhaustion, or malicious clients.

![Better Stack error tracking dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/91d5b92f-4597-40cd-c51e-5a73c7b2ee00/lg1x =2350x1002)

Better Stack automatically monitors timeout error rates and **alerts you when they spike above normal levels**. Set up intelligent alerts in Slack, MS Teams, email, or SMS to get notified immediately when fetch timeouts increase after a deployment or when specific endpoints start timing out. 

You can configure alerts based on error frequency, affected users, or specific timeout types—ensuring you catch issues before they impact your entire user base.

![Better Stack error alerts](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2b17b535-85bf-461e-01c4-8b3c840b9e00/lg2x =1300x650)



## Final thoughts

In this article, we've explored a wide range of techniques for setting timeouts
in various scenarios, from handling incoming requests on the server-side to
managing outgoing requests with different HTTP client libraries.

We also touched on strategies for determining the optimal timeout values for
your use cases and emphasized the importance of continuous monitoring to adjust
selected values based on real-world data.

You are now well-equipped to implement robust timeout mechanisms in your Node.js
applications, ensuring they remain responsive, resilient, and reliable even in
the face of network fluctuations, slow external services, or unexpected errors.

Thanks for reading, and happy coding!
