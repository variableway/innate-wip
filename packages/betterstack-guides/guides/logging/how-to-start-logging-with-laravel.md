# How to Get Started with Logging in Laravel

Laravel, a popular framework for building PHP projects, has a robust logging
system that allows you to send log messages to files, system logs, and various
other destinations. Logging in Laravel is channel-based, and each channel
defines a specific way of writing log messages. For example, the `single`
channel writes log files to a single log file, while the `slack` channel sends
log messages to Slack.

Laravel logging is created on top of
[Monolog](https://github.com/Seldaek/monolog), which is a powerful logging
library for PHP projects. We've already covered Monolog in-depth in [this
article](https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/), so we'll mostly focus on the
Laravel-specific bits here.


## Prerequisites

You need to have the latest version of PHP and
[Composer](https://getcomposer.org/) installed on your computer. You should also
create a new Laravel project so that you can test the code snippets in this
article. You can consult Laravel's
[official documentation](https://laravel.com/docs/9.x/installation#your-first-laravel-project)
for details on creating a new project on your machine.

[summary]

## Side note: See logs in real time with Live tail

If you want a quick preview before wiring anything up, here’s a short **Live tail** demo:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="Better Stack Live tail demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
[/summary]

## Exploring the logging config file

Laravel projects include a `config` directory containing several configuration
files used to customize the project's different aspects, such as the database
setup, caching, session management, and more. In addition, the configuration
options related to logging are also present in this directory in the
`logging.php` file. Go ahead and open this file in your editor to examine its
contents:

```command
code config/logging.php
```

```php
[label config/logging.php]
<?php

use Monolog\Handler\NullHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\SyslogUdpHandler;

return [
    "default" => env("LOG_CHANNEL", "stack"),

    "deprecations" => [
        "channel" => env("LOG_DEPRECATIONS_CHANNEL", "null"),
        "trace" => false,
    ],

    "channels" => [
        "stack" => [
            "driver" => "stack",
            "channels" => ["single", "daily"],
            "ignore_exceptions" => false,
        ],
        "single" => [
            "driver" => "single",
            "path" => storage_path("logs/laravel.log"),
            "level" => env("LOG_LEVEL", "debug"),
        ],
        "daily" => [
            "driver" => "daily",
            "path" => storage_path("logs/laravel.log"),
            "level" => env("LOG_LEVEL", "debug"),
            "days" => 14,
        ],

        . . .
    ],
];

```

Notice how three
[Monolog handlers](http://seldaek.github.io/monolog/doc/02-handlers-formatters-processors.html)
are imported at the top of the file. This confirms what we explained earlier
about Laravel logging being based on Monolog. Below the imports, you can see
three distinct options in the array returned by the config file.

The `default` option specifies the default channel for writing all log messages
produced by Laravel. The value provided to this option should match a channel
defined by the `channels` array. In the above snippet, the value of the
`LOG_CHANNEL` environmental variable (defined in your `.env` file) will be used
by default if it exists. Otherwise, it will fall back to the `stack` channel. If
you check the `.env` file at the project root, you'll notice that the
`LOG_CHANNEL` variable is also set to `stack` by default:

```text
[label .env]
. . .
LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug
. . .
```

The `deprecations` option allows you to control where deprecation warnings from
PHP, Laravel, and other third-party libraries are placed. This uses the
`LOG_DEPRECATIONS_CHANNEL` environmental variable (set to `null` by default)
which means that deprecation warnings will be ignored. Recording such notices is
useful when preparing for major version upgrades so you should set this variable
to a valid channel. You may also define a special `deprecations` channel for
this purpose and it will always be used to log deprecations regardless of the
value of the top-level `deprecations` key.

```php
"channels" => [
    "deprecations" => [
        "driver" => "single",
        "path" => storage_path("logs/deprecation-warnings.log"),
    ],
]
```

Lastly, the `channels` option is the most important part of the file as it is
where all the logging channels are defined and configured. An example is shown
in the previous snippet above. We defined a channel called `deprecations` which
uses the `single`
[channel driver](https://laravel.com/docs/9.x/logging#available-channel-drivers).
This driver determines how log messages sent to the corresponding channel are
recorded. For instance, the `single` driver writes all log messages to a local
file as specified by the `path` option, which is `storage/logs/laravel.log` in
this case. If the specified file does not exist, Laravel will automatically
create it.

```php
"channels" => [
    "single" => [
        "driver" => "single",
        "path" => storage_path("logs/laravel.log"),
        [highlight]
        "level" => env("LOG_LEVEL", "debug"),
        [/highlight]
    ],
]
```

Another option that is configurable on channels is `level` (highlighted above),
and it specifies the channel's minimum [log level](https://betterstack.com/community/guides/logging/log-levels-explained/). The
log level is a way for us to classify different messages based on their urgency
and the `level` option determines the **minimum** log level the message must
have to be logged by the channel. For the `single` channel, this option is
determined by the value of the `LOG_LEVEL` environmental variable (set to
`debug` by default) and falling back to `debug` if the `LOG_LEVEL` variable is
not present in the environment.

## Understanding channel drivers

In this section, we will take a closer look at channel drivers in Laravel and
how to utilize them. We've already seen the `single` driver, which logs messages
to a single file on the local disk. The `daily` driver is similar to `single` as
it also writes to a file, but it rotates daily and automatically deletes old
logs. It uses Monolog's `RotatingFileHandler` under the hood. Here's how it is
typically configured:

```php
[label config/logging.php]
. . .
"daily" => [
    "driver" => "daily",
    "path" => storage_path("logs/laravel.log"),
    "level" => env("LOG_LEVEL", "debug"),
    "days" => 14,
],
. . .
```

This `daily` driver will create one log file per day in the format of
`laravel-YYYY-MM-DD.log`. The `days` option specifies how long to retain each
log file, meaning that files older than 14 days will be deleted. It's generally
better to prefer the `daily` driver instead of `single` so that individual log
files do not grow too large and become unwieldy. Another solution is to continue
using the `single` driver and implement log file rotation using a standard
utility such as
[logrotate](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/).

```php
[label config/logging.php]
. . .
"syslog" => [
    "driver" => "syslog",
    "level" => env("LOG_LEVEL", "debug"),
],

"errorlog" => [
    "driver" => "errorlog",
    "level" => env("LOG_LEVEL", "debug"),
],
. . .
```

The `syslog` and `errorlog` drivers work very similarly. They both write to the
system log, except that the `syslog` driver invokes PHP's
[syslog() function](http://docs.php.net/manual/en/function.syslog.php), and the
`errorlog` driver invokes the
[error_log() function](http://docs.php.net/manual/en/function.error-log.php).
You can learn more about how these functions work in our article on [logging in
PHP](https://betterstack.com/community/guides/logging/how-to-start-logging-with-php/).

The `stack` driver allows you to log a message into multiple channels at once by
using its `channels` option. For example:

```php
[label config/logging.php]
. . .
    "channels" => [
        "stack" => [
            "driver" => "stack",
            [highlight]
            "channels" => ["one", "two", "three"],
            [/highlight]
            "ignore_exceptions" => false,
        ],
        "one" => [
            "driver" => "single",
            "path" => storage_path("logs/laravel_1.log"),
            "level" => "debug",
        ],
        "two" => [
            "driver" => "single",
            "path" => storage_path("logs/laravel_2.log"),
            "level" => "warning",
        ],
        "three" => [
            "driver" => "single",
            "path" => storage_path("logs/laravel_3.log"),
            "level" => "error",
        ],
    ],
. . .
```

The highlighted `channels` option above binds channels `one`, `two`, and `three`
together so you can log to all three channels simultaneously by invoking the
`stack` channel.

You to take further control of how logging should work in your application by
using the following one these two channel drivers: the `monolog` driver for
invoking any Monolog handlers directly, and the `custom` driver for creating
custom loggers using factories.

Since Laravel logging is based on the Monolog library, we can access any of its
[handlers](https://github.com/Seldaek/monolog/tree/main/src/Monolog/Handler)
using the `monolog` driver as shown below:

```php
[label config/logging.php]
<?php

use Monolog\Handler\StreamHandler

. . .
"monolog_handler" => [
    "driver"  => "monolog",
    [highlight]
    "handler" => Monolog\Handler\FilterHandler::class,
    "with" => [
        "handler" => new StreamHandler(storage_path("logs/info.log")),
        "minLevelOrList" => [Monolog\Logger::INFO],
    ],
    [/highlight]
],
```

In the highlighted section, we have the `handler` option which specifies the
Monolog handler we are going to use which is `FilterHandler` in this example.
This handler allows us to assign specific log levels to the channel, instead of
a minimum level such that only entries that match the specified levels gets
logged to the channel.

Next, the `with` option is where we pass some information that are required by
the chosen Monolog handler. In this example, a second `handler` option is used
to specify that `StreamHandler` should be used log the messages sent to the
`monolog_handler` channel to a local file.

The `minLevelOrList` option defines one or more log levels that should be
recorded to the destination defined within the channel. In this case, only
`INFO` level entries will be logged to the `logs/info.log` file. You can read
more about Monolog handlers in [this
article](https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/).

When you need an even higher level of customization for your project, you may
create a completely customized channel using the `custom` driver.

```php
[label config/logging.php]
. . .
"example-custom-channel" => [
    "driver" => "custom",
    "via" => App\Logging\CreateCustomLogger::class,
],
```

Then we can create the `CreateCustomLogger.php` file where we can create a fully
customized logging channel using Monolog:

```command
code app/Logging/CreateCustomLogger.php
```

```php
[label app/Logging/CreateCustomLogger.php]
<?php

namespace App\Logging

use Monolog\Logger;

class CreateCustomLogger
{
    /**
     * Create a custom Monolog instance.
     *
     * @param  array  $config
     * @return \Monolog\Logger
     */
    public function __invoke(array $config)
    {
        return new Logger(
        . . .
        );
    }
}
```

You do need more advanced knowledge related to Monolog to achieve this, so if
you are interested, [read our tutorial on
Monolog](https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/) to find out more.

## Understanding log levels in Laravel

Laravel offers the eight severity levels defined in the
[RFC 5424 specification](https://tools.ietf.org/html/rfc5424). The list below is
ordered according to their severity levels, with `emergency` being the most
severe and `debug` being the least severe:

- `EMERGENCY`: means the application is unusable, and the issue needs to be
  addressed immediately.
- `ALERT`: similar to `EMERGENCY`, but less severe.
- `CRITICAL`: critical errors in a core aspect of your application.
- `ERROR`: error conditions in your application.
- `WARNING`: something unusual happened that may need to be addressed later.
- `NOTICE`: similar to `INFO` but more significant.
- `INFO`: informational messages that describe the normal operation of the
  program.
- `DEBUG`: used to record some debugging messages.

There is no standard on what conditions should be considered as `ALERT`,
`CRITICAL`, `WARNING`, etc. It all depends on the purpose of the program you are
writing. For example, imagine an e-commerce application where users can purchase
items. You can log successful orders using the `INFO` level, and failed orders
due to some external API being faulty using the `ERROR` level.

Here's how to use the above log levels in a Laravel application:

```php
use Illuminate\Support\Facades\Log;

Log::debug("This is a debug message.");
Log::info("This is an info level message.");
Log::notice("This is a notice level message.");
Log::warning("This is a warning level message.");
Log::error("This is an error level message.");
Log::critical("This is a critical level message.");
Log::alert("This is an alert level message.");
Log::emergency("This is an emergency level message.");
```

```text
[output]
[2022-07-20 16:11:34] local.INFO: This is an info level message.
[2022-07-20 16:11:34] local.NOTICE: This is a notice level message.
[2022-07-20 16:11:34] local.WARNING: This is a warning level message.
[2022-07-20 16:11:34] local.ERROR: This is an error level message.
[2022-07-20 16:11:34] local.CRITICAL: This is a critical level message.
[2022-07-20 16:11:34] local.ALERT: This is an alert level message.
[2022-07-20 16:11:34] local.EMERGENCY: This is an emergency level message.
```

Notice how the log level is included just before the log message above. This
helps you make sense of each entry at a glance by annotating how severe the
event is so you know where to concentrate your efforts. If you send your logs to
a log management service, you can set up log monitoring based on these levels,
such that you are promptly alerted of notable events in your application.

## Creating a log stack

In this section, we'll demonstrate how to use the `stack` channel driver to
create a basic logging system for a Laravel application. Head back to the
`logging.php` file and replace the default channel configurations with the
following lines:

```php
[label config/logging.php]
. . .

"channels" => [
    "stack" => [
        "driver" => "stack",
        "channels" => [
            "daily",
            "important",
            "urgent",
        ],
        "ignore_exceptions" => false,
    ],

    "daily" => [
        "driver" => "daily",
        "path" => storage_path("logs/daily.log"),
        "level" => "info",
    ],

    "important" => [
        "driver" => "daily",
        "level" => "warning",
        "path" => storage_path("logs/important.log"),
    ],

    "urgent" => [
        "driver" => "daily",
        "path" => storage_path("logs/urgent.log"),
        "level" => "critical",
    ],
],
```

We created three unique channels, each with different minimum log levels, and we
combined them in the `stack` channel using the `stack` driver. Recall that the
`level` option defines the **minimum** level the message must have to be logged
by the channel. So in this example, if we have a `DEBUG` level message, it won't
be logged by any channel as `DEBUG` is less severe than `INFO`, `WARNING`, and
`CRITICAL`. However, if we have an `EMERGENCY` level message, it would be logged
by all three channels.

In this logging system, the `daily.log` file will contain all log records except
debugging messages. The `important.log` file will include all records you should
pay attention to (`WARNINGS` or more severe), and the `urgent.log` file will
contain all potentially showstopping issues that should be resolved immediately.

The problem is with this system is that it could lead to a waste of storage
resources due to the repetition of logs in each file. It will be better if we
can define a set of acceptable log levels for each handler instead of just the
minimum level. Laravel doesn't offer a native way to setup such a system, but it
can be achieved by using the `FilterHandler` discussed earlier:

```php
. . .

"channels" => [
    "stack" => [
        "driver" => "stack",
        "channels" => ["debug", "info", "warning", "critical", "emergency"],
        "ignore_exceptions" => false,
    ],

    "debug" => [
        'driver'  => 'monolog',
        'handler' => Monolog\Handler\FilterHandler::class,
        'with' => [
            'handler' => new Monolog\Handler\RotatingFileHandler(storage_path('logs/debug.log'), 15),
            'minLevelOrList' => [Monolog\Logger::DEBUG],
        ],
    ],

    "info" => [
        'driver'  => 'monolog',
        'handler' => Monolog\Handler\FilterHandler::class,
        'with' => [
            'handler' => new Monolog\Handler\RotatingFileHandler(storage_path('logs/info.log'), 15),
            'minLevelOrList' => [Monolog\Logger::INFO],
        ],
    ],

    "warning" => [
        'driver'  => 'monolog',
        'handler' => Monolog\Handler\FilterHandler::class,
        'with' => [
            'handler' => new Monolog\Handler\RotatingFileHandler(storage_path('logs/warning.log'), 15),
            'minLevelOrList' => [Monolog\Logger::NOTICE, Monolog\Logger::WARNING],
        ],
    ],

    "critical" => [
        'driver'  => 'monolog',
        'handler' => Monolog\Handler\FilterHandler::class,
        'with' => [
            'handler' => new Monolog\Handler\RotatingFileHandler(storage_path('logs/critical.log'), 15),
            'minLevelOrList' => [Monolog\Logger::ERROR, Monolog\Logger::CRITICAL],
        ],
    ],

    "emergency" => [
        'driver'  => 'monolog',
        'handler' => Monolog\Handler\FilterHandler::class,
        'with' => [
            'handler' => new Monolog\Handler\TelegramBotHandler($apiKey = "<telegram_bot_api>", $channel = "@<channel_name>"),
            'minLevelOrList' => [Monolog\Logger::ALERT, Monolog\Logger::EMERGENCY],
        ],
    ],
],
```

In this example, the `debug` channel will only log the `DEBUG` messages, the
`warning` channel will log the `NOTICE` and `WARNING` messages, and the
`emergency` will push the `ALERT` and `EMERGENCY` messages a Telegram channel
through the `TelegramBotHandler`.

To set up the `TelegramBotHandler`, you need to create a Telegram bot through
[BotFather](https://telegram.me/BotFather) first. Open the link in the Telegram
client and start the conversation by sending the message `/start`. You should
receive a message with the next steps to creating your bot.

![Create a new Telegram bot](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/69f88471-1d1e-4608-1460-efd703b25700/public =744x768)

Follow the instructions to create a new username and bot name, and you should
receive an API key after you are done. You can use this API key to access your
bot.

![Telegram bot API key](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d077a119-6df0-4997-a90b-9dcae19c5000/public =1212x631)

Next, create a public Telegram channel, and add the bot to the channel. Finally,
use the API key and the channel name (with prefix `@`) to construct a new
instance of `TelegramBotHandler`.

![Telegram channel name](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4bdd6d00-0601-4961-124c-a8e7a16bf000/public =722x691)

This time, if you push an `EMERGENCY` level message, it should only go through
the `emergency` channel.

```php
use Illuminate\Support\Facades\Log;


. . .
Log::alert("This is an alert level message.");
Log::emergency("This is an emergency level message.");
```

You should receive messages like this on Telegram:

![Telegram](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7127e8f0-3d77-472d-d50d-571d19933200/public =1281x399)

[summary]

## Side note: Catch Laravel outages fast with Better Stack

With **[Better Stack Uptime Monitoring](https://betterstack.com/uptime)**, you get 30 second checks, screenshots, a detailed incident timeline, and alerts via Slack, Teams, email, SMS, or phone calls.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/YUnoLpCy1qQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Sending a log message

We've mainly discussed Laravel's logging configuration so far, so it's time for
us to put what we've learned to practice in the application code. Head to the
`routes` directory and open the `web.php` file. We will create a new route and
log a message whenever a user access it. Note that we are using the `stack` log
channel setup from the previous section.

```command
code routes/web.php
```

```php
[label routes/web.php]
<?php

use Illuminate\Support\Facades\Route;
[highlight]
use Illuminate\Support\Facades\Log;
[/highlight]


Route::get("/", function () {
    return view("welcome");
});

[highlight]
Route::get("/user", function () {
    Log::info("The route /user is being accessed.");
    return "This is the /user page.";
});
[/highlight]
```

Laravel's `Log` [facade](https://laravel.com/docs/9.x/facades) is being used to
write log messages, and the `Log::info()` method is used for logging `INFO`
level messages. To see this in action, launch the development server by running
the following command in the terminal:

```command
php artisan serve
```

```text
[output]
Starting Laravel development server: http://127.0.0.1:8000
```

Open your browser and go to `http://127.0.0.1:8000/user`; you should see the
string returned by the router. Head back to the terminal and inspect the
contents of the `storage/logs` directory. You should observe that an
`info-<date>.log` file is present. Examine the contents of this file as follows:

```command
cat storage/logs/daily-<date>.log
```

```text
[output]
[2022-07-01 15:46:12] local.INFO: The route /user is being accessed.
```

Since this log message has the `INFO` log level, it will only be logged by the
`info` channel, so no other files will contain this entry due to our use of the
`FilterHandler` in the configuration file.

You can add another route below to simulate an error condition in the
application:

```php
[label routes/web.php]
. . .
Route::get("/user/{username}", function ($username) {
    $users = ["user1", "user2", "user3"];

    if (in_array($username, $users)) {
        return "User found!";
    } else {
        Log::error("User does not exist.");
        return "User does not exist.";
    }
});
```

Open your browser and go to `http://127.0.0.1:8000/user/test`. Since the `test`
user is not found in the `$users` array, an error log will be recorded to the
`critical` channel.

### Logging to a specific channel

It's also possible to log to a specific channel other than the default by using
the `channel()` method shown below:

```php
[label routes/web.php]
. . .
Route::get("/user", function () {
    [highlight]
    Log::channel("info")->info("The route /user is being accessed.");
    [/highlight]
    return "This is the /user page.";
});
```

This highlighted message will be logged directly to the `info` channel without
going through the `stack` channel. One thing to note when using a specific
channel like this is that the message must correspond to the configured levels
on the channel. If you try to log an `INFO` message to the `warning channel`, it
will be ignored since only `NOTICE` and `WARNING` logs are accepted on the
channel.

## Adding contextual data to log messages

In our examples so far, we are only logging simple messages, but it's often
necessary to include more information in the log entry to provide more context
on the event that caused it to be logged. This can be accomplished by adding a
second parameter to the log level method like this:

```php
[label routes/web.php]
. . .
Route::get("/user/{username}", function ($username) {
    [highlight]
    Log::info("The route /user is being accessed.", ["username" => $username]);
    [/highlight]
    return "The route /user is being accessed.";
});
```

Open your browser and go to `http://127.0.0.1:8000/user/test`. Return to the
terminal and check the latest record in the `info-<date>.log` file using the
command below:

```command
tail -n 1 storage/logs/info-<date>.log
```

You should observe a JSON formatted object at the end of the log record like
this:

```text
[output]
[2022-07-01 19:46:10] local.INFO: The route /user is being accessed. {"username":"test"}
```

If you need more control over how logs are formatted in Laravel, you can
customize it through Monolog's formatters. Head back to the `config/logging.php`
and add a `tap` option for the `stack` channel:

```php
[label config/logging.php]
. . .
"info" => [
    "driver" => "single",
    "tap" => [App\Logging\CustomizeFormatter::class],
    "path" => storage_path("logs/daily.log"),
    "level" => "info",
],
. . .
```

Next, we need to create the `CustomizeFormatter.php` file:

```command
code app/Logging/CustomizeFormatter.php
```

```php
[label app/Logging/CustomizeFormatter.php]

<?php

namespace App\Logging;
[highlight]
use Monolog\Formatter\LineFormatter;
[/highlight]
class CustomizeFormatter
{
    /**
     * Customize the given logger instance.
     *
     * @param  \Illuminate\Log\Logger  $logger
     * @return void
     */
    public function __invoke($logger)
    {
        foreach ($logger->getHandlers() as $handler) {
            $handler->setFormatter(new LineFormatter(
                [highlight]
                '%level_name% | [%datetime%] | %message% | %context%'
                [/highlight]
            ));
        }
    }
}
```

In the above snippet, Monolog's `LineFormatter` is used to change the format of
the log message such that the log level comes first, and each portion of the log
entry is separated by a pipe (`|`) character. When you visit the `/user` route
and inspect the `info-<date>.log` file once again, you will observe that the
format for each entry is now as follows:

```text
INFO | [2022-08-15T10:49:41.056687+00:00] | The route /user is being accessed. | {"username":"test"}
```

If you'd like to learn more about formatting your log entries in Laravel, check
out our [getting started tutorial on
Monolog](https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/).

## Centralizing and storing your logs

So far, we've mostly considered logging into files, and we also demonstrated a basic way to draw attention to critical events by sending them to a Telegram channel. You can also aggregate all your logs in one place for processing, monitoring, and alerting so you can search and correlate events without logging into each server individually.

[Better Stack Logs](https://betterstack.com/logs) is a log management service that lets you centralize logs in minutes with a free account, so you can search across environments, build alerts, and visualize trends over time. We will quickly demonstrate how to connect a Laravel source so your logs start flowing into Better Stack.


If you prefer a quick video walkthrough, here’s a short demo of shipping logs with the Better Stack Collector:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/_pv2tKoBnGo" title="Send logs to Better Stack using the Collector" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


Once you are signed into Better Stack, head to the **Sources** page and click the **Connect sources** button.

![Sources Page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e8f6862c-9ad5-4075-3c8f-ad47135e2f00/public =1366x424)

Choose PHP as your platform and click the **Create Source** button.

![Connect Source](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/56f37181-6f27-4571-c869-e9b5fda36100/public =1366x586)

Once your source is created, copy the **Source token** to your clipboard.

![Copy Source token](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/30ceea50-85ef-4875-217e-c83c75738f00/public =1366x729)

From here, you can ship your Laravel logs using the Better Stack Collector. Once it is configured, new log entries will start appearing almost instantly.

When your logs begin streaming in, open Live tail to watch events in real time while you click around your app, trigger errors, or test new routes:

![Live Tail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f655d79a-4aca-4ba1-b9e0-518ce3d12f00/public =1366x469)

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="Better Stack Live tail demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>



Live tail is perfect for debugging in the moment, but dashboards are where centralized logs really start paying off. Instead of scanning individual entries, you can visualize error spikes, track warning trends after deploys, and spot patterns across time windows.

Here’s a short demo of turning logs into a dashboard you can monitor at a glance:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Conclusion and next steps

This article discussed several concepts related to logging in Laravel
applications, such as log channels, log levels, contextual logging, and
formatting log entries. As a result, you should now be well equipped to track
down errors and improve your development experience as a whole especially if
you're monitoring your logs through Logtail.

Note that we've only scratched the surface of logging in Laravel in this
article. To unlock its full potential, you must [dig deeper into the underlying
Monolog library](https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/), which powers its entire
logging infrastructure. For further resources on PHP logging libraries, read [our new article](https://betterstack.com/community/guides/logging/best-php-logging-libraries/).

Thanks for reading, and happy logging!
