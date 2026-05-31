# How to Get Started with Monolog Logging in PHP

[Monolog](https://github.com/Seldaek/monolog) is the de-facto standard for
logging in PHP applications. It is the default logging library for the most
popular PHP frameworks such as [Laravel](https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/) and
Symfony, and it comes with [all the features a logging library is expected to
have](https://betterstack.com/community/guides/logging/logging-framework/). It provides several handlers that can send your logs
to various destinations, processors that can add contextual information to your
log records, and formatters that allow you to customize your log entries to your
heart's content.

The Monolog library essentially allows you to take a peek inside your PHP
application, and quickly troubleshoot your app if something goes wrong. In this
article, we will show you how to create a logging strategy with Monolog and how
to use it to perform some of the following common logging tasks:

[summary]

  <ul class="checkmark-list">
    <li>Sending log entries to the console and local files.</li>
    <li>Rotating log files.</li>
    <li>Understanding log levels and creating a log stack with log levels</li>
    <li>Adding contextual information to your logs.</li>
    <li>Customizing log messages using formatters and processors.</li>
    <li>Using a structured logging format like JSON.</li>
  </ul>
[/summary]

## Prerequisites

Before proceeding with the rest of this tutorial, ensure that
[PHP](https://www.php.net/) (v8.0 and above) and
[Composer](https://getcomposer.org/) (latest) are installed on your computer. It
is also helpful if you are familiar with the basic concepts of [logging in
PHP](https://betterstack.com/community/guides/logging/how-to-start-logging-with-php/) though its not required to follow through
with this article.

[summary]

## Side note: Ship your Monolog logs to Better Stack for production monitoring

Once your PHP application starts generating logs with Monolog, [Better Stack](https://betterstack.com/logs) gives you powerful querying, real-time tail, and beautiful dashboards to monitor your applications in production.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Getting started with Monolog

Let's start by initializing a new PHP project and installing Monolog inside.
Please run the commands below to create a new directory on your computer, and
install Monolog therein:

```command
mkdir monolog-example
```

```command
cd monolog-example
```

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

The above command installs Monolog into the `vendor` directory, and
automatically generates the package management files: `composer.json` and
`composer.lock`.

Next, create a new `index.php` file in the current directory for trying out the
features of Monolog that will be discussed in this article:

```command
code index.php
```

Go ahead and paste the following code into the file:

```php
[label index.php]
<?php

require __DIR__."/vendor/autoload.php"; // This tells PHP where to find the autoload file so that PHP can load the installed packages

use Monolog\Logger; // The Logger instance
use Monolog\Handler\StreamHandler; // The StreamHandler sends log messages to a file on your disk
?>
```

Notice the two classes imported into the `index.php` file above. The first one
is `Logger` for defining log channels, a mechanism for classifying your logs by
type or service. For example, you could have a `security` channel that logs all
security-related entries to a specific location, or a channel that only records
log entries from a particular module or service in your application. This lets
you quickly filter your logs by channel or transport them to different locations
as you see fit.

The second class imported to the file is `StreamHandler` which is responsible
for sending log messages to the console, a local file, or any other PHP stream.

## Sending a log message

In this section, we'll demonstrate how to use the `Logger` and the
`StreamHandler` to log messages to the standard output. The first step is to
create a log channel and hook it up to a handler instance like this:

```php
[label index.php]
<?php
. . .

$logger = new Logger("daily");

$stream_handler = new StreamHandler("php://stdout");
$logger->pushHandler($stream_handler);

$logger->debug("This file has been executed.");
?>
```

In the snippet above, a new log channel called `daily` is created using the
`Logger` class , and a `StreamHandler` instance that logs to the standard output
(indicated by the `php://stdout` argument) is assigned to `$stream_handler`
which is subsequently connected to the `$logger`. Finally, we use the `debug()`
method on the logger is used to write a log message to the configured channel.

Execute the `index.php` file with the following command:

```command
php index.php
```

You should observe the following output:

```text
[output]
[2022-07-12T01:01:11.444566+02:00] daily.DEBUG: This file has been executed. [] []
```

Notice that this output has a few sections:

- The date and time (`[2022-07-12T01:01:11.444566+02:00]`),
- The log channel followed by the log level (`daily.DEBUG`),
- The actual log message (`This file has been executed.`),
- Some extra information (`[] []`). They are empty now, but we'll demonstrate
  how to fill them later.

## Understanding log levels in Monolog

An essential logging concept that must be understood and used always is the [log
level](https://betterstack.com/community/guides/logging/log-levels-explained/). It is an indicator of the severity of a log
message. For example, the `DEBUG` level above is used for log messages intended
for use by developers when debugging. It is automatically included in all log
entries produced by the `debug()` method.

The Monolog library follows the
[RFC 5424 standard](https://datatracker.ietf.org/doc/html/rfc5424) , which
specifies that any logging system must have eight log levels, as listed below
(in decreasing order of severity):

- `emergency`: means the application is unusable, and the issue needs to be
  addressed immediately.
- `alert`: similar to `emergency` but less severe.
- `critical`: something is wrong with your application and the problem is
  affecting the application's services.
- `error`: similar to `critical`, but less severe.
- `warning`: indicates an event that is unusual but does not represent an error.
- `notice`: similar to `warning` but less severe.
- `info`: informational messages that describe normal operation of the
  application.
- `debug`: used by developers to record some debugging messages that could be
  useful when troubleshooting.

In the list above, `debug` is the least urgent, and `emergency` is the most
pressing. We can assign these log levels to log messages using the following
methods on a log channel:

```php
[label index.php]
<?php

. . .

$logger->debug("This is a debug message.");
$logger->info("This is an info level message.");
$logger->notice("This is a notice level message.");
$logger->warning("This is a warning level message.");
$logger->error("This is an error level message.");
$logger->critical("This is a critical level message.");
$logger->alert("This is an alert level message.");
$logger->emergency("This is an emergency level message.");
?>
```

Run the `index.php` file again to inspect the output. Notice that all the
messages were logged to the console with their respective levels included.

```text
[output]
[2022-07-12T01:36:14.873269+02:00] daily.DEBUG: This is a debug message. [] []
[2022-07-12T01:36:14.874132+02:00] daily.INFO: This is an info level message. [] []
[2022-07-12T01:36:14.874320+02:00] daily.NOTICE: This is a notice level message. [] []
[2022-07-12T01:36:14.874551+02:00] daily.WARNING: This is a warning level message. [] []
[2022-07-12T01:36:14.874788+02:00] daily.ERROR: This is an error level message. [] []
[2022-07-12T01:36:14.874888+02:00] daily.CRITICAL: This is a critical level message. [] []
[2022-07-12T01:36:14.874981+02:00] daily.ALERT: This is an alert level message. [] []
[2022-07-12T01:36:14.875060+02:00] daily.EMERGENCY: This is an emergency level message. [] []
```

We can also use log levels to control the amount of logs produced by a channel.
This is done by setting a minimum level on the handler so that all messages set
to a level lower than the configured minimum will be ignored. Here's an example
that should make this concept clearer:

```php
<?php

require __DIR__ . "/vendor/autoload.php";

[highlight]
use Monolog\Level;
[/highlight]
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

$logger = new Logger("daily");

[highlight]
$stream_handler = new StreamHandler("php://stdout", Level::Error);
[/highlight]

$logger->pushHandler($stream_handler);

$logger->debug("This is a debug message.");
$logger->info("This is an info level message.");
$logger->notice("This is a notice level message.");
$logger->warning("This is a warning level message.");
$logger->error("This is an error level message.");
$logger->critical("This is a critical level message.");
$logger->alert("This is an alert level message.");
$logger->emergency("This is an emergency level message.");
?>
```

In the above snippet, the `Level` class is imported and used on the
`$stream_handler` to set the minimum level to `Error` so that the channel
produces only messages with error severity or greater. When you execute the
`index.php` file once again, you will observe the output below showing that all
levels below `error` are excluded:

```txt
[output]
[2022-07-12T01:37:08.729242+02:00] daily.ERROR: This is an error level message. [] []
[2022-07-12T01:37:08.730200+02:00] daily.CRITICAL: This is a critical level message. [] []
[2022-07-12T01:37:08.730475+02:00] daily.ALERT: This is an alert level message. [] []
[2022-07-12T01:37:08.730587+02:00] daily.EMERGENCY: This is an emergency level message. [] []
```

If a minimum log level is not set for a handler, Monolog will default to the
`debug` level, which means that handler will log all messages. You can [read our
guide to log levels](https://betterstack.com/community/guides/logging/log-levels-explained/) to learn more about how to utilize
them in your application.

## Formatting your log messages

In this section, we'll discuss how to take advantage of Monolog's built-in
formatters to customize the appearance of your log entries. A log message has
the format shown below by default. It always starts with the date and time,
followed by the log channel and log level, and then the message, context, and
some extra information.

```text
[%datetime%] %channel%.%level_name%: %message% %context% %extra%\n
```

We can change that format by attaching a formatter to the handler like this:

```php
[label index.php]
<?php

require __DIR__ . "/vendor/autoload.php";

. . .
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

$logger->debug("This file has been executed")
?>
```

Run the `index.php` file again, and you will get log messages in a different
slightly format.

```text
[output]
DEBUG | 2022-07-10T21:33:51.345896+02:00 > This file has been executed. | [] []
```

The `LineFormatter` is one of many available built-in formatters in Monolog. It
is the one used by default if no formatters are defined, but you can import it
and customize it as demonstrated in the previous code snippet. You can also
change its other options as shown below:

```php
$output = "%level_name% | %datetime% > %message% | %context% %extra%\n";
$dateFormat = "Y-n-j, g:i a";

$formatter = new LineFormatter(
    $output, // Format of message in log
    $dateFormat, // Datetime format
    true, // allowInlineLineBreaks option, default false
    true  // discard empty Square brackets in the end, default false
);
```

With such configuration, the output from the `$logger` now looks like this:

```text
[output]
DEBUG | 2022-8-1, 12:30 pm > This file has been executed |
```

## Adding contextual data to your logs

In the examples above, the `%context` and `%extra` variables are empty and
represented by empty arrays `[]` by default. This is because `LineFormatter`
tries to JSON encode the contents of both variables resulting in an empty array
if no values are found. In this section we'll discuss how to add contextual data
to your logs such that extra information that is relevant to the log message is
also included in the entry. Such data can subsequently be used to identify
issues, filter logs, or generate metrics.

To attach contextual data to a log entry in Monolog, specify a second argument
to a level method as shown below:

```php
[label index.php]
<?php
. . .
// Ask for user input
$user = readline('Please enter your name: ');

$logger = new Logger("my_logger");
$stream_handler = new StreamHandler("php://stdout", Level::Debug)
$logger->pushHandler($stream_handler);

[highlight]
$logger->debug("This file has been executed.", ["user" => $user]);
[/highlight]
?>
```

You will observe the following output:

```text
[output]
[2022-08-01T13:49:34.144911+00:00] my_logger.DEBUG: This file has been executed {"user":"Eric"} []
```

As you can see, the context data fills the first empty array placeholder, but
what about that second placeholder? It is reserved for Monolog's processors,
which allows us to add extra information to all the log entries sent to a
channel. There are several built-in processors available for use in Monolog. For
example, the `WebProcessor` can be used to add the current request URI, request
method, and client IP to a log record, and the `HostnameProcessor` can be used
to add the current hostname to a log record.

```php
[label index.php]
<?php
. . .
$logger = new Logger("my_logger");

[highlight]
$logger->pushProcessor(new \Monolog\Processor\ProcessIdProcessor());
$logger->pushProcessor(new \Monolog\Processor\GitProcessor());
$logger->pushProcessor(new \Monolog\Processor\MemoryUsageProcessor());
[/highlight]
. . .
?>
```

```text
[output]
[2022-08-01T17:48:41.743689+00:00] my_logger.DEBUG: This file has been executed {"user":"Eric"} {"memory_usage":"2 MB","git":{"branch":"master","commit":"430064a2157bd3ec484bf5ec3be4ed69dd3b68c3"},"process_id":1472185}
```

In this example, `ProcessIdProcessor` to add the process id of the script,
`GitProcessor` adds the current git branch and the commit hash, and
`MemoryUsageProcessor` records the application's memory usage.

![Screenshot of Logtail showing context in log
entry](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0d2ef6db-c625-447a-9f51-5f858fe7c900/public =1175x768)

You can also use a custom function as a processor for outputting custom
information to the `extra` field like this:

```php
[label index.php]
<?php
. . .
$user = readline('Please enter your name: ');

$logger = new Logger("my_logger");
[highlight]
$logger->pushProcessor(function ($record) use ($user) {
    $record->extra["user"] = $user;

    return $record;
});
[/highlight]
$stream_handler = new StreamHandler("php://stdout", Level::Debug)
$logger->pushHandler($stream_handler);

$logger->info("This file has been executed.");
?>
```

We defined a custom processor in the highlighted section that adds the user's
name to the `extra` field under the `user` key. Here's the expected output after
executing the script:

```text
[output]
[2022-08-01T18:00:02.603380+00:00] my_logger.INFO: This file has been executed. [] {"user":"Eric"}
```

Notice that the second placeholder that gets filled this time around while the
first remains empty. You can find other built-in processors in Monolog by
reading through its
[documentation](https://github.com/Seldaek/monolog/blob/main/doc/02-handlers-formatters-processors.md).

## Using a structured log format (JSON)

Monolog supports several other formatters besides the `LineFormatter`. One you
might find especially useful is the `JSONFormatter` which is used to output log
entries in JSON format. This is useful when adopting structured logging in your
application which is generally accepted as a best practice for logging
production applications since it allows logging tools to automatically and
efficiently parse, search and retrieve logs.

The JSON format is the most popular structured format for logging in production
applications, so we will demonstrate how to use Monolog's `JSONFormatter` to
implement structured logging in PHP. Here's how to use it:

```php
[label index.php]
<?php

require __DIR__."/vendor/autoload.php"; // This tells PHP where to find the autoload file so that PHP can load the installed packages

use Monolog\Level; // The StreamHandler sends log messages to a file on your disk
[highlight]
use Monolog\Formatter\JsonFormatter;
[/highlight]
use Monolog\Logger; // The Logger instance
use Monolog\Handler\StreamHandler; // The StreamHandler sends log messages to a file on your disk

$user = readline('Please enter your name: ');

$logger = new Logger("my_logger");

$stream_handler = new StreamHandler("php://stdout", Level::Debug);

[highlight]
$formatter = new JsonFormatter();

$stream_handler->setFormatter($formatter);
[/highlight]

$logger->pushHandler($stream_handler);

$logger->info("This file has been executed.", ["user" => $user]);
?>
```

With such configuration in place, the entire output will be in JSON format:

```json
[output]
{"message":"This file has been executed.","context":{"user":"Eric"},"level":200,"level_name":"INFO","channel":"my_logger","datetime":"2022-08-02T11:08:15.832930+00:00","extra":{}}
```

[ad-logs]

## Sending logs to a file

The ability to store logs in one or more files is a prominent feature in many
logging frameworks and Monolog is not exempt. We can use its `StreamHandler`
class to log to a file instead of the console by changing the destination
argument like this:

```php
[label index.php]
<?php
. . .
$stream_handler = new StreamHandler(__DIR__ . "/log/debug.log", Level::Debug);
. . .
?>
```

The first argument to `StreamHandler` changes from `php://stdout` to
`__DIR__ . "/log/debug.log"`, which points to a local file. The file path does
not have to exist beforehand, as it will be created for you if not found. When
you execute the script, the log entries will be placed in a `log/debug.log` file
which can be inspected by executing the command below:

```command
cat log/debug.log
```

```json
[output]
{"message":"This file has been executed.","context":{"user":"Eric"},"level":200,"level_name":"INFO","channel":"my_logger","datetime":"2022-08-02T11:17:19.901245+00:00","extra":{}}
```

### Rotating log files with Monolog

The main problem when logging into a file is that, over time, the file can
become too large and cumbersome to manage while taking up huge amounts of
storage. This problem is traditionally solved by [log
rotation](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/), and we
recommend reading the linked article to learn how to use `logrotate` on Linux to
solve this problem.

Monolog also offers a built-in solution for rotating logs, although it is not
intended for use in production environments. We'll cover it briefly here so you
can understand what it does if you see it in the wild, but we generally
recommend combining `StreamHandler` with the external `logrotate` program to
handle such concerns.

```php
[label index.php]
<?php

. . .
[highlight]
use Monolog\Handler\RotatingFileHandler;
[/highlight]


[highlight]
$rotating_handler = new RotatingFileHandler(__DIR__ . "/log/debug.log", 30, Level::Debug);
$logger->pushHandler($rotating_handler);
[/highlight]

$logger->info("This file has been executed.");
?>
```

In the snippet above, `StreamHandler` is replaced with `RotatingFileHandler`
which automatically splits the log files based on the current date. It also
automatically deletes log files older than 30 days (2nd argument) so that older
irrelevant logs don't continue to take up valuable space on the server.

When you execute the script above, a new file will be created in the `log`
directory corresponding to this format: `debug-<current date>.log`. For example:

```command
php index.php
```

Take a look inside the `log` directory:

```command
ls log
```

```text
[output]
debug-2022-08-02.log
```

```command
cat log/debug-2022-08-02.log
```

```json
[output]
{"message":"This file has been executed.","context":{"user":"Eric"},"level":200,"level_name":"INFO","channel":"my_logger","datetime":"2022-08-02T11:32:00.489995+00:00","extra":{}}
```

In a production environment, you are probably dealing with a considerable amount
of information, and Monolog's `RotatingFileHandler` isn't designed to handle
such volume, so it is recommended to use
[logrotate](https://linux.die.net/man/8/logrotate) instead. You can read [this
article to learn more about
logrotate](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/).

## Creating custom handlers in Monolog

If you cannot find a handler suitable for your project, Monolog also allows you
to write a custom one through the `HandlerInterface`. To demonstrate how it
works, let's create another file called `DBHandler.php`. We'll create a custom
handler that writes to a SQL database here:

```command
code DBHandler.php
```

```php
[label DBHandler.php]
<?php

use Monolog\Level;
use Monolog\Logger;
use Monolog\LogRecord;
use Monolog\Handler\AbstractProcessingHandler;

class DBHandler extends AbstractProcessingHandler
{
    private bool $initialized = false;
    private PDO $pdo;
    private PDOStatement $statement;

    public function __construct(PDO $pdo, int|string|Level $level = Level::Debug, bool $bubble = true)
    {
        $this->pdo = $pdo;
        parent::__construct($level, $bubble);
    }

    protected function write(LogRecord $record): void
    {
        if (!$this->initialized) {
            $this->initialize();
        }

        $this->statement->execute(array(
            'channel' => $record->channel,
            'level' => $record->level->getName(),
            'message' => $record->formatted,
            'time' => $record->datetime->format('U'),
        ));
    }

    private function initialize()
    {
        $this->pdo->exec(
            'CREATE TABLE IF NOT EXISTS monolog '
            .'(channel VARCHAR(255), level INTEGER, message LONGTEXT, time INTEGER UNSIGNED)'
        );
        $this->statement = $this->pdo->prepare(
            'INSERT INTO monolog (channel, level, message, time) VALUES (:channel, :level, :message, :time)'
        );

        $this->initialized = true;
    }
}
?>
```

Notice that we are extending the `AbstractProcessingHandler` class, which
provides some basic handler structure and access to processors and formatters.
We can use this newly created `DBHandler` in our code by importing it into the
`index.php` file as follows:

```php
[label index.php]
<?php

[highlight]
require "./DBHandler.php";
[/highlight]

. . .

$db_handler = new DBHandler(new PDO('sqlite:debug.sqlite'));
$logger->pushHandler($db_handler);
$logger->debug("This file has been executed.");
?>
```

When you execute the file, a SQLite database will be created in the root
directory, and the log message will be written therein.

![Write to SQLite Database](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/905aace9-6917-4447-40cf-3c4054d95400/public =1366x181)

## Catching and logging exceptions

In PHP, exceptions are handled by `try`, `catch`, and `finally` blocks. The
`try` block is the code we wish to execute, and if something goes wrong, we can
throw an exception. The `catch` block specifies how we can respond to the
exception, and usually where we log the error. The `finally` block will always
execute the code in its boundaries regardless of whether an exception was thrown
or not.

The following example shows a basic exception handling strategy for a piece of
code that prompts for a username and throws an exception if it has less than six
characters. The `catch` block will capture the exception object and make it
accessible through the `$e` parameter. You can access various properties on the
exception by calling any of the
[methods listed here](https://www.php.net/manual/en/class.exception.php). For
example, you can access its message property using the `getMessage()` method:

```php
[label logging.php]
<?php

require __DIR__ . "/vendor/autoload.php";

use Monolog\Level;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Formatter\JsonFormatter;

$logger = new Logger("exceptions");

$stream_handler = new StreamHandler(__DIR__ . "/log/exception.log", Level::Debug);
$stream_handler->setFormatter(new JsonFormatter());

$logger->pushHandler($stream_handler);

try {
    $username = readline("Choose your username: ");
    if (strlen($username) < 6) {
        throw new Exception("The username $username is too short.");
    }
} catch (exception $e) {
    $logger->error($e->getMessage());
}

?>
```

Execute this file, and answer the prompt with a name shorter than six letters:

```command
php logging.php
```

You will observe the following log entry in the `log/exception.log` file:

```command
cat log/exception.log
```

```text
[output]
{"message":"Username eric is not long enough.","context":{},"level":400,"level_name":"ERROR","channel":"exceptions","datetime":"2022-08-01T22:16:24.605838+02:00","extra":{}}
```

Notice how the exception message is stored in the `message` property. If you
prefer to log the entire exception object, you can pass the `$e` variable
directly to the `error()` method in the `context` argument. You have to
transform the exception into an array using the `array()` method:

```php
$logger->error($e->getMessage(), array('exception' => $e));
```

```text
[output]
{"message":"The username eric is too short.","context":{"exception":{"class":"Exception","message":"The username eric is too short.","code":0,"file":"C:\\Users\\Eric\\Documents\\Better Stack\\monlog-logging\\exception.php:20"}},"level":400,"level_name":"ERROR","channel":"exceptions","datetime":"2022-08-01T23:15:03.475664+02:00","extra":{}}
```

We recommend the second approach as it provides more flexibility when filtering
and analyzing logged exceptions when inspecting your logs through a log
management tool.

![Monolog exception details in Logtail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ca5cb8c4-b00a-4ec1-3a5a-4f8d4cfc6200/public =1175x768)

### Dealing with uncaught exceptions

If an exception is thrown without a `catch` block in the current scope, it will
bubble up the program until it reaches the global scope. If no `catch` block is
found at the global level, the PHP runtime will terminate the program
immediately with a `Fatal` error. Here's a rudimentary example of what the error
looks like:

```php
[label logging.php]
<?php

class emptyClass
{
    // This class is empty
};

// Try to access a method that does not exist
emptyClass::one();
?>
```

```text
[output]
Fatal error: Uncaught Error: Call to undefined method emptyClass::one() in /home/ayo/dev/betterstack/community/demo/logging-php/logging.php:9
Stack trace:
#0 {main}
  thrown in /home/ayo/dev/betterstack/community/demo/logging-php/logging.php on line 9
```

You handle this type of `Fatal` error in a `catch` block but you must use the
`Error` or `Throwable` type shown below:

```php
<?php

class emptyClass
{
    // This class is empty
};

try {
  // Try to access a method that does not exist
  emptyClass::one();
} catch (Error $e) {
  // exception handling code here
}
?>
```

To ensure that thrown exceptions do not trigger a `Fatal` error anywhere in your
program, you can specify a default exception handler for the entire program
through the
[`set_exception_handler()`](https://www.php.net/manual/en/function.set-exception-handler.php)
method:

```php
[label logging.php]
<?php

require __DIR__ . "/vendor/autoload.php";

use Monolog\Level;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Formatter\JsonFormatter;

function exception_handler(Throwable $e)
{
    $logger = new Logger('uncaught');
    $stream_handler = new StreamHandler(__DIR__ . "/log/uncaught.log", Level::Debug);
    $stream_handler->setFormatter(new JsonFormatter());
    $logger->pushHandler($stream_handler);
    $logger->error("Uncaught exception", array('exception' => $e));
}

set_exception_handler("exception_handler");

class emptyClass
{
    // This class is empty
};

// Try to access a property that does not exist
emptyClass::one();
?>
```

The `exception_handler()` function above serves as the program's default
exception handler and is called each time uncaught exceptions that travel to the
global scope are detected. The default `Fatal` error is suppressed, and a normal
exception message is written to the `log/uncaught.log` file along with the
details of the exception:

```command
cat log/uncaught.log
```

```text
[output]
{"message":"Uncaught exception","context":{"exception":{"class":"Error","message":"Call to undefined method emptyClass::one()","code":0,"file":"C:\\Users\\Eric\\Documents\\Better Stack\\monlog-logging\\exception.php:27"}},"level":400,"level_name":"ERROR","channel":"uncaught","datetime":"2022-08-02T00:00:34.004608+02:00","extra":{}}
```

Note that the program will still terminate after the `exception_handler()`
function is executed, but this time with a success exit code (`0`) instead of an
error code (any non-zero integer) as before. It would be best if you changed
this to a non-zero exit code by manually calling `exit()` as the bottom of the
global exception handler as shown below:

```php
function exception_handler(Throwable $e)
{
    $logger = new Logger('uncaught');
    $stream_handler = new StreamHandler(__DIR__ . "/log/uncaught.log", Level::Debug);
    $stream_handler->setFormatter(new JsonFormatter());
    $logger->pushHandler($stream_handler);
    $logger->error("Uncaught exception", array('exception' => $e));
    [highlight]
    exit(1)
    [/highlight]
}
```

Now, your program will log uncaught exceptions appropriately and terminate with
a non-zero code. It's a good idea to manage your application through a process
manager so that it can be automatically restarted in such situations. You should
also monitor your application through a free service like
[Better Uptime](https://betterstack.com/better-uptime) so that realtime alerts
are sent to you when your application experiences downtime detected. You'd also
get access to a beautiful status page that communicates ongoing incidents,
planned maintenances, and service degradations to your customers.

![Better Uptime Monitoring](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/69eb3ef3-c419-435a-86cd-c88da4e31500/public =1285x768)

## Sending logs to multiple destinations

Now that we've discussed log channels, log levels, and several different
handlers, we can create a more complex logging system that transports log
messages to various locations based on their level. The following example should
give you a clearer idea of how this can be useful.

Nuke everything inside your `index.php` file and replace it with the following
contents:

```php
[label index.php]
<?php

require __DIR__ . "/vendor/autoload.php";
require "./DBHandler.php";

use Monolog\Level;
use Monolog\Logger;
use Monolog\Formatter\JsonFormatter;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\RotatingFileHandler;

// New Logger instance
$logger = new Logger("my_logger");
$formatter = new JsonFormatter();

// Create new handler
$rotating_handler = new RotatingFileHandler(__DIR__ . "/log/debug.log", 30, Level::Debug);
$stream_handler = new StreamHandler(__DIR__ . "/log/notice.log", Level::Notice);
$db_handler = new DBHandler(new PDO('sqlite:alert.sqlite'), Level::Alert);

$stream_handler->setFormatter($formatter);
$db_handler->setFormatter($formatter);
$rotating_handler->setFormatter($formatter);

// Push the handler to the log channel
$logger->pushHandler($stream_handler);
$logger->pushHandler($rotating_handler);
$logger->pushHandler($db_handler);

// Log the message
$logger->info("This file has been executed.");
$logger->error("An error occurred.");
$logger->critical("This application is in critical condition!!");
$logger->emergency("This is an EMERGENCY!!!");

?>
```

In this example, the `$logger` channel is created, and a stack of different
handlers are assigned to it, each with a different minimum log level. At the end
of the file, four messages are sent to the log channel:

- The first one has the `info` level, which is higher than `debug` but lower
  than `notice`, so only the `$rotating_handler` will log it.
- The second message has the `error` level which is higher than both `debug` and
  `notice`, so it will be logged by the `$rotating_handler` and the
  `$stream_handler`.
- All three handlers will log the third and fourth messages since their
  respective levels of `critical` and `emergency` are greater than the specified
  minimum levels for all three handlers.

In an actual application, you might create a system that logs every level into a
file and additionally logs errors or messages with greater severity to Slack or
some other online service so that you can be notified of critical issues faster.
Monolog's
[FilterHander](https://github.com/Seldaek/monolog/blob/main/src/Monolog/Handler/FilterHandler.php)
can come in handy when creating such a system as it allows you to specify the
exact levels that should be recorded by the wrapped handler (as opposed to
specifying the minimum level alone).

While you can utilize Monolog in such manner, a better way to organize your logs is to aggregate and centralize them in one place. This is the most scalable way to store your logs, and the task of filtering, searching, and alerting on notable events is delegated to a suitable log management tool.

[Better Stack](https://betterstack.com/logs) is a cloud-based log management service that offers comprehensive support for collecting, filtering, and analyzing your log data in one place. You also gain access to alerting and collaboration features that help with drawing attention to a specific issue or sharing insights with teammates.

![Better Stack dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)

To get started with Better Stack, [sign up for a free account](https://betterstack.com/users/sign-in) to examine the options for integrating it into your PHP application. Our general recommendation is to configure Monolog to output the records to the console or a file and use a log shipping tool like [Vector](https://betterstack.com/docs/logs/vector/) to reroute the logs to Better Stack.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/8NMpHrVnJes" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Once your Monolog logs are flowing into Better Stack, you can analyze them in real-time using Live Tail to watch logs stream in as they happen:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

You can also visualize your logs with custom dashboards that transform raw log entries into actionable insights:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Final thoughts

In this tutorial, we discussed the basic concepts of logging in PHP with the
Monolog library and demonstrated several examples of it can help you log
effectively in your PHP application. As mentioned earlier, Monolog also
integrates seamlessly with popular PHP application frameworks like
[Laravel](https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/) and
[Symfony](https://symfony.com/doc/current/logging.html), so you don't need to
learn some other system if using such frameworks. While we covered a lot in this
tutorial, there's a lot more you can do with Monolog so ensure to
[read its documentation](https://github.com/Seldaek/monolog/blob/main/doc/01-usage.md)
to learn about all the other features available to you. If you would like to explore other PHP logging libraries we dive into Klogger and Analog in our [next article](https://betterstack.com/community/guides/logging/best-php-logging-libraries/).

Thanks for reading, and happy logging!