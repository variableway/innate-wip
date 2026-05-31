# A Guide to Java Logging with Logback

[Logback](https://logback.qos.ch/) is a logging framework that provides a fast,
reliable, and highly configurable solution for generating logs in Java
applications. It was originally developed as a successor to the popular Log4j
framework and has quickly gained popularity due to its many features and ease of
use.

In this article, we will guide you through the process of getting started with
logging in Logback. We will cover everything from configuring Logback and
understanding [log levels](https://betterstack.com/community/guides/logging/log-levels-explained/) to advanced topics such as
forwarding log messages to different destinations and logging in a structured
format. Additionally, we will provide some best practice guidelines for logging
with Logback.

## Prerequisites

Before going through the rest of this article, you should have a basic
understanding of Java, and make sure to create a Java project with
[Maven](https://maven.apache.org) so that you can test the code snippets in this
guide.

[summary]
## Side note: Visualize your Logback logs

Once your Java application starts generating logs with Logback, [Better Stack](https://betterstack.com/logs) gives you powerful querying, real-time tail, and beautiful dashboards to understand what's happening in production.

<iframe width="560" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


[/summary]



## Getting started with Logback

To use Logback in your Java project, the first thing you must do is add the
dependencies to the `pom.xml` file:

```xml
[label pom.xml]
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>logback-demo</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>logback-demo</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
    [highlight]
    <dependency>
      <groupId>ch.qos.logback</groupId>
      <artifactId>logback-core</artifactId>
      <version>1.4.7</version>
    </dependency>
    <dependency>
      <groupId>ch.qos.logback</groupId>
      <artifactId>logback-classic</artifactId>
      <version>1.4.7</version>
    </dependency>
    [/highlight]
  </dependencies>

  . . .

</project>
```

The `logback-core` module contains the core components of the framework,
including the logging APIs and basic implementations of appenders, filters, and
layouts.

The `logback-classic` module works on top of `logback-core`, providing an
implementation of the SLF4J API, as well as advanced features such as MDC
(Mapped Diagnostic Context), automatic reloading of configuration files, and so
on.

Next, you need to install these dependencies using Maven:

```command
mvn package
```

```text
[output]
[INFO] Scanning for projects...
[INFO]
[INFO] ----------------------< com.example:logback-demo >----------------------
[INFO] Building logback-demo 1.0-SNAPSHOT
[INFO]   from pom.xml
. . .
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  1.252 s
[INFO] Finished at: 2023-05-01T15:14:25-04:00
[INFO] ------------------------------------------------------------------------
```

By default, these dependencies will be downloaded to the `.m2` folder under the
home directory and then added to the project's `classpath`. After that, you can
start logging with Logback like this:

```java
[label App.java]
package com.example;

[highlight]
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
[/highlight]

public class App {
    [highlight]
    private static final Logger logger = LoggerFactory.getLogger(App.class);
    [/highlight]

    public static void main(String[] args) {
        [highlight]
        logger.info("This is an info message.");
        [/highlight]
    }
}
```

Compile and execute your application, and you should get the following output in
the terminal:

```text
[output]
14:01:05.219 [main] INFO com.example.App -- This is an info message.
```

You can also customize Logback by creating a configuration file. Create a file
named `logback.xml` under `src/main/resources` directory.

```xml
[label logback.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>

<configuration>
    <import class="ch.qos.logback.classic.encoder.PatternLayoutEncoder" />
    <import class="ch.qos.logback.core.ConsoleAppender" />

    <appender name="STDOUT" class="ConsoleAppender">
        <encoder class="PatternLayoutEncoder">
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} -- %msg%n</pattern>
        </encoder>
    </appender>

    <root level="debug">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

When you compile the project, this file will be automatically added to the
`classpath`.

## Understanding log levels

The example configuration file contains much information we must discuss. Let us
start with log levels. Go back to the `App.java` file, and pay attention to how
the message is logged:

```java
logger.info("This is an info message.");
```

The `info()` method logs the message with the log level `INFO`. The log level is
a way of categorizing log messages based on their severity or importance. For
example, in Logback, there are 5 predefined log levels, and each level
corresponds to an integer value, as shown in the list below:

- `TRACE` (`5000`): The `TRACE` level is the lowest log level used to record
  detailed debugging information, particularly the application's execution flow.
  It is more fine-grained compared to `DEBUG`.
- `DEBUG` (`10000`): The `DEBUG` level is used for debugging messages that are
  less verbose than `TRACE` messages. These messages should provide insight into
  the application's behavior that may be useful for troubleshooting.
- `INFO` (`20000`): The `INFO` level indicates messages describing normal
  application behavior. These messages are usually not important enough to cause
  concern but may help monitor the application's performance.
- `WARN` (`30000`): The `WARN` level indicates messages describing potential
  issues or warnings. These messages indicate that something unexpected or
  potentially problematic has occurred, but the application can still function
  normally.
- `ERROR` (`40000`): The `ERROR` level indicates messages describing errors or
  exceptions. These messages indicate that something has gone wrong with the
  application and that corrective action may be necessary.

![log-levels.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/07125720-d829-4121-be61-9fbc70009500/md1x =1306x1280)

To log messages with these log levels, simply use the corresponding built-in
methods:

```java
[label App.java]
package com.example;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

public class App {
    private static final Logger logger = LoggerFactory.getLogger(App.class);

    public static void main(String[] args) {
        [highlight]
        logger.trace("Entering method foo()");
        logger.debug("Received request from 198.12.34.56");
        logger.info("User logged in: john");
        logger.warn("Connection to server lost. Retrying...");
        logger.error("Failed to write data to file: myFile.txt");
        [/highlight]
    }
}
```

```text
[output]
20:01:02.809 [main] DEBUG com.example.App -- Received request from 198.12.34.56
20:01:02.812 [main] INFO com.example.App -- User logged in: john
20:01:02.812 [main] WARN com.example.App -- Connection to server lost. Retrying...
20:01:02.812 [main] ERROR com.example.App -- Failed to write data to file: myFile.txt
```

Notice that the `TRACE` level message is excluded from the output. That is
because we set the minimum log level for the root logger to be `DEBUG`, which
means only messages with log levels higher than or equal to `DEBUG` will be
included in the output.

```xml
[label logback.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>

<configuration>
    <import class="ch.qos.logback.classic.encoder.PatternLayoutEncoder" />
    <import class="ch.qos.logback.core.ConsoleAppender" />

    <appender name="STDOUT" class="ConsoleAppender">
        <encoder class="PatternLayoutEncoder">
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} -- %msg%n</pattern>
        </encoder>
    </appender>

    [highlight]
    <root level="debug">
        <appender-ref ref="STDOUT" />
    </root>
    [/highlight]
</configuration>
```

We can adjust the setting to include `TRACE` messages as well.

```xml
[label logback.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>

<configuration>
    . . .
    [highlight]
    <root level="trace">
        <appender-ref ref="STDOUT" />
    </root>
    [/highlight]
</configuration>
```

Alternatively, you can configure the log levels programmatically by setting
environment variables. You can create a new environment variable using the
`System` class like this:

```java
System.setProperty("LOG_LEVEL", "info");
```

And then access this `LOG_LEVEL` variable in the configuration file
(`logback.xml`):

```xml
[label logback.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>

<configuration>
    . . .
    [highlight]
    <root level="${LOG_LEVEL}">
        <appender-ref ref="STDOUT" />
    </root>
    [/highlight]
</configuration>
```

Rerun your application, and the changes will be reflected in the output.

```text
[output]
20:07:49.957 [main] TRACE com.example.App -- Entering method foo()
20:07:49.958 [main] DEBUG com.example.App -- Received request from 198.12.34.56
20:07:49.959 [main] INFO  com.example.App -- User logged in: john
20:07:49.959 [main] WARN  com.example.App -- Connection to server lost. Retrying...
20:07:49.959 [main] ERROR com.example.App -- Failed to write data to file: myFile.txt
```

## Formatting log messages

Take a closer look at the logs, and you should notice that they all follow the
same format. This format is defined in the configuration file like this:

```xml
[label logback.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>

<configuration>
    <import class="ch.qos.logback.classic.encoder.PatternLayoutEncoder" />
    <import class="ch.qos.logback.core.ConsoleAppender" />

    <appender name="STDOUT" class="ConsoleAppender">
        [highlight]
        <encoder class="PatternLayoutEncoder">
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} -- %msg%n</pattern>
        </encoder>
        [/highlight]
    </appender>

    <root level="debug">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

The encoder is a component responsible for converting log events into a specific
format or representation suitable for output. It takes the log event data, such
as the log message, timestamp, log level, and any additional contextual
information and transforms it into a string or byte array that can be written to
the desired log destination.

The `pattern` parameter accepts an expression comprising one or more conversion
specifiers, dictating the desired format of the log message. Each conversion
specifier begins with a percent sign (`%`), followed by an optional format
modifier and a conversion character. The conversion character indicates the data
type, such as category, priority, date, and thread name. The format modifiers
allow for the adjustment of field width, padding, left or right justification,
and other formatting aspects.

In this example, the following conversion specifiers are defined:

- `%d{HH:mm:ss.SSS}`: Output the date and time of the logged event.
- `%thread`: The thread's name that processed the logged event.
- `%-5level`: `level` is the conversion character, outputting the log level.
  `-5` is the format modifier, ensuring left-justification and restricting the
  log level to five characters.
- `%logger{36}`: The name of the logger, followed by a precision specifier,
  controlling the length of the logger name.
- `%msg`: The actual log message.
- `%n`: A new line character.

Many other specifiers are available in Logback, and please refer to the
[official documentation](https://logback.qos.ch/manual/layouts.html) for
details.

You can use these specifiers to customize your logs. For example:

```xml
<pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} [%file:%line] - %msg%n</pattern>
```

This pattern will give you a more detailed timestamp and the file name and line
number where the log event occurred.

## Logging in a structured format

In the previous section, we mentioned that the encoders could be used to
reformat the log records into a desired layout pattern, but in fact, encoders
can do much more. For example, you can use them to output the log messages into
a structured format such as JSON, which makes it easier for the logs to be
processed by computer systems.

The default
[`JsonLayout`](https://javadoc.io/static/ch.qos.logback.contrib/logback-json-classic/0.1.5/ch/qos/logback/contrib/json/classic/JsonLayout.html)
hasn't been updated in years, so currently, the standard way is to use a
third-party package called `logstash-logback-encoder`. The package was
originally designed for integrating Logback with Logstash but has evolved into
the standard JSON format logging package for Logback.

```xml
[label pom.xml]
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>logback-demo</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>logback-demo</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <dependencies>
    . . .
    <!-- Json format logging -->
    [highlight]
    <dependency>
      <groupId>net.logstash.logback</groupId>
      <artifactId>logstash-logback-encoder</artifactId>
      <version>7.3</version>
    </dependency>
    [/highlight]
  </dependencies>

  . . .
</project>
```

Next, use the included `LoggingEventCompositeJsonEncoder` in your `logback.xml`.

```xml
[label logback.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>

<configuration>
    <import class="ch.qos.logback.core.ConsoleAppender" />

    <appender name="STDOUT" class="ConsoleAppender">
        [highlight]
        <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
            <providers>
                <timestamp />
                <loggerName />
                <logLevel />
                <message />
            </providers>
        </encoder>
        [/highlight]
    </appender>

    <root level="trace">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

Rerun your application, and you will have the output log records in JSON format.

```text
[output]
{"@timestamp":"2023-05-08T21:50:53.368416-04:00","logger_name":"com.example.App","level":"INFO","message":"Order shipped successfully."}
```

In this example, the
[providers](https://github.com/logfellow/logstash-logback-encoder#composite-encoderlayout)
are responsible for extracting specific information from the logged event and
adding it to the JSON output. Here we are including the timestamp, the logger's
name, the log level, as well as the log message. There are many other providers
available to `LoggingEventCompositeJsonEncoder`. Please refer to the linked
documentation for details.

[summary]
## Side note: Ship your structured Logback logs to Better Stack

Now that your Logback logs are in JSON format, [Better Stack's log management](https://betterstack.com/logs) automatically parses and indexes every JSON field, making them instantly searchable and filterable.

<iframe width="560" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


[/summary]


## Adding contextual information

In a production environment, it is essential to include detailed information
about the logged events in order to facilitate understanding and troubleshooting
of potential issues by you and your team. Rather than providing generic or
simplistic log messages, incorporating specific and relevant details can
significantly enhance the usefulness of the logs.

For instance, instead of a generic message like `"Order shipped successfully."`
you could include additional information such as the order number, buyer's name,
destination, and any other pertinent details that would assist in comprehending
the context of the log event. By including such specific information, the logs
become more informative and enable better analysis and diagnosis of potential
problems.

```text
[output]
{"@timestamp":"2023-05-17T18:19:04.104726-04:00","logger_name":"com.example.App","level":"INFO","message":"Order shipped successfully.","destination":"xxxxxxxxxx","orderNumber":"1234567890","buyerName":"jack"}
```

Including detailed information in the log messages allow for easier tracing of
events, correlating related logs, and providing a comprehensive picture of
system behavior. This can be invaluable for recognizing patterns, identifying
the root causes of issues, and assisting in debugging and troubleshooting
efforts.

To include contextual information using Logback, you need to import the `MDC`
library.

```java
[label App.java]
package com.example;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
[highlight]
import org.slf4j.MDC;
[/highlight]

public class App {

    private static final Logger logger = LoggerFactory.getLogger(App.class);

    public static void main(String[] args) {
        [highlight]
        // Add new items
        MDC.put("orderNumber", "1234567890");

        logger.info("Order placed.");

        MDC.put("buyerName", "jack");
        MDC.put("destination", "xxxxxxxxxx");

        logger.info("Order shipped successfully.");

        // Remove items
        MDC.remove("buyerName");
        MDC.remove("destination");

        logger.warn("Order shipment failed.");

        // Clear all items
        MDC.clear();
        [/highlight]
    }
}
```

In this example, the `put()` method adds new items (in key/value pair) to the
context map, the `remove()` method removes items from the map, and the `clear()`
method clears the entire map.

Adding the `mdc` provider can display the current context map in the output.

```xml
[label logback.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>

<configuration>
    <import class="ch.qos.logback.core.ConsoleAppender" />

    <appender name="STDOUT" class="ConsoleAppender">
        <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
            <providers>
                <timestamp />
                <loggerName />
                <logLevel />
                <message />
                [highlight]
                <mdc />
                [/highlight]
            </providers>
        </encoder>
    </appender>

    <root level="trace">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

```text
[output]
{"@timestamp":"2023-05-18T18:26:48.980091-04:00","logger_name":"com.example.App","level":"INFO","message":"Order placed.","orderNumber":"1234567890"}
{"@timestamp":"2023-05-18T18:26:48.9847-04:00","logger_name":"com.example.App","level":"INFO","message":"Order shipped successfully.","destination":"xxxxxxxxxx","orderNumber":"1234567890","buyerName":"jack"}
{"@timestamp":"2023-05-18T18:26:48.984917-04:00","logger_name":"com.example.App","level":"WARN","message":"Order shipment failed.","orderNumber":"1234567890"}
```

Notice that the `orderNumber` is included in all three log records since it is
not cleared until the end.

## Forwarding log messages with appenders

We've mentioned the appender a few times in this article. An appender is a
component of a logging framework that handles the output of log messages to a
particular destination, such as the console, a file, or a network socket.

![appenders.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/34e591b1-91f2-4a92-578e-b7b1d4394500/md2x =1976x1378)

In the previous examples, we have a `ConsoleAppender` configured.

```xml
[label logback.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>

<configuration>
    [highlight]
    <import class="ch.qos.logback.classic.encoder.PatternLayoutEncoder" />
    <import class="ch.qos.logback.core.ConsoleAppender" />

    <appender name="STDOUT" class="ConsoleAppender">
        <encoder class="PatternLayoutEncoder">
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} -- [%marker] %msg%n</pattern>
        </encoder>
    </appender>
    [/highlight]

    <root level="trace">
        [highlight]
        <appender-ref ref="STDOUT" />
        [/highlight]
    </root>
</configuration>
```

The `ConsoleAppender` is responsible for sending log messages to the console or
standard output (stdout). Forwarding logs to the standard output offers numerous
advantages. It simplifies the setup of your logging system and provides easy
access through the terminal for real-time log checking. Additionally, logging to
the console aligns with the default behavior of popular logging tools and
frameworks. This allows the utilization of log routers like
[Vector](https://vector.dev/docs/),
[LogStash](https://www.elastic.co/logstash/), or
[Fluentd](https://www.fluentd.org/) to gather logs from the standard output and
redirect them to alternative destinations for long-term storage or analysis
purposes.

Besides the `ConsoleAppender`, Logback also provides
[`FileAppender`](https://logback.qos.ch/manual/appenders.html#FileAppender),
[`SSLSocketAppender`](https://logback.qos.ch/manual/appenders.html#SocketAppender),
[`SMTPAppender`](https://logback.qos.ch/manual/appenders.html#SMTPAppender),
[`DBAppender`](https://logback.qos.ch/manual/appenders.html#DBAppender), and
various other appenders that forward logs to many different destinations. You
may check the linked documentations for details.

Go back to the `ConsoleAppender` configuration, and notice that the `ref`
parameter of `<appender-ref>` matches the `name` parameter of `<appender>`. This
matches loggers to different appenders. It is possible to attach multiple
appenders to a single logger.

Inside the `<appender>`, you can define additional properties such as:

- `encoder`: It defines the format the log records should follow.
- `target`: It defines the destination of the logs. Possible values are
  `System.out` or `System.err`.
- `withJansi`: It decides whether or not to activate the
  [Jansi](https://github.com/fusesource/jansi) library, which supports ANSI
  color codes on Windows machines.
- `filter`: As mentioned before, it defines the filter this appender will use.

### Logging to files

Logging to the console allows you to check the logs in real-time, which is why
it is the default configuration for most logging systems. However, sometimes you
might require a more persistent medium to store the log records so that you may
check and analyze them in the future. Logback provides a `FileAppender` that
allows you to forward the logs to local files for long-term storage.

```xml
[label logback.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>

<configuration>
    [highlight]
    <appender name="FILE" class="ch.qos.logback.core.FileAppender">
        <file>logs/app.log</file>
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} -- %msg%n</pattern>
        </encoder>
    </appender>
    [/highlight]

    <root level="trace">
        <appender-ref ref="FILE" />
    </root>
</configuration>
```

The `FileAppender` takes the following properties:

- `file`: Defines the name and path of the current log file to write to. If the
  file doesn't exist, it will be automatically created.
- `append`: If set to `true`, new logs will be appended to the end of the
  existing file. Otherwise, the old log records will be overwritten.
- `prudent`: When the prudent mode is enabled, appenders operate in a "safe"
  manner in a multi-process environment, where multiple instances of an
  application may attempt to log to the same file concurrently.

And, of course, the `filter` and `encoder` properties work with the
`FileAppender` as well.

Rerun your application, and an `app.log` file should be generated. You can check
its content using the following command:

```command
cat logs/app.log
```

```text
[output]
12:53:08.535 [main] TRACE com.example.App -- Entering method foo()
12:53:08.537 [main] DEBUG com.example.App -- Received request from 198.12.34.56
12:53:08.537 [main] INFO  com.example.App -- User logged in: john
12:53:08.537 [main] WARN  com.example.App -- Connection to server lost. Retrying...
12:53:08.537 [main] ERROR com.example.App -- Failed to write data to file: myFile.txt
```

### Rotating log files

In practice, sending all your logs into one single file is not a good idea,
especially for a large application, as it will make future maintenance
difficult. Instead, it is better to split the log file based on either size or
time and remove the old log files once they become outdated. Logback comes with
a `RollingFileAppender` that helps you achieve this.

```xml
[label logback.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>

<configuration>
    [highlight]
    <appender name="ROLLING" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/app.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/logFile.%d{yyyy-MM-dd_HH:mm:ss}.log</fileNamePattern>
            <maxHistory>5</maxHistory>
            <totalSizeCap>20GB</totalSizeCap>
        </rollingPolicy>
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} -- %msg%n</pattern>
        </encoder>
    </appender>
    [/highlight]

    <root level="trace">
        <appender-ref ref="ROLLING" />
    </root>
</configuration>
```

The `RollingFileAppender` takes the following parameters:

- `file`: Defines the name and path of the current log file.
- `append`: Same as the `FileAppender`, if set to `true`, new logs will be
  appended to the end of the existing file. Otherwise, the old log records will
  be overwritten.
- `rollingPolicy`: The rolling policy determines when and how log files are
  rotated. It defines the conditions under which a new log file is created, as
  well as the naming scheme for the rotated files.
- `triggeringPolicy`: The triggering policy decides when a log file should
  rotate based on certain triggering events or conditions. It works in
  conjunction with the rolling policy to determine if and when to initiate the
  rollover process.
- `prudent`: Same as the `FileAppender`.

Logback provides the following rolling policies:

- [`TimeBasedRollingPolicy`](https://logback.qos.ch/manual/appenders.html#TimeBasedRollingPolicy):
  This is the most commonly used rolling policy, which allows you to define file
  rotation based on time constraints.

- [`SizeAndTimeBasedRollingPolicy`](https://logback.qos.ch/manual/appenders.html#SizeAndTimeBasedRollingPolicy):
  This rolling policy works just like the `TimeBasedRollingPolicy`, except it
  allows you to split the log file based on size. This is especially useful if
  your application might generate a massive amount of logs in a very short
  period.

- [`FixedWindowRollingPolicy`](https://logback.qos.ch/manual/appenders.html#FixedWindowRollingPolicy):
  This rolling policy requires you to define a minimum and maximum index value,
  which makes the lower and upper bound of the window, and Logback will make
  sure all the log files are within this window by renaming them, as well as
  deleting outdated files.

![fixed-window.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e112b30a-73c5-4fc7-f751-33ef40315200/lg1x =1549x658)

Even though Logback is capable of rotating log files, in a production
environment, it is better to let the system environment to handle file
rotations. [Logrotate](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/)
is a tool designed for such tasks. It is a system utility for managing log files
in Unix-like operating systems. It automates the process of rotating,
compressing, and archiving log files to prevent them from becoming too large or
consuming excessive disk space.

## Using markers with your log records

In a real-world application, sometimes you need to log in a severity level not
provided by default, or you might need to categorize your logs in a more
flexible and user-customizable way. This is where markers come in. For example,
you may need a `FATAL` level to log more severe events than `ERROR`. By default,
Logback doesn't allow you to create custom log levels, as the `Level` class is
[final and cannot be subclassed](https://logback.qos.ch/manual/architecture.html#LoggerContext).
Instead, Logback encourages you to use markers.

A marker is a way to attach additional information to a logging event. It allows
you to categorize or label logging events, which can be useful in filtering or
processing them later. For example, you can create and attach a marker to your
log records like this:

```java
package com.example;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
[highlight]
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;
[/highlight]

public class App {

    private static final Logger logger = LoggerFactory.getLogger(App.class);
    [highlight]
    private static final Marker FATAL_MARKER = MarkerFactory.getMarker("FATAL");
    [/highlight]

    public static void main(String[] args) {
        [highlight]
        logger.error(FATAL_MARKER, "System crushed. Shutting down...");
        [/highlight]
    }
}
```

By default, the marker is not displayed in the output, but you can change that
by adding `%marker` to the pattern string in the `logback.xml` file:

```xml
[label logback.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>

<configuration>
    <import class="ch.qos.logback.classic.encoder.PatternLayoutEncoder" />
    <import class="ch.qos.logback.core.ConsoleAppender" />

    <appender name="STDOUT" class="ConsoleAppender">
        <encoder class="PatternLayoutEncoder">
            [highlight]
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} -- [%marker] %msg%n</pattern>
            [/highlight]
        </encoder>
    </appender>

    <root level="trace">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

```text
[output]
14:40:09.738 [main] ERROR com.example.App -- [FATAL] System crushed. Shutting down...
```

Besides `%marker`, there are many other ways you can customize the log record,
and we'll discuss them in detail later in this article.

## Understanding Logback filters

Filters allow you to selectively control which log events are processed by
appenders. They provide a way to conditionally include or exclude log events
based on specific criteria, such as log level, logger name, or other properties.
They can be used to fine-tune the logging output and customize the behavior of
the logging system.

For example, we created a `FATAL` marker as a custom log level in the previous
section. The problem with this example is that you can define a minimum log
level for the loggers by setting the `level` parameter, but you can't do the
same for markers. To achieve similar functionality, you must create a filter
instead.

```xml
[label logback.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>

<configuration>
    <import class="ch.qos.logback.classic.encoder.PatternLayoutEncoder" />
    <import class="ch.qos.logback.core.ConsoleAppender" />

    [highlight]
    <turboFilter class="ch.qos.logback.classic.turbo.MarkerFilter">
        <Marker>FATAL</Marker>
        <onMatch>ACCEPT</onMatch>
        <onMismatch>DENY</onMismatch>
    </turboFilter>
    [/highlight]

    <appender name="STDOUT" class="ConsoleAppender">
        <encoder class="PatternLayoutEncoder">
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} -- [%marker] %msg%n</pattern>
        </encoder>
    </appender>

    <root level="trace">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

In this example, we are using a predefined `TurboFilter` called `MarkerFilter`,
which examines the marker of a log record. If the marker is `FATAL`, the log
will be accepted, and if not, the log will be rejected.

![filters.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d3929654-c31e-4310-0e09-affea6446500/lg1x =2128x969)

The `TurboFilter` is, in fact, a special type of filter in Logback. It is
defined globally and not attached to any logger or appender. In addition, a
regular `Filter` object is available, which allows you to define filters for
individual appenders.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>

<configuration>
    <import class="ch.qos.logback.classic.encoder.PatternLayoutEncoder" />
    <import class="ch.qos.logback.core.ConsoleAppender" />

    <appender name="STDOUT" class="ConsoleAppender">
        [highlight]
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>INFO</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
        [/highlight]
        <encoder class="PatternLayoutEncoder">
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} -- [%marker] %msg%n</pattern>
        </encoder>
    </appender>

    <root level="trace">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

This example uses the built-in `LevelFilter` and ensures this appender only
accepts `INFO` level logs.

Logback only offers two predefined regular filters,
[`LevelFilter`](https://logback.qos.ch/manual/filters.html#levelFilter) and
[`ThresholdFilter`](https://logback.qos.ch/manual/filters.html#thresholdFilter).
Therefore, if you wish to use a marker filter, you must create a custom one.

Create a `MarkerFilter.java` file in your project:

```java
[label MarkerFilter.java]
package com.example;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.filter.Filter;
import ch.qos.logback.core.spi.FilterReply;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;

public class MarkerFilter extends Filter<ILoggingEvent> {
    @Override
    public FilterReply decide(ILoggingEvent event) {

        Marker markerToMatch = MarkerFactory.getMarker("FATAL");

        if (event.getMarkerList().contains(markerToMatch)) {
            return FilterReply.ACCEPT;
        } else {
            return FilterReply.DENY;
        }
    }
}
```

And then, use this filter inside the appender.

```xml
[label logback.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>

<configuration>
    <import class="ch.qos.logback.classic.encoder.PatternLayoutEncoder" />
    <import class="ch.qos.logback.core.ConsoleAppender" />

    <appender name="STDOUT" class="ConsoleAppender">
        [highlight]
        <filter class="com.example.MarkerFilter" />
        [/highlight]
        <encoder class="PatternLayoutEncoder">
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} -- [%marker] %msg%n</pattern>
        </encoder>
    </appender>

    <root level="trace">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

This time, the appender will filter out all logs except those with the marker
`FATAL`.

```java
[label App.java]
package com.example;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;

public class App {

    private static final Logger logger = LoggerFactory.getLogger(App.class);
    private static final Marker FATAL_MARKER = MarkerFactory.getMarker("FATAL");
    private static final Marker IMPORTANT_MARKER = MarkerFactory.getMarker("IMPORTANT");

    public static void main(String[] args) {
        [highlight]
        logger.error(IMPORTANT_MARKER, "Failed to write data to file: myFile.txt");
        logger.error(FATAL_MARKER, "System crushed. Shutting down...");
        [/highlight]
    }
}
```

```text
[output]
20:51:14.925 [main] ERROR com.example.App -- [FATAL] System crushed. Shutting down...
```
[ad-logs]

## Final thoughts

In conclusion, Logback provides a comprehensive logging solution with various
features that enable effective log management. In this guide, we discussed log
levels, markers, filters, and appenders, and now you can tailor your logging
output to meet your specific needs. We also covered more advanced and practical
topics, such as formatting log messages, adding contextual information, and
utilizing structured logging to enhance log readability and analysis.

To learn more about logging in Java applications, you can also refer to our
guides on [Log4j](https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4j/), another popular Java logging
framework, as well as the [best practices](https://betterstack.com/community/guides/logging/how-to-start-logging-with-java/) you
should follow when creating a logging system for your Java application.
