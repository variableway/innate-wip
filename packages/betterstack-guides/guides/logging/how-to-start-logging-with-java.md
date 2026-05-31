# 10 Best Practices for Logging in Java

Logging is an integral and indispensable aspect of the software development
process. It empowers developers to effectively monitor and troubleshoot
applications by gathering and analyzing pertinent data. By identifying potential
issues and bugs, logging plays a pivotal role in enhancing code quality and
optimizing performance.

In this comprehensive tutorial, we will delve into the realm of best practices
for creating a robust logging system specifically tailored for Java
applications. By implementing these practices, you will be able to craft logs
that are consistent, informative, and immensely valuable for critical tasks such
as debugging, maintenance, and other essential purposes.

## Prerequisites

Before proceeding to the rest of this article, make sure you have
[JDK 20](https://openjdk.org/projects/jdk/20/) installed on your computer, and
we assume you are using [Apache Maven](https://maven.apache.org) as the build
system. You should also understand the basics of logging in Java, including [log
levels](https://betterstack.com/community/guides/logging/log-levels-explained/), [log
rotation](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/), and so on.

[summary]

## Side note: Ship your structured Java logs to Better Stack

Once your Java app is emitting structured logs with Log4j, [Better Stack](https://betterstack.com/logs) makes it easy to explore them in real time, run powerful searches, and build dashboards that keep an eye on production.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## 1. Choose a logging framework

Like many other programming languages, Java has built-in logging functionality
provided by the `java.util.logging` package. However, even though it is
effortless to set up and use, it only offers basic logging features, making it
unsuitable for production-ready applications.

If you are building a large-scale application, you'll likely need a more [robust
logging solution](https://betterstack.com/community/guides/logging/logging-framework/), which should have the following features:

- The framework should be able to log events in a structured format such as
  JSON, [Logfmt](https://betterstack.com/community/guides/logging/logfmt/), and so on.
- It should allow you to include contextual information that describes the
  logged event.
- It should have a centralized configuration system that allows you to configure
  the logging system in one place without altering the application code.
- Other features such as filtering, asynchronous logging, detailed
  documentation, good community support, and so on.

You get all of these features out of the box by using a third-party logging
framework. And in the Java community, the two most popular options are Log4j and
Logback.

![log4j](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bf35f58e-abc9-4694-743b-48407e049700/lg1x =2872x1968)

[Log4j](https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4j/) is a powerful and flexible logging
framework for Java applications. It provides a wide range of features, including
log levels, various logging appenders, advanced logging configurations, and
support for asynchronous logging. The framework has a modular architecture that
allows developers to easily extend and customize its functionality, and it
provides an intuitive API that makes it easy to integrate with other tools and
frameworks.

![Logback](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/07718a40-88eb-4f6a-8530-cfc84093cd00/md2x =2872x1968)

[Logback](https://logback.qos.ch) is a project created based on the old Log4j 1,
as a result, they offer similar functionality. On top of that, Logback offers
many improvements. It is known for its simplicity and ease of use, with a
consistent API and configuration process that make it easy to integrate with
other tools and frameworks. Additionally, Logback is highly performant, with a
focus on efficiency and minimal resource usage. The framework is actively
maintained and has a large user community, making it a reliable choice for
logging in Java applications.

Overall, If you are looking for something simple and easy to use, you should go
with Logback, and you if need a more feature-rich and extensible framework, then
you should consider Log4j instead. In this tutorial, we are going to use Log4j
as an example, as it is the more popular option.

## 2. Mask the logging framework with SLF4J

Many other tutorials refer to SLF4J as a logging framework, but that is not an
accurate definition. It is not like Log4j or Logback, instead, it provides an
interface that work on top of other logging frameworks, allowing developers to
switch the underlying logging frameworks without having to change any code.

For example, you could set up Log4j to work with SLF4J. First, make sure you
have the following dependencies in your `pom.xml`:

```xml
[label pom.xml]
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>java-logging-slf4j-log4j</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>20</maven.compiler.source>
        <maven.compiler.target>20</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    [highlight]
    <dependencies>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-api</artifactId>
            <version>2.20.0</version>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>2.20.0</version>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-slf4j2-impl</artifactId>
            <version>2.20.0</version>
        </dependency>
    </dependencies>
    [/highlight]

</project>
```

`log4j-api` and `log4j-core` are the main components of Log4j, and
`log4j-slf4j2-impl` is Log4j's SLF4J binding, which allows SLF4J's API to use
Log4j as its backend.

And then you could configure this logging system as you would with a standard
Log4j setup.

```xml
[label log4j2.xml]
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN" monitorInterval="30">
    <Properties>
        <Property name="LOG_PATTERN">%d{yyyy-MM-dd HH:mm:ss} %-5p %c{1} - %m%n</Property>
    </Properties>

    <Appenders>
        <Console name="console" target="SYSTEM_OUT" follow="true">
            <PatternLayout pattern="${LOG_PATTERN}"/>
        </Console>
    </Appenders>

    <Loggers>
        <Root level="info">
            <AppenderRef ref="console"/>
        </Root>
    </Loggers>
</Configuration>
```

Lastly, use SLF4J's API to make a logging call instead of Log4j.

```java
[label Main.java]
package org.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main {
    public static void main(String[] args) {

        Logger logger = LoggerFactory.getLogger(Main.class);

        logger.info("Hello world!");

    }
}
```

```text
[output]
2023-04-13 16:46:09 INFO  Main - Hello world!
```

## 3. Use the most appropriate log level

The [log level](https://betterstack.com/community/guides/logging/log-levels-explained/) is a fundamental concept in logging, no
matter which logging framework you use. It allows you to tag log records
according to their severity or importance. SLF4J offers the following log levels
by default:

- `TRACE`: typically used to provide detailed diagnostic information that can be
  used for troubleshooting and debugging. Compare to `DEBUG` messages, `TRACE`
  messages are more fine-grained and verbose.
- `DEBUG`: used to provide information that can be used to diagnose issues
  especially those related to program state.
- `INFO`: used to record events that indicate that program is functioning
  normally.
- `WARN`: used to record potential issues in your application. They may not be
  critical but should be investigated.
- `ERROR`: records unexpected errors that occur during the operation of your
  application. In most cases, the error should be addressed as soon as possible
  to prevent further problems or outages.

You should always ensure you log the each messages with the appropriate log
level. For example:

```java
logger.trace("Entering method doSomething with parameters (param1=5, param2=10)");
logger.debug("Processing request for user ID 12345");
logger.info("user with ID '1234' just signed in");
logger.warn("Potential security vulnerability detected in user input: '...'");
logger.error("Failed to connect to database: java.sql.SQLException: Connection refused");
```

```text
[output]
2023-04-17 14:51:16 TRACE Main - Entering method doSomething with parameters (param1=5, param2=10)
2023-04-17 14:51:16 DEBUG Main - Processing request for user ID 12345
2023-04-17 14:51:16 INFO  Main - user with ID '1234' just signed in
2023-04-17 14:51:16 WARN  Main - Potential security vulnerability detected in user input: '...'
2023-04-17 14:51:16 ERROR Main - Failed to connect to database: java.sql.SQLException: Connection refused
```

You need to specify the most appropriate a minimum log level for the logger, so
that you can limit the number of logs recorded in a particular environment. For
example, you can default to `INFO` in production and `DEBUG` in development. To
specify log levels in Log4j, open the configuration file (`log4j2.xml`) and
configure it as shown below:

```xml
[label log4j2.xml]
. . .
<Loggers>
    <Logger name="org.apache.test" level="trace" additivity="false">
        <AppenderRef ref="Out"/>
    </Logger>
    [highlight]
    <Root level="error">
    [/highlight]
        <AppenderRef ref="Out"/>
    </Root>
</Loggers>
```

This configuration defines two different loggers, `org.apache.test` and the
default logger (`Root`), both using the `Out` appender. The logger
`org.apache.test` has minimum log level `trace`, which means it will log all
messages higher than or equal to `trace`. The `Root` logger has minimum log
level `error`, meaning it will exclude messages with levels `trace`, `debug`,
and `info`.

## 4. Log in a structured format

Plain text log message are easy for humans to read but not so much for machines
. However, when running an application with a considerable number of logs,
you'll [definitely need to rely on machines](https://betterstack.com/community/guides/logging/log-aggregation/) to process them to
allow for more efficient log processing and analysis workflows. Logging in a
structured format, such as JSON, makes it easier for machines to process and
analyze the log records.

Log4j offers a convenient feature that allows you to log in different formats,
called [layouts](https://logging.apache.org/log4j/2.x/manual/layouts.html). It
enables you to format the log records into CSV, JSON, XML, YAML, etc. The most
commonly used format is JSON.

To log in JSON format using Log4j, make sure you include the `jackson-databind`
dependency in your `pom.xml` file, and then create a new `JsonLayout` in the
configuration:

```xml
[label log4j2.xml]
. . .
<Appenders>
    <Console name="console" target="SYSTEM_OUT">
        [highlight]
        <JsonLayout></JsonLayout>
        [/highlight]
    </Console>
</Appenders>
<Loggers>
    <Root level="TRACE">
        <AppenderRef ref="console" />
    </Root>
</Loggers>
```

Now your log messages will be transformed into JSON format:

```text
[output]
{
    "instant" : {
        "epochSecond" : 1680549415,
        "nanoOfSecond" : 978810000
    },
    "thread" : "main",
    "level" : "INFO",
    "loggerName" : "org.example.Main",
    "message" : "A user just signed in.",
    "endOfBatch" : false,
    "loggerFqcn" : "org.apache.logging.log4j.spi.AbstractLogger",
    "threadId" : 1,
    "threadPriority" : 5
}
```

You can also use the `JsonTemplateLayout` instead, which allows you to specify a
template that the JSON output should follow. Ensure you have the
`log4j-layout-template-json` dependency in your `pom.xml`, then edit the
configuration file:

```xml
[label log4j2.xml]
. . .
<Appenders>
    <Console name="console" target="SYSTEM_OUT">
        <JsonTemplateLayout eventTemplateUri="classpath:EcsLayout.json"/>
    </Console>
</Appenders>
```

This example uses the Elastic Common Schema (ECS) specification, defined by the
`EcsLayout.json` file:

```json
[label EcsLayout.json]
{
  "@timestamp": {
    "$resolver": "timestamp",
    "pattern": {
      "format": "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
      "timeZone": "UTC"
    }
  },
  "ecs.version": "1.2.0",
  "log.level": {
    "$resolver": "level",
    "field": "name"
  },
  "message": {
    "$resolver": "message",
    "stringified": true
  },
  "process.thread.name": {
    "$resolver": "thread",
    "field": "name"
  },
  "log.logger": {
    "$resolver": "logger",
    "field": "name"
  },
  "labels": {
    "$resolver": "mdc",
    "flatten": true,
    "stringified": true
  },
  "tags": {
    "$resolver": "ndc"
  },
  "error.type": {
    "$resolver": "exception",
    "field": "className"
  },
  "error.message": {
    "$resolver": "exception",
    "field": "message"
  },
  "error.stack_trace": {
    "$resolver": "exception",
    "field": "stackTrace",
    "stackTrace": {
      "stringified": true
    }
  }
}
```

And it should give you the following output:

```text
[output]
{"@timestamp":"2023-04-03T21:55:37.102Z","ecs.version":"1.2.0","log.level":"INFO","message":"A user just signed in.","process.thread.name":"main","log.logger":"org.example.Main"}
```

## 5. Be descriptive and include contextual information

Another issue with our previous examples is that the message only contains
simple text such as `A user just signed in`, which does not provide enough
information about the user who signed in. In practice, you should always provide
more contextual information to describe the event logged.

For example, with SLF4J, you could include the username using `MDC` (Mapped
Diagnostic Context):

```java
[label Main.java]
package org.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
[highlight]
import org.slf4j.MDC;
[/highlight]

public class Main {
    public static void main(String[] args) {

        Logger logger = LoggerFactory.getLogger(Main.class);

        [highlight]
        MDC.put("username", "jack");
        logger.info("A user just signed in.");
        [/highlight]

    }
}
```

```text
[output]
{"@timestamp":"2023-04-14T16:49:01.041Z","ecs.version":"1.2.0","log.level":"INFO","message":"A user just signed in.","process.thread.name":"main","log.logger":"org.example.Main","username":"jack"}
```

Notice that the username has been added to the end of the log entry. Note that
the same context is added to all the logging calls in the current scope:

```java
[label Main.java]
package org.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

public class Main {
    public static void main(String[] args) {

        Logger logger = LoggerFactory.getLogger(Main.class);

        [highlight]
        MDC.put("username1", "jack");
        [/highlight]
        logger.info("A user just signed in.");
        logger.info("User created new document");
    }
}
```

```text
[output]
{"@timestamp":"2023-04-14T16:54:56.483Z","ecs.version":"1.2.0","log.level":"INFO","message":"A user just signed in.","process.thread.name":"main","log.logger":"org.example.Main","username":"jack"}
{"@timestamp":"2023-04-14T16:54:56.484Z","ecs.version":"1.2.0","log.level":"INFO","message":"User created new document","process.thread.name":"main","log.logger":"org.example.Main","username":"jack"}
```

If you want to clear the context, you must use the `MDC.clear()` method before
the call to a logging method.

## 6. Forward the logs to the standard output

You may have noticed something called appender in both Log4j. Appenders allow
you to push the logs to different destinations, such as the console, local
files, databases, and so on. You can set up a logger with multiple appenders to
forward the logs to different destinations. Here is an example:

```xml
[label log4j2.xml]
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    <Appenders>
        <Console name="console" target="SYSTEM_OUT">
            <JsonTemplateLayout eventTemplateUri="classpath:EcsLayout.json"/>
        </Console>
        <File name="file" fileName="logs/app.log">
            . . .
        </File>
        <NoSql name="database">
            . . .
        </NoSql>
    </Appenders>
    <Loggers>
        [highlight]
        <Root level="TRACE">
            <AppenderRef ref="console" />
            <AppenderRef ref="file" />
            <AppenderRef ref="database" />
        </Root>
        [/highlight]
    </Loggers>
</Configuration>
```

You may configure this system however you wish, but in most cases, you should
configure the loggers to log to the standard output.

```xml
[label log4j2.xml]
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    <Appenders>
        [highlight]
        <Console name="console" target="SYSTEM_OUT">
            <JsonTemplateLayout eventTemplateUri="classpath:EcsLayout.json"/>
        </Console>
        [/highlight]
    </Appenders>
    <Loggers>
        <Root level="TRACE">
            [highlight]
            <AppenderRef ref="console" />
            [!highlight]
        </Root>
    </Loggers>
</Configuration>
```

There are many benefits to forwarding the logs to the standard output. It is
usually the most straightforward method of setting up your logging system. The
standard output is also the most accessible option, as you can use the terminal
to check the logs in real-time.

And most importantly, logging to the console is the standard behavior for most
logging tools and frameworks. For example, you can use the log routers such as
[Vector](https://vector.dev/docs/),
[LogStash](https://www.elastic.co/logstash/), or
[Fluentd](https://www.fluentd.org) to collect the logs from the standard output,
and then deliver them to other destinations for long-term storage or analysis.

[summary]
## Side note: Visualize your Log4j output with Better Stack dashboards
With [Better Stack](https://betterstack.com/logs), you can turn your Log4j JSON logs into clear dashboards. Track errors over time, break down trends by level or exception type, and use MDC context to follow user activity, all in one place.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
[/summary]


## 7. Log as much as possible but avoid sensitive data

In a real-world scenario, different teams in your organization could use the
logs for various purposes. For instance, the development team could use the logs
to identify potential issues in the application, the operations team could use
the logs to track the key performance indicators and monitor the health of your
services, and the customer services team could use the logs to gain insights
into user behavior and understand how users are interacting with the
application.

As a result, you should always log as many events as possible when logging in
your Java application and always log for more than debugging and troubleshooting
purposes. Some examples include:

- Administrative activities include user sign in, sign out, registration, and
  deletion.
- A user has granted (or denied) access to a resource.
- Resource creation, modification, or deletion.
- Performance metrics such as response time, resource utilization, etc.
- High-risk activities such as failed login attempts, unauthorized data access,
  changes to security policies, and so on.

However, even though you should be as thorough as possible when logging, that
doesn't mean you should log everything. Some sensitive information could lead to
security issues, such as passwords, the user's real name, address, credit card
numbers, and so on.

Using Log4j, you can programmatically mask sensitive information in your log
messages with the following steps:

- Define a custom field in your JSON layout file (`EcsLayout.json` in our
  example):

  ```json
  [label EcsLayout.json]
  {
    . . .
    "password": "${json:MaskingJsonMessage@mdc:password}"
  }
  ```

  This example will find the `password` field in your MDC, and then mask it with
  the `MaskingJsonMessage` class.

- Define your `MaskingJsonMessage` class like this:

  ```java
  [label MaskingJsonMessage.java]
  import org.apache.logging.log4j.core.LogEvent;
  import org.apache.logging.log4j.core.config.plugins.Plugin;
  import org.apache.logging.log4j.core.layout.JsonLayout;

  @Plugin(name = "MaskingJsonMessage", category = "Core", elementType = "message", printObject = true)
  public class MaskingJsonMessage extends JsonLayout {

      private static final String PASSWORD_FIELD_NAME = "password";

      @Override
      public String getFormattedMessage(LogEvent event) {
          String json = super.getFormattedMessage(event);
          return maskPassword(json);
      }

      private String maskPassword(String json) {
          // Mask password field with placeholder
          return json.replaceAll("\"" + PASSWORD_FIELD_NAME + "\":\".*?\"", "\"" + PASSWORD_FIELD_NAME + "\":\"********\"");
      }
  }

  ```

  This class overwrites the default `getFormattedMessage()` method, and masks
  the `password` field by replacing its value with `********`.

- Make sure you are using the right layout file in your `log4j2.xml`.

  ```xml
  [label log4j2.xml]
  . . .
  <Console name="Console" target="SYSTEM_OUT">
      <JsonTemplateLayout eventTemplateUri="classpath:EcsLayout.json"/>
  </Console>
  ```

- Finally start logging in your application, and the password will be masked
  this time:

  ```java
  [label Main.java]
  package org.example;

  import org.slf4j.Logger;
  import org.slf4j.LoggerFactory;
  import org.slf4j.MDC;

  public class Main {
      public static void main(String[] args) {

          Logger logger = LoggerFactory.getLogger(Main.class);

          MDC.put("username", "jack");
          MDC.put("password", "12345");
          logger.info("New user created.");

      }
  }
  ```

## 8. Configure the logging framework to avoid performance issues

Logging as many activities as possible may also have a negative impact on the
performance of your application and services. For example, it could slow down
the application's response time and, as a result, affect the user experience.
But luckily, there are ways to remedy that.

For instance, you could up asynchronous logging for your application, which
allows frameworks to execute I/O operations in a separate thread so that the
logging call will not affect the application's response time.

With synchronous logging, the application thread will generate the log message,
and then wait to push the message to its destination before it can continue
executing. This can slow down the application, particularly if the logging
operation takes a long time to complete.

Asynchronous logging, on the other hand, will utilize a separate thread to push
the log message, so that the application thread could continue executing without
waiting. This can help reducing the impact of logging on the performance of your
application, particularly in high-traffic environments where a large number of
log messages are generated.

But of course, nothing is perfect. Asynchronous logging does have several
downsides, such as increased memory usage, as the log messages will need to stay
in memory before the second thread picks them up. Async logging could also lead
to wrong log message ordering, which could make it more difficult to debug
issues that span multiple log messages. And there is also the risk of data loss,
if the system crashed before log messages are pushed to its destination for
long-term storage, the messages that are still in memory could be lost.

To set up asynchronous logging with Log4j, you can convert all existing loggers
to asynchronous loggers by setting either one of the following system
properties:

```command
log4j2.contextSelector=org.apache.logging.log4j.core.async.AsyncLoggerContextSelector
```

```command
log4j2.contextSelector=org.apache.logging.log4j.core.async.BasicAsyncLoggerContextSelector
```

Or if you only want selected loggers to be asynchronous, use the `<asyncRoot>`
or `<asyncLogger>` configuration elements:

```xml
[label log4j2.xml]
. . .
<Loggers>
    <AsyncLogger name="com.foo.Bar" level="trace" includeLocation="true">
        <AppenderRef ref="Console"/>
    </AsyncLogger>
    <Root level="info" includeLocation="true">
        <AppenderRef ref="Console"/>
    </Root>
</Loggers>
```

Besides asynchronous logging, Log4j also comes with a feature called
Garbage-free logging. Most logging frameworks allocate temporary objects during
logging, which puts pressure on the garbage collector. By enabling the
garbage-free mode, Log4j will reuse the objects and buffers and allocate as few
temporary objects as possible.

The garbage-free logging can be enabled by setting the following system
properties:

First, make sure objects are created in `ThreadLocal` and reused.

```command
log4j2.enableThreadlocals=true
```

Ensure log events are converted to texts and then to bytes without creating
objects.

```command
log4j2.enableDirectEncoders=true
```

Enable garbage-free mode for the `ThreadContext` map.

```command
log4j2.garbagefreeThreadContextMap=true
```

## 9. Utilize the exception-handling mechanism

Exception handling is perhaps the most common use case for logging. When logging
exceptions, you should always log the full stack trace, so that the log entry
includes enough information to let you know where the exception happened. Here
is an example of how to log exceptions using Log4j:

```java
[label Main.java]
package org.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

public class Main {
    public static void main(String[] args) {

        Logger logger = LoggerFactory.getLogger(Main.class);

        try
        {
            // do something here that might throw an exception
            int[] myNumbers = {1, 2, 3};
            System.out.println(myNumbers[10]);
        }
        catch (Exception e)
        {
            logger.error("An exception has been caught.", e);
        }
    }
}
```

```json
[output]
{"@timestamp":"2023-04-19T19:22:45.516Z","ecs.version":"1.2.0","log.level":"ERROR","message":"An exception has been caught.","process.thread.name":"main","log.logger":"org.example.Main","error.type":"java.lang.ArrayIndexOutOfBoundsException","error.message":"Index 10 out of bounds for length 3","error.stack_trace":"java.lang.ArrayIndexOutOfBoundsException: Index 10 out of bounds for length 3\n\tat org.example.Main.main(Main.java:19)\n"}
```

This example contains detailed information regarding the error, such as the type
of the error, the error message, as well as the location of the error in your
code.

## 10. Centralize your logs in one place

When managing a smaller application with one or two servers, you can log on to each to check the logs. However, as your application scales, this becomes tedious. The solution is aggregating and centralizing your logs with a log management service.

[Better Stack](https://betterstack.com/) is a cloud-based log management tool that enables you to collect, monitor, and analyze log data from various sources in real time. It offers a centralized platform for managing log data with powerful search, filtering, alerting, and visualization capabilities.


![Better Stack dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)


With Better Stack, you can easily collect and analyze log data from servers, applications, containers, and cloud platforms. It offers integrations with popular services like AWS, Google Cloud, Docker, Kubernetes, and many others.

Centralizing your logs with Better Stack helps you streamline log management processes, improve troubleshooting and monitoring capabilities, and enhance your overall application performance and security.

To get started, [register an account](https://betterstack.com/users/sign-up), create a new source, and follow the instructions to connect Better Stack to your Java project. You can use an appender to push logs directly to Better Stack, but the standard approach is to continue sending log entries to standard output, then use [Vector](https://betterstack.com/docs/logs/vector/) to collect and redirect them to Better Stack.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/8NMpHrVnJes" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Once logs start streaming, you'll see them on the **Live tail** page where you can watch logs in real-time and filter them using queries like `log.level:ERROR` or `username:jack`.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


One major benefit of using Better Stack is the ability to visualize your logs with custom dashboards. 

<iframe width="100%" height="400" src="https://www.youtube.com/embed/xmqvQqPkH24" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

You can also easily set up monitoring and alerting. Create alerts based on log patterns, volumes, or specific conditions. For example, Better Stack can push an alert to your team if more than 10 ERROR logs are received in one minute, or when specific exceptions like `ArrayIndexOutOfBoundsException` occur repeatedly.


## Final thoughts

In this tutorial, we covered some best practice guidelines that you should
follow to help you create a comprehensive and effective logging system for your
Java application. We hope this article can help you create more robust and
reliable applications.

To dig deeper into the subject of logging, please take a look at our articles on
[how to choose the right framework for your application](https://betterstack.com/community/guides/logging/logging-framework/),
[what is log aggregation](https://betterstack.com/community/guides/logging/log-aggregation/), as well as a detailed tutorial on
[how to start logging with Log4j](https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4j/).

Thanks for reading, and happy logging!
