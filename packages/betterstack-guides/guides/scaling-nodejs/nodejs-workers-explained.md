# Node.js Multithreading: A Beginner's Guide to Worker Threads

Node.js is not traditionally favored for CPU-heavy operations due to its
architecture, which is optimized for I/O-bound activities—a staple for the
majority of web servers.

This efficiency in managing I/O operations, however, translates to less optimal
performance for tasks requiring extensive CPU usage, presenting a classic
example of a software trade-off.

Despite this, Node.js has evolved to accommodate CPU-intensive tasks better than
in its early days. Today, it's now possible to execute such tasks on Node.js
with a level of performance that might be deemed acceptable for certain
applications.

In this article, we'll delve into the following topics:

- Understanding what CPU-bound tasks entail,
- Why Node.js struggles with CPU-intensive operations,
- Enhance Node.js' capability to execute CPU-bound tasks efficiently through
  [worker threads](https://nodejs.org/api/worker_threads.html).

Let's dive in!

## Prerequisites

To follow along effectively with this guide, ensure that your computer has a
minimum of two CPUs. It's also important to have a recent version of Node.js
version installed on your computer, preferably the
[latest LTS](https://nodejs.org/en/download).

To check how many CPUs your system has, run the command below:

```command
nproc
```

```text
[output]
2
```

Note that sections focusing on optimizing CPU-intensive operations through a
worker pool will achieve the best results on systems equipped with four or more
CPUs.

## Setting up the demo project

To demonstrate the concepts that will be introduced in this article, I've
prepared a simple Express app featuring a single non-blocking endpoint, which
you'll further develop in the upcoming sections by integrating CPU-bound tasks
and later offloading them to worker threads.

Start by cloning the project repository with the following command:

```command
git clone https://github.com/betterstack-community/worker-threads-demo.git
```

After cloning, move into the project directory:

```command
cd worker-threads-demo
```

Next, install the necessary dependencies, which includes
[Express](https://expressjs.com/) for the web server,
[nodemon](https://nodemon.io/) to automatically restart the server on file
changes, and [autocannon](https://www.npmjs.com/package/autocannon) for running
basic load tests on the server:

```command
npm install
```

The `index.js` file in the repository sets up a simple Express server as shown
below:

```javascript
[label index.js]
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/non-blocking', (req, res) => {
  res.send('This is a non-blocking endpoint');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

This code snippet establishes an Express server with a single endpoint that
outputs a specific message when accessed.

To run the development server, execute:

```command
npm start
```

```text
[output]
> worker-threads-demo@1.0.0 start
> nodemon index.js

[nodemon] 3.1.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node index.js`
Server running on port 3000
```

In a separate terminal window, test the endpoint using:

```command
curl http://localhost:3000/non-blocking
```

You should see the following response from the server:

```text
[output]
This is a non-blocking endpoint
```

![Starting and testing the server](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0b98537d-cd34-4b62-cfea-3a804110cb00/lg2x =2534x1764)

You can terminate the server at any time by pressing `CTRL+C` in your terminal
window.

You are now all set up to explore worker threads, but before diving in, let's
explore the distinction between between I/O and CPU-bound tasks in a Node.js
context next.

## Understanding I/O-bound and CPU-bound tasks in Node.js

<!-- TODO: Create a visualization -->

In computer programming, tasks are broadly categorized into two: I/O-bound and
CPU-bound.

I/O-bound tasks are those where the execution speed primarily hinges on the I/O
subsystem. This includes operations like reading from and writing to disks,
network communications, and database interactions.

The critical factor in these tasks is not the speed at which the program can
process data, but how swiftly it can perform input or output operations with
other systems or devices.

Common examples of I/O-bound activities include database queries, file transfers
over a network, and disk I/O operations. The primary delay in these tasks comes
from the time required to complete the external operations, not from the
processing capabilities of the CPU.

Node.js handles I/O-bound tasks efficiently through asynchronous operations,
utilizing the capabilities of the underlying operating system. For instance, the
`fs.readFile()` method, which reads data from a file, demonstrates this
approach:

```javascript
const fs = require("node:fs");
fs.readFile("/file.txt", (err, data) => {
  if (err) throw err;
});
```

In this scenario, Node.js delegates the file reading task to the operating
system and registers the callback function in the event queue. As this process
unfolds asynchronously, the rest of the program continues to execute
uninterrupted.

Once the operation is completed, the operating system relays the data back to
Node.js, which then executes the registered callback function argument to
`readFile()`, passing along the received data.

This mechanism ensures that I/O-bound tasks do not obstruct the main execution
thread, thus classifying them as non-blocking operations.

On the other hand, CPU-bound tasks are those that are limited by the speed of
the CPU. This includes operations such as complex calculations, data analysis,
cryptography, image or video encoding, machine learning model training, and
more.

In these scenarios, the main limitation of each task is the processing power of
the CPU, as they require significant compute resources to execute the series of
instructions.

A basic example of a CPU-bound task could be a loop executing a large number of
iterations:

```javascript
let iterationCount = 0;
for (let i = 0; i < 300000; i++) {
  iterationCount++;
}
```

CPU-bound rely heavily on Node.js's single JavaScript execution thread. Even
attempting to encapsulate these tasks within a promise doesn't alleviate this
inherent characteristic, as their execution monopolizes the main thread.

As a result, when such a task is in progress, it commandeers the thread, and
puts the entire application on hold, making it unable to process further
instructions or handle any requests. These tasks are thus recognized as
[blocking](https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking#blocking).

Now that you understand the distinction between I/O and CPU-bound tasks, let's
proceed to the next section where you'll create and test a CPU-bound task to
demonstrate its impact on Node.js performance.

## Creating and testing a CPU-bound task

To demonstrate the impact of CPU-intensive operations on the performance and
responsiveness of a Node.js application, you will modify the demo project by
adding a route that computes
[the Fibonacci sequence](https://en.wikipedia.org/wiki/Fibonacci_number) through
a recursive algorithm.

This is a sequence of numbers beginning with 0 and 1 where each subsequent
number is the sum of the two preceding ones. The first 10 numbers in the
sequence are 0, 1, 1, 2, 3, 5, 8, 13, 21, and 34, and it continues indefinitely.

For this exploration, you'll implement a function which takes an integer and
returns the nth Fibonacci number using a recursive algorithm chosen for its
simplicity and the computing load it places on the CPU.

To begin, open the `index.js` file and add the highlighted code below:

```javascript
[label index.js]
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

[highlight]
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

app.get('/fibonacci/:n', (req, res) => {
  const n = parseInt(req.params.n);
  if (isNaN(n) || n < 0) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }

  const result = fibonacci(n);
  res.json({ fibonacci: result });
});
[/highlight]

app.get('/non-blocking', (req, res) => {
  res.send('This is a non-blocking endpoint');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

The `fibonacci()` function above calculates the nth term of the Fibonacci
sequence, returning `n` directly for values less than or equal to 1, or
calculating the sum of the two preceding numbers for larger n.

While more
[efficient algorithms exist](https://www.nayuki.io/page/fast-fibonacci-algorithms),
this version effectively demonstrates the impact of CPU-intensive tasks on
Node.js' event loop.

Once you've saved the file, ensure the server is still running, then return to
terminal and execute the command below to find the 35th Fibonacci sequence and
how long it takes to compute the result:

```command
time curl http://localhost:3000/fibonacci/35
```

On my machine, the computation took about 83 milliseconds to complete:

```text
[output]
{"fibonacci":9227465}
real    0m0.083s
user    0m0.001s
sys     0m0.003s
```

It's also useful to set a baseline for how many requests can be processed by the
`/fibonacci` handler by running a load test as follows:

```command
npx autocannon --renderStatusCodes http://localhost:3000/fibonacci/35
```

```text
[output]
Running 10s test @ http://localhost:3000/fibonacci/35
10 connections


┌─────────┬────────┬─────────┬─────────┬─────────┬────────────┬───────────┬─────────┐
│ Stat    │ 2.5%   │ 50%     │ 97.5%   │ 99%     │ Avg        │ Stdev     │ Max     │
├─────────┼────────┼─────────┼─────────┼─────────┼────────────┼───────────┼─────────┤
│ Latency │ 276 ms │ 1226 ms │ 2430 ms │ 2593 ms │ 1257.22 ms │ 347.73 ms │ 2593 ms │
└─────────┴────────┴─────────┴─────────┴─────────┴────────────┴───────────┴─────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬───────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────┼─────────┤
│ Req/Sec   │ 7       │ 7       │ 7       │ 8       │ 7.4     │ 0.49  │ 7       │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────┼─────────┤
│ Bytes/Sec │ 1.79 kB │ 1.79 kB │ 1.79 kB │ 2.05 kB │ 1.89 kB │ 126 B │ 1.79 kB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴───────┴─────────┘
┌──────┬───────┐
│ Code │ Count │
├──────┼───────┤
│ 200  │ 74    │
└──────┴───────┘

Req/Bytes counts sampled once per second.
# of samples: 10

84 requests in 10.03s, 18.9 kB read
```

Here, the server was able to successfully process 74 requests for the 35th
Fibonacci number in 10 seconds.

Before rounding off this section, run a load test on the `/non-blocking`
endpoint as follows:

```command
npx autocannon --renderStatusCodes http://localhost:3000/non-blocking
```

On my test machine, the server processed around 81,000 requests in 11 seconds,
averaging about 7,300 requests per second, indicating good performance for
non-blocking operations:

```text
[output]
Running 10s test @ http://localhost:3000/non-blocking
10 connections

┌─────────┬──────┬──────┬───────┬──────┬─────────┬─────────┬───────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max   │
├─────────┼──────┼──────┼───────┼──────┼─────────┼─────────┼───────┤
│ Latency │ 1 ms │ 1 ms │ 2 ms  │ 2 ms │ 1.05 ms │ 0.28 ms │ 11 ms │
└─────────┴──────┴──────┴───────┴──────┴─────────┴─────────┴───────┘
┌───────────┬────────┬────────┬─────────┬─────────┬──────────┬─────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%     │ 97.5%   │ Avg      │ Stdev   │ Min    │
├───────────┼────────┼────────┼─────────┼─────────┼──────────┼─────────┼────────┤
│ Req/Sec   │ 6,963  │ 6,963  │ 7,411   │ 7,763   │ 7,365.28 │ 280.04  │ 6,961  │
├───────────┼────────┼────────┼─────────┼─────────┼──────────┼─────────┼────────┤
│ Bytes/Sec │ 1.8 MB │ 1.8 MB │ 1.92 MB │ 2.01 MB │ 1.91 MB  │ 72.7 kB │ 1.8 MB │
└───────────┴────────┴────────┴─────────┴─────────┴──────────┴─────────┴────────┘
┌──────┬───────┐
│ Code │ Count │
├──────┼───────┤
│ 200  │ 81019 │
└──────┴───────┘

Req/Bytes counts sampled once per second.
# of samples: 11

81k requests in 11.02s, 21 MB read
```

Do keep these numbers in mind as we'll refer back to them in subsequent sections
of this tutorial.

## Understanding the impact of CPU-bound tasks on Node.js performance

To illustrate the effect of CPU-bound tasks on the server's performance,
initiate a request to compute a high-order Fibonacci number, such as the 100th
term, with:

```command
curl http://localhost:3000/fibonacci/100
```

This request will take a ridiculously long time to complete due to the
inefficient recursive algorithm in use. More importantly, it will completely
block the event loop, leading to a total loss of functionality.

While the computation is ongoing, repeat the load test to the `/non-blocking`
endpoint in a new terminal. You'll notice a dramatic performance drop, with the
server unable to handle additional requests during the Fibonacci computation:

```command
npx autocannon --renderStatusCodes http://localhost:3000/non-blocking
```

```text
[output]
Running 10s test @ http://localhost:3000/non-blocking
10 connections


┌─────────┬──────┬──────┬───────┬──────┬──────┬───────┬──────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg  │ Stdev │ Max  │
├─────────┼──────┼──────┼───────┼──────┼──────┼───────┼──────┤
│ Latency │ 0 ms │ 0 ms │ 0 ms  │ 0 ms │ 0 ms │ 0 ms  │ 0 ms │
└─────────┴──────┴──────┴───────┴──────┴──────┴───────┴──────┘
┌───────────┬─────┬──────┬─────┬───────┬─────┬───────┬─────┐
│ Stat      │ 1%  │ 2.5% │ 50% │ 97.5% │ Avg │ Stdev │ Min │
├───────────┼─────┼──────┼─────┼───────┼─────┼───────┼─────┤
│ Req/Sec   │ 0   │ 0    │ 0   │ 0     │ 0   │ 0     │ 0   │
├───────────┼─────┼──────┼─────┼───────┼─────┼───────┼─────┤
│ Bytes/Sec │ 0 B │ 0 B  │ 0 B │ 0 B   │ 0 B │ 0 B   │ 0 B │
└───────────┴─────┴──────┴─────┴───────┴─────┴───────┴─────┘
┌──────┬───────┐
│ Code │ Count │
└──────┴───────┘

Req/Bytes counts sampled once per second.
# of samples: 10

20 requests in 10.03s, 0 B read
10 errors (10 timeouts)
```

This exemplifies how a single CPU-intensive task can monopolize Node.js's
thread, blocking the event loop and preventing the server from processing other
tasks.

We've gone from processing ~7.3k requests per second to 0 requests due to the
event loop being blocked.

This is why it is often said that Node.js isn't a great choice for CPU-bound
tasks. However, there are solutions to mitigate this problem, and this is what
we'll explore in the next section.

You can halt the request to compute the 100th Fibonacci number with `Ctrl+C`
before proceeding.

## A brief overview of Node.js workers

Node.js provides a `Worker` class, introduced in version 10.5.0, that enables
the creation of separate JavaScript execution contexts. Each worker operates on
its own V8 engine and event loop, potentially running tasks in parallel on
different CPU cores.

Unlike traditional thread models, Node.js worker threads communicate via message
passing rather than shared memory, avoiding common concurrency pitfalls like
deadlocks and race conditions. This design emphasizes thread safety and the
independent execution of tasks.

To instantiate a worker thread, you can utilize the `Worker` constructor from
the [worker_threads module](https://nodejs.org/api/worker_threads.html):

```javascript
import { Worker } from 'node:worker_threads';

const worker = new Worker('/path/to/worker-script.js');
```

The constructor takes the path to a script file that the worker will execute,
allowing CPU-heavy tasks to be offloaded from the main thread. This ensures the
main event loop remains unblocked, maintaining server performance.

For instance, computing the nth Fibonacci number can be delegated to a worker
thread, with the result relayed back to the main thread. This keeps the event
loop free to handle other tasks, improving overall application responsiveness.

In the next section, you will employ worker threads to address the previously
observed performance challenges caused by CPU-intensive operations in Node.js.

## Executing CPU-bound tasks in a worker thread

To avoid blocking the event loop with the Fibonacci sequence computation, you
can offload the task to a separate thread using Node.js worker threads. This
method allows the server to keep processing other requests seamlessly, even
during lengthy computations.

Start by moving the `fibonacci()` function from your `index.js` file to a newly
created `workers.js` file in the root directory of your project:

```javascript
[label worker.js]
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

Afterward, incorporate the following code to calculate the requested Fibonacci
number and relay the outcome to the parent thread:

```javascript
[label worker.js]
[highlight]
import { parentPort, workerData } from 'worker_threads';
[/highlight]

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

[highlight]
const result = fibonacci(workerData);
parentPort.postMessage(result);
[/highlight]
```

In the `worker.js` file, the first line imports two variables from the
`worker_threads` module:

- `parentPort` represents a communication channel with the main/parent thread,
  allowing the worker thread to send messages back to the parent thread.
- `workerData` is the data passed to the worker thread during its initialization
  in the parent thread. In this case, it will be the Fibonacci number to be
  computed.

Next, adjust your index.js file to spawn a new worker thread for each Fibonacci
request:

```javascript
[label index.js]
import express from 'express';
[highlight]
import { Worker } from 'node:worker_threads';
[highlight]

. . .

app.get('/fibonacci/:n', (req, res) => {
  const n = parseInt(req.params.n);
  if (isNaN(n) || n < 0) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

[highlight]
  const worker = new Worker('./worker.js', { workerData: n });

  worker.on('message', (result) => {
    res.json({ fibonacci: result });
  });

  worker.on('error', (error) => {
    console.error('Worker error:', error);
    res.status(500).json({ error: 'Internal server error' });
  });
[/highlight]
});
```

Each time a request is made to the `/fibonacci` route, a new worker thread is
created and the number received is made accessible through the `workerData`
variable. Two callbacks are subsequently registered on the worker: one to
process messages (computation results), and the other to handle errors.

With this setup in place, the Fibonacci computation is handled in a separate
thread and the result is only then received and forwarded to the client through
the registered callback function.

You can observe this by repeating the calculation for the 35th Fibonacci number
using the command below:

```command
time curl http://localhost:3000/fibonacci/35
```

The following output will be observed:

```json
[output]
{"fibonacci":9227465}
real    0m0.123s
user    0m0.001s
sys     0m0.003s
```

Notice that it actually takes longer to compute the result compared to our
earlier run (123ms vs 83ms). This is due to the overhead of creating a worker
thread since a separate instance of the V8 engine needs to be spawned and before
the program can be executed.

However, when you repeat the load test to the `/fibonacci` route, you should
observer a higher throughput rate:

```command
npx autocannon --renderStatusCodes http://localhost:3000/fibonacci/35
```

The server is now able to handle 442 requests in 10 seconds compared to just 74
in the previous run:

```text
[output]
. . .
┌──────┬───────┐
│ Code │ Count │
├──────┼───────┤
│ 200  │ 442   │
└──────┴───────┘

Req/Bytes counts sampled once per second.
# of samples: 10

452 requests in 10.02s, 113 kB read
```

This is because, when you create a worker thread in Node.js, the operating
system's scheduler determines how and where threads are executed, including the
assignment of threads to different CPU cores.

Modern operating systems with multi-core processors usually distribute these
threads across multiple cores to run in parallel which leads to more efficient
CPU utilization and better performance.

Note that the actual execution of threads on different cores depends on several
factors, including the operating system's scheduling policies, the number of
available cores, and the current load on each core.

The `worker_threads` module only provides the framework for parallel execution,
but the underlying system architecture and OS scheduler is what determines how
worker threads are allocated to CPU cores.

Another significant gain of offloading each Fibonacci computation to a worker
thread is that it prevents the event loop from being blocked so that the main
thread can continue to process other requests simultaneously.

Let's demonstrate this by repeating the earlier scenario where the 100th
Fibonacci number was being calculated:

```command
curl http://localhost:3000/fibonacci/100
```

While the command is running, run a load test to the `/non-blocking` endpoint
once again:

```command
npx autocannon --renderStatusCodes http://localhost:3000/non-blocking
```

```text
[output]
. . .
┌──────┬───────┐
│ Code │ Count │
├──────┼───────┤
│ 200  │ 80872 │
└──────┴───────┘

Req/Bytes counts sampled once per second.
# of samples: 11

81k requests in 11.02s, 20.9 MB read
```

Since the main thread is no longer blocked by the Fibonacci computation, the
server is able to continue processing other requests leading to a marked
improvement in performance. On my test machine, I observed roughly the same
level of performance as the baseline, but you may see slightly lower or higher
values.

In the next section, we will discuss using a worker thread pool to improve the
efficiency of deploying worker threads for CPU-intensive tasks.

## Exploring the worker pool pattern

<!-- TODO: show visualization of thrad pool pattern -->

As previously noted, initiating a new worker thread creates a separate instance
of the V8 JavaScript engine along with associated resources. Consequently,
excessive use of worker threads can lead to significant resource consumption on
your system, potentially negating the benefits of utilizing worker threads
altogether.

For CPU-bound tasks, having more worker threads than available CPUs can lead to
context switching overhead, reducing efficiency. When threads compete for CPU
time, the operating system must switch between them, which can lead to increased
CPU usage and reduced performance for computationally intensive tasks.

The optimal number of threads for maximizing performance is often related to the
number of available CPUs, although the best ratio can vary based on the
workload.

A good rule of thumb is to spawn a maximum of one less than available CPUs. So
if your machine has 8 cores, the maximum number of workers that should be
spawned is 7.

To avoid the overhead of creating and destroying worker threads per request, the
worker pool pattern allows you to define a reusable pool of workers to execute
tasks. Incoming tasks are put in a queue and subsequently executed by an
available worker.

This way, the overhead of continuously creating new workers for each request is
avoided and the maximum number of available workers is always capped at the
number of available CPUs minus one to prevent context switching inefficiencies.

While you can create and manage a worker pool on your own, we recommend using a
battle-tested library to save time and abstract away the complexities of manual
pool management. A few options in this space include
[workerpool](https://www.npmjs.com/package/workerpool),
[piscina](https://www.npmjs.com/package/piscina), and
[poolifier](https://www.npmjs.com/package/poolifier).

In the following section, I'll demonstrate how to utilize the workerpool library
to efficiently manage a pool of workers for processing Fibonacci calculation
requests.

## Optimizing CPU-bound tasks with a worker pool

Begin by installing the `workerpool` package with:

```command
npm install workerpool
```

Once installed, modify your `index.js` file as follows:

```javascript
[label index.js]
import express from 'express';
[highlight]
import workerpool from 'workerpool';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
[/highlight]
const app = express();
const PORT = process.env.PORT || 3000;

[highlight]
// Create a worker pool
const pool = workerpool.pool(__dirname + '/worker.js');
[/highlight]

app.get('/fibonacci/:n', async (req, res) => {
  const n = parseInt(req.params.n);

  if (isNaN(n) || n < 0) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }

[highlight]
  try {
    const result = await pool.exec('fibonacci', [n]);
    res.json({ fibonacci: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
[/highlight]
});

. . .
```

This code snippet initializes a worker pool using the `workerpool.pool()`
method, pointing to your worker script. The worker pool automatically adjusts
the number of workers, defaulting to the available CPU cores minus one.

In the handler for the `/fibonacci` route, the worker pool executes the
`fibonacci` function and returns a promise that resolves to the result of the
computation. This promise-based API allows you to use `async..await` syntax
coupled with a `try/catch` block for result and error handling.

Now, adjust your `worker.js` file to enable the worker function:

```javascript
[label worker.js]
import workerpool from 'workerpool';

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

workerpool.worker({
  fibonacci,
});
```

Here, the `fibonacci()` function is made accessible to the main thread, allowing
it to be invoked with `pool.exec('fibonacci', [n])`.

Let's see if these changes improve the performance of the Fibonacci computation
by repeating the request to compute the 35th Fibonacci number:

```command
time curl http://localhost:3000/fibonacci/35
```

```text
[output]
{"fibonacci":9227465}
real    0m0.079s
user    0m0.001s
sys     0m0.002s
```

By transitioning to a worker pool managed at the application's start, rather
than spawning workers per request, we eliminate the overhead associated with
worker creation.

Consequently, the Fibonacci calculation for the 35th number completes in 79ms,
closely matching the initial 83ms baseline, demonstrating minimal overhead from
utilizing a worker pool.

Performing a load test now should also reveal a boost in handling capacity:

```command
npx autocannon --renderStatusCodes http://localhost:3000/fibonacci/35
```

This yields a modest improvement to 500 successful requests in 10 seconds
compared to 442 from the previous run:

```text
[output]
. . .
┌──────┬───────┐
│ Code │ Count │
├──────┼───────┤
│ 200  │ 500   │
└──────┴───────┘

Req/Bytes counts sampled once per second.
# of samples: 10

510 requests in 10.02s, 128 kB read
```

For an even greater improvement in processing CPU-bound tasks, consider
upgrading the hardware to a system with additional CPU cores. In this particular
scenario though, adopting a more efficient algorithm like
[Matrix exponentiation](https://en.wikipedia.org/wiki/Matrix_exponential) or
[Fast doubling](https://www.geeksforgeeks.org/fast-doubling-method-to-find-the-nth-fibonacci-number/)
would be more effective.

## Final thoughts

Worker threads have advanced Node.js's ability to handle CPU-demanding tasks,
marking a significant improvement for the platform. Despite this progress,
Node.js remains best suited for handling I/O-driven operations rather than
intensive computational tasks.

This isn't a shortfall but rather a reflection of its original design intent.
While managing CPU-heavy tasks isn't its strong suit, Node.js still offers
mechanisms, such as worker threads, to tackle these challenges to a reasonable
extent.

It's now up to you to decide if this approach to CPU-intensive operations
suffices for your project's needs or if exploring technologies tailored for such
tasks might yield better results.

Thanks for reading and happy coding!