# 8 Factors for Choosing a Logging Framework

Logging frameworks play a crucial role in standardizing the logging process in
an application. While some programming languages offer built-in logging
solutions, they often fall short in handling the complexities of
production-level logging.

A good logging solution must support structured logging and be customizable
enough to adapt to diverse needs while only having a minimal impact on
application performance.

Taking these factors into account, opting for third-party logging solutions is
often the best approach. Therefore, this article will guide you through key
considerations to assist you in selecting the most suitable logging framework
for your needs.

[ad-logs-small]

## 1. Support for leveled logging

Any competent logging framework will categorize events by severity levels,
although the specific range and names of these levels can differ. It's important
to select a framework whose severity levels match your requirements, or ideally,
one that allows customization of these levels for greater flexibility.

Take
[Winston](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/)
for Node.js as an example. It uses the following levels by default:

```json
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

But you can easily change it to something more typical like this:

```javascript
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
});
```

**Learn more**: [Log Levels Explained and How to Use Them](https://betterstack.com/community/guides/logging/log-levels-explained/)

## 2. Support for structured logging formats

Applications historically produced unstructured or semi-structured logs which
are easily readable by humans but present challenges for automated processing.

```text
DEBUG [2023-06-18 10:23:45] [app.js:123] - User authentication successful for user 'john.doe'.
```

Structured logging formats like JSON address this by capturing events as objects
with distinct properties. This approach enables easier data extraction,
analysis, and monitoring with automated processing tools.

```json
{
  "timestamp": "2023-06-18 10:23:45",
  "file": "app.js",
  "line": 123,
  "level": "DEBUG",
  "message": "User authentication successful for user 'john.doe'"
}
```

The challenge with structured logs is that they sacrifice human readability in
their raw state, which can be less ideal for development contexts.

To counter this, many frameworks offer pretty-printing options to enhance
readability during development while seamlessly reverting to the more efficient,
structured format in production.

![Screenshot from 2023-07-23 15-48-51.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cb795c37-5b36-4e1f-55e5-dad292972700/public
=2702x1758)

**Learn more**: [Log Formatting Best Practices](https://betterstack.com/community/guides/logging/log-formatting/)

## 3. Support for logging contextual data

A good logging framework should support the addition of contextual fields in log
records. Such fields enhances log insights by revealing the specific
circumstances of each event. Flexibility in adding this context—whether at
individual log points, for a group of logs in a transaction, or universally—is
crucial.

For example, using
[Pino](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/), a Node.js
logger, you can:

- Add specific details to individual log entries:

  ```javascript
  logger.error(
    { transaction_id: '12343_ff', user_id: 'johndoe' },
    'Transaction failed'
  );
  ```

- Group related logs with shared context using child loggers:

```javascript
function getEntity(entityID) {
  const childLogger = logger.child({ entity_id: entityID });
  childLogger.trace('getEntity invoked');
  childLogger.trace('getEntity completed');
}

getEntity('123');
```

- Include certain data in all logs by setting it globally during logger
  initialization:

```javascript
const pino = require('pino');

const logger = pino({
  formatters: {
    [highlight]
    bindings: (bindings) => {
      return { pid: bindings.pid, host: bindings.hostname, node_version: process.version };
    },
    [/highlight]
  },
});
```

Aiming for this minimum standard is essential to simplify the addition of
adequate context to logged events.

## 4. Error logging behavior

A good logging framework should not only capture errors but also provide
detailed context, including full stack traces, to enhance the understanding of
each error's occurrence.

```json
{
  "level": "error",
  "time": 1643706943924,
  "pid": 13185,
  "hostname": "Kreig",
  "err": {
    "type": "Error",
    "message": "ValidationError: email address in invalid",
    "stack": "Error: ValidationError: email address in invalid\n    at Object.<anonymous> (/home/ayo/dev/betterstack/demo/snippets/main.js:3:14)\n    at Module._compile (node:internal/modules/cjs/loader:1097:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1149:10)\n    at Module.load (node:internal/modules/cjs/loader:975:32)\n    at Function.Module._load (node:internal/modules/cjs/loader:822:12)\n    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)\n    at node:internal/main/run_main_module:17:47"
  },
  "msg": "ValidationError: email address in invalid"
}
```

A relatively uncommon feature is the ability to structure the exception object
as well, making it much easier to parse and automate error tracking as well.

Here's an error log produced by Python's [Structlog](https://betterstack.com/community/guides/logging/structlog/) framework
showing what serialized exceptions look like:

```json
{"event": "Cannot divide one by zero!", "level": "error", "timestamp": "2023-07-31T07:00:31.526266Z", "exception": [{"exc_type": "ZeroDivisionError", "exc_value": "division by zero", "syntax_error": null, "is_cause": false, "frames": [{"filename": "/home/stanley/structlog_demo/app.py", "lineno": 16, "name": "<module>", "line": "", "locals": {"__name__": "__main__", "__doc__": "None", "__package__": "None", "__loader__": "<_frozen_importlib_external.SourceFileLoader object at 0xffffaa2f3410>", "__spec__": "None", "__annotations__": "{}", "__builtins__": "<module 'builtins' (built-in)>", "__file__": "/home/stanley/structlog_demo/app.py", "__cached__": "None", "structlog": "\"<module 'structlog' from '/home/stanley/structlog_demo/venv/lib/python3.11/site-\"+32", "logger": "'<BoundLoggerLazyProxy(logger=None, wrapper_class=None, processors=None, context_'+55"}}]}]}
```

[ad-logs]

## 5. Impact on application performance

Performance is an important consideration when selecting a logging framework.
Ideally, application logging should impose only a minimal performance overhead,
even under heavy load. This means selecting a library that prioritizes
performance and low memory usage, especially in environments with high log
volumes.

![Benchmarking Go Logging Frameworks.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/68f0f729-edbe-454b-1290-83df31b86d00/public
=2200x1190)

It may be necessary to run benchmarks comparing the performance of the libraries
under consideration to find out the relative performance trade-offs that should
be accounted for.

## 6. Support for log sampling

Log sampling involves keeping only a representative sample of logs, usually
through random or systematic selection. The sampling rate dictates the
proportion of logs stored. For instance, a 10% rate means retaining just 10% of
the total logs generated.

In large scale environments, implementing log sampling is a highly effective
strategy for reducing the costs associated with storing and transporting log
data.

By choosing a framework that supports sampling, you'll be able to sample your
logs efficiently at the application level before they get into your logging
pipeline.

However, lack of support for sampling is not necessarily a deal-breaker as you
can always sample using a log collector such as [Vector](https://betterstack.com/community/guides/logging/vector-explained/).

## 7. Impact on application behavior and testing

A crucial aspect of logging frameworks is their non-intrusive nature; log
statements must not alter the application's behavior or execution flow.

Equally important is the ability to control or turn off logging during testing
phases to prevent influencing test outcomes, helping to avoid inconsistent test
results (flaky tests).

## 8. Reputation and community support

Another important consideration when choosing a logging framework is its
reputation in the development community. Established logging frameworks that
have been used for several years often have a wealth of user experiences and
reports available. These experiences can serve as valuable insights and help in
your decision-making process when choosing between multiple good options.

You should also consider the size and activity level of the framework's
community. An active community indicates ongoing development, bug fixes, and
support from fellow developers. Check the project's documentation quality and
availability of tutorials and community forums or chat channels for assistance
with issues.

## Some logging framework recommendations

To help you choose the right logging framework, I've curated a list of
well-regarded libraries across some of the most popular programming languages
and runtimes.

These recommendations are based on a combination of factors including feature
richness, ease of integration, performance efficiency, community support, and
widespread adoption in their respective language ecosystems.

### 1. Pino (Node.js)

[Pino](https://www.npmjs.com/package/pino) is the standout logging framework for
Node.js, known for its emphasis on high performance structured logging. It is
built into the [Fastify](https://fastify.dev/) web framework, but also
integrates seamlessly with other popular web frameworks like Express.

Compared to
[Winston](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/),
another popular logging option, Pino is lighter, easier to use, and comes with
saner defaults with better performance to boot.

**Learn more**: [A Complete Guide to Pino Logging in
Node.js](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/)

### 2. Zerolog, Zap, or Slog (Go)

In the Go ecosystem, [Zerolog](https://betterstack.com/community/guides/logging/zerolog/) is renowned for its high-speed logging
capabilities and low memory usage, as demonstrated in
[performance benchmarks](https://betterstack-community.github.io/go-logging-benchmarks/),
. It defaults to structured JSON logging but provides colorized console output
for easier readability in development environments.

For a more customizable alternative, consider [Uber's Zap package](https://betterstack.com/community/guides/logging/go/zap/). A
trailblazer in the zero-allocation logging approach, Zap offers a versatile API
that caters to a wide array of logging needs. Its flexibility makes it suitable
for applications requiring finely-tuned logging configurations.

In Go v1.21, a new [slog package](https://pkg.go.dev/log/slog) was introduced
into the standard library to provide structured levelled logging for Go
programs.

Slog distinguishes itself by offering both standalone logging capabilities and
the option to function solely as a logging frontend helping you decouple your
application's logging from being tied to a specific framework

**Learn more**: [Logging in Go with Slog: The Ultimate Guide](https://betterstack.com/community/guides/logging/logging-in-go/)

### 3. Monolog (PHP)

[Monolog](https://github.com/Seldaek/monolog/) is PHP's most popular logging
framework. It has gained significant traction and widespread adoption, being
integrated into major PHP application frameworks like Laravel and Symfony to
provide a robust logging solution.

It supports various logging formats including JSON, and several handlers for
transporting your logs to various destinations. It also adheres to the
[PSR-3 logger interface](https://www.php-fig.org/psr/psr-3/) (a common PHP
interface for logger objects) promotes interoperability and simplifies future
transitions to alternative compatible libraries if deemed necessary.

**Learn more**: [How to Get Started with Monolog Logging in
PHP](https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/)

### 4. SLF4J with Log4J2 or Logback (Java)

[Simple Logging Facade for Java (SLF4J)](https://slf4j.org/) acts as a versatile
logging facade, providing a uniform API to various Java logging frameworks. This
abstraction layer means you can easily switch between different logging
frameworks depending on your needs, without extensive code modifications. Among
the SLF4J implementations, both [Log4j2](https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4j/) and
[Logback](https://betterstack.com/community/guides/logging/java/logback/) are prominent. However, Log4j2 distinguishes itself with more
active maintenance and
[superior performance](https://logging.apache.org/log4j/2.3.x/performance.html).

**Learn more**: [10 Best Practices for Logging in
Java](https://betterstack.com/community/guides/logging/how-to-start-logging-with-java/)

### 5. Loguru or Structlog (Python)

While Python's built-in `logging` module is quite robust and widely used in the
community, its setup and configuration can sometimes be confusing even for
simple tasks. If you find the native logging API cumbersome, excellent
alternatives to explore are [Loguru](https://betterstack.com/community/guides/logging/loguru/) and [Structlog](https://betterstack.com/community/guides/logging/structlog/).

**Learn more**: [A Comprehensive Guide to Logging in Python
](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/)

### 6. Semantic Logger (Ruby)

[Semantic Logger](https://logger.rocketjob.io/index.html) brings structured and
context-aware logging capabilities to Ruby applications, going beyond the
standard `Logger` class. It can produce JSON-formatted structured logs and it
adheres to Ruby's standard logging interface, which simplifies migration from
the standard module.

**Learn more**: [Logging in Ruby: A Comparison of the Top 6
Libraries](https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/)

## Final thoughts

Selecting an appropriate logging framework is a crucial step in your development
process, directly affecting how you capture and analyze important events and
errors in your application.

I hope that the guidelines and recommendations provided here will help you
choose a library that aligns perfectly with your project's needs.

Remember, implementing a logging framework is only the first step.
[Aggregating and centralizing your logs](https://betterstack.com/community/guides/logging/log-aggregation/) for effective
monitoring and analysis is just as vital. Get more tips on [logging dos & don'ts](https://betterstack.com/community/guides/logging/logging-best-practices/), and log management practices [here](https://betterstack.com/community/guides/logging/log-management/).

[Better Stack](https://betterstack.com/logs) can be instrumental in this regard,
offering tools for log management, visualization, and alerting to enhance issue
tracking and resolution.

Thanks for reading, and happy logging!