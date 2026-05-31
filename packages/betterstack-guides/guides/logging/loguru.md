# A Complete Guide to Logging in Python with Loguru

[Loguru](https://github.com/Delgan/loguru) is the most popular third-party
[logging framework](https://betterstack.com/community/guides/logging/logging-framework/) for Python on GitHub, with about 21k
stars at the time of writing. It aims to ease the process of setting up a
logging system in your project and provide a simpler alternative to the default
Python `logging` module, which is sometimes criticized for having a convoluted
configuration setup.

Loguru is much easier to set up than the standard `logging` module, and it has
many useful features that will help you collect as much information from your
application as needed. This guide will describe the library and its features in
detail, and give you an idea of how to integrate it into a typical web
application setup. It will also provide some pointers on how to seamlessly
migrate from the standard `logging` module to Loguru.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/y8qLhov8QU8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Prerequisites

Before proceeding with this tutorial, ensure that you have a recent version of
Python installed on your machine. To best understand the concepts discussed in
this tutorial, create a new Python project so that you may test the code
snippets and examples presented in this article.

We recommend that you use Python's [virtual environment](https://docs.python.org/3/tutorial/venv.html) feature for your project, so that changes made to your project do not affect the other Python projects on your machine.

```command
mkdir loguru-demo && cd loguru-demo
```

```command
python3 -m venv venv
```

Afterward, activate the virtual environment:

```command
source venv/bin/activate
```

[ad-logs]

## Getting started with Loguru

Before you can start logging with Loguru, you must install the `loguru` package
using the `pip` command:

```command
pip install loguru
```

```text
[output]
Collecting loguru
  Downloading loguru-0.7.3-py3-none-any.whl.metadata (22 kB)
Downloading loguru-0.7.3-py3-none-any.whl (61 kB)
Installing collected packages: loguru
Successfully installed loguru-0.7.3
```

Next, create an `app.py` file in your project directory as this is where we will
demonstrate various features of Loguru.

```command
touch app.py
```

```python
[label app.py]
from loguru import logger

logger.debug("Happy logging with Loguru!")
```

The most basic way to use Loguru is by importing the `logger` object from the
`loguru` package. This `logger` is pre-configured with a handler that logs to
the standard error by default. The `debug()` method is subsequently used to log
a message at the `DEBUG` level. Save the file and execute the command below to
see it in action:

```command
python app.py
```

```text
[output]
2025-05-23 14:16:33.051 | DEBUG    | __main__:<module>:3 - Happy logging with Loguru!
```

The output contains the following details:

- `2025-05-23 14:16:33.051`: the timestamp.
- `DEBUG`: the log level, which is used to describe the severity level of the
  log message.
- `__main__:<module>:3`: the file location, scope and line number. In this
  example, the file location is `__main__` because you executed the `app.py`
  file directly. The scope is `<module>` because the logger is not located
  inside a class or a function.
- `Happy logging with Loguru!`: the log message.

## Exploring log levels in Loguru

[Log levels](https://betterstack.com/community/guides/logging/log-levels-explained/) are a widely used concept in logging. They
specify the severity of a log record so that messages can be filtered or
prioritized based on how urgent they are. Loguru offers seven unique log levels,
and each one is associated with an integer value as shown in the list below:

- `TRACE` (5): used to record fine-grained information about the program's
  execution path for diagnostic purposes.
- `DEBUG` (10): used by developers to record messages for debugging purposes.
- `INFO` (20): used to record informational messages that describe the normal
  operation of the program.
- `SUCCESS` (25): similar to `INFO` but used to indicate the success of an
  operation.
- `WARNING` (30): used to indicate an unusual event that may require further
  investigation.
- `ERROR` (40): used to record error conditions that affected a specific
  operation.
- `CRITICAL` (50): used to record error conditions that prevent a core function
  from working.

Each log level listed above has a corresponding method of the same name, which
enables you to send log records with that log level:

```python
[label app.py]
from loguru import logger

logger.trace("A trace message.")
logger.debug("A debug message.")
logger.info("An info message.")
logger.success("A success message.")
logger.warning("A warning message.")
logger.error("An error message.")
logger.critical("A critical message.")
```

```text
[output]
2025-05-23 14:18:03.342 | DEBUG    | __main__:<module>:4 - A debug message.
2025-05-23 14:18:03.342 | INFO     | __main__:<module>:5 - An info message.
2025-05-23 14:18:03.342 | SUCCESS  | __main__:<module>:6 - A success message.
2025-05-23 14:18:03.342 | WARNING  | __main__:<module>:7 - A warning message.
2025-05-23 14:18:03.342 | ERROR    | __main__:<module>:8 - An error message.
2025-05-23 14:18:03.342 | CRITICAL | __main__:<module>:9 - A critical message.
```

These messages are printed to the console in different colors based on their log
level.

![Loguru log levels](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8232260c-f8f1-453d-13ac-7ed51872fa00/public =748x407)

Notice that the `TRACE` level message is not included in the output above. This
is because Loguru defaults to using `DEBUG` as its minimum level, which causes
any logs with a severity lower than `DEBUG` to be ignored.

If you want to change the default level, you may use the `level` argument to the
`add()` method shown below:

```python
[label app.py]
from loguru import logger
[highlight]
import sys

logger.remove(0)
logger.add(sys.stderr, level="INFO")
[/highlight]

. . .
```

The `remove()` method is called first to remove the configuration for the
default handler (whose ID is `0`). Subsequently, the `add()` method adds a new
handler to the `logger`. This handler logs to the standard error and only
records logs with `INFO` severity or greater.

When you execute the program once more, you'll notice that the `DEBUG` message
is also omitted since it is less severe than `INFO`:

```text
[output]
2025-05-23 14:20:37.297 | INFO     | __main__:<module>:10 - An info message.
2025-05-23 14:20:37.298 | SUCCESS  | __main__:<module>:11 - A success message.
2025-05-23 14:20:37.298 | WARNING  | __main__:<module>:12 - A warning message.
2025-05-23 14:20:37.298 | ERROR    | __main__:<module>:13 - An error message.
2025-05-23 14:20:37.298 | CRITICAL | __main__:<module>:14 - A critical message.
```

### Creating custom levels

Loguru also provides the ability to create custom levels using `level()` method
on a `logger` which comes in handy if the defaults don't fit with your logging
strategy. Here's an example that adds the `FATAL` level to the `logger`:

```python
[label app.py]
from loguru import logger

[highlight]
logger.level("FATAL", no=60, color="<red>", icon="!!!")
logger.log("FATAL", "A user updated some information.")
[/highlight]
```

The `level()` method takes the following four parameters:

- `name`: the name of the log level.
- `no`: the corresponding severity value (must be an integer).
- `color`: the color markup.
- `icon`: the icon of the level.

When choosing a severity value for your custom log level, you should consider
how important this level is to your project. For example, the `FATAL` level
above is given an integer value of `60`, making it the most severe.

Since custom log levels do not have provision for level methods (like `info()`,
`debug()` etc), you must use the generic `log()` method on the `logger` by
specifying the log level name, followed by the message to be logged. This yields
the following output:

```text
[output]
2025-05-23 14:21:42.527 | FATAL    | __main__:<module>:4 - A user updated some information.
```

## Customizing Loguru

When using [Python's `logging` module](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/), you'll
need to create custom handlers, formatters, and filters to customize a logger's
formatting and output. Loguru simplifies this process by only using its `add()`
method, which takes the following parameters:

- `sink`: specifies a destination for each record produced bu the logger. By
  default, it is set to `sys.stderr`.
- `level`: specifies the minimum log level for the logger.
- `format`: useful for defining a custom format for your logs.
- `filter`: used to determine whether a record should be logged or not.
- `colorize`: takes a boolean value and determines whether or not terminal
  colorization should be enabled.
- `serialize`: causes the log record to be presented in JSON format if set to
  `True`.
- `backtrace`: determines whether the exception trace should extend beyond the
  point where the error is captured, making it easier to debug.
- `diagnose`: determines whether the variable values should be displayed in the
  exception trace. You should set it to `False` in the production environment to
  avoid leaking sensitive information.
- `enqueue`: enabling this option places the log records in a queue to avoid
  conflicts when multiple processes are logging to the same destination.
- `catch`: if an unexpected error happens when logging to the specified `sink`,
  you can catch that error by setting this option to `True`. The error will be
  printed to the standard error.

We will use many of these options to customize the logger as we go further in
this guide.

## Filtering log records

In an earlier section, you used the `level` parameter on the `add()` method to
change the minimum log level on the logger, but this only drops logs that are
lower than the specified severity. If you need to define a more complex criteria
to decide whether or not a log record should be accepted, you can use the
`filter` option as shown below:

```python
[label app.py]
from loguru import logger
import sys

def level_filter(level):
    def is_level(record):
        return record["level"].name == level
    return is_level

logger.remove(0)
logger.add(sys.stderr, filter=level_filter(level="WARNING"))

logger.warning("A warning message.")
```

In this scenario, the `filter` option is assigned to a function that accepts a
`record` variable containing details about the log record. This function returns
`True` if the record's level is the same as the `level` parameter in the
enclosing scope so that it is sent to the `sink`. With this configuration in
place, only `WARNING` level messages will be recorded by the logger.

```text
[output]
2025-05-23 14:24:15.945 | WARNING  | __main__:<module>:15 - A warning message.
```

## Formatting log records

Reformatting the log records generated by Loguru can be done through the
`format` option in the `add()` method. Each log record in Loguru is a Python
dictionary, which contains data such as its timestamp, log level, and more. You
can use the
[formatting directives](https://loguru.readthedocs.io/en/stable/api/logger.html#record)
provided by Loguru to include or rearrange each piece of information as follows:

```python
[label app.py]
import sys
from loguru import logger

logger.remove(0)
[highlight]
logger.add(sys.stderr, format="{time} | {level} | {message}")
[/highlight]

logger.debug("Happy logging with Loguru!")
```

The `format` parameter defines the custom format, which takes three directives
in this example:

- `{time}`: the timestamp,
- `{level}`: the log level,
- `{message}`: the log message.

When you execute the program above, you will observe the following output:

```text
[output]
2025-05-23T14:25:08.635797+0200 | DEBUG | Happy logging with Loguru!
```

Some of these directives also support further customization. For example, the
`time` directive can be changed to a more human-readable format through the
[formatting tokens](https://loguru.readthedocs.io/en/stable/api/logger.html#time)
below:

```python
logger.add(sys.stderr, format="{time:MMMM D, YYYY > HH:mm:ss} | {level} | {message}")
```

This yields the following output:

```text
[output]
May 23, 2025 > 14:25:32 | DEBUG | Happy logging with Loguru!
```

If you prefer to use UTC instead of your local time, you can add `!UTC` at the
end of the time format:

```python
logger.add(sys.stderr, format="{time:MMMM D, YYYY > HH:mm:ss!UTC} | {level} | {message}")
```

```text
[output]
May 23, 2025 > 12:26:04 | DEBUG | Happy logging with Loguru!
```

### Using a structured format

Loguru also supports [structured logging](https://betterstack.com/community/guides/logging/structured-logging/) in JSON format through its `serialize`
option. This lets you output your logs in JSON so that machines can easily parse
and analyze it since the information in each record will be provided in
key/value pairs.

```python
[label app.py]
from loguru import logger
import sys

logger.remove(0)
[highlight]
logger.add(sys.stderr, format="{time:MMMM D, YYYY > HH:mm:ss!UTC} | {level} | {message}", serialize=True)
[/highlight]
logger.debug("Happy logging with Loguru!")
```

```text
[output]
{"text": "May 23, 2025 > 12:26:56 | DEBUG | Happy logging with Loguru!\n", "record": {"elapsed": {"repr": "0:00:00.008704", "seconds": 0.008704}, "exception": null, "extra": {}, "file": {"name": "app.py", "path": "/home/eric/loguru-demo/app.py"}, "function": "<module>", "level": {"icon": "🐞", "name": "DEBUG", "no": 10}, "line": 11, "message": "Happy logging with Loguru!", "module": "app", "name": "__main__", "process": {"id": 44959, "name": "MainProcess"}, "thread": {"id": 8498575424, "name": "MainThread"}, "time": {"repr": "2025-05-23 14:26:56.042220+02:00", "timestamp": 1748003216.04222}}}
```

This output contains a `text` property which is the original log record text
(customizable using the `format` option), as well as the file name and path
(`file`), the log level and its corresponding icon (`level`), and so on. If you
don't need to include everything shown above in the log record, you can create a
custom `serialize()` function and use it as follows:

```python
[label app.py]
import sys
import json
from loguru import logger


def serialize(record):
    subset = {
        "timestamp": record["time"].timestamp(),
        "message": record["message"],
        "level": record["level"].name,
    }
    return json.dumps(subset)


def patching(record):
    record["extra"]["serialized"] = serialize(record)


logger.remove(0)

logger = logger.patch(patching)
logger.add(sys.stderr, format="{extra[serialized]}")
logger.debug("Happy logging with Loguru!")
```

In this example, three variables, `timestamp`, `message` and `level` are
selected in the `serialize()` function, and then the `serialize()` function is
used to modify the `record["extra"]` dictionary in the `patching()` function.
And finally, the `patching()` function is passed to
[the `patch()` method](https://loguru.readthedocs.io/en/stable/api/logger.html#loguru._logger.Logger.patch),
which is used to modify the record dictionary.

Here's the output to expect after running the snippet:

```text
[output]
{"timestamp": 1748003267.346783, "message": "Happy logging with Loguru!", "level": "DEBUG"}
```

[summary]
### Centralize your Loguru logs with Better Stack

Loguru's structured JSON output works seamlessly with [Better Stack](https://betterstack.com/log-management). Forward logs using the native `LogtailHandler` (demonstrated later in this tutorial) or use log shippers like [Vector][https://betterstack.com/docs/logs/vector/]. 


Get live tailing, SQL queries, and automated alerts for your Python applications. All the contextual data you add with `bind()` and `contextualize()` becomes instantly searchable.

**Predictable pricing starting at $0.25/GB.** Start free in minutes.
[/summary]

![Better Stack log management dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)


## Adding contextual data to your logs

Besides the log message, it is often necessary to include other relevant
information in the log entry so that you can use such data to filter or
correlate your logs.

For example, if you are running an online shopping platform and a seller updates
one of their products, you should include the seller and product ID in the log
entry describing this update such that you can easily trace the seller and
product activity over time.

Before you can start logging contextual data, you need to ensure that the
`{extra}` directive is included in your custom format. This variable is a Python
dictionary containing the contextual data for each log entry (if any).

```python
logger.add(sys.stderr, format="{time:MMMM D, YYYY > HH:mm:ss} | {level} | {message} | {extra}")
```

You can subsequently use either `bind()` or `contextualize()` to include extra
information at log point.

The `bind()` method returns a child logger that inherits any existing contextual
data from its parent and creates a custom context at that is subsequently
included with all the records produced by the logger.

```python
[label app.py]
import sys
from loguru import logger

logger.remove(0)
logger.add(sys.stderr, format="{time:MMMM D, YYYY > HH:mm:ss} | {level} | {message} | {extra}")

childLogger = logger.bind(seller_id="001", product_id="123")
childLogger.info("product page opened")
childLogger.info("product updated")
childLogger.info("product page closed")

logger.info("INFO message")
```

```text
[output]
May 23, 2025 > 14:28:42 | INFO | product page opened | {'seller_id': '001', 'product_id': '123'}
May 23, 2025 > 14:28:42 | INFO | product updated | {'seller_id': '001', 'product_id': '123'}
May 23, 2025 > 14:28:42 | INFO | product page closed | {'seller_id': '001', 'product_id': '123'}
May 23, 2025 > 14:28:42 | INFO | INFO message | {}
```

Notice that the `bind()` method does not affect the original `logger`, which
causes it to have an empty `extra` object as shown above. If you wanted to
override the parent logger, you can assign it to the `logger.bind()` as shown
below:

```python
logger = logger.bind(seller_id="001", product_id="123")
```

Another way to update a logger in place is to use the `contextualize()` method,
which modifies its `extra` dictionary directly without returning a new `logger`.
This method needs to be used with the `with` statement:

```python
[label app.py]
import sys
from loguru import logger

logger.remove(0)
logger.add(sys.stderr, format="{time:MMMM D, YYYY > HH:mm:ss} | {level} | {message} | {extra}")

def log():
    logger.info("A user requested a service.")


with logger.contextualize(seller_id="001", product_id="123"):
    log()
```

```text
[output]
May 23, 2025 > 14:29:13 | INFO | A user requested a service. | {'seller_id': '001', 'product_id': '123'}
```

## Logging errors with Loguru

Errors are often the most common target for logging, so it's helpful to see what
tools are provided in the library to handle this use case. You can automatically
log errors as they happen inside a function:

```python
[label app.py]
import sys
from loguru import logger

logger.remove(0)
logger.add(sys.stderr, format="{time:MMMM D, YYYY > HH:mm:ss} | {level} | {message} | {extra}")

def test(x):
    50/x

with logger.catch():
    test(0)
```

In this example, the `test()` function divides 50 by 0 yielding an error. This
error will be caught and logged by the `catch()` method as shown below:

```text
[output]
May 23, 2025 > 14:29:43 | ERROR | An error has been caught in function '<module>', process 'MainProcess' (45732), thread 'MainThread' (8498575424): | {}
Traceback (most recent call last):

> File "/home/eric/loguru-demo/app.py", line 15, in <module>
    test(0)
    └ <function test at 0x1050358a0>

  File /home/eric/loguru-demo/app.py", line 11, in test
    50 / x
         └ 0

ZeroDivisionError: division by zero
```

The error message includes the following information:

- The timestamp: `August 29, 2022 > 12:11:15`.
- The log level: `ERROR`.
- The log message: `An error has been caught in function . . .`.
- The stack trace of the program leading up to the error.
- The type of the error: `ZeroDivisionError: division by zero`.

You can also use a
[decorator](https://docs.python.org/3/glossary.html#term-decorator) instead of
`with` statement:

```python
[label app.py]
[label app.py]
import sys
from loguru import logger

logger.remove(0)
logger.add(sys.stderr, format="{time:MMMM D, YYYY > HH:mm:ss} | {level} | {message} | {extra}")
[highlight]
def test(x):
    return 50/x

with logger.catch():
    test(0)
[/highlight]
```

The `catch()` can also take the following
[parameters](https://loguru.readthedocs.io/en/stable/api/logger.html#loguru._logger.Logger.catch),
allowing you to customize its behavior further:

- `exception`: specifies one or more
  [exception types](https://docs.python.org/3/library/exceptions.html#bltin-exceptions)
  that should be intercepted by the `catch()` method.
- `level`: overwrites the default level for errors (`ERROR`).
- `reraise`: determines whether the exception should be raised again after being
  logged.
- `onerror`: defines a callback function that will be executed when an error has
  been caught.
- `exclude`: creates a blocklist of exception types that should not be caught
  and logged by the `catch()` method.
- `default`: defines the value to be returned if an error occurred in the
  decorated function without being re-raised.
- `message`: overrides the default error message.

Here's an example that demonstrates how to change the level and message of a
logged error:

```python
[label app.py]
[label app.py]
import sys
from loguru import logger

logger.remove(0)
logger.add(sys.stderr, format="{time:MMMM D, YYYY > HH:mm:ss} | {level} | {message} | {extra}")

[highlight]
@logger.catch
def test(x):
    return 50/x

test(0)
[/highlight]
```

When an error occurs in the `test()` function, it will now be logged at the
`CRITICAL` level with a custom message:

```text
[output]
[highlight]
May 23, 2025 > 15:06:25 | ERROR | An error has been caught in function '<module>', process 'MainProcess' (46952), thread 'MainThread' (8498575424): | {}
[/highlight]

Traceback (most recent call last):

> File "/home/eric/loguru-demo/app.py", line 15, in <module>
    test(0)
    └ <function test at 0x1035d8360>

  File "/home/eric/loguru-demo/app.py", line 12, in test
    return 50 / x
                └ 0

ZeroDivisionError: division by zero
```

The `logger.exception()` method is also provided for logging exceptions at the
`ERROR` level:

```python
try:
    1/0
except Exception as e:
    logger.exception(e)
```

## Logging to files

Loguru's `sink` option allows you to choose the destination of all log records
emitted through a `logger`. So far, we've only considered logging to the
console, but you can also push log messages to a local file by changing the
`sink` option like this:

```python
[label app.py]
from loguru import logger

logger.add("loguru.log")
logger.debug("A debug message.")
```

With this in place, the log record will be sent to a new `loguru.log` file in
the current directory, and you can check its contents with the following
command:

```command
cat loguru.log
```

```text
[output]
2025-05-23 15:11:15.198 | DEBUG    | __main__:<module>:4 - A debug message.
```

When `sink` is pointing to a file, the `add()` method provides a few more
options for customizing how the log file should be handled:

- `rotation`: specifies a condition in which the current log file will be closed
  and a new file will be created. This condition can be an `int`, `datetime` or
  `str`, and `str` is recommended since it is more human-readable.
- `retention`: specifies how log each log file will be retained before it is
  deleted from the filesystem.
- `compression`: the log file will be converted to the specified compression
  format if this option is set.
- `delay`: if set to `True`, the creation of a new log file will be delayed
  until the first log message is pushed.
- `mode`, `buffering`, `encoding`: These parameters will be passed to Python's
  `open()` function which determines how Python will open the log files.

When `rotation` has an `int` value, it corresponds to the maximum number of
bytes the current file is allowed to hold before a new one is created. When it
has a `datetime.timedelta` value, it indicates the frequency of each rotation,
while `datetime.time` specifies the time of the day each rotation should occur.
And finally, `rotation` can also take a `str` value, which is the human-friendly
variant of the aforementioned types.

```python
[label app.py]
from loguru import logger

[highlight]
logger.add("loguru.log", rotation="5 seconds")
[/highlight]
logger.debug("A debug message.")
```

In this example, log rotation will occur every five seconds (for demonstration
purposes), but you should set a longer duration in a real-world application. If
you run the snippet above, a `loguru.log` file will be generated, and written to
until the period specified has elapsed. When that happens, the file is renamed
to `loguru.<timestamp>.log` and a new `loguru.log` file is created afterward.

You can also set up the logger to clean up old files like this:

```python
logger.add("loguru.log", rotation="5 seconds", retention="1 minute")
```

```python
logger.add("loguru.log", rotation="5 seconds", retention=3)
```

In this first snippet, files older than one minute will be removed
automatically. In the second one, only the three newest files will be retained.
If you're deploying your application to Linux, we recommend that you utilize
[logrotate](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) for log file
rotation so that your application does not have to directly address such
concerns.

## Using Loguru in a Django application

In this section, you will implement a logging system through Loguru for a
[demo world clock application](https://github.com/betterstack-community/django-world-clock)
where users can search for a location and get its current time. (See the
[logging branch](https://github.com/betterstack-community/django-world-clock/tree/logging)
for the final implementation).

Begin by exiting the `loguru-demo` directory and deactivating the virtual environment, then clone the project repository to your local machine:

```command
git clone https://github.com/betterstack-community/django-world-clock.git
```

Next, change into the `django-world-clock` directory and also into the
`djangoWorldClock` subdirectory:

```command
cd django-world-clock/djangoWorldClock
```

You can observe the structure of the project by using the `tree` command:

```command
tree
```

```text
[output]
├── djangoWorldClock
│   ├── asgi.py
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
├── requirements.txt
├── templates
│   ├── fail.html
│   ├── home.html
│   ├── layout.html
│   └── success.html
└── worldClock
    ├── admin.py
    ├── apps.py
    ├── __init__.py
    ├── migrations
    │   └── __init__.py
    ├── models.py
    ├── tests.py
    └── views.py
```

Go ahead and install the necessary dependencies by executing the command below:

```command
pip install -r requirements.txt
```

Afterward, run the migrations for the project:

```command
python manage.py migrate
```

Once the migrations have been carried out, execute the command below to launch
the application server:

```command
python manage.py runserver
```

```text
[output]
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
May 23, 2025 - 13:22:12
Django version 4.1.1, using settings 'djangoWorldClock.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

You can access this world clock app by opening your browser and heading to
`http://localhost:8000`.

You should land on the following page:

![The Home Page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/92c8d605-ed58-4201-fdf2-7b85499cff00/md2x =3248x1996)

When you search for a city and the query is successful, you will observe the
following result:

![Search Successful](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d93a1d77-4b54-4451-b889-821ec0833d00/orig =3248x1996)

If the location is not found, an error message will be displayed:

![Search Not Successful](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8b364493-b088-4f33-3989-d1cb65ebf600/md1x =3248x1996)

In the terminal, you'll notice that some log messages are outputted for each
request even though we haven't configured any logging setup for the project:

```text
[output]
[26/May/2025 08:47:24] "GET /favicon.ico HTTP/1.1" 404 2327
[26/May/2025 08:47:30] "GET / HTTP/1.1" 200 1068
d[26/May/2025 08:47:31] "GET /favicon.ico HTTP/1.1" 404 2327
[26/May/2025 08:47:45] "POST /search/ HTTP/1.1" 200 1179
```

This is due to Django's default logging setup which uses the standard library
[logging module](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/). Go ahead and disable it by
adding the following line to the `djangoWorldClock/settings.py` file:

```python
[label  djangoWorldClock/settings.py]
...
LOGGING_CONFIG = None
```

The server will restart after saving the file, and you won't observe the default
request logs anymore. In a subsequent section, you'll create a middleware
function that uses Loguru to record incoming request information.

## Adding Loguru to your Django project

Now that we've set up the project, let's go ahead and implement a basic logging
strategy using the features described earlier in this tutorial. Since `loguru`
is already installed (per `requirements.txt`), you can go right ahead and use it
in your project.

Import it into the `worldClock/views.py` file and configure it as follows:

```python
[label worldClock/views.py]
from django.shortcuts import render, redirect
import requests
[highlight]
import sys
import time
from loguru import logger

logger.remove(0)
logger.add(sys.stderr, format="{time:MMMM D, YYYY > HH:mm:ss!UTC} | {level} | {message} | {extra}")
[/highlight]

. . .
```

The above configuration ensures that each log record is written to the standard
error in the specified format.

## Creating a request logging middleware

Once you've added Loguru to your application, create a middleware function that
logs each HTTP request as follows:

```command
touch worldClock/middleware.py
```

```python
[label worldClock/middleware.py]
from loguru import logger
import uuid
import time

def logging_middleware(get_response):
    def middleware(request):
        # Create a request ID
        request_id = str(uuid.uuid4())

        # Add context to all loggers in all views
        with logger.contextualize(request_id=request_id):

            request.start_time = time.time()

            response = get_response(request)

            elapsed = time.time() - request.start_time

            # After the response is received
            logger.bind(
                path=request.path,
                method=request.method,
                status_code=response.status_code,
                response_size=len(response.content),
                elapsed=elapsed,
            ).info(
                "incoming '{method}' request to '{path}'",
                method=request.method,
                path=request.path,
            )

            response["X-Request-ID"] = request_id

            return response

    return middleware
```

The above snippet defines a middleware function that creates a request ID and
adds it to the logger's context. This makes it accessible in all the logging
calls defined in the request handlers. Once response is received, a
corresponding log entry for the request will be printed to the console.

Before the middleware function can take effect, you need to activate it by
editing your `djangoWorldClock/settings.py` file as follows:

```command
code djangoWorldClock\settings.py
```

```python
[label djangoWorldClock/settings.py]
. . .
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    [highlight]
    'worldClock.middleware.logging_middleware'
    [highlight]
]
. . .
```

Once you save the file, the server should restart and you will observe the
following request log when you make a load up the application's homepage in the
browser.

```text
[output]
May 26, 2025 > 09:01:59 | INFO | incoming 'GET' request to '/' | {'request_id': 'f235cdbb-849b-4304-b91c-74ca029362d4', 'path': '/', 'method': 'GET', 'status_code': 200, 'response_size': 1068, 'elapsed': 0.0042858123779296875}
```

As you can see, the `request_id` is included in the log entry along with other
relevant details about the request, thus effectively replacing the default
request logging facility in Django. You are now set up to track every single
request that is made to your application, and you can easily see if the request
succeeded or not and how long it took to complete.

In the next section, we will discuss logging in the view functions and you'll
see more about how logging can help you diagnose the various happenings in your
application effectively.

## Logging in Django view functions

Head back to the `views.py` file and edit the `home()` and `search()` views as
follows:

```python
[label worldClock/views.py]
. . .

def home(request):
[highlight]
    logger.trace("homepage visited")
[/highlight]
    return render(request, "home.html")


def search(request):
    # If the request method is not POST, redirect to the home page
    if request.method != "POST":
[highlight]
        logger.info(
            "redirecting '{method}' request to '{path}' to '/'",
            method=request.method,
            path=request.path,
        )
[/highlight]
        return redirect("/")

    # Get the search query
    query = request.POST.get("q", "")
[highlight]
    searchLogger = logger.bind(query=query)

    searchLogger.info("incoming search query for '{query}'", query=query)
[/highlight]

    try:
        # Add proper headers for Nominatim API
        headers = {"User-Agent": "Django World Clock App (your-email@example.com)"}

        # Pass the search query to the Nominatim API to get a location
        location_response = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={"q": query, "format": "json", "limit": "1"},
            headers=headers,
        )
[highlight]
        searchLogger.bind(location=location_response).debug("Nominatim API response")
[/highlight]

        # Check if the response is successful before trying to parse JSON
        if location_response.status_code == 200:
            location = location_response.json()
        else:
            return render(request, "500.html")

        # If a location is found, pass the coordinate to the Time API to get the current time
        if location:
            coordinate = [location[0]["lat"], location[0]["lon"]]

            time_response = requests.get(
                "https://timeapi.io/api/Time/current/coordinate",
                params={"latitude": coordinate[0], "longitude": coordinate[1]},
            )
[highlight]
            searchLogger.bind(time=time).debug("Time API response")

            searchLogger.bind(coordinate=coordinate).trace(
                "Search query '{query}' succeeded without errors"
            )
[/highlight]

            if time_response.status_code == 200:
                return render(
                    request,
                    "success.html",
                    {"location": location[0], "time": time_response.json()},
                )
            else:
                return render(request, "500.html")
        # If a location is NOT found, return the error page
        else:
[highlight]
            searchLogger.info("location '{query}' not found", query=query)
[/highlight]
            return render(request, "fail.html")

    except Exception as error:
[highlight]
        searchLogger.exception(error)
[/highlight]
        return render(request, "500.html")
```

In the `home()` view, a trace log is added so that you can track that the
function was called when tracing through your application. This log entry will
not be produced unless the `level` option is set to `TRACE` in the
`logger.add()` function.

```python
from django.shortcuts import render, redirect
import requests
import sys
from loguru import logger

logger.remove(0)
logger.add(
    sys.stderr,
    format="{time:MMMM D, YYYY > HH:mm:ss!UTC} | {level} | {message} | {extra}",
    [highlight]
    level="TRACE"
    [/highlight]
)
...
```

Notice how the `request_id` is present in both entries below. Its presence lets
you easily correlate your logs and trace the execution path of a request in your
application.

```text
[output]
[highlight]
May 26, 2025 > 09:11:21 | TRACE | homepage visited | {'request_id': 'b87db028-99ed-4214-9429-ee245e9008ed'}
[/highlight]
May 26, 2025 > 09:11:21 | INFO | incoming 'GET' request to '/' | {'request_id': 'b87db028-99ed-4214-9429-ee245e9008ed', 'path': '/', 'method': 'GET', 'status_code': 200, 'response_size': 1068, 'elapsed': 0.004179239273071289}
```


Once we have a valid search query, it is bound to a new `searchLogger` so that
it is included in each log entry created by the logger. We can see that on the
next line where the search query is acknowledged:

```text
[output]
May 26, 2025 > 09:23:11 | INFO | incoming search query for 'london' | {'request_id': '0b9a480c-f176-4c31-a64d-1804e4b006d9', 'query': 'london'}
```

Within the `try` block, the results from the two API requests to the Nominatim
and Time API are logged at the `DEBUG` level as they are useful for debugging:

```text
[output]
May 26, 2025 > 09:23:15 | DEBUG | Nominatim API response | {'request_id': '0b9a480c-f176-4c31-a64d-1804e4b006d9', 'query': 'london', 'location': <Response [200]>}
May 26, 2025 > 09:23:17 | DEBUG | Time API response | {'request_id': '0b9a480c-f176-4c31-a64d-1804e4b006d9', 'query': 'london', 'time': <module 'time' (built-in)>}
```

If the location entered by the user isn't valid, an error page will be displayed
in the browser, and the following message is logged at the `INFO` level:

```text
[output]
May 26, 2025 > 09:24:38 | INFO | location 'nonexistentcity' not found | {'request_id': 'b264840b-f4c2-447b-ace3-8aa5b293dd0c', 'query': 'nonexistentcity'}
```

Finally, any other exception will be logged at the `ERROR` level using the
`exception()` helper function:

```text
[output]
May 26, 2025 > 06:18:48 | ERROR | list index out of range | {'request_id': 'b582b6f2-2917-4f76-8012-3197b235a222', 'query': 'nonexistent'}
Traceback (most recent call last):

  File "/usr/lib64/python3.10/threading.py", line 973, in _bootstrap

. . .
```

You may notice that the traceback included in the exception message is huge.
Therefore, we recommend disabling the `backtrace` option on the `logger` to
ensure that the traceback is not extended beyond the catching point. You should
also set the `diagnose` option to `False`.

```python
logger.add(
    sys.stderr,
    format="{time:MMMM D, YYYY > HH:mm:ss!UTC} | {level} | {message} | {extra}",
    level="TRACE",
    [highlight]
    backtrace=False,
    diagnose=False
    [/highlight]
)
```

```text
[output]
May 26, 2025 > 06:27:00 | ERROR | list index out of range | {'request_id': 'c3a053fc-0156-465c-96cd-6c8074ac527c', 'query': 'nonexistent'}
Traceback (most recent call last):

  File "/home/ayo/dev/betterstack/community/demo/django-world-clock/djangoWorldClock/worldClock/views.py", line 58, in search
    coordinate = [location[0]["lat"], location[0]["lon"]]
IndexError: list index out of range
```

## Centralizing and monitoring your logs

Logging to the standard error is great in development environments, but a more permanent solution needs to be implemented for production environments. 

You can log to rotating files as described earlier, but this means that you have to log into each server where your application is deployed to view the logs. The most practical solution is to centralize all your logs so they can be viewed, analyzed, and monitored in one place.

![Better Stack log management dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)


There are several strategies for centralizing and monitoring logs but the simplest one usually involves sending your logs to a hosted cloud log management service. Once you configure your application or its environment to send logs to the service, you'll be able to monitor new entries in realtime, and set up alerting so you don't miss notable events.

 In this section, you will send the logs produced by the World Clock application to [Better Stack Telemetry](https://betterstack.com/telemetry).

Before you can ingest logs to Better Stack, you need to [create a free account](https://betterstack.com/telemetry) and navigate to the **Sources** section in the left-hand menu, then click the **Connect source** button.

![Screenshot of Better Stack Telemetry sources page showing the Sources menu item and Connect source button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7199f84f-b711-4aef-8fc0-7bef50395900/lg2x =3024x1846)



Give your source a suitable name and select **Python** as your platform, then click the **Create source** button.

![Create source dialog showing name field and Python platform selection](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2bb6d595-03b3-4dbc-ebac-00508667e600/lg2x =3024x3928)


Once the source is created, you'll be provided with a source token (e.g., `qU73jvQjZrNFHimZo4miLdxF`) and an ingestion host (e.g., `s1315908.eu-nbg-2.betterstackdata.com`). Make sure to copy both, as they’re required to configure log forwarding.

![Created source page showing the source token and ingestion host that need to be copied](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ff693e8f-0abf-41c1-33e5-610716df2500/public =3024x3180)


The `logtail-python` package should already be installed as part of `requirements.txt`, but just in case you did not follow this tutorial from the start, you can install the Better Stack Python package using the following command:

```command
pip install logtail-python
```

```text
[output]
Collecting logtail-python
 Downloading logtail_python-0.1.3-py2.py3-none-any.whl (8.0 kB)
. . .
Installing collected packages: msgpack, urllib3, idna, charset-normalizer, certifi, requests, logtail-python
Successfully installed certifi-2022.6.15 charset-normalizer-2.1.3 idna-3.3 logtail-python-0.1.3 msgpack-1.0.4 requests-2.28.1 urllib3-1.26.11
```

Head back to `views.py`, and add the Better Stack handler to the logger:

```python
[label worldClock/views.py]
from django.shortcuts import render, redirect
import requests
import sys
import time
from loguru import logger
[highlight]
from logtail import LogtailHandler
logtail_handler = LogtailHandler(
    source_token="<your_source_token>", 
    host="https://<your_ingesting_host>"
)
[/highlight]
logger.remove(0)
logger.add(
    sys.stderr,
    format="{time:MMMM D, YYYY > HH:mm:ss!UTC} | {level} | {message} | {extra}",
    level="TRACE",
    backtrace=False,
    diagnose=False,
)
[highlight]
logger.add(
    logtail_handler,
    format="{message}",
    level="INFO",
    backtrace=False,
    diagnose=False,
)
[/highlight]
. . .
```

Notice how Loguru makes it easy to log to a different location using different settings. The `LogtailHandler` now requires both the source token and the ingesting host that you copied from the Better Stack interface. 

Once your configuration is complete, your logs will start streaming in real time. Open your browser and navigate to `http://127.0.0.1:8000/`, then search for a city.

Next, head over to Better Stack and click the **Live tail** option in the left-hand menu. You can filter the logs using the dropdown in the top-left corner to focus on specific sources.

![Better Stack Telemetry sources filter](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4e7f7cfb-49d9-4fdd-2eeb-acb1b6093800/orig =3024x1530)

You’ll see that Loguru is actively generating and forwarding application logs as expected. Click on any log entry to expand it and view its detailed properties.


![Better Stack Live tail page showing the incoming Python logs from the applicationg](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ad643073-12a8-4515-7fd9-4be97572b100/md2x =3024x2022)

To explore Live tail's advanced features for filtering, searching, and analyzing your logs, watch this walkthrough:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="Better Stack Live Tail - Search and analyze logs in real-time" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


From this point onwards, all your application logs will be centralized in Better Stack Telemetry. You can easily apply filters to find the information you need or set up alerts to notify you whenever your logs match certain conditions.

## Migrating from logging to Loguru

Before wrapping up this tutorial, let's discuss a few things you're likely to
encounter when attempting a migration from the standard library `logging` module
to Loguru.

First, when you are using the logging module, it is common to use the
`getLogger()` function to initialize a logger. This is not necessary with Loguru
as you only need to import the logger, and you are good to go. Each time this
imported logger is used, it will automatically contain the contextual `__name__`
value.

```python
# Using Python default logger
logger = logging.getLogger('my_app')

# Using Loguru. This is sufficient, the logger is ready to use.
from loguru import logger
```

When using the `logging` module, you need to set up a `Handler`, `Filter`,
`Formatter`, and other related objects to configure the logger. In Loguru, you
only need to use the `add()` method so you can replace:

```python
# Using Python default logger
logger.setLevel(logging.INFO)

formatter = logging.Formatter(. . .)
handler = logging.Handler(. . .)

handler.setFormatter(formatter)

filter = logging.Filter(. . .)

. . .

logger.addHandler(handler)
logger.addFilter(filter)
```

with this:

```python
# Using loguru
logger.add(sink=. . ., level='. . .', format='. . .', filter=. . .)
```

The `format` setting requires some special attention here. If you are using
[`%` style parameter](https://docs.python.org/3/library/stdtypes.html#str.format)
with the `Formatter` object, you need to replace them with
[`{}` style format](https://docs.python.org/3/library/stdtypes.html#str.format).
For instance, `%(username)s` can be replaced with `{username}`, and
`logger.debug("User: %s", username)` will need to be replaced with
`logger.debug("User: {}", username)`.

Loguru is also fully compatible with existing `Handler` objects created using
the `logging` module so it is possible to add them directly. This could save you
some time if you have a complicated setup and you don't want to rewrite
everything.

```python
from loguru import logger
import logging

handler = logging.FileHandler(filename='my_app.log')

logger.add(handler)
```

See the
[Loguru migration guide](https://loguru.readthedocs.io/en/stable/resources/migration.html)
more details regarding switching from the standard `logging` module.

## Final thoughts

In this tutorial, we discussed the Loguru package, a fully-featured alternative
to the default `logging` module which aims to ease the process of logging in
Python. **We demonstrated practical examples of how to utilize it in a Django
application**, and how to centralize all your logs with Better Stack.

Loguru's structured logging with contextual data (like request IDs, query parameters, and custom bindings) **makes it particularly powerful when combined with Better Stack's log management capabilities**. You can search logs by any field, create dashboards to visualize patterns, and set up alerts for error spikes or slow queries. This combination gives you production-grade observability with minimal setup effort.

To learn more about Loguru, check out its
[GitHub repository](https://github.com/Delgan/loguru) and
[official documentation](https://loguru.readthedocs.io/en/stable/index.html). For [the most common Python errors](https://betterstack.com/community/guides/scaling-python/python-errors/) check our list where we provide their respective solutions.

Thanks for reading, and happy logging!