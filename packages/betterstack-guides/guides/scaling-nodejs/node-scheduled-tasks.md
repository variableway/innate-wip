# Job Scheduling in Node.js with Agenda: A Beginner's Guide

Task scheduling is an essential component in modern web applications, especially
when dealing with operations that are resource-intensive or time-sensitive.

In the Node.js ecosystem, one of the most efficient and versatile tools for this
purpose is [Agenda](https://github.com/agenda/agenda). It's a lightweight yet
powerful library that simplifies the management of background jobs, ranging from
simple tasks like sending out periodic emails to more complex operations like
data processing and report generation.

Agenda supports flexible scheduling using both human-readable time formats and
cron syntax, offering developers a familiar and intuitive approach to defining
task execution times.

Moreover, its ability to persist job data in MongoDB ensures that scheduled
tasks are not lost during application downtime, making it an ideal choice for
production environments where reliability is key.

This article will demonstrate using Agenda in Node.js, exploring its setup,
basic to advanced usage, and best practices, thus providing a comprehensive
guide for anyone looking to implement effective task scheduling in a Node.js
application.

Let's get started!

[ad-uptime-small]

## Prerequisites

Before starting this tutorial, ensure that your system has the latest LTS
version of [Node.js installed](https://nodejs.org/en/download). Agenda relies on
MongoDB to store its jobs so you must install it by following the instructions
on the
[MongoDB documentation page](https://www.mongodb.com/docs/manual/administration/install-community/).

Once installed, verify that the MongoDB server is running by executing the
following:

```command
sudo systemctl status mongod
```

You should see the text "Active: active (running)," confirming that MongoDB is
active and running successfully:

```text
 mongod.service - MongoDB Database Server
     Loaded: loaded (/lib/systemd/system/mongod.service; disabled; vendor prese>
     Active: active (running) since Mon 2023-11-20 18:03:32 UTC; 3 days ago
       Docs: https://docs.mongodb.org/manual
   Main PID: 7543 (mongod)
     Memory: 101.7M
        CPU: 46min 1.223s
     CGroup: /system.slice/mongod.service
             └─7543 /usr/bin/mongod --config /etc/mongod.conf

Nov 20 18:03:32 testing-node systemd[1]: Started MongoDB Database Server.
Nov 20 18:03:32 testing-node mongod[7543]: {"t":{"$date":"2023-11-20T18:03:32.1...
```

If the output indicates "Active: inactive (dead)," start the MongoDB service
with the following command:

```command
sudo systemctl start mongod
```

## Step 1 — Setting up the project directory

Now that MongoDB up and running, clone the following
[GitHub repository](https://github.com/betterstack-community/nodejs-scheduled-tasks)
containing the basic code to get started:

```command
git clone https://github.com/betterstack-community/nodejs-scheduled-tasks.git
```

Navigate to the newly created directory:

```command
cd nodejs-scheduled-tasks
```

Next, run the following command to install the dependencies for the project,
which include [Agenda](https://www.npmjs.com/package/agenda),
[dotenv](https://www.npmjs.com/package/dotenv), and
[date-fns](https://www.npmjs.com/package/date-fns):

```command
npm install
```

Once the installation is completed, open the project in your text editor and
create a new `.env` file at the project root:

```command
code .env
```

Populate the file with the following contents:

```text
[label .env]
MONGO_URI=mongodb://localhost/agendaDB
```

This sets the MongoDB connection string for the project, ensuring that Agenda
can connect to it reliably.

Once you're done, proceed to the next step where you'll learn to schedule tasks
with Agenda.

## Step 2 — Scheduling tasks with Agenda

In this section, you'll go over the basics of task scheduling in Node.js with
Agenda. Start by opening the `index.js` file as follows:

```command
code index.js
```

```javascript
[label index.js]
import 'dotenv/config';
import Agenda from 'agenda';

const mongoConnectionString = process.env.MONGO_URI;

const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define('welcomeMessage', () => {
  console.log('Sending a welcome message every few seconds');
});

await agenda.start();

await agenda.every('5 seconds', 'welcomeMessage');
```

A new Agenda instance is created with the MongoDB connection string, enabling it
to store job data in the database. The code defines a `welcomeMessage` job which
logs a message to the console.

Finally, the `start()` method is used to initiate job processing, followed by
the `every()` method which runs the `welcomeMessage` task every five seconds.

When you execute the program, you will observe that the message is logged to the
console every five seconds:

```command
node index.js
```

```text
[output]
Sending a welcome message every few seconds
Sending a welcome message every few seconds
Sending a welcome message every few seconds
Sending a welcome message every few seconds
```

To confirm job storage in the database, halt the program with `CTRL+C` and
access the MongoDB shell:

```command
mongosh
```

In the shell, list all the databases:

```command
test> show databases
```

You will see output similar to the following:

```text
[output]
admin      40.00 KiB
agendaDB   92.00 KiB
config    108.00 KiB
local      40.00 KiB
```

The `agendaDB` database has been created, indicating successful storage of jobs.

Next, set the current database to `agendaDB`:

```text
test> use agendaDB
```

You will see the confirmation:

```text
[output]
switched to db agendaDB
```

Next, list all the collections:

```text
agendaDB> show collections
```

```text
[output]
agendaJobs
```

View the collection contents with the following:

```text
agendaDB> db.agendaJobs.find().pretty()
```

```javascript
[output]
[
  {
    _id: ObjectId("6564f4f0559ca345dcb11cce"),
    name: 'welcomeMessage',
    type: 'single',
    data: {},
    endDate: null,
    lastModifiedBy: null,
    nextRunAt: ISODate("2023-11-27T19:59:35.369Z"),
    priority: 0,
    repeatInterval: '5 seconds',
    repeatTimezone: null,
    shouldSaveResult: false,
    skipDays: null,
    startDate: null,
    lockedAt: null,
    lastRunAt: ISODate("2023-11-27T19:59:30.369Z"),
    lastFinishedAt: ISODate("2023-11-27T19:59:30.375Z")
  }
]
```

The output displays information related to the defined job, including its name,
repetition interval, and other essential details. This confirms that Agenda can
communicate with your MongoDB database successfully.

To exit the shell, use the following command:

```text
agendaDB> exit
```

Now that you've seen the basic way to schedule tasks with Agenda, the next one
will discuss some ways to configure the Agenda instance.

## Step 3 — Exploring the Agenda options

Agenda is highly configurable, allowing you to define the frequency of MongoDB
database queries and adjust the processing interval based on the urgency of the
task execution. Let's look at a few notable options that it provides:

- `db`: allows you to define the MongoDB connection string and collection name
  which defaults to `agendaJobs`.

  ```javascript
  const agenda = new Agenda({
    db: { address: process.env.MONGO_URI, collection: 'scheduledTasks' },
  });
  ```

- `mongo`: instead of using the `db` option to create a new database connection,
  you can use an existing mongodb client instance, such as the one provided by
  the
  [native MongoDB Driver for Node.js](https://github.com/mongodb/node-mongodb-native/).

  ```javascript
  const agenda = new Agenda({ mongo: mongoClientInstance.db('agendaDb') }
  ```

- `name`: allows you to identify an Agenda instance by name. It corresponds to
  the `lastModifiedBy` field in the jobs collection.

  ```javascript
  const agenda = new Agenda({ name: 'test queue' });
  ```

- `processEvery`: sets how frequently the database is queried to find pending
  jobs that need to be processed. The default is every five seconds.

  ```javascript
  const agenda = new Agenda({ processEvery: '5 minutes' });
  ```

- `maxConcurrency`: specifies the maximum number of jobs that can be run

  ```javascript
  concurrently. It is set to 20 jobs by default.

  const agenda = new Agenda({ maxConcurrency: 50 });
  ```

- `defaultConcurrency`: sets the default number of a specific job that can be
  run at any given moment:

  ```javascript
  const agenda = new Agenda({ defaultConcurrency: 5 });
  ```

- `lockLimit`: specifies the maximum number of jobs that can be locked at any
  given moment. Defaults to zero which indicates no limit.

- `defaultLockLimit`: indicates the maximum number of a specific job that can be
  locked simultaneously. Also defaults to zero.

Ensure to check out the docs for more information on the various
[setup options](https://www.npmjs.com/package/agenda#configuring-an-agenda)
available.

## Step 4 — Customizing Agenda jobs

Scheduled tasks often need additional data for effective execution, and Agenda
accommodates this requirement gracefully. It offers the ability to pass custom
data to each task, ensuring that tasks have all the necessary context and
parameters to execute correctly.

This feature is particularly useful for tasks that rely on dynamic or external
data, like processing user information, generating reports based on
time-specific data, or sending personalized emails. You can easily attach
relevant data to a task at the time of its scheduling, which Agenda then
persists alongside the task details in the database.

In your `index.js` file, add the highlighted lines below to define another job:

```javascript
[label index.js]
. . .
[highlight]
agenda.define('dataExport', (job) => {
  const { name, path } = job.attrs.data;
  console.log(`Exporting ${name} data to ${path}`);
});
[/highlight]

await agenda.start();

await agenda.every('5 seconds', 'welcomeMessage');

[highlight]
await agenda.every('5 seconds', 'dataExport', {
  name: 'Sales report',
  path: '/home/username/sales_report.csv',
});
[/highlight]
```

In this example, a `dataExport` job is scheduled to run every five seconds and
it can access the data object passed to it under `jobs.attrs.data`.

Save and run the file to observe the following output:

```command
node index.js
```

```text
[output]
Sending a welcome message every few seconds
Exporting Sales Report data to /home/username/sales_report.csv
Sending a welcome message every few seconds
Exporting Sales Report data to /home/username/sales_report.csv
```

Now that you have learned how to pass custom data to jobs for execution, the
next step is establishing job priorities.

When you have more than one scheduled task, you may want to guarantee that one
is performed before another. This is where setting a priority level comes in
handy. Here's how to do this:

```javascript
[label index.js]
. . .
[highlight]
agenda.define('dataExport', { priority: 'high' }, (job) => {
[/highlight]
  const { name, path } = job.attrs.data;
  console.log(`Exporting ${name} data to ${path}`);
});
. . .
```

You can use the following values for the `priority` property:

- `lowest`
- `low`
- `normal`
- `high`
- `highest`

Optionally, you can also pass numbers instead of strings, which have the
following mappings:

- highest: `20`
- high: `10`
- normal: `0`
- low: `-10`
- lowest: `-20`

Agenda will now prioritize this task over others and ensure it is processed
promptly:

```text
[output]
Exporting Sales Report data to /home/username/sales_report.csv
Sending a welcome message every few seconds
Exporting Sales Report data to /home/username/sales_report.csv
Sending a welcome message every few seconds
```

As you can see in the output, the `dataExport` job is now logged first because
it has a higher priority. Ensure to
[review the documentation](https://github.com/agenda/agenda#what-is-the-order-in-which-jobs-run)
to learn more about how tasks are prioritized in Agenda.

## Step 5 — Setting the right schedule frequency

Up till now, we've only scheduled jobs at second-based intervals for
demonstration purposes. However, Agenda provides more versatile scheduling
options using both human-readable intervals and [cron
expressions](https://betterstack.com/community/guides/linux/cron-jobs-getting-started/).

### Using human intervals

Agenda supports [human intervals](https://github.com/agenda/human-interval/),
allowing you to schedule jobs in seconds, minutes, hours, days, weeks, months
(assumes 30 days), and years (assumes 365 days):

```javascript
agenda.every('1 second', '<job_name>');
agenda.every('2 minutes and 15 seconds', '<job_name>');
agenda.every('2 hours and 30 minutes', '<job_name>');
agenda.every('3 days', '<job_name>');
agenda.every('3 weeks', '<job_name>');
agenda.every('1 month and 2 weeks', '<job_name>');
agenda.every('2 years and 6 months', '<job_name>');
```

### Using cron expressions

You also have the option to utilize cron expressions, a standardized syntax used
in Unix systems for defining recurring tasks. A cron expression consists of five
fields representing minute, hour, day of the month, month, and day of the week:

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

For each field, the following are the allowed values:

| Field            | Allowed Values  |
| ---------------- | --------------- |
| Minute           | 0-59            |
| Hour             | 0-23            |
| Day of the Month | 1-31            |
| Month            | 1-12 or JAN-DEC |
| Day of the Week  | 0-6 or SUN-SAT  |

Here are some of the cron expression equivalents:

```javascript
agenda.every('0 0 */3 * *', '<job_name>'); // 3 days
agenda.every('0 0 */21 * *', '<job_name>'); // 3 weeks
agenda.every('0 0 1 */1 *', '<job_name>'); // 1 month
agenda.every('0 0 1 */2 *', '<job_name>'); // 2 months
```

## Step 6 — Scheduling jobs to run once

We have explored scheduling recurring jobs, but there are occasions when you
might need to run a job once. Agenda offers several methods designed explicitly
for preparing single-execution jobs.

### Using the `schedule()` method

Agenda's `schedule()` method allows you to set a job to run at a specified time.

```javascript
await agenda.schedule('tomorrow at noon', '<job_name>', {
  jobData: 'data the job needs',
});
```

In the example, the task is scheduled to occur tomorrow at noon. Once this task
executes at the scheduled time, it will not repeat, making it a one-time event.

This functionality is helpful for tasks that need to be executed at a specific
time but do not require recurring execution.

### Using the `now()` method

For instances where immediate job execution is required, the `now()` method may
be used:

```javascript
await agenda.now('<job_name>', {
  jobData: 'data the job needs',
});
```

The job should be executed immediately and stop after that.

## Step 7 — Managing Agenda jobs

Agenda provides effective tools for managing active jobs, giving you the
flexibility to cancel or disable them when necessary.

### Canceling a scheduled job

To cancel a job, you use the `cancel()` method, demonstrated here:

```javascript
await agenda.cancel({ name: '<job_name>' });
```

This makes sense when you want to cancel an active job under certain conditions.
Once the job is canceled, it will be deleted entirely from the MongoDB
collection.

### Disabling and enabling jobs

An alternative to canceling jobs is to temporarily prevent their execution using
the `disable()` method:

```javascript
await agenda.disable({ name: '<job_name>' });
```

When needed, you can re-enable the job using the `enable()` method:

```javascript
await agenda.enable({ name: '<job_name>' });
```

These methods offer flexibility in controlling when specific jobs should or
should not be executed.

### Listing jobs

Use the `agenda.jobs()` method to iterate over all running jobs. The following
code demonstrates how to achieve this:

```javascript
[label index.js]
. . .
async function listJobs() {
  const jobs = await agenda.jobs({});
  jobs.forEach((job) => {
    console.log(
      `Job ID: ${job.attrs._id}, Name: ${
        job.attrs.name
      }, Data: ${JSON.stringify(job.attrs.data)}`
    );
  });
}

listJobs();
```

The given code snippet features the `listJobs()` function, which utilizes the
`agenda.jobs()` method to fetch all current jobs. This function loops through
each job, outputting details like the job's ID, name, and associated data.

Run the script:

```command
node index.js
```

You will observe the following output listing the running jobs:

```text
[output]
. . .
Job ID: 6564f4f0559ca345dcb11cce, Name: welcome message, Data: {}
Job ID: 65658eee5479599ee60f23cb, Name: exporting data, Data: {"database":"Sales Report","path":"/home/username/sales_report.csv"}
```

When iterating over jobs, you can do more than print their contents. See the
[following instance methods](https://www.npmjs.com/package/agenda#manually-working-with-a-job)
for more details.

## Step 8 — Scheduling database backups with Agenda

In this section, you'll build a sample script that backs up a MongoDB database
into archives.

Now, open the `backup.js` file with the following contents:

```javascript
[label backup.js]
import { spawn } from 'child_process';
import { format } from 'date-fns';

const dbName = 'agendaDB';
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

This code imports the `spawn()` method from the `child_process` module and uses
it to initiate a child process for the
[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump) tool, which
backs up the MongoDB databases.

The `backupDatabase()` function also includes error-handling strategies for
subprocess termination and success logging.

When you execute the script, you will observe the following output confirming a
successful backup operation:

```text
[output]
Starting database backup: ./backup-2023-11-29_07-55-30.gz
Database "agendaDB" successfully backed up to ./backup-2023-11-29_07-55-30.g
```

List the directory contents to verify the creation of the backup archive:

```command
ls
```

The directory listing should include the newly created backup archive:

```text
[output]
backup-2023-11-27_20-31-57.gz
. . .
```

Instead of executing the backup once, let's use Agenda to repeat the task
continuously. Create a new `schedule.js` script as follows:

```javascript
[label schedule.js]
import 'dotenv/config';
import Agenda from 'agenda';

const mongoConnectionString = process.env.MONGO_URI;

const agenda = new Agenda({ db: { address: mongoConnectionString } });

export async function scheduleTask(name, frequency, callback) {
  try {
    await agenda.define(name, { priority: 'high' }, async (job, done) => {
      await callback();
      done();
    });

    await agenda.start();
    await agenda.every(frequency, name);
  } catch (error) {
    throw new Error(`Error scheduling task '${name}': ${error.message}`);
  }
}
```

The exported `scheduleTask()` function accepts three arguments: the `name` of
the job, the `frequency` representing the intervals, and the `callback` function
containing the actual task. It uses `agenda.define()` to define the job, while
the `agenda.every()` method runs the job according to the given frequency.

Return to the `backup.js` file and modify it as follows to enable job
scheduling:

```javascript
[label backup.js]
import { spawn } from 'child_process';
import { format } from 'date-fns';
[highlight]
import { scheduleTask } from './schedule.js';
[/highlight]

. . .

const backupDatabase = async () => {
. . .
};

[highlight]
async function runBackup() {
  try {
    await backupDatabase();
  } catch (err) {
    console.err(`Error while backing up DB: ${err}`);
  }
}

try {
  await scheduleTask('backupMongoDB', '1 minute', runBackup);
  console.log('Backup task scheduled successfully');
} catch (err) {
  console.log(`Failed to schedule backup task: ${err}`);
}
[/highlight]
```

The `scheduleTask()` function is imported and invoked with the necessary
parameters, such as the task name, frequency intervals, and the `backupDatabase`
function.

Execute the program by typing:

```command
node backup.js
```

Keep the program running for a few minutes to observe the execution of the
backup task:

```text
[output]
Backup task scheduled successfully
Starting database backup: ./backup-2023-11-29_08-08-08.gz
Database "agendaDB" successfully backed up to ./backup-2023-11-29_08-08-08.gz
Starting database backup: ./backup-2023-11-29_08-09-08.gz
Database "agendaDB" successfully backed up to ./backup-2023-11-29_08-09-08.gz
Starting database backup: ./backup-2023-11-29_08-10-08.gz
Database "agendaDB" successfully backed up to ./backup-2023-11-29_08-10-08.gz
```

When you list the directory contents, you will observe several archive files,
confirming that the script is functioning as expected:

```command
ls
```

```text
[output]
backup-2023-11-27_20-37-23.gz
backup-2023-11-27_20-31-57.gz
backup-2023-11-27_20-35-23.gz
backup-2023-11-27_20-36-23.gz
. . .
```

## Step 9 — Job monitoring with Agendash

To monitor and manage your scheduled jobs, you can use the
[Agendash](https://github.com/agenda/agendash) package which is provided by the
Agenda team. It lets you schedule new jobs, monitor their progress, and stop or
delete them without writing code.

To use Agendash, install the [agendash](https://www.npmjs.com/package/agendash)
package:

```command
npm i agendash
```

It comes with a standalone Express app, which you can use like this:

```command
npx agendash --db=mongodb://localhost/agendaDB --collection=agendaJobs --port=3002
```

```text
[output]
Agendash started http://localhost:3002
```

Visit http://localhost:3002 to see the dashboard in action:

![Screenshot of the Agenda dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1ce28f29-6e4b-47cd-86ba-926426ff6a00/lg1x =3024x1752)

This dashboard allows you to see all tasks that are in the queue, create new
tasks, and check the due times of these tasks, along with other features.

You can also use it as a middleware function for your Node.js server so that you
can mount it on a specific route in your application (such as `/dash`). See the
[documentation](https://www.npmjs.com/package/agendash#middleware-usage) for
more details.

## Step 10 — Getting alerted to job failures

When implementing scheduled tasks, it's necessary to plan for the possibility of
task failures, which can arise for various reasons. To avoid being oblivious to
such failures, you must set up a monitoring system that will notify you when
they occur.

A notable example of the consequences of insufficient monitoring is the
significant data loss that GitLab suffered in 2017 following a backup process
failure, as discussed in
[their post mortem](https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/).
This incident underscores the importance of vigilant monitoring to ensure prompt
awareness and response to any issues that may arise.

In this section, we'll introduce [Better Stack](https://betterstack.com/uptime)
for monitoring the scheduled database backup job. Better Stack actively monitors
the execution of your scheduled jobs and promptly notifies you of any anomalies
or failures.

These alerts can be configured to reach you through various channels, including
Slack, SMS, emails, or even direct phone calls, ensuring you're immediately
informed should any of your scheduled jobs encounter problems. This proactive
approach to monitoring significantly mitigates the risk of unnoticed failures
and the potential damage that it could cause.

To get started, sign up for a free
[Better Stack account](https://uptime.betterstack.com/users/sign-up) and find
the **Heartbeats** section on the sidebar. Click the **Create Heartbeat**
button:

![Screenshot of Better Stack interface that allows you to create  a heartbeat](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1d672723-096a-42eb-3c8e-f6c9e4368200/lg1x
=3024x1705)

Provide a suitable name for your monitor and select how often you expect the
scheduled job to be repeatedly executed. In the **On-call escalation** section,
select how you would like to be notified. Once you are done, click **Create
Heartbeat**:

![Screenshot showing Better Stack interface with options for creating a heartbeat](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2ebcabdc-07fa-4daf-568b-4be18d793900/lg2x
=3024x2168)

You will be redirected to the Heartbeat page, where a new endpoint to monitor
the task is presented to you:

![Screenshot showing the heartbeat endpoint created](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cd8491b7-358f-404d-a437-a356c6a6ad00/lg2x =2106x1994)

Copy the URL, and return to your text editor where you'll make the following
modifications to your `.env` file:

```text
[label .env]
MONGO_URI='mongodb://localhost/agendaDB'
[highlight]
HEARTBEAT_URL='<your_heartbeat_url>'
[/highlight]
```

Next, open the `backup.js` file and send a request to the Heartbeat URL once the
job succeeds:

```javascript
[label backup.js]
. . .
async function runBackup() {
  try {
    await backupDatabase();
    [highlight]
    const response = await fetch(process.env.HEARTBEAT_URL);
    if (!response.ok) throw new Error(response.statusText);
    [/highlight]
  } catch (err) {
    console.error(`Error while backing up DB: ${err}`);
  }
}
. . .
```

Ensure that your monitoring setup for scheduled tasks sends a request only when
the task is completed successfully. This way, any execution failures or errors
occurring during the task's runtime will trigger the alert system.

Save the file and execute the `backup.js` file once again:

```command
node backup.js
```

The scheduled backups should proceed as before. Once the first backup succeeds,
Better Stack will confirm that the job is "UP":

![Screenshot of Better Stack showing the scheduled job status is "UP"](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1b9652f5-6674-450c-7740-ef1657627f00/md1x =2126x2664)

To simulate job failure, stop the script and wait for a few minutes. Since no
requests were sent to Better Stack for the configured duration, the status of
the job will be updated to "Down", and you will promptly receive alerts to the
configured channels:

![Screenshot of Better Stack showing the scheduling job is down](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4f3c58e1-cca3-4460-4f37-3109d2ca1e00/orig =2115x2684)

![Screenshot of an email sent By Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/111dfbd8-bca0-46b1-9ff5-d4a2b6864000/md1x
=1611x1326)

With this confirmation, you can rest easier at night knowing that your backups
are running smoothly, and an alert system is in place to notify you if anything
changes.

It's also a good idea to log the reason for failure so that you can quickly fix
the issue and get your jobs back up and running quickly. See our [Node.js
logging guide](https://betterstack.com/community/guides/logging/nodejs-logging-best-practices/) for more details.

## Final thoughts

In this tutorial, we delved into the capabilities of Agenda for task scheduling
in Node.js, and you learned to implement monitoring and alerting for your
scheduled tasks in case something goes wrong.

For further exploration, ensure to check out the documentation for
[Agenda](https://github.com/agenda/agenda#readme) and
[Better Stack](https://betterstack.com/docs/).

Thanks for reading, and happy coding!
