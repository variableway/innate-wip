# How to Get Started with Log4j for Logging in Java

Log4j is a logging framework for Java applications created under the Apache
Software Foundation. It offers features such as log levels, filters, appenders,
etc. Log4j has been used extensively in the Java development community for many
years and has become the de-facto option for logging in Java applications.

Log4j 2 is the latest version of the Log4j framework, released in 2014. It is a
complete rewrite of the original Log4j library and introduces many new features
and improvements over its predecessor. The update provides improved performance,
better support for asynchronous logging, enhanced configuration options, better
support for web applications, and so on.

In this tutorial, we will go over the basics of logging with Log4j, starting
from the configurations, [log levels](https://betterstack.com/community/guides/logging/log-levels-explained/), [log
rotation](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/), pushing logs
with appenders, log formatting, logging in a structured format and more. This
article aims to help you set up a production-ready logging system for your Java
application using Log4j.

## Prerequisites

Before we get started, ensure that you have the latest version of
[JDK](https://openjdk.org/projects/jdk/) and [Maven](https://maven.apache.org)
installed on your computer, and you understand how to create a Java application,
as well as the basics of [logging in Java](https://betterstack.com/community/guides/logging/how-to-start-logging-with-java/).

[summary]
## Side note: Ship your Log4j logs to Better Stack

Head over to [Better Stack](https://betterstack.com/log-management) and start centralizing your Java application logs in minutes with our native Log4j integration.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]
## Getting started with Log4j

To use Log4j in your Java project, you must first install the corresponding
dependencies by adding them to the `pom.xml` file:

```xml
[label pom.xml]
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>demo</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>demo</name>
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
      <groupId>org.apache.logging.log4j</groupId>
      <artifactId>log4j-api</artifactId>
      <version>2.20.0</version>
    </dependency>
    <dependency>
      <groupId>org.apache.logging.log4j</groupId>
      <artifactId>log4j-core</artifactId>
      <version>2.20.0</version>
    </dependency>
    [/highlight]
  </dependencies>

  . . .

</project>
```

The `log4j-api` module provides a public API for the logging framework,
including `Logger`, `Level`, and various other interfaces, which we will discuss
later in this article while the `log4j-core` module is the actual logging
implementation, offering the `LogManager`, `LoggerContext`, `Appender` classes,
and others. It also includes support for features such as filtering, layout, and
thread context data.

Next, instruct Maven to install these dependencies with the following command:

```command
mvn install
```

```text
[output]
[INFO] Scanning for projects...
[INFO]
[INFO] --------------------------< com.example:demo >--------------------------
[INFO] Building demo 1.0-SNAPSHOT
[INFO] from pom.xml
. . .
[INFO] --- jar:3.0.2:jar (default-jar) @ demo ---
[INFO] Building jar: /Users/erichu/Documents/Better Stack/demos/log4j-demo/demo/target/demo-1.0-SNAPSHOT.jar
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 1.498 s
[INFO] Finished at: 2023-04-20T14:09:46-04:00
[INFO] ------------------------------------------------------------------------
```

Maven will automatically add the dependencies to your project's classpath. They
are installed in the `.m2` folder under your home directory by default.

Afterward, you will be able to use Log4j in your application as shown below:

```java
[label src/main/java/com/example/App.java]
package com.example;

[highlight]
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
[/highlight]

/**
 * Hello world!
 *
 */
public class App {
    protected static final Logger logger = LogManager.getLogger();

    public static void main(String[] args) {

        [highlight]
        logger.info("Hello World!");
        [/highlight]

    }
}
```

Before executing the above program, ensure that you have a configuration file
for Log4j (`log4j2.xml` file under the `src/main/resources` directory):

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

Compile and execute your Java application, and you should see the following
output in the terminal:

```text
[output]
2023-04-20 20:23:43.382 [main] INFO com.example.App - Hello World!
```

## Understanding log levels

There are a few things we need to discuss from the previous example. First,
notice the logging call:

```java
logger.info("Hello World!");
```

The `info()` method here is used to log an event at the `INFO` level. In
software development, [log levels](https://betterstack.com/community/guides/logging/log-levels-explained/) serve as a way to
categorize log messages based on their severity or importance. Log4j offers six
log levels by default, and each level is associated with an integer value:

- `TRACE` (`600`): this is the least severe log level, typically used to log
  fine-grained information about a program's execution such as entering or
  exiting functions, and variable values, and other low-level details that can
  help in understanding the internal workings of your code.
- `DEBUG` (`500`): it is used for logging messages intended to be helpful during
  the development and testing process, which is usually program state
  information that can be helpful when ascertaining whether an operation is
  being performed correctly.
- `INFO` (`400`): it is used for informational messages that record events that
  occur during the normal operation of your application, such as user
  authentication, API calls, or database access. These messages help you
  understand what's happening within your application.
- `WARN` (`300`): events logged at this level indicate potential issues that
  might require your attention before they become significant problems.
- `ERROR` (`200`): it is used to record unexpected errors that occur during the
  course of program execution.
- `FATAL` (`100`): this is the most severe log level, and it indicates an urgent
  situation affecting your application's core component that should be addressed
  immediately.

![log levels](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1b089526-75f2-433b-cdb6-061ecfe96200/md1x =1306x1280)

Log4j provides a corresponding method for each of these levels:

```java
logger.trace("Entering method processOrder().");
logger.debug("Received order with ID 12345.");
logger.info("Order shipped successfully.");
logger.warn("Potential security vulnerability detected in user input: '...'");
logger.error("Failed to process order. Error: {. . .}");
logger.fatal("System crashed. Shutting down...");
```

```text
[output]
2023-04-20 20:44:47.254 [main] TRACE com.example.App - Entering method processOrder().
2023-04-20 20:44:47.255 [main] DEBUG com.example.App - Received order with ID 12345.
2023-04-20 20:44:47.255 [main] INFO com.example.App - Order shipped successfully.
2023-04-20 20:44:47.255 [main] WARN com.example.App - Potential security vulnerability detected in user input: '...'
2023-04-20 20:44:47.255 [main] ERROR com.example.App - Failed to process order. Error: {. . .}
2023-04-20 20:44:47.255 [main] FATAL com.example.App - System crashed. Shutting down...
```

In addition to these predefined log levels, Log4j also supports custom log
levels. For example, if your project requires a log level `VERBOSE` with integer
value `550`, which is between levels `DEBUG` and `TRACE`, you can use the
`forName()` method to create it.

```java
[label App.java]
package com.example;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
[highlight]
import org.apache.logging.log4j.Level;
[/highlight]

public class App {
    [highlight]
    final Level VERBOSE = Level.forName("VERBOSE", 550);
    [/highlight]

    protected static final Logger logger = LogManager.getLogger();

    public static void main(String[] args) {
        [highlight]
        App app = new App();
        logger.log(app.VERBOSE, "a verbose message");
        [/highlight]
    }
}
```

```text
[output]
2023-04-24 17:13:30.257 [main] VERBOSE com.example.App - a verbose message
```

Alternatively, you can define custom log levels directly in the configuration
file:

```xml
[label log4j2.xml]
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="INFO">

    [highlight]
    <CustomLevels>
        <CustomLevel name="VERBOSE" intLevel="550" />
    </CustomLevels>
    [/highlight]

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

This configuration will make Log4j call the `forName()` method we just
introduced and create the `VERBOSE` level internally. You can then access this
level in your application code using the `getLevel()` method, and it should give
you the same output.

```java
[label App.java]
package com.example;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
[highlight]
import org.apache.logging.log4j.Level;
[/highlight]

public class App {
    protected static final Logger logger = LogManager.getLogger();

    public static void main(String[] args) {
        [highlight]
        logger.log(Level.getLevel("VERBOSE"), "a verbose message");
        [/highlight]
    }
}
```

Log levels also play a crucial role in controlling the volume of logs generated
by an application. By setting the appropriate log level, you can filter out less
critical log messages, reducing the overall volume.

Head back to the configuration file and notice how the `Root` logger is defined:

```xml
[label log4j2.xml]
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="INFO">

    <CustomLevels>
        <CustomLevel name="VERBOSE" intLevel="550" />
    </CustomLevels>

    <Appenders>
        <Console name="console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />
        </Console>
    </Appenders>

    <Loggers>
        [highlight]
        <Root level="trace">
            <AppenderRef ref="console" />
        </Root>
        [/highlight]
    </Loggers>

</Configuration>
```

The `level` attribute defines the minimum log level a record must have to be
logged. So, for example, if you set `level="info"`, then the `trace` and `debug`
level messages will be exempted from the output. Of course, this will work for
custom log levels as well.

```java
logger.trace("Entering method processOrder().");
logger.log(Level.getLevel("VERBOSE"), "Executing method foo() with parameters: [param1, param2]");
logger.debug("Received order with ID 12345.");
logger.info("Order shipped successfully.");
logger.warn("Potential security vulnerability detected in user input: '...'");
logger.error("Failed to process order. Error: {. . .}");
logger.fatal("System crashed. Shutting down...");
```

```text
[output]
2023-04-25 13:58:41.830 [main] INFO com.example.App - Order shipped successfully.
2023-04-25 13:58:41.831 [main] WARN com.example.App - Potential security vulnerability detected in user input: '...'
2023-04-25 13:58:41.831 [main] ERROR com.example.App - Failed to process order. Error: {. . .}
2023-04-25 13:58:41.831 [main] FATAL com.example.App - System crashed. Shutting down...
```

## Forwarding log messages with appenders

In Log4j, appenders are used to forward log messages to different destinations.
Log4j comes with multiple appenders out of the box, allowing you to push log
messages to the console, files, databases, and so on.

![appenders](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3c4e6b0b-aca2-429b-cda0-7e98968ddd00/lg2x =1976x1378)

In our previous example, a `Console` appender is defined, which will forward the
log messages to the standard output.

```xml
[label log4j2.xml]
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="INFO">

    <Appenders>
        [highlight]
        <Console name="console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />
        </Console>
        [highlight]
    </Appenders>

    <Loggers>
        <Root level="info">
            [highlight]
            <AppenderRef ref="console" />
            [/highlight]
        </Root>
    </Loggers>

</Configuration>
```

Notice the second highlighted area, indicating that the `Root` logger is using
the appender named `console`, and the `ref` should match the `name` parameter in
`Console`.

Also, notice that `Console` has a `target` parameter. This parameter takes two
possible values, `SYSTEM_OUT` will push the logs to the standard output, and
`SYSTEM_ERR` will push the logs to the standard error.

Besides `name` and `target`, the `Console` appender also takes the following
parameters:

- `filter`: determines whether a log message should be accepted by this
  appender.
- `layout`: defines the format and pattern the log message should follow.
- `follow`: determines whether the appender honors reassignments of `System.out`
  or `System.err` using `System.setOut` or `System.setErr`.
- `direct`: if set to `true`, this appender will write directly to
  `java.io.FileDescriptor` and bypass `System.out`. It can give up to 10x
  performance boost when the output is redirected to file or other process.
- `ignoreExceptions`: determines whether or not this appender will ignore
  exceptions. The default is `true`, and if set to `false`, the exceptions will
  be propagated.

### Logging to files

Logging to files is a common practice for capturing and storing log messages
generated by an application. With Log4j, you can forward the log messages to
files using the `File` appender.

```xml
[label log4j2.xml]
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="INFO">
    <Appenders>
        [highlight]
        <File name="file" fileName="logs/app.log">
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />
        </File>
        [/highlight]
    </Appenders>

    <Loggers>
        <Root level="info">
            [highlight]
            <AppenderRef ref="file" />
            [/highlight]
        </Root>
    </Loggers>
</Configuration>
```

The `fileName` parameter defines the name and path of the file this appender
will write to. If the file or any of its parent directories do not exist, they
will be automatically created. Rerun your application, and a `logs` directory
and `app.log` file will be created. You can check its content with the following
command:

```command
cat logs/app.log
```

```text
[output]
2023-04-25 14:36:48.402 [main] INFO com.example.App - Order shipped successfully.
2023-04-25 14:36:48.404 [main] WARN com.example.App - Potential security vulnerability detected in user input: '...'
2023-04-25 14:36:48.404 [main] ERROR com.example.App - Failed to process order. Error: {. . .}
2023-04-25 14:36:48.404 [main] FATAL com.example.App - System crashed. Shutting down...
```

### Rotating log files

When logging to files, a common practice to manage the logs and prevent them
from growing indefinitely is [log
rotation](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/). Log4j
provides a `RollingFile` appender for this purpose:

```xml
[label log4j2.xml]
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="INFO">

    <Appenders>
        [highlight]
        <RollingFile name="rolling" fileName="logs/app.log"
            filePattern="logs/$${date:yyyy-MM}/app-%d{MM-dd-yyyy}-%i.log.gz">
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />
            <Policies>
                <TimeBasedTriggeringPolicy />
                <SizeBasedTriggeringPolicy size="250 MB" />
            </Policies>
        </RollingFile>
        [/highlight]
    </Appenders>

    <Loggers>
        <Root level="info">
            [highlight]
            <AppenderRef ref="rolling" />
            [/highlight]
        </Root>
    </Loggers>

</Configuration>
```

The `filePattern` parameter specifies the naming pattern for the old log files.
If the file pattern ends with `.gz`, `.zip`, `.bz2`, `.deflate`, `.pack200`, or
`.xz`, the resulting archive will be compressed using the compression scheme
that matches the suffix.

The `Policies` parameter defines the condition that will trigger file rotation.
There are four different triggering policies available:

- `CronTriggeringPolicy`: file rotation is triggered based on a
   [Cron expression](https://logging.apache.org/log4j/2.x/log4j-core/apidocs/org/apache/logging/log4j/core/util/CronExpression.html).

   ```xml
   <!-- Triggers rotation at 04:05 of every day -->
   <CronTriggeringPolicy schedule="5 4 * * *" />
   ```

- `OnStartupTriggeringPolicy`: rotation is triggered if the log file is older
   than the current JVM's start time and the minimum file size is met or
   exceeded.

   ```xml
   <OnStartupTriggeringPolicy minSize="20 MB" />
   ```

- `SizeBasedTriggeringPolicy`: rotation is triggered is file size exceeds the
   specified limit.

   ```xml
   <SizeBasedTriggeringPolicy size="20 MB" />
   ```

- `TimeBasedTriggeringPolicy`: rotation is triggered periodically based on the
   specified time interval.

   ```xml
   <!-- Rotation every 4 hours -->
   <TimeBasedTriggeringPolicy interval="4" />
   ```


After file rotation occurs, you may also specify how many archived files you
wish to retain:

```xml
[label log4j2.xml]
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="INFO">
    <Appenders>
        <RollingFile name="rolling" fileName="logs/app.log"
            filePattern="logs/$${date:yyyy-MM}/app-%d{MM-dd-yyyy}-%i.log">
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />
            <Policies>
                <CronTriggeringPolicy schedule="* * * * *" />
            </Policies>
            [highlight]
            <DefaultRolloverStrategy max="20"/>
            [/highlight]
        </RollingFile>
    </Appenders>

    <Loggers>
        <Root level="info">
            <AppenderRef ref="rolling" />
        </Root>
    </Loggers>

</Configuration>
```

This example configures Log4j to only save the latest 20 archived files, while
removing older files. Besides the `RollingFile` appender, there is also a
`RollingRandomAccessFile` appender that works the same. The only difference is
that the latter is always buffered, significantly improving performance.

### Logging to other destinations

Log4j also comes with several other less common appenders but might be useful
under certain circumstances.

- The `NoSql` appender that can forward logs to NoSQL databases.

  ```xml
  <NoSql name="databaseAppender">
      <MongoDb3 databaseName="applicationDb" collectionName="applicationLog"
          server="mongo.example.org"
          username="loggingUser" password="abc123" />
  </NoSql>
  ```

- The `Http` appender can send log messages over HTTP.

  ```xml
  <Http name="Http" url="https://localhost:9200/test/log4j/">
      <Property name="X-Java-Runtime" value="$${java:runtime}" />
      <JsonLayout properties="true" />
      <SSL>
          <KeyStore location="log4j2-keystore.jks"
              passwordEnvironmentVariable="KEYSTORE_PASSWORD" />
          <TrustStore location="truststore.jks" passwordFile="${sys:user.home}/truststore.pwd" />
      </SSL>
  </Http>
  ```

- The `Syslog` appender send logs to syslog.

  ```xml
  <Syslog name="bsd" host="localhost" port="514" protocol="TCP" />
  ```

If you want to learn about other appenders available, please go to Log4j's
[official documentation](https://logging.apache.org/log4j/2.x/manual/appenders.html)
for details.

[ad-logs]

## Formatting log messages

You may have noticed that there is something we haven't discussed in our
original example, the `PatternLayout`:

```xml
[label log4j2.xml]
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="INFO">

    <Appenders>
        <Console name="console" target="SYSTEM_OUT">
            [highlight]
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />
            [/highlight]
        </Console>
    </Appenders>

    <Loggers>
        <Root level="info">
            <AppenderRef ref="console" />
        </Root>
    </Loggers>

</Configuration>
```

The `pattern` parameter takes an expression consisting of one or more conversion
specifiers, which specifies how each log message should be formatted. Each
conversion specifier starts with a percentage sign (`%`), followed by an
optional format modifier and a conversion character. The conversion character
specifies the data type, such as category, priority, date, and thread name. The
format modifiers control things like field width, padding, left and right
justification, etc.

In the above example, the following conversion specifiers are defined:

- `%d{yyyy-MM-dd HH:mm:ss.SSS}`: the date and time of the logged event.
- `%t`: the name of the thread that processed the logged event.
- `%-5level`: `level` is the conversion character, outputting the log level.
  `-5` is the format modifier, making sure that the log level is left justified
  and restricted to five characters.
- `%logger{36}`: the name of the logger, followed by a precision specifier,
  which controls the length of the logger name.
- `%msg`: the actual log message.
- `%n`: a new line character.

There are dozens of other specifiers available in Log4j. For instance, you could
add colored highlight to the output using `%highlight`:

```xml
<PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %highlight{%-5level} %logger{36} - %msg%n" />
```

![Colored output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/72d05096-736f-4b67-5d85-8dfd017e5c00/md2x =2116x664)

It is only possible to cover some of the specifiers in this article. For more
details, please refer to the
[official documentation](https://logging.apache.org/log4j/2.x/manual/layouts.html#patterns).

## Adding contextual information

In a production environment, you should include detailed information about the
logged event so that the logs can help you and your team understand and
troubleshoot possible issues. For example, instead of a simple message,
`Order shipped successfully.`, you could include the order number, buyer's name,
destination, and so on.

```text
2023-04-25 21:21:26.991 [main] INFO com.example.App - Order shipped successfully. Order number: xxxxx. Buyer name: xxxxx. Destination: xxxxx.
```

To include contextual information with Log4j, you need to use the
`ThreadContext` library.

```java
[label App.java]
package com.example;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
[highlight]
import org.apache.logging.log4j.ThreadContext;
[/highlight]

public class App {

    protected static final Logger logger = LogManager.getLogger();

    public static void main(String[] args) {
        [highlight]
        ThreadContext.put("orderNumber", "1234567890");
        ThreadContext.put("buyerName", "jack");
        ThreadContext.put("destination", "xxxxxxxxxx");

        logger.info("Order shipped successfully.");

        ThreadContext.clearAll();
        [/highlight]
    }
}
```

The `put()` method will add new items to the context map, and the `clearAll()`
method will clear the entire map. You must ensure that the logging call is
placed in between. Next we will discuss how to log in a structured format so
that the contextual information is included in the log message.

## Logging in a structured format

So far, we've only been working with the `PatternLayout`, but Log4j also allows
you reformat the log messages in other formats such as JSON, XML, and so on.
These formats make it easier for the log records to be automatically parsed,
analyzed and monitored by log management systems.

The de facto format for structured logging is JSON, which can be configured
using `JsonLayout`. Before you proceed, ensure that you have `jackson-core` and
`jackson-databind` dependencies in your `pom.xml`:

```xml
[label pom.xml]
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>demo</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>demo</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <dependencies>
    . . .
    [highlight]
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>2.15.0</version>
    </dependency>
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-core</artifactId>
      <version>2.15.0</version>
    </dependency>
    [/highlight]
  </dependencies>

  . . .
</project>
```

Install the packages with `mvn install`, then configure the appender to use
`JsonLayout`:

```xml
[label src/main/resources/log4j.xml]
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="INFO">

    <Appenders>
        <Console name="console" target="SYSTEM_OUT">
            [highlight]
            <JsonLayout />
            [/highlight]
        </Console>
    </Appenders>

    <Loggers>
        <Root level="trace">
            <AppenderRef ref="console" />
        </Root>
    </Loggers>

</Configuration>
```

Rerun your application and you should see the log message in JSON format.

```text
{
  "instant" : {
    "epochSecond" : 1682530421,
    "nanoOfSecond" : 359757000
  },
  "thread" : "main",
  "level" : "INFO",
  "loggerName" : "com.example.App",
  "message" : "Order shipped successfully.",
  "endOfBatch" : false,
  "loggerFqcn" : "org.apache.logging.log4j.spi.AbstractLogger",
  "threadId" : 1,
  "threadPriority" : 5
}
```

The `JsonLayout` also takes a set of
[optional parameters](https://logging.apache.org/log4j/2.x/manual/layouts.html#json-layout),
allowing you to customize the output. For example, by setting
`properties="true"`, you can include contextual information in the output.

```xml
<JsonLayout properties="true" />
```

```text
[output]
{
  "instant" : {
    "epochSecond" : 1682531418,
    "nanoOfSecond" : 950795000
  },
  "thread" : "main",
  "level" : "INFO",
  "loggerName" : "com.example.App",
  "message" : "Order shipped successfully.",
  "endOfBatch" : false,
  "loggerFqcn" : "org.apache.logging.log4j.spi.AbstractLogger",
  [highlight]
  "contextMap" : {
    "buyerName" : "jack",
    "destination" : "xxxxxxxxxx",
    "orderNumber" : "1234567890"
  },
  [/highlight]
  "threadId" : 1,
  "threadPriority" : 5
}
```

While `JsonLayout` brings structured JSON logging to Log4j, it lacks some
flexibility in customizing how the logs are outputted. For instance, there is no
way to include a human-readable timestamp in the output, and everything follows
a predefined template.

To solve this issue, you can use the `JsonTemplateLayout` instead to define your
own template. First, add and install the following dependency:

```xml
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-layout-template-json</artifactId>
    <version>2.20.0</version>
</dependency>
```

And edit your appender setup.

```xml
<Appenders>
    <Console name="console" target="SYSTEM_OUT">
        <JsonTemplateLayout eventTemplateUri="classpath:template.json"/>
    </Console>
</Appenders>
```

The template is defined by the `template.json` file under the `classpath`. Since
this tutorial assumes you are using Maven, you can place the file under your
`resources` directory (same as your `log4j2.xml`), and it will be automatically
added to the `classpath`.

And in the `template.json`, you can customize the layout however you wish. Here
is an example:

```json
[label src/main/resources/template.json]
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

This template will give the following output:

```json
[output]
{"@timestamp":"2023-04-26T18:08:51.430Z","ecs.version":"1.2.0","log.level":"INFO","message":"Order shipped successfully.","process.thread.name":"main","log.logger":"com.example.App","buyerName":"jack","destination":"xxxxxxxxxx","orderNumber":"1234567890"}
```

## Improving Log4j's performance

Log4j is a production-ready logging framework with many performance features, so
that it can handle massive log ingestion without slowing down your application.
Some of these features require special setup.

For example, there is an asynchronous logging feature, which allows the
framework to execute I/O operations in a separate thread. This reduces the
impact on the application's response time, unlike synchronous logging, where the
application thread generates the log message and waits until it reaches its
destination before continuing execution.

However, async logging does come with some downsides, such as increased memory
usage, the risk of data loss in case of a system crash, and potential incorrect
log message ordering, which could complicate debugging and troubleshooting.
Nevertheless, Async logging can be beneficial in high-traffic environments with
numerous generated log messages.

To enable asynchronous logging, you can set either one of the following system
properties:

```text
log4j2.contextSelector=org.apache.logging.log4j.core.async.AsyncLoggerContextSelector
```

```text
log4j2.contextSelector=org.apache.logging.log4j.core.async.BasicAsyncLoggerContextSelector
```

Or if you only want selected loggers to be asynchronous, use the `<asyncRoot>`
or `<asyncLogger>` for your loggers:

```xml
[label src/main/resources/log4j2.xml]
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

Log4j also provides garbage-free logging, a technique used to reduce the amount
of garbage generated during the logging process. It aims to eliminate the need
for garbage collection by reusing log message objects instead of creating new
ones for each message. This is achieved by allocating a buffer of fixed size,
which can be reused for multiple log messages, reducing the number of objects
that need to be created and subsequently garbage collected.

To enable garbage-free logging, set the following system properties:

- Make sure objects are created in `ThreadLocal` and reused.

```command
log4j2.enableThreadlocals=true
```

- Ensure log events are converted to texts and then bytes without creating
  objects.

```command
log4j2.enableDirectEncoders=true
```

- Enable garbage-free mode for the `ThreadContext` map.

```command
log4j2.garbagefreeThreadContextMap=true
```

And lastly, although we introduced `File` and `RollingFile` appenders in this
article, you should probably choose their performance-improved,
`RandomAccessFile` and `RollingRandomAccessFile`, which use the same
configurations, except they are always buffered. Log4j claims a 20% to 200%
performance improvement compared to the traditional appenders.

## Aggregating logs in the cloud

Aggregating logs in the cloud is a popular approach for managing modern systems, especially when you’re dealing with distributed infrastructure that produces a high volume of events. When logs are spread across multiple servers, containers, and services, troubleshooting becomes slow and inconsistent. Centralizing everything in the cloud makes it much easier to search, filter, and analyze logs in one place, so you can find issues faster and understand what’s happening across your stack.

Cloud-based platforms like [Better Stack](https://betterstack.com/log-management) help you go beyond basic log storage with features like real-time Live tail, fast structured search, dashboards for visualizing patterns, and alerting when logs become abnormal. You can collect logs from servers, apps, Docker, Kubernetes, and cloud environments, then inspect structured JSON, build queries with filters or SQL, and share context with your team. Better Stack also supports **logs and traces** together, giving you a clearer path from “something broke” to “here’s exactly where it started.”

![Better Stack log management dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)

[summary]
## Side note: Visualize your logs in real-time dashboards

Turn your Log4j output into actionable insights. [Better Stack](https://betterstack.com/log-management) aggregates logs from all your Java services, tracks error rates, monitors performance trends, and alerts you before issues escalate.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Final thoughts

In conclusion, Log4j is a powerful and flexible logging framework that can help
you manage and analyze your application logs effectively. This tutorial
introduced how to control log levels, format log messages, and add contextual
information to log records. We also discussed various appenders, which allow
developers to forward log messages to different destinations, such as files or
databases. And lastly, we briefly touched on how to improve Log4j's performance
with techniques such as asynchronous logging and garbage-free logging.

To dig deeper into logging in Java applications, you can also refer to our
tutorials on [how to choose the right framework for your application](https://betterstack.com/community/guides/logging/logging-framework/),
[what is log aggregation](https://betterstack.com/community/guides/logging/log-aggregation/), as well as the [best
practices](https://betterstack.com/community/guides/logging/how-to-start-logging-with-java/) you should follow when creating a
logging system for your Java project.
