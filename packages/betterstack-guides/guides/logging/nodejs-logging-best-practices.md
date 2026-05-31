# 11 Best Practices for Logging in Node.js

[The Console module](https://nodejs.org/api/console.html) provides
straightforward logging methods that are globally available, making it easy to
add basic debugging messages to any Node.js program. These methods write to the
standard output and standard error by default:

- `console.error()`, `console.warn()`: prints messages to the standard error.
- `console.trace()`: writes debugging messages with a stack trace to the
  standard error.
- `console.info()`, `console.log()`: prints messages to the standard output.

While the above methods provide an adequate way to quickly debug your code using
print statements, their lack of [convenience features](https://betterstack.com/community/guides/logging/logging-framework/) like
log levels, structured logging formats, timestamps, customizable output
destinations, and context-aware logging make them wholly unsuitable for serious
production logging.

To ensure that you're well set up to address Node.js production challenges,
you'll need to invest some time to set up a proper logging solution that can
help save countless hours when troubleshooting and analyzing issues in the
future.

With this in mind, let's examine some best practices to follow when getting
started with logging in Node.js.

| #   | Best practice                                   | Impact     | Difficulty |
| --- | ----------------------------------------------- | ---------- | ---------- |
| 1   | Opt for a recognized logging framework          | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     |
| 2   | Use structured logging                          | ⭐⭐⭐⭐⭐ | ⭐         |
| 3   | Employ log levels correctly                     | ⭐⭐⭐⭐⭐ | ⭐⭐       |
| 4   | Write descriptive log messages                  | ⭐⭐⭐⭐   | ⭐⭐       |
| 5   | Always include a timestamp                      | ⭐⭐⭐⭐⭐ | ⭐         |
| 6   | Add contextual fields to your log entries       | ⭐⭐⭐⭐   | ⭐⭐⭐     |
| 7   | Log unexpected errors with a stack trace        | ⭐⭐⭐⭐⭐ | ⭐         |
| 8   | Ensure sensitive data stays out of logs         | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   |
| 9   | Log for more than troubleshooting purposes      | ⭐⭐⭐     | ⭐⭐⭐     |
| 10  | Always log to the standard output               | ⭐⭐⭐     | ⭐⭐       |
| 11  | Centralize your logs in a log management system | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   |

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


## 1. Opt for a recognized logging framework

We've already established the unsuitability of the Console module for production
logging. The good news is there are several [third-party logging
options](https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/) that can adequately fill this gap. Among
the frontrunners are
[Winston](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/)
and [Pino](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/), two
established solutions that provide robust logging capabilities for Node.js
applications.

Throughout the remainder of this article, I'll use both frameworks to
demonstrate various logging concepts. If you're keen on diving deeper into
either framework, refer to our dedicated
[Pino](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/) and
[Winston](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/)
guides for a comprehensive setup walkthrough

## 2. Use structured logging

While [unstructured logs](https://betterstack.com/community/guides/logging/log-formatting/), primarily human-readable strings with
embedded variables, are intuitive for us, they pose challenges for machine
processing. Consider the following log entry:

```text
image 'file.jpg' was uploaded successfully
```

With countless such logs, parsing requires complex regular expressions and lacks
consistency for automated tools. Enter [structured formats](https://betterstack.com/community/guides/logging/log-formatting/)
which helps with organizing the event data upon creation. Here's a structured
rendition of the previous log:

```json
{
  "level": "info",
  "timestamp": "2023-10-25T07:12:46.743Z",
  "filename": "file.jpg",
  "msg": "image 'file.jpg' was uploaded successfully"
}
```

In this example, each variable is placed in a distinct property to help simplify
event grouping or filtering. JSON is the prevalent structured format choice due
to its wide compatibility, but alternatives such as
[LogFmt](https://www.brandur.org/logfmt) also exist.

One downside of structured logs is readability, given they're primarily for
automated tools rather than humans. These tools typically process and present
the logs in user-friendly formats.

To improve log readability, you can configure your chosen framework to print a
more human-readable format for easy digestion during development while
preserving the structured output in production.

Additional tools like [pino-pretty](https://getpino.io/#/docs/pretty) can also
be used to prettify and colorize logs:

```command
node index.js | pino-pretty
```

A log such as:

```json
{"level":30,"time":"2022-06-16T14:33:14.245Z","pid":373373,"hostname":"fedora","user_id":"283487","msg":"user profile updated"}
```

will be subsequently transformed in the terminal to:

```text
[2022-06-16T14:33:39.526Z] INFO (373617 on fedora): user profile updated
    user_id: "283487"
```

## 3. Employ log levels correctly

[Log levels](https://betterstack.com/community/guides/logging/log-levels-explained/) define the severity or urgency of a log
entry. For example, a message that reads like this:

```json
{"message":"user 'xyz' created successfully"}
```

has a much different implication than one that reads like this:

```json
{"message":"database failed to connect"}
```

The former signals routine operation, while the latter indicates a potential
critical error. Without log levels, distinguishing between trivial and serious
events becomes daunting, undermining efficient automated alerts or manual
reviews.

With severity levels, these messages might appear as:

```json
{"level":"info","message":"user 'xyz' created successfully"}
{"level":"fatal","message":"database failed to connect"}
```

Typically, event severity is conveyed via a `level` property which could be a
string or integer. Most frameworks output string levels but Pino uses integers:

```javascript
{"level":30,"time":1655358744512,"pid":309903,"hostname":"fedora","msg":"user 'xyz' created successfully"}
```

Utilizing log levels also lets you adjust the logging granularity based on the
environment. For example, you can use `DEBUG` or `TRACE` in
[debugging](https://betterstack.com/community/guides/scaling-nodejs/nodejs-debugging/) or testing environments, and `INFO` or `ERROR` in
production. We recommend managing this setting via an environment variable to
ensure quick adaptability without code alteration:

```javascript
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
});

const logger = pino({
  level: process.env.LOG_LEVEL || 'warn',
});
```

See our article on [log levels](https://betterstack.com/community/guides/logging/log-levels-explained/) to learn more about how to
choose the appropriate level for an event.

## 4. Write descriptive log messages

To ensure each log entry offers meaningful insights, it's essential to include
thorough details about the event in question. Aim for comprehensive log messages
without crossing into the realm of unnecessary or redundant information.

For example, consider these suboptimal log messages:

- User authentication failed (Which user?).
- Something went wrong (Too generic).
- Value exceeds 100 (What value? Why is 100 the threshold?).
- Operation successful (What operation? What were its parameters or inputs?)

Contrast with more elucidative versions:

- Authentication failed for user 'USR-1234'
- Unexpected error during payment processing for order ID: 34567
- Temperature sensor reading (105°C) exceeds safety threshold of 100°C.
- File 'data.csv' uploaded successfully to '/uploads/data/'

By providing such detailed messages, it'll be that much easier to make sense of
the logs when you need it the most.

## 5. Always include a timestamp

Ensuring each log entry is accompanied by a timestamp is crucial for
contextualizing and organizing your logs. Without the ability to discern a
recent event from one logged days earlier, navigating your logs becomes almost
impossible.

Most logging frameworks include timestamps in the log output by default. Pino,
for instance, records the elapsed milliseconds since January 1, 1970 00:00:00
UTC in a `time` property:

```json
[output]
{"level":30,"time":1655234000831,"pid":214017,"hostname":"fedora","msg":"Server restarted after receiving shutdown signal"}
```

You'll usually be able to customize the timestamp property and format. We
generally
[recommend using the ISO-8601 format](https://betterstack.com/community/guides/logging/log-formatting/#3-use-a-standard-timestamp-format)
and `timestamp` property respectively. You can easily
[configure Pino](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/#customizing-the-default-fields)
in this manner as shown below:

```javascript
const pino = require("pino");
const logger = pino({
  [highlight]
  timestamp: () => `",timestamp":"${new Date(Date.now()).toISOString()}"`,
  [/highlight]
});

logger.info("Server restarted after receiving shutdown signal")
```

```json
[output]
{
  "level": 30,
[highlight]
  "timestamp": "2022-06-15T05:03:17.639Z",
[/highlight]
  "pid": 226316,
  "hostname": "fedora",
  "msg": "Server restarted after receiving shutdown signal"
}
```

[ad-logs]

## 6. Add contextual fields to your log entries

Incorporating relevant details into log entries—known as contextual
logging—enables a holistic understanding of events and makes tracing
transactions or requests across various systems easier. Often, the addition of
unique identifiers like transaction IDs, request IDs, or user IDs provides
clarity and allows for easier correlation of log entries.

Pino and Winston, among others, facilitate the addition of contextual details at
the time of logging. Using Pino as an example:

```javascript
const pino = require('pino');
const logger = pino({
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
});

logger.info(
  {
    requestID: "f9ed4675f1c53513c61a3b3b4e25b4c0",
  },
  "Uploading 'image.png' was successful",
);
```

```json
[output]
{
  "level": 30,
  "timestamp": "2023-10-25T01:06:06.783Z",
  "pid": 605689,
  "hostname": "fedora",
  "requestID": "f9ed4675f1c53513c61a3b3b4e25b4c0",
  "msg": "Uploading image.png was successful"
}
```

In the example above, the `requestID` property enriches the log output, making
it possible to identify the exact request associated with the logged event. This
ability to contextualize log entries can significantly aid in event correlation
and system analysis.

To avoid repeating contextual information across multiple log entries, child
loggers prove beneficial. They retain the properties of their parents but also
incorporate additional context which is subsequently included in each log
messages they produce:

```javascript
const child = logger.child({
  service: 'UserService',
});

child.info({ userID: 'USR-1234' }, "user 'USR-1234' updated successfully");
```

```json
[output]
{
  "level": 30,
  "timestamp": "2023-10-25T01:09:17.304Z",
  "pid": 607573,
  "hostname": "fedora",
  "service": "UserService",
  "userID": "USR-1234",
  "msg": "user 'USR-1234' updated successfully"
}
```

With this approach, every entry generated by the `child` logger inherently
contains the `service` property, simplifying the task of monitoring events from
a particular service.

## 7. Log unexpected errors with a stack trace

One of the primary goals of logging [exceptions](https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/) is to determine
the root cause of issues quickly. An error message alone might not provide
sufficient insight into what went wrong, whereas a stack trace can pinpoint the
exact location of an error, helping you diagnose the problem faster.

```json
[output]
{
  "level": 50,
  "time": "2022-06-15T21:23:04.436Z",
  "pid": 285659,
  "hostname": "fedora",
  "err": {
    "type": "Error",
    "message": "an error",
    "stack": "Error: an error\n    at Object.<anonymous> (/home/ayo/dev/betterstack/betterstack-community/demo/snippets/main.js:23:9)\n    at Module._compile (node:internal/modules/cjs/loader:1105:14)\n    at Module._extensions..js (node:internal/modules/cjs/loader:1159:10)\n    at Module.load (node:internal/modules/cjs/loader:981:32)\n    at Module._load (node:internal/modules/cjs/loader:827:12)\n    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:77:12)\n    at node:internal/main/run_main_module:17:47"
  },
  "msg": "an error"
}
```

The entry above provides comprehensive error details, including the error type,
error message, and the associated stack trace. This allows you to quickly
pinpoint where the error originated within the codebase and the program flow
that led to the problem.

It's also necessary to account for uncaught exceptions and uncaught promise
rejections in your application. Normally, these events should cause the program
to exit but they could be caught and logged first so that a proper investigation
can be done afterward:

```javascript
const pino = require('pino');
const logger = pino();

process.on('uncaughtException', (err) => {
  logger.fatal(err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.fatal(err);
  process.exit(1);
});
```

## 8. Ensure sensitive data stays out of logs

Your application logs should never capture data like passwords, credit card
details, or authorization tokens. In some contexts, even IP addresses might
qualify as Personally Identifiable Information (PII).

Recall the
[2018 incident](https://www.usatoday.com/story/tech/news/2018/05/03/twitter-tells-all-users-change-your-password/578864002/)
when Twitter inadvertently logged millions of plaintext passwords into an
internal system. Even though no misuse was detected, this serves as a stark
reminder of the implications of negligent logging. Data breaches through logs
could lead to hefty penalties under regulations like Europe's GDPR, California's
CCPA, and other data protection laws.

[Pino's log redaction](https://getpino.io/#/docs/redaction) is a useful feature
in this context. You can configure which keys to redact, either replacing with a
placeholder or omitting them entirely:

```javascript
const pino = require('pino');
const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: ['name', 'email', 'password', 'profile.address', 'profile.phone'],
});

const user = {
  name: 'John doe',
  id: '283487',
  email: 'john@doe.com',
  profile: {
    address: '1, Avengers street',
    phone: 123456789,
    favourite_color: 'Red',
  },
};

logger.info(user, 'user profile updated');
```

Logging the `user` object above will produce the following output:

```json
[output]
{"level":30,"time":"2022-06-16T13:19:48.610Z","pid":362100,"hostname":"fedora","name":"[Redacted]","id":"283487","email":"[Redacted]","profile":{"address":"[Redacted]","phone":"[Redacted]","favourite_color":"Red"},"msg":"user profile updated"}
```

By tweaking the configuration, fields can be omitted:

```javascript
const pino = require('pino');
const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  [highlight]
  redact: {
    paths: ['name', 'password', 'profile.address', 'profile.phone'],
    remove: true,
  },
  [/highlight]
});

. . .
```

Resulting in:

```json
[output]
{"level":30,"time":"2022-06-16T13:25:02.141Z","pid":364057,"hostname":"fedora","id":"283487","profile":{"favourite_color":"Red"},"msg":"user profile updated"}
```

Note that such techniques should remain as supplementary defenses, and the
primary line of defense should be judicious logging practices, such as only
logging user IDs instead of full objects.

See our guide to [keeping sensitive data out of logs](https://betterstack.com/community/guides/logging/sensitive-data/) to learn
other useful techniques.

## 9. Log for more than troubleshooting purposes

While troubleshooting problems is the primary use case for logging, it can also
a pivotal role in auditing, profiling, and extracting insights about user
behavior. These insights can significantly influence future product direction.

Audit logging encompasses recording key application activities to uphold
business policies or regulatory requirements. Typical audit log entries might
include:

- Administrative actions like user creation or deletion.
- Authentication endeavors, both successes and failures, and granting or denying
  resource access.
- Data interactions, like user profile edits or document access.
- Critical events, e.g., extensive data exports.
- Broad-scope application changes.

Since each entry is timestamped, rudimentary performance metrics can be also be
extracted accordingly. By marking the beginning and end of operations, you can
gain insights into application sections needing refinement.

Winston provides some basic profiling tools that you can take advantage of:

```javascript
const winston = require('winston');
const { combine, timestamp, json, errors } = winston.format;
const logger = winston.createLogger({
  level: 'info',
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [new winston.transports.Console()],
});

const profiler = logger.startTimer();

setTimeout(() => {
  // End the timer and log the duration
  profiler.done({ message: 'Timer completed' });
}, 1000);
```

This produces a `durationMs` property in the log entry that represents the
timer's duration in milliseconds.

```json
[output]
{"durationMs":1002,"level":"info","message":"Timer completed"}
```

## 10. Always log to the standard output

Logging frameworks often present myriad output destinations for logs. Both
[Pino](https://getpino.io/#/docs/transports) and
[Winston](https://github.com/winstonjs/winston#transports) offer native and
external transports, enabling log dispatch to varied targets like the console,
files, HTTP endpoints, databases, and more.

Despite these options, directing your application logs to standard output is
usually the best approach, delegating additional processing or redirection to
[dedicated log shippers](https://betterstack.com/community/guides/logging/log-shippers-explained/). In production environments,
the log stream can be captured by [Docker](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/),
Kubernetes, or using tools like [Vector](https://betterstack.com/community/guides/logging/vector-explained/) or
[Fluentd](https://betterstack.com/community/guides/logging/fluentd-explained/) depending on how the application is deployed.

This method offers unparalleled flexibility in determining log destinations
across various environments since dedicated log shippers typically present a
vast array of options that might be absent or challenging to integrate within
logging frameworks.

There might be exceptions to this practice, particularly when your deployment
environment isn't under your full control. In such scenarios, explore the
platform's logging mechanisms or harness the capabilities offered by your chosen
logging framework.

## 11. Centralize your logs in a log management system

As soon as your application goes live, it will begin to generate logs on the
host server. While accessing each server to view the logs might be feasible for
a handful, doing so across a myriad of servers quickly becomes cumbersome and
inefficient.

The optimal strategy is to aggregate all your log data and consolidate them in
one place. Numerous tools exist for this purpose, from [open-source
options](https://betterstack.com/community/comparisons/open-source-log-managament/) you can self-host to cloud-based SaaS
providers which can usually be integrated within minutes.

Opting for the latter can be particularly advantageous if maintaining an
in-house log management infrastructure is either too resource-intensive or
costly due to operational complexity. Regardless of the solution you choose,
[centralizing your logs](https://betterstack.com/community/guides/logging/log-aggregation/) offers numerous advantages:

- Gives an overarching perspective of logs across multiple active instances.
- Enables custom alerting configurations, such as frequent `ERROR` events or
  `FATAL` errors.
- Facilitates intuitive data visualization, allowing seamless sharing with other
  organizational members.
- Guarantees log accessibility even if your application servers are down.
- Assists in adhering to log retention policies and ensuring long-term storage.

[Better Stack](https://betterstack.com/log-management) offers a streamlined approach to
centralized log management, combining live tailing, alert notifications,
interactive dashboards, uptime tracking, and incident management within a sleek,
user-friendly interface.


![Better Stack log management dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)


 To get started,
[sign up for a free account](https://telemetry.betterstack.com/users/sign-up) and
[read the docs](https://betterstack.com/docs/logs/javascript/) to examine the
options for integrating it into your application.

While integrations for
[Pino](https://betterstack.com/docs/logs/javascript/pino/),
[Winston](https://betterstack.com/docs/logs/javascript/winston/), and others are
provided for directly transmitting your logs to Better Stack, we recommend
employing a dedicated log routing solution like [Vector](https://betterstack.com/community/guides/logging/vector-explained/) for
transmission. Upon successful integration, you'll find your logs dynamically
updating in the **Live Tail** segment of the dashboard.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


[summary]
## Side note: Get a Node.js logs dashboard

Save hours of sifting through Node.js logs. Centralize with [Better Stack](https://betterstack.com/logs) and start visualizing your log data in minutes.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Final thoughts

Implementing these 11 logging best practices is a great first step to crafting a
comprehensive logging strategy for your Node.js application, but you'll need to
monitor your progress and regularly review your logging practices to ensure they
continue to deliver the value you need.

Thanks for reading, and happy logging!