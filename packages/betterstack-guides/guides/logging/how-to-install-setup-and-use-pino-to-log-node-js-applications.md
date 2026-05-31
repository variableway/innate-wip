# A Complete Guide to Pino Logging in Node.js

[Pino](https://github.com/pinojs/pino) is a powerful logging framework for
Node.js that boasts exceptional speed and comprehensive features. In fact, its
impressive performance earned it a default spot in the open-source
[Fastify web server](https://www.fastify.io/docs/latest/Reference/Logging/) for
logging output. Pino's versatility also extends to its ease of integration with
other Node.js web frameworks, making it a top choice for developers looking for
a reliable and flexible logging solution.

Pino includes all the standard features expected in any [logging
framework](https://betterstack.com/community/guides/logging/logging-framework/), such as customizable log levels, formatting
options, and multiple log transportation options. Its flexibility is one of its
standout features, as it can be easily extended to meet specific requirements,
making it a top choice for a wide range of applications.

This article will guide you through creating a logging service for your Node.js
application using Pino. You will learn how to leverage the framework's many
features and customize them to achieve an optimal configuration for your
specific use case.

By the end of this tutorial, you will be well-equipped to implement a
production-ready logging setup in your Node.js application with Pino, helping
you to streamline your logging process and improve the overall performance and
reliability of your application.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/fluDEkA1h6w" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


[summary]

## Side note: Get a Node.js logs dashboard

Save hours of sifting through Node.js logs. Centralize
with [Better Stack](https://betterstack.com/log-management) and start visualizing your log
data in minutes.

See the
[Node.js demo dashboard live](https://telemetry.betterstack.com/dashboards/xnwf6j).

<iframe src="https://telemetry.betterstack.com/dashboards/xnwf6j" width="100%" height="400"></iframe>

[/summary]

## Prerequisites

Before proceeding with the rest of this article, ensure you have a recent
version of [Node.js](https://nodejs.org/en/download/) and `npm` installed
locally on your machine. This article also assumes you are familiar with the
basic concepts of [logging in Node.js](https://betterstack.com/community/guides/logging/how-to-start-logging-with-node-js/).

## Getting started with Pino

To get the most out of this tutorial, create a new Node.js project to try out
the concepts we will be discussing. Start by initializing a new Node.js project
using the commands below:

```command
mkdir pino-logging && cd pino-logging
```

```command
npm init -y
```

Now, enable ECMAScript module support by running the following command:

```command
npm pkg set type=module
```

Afterward, install the latest version of
[pino](https://www.npmjs.com/package/pino) through the command below. The
examples in this article are compatible with version 9.x, which is the latest at
the time of writing.

```command
npm install pino
```

Create a new `logger.js` file in the root of your project directory, and
populate it with the following contents:

```javascript
[label logger.js]
import pino from 'pino';

export default pino({});
```

This snippet imports the `pino` package and exports a logger instance created by calling the top-level `pino()` function. 

We'll explore various ways to customize the Pino logger later, but for now, let's use the exported logger in a new `index.js` file as shown below:


```javascript
[label index.js]
import logger from './logger.js';

logger.info('Hello, world!');
```

Once you save the file, execute the program using the following command:

```command
node index.js
```

You should observe the following output:

```json
[output]
{"level":30,"time":1747908633368,"pid":4298,"hostname":"ubuntu","msg":"Hello, world!"}
```

The first thing you'll notice about the output above is that it's structured and
formatted in JSON, the prevalent industry standard for structured logging.
Besides the log message, the following fields are present in the log entry:

- The log `level` indicating the severity of the event being logged.
- The `time` of the event (the number of milliseconds elapsed since January 1,
  1970 00:00:00 UTC).
- The `hostname` of the machine where the program is running.
- The process ID (`pid`) of the Node.js program being executed.

We'll discuss how you can
[customize each of these fields](#customizing-the-default-fields), and how to
enrich your logs with other [contextual fields](#adding-context-to-your-logs)
later on in this tutorial.

## Prettifying JSON logs in development

JSON is great for production logging due to its simplicity, flexibility, and
widespread support amongst logging tools, but it's not the easiest for humans to
read especially when printed on one line. To make the JSON output from Pino
easier to read in development environments (where logs are typically printed to
the standard output), you can adopt one of the following approaches.

### 1. Using jq

[jq](https://stedolan.github.io/jq/) is a nifty command-line tool for processing
JSON data. You can pipe your JSON logs to it to colorize and pretty-print it
like this:

```command
node index.js | jq
```

```json
[output]
{
  "level": 30,
  "time": 1747909573327,
  "pid": 4835,
  "hostname": "ubuntu",
  "msg": "Hello, world!"
}
```


![Terminal screenshot showing `node index.js | jq` output with a pretty-printed JSON log entry, including fields like level, time, pid, hostname, and message saying "Hello, world!"](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c5ad346f-303b-4165-f4f8-c404c556d700/orig =1474x966)

If you get a "command not found" error, it likely means `jq` isn’t installed on your system. You can find installation instructions on the [official jq website](https://stedolan.github.io/jq/download/).

If the JSON output is too large, you can filter irrelevant fields from the
output by using jq's `del()` function:

```command
node index.js | jq 'del(.time,.hostname,.pid)'
```

```json
[output]
{
  "level": 30,
  "msg": "Hello, world!"
}
```

You can also opt to use a whitelist instead, which is handy for rearranging the
order of the fields:

```command
node index.js | jq '{msg,level}'
```

```json
[output]
{
  "msg": "Hello, world!",
  "level": 30
}
```

You can transform your JSON logs in many other ways through `jq`, so ensure to
check out its [documentation](https://stedolan.github.io/jq/manual/) to learn
more.

### 2. Using pino-pretty

The Pino team have also provided the
[pino-pretty package](https://github.com/pinojs/pino-pretty) for converting
newline-delimited JSON entries into a more human-readable plaintext output:

You'll need to install the `pino-pretty` package first:

```command
npm install pino-pretty --save-dev
```

Once the installation completes, you'll be able to pipe your application logs to
`pino-pretty` as shown below:

```command
node index.js | npx pino-pretty
```

You will observe that the logs are now reformatted and colorized to make them
easier to read:

```text
[output]
[10:30:39.545] INFO (4913): Hello, world!
```

![Terminal showing colorized pino-pretty log output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cf45f33f-f7d5-4625-4e31-c2a9e100ad00/public =1418x864)

If you want to customize pino-pretty's output, check out the
[relevant Pino documentation](https://getpino.io/#/docs/transports?id=pino-pretty)
for the `pino-pretty` transport.

## Log levels in Pino

The default [log levels](https://betterstack.com/community/guides/logging/log-levels-explained/) in Pino are (ordered by ascending
severity) `trace`, `debug`, `info`, `warn`, `error`, and `fatal`, and each of
these have a corresponding method on the logger:

```javascript
[label index.js]
import logger from './logger.js';

logger.fatal('fatal');
logger.error('error');
logger.warn('warn');
logger.info('info');
logger.debug('debug');
logger.trace('trace');
```

When you execute the code above, you will get the following output:

```json
[output]
{"level":60,"time":1747910067840,"pid":5092,"hostname":"ubuntu","msg":"fatal"}
{"level":50,"time":1747910067841,"pid":5092,"hostname":"ubuntu","msg":"error"}
{"level":40,"time":1747910067841,"pid":5092,"hostname":"ubuntu","msg":"warn"}
{"level":30,"time":1747910067841,"pid":5092,"hostname":"ubuntu","msg":"info"}
```

Notice how the severity `level` is represented by a number that increments in
10s according to the severity of the event. You'll also observe that no entry is
emitted for the `debug()` and `trace()` methods due to the default minimum level
on a Pino logger (`info`) which causes less severe events to be suppressed.

Setting the minimum log level is typically done when creating the logger. It is
best to controlled the minimum log level through an environmental variable so
that you can change it anytime without making code modifications:

```javascript
[label logger.js]
import pino from 'pino';

[highlight]
const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
});

export default logger;
[/highlight]
```

If the `PINO_LOG_LEVEL` variable is set in the environment, its value will be
used. Otherwise, the `info` level will be the default. The example below sets
the minimum level to `error` so that the events below the `error` level are all
suppressed.

```command
PINO_LOG_LEVEL=error node index.js
```

```json
[output]
{"level":60,"time":1747910221933,"pid":5119,"hostname":"ubuntu","msg":"fatal"}
{"level":50,"time":1747910221934,"pid":5119,"hostname":"ubuntu","msg":"error"}
```

You can also change the minimum level on a `logger` instance at anytime through
its `level` property:

```javascript
[label index.js]
import logger from './logger.js';

logger.level = 'debug'; // only trace messages will be suppressed now

. . .
```

This is useful if you want to change the minimum log level at runtime perhaps by
exposing a secure endpoint for this purpose:

```javascript
app.get('/changeLevel', (req, res) => {
  const { level } = req.body;
  // check that the level is valid then change it:
  logger.level = level;
});
```

### Customizing log levels in Pino

Pino does not restrict you to the default levels that it provides. You can
easily add customs levels by creating an object that defines the integer
priority of each level, and assigning the object to the `customLevels` property.
For example, you can add a `notice` level that is more severe than `info` but
less severe than `warn` using the code below:

```javascript
[label logger.js]
import pino from 'pino';

const levels = {
  notice: 35, // Any number between info (30) and warn (40) will work the same
};

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  customLevels: levels,
});

export default logger;
```

At this point, you can log events at each defined custom level through their
respective methods, and all the default levels will continue to work as usual:

```javascript
[label index.js]
import logger from './logger.js';

logger.warn('warn');
[highlight]
logger.notice('notice');
[/highlight]
logger.info('info');
```

```json
[output]
{"level":40,"time":1747910887087,"pid":5196,"hostname":"ubuntu","msg":"warn"}
[highlight]
{"level":35,"time":1747910887088,"pid":5196,"hostname":"ubuntu","msg":"notice"}
[/highlight]
{"level":30,"time":1747910887088,"pid":5196,"hostname":"ubuntu","msg":"info"}
```

Assuming you want to replace Pino's log levels entirely with perhaps the
[standard Syslog levels](https://datatracker.ietf.org/doc/html/rfc5424#page-10),
you must specify the `useOnlyCustomLevels` option as shown below:

```javascript
[label logger.js]
import pino from 'pino';

const levels = {
  emerg: 80,
  alert: 70,
  crit: 60,
  error: 50,
  warn: 40,
  notice: 30,
  info: 20,
  debug: 10,
};

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  customLevels: levels,
  useOnlyCustomLevels: true,
});

export default logger;
```

## Customizing the default fields

In this section, we'll take a quick look at the process of modifying the
standard fields that come with every Pino log entry. However, be sure to explore
the comprehensive range of
[Pino options](https://getpino.io/#/docs/api?id=options) at your convenience.

### Using string labels for severity levels

Let's start by specifying the level name in the log entry instead of its integer
value. This can be achieved through the
[formatters configuration](https://github.com/pinojs/pino/blob/8786e3acbb0f50eeed13d4d599b4f25b0fa43730/docs/api.md#formatters-object)
below:

```javascript
[label logger.js]
...
const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  [highlight]
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  [/highlight]
});

export default logger;
```

Then, in your `index.js` file, log a few messages to see the formatter in action:

```javascript
[label index.js]
import logger from './logger.js';

logger.error('error');
logger.warn('warn');
logger.info('info');
```

This change causes the severity level on each entry to be upper-case labels:

```json
[output]
{"level":"ERROR","time":1747911468430,"pid":5281,"hostname":"ubuntu","msg":"error"}
{"level":"WARN","time":1747911468430,"pid":5281,"hostname":"ubuntu","msg":"warn"}
{"level":"INFO","time":1747911468431,"pid":5281,"hostname":"ubuntu","msg":"info"}
```

You can also rename the `level` property by returning something like this from
the function:


```javascript
[label logger.js]
...
const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
  [highlight]
      return { severity: label.toUpperCase() };
  [/highlight]
    },
  },
});

export default logger;
```

```json
[output]
"severity":"ERROR","time":1747911979754,"pid":5344,"hostname":"ubuntu","msg":"error"}
{"severity":"WARN","time":1747911979754,"pid":5344,"hostname":"ubuntu","msg":"warn"}
{"severity":"INFO","time":1747911979754,"pid":5344,"hostname":"ubuntu","msg":"info"}
```

### Customizing the timestamp format

Pino's default timestamp is the number of milliseconds elapsed since January 1,
1970 00:00:00 UTC (as produced by the `Date.now()` function). You can customize
this output through the `timestamp` property when creating a logger. We
recommend outputting your timestamps in the ISO-8601 format:

```javascript
[label logger.js]
import pino from 'pino';

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  [highlight]
  timestamp: pino.stdTimeFunctions.isoTime,
  [/highlight]
});

export default logger;
```

```json
[output]
...
{"level":"INFO","time":"2025-05-22T11:10:52.206Z","pid":5422,"hostname":"ubuntu","msg":"info"}
```

You can also rename the property from `time` to `timestamp` by specifying a
function that returns a partial JSON representation of the current time
(prefixed with a comma) like this:

```javascript
[label logger.js]
...
const logger = pino({
  ...
[highlight]
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
[/highlight]
});
```

```json
[output]
...
{"level":"INFO","timestamp":"2025-05-22T11:14:25.702Z","pid":5453,"hostname":"ubuntu","msg":"info"}
```

[summary]
### Centralize your Pino logs with Better Stack
While Pino handles high-performance structured logging in your Node.js application, [Better Stack](https://betterstack.com/log-management) provides centralized log management with live tailing, SQL and PromQL queries, automated anomaly detection, and incident management. Collect logs from all your Node.js services in one place with integrations for Docker, Kubernetes, and more.
**Predictable pricing starting at $0.25/GB.** Start free in minutes.
[/summary]

![Better Stack log management dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)

### Customizing the default binding

Pino binds two extra properties to each log entry by default: the program's
process ID (`pid`), and the current machine's hostname. You can customize them
through the `bindings` function on the `formatters` object. For example, let's
rename `hostname` to `host`:

```javascript
[label logger.js]
import pino from 'pino';

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  formatters: {
    [highlight]
    bindings: (bindings) => {
      return { pid: bindings.pid, host: bindings.hostname };
    },
    [/highlight]
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
```

```json
[output]
...
{"level":"INFO","timestamp":"2025-05-22T11:18:19.079Z","pid":5494,"host":"ubuntu","msg":"info"}
```

You may decide to omit any of the fields by removing it from the returned
object, and you can also add custom properties here if you want them to appear
in every log entry. Here's an example that adds the node version used to execute
the program to each log entry:

```javascript
bindings: (bindings) => {
  return {
    pid: bindings.pid,
    host: bindings.hostname,
    [highlight]
    node_version: process.version,
    [/highlight]
  };
},
```

```json
[output]
...
{"level":"INFO","timestamp":"2025-05-22T11:21:13.112Z","pid":5519,"host":"ubuntu","node_version":"v22.16.0","msg":"info"}
```

Other useful examples of global data that can be added to every log entry
include the application version, operating system, configuration settings, git
commit hash, and more.

## Adding context to your logs

Adding contextual data to logs refers to including additional information that
provides more context or details about the events being logged. This information
can help with troubleshooting, debugging, and monitoring your application in
production.

For example, if an error occurs in a web application, including contextual data
such as the request's ID, the endpoint being accessed, or the user ID that
triggered the request can help with identifying the root cause of the issue more
quickly.

In Pino, the primary way to add contextual data to your log entries is through
the
[`mergingObject` parameter](https://getpino.io/#/docs/api?id=mergingobject-object)
on a level method:

```javascript
logger.error(
  { transaction_id: '12343_ff', user_id: 'johndoe' },
  'Transaction failed'
);
```

The above snippet produces the following output:

```json
[output]
{"level":"ERROR","timestamp":"2025-05-22T11:23:00.514Z","pid":5547,"host":"ubuntu","node_version":"v22.16.0","transaction_id":"12343_ff","user_id":"johndoe","msg":"Transaction failed"}
...
```

It's also helpful to set some contextual data on all logs produced within the
scope of a function, module, or service so that you don't have to repeat them at
each log point. This is done in Pino through
[child loggers](https://getpino.io/#/docs/child-loggers):

```javascript
[label index.js]
import logger from './logger.js';

logger.info('starting the program');

function getUser(userID) {
  const childLogger = logger.child({ userID });
  childLogger.trace('getUser called');
  // retrieve user data and return it
  childLogger.trace('getUser completed');
}

getUser('johndoe');

logger.info('ending the program');
```

Execute the code with `trace` as the minimum level:

```command
PINO_LOG_LEVEL=trace node index.js
```

```json
[output]
{"level":"INFO","timestamp":"2025-05-22T11:24:57.997Z","pid":5582,"host":"ubuntu","node_version":"v22.16.0","msg":"starting the program"}
{"level":"TRACE","timestamp":"2025-05-22T11:24:57.998Z","pid":5582,"host":"ubuntu","node_version":"v22.16.0","userID":"johndoe","msg":"getUser called"}
{"level":"TRACE","timestamp":"2025-05-22T11:24:57.998Z","pid":5582,"host":"ubuntu","node_version":"v22.16.0","userID":"johndoe","msg":"getUser completed"}
{"level":"INFO","timestamp":"2025-05-22T11:24:57.998Z","pid":5582,"host":"ubuntu","node_version":"v22.16.0","msg":"ending the program"}
```

Notice how the `userID` property is present only within the context of the
`getUser()` function. Using child loggers allows you to add context to log
entries without the data at log point. It also makes filtering and analyzing
logs easier based on specific criteria, such as user ID, function name, or other
relevant contextual details.

## Logging errors with Pino

Logging errors is a critical practice that will help you track and diagnose
issues that occur in production. When an exception is caught, you should log all
the relevant details, including its severity, a description of the problem, and
any relevant contextual information.

You can log errors with Pino by passing the error object as the first argument
to the `error()` method followed by the log message:

```javascript
[label index.js]
import logger from './logger.js';

function alwaysThrowError() {
  throw new Error('processing error');
}

try {
  alwaysThrowError();
} catch (err) {
  [highlight]
  logger.error(err, 'An unexpected error occurred while processing the request');
  [/highlight]
}
```

This example produces a log entry that includes an `err` property containing the
type of the error, its message, and a complete stack trace which is handy for
troubleshooting.

```json
[output]
{
  "level": "ERROR",
  "timestamp": "2025-05-22T11:27:44.214Z",
  "pid": 5614,
  "host": "ubuntu",
  "node_version": "v22.16.0",
  "err": {
    "type": "Error",
    "message": "processing error",
    "stack": "Error: processing error\n    at alwaysThrowError (file:///home/dev/pino-logging/index.js:4:9)\n    at file:///home/dev/pino-logging/index.js:8:3\n    at ModuleJob.run (node:internal/modules/esm/module_job:274:25)\n    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:644:26)\n    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)"
  },
  "msg": "An unexpected error occurred while processing the request"
}
```

### Handling uncaught exceptions and unhandled promise rejections

Pino does not include a special mechanism for logging uncaught exceptions or
promise rejections, so you must listen for the `uncaughtException` and
`unhandledRejection` events and log the exception using the `FATAL` level before
exiting the program (after attempting a graceful shutdown):

```javascript
process.on('uncaughtException', (err) => {
  // log the exception
  [highlight]
  logger.fatal(err, 'uncaught exception detected');
  [/highlight]
  // shutdown the server gracefully
  server.close(() => {
    process.exit(1); // then exit
  });

  // If a graceful shutdown is not achieved after 1 second,
  // shut down the process completely
  setTimeout(() => {
    process.abort(); // exit immediately and generate a core dump file
  }, 1000).unref()
  process.exit(1);
});
```

You can use a process manager like [PM2](https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/), or a service like
[Docker](https://docs.docker.com/engine/reference/run/#restart-policies---restart)
to automatically restart your application if it goes down due to an uncaught
exception. Also, don't forget to set up [health checks](https://betterstack.com/community/guides/monitoring/health-checks/) so you
can continually monitor the state of your application with an appropriate
[monitoring tool](https://betterstack.com/better-uptime/).

## Transporting your Node.js logs

Pino defaults to logging to the standard output as you've seen throughout this
tutorial, but you can also configure it to log to a file or other destinations
(such as a remote log management service).

You'll need to use the [transports](https://getpino.io/#/docs/transports)
feature, that was introduced in Pino v7. These transports operate inside worker
threads, so that the main thread of the application is kept free from
transforming log data or sending them to remote services (which could
significantly increase the latency of your HTTP responses).

Here's how to use the built-in `pino/file` transport to route your logs to a
file (or a file descriptor):

```javascript
[label logger.js]
import pino from 'pino';
[highlight]
const __dirname = import.meta.dirname;


const fileTransport = pino.transport({
  target: 'pino/file',
  options: { destination: `${__dirname}/app.log` },
});
[/highlight]

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  [highlight]
  fileTransport
  [/highlight]
);

export default logger;
```

Henceforth, all logs will be sent to an `app.log` file in the current working
directory instead of the standard output. Unlike,
[Winston](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/),
its main competition in the Node.js logging space, Pino does not provide a
built-in mechanism to rotate your log files so they stay manageable. You'll need
to rely on external tools such as
[Logrotate](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) for this
purpose.

Another way to log into files (or file descriptors) is by using the
[pino.destination() API](https://getpino.io/#/docs/api?id=destination) like
this:

```javascript
[label logger.js]
import pino from 'pino';

const __dirname = import.meta.dirname;

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  [highlight]
  pino.destination(`${__dirname}/app.log`)
  [/highlight]
);

export default logger;
```

Note that the `pino/file` transport uses `pino.destination()` under the hood.
The main difference between the two is that the former runs in a worker thread
while the latter runs in the main thread. When logging _only_ to the standard
output or local files, using `pino/file` may introduce some overhead because the
data has to be moved off the main thread first. You should probably stick with
`pino.destination()` in such cases. Using `pino/file` is recommended only when
you're logging to multiple destinations at once, such as to a local file and a
third-party log management service.

Pino also supports
"[legacy transports](https://getpino.io/#/docs/transports?id=legacy)" that run
in a completely separate process from the Node.js program. See the relevant
documentation for more details.

### Logging to multiple destinations in Pino

Logging to multiple destinations is a common use case that is also supported in
Pino v7+ transports. You'll need to create a `targets` array and place all the
transport objects within it like this:

```javascript
[label logger.js]
import pino from 'pino';

const __dirname = import.meta.dirname;

[highlight]
const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: `${__dirname}/app.log` },
    },
    {
      target: 'pino/file', // logs to the standard output by default
    },
  ],
});
[/highlight]

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  [highlight]
  transport
  [/highlight]
);

export default logger;
```

This snippet configures Pino to log to the standard output and the `app.log`
file simultaneously. Note that the `formatters.level` function cannot be used
when logging to multiple destinations, and that's why it was omitted in the
snippet above. If you leave it in, you will get the following error:

```text
Error: option.transport.targets do not allow custom level formatters
```
To test this setup without throwing any errors, update your index.js file to something like this:

```javascript
[label index.js]
import logger from './logger.js';

logger.info('info');
logger.error('error');
logger.fatal('fatal');
```

You can change the second object to use the
[pino-pretty](https://www.npmjs.com/package/pino-pretty) transport if you'd like
a prettified output to be delivered to `stdout` instead of the JSON formatted
output (note that `pino-pretty` must be installed first):

```javascript
const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: `${__dirname}/app.log` },
    },
    {
      [highlight]
      target: 'pino-pretty',
      [/highlight]
    },
  ],
});
```

```command
node index.js && echo $'\n' && cat app.log
```

```text
[output]
[12:48:25.939] INFO (5964): info
[12:48:25.940] ERROR (5964): error
[12:48:25.940] FATAL (5964): fatal

{"level":30,"time":"2025-05-22T12:48:25.939Z","pid":5964,"hostname":"ubuntu","msg":"info"}
{"level":50,"time":"2025-05-22T12:48:25.940Z","pid":5964,"hostname":"ubuntu","msg":"error"}
{"level":60,"time":"2025-05-22T12:48:25.940Z","pid":5964,"hostname":"ubuntu","msg":"fatal"}
```

## Keeping sensitive data out of your logs

One of the most critical [best practices for application
logging](https://betterstack.com/community/guides/logging/nodejs-logging-best-practices/) involves keeping sensitive data out of
your logs. Examples of such data includes (but is not limited to) the following:

- Financial data such as card numbers, pins, bank accounts, etc.
- Passwords or application secrets.
- Any
  [data that can be used to identify a person](https://en.wikipedia.org/wiki/Personal_data)
  such as email addresses, names, phone numbers, addresses, identification
  numbers and more.
- Medical records
- Biometric data, and more.

Including sensitive data in logs can lead to data breaches, identity theft,
unauthorized access, or other malicious activities which could damage trust in
your business, sometimes irreparably. It could also expose your business to
fines, and other penalties from regulatory bodies such as GDPR, PCI, and HIPPA.
To prevent such incidents, it's crucial to always sanitize your logs to ensure
such data do not accidentally sneak in.

You can adopt several practices to keep sensitive data out of your logs, but we
cannot discuss them all here. We'll focus only on **Log redaction**, a technique
for identifying and removing sensitive data from the logs, while preserving the
relevant information needed for troubleshooting or analysis. Pino uses the
[fast-redact](https://github.com/davidmarkclements/fast-redact/) package to
provide log redaction capabilities for Node.js applications.

For example, you might have a `user` object with the following structure:

```javascript
const user = {
  id: 'johndoe',
  name: 'John Doe',
  address: '123 Imaginary Street',
  passport: {
    number: 'BE123892',
    issued: 2023,
    expires: 2027,
  },
  phone: '123-234-544',
};
```

If this object is logged as is, you will expose sensitive data such as the
user's name, address, passport details, and phone number:

```javascript
logger.info({ user }, 'User updated');
```

```json
[output]
{
  "level": "info",
  "time": 1747922232753,
  "pid": 6603,
  "hostname": "ubuntu",
  "user": {
    "id": "johndoe",
    "name": "John Doe",
    "address": "123 Imaginary Street",
    "passport": {
      "number": "BE123892",
      "issued": 2023,
      "expires": 2027
    },
    "phone": "123-234-544"
  },
  "msg": "User updated"
}
```

To prevent this from happening, you must set up your `logger` instance in
advance to redact the sensitive fields. Here's how:

```javascript
[label logger.js]
import pino from 'pino';

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  [highlight]
  redact: ['user.name', 'user.address', 'user.passport', 'user.phone'],
  [/highlight]
});

export default logger;
```

The `redact` option above is used to specify an array of fields that should be
redacted in the logs. The above configuration will replace the `name`,
`address`, `passport`, and `phone` fields in any `user` object supplied at log
point with a `[Redacted]` placeholder. This way, only the `id` field is
decipherable in the logs:

```json
[output]
{
  "level": "info",
  "time": 1747922980893,
  "pid": 6710,
  "hostname": "ubuntu",
  "user": {
    "id": "johndoe",
    "name": "[Redacted]",
    "address": "[Redacted]",
    "passport": "[Redacted]",
    "phone": "[Redacted]"
  },
  "msg": "User updated"
}
```

You can also change the placeholder string using the following configuration:

```javascript
const logger = pino({
  redact: {
    paths: ['user.name', 'user.address', 'user.passport', 'user.phone'],
    censor: '[PINO REDACTED]',
  },
});
```

```json
[output]
{
  "level": "info",
  "time": 1677663111963,
  "pid": 415221,
  "hostname": "ubuntu",
  "user": {
    "id": "johndoe",
    "name": "[PINO REDACTED]",
    "address": "[PINO REDACTED]",
    "passport": "[PINO REDACTED]",
    "phone": "[PINO REDACTED]"
  },
  "msg": "User updated"
}
```

Finally, you can decide to remove the fields entirely by specifying the `remove`
option. Reducing the verbosity of your logs might be preferable so they don't
take up storage resources unnecessarily.

```javascript
const logger = pino({
  redact: {
    paths: ['user.name', 'user.address', 'user.passport', 'user.phone'],
    censor: '[PINO REDACTED]',
    [highlight]
    remove: true,
    [/highlight]
  },
});
```

```json
[output]
{
  "level": "info",
  "time": 1677663213497,
  "pid": 419647,
  "hostname": "ubuntu",
  "user": {
    "id": "johndoe"
  },
  "msg": "User updated"
}
```

While this is a handy way to reduce the risk of sensitive data being included in
your logs, it can be easily bypassed if you're not careful. For example, if the
`user` object is nested inside some other entity or placed at the top level, the
redaction filter will not match the fields anymore, and the sensitive fields
will make it through.

```javascript
// the current redaction filter will match
logger.info({ user }, 'User updated');
// the current redaction filter will not match
logger.info({ nested: { user } }, 'User updated');
logger.info(user, 'User updated');
```

You'll have to update the filters to look like this to catch these three cases:

```javascript
const logger = pino({
  redact: {
    paths: [
      'name',
      'address',
      'passport',
      'phone',
      'user.name',
      'user.address',
      'user.passport',
      'user.phone',
      '*.user.name', // * is a wildcard covering a depth of 1
      '*.user.address',
      '*.user.passport',
      '*.user.phone',
    ],
    remove: true,
  },
});
```

Of course, you should enforce that objects are being logged in a consistent
manner throughout your application during the review process, but since you
can't account for every variation that may make it through, it's best not to
rely on this technique as a primary solution for preventing sensitive data from
making it through to your logs.

Log redaction should be used as a backup measure that can help catch problems
missed in the review process. **Ideally, don't log any objects that may contain
any sensitive data in the first place**. Extracting only the necessary
non-sensitive fields to provide context about the event being logged is the best
way to reduce the risk of sensitive data from making it into your logs.

## Logging HTTP requests with Pino

You can use Pino to log HTTP requests in your Node.js web application no matter
the framework you're using. [Fastify](https://www.fastify.io/) users should note
that while logging with Pino is built into the framework, it is disabled by
default so you must
[enable it first](https://www.fastify.io/docs/latest/Reference/Logging/).

```javascript
import Fastify from 'fastify';

const fastify = Fastify({
  logger: true
});
```

Once enabled, Pino will log all incoming requests to the server in the following
manner:

```json
{"level":30,"time":1675961032671,"pid":450514,"hostname":"fedora","reqId":"req-1","res":{"statusCode":200},"responseTime":3.1204520016908646,"msg":"request completed"}
```

If you use some other framework, see the
[Pino ecosystem](https://getpino.io/#/docs/ecosystem) page for the specific
integration that works with your framework. The example below demonstrates how
to use the [pino-http](https://www.npmjs.com/package/pino-http) package to log
HTTP requests in Express:

```javascript
[label index.js]
import express from 'express';
import logger from './logger.js';
import axios from 'axios';
import pinoHTTP from 'pino-http';

const app = express();

[highlight]
app.use(
  pinoHTTP({
    logger,
  })
);
[/highlight]

app.get('/crypto', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api2.binance.com/api/v3/ticker/24hr'
    );

    const tickerPrice = response.data;

    res.json(tickerPrice);
  } catch (err) {
    logger.error(err);
    res.status(500).send('Internal server error');
  }
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
```

Also, ensure your `logger.js` file is set up to log to both the standard output
and a file like this:

```javascript
[label logger.js]
import pino from 'pino';

const __dirname = import.meta.dirname;

const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: `${__dirname}/server.log` },
    },
    {
      target: 'pino-pretty',
    },
  ],
});

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);

export default logger;
```

Then install the required dependencies using the command below:

```command
npm install express axios pino-http
```

Start the server on port 4000 and make a GET request to the `/crypto` route
through `curl`:

```command
node index.js
```

```command
curl http://localhost:4000/crypto > response.txt
```

You'll observe the following the following prettified log output in the server
console, corresponding to the HTTP request:

```text
[output]
[15:30:54.508] INFO (291881): request completed
    req: {
      "id": 1,
      "method": "GET",
      "url": "/crypto",
      "query": {},
      "params": {},
      "headers": {
        "host": "localhost:4000",
        "user-agent": "curl/7.85.0",
        "accept": "*/*"
      },
      "remoteAddress": "::ffff:127.0.0.1",
      "remotePort": 36862
    }
    res: {
      "statusCode": 200,
      "headers": {
        "x-powered-by": "Express",
        "content-type": "application/json; charset=utf-8",
        "content-length": "1099516",
        "etag": "W/\"10c6fc-mMUyGYJwdl+yk7A7N/rYiPWqFjo\""
      }
    }
    responseTime: 2848
...
```

The `server.log` file will contain the raw JSON output:

```command
cat server.log
```

```json
[output]
{"level":30,"time":"2023-03-03T14:30:54.508Z","pid":291881,"hostname":"ubuntu","req":{"id":1,"method":"GET","url":"/crypto","query":{},"params":{},"headers":{"host":"localhost:4000","user-agent":"curl/7.85.0","accept":"*/*"},"remoteAddress":"::ffff:127.0.0.1","remotePort":36862},"res":{"statusCode":200,"headers":{"x-powered-by":"Express","content-type":"application/json; charset=utf-8","content-length":"1099516","etag":"W/\"10c6fc-mMUyGYJwdl+yk7A7N/rYiPWqFjo\""}},"responseTime":2848,"msg":"request completed"}
```

You can further customize the output of the `pino-http` module by taking a look
at its [API documentation](https://www.npmjs.com/package/pino-http#api).

## Centralizing and monitoring your Node.js logs

One of the main advantages of logging in a structured format is the ability to
ingest them into a centralized logging system to be indexed, searched, and
analyzed efficiently. By consolidating all log data into a central location, you
will gain a holistic view of your systems' health and performance, making it
easier to identify patterns, spot anomalies, and troubleshoot issues.

[Centralizing logs](https://betterstack.com/community/guides/logging/log-aggregation/) also simplifies compliance efforts by
providing a single source of truth for auditing and monitoring purposes. In
addition, it helps to ensure that the relevant logs are properly retained and
easily accessible for any regulatory or legal audits.

Furthermore, with the right tools, centralizing logs can enable real-time
alerting and proactive monitoring, allowing you to detect and respond to issues
before they become critical. This can significantly reduce downtime and minimize
the impact on your organization's operations.

Now that you've configured Pino in your Node.js application to output structured
logs, the next step is to centralize your logs in a log management system so
that you can reap the benefits of logging in a structured format.
[Better Stack](https://betterstack.com/logs/) is one such solution that can tail
your logs, analyze and visualize them, and help with alerting when certain
patterns are detected.

There are multiple ways to send logs from your Node.js application to Better Stack, but the simplest is using the built-in [Pino transport](https://betterstack.com/docs/logs/javascript/pino/).


<iframe width="100%" height="315" src="https://www.youtube.com/embed/tMYxH0JLn38" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


To get started, create an account at [betterstack.com](https://betterstack.com). Once you're signed in, navigate to the **Sources** page and click **Connect source**:

![Better Stack Sources page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7199f84f-b711-4aef-8fc0-7bef50395900/lg2x =3024x1846)

Choose a clear and descriptive name for your new source, like "Node.js Production API", and select the platform as JavaScript & Node.js. 

![Screenshot of the Better Stack UI showing the creation of a new log source, with the name set to "Node.js Production API" and the platform selected as "JavaScript & Node.js](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/aefea3a5-4b63-4bd0-19b5-faa891385e00/lg2x =3024x3928)

Once the source is created, you’ll be provided with a source token (e.g., `qU73jvQjZrNFHimZo4miLdxF`) and an ingestion host (e.g., `s1315908.eu-nbg-2.betterstackdata.com`). Make sure to copy both, as you'll need them to set up log forwarding:

![Screenshot of the Better Stack interface showing a created log source with the source token and ingestion host highlighted, which are needed to configure log forwarding for a Node.js application](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/230fedae-f83a-4750-513f-74603382ca00/public =3024x3180)


To be able to forward your logs from Pino to Better Stack, you’ll need to install the `@logtail/pino` package first:

```command
npm install @logtail/pino
```
Then, Update your `logger.js` file to include the Better Stack transport:

```javascript
[label logger.js]
import pino from 'pino';
const __dirname = import.meta.dirname;

const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: `${__dirname}/server.log` },
    },
    {
      target: '@logtail/pino',
      options: { 
[highlight]
        sourceToken: '<your_better_stack_source_token>',
        options: { endpoint: 'https://<your_ingesting_host>' }
[/highlight]
      },
    },
    {
      target: 'pino-pretty',
    },
  ],
});

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);

export default logger;
```
Be sure to replace `<your_better_stack_source_token>` and `<your_ingesting_host>` with the values you received when creating your source.

To verify that your logs are being properly generated and sent to Better Stack, you can use the following curl commands to generate sample HTTP requests and observe the logs.

Make a first request to your API endpoint:

```command
curl http://localhost:4000/crypto
```

Make a second request with different parameters:

```command
curl http://localhost:4000/crypto?limit=10
```

Which this configuration in place, your logs will be centralized in Better Stack
and you can view them in real-time through the live tail page. You can also
filter them using any of the attributes in the logs, and created automated
alerts to notify you of significant events (such as a spike in errors).

![Screenshot of the Better Stack Live Tail interface showing logs from a Node.js application, including structured log entries generated by HTTP requests](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/591123e8-65cc-49f6-f571-af20fe759b00/orig =3024x2066)

## Final thoughts and next steps

In this article, we've provided a comprehensive overview of Node.js logging with
Pino by discussing its key features, and how to configure and customize it for
your specific needs. We hope that the information contained in this guide has
been helpful in demystifying logging with Pino and how to use it effectively in
your Node.js applications.

It is impossible to learn everything about Pino and its capabilities in one
article, so we highly recommend consulting the
[official documentation](https://getpino.io) for more information on its basic
and advanced features.

Thanks for reading, and happy logging!