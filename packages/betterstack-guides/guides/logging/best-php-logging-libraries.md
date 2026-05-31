# The Best PHP Logging Libraries

[PHP logs go beyond just errors](https://betterstack.com/community/guides/logging/how-to-start-logging-with-php/). They're handy for tracking API and function
performance, as well as keeping count of significant events in your application.
No matter the project you're working on, implementing a logging strategy will
help keep you in the loop about what's happening in your code.

Unlike languages like [Go](https://betterstack.com/community/guides/logging/logging-in-go/),
[Python](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/), or
[Ruby](https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/), a dedicated
logging solution does not exist in its standard library, so you must choose one of the
available logging frameworks developed by the community. This article will
present the top three options for logging in PHP and discuss their unique
features, advantages, and use cases.

Let's get started!

[ad-logs]

## 1. Monolog

![monolog.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ce02df8b-ed81-46da-a55f-be2488c56200/md1x =1200x600)

[Monolog](https://github.com/Seldaek/monolog) is the go-to logging framework for
PHP applications. It provides a flexible and powerful way to log events and
route the entries to various destinations, such as files, databases, email, or
even external services. Getting started with Monolog is straight-forward via
Composer:

```command
composer require monolog/monolog
```

You can subsequently import various Monolog classes into your project and use
them as follows:

```php
<?php

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

// create a log channel
$logger = new Logger("example");

$stream_handler = new StreamHandler("php://stdout");
$logger->pushHandler($stream_handler);

$logger->debug("database query executed");
$logger->info("user signed in");
$logger->notice("a notice message");
$logger->warning("disk space is 95% full");
$logger->error("unexpected error while backing up database");
$logger->critical("a critical error occurred");
$logger->alert("an alert level massage");
$logger->emergency("fatal error: exiting program");
```

```text
[output]
[2023-08-31T08:52:18.777327+00:00] example.DEBUG: database query executed [] []
[2023-08-31T08:52:18.779741+00:00] example.INFO: user signed in [] []
[2023-08-31T08:52:18.779773+00:00] example.NOTICE: a notice message [] []
[2023-08-31T08:52:18.779794+00:00] example.WARNING: disk space is 95% full [] []
[2023-08-31T08:52:18.779851+00:00] example.ERROR: unexpected error while backing up database [] []
[2023-08-31T08:52:18.779872+00:00] example.CRITICAL: a critical error occurred [] []
[2023-08-31T08:52:18.779900+00:00] example.ALERT: an alert level massage [] []
[2023-08-31T08:52:18.779915+00:00] example.EMERGENCY: fatal error: exiting program [] []
```

Monolog exposes a `Logger` class with a name and a stack of handlers. In the
above example, the `StreamHandler` class is used to create a handler that logs
to the standard output, and this handler is attached to the `$logger`.

Once an event is logged, each attached handler will decide whether to output the
record to the configured destination and how to format it. The default format
for Monolog handlers contains the timestamp, logger name, level, log message,
then some context and extra information (`[] []`).

```text
[%datetime%] %channel%.%level_name%: %message% %context% %extra%\n
```

You can customize this format through any of the
[built-in formatter classes](https://github.com/Seldaek/monolog/blob/main/doc/02-handlers-formatters-processors.md#formatters)
such as the `JsonFormatter`. Once you create a formatter instance, you must
attach it to a handler instance as shown below:

```php
<?php

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
[highlight]
use Monolog\Formatter\JsonFormatter;
[/highlight]

// create a log channel
$logger = new Logger("example");

[highlight]
$formatter = new JsonFormatter();

$stream_handler = new StreamHandler("php://stdout");
$stream_handler->setFormatter($formatter);
[/highlight]

$logger->pushHandler($stream_handler);
. . .
```

You will now observe the following structured output:

```json
[output]
{"message":"fatal error: exiting program","context":{},"level":600,"level_name":"EMERGENCY","channel":"example","datetime":"2023-08-31T09:06:26.351676+00:00","extra":{}}
```

Monolog defaults to logging at the `DEBUG` level, but you can customize this
through the `Level` class. To give maximum flexibility, the default level is
defined on the handler instances so that attached handlers can log at different
levels if desired:

```php
use Monolog\Level;
. . .

$stdout_handler = new StreamHandler("php://stdout", Level::Info);
$stderr_handler = new StreamHandler("php://stderr", Level::Error);
. . .
```

To add contextual data to your log entries, you can pass an array of attributes
as follows:

```php
$logger->info("user signed in", ["username" => "johndoe", "user_id" => 123456]);
```

These data will be placed in the `context` property as shown below (assuming
you're using `JsonFormatter`):

```json
[output]
{
  "message": "user signed in",
  "context": {
    "username": "johndoe",
    "user_id": 123456
  },
  "level": 200,
  "level_name": "INFO",
  "channel": "example",
  "datetime": "2023-08-31T09:17:27.322331+00:00",
  "extra": {}
}
```

A second way to add data to all log records created by a logger is through
[processors](https://github.com/Seldaek/monolog/blob/main/doc/02-handlers-formatters-processors.md#processors).
For example, you can use the `IntrospectionProcessor` to add the originating
line number, file name, method, or class of the logged event:

```php
use Monolog\Processor\IntrospectionProcessor;

$logger = new Logger("example");

$processor = new IntrospectionProcessor();
$logger->pushProcessor($processor);

. . .
```

You will observe that the `extra` field is now populated:

```json
[output]
{
  "message": "user signed in",
  "context": {
    "username": "johndoe",
    "user_id": 123456
  },
  "level": 200,
  "level_name": "INFO",
  "channel": "example",
  "datetime": "2023-08-31T09:26:00.980933+00:00",
  "extra": {
    "file": "/home/ayo/dev/betterstack/demo/php-logging/main.php",
    "line": 24,
    "class": null,
    "callType": null,
    "function": "myFunc"
  }
}
```

When it comes to logging exceptions, Monolog can automatically catch and log
uncaught exceptions before your application exits once you override the default
exception handling behavior with `set_exception_handler()`:

```php
<?php

require __DIR__."/vendor/autoload.php";

use Monolog\Level;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Formatter\JsonFormatter;

function exception_handler(Throwable $e)
{
    $logger = new Logger('uncaught');
    $stream_handler = new StreamHandler("php://stdout");
    $stream_handler->setFormatter(new JsonFormatter());
    $logger->pushHandler($stream_handler);
    $logger->error("Uncaught exception", array('exception' => $e));
    exit(1)
}

set_exception_handler("exception_handler");

class emptyClass
{
    // This class is empty
};

// Try to access a property that does not exist
emptyClass::one();
```

Details about the exception will be placed in the event's `context` property:

```json
[output]
{
  "message": "Uncaught exception",
  "context": {
    "exception": {
      "class": "Error",
      "message": "Call to undefined method emptyClass::one()",
      "code": 0,
      "file": "/home/ayo/dev/betterstack/demo/php-logging/main.php:27"
    }
  },
  "level": 400,
  "level_name": "ERROR",
  "channel": "uncaught",
  "datetime": "2023-08-31T09:33:21.349825+00:00",
  "extra": {}
}
```

Ensure to check out our [dedicated Monolog
guide](https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/) for a deep dive on its concepts,
features, and how it enhances logging practices in PHP applications.

## 2. Klogger

![KLogger.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f09806a6-d28f-43a5-f62f-b06b3a673500/md2x =1200x600)

[Klogger](https://github.com/katzgrau/KLogger) is a simple
[PSR-3 compliant](https://www.php-fig.org/psr/psr-3/) library for writing event
logs in PHP programs. It aims to be a solution that you could quickly
incorporate into you project and have working right away without a convoluted
configuration process. You may install it using the command below:

```command
composer require katzgrau/klogger:dev-master
```

KLogger supports the log levels defined in the PSR-3 interface, and it defaults
to the `DEBUG` level:

```php
<?php

$logger = new Katzgrau\KLogger\Logger("php://stdout");

$logger->debug("database query executed");
$logger->info("user signed in");
$logger->notice("a notice message");
$logger->warning("disk space is 95% full");
$logger->error("unexpected error while backing up database");
$logger->critical("a critical error occurred");
$logger->alert("an alert level massage");
$logger->emergency("fatal error: exiting program");
?>
```

```text
[output]
[2023-08-31 13:37:05.179491] [debug] database query executed
[2023-08-31 13:23:05.179521] [info] user signed in
[2023-08-31 13:37:05.179591] [notice] a notice message
[2023-08-31 13:37:05.179604] [warning] disk space is 95% full
[2023-08-31 13:37:05.179611] [error] unexpected error while backing up database
[2023-08-31 13:37:05.179620] [critical] a critical error occurred
[2023-08-31 13:37:05.179626] [alert] an alert level massage
[2023-08-31 13:37:05.179634] [emergency] fatal error: exiting program
```

You may modify the default level using the `Psr\Log\LogLevel` constants like
this:

```php
$logger = new Katzgrau\KLogger\Logger("php://stdout",  Psr\Log\LogLevel::WARNING);
```

```text
[output]
[2023-08-31 13:45:04.008550] [warning] disk space is 95% full
[2023-08-31 13:45:04.008656] [error] unexpected error while backing up database
[2023-08-31 13:45:04.008668] [critical] a critical error occurred
[2023-08-31 13:45:04.008677] [alert] an alert level massage
[2023-08-31 13:45:04.008683] [emergency] fatal error: exiting program
```

The KLogger constructor also supports other options via a third argument. A
useful one is `logFormat` which defines the format of the log entries. JSON
formatted log entries can be achieved through the following configuration:

```php
$logFormat = json_encode([
    'ts' => '{date}',
    'level' => '{level}',
    'msg'  => '{message}',
    'ctx'  => '{context}',
]);

$logger = new Katzgrau\KLogger\Logger("php://stdout",  Psr\Log\LogLevel::WARNING, array (
  'logFormat' => $logFormat,
  'appendContext' => false
));
```

This yields log entries with the following structure:

```json
[output]
{"ts":"2023-08-31 13:59:18.217924","level":"WARNING","msg":"disk space is 95% full","ctx":"[]"}
{"ts":"2023-08-31 13:59:18.218084","level":"ERROR","msg":"unexpected error while backing up database","ctx":"[]"}

```

You can also add contextual attributes at log point like this:

```php
$logger->info("user signed in", ["username" => "johndoe", "user_id" => 123456]);
```

```json
[output]
{"ts":"2023-08-31 14:05:20.802109","level":"INFO","msg":"user signed in","ctx":"{"username":"johndoe","user_id":123456}"}
```

Logging to a file is also fully supported like this:

```php
$logger = new Katzgrau\KLogger\Logger(".",  Psr\Log\LogLevel::INFO);
```

The first argument to the constructor signifies the directory to place the log
file. Once you execute the program, you should see a file that looks like this
in the current working directory:

```text
log_2023-08-31.txt
```

Please see the [KLogger documentation](https://github.com/katzgrau/KLogger) to
learn how to customize this filename and the options it offers.

## 3. Analog

![analog.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cff90a60-929b-481b-f036-d18fdb18cd00/lg2x =1200x600)

[Analog](https://github.com/jbroadway/analog)'s main goal is to provide a
lightweight and simple logging solution similar Klogger, but without sacrificing
flexibility regarding the logging destinations. It bundles a large number of
handlers for this purpose, including the following:

- **Syslog**: output to syslog.
- **Redis**: send log entries to Redis.
- **Post**: send log entries over HTTP.
- **Slackbot** post log messages to Slack.
- **Mongo**: store logs in a MongoDB collection.
- and many more!

You can install the library through Composer like this:

```command
composer require analog/analog
```

Afterward, it may be utilized as follows through the provided PSR-3-compliant
`Logger` interface:

```php
<?php
use Analog\Logger;
use Analog\Handler\EchoConsole;

$logger = new Logger;

$logger->handler (EchoConsole::init ());

$logger->debug("database query executed");
$logger->info("user signed in");
$logger->notice("a notice message");
$logger->warning("disk space is 95% full");
$logger->error("unexpected error while backing up database");
$logger->critical("a critical error occurred");
$logger->alert("an alert level massage");
$logger->emergency("fatal error: exiting program");
?>
```

```text
[output]
localhost - 2023-08-31 14:36:36 - 7 - database query executed
localhost - 2023-08-31 14:36:36 - 6 - user signed in
localhost - 2023-08-31 14:36:36 - 5 - a notice message
localhost - 2023-08-31 14:36:36 - 4 - disk space is 95% full
localhost - 2023-08-31 14:36:36 - 3 - unexpected error while backing up database
localhost - 2023-08-31 14:36:36 - 2 - a critical error occurred
localhost - 2023-08-31 14:36:36 - 1 - an alert level massage
localhost - 2023-08-31 14:36:36 - 0 - fatal error: exiting program
```

The default format is shown below:

```text
machine - date - level - message
```

It only allows limited customization through the `$format` option:

```php
Analog::$format = "machine=%s time=%s level=%s msg=%s\n";
```

```text
[output]
machine=localhost time=2023-08-31 15:14:06 level=7 msg=database query executed
machine=localhost time=2023-08-31 15:14:06 level=6 msg=user signed in
```

You can also convert log level numbers to names in the output through the
`LevelName` handler as follows:

```php
<?php

use Analog\Logger;
use Analog\Handler\EchoConsole;
use Analog\Handler\LevelName;

$logger = new Logger;

Analog::$format = "machine=%s time=%s level=%s msg=%s\n";

$logger->handler (LevelName::init (
  EchoConsole::init ()
));

. . .
```

This yields:

```text
[output]
machine=localhost time=2023-08-31 15:16:46 level=DEBUG msg=database query executed
machine=localhost time=2023-08-31 15:16:46 level=INFO msg=user signed in
```

Please see the
[examples directory](https://github.com/jbroadway/analog/blob/master/examples/)
on GitHub for more usage examples. Note that Analog doesn't appear to be
actively maintained at the time of writing given its last commit in late 2021.

## Final thoughts

In the PHP ecosystem, the spectrum of libraries for effective logging is
somewhat narrower when juxtaposed with the offerings available in other
programming languages. Monolog is pretty much the only standout option, and it's
also the default solution in popular frameworks such as
[Laravel](https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/) and
[Symfony](https://symfony.com/doc/current/logging.html). We recommend that [read
our dedicated Monolog guide](https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/) to learn how to
best set up a production-ready configuration in your projects.

Thanks for reading, and happy logging!