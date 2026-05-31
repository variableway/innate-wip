# Job Scheduling in Node.js with BullMQ

[BullMQ](https://docs.bullmq.io/) is a Node.js library that allows you to offload tasks from your main application to the background, helping your application run more efficiently. It's ideal for tasks that take time, like image or video processing, API calls, backups, and sending notifications or emails.

The BullMQ library uses Redis to store jobs, ensuring jobs persist even if the application stops working, which is critical for applications deployed in production. BullMQ's capabilities include running multiple jobs concurrently, retrying failed jobs, horizontal scaling, and prioritizing jobs. Its reliability and efficiency have garnered the trust of companies like Microsoft, Vendure, and Datawrapper.

This article will guide you through the setup, features, and best practices of using BullMQ to implement task scheduling effectively in a Node.js application.

Let's get started!

[summary]
### Scheduled jobs still need uptime monitoring
A queue keeps jobs moving, but you still need a signal when the worker stops, Redis is unreachable, or a repeatable job silently fails. Use heartbeat style monitoring to confirm each scheduled run happened on time, and alert your team if it did not.
[Better Stack](https://betterstack.com/uptime) Heartbeats are a simple fit for cron like jobs and queue workers.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/YUnoLpCy1qQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Prerequisites
Before proceeding with the tutorial, ensure you've installed the latest LTS version of Node.js on your system. You can find the installation guide [here](https://nodejs.org/en/download). Since BullMQ uses Redis for job storage, you'll also need to have Redis set up. Follow the [official Redis installation guide](https://redis.io/docs/install/install-redis/) for detailed instructions. Additionally, part of this tutorial will involve database backup using MongoDB. Ensure you have [MongoDB installed](https://www.mongodb.com/docs/manual/administration/install-community/), or opt for an alternative database, considering that the steps might differ.

Once you've installed the prerequisites, verify that Redis is operational by running:

```command
sudo systemctl status redis
```

If Redis is running smoothly, you'll see "active (running)" in the status output:

```text
[output]
● redis-server.service - Advanced key-value store
     Loaded: loaded (/lib/systemd/system/redis-server.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2023-12-21 10:11:36 UTC; 27s ago
       Docs: http://redis.io/documentation, man:redis-server(1)
   Main PID: 6395 (redis-server)
     Status: "Ready to accept connections"
      Tasks: 5 (limit: 2244)
     Memory: 2.5M
        CPU: 153ms
     CGroup: /system.slice/redis-server.service
             └─6395 "/usr/bin/redis-server 127.0.0.1:6379"

Dec 21 10:11:36 bullmq-server systemd[1]: Starting Advanced key-value store...
Dec 21 10:11:36 bullmq-server systemd[1]: Started Advanced key-value store.
```

This confirms that Redis is active and ready to accept connections. If the output shows "Active: inactive (dead)," it indicates that Redis isn't running. In this case, start the service with:

```command
sudo systemctl restart redis.service
```

## Step 1 — Setting up the project directory

With Redis operational, begin by cloning the essential code from the [GitHub repository](https://github.com/betterstack-community/bullmq-scheduled-tasks):

```command
git clone https://github.com/betterstack-community/bullmq-scheduled-tasks.git
```

Navigate to the newly created directory:

```command
cd bullmq-scheduled-tasks
```

Next, use the `npm` command to install the necessary dependencies listed in the `package.json` file. This includes essential libraries like [BullMQ](https://www.npmjs.com/package/bullmq) for task scheduling and [date-fns](https://www.npmjs.com/package/date-fns) for manipulating dates:

```command
npm install
```

Once all the dependencies are installed, you can start scheduling tasks with BullMQ in the following steps.

## Step 2 — Scheduling tasks with BullMQ

In this section, you will create a basic task scheduler with BullMQ.

To begin, open the `index.js` file with an editor of your choice. This tutorial assumes you are using VSCode, which can be opened with the `code` command as follows:

```command
code index.js
```

```js
[label index.js]
import { Queue } from "bullmq";

export const redisOptions = { host: "localhost", port: 6379 };

const myQueue = new Queue("myQueue", { connection: redisOptions });

async function addJob(job) {
  const options = { repeat: { every: 5000 } };
  await myQueue.add(job.name, job, options);
}

export const welcomeMessage = () => {
  console.log("Sending a welcome message every few seconds");
};

await addJob({ name: "welcomeMessage" });
```

You create a queue instance that creates a queue named `myQueue` in Redis using the values in the `redisOptions` object, which allows BullMQ to connect with Redis. 

Next, you define an `addJob()` function that uses the `add()` method to add a job to the queue. It takes three arguments: the job name, the job data, and the `options` object. The `options` object includes the `repeat` property, which accepts milliseconds for scheduling jobs. Note that the second and third arguments are optional.

Next, you define a `welcomeMessage()` function, which is the actual job. This function would contain the time-intensive code in a more real-world application, but it is just a "hello world" message here. A worker will execute this function, which we will explore soon.

Finally, you call the `addJob` function to add a job with the `welcomeMessage` name.

You can then run the file with the following command:

```command
node index.js
```

BullMQ will create a queue and add a `welcomeMessage` job, but it won't execute the jobs in Redis. For that task, you need a worker, an instance that goes through the queue and executes each job stored in the queue. If executing the job is successful, the job is moved to the "completed" status. Conversely, if any issues arise during execution, leading to an error, the job is labeled "failed."

Now open the `worker.js` file in your editor:

```command
code worker.js
```

```javascript
[label worker.js]
import { Worker } from "bullmq";
import { welcomeMessage, redisOptions } from "./index.js";

const jobHandlers = {
  welcomeMessage: welcomeMessage,
};

const processJob = async (job) => {
  const handler = jobHandlers[job.name];

  if (handler) {
    console.log(`Processing job: ${job.name}`);
    await handler(job);
  }
};

const worker = new Worker("myQueue", processJob, { connection: redisOptions });

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

console.log("Worker started!");
```

First, you import the `welcomeMessage` function and assign it to a property in the `jobHandlers` object. This lets you dynamically choose functions as we add more functions to process tasks. Next, you define a `processJob` function, which dynamically checks for a function in the `jobHandlers` object, prints a message, and invokes the function with the job data.

Next, you create the worker instance with the `myQueue`, passing it the function that executes jobs and the connection settings required for the worker to connect with Redis and consume jobs.

Finally, the "completed" event handler logs a success message if a job is finished and marked as completed. If a job fails, it triggers the "failed" handler, and the job ID of the failed job is logged along with the error message.

After finishing this setup, open another terminal and start the `worker.js` script:

```command
node worker.js
```

When it runs, you will see output similar to the following:

```text
[output]
Processing job: welcomeMessage
Sending a welcome message every few seconds
repeat:e2c71bc16c1c48320b5a4569f3ce9f0c:1703153825000 has completed!
Processing job: welcomeMessage
Sending a welcome message every few seconds
repeat:e2c71bc16c1c48320b5a4569f3ce9f0c:1703153890000 has completed!
```

## Step 3 — Customizing BullMQ jobs

In this step, you'll explore how to customize BullMQ jobs by passing custom data and setting job priorities.

In the `index.js` file, add the highlighted code to define another job that takes custom data:

```javascript
[label index.js]
...
[highlight]
export const exportData = (job) => {
  const { name, path } = job.data.jobData;
  console.log(`Exporting ${name} data to ${path}`);
};
[/highlight]

await addJob({ name: "welcomeMessage" });
[highlight]
await addJob({
  name: "dataExport",
  jobData: {
    name: "Sales report",
    path: "/some/path",
  },
});
[/highlight]
```

In this example, the `exportData()` function takes `name` and `path` as data needed for exporting and logs a message for demonstration purposes. You then use the `addJob()` function to add another job, `dataExport`, with information stored under the `jobData` object, providing a name for the exported file and its path.

Save your file and start the `index.js` file again:

```command
node index.js
```

Now, open the `worker.js` in your text editor with the following contents:

```javascript
[label worker.js]
...
[highlight]
import { welcomeMessage, exportData, redisOptions } from "./index.js";
[/highlight]
...
const jobHandlers = {
  welcomeMessage: welcomeMessage,
[highlight]
  dataExport: exportData,
[/highlight]
};
...
```

In this code, you import the `exportData` function and reference the function definition with a `dataExport` property on the `jobHandlers` object.

When you are finished, start the worker again with the following command:

```command
node worker.js
```

You will now see output that looks similar to the following:

```text
[label output]
Processing job: welcomeMessage
Sending a welcome message every few seconds
repeat:e2c71bc16c1c48320b5a4569f3ce9f0c:1703153910000 has completed!
Processing job: dataExport
Exporting Sales report data to /some/path
repeat:c96823c6370cd47135c5b8e1b6727708:1703153980000 has completed!
...
```

Now that you can pass custom data to jobs, let's explore how to set up job priorities so that jobs that don't need immediate execution can be deprioritized, allowing workers to focus on jobs that need immediate attention. To add a priority, you use the `priority` option. When you create a job without this option, it is assigned the highest priority by default.

So, in the `index.js` file, add the following code to allow setting a priority on a job:

```javascript
[label index.js]
...
[highlight]
async function addJob(job, priority) {
[/highlight]
  const options = { repeat: { every: 5000 } };
[highlight]
  if (priority !== undefined) {
    options.priority = priority;
  }
[/highlight]
  await myQueue.add(job.name, job, options);
}

...
[highlight]
await addJob({ name: "welcomeMessage" }, 10);
[/highlight]
...
```

When the `addJob()` function is called with the second argument, the `priority` property is added to the options. Priorities in BullMQ range from `1` to `2,097,152`. The lowest number represents the highest priority, and the priority decreases as the number goes higher.

Run the `index.js` again:

```command
node index.js
```

After that, rerun the worker:

```command
node worker.js
```

With the new priority settings, BullMQ will prioritize the `dataExport` job over the `welcomeMessage` job, executing it first:

```text
[output]
Processing job: welcomeMessage
Sending a welcome message every few seconds
repeat:e2c71bc16c1c48320b5a4569f3ce9f0c:1703154270000 has completed!
Processing job: dataExport
Exporting Sales report data to /some/path
repeat:c96823c6370cd47135c5b8e1b6727708:1703154350000 has completed!
Processing job: dataExport
Exporting Sales report data to /some/path
repeat:c96823c6370cd47135c5b8e1
```
The `dataExport` task is prioritized due to its default higher priority setting. For an in-depth understanding of how job priorities function in BullMQ, consult the [official BullMQ documentation](https://docs.bullmq.io/guide/jobs/prioritized).


## Step 4 — Using cron expressions to schedule jobs
Up to now, you've been scheduling tasks using seconds to define the frequency. However, an alternative and widely used method is [cron expressions](https://betterstack.com/community/guides/linux/cron-jobs-getting-started/). Originating from Unix systems, cron expressions offer a standardized way to schedule recurring tasks with a more granular approach.

A cron expression contains five fields that represent minute, hour, day of the month, month, and day of the week:

```text
"* * * * *"
 | | | | |
 | | | | |
 | | | | day of the week
 | | | month
 | | day of month
 | hour
 minute
```

Here's a quick reference for the values each field can take:

| Field            | Allowed Values  |
| ---------------- | --------------- |
| Minute           | 0-59            |
| Hour             | 0-23            |
| Day of the Month | 1-31            |
| Month            | 1-12 or JAN-DEC |
| Day of the Week  | 0-6 or SUN-SAT  |

To incorporate cron expressions into BullMQ scheduling, you can use the `cron` property within the `repeat` option. Here are a couple of examples showing how to use cron expressions in BullMQ:


```javascript
// Every 3 days
myQueue.add(
  "job_name",
  {
    /* your job data here */
  },
  {
    repeat: {
      cron: "0 0 */3 * *",
    },
  }
);

// Every 3 weeks
myQueue.add(
  "job_name",
  {
    /* your job data here */
  },
  {
    repeat: {
      cron: "0 0 */21 * *",
    },
  }
);
```

The `cron` property provides a cron expression for each job in these code examples. Cron expressions offer a powerful and flexible way to specify exact times and frequencies for your jobs, accommodating complex scheduling needs.

## Step 5 — Scheduling jobs to run once

While you've primarily focused on recurring tasks, there are scenarios where you might need a job to run once or at a specific future time. BullMQ caters to these needs as well.

### Running a job immediately

To have a job run immediately and only once, add it to the queue without the `repeat` option:

```javascript
await myQueue.add("job name", {
  /* your job data here */
});
```

This method will allow BullMQ to execute the job a single time. Once the job is completed, it's marked as completed and won't run again.

### Delaying a job

Sometimes, you may want to postpone a job's execution to a future time. BullMQ allows you to delay a job's start with the `delay` option, where you provide the delay duration in milliseconds.

For instance, to delay a job by 20 seconds, you'd write:

```javascript
await myQueue.add('job name', { /* your job data here */ }, { delay: 20000 });
```

If you aim to schedule a job for a specific future time, calculate the delay from the current time to the desired execution time:

```javascript
const targetTime = new Date("01-01-2040 11:40");
const delay = targetTime - new Date();

await myQueue.add(
  "job name",
  {
    /* your job data here */
  },
  { delay }
);
```

Here, you calculate the `delay` as the time difference between your target and current times. The job will then be scheduled to execute at the exact future time you've specified. 

[ad-uptime]

## Step 6 — Managing BullMQ queues

BullMQ queues are highly configurable, allowing you to dictate how jobs are handled, removed, or added. Here's how you can leverage these features for efficient queue management.

### Automating removal of finished jobs

Once jobs are completed or fail in BullMQ, they're categorized into "completed" or "failed" sections. While advantageous for review during development, these can accumulate, especially in a production environment. To automate the cleanup of these jobs, use the `removeOnComplete` and `removeOnFail` options:


```javascript
await myQueue.add(
  "job name",
  {
    /* your job data here */
  },
  { removeOnComplete: true, removeOnFail: true }
);
```
Setting these options to `true` prompts BullMQ to discard the jobs automatically once they're done. For more detailed insights, refer to the [official documentation](https://docs.bullmq.io/guide/queues/auto-removal-of-jobs).

### Adding jobs in bulk
For scenarios requiring the addition of multiple jobs simultaneously, use the `addBulk()` method. This method ensures atomic addition of jobs — all jobs are added at once, and if an error occurs, none are added:

```javascript
import { Queue } from "bullmq";

const emailQueue = new Queue("email");

// Add email jobs to the queue
const jobs = await emailQueue.addBulk([
  { name: "welcomeEmail", data: { email: "user1@example.com" } },
  { name: "orderConfirmation", data: { email: "user2@example.com" } },
  { name: "passwordReset", data: { email: "user3@example.com" } },
]);
```

### Removing jobs

If you need to clear out waiting or delayed jobs, BullMQ provides methods to do so. Note, however, that active, completed, failed, or waiting-children jobs won't be affected:

```javascript
import { Queue } from "bullmq";

const queue = new Queue("email");

await queue.drain();
```

BullMQ also has other methods that allow you to remove all jobs, which you can find [in the documentation](https://docs.bullmq.io/guide/queues/removing-jobs).

### Pausing and resuming queues

There might be instances where pausing a queue is necessary. When paused, workers won't pick new jobs from the queue. Pause and resume a queue as follows:

```javascript
// Pausing the queue
await myQueue.pause();

// Resuming the queue
await myQueue.resume();
```

Now that you can manage the queues, let's review how to manage workers.

## Step 7 — Managing BullMQ workers

Workers are crucial in BullMQ for processing tasks from the queue. They have various properties and methods to tailor their behavior to your needs.

### Setting up concurrency

BullMQ allows you to set up concurrency, which determines how many jobs a worker can process simultaneously. You can configure this with the `concurrency` option:

```javascript
import { Worker, Job } from "bullmq";

const worker = new Worker(
  queueName,
  async (job: Job) => {
    // Do something with the job
  },
  { concurrency: 60 }
);
```

Alternatively, you can achieve concurrency by having multiple workers, and the documentation recommends this approach over using the `concurrency` option. This not only allows for distributed processing across machines but also provides a more scalable solution:

```javascript
// Worker 1
const worker = new Worker("myQueue", async (job) => {
  console.log(`Worker 1 processing job: ${job.id}`);
  // Your job processing logic here
});

// Worker 2
const worker = new Worker("myQueue", async (job) => {
  console.log(`Worker 2 processing job: ${job.id}`);
  // Your job processing logic here
});
```

### Pausing and resuming workers

There may be situations where you need to halt a worker's activity temporarily. You can pause a worker, causing it to finish its current jobs before stopping, using the `pause()` method:

```javascript
await myWorker.pause();
```

If you prefer the worker to stop immediately without waiting for active jobs to complete, pass `true`:


```javascript
await myWorker.pause(true);
```

To unpause the worker, use the `resume()` method:

```javascript
await myWorker.resume();
```

## Step 8 — Scheduling database backups with BullMQ

This step teaches you how to create a simple script using BullMQ to automate backups of a MongoDB database.

Begin by opening the `backup.js` file with the following code:


```javascript
[label backup.js]
import { spawn } from 'child_process';
import { format } from 'date-fns';

const dbName = 'admin';
const compressionType = '--gzip';

const getFormattedDateTime = () => {
  return format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
};

const backupDatabase = async () => {
  return new Promise((resolve, reject) => {
    const currentDateTime = getFormattedDateTime();
    const backupFileName = `./backup-${currentDateTime}.gz`;

    console.log(`Starting database backup: ${backupFileName}`);

    const backupProcess = spawn('mongodump', [
      `--db=${dbName}`,
      `--archive=${backupFileName}`,
      compressionType,
    ]);

    backupProcess.on('error', (err) => {
      reject(new Error(`Failed to start backup process: ${err.message}`));
    });

    backupProcess.on('exit', (code, signal) => {
      if (code) {
        reject(new Error(`Backup process exited with code ${code}`));
      } else if (signal) {
        reject(
          new Error(`Backup process was terminated with signal ${signal}`)
        );
      } else {
        console.log(
          `Database "${dbName}" successfully backed up to ${backupFileName}`
        );
        resolve();
      }
    });
  });
};

// Initiate the database backup
backupDatabase().catch((err) => console.error(err));
```


Here, you use the `spawn()` function from the [`child_process`](https://nodejs.org/api/child_process.html) module to run `mongodump`, a MongoDB utility designed for creating backups. The specified database name is `admin`, which is inherently available by default. Additionally, you configure compression settings, and a filename with a timestamp is dynamically generated for the backup.

Next, the `backupDatabase()` function has error handling for terminating the process and also logging success.

Before running the script, confirm MongoDB is installed and running:

```command
sudo systemctl start mongod.service
```
You will see output similar to this confirming that MongoDB is running:

```text
[output]
● mongod.service - MongoDB Database Server
     Loaded: loaded (/lib/systemd/system/mongod.service; disabled; vendor preset: enabled)
     Active: active (running) since Thu 2023-12-21 15:06:09 UTC; 51s ago
       Docs: https://docs.mongodb.org/manual
   Main PID: 8684 (mongod)
     Memory: 73.0M
        CPU: 1.378s
     CGroup: /system.slice/mongod.service
             └─8684 /usr/bin/mongod --config /etc/mongod.conf
```
Run the script with this command:

```command
node backup.js
```

You will observe output that looks similar to this:

```text
[output]
Starting database backup: ./backup-2023-12-21_15-08-42.gz
Database "admin" successfully backed up to ./backup-2023-12-21_15-08-42.gz
```

Next, list the directory contents to confirm that the backup file has been created:

```command
ls
```

The output will contain the created archive like so:

```text
[output]
backup-2023-12-21_15-08-42.gz
...
```

Now, to schedule recurring backups with BullMQ, modify the `backup.js` file by adding a queue and job scheduling function:

```javascript
[label backup.js]
...
import { format } from "date-fns";
[highlight]
import { Queue } from "bullmq";

export const redisOptions = { host: "localhost", port: 6379 };
const backupQueue = new Queue("backupQueue", { connection: redisOptions });
[/highlight]
...
[highlight]
export const backupDatabase = async () => {
[/highlight]
  ...
}
...
// Initiate the database backup
backupDatabase().catch((err) => console.error(err));

[highlight]
async function addJob(job) {
  const options = { repeat: { every: 60000 } };
  await backupQueue.add(job.name, job, options);
}

await addJob({ name: "backupMongoDB" });
[/highlight]
```

This code is similar to what you have seen earlier in the article. The `addJob()` function adds a new job `backupMongoDB` to the `backupQueue`. You then export the `backupDatabase()` function and the `redisOptions` so that they can be used in a file containing a BullMQ  worker.

Run the `index.js` file:

```command
node index.js
```

Then, define a worker to process the backup job by creating a `backup-worker.js` file, and then adding the following code:

```javascript
[label backup-worker.js]
import { Worker } from "bullmq";
import { backupDatabase, redisOptions } from "./backup.js";

const processJob = async (job) => {
  console.log(`Processing job: ${job.name}`);
  await backupDatabase(job);
};

const worker = new Worker("backupQueue", processJob, {
  connection: redisOptions,
});

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

console.log("Worker started!");
```

In this code, you set up a worker to invoke and execute the `backupDatabase()` function.

Next, start the worker:

```command
node backup-worker.js
```

Keep the worker running for a few minutes, and observe as it automatically backs up your database at the specified intervals:

```text
[output]
Processing job: backupMongoDB
Starting database backup: ./backup-2023-12-21_15-16-00.gz
Database "admin" successfully backed up to ./backup-2023-12-21_15-16-00.gz
repeat:565112efdb4682ea9115e85543a22c15:1703171760000 has completed!
Processing job: backupMongoDB
Starting database backup: ./backup-2023-12-21_15-17-00.gz
Database "admin" successfully backed up to ./backup-2023-12-21_15-17-00.gz
repeat:565112efdb4682ea9115e85543a22c15:1703171820000 has completed!
```

Now, list the directory to see a growing list of backup files in your directory:


```command
ls
```
```text
[output]
...backup-2023-12-21_15-08-42.gz  backup-2023-12-21_15-15-00.gz  backup-2023-12-21_15-17-00.gz  backup-2023-12-21_15-19-00.gz...
```

With your jobs now scheduled and running smoothly, the next step is implementing Bull Board, a user-friendly interface that allows easy management and monitoring of your queued jobs.

## Step 9 — Job monitoring with Bull Dashboard
If you prefer a visual interface for monitoring and managing jobs, [Bull Dashboard](https://github.com/felixmosh/bull-board#readme) provides a convenient solution. This tool offers a comprehensive view of your queues, their jobs, and their statuses.

To integrate the Bull Dashboard, first, install the necessary packages:

```command
npm i express @bull-board/express
```

Once installed, integrate Bull Dashboard into your `backup.js` file with the following additions:


```javascript
[label backup.js]
import { spawn } from "child_process";
// ...
[highlight]
import express from "express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { ExpressAdapter } from "@bull-board/express";
[/highlight]

export const redisOptions = { host: "localhost", port: 6379 };

const backupQueue = new Queue("backupQueue", { connection: redisOptions });

[highlight]
const serverAdapter = new ExpressAdapter();
const bullBoard = createBullBoard({
  queues: [new BullMQAdapter(backupQueue)],
  serverAdapter: serverAdapter,
});

serverAdapter.setBasePath("/admin");

const app = express();
app.use("/admin", serverAdapter.getRouter());
[/highlight]

// ...
app.listen(3000, function () {
  console.log("Server running on port 3000");
});
```

In this modification, Bull Board is initialized using `createBullBoard()` with a `backupQueue`. A middleware is set up for the `/admin` route, and a server is created to run on port `3000`.

Once you've made these changes, run the `backup.js` file:

```bash
node backup.js
```

In your browser, navigate to `http://localhost:3000/admin`. You should see a dashboard similar to the screenshot provided:

![Bull Dashboard Screenshot](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a6b31285-c381-434c-96b8-a94f04233600/md2x =3024x1766)

The dashboard allows you to view all the jobs in the queue, inspect detailed job information, and observe delayed, prioritized, or paused jobs:

![Bullboard latest jobs](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/72dc7dd3-8278-4345-13f2-df4d65a8b600/public =3024x1764)

## Step 10 — Monitoring scheduled jobs in production

When automating tasks, having a monitoring system is crucial to alert you to any issues. A prime example of the importance of diligent monitoring is Gitlab's data loss incident due to a failed backup process, as detailed in their [post-mortem](https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/). This highlights the need for robust monitoring of scheduled tasks to ensure prompt awareness and resolution of issues.

One tool for this purpose is [Better Stack](https://betterstack.com/uptime), which actively monitors your jobs and alerts you through various channels like text, Slack, emails, or phone calls if any issues arise. This helps you stay informed about your job status and quickly address any problems.

If you prefer a quick walkthrough before you implement it, you can watch this short Heartbeats overview. If you would rather jump straight into the setup, skip the video and follow the steps below.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/H8ruTb4C2sM" title="Better Stack Heartbeats overview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


First, sign up for a free [Better Stack account](https://uptime.betterstack.com/users/sign-up) and find the **Heartbeats** section on the sidebar. Click the **Create Heartbeat** button:

![Screenshot of the Better Stack interface that allows you to create a heartbeat](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1d672723-096a-42eb-3c8e-f6c9e4368200/lg1x =3024x1705)

Next, name your monitor and specify the frequency of your job execution. In the **On-call escalation** section, select how you would like to be notified. When you are finished, click **Create Heartbeat**:

![Screenshot showing Better Stack interface with options for creating a heartbeat](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2ebcabdc-07fa-4daf-568b-4be18d793900/lg2x =3024x2168)

You will then be redirected to the Heartbeat page, which it will provide you with a new endpoint you can use to monitor your task:

![Screenshot showing the heartbeat endpoint created](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cd8491b7-358f-404d-a437-a356c6a6ad00/lg2x =2106x1994)

Now copy the URL and return  to your text editor. Open the `.env` file and add the following content. Replace `<your_heartbeat_url>` with the URL:

```text
[label .env]
HEARTBEAT_URL='<your_heartbeat_url>'
```

Following that, install the [dotenv](https://www.npmjs.com/package/dotenv) package, which allows you to use environmental variables:

```command
npm install dotenv 
```

Next, open the `backup-worker.js` file and use fetch to send a request to the Heartbeat URL once the job succeeds:

```javascript
[label backup.js]
[highlight]
import 'dotenv/config';
[/highlight]
. . .
const processJob = async (job) => {
  console.log(`Processing job: ${job.name}`);
  await backupDatabase(job);
[highlight]
  const response = await fetch(process.env.HEARTBEAT_URL);
  if (!response.ok) throw new Error(response.statusText);
[/highlight]
};
. . .
```

Ensure that the monitoring step is added where the monitored task executes successfully so that any failure or errors trigger an alert.

Save the file and run the `backup-worker.js` file again:

```command
node backup-worker.js
```

The scheduled backups will now process the jobs as before. When the first backup is successful, Better Stack will confirm that the task is "UP":

![Screenshot of Better Stack showing the scheduled job status is "UP"](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1b9652f5-6674-450c-7740-ef1657627f00/md1x =2126x2664)

To simulate the job failing, stop the script and wait for a few minutes. When it stops, requests won't be sent to Better Stack anymore. As a result, Better Stack's status will update to `"Down"` and send an alert to your preferred channels.

![Screenshot of Better Stack showing the scheduling backup job is down](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4f3c58e1-cca3-4460-4f37-3109d2ca1e00/orig =2115x2684)

![Screenshot of an email sent By Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b8eb351f-769b-4328-8161-0e53b5ca4700/lg2x =1602x1313)

With this setup, you can be more aware that the backup tasks are running, and if there is any problem, you will be alerted. Another good idea is to log the reason for the failures so that you can review them and quickly fix the issue and have your jobs running. See our [Node.js logging guide](https://betterstack.com/community/guides/logging/nodejs-logging-best-practices/) for more details.

[summary]
### Turn missed Heartbeats into a clean incident workflow
When a scheduled job misses a Heartbeat, you can escalate to the right on call person, coordinate the response in Slack or Microsoft Teams, and document what happened with post mortems.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/l2eLPEdvRDw" title="On call and incident workflow walkthrough" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Final thoughts
Throughout this tutorial, we employed BullMQ for scheduling tasks in Node.js and explored its diverse capabilities. Furthermore, we established a monitoring system to alert you if a scheduled task goes wrong.

For further learning, consider exploring the documentation for [BullMQ](https://docs.bullmq.io/) and [Better Stack](https://betterstack.com/docs/).

Thank you for reading, and happy coding!