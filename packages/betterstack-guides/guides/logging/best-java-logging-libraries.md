# Logging in Java: A Comparison of the Top 5 Libraries

The Java ecosystem boasts a plethora of logging libraries, ranging from default
options to third-party alternatives. However, this abundance of choices can lead
to a degree of confusion, leaving you pondering the most suitable logging
framework for your project.

This article aims to streamline the selection process by comparing these
options, assisting you in choosing the optimal logging framework for your
project.

[ad-logs]

## 1. Log4j 2

![Screenshot of Log4j 2 github page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d58c7b9e-3545-4e8c-248a-37777dc6ca00/md2x
=1200x600)

Log4j is one of the oldest and most widely adopted logging frameworks in the
Java ecosystem. Log4j 2 is a complete overhaul of the original Log4j project,
introducing numerous enhancements such as improved performance, versatile
configuration options (JSON, XML, YAML, and properties), expandability via
third-party plugins, and advanced asynchronous logging capabilities.

Log4j 2 introduces six [severity levels](https://betterstack.com/community/guides/logging/log-levels-explained/) for logging
methods: `trace()` `debug()`, `info()`, `warn()`, `error()`, and `fatal()` but
it also supports custom level creation.

Getting started with Log4j 2 is straightforward. Consider the following example:

```java
package com.yourcompany.app;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class App {
    protected static final Logger logger = LogManager.getLogger();

    public static void main(String[] args) {
        logger.info("Hello from Log4j 2");
        logger.error("Error from Log4j 2");
    }
}
```

This example demonstrates the use of `info()` and `error()` methods for logging
and the output is formatted as follows:

```text
[output]
13:55:55.710 [main] ERROR com.yourcompany.app.App - Error from Log4j 2
```

Log4j defaults to the `ERROR` severity level which means messages logged below
this level are suppressed. However, this behavior can be customized using a
`log4j2.xml` file under the `src/main/resources` directory. Below is an example
configuration:

```xml
[label src/main/resources/log4j2.xml]
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="INFO">
    <Appenders>
        <Console name="console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />
        </Console>
    </Appenders>

    <Loggers>
        <Root level="trace">
            <AppenderRef ref="console" />
        </Root>
    </Loggers>
</Configuration>
```

Key components of Log4j 2's configuration include:

- **Appenders**: Direct log messages to various destinations.
- **Layouts**: Format log messages in JSON, CSV, or Syslog.
- **Filters**: Utilize regular expressions or scripts for selective logging.

The code snippet sets the log severity level to `TRACE` and formats the log
messages accordingly. With these settings, running the program again yields the
following output:

```text
[output]
2023-11-27 14:00:57.208 [main] INFO  com.yourcompany.app.App - Hello from log4j
2023-11-27 14:00:57.209 [main] ERROR com.yourcompany.app.App - Error from log4j
```

Furthermore, Log4j 2 allows embedding contextual data in logs for detailed
analysis. For example:

```java
package com.yourcompany.app;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.ThreadContext;

public class App {

    protected static final Logger logger = LogManager.getLogger();

    public static void main(String[] args) {
        ThreadContext.put("orderNumber", "987654321");
        ThreadContext.put("buyerName", "Alice");
        ThreadContext.put("destination", "xxxxxxxx");

        logger.info("Order shipped successfully.");

        ThreadContext.clearAll();
    }
}
```

To include these contextual details in logs, the `log4j2.xml` file must be
updated:

```xml
[label src/main/resources/log4j2.xml]
...
    <Appenders>
		<Console name="console" target="SYSTEM_OUT">
[highlight]
			<PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg %X{orderNumber} %X{buyerName} %X{destination}%n" />
[/highlight]
		</Console>
	</Appenders>
...
```

The output would then include the contextual data:

```text
[output]
2023-11-28 11:19:45.326 [main] INFO  com.yourcompany.app.App - Order shipped successfully. 987654321 Alice xxxxxxxx
```

### Log4j2 pros

- Boasts a vast ecosystem of plugins, enhancing its extensibility.
- It can be used in other languages like Python, Ruby, C#, or C++.
- It has a fast performance.
- No vendor lock-in.

### Log4j2 cons

- can be complex to configure.
- has a steep learning curve.

**Learn more**: [How to Get Started with Log4j for Logging in Java
](https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4j/)

## 2. Logback

![Screenshot of Logback Github page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/dcc1e913-a40a-4220-ceae-08e7ee1e7b00/lg2x
=1200x600)

[Logback](https://logback.qos.ch/) was conceived to succeed the Log4j project
and features an API similar to it. Over the past few years, Logback has gained
substantial traction, currently amassing over 2.8K stars on
[GitHub](https://github.com/qos-ch/logback). The following code demonstrates a
primary usage of Logback for logging in a Java application:

```java
package com.yourcompany.app;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

public class App {
    private static final Logger logger = LoggerFactory.getLogger(App.class);

    public static void main(String[] args) {
        logger.info("This is an info message.");
    }
}
```

After running the code, the log message will appear in the following format:

```text
[output]
19:09:20.802 [main] INFO com.yourcompany.app.App -- This is an info message.
```

The resulting log message incorporates a timestamp, log level (INFO), class name
(`com.yourcompany.app.App`), and the specific log message.

Logback is a highly configurable logging framework that consists of the
following components:

- **Logger**: Captures log data and manages logging functionality.

- **Appender**: Directs log entries to various destinations, such as the
  console, email, file, or database.

- **Level**: Categorizes log statements according to severity levels, including
  `TRACE`, `DEBUG`, `INFO`, `WARN`, and `ERROR`.

- **Layout**: Formats log messages before they are sent to the configured
  appenders.

To configure Logback, you use the `logback.xml` file commonly placed under the
`src/main/resources` directory. In this file, you can specify log levels,
appenders, and layout formats:

```xml
[label src/main/resources/logback.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>
<configuration>
	<import class="ch.qos.logback.classic.encoder.PatternLayoutEncoder" />
	<import class="ch.qos.logback.core.ConsoleAppender" />
	<appender name="jsonEncoder" class="ch.qos.logback.core.ConsoleAppender">
		<encoder class="ch.qos.logback.classic.encoder.JsonEncoder" />
	</appender>
	<root level="debug">
		<appender-ref ref="jsonEncoder" />
	</root>
</configuration>
```

The `ConsoleAppender` is set up with a `JsonEncoder` to format log entries in
JSON and display them in the console. In the `<root>` section, the minimum log
level is configured as `debug`, signifying that only log messages with a
severity level of DEBUG or higher will be shown.

When the application is executed, the log message will be formatted in the JSON
format:

```json
[output]
{
  "sequenceNumber": 0,
  "timestamp": 1701028086525,
  "nanoseconds": 525605000,
  "level": "INFO",
  "threadName": "main",
  "loggerName": "com.yourcompany.app.App",
  "context": {
    "name": "default",
    "birthdate": 1701028086426,
    "properties": {}
  },
  "mdc": {},
  "message": "This is an info message.",
  "throwable": null
}
```

This JSON-formatted log message includes essential fields that offer
comprehensive context about the log entry.

Logback boasts additional features, including automatic configuration reloading
while the application runs, conditional processing, compression of archived
logs, and advanced filtering capabilities.

### Logback pros

- It is fast and efficient.
- Extensively tested to ensure its reliability and stability.
- Highly configurable and customizable.
- Great documentation and community support.

### Logback cons

- Resource consumption can increase under heavy logging workloads.
- Logback's comprehensive configurability can introduce some complexity,
  especially for less experienced developers.

**Learn more**: [A Guide to Java Logging with Logback ](https://betterstack.com/community/guides/logging/java/logback/)

## 3. SLF4J

![Screenshot of Slf4j logging library](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1d7b0759-901e-469e-2087-01d77b873f00/orig
=1200x600)

SLF4J, or Simple Logging Facade for Java, is an abstraction layer for various
logging libraries in Java, such as Logback or Log4j 2. Its primary function is
to provide a logging API, leaving the structuring and formatting of logs to the
chosen logging framework.

The key advantage of Slf4J is its flexibility. Using Slf4J, developers are not
bound to a specific logging framework and can dynamically switch between
frameworks without modifying their code.

You can get started with logging using Slf4J, as demonstrated in this example:

```java
package com.mycompany.app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class App {
    private static Logger LOGGER = LoggerFactory.getLogger(App.class);

    public static void main(String[] args) {
        LOGGER.info("Hello from Slf4j logger!");
    }
}
```

This example demonstrates how Slf4J's simple logger sends logs to the console,
producing an output like the following:

```text
[output]
[main] INFO com.mycompany.app.App - Hello from Slf4j logger!
```

You can also enrich your log information by providing additional context. This
can be achieved by including extra parameters when using methods like `info()`:

```java
package com.mycompany.app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class App {
    private static Logger LOGGER = LoggerFactory.getLogger(App.class);

    public static void main(String[] args) {
        String productName = "Smartphone";
        int quantity = 2;
        double totalPrice = 999.99;

        LOGGER.info("Placed an order for {} {}(s) online. Total cost: ${}", quantity, productName, totalPrice);
    }
}
```

In this example, the `quantity`, `productName`, and `totalPrice` variables are
included in the log message to provide more context about the log entry. The
information can aid in troubleshooting and understanding the flow of your
application.

```text
[output]
[main] INFO com.mycompany.app.App - Placed an order for 2 Smartphone(s) online. Total cost: $999.99
```

### Slf4J pros

- Its very fast.
- Allows seamless switching between logging frameworks without affecting
  existing code.
- Provides bindings to the available logging libraries in the Java ecosystem,
  ensuring compatibility with a wide range of logging solutions.
- Provides a migration tool

### SLF4J cons

- It does not provide a complete logging solution since it's only a facade.

## 4. Tinylog

![Screenshot of Tinylog Github page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bece8733-32d1-40d4-475b-69ca5953b800/md1x
=318x159)

Tinylog is an open-source logging framework for Java, introduced in 2012 to
simplify logging with an easy-to-understand and configure API. Unlike other
logging libraries, it is lightweight and small, with a combined JAR size of only
187 KB. Additionally, Tinylog supports multithreaded applications, provides
bindings for various logging libraries, supports lambdas, and enables lazy
logging. Furthermore, the logging framework can be used with JVM, GraalVM, or
Android.

Getting started with Tinylog is straightforward as it comes preconfigured:

```java
package com.mycompany.app;

import org.tinylog.Logger;

public class App {

    public static void main(String[] args) {
        Logger.info("Hello from Tinylog!");
    }

}
```

When the program runs, it produces output like this:

```text
[output]
2023-11-28 12:01:43 [main] com.mycompany.app.App.main()
INFO: Hello from Tinylog!
```

You can easily pass context data to the log message by adding a second parameter
to the log method, as demonstrated in the following code:

```java
package com.mycompany.app;

import org.tinylog.Logger;

public class App {

    public static void main(String[] args) {

        String userName = "John Doe";

        // Log an error message with a specific error
        Logger.error("Failed to process user '{}'", userName);
    }
}
```

When run, this output will include context data:

```text
2023-11-28 12:12:17 [main] com.mycompany.app.App.main()
ERROR: Failed to process user 'John Doe'
```

You can configure Tinylog using the `tinylog.properties` file under the
`src/main/resources` directory:

```text
[label src/main/resources/tinylog.properties]
# logs to Console
writer               = json
writer.level         = debug
writer.file          = log.json
writer.format        = LDJSON
writer.field.level   = level
writer.field.source  = {class}.{method}()
writer.field.message = message
writer.charset       = UTF-8
writer.append        = true
writer.buffered      = true
```

This changes the log level, formats the logs in the JSON format, and forward
them to a `log.json` file:

```json
[label log.json]
{"level": "ERROR", "source": "com.mycompany.app.App.main()", "message": "Failed to process user 'John Doe'"}
```

### Tinylog pros

- Optimized for speed; you can see the
  [benchmarks here](https://tinylog.org/v2/benchmark/).
- Lightweight.
- Simple to configure.
- Relatively straightforward to learn and use.

### Tinylog cons

- Its configurations are limited compared to Logback or SLF4J.
- Limited community support in comparison to more established logging
  frameworks.

## 5. Java Logging Framework

![Screenshot of Java logging framework](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4ab87819-d757-4c53-b2f7-44d950b33a00/orig
=3024x1532)

Java ships with a default logging framework that can be used for logging. The
[java.util.logging (JUL)](https://docs.oracle.com/en/java/javase/14/docs/api/java.logging/java/util/logging/package-summary.html)
has been part of Java since the Java SE 4 (1.4) release in 2001. It includes
classes that implement core logging functionalities.

The logging framework contains the following components:

- Handler: forwards log messages to various destinations. Examples of handlers
  include
  [Stream Handler](https://docs.oracle.com/javase/8/docs/api/java/util/logging/StreamHandler.html),
  [File Handler](https://docs.oracle.com/javase/8/docs/api/java/util/logging/FileHandler.html)
  or
  [SocketHandler](https://docs.oracle.com/javase/8/docs/api/java/util/logging/SocketHandler.html)
- Filter: used to filter log messages.
- Formatter: formats log messages before they are sent to the output stream.

Starting with `java.util.logging` is as straightforward as this:

```java
package com.mycompany.app;

import java.util.logging.Level;
import java.util.logging.Logger;

public class App {

    private static Logger logger = Logger.getLogger(App.class.getName());

    public static void main(String[] args) {

        logger.info("Hello from java.util.logging");

        logger.log(Level.WARNING, "This is level warning logging");

    }
}
```

This produces a log message similar to the following:

```text
Nov 28, 2023 8:00:08 PM com.mycompany.app.App main
INFO: Hello from java.util.logging
Nov 28, 2023 8:00:08 PM com.mycompany.app.App main
WARNING: This is level warning logging
```

To configure the logging, Java provides a default `logging.properties` file as
the default configuration file. The defaults set the severity level to INFO and
forward logs to the console. You can create your own `logging.properties` to
configure the library depending on your project needs:

```text
[label logging.properties]

# Define handlers for file and console logging
handlers = java.util.logging.FileHandler, java.util.logging.ConsoleHandler

# Set global logging level to INFO
.level = INFO

# Log file output in a dedicated directory, e.g., /var/log/myapp/
java.util.logging.FileHandler.pattern = /var/log/myapp/java%u.log
java.util.logging.FileHandler.limit = 50000
java.util.logging.FileHandler.count = 1
java.util.logging.FileHandler.formatter = java.util.logging.SimpleFormatter

# Console logging settings
java.util.logging.ConsoleHandler.level = INFO
java.util.logging.ConsoleHandler.formatter = java.util.logging.SimpleFormatter

# Define a custom log format
java.util.logging.SimpleFormatter.format = [%1$td-%1$tm-%1$tY %1$tH:%1$tM:%1$tS] [%4$s] %5$s %n

# Set log level for a specific package, e.g., com.myapp
com.myapp.level = WARNING
```

### Java Logging Framework cons

- Has no dependencies since it ships with Java.
- Lightweight.
- Well-documented and supported.
- Easier to learn.

### Java Logging Framework cons

- Lacks advanced features found in other logging libraries, like asynchronous
  logging or advanced filters.
- Not highly performant.

## Final thoughts

While Java includes the `java.util.logging` package, it is not considered the
most optimal choice among logging libraries due to its lack of advanced
features, suboptimal performance, and infrequent updates. You can explore the
details in [this post](https://betterstack.com/community/questions/why-you-should-not-use-java-util-logging/). Alternatives
like Logback, Log4j2, or Tinylog provide more robust features and improved
performance.

For basic logging needs, Tinylog is a suitable choice. However, for more
intricate requirements, consider opting for Logback or Log4J2. Regardless of the
selected framework, using Slf4J is recommended, as it facilitates seamless
switching between logging libraries if necessary.

To learn about effective logging practices, consider checking out [our
guide](https://betterstack.com/community/guides/logging/how-to-start-logging-with-java/), which covers Java logging best
practices.

Thanks for reading, and happy logging!