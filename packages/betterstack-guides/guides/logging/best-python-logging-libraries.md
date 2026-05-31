# Logging in Python: A Comparison of the Top 6 Libraries

While Python offers a robust and feature-rich logging solution within its
standard library, the third-party logging ecosystem presents a compelling array
of alternatives. Depending on your requirements, these external libraries might
be more suitable for your logging needs.

Therefore, this article will consider Python's top six logging solutions for
tracking application and library behaviour. We will begin with a discussion of
the standard `logging` module, then examine five other [logging
frameworks](https://betterstack.com/community/guides/logging/logging-framework/) created by the Python community.

Let's get started!

[summary]
## Side note: Get a Python logs dashboard

Save hours of sifting through Python logs. Centralize with [Better Stack](https://betterstack.com/logs) and start visualizing your log data in minutes.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[/summary]


## 1. The standard logging module

Python distinguishes itself from most programming languages by including a
fully-featured logging framework in its standard library. This logging solution
effectively caters to the needs of both library and application developers and
it incorporates the following severity levels: `DEBUG`, `INFO`, `WARNING`,
`ERROR`, and `CRITICAL`. Thanks to the default logger, you can immediately begin
logging without any preliminary setup:

```python
import logging

logging.debug("A debug message")
logging.info("An info message")
logging.warning("A warning message")
logging.error("An error message")
logging.critical("A critical message")
```

This default (or root) logger operates at the `WARNING` level, meaning that only
logging calls whose severity equals or exceeds `WARNING` will produce an output:

```text
[output]
WARNING:root:A warning message
ERROR:root:An error message
CRITICAL:root:A critical message
```

This configuration ensures that only potentially important messages are shown,
reducing the noise in the log output. However, you can customize the log level
and fine-tune the logging behavior as needed. The recommended way to use the
`logging` module involves creating a custom logger through the `getLogger()`
method:

```python
import logging

logger = logging.getLogger(__name__)

. . .
```

Once you have a custom logger, you can customize its output through the
[Handler](https://docs.python.org/3/library/logging.handlers.html),
[Formatter](https://docs.python.org/3/library/logging.html#logging.Formatter),
and [Filter](https://docs.python.org/3/library/logging.html#filter-objects)
classes provided by the `logging` module.

- Handlers decide the output destination and can be customized based on the log
  level. Multiple handlers can also be added to a logger to simultaneously send
  log messages to different destinations.

- Formatters determine the format of the records produced by a logger. However,
  there are no predefined formats like JSON, [Logfmt](https://betterstack.com/community/guides/logging/logfmt/), etc. You have to combine
  the available
  [log record attributes](https://docs.python.org/3/library/logging.html#logrecord-attributes)
  to build your own formats. The default format for the root logger is
  `%(levelname)s:%(name)s:%(message)s`. However, custom loggers default to just
  `%(message)s`.

- Filters are used by handler and logger objects to filter log records. They
  provide greater control than [log levels](https://betterstack.com/community/guides/logging/log-levels-explained/) over which log
  records should be processed and ignored. They also allow you to enhance or
  modify the records somehow before the logs are sent to their final
  destination. For example, you can create a custom filter that [redacts
  sensitive data](https://betterstack.com/community/guides/logging/sensitive-data/) in your logs.

Here's an example that logs to the console and a file using a custom logger:

```python
import sys
import logging

logger = logging.getLogger("example")
logger.setLevel(logging.DEBUG)

# Create handlers for logging to the standard output and a file
stdoutHandler = logging.StreamHandler(stream=sys.stdout)
errHandler = logging.FileHandler("error.log")

# Set the log levels on the handlers
stdoutHandler.setLevel(logging.DEBUG)
errHandler.setLevel(logging.ERROR)

# Create a log format using Log Record attributes
fmt = logging.Formatter(
    "%(name)s: %(asctime)s | %(levelname)s | %(filename)s:%(lineno)s | %(process)d >>> %(message)s"
)

# Set the log format on each handler
stdoutHandler.setFormatter(fmt)
errHandler.setFormatter(fmt)

# Add each handler to the Logger object
logger.addHandler(stdoutHandler)
logger.addHandler(errHandler)

logger.info("Server started listening on port 8080")
logger.warning(
    "Disk space on drive '/var/log' is running low. Consider freeing up space"
)

try:
    raise Exception("Failed to connect to database: 'my_db'")
except Exception as e:
    # exc_info=True ensures that a Traceback is included
    logger.error(e, exc_info=True)
```

When you execute the above program, the following log messages are printed to
the console as expected:

```text
[output]
example: 2023-07-23 14:42:18,599 | INFO | main.py:30 | 187901 >>> Server started listening on port 8080
example: 2023-07-23 14:14:47,578 | WARNING | main.py:28 | 143936 >>> Disk space on drive '/var/log' is running low. Consider freeing up space
example: 2023-07-23 14:14:47,578 | ERROR | main.py:34 | 143936 >>> Failed to connect to database: 'my_db'
Traceback (most recent call last):
  File "/home/ayo/dev/betterstack/demo/python-logging/main.py", line 32, in <module>
    raise Exception("Failed to connect to database: 'my_db'")
Exception: Failed to connect to database: 'my_db'
```

The `error.log` file is also created, and it should contain the `ERROR` log
alone since the minimum level on the `errHandler` was set to `ERROR`:

```text
[label error.log]
example: 2023-07-23 14:14:47,578 | ERROR | main.py:34 | 143936 >>> Failed to connect to database: 'my_db'
Traceback (most recent call last):
  File "/home/ayo/dev/betterstack/demo/python-logging/main.py", line 32, in <module>
    raise Exception("Failed to connect to database: 'my_db'")
Exception: Failed to connect to database: 'my_db'
```

At the time of writing, the `logging` module cannot produce structured logs
unless you
[implement some additional code](https://docs.python.org/3/howto/logging-cookbook.html#implementing-structured-logging).
Thankfully, there is an easier and better way to get structured output: the
[python-json-logger](https://github.com/madzak/python-json-logger) library.

```command
pip install python-json-logger
```

Once installed, you may utilize it as follows:

```python
import sys
import logging
[highlight]
from pythonjsonlogger import jsonlogger
[/highlight]

. . .

[highlight]
# The desired Log Record attributes must be included here, and they can be
# renamed if necessary
fmt = jsonlogger.JsonFormatter(
    "%(name)s %(asctime)s %(levelname)s %(filename)s %(lineno)s %(process)d %(message)s",
    rename_fields={"levelname": "severity", "asctime": "timestamp"},
)
[/highlight]

# Set the log format on each handler
stdoutHandler.setFormatter(fmt)
errHandler.setFormatter(fmt)

. . .
```

If you modify the previous example with the highlighted lines above, you will
observe the following output upon execution:

```json
[output]
{"name": "example", "filename": "main.py", "lineno": 31, "process": 179775, "message": "Server started listening on port 8080", "severity": "INFO", "timestamp": "2023-07-23 14:39:03,265"}
{"name": "example", "filename": "main.py", "lineno": 32, "process": 179775, "message": "Disk space on drive '/var/log' is running low. Consider freeing up space", "severity": "WARNING", "timestamp": "2023-07-23 14:39:03,265"}
{"name": "example", "filename": "main.py", "lineno": 38, "process": 179775, "message": "Failed to connect to database: 'my_db'", "exc_info": "Traceback (most recent call last):\n  File \"/home/ayo/dev/betterstack/demo/python-logging/main.py\", line 36, in <module>\n    raise Exception(\"Failed to connect to database: 'my_db'\")\nException: Failed to connect to database: 'my_db'", "severity": "ERROR", "timestamp": "2023-07-23 14:39:03,265"}
```

Contextual data can also be added at log point through the `extra` property on a
level method like this:

```python
logger.info(
    "Server started listening on port 8080",
    extra={"python_version": 3.10, "os": "linux", "host": "fedora 38"},
)
```

These extra fields are automatically inserted in the log record if they do not
clash with any of the default attribute names. Otherwise, you'll get a
`KeyError` exception.

```json
[output]
{"name": "example", "filename": "main.py", "lineno": 31, "process": 195301, "message": "Server started listening on port 8080", "python_version": 3.1, "os": "linux", "host": "fedora 38", "severity": "INFO", "timestamp": "2023-07-23 14:45:42,472"}
```

As you can see, the built-in `logging` module is capable and extensible for
various logging needs. However, its initial configuration and customization can
be cumbersome since you have to create and configure loggers, handlers, and
formatters before you can start logging effectively.

Please see our [comprehensive Python logging
guide](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/) and the
[official documentation](https://docs.python.org/3/library/logging.html) to
learn more about the `logging` module's features and best practices.

## 2. Loguru

![loguru.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9d77db2c-d90e-4a0a-6b84-2ea34f69bf00/orig
=1200x600)

<iframe width="100%" height="315" src="https://www.youtube.com/embed/y8qLhov8QU8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Loguru](https://betterstack.com/community/guides/logging/loguru/) is the most popular third-party logging framework for Python
with over 15k GitHub stars at the time of writing. It aims to simplify the
logging process by pre-configuring the logger and making it really easy to
customize via its `add()` method. Initiating logging with Loguru is a breeze;
just install the package and import it, then call one of its level methods as
follows:

```command
pip install loguru
```

```python
from loguru import logger

logger.trace("Executing program")
logger.debug("Processing data...")
logger.info("Server started successfully.")
logger.success("Data processing completed successfully.")
logger.warning("Invalid configuration detected.")
logger.error("Failed to connect to the database.")
logger.critical("Unexpected system error occurred. Shutting down.")
```

The default configuration logs a semi-structured and colorized output to the
standard error. It also defaults to `DEBUG` as its minimum level, which explains
why the `TRACE` output isn't recorded.

![Screenshot from 2023-07-17 15-21-22.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f3ddd531-b7c8-41eb-42b9-03606e715300/public
=2218x996)

Loguru's inner workings are easily customized through the `add()` function which
handles everything from formatting the logs to setting their destination. For
example, you can log to the standard output, change the default level to `INFO`,
and format your logs as JSON using the configuration below:

```python
from loguru import logger
import sys

logger.remove(0) # remove the default handler configuration
logger.add(sys.stdout, level="INFO", serialize=True)

. . .
```

```json
[output]
{"text": "2023-07-17 15:26:21.597 | INFO     | __main__:<module>:9 - Server started successfully.\n", "record": {"elapsed": {"repr": "0:00:00.006401", "seconds": 0.006401}, "exception": null, "extra": {}, "file": {"name": "main.py", "path": "/home/ayo/dev/betterstack/demo/python-logging/main.py"}, "function": "<module>", "level": {"icon": "ℹ️", "name": "INFO", "no": 20}, "line": 9, "message": "Server started successfully.", "module": "main", "name": "__main__", "process": {"id": 3852028, "name": "MainProcess"}, "thread": {"id": 140653618894656, "name": "MainThread"}, "time": {"repr": "2023-07-17 15:26:21.597156+02:00", "timestamp": 1689600381.597156}}}
```

The default JSON output produced by Loguru can be quite verbose, but it's easy
to
[serialize the log messages using a custom function](https://loguru.readthedocs.io/en/stable/resources/recipes.html#serializing-log-messages-using-a-custom-function)
like this:

```python
from loguru import logger
import sys
import json

def serialize(record):
    subset = {
        "timestamp": record["time"].timestamp(),
        "message": record["message"],
        "level": record["level"].name,
        "file": record["file"].name,
        "context": record["extra"],
    }
    return json.dumps(subset)

def patching(record):
    record["extra"]["serialized"] = serialize(record)

logger.remove(0)

logger = logger.patch(patching)
logger.add(sys.stderr, format="{extra[serialized]}")

logger.bind(user_id="USR-1243", doc_id="DOC-2348").debug("Processing document")
```

```json
[output]
{"timestamp": 1689601339.628792, "message": "Processing document", "level": "DEBUG", "file": "main.py", "context": {"user_id": "USR-1243", "doc_id": "DOC-2348"}}
```

Contextual logging is also fully supported in Loguru. You've already seen the
`bind()` method above which allows the addition of contextual data at log point.
You can also use it to create child loggers for logging records that share the
same context:

```python
child = logger.bind(user_id="USR-1243", doc_id="DOC-2348")
child.debug("Processing document")
child.warning("Invalid configuration detected. Falling back to defaults")
child.success("Document processed successfully")
```

Notice how the `user_id` and `doc_id` fields are present in all three records:

```json
[output]
{"timestamp": 1689601518.884659, "message": "Processing document", "level": "DEBUG", "file": "main.py", "context": {"user_id": "USR-1243", "doc_id": "DOC-2348"}}
{"timestamp": 1689601518.884706, "message": "Invalid configuration detected. Falling back to defaults", "level": "WARNING", "file": "main.py", "context": {"user_id": "USR-1243", "doc_id": "DOC-2348"}}
{"timestamp": 1689601518.884729, "message": "Document processed successfully", "level": "SUCCESS", "file": "main.py", "context": {"user_id": "USR-1243", "doc_id": "DOC-2348"}}
```

On the other hand, its `contextualize()` method eases the addition of contextual
fields to all log records within a specific scope or context. For example, the
snippet below demonstrates adding a unique request ID attribute to all logs
created as a result of that request:

```python
from loguru import logger
import uuid

def logging_middleware(get_response):
    def middleware(request):
        request_id = str(uuid.uuid4())

[highlight]
        with logger.contextualize(request_id=request_id):
[/highlight]
            response = get_response(request)
            response["X-Request-ID"] = request_id
            return response

    return middleware
```

Loguru also supports all the [features you'd expect from a good logging
framework](https://betterstack.com/community/guides/logging/logging-framework/) such as logging to files with [automatic rotation
and compression](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/), custom
log levels, exception handling, logging to multiple destinations at once, and
much more. It also provides a
[migration guide](https://loguru.readthedocs.io/en/stable/resources/migration.html)
for users coming from the standard `logging` module.

Please see the
[official documentation](https://loguru.readthedocs.io/en/stable/index.html) and
our [dedicated Loguru guide](https://betterstack.com/community/guides/logging/loguru/) and to learn more about using Loguru to
create a production-ready logging setup for Python applications.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/y8qLhov8QU8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## 3. Structlog

![structlog.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/25b16a97-4e3a-4947-5df2-a12b9f31d200/public
=1200x600)

[Structlog](https://betterstack.com/community/guides/logging/structlog/) is a logging library dedicated
to producing structured output in JSON or Logfmt. It supports a colorized and
aesthetically enhanced console output for development environments, but also
allows for complete customization of the log format to meet diverse needs. You
may install the Structlog package using the command below:

```command
pip install structlog
```

The simplest possible usage of Structlog involves calling the `get_logger()`
method and using any of the level methods on the resulting logger:

```python
import structlog

logger = structlog.get_logger()

logger.debug("Database query executed in 0.025 seconds")
logger.info(
    "Processing file 'data.csv' completed. 1000 records were imported",
    file="data.csv",
    elapsed_ms=300,
    num_records=1000,
)
logger.warning(
    "Unable to load configuration file 'config.ini'. Using default settings instead",
    file="config.ini",
)

try:
    1 / 0
except ZeroDivisionError as e:
    logger.exception(
        "Division by zero error occurred during calculation. Check the input values",
        exc_info=e,
    )
logger.critical("Application crashed due to an unhandled exception")
```

![Screenshot from 2023-07-23 15-48-51.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cb795c37-5b36-4e1f-55e5-dad292972700/public
=2702x1758)

The default configuration of a Structlog logger is quite friendly for
development environments. The output is colorized, and any included contextual
data is placed in `key=value` pairs. Additionally, tracebacks are neatly
formatted and organized so that it's much easier to spot the cause of the issue.

A unique behavior of Structlog is that it doesn't filter records by their
levels. This is why all the levels above were written to the console. However,
it's easy enough to configure a default level through the `configure()` method
like this:

```python
import structlog
import logging

[highlight]
structlog.configure(wrapper_class=structlog.make_filtering_bound_logger(logging.INFO))
[/highlight]
```

Structlog is compatible with the log levels in the standard `logging` module
hence the usage of the `logging.INFO` constant above. You can also use the
number associated with the level directly:

```python
structlog.configure(wrapper_class=structlog.make_filtering_bound_logger(20))
```

The logger returned by the `get_logger()` function is called a _Bound Logger_
because you can bind contextual values to it. Once the key/value pairs are
bound, they will be included in each subsequent log entry produced by the
logger.

```python
import structlog
import platform

logger = structlog.get_logger()

[highlight]
logger = logger.bind(python_version=platform.python_version(), os="linux")
[/highlight]

. . .
```

```text
[output]
2023-07-23 17:20:10 [debug    ] Database query executed in 0.025 seconds os=linux python_version=3.11.4
2023-07-23 17:20:10 [info     ] Processing file 'data.csv' completed. 1000 records were imported elapsed_ms=300 file=data.csv num_records=1000 os=linux python_version=3.11.4
. . .
```

Bound loggers also include a chain of
[processor functions](https://www.structlog.org/en/stable/processors.html) that
transform and enrich log records as they pass through the logging pipeline. For
example, you can log in JSON using the following configuration:

```python
import structlog
import platform

[highlight]
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.JSONRenderer(),
    ]
)
[/highlight]

. . .
```

Each processor is executed in the declaration order, so `TimeStamper()` is
called first to add an ISO-8601 formatted timestamp to each entry, then the
severity level is added through `add_log_level`, and finally the entire record
is serialized as JSON by calling `JSONRenderer()`. You will observe the
following output after making the highlighted modifications to the program:

```json
[output]
{"python_version": "3.11.4", "os": "linux", "event": "Database query executed in 0.025 seconds", "timestamp": "2023-07-23T15:32:21.590688Z", "level": "debug"}
{"python_version": "3.11.4", "os": "linux", "file": "data.csv", "elapsed_ms": 300, "num_records": 1000, "event": "Processing file 'data.csv' completed. 1000 records were imported", "timestamp": "2023-07-23T15:32:21.590720Z", "level": "info"}
. . .
```

Another cool thing Structlog can do is automatically format tracebacks so that
they are also serialized in JSON format. You only need to use the
`dict_tracebacks` processor like this:

```python
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        [highlight]
        structlog.processors.dict_tracebacks,
        [/highlight]
        structlog.processors.JSONRenderer(),
    ]
)
```

Whenever exceptions are logged, you will observe that the records are enriched
with well-formatted information about the exception making it easy to analyze in
a log management service.

```json
[output]
{"python_version": "3.11.4", "os": "linux", "event": "Division by zero error occurred during calculation. Check the input values", "timestamp": "2023-07-23T16:07:50.127241Z", "level": "error", "exception": [{"exc_type": "ZeroDivisionError", "exc_value": "division by zero", "syntax_error": null, "is_cause": false, "frames": [{"filename": "/home/ayo/dev/betterstack/demo/python-logging/main.py", "lineno": 32, "name": "<module>", "line": "", "locals": {"__name__": "__main__", "__doc__": "None", "__package__": "None", "__loader__": "<_frozen_importlib_external.SourceFileLoader object at 0x7fdb22df2ed0>", "__spec__": "None", "__annotations__": "{}", "__builtins__": "<module 'builtins' (built-in)>", "__file__": "/home/ayo/dev/betterstack/demo/python-logging/main.py", "__cached__": "None", "structlog": "\"<module 'structlog' from '/home/ayo/.local/lib/python3.11/site-packages/structlo\"+15", "platform": "<module 'platform' from '/usr/lib64/python3.11/platform.py'>", "logging": "<module 'logging' from '/usr/lib64/python3.11/logging/__init__.py'>", "logger": "\"<BoundLoggerFilteringAtDebug(context={'python_version': '3.11.4', 'os': 'linux'}\"+249", "e": "ZeroDivisionError('division by zero')"}}]}]}
```

I've only scratched the surface of what Structlog has to offer, so ensure to
check out its [documentation](https://www.structlog.org/en/stable/) to learn
more.

## 4. Eliot

![eliot.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/959e9df6-1ff1-4624-07b4-e75d89c3cc00/md1x
=1200x600)

[Eliot](https://github.com/itamarst/eliot) is a unique Python logging solution
that aims not only to provide a record of an event that occurred in the program,
but also outputs a causal chain of actions leading to the event. You can install
Eliot with `pip` as follows:

```command
pip install eliot
```

One of Eliot's key concepts is an _action_ which represents any task that can
start and finish successfully or fail with an exception. When you start an
action, two log records are produced: one to indicate the start of the action,
and the other to indicate its success or failure. The best way to demonstrate
this model is through an example:

```python
import sys
from eliot import start_action, to_file

to_file(sys.stdout)


def calculate(x, y):
    with start_action(action_type="multiply"):
        return x * y


calculate(10, 5)
```

The `start_action` function is used here to indicate the start of a new action.
Once the `calculate()` function is executed, two logs are sent to the
destination configured by `to_file()`:

```json
[output]
{"action_status": "started", "timestamp": 1690213156.7701144, "task_uuid": "a9a47808-15a9-439b-8335-b88d50013f75", "action_type": "multiply", "task_level": [1]}
{"action_status": "succeeded", "timestamp": 1690213156.7701554, "task_uuid": "a9a47808-15a9-439b-8335-b88d50013f75", "action_type": "multiply", "task_level": [2]}
```

Eliot produces structured JSON output by default, and the following records are
included:

- `task_uuid`: The unique task identifier that produced the message.
- `action_status`: Indicates the status of the action.
- `timestamp`: The UNIX timestamp of the message.
- `task_level`: The location of the message within the task's tree of actions.
- `action_type`: The provided `action_type` argument.

You can add additional fields to both the start message and the success message
of an action like this:

```python
def calculate(x, y):
    # additional fields here are added to the start message of the action alone
    [highlight]
    with start_action(action_type="multiply", x=x, y=y) as action:
    [/highlight]
        result = x * y
        # fields added here show up only in the success message of the action
        [highlight]
        action.add_success_fields(result=result)
        [/highlight]
        return result
```

```json
[output]
{"x": 10, "y": 5, "action_status": "started", "timestamp": 1690213820.4083755, "task_uuid": "09df3632-96d2-4dd8-b782-1926cd87ccc9", "action_type": "multiply", "task_level": [1]}
{"result": 50, "action_status": "succeeded", "timestamp": 1690213820.4084144, "task_uuid": "09df3632-96d2-4dd8-b782-1926cd87ccc9", "action_type": "multiply", "task_level": [2]}
```

Another way to log the inputs and results of a function is through the
`log_call` decorator:

```python
from eliot import log_call, to_file

to_file(sys.stdout)


@log_call
def calculate(x, y):
    return x * y


calculate(10, 5)
```

In this case, the `action_type` will be a concatenation of the module and
function name, but the remaining fields will be the same as before:

```json
[output]
{"x": 10, "y": 5, "action_status": "started", "timestamp": 1690214038.799868, "task_uuid": "2c78b304-12a1-474a-8b95-e80deadb8dde", "action_type": "__main__.calculate", "task_level": [1]}
{"result": 50, "action_status": "succeeded", "timestamp": 1690214038.7999015, "task_uuid": "2c78b304-12a1-474a-8b95-e80deadb8dde", "action_type": "__main__.calculate", "task_level": [2]}
```

You can customize the behavior of the `log_call` decorator by changing the
`action_type` field, and excluding certain arguments or the result:

```python
@log_call(action_type="CALC", include_args=["x"], include_result=False)
```

If an uncaught exception is detected within the context of an action, the action
will be marked as failed, and an exception message will be logged instead of a
success message:

```python
import sys
from eliot import log_call, to_file

to_file(sys.stdout)


[highlight]
@log_call
def calculate(x, y):
    return x / y
[/highlight]


try:
    calculate(1, 0)
except ZeroDivisionError as e:
    print("division by zero detected")
```

Instead of a success message, you'll now observe an `exception` message
accompanied with a `reason`:

```json
[output]
{"x": 1, "y": 0, "action_status": "started", "timestamp": 1690215830.1103916, "task_uuid": "f267b0f5-8c07-4828-a973-0a8a273f272d", "action_type": "__main__.calculate", "task_level": [1]}
{"exception": "builtins.ZeroDivisionError", "reason": "division by zero", "action_status": "failed", "timestamp": 1690215830.1104264, "task_uuid": "f267b0f5-8c07-4828-a973-0a8a273f272d", "action_type": "__main__.calculate", "task_level": [2]}
```

When you need to log isolated messages within the context of an action, you can
use the `log` method as follows:

```python
def calculate(x, y):
    with start_action(action_type="multiply") as ctx:
        ctx.log(message_type="mymsg", msg="a standalone message")
        return x * y
```

```json
[output]
{"msg": "a standalone message", "timestamp": 1690217318.2063951, "task_uuid": "500b06e6-c0ba-42b4-9d6c-466ea3f1634d", "task_level": [2], "message_type": "mymsg"}
```

Eliot does not have the concept of log levels, so you can only add the level
field manually if needed:

```python
def calculate(x, y):
    with start_action(action_type="multiply", level="INFO") as ctx:
        ctx.log(message_type="mymsg", msg="a standalone message", level="INFO")
        return x * y
```

Another neat feature of Eliot is its ability to visualize its logs through the
`eliot-tree` command-line tool.

```command
pip install eliot-tree
```

Once you've installed `eliot-tree`, you can pipe the JSON logs produced by Eliot
to the command as follows:

```command
python main.py | eliot-tree
```

![Screenshot from 2023-07-24 19-00-40.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8171e2e8-d28a-47e8-ffc9-3fb7cec51d00/md2x
=1816x878)

If you're logging to a file, you can pass the file as an argument to the tool:

```command
eliot-tree <file>
```

![Screenshot from 2023-07-24 19-00-29.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2d66eec1-5021-4194-b860-b44590a67100/md2x
=2572x1476)

There is so much more to Eliot than can be covered here so ensure to check out
its [documentation](https://eliot.readthedocs.io/en/stable/quickstart.html) to
learn more.

## 5. Logbook

![logbook.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/280e664b-f9e6-4565-0983-a6b7f7431100/md1x
=1200x600)

[Logbook](https://logbook.readthedocs.io/en/stable/) describes itself as a cool
replacement for Python's standard library `logging` module, whose aim is to make
logging fun. You can install it in your project using the following command:

```command
pip install logbook
```

Getting started with Logbook is also really straightforward:

```python
import sys
import logbook

logger = logbook.Logger(__name__)

handler = logbook.StreamHandler(sys.stdout, level="INFO")
handler.push_application()

logger.info("Successfully connected to the database 'my_db' on host 'ubuntu'")

logger.warning("Detected suspicious activity from IP address: 111.222.333.444")
```

```text
[output]
[2023-07-24 21:41:50.932575] INFO: __main__: Successfully connected to the database 'my_db' on host 'ubuntu'
[2023-07-24 21:41:50.932623] WARNING: __main__: Detected suspicious activity from IP address: 111.222.333.444
```

As shown above, the `logbook.Logger` method is used to create a new `logger`
channel.. This logger provides access to level methods like `info()` and
`warning()` for writing log messages. All the log levels in the `logging` module
are supported, with the addition of `NOTICE` level, which sits between `INFO`
and `WARNING`.

Logbook also uses the `Handler` concept to determine the destination and
[formatting of the logs](https://betterstack.com/community/guides/logging/log-formatting/). The `StreamHandler` class sends logs
to any output stream (the standard output in this case), and other handlers are
available for logging to files, Syslog, Redis, Slack etc.

However, unlike the standard `logging` module, you are discouraged from
registering handlers on the logger directly. Instead, you're supposed to bind
the handler to the process, thread, or greenlet stack through the
`push_application()`, `push_thread()`, and `push_greenlet()` methods
respectively. The corresponding `pop_application()`, `pop_thread()`, and
`pop_greenlet()` methods also exist for unregistering handlers:

```python
handler = MyHandler()
handler.push_application()
# everything logged here here goes to that handler
handler.pop_application()
```

You can also bind a handler for the duration of a with-block. This ensures that
logs created within the block are sent only to the specified handler:

```python
with handler.applicationbound():
    logger.info(...)

with handler.threadbound():
    logger.info(...)

with handler.greenletbound():
    logger.info(...)
```

Log formatting is also done through handlers. A `format_string` property exists
on each handler for this purpose, and it accepts properties on the
[LogRecord](https://logbook.readthedocs.io/en/stable/api/base.html#logbook.LogRecord)
class:

```python
import sys
import logbook

logger = logbook.Logger(__name__)

handler = logbook.StreamHandler(sys.stdout, level="INFO")
[highlight]
handler.format_string = "{record.channel} | {record.level_name} | {record.message}"
[/highlight]
handler.push_application()

logger.info("Successfully connected to the database 'my_db' on host 'ubuntu'")

logger.warning("Detected suspicious activity from IP address: 111.222.333.444")
```

```text
[output]
__main__ | INFO | Successfully connected to the database 'my_db' on host 'ubuntu'
__main__ | WARNING | Detected suspicious activity from IP address: 111.222.333.444
```

Unfortunately,
[structured logging isn't supported](https://github.com/getlogbook/logbook/issues/279)
in any of Logbook's built-in handlers. You'd have to implement it yourself via a
custom handler. For more details, see the
[Logbook documentation](https://logbook.readthedocs.io/en/stable/index.html).

## 6. Picologging

![picologging.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/83e342a8-c577-4c3c-6405-60db78639d00/public
=1200x600)

[Mirosoft's Picologging](https://github.com/microsoft/picologging) library is a
relatively new addition to Python's logging ecosystem. Positioned as a
high-performance drop-in replacement for the standard logging module, it boasts
a remarkable 4-10 times speed improvement, as stated in its GitHub Readme. To
integrate it into your project, you can install it with the following command:

```command
pip install picologging
```

Picologging shares the same familiar API as the `logging` module in Python and
it uses the same log record attributes for formatting:

```python
import sys
import picologging as logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

stdout_handler = logging.StreamHandler(sys.stdout)
fmt = logging.Formatter(
    "%(name)s: %(asctime)s | %(levelname)s | %(process)d >>> %(message)s"
)

stdout_handler.setFormatter(fmt)
logger.addHandler(stdout_handler)

logger.info(
    "Successfully connected to the database '%s' on host '%s'", "my_db", "ubuntu20.04"
)

logger.warning("Detected suspicious activity from IP address: %s", "111.222.333.444")
```

```text
[output]
__main__: 2023-07-24 05:46:38,-2046715687 | INFO | 795975 >>> Successfully connected to the database 'my_db' on host 'ubuntu20.04'
__main__: 2023-07-24 05:46:38,-2046715687 | WARNING | 795975 >>> Detected suspicious activity from IP address: 111.222.333.444
```

Picologging's documentation emphasizes that it is currently in an early-alpha
state, so you should hold off on using it in production. Nevertheless, it is
already showing some promise when it comes to performance improvements to the
standard `logging` module according to these
[benchmarks](https://github.com/microsoft/picologging#benchmarks). Please see
the [documentation](https://microsoft.github.io/picologging/index.html) for more

## Final thoughts

Our primary recommendation for logging in Python is to use [Loguru](https://betterstack.com/community/guides/logging/loguru/) due to its **impressive features and user-friendly API**. However, it's crucial to [familiarize yourself](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/) with the built-in `logging` module, as it remains a powerful and widely used solution.

Structlog is another robust option that merits consideration, and Eliot can also be a good choice, provided its lack of log levels isn't a significant concern for your use case. On the other hand, Picologging is currently in its early development stages, and Logbook lacks native support for structured logging, making them less advisable for logging in production.

Once you've chosen your logging framework and implemented it across your Python applications, the next step is **centralizing those logs for effective monitoring and analysis**. [Better Stack](https://betterstack.com/logs) works smoothly with major frameworks. 

Thanks for reading, and happy logging!Thanks for reading, and happy logging!