# How To Start Logging With Log4php

[note]
## Log4php is deprecated

[Log4php was rendered dormant](https://logging.apache.org/log4php/) by the Apache Foundation on December 14, 2020 and will no longer receive any updates. We recommend that you switch to [Monolog](https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/).
[/note]



In this tutorial, you will learn how to use log4php for logging PHP
applications. This will help you troubleshoot your application much faster.
Finding bugs in code may be very frustrating and time-consuming, especially,
when the application grows in scale. With the log4php framework, you can debug
your application efficiently and save a lot of time.

Apache log4php is a robust and versatile logging framework for PHP. That can be
configured using XML or PHP and provides various logging destinations such as
console, files, email, databases, sockets, and syslog. You can also store log
data in many formats or create your own.

Apache log4php is an open-source project at the Apache Software Foundation.
Although log4php is a dormant project as of December 14, 2020, it's still widely
used and part of many PHP applications such as CMS Made simple or Ding.

## Prerequisites

- Webserver with PHP installed.
- Composer installed.

[ad-logs]

## Step 1 — Installing log4php

Let's start with the installation. For that, we will use composer. First, create
`composer.json` file in your project root and include the following content:

    {
        "require": {
            "apache/log4php": "2.3.0"
        }
    }

Then run following command :

    composer install

This will download and install log4php in your project directory. Alternatively,
you can download the package manually from the
[official Apache log4php website](https://logging.apache.org/log4php/download.html).

## Step 2 — Configuring log4php

Most components of log4php have various settings which determine their
behaviour. You can configure them on the go, or you can provide a configuration
file. Log4php understands three formats of configuration: XML, PHP and
Properties. In the following examples, we will be using XML configuration as it
is easiest to understand.

Log4php consists of three main entities: `Loggers`, `Appenders` and `Layouts`.

`Loggers` are entities responsible for catching the log messages and passing
them to their `Appenders`. `Loggers` can be named and can create an inheritance
hierarchy.

`Appenders` are entities responsible for logging the actual message to the
selected destination and use `Layouts` for formatting.

`Layouts` determine the actual format of the log message.

### XML Configuration File

Let's start by creating `config.xml` file in your project directory.

```php

<?xml version="1.0" encoding="UTF-8"?>
<configuration xmlns="http://logging.apache.org/log4php/">

    <!--Appender logs message to a file-->
    <appender name="default-appender" class="LoggerAppenderFile">
                <!--Layout of the message-->
        <layout class="LoggerLayoutPattern">
            <param name="conversionPattern" value="%date %logger %-5level %msg%n" />
        </layout>
        <param name="file" value="dwh.log" /> <!-- This is the log file-->
        <param name="append" value="true" />
    </appender>

    <!--Logger used for logging-->
    <logger name="main-logger">
        <level value="info" /> <!--Severity level-->
        <appender_ref ref="default-appender" /> <!--Reference to the Appender-->
    </logger>

</configuration>

```

Let's break it down. In this configuration file, we have created an `Appender`
named `default-appender` with the class `LoggerAppenderFile`. This class is used
to log messages to a file. The actual file where the messages will be logged is
specified by the `param` tag that has fields `name` (name of the parameter) and
`value` (value of the parameter). Please note that the file has to be created
before we can log into it.

The actual format of the message is set by the `layout` tag with the
`conversionPattern` parameter that has a `value` specifying the format of the
message. For more format options, please visit the
[official Apache log4php documentation](https://logging.apache.org/log4php/docs/layouts.html).

We have also created `Logger` named `main-logger`. The `level` tag is used to
set the severity level of the `Logger`. Messages with lower severity levels will
be ignored.  Lastly, `appender_ref` tag is used to reference the `Appender` that
will be used to log the message.

### Log4php Log Levels

Log4php recognizes the following severity levels:

- `TRACE`: Finest-grained informational events (Lowest)
- `DEBUG`: Fine-grained informational events that are most useful to debug an
  application
- `INFO`: Informational messages that highlight the progress of the application
  at a coarse-grained level
- `WARN`: Potentially harmful situations which still allow the application to
  continue running
- `ERROR`: Error events that might still allow the application to continue
  running
- `FATAL`: Very severe error events that will presumably lead the application to
  abort (Highest)

## Step 3 — Logging To A File

Now, that we know how the configuration of log4php works we can start logging.
We will start by logging into a file using the configuration file we've created
in the previous step.

Following PHP script shows how logging using log4php works:

    //include autoloader
    require __DIR__ . '/vendor/autoload.php';

    //Set the configuration file
    Logger::configure("config.xml");

    //Create logger
    $logger = Logger::getLogger('main-logger');
    //Log message
    $logger->info("Message to be logged");

In the code above we have set the configuration of the log4php to the
configuration file, we have already created using `Logger::configure()` method.

Then, we have created `Logger` instance `$logger` using `Logger::getLogger()`
method where we have specified the name of the `Logger`. This is the direct
reference to the `Logger` we have created in the configuration file in the step
above.

Lastly, the `info()` method has been called that has sent `INFO` level message
to the `$logger`.

To see if everything went as planned run the script and open the `app.log` file.
The content will look like this:

    Output:
    2021-04-29T11:40:22+02:00 main-logger INFO  Message to be logged

## Step 4 — Logging In Terminal

Changing the logging destination is done by changing `Appenders`. If you want to
log to a file, create a new `Appender` in the configuration file and set him to
log into a file. The same is done when logging into the terminal.

Edit current `Appender` or create a new `Appender` that will have
`LoggerAppenderConsole` class and will look like this:

    <appender name="console-appender" class="LoggerAppenderConsole">
        <layout class="LoggerLayoutSimple" />
    </appender>

Then, change the reference to this `Appender` in the `Logger`.

    <!--Logger used for logging-->
    <logger name="main-logger">
        <level value="info" /> <!--Severity level-->
        <appender_ref ref="console-appender" /> <!--Reference to the Appender-->
    </logger>

This will print the message to the `php://stdout` or `php://stderr` stream, the
former being the default target.

    Output:
    INFO - Message to be logged

## Step 5 — Sending Logs To Email

To send logs to an email, we need a new `Appender` with the class
`LoggerAppenderMail`. Edit current `Appender` or create a new `Appender` that
will look like this:

    <appender name="mail-appender" class="LoggerAppenderMail">
         <layout class="LoggerLayoutSimple" />
         <param name="to" value="webadmin@example.com" />
         <param name="from" value="info@example.com" />
    </appender>

_Note: When working in Windows, make sure that the `SMTP` and `smpt_port` values
in `php.ini` are set to the correct values for your email server (address and
port)._

Don't forget to change the values of the `to` and `from` parameters to the
actual email addresses. Then, change the reference to this `Appender` in the
`Logger`.

    <!--Logger used for logging-->
    <logger name="main-logger">
        <level value="info" /> <!--Severity level-->
        <appender_ref ref="mail-appender" /> <!--Reference to the Appender-->
    </logger>

This will send an email to `webadmin@example.com`. The content of the email will
look like this:

    Output:
    INFO - Message to be logged

This is very useful for severe errors in the application that has to be resolved
immediately.

## Step 6 — Using Multiple Loggers And Appenders

`Loggers` together create an inheritance hierarchy. That means that a `Logger`
can be a child of different `Loggers` and can inherit parents threshold
(severity) level and `Appenders`. `Appender additivity` is a property of loggers
to inherit their parent's `Appenders`. By default all `Loggers` have appender
additivity enabled.

Let's see the example. First, create two `Appenders` for logging into a file.
The first `Appender` will be logging to the `app.log` file and the second
`Appedner` will be logging to the `app_err.log` file. Please note that those
files have to be created manually.

    <!--Appender logs message to a app.log file-->
    <appender name="file-appender-1" class="LoggerAppenderFile">
         <!--Layout of the message-->
         <layout class="LoggerLayoutPattern">
             <param name="conversionPattern" value="%date %logger %-5level %msg%n" />
         </layout>
         <param name="file" value="app.log" /> <!-- This is the log file-->
         <param name="append" value="true" />
    </appender>

    <!--Appender logs message to a app_err.log file-->
    <appender name="file-appender-2" class="LoggerAppenderFile">
         <!--Layout of the message-->
         <layout class="LoggerLayoutPattern">
             <param name="conversionPattern" value="%date %logger %-5level %msg%n" />
         </layout>
         <param name="file" value="app_err.log" /> <!-- This is the log file-->
         <param name="append" value="true" />
    </appender>

Now, we will create a `Logger` hierarchy. This hierarchy will start with the
`root`. Every `Logger` is a child of the `root`.

Then we will create the ` first``Logger `. The `first` will be automatically a
child of the `root`.

Lastly, we create ` first.second``Logger `. By putting `.` dot in the name we
state that the `second` is a child of the `first`. By putting `.` dot in the
name we create an inheritance hierarchy.

If you want to create ` foo``Logger ` that will be a child of the `bar` logger,
name the child ` Logger``bar.foo `.

    <!--Parent root Logger-->
    <root>
        <level value="info" /> <!--Severity level-->
        <appender_ref ref="file-appender-1" /> <!--Reference to the Appender-->
    </root>

    <!--Child of root Logger-->
    <logger name="first">
        <level value="error" /> <!--Severity level-->
        <appender_ref ref="file-appender-2" /> <!--Reference to the Appender-->
    </logger>

    <!--Child of first Logger-->
    <logger name="first.second">
        <level value="fatal" /> <!--Severity level-->
        <appender_ref ref="file-appender-2" /> <!--Reference to the Appender-->
    </logger>

The `first.second` would inherit `Appenders` from its predecessors. But
`first.second` have additivity set to `false`. That means it didn't inherit any
`Appenders` from its parent. On the other hand, `first` have additivity set to
`true` by default. That means it inherited `Appender` from its parent `root`.

For clarity, here are Loggers and their Appenders

- `root` — `file-appender-1`
- `first` — `file-appender-1` (inherited), `file-appender-2`
- `first.second` — `file-appender-2`

Let's test this configuration by running the following script:

    //include autoloader
    require __DIR__ . '/vendor/autoload.php';

    Logger::configure("config.xml");

    //Create logger
    $logger = Logger::getLogger('first.second');
    //Log message
    $logger->fatal("Message to be logged");

    //Create different logger
    $logger = Logger::getLogger('first');
    //Log message
    $logger->error("Message to be logged");

This will add the following entry to the `app.log` file:

    Output:
    2021-04-29T14:20:07+02:00 first ERROR Message to be logged

And the following entry to the `app_err.log` file:

    Output:
    2021-04-29T14:20:07+02:00 first.second FATAL Message to be logged
    2021-04-29T14:20:07+02:00 first ERROR Message to be logged

As you can see, `ERROR` message was sent to both files because ` first``Logger `
has two `Appenders`.

## Step 7 — Formatting Logs (Optional)

Log4php comes whit prebuilt formatting options:

- `LoggerLayoutHTML`: Outputs events in a HTML table
- `LoggerLayoutPattern`: A flexible layout configurable via a pattern string
- `LoggerLayoutSimple`: A simple, non-configurable layout
- `LoggerLayoutSerialized`: Outputs serialized objects
- `LoggerLayoutXML`: Outputs events as an XML document

Here are some examples of Layouts end their outputs:

### LoggerLayoutHTML

Layout code:

    <layout class="LoggerLayoutHtml">
         <param name="locationInfo" value="true" />
    </layout>

HTML output: ![Log4php html output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/00afd2e0-4fef-44c4-097a-69bc5264c600/public =1366x268)

### LoggerLayoutSimple

Layout code:

    <layout class="LoggerLayoutSimple" />


    Output:
    INFO - Message to be logged

### LoggerLayoutPattern

Layout code:

    <layout class="LoggerLayoutPattern">
        <param name="conversionPattern" value="%date %logger %-5level %msg%n" />
    </layout>

For more pattern options, visit the
[official documentation](https://logging.apache.org/log4php/docs/layouts/pattern.html).

    2021-04-29T11:40:22+02:00 main-logger INFO  Message to be logged

## Conclusion

In this tutorial, you learned how to install and use log4php in your PHP
projects. At this point, you can add a log to a file or terminal, you can even
send logs to the email. You can create logging system with multiple Loggers and
Appenders, and change the log format to fit your needs. Now, you have a great
tool to create a powerful logging system in your PHP application.
