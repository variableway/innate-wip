# Scaling Node.js Applications with Clustering

Due to Node.js's architecture, deploying a Node.js application on a machine with
multiple CPUs typically runs as a single instance on a single CPU, responsible
for handling all incoming requests. This setup can lead to performance
degradation under heavy traffic, with other CPUs remaining idle while one CPU
bears the entire processing load.

To tackle this challenge, Node.js introduced the
[`cluster` module](https://nodejs.org/api/cluster.html), allowing for the
deployment of multiple instances of Node.js processes to use all available CPU
cores efficiently. The module incorporates a load balancer to evenly distribute
incoming requests among these instances running on different cores.

Employing the `cluster` module has the advantage of allowing Node.js to manage
increasing loads and traffic while maintaining optimal performance.

In this tutorial, we'll cover the following topics:

- Understanding the performance of a single instance under increasing load.
- Scaling Node.js using the `cluster` module.
- Employing PM2 to scale Node.js.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/Nz0OfV2L5m0?si=VrTmwO3qQX2Mrz_F" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Prerequisites

To proceed with this tutorial, ensure that your system has at least two CPUs and
that you have installed the [latest version](https://nodejs.org/en/download) of Node.js.

To check the number of CPUs available on your system, execute the following
command:

```command
nproc
```

You should see an output similar to:

```text
[output]
2
```

Once you have confirmed these prerequisites, you can set up the demo project.

## Setting up the demo project

To illustrate the concepts in this tutorial, I've prepared a sample Express app
which features a single endpoint that read the contents of a text file and
return a response accordingly. You'll scale this application to handle higher
traffic loads through clustering in the upcoming sections.

To begin, clone the repository from
[GitHub](https://github.com/betterstack-community/scaling-nodejs/):

```command
git clone https://github.com/betterstack-community/scaling-nodejs.git
```

Next, navigate into the newly created directory:

```command
cd scaling-nodejs
```

Next, proceed to install the necessary dependencies, comprising:

- [Express](https://expressjs.com/): A popular web application framework for
  Node.js.
- [nodemon](https://nodemon.io/): A tool for automatic restarting a server when
  it detects file changes.
- [autocannon](https://github.com/mcollina/autocannon): A load testing tool.

```command
npm install
```

The root directory contains a `content.txt` file with sample text that the app
will read, as shown below:

```text
[label content.txt]
Content read from a file
```

The `index.js` file contains the following code that sets up an endpoint to read
the content from the `content.txt` file:

```javascript
[label index.js]
import express from 'express';
import { readFile } from 'node:fs/promises';

const app = express();
const PORT = 3000;

app.get('/read-content', async (req, res) => {
  try {
    const data = await readFile('content.txt', 'utf8');
    res.status(200).send(data);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`App (PID: ${process.pid}) is listening on port ${PORT}`);
});
```

This code snippet sets up an HTTP GET endpoint at that reads the contents of the
`content.txt` file and responds with the file's contents. To test it out, start
the development server with the following command:

```command
npm start
```

```text
[output]
> scaling-nodejs@1.0.0 start
> nodemon index.js

[nodemon] 3.1.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node index.js`
App (PID: 97619) is listening on port 3000
```

Once the application starts, execute the command below in a separate terminal to
test the endpoint:

```command
curl http://localhost:3000/read-content
```

You'll receive a response similar to:

```text
[output]
Content read from a file
```

In the next section, you'll establish the baseline performance of the
application without clustering.

## Establishing baseline performance without clustering

In this section, you'll measure the application's ability to handle traffic to
the `/read-content` endpoint without employing clustering techniques. Your
findings will later be contrasted with the performance improvements clustering
brings later on in this tutorial.

Without clustering, the application is limited to using just one CPU which
leaves the others idle as illustrated in the diagram below:

![Diagram illustrating usage of CPU cores in an application without clustering](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/230fd938-cba1-4202-eb68-04ac96549900/md2x
=1089x913)

Let's see how it performs by initiating a load test through the command below:

```command
npx autocannon -d 11 --renderStatusCodes http://localhost:3000/read-content
```

Autocannon dispatches as many requests as possible within 11 seconds and
produces the following output:

```text
[output]
Running 11s test @ http://localhost:3000/read-content
10 connections


┌─────────┬──────┬──────┬───────┬──────┬────────┬─────────┬───────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg    │ Stdev   │ Max   │
├─────────┼──────┼──────┼───────┼──────┼────────┼─────────┼───────┤
│ Latency │ 0 ms │ 1 ms │ 2 ms  │ 3 ms │ 0.6 ms │ 0.64 ms │ 12 ms │
└─────────┴──────┴──────┴───────┴──────┴────────┴─────────┴───────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬──────────┬──────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg      │ Stdev    │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼──────────┼─────────┤
│ Req/Sec   │ 7,051   │ 7,051   │ 7,463   │ 10,567  │ 8,563.28 │ 1,506.29 │ 7,049   │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼──────────┼─────────┤
│ Bytes/Sec │ 1.78 MB │ 1.78 MB │ 1.88 MB │ 2.66 MB │ 2.16 MB  │ 380 kB   │ 1.78 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴──────────┴──────────┴─────────┘
┌──────┬───────┐
│ Code │ Count │
├──────┼───────┤
│ 200  │ 94190 │
└──────┴───────┘

Req/Bytes counts sampled once per second.
# of samples: 11

94k requests in 11.02s, 23.7 MB read
```

On my test machine, the server successfully processed approximately 94k requests
to the `/read-content` endpoint in 11.02 seconds, averaging 8.5k requests per
second.

These results will form the baseline against which we'll measure the impact of
implementing clustering on the application's performance to highlight the
potential for improved performance.

## Getting started with cluster module

Now that you've established the baseline performance of the application without
clustering, let's implement clustering by deploying multiple instances across
available CPUs through the `cluster` module.

With clustering, each CPU core will host an isolated Node.js instance and a load
balancer will evenly distributes incoming requests among these instances to
ensure that no one remains idle.

![Load Balancer Diagram](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/07356f0c-10cf-418a-5318-73b045db4f00/orig
=1089x969)

To cluster your application, create a file named `cluster.js` and populate it
with the following code:

```javascript
[label cluster.js]
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import process from 'node:process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const cpuCount = availableParallelism();

console.log(`Primary pid=${process.pid}`);
cluster.setupPrimary({
  exec: __dirname + '/index.js',
});

for (let i = 0; i < cpuCount; i++) {
  cluster.fork();
}

cluster.on('exit', (worker, code, signal) => {
  console.log(`Worker ${worker.process.pid} has terminated.`);
  console.log('Initiating replacement worker.');
  cluster.fork();
});
```

This snippet calculates the number of available CPU cores on the system using
the `availableParallelism()` function and sets up the primary process details,
including the path to the application entry script (`index.js`). It then uses a
loop to fork worker processes equal to the number of CPU cores, and sets up a
callback function that is executed if any of the worker processes exit.

Upon a worker's exit, a new process is launched immediately to replace the
terminated one, ensuring the application continues to utilize all available CPUs
effectively.

Return to the first terminal and stop the current server with `Ctrl+C`, then
execute the `cluster.js` file as follows

```command
node cluster.js
```

You'll observe the following output:

```text
[output]
Primary pid=111556
App (PID: 111567) is listening on port 3000
App (PID: 111569) is listening on port 3000
App (PID: 111568) is listening on port 3000
App (PID: 111570) is listening on port 3000
```

The output indicates five currently operational processes: one primary process,
the script you executed, and four worker processes spawned from it. Each worker
process is listening on the same port, `3000`.

The `cluster` module uses the
[Round Robin Load Balancing](https://avinetworks.com/glossary/round-robin-load-balancing/)
method to distribute the requests to the worker process. This approach involves
the primary process, which receives all incoming requests, acting as the
dispatcher and forwarding each incoming request to each worker process
sequentially. This process ensures an equal and efficient distribution of
requests, preventing the overloading of any single process while keeping others
idle.

In the second terminal, let's retest the endpoint under the same conditions to
gauge performance improvements:

```command
npx autocannon --renderStatusCodes http://localhost:3000/read-content
```

The test yields the following results:

```text
[output]
Running 10s test @ http://localhost:3000/read-content
10 connections


┌─────────┬──────┬──────┬───────┬──────┬─────────┬─────────┬───────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max   │
├─────────┼──────┼──────┼───────┼──────┼─────────┼─────────┼───────┤
│ Latency │ 0 ms │ 0 ms │ 3 ms  │ 5 ms │ 0.42 ms │ 1.02 ms │ 28 ms │
└─────────┴──────┴──────┴───────┴──────┴─────────┴─────────┴───────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬────────┬──────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg    │ Stdev    │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼────────┼──────────┼─────────┤
│ Req/Sec   │ 4,987   │ 4,987   │ 10,599  │ 12,271  │ 9,928  │ 2,007.92 │ 4,987   │
├───────────┼─────────┼─────────┼─────────┼─────────┼────────┼──────────┼─────────┤
│ Bytes/Sec │ 1.26 MB │ 1.26 MB │ 2.67 MB │ 3.09 MB │ 2.5 MB │ 506 kB   │ 1.26 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴────────┴──────────┴─────────┘
┌──────┬────────┐
│ Code │ Count  │
├──────┼────────┤
│ 200  │ 109199 │
└──────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 11

109k requests in 11.02s, 27.5 MB read
```

The output demonstrates that the server processed 109,000 requests, doubling the
number compared to the previous test, which handled 49,000 requests.
Additionally, the request rate surged to 9,928 requests per second from the last
average of 4,411 requests per second. The increased throughput underscores a
significant improvement in the system's performance and reliability.

This performance improvement is due to the `cluster` module creating several
worker processes and distributing the load among them equally. The operating
system's schedulers determine how and where to allocate each worker process.
This distribution depends on CPU availability, load, and scheduling policies.
Often, the OS assigns each CPU a worker process.

Stop the cluster.js process in the first terminal using `CTRL+C`.

With clustering implemented, our application can now efficiently handle more
requests at a much faster rate.

## Interprocess communication

In a cluster setup, each process operates within its own isolated memory space.
However, there are scenarios where these processes need to communicate.

Practical examples include one worker process reading data from the filesystem
and sending it to other worker processes. Another scenario is when one process
fetches data from the network or is used to offload a CPU-bound task. The
processed data can then be shared with other worker processes for further
manipulation or processing.

The worker processes can achieve this via an IPC (Inter-Process Communication)
channel, which facilitates the exchange of messages between the parent and
worker processes.

To send a message from a worker process, you can use the `process.send()`
method:

```javascript
process.send({
  msgFromWorker: `Message sent from a worker.`
});
```

The `send()` method transmits a message to the primary instance. In the primary
instance, you can listen for messages using `worker.on("message")`, like so:

```javascript
worker.on('message', (msg) => {
  // Handle received message here
});
```

To observe this behavior, create a `messaging.js` file with the following
contents:

```javascript
[label message.js]
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running.`);
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    // Receive messages from workers and handle them in the Primary process.
    worker.on('message', msg => {
      console.log(
        `Primary ${process.pid} received a message from worker ${worker.process.pid}:`,
        msg
      );
    });
  }
} else if (cluster.isWorker) {
  console.log(`Worker ${process.pid} is active.`);
  // Send a message to the Primary process.
  process.send({
    msgFromWorker: `Message sent from worker ${process.pid}.`,
  });
}
```

The `cluster.isPrimary` condition ensures that the code inside it executes only
in the primary instance. Within this condition, you set an event listener
`worker.on('message')` on each worker process to receive messages from other
processes. It logs the message along with the process ID of the sending worker.

The `cluster.isWorker` condition ensures that its code executes only in worker
processes. To send a message, you use `process.send()`, which contains a string
indicating that the message has been sent from the worker process along with its
process ID.

Run the file as follows:

```command
node message.js
```

```text
[output]
Primary 96715 is running.
Worker 96726 is active.
Primary 96715 received a message from worker 96726: { msgFromWorker: 'Message sent from worker 96726.' }
Worker 96727 is active.
Primary 96715 received a message from worker 96727: { msgFromWorker: 'Message sent from worker 96727.' }
Worker 96729 is active.
Primary 96715 received a message from worker 96729: { msgFromWorker: 'Message sent from worker 96729.' }
Worker 96728 is active.
Primary 96715 received a message from worker 96728: { msgFromWorker: 'Message sent from worker 96728.' }
```

In this output, several workers, identified by their process IDs (PIDs), are
active and communicating with the primary process with the PID 96715 (which may
differ on your system). The messages containing data with the property
`msgFromWorker` have been logged.

Now that you are familiar with interprocess communication, it's worth noting
that Node.js clustering is one of many available solutions. Another popular
option is PM2, which you'll explore in the next section.

## Using PM2 to cluster a Node.js application

In the previous section, you enhanced the application's performance using the
Node.js `cluster` module. This section will explore
[PM2](https://pm2.keymetrics.io/), a process manager built upon the `cluster`
module. PM2 simplifies scaling applications by deploying multiple processes
across available CPU cores and efficiently distributing requests among them.

First, return to the first terminal and install PM2:

```command
npm install -g  pm2
```

With PM2, scaling an application file becomes simpler, eliminating the need for
a separate file like `cluster.js` used in the clustering approach.

To scale the application, use the following command:

```command
pm2 start index.js -i 0
```

The `-i` flag specifies the number of instances PM2 should launch. By setting it
to `0`, you instruct PM2 to create as many instances of our application as there
are CPUs on our machine.

Executing the command yields an output similar to this:

```text
[output]
[PM2] Starting /home/stanley/scaling-nodejs/index.js in cluster_mode (0 instance)
[PM2] Done.
┌────┬──────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name     │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼──────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ index    │ default     │ 1.0.0   │ cluster │ 112344   │ 0s     │ 0    │ online    │ 0%       │ 51.2mb   │ stanley  │ disabled │
│ 1  │ index    │ default     │ 1.0.0   │ cluster │ 112351   │ 0s     │ 0    │ online    │ 0%       │ 49.2mb   │ stanley  │ disabled │
│ 2  │ index    │ default     │ 1.0.0   │ cluster │ 112362   │ 0s     │ 0    │ online    │ 0%       │ 47.0mb   │ stanley  │ disabled │
│ 3  │ index    │ default     │ 1.0.0   │ cluster │ 112373   │ 0s     │ 0    │ online    │ 0%       │ 37.7mb   │ stanley  │ disabled │
└────┴──────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

As observed, PM2 has automatically created a cluster of four worker processes
because the system has four cores. These processes are ready to handle incoming
requests and efficiently use system resources.

Now load test the application to observe its performance with the new changes:

```command
npx autocannon --renderStatusCodes http://localhost:3000/read-content
```

You'll receive output looking like this:

```text
[output]
Running 10s test @ http://localhost:3000/read-content
10 connections


┌─────────┬──────┬──────┬───────┬──────┬─────────┬─────────┬───────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max   │
├─────────┼──────┼──────┼───────┼──────┼─────────┼─────────┼───────┤
│ Latency │ 0 ms │ 0 ms │ 3 ms  │ 5 ms │ 0.44 ms │ 1.07 ms │ 24 ms │
└─────────┴──────┴──────┴───────┴──────┴─────────┴─────────┴───────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬──────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev    │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼──────────┼─────────┤
│ Req/Sec   │ 5,415   │ 5,415   │ 10,167  │ 11,591  │ 9,684   │ 1,611.39 │ 5,415   │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼──────────┼─────────┤
│ Bytes/Sec │ 1.36 MB │ 1.36 MB │ 2.56 MB │ 2.92 MB │ 2.44 MB │ 406 kB   │ 1.36 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴──────────┴─────────┘
┌──────┬────────┐
│ Code │ Count  │
├──────┼────────┤
│ 200  │ 106516 │
└──────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 11

107k requests in 11.02s, 26.8 MB read
```

On my test machine, the performance results from using PM2 closely mirror those
achieved with the Node.js `cluster` module. However, a slightly lower number of
requests were processed (107,000 requests) compared to 109,000 in the previous
test with the `cluster` module. Additionally, the request rates were slightly
lower, averaging 9,684 requests per second, compared to 9,928 requests per
second observed in the previous test.

Overall, performance changes are minimal when using PM2. However, scaling a
Node.js application with PM2 is much simpler and more accessible than manually
configuring clustering. Often, setting up PM2 suffices for scaling purposes.

To stop PM2 processes, you can use the following command:

```command
pm2 delete all
```

The command will halt all PM2-managed processes and clean up the environment.

```text
[output]
[PM2] Applying action deleteProcessId on app [all](ids: [ 0, 1, 2, 3 ])
[PM2] [index](1) ✓
[PM2] [index](0) ✓
[PM2] [index](2) ✓
[PM2] [index](3) ✓
┌────┬───────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name      │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
└────┴───────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

Now that you understand the benefits of configuring a cluster with PM2, the next
section will explore the common challenges encountered when clustering.

## Common challenges when clustering

To maximize the benefits of clustering, it's essential to be aware of the
potential challenges that may arise, allowing you to prevent them or find
effective workarounds.

Firstly, the worker processes are distinct entities with isolated memory spaces
and do not inherently share data. This can pose challenges, particularly if your
application stores session and login data in memory. To mitigate this issue,
developing applications with minimal state is advisable.

Another challenge arises because Node.js does not automatically adjust the
number of worker processes based on available CPUs. This lack of automation
necessitates manual intervention in your code to ensure optimal usage of system
resources. As a best practice, using the `os.availableParallelism()` function is
advisable instead of relying solely on `os.cpus().length` to determine the
appropriate number of worker processes. If can't use
`os.availableParallelism()`, it's important to note that the primary process
also consumes CPU resources. Therefore, subtracting one from the total available
cores ensures that the primary process can utilize a core while the remaining
cores are allocated to worker processes. This strategy helps maintain a balanced
distribution of processing power across the application.

In addition to distributing requests using the round-robin approach, the Node.js
`cluster` module supports direct worker connection handling. However, this can
sometimes lead to unbalanced load distribution due to OS scheduler quirks,
resulting in uneven performance across worker processes.

Finally, there is limited control over application ports, as each worker process
receives the same port. This can be restrictive, particularly if your
application requires unique ports for specific functionalities.

## Preparing applications for clustering

To ensure smooth scaling of your application, it's crucial to prepare it
appropriately. Here are some essential tips to consider:

Firstly, aim to design your application to be as stateless as possible. Avoid
storing critical information, such as session data, within the memory of worker
processes. This practice prevents requests from being limited to specific
instances, as the instance holding that information can only serve session-bound
data. Instead, opt for a shared storage solution accessible to all instances.
For session-specific data, in-memory stores like Redis or memcached are commonly
used. Alternatively, databases like PostgreSQL or MySQL can be suitable choices
depending on the nature of the data.

Another good practice is implementing graceful shutdown mechanisms to handle
shutdown signals effectively. Additionally, ensure that a new worker is spawned
if one fails, thus maintaining high availability. In our solution, we
incorporated the following code:

```javascript
cluster.on("exit", (worker, code, signal) => {
  console.log(`Worker ${worker.process.pid} has terminated.`);
  console.log("Initiating replacement worker.");
  cluster.fork();
})
```

This code snippet ensures that when a worker crashes, a replacement worker is
spawned to maintain system stability.

Lastly, monitoring and troubleshooting issues can become challenging when
dealing with multiple worker processes. To ease this process, consider using a
logging tool such as
[Pino](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/) or
[Winston](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/)
to generate logs, including process-specific details. These logs can then be
aggregated and forwarded to a centralized location like
[Better Stack](https://telemetry.betterstack.com/) for analysis.

## Final thoughts

This article explored various deployment strategies for Node.js applications,
focusing on clustering techniques using the `cluster` module and PM2. Each
approach underwent load testing to evaluate its impact on application
performance.

Clustering in Node.js using the `cluster` module exhibited superior performance
metrics, showcasing higher requests processed per second. PM2 followed closely;
although it lagged slightly behind in requests processed, the difference was not
massive.

In conclusion, selecting the appropriate deployment strategy should be based on
the application's specific requirements, considering factors such as expected
traffic load, resource utilization, and scalability needs. PM2 simplifies the
deployment and scaling process of a Node.js application with minimal code
adjustments, although it may not surpass the performance achieved by the
`cluster` module. However, despite requiring more configuration, the `cluster`
module offers robust performance when fine-tuned appropriately.
