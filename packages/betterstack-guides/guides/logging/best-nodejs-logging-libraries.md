# Logging in Node.js: A Comparison of the Top 8 Libraries

If you've recently delved into [Node.js
logging](https://betterstack.com/community/guides/logging/how-to-start-logging-with-node-js/), you've likely encountered the
limitations of the `Console` API. While it's useful for basic debugging in
development, it lacks crucial features like [log levels](https://betterstack.com/community/guides/logging/log-levels-explained/),
timestamps, structured formats, and more. These limitations make production
logging challenging.

To overcome these shortcomings, [logging libraries](https://betterstack.com/community/guides/logging/logging-framework/) come to
the rescue. These libraries offer a wide range of features that enable you to
effectively capture and record notable events in your application.

Choosing the right logging library from the myriad of options available can be
overwhelming. However, this article is here to help. We'll dive into the top
eight Node.js logging libraries, discussing their strengths and weaknesses. This
information will empower you to make an informed decision that aligns with your
logging needs.

Let's begin!

| Library     | Weekly downloads | GitHub stars |
| ----------- | ---------------- | ------------ |
| Pino        | 5.4m+            | 12.1k        |
| Winston     | 12.2m+           | 21.1k        |
| Log4js-node | 3.6m+            | 5.7k         |
| Bunyan      | 1.4m+            | 7.1k         |
| Roarr       | 2m+              | 963          |
| Signale     | 1.2m+            | 8.8k         |
| Tracer      | 48k+             | 1.1k         |
| Morgan      | 4.1m+            | 7.6k         |


[summary]

Watch how Live Tail helps you search, filter, and analyze logs in real-time:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="Better Stack Live Tail - Search and analyze logs in real-time" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
[/summary]



## 1. Pino

![pino.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/254c5ecf-7867-4f54-0d8c-7be3442e3900/orig
=1200x600)

[Pino](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/) is a
structured logging framework for Node.js that produces JSON output by default,
allowing for easy searching, monitoring and visualization of log data in
[log management tools](https://betterstack.com/logs).

Getting started with Pino is really straightforward as you can observe below:

```command
npm install pino
```

```javascript
const logger = require('pino')();

logger.info('Hello from Pino logger');
```

```json
[output]
{"level":30,"time":1687675301170,"pid":2376870,"hostname":"fedora","msg":"Hello from Pino logger"}
```

It's designed to be lightweight, fast, and memory efficient so that your
application remains responsive even when it generates a substantial volume of
logs.
[According to the benchmark results on their GitHub repo](https://github.com/pinojs/pino/blob/master/docs/benchmarks.md),
it is amongst the fastest options for Node.js logging. This exceptional speed is
one reason why it's integrated by default into the
[Fastify web framework](https://www.fastify.io/docs/latest/Reference/Logging/),
although it works seamlessly with Express and other frameworks as well.

```javascript
const fastify = require('fastify')({
  logger: true, // enables the built-in Pino logger
});

// You can subsequently write logs like this
fastify.log.info('an info message');

// or log within request handlers like this:
fastify.get('/', options, function (request, reply) {
  request.log.info('info about the current request');
  reply.send({ msg: 'hello world!' });
})
```

Pino supports many of the features expected in [a good logging
framework](https://betterstack.com/community/guides/logging/logging-framework/) such as contextual logging, multiple transport
options for sending logs to various destinations, automatic error stack traces,
and more. It also offers a useful log redaction feature that prevents sensitive
data from leaking into your logs.

```javascript
const pino = require('pino');

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
[highlight]
  redact: {
    paths: ['email'],
  },
[/highlight]
});

const user = {
  name: 'John doe',
  id: '283487',
  email: 'john@doe.com',
};

// the `email` field in the user object will be redacted
logger.info(user, 'user profile updated');
```

```json
[output]
{
  "level": 30,
  "time": "2023-09-26T11:52:16.060Z",
  "pid": 595644,
  "hostname": "fedora",
  "name": "John doe",
  "id": "283487",
[highlight]
  "email": "[Redacted]",
[/highlight]
  "msg": "user profile updated"
}
```

Notably, Pino supports
[asynchronous logging](https://getpino.io/#/docs/asynchronous), where log
messages are buffered and written in chunks to prevent blocking the event loop.
This feature minimizes logging overhead but increases the risk of losing some
log data if an unexpected system failure occurs.

```javascript
const pino = require('pino');
const logger = pino(
  pino.destination({
    sync: false, // Enable asynchronous logging
    minLength: 4096, // size of buffer before writing the logs
  })
);
```

You can find more information on how to use Pino effectively in [our
comprehensive Pino
guide](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/).

### Pino pros

- Excellent performance and low overhead.
- Good defaults, requires no configuration.
- Highly customizable.
- Defaults to structured logging in JSON.

### Pino cons

- Does not support including source file and line number.

## 2. Winston

![winston.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/40f90a51-a86c-4be7-4752-eede27dd0a00/lg2x
=1200x600)

At the time of writing,
[Winston](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/)
boasts over 12 million weekly downloads making it by far the most popular choice
for application logging in the Node.js ecosystem. Its popularity attests to its
prowess—a rich and adaptable API tailored to offer maximum flexibility in log
formatting and transportation.

Before you can start logging with Winston, you must create a logger and
configure a destination for the logs (such as the console). Winston defaults to
a structured JSON output, but it supports many other formats accessible via
`winston.format`.

```command
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

logger.info('Hello from Winston logger!')
```

```json
[output]
{"level":"info","message":"Hello from Winston logger!"}
```

Likewise, transportation options are also plentiful with several built-in and
third-party options available. The example below sends each log entry to the
console, a file, and [Better Stack](https://betterstack.com/logs).

```javascript
const winston = require('winston');
const { combine, timestamp, json } = winston.format;

const { Logtail } = require('@logtail/node');

const { LogtailTransport } = require('@logtail/winston');

const logtail = new Logtail('<your_source_token>');

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
[highlight]
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'app.log',
    }),
    new LogtailTransport(logtail),
  ],
[/highlight]
});
```

![Screenshot 2023-06-13 at 13-54-57 Live tail Better Stack.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bafdd17d-5981-4cdf-4cda-1c8fb8b86600/md1x
=2840x1696)

Winston also supports capturing stack traces when logging errors, automatically
logging uncaught exceptions and uncaught promise rejections, and it can even be
used for basic code profiling.

The main downside to Winston is that its defaults aren't well thought out. For
example, it doesn't log a timestamp by default unless you explicitly include the
`winston.format.timestamp()` format. It also fails to include a stack trace for
when logging errors without additional configuration.

```javascript
const winston = require('winston');
const { combine, timestamp, json, errors } = winston.format;

const logger = winston.createLogger({
  level: 'info',
[highlight]
  format: combine(errors({ stack: true }), timestamp(), json()),
[/highlight]
  transports: [new winston.transports.Console()],
});

logger.info('Hello from Winston logger!');
logger.error(new Error('An error'));
```

If you decide to go with Winston, you must set it up correctly to ensure that
you're getting the best out of it. See [our complete guide to
Winston](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/)
for more details.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/He7Dc6DuxdI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Winston pros

- Highly customizable.
- Offers multiple transport and formatting options.
- It can automatically track and log uncaught exceptions.

### Winston cons

- Poor defaults which necessitates configuration effort.

## 3. Log4js-node

![log4js-node.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/95238386-de1d-4b07-9846-7fc6135c3a00/orig
=1200x600)

[Log4js-node](https://github.com/log4js-node/log4js-node) is a port of the
[Log4js](https://github.com/stritti/log4js) logging framework for browser-based
applications, which was itself inspired by the
[Log4j](https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4j/) logging framework from the Java
ecosystem. You can get started with Log4js-node with only the most minimal
configuration needed:

```command
npm install log4js
```

```javascript
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'info';
logger.info('Hello from Log4js-node', { name: 'John', age: 21 });
```

```text
[output]
[2023-09-27T06:56:02.101] [INFO] default - Hello from Log4js-node { name: 'John', age: 21 }
```

The library uses a [semi-structured layout](https://betterstack.com/community/guides/logging/log-formatting/) by default when
printing logs to the standard output. This layout outputs the timestamp, level,
and category, followed by the formatted log event data. While other built-in
layouts are provided, there's notably missing support for JSON or other
structured formats in the library.

To ensure your logs are fully structured, you can either create a custom layout
([see an example](https://github.com/log4js-node/log4js-node/blob/master/examples/custom-layout.js))
or use a separate package such as
[log4js-json-layout](https://www.npmjs.com/package/log4js-json-layout).

```command
npm install log4js-json-layout
```

```javascript
const log4js = require('log4js');
[highlight]
const jsonLayout = require('log4js-json-layout');

log4js.addLayout('json', jsonLayout);
log4js.configure({
  appenders: { out: { type: 'stdout', layout: { type: 'json' } } },
  categories: { default: { appenders: ['out'], level: 'info' } },
});
[/highlight]

const logger = log4js.getLogger();
logger.level = 'info';
logger.info('Hello from Log4js-node', { name: 'John', age: 21 });
```

```json
[output]
{"startTime":"2023-09-27T04:59:15.967Z","categoryName":"default","level":"INFO","data":"Hello from Log4js-node","name":"John","age":21}
```

Appenders in Log4js-node allow you to filter your logs and configure their
destination. The notable ones bundled with the core library are as follows:

- `file`: Writes log events to a file asynchronously.
- `fileSync`: Same as `file`, but performs synchronous writes.
- `multiFile`: Allows writing to multiple files.
- `tcp`: Writes logs to a TCP server.
- `logLevelFilter`: Allows the restriction of log events based on their log
  level.

Appenders for Slack, Redis, RabbitMQ, Logstash, SMTP, Graylog, etc are also
officially supported but the corresponding packages have to be installed
separately.

Log4js-node also allows the categorization of logs such that events with the
same category are sent to the same appenders. When a category isn't specified,
the `default` category is used.

```javascript
const log4js = require('log4js');
const jsonLayout = require('log4js-json-layout');

log4js.addLayout('json', jsonLayout);
log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: 'app.log', layout: { type: 'json' } },
  },
  categories: {
    default: { appenders: ['out'], level: 'info' },
    app: { appenders: ['app'], level: 'debug' },
  },
});

const defaultLogger = log4js.getLogger();
defaultLogger.info('Hello from Log4js-node', { name: 'John', age: 21 });

const appLogger = log4js.getLogger('app');
appLogger.info('Hello from Log4js-node', { name: 'John', age: 21 });
```

The `defaultLogger` uses the `default` category which is configured to log to
the standard output, while `appLogger` is configured to log in JSON format to an
`app.log` file in the current working directory.

![Screenshot from 2023-09-27 07-11-31.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a30b3301-e4ca-4068-e86d-526343d25a00/orig
=2684x764)

For a more comprehensive information about Log4js-node,
[consult its official documentation](https://log4js-node.github.io/log4js-node/index.html).

### Log4js-node pros

- Flexible configuration through appenders and categories.
- Supports [dynamically changing log level](https://betterstack.com/community/guides/logging/change-log-levels-dynamically/) at
  runtime.
- Supports a wide array of integrations.

### Log4js-node cons

- Does not support structured JSON logging by default.

## 4. Bunyan

![node-bunyan.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f2ac676c-b97b-4b2f-9496-ad4e0ba2c800/lg1x
=1200x600)

[Bunyan](https://github.com/trentm/node-bunyan) is a specialized library
designed for JSON logging in Node.js. Much like other logging libraries, it
starts with creating a Logger instance and then using the appropriate level
methods:

```command
npm install bunyan
```

```javascript
const bunyan = require('bunyan');
const logger = bunyan.createLogger({ name: 'myapp' });
logger.info('Hello from Bunyan logger');
```

This results in well-structured JSON logs:

```json
[output]
{"name":"myapp","hostname":"fedora","pid":2394009,"level":30,"msg":"Hello from Bunyan logger","time":"2023-06-25T06:58:59.196Z","v":0}
```

Bunyan excels in several areas:

- **Contextual Logging**: It readily supports contextual logging through an
  optional context parameter.

- **Child Loggers**: You can create child loggers with additional bound fields,
  making it easy to add a set of fields to all logs within a specific scope.

- **Error Handling**: Bunyan automatically handles logged errors, including
  outputting an `err` field with exception details, including its stack trace.

```javascript
logger.info(
  { width: 300, height: 400, file: 'needsmore.jpg' },
  'image uploaded successfully'
);
logger.error(new Error('request failed to complete'));
```

```json
[output]
{"name":"myapp","hostname":"fedora","pid":2454325,"level":30,"width":300,"height":400,"file":"needsmore.jpg","msg":"image uploaded successfully","time":"2023-06-25T08:04:12.110Z","v":0}
{"name":"myapp","hostname":"fedora","pid":2433470,"level":50,"err":{"message":"request failed to complete","name":"Error","stack":"Error: request failed to complete\n    at Object.<anonymous> (/home/ayo/dev/betterstack/demo/nodejs-logging/index.js:7:14)\n    at Module._compile (node:internal/modules/cjs/loader:1254:14)\n    at Module._extensions..js (node:internal/modules/cjs/loader:1308:10)\n    at Module.load (node:internal/modules/cjs/loader:1117:32)\n    at Module._load (node:internal/modules/cjs/loader:958:12)\n    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)\n    at node:internal/main/run_main_module:23:47"},"msg":"request failed to complete","time":"2023-06-25T07:30:16.369Z","v":0}
```

Bunyan also offers a helpful built-in CLI for development purposes. You can
easily pretty-print logs and apply filters to view specific log records:

```command
node index.js | npx bunyan
```

![Screenshot from 2023-06-25 09-33-36.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e504f661-0430-4ff2-437f-cae63f960700/md2x
=2382x1074)

You can also use it to filter log content so that only records matching a
specified criteria are shown. For example, you can display only logs with
`ERROR` or greater severity like this:

```command
node index.js | npx bunyan -l error
```

### Bunyan pros

- Dedicated to structured logging in JSON.
- Provides a useful CLI tool for pretty-printing and filtering logs in
  development.
- Can output logs to multiple destinations.

### Bunyan cons

- Doesn't appear to be actively maintained at the time of writing.

[summary]
## Centralize your Node.js logs with Better Stack

Save hours of sifting through Node.js logs. [Better Stack](https://betterstack.com/log-management) works with all major Node.js logging libraries—Pino, Winston, and more. Get live tailing, SQL queries, and automated alerts in minutes. Forward logs using native transports, Vector, or OpenTelemetry.

**See it in action:** Explore our [live Node.js dashboard](https://telemetry.betterstack.com/dashboards/xnwf6j) showing real application metrics and logs.

<iframe src="https://telemetry.betterstack.com/dashboards/xnwf6j" width="100%" height="400"></iframe>

**Predictable pricing starting at $0.25/GB.** Start free in minutes.
[/summary]

## 5. Roarr

![roarr.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6197e7cd-56d7-4a3a-f10e-3fbc9c719900/lg2x
=1200x600)

[Roarr](https://github.com/gajus/roarr) stands out as a versatile logging
framework suitable for both Node.js and browser environments. It differentiates
itself from other loggers by aiming to be compatible with both application and
library code, allowing for correlation between the two. One unique feature is
that you don't need explicit initialization to start logging:

```command
npm install roarr
```

```javascript
const logger = require('roarr').Roarr;

logger.trace('Processing request...');
logger.debug({ data: { foo: 'bar' } }, 'Received data');
logger.info('Request processed successfully.');
logger.warn('Invalid input detected.');
logger.error('Database connection failed.');
logger.fatal('Critical error occurred. Shutting down.');
```

However, logs are not written unless the `ROARR_LOG` environmental variable is
set to `true`.

```command
ROARR_LOG=true node index.js
```

```json
[output]
{"context":{"logLevel":30},"message":"Hello from Roarr logger","sequence":"0","time":1687682375862,"version":"2.0.0"}
```

Similar to Bunyan, Roarr also comes with a
[CLI](https://www.npmjs.com/package/@roarr/cli) that can be used to pretty-print
or filter logs:

```command
ROARR_LOG=true node index.js | npx roarr pretty-print
```

![Screenshot from 2023-06-27 15-08-54.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ff8850e8-0c6d-4a2b-6d6a-5ecd7db01800/orig
=1800x1172)

Roarr excels in structured logging, offering support for logging contextual data
through various methods, such as including it directly at the log point, using
the `child()` method, or utilizing `adopt()` to propagate contextual properties
through asynchronous callbacks and promise chains:

```javascript
const Roarr = require('roarr').Roarr;

const logger = Roarr.child({
  name: 'my-service', // this will be included in all logs
});

logger.info({ userId: 1234 }, 'User login');

logger.debug(
  {
    query: 'SELECT * FROM users',
  },
  'Executing database query'
);

logger.info({ amount: 100 }, 'Processing payment');
```

The contextual data appears under the `context` property:

```json
[output]
{"context":{"logLevel":30,"name":"my-service","userId":1234},"message":"User login","sequence":"0","time":1687813925555,"version":"2.0.0"}
{"context":{"logLevel":20,"name":"my-service","query":"SELECT * FROM users"},"message":"Executing database query","sequence":"1","time":1687813925556,"version":"2.0.0"}
{"context":{"amount":100,"logLevel":30,"name":"my-service"},"message":"Processing payment","sequence":"2","time":1687813925556,"version":"2.0.0"}
```

One thing to note about Roarr is that it doesn't support in-process transports
due to the limitations of the single threaded nature of Node.js processes.
Instead, it encourages the use of [log shippers](https://betterstack.com/community/guides/logging/log-shippers-explained/) such as
[Fluentd](https://betterstack.com/community/guides/logging/fluentd-explained/), Logstash, or [Vector](https://betterstack.com/community/guides/logging/vector-explained/) for
transforming, filtering, and shipping logs to their final destination.

### Roarr pros

- Supports Node.js and the browser.
- Can be used for debug logging in libraries.
- Has a companion CLI program.
- Does not require initialization.
- Produces structured output.

### Roarr cons

- Relies on external log shippers alone.
- Offers limited customization possibilities.

## 6. Signale

![signale.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/45046b45-0421-4cb1-2c6f-4505ee501600/md1x
=1200x600)

[Signale](https://github.com/klaudiosinani/signale) is a robust logging utility
library that enhances the logging experience in Node.js Command-Line Interfaces
(CLIs) by providing a sleek and adaptable way to log messages. It offers a wide
array of features and options to cater to various logging needs. Here are some
notable aspects of Signale:

- **Colorized and prettified output**: Signale generates colorized and
  aesthetically pleasing log output by default, improving the readability of
  logs.

- **Interactive mode**: It supports an interactive mode where subsequent logged
  messages can override earlier ones. This can be particularly useful for
  dynamic CLI programs.

![Screenshot from 2023-06-27 15-10-51.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b6190848-d91b-4cb8-fc46-00b663c95400/lg1x
=2192x1172)

- **Customizable output streams**: While Signale prints to standard output by
  default, it offers extensive customization options. You can specify one or
  more writable streams to route log messages to specific destinations,
  tailoring the logging behavior to your needs.

- **Timed logging**: Signale provides time measurement capabilities through its
  `time()` and `timeEnd()` methods. You can define a timer by giving it a unique
  name and later conclude the timing using `timeEnd()`. This feature is handy
  for measuring the duration of specific operations in interactive CLI programs.

### Signale pros

- Highly customizable.
- Chiefly aimed at interactive CLI programs.
- Offers redaction and filtering of program secrets.

### Signale cons

- Not a general-purpose logging framework.
- Does not support structured logging.

## 7. Tracer

![tracer.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/52d9b242-4702-4987-a730-7b4838feeb00/md2x
=1200x600)

[Tracer](https://github.com/baryon/tracer) is a logging and debugging utility
for Node.js that offers a much better alternative to the Console API with
support for log levels, colourized output, logging to files, and the ability to
log to multiple destinations simultaneously.

```javascript
const logger = require('tracer').colorConsole({});

logger.log('hello');
logger.trace('hello', 'world');
logger.debug('hello %s', 'world', 123);
logger.info('hello %s %d', 'world', 123, { foo: 'bar' });
logger.warn('hello %s %d %j', 'world', 123, { foo: 'bar' });
logger.error(
  'hello %s %d %j',
  'world',
  123,
  { foo: 'bar' },
  [1, 2, 3, 4],
  Object
);
```

![Screenshot from 2023-09-27 09-15-58.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/10d89c78-211f-4184-c0d8-b19753fc6e00/public
=2854x1446)

In terms of log formatting options, Tracer relies on
[formatting tags](https://github.com/baryon/tracer#customize-output-format) to
customize the log output format, and you can have a different format for both
regular logs and errors:

```javascript
const logger = require('tracer').colorConsole({
  format: [
    '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})', //default format
    {
      error:
        '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}' // error format
    }
  ],
  dateformat: 'HH:MM:ss.L',
})
```

Regarding log destinations, Tracer supports logging to the console, a file, any
writable stream, MongoDB, and more. Do
[check out its documentation](https://github.com/baryon/tracer) and
[example folder](https://github.com/baryon/tracer/tree/master/example) for more
details.

### Tracer pros

- Supports colorized output.
- Supports logging to multiple destinations.
- Allows user-defined log levels.

### Tracer cons

- Limited support for structured and contextual logging.

## 8. Morgan

![morgan.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d82a091b-1148-4313-43a3-d539170e2d00/md2x
=1200x600)

[Morgan](https://www.npmjs.com/package/morgan) is a logging middleware that
provides support for HTTP request logging in Node.js. It can automatically
record details of incoming requests to a server including its method, IP
address, user agent, response time, response size, and more. The main advantage
of using Morgan is that it saves you the effort of creating your own logging
middleware.

Morgan provides a variety of formats for logging HTTP requests. These formats
are simply an arrangement of a predefined set of tokens, most notably the
`combined` and `common` formats that follow [standard Apache Web Server
conventions](https://betterstack.com/community/guides/logging/how-to-view-and-configure-apache-access-and-error-logs/). It also
offers the ability to create custom tokens and formats as you please so that you
can ensure that the logging output contains the desired details.

### Morgan pros

- Lightweight.
- Integrates directly with Express.
- Does not offer structured logging by default.

### Morgan cons

- Does not appear to be actively maintained.

## Final thoughts


Throughout this article, we have explored eight of the best Node.js logging libraries available. Each library offers unique features, customization options, and integrations that cater to diverse logging requirements. Whether you prioritize performance, structured logging, extensibility, or you simply want something to enhance the Console API, there should be a library for you amongst these options.

Once you've chosen your logging library and instrumented your application, **the next step is centralizing your logs for easier monitoring and analysis**. [Better Stack](https://betterstack.com/log-management) works seamlessly with most of the libraries covered in this article. Forward logs using built-in transports (like Winston's LogtailTransport), or use log shippers like Vector, Fluentd, or OpenTelemetry to send structured logs to Better Stack for live tailing, SQL queries, and automated alerting.

If you'd like to learn more about logging in Node.js, check out our [best practices article](https://betterstack.com/community/guides/logging/nodejs-logging-best-practices/). Thanks for reading, and happy logging!