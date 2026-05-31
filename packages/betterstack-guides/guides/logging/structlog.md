# A Comprehensive Guide to Python Logging with Structlog

Structlog is an open-source logging tool for Python known for its simple API,
performance, and quality of life features. It has been used in production since
2013 and has evolved over the years to incorporate recent major changes in
Python such as [asyncio](https://docs.python.org/3/library/asyncio.html) and
[type hints](https://docs.python.org/3/library/typing.html).

This tutorial explores the essential aspects of Structlog. We will delve into
formatting logs, applying filters, incorporating contextual data, seamlessly
integrating Structlog with the Python standard logging library, and much more.
Finally, we'll demonstrate how to seamlessly integrate Structlog into a Django
web application, unlocking its full potential for your projects.

[summary]

## Side note: Visualize your Structlog logs in real time

Centralizing logs isn’t only about storage. It’s also about making them easy to explore. With [Better Stack](https://betterstack.com/logs), you can watch Structlog events stream in live, filter by fields, and quickly spot patterns across requests and services.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
[/summary]

## Prerequisites

Before proceeding with this tutorial, ensure you have the latest version of
Python (3.11 at the time of writing). If you don't have Python installed, find
the [download instructions here](https://www.python.org/downloads/).

Once you have Python installed, create a directory that will contain the code
samples, then change into the directory:

```command
mkdir structlog_demo && cd structlog_demo
```

Next, create a virtual environment to avoid dependency conflicts on your system
and activate:

```command
python3 -m venv venv
```

```command
source venv/bin/activate
```

When the virtual environment is active, the terminal will be prefixed with your
virtual environment's name in parenthesis. You are now all set to continue with
the remainder of this article.

## Getting started with Structlog

Before you can start logging with Structlog, you must download the package into
your project with the following command:

```command
python -m pip install structlog
```

```text
[output]
Collecting structlog
  Downloading structlog-25.4.0-py3-none-any.whl.metadata (7.6 kB)
Downloading structlog-25.4.0-py3-none-any.whl (68 kB)
Installing collected packages: structlog
Successfully installed structlog-25.4.0
```

After installing Structlog, create an `app.py` file using a text editor of your
choice and add the following code to log with Structlog:

```python
[label app.py]
import structlog

logger = structlog.get_logger()
logger.info("Logging with structlog")
```

Structlog provides a pre-configured logger by default, which you access by
invoking the `structlog.get_logger()` method. The `info()` method is used on the
resulting logger to record messages at the `INFO` level.

Save the file and run the program with the following command:

```command
python app.py
```

```text
[output]
2025-06-06 15:46:27 [info     ] Logging with structlog
```

The output shows the following:

- `2025-06-06 15:46:27`: the time stamp.
- `info`: the severity level of the log message.
- `Logging with structlog`: the log message.

## Understanding log levels in Structlog

[Log levels](https://betterstack.com/community/guides/logging/log-levels-explained/) are labels that indicate the importance or
severity of the message. Structlog retains the five log levels found in the
[logging module](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/):

- `DEBUG`(10): used to log information that is useful for debugging the program.
- `INFO`(20): indicates a normal event in the program.
- `WARNING`(30): tracks events that indicate potential issues or anomalies that
  might not be critical but should be noted and addressed soon.
- `ERROR`(40): indicates an error concerning an operation in your application
  that is fatal to that operation alone.
- `CRITICAL`(50): indicates a severe problem that can force the application to
  shutdown, and must be investigated right away.

Each of the log levels mentioned has a corresponding logging method that you can
invoke on a logger:

```python
[label app.py]
import structlog

logger = structlog.get_logger()

logger.debug("Database connection established")
logger.info("Processing data from the API")
logger.warning("Resource usage is nearing capacity")
logger.error("Failed to save the file. Please check permissions")
logger.critical("System has encountered a critical failure. Shutting down")
```

```text
[output]
2025-06-06 15:47:07 [debug    ] Database connection established
2025-06-06 15:47:07 [info     ] Processing data from the API
2025-06-06 15:47:07 [warning  ] Resource usage is nearing capacity
2025-06-06 15:47:07 [error    ] Failed to save the file. Please check permissions
2025-06-06 15:47:07 [critical ] System has encountered a critical failure. Shutting down
```

The messages are colored based on the severity of the message:

![Screenshot showing log messages color-coded by severity level, including info, warning, and error entries](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/82cb1223-6034-4827-37c5-af0cf0bf6100/md1x =1362x1170)

Now that you are familiar with Structlog's severity levels and their
corresponding methods, let's move on you can move on to filtering log entries.

### Setting the default log level

Unlike other logging packages, Structlog does not do any level-based filtering
by default. To filter the logs based on the level, you need to configure
Structlog using its `configure()` method:

```python
[label app.py]
import structlog
[highlight]
import logging
[/highlight]


[highlight]
structlog.configure(
    wrapper_class=structlog.make_filtering_bound_logger(logging.WARNING)
)
[/highlight]
logger = structlog.get_logger()
. . .
```

The `structlog.make_filtering_bound_logger()` method allows you to set a desired
minimum level. The method makes use of the Python standard logging library
levels, hence why you import the library in the second line. The logging library
is only used to provide the log level to Structlog and nothing else.

When you run the file again, you will only see messages with a severity level of
`WARNING` or higher:

```text
[output]
2025-06-06 15:51:42 [warning  ] Resource usage is nearing capacity
2025-06-06 15:51:42 [error    ] Failed to save the file. Please check permissions
2025-06-06 15:51:42 [critical ] System has encountered a critical failure. Shutting down
```

Alternatively, you can also pass the integer value associated with the level
like so:

```python
. . .
structlog.configure(
    wrapper_class=structlog.make_filtering_bound_logger(30)
    )
. . .
```

Another option to consider is using environment variables. This will allow you
to change the minimum log level without having to change the code:

```python
[label app.py]
import structlog
import logging
[highlight]
import os
[/highlight]

[highlight]
level = os.environ.get("LOG_LEVEL", "INFO").upper()
LOG_LEVEL = getattr(logging, level)
structlog.configure(
    wrapper_class=structlog.make_filtering_bound_logger(LOG_LEVEL))
[/highlight]
logger = structlog.get_logger()

logger.debug("Database connection established")
logger.info("Processing data from the API")
logger.warning("Resource usage is nearing capacity")
logger.error("Failed to save the file. Please check permissions")
logger.critical("System has encountered a critical failure. Shutting down")
```

The `os.environ.get()` method access the `LOG_LEVEL` environmental variable and
capitalizes the string value. It defaults to `INFO` if the `LOG_LEVEL` variable
is not set. Afterwards, the `getattr()` method is used to translate the level
string into a valid log level. Finally, the `make_filtering_bound_logger()`
method is updated accordingly.

You can test this out by setting the environment variable when you run the file
as shown below:

```command
LOG_LEVEL=error python app.py
```

```text
[output]
2025-06-06 15:53:17 [error    ] Failed to save the file. Please check permissions
2025-06-06 15:53:17 [critical ] System has encountered a critical failure. Shutting down
```

That takes care of level-based filtering. In the next section, you will learn
how to format the log records.

## Formatting log records

You can format log records with Structlog using processors which are functions
that customize log messages. Structlog has
[built-in processors](https://www.structlog.org/en/stable/api.html#module-structlog.processors)
that can add timestamps, log levels or modify a log format to mention a few.
These processors can be composed into a processor chain. When a processor
modifies a log entry, it passes the modified value to the next processor. To
understand this fundamental idea, we will add each processor individually
starting with the following example:

```python
[label app.py]
import structlog

structlog.configure(
    [highlight]
    processors=[
        structlog.dev.ConsoleRenderer(),
    ]
    [/highlight]
)
logger = structlog.get_logger()
logger.info("An info message")
```

In the preceding snippet, you added a `ConsoleRenderer()` processor to the
`processors` list. The method receives an event dictionary and formats every
property as `key=value` pairs aside from the timestamp, log level, and log
message. Then, it displays the value in the console.

Running the file generates the following output:

```text
[output]
An info message
```

As you can observe from the output, only the log message is logged in the
console. There is no severity level or a timestamp as before. For the log entry
to have a log level or timestamp, you will have to add a processor to attach the
information you want. Structlog provides an `add_log_level` processor that adds
a log level to a log entry. Add the highlighted code to add the processor:

```python
[label app.py]
import structlog

structlog.configure(
    processors=[
        [highlight]
        structlog.processors.add_log_level,
        [/highlight]
        structlog.dev.ConsoleRenderer(),
    ]
)
logger = structlog.get_logger()
logger.info("An info message")
```

The log entry now displays the severity level:

```text
[output]
[info     ] An info message
```

When the `info()` logging method is invoked, Structlog constructs an event
dictionary containing the message passed to the method. It then passes the event
dictionary to the first processor in the list, which is the `add_log_level`
method here.

This method adds a severity level property to the dictionary and returns the
same dictionary to the next processor. The `ConsoleRenderer()` then takes the
event dictionary, converts it to a string, and displays it in the console.

Therefore, if you messed up the processor order like this:

```python
[label app.py]
. . .
structlog.configure(
    processors=[
        structlog.dev.ConsoleRenderer(),
        structlog.processors.add_log_level,
    ]
)
```

You would receive an error:

```text
[output]
 "TypeError: 'str' object does not support item assignment".
```

The issue here is that `add_log_level` expects an event dictionary so that it
can add a log level property. Instead, it receives a string and attempts to add
the property to it triggering the error.

Therefore, ensure that the processor that handles output is always the last one
in the chain.

### Customizing the timestamp

At this point, the log entry has no timestamp.
[Timestamps are crucial](https://betterstack.com/community/guides/logging/log-formatting/#always-include-the-timestamp)
since they let you know when the log entry was made, allowing for log filtering
log messages based on the date or time.

Structlog provides the `TimeStamper()` processor that adds timestamps to log
entries:

```python
[label app.py]
import structlog

structlog.configure(
    processors=[
        [highlight]
        structlog.processors.TimeStamper(),
        [/highlight]
        structlog.processors.add_log_level,
        structlog.dev.ConsoleRenderer(),
    ]
)

logger = structlog.get_logger()
logger.info("An info message")
```

```text
[output]
1749218120.31536 [info     ] An info message
```

This timestamp is a Unix epoch representing the number of seconds that have
elapsed from January 1, 1970 12:00am UTC. To make the timestamp more human
readable, you can pass an `fmt` option and set it to the
[ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) format:

```python
[label app.py]
. . .
structlog.configure(
    processors=[
        [highlight]
        structlog.processors.TimeStamper(fmt="iso"),
        [/highlight]
        structlog.processors.add_log_level,
        structlog.dev.ConsoleRenderer(),
    ]
)
. . .
```

```text
[output]
2025-06-06T13:55:40.717123Z [info     ] An info message
```

The ISO-8601 format is a popular and recommended standard for formatting date
and time in logs since it can record timezones. We recommend sticking to UTC
time to remove the ambiguity of time zones or international boundaries.

In rare cases where you want to use a completely custom format, you can do it
with
[strftime format codes](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes):

```python
structlog.processors.TimeStamper(fmt="%Y-%m-%d %H:%M.%S"),
```

Most often, the ISO-8601 format is all you need.

## Adding custom fields to logs

Structlog also allows you to define custom fields. For example, you might want
your logs to include a process ID, hostname, or the Python version. As of this
writing, Structlog doesn't have built-in processors to add this kind of
information. So you need to create a custom processor to add them.

In this section, you will define a custom processor that adds a process ID to
the log entry. Building upon the example in the previous section, add the
highlighted code:

```python
[label app.py]
import structlog
[highlight]
import os
[/highlight]

[highlight]
def set_process_id(_, __, event_dict):
    event_dict["process_id"] = os.getpid()
    return event_dict
[/highlight]


structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        [highlight]
        set_process_id,
        [/highlight]
        structlog.dev.ConsoleRenderer(),
    ]
)
. . .
```

Structlog processors receive three arguments: the logger, method name (such as
`info`), and an event dictionary. In the `set_processor_id` function, the first
two parameters are not being used but `event_dict` is used to add a custom
property to the log which in this case is the process ID.

To make Structlog aware of the `set_process_id()` custom processor, you must add
it to the processor chain. When you run the file, you will see the process ID in
the log record:

```text
[output]
2025-06-06T13:56:46.479795Z [info     ] An info message                process_id=55798
```

## Logging in JSON

Structlog provides a `JSONRenderer()` processor for [creating structured logs](https://betterstack.com/community/guides/logging/structured-logging/)
using the JSON format. You only need to replace the `ConsoleRenderer()` with the
highlighted line:

```python
[label app.py]
. . .
structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        set_process_id,
        [highlight]
        structlog.processors.JSONRenderer(),
        [/highlight]
    ]
)
logger = structlog.get_logger()
[highlight]
logger.info("Log entry in JSON format")
[/highlight]
```

The `JSONRenderer()` processor renders the log in a structured form as displayed
in the output:

```json
[output]
{"event": "Log entry in JSON format", "timestamp": "2025-06-06T13:57:18.255548Z", "level": "info", "process_id": 55971}
```

The `event` key records the log message, but you can rename it to something more
typical using the `EventRenamer()` processor. Add the following line to rename
`event` to `msg`:

```python
[label app.py]
. . .
structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        set_process_id,
        [highlight]
        structlog.processors.EventRenamer("msg"),
        [/highlight],
        structlog.processors.JSONRenderer(),
    ]
)
. . .
```

```json
[output]
{"timestamp": "2025-06-06T13:57:41.468587Z", "level": "info", "process_id": 56113, "msg": "Log entry in JSON format"}
```

Now the `event` property has been renamed to `msg`.

[summary]

## Side note: Structlog JSON logs are perfect for Better Stack

Once you switch Structlog to JSON output, you can pipe those structured events straight into [Better Stack](https://betterstack.com/logs), so you can filter issues instantly and correlate events across services without regex-heavy searching.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="Better Stack Live tail demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Adding contextual data to your logs

Now that you know how to create structured logs, filtering to find the logs you
want to read will be much easier. But without adding relevant contextual data,
it can be difficult to understand the sequence of events leading up to the log.

To remedy this, you can include contextual data each a log message. In a web
application, such data could be the request ID, HTTP status code, resource ID
and more.

With Structlog, you can add the contextual data at log point using key-value
pairs:

```python
[label app.py]
import structlog

structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ]
)
logger = structlog.get_logger()
logger.info("Comment created", name="John Doe", post_id=2, comment_id="1")
logger.info("Comment created", name="Bob Foster", post_id=2, comment_id="2")
logger.info("Comment created", name="Jane Miles", post_id=2, comment_id="3")
```

All the key-value pairs passed to the `info()` method calls are attached to the
log message as shown in the output:

```json
[output]
{"name": "John Doe", "post_id": 2, "comment_id": "1", "event": "Comment created", "level": "info", "timestamp": "2025-06-06T13:58:08.937636Z"}
{"name": "Bob Foster", "post_id": 2, "comment_id": "2", "event": "Comment created", "level": "info", "timestamp": "2025-06-06T13:58:08.937869Z"}
{"name": "Jane Miles", "post_id": 2, "comment_id": "3", "event": "Comment created", "level": "info", "timestamp": "2025-06-06T13:58:08.937889Z"}
```

Notice how `post_id` is repeated in at each `info()` call. To avoid this
repetition, you can bind key-value pairs to the logger via its `bind()` method:

```python
[label app.py]
. . .
logger = structlog.get_logger()
[highlight]
post_logger = logger.bind(post_id=2)

post_logger.info("Comment created", name="John Doe", comment_id="1")
post_logger.info("Comment created", name="Bob Foster", comment_id="2")
post_logger.info("Comment created", name="Jane Miles", comment_id="3")
[/highlight]
```

The output is similar to the previous one, but the log methods have no
repetition:

```json
[output]
{"post_id": 2, "name": "John Doe", "comment_id": "1", "event": "Comment created", "level": "info", "timestamp": "2025-06-06T13:59:43.658503Z"}
{"post_id": 2, "name": "Bob Foster", "comment_id": "2", "event": "Comment created", "level": "info", "timestamp": "2025-06-06T13:59:43.658695Z"}
{"post_id": 2, "name": "Jane Miles", "comment_id": "3", "event": "Comment created", "level": "info", "timestamp": "2025-06-06T13:59:43.658711Z"}
```

In a web application, if you want information like the request ID in all logs,
you only need to invoke the `bind()` method in the middleware.

## Log filtering with Structlog

Log filtering in Structlog is achieved through processors. You can filter an
event based on any property in the event dictionary and raise the
`structlog.DropEvent` exception to drop the event as demonstrated in this
example:

```python
 [label app.py]
import structlog


def drop_messages(_, __, event_dict):
    if event_dict.get("route") == "login":
        raise structlog.DropEvent
    return event_dict


structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        drop_messages,
        structlog.processors.JSONRenderer(),
    ]
)
logger = structlog.get_logger()
logger.info("User created", name="John Doe", route="login")
logger.info("Post Created", title="My first post", route="post")
```

The `drop_messages()` function is a custom processor that checks if the `route`
property value on the event dictionary matches `login`. If the condition
evaluates to true, the event is dropped and the log message will not be logged:

```json
[output]
{"title": "My first post", "route": "post", "event": "Post Created", "level": "info", "timestamp": "2025-06-06T14:00:17.830155Z"}
```

Structlog also allows you to filter events based on call site parameters like
filename, function name, thread, and more. You only need to add the
`CallsiteParameterAdder()` and specify the parameters you'd like to use for your
filtering.

Let's look at the following example:

```python
[label app.py]
import structlog


structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ]
)
logger = structlog.get_logger()

def read_files():
    logger.info("File opened successfully", name="file.txt")


def delete_files():
    logger.warning("File deleted", name="app.log")

read_files()
delete_files()
```

```json
[output]
{"name": "file.txt", "event": "File opened successfully", "level": "info", "timestamp": "2025-06-06T14:00:41.444091Z"}
{"name": "app.log", "event": "File deleted", "level": "warning", "timestamp": "2025-06-06T14:00:41.444334Z"}
```

The `read_files()` and `delete_files()` functions log messages in the console.
If you want to see log entries from only the `read_files()` function, add the
highlighted lines to drop log messages in the `delete_files()` function:

```python
[label app.py]
import structlog

[highlight]
def filter_function(_, __, event_dict):
    if event_dict.get("func_name") == "delete_files":
        raise structlog.DropEvent

    return event_dict
[/highlight]

structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        [highlight]
        structlog.processors.CallsiteParameterAdder(
            [structlog.processors.CallsiteParameter.FUNC_NAME]
        ),
        filter_function,
        [/highlight]
        structlog.processors.JSONRenderer(),
    ]
)
logger = structlog.get_logger()
. . .
```

The `filter_function()` custom processor checks if the function name matches the
`delete_files()` and drops the event if the condition evaluates to true.
However, the event dictionary passed to each processor does not this information
by default. Therefore, the `CallsiteParameterAdder()` processor must be
introduced to include the `func_name` property amongst others. Finally, the
`filter_function` custom processor is added to the processor chain, so that
messages from the specified function are dropped accordingly:

```json
[output]
{"name": "file.txt", "event": "File opened successfully", "level": "info", "timestamp": "2025-06-06T14:01:31.637133Z", "func_name": "read_files"}
```

The log message in the `delete_files()` function has now been filtered out.

## Using asynchronous methods to avoid blocking

Sometimes if your application is writing a lot of logs, it can be blocked while
the Structlog processor chain is formatting the log records. To avoid this,
Structlog provides asynchronous logging methods prefixed with an `a`. For
example, a log method like `info()` has its asynchronous counterpart `ainfo()`.
To use it, you import the `asyncio` library from Python and ensure that the
logging method call is invoked within a function that is prefixed with the
`async` keyword:

```python
[label app.py]
import structlog
import asyncio

structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ]
)
logger = structlog.get_logger()


async def check_file_type():
    await logger.awarning("Unsupported File", name="file1.t3x")


asyncio.run(check_file_type())
```

```json
[output]
{"name": "file1.t3x", "event": "Unsupported File", "level": "warning", "timestamp": "2025-06-06T14:02:17.670824Z"}
```

Behind the scenes, the application will execute concurrently with the Structlog
processor chain as it formats the logs.

## Logging exceptions with Structlog

An application may detect errors during execution and throw an exception,
interrupting the normal flow of the program. These exceptions provide insights
into what went wrong and provide a starting point for debugging. Structlog
provides an `exception()` method to log exceptions as seen in this example:

```python
[label app.py]
import structlog

structlog.configure(

    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ],
)
logger = structlog.get_logger()

try:
    1 / 0
except ZeroDivisionError:
    logger.exception("Cannot divide one by zero!")
```

```json
[output]
{"exc_info": true, "event": "Cannot divide one by zero!", "level": "error", "timestamp": "2025-06-06T14:02:36.907179Z"}
```

When the `ZeroDivisionError` exception is thrown, Structlog logs the message
passed to the `exception()` method. But it is currently missing a stack trace
that can help you find the root cause of the problem. To add this info to all
exceptions, use the following processor:

```python
[label app.py]
. . .
structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        [highlight]
        structlog.processors.dict_tracebacks,
        [/highlight]
        structlog.processors.JSONRenderer(),
    ],
)
. . .
```

Running the file yields a log entry like this:

```json
[output]
{"event": "Cannot divide one by zero!", "level": "error", "timestamp": "2025-06-06T14:03:01.803031Z", "exception": [{"exc_type": "ZeroDivisionError", "exc_value": "division by zero", "exc_notes": [], "syntax_error": null, "is_cause": false, "frames": [{"filename": "/Users/stanley/structlog_demo/app.py", "lineno": 14, "name": "<module>", "locals": {"structlog": "\"<module 'structlog' from '/Users/stanley/\"+116", "logger": "'<BoundLoggerLazyProxy(logger=None, wrapper_class=None, processors=None, context_'+55"}}], "is_group": false, "exceptions": []}]}
```

The exception now contains helpful information that provides more context.
Notice that the exception details are also serialized in the JSON format, making
automatic analysis by log management systems much easier!

## Logging into files

So far, you've been sending the logs to the console. Structlog also allows you
to redirect the logs to a more persistent storage device like a file by using
the `WriteLoggerFactory()` method as follows:

```python
[label app.py]
import structlog
[highlight]
from pathlib import Path
[/highlight]

structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.StackInfoRenderer(),
        structlog.dev.set_exc_info,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ],
    [highlight]
    logger_factory=structlog.WriteLoggerFactory(
        file=Path("app").with_suffix(".log").open("wt")
    ),
    [/highlight]
)

logger = structlog.get_logger()
[highlight]
logger.info("Info message")
logger.error("Error message")
[/highlight]
```

Here, you set the `logger_factory` to the `WriteLoggerFactory()` method to send
the logs to a new `app.log` file. When you run the program, this file will be
created and you will observe the following contents:

```json
[label app.log]
{"event": "Info message", "level": "info", "timestamp": "2025-06-06T14:05:55.936319Z"}
{"event": "Error message", "level": "error", "timestamp": "2025-06-06T14:05:55.936752Z"}
```

When logging to files, ensure to control the sizes of files through [log
rotation](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/).

## Using Structlog in a Django application

Now that you are familiar with how Structlog works, you will implement a logging
system in a
[Django World Clock application](https://github.com/betterstack-community/django-world-clock).
This application lets you search for any location and returns the time for the
location.

For a smooth integration, we will use the
[`django-structlog`](https://github.com/jrobichaud/django-structlog) package.
The package allows for smooth integration of Django with Structlog and also
comes with middleware that adds context data, such as user agent, IP address, or
a request ID.

First, deactivate the project directory virtual environment:

```command
deactivate
```

Next, move outside the project directory:

```command
cd ..
```

Clone the repository to your local machine:

```command
git clone https://github.com/betterstack-community/django-world-clock.git
```

Then move into the newly created directory:

```command
cd django-world-clock
```

Create a virtual environment, then activate it:

```command
python3 -m venv venv
```

```command
source venv/bin/activate
```

Move into the `djangoWorldClock` directory:

```command
cd djangoWorldClock
```

Install all the dependencies:

```command
pip install -r requirements.txt
```

Migrate the database as follows:

```command
python manage.py migrate
```

Then run the server:

```command
python manage.py runserver
```

```text
[output]
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
June 06, 2025 - 14:09:02
Django version 4.1.1, using settings 'djangoWorldClock.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

Next, visit `http://127.0.0.1:8000/` in the web browser of your choice to see a
page similar to this:

![Screenshot of web app in the web browser](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6b7a9fa5-1e9b-4023-459f-c7e6c64e4000/orig =3248x1996)

When you enter a valid location, you will see the date for the city:

![location_date.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f0cd2224-3981-41f7-292a-48ca7056f200/public =3248x1996)

When you search for a blank location, you will see the following error:

![location_notfound.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e184cd63-dafb-4815-8c82-4207bb413d00/md2x =3248x1996)

### Installing and configuring django-structlog

With the project up and running, you will now install `django-structlog` and set
up the middleware for logging.

In the terminal, enter the following command to install `django-structlog`:

```command
python -m pip install django-structlog
```

Open `djangoWorldClock/settings.py` in your text editor and register the
`django_structlog` package:

```python
[label djangoWorldClock/settings.py]
INSTALLED_APP = [
    # . . .
[highlight]
    'django_structlog'
[/highlight]
]
```

Following that, add `django-structlog` middleware to your project:

```python
[label djangoWorldClock/settings.py]
MIDDLEWARE = [
    # . . .
    'django_structlog.middlewares.RequestMiddleware',
]
```

Next, create a Structlog configuration at the end of the `settings.py`:

```python
[label djangoWorldClock/settings.py]
[highlight]
import structlog
import os
[/highlight]


. . .
LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
    "formatters": {
        "json_formatter": {
            "()": structlog.stdlib.ProcessorFormatter,
            "processor": structlog.processors.JSONRenderer(),
        },
        "plain_console": {
            "()": structlog.stdlib.ProcessorFormatter,
            "processor": structlog.dev.ConsoleRenderer(),
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "plain_console",
        },
        "json_file": {
            "class": "logging.handlers.WatchedFileHandler",
            "filename": "logs/json.log",
            "formatter": "json_formatter",
        },
    },
    "loggers": {
        "django_structlog": {
            "handlers": ["console", "json_file"],
            "level": "DEBUG",
        },
        "root": {
            "handlers": ["console", "json_file"],
            "level": "DEBUG",
        },
    },
}

structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.filter_by_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)
os.makedirs(os.path.join(BASE_DIR, "logs"), exist_ok=True)
```

The `LOGGING` dictionary has two formatters:

- `json_formatter`: converts log messages to the JSON format.
- `plain_console`: render logs messages as plain text.

Next, you define two handlers that send plain log messages to the console, and
JSON log messages to the `logs/json.log` file.

Afterward, you configure Structlog with the `configure()` method and use
processors that should be familiar at this point.

Finally, you invoke `os.makedirs()` to create the directory `logs`, where the
log files will reside.

Save the file, and the server will automatically restart and log the
following(if not, refresh `http://127.0.0.1:8000/` in the browser):

```text
[output]
2025-06-06T14:18:20.242188Z [info     ] request_started                [django_structlog.middlewares.request] ip=127.0.0.1 request='GET /' request_id=8081cf47-5e9a-40ef-bc2d-7dc4a5e8b612 user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36' user_id=None
2025-06-06T14:18:20.242188Z [info     ] request_started                [django_structlog.middlewares.request] ip=127.0.0.1 request='GET /' request_id=8081cf47-5e9a-40ef-bc2d-7dc4a5e8b612 user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36' user_id=None
2025-06-06T14:18:20.251050Z [info     ] request_finished               [django_structlog.middlewares.request] code=200 ip=127.0.0.1 request='GET /' request_id=8081cf47-5e9a-40ef-bc2d-7dc4a5e8b612 user_id=None
2025-06-06T14:18:20.251050Z [info     ] request_finished               [django_structlog.middlewares.request] code=200 ip=127.0.0.1 request='GET /' request_id=8081cf47-5e9a-40ef-bc2d-7dc4a5e8b612 user_id=None
```

The application is now sending logs to the console as configured. Each log
messages include the `request_id`, IP address, HTTP method, and the user agent.
`django-structlog` has automatically added this context data for us.

In the project root directory, you will also find that the `logs` directory has
been created with the `json.log` file.

The `json.log` file contains JSON-formatted log messages:

```json
[output]
{"request": "GET /", "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36", "event": "request_started", "request_id": "8081cf47-5e9a-40ef-bc2d-7dc4a5e8b612", "ip": "127.0.0.1", "user_id": null, "timestamp": "2025-06-06T14:18:20.242188Z", "logger": "django_structlog.middlewares.request", "level": "info"}
{"request": "GET /", "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36", "event": "request_started", "request_id": "8081cf47-5e9a-40ef-bc2d-7dc4a5e8b612", "ip": "127.0.0.1", "user_id": null, "timestamp": "2025-06-06T14:18:20.242188Z", "logger": "django_structlog.middlewares.request", "level": "info"}
{"code": 200, "request": "GET /", "event": "request_finished", "request_id": "8081cf47-5e9a-40ef-bc2d-7dc4a5e8b612", "ip": "127.0.0.1", "user_id": null, "timestamp": "2025-06-06T14:18:20.251050Z", "logger": "django_structlog.middlewares.request", "level": "info"}
{"code": 200, "request": "GET /", "event": "request_finished", "request_id": "8081cf47-5e9a-40ef-bc2d-7dc4a5e8b612", "ip": "127.0.0.1", "user_id": null, "timestamp": "2025-06-06T14:18:20.251050Z", "logger": "django_structlog.middlewares.request", "level": "info"}
```

The log messages include an IP address, which sometimes is sensitive
information. Other examples include authorization tokens and passwords. To keep
the information safe, you can redact the information or remove it. In this
tutorial, you will remove the IP address.

To achieve that, you can implement a signal receiver to override existing
context data. You can also use the same option to add new metadata to the
request. Create a `worldClock/signals.py` file and add the following code:

```python
[label worldClock/signals.py]
from django.dispatch import receiver

from django_structlog.signals import bind_extra_request_metadata
import structlog


@receiver(bind_extra_request_metadata)
def remove_ip_address(request, logger, **kwargs):
    structlog.contextvars.bind_contextvars(ip=None)
```

The `bind_contextvars()` method adds/modifies context data globally in all the
log messages. Here, you set `ip` to `None` so that the IP address value should
be removed.

To make sure that the signal works, add the following line to the
`worldClock/__init__.py` file:

```python
[label worldClock/__init__.py]
from . import signals
```

With that, save the file and the server will automatically restart. Refresh
`http://localhost:8000/` to see logs with the IP address will be removed:

```text
[output]
2025-06-06T14:20:36.438009Z [info     ] request_started                [django_structlog.middlewares.request] ip=None request='GET /' request_id=c9e8d320-b214-4fd4-83b2-131a0ad2468a user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36' user_id=None
2025-06-06T14:20:36.438009Z [info     ] request_started                [django_structlog.middlewares.request] ip=None request='GET /' request_id=c9e8d320-b214-4fd4-83b2-131a0ad2468a user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36' user_id=None
2025-06-06T14:20:36.506138Z [info     ] request_finished               [django_structlog.middlewares.request] code=200 ip=None request='GET /' request_id=c9e8d320-b214-4fd4-83b2-131a0ad2468a user_id=None
2025-06-06T14:20:36.506138Z [info     ] request_finished
```

### Logging in Django view functions

With logging in place, you are now ready to log messages in Django views.

In every file that has views, you should import `structlog` and invoke
`structlog.get_logger()`, then call logging methods as you have been doing
earlier in the tutorial:

```python
[label worldClock/views.py]
from django.shortcuts import render, redirect
import requests
[highlight]
import structlog

logger = structlog.get_logger(__name__)
[/highlight]


def home(request):
[highlight]
    logger.debug("homepage visited")
[/highlight]
    return render(request, "home.html")


def search(request):
    # If the request method is not POST, redirect to the home page
    if request.method != "POST":
[highlight]
        logger.info(
            "redirecting %s request to %s to '/'",
            method=request.method,
            path=request.path,
        )
[/highlight]
        return redirect("/")

    # Get the search query
    query = request.POST.get("q", "")
[highlight]
    searchLogger = logger.bind(query=query)
    searchLogger.info("incoming search query for %s", query, query=query)
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
            searchLogger.bind(time=time_response).debug("Time API response")
            searchLogger.bind(coordinate=coordinate).debug(
                "Search query %s succeeded without errors", query
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
            searchLogger.info("location %s not found", query, query=query)
[/highlight]
            return render(request, "fail.html")

    except Exception as error:
[highlight]
        searchLogger.exception(error)
[/highlight]
        return render(request, "500.html")

```

When you save and refresh `http://localhost:8000/`, you will see the
`homepage visited` log message:

```text
[output]
. . .
2025-06-06T14:26:59.601629Z [debug    ] homepage visited               [worldClock.views] ip=None request_id=92a9237e-e9ee-47c8-835f-d4a598772d0b user_id=None
. . .
```

When you perform a query for "New York" or any valid city name, a log message
will first acknowledge the query:

```text
[output]
. . .
2025-06-06T14:28:08.278516Z [info     ] incoming search query for New York [worldClock.views] ip=None query='New York' request_id=fc1c09eb-74e1-4e2b-ac4a-17f01057f232 user_id=None
. . .
```

In the `try` block, a request will be to the API and a debug message will be
logged containing the API response data:

```text
[output]
. . .
2025-06-06T14:28:09.328039Z [debug    ] Nominatim API response         [worldClock.views] ip=None location=<Response [200]> query='New York' request_id=fc1c09eb-74e1-4e2b-ac4a-17f01057f232 user_id=None
2025-06-06T14:28:33.954774Z [debug    ] Time API response              [worldClock.views] ip=None query='New York' request_id=92ea07e4-8e02-4ec7-8d11-41bbc7c09f27 time=<Response [200]> user_id=None
```

If everything went smoothly, a successful debug message is logged:

```text
[output]
2025-06-06T14:28:33.955914Z [debug    ] Search query New York succeeded without errors [worldClock.views] coordinate=['40.7127281', '-74.0060152'] ip=None query='New York' request_id=92ea07e4-8e02-4ec7-8d11-41bbc7c09f27 user_id=None

```

When a user enters an empty location, the following debug messages will be
logged:

```text
[output]
. . .
2025-06-06T14:30:17.685920Z [info     ] incoming search query for      [worldClock.views] ip=None query= request_id=6abdbcbf-4b5d-4f0e-b3e3-3ed1da17e136 user_id=None
2025-06-06T14:30:18.566211Z [debug    ] Nominatim API response         [worldClock.views] ip=None location=<Response [200]> query= request_id=6abdbcbf-4b5d-4f0e-b3e3-3ed1da17e136 user_id=None
2025-06-06T14:30:18.566802Z [info     ] location  not found            [worldClock.views] ip=None query= request_id=6abdbcbf-4b5d-4f0e-b3e3-3ed1da17e136 user_id=None
. . .
```

## Centralizing and monitoring your Structlog logs

While logging to standard output works well during development, production applications require a more robust logging solution. You could use file-based logging with rotation as discussed earlier, but this approach requires you to access individual servers to view logs. A better approach is to centralize all your logs in one location where they can be monitored, analyzed, and searched efficiently.

There are multiple approaches to log centralization, but one of the most straightforward options is using a cloud-based log management platform. Once your application is forwarding logs successfully, you can watch events arrive in real time, set alerts for critical patterns, and explore your data through dashboards that make it easier to spot trends and anomalies over time.

If you want to see what that workflow looks like in practice, here’s a quick demo:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

In this section, we'll configure our Structlog application to send logs to [Better Stack Telemetry](https://betterstack.com/telemetry).

Before you can start ingesting logs into Better Stack, you'll need to [create a free account](https://betterstack.com/telemetry) and navigate to the **Sources** section from the left sidebar, then click **Connect source**.

![Better Stack Telemetry dashboard showing the Sources navigation and Connect source button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7199f84f-b711-4aef-8fc0-7bef50395900/lg2x =3024x1846)

Provide a descriptive name for your source and choose **Python** as the platform, then click **Create source**:

![Create source dialog with name field filled and Python platform selected](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/617286e2-503a-4421-7187-56a480859c00/orig =3024x3928)

After creating the source, you'll receive a source token (e.g., `abc123XYZ789tokenExample`) and an ingestion endpoint (e.g., `s1234567.us-west-2.betterstackdata.com`). Copy both values as they're required for configuration:

![Source creation success page displaying the source token and ingestion endpoint](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/635bc561-cc28-4d68-7aea-aa9fe4932100/public =3024x1530)

The `logtail-python` package should already be installed if you followed the complete tutorial, but if you're starting fresh, install it using:

```command
pip install logtail-python
```

Now, let's modify the World Clock application to include the Better Stack handler. Head back to `djangoWorldClock/settings.py` and add the Better Stack handler to the Structlog configuration:

```python
[label djangoWorldClock/settings.py]
...
from django.shortcuts import render, redirect
import requests
import structlog
[highlight]
from logtail import LogtailHandler
[/highlight]

...
[highlight
LOGTAIL_SOURCE_TOKEN = "your_source_token>"
LOGTAIL_HOST = "https://<your_ingestion_endpoint>"
[/highlight]

LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
    "formatters": {
        "json_formatter": {
            "()": structlog.stdlib.ProcessorFormatter,
            "processor": structlog.processors.JSONRenderer(),
        },
        "plain_console": {
            "()": structlog.stdlib.ProcessorFormatter,
            "processor": structlog.dev.ConsoleRenderer(),
        },
[highlight]
        "logtail_formatter": {"format": "%(message)s"},
[/highlight]
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "plain_console",
        },
        "json_file": {
            "class": "logging.handlers.WatchedFileHandler",
            "filename": "logs/json.log",
            "formatter": "json_formatter",
        },
[highlight]
        "logtail": {
            "class": "logtail.LogtailHandler",
            "source_token": LOGTAIL_SOURCE_TOKEN,
            "host": LOGTAIL_HOST,
            "formatter": "logtail_formatter",
        },
[/highlight]
    },
    "loggers": {
        "django_structlog": {
[highlight]
            "handlers": ["console", "json_file", "logtail"],
[/highlight]
            "level": "INFO",
        },

        "root": {
            "handlers": ["console", "json_file"],
            "level": "INFO",
        },
    },
}

structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.filter_by_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
[highlight]
        structlog.stdlib.render_to_log_kwargs,
[/highlight]
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
[highlight]
    wrapper_class=structlog.stdlib.BoundLogger,
[/highlight]
    cache_logger_on_first_use=True,
)
os.makedirs(os.path.join(BASE_DIR, "logs"), exist_ok=True)
```

The `LogtailHandler` requires both the source token and the ingestion endpoint that you copied from the Better Stack interface.

Once your configuration is complete, you should see a **“Logs received!”** message. This confirms that logs from your Bash script container are successfully being delivered to Better Stack:

![Once your configuration is complete, you should see a **“Logs received!”** message. This confirms that logs from your Bash script container are successfully being delivered to Better Stack.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/889d8d21-9860-4f57-14c4-598c7cef9800/md1x =3024x3016)

Once everything is set up, open your browser and visit `http://127.0.0.1:8000/`, then perform a city search to generate log activity. Your logs will begin streaming to Better Stack in real time:

![Screenshot of logs in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c2bdef29-52c3-4f0c-80b9-35839635de00/lg2x =3024x1530)

To view more details about a specific event, click on any log entry:

![Expanded log entry in Better Stack showing detailed structured log data](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e8b21664-545f-4f7c-1393-73ea12236300/md2x =3024x1530)

Once logs are flowing in, open Live tail to see events streaming in real time. If you want to preview what the Live tail experience looks like first, here’s a quick demo:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="Better Stack Live tail demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

From this point forward, all your Structlog output will be centralized in Better Stack Telemetry. You can easily apply filters to locate specific information or configure alerts to notify you when logs match particular criteria, making your production logging strategy both powerful and maintainable.

## Final thoughts

In this article, we covered at a broad range of Structlog features and how to
customize them. Armed with this knowledge, you should now be able to harness the
power of Structlog effectively in your projects. To expand on your learning,
ensure to read the
[Structlog documentation](https://www.structlog.org/en/stable/).

Thanks for reading, and happy logging!
