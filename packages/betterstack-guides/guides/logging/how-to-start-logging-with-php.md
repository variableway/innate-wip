# How to Get Started with Logging in PHP

Logging is an essential and underutilized practice in software development. It's
obvious value is for debugging, but it can also be a resource for deriving
various analytics and usage information. When you learn how to log properly, you
will be able to adequately track the inner workings of your application so that
troubleshooting becomes much more effortless.

In this article, we will discuss the basics of logging in PHP and explore all
the logging-related configurations you should know. We will begin by discussing
the native logging functions in the language before branching out to examine the
logging solutions developed by other PHP users. Here are some of the other
things you stand to learn by following through with this article:

[summary]
  <ul class="checkmark-list">
    <li>What is logging and examples of what to log.</li>
    <li>Understanding PHP logging configurations.</li>
    <li>Using native logging functions like error_log().</li>
    <li>Why you should opt for a logging framework</li>
    <li>An introduction to the Monolog framework for logging.</li>
  </ul>
[/summary]

## Prerequisites

Ensure to have
[the latest version of PHP](https://www.php.net/manual/en/install.php) installed
on your machine before proceeding with this article. The code snippets and
command output included in the sections below were all tested and confirmed to
be accurate as at PHP v8.x, but they should continue to work with later
versions.

[summary]
### Centralize your PHP logs with Better Stack

[Better Stack](https://betterstack.com/log-management) automatically collects logs from all your PHP applications, provides live tail for real-time debugging, and lets you query logs with SQL to track errors, analyze user behavior, and monitor application health.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="Live tail" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[Start collecting logs for free](https://betterstack.com/users/sign-up).
[/summary]

## What should you log?

Before we discuss how logging works in PHP, let's briefly examine what you
should consider logging when developing your application. Some typical
candidates for what to log include the following:

- Errors and exceptions. Ensure to log every error and exception that occurs in
  your application so that you can find the root cause of an issue and fix them
  quickly.

- Incoming requests. When a request is made to an endpoint in your application,
  you should log that event and include details such as a timestamp, user ID (if
  any), the endpoint and HTTP method, etc. It is also a good idea to generate a
  correlation ID at this point such that all other logging calls following from
  the request will include this ID, making it easier to trace the path of a
  specific client request in the application.

- Any changes to your database, including inserting new data and updating and
  deleting existing data. You should record what data was changed, who changed
  it, and when it occurred.

- Accessing sensitive information. Whenever sensitive or restricted information
  is being accessed on the system, a corresponding log entry should be recorded
  describing who accessed the resource and when.

Logging as much as possible does not mean you should record just anything as
irrelevant entries will create noise and make your logs much less helpful. You
should also take care never to log anything that would compromise user privacy
such as passwords, credit card information, home addresses, phone numbers, or
other Personally Identifiable Information (PII).

## Understanding logging configurations in PHP

PHP saves all its configuration in a `php.ini` file whose location depends on
your operating system and how you installed PHP. Luckily, there is an easy way
to locate the configuration file. Open a new terminal window and run the
following command:

```command
php --ini
```

```text
[output]
Configuration File (php.ini) Path: /opt/homebrew/etc/php/8.1
[highlight]
Loaded Configuration File:         /opt/homebrew/etc/php/8.1/php.ini
[/highlight]
Scan for additional .ini files in: /opt/homebrew/etc/php/8.1/conf.d
Additional .ini files parsed:      /opt/homebrew/etc/php/8.1/conf.d/ext-opcache.ini
```

The highlighted line above describes where to find the relevant `php.ini` file
you need to edit. Copy the path to the file and open it in your text editor:

```command
code <path/to/your/php.ini>
```

This configuration file is enormous, but we only care about a small section.
Scroll down to the "Error handling and logging" section or use your text
editor's search function.

```text
[label php.ini]
. . .
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; Error handling and logging ;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
. . .
```

Let's look at some of the common directives in this section that you need to
note. You can find a complete list of all available directives in the
[official documentation](https://www.php.net/manual/en/ini.list.php). Note that
you'll need to restart your web server after making changes to your php.ini file
for the changes to take effect.

- `error_reporting`: [this directive](https://php.net/error-reporting) configures
  the level of diagnostics that should be recorded, and its value should be an
  [error level constant](https://www.php.net/manual/en/errorfunc.constants.php).
  For example, a value of `E_ALL` (the default) indicates that all diagnostic
  messages will be recorded regardless of their level, while a value of
  `E_ALL & ~E_NOTICE` means that all notice-level messages will be omitted.

![Display errors setting in PHP](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d7ec8257-80c5-443a-6386-e08de9230200/public =1366x471)

- `display_errors`: controls whether PHP should output errors to the screen as
  part of the program's output or if they should be hidden from view. Keeping
  this value `On` is fine in development settings, but it should always be
  turned `Off` in production, or end users may see ugly stack traces on your
  website when an error occurs (see above screenshot).

- `display_startup_errors`: determines whether PHP will output errors that occur
  during its startup sequence. These errors are hidden by default, but you can
  turn them on when debugging.

- `log_errors`: this option configures PHP to log errors to the location
  specified by the `error_log` directive. Setting this to `Off` will disable
  such behavior, but we recommend keeping this option `On`.

- `log_errors_max_len`: restricts the maximum length of each log record to the
  specified value in bytes. The default is `1024` bytes, but setting this option
  to `0` removes the restriction.

- `error_log`: this defines the path to a file where script errors should be
  logged. If this file does not exist, it will be automatically created. You can
  also forward log records to the system log by setting its value to `syslog`.

Aside from configuring these options directly in the `php.ini` file, PHP also
offers a way override them at runtime. This can be useful in a serverless
environment where you don't have access to the configuration file, or when you
are troubleshooting an issue.

You can retrieve the current configuration using the `ini_get()` function as
shown below:

```php
<?php
echo 'log_errors = ' . ini_get('log_errors') . "\n";
?>
```

```text
[output]
log_errors = 1
```

If you wish to override an existing configuration, you can provide a new value
using the `ini_set()` function:

```php
<?php
ini_set('log_errors', 1); // enable error logging
ini_set('error_log', 'app-errors.log' // specify error log file path
?>
```

## Error levels and constants in PHP

In this section, we'll examine one of the more obtuse aspects of PHP logging:
error level constants. They are conceptually similar to [log
levels](https://betterstack.com/community/guides/logging/log-levels-explained/) and are used to distinguish the different types of
diagnostic messages produced when executing a program.

PHP has an unnecessarily complicated system when it comes to log levels. It uses
many different constants to indicate different log levels, and these constants
can be roughly classified into three families:

### 1. `E_` for internal PHP errors

These include the following:

- `E_ERROR`: a fatal error that causes script termination (e.g., calling a
  non-existent function, out of memory, etc.).
- `E_WARNING`: a runtime warning that doesn't terminate script execution (e.g.,
  using an undefined variable in an expression).
- `E_PARSE`: compile-time parse errors, usually syntax errors.
- `E_NOTICE`: runtime notices, meaning PHP encountered something that it thinks
  could be a mistake, but could also be intentional. For instance, using
  unassigned values in your code.

The constants above are used to indicate the severity of any event in your
application, and they are not user-customizable. When something happens, PHP
will automatically create a log record and decide if it is `E_ERROR`,
`E_WARNING`, or `E_NOTICE`. The only thing we can do with these constants is to
use them in the `error_reporting` directive to tell PHP whether or not to log
these errors.

### 2. `E_USER` for application-specific logs

- `E_USER_ERROR`: something went seriously wrong with your project, causing
  services to stop working.
- `E_USER_WARNING`: something abnormal happened, but it doesn't affect the core
  functionalities of your applications, though the situation may need to be
  addressed soon to prevent it from escalating further.
- `E_USER_NOTICE`: informative messages that describe the normal operation of
  the program.

### 3. `LOG_` for system logs

The `LOG_` family conforms to the standard
[syslog severity levels](https://en.wikipedia.org/wiki/Syslog#Severity_level):

- `LOG_EMERG`: the entire application is unusable.
- `LOG_ALERT`: something serious happened that needs to be addressed
  immediately.
- `LOG_CRIT` - a critical function is no longer working.
- `LOG_ERR` - an error occurred, but the application can continue working.
- `LOG_WARNING`: abnormal situations that may later become an error if not
  addressed.
- `LOG_NOTICE`: unusual events but not error conditions.
- `LOG_INFO` - informative messages.
- `LOG_DEBUG`: used to indicate messages helpful for debugging.

## Exploring logging functions in PHP

Now that we've examined the PHP logging configuration and its error constants,
let's get into the nitty-gritty of logging in a PHP project. Several logging
functions ship with PHP, and they all depend on the configurations discussed in
the earlier sections.

To guarantee that you get results consistent with what is described in the
sections below, ensure that your logging configuration matches the following
values:

```text
[label php.ini]
. . .
error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT
display_errors = On
log_errors = On
error_log = error.log
. . .
```

Go to your working directory and create a new `logging.php` file using the
command below. This is where we are going to explore PHP's logging functions
throughout this tutorial.

```command
code logging.php
```

The most basic form of logging involves sending messages to the console. In PHP,
we can easily print to the console using `echo` or `print` statements like this:

```php
[label logging.php]
<?php
echo "This is a log message.\n";

print "This is also a log message.";
?>
```

```text
[output]
This is a log message.

This is also a log message.
```

While `echo` and `print` statements are valuable ways to print some text to the
console, you shouldn't use them for logging as there are much better facilities
for doing so. We will explore some of these functions in detail here.

### The error_log() function

PHP's `error_log()` function pushes a log message to the file path defined in
`error_log` config option. You can also specify a different file path directly
in the function, if you prefer. It can take up to four arguments but only the
first one is required:

```php
error_log(
    string $message,
    int $message_type = 0,
    ?string $destination = null,
    ?string $additional_headers = null
): bool
```

1. The `$message` argument is the log message you wish to record.
2. The `$message_type` argument has a confusing name but it specifies where you
   want PHP to push the message. It has four possible values:
   - `0`: the message is sent to the location specified in the `error_log`
     directive.
   - `1`: the message is pushed through email, which is specified by the
     `$destination` parameter.
   - `3`: the message is appended to the file specified by the `$destination`
     parameter.
   - `4`: the message is sent directly to the Server API (SAPI) logging handler,
     which depends on your platform. For example,
     [Apache's error log](https://httpd.apache.org/docs/current/logs.html#errorlog)
     will be used for LAMP (Linux Apache, MySQL, PHP) setups.
3. The `$destination` parameter specifies where the log message should be sent,
   and it could be an email address or a local file, depending on the value of
   `$message_type`.
4. The `$additional_headers` parameter is only used when `$message_type` is set
   to `1`. It is the same as the `$additional_headers` used in PHP's
   [`mail()`](https://www.php.net/manual/en/function.mail.php) function.

Let's go ahead and use the `error_log()` function to create a log record like
this:

```php
[label logging.php]
<?php
error_log("database not available!");
?>
```

Once you execute this script, you will notice an `error.log` file in the current
directory:

```command
php logging.php
```

```command
ls
```

```text
[output]
error.log logging.php
```

Examine the contents of the `error.log` file through the `cat` command as shown
below:

```command
cat error.log
```

```text
[output]
[27-Jul-2022 16:05:49 America/New_York] database not available!
```

As you can see, the `error_log()` function automatically includes a timestamp
which is one reason why using a dedicated logging function is better than `echo`
and `print` statements.

You can also record a log entry into a different file by changing the
`$message_type` and `$destination` parameters as shown below:

```php
[label logging.php]
. . .
error_log("database not available!", 3, "my-errors.log");
```

Save the changes and execute the `logging.php` file again.

```command
php logging.php
```

This time, the log entry will be sent to the `my-errors.log` file:

```command
cat my-errors.log
```

```text
[label my-errors.log]
database not available!
```

Notice that a timestamp is not included in the above entry! This is because the
method bypasses the operating system's logging mechanism leading to less
detailed logs. A better way to log to a different file is by using the
`ini_set()` function discussed earlier:

```php
[label logging.php]
<?php
. . .
ini_set("error_log", "my-errors.log");
error_log("database not available!");
?>
```

This example will produce the same result, but with the timestamp included:

```text
[label my-errors.log]
[27-Jul-2022 17:38:04 America/New_York] database not available!
```

### The trigger_error() function

The `trigger_error()` function is used to record application-specific errors,
warnings and notices. It takes two parameters: the first one is the log message,
and the second one defines its error level (one of `E_USER_ERROR`,
`E_USER_WARNING`, `E_USER_NOTICE`, or `E_USER_DEPRECATED`):

```php
[label logging.php]
<?php
trigger_error("A user requested a resource.", E_USER_NOTICE);
trigger_error("The image failed to load!", E_USER_WARNING);
trigger_error("User requested a profile that doesn't exist!", E_USER_ERROR);
?>
```

When you execute the script above, you will observe the following console
output:

```text
[output]
Notice:  A user requested a resource. in /home/eric/test/logging.php on line 2
Warning:  The image failed to load! in /home/eric/test/logging.php on line 3
Fatal error:  User requested a profile that doesn't exist! in /home/eric/test/logging.php on line 4
```

The above logs are also recorded to the `error.log` file in a slightly different
format:

```command
cat error.log
```

```text
[output]
[8-Jul-2022 22:11:43 America/New_York] PHP Notice:  A user requested a service. in /home/eric/test/logging.php on line 3
[8-Jul-2022 22:11:43 America/New_York] PHP Warning:  The image failed to load! in /home/eric/test/logging.php on line 4
[8-Jul-2022 22:11:43 America/New_York] PHP Fatal error:  User requested a profile that doesn't exist! in /home/eric/test/logging.php on line 5
```

Each log entry specifies the corresponding log level and the location of the log
message. If you don't use a user-assigned error level constant (prefixed with
`E_USER_`), an error will be thrown.

```php
<?php
trigger_error("A user requested a service.", E_ERROR);
?>
```

```text
[output]
Fatal error: Uncaught ValueError: trigger_error(): Argument #2 ($error_level) must be one of E_USER_ERROR, E_USER_WARNING, E_USER_NOTICE, or E_USER_DEPRECATED in /home/ayo/dev/betterstack/betterstack-community/demo/logging-php/logging.php:2
Stack trace:
#0 /home/ayo/dev/betterstack/betterstack-community/demo/logging-php/logging.php(2): trigger_error()
#1 {main}
  thrown in /home/ayo/dev/betterstack/betterstack-community/demo/logging-php/logging.php on line 2
```

### Logging to the system log

A third way to log messages in PHP is using the `syslog()` function. It sends
the log message to the default system log like this:

```php
syslog(LOG_ERR, "Custom error message");
```

The first argument to `syslog()` is the appropriate log level constant, and the
second is the log message to be recorded. Notice that when specifying the log
level, the third group of constants (those prefixed with `LOG_`) are utilized.
These constants are unique to the `syslog()` function, and they are all listed
[in its documentation](https://www.php.net/manual/en/function.syslog).

Here are a few ways to view your system log:

- On Linux, use one of the following commands to access the system log
  (depending on the specific OS):

```command
tail -f /var/log/syslog
```

```command
tail -f /var/log/messages
```

```command
journalctl -f
```

- On macOS, run `tail -f /var/log/system.log` in your terminal.
- On Windows, use the
  [Windows Event Viewer](https://www.windowscentral.com/how-use-event-viewer-windows-10).

Here's some sample output from the system log on a Linux-based OS after
executing the previous code snippet:

```text
[output]
Jul 27 20:58:28 fedora php[485047]: Custom error message
```

You can customize the output above through the `openlog()` function. It opens a
connection to the system logger and takes up to three arguments: a string prefix
to be added to each message, the logging options, and the logging facility.
After calling `openlog()`, you should call `closelog()` to close the connection.

```php
openlog("MyAppPrefix", LOG_PID | LOG_PERROR,LOG_USER);
syslog(LOG_ERR, "Custom error message");
closelog();
```

Here's the output after executing the script above:

```text
[output]
Jul 28 09:20:04 fedora MyAppPrefix[596277]: Custom error message
```

You can learn more about [system logs on
Linux](https://betterstack.com/community/guides/logging/how-to-view-and-configure-linux-logs-on-ubuntu-20-04/) by reading our
detailed tutorial on the subject.

[summary]
### Query PHP logs with SQL

[Better Stack](https://betterstack.com/log-management) lets you query millions of PHP log entries with SQL for advanced analysis. Find error patterns, track slow database queries, or analyze user sessions—all with standard SQL syntax you already know.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/kf97nwgL88M" title="Building charts with SQL" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Transform PHP logs into actionable insights with sub-second query performance across petabytes of data.

[Try SQL queries free](https://betterstack.com/users/sign-up).
[/summary]

## Why you should use a logging framework

Using PHP's built-in logging functions is an easy way to get started with
logging in simple projects, but they are insufficient for creating a robust
logging strategy in serious applications due to their lack of features and
flexibility, such as customizing the formatting of your logs, or determining how
they are recorded. They also cannot capture a wide variety of data types since
everything fed into them must be a string, which means you have to do extra work
to capture contextual data in a log entry.

These limitations are why [third-party logging frameworks](https://betterstack.com/community/guides/logging/logging-framework/)
are prevalent in the PHP ecosystem. Here are some of the [most popular logging
libraries for PHP](https://betterstack.com/community/guides/logging/best-php-logging-libraries/) that are worth exploring for production-grade applications:

- [Monolog](https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/): Monolog is the most popular PHP
  logging framework out there. It has dozens of handlers that can send your log
  records to files, emails, databases, Slack, etc. It is also packed with
  multiple formatters that allow you to customize your logs however you want.
- [Analog](https://github.com/jbroadway/analog): Analog is a minimal logging
  library. It also has several handlers that can send your logs to different
  destinations. However, it does not have optional features such as formatters
  and processors.
- [KLogger](https://github.com/katzgrau/KLogger): Unlike Analog, KLogger goes in
  a different direction. It can only push your logs to a file, but it has many
  different formatters that you can use to customize the timestamp, file name,
  file extension, context information, etc.

In the next section, we will briefly examine how to implement logging using the
Monolog library as it's the most popular and satisfactorily meets all our
[criteria for a good logging framework](https://betterstack.com/community/guides/logging/logging-framework/).

## Getting started with Monolog

To use Monolog in your PHP application, you need to install the library through
[PHP Composer](https://getcomposer.org/):

```command
composer require monolog/monolog
```

```text
[output]
. . .
Package operations: 2 installs, 0 updates, 0 removals
  - Installing psr/log (3.0.0): Extracting archive
  [highlight]
  - Installing monolog/monolog (3.1.0): Extracting archive
  [/highlight]
11 package suggestions were added by new dependencies, use `composer suggest` to see details.
Generating autoload files
1 package you are using is looking for funding.
Use the `composer fund` command to find out more!
```

This command will install Monolog into the `vendor` directory, and you can
import the package into your project like this:

```php
[label logging.php]
<?php

require __DIR__."/vendor/autoload.php"; // This tells PHP where to find the autoload file so that PHP can load the installed packages

use Monolog\Logger; // The Logger instance
use Monolog\Handler\StreamHandler; // The StreamHandler sends log messages to a file on your disk
use Monolog\Level; // Log levels
?>
```

The three classes we imported into the file above represent Monolog's most
important concepts. First, logging in Monolog is channel-based, and the `Logger`
instance is used to initialize a new log channel which provides a mechanism for
grouping different logs. For example, you can have an `errors` channel that
records errors, a `performance` channel that logs performance-related messages,
and so on. You can organize this system however you like depending on what kind
of application you are building.

Each log channel can be assigned multiple handlers, and they are responsible for
sending log messages to various destinations. For example, the `StreamHandler`
above can push your messages to the console or a local file.

Finally, each handler needs to have a minimum log level, which defines the
minimum level a message must have to be logged by the handler. Monolog provides
a more standard way of dealing with log levels than PHP's error level constants.
There are eight different levels available in Monolog, and they are modeled
after the
[Syslog severity levels](https://datatracker.ietf.org/doc/html/rfc5424)
discussed earlier:

- EMERGENCY
- ALERT
- CRITICAL
- ERROR
- WARNING
- NOTICE
- INFO
- DEBUG

## Logging in PHP with Monolog

Let's look at an example of how to log messages to the console with Monolog:

```php
[label logging.php]
<?php
. . .
// New Logger instance. Create a new channel called "my_logger".
$logger = new Logger("my_logger");

// Create a new handler. In this case, it is the StreamHandler, which will send the log messages to the console.
$stream_handler = new StreamHandler("php://stdout", Level::Debug);

// Push the handler to the log channel
$logger->pushHandler($stream_handler);

// Log the message
$logger->debug("This is a debug message.");
$logger->info("This is an info message.");
$logger->error("This is an error message.");
$logger->critical("This is a critical message.");
?>
```

Execute the `logging.php` file, and observe the following output:

```text
[output]
[2022-07-11T03:32:57.111007+02:00] my_logger.DEBUG: This is a debug message. [] []
[2022-07-11T03:32:57.111750+02:00] my_logger.INFO: This is an info message. [] []
[2022-07-11T03:32:57.111941+02:00] my_logger.ERROR: This is an error message. [] []
[2022-07-11T03:32:57.112127+02:00] my_logger.CRITICAL: This is a critical message. [] []
```

In this example, a new log channel called `my_logger` was initialized using the
`Logger` instance, and then a `StreamHandler()` instance was assigned to it.
This handler was setup to log debug-level messages or higher to the standard
output (represented by `php://stdout`).

Lastly, several log messages are recorded by using the `debug()`, `info()`,
`error()`, and `critical()` methods which give the message the corresponding log
level that is observed in the output. Notice that a timestamp is also included
with each entry.

Instead of logging to the terminal console, we can also push the log record to a
local file using the `StreamHandler()`. All we need to do is change the
destination parameter like this:

```php
[label logging.php]
<?php
. . .

$logger = new Logger("my_logger");

[highlight]
$stream_handler = new StreamHandler(__DIR__ . "/log/debug.log", Level::Debug);
[/highlight]

$logger->pushHandler($stream_handler);

$logger->debug("This is a debug message.");
?>
```

This causes log messages using the `$logger` channel to be sent to a
`/log/debug.log` file. You can examine its contents with the following command:

```command
cat ./log/debug.log
```

```text
[output]
[2022-07-10T01:53:24.848775+02:00] my_logger.DEBUG: This is a debug message. [] []
```

There are many other handlers other than the `StreamHandler` demonstrated above,
so ensure to read [our detailed guide on
Monolog](https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/) to learn more about them and how to
create a custom handler.

## Formatting your logs

From the examples above, you will observe that all the log records follow a
predefined format. They all start with a timestamp, followed by the log level,
message, context and extra information. This format might not fit your needs
when creating a logging system, so Monolog provides several formatters that you
can use to customize the log records.

One of the useful formatters to look at is the `LineFormatter`. It takes a log
record as input, and subsequently outputs a formatted string of the record.
Let's take a look at an example:

```php
[label logging.php]
. . .
use Monolog\Level;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
[highlight]
use Monolog\Formatter\LineFormatter;
[/highlight]

$logger = new Logger("my_logger");

$stream_handler = new StreamHandler("php://stdout", Level::Debug);
[highlight]
$output = "%level_name% | %datetime% > %message% | %context% %extra%\n";
$stream_handler->setFormatter(new LineFormatter($output));
[/highlight]

$logger->pushHandler($stream_handler);

$logger->debug("This file has been executed.");
?>
```

In this case, we are making Monolog return a log record that starts with the log
level, then the date, message, and context information.

```text
[output]
DEBUG | 2022-07-10T21:33:51.345896+02:00 > This file has been executed. | [] []
```

Besides rearranging the different segments, it is also possible for us to
customize the timestamp output, since the default format isn't very human
readable.

```php
[label logging.php]
<?php
. . .
[highlight]
$dateFormat = "Y-n-j, g:i a";
[/highlight]
$output = "%level_name% | %datetime% > %message% | %context% %extra%\n";
$stream_handler->setFormatter(new LineFormatter($output, $dateFormat));
. . .
?>
```

```text
[output]
DEBUG | 2022-7-10, 10:24 pm > This file has been executed. | [] []
```

In a production environment, your application will probably generate tons of
logs, and in this case, it is best to use a [structured logging
format](https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog#using-a-structured-log-format-json)
that is better suited to parsing by automated logging tools. Using Monolog's
`JsonFormatter`, you are able to log in JSON format, making it easier for
machines to read.

```php
[label logging.php]
<?php

require __DIR__ . "/vendor/autoload.php";

use Monolog\Level;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Formatter\JsonFormatter;

$logger = new Logger("daily");

$stream_handler = new StreamHandler("php://stdout", Level::Debug);
$logger->pushHandler($stream_handler);
[highlight]
$stream_handler->setFormatter(new JsonFormatter());
[/highlight]

$logger->debug("This is a debug message.");
```

```text
[output]
{"message":"This is a debug message.","context":{},"level":100,"level_name":"DEBUG","channel":"daily","datetime":"2022-07-29T21:43:30.910327+02:00","extra":{}}
```

Notice that the log message, the log level, the timestamp, and so on have all
been turned into JSON data.

You can learn more about formatters in Monolog and their available options by
reading their
[documentation](https://github.com/Seldaek/monolog/blob/main/doc/02-handlers-formatters-processors.md#formatters).


[summary]
### Visualize PHP application metrics

Beyond storing Monolog logs, [Better Stack](https://betterstack.com/infrastructure-monitoring) helps you visualize PHP performance metrics. Build dashboards to track error rates, response times, memory usage, and database query performance across all your PHP applications.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="Introduction to dashboards" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Convert logs to metrics automatically and monitor application health with custom dashboards using drag-and-drop builders or SQL.

[Create dashboards free](https://betterstack.com/users/sign-up).
[/summary]

## Final thoughts

We covered a lot of ground in this article, beginning with PHP's native logging
functions and their quirks and features before briefly discussing logging
frameworks and why you need one. We also introduced Monolog, a logging library
for PHP application and demonstrated some of its basic features that help you
create a more useful logging system. There's a lot more about Monolog that can't
be covered here so we recommend diving into our detailed guide to [logging with
Monolog](https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/) to get a full picture of what you
can do with it.

Thanks for reading, and happy logging!
