# Schedulers in Node: A Comparison of the Top 10 Libraries

Applications often encounter tasks that can block or degrade performance, such as image and video processing, sending emails or notifications, network requests, or database operations. To prevent these tasks from impeding the application's responsiveness, executed asynchronously in the background.

Scheduling libraries are pivotal in allowing tasks to be scheduled for later execution. Numerous scheduling libraries are available in the Node.js ecosystem, each offering a range of features and capabilities to suit different requirements and use cases.

This article compares ten Node.js scheduler libraries, helping you choose the
most appropriate scheduling library for your next project. We will rank them based on features, ease of use, availability of resources, and maintenance of the libraries.


| Feature           | Bull       | Agenda     | Bree | Node Schedule | Cron | Cronosjs | Node Cron | Croner | Bottleneck | Toad-scheduler |
|-------------------|:----------:|:----------:|:----:|:-------------:|:----:|:--------:|:---------:|:------:|:----------:|:--------------:|
| Priorities        |  ✓         |    ✓       |      |               |      |          |           |        |            |                |
| Concurrency       |  ✓         |    ✓       |  ✓   |               |      |          |           |        |     ✓      |       ✓        |
| Delayed jobs      |  ✓         |    ✓       |  ✓   |               |      |          |           |        |            |                |
| Global events     |  ✓         |            |  ✓   |               |      |    ✓     |           |        |     ✓      |                |
| Rate Limiter      |  ✓         |            |      |               |      |          |           |        |     ✓      |                |
| Pause/Resume      |  ✓         |            |  ✓   |               |      |          |           |   ✓    |            |                |
| Sandboxed worker  |  ✓         |            |  ✓   |               |      |          |           |        |            |                |
| Repeatable jobs   |  ✓         |    ✓       |      |       ✓       |  ✓   |    ✓     |     ✓     |   ✓    |            |       ✓        |
| Atomic ops        |  ✓         |            |  ✓   |               |      |          |           |        |            |                |
| Persistence       |  Redis     |  MongoDB   |  ✓   |               |      |          |           |        |            |                |
| UI                |  ✓         |    ✓       |  ✓   |               |      |          |           |        |            |                |
## 1. BullMQ

![Screenshot of BullMQ logo](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/dc616bf3-a705-463c-630e-f438351bea00/orig
=2591x891)

BullMQ is a Node.js library designed for task scheduling and uses Redis to manage distributed jobs within applications or microservices. It creates queues in Redis to store job data, which workers retrieve for execution.

Below is a basic example demonstrating how BullMQ connects to Redis and creates a queue:

```javascript
[label index.js]
import { Queue } from "bullmq";

export const redisOptions = { host: "localhost", port: 6379 };

const myQueue = new Queue("myQueue", { connection: redisOptions });
```

BullMQ allows job scheduling for future execution or at recurring intervals, facilitating delayed and repeatable tasks. This is achieved by adding a job to a queue using the `add()` method:

```javascript
await myQueue.add(jobName, data, options)
```

The `add` function's first argument is the job name, followed by the custom data required for the task. The third argument comprises options such as setting delays, repeating jobs, or adjusting priorities.

Here's an example demonstrating how to add pass data when creating a job:

```javascript
// Add a task to the 'imageProcessing' queue
await imageProcessingQueue.add(
  "resize",
  {
    imagePath: "path/to/image.jpg",
    newSize: { width: 800, height: 600 },
  },
  { repeat: { pattern: "0 15 3 * * *" } }
);
```


BullMQ employs workers as separate processes or in multiple servers to handle tasks, monitor queues, and process jobs stored within them. Workers are responsible for marking completed jobs and managing retries for unsuccessful tasks:


```javascript
[label worker.js]
import { Worker } from "bullmq";
import { redisOptions } from "./index.js";

const worker = new Worker(
  "imageProcessingQueue",
  async (job) => {
    // process job
  },
  { connection: redisOptions }
);
```

To scale BullMQ workers horizontally, additional worker processes can be added, either on the same system or on different systems, to process jobs in parallel.

BullMQ also controls the number of jobs processed simultaneously through the `concurrency` option, which dictates the maximum number of concurrent jobs:


```javascript
[label worker.js]
import { Worker, Job } from 'bullmq';

const worker = new Worker(
  queueName,
  async (job: Job) => {
    // Do something with job
    return 'some value';
  },
  { concurrency: 40 },
);
```

If you need to update the concurrency value for a running worker, you can assign a new value to the `concurrency` property:

```javascript
worker.concurrency = 40
```

Furthermore, achieving concurrency can be accomplished by deploying multiple workers on the same or different machines. This approach is often recommended as it enhances the availability of workers:


```javascript
new Worker('myQueue', async job => {
  // Process the job data
});

new Worker('myQueue', async job => {
  // Process the job data

});
```
The library ensures reliable job execution through features like automatic retries, rate limiting, and persistence, guaranteeing no loss of jobs even after the server restarts.

Here's an example demonstrating how to limit the number of concurrently running jobs using rate limiting with the `limiter` option:

```javascript
const worker = new Worker('myQueue', async job => processJob(job), {
  limiter: {
    max: 10,
    duration: 1000,
  },
});
```

You can also subscribe to events from local workers like so:


```javascript
const myWorker = new Worker('myQuee');

myWorker.on('drained', () => {
  // Queue is drained, no more jobs left
});

myWorker.on('completed', (job: Job) => {
  // job has completed
});

myWorker.on('failed', (job: Job) => {
  // job has failed
});
```

Additionally, BullMQ includes a Bull Board package, providing a user interface for managing jobs:


![Bull Dashboard Screenshot](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a6b31285-c381-434c-96b8-a94f04233600/md2x
=3024x1766)

BullMQ shines in real-world scenarios where persistent job processing and scalability are essential, especially when dealing with bulk data in distributed or microservices architectures. A prime example is in tasks such as video and image processing, sending emails or notifications, or handling user-uploaded data.


One of BullMQ's key advantages is its horizontal scalability, which enables it to handle substantial workloads effectively. Additionally, BullMQ is actively maintained and supports job persistence in Redis, automatic retrying of failed jobs, and a monitoring dashboard for job management.

However, there are potential drawbacks to consider. BullMQ's dependency on Redis might not align with all project goals or preferences. This reliance on Redis may not be needed in scenarios where persistent job processing is unnecessary. Additionally, BullMQ's usage of Redis can consume significant memory resources, which may be a concern in memory-constrained environments.

Learn more: [Job Scheduling in Node.js with BullMQ](https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/)

## 2. Agenda

![Screenshot of Agenda Github page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5aa34f89-05e6-4a4d-558f-93c934eb3500/public
=3024x1598)

Second on the list is [Agenda](https://github.com/agenda/agenda), a popular and lightweight scheduler for Node.js. It uses MongoDB to persist job data and was designed to handle light and heavy workloads.

To begin using Agenda, you establish a connection to the MongoDB database:

```javascript
[label index.js]
import Agenda from 'agenda';

const mongoConnectionString = "mongodb://localhost/agendaDB"

const agenda = new Agenda({ db: { address: mongoConnectionString } });
```

Agenda allows you to define jobs, which are automatically added to the MongoDB database once the connection is  established. Here's an example of how to define a job:

```javascript
agenda.define('imageProcessing', async (job) => {
  const { imagePath, newSize } = job.attrs.data;
  // Perform image processing logic here, e.g., resizing
});
```
Additionally, Agenda provides scheduling capabilities, allowing you to define complex recurring schedules using human-readable syntax with the `every()` method:


```javascript
await agenda.every('5 minutes', 'imageProcessing', {
  imagePath: 'path/to/image.jpg',
  newSize: { width: 800, height: 600 }
});
```
Agenda's `every` method allows for flexible scheduling using human-readable intervals, making it easy to define complex recurring rules:

```javascript
agenda.every('2 minutes and 15 seconds', '<job_name>');
agenda.every('3 days', '<job_name>');
agenda.every('1 month and 2 weeks', '<job_name>');
agenda.every('2 years and 6 months', '<job_name>');
```
For more precise scheduling, you can use cron expressions:

```javascript
// Reschedule the job to run every 4 days
agenda.every('0 0 */4 * *', '<job_name>');

// Reschedule the job to run every 2 weeks
agenda.every('0 0 */14 * *', '<job_name>');
```

Agenda also supports concurrency, allowing you to run multiple jobs simultaneously. You can set the default concurrency level using the `defaultConcurrency` option:


```javascript
agenda.defaultConcurrency(10);
```

Alternatively, you can specify the concurrency level when instantiating Agenda:

```javascript
const agenda = new Agenda({ defaultConcurrency: 10 });
```


Agenda is not limited to recurring jobs; you can also schedule a job to execute once at any desired time using the `schedule` method:


```javascript
await agenda.schedule('every Sunday at midnight', '<job_name>', {
  jobData: 'data the job needs',
});
```

For tasks that need to run immediately, you can use the `now` method:

```javascript
await agenda.now('<job_name>', {
  jobData: 'data the job needs',
});
```


Another notable feature of Agenda is its extensibility. Packages like Agenda-rest provide APIs for managing jobs through HTTP endpoints, offering functionalities such as creating, updating, deleting, and canceling jobs:

- GET: /api/job
- POST: /api/job
- PUT: /api/job/:jobName
- DELETE: /api/job/:jobName
- POST /api/job/cancel



Agenda also offers the Agendash package, providing a user-friendly web-based interface for managing jobs:


![Screenshot of the Agenda dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1ce28f29-6e4b-47cd-86ba-926426ff6a00/lg1x
=3024x1752)

 Agenda is particularly suitable for lightweight and heavy scheduling tasks requiring database persistence. Examples include generating reports, processing images and videos, sending email notifications, refreshing caches, or fetching data from APIs.

One of Agenda's key advantages is its support for defining recurring tasks using human-readable intervals, which are easy to learn and use. Additionally, Agenda allows you to persist your data and supports concurrency. It offers flexibility with support for a REST API and can be easily monitored using the dashboard.

However, one drawback is that Agenda is limited to using MongoDB, which may not align with specific project requirements. Additionally, relying on an external dependency like MongoDB can introduce complexity, especially for tasks that do not require persistence.

Learn more: [Job Scheduling in Node.js with Agenda: A Beginner's Guide](https://betterstack.com/community/guides/scaling-nodejs/node-scheduled-tasks/)


## 3. Bree

![Screenshot of Bree logo](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/418b5101-b137-46a9-5809-7960e83d0900/orig
=1780x600)

[Bree](https://github.com/breejs/bree) is a task scheduler for Node.js designed for simplicity. It offers granular control without the need for external storage. 


It requires a `jobs` directory in the root project directory, where job scripts are defined and executed using Node.js worker threads:

```javascript
[label jobs/initiate-job.js]
import { parentPort } from 'node:worker_threads';
const actualJob = () => {
        // do something here
}

actualJob();

// signal to parent that the job is done
if (parentPort) parentPort.postMessage('done');
```

To schedule jobs at recurring intervals,  Bree can be instantiated with the job name and intervals specified in human-readable format:

```javascript
[label index.js]
// runs `./jobs/worker-1.js` every minute
import Bree from "bree";

const bree = new Bree({
  jobs: [
    'initiate-job',
    {
      name: 'worker-1',
      interval: '1m',
      path: 'index.js',

    },
  ],
});

bree.start();
```

The human-readable intervals provided by Bree are flexible, allowing for complex recurring schedules such as:


```javascript
// interval: 'on the last day of the month'
// interval: 'every 2 days'
// interval: 'at 10:15 am also at 5:15pm except on Tuesday'
```


Bree also offers the `cron` property, which supports cron expressions for complex scheduling needs:

```javascript
const bree = new Bree({
  jobs: [
    {
      name: 'worker-2',
      cron: '15 10 ? * *'
    },
  ],
});
```
Concurrency is supported in Bree, allowing you to run multiple jobs simultaneously:


```javascript
const bree = new Bree({
  jobs: [
    // runs `./jobs/worker-1.js` on the last day of the month
    {
      name: 'worker-1',
      interval: 'on the last day of the month'
    },

    // runs `./jobs/worker-2.js` every other day
    {
      name: 'worker-2',
      interval: 'every 2 days'
    },
  ]
```
Bree can be extended with plugins, providing additional functionalities:

```javascript
Bree.extend(plugin, options);
```

For instance, you can use the API plugin, which creates an API allowing you to manage Bree tasks:

- POST: '/v1/start/:jobName'
- POST: '/v1/restart/:jobName'
- POST: '/v1/stop/:jobName'

Bree is suitable for basic scheduling needs, offering quick setup without requiring a database layer. You can use Redis or MongoDB for data persistence if needed.

However, Bree has a smaller community than BullMQ or Agenda. Additionally, the directory setup may initially seem complex for some users.

## 4. Node Schedule

![Screenshot of Node Schedule](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a9ffedd4-5e54-4e24-4e5a-eaff64997200/md1x
=1200x600)

[Node Schedule](https://github.com/node-schedule/node-schedule) is one of the oldest Node.js schedulers, known for its lightweight and in-process execution, meaning jobs run as long as your script runs but don't persist once the script exits. It primarily focuses on time-based scheduling and offers support for cron-style scheduling:

```javascript
[label index.js]
import schedule from "node-schedule";

const job = schedule.scheduleJob("*/1 * * * *", function () {
  console.log("This job runs every minute!");
});
```

You can also schedule one-time jobs using JavaScript date objects:


```javascript
const date = new Date(2024, 2, 21, 5, 30, 0);

const job = schedule.scheduleJob(date, function(){
  console.log(`The task will run on ${date}`);
});
```

Alternatively, you can schedule jobs using object literal syntax:

```javascript
const job = schedule.scheduleJob({hour: 14, minute: 30, dayOfWeek: 0}, function(){
  console.log('Task runs!');
});
```

For more flexibility, Node Schedule supports recurrence rule scheduling, enabling you to specify when a task should recur. For example:

```javascript
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6]; // Run every day
rule.hour = 15; // 3 PM
rule.minute = 30; // 30 minutes
rule.tz = 'Etc/UTC';

const job = schedule.scheduleJob(rule, function(){
  console.log('Task runs everyday!');
});
```
Node Schedule excels in scenarios involving lightweight tasks like daily backups, fetching API data, or automation-related jobs, owing to its simplicity and flexibility in setting schedules.

However, Node Schedule lacks support for some cron syntax features like "W" (nearest weekday) and "L" (last day of the month/week). It also does not support concurrency.

## 5. Cron

![Screenshot of Cron](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/73d6e745-7599-435e-a0fb-e4edb309a200/public
=884x575)

[Cron](https://www.npmjs.com/package/cron) is a lightweight task scheduler for Node.js that allows you to set up recurring tasks within an application using cron syntax:

```javascript
[label index.js]
import { CronJob } from 'cron';

const job = CronJob.from({
    cronTime: '* * * * * *',
    onTick: function () {
        console.log('This task runs every second');
    },
    start: true, // Start the job immediately
});
```

Cron syntax in Node.js adds another field for seconds, allowing you to schedule tasks to run every few seconds.

Another way to set up Cron is to use a constructor:

```javascript
import { CronJob } from 'cron';

const job = new CronJob(
  '* * * * * *', // cronTime
  function () {
    console.log('You will see this message every second');
  }, // onTick
  null, // onComplete
  true, // start
  'America/Los_Angeles' // timeZone
);
```

Cron is often suitable for notifications, data backups, and network requests. Its advantage lies in its simple API, which can be learned quickly, allowing you to get started easily. In addition to cron expressions, Cron supports date objects, strings, or custom functions.

However, Cron lacks features like job prioritization and the ability to configure jobs to start only after completing other jobs successfully. 


## 6. Cronosjs

![Screenshot of Cronosjs Github](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1bb3e6a1-dc5c-4df0-e644-a77c5bc0e300/md2x
=1200x600)

[Cronosjs](https://github.com/jaclarke/cronosjs) is a simple, lightweight task scheduler for Node.js that is optimized for using cron syntax and extends its capabilities.

Getting started with Cronosjs is straightforward, as demonstrated in the following sample code: 

```javascript
[label index.js]
import { scheduleTask, validate, CronosExpression } from 'cronosjs'

// schedule task every minute
scheduleTask('*/1 * * * *', (timestamp) => {
  console.log(`Task triggered at ${timestamp}`)
})
```

Cronosjs provides a convenient `validate` function to validate cron expressions:


```javascript
[label index.js]
import { scheduleTask, validate, CronosExpression } from 'cronosjs'
...
// validate cron string
validate('* * 5 smarch *') // false
validate('* * * * *') // true
```

To get the next date, you can use the `CronosExpression` object:


```javascript
[label index.js]
...
CronosExpression.parse('* * 2/5 Jan *').nextDate()
```

Another exciting feature is the ability to schedule tasks from a list of dates:


```javascript
[label index.js]
// Schedule tasks from a list of dates in February 2024
const taskFromDates = new CronosTask([
  new Date(2024, 1, 10, 8, 0, 0), // February 10, 2024 at 8:00 AM
  1705123200000, // Timestamp for February 20, 2024, 12:00:00 AM
  '25 Feb 2024 15:30', // February 25, 2024 at 3:30 PM
]);

taskFromDates
  .on('run', (timestamp) => {
    console.log(`Task triggered at ${new Date(timestamp)}`);
  })
  .on('ended', () => {
    console.log('No more dates in the list');
  })
  .start();
```

Cronosjs is built for tasks like fetching data from APIs, backups, or sending email notifications. Its advantages include validating cron expressions and supporting scheduling tasks based on specific time zones.

However, Cronosjs hasn't received an update in two years and is not as popular as other Node.js schedulers. It lacks sufficient resources to cover everyday use cases, which may limit its suitability for some projects.


## 7. Node Cron

![Screenshot of Node Cron](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b519cd0a-b1a1-4983-3ba9-7fb4a6d74e00/md2x
=1200x600)


[Node Cron](https://www.npmjs.com/package/node-cron) is a tiny task scheduler for Node.js based on GNU crontab. It allows you to use cron syntax to schedule tasks in Node.js.

Here's an example using cron syntax to run a job every minute:

```javascript
[label index.js]
import cron from 'node-cron';

cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});
```

Node Cron also supports step values in cron expressions:

```javascript
[label index.js]
cron.schedule('*/5 * * * *', () => {
  console.log('Running every 5 minutes');
});
```

You can use names or short names for weekdays or months:

```javascript
import cron from 'node-cron';

cron.schedule('* * * Jan,Sep Mon', () => {
  console.log('running on Mondays of January and September');
});
```


Node Cron is suitable for simple background tasks like fetching API data, backups, or other tasks that don't need persistence. Its advantage lies in its ease of getting started and learning. It supports scheduling options, including seconds precision, and allows for timezone-specific scheduling.

However, Node Cron lacks human-readable scheduling ability and features like priority setting and job querying, which may be limitations for some use cases.


## 8. Croner

![Screenshot of Croner Github page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c31ad8e5-4379-4945-0299-6e669fe8df00/lg2x
=1200x600)

 [Croner](https://www.npmjs.com/package/croner) is another task scheduler offering built-in support for cron expressions, timezone targeting, and error handling. It's a well-tested library used by projects such as PM2, ZWave JS, and Uptime Kuma, and it's compatible with browser environments.

You can start scheduling tasks with Croner like this:


```javascript
[label index.js]
import { Cron } from "croner";

const job = new Cron('*/20 * * * * *', () => {
        console.log('This will run every twenty seconds');
});
```
Croner provides methods to control jobs such as stopping, pausing, resuming, and triggering:

```javascrpt
job.trigger();	
job.pause();
job.resume();
job.stop();	
```


You can also check the status of jobs:


```javascript
job.isRunning();
job.isStopped();
job.isBusy()
```

Croner is ideal for lightweight tasks like daily backups or notifications. Its advantages lie in its ease of use and compatibility with Node.js, Deno, and browser environments.

However, Croner lacks features like job prioritization and may have fewer resources and support compared to more established libraries.



## 9. Bottleneck

![Screenshot of Bottleneck](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d116b977-433b-4245-e83b-1d2267595d00/public
=1200x600)

Another task scheduler available for Node.js is
[Bottleneck](https://github.com/SGrondin/bottleneck). Unlike traditional
schedulers focused on cron jobs or future execution, Bottleneck immediately runs tasks while limiting their rate to avoid overwhelming your
system. 

You start using Bottleneck by creating an instance:

```javascript
import Bottleneck from "bottleneck";

// Create a new Bottleneck instance
const limiter = new Bottleneck({
  maxConcurrent: 1, // Number of tasks to run concurrently
  minTime: 60000,   // Minimum time (in milliseconds) between starting each task
});
```
You can then define a job and add it to the limiter created when you instantiate Bottleneck:

```javascript
// Define your task function
function scheduledTask() {
  console.log('Scheduled task executed at:', new Date());
}

// Schedule a task using the limiter
limiter.schedule(scheduledTask);
```

Tasks can be prioritized using the `priority` option, as demonstrated in this example:


```javascript
function highPriorityTask() {
  console.log('High-priority task executed at:', new Date());
}

function lowPriorityTask() {
  console.log('Low-priority task executed at:', new Date());
}

// Schedule high-priority and low-priority tasks using the limiter
limiter.schedule(highPriorityTask, { priority: 1 });
limiter.schedule(lowPriorityTask, { priority: 2 });
```

Bottleneck allows for handling job retries using Node event emitters:


```javascript
const limiter = new Bottleneck();

// Listen to the "failed" event
limiter.on("failed", async (error, jobInfo) => {
  ...
});

// Listen to the "retry" event
limiter.on("retry", (error, jobInfo) =>  ...);
```

Clustering can be enabled to allow limiters to access shared states in Redis. The changes made to the state are atomic, consistent, and isolated to prevent data race:


```javascript
const limiter = new Bottleneck({
   ...
  datastore: "redis", // or "ioredis"
  clearDatastore: false,
  clientOptions: {
    host: "127.0.0.1",
    port: 6379
  }
});
```


Bottleneck is perfect for API rate limiting, background processing, and data ingestion tasks.

Its advantages include being lightweight, supporting clustering for efficient scaling, and having effective rate-limiting capabilities for managing concurrent jobs.

However, it has a few drawbacks. Firstly, there have been no recent updates or new developments in over four years. Additionally, it lacks essential features such as setting job priorities and handling repeating tasks. There is also limited support for intricate scheduling options, making it less suitable for complex scheduling needs.


## 10. Toad-scheduler

![Screenshot of Toad-scheduler Github page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9089d912-8af6-495d-4010-329692184800/public
=1200x600)

The last one on the list is [Toad-scheduler](https://github.com/kibertoad/toad-scheduler), an in-memory task scheduler for Node.js. It offers a straightforward API for scheduling repeated tasks, supporting cron syntax:

```javascript
[label index.js]
const scheduler = new ToadScheduler();

const task = new Task("Backup task", () => {
  // job task here
});

const job = new SimpleIntervalJob({ minutes: 1 }, task, { id: "id_1" });
scheduler.addSimpleIntervalJob(job);
```
In this example, the `task` will execute every minute, as specified in the `SimpleIntervalJob` constructor.

Toad-scheduler also supports cron-style scheduling. To enable the feature, the `croner` library must be installed first:


```javascript
[label index.js]
const job = new CronJob(
  {
    cronExpression: "*/2 * * * * *",
  },
  task,
  {
    preventOverrun: true,
  }
);
```

The lightweight nature of Toad-scheduler makes it suitable for background processing tasks like creating backups or sending emails. Its advantages include the ability to configure it for clustered environments, support for asynchronous tasks, and error handling.

However, it's not ideal for handling long-running tasks or tasks requiring automatic retries after failures. Additionally, it relies on another library for cron-style syntax support, introducing unnecessary dependencies.

## Final thoughts

In this tutorial, we examined ten scheduling libraries for Node.js,
discussing the pros and cons of each tool.

BullMQ, Agenda, or Bree are solid options for advanced scheduling needs, and
they have the advantage of persisting jobs. Alternatively, schedulers like Node
Scheduler or Cron can be suitable choices if you have more straightforward
requirements.
