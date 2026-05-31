# A Complete Guide to Winston Logging in Node.js

[Winston](https://github.com/winstonjs/winston) is the most popular logging
library for Node.js. It aims to make logging more flexible and extensible by
decoupling different aspects such as log levels, formatting, and storage so that
each API is independent and many combinations are supported. It also uses
[Node.js streams](https://nodejs.org/api/stream.html#stream) to minimize the
performance impact of implementing logging in your application.

In this tutorial, we will explain how to install, set up, and use the
[Winston](https://github.com/winstonjs/winston) logger in a Node.js application.
We'll go through all the options it provides and show how to customize them in
various ways. Finally, we'll describe how to use it in conjunction with
[Morgan middleware](https://betterstack.com/community/guides/logging/morgan-logging-nodejs/) for logging incoming
requests in [Express](https://expressjs.com/) server.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/He7Dc6DuxdI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Prerequisites

Before proceeding with the rest of this article, ensure that you have a recent
version of [Node.js](https://nodejs.org/en/download/) and `npm` installed
locally on your machine. This article also assumes that you are familiar with
the basic concepts of [logging in Node.js](https://betterstack.com/community/guides/logging/how-to-start-logging-with-node-js/).

The final step in this tutorial discusses how to configure Winston to send logs
in a centralized platform. This step is optional but recommended so that you can
collect logs from multiple servers and consolidate the data in one place for
easy access. You'll need to sign up for a free
[Better Stack Telemetry account](https://betterstack.com/telemetry) if that's something you're
interested in learning about.

Also, note that all the provided examples in this article are accurate for
**Winston 3.x**. We will also endeavor to keep this article up to date for
major releases of the framework in the future.

[ad-logs]

## Getting started with Winston

Start by creating a new Node.js project and enabling ECMAScript module support:

```command
mkdir winston-logging && cd winston-logging
```

```command
npm init -y
```

```command
npm pkg set type=module
```

Winston is available as an [npm package](https://www.npmjs.com/package/winston),
so you can install it through the command below.

```command
npm install winston
```

Next, import it into your Node.js application:

```javascript
import winston from 'winston';
```

Although Winston provides a default logger that you can use by calling a level
method on the `winston` module, it the recommended way to use it is to create a
custom logger through the `createLogger()` method:

```javascript
[label logger.js]
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export default logger;
```

Afterwards, you can start logging through methods on the `logger` object:

```javascript
[label index.js]
import logger from './logger.js';

logger.info('Info message');
logger.error('Error message');
logger.warn('Warning message');
```

This yields the following output when you run the `index.js` file:

```json
[output]
{"level":"info","message":"Info message"}
{"level":"error","message":"Error message"}
{"level":"warn","message":"Warning message"}
```

In subsequent sections, we'll examine all the properties that you can use to
customize your `logger` so that you will end up with an optimal configuration
for your Node.js application.

## Log levels in Winston

Winston supports six [log levels](https://betterstack.com/community/guides/logging/log-levels-explained/) by default. It follows
the order specified by the
[RFC5424](https://datatracker.ietf.org/doc/html/rfc5424#page-11) document. Each
level is given an integer priority with the most severe being the lowest number
and the least one being the highest.

```javascript
{
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}
```

The six log levels above each correspond to a method on the logger:

```javascript
logger.error('error');
logger.warn('warn');
logger.info('info');
logger.verbose('verbose');
logger.debug('debug');
logger.silly('silly');
```

You can also pass a string representing the logging level to the `log()` method:

```javascript
logger.log('error', 'error message');
logger.log('info', 'info message');
```

The `level` property on the `logger` determines which log messages will be
emitted to the configured transports (discussed later). For example, since the
`level` property was set to `info` in the previous section, only log entries
with a minimum severity of `info` (or maximum integer priority of 2) will be
written while all others are suppressed. This means that only the `info`,
`warn`, and `error` messages will produce output with the current configuration.

To cause the other levels to produce output, you'll need to change the value of
`level` property to the desired minimum. The reason for this configuration is so
that you'll be able to run your application in production at one level (say
`info`) and your development/testing/staging environments can be set to a less
severe level like `debug` or `silly`, causing more information to be emitted.

The accepted best practice for setting a log level is to use an environmental
variable. This is done to avoid modifying the application code when the log
level needs to be changed.

```javascript
[label logger.js]
...

const logger = winston.createLogger({
[highlight]
  level: process.env.LOG_LEVEL || 'info',
[/highlight]
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
```

With this change in place, the application will log at the `info` level if the
`LOG_LEVEL` variable is not set in the environment.

## Customizing log levels in Winston

Winston allows you to readily customize the log levels to your liking. The
default log levels are defined in `winston.config.npm.levels`, but you can also
use the [Syslog levels](https://datatracker.ietf.org/doc/html/rfc5424#page-10)
through `winston.config.syslog.levels`:

```javascript
const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.cli(),
  transports: [new winston.transports.Console()],
});
```

The `syslog` levels are shown below:

```javascript
{
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7
}
```

Afterwards, you can log using the methods that correspond to each defined level:

```javascript
winston.emerg("Emergency");
winston.crit("Critical");
winston.warning("Warning");
```

If you prefer to change the levels to a completely custom system, you'll need to
create an object and assign a number priority to each one starting from the most
severe to the least. Afterwards, assign that object to the `levels` property in
the configuration object passed to the `createLogger()` method.

```javascript
[label logger.js]
import winston from 'winston';

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export default logger;
```

You can now use methods on the `logger` that correspond to your custom log
levels as shown below:

```javascript
[label index.js]
import logger from './logger.js';

logger.fatal('fatal!');
logger.trace('trace!');
```

[summary]
### Centralize your Winston logs with Better Stack
While Winston handles flexible logging in your Node.js application, [Better Stack](https://betterstack.com/log-management) provides centralized log management with live tailing, SQL and PromQL queries, automated anomaly detection, and incident management. Collect logs from all your Node.js services in one place with integrations for Docker, Kubernetes, and more.
**Predictable pricing starting at $0.25/GB.** Start free in minutes.
[/summary]
![Better Stack log management dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)


## Formatting your log messages

Winston outputs its logs in JSON format by default, but it also supports other
formats which are accessible on the `winston.format` object. For example, if
you're creating a CLI application, you may want to switch this to the `cli`
format which will print a color coded output:

```javascript
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.cli(),
  transports: [new winston.transports.Console()],
});
```

![Winston CLI format](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/23865190-7951-4e01-2289-b13a5084f300/public =880x218)

The formats available in `winston.format` are defined in the
[logform module](https://github.com/winstonjs/logform). This module provides the
ability to customize the format used by Winston to your heart's content. You can
create a completely custom format or modify an existing one to add new
properties.

Here's an example that adds a `timestamp` field to the each log entry:

```javascript
[label logger.js]
import winston from 'winston';
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), json()),
  transports: [new winston.transports.Console()],
});

export default logger;
```

When you use a level method on the `logger`, you'll see a datetime value
formatted as `new Date().toISOString()`.

```javascript
[label index.js]
...
logger.info('Info message')
```

```json
[output]
{"level":"info","message":"Info message","timestamp":"2025-05-23T10:22:10.223Z"}
```

You can change the format of this datetime value by passing an object to
`timestamp()` as shown below. The string value of the `format` property below
must be one acceptable by the
[fecha module](https://github.com/taylorhakes/fecha).

```javascript
timestamp({
  format: 'YYYY-MM-DD hh:mm:ss.SSS A', // 2022-01-25 03:23:10.350 PM
})
```

You can also create a entirely different format as shown below:

```javascript
[label logger.js]
import winston from 'winston';
const { combine, timestamp, printf, colorize, align } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
```
```javascript
[label index.js]
import logger from './logger.js';

logger.info('Info message');
logger.error('Error message');
logger.warn('Warning message');
```

The `combine()` method merges multiple formats into one, while `colorize()`
assigns colors to the different log levels so that each level is easily
identifiable. The `timestamp()` method outputs a datatime value that corresponds
to the time that the message was emitted. The `align()` method aligns the log
messages, while `printf()` defines a custom structure for the message. In this
case, it outputs the timestamp and log level followed by the message.

```text
[output]
[2025-05-23 12:26:06.669 PM] info:      Info message
[2025-05-23 12:26:06.672 PM] error:     Error message
[2025-05-23 12:26:06.672 PM] warn:      Warning message
```

While you can format your log entries in any way you wish, the recommended
practice for server applications is to stick with a structured logging format
(like JSON) so that your logs can be easily machine readable for filtering and
gathering insights.

## Configuring transports in Winston

Transports in Winston refer to the storage location for your log entries.
Winston provides great flexibility in choosing where you want your log entries
to be outputted to. The following transport options are available in Winston by
default:

- [Console](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport):
  output logs to the Node.js console.
- [File](https://github.com/winstonjs/winston/blob/master/docs/transports.md#file-transport):
  store log messages to one or more files.
- [HTTP](https://github.com/winstonjs/winston/blob/master/docs/transports.md#http-transport):
  stream logs to an HTTP endpoint.
- [Stream](https://github.com/winstonjs/winston/blob/master/docs/transports.md#stream-transport):
  output logs to any Node.js stream.

Thus far, we've demonstrated the default
[Console transport](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport)
to output log messages to the Node.js console. Let's look at how we can store
logs in a file next.

```javascript
[label logger.js]
import winston from 'winston';
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: 'combined.log',
    }),
  ],
});

export default logger;
```

The snippet above configures the `logger` to output all emitted log messages to
a file named `combined.log`. When you run the snippet above, this file will be
created with the following contents:

```json
{"level":"info","message":"Info message","timestamp":"2025-05-23T10:35:05.008Z"}
{"level":"error","message":"Error message","timestamp":"2025-05-23T10:35:05.012Z"}
{"level":"warn","message":"Warning message","timestamp":"2025-05-23T10:35:05.012Z"}
```

In a production application, it may not be ideal to log every single message
into a single file as that will make filtering critical issues harder since it
will be mixed together with inconsequential messages. A potential solution would
be to use two `File` transports, one that logs all messages to a `combined.log`
file, and another that logs messages with a minimum severity of `error` to a
separate file.

```javascript
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: 'combined.log',
    }),
    new winston.transports.File({
      filename: 'app-error.log',
      level: 'error',
    }),
  ],
});
```

With this change in place, all your log entries will still be outputted to the
`combined.log` file, but a separate `app-error.log` will also be created and it
will contain only `error` messages. Note that the `level` property on the
`File()` transport signifies the minimum severity that should be logged to the
file. If you change it from `error` to `warn`, it means that any message with a
minimum severity of `warn` will be logged to the `app-error.log` file (`warn`
and `error` levels in this case).

A common need that Winston does not enable by default is the ability to log each
level into different files so that only `info` messages go to an `app-info.log`
file, `debug` messages into an `app-debug.log` file, and so on (see
[this GitHub issue](https://github.com/winstonjs/winston/issues/614)). To get
around this, use a custom format on the transport to filter the messages by
level. This is possible on any transport (not just `File`), since they all
inherit from
[winston-transport](https://github.com/winstonjs/winston-transport).

```javascript
const errorFilter = winston.format((info, opts) => {
  return info.level === 'error' ? info : false;
});

const infoFilter = winston.format((info, opts) => {
  return info.level === 'info' ? info : false;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: 'combined.log',
    }),
    new winston.transports.File({
      filename: 'app-error.log',
      level: 'error',
      format: combine(errorFilter(), timestamp(), json()),
    }),
    new winston.transports.File({
      filename: 'app-info.log',
      level: 'info',
      format: combine(infoFilter(), timestamp(), json()),
    }),
  ],
});
```

The above code logs only `error` messages in the `app-error.log` file and `info`
messages to the `app-info.log` file. What happens is that the custom functions
(`infoFilter()` and `errorFilter()`) checks the level of a log entry and returns
`false` if it doesn't match the specified level which causes the entry to be
omitted from the transport. You can customize this further or create other
filters as you see fit.

## Log rotation in Winston

Logging into files can quickly get out of hand if you keep logging to the same
file as it can get extremely large and become cumbersome to manage. This is
where the concept of [log rotation](https://en.wikipedia.org/wiki/Log_rotation)
can come in handy. The main purpose of log rotation is to restrict the size of
your log files and create new ones based on some predefined criteria. For
example, you can create a new log file every day and automatically delete those
older than a time period (say 30 days).

Winston provides the
[winston-daily-rotate-file module](https://github.com/winstonjs/winston-daily-rotate-file)
for this purpose. It is a transport that logs to a rotating file that is
configurable based on date or file size, while older logs can be auto deleted
based on count or elapsed days. Go ahead and install it through `npm` as shown
below:

```command
npm install winston-daily-rotate-file
```

Once installed, it may be used to replace the default `File` transport as shown
below:

```javascript
[label logger.js]
import winston from 'winston';
import 'winston-daily-rotate-file';
const { combine, timestamp, json } = winston.format;

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), json()),
  transports: [fileRotateTransport],
});

export default logger;
```

The `datePattern` property controls how often the file should be rotated (every
day), and the `maxFiles` property ensures that log files that are older than 14
days are automatically deleted. You can also listen for the following events on
a rotating file transport if you want to perform some action on cue:

```javascript
// fired when a log file is created
fileRotateTransport.on('new', (filename) => {});
// fired when a log file is rotated
fileRotateTransport.on('rotate', (oldFilename, newFilename) => {});
// fired when a log file is archived
fileRotateTransport.on('archive', (zipFilename) => {});
// fired when a log file is deleted
fileRotateTransport.on('logRemoved', (removedFilename) => {});
```

## Custom transports in Winston

Winston supports the ability to create your own transports or utilize one
[made by the community](https://www.npmjs.com/search?q=winston). A custom
transport may be used to store your logs in a database, log management tool, or
some other location. Here are some custom transports that you might want to
check out:

- [winston-mongodb](https://www.npmjs.com/package/winston-mongodb) - transport
  logs to MongoDB.
- [winston-syslog](https://www.npmjs.com/package/winston-syslog) - transport
  logs to Syslog.
- [winston-telegram](https://www.npmjs.com/package/winston-telegram) - send logs
  to Telegram.
- [@logtail/winston](https://www.npmjs.com/package/@logtail/winston) - send logs
  to [Better Stack Telemetry](https://betterstack.com/telemetry).
- [winston-mysql](https://www.npmjs.com/package/winston-mysql) - store logs in
  MySQL.

## Adding metadata to your logs

Winston supports the addition of metadata to log messages. You can add default
metadata to all log entries, or specific metadata to individual logs. Let's
start with the former which can be added to a `logger` instance through the
`defaultMeta` property:

```javascript
[label logger.js]
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: {
    service: 'admin-service',
  },
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export default logger;
```

When you log any message using the `logger` above, the contents of the
`defaultMeta` object will be injected into each entry:

```json
[output]
{"level":"info","message":"Info message","service":"admin-service"}
{"level":"error","message":"Error message","service":"admin-service"}
{"level":"warn","message":"Warning message","service":"admin-service"}
```

This default metadata can be used to differentiate log entries by service or
other criteria when logging to the same location from different services.

Another way to add metadata to your logs is by creating a child logger through
the `child` method. This is useful if you want to add certain metadata that
should be added to all log entries in a certain scope. For example, if you add a
`requestId` to your logs entries, you can search your logs and find the all the
entries that pertain to a specific request.

```javascript
[label index.js]
import logger from './logger.js';

const childLogger = logger.child({
  requestId: 'f9ed4675f1c53513c61a3b3b4e25b4c0',
});

childLogger.info('Info message');
childLogger.error('Error message');
```

```json
[output]
{"level":"info","message":"Info message","requestId":"f9ed4675f1c53513c61a3b3b4e25b4c0","service":"admin-service"}
{"level":"error","message":"Error message","requestId":"f9ed4675f1c53513c61a3b3b4e25b4c0","service":"admin-service"}
```

A third way to add metadata to your logs is to pass an object to the level
method at its call site:

```javascript
[label index.js]
import logger from './logger.js';

const childLogger = logger.child({ requestId: 'f9ed4675f1c53513c61a3b3b4e25b4c0' });

childLogger.info('File uploaded successfully', {
  file: 'something.png',
  type: 'image/png',
  userId: 'jdn33d8h2',
});
```

```json
[output]
{"file":"something.png","level":"info","message":"File uploaded successfully","requestId":"f9ed4675f1c53513c61a3b3b4e25b4c0","service":"admin-service","type":"image/png","userId":"jdn33d8h2"}
```

## Logging errors in Winston

One of the most surprising behaviors of Winston for newcomers to the library is
in its way of handling errors. Logging an instance of the `Error` object results
in an empty message:

```javascript
[label logger.js]
import winston from 'winston';
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.Console()],
});

export default logger;
```
```javascript
[label index.js]
import logger from './logger.js';

logger.error(new Error("an error"));
```

When you run `index.js`, it will yield:

```json
[output]
{"level":"error","timestamp":"2025-05-23T10:43:22.991Z"}
```

Notice how the `message` property is omitted, and other properties of the
`Error` (like its `name` and `stack`) are also not included in the output. This
can result in a nightmare situation where errors in production are not recorded
leading to lost time when troubleshooting.

Fortunately, you can fix this issue by importing and specifying the `errors`
format as shown below:

```javascript
[label logger.js]
import winston from 'winston';
const { combine, timestamp, json, errors } = winston.format;

const logger = winston.createLogger({
  level: "info",
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [new winston.transports.Console()],
});

export default logger;
```

You will now get the proper output:

```json
[output]
{"level":"error","message":"an error","stack":"Error: an error\n    at Object.<anonymous> (/home/ayo/winston-logging/index.js:9:14)\n    at Module._compile (node:internal/modules/cjs/loader:1105:14)\n    at Module._extensions..js (node:internal/modules/cjs/loader:1159:10)\n    at Module.load (node:internal/modules/cjs/loader:981:32)\n    at Module._load (node:internal/modules/cjs/loader:827:12)\n    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:77:12)\n    at node:internal/main/run_main_module:17:47","timestamp":"2022-07-03T20:11:23.303Z"}
```

## Handling uncaught exceptions and uncaught promise rejections

Winston provides the ability to automatically catch and log uncaught exceptions
and uncaught promise rejections on a logger. You'll need to specify the
transport where these events should be emitted to through the
`exceptionHandlers` and `rejectionHandlers` properties respectively:

```javascript
[label logger.js]
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exception.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'rejections.log' }),
  ],
});

export default logger;
```

The `logger` above is configured to log uncaught exceptions to an
`exception.log` file, while uncaught promise rejections are placed in a
`rejections.log` file. You can try this out by throwing an error somewhere in
your code without catching it.

```javascript
[label index.js]
import logger from './logger.js';

throw new Error('An uncaught error');
```

You'll notice that the entire stack trace is included in the log entry for the
exception, along with the date and message.

```command
cat exception.log
```

```json
[output]
{"date":"Mon Jun 06 2022 14:00:03 GMT+0100 (West Africa Standard Time)","error":{},"exception":true,"level":"error","message":"uncaughtException: An uncaught error\nError: An uncaught error\n    at Object.<anonymous> (/home/ayo/winston-logging/index.js:15:7)\n    at Module._compile (node:internal/modules/cjs/loader:1105:14)\n    at Module._extensions..js (node:internal/modules/cjs/loader:1159:10)\n    at Module.load (node:internal/modules/cjs/loader:981:32)\n    at Module._load (node:internal/modules/cjs/loader:827:12)\n    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:77:12)\n    at node:internal/main/run_main_module:17:47","os":{"loadavg":[1.75,0.82,0.95],"uptime":271655.58},"process":{"argv":[". . ."],"cwd":"/home/ayo/dev/betterstack/betterstack-community/demo/snippets","execPath":"/home/ayo/.volta/tools/image/node/18.1.0/bin/node","gid":1000,"memoryUsage":{"arrayBuffers":110487,"external":465350,"heapTotal":11141120,"heapUsed":7620128,"rss":47464448},"pid":421995,"uid":1000,"version":"v18.1.0"},"stack":". . .","trace":[. . .]}
```

Winston will also cause the process to exit with a non-zero status code once it
logs an uncaught exception. You can change this by setting the `exitOnError`
property on the logger to `false` as shown below:

```javascript
import winston from 'winston';
const logger = winston.createLogger({ exitOnError: false });

// or

logger.exitOnError = false;
```

Note that the accepted best practice is to exit immediately after an uncaught
error is detected as the program will be in an undefined state, so the above
configuration is not recommended. Instead, you should let your program crash and
set up a Node.js process manager (such as [PM2](https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/)) to restart it
immediately while setting up some alerting mechanism to notify you of the
problem (see section on
[Centralizing Logs](#centralizing-your-logs-in-the-cloud) below).

## Profiling your Node.js code with Winston

Winston also provides basic profiling capabilities on any logger through the
`profile()` method. You can use it to collect some basic performance data in
your application hotspots in the absence of specialized tools.

```javascript
[label index.js]
import logger from './logger.js';

// start a timer
logger.profile('test');
setTimeout(() => {
  // End the timer and log the duration
  logger.profile('test');
}, 1000);
```

The code above produces the following output:

```json
[output]
{"durationMs":1001,"level":"info","message":"test"}
```

You can also use the `startTimer()` method on a `logger` instance to create a
new timer and store a reference to it in a variable. Then use the `done()`
method on the timer to halt it and log the duration:

```javascript
[label index.js]
import logger from './logger.js';

// start a timer
const profiler = logger.startTimer();
setTimeout(() => {
  // End the timer and log the duration
  profiler.done({ message: 'Logging message' });
}, 1000);
```

```javascript
[output]
{"durationMs":1001,"level":"info","message":"Logging message"}
```

The `durationMs` property contains the timers' duration in milliseconds. Also,
log entries produced by the Winston profiler are set to the `info` level by
default, but you can change this by setting the `level` property in the argument
to `profiler.done()` or `logger.profile()`:

```javascript
profiler.done({ message: 'Logging message', level: 'debug' });
// or
logger.profile('test', { level: 'debug' });
```

## Working with multiple loggers in Winston

A large application will often have multiple loggers with different settings for
logging in different areas of the application. This is exposed in Winston
through `winston.loggers`:

```javascript
[label loggers.js]
import winston from 'winston';

winston.loggers.add('serviceALogger', {
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: {
    service: 'service-a',
  },
  format: winston.format.logstash(),
  transports: [
    new winston.transports.File({
      filename: 'service-a.log',
    }),
  ],
});

winston.loggers.add('serviceBLogger', {
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: {
    service: 'service-b',
  },
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
```

The `serviceALogger` shown above logs to a `service-a.log` file using the
built-in Logstash format, while `serviceBLogger` logs to the console using the
JSON format. Once you've configured the loggers for each service, you can access
them in any file using the `winston.loggers.get()` provided that you import the
configuration preferably in the entry file of the application:

```javascript
[label index.js]
import './loggers.js';
import winston from 'winston';

const serviceALogger = winston.loggers.get('serviceALogger');
const serviceBLogger = winston.loggers.get('serviceBLogger');

serviceALogger.error('logging to a file');
serviceBLogger.warn('logging to the console');
```

```command
node index.js
```

```json
[output]
{"level":"warn","message":"logging to the console","service":"service-b"}
```

```command
cat service-a.log
```

```text
[output]
{"@fields":{"level":"error","service":"service-a"},"@message":"logging to a file"}
```

## Logging in an Express application using Winston and Morgan

[Morgan](https://www.npmjs.com/package/morgan) is an HTTP request logger
middleware for [Express](https://expressjs.com/) that automatically logs the
details of incoming requests to the server (such as the remote IP Address,
request method, HTTP version, response status, user agent, etc.), and generate
the logs in the specified format. The main advantage of using Morgan is that it
saves you the trouble of writing a custom middleware for this purpose.

Here's a simple program demonstrating Winston and Morgan being used together in
an Express application. When you connect Morgan with a Winston logger, all your
logging is formatted the same way and goes to the same place.

```javascript
[label server.js]
import winston from 'winston';
import express from 'express';
import morgan from 'morgan';
import axios from 'axios';

const app = express();
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: 'http',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    json(),
  ),
  transports: [new winston.transports.Console()],
});

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  },
);

app.use(morganMiddleware);

app.get('/crypto', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api2.binance.com/api/v3/ticker/24hr',
    );
    const tickerPrice = response.data;
    res.json(tickerPrice);
  } catch (err) {
    logger.error(err);
    res.status(500).send('Internal server error');
  }
});

app.listen(4000, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    return;
  }
  console.log('Server is running on port 4000');
});
```

The `morgan()` middleware function takes two arguments: a string describing the
format of the log message and the configuration options for the logger. The
format is composed up of
[individual tokens](https://github.com/expressjs/morgan#tokens), which can be
combined in any order. You can also use a
[predefined format](https://github.com/expressjs/morgan#predefined-formats)
instead. In the second argument, the `stream` property is set to log the
provided message using our custom logger at the `http` severity level. This
reflects the severity that all Morgan events will be logged at.

Before you execute this code, install all the required dependencies first:

```command
npm install winston express morgan axios
```

Afterward, start the server and send requests to the `/crypto` route through the
commands below:

```command
node server.js
```

```command
curl http://localhost:4000/crypto
```

You should observe the following output everytime you rerun the `curl` command:

```json
[output]
{"level":"http","message":"GET /crypto 200 1559281 - 3787.124 ms","timestamp":"2025-05-23 01:10:50.777 PM"}
{"level":"http","message":"GET /crypto 200 1559167 - 3536.938 ms","timestamp":"2025-05-23 01:11:21.554 PM"}
{"level":"http","message":"GET /crypto 200 1559204 - 685.213 ms","timestamp":"2025-05-23 01:11:23.833 PM"}
```

Notice that the all the request metadata outputted by Morgan is placed as a
string in the `message` property which makes it harder to search and filter.
Let's configure Morgan such that the message string will be a stringified JSON
object.

```javascript
[label server.js]
. . .
const morganMiddleware = morgan(
  function (tokens, req, res) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      content_length: tokens.res(req, res, 'content-length'),
      response_time: Number.parseFloat(tokens['response-time'](req, res)),
    });
  },
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: (message) => {
        const data = JSON.parse(message);
        logger.http(`incoming-request`, data);
      },
    },
  }
);
. . .
```

The string argument to the `morgan()` function has been changed to a function
that returns a stringified JSON object. In the `write()` function, the JSON
string is parsed and the resulting object is passed as metadata to the
`logger.http()` method. This ensures that each metric is produced as a separate
property in the log entry.

Restart the server and send requests to the `/crypto` route once again. You'll
observe the following output:

```json
[output]
{"content_length":"1054555","level":"http","message":"incoming-request","method":"GET","response_time":2974.763,"status":200,"timestamp":"2022-06-06 08:46:41.267 PM","url":"/crypto"}
```

## Centralizing your logs in the cloud

We already discussed logging to files in a previous section of this tutorial.
It's a great way to persist your log entries for later examination, but may be
insufficient for distributed applications running on multiple servers since
looking at the logs of a single server may not longer enough to locate and
diagnose problems.

A widely employed solution in such cases is to collect the logs from individual
servers and centralize them one place so that its easy to get a complete picture
on any issue. There are several solutions for aggregating logs such as the open
source
[Elasticsearch, Logstash, and Kibana (ELK) stack](https://www.elastic.co/webinars/introduction-elk-stack)
but a reliable setup can be convoluted especially if you're opting for a
self-hosted solution.

The simplest, and often more cost-effective way to centralized logs is to use a
cloud-based service. Most services offer log filtering, alerting, and an option
for unlimited log storage which could help with spotting long-term trends. In
this section, we will briefly discuss how to send Node.js application logs to
one such service [Better Stack Telemetry](https://betterstack.com/telemetry) when using the
Winston logger. We'll demonstrate this process using the `server.js` example
from the previous section.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/tMYxH0JLn38" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


The first step involves creating or logging in to your
[Better Stack Telemetry account](https://betterstack.com/telemetry), then find the **Sources**
option in the left-hand menu and click the **Connect source** button on the
right:

![Telemetry sources](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7199f84f-b711-4aef-8fc0-7bef50395900/lg2x =3024x1846)


Give your source a name and select the **Node.js** platform, then click the
**Create source** button.

![Create Better Stack Telemetry source](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/aefea3a5-4b63-4bd0-19b5-faa891385e00/lg2x =3024x3928)

After creating the source, you'll receive a source token (such as `qU73jvQjZrNFHimZo4miLdxF`) and an ingestion host (like `s1315908.eu-nbg-2.betterstackdata.com`). Copy both values as they're essential for configuring log forwarding:

![Screenshot of the Better Stack interface showing a created log source with the source token and ingestion host highlighted, which are needed to configure log forwarding for a Node.js application](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/230fedae-f83a-4750-513f-74603382ca00/public =3024x3180)

Return to your terminal and install the
[@logtail/node](https://www.npmjs.com/package/@logtail/node) and
[@logtail/winston](https://www.npmjs.com/package/@logtail/winston) packages in
your Node.js project:

```command
npm install @logtail/node @logtail/winston
```

Afterward, make the following changes to your `server.js` file:

```javascript
[label server.js]
...
import axios from 'axios';
[highlight]
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

// Create a Logtail client
const logtail = new Logtail('<your_source_token>', {
  endpoint: 'https://<your_ingesting_host>',
});
[/highlight]
const { combine, timestamp, json } = winston.format;
const app = express();

const logger = winston.createLogger({
  level: 'http',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    json()
  ),
  transports: [
    new winston.transports.Console(), 
[highlight]
    new LogtailTransport(logtail)
[/highlight]
  ],
});

// Rest of your server code...

. . .
```

The `Logtail` class is imported and initialized with your source token and ingesting host (replace the `<your_source_token>` and `<your_ingesting_host>` placeholders with your actual values). 

In a real application, you should use environment variables to control these values. The `LogtailTransport` class is a Winston-compatible transport that transmits Winston logs to Better Stack when initialized in the `transports` array as shown above.

After saving the `server.js` file above, restart your server and send a few
requests to the `/crypto` route. Your logs will continue to appear in the
console as before, but it will also sync to Better Stack Telemetry in realtime. Head over
to your browser and click the **Live tail** link under your source name, or you
can click the **Live tail** menu entry on the left and filter the logs using the
dropdown on the top left:

![Better Stack Telemetry sources filter](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cf284936-b1c8-4a76-7d0b-a1e3fcb0b100/lg2x =3024x1530)

You should observe that your Winston-generated application logs are coming
through as expected. You can click a log entry to expand its properties:

![Better Stack Telemetry logs](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e0896d72-1171-41d3-15f2-6b37f7ddc500/md1x =3024x1670)


From this point onwards, all your application logs from any server or
environment will be centralized in Better Stack Telemetry. You can easily apply filters to find
the information you need or set up alerts to notify you whenever your logs match
certain conditions.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


For more information on integrating Better Stack Telemetry in your
application, explore the [full documentation](https://betterstack.com/docs/logs/start/).

## Final thoughts

In this article, we've examined the Winston logging package for Node.js
applications. It provides [everything necessary in a logging
framework](https://betterstack.com/community/guides/logging/logging-framework/), such as structured (JSON) logging, colored
output, log levels, and the ability to log to several locations. It also has a
simple API and is easy to customize, making it a suitable solution for any
type of project.

We hope this article has helped you learn about everything that you can do with
Winston, and how it may be used to develop a good logging system in your
application. Don't forget to check out it's
[official documentation pages](https://github.com/winstonjs/winston) to learn
more.

Thanks for reading, and happy coding!