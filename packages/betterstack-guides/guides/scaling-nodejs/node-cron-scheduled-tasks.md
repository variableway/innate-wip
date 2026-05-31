# Job Scheduling in Node.js with Node-cron

[Node-cron](https://www.npmjs.com/package/node-cron) is a popular Node.js
library that simplifies scheduling background tasks in your applications. It
excels at automating repetitive jobs such as sending emails, processing images,
backing up databases, and more.

Despite its lightweight nature, Node-cron offers robust features, including
support for cron syntax and the ability to validate cron expressions. This makes
scheduling tasks straightforward, especially if you are already familiar with
cron, a tool available on Unix-like operating systems.

This article will explore Node-cron's functionalities, from fundamental aspects
to advanced techniques. Additionally, you will learn how to monitor cron jobs to
ensure they operate reliably.

Let's jump right in!

[ad-uptime-small]

## Prerequisites

Before starting this tutorial, ensure you have:

- The latest version of
  [Node.js installed](https://nodejs.org/en/download/package-manager).
- Basic knowledge of writing applications using Node.js.

## Setting up the project directory

In this section, you will download a repository that includes some pre-written
code to help you get started with scheduling tasks using Node-cron.

To begin, clone the remote repository with the following command:

```command
git clone https://github.com/betterstack-community/cron-scheduled-tasks.git
```

Next, move into the directory:

```command
cd cron-scheduled-tasks
```

Now, use npm to install all the necessary dependencies in the `package.json`
file. This includes Node-cron for scheduling tasks and SQLite for database
management:

```command
npm install
```

With all the dependencies installed, you can start scheduling tasks in the next
section.

## Scheduling tasks with Node-cron

In this section, you will schedule a basic task with Node-cron.

To do that, open the `index.js` file in your favourite editor. This tutorial
assumes you are using VS Code, and you can open the file with the `code` command
like this:

```command
code index.js
```

```javascript
[label index.js]
import cron from 'node-cron';

const exportData = () => {
  const name = 'Sales report 1';
  const path = '/home/username/sales_report_1.csv';
  console.log(`Exporting ${name} data to ${path}`);
};

cron.schedule('*/5 * * * * *', () => {
  exportData(); // Call the dataExport function
});

console.log('Scheduler is running...');
```

In this code, you define an `exportData()` function that logs "Exporting Sales
report 1 data..." to the console.

To schedule this function, you use `cron.schedule()` with a cron expression
(`'*/5 * * * * *'`) to run the `exportData()` function every 5 seconds.

Save your file and run it with the following command:

```command
node index.js
```

When it runs for a few seconds, you will see output like this:

```text
[output]
Scheduler is running...
Exporting Sales report 1 data to /home/username/sales_report_1.csv
Exporting Sales report 1 data to /home/username/sales_report_1.csv
Exporting Sales report 1 data to /home/username/sales_report_1.csv
Exporting Sales report 1 data to /home/username/sales_report_1.csv
Exporting Sales report 1 data to /home/username/sales_report_1.csv
```

The output confirms that the scheduler is active and successfully running the
`exportData()` function at the specified interval.

## Customizing Node-cron jobs

Often, you might need to customize jobs and pass custom data to them. For
example, a job that processes multiple files might require a different file path
each time, or a job sending emails might need different recipient names and
addresses for each execution. This ensures tasks are executed with the correct
context and parameters.

To achieve this, follow these steps:

First, remove the highlighted lines from the existing code:

```javascript
[label index.js]
const exportData = () => {
[highlight]
  const name = "Sales report 1";
  const path = "/home/username/sales_report_1.csv";
[/highlight]
  console.log(`Exporting ${name} data to ${path}`);
};

cron.schedule("*/5 * * * * *", () => {
[highlight]
  exportData(); // Call the dataExport function
[/highlight]
});
```

Next, modify the code to pass custom data to the scheduler method:

```javascript
[label index.js]
import cron from "node-cron";

[highlight]
const exportData = (data) => {
  const { name, path } = data;
[/highlight]
  console.log(`Exporting ${name} data to ${path}`);
};

cron.schedule("*/5 * * * * *", () => {
[highlight]
  exportData({
    name: "Sales report",
    path: "/home/username/sales_report.csv",
  });
  [/highlight]
});


console.log("Scheduler is running...");
```

With this change, the `exportData()` function now accepts `data` as a parameter,
destructures `name` and `path` from `data`, and logs a message indicating the
export operation with these values. In the `cron.schedule()` method, you call
`exportData` with custom data specifying a sales report's `name` and
`file path`.

Run the command with the following:

```command
node index.js
```

The output will look like the following:

```text
[output]
Scheduler is running...
Exporting Sales report data to /home/username/sales_report.csv
Exporting Sales report data to /home/username/sales_report.csv
```

The main advantage of this approach is the flexibility to pass different data to
each job, which allows the process to handle multiple files in a directory.
Consider the following:

```javascript
[label index.js]
...
[highlight]
const dataArray = [
  { name: "Sales report 1", path: "/home/username/sales_report_1.csv" },
  { name: "Sales report 2", path: "/home/username/sales_report_2.csv" },
  { name: "Sales report 3", path: "/home/username/sales_report_3.csv" },
];

// Index to track current data item
let dataIndex = 0;
[/highlight]
cron.schedule("*/5 * * * * *", () => {
  // Export data from the current item in dataArray
[highlight]
  exportData(dataArray[dataIndex]);

  // Increment the index for the next item in dataArray
  dataIndex = (dataIndex + 1) % dataArray.length;
[/highlight]
});
...
```

In this code, you initialize the `dataArray` containing three objects, each
representing a sales report with a name and file path. You also declare a
variable `dataIndex` to keep track of the current item being processed from
`dataArray` when exporting data periodically using `node-cron`. This allows it
to cycle through multiple jobs.

With that, save your file and run the program:

```command
node index.js
```

You will see that it now runs the export function with different reports:

```text
[output]
Scheduler is running...
Exporting Sales report 1 data to /home/username/sales_report_1.csv
Exporting Sales report 2 data to /home/username/sales_report_2.csv
Exporting Sales report 3 data to /home/username/sales_report_3.csv
Exporting Sales report 1 data to /home/username/sales_report_1.csv
```

This demonstrates how you can use Node-cron to handle multiple files
effectively.

## Using cron expressions to schedule jobs

Cron expressions are a core part of the Node-cron package, providing flexibility
and precision in scheduling tasks. This section will dive into cron expressions
to help you use them efficiently.

A cron expression typically consists of five fields representing the minute,
hour, day of the month, month, and day of the week:

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

For quick reference, here are the values each field can take:

| Field            | Allowed Values  |
| ---------------- | --------------- |
| Minute           | 0-59            |
| Hour             | 0-23            |
| Day of the Month | 1-31            |
| Month            | 1-12 or JAN-DEC |
| Day of the Week  | 0-6 or SUN-SAT  |

Here are some examples using cron expressions:

```javascript
cron.schedule("0 0 */3 * *", jobFunction); // Every 3 days
cron.schedule("0 0 */21 * *", jobFunction); // Every 3 weeks
cron.schedule("0 0 1 */1 *", jobFunction); // Every 1 month (on the 1st day)
cron.schedule("0 0 1 */2 *", jobFunction); // Every 2 months (on the 1st day)
```

You can specify multiple values separated by commas to define exact times for
the task to run. This is useful for specific scheduling needs within an hour or
day:

```javascript
import cron from "node-cron";

cron.schedule("1,2,3 * * * *", () => {
  console.log("Running at the 1st, 2nd, and 3rd minute each hour");
});
```

You can also define a range of values to specify a continuous interval within a
field, which is helpful for tasks that need to run frequently within a specific
period:

```javascript
import cron from "node-cron";

cron.schedule("1-2 * * * *", () => {
  console.log("Running at the 1st and 2nd minute each hour");
});
```

Step values can be used with ranges, following a range with a '/' and a number.
For example, `1-10/2` is the same as `1,3,5,7,9`. Steps can also be used after
an asterisk, allowing you to schedule tasks at regular intervals.

```javascript
import cron from "node-cron";

cron.schedule("*/3 * * * *", () => {
  console.log("Running a task every three minutes");
});
```

For the month and weekday fields, you can also use full names. This makes the
cron expressions more readable and easier to understand at a glance:

```javascript
import cron from "node-cron";

cron.schedule("* * * March,October Wednesday", () => {
  console.log("Running on Wednesdays of March and October");
});
```

Short names for months and days of the week are also supported, providing a more
compact way to define cron schedules:

```javascript
import cron from "node-cron";

cron.schedule("* * * Mar,Oct Wed", () => {
  console.log("Running on Wednesdays of March and October");
});
```

### Validating cron expressions

Given how frequently you must use cron expressions, ensuring they are valid is
essential to avoid any unexpected issues. The Node-cron package includes a
`validate()` function to help with this.

Here's an example demonstrating how to use the `validate()` function:

```javascript
[label index.js]
import cron from "node-cron";

// Valid cron expression
const validCron = "10 * * * * *";
const isValid = cron.validate(validCron);
console.log(`Is "${validCron}" valid?: ${isValid}`);

// Invalid cron expression
const invalidCron = '60 * * * * *';
const isInvalid = cron.validate(invalidCron);
console.log(`Is "${invalidCron}" valid?: ${isInvalid}`);
```

Run the file with the following command:

```command
node index.js
```

```text
[output]
Is "10 * * * * *" valid?: true
Is "60 * * * * *" valid?: false
```

The output confirms that the validation function correctly identifies
`10 * * * * *` as a valid cron expression and `60 * * * * *` as invalid,
demonstrating the functionality of the validation process.

### Using online cron expression validators

If cron expressions still seem complex, online tools are available to help
validate and understand them. You can input your cron expressions, and these
tools will provide a human-readable interpretation.

A popular tool for checking and understanding cron expressions is
[Crontab Guru](https://crontab.guru/). It provides an intuitive interface that
translates cron expressions into human-readable formats.

![screenshot of crontab guru](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8d460c1c-b317-40d3-afdc-84eef5379300/md2x =3024x1596)

In the screenshot, the tool translates the expression `5 4 * * *` to "At 04:05."
This means the task is scheduled to run at 04:05 AM every day.

## Managing tasks with Node-cron

Node-cron provides several methods for managing your tasks. You can start them
later or stop them when they meet certain conditions.

Take the following example:

```javascript
[label index.js]
import cron from "node-cron";

const exportData = () => {
  const name = "Sales report 1";
  const path = "/home/username/sales_report_1.csv";
  console.log(`Exporting ${name} data to ${path}`);
};

const task = cron.schedule(
  "*/5 * * * * *",
  () => {
    exportData();
  },
  {
    scheduled: false,
  }
);

// Now the task is created but not started
console.log("Task created but not started");
```

Upon running the code, you will see an output similar to this:

```text
[output]
Task created but not started
```

The script exits without starting the task because of the option
`{ scheduled: false }` passed to the `cron.schedule()` method. This behaviour
can be beneficial when you need to defer the start of a cron job until specific
runtime conditions are met.

### Starting a deferred cron job

To start the deferred cron job, you can use the `start()` method like this:

```javascript
[label index.js]
// Now the task is created but not started
console.log("Task created but not started");

// Manually start the task
[highlight]
task.start();
console.log('Scheduler started...');
[/highlight]
```

In the code snippet, you manually start a task and log a message to the console
indicating that the scheduler has started.

Upon running the file, you will see the scheduler start and perform its task,
with output similar to:

```text
[output]
Task created but not started
Scheduler started...
Exporting Sales report 1 data to /home/username/sales_report_1.csv
Exporting Sales report 1 data to /home/username/sales_report_1.csv
Exporting Sales report 1 data to /home/username/sales_report_1.csv
```

This demonstrates that the scheduler begins executing its job immediately after
being manually started.

### Stopping a running cron job

While running cron jobs, you might need to stop a job under certain conditions,
such as not wanting it to run for more than an hour. To do this, you can stop
the job anytime with the `stop()` method.

For example, you can stop the task after 20 seconds like this:

```javascript
[label index.js]
...
// Manually start the task
task.start();
console.log('Scheduler started...');

[highlight]
// Stop the task after 20 seconds
setTimeout(() => {
  task.stop();
  console.log('Scheduler stopped...');
}, 20000);
[/highlight]
```

Now, when you run the file, you will see that it stops after 20 seconds:

```text
[output]
Task created but not started
Scheduler started...
Exporting Sales report 1 data to /home/username/sales_report_1.csv
Exporting Sales report 1 data to /home/username/sales_report_1.csv
Exporting Sales report 1 data to /home/username/sales_report_1.csv
Scheduler stopped...
```

This allows you to manage tasks effectively by starting and stopping them based
on your requirements.

### Scheduling database backups with Node-cron

In this section, you'll apply what you have learned about Node-cron to back up
an SQLite database into archives.

Open the `backup.js` file in your project directory:

```command
code backup.js
```

It will contain the following code:

```javascript
[label index.js]
import { spawn } from "child_process";
import { format } from "date-fns";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream";
import { createGzip } from "zlib";

const dbName = "movies.db";

const getFormattedDateTime = () => {
  return format(new Date(), "yyyy-MM-dd_HH-mm-ss");
};

const backupDatabase = async () => {
  return new Promise((resolve, reject) => {
    const currentDateTime = getFormattedDateTime();
    const backupFileName = `./backup-${currentDateTime}.sqlite`;
    const gzipFileName = `${backupFileName}.gz`;

    console.log(`Starting database backup: ${gzipFileName}`);

    const backupProcess = spawn("sqlite3", [
      dbName,
      `.backup ${backupFileName}`,
    ]);

    backupProcess.on("error", (err) => {
      reject(new Error(`Failed to start backup process: ${err.message}`));
    });

    backupProcess.on("exit", (code, signal) => {
      if (code) {
        reject(new Error(`Backup process exited with code ${code}`));
      } else if (signal) {
        reject(
          new Error(`Backup process was terminated with signal ${signal}`)
        );
      } else {
        const gzip = createGzip();
        const source = createReadStream(backupFileName);
        const destination = createWriteStream(gzipFileName);

        pipeline(source, gzip, destination, (err) => {
          if (err) {
            reject(new Error(`Failed to gzip backup file: ${err.message}`));
          } else {
            console.log(
              `Database "${dbName}" successfully backed up to ${gzipFileName}`
            );
            resolve();
          }
        });
      }
    });
  });
};

backupDatabase().catch((err) => console.error(err));
```

This script uses the `spawn()` function from the `child_process` module to run
`sqlite3`, creating backups of an SQLite database named `movies.db`. It
dynamically generates a backup filename using the current timestamp, formatted
with `date-fns`.

The `backupDatabase()` function manages the backup process, logging success or
failure messages. It includes error handling for potential issues, such as
failure to start the backup or unexpected termination.

To run the script, execute the following command:

```command
node backup.js
```

Upon running, you will see the following output:

```text
[output]
Starting database backup: ./backup-2024-06-24_15-10-48.sqlite.gz
Database "movies.db" successfully backed up to ./backup-2024-06-24_15-10-48.sqlite.gz
```

The output shows that the database backup process started successfully, creating
a backup file named `backup-2024-06-24_15-10-48.sqlite.gz`.

Next, list the contents of the directory:

```command
ls
```

The directory will now contain the newly created archive:

```text
[output]
...
backup-2024-06-24_15-10-48.sqlite.gz
...
```

Currently, the script requires manual execution each time you want to create a
backup. To automate this process, you can use Node-cron to schedule the task to
run at regular intervals.

Add the highlighted code below to automate the backups:

```javascript
[label index.js]
...
import { pipeline } from "stream";
import { createGzip } from "zlib";
[highlight]
import cron from "node-cron";
[/highlight]


...
const backupDatabase = async () => {
  ...
};
[highlight]
// Schedule the database backup to run every minute
cron.schedule("* * * * *", () => {
[/highlight]
  backupDatabase().catch((err) => console.error(err));
[highlight]
});

console.log("Database backup scheduled to run every minute.");
[/highlight]
```

Save your file and run the program:

```command
node backup.js
```

Upon running, you will see the following output:

```text
[output]
Database backup scheduled to run every minute.
Starting database backup: ./backup-2024-06-24_15-13-00.sqlite.gz
Database "movies.db" successfully backed up to ./backup-2024-06-24_15-13-00.sqlite.gz
Starting database backup: ./backup-2024-06-24_15-14-00.sqlite.gz
Database "movies.db" successfully backed up to ./backup-2024-06-24_15-14-00.sqlite.gzqlite
```

After running for a few minutes, list the directory contents:

```command
ls -l
```

You will see multiple archives confirming that the backups are working as
intended:

```text
[output]
...
backup-2024-06-24_15-13-00.sqlite.gz
backup-2024-06-24_15-14-00.sqlite.gz
backup-2024-06-24_15-15-00.sqlite.gz
backup-2024-06-24_15-16-00.sqlite.gz
...
```

You can now schedule backup tasks to run repeatedly, ensuring your database is
backed up regularly. In the next section, you will monitor the scheduled jobs.

## Monitoring scheduled jobs in production

When you set up automated tasks, it's crucial to establish a system that
monitors these jobs and notifies you of any issues. Failure to do so can result
in unnoticed job failures. A notable example is GitLab's data loss due to a
failed backup process, as detailed in their
[post-mortem](https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/).
This incident highlights the importance of monitoring scheduled tasks to be
aware of failures and resolutions.

[Better Stack](https://betterstack.com/uptime) is an excellent tool for this
purpose. It actively monitors your jobs and sends alerts through various
channels, such as emails, phone calls, texts, and Slack, if there are any
issues. This ensures you stay informed about your job status and can address
problems promptly.

To set this up, register for a free
[Better Stack account](https://uptime.betterstack.com/users/sign-up) and locate
the **Heartbeats** section on the sidebar. Click the **Create Heartbeat**
button:

![Screenshot of Better Stack UI where you can click **Create Heartbeat**](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/06ee78f4-9bf2-47b9-c4a6-8f9093b87f00/orig =3024x1596)

Next, provide your preferred name for the monitor and specify how frequently the
job executes. In the **On-call escalation** section, choose how you want to be
notified—in this case, via email. When done, click **Create Heartbeat**:

![Screenshot of Better Stack UI showing options on how to create a heartbeat](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1bfa4079-604a-4766-26b6-3703e736c800/orig =3024x2396)

You will then be redirected to the Heartbeat page, which provides a new endpoint
to monitor the jobs:

![Screenshot showing the heartbeat endpoint created](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/119cc59d-dbcc-4711-05f6-9a8a0278e000/orig =3024x2426)

Copy the endpoint from Better Stack and return to your text editor. Create a
`.env` file and add the following, replacing `<your_heartbeat_url>` with the
endpoint:

```text
[label .env]
HEARTBEAT_URL='<your_heartbeat_url>'
```

Next, install the [dotenv](https://www.npmjs.com/package/dotenv) package to
manage environment variables:

```command
npm install dotenv
```

Now update the `backup.js` file to use fetch and send a request to the Heartbeat
endpoint every time the job executes:

```javascript
[label backup.js]
...
[highlight]
import 'dotenv/config';
[/highlight]
. . .

// Add the async keyword to `cron.schedule()` callback
[highlight]
cron.schedule("* * * * *", async () => {
  try {
    await backupDatabase();
    const response = await fetch(process.env.HEARTBEAT_URL);
    if (!response.ok) throw new Error(response.statusText);
  } catch (err) {
    console.error(err);
  }
[/highlight]
});
. . .
```

Save your file and run the program:

```command
node backup.js
```

When the first backup runs successfully, Better Stack will confirm that it is
"UP," indicating that it is running:

![Screenshot of Better Stack UI showing that the task status is "UP"](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e312b2c1-1593-44c5-a13c-3973498f2200/lg1x =3024x3112)

To ensure the monitoring works even when the script fails, stop the script and
wait for a few minutes. When this happens, the application won't ping the Better
Stack endpoint anymore. Consequently, Better Stack will mark the task as "Down"
and update the status:

![Screenshot of Better Stack showing the scheduled backup job is down](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8068f886-d41b-4bd1-2a8f-ac9a0cd09100/md2x =3024x3112)

It will then send an alert to your preferred channels:

![Screenshot of an email sent by Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6fa219d8-fad1-47f4-b26f-b54bc4426d00/md2x =1662x1310)

With this, you can be confident that your scheduled tasks are running smoothly
and that you'll be alerted if something goes wrong. Logging application failures
can also help you review and resolve issues. See our [Node.js logging
guide](https://betterstack.com/community/guides/logging/nodejs-logging-best-practices/) for more details.

## Limitations of Node-cron

So far, you have explored Node-cron and its features and learned how to use it
to schedule tasks. The tool has many advantages, the biggest being that it is
lightweight and easy to learn. If you know the cron syntax, you can quickly
start creating schedules.

However, Node-cron has limitations when it comes to complex scheduling needs.
The most significant drawback is its lack of a database system to store or
manage jobs. On the other hand, schedulers like [Agenda](https://betterstack.com/community/guides/scaling-nodejs/node-scheduled-tasks/)
and [BullMQ](https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/) offer the benefit of databases that store
jobs, empowering you to resume and continue running tasks even after a crash. In
contrast, Node-cron loses all progress if it crashes.

Additionally, Node-cron lacks features like a human-readable syntax that other
tools support. While cron syntax is popular, it can be difficult for users who
are unfamiliar with it to learn and use. Other features missing from Node-cron
include job prioritization and comprehensive management tools.

## Final thoughts

In this tutorial, you explored some of the features of Node-cron and used it to
schedule tasks in Node.js. You also implemented a monitoring system with Better
Stack to notify you if the tasks are running smoothly or encountering issues.

To explore the tool further, check out the documentation for
[Node-cron](https://www.npmjs.com/package/node-cron) and
[Better Stack](https://betterstack.com/).

Thanks for reading, and happy scheduling!
