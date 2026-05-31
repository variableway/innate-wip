# Profiling Node.js Applications

Imagine your application is running smoothly, but suddenly, you notice a high load with CPU usage spiking to 95% or even 100%. This is often an indication of CPU-bound tasks in your Node.js application.

CPU-bound tasks require substantial processing power and can't be easily shifted to other resources, such as I/O operations. These tasks include intensive calculations, image/video processing, cryptographic operations, and machine learning inference.

To find out the culprit code and fix the high CPU usage, you'll need to profile your application. This guide will explore some tools and techniques for profiling Node.js applications.

Let's get started!

## Prerequisites

Before you dive in, ensure you have the following:

- The latest version of [Node.js](https://nodejs.org/en/download/package-manager) and npm installed on your machine.
- Familiarity with building basic applications using Node.js.

## Step 1 — Downloading the demo project

To demonstrate how to profile an application, you'll work with a Node.js project that uses a Fastify server. This server includes an endpoint that allows users to register by submitting a password. The server hashes the password with a randomly generated salt for secure storage. The hashing process is CPU-bound, often resulting in high CPU usage.

Begin by cloning the following repository to your machine with the following command:

```command
git clone https://github.com/betterstack-community/nodejs-profiler-demo.git
```

Next, navigate to the newly created directory:

```command
cd nodejs-profiling-demo
```

Install dependencies, including [Fastify](https://fastify.dev/) (a web framework) and [Autocannon](https://www.npmjs.com/package/autocannon) (a load-testing tool), by running the following command:

```command
npm install
```

After installing dependencies, launch the development server:

```command
node index.js
```

You should see the following output:

```text
[output]
server listening on 3000
```

Open another terminal to test the server:

```command
curl -X POST -H "Content-Type: application/json" -d '{"password":"userPassword123"}' http://localhost:3000/register
```

Upon running the command, you will receive a response that looks similar to this but with different values:

```text
[output]
{"salt":"c2f1e60a8d47afed730eb7f3d84b7e39","hashedPassword":"4f9f64c8c631418c46392faa46f4ea2f247e1216fbec302ca49af3add4d5e9428f7ae9e07c716038082e14aaf7d01eac62f0d2820eabf79e398426720c819e13"}
```

The password is hashed for secure storage instead of being stored directly in a database; the application merely logs it.

The hashing process can be observed in the `index.js` file, specifically within the `/register` endpoint:

```javascript
[label index.js]
fastify.post("/register", (request, reply) => {
  const { password } = request.body;

  if (!password) {
    return reply.status(400).send({ error: "Password is required" });
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  reply.send({ salt, hashedPassword });
});
```

However, the synchronous hashing operation with `crypto.pbkdf2Sync` blocks the event loop until the hashing process completes, which can lead to performance degradation and scalability issues. Consequently, incoming requests may experience delays or timeouts while waiting for the synchronous operation to finish.

As a result, incoming requests may experience delays or timeouts while awaiting the completion of the synchronous hashing operation.

## Step 2 — Differentiating CPU-Bound vs I/O-Bound Tasks

Computer programs often have tasks classified into two major categories: I/O-bound tasks and CPU-bound tasks.

I/O-bound tasks involve operations typically managed by the operating system, such as file I/O, network requests, or database interactions. In Node.js, with its single-threaded nature, these tasks don't block the event loop because they're handled asynchronously. Node.js leverages an event-driven architecture and non-blocking I/O operations, allowing it to continue executing other code while waiting for I/O tasks to finish. This enables efficient management of multiple I/O operations simultaneously. Examples include fetching data from APIs, reading files from disk, or database queries.

On the other hand, CPU-bound tasks demand substantial processing power and require the CPU to be directly used. If they take too long to execute, these tasks can cause the event loop to block, leading to unresponsive applications. In Node.js, CPU-bound tasks pose a particular challenge due to the single-threaded event loop, which must wait for these tasks to complete before proceeding with other operations. Examples of CPU-bound tasks include image processing, video encoding, and complex calculations.

When troubleshooting high CPU usage and considering profiling CPU usage, it's often due to CPU-bound tasks.

## Step 3 — Profiling with the built-in Node.js profiler

Node.js includes a built-in profiling tool that profiles a Node.js app as it runs. The tool uses the [V8 profiler](https://v8.dev/docs/profile), which samples the application's call stack regularly. Each sample records the function at the top of the stack when the sample is taken. By analyzing these samples, you can identify where CPU usage spikes occur.

To profile your application, pass the `--prof` flag to the `node` command like this:

```command
node --prof index.js
```

Next, you should put the application under heavy load for a more meaningful CPU profiling. You can achieve this using a load-testing tool like Autocannon.

Open a second terminal and load test the application for 11 seconds with the following command:

```command
npx autocannon --renderStatusCodes  -d 11 -m POST -H "Content-Type: application/json" -b '{"password":"userPassword123"}' http://localhost:3000/register
```

When the load testing finishes, it will display output that looks like this:

```text
[output]
Running 11s test @ http://localhost:3000/register
10 connections


┌─────────┬────────┬────────┬─────────┬─────────┬────────────┬───────────┬─────────┐
│ Stat    │ 2.5%   │ 50%    │ 97.5%   │ 99%     │ Avg        │ Stdev     │ Max     │
├─────────┼────────┼────────┼─────────┼─────────┼────────────┼───────────┼─────────┤
│ Latency │ 217 ms │ 991 ms │ 3683 ms │ 5830 ms │ 1068.69 ms │ 767.62 ms │ 5830 ms │
└─────────┴────────┴────────┴─────────┴─────────┴────────────┴───────────┴─────────┘
┌───────────┬────────┬────────┬─────────┬─────────┬─────────┬───────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%     │ 97.5%   │ Avg     │ Stdev │ Min    │
├───────────┼────────┼────────┼─────────┼─────────┼─────────┼───────┼────────┤
│ Req/Sec   │ 8      │ 8      │ 9       │ 10      │ 8.91    │ 0.67  │ 8      │
├───────────┼────────┼────────┼─────────┼─────────┼─────────┼───────┼────────┤
│ Bytes/Sec │ 2.9 kB │ 2.9 kB │ 3.27 kB │ 3.63 kB │ 3.23 kB │ 242 B │ 2.9 kB │
└───────────┴────────┴────────┴─────────┴─────────┴─────────┴───────┴────────┘
┌──────┬───────┐
│ Code │ Count │
├──────┼───────┤
│ 200  │ 98    │
└──────┴───────┘

Req/Bytes counts sampled once per second.
# of samples: 11

108 requests in 11.07s, 35.6 kB read
```

After completing the load test, stop the server in the first terminal with `CTRL + C`. The profiler output will be written to a file in the current directory. The file's name will be `isolate-0x<number>-v8.log`, where `0x<number>-v8` represents a hexadecimal string.

List the directory contents with the following command:

```command
ls -l
```
You will see the file in the output:


```text
[output]
total 7264
-rw-rw-r--  1 stanley stanley     623 Jun  4 11:35 index.js
-rw-rw-r--  1 stanley stanley 7399577 Jun  4 11:39 isolate-0x650d000-56183-v8.log
...
```

The `isolate-0x<number>-v8.log` file holds raw data that's not easily readable. To make it human-readable, run the following command with the `--prof-process` flag:


```command
node --prof-process isolate-0x<number>-v8.log > profile.txt
```

Open `profile.txt` with your preferred text editor:

```command
code profile.txt
```

Navigate to the `[Summary]` section within the file:

```text
[label profile.txt]
 [Summary]:
   ticks  total  nonlib   name
     23    0.2%  100.0%  JavaScript
      0    0.0%    0.0%  C++
     50    0.4%  217.4%  GC
  11674   99.8%          Shared libraries
```

Node.js executes your JavaScript file and runs some C++ code and other libraries. The summary output indicates that most ticks occurred in JavaScript, suggesting that your attention should be directed to the JavaScript code.

Proceed to the [JavaScript] section of the file to identify which functions are consuming the most CPU time:

```text
[label profile.txt]
 [JavaScript]:
   ticks  total  nonlib   name
      2    0.0%    8.7%  JS: ^processTimers node:internal/timers:499:25
      2    0.0%    8.7%  JS: +wrappedFn node:internal/errors:535:21
      2    0.0%    8.7%  JS: *normalizeString node:path:66:25
      1    0.0%    4.3%  RegExp: ^((?:@[^/\\%]+\/)?[^./\\%][^/\\%]*)(\/.*)?$
      1    0.0%    4.3%  JS: ^toRealPath node:internal/modules/helpers:49:20
      1    0.0%    4.3%  JS: ^sendTrailer /home/stanley/nodejs-profiling-demo/node_modules/fastify/lib/reply.js:765:22
      1    0.0%    4.3%  JS: ^pbkdf2Sync node:internal/crypto/pbkdf2:61:20
    ...
      1    0.0%    4.3%  JS: +<anonymous> node:internal/validators:458:42
```
This section reveals which functions are taking the most CPU time, enabling you to target specific areas for optimization. Notably, ticks from the `crypto` module suggest that cryptographic operations might be significant contributors to CPU usage. This insight can guide you in optimizing specific parts of your code.

A more reliable method for confirming high CPU usage involves examining the call stack. Navigate to the "Bottom up" section of the profiling output:

```text
[label profile.txt]
Bottom up (heavy) profile]:
  Note: percentage shows a share of a particular caller in the total
  amount of its parent calls.
  Callers occupying less than 1.0% are not shown.

   ticks parent  name
  10566   90.3%  /home/stanley/.nvm/versions/node/v22.2.0/bin/node
   9272   87.8%    JS: ^pbkdf2Sync node:internal/crypto/pbkdf2:61:20
   9272  100.0%      JS: ^<anonymous> file:///home/stanley/nodejs-profiling-demo/index.js:6:27
   9272  100.0%        JS: ^preHandlerCallback /home/stanley/nodejs-profiling-demo/node_modules/fastify/lib/handleRequest.js:126:29
   9272  100.0%          JS: ^validationCompleted /home/stanley/nodejs-profiling-demo/node_modules/fastify/lib/handleRequest.js:103:30
   9272  100.0%            JS: ^preValidationCallback /home/stanley/nodejs-profiling-demo/node_modules/fastify/lib/handleRequest.js:83:32
    829    7.8%    JS: ~pbkdf2Sync node:internal/crypto/pbkdf2:61:20
    829  100.0%      JS: ~<anonymous> file:///home/stanley/nodejs-profiling-demo/index.js:6:27
    829  100.0%        JS: ~preHandlerCallback /home/stanley/nodejs-profiling-demo/node_modules/fastify/lib/handleRequest.js:126:29
    829  100.0%          JS: ~validationCompleted /home/stanley/nodejs-profiling-demo/node_modules/fastify/lib/handleRequest.js:103:30
    829  100.0%            JS: ~preValidationCallback /home/stanley/nodejs-profiling-demo/node_modules/fastify/lib/handleRequest.js:83:32
```
This section further confirms that the `pbkdf2Sync` function is consuming most of the CPU time. 


## Step 4 —  Profiling with Chrome DevTools

Another approach is using Chrome DevTools, which can collect performance data and generate a report on which functions use the most CPU time. This allows you to easily identify performance bottlenecks.

To initiate this process, start your server with the `--inspect` flag:

```command
node --inspect index.js
```

Once the server is up and running, launch Chrome or any Chromium-based browser and enter `chrome://inspect` in the address bar. Locate the **inspect** link corresponding to your Node.js script and click on it:

![Chrome inspect page screenshot](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6ddd6054-3101-41fb-42a9-9cdfe26e3400/lg2x =3024x1116)

This action opens the DevTools window. Next, switch to the "Performance" tab and click the **record** button indicated in the screenshot below:

![Start record button in DevTools](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/006f2638-2f2c-4751-b1ea-a96219556f00/md2x =1506x1360)

Now, return to your terminal and rerun the load test:

```command
npx autocannon --renderStatusCodes -d 11 -m POST -H "Content-Type: application/json" -b '{"password":"userPassword123"}' http://localhost:3000/register
```

After completing the load testing, return to the DevTools window and click **Stop** to conclude the profiling process:

![Stop profiling screenshot](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/414a6f47-f9ee-4416-1fc1-5a0eac459c00/public =854x512)

Upon stopping, a comprehensive performance profile is presented. Initially, it appears as a series of boxes:

![Frame chart screenshot](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cdfa5836-d36a-4df9-8c79-9efa7af24700/lg1x =2714x888)

This is known as a [frame chart](https://webperf.tips/tip/understanding-flamegraphs/). It has a horizontal axis that signifies time, and a vertical axis that represents the call stack.

You can zoom in on the horizontal axis to closely examine the call stack. The easiest way is to click on any point in the horizontal axis, then drag while holding the click to select a small portion:

![Call stack zoomed-in screenshot](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b5004329-58cf-4a35-259a-d78aadd00400/lg2x =3022x1766)

This allows you to focus on specific time frames and better understand the sequence and duration of function calls.

Upon zooming, the call stack will be displayed in detail. The events at the top are the ones that cause the events at the bottom. Here, DevTools shows the execution path of a Node.js function. The process begins with internal Node.js mechanisms (`processTicksAndRejections`, `endReadableNT`, `emit`) and progresses through custom parsing (`defaultJsonParser`, `onEnd`). It includes various request handling steps `preValidationCallback`, `validationCompleted`, `preHandlerCallback`, `handler`. The sequence culminates with an anonymous function and the critical `pbkdf2Sync` call. 

To see the callback from the bottom up, switch to the "Bottom-Up" tab to see the aggregated time spent on the actions:

![Bottom-up call stack screenshot](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f40099d4-0ba6-4032-5b5e-e551b4deae00/md2x =3018x818)

Here, you will see that 99% of the time is spent on `run`. When you expand `run`, you will see that the `pbkdf2Sync` function is there, which is a big hint that it consumes most of the CPU time.

With that, you can now clear the contents:

![Screenshot of clear button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ab4a4b0a-6614-491c-d8e4-73fec74a9400/lg2x =1308x168)

That takes care of profiling with Chrome DevTools. Next, you will use the Node Inspector API.

## Step 5 — Profiling with the Node Inspector

Another approach is to use the Node Inspector API, which allows you to interact with the V8 inspector programmatically. You can use the Inspector API to profile your application by following these steps.

First, create an `inspector.js` file with the following contents in the root directory:


```javascript
[label inspector.js]
import * as inspector from "node:inspector/promises";
import fs from "node:fs/promises"; // Use promises for cleaner async/await usage

const session = new inspector.Session();

async function enableProfiling() {
  try {
    await session.connect();
    await session.post("Profiler.enable");
  } catch (error) {
    console.error("Error enabling profiling:", error);
  }
}

async function startCpuProfiling() {
  try {
    await enableProfiling();
    await session.post("Profiler.start");
  } catch (error) {
    console.error("Error starting CPU profiling:", error);
  }
}

async function stopCpuProfiling() {
  try {
    const { profile } = await session.post("Profiler.stop");
    await fs.writeFile("./profile.cpuprofile", JSON.stringify(profile));
  } catch (error) {
    console.error("Error stopping CPU profiling:", error);
  } finally {
    await session.disconnect();
  }
}

process.on("SIGUSR1", startCpuProfiling);
process.on("SIGUSR2", stopCpuProfiling);
```
In this code, you import necessary modules and create a `inspector.Session` instance. The `enableProfiling` function connects to the session and enables the Profiler.

The `startCpuProfiling` function calls `enableProfiling` and starts CPU profiling. In contrast, the `stopCpuProfiling` function stops profiling, saves the profile data to a file, and disconnects the session, handling any errors that occur.

The script listens for `SIGUSR1` and `SIGUSR2` signals. Receiving `SIGUSR1` starts profiling, and `SIGUSR2` stops profiling and saves the results, allowing control over profiling through Unix signals.

To ensure that this code runs when you start the development server, import the module in `index.js`:

```javascript
[label index.js]
import Fastify from "fastify";
import crypto from "node:crypto";
[highlight]
import "./inspector.js";
[/highlight]
```


With that, run the development server without any flags and put the process in the background using `&`:

```command
node index.js &
```
It will show the process ID; on my system, it is `15565`:

```text
[1] 15565
```

Now trigger CPU profiling by sending the `SIGUSR1` signal:

```command
kill -SIGUSR1 <your_process_id>
```

Start the load testing again:

```command
npx autocannon --renderStatusCodes  -d 11 -m POST -H "Content-Type: application/json" -b '{"password":"userPassword123"}' http://localhost:3000/register
```

When the load testing finishes, send the `SIGUSR2` signal to stop profiling:

```command
kill -SIGUSR2 <your_process_id>
```

Stopping profiling creates a `profile.cpuprofile` file in the root directory, which contains the profiling data that has been collected. Fortunately, this file can be read by Chrome.

To quickly analyze it in the DevTools, return to the "Performance" tab, then click the **Load profile** button:

![Screenshot of Load profile button in Chrome DevTools](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/54858106-ce47-48be-2cd2-1e1c44150900/public =1308x170)


After Chrome analyzes the file, it generates a frame chart like the one you saw in the previous section.

With that, you can terminate the Node process:


```command
kill -9 <your_process_id>
```
## Step 6 — Profiling with the `perf` Tool

We have looked at some ways to profile Node.js applications, but now we'll use `perf`, a powerful Linux tool that can profile Node.js applications and those written in other languages. It has many features, including recording CPU samples, context switches, and detailed kernel information.

First, check if `perf` is installed:

```command
perf --version
```
```text
[output]
perf version 6.8.1
```

Now, run your Node.js application with the `--perf-basic-prof` flag:

```command
node --perf-basic-prof index.js &
```
This tells the compiler to include filenames when translating the code to machine code. Without this, `perf` will show only memory addresses instead of function names during profiling.

Next, note the process ID and run the `perf` command:

```command
sudo perf record -F 99 -p <your_process_id> -g
```

You can proceed with load testing in another terminal:


```command
npx autocannon --renderStatusCodes  -d 11 -m POST -H "Content-Type: application/json" -b '{"password":"userPassword123"}' http://localhost:3000/register
```
After the load testing finishes, send a SIGINT (Ctrl-C) to stop the `perf` process. The output will look like this:


```text
[output]
...
[ perf record: Woken up 1 times to write data ]
[ perf record: Captured and wrote 0.240 MB perf.data (1156 samples) ]
```

`perf` will create a file in the `/tmp` folder, often named like `/tmp/perf-<process_id>.map`, containing traces of the functions called. To aggregate the results, run:


```command
sudo perf script > perfs.out
```
This also creates a `perf.data` file with binary data. You can open the `perf.out` file in your text editor to locate the call stack

```text
[label perfs.out]
node   56676 444594.095023:   10101010 task-clock:ppp:
	    7db1716add39 cfree+0x19 (/usr/lib/x86_64-linux-gnu/libc.so.6)
	         2189d76 evp_md_ctx_clear_digest+0x36 (/home/stanley/.nvm/versions/node/v22.2.0/bin/node)
	         218a4e3 EVP_MD_CTX_copy_ex+0x73 (/home/stanley/.nvm/versions/node/v22.2.0/bin/node)
	         21c7d30 HMAC_CTX_copy+0x90 (/home/stanley/.nvm/versions/node/v22.2.0/bin/node)
	         22af0df kdf_pbkdf2_derive+0x3ef (/home/stanley/.nvm/versions/node/v22.2.0/bin/node)
	         21b2274 PKCS5_PBKDF2_HMAC+0x234 (/home/stanley/.nvm/versions/node/v22.2.0/bin/node)
          ....
	         374723 v8::internal::(anonymous namespace)::Invoke(v8::internal::Isolate*, v8::internal
```

The call stack information from `perfs.out` shows the execution sequence for a Node.js process, starting with memory management (`cfree` from `libc`) and moving through several cryptographic functions (`evp_md_ctx_clear_digest`, `EVP_MD_CTX_copy_ex`, `HMAC_CTX_copy`, `kdf_pbkdf2_derive`, `PKCS5_PBKDF2_HMAC`). The stack continues with internal Node.js and V8 engine operations, indicating extensive use of CPU resources for cryptographic processing and function invocations within the Node.js runtime environment.


Reading this file can be overwhelming and not very informative due to the large amount of data. A better way to understand this is to visualize the data.

To visualize this data, you can use the [FlameGraph](https://github.com/brendangregg/FlameGraph) tool. First, move back to the home directory:

```command
cd ~
```

Then, clone the FlameGraph repository:

```command
git clone https://github.com/brendangregg/FlameGraph
```

Move into the directory:

```command
cd FlameGraph/
```


Next, copy the `perf.data` file into the current directory:

```command
cp ../nodejs-profiling-demo/perf.data .
```


Now, create the flame graph with the following command:

```command
sudo perf script | ./stackcollapse-perf.pl |./flamegraph.pl > perf-flamegraph.svg
```

The command creates a `perf-flamegraph.svg` file, which is a flame graph in SVG format.


Next, open the `perf-flamegraph.svg` file in the browser of your choice to view the flame graph:

![Screenshot of the flame graph](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2f4cba9b-fff9-4de7-fb0e-4cabb8d56e00/lg1x =1200x1142)


To read the frames, first, ignore the colours, as they are mainly for presentation purposes and can be random. 

Each box corresponds to a function, showing the call stack depth on the y-axis, with the top box representing the function currently using the CPU and parent functions below. The x-axis shows the function's CPU time. The width of each box indicates the total CPU time the function used, either because it was slow or called frequently. The wider the box, the more prominent it is, so focus on the widest boxes first. The x-axis groups similar functions together without indicating time progression.

Analyzing the flame graph, you can see that `pbkdf2Sync` uses significant CPU time. This is evident from the wide boxes representing `pbkdf2Sync` and related cryptographic functions, indicating high CPU usage. 

Another exciting feature is that you can click on the boxes to see more details or even perform a search.

![Screenshot of the zoomed-in box](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/961d45dd-fd4e-4f69-f0d4-d7f592484800/orig =3024x2284)

Using the `perf` command and visualizing the data with FlameGraph allows you to analyze CPU usage in your applications effectively.

## Step 7 — Understanding continuous profiling

So far, you have manually profiled the application to identify performance issues. However, this can be demanding, especially with a microservices architecture where multiple services run on different machines.

To keep up-to-date with CPU utilization continuously, you can use continuous profiling. This is a dynamic method that profiles applications constantly, making it easier to monitor CPU usage and identify the culprits behind high memory or CPU consumption.

To implement continuous profiling, you can use tools like:

- [Pyroscope](https://github.com/grafana/pyroscope): a continuous profiling platform that helps monitor and analyze CPU utilization in real-time.
- [Parca](https://www.parca.dev/): an open-source continuous profiling project that collects, stores, and makes profiles queryable using its custom query language.
- [Google Cloud Profiler](https://cloud.google.com/profiler): a continuous profiling tool integrated with Google Cloud, which helps to visualize and optimize performance by collecting CPU and memory profiles.
- [Conprof](https://github.com/conprof/conprof): a continuous profiling tool for the Prometheus ecosystem, making it easy to integrate with existing Prometheus setups.

Using these tools, you can effectively monitor and optimize CPU utilization in your applications.

## Final thoughts

In this article, you explored various techniques and tools for profiling Node.js applications to identify high CPU usage sources. Profiling is crucial for performance optimization, but further enhancing your application involves learning about memory leak detection and prevention, which you can learn from [this guide](https://betterstack.com/community/guides/scaling-nodejs/high-performance-nodejs/nodejs-memory-leaks/).