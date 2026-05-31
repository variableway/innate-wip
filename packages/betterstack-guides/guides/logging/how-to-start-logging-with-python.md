# A Comprehensive Guide to Logging in Python

Logging is essential for building dependable software. It records software events, creating an audit trail that details various system operations. This trail helps diagnose issues, understand runtime behavior, and analyze user interactions, offering insights into design decisions.

Python's `logging` module provides a versatile logging system for messages of different severity levels and controls their presentation. This article gives an overview of this module and guidance on tailoring its behavior.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/Ne8G--eynRA?si=zaACvbd2ZEsXuWX0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Whether you're new to Python or seasoned, you'll learn how to harness the logging module for effective logging in your apps.

## Prerequisites

Before we begin, you should have the latest Python version installed on your
machine (v3.10 at the time of writing). If you are missing Python, you can
[find the installation instructions here](https://docs.python.org/3/using/index.html).

[summary]
## Side note: Get a Python logs dashboard

Save hours of sifting through Python logs. Centralize with [Better Stack](https://betterstack.com/log-management) and start visualizing your log data in minutes.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[/summary]


## Getting started with the logging module

Python's built-in `logging` module is incredibly powerful and boasts the
[necessary logging features](https://betterstack.com/community/guides/logging/logging-framework/) that one might require from a
separate logging framework like [pino for
Node.js](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/) or
[Log4j for Java](https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4j/). Therefore, it remains the
most popular way to log in the Python ecosystem despite the existence of a few
third-party logging frameworks like [Loguru](https://betterstack.com/community/guides/logging/loguru/).

Providing a `logging` module in the standard library ensures that all Python
programs can benefit from having consistent logging features, making it easier
to adopt and understand when working on different projects. To get started with
the `logging` module, you need to import it to your program first, as shown
below:

```python
import logging

logging.debug("A debug message")
logging.info("An info message")
logging.warning("A warning message")
logging.error("An error message")
logging.critical("A critical message")
```

In the example above, we imported the `logging` module and used several of its
methods. When you execute the above program, you should observe the following
output:

```text
[output]
WARNING:root:A warning message
ERROR:root:An error message
CRITICAL:root:A critical message
```

Notice that the `debug()` and `info()` messages are missing from the output
while the others are present. This is due to the default log level configured on
the `logging` module, which we will get to shortly. For now, understand that
this is the intended behavior of the example.

In each record above, you will observe that the log level (`WARNING`, `ERROR`,
etc) is printed in all caps followed by `root`, which is the name of the default
logger. Finally you have the log message that was passed as an argument to the
function. This output format is summarized below:

```text
<LEVEL>:<name>:<message>
```

We will discuss how you can customize this log format to include other
information such as timestamp, file name, and other details in a subsequent
section. With the basics of the `logging` module out of the way, let's discuss
the various log levels available and how you can leverage them in your programs.

## Understanding log levels in Python

[Log levels](https://betterstack.com/community/guides/logging/log-levels-explained/) define the severity of the event that is
being logged. They convey implicit meaning about the program state when the
message was recorded, which is crucial when sieving through large logs for
specific events. For example a message logged at the `INFO` level indicates a
normal and expected event, while one that is logged at the `ERROR` level
signifies that some [unexpected error](https://betterstack.com/community/guides/scaling-python/python-errors/) has occurred.

Each log level in Python is associated with a number (from 10 to 50) and has a
corresponding module-level method in the `logging` module as demonstrated in the
previous example. The available log levels in the `logging` module are listed
below in increasing order of severity:

1. `DEBUG` (10): used to log messages that are useful for debugging.
2. `INFO` (20): used to log events within the parameters of expected program
   behavior.
3. `WARNING` (30): used to log unexpected events which may impede future program
   function but not severe enough to be an error.
4. `ERROR` (40): used to log unexpected failures in the program. Often, an
   exception needs to be raised to avoid further failures, but the program may
   still be able to run.
5. `CRITICAL` (50): used to log severe errors that can cause the application to
   stop running altogether.

It's important to always use the most appropriate log level so that you can
quickly find the information you need. For instance, logging a message at the
`WARNING` level will help you find potential problems that need to be
investigated, while logging at the `ERROR` or `CRITICAL` level helps you
discover problems that need to be rectified immediately. If an inappropriate log
level is used, you will likely miss important events and your application will
be worse off as a result.

By default, the `logging` module will only produce records for events that have
been logged at a severity level of `WARNING` and above. This is why the
`debug()` and `info()` messages were omitted in the previous example since they
are less severe than `WARNING`. You can change this behavior using the
`logging.basicConfig()` method as demonstrated below:

```python
import logging

[highlight]
logging.basicConfig(level=logging.INFO)
[/highlight]

logging.debug("A debug message")
logging.info("An info message")
logging.warning("A warning message")
logging.error("An error message")
logging.critical("A critical message")
```

Ensure to place the call to `logging.basicConfig()` before any methods such as
`info()`, `warning()`, and others are used. It should also be called once as it
is a one-off configuration facility. If called multiple times, only the first
one will have an effect.

When you execute the program now, you will observe the output below:

```text
[output]
INFO:root:An info message
WARNING:root:A warning message
ERROR:root:An error message
CRITICAL:root:A critical message
```

Since we've set the minimum level to `INFO`, we are now able to view the log
message produced by `logging.info()` in addition levels with a greater severity
while the `DEBUG` message remains suppressed.

Setting a default log level in the manner shown above is useful for controlling
the amount of logs that is generated by your application. For example, during
development you could set it to `DEBUG` to see all the log messages produced by
the application, while production environments could use `INFO` or `WARNING`.

## Adding custom log levels to Python

If you're coming to Python from other languages, you may have used other log
levels like `TRACE` or `FATAL` which are not present in Python by default.
However, the `logging` module is quite extensible so it is easy to add custom
levels as you see fit. Here's an example that adds a `TRACE` level and
associates it with the constant number 5 (5 less than `DEBUG`).

```python
import logging


# Adopted from https://stackoverflow.com/a/35804945/1691778
# Adds a new logging method to the logging module
def addLoggingLevel(levelName, levelNum, methodName=None):
    if not methodName:
        methodName = levelName.lower()

    if hasattr(logging, levelName):
        raise AttributeError("{} already defined in logging module".format(levelName))
    if hasattr(logging, methodName):
        raise AttributeError("{} already defined in logging module".format(methodName))
    if hasattr(logging.getLoggerClass(), methodName):
        raise AttributeError("{} already defined in logger class".format(methodName))

    def logForLevel(self, message, *args, **kwargs):
        if self.isEnabledFor(levelNum):
            self._log(levelNum, message, args, **kwargs)

    def logToRoot(message, *args, **kwargs):
        logging.log(levelNum, message, *args, **kwargs)

    logging.addLevelName(levelNum, levelName)
    setattr(logging, levelName, levelNum)
    setattr(logging.getLoggerClass(), methodName, logForLevel)
    setattr(logging, methodName, logToRoot)

# Create the TRACE level
addLoggingLevel("TRACE", logging.DEBUG - 5)
logging.basicConfig(level=logging.TRACE)

# Use the TRACE level
logging.trace("A trace message")
logging.debug("A debug message")
logging.info("An info message")
logging.warning("A warning message")
logging.error("An error message")
logging.critical("A critical message")
```

With this in place, you can use `logging.trace()` wherever you want and it will
work in exactly the same way as the built-in levels.

```text
[output]
TRACE:root:A trace message
DEBUG:root:A debug message
INFO:root:An info message
WARNING:root:A warning message
ERROR:root:An error message
CRITICAL:root:A critical message
```

## Customizing the log format

Beyond the log message itself, it is essential to include as much diagnostic
information about the context surrounding each event being logged. Standardizing
the structure of your logs entries makes it much easier to parse them and
extract only the necessary details.

Generally, a good log entry should include at least the following properties:

1. Timestamp: indicating the time that the event being logged occurred.
2. Log level: indicating the severity of the event.
3. Message: describing the details of the event.

These properties allow for basic filtering by log management tools so you must
ensure they are present in all your Python log entries. At the moment, the
timestamp is missing from our examples so far which prevents us from knowing
when each log entry was created. Let's fix this by changing the log format
through the `logging.basicConfig()` method as shown below:

```python
[label formatting.py]
import logging

[highlight]
logging.basicConfig(format="%(levelname)s | %(asctime)s | %(message)s")
[/highlight]
logging.warning("Something bad is going to happen")
```

The `format` argument above configures how log messages are displayed. It uses
the following
[LogRecord attributes](https://docs.python.org/3/library/logging.html#logrecord-attributes)
for formatting the logs:

- `%(levelname)s`: the log level name (`INFO`, `DEBUG`, `WARNING`, etc).
- `%(asctime)s`: human-readable time indicating when the log was created.
- `%(message)s`: the log message.

With the above configuration in place, all log entries produced by the `logging`
module will now be formatted in following manner:

```text
[output]
WARNING | 2023-02-05 11:41:31,862 | Something bad is going to happen
```

Notice that the `root` name no longer appears in the log entry because the log
format has been redefined to exclude it. The fields are also now separated by
spaces and the `|` character to make them easier to read. After the log level,
you have the log creation time which can be customized further using the
`datefmt` argument to `basicConfig()`:

```python
import logging

logging.basicConfig(
    format="%(levelname)s | %(asctime)s | %(message)s",
    [highlight]
    datefmt="%Y-%m-%dT%H:%M:%SZ",
    [/highlight]
)
logging.warning("Something bad is going to happen")
```

```text
[output]
WARNING | 2023-02-05T11:45:31Z | Something bad is going to happen
```

The `datefmt` argument accepts the same directives as the
[time.strftime()](https://docs.python.org/3/library/time.html#time.strftime)
method. We recommend using the
[ISO-8601 format](https://en.wikipedia.org/wiki/ISO_8601) shown above because it
is widely recognized and supported which makes it easy to process and sort
timestamps in a consistent manner.

Please
[refer to the LogRecord documentation](https://docs.python.org/3/library/logging.html#logrecord-attributes)
to examine all the available attributes that you can use to format your log
entries. Here's another example that uses a few more of these attributes to
customize the log format:

```python
import logging

logging.basicConfig(
    format="%(name)s: %(asctime)s | %(levelname)s | %(filename)s:%(lineno)s | %(process)d >>> %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)

logging.warning("system disk is 85% full")
logging.error("unexpected error")

```

```text
[output]
root: 2023-02-05T14:11:56Z | WARNING | example.py:8 | 428223 >>> system disk is 85% full
root: 2023-02-05T14:11:56Z | ERROR | example.py:9 | 428223 >>> unexpected error
```

## Setting up custom loggers

So far in this tutorial, we've used the default logger (named `root`) to write
logs in the examples. The default logger is accessible and configurable through
module-level methods on the `logging` module (such as `logging.info()`,
`logging.basicConfig()`). However, it is **generally considered a bad idea** to
log in this manner due to a number of reasons:

1. **Namespace collisions**: If multiple modules in your application use the
   root logger, you risk having messages from different modules logged under the
   same name, which can make it more difficult to understand where log messages
   are coming from.

2. **Lack of control**: When using the root logger, it can be difficult to
   control the log level for different aspects of your application. This can
   lead to logging too much information or not enough information, depending on
   your needs.

3. **Loss of context**: Log messages generated by the root logger may not
   contain enough information to provide context about where the log message
   came from, which can make it difficult to determine the source of issues in
   your application.

In general, it's best to avoid using the root logger and instead create a
separate logger for each module in your application. This allows you to easily
control the logging level and configuration for each module, and provide better
context for log messages. Creating a new custom logger can be achieved by
calling the `getLogger()` method as shown below:

```python
import logging

logger = logging.getLogger("example")

logger.info("An info")
logger.warning("A warning")
```

```text
[output]
A warning
```

The `getLogger()` method returns a
[Logger object](https://docs.python.org/3/library/logging.html#logger-objects)
whose name is set to the specified name argument (`example` in this case). A
`Logger` provides all the functions for you to log messages in your application.
Unlike the root logger, its name is not included in the log output by default.
In fact, we don't even get the log level, only the log message is present.
However, it defaults to logging to the standard error just like the root logger.

To change the output and behaviour of a custom logger, you have to use the
[Formatter](https://docs.python.org/3/library/logging.html#logging.Formatter)
and [Handler](https://docs.python.org/3/library/logging.handlers.html) classes
provided by the logging module. The `Formatter` does what you'd expect; it helps
with formatting the output of the logs, while the `Handler` specifies the log
destination which could be the console, a file, an HTTP endpoint, and more. We
also have
[Filter objects](https://docs.python.org/3/library/logging.html#filter-objects)
which provide sophisticated filtering capabilities for your `Logger`s and
`Handler`s.

## Using Handlers

A `Handler` object can be instantiated and added to a `Logger` to send the logs
to a given destination, such as the console, a file, network socket, or HTTP
API. There are several types of
[Handler objects](https://docs.python.org/3/howto/logging.html#useful-handlers),
each with a preconfigured destination. For example,
[StreamHandler](https://docs.python.org/3/library/logging.handlers.html#streamhandler)
sends logs to streams, while
[FileHandler](https://docs.python.org/3/library/logging.handlers.html#logging.FileHandler)
sends logs to disk files.

You can also configure multiple Handlers on a single `Logger` instance so that
the logs produced through that `Logger` can be sent to multiple destinations. We
will show an example of this later on in this tutorial. For now, let's configure
the
[StreamHandler class](https://docs.python.org/3/library/logging.handlers.html#logging.StreamHandler)
on our `logger` so that it logs to the standard output instead of the standard
error.

```python
import sys
import logging

logger = logging.getLogger("example")

[highlight]
stdout = logging.StreamHandler(stream=sys.stdout)
stdout.setLevel(logging.INFO)

logger.addHandler(stdout)
[/highlight]

logger.info("An info")
logger.warning("A warning")
```

The `StreamHandler()` class accepts a `stream` argument which is defined to be
the standard output in this example. The resulting object is stored in the
`stdout` variable and a minimum level of `INFO` is set on this object so that
only records of `INFO` severity or higher are logged to the standard output.

However, when you execute the above program, you'll notice that only the
`WARNING` level was produced as before:

```text
[output]
A warning
```

This is because while the `stdout` handler allows `INFO` logs or higher to pass
through, the minimum level on the `logger` is still at `WARNING` so the `INFO`
log will continue to be suppressed. To fix this you must set the minimum level
on the `Logger` object itself as shown below:

```python
. . .
[highlight]
logger.setLevel(logging.INFO)
[/highlight]

logger.info("An info")
logger.warning("A warning")
```

At this point, both entries will now be present in the output:

```text
[output]
An info
A warning
```

The usefulness of setting a minimum level on the `Handler` object will become
apparent later when we demonstrate using multiple handlers. For now though,
let's look at how to customize the log format.

## Using Formatters

The `logging.Formatter` class determines the format of the log entries produced
by a `Logger`. By default, a `Logger` will not have a specific format, so all it
outputs is the log message (that is `%(message)s` as seen in the previous
section). We can create and attach a `Formatter` object to the `Logger` to give
it a specific format.

```python
[label example.py]
import sys
import logging

logger = logging.getLogger("example")

stdout = logging.StreamHandler(stream=sys.stdout)

[highlight]
fmt = logging.Formatter(
    "%(name)s: %(asctime)s | %(levelname)s | %(filename)s:%(lineno)s | %(process)d >>> %(message)s"
)

stdout.setFormatter(fmt)
[/highlight]
logger.addHandler(stdout)

logger.setLevel(logging.INFO)

logger.info("An info")
logger.warning("A warning")
```

The `Formatter` class above is configured using the same LogRecord attributes
from our earlier `logging.basicConfig()` examples. It also accepts some other
[options](https://docs.python.org/3/library/logging.html#logging.Formatter) but
this is enough for us to get started.

When you execute the program now, you'll observe the following output:

```text
example: 2023-02-05 21:21:46,634 | INFO | example.py:17 | 653630 >>> An info
example: 2023-02-05 21:21:46,634 | WARNING | example.py:18 | 653630 >>> A warning
```

Notice that the logger name (`example`) corresponds to the string argument
passed to the `getLogger()` method. You can also set the logger name to be the
name of the current module by using the special `__name__` variable:

```python
logger = logging.getLogger(__name__)
```

This will produce the following output:

```text
[output]
__main__: 2023-02-05 21:42:50,882 | INFO | example.py:17 | 675470 >>> An info
__main__: 2023-02-05 21:42:50,882 | WARNING | example.py:18 | 675470 >>> A warning
```

Now, the logger name is registered as `__main__` indicating that the records
were logged from the module where execution starts. If the `example.py` file is
imported in some other file and that file is executed, the `__name__` variable
will correspond to the module name (`example`).

```python
[label exec.py]
import example
```

```command
python exec.py
```

```text
[output]
example: 2023-02-05 21:21:46,634 | INFO | example.py:17 | 653630 >>> An info
example: 2023-02-05 21:21:46,634 | WARNING | example.py:18 | 653630 >>> A warning
```

### Coloring Python log output

If you're logging to the console as we've been doing so far, it may be helpful
to [color your log output](https://betterstack.com/community/questions/how-to-color-python-logging-output/) so that the
different fields and levels are easily distinguishable at a glance. Here's an
example that uses the [colorlog](https://pypi.org/project/colorlog/) to achieve
log output coloring in Python:

```python
import sys
import logging
import colorlog

logger = logging.getLogger("example")

stdout = colorlog.StreamHandler(stream=sys.stdout)

fmt = colorlog.ColoredFormatter(
    "%(name)s: %(white)s%(asctime)s%(reset)s | %(log_color)s%(levelname)s%(reset)s | %(blue)s%(filename)s:%(lineno)s%(reset)s | %(process)d >>> %(log_color)s%(message)s%(reset)s"
)

stdout.setFormatter(fmt)
logger.addHandler(stdout)

logger.setLevel(logging.DEBUG)

logger.debug("A debug message")
logger.info("An info message")
logger.warning("A warning message")
logger.error("An error message")
logger.critical("A critical message")
```

Ensure to install the package first before executing the above program:

```command
pip install colorlog
```

You should now observe the following output:

![Screenshot from 2023-02-07 14-58-04.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/da15b510-e52d-4ddf-db6e-014c7ae72e00/lg1x=869x420)

See the [colorlog documentation](https://pypi.org/project/colorlog/) for more
details on the different options available.

## Using Filters

`Filter` objects in Python's logging module allow you to selectively include or
exclude log messages based on specific criteria. They implement a single method
filter(record), which returns either `True` to include the log message or
`False` to exclude the log message. Here's an example:

```python
import sys
import logging


[highlight]
class LevelFilter(logging.Filter):
    def __init__(self, level):
        self.level = level

    def filter(self, record):
        if record.levelno == self.level:
            return True
[/highlight]


logger = logging.getLogger(__name__)

stdout = logging.StreamHandler(stream=sys.stdout)

fmt = logging.Formatter(
    "%(name)s: %(asctime)s | %(levelname)s | %(filename)s%(lineno)s | %(process)d >>> %(message)s"
)

[highlight]
level_filter = LevelFilter(logging.WARNING)
logger.addFilter(level_filter)
[/highlight]

stdout.setFormatter(fmt)
logger.addHandler(stdout)

logger.setLevel(logging.INFO)

logger.info("An info")
logger.warning("A warning")
logger.error("An error")
```

The `LevelFilter` class above is used to filter out any log record that does not
match the exact specified log level when the filter object was created
(`logging.WARNING`). This is different from the standard log levels which also
allow levels of a greater severity to be recorded. When you run this example,
you'll observe that only `WARNING` records are produced while `INFO` and `ERROR`
are suppressed because they've been filtered out.

```text
[output]
__main__: 2023-02-06 05:58:12,079 | WARNING | example.py:32 | 727478 >>> A warning
```

In this manner, you can use filters to implement a wide range of logging
policies, such as including only messages from certain parts of your
application, only messages of a certain severity, or only messages that contain
certain text. By using filters, you will have fine-grained control over what
records are included in your logs.

## Adding contextual data to your logs

In many situations, you may need to add some variable data to your log records
in order to fully capture the event that occurred. For example, you might need
to log the ID of a transaction, or the user ID that performed an action. So that
instead of recording a message that like this:

```text
user logged in
```

You can have something like this:

```text
user 'james' logged in
```

Adding contextual variables in the manner shown above can be done by using a
formatting directive in the log message and passing variable data as arguments.

```python
import sys
import logging


logger = logging.getLogger(__name__)

stdout = logging.StreamHandler(stream=sys.stdout)

fmt = logging.Formatter(
    "%(name)s: %(asctime)s | %(levelname)s | %(filename)s%(lineno)s | %(process)d >>> %(message)s"
)

stdout.setFormatter(fmt)
logger.addHandler(stdout)

logger.setLevel(logging.INFO)

name = "james"
browser = "firefox"
[highlight]
logger.info("user %s logged in with %s", name, browser)
[/highlight]
```

```text
[output]
__main__: 2023-02-09 08:37:47,860 | INFO | main.py20 | 161954 >>> user james logged in with firefox
```

You can also use the newer
[formatted string literals (f-strings)](https://docs.python.org/3/reference/lexical_analysis.html#f-strings)
syntax which are easier to read:

```python
. . .
logger.info(f"user {name} logged in with {browser}")
```

However, note that
[the `logging` module is optimized to use the `%` formatting style](https://docs.python.org/3/howto/logging.html#optimization)
and the use of f-strings might have an extra cost since formatting will occur
even if the message isn't logged. So even though f-strings are easier to read,
you should probably stick to the `%` style to guarantee best performance.

Another way to add context to your logs is by passing the `extra` parameter to
any level method to supply a dictionary of custom attributes to the record. This
is useful in cases where all your application logs need to have certain
information present in the entry, but those details are dependent on the
execution context.

Here's an example that demonstrates the `extra` argument:

```python
import sys
import logging


logger = logging.getLogger(__name__)

stdout = logging.StreamHandler(stream=sys.stdout)

fmt = logging.Formatter(
    "%(name)s: %(asctime)s | %(levelname)s | %(filename)s%(lineno)s | %(process)d >>> %(message)s"
)

stdout.setFormatter(fmt)
logger.addHandler(stdout)

logger.setLevel(logging.INFO)

[highlight]
logger.info("Info message", extra={"user": "johndoe", "session_id": "abc123"})
logger.warning("Warning message", extra={"user": "joegage", "session_id": "3fe-uz"})
logger.error("Error message", extra={"user": "domingrange", "session_id": "2fe-a1"})
[/highlight]
```

Assuming your logs need to include information on the current user and session
ID, you can include those details in a dictionary and pass them to the `extra`
argument. However, when you run this code you'll notice that the values in the
`extra` argument don't appear in the output:

```text
[output]
__main__: 2023-02-09 08:43:30,827 | INFO | main.py18 | 175097 >>> Info message
__main__: 2023-02-09 08:43:30,827 | WARNING | main.py19 | 175097 >>> Warning message
__main__: 2023-02-09 08:43:30,827 | ERROR | main.py20 | 175097 >>> Error message
```

This is because our current log format does not include any of the fields in the
`extra` dictionary. We can fix this by modifying the `format` argument as
follows:

```python
. . .
fmt = logging.Formatter(
    "%(name)s: %(asctime)s | %(levelname)s | %(filename)s%(lineno)s | %(process)d | %(user)s | %(session_id)s >>> %(message)s"
)
. . .
```

Notice that the `user` and `session_id` fields have now been added to the log
format. This ensures that the corresponding values are substituted accordingly:

```text
[output]
__main__: 2023-02-09 08:46:07,588 | INFO | main.py18 | 178735 | johndoe | abc123 >>> Info message
__main__: 2023-02-09 08:46:07,588 | WARNING | main.py19 | 178735 | joegage | 3fe-uz >>> Warning message
__main__: 2023-02-09 08:46:07,588 | ERROR | main.py20 | 178735 | domingrange | 2fe-a1 >>> Error message
```

There are two main things to note when using the `extra` property:

First, the field names used in the `extra` dictionary should not clash with any
of the
[LogRecord attributes](https://docs.python.org/3/library/logging.html#logrecord-attributes)
otherwise you will get a `KeyError` when you run the program:

```python
# the message field here clashes with the `message` LogRecord attribute
logger.info(
  "Info message",
  extra={"user": "johndoe", "session_id": "abc123", "message": "override info
  message"},
)
```

```text
[output]
. . .
File "/usr/lib64/python3.11/logging/__init__.py", line 1606, in makeRecord
 raise KeyError("Attempt to overwrite %r in LogRecord" % key)
[highlight]
KeyError: "Attempt to overwrite 'message' in LogRecord"
[/highlight]
```

Another noteworthy behaviour is that modifying the log format with custom
attributes (such as `user` and `session_id`) means that these values must always
be supplied at log point in the `extra` parameter. If you omit them, you'll get
a different exception which looks like this:

```python
# notice that the `user` field is missing here
logger.info("Info message", extra={"session_id": "abc123"})
```

```text
[output]
--- Logging error ---
Traceback (most recent call last):
  File "/usr/lib64/python3.11/logging/__init__.py", line 449, in format
    return self._format(record)
           ^^^^^^^^^^^^^^^^^^^^
  File "/usr/lib64/python3.11/logging/__init__.py", line 445, in _format
    return self._fmt % values
           ~~~~~~~~~~^~~~~~~~
KeyError: 'user'
```

These limitations, especially the second one, can make using the `extra`
parameter impractical for many use cases but I will show how to get around them
in the next section of this tutorial.

## Structured JSON logging in Python

So far in this tutorial, we've been logging in a custom plain text format that
is human-readable. However, most logs aren't read directly by humans anymore but
processed with [log aggregation tools](https://betterstack.com/community/guides/logging/log-aggregation/) first to quickly extract
the insights required. With our current plain text format, most of these tools
will be unable to automatically parse our logs (at least without the help of
some complex regular expression). Therefore, we need to log in a standard
structured format (such as JSON) to ensure that the logs are easily
machine-parseable.

To achieve structured JSON logging through Python's `logging` module, you can
utilize the techniques provided in the
[logging cookbook](https://docs.python.org/3/howto/logging-cookbook.html#implementing-structured-logging)
or just use the
[python-json-logger](https://github.com/madzak/python-json-logger) library. We
will go with the second option in this tutorial. Go ahead and install the
package through the command below:

```command
pip install python-json-logger
```

Afterward, import it into your program as follows:

```python
import sys
import logging
[highlight]
from pythonjsonlogger import jsonlogger
[/highlight]

logger = logging.getLogger(__name__)

stdout = logging.StreamHandler(stream=sys.stdout)

[highlight]
fmt = jsonlogger.JsonFormatter(
    "%(name)s %(asctime)s %(levelname)s %(filename)s %(lineno)s %(process)d %(message)s"
)
[/highlight]

stdout.setFormatter(fmt)
logger.addHandler(stdout)

logger.setLevel(logging.INFO)

logger.info("An info")
logger.warning("A warning")
logger.error("An error")
```

You will observe the following output:

```text
[output]
{"name": "__main__", "asctime": "2023-02-06 07:14:13,616", "levelname": "INFO", "filename": "example.py", "lineno": 19, "process": 810435, "message": "An info"}
{"name": "__main__", "asctime": "2023-02-06 07:14:13,617", "levelname": "WARNING", "filename": "example.py", "lineno": 20, "process": 810435, "message": "A warning"}
{"name": "__main__", "asctime": "2023-02-06 07:14:13,617", "levelname": "ERROR", "filename": "example.py", "lineno": 21, "process": 810435, "message": "An error"}
```

The `LogRecord` attributes passed as arguments to `JsonFormatter()` are all
present in the output and they present under their original names. If you want
to rename the fields, you can use the `rename_fields` argument as shown below.
You can also customize the date format using the `datefmt` property as before:

```python
fmt = jsonlogger.JsonFormatter(
    "%(name)s %(asctime)s %(levelname)s %(filename)s %(lineno)s %(process)d %(message)s",
    rename_fields={"levelname": "severity", "asctime": "timestamp"},
)
```

```text
[output]
{"name": "__main__", "timestamp": "2023-02-06T09:04:09Z", "severity": "INFO", "filename": "example.py", "lineno": 21, "process": 858552, "message": "An info"}
{"name": "__main__", "timestamp": "2023-02-06T09:04:09Z", "severity": "WARNING", "filename": "example.py", "lineno": 22, "process": 858552, "message": "A warning"}
{"name": "__main__", "timestamp": "2023-02-06T09:04:09Z", "severity": "ERROR", "filename": "example.py", "lineno": 23, "process": 858552, "message": "An error"}
```

One of the advantages of using the `python-json-logger` library is that is
allows you to add context to your logs through the `extra` property without
needing to modify the log format. The keys in the `extra` dictionary will be
added to the JSON output as top-level keys so you only need to be careful not to
use the default LogRecord attribute names (which will cause a `KeyError`
exception).

```python
. . .

logger.info("An info")
logger.warning("A warning")
[highlight]
logger.error("An error", extra={"user_id": "james103", "session_id": "eheo3e"})
[/highlight]
```

```text
[output]
{"name": "__main__", "timestamp": "2023-02-06T09:08:04Z", "severity": "INFO", "filename": "example.py", "lineno": 21, "process": 872558, "message": "An info"}
{"name": "__main__", "timestamp": "2023-02-06T09:08:04Z", "severity": "WARNING", "filename": "example.py", "lineno": 22, "process": 872558, "message": "A warning"}
{"name": "__main__", "timestamp": "2023-02-06T09:08:04Z", "severity": "ERROR", "filename": "example.py", "lineno": 23, "process": 872558, "message": "An error", "user_id": "james103", "session_id": "eheo3e"}
```

Notice how the `user_id` and `session_id` fields are present in the `ERROR` log
without needing to modify the log format. This means you can use any arbitrary
properties necessary at log point and it will just work as expected. The rest of
this tutorial will assume use of the `python-json-logger` package for structured
logging.

## Logging errors in Python

![Screenshot from 2023-02-08 11-32-06.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3c815a07-da29-40e6-af18-7f5beeab4200/lg2x=1801x1002)

Errors are often the most common target for logging so its important to
understand what tools the `logging` module provides for logging errors in Python
so that all the necessary information about the error is captured properly to
aid the debugging process.

The `ERROR` level is the primary way for recording errors in your programs. If
an problem is particularly severe to the function of your program, you may log
it at the `CRITICAL` level instead. The `logging` module also provides an
`exception()` method on a `Logger` which is essentially an alias for
`logging.error(<msg>, exc_info=1)`. Let's see it in action:

```python
import sys
import logging
from pythonjsonlogger import jsonlogger

logger = logging.getLogger(__name__)

stdoutHandler = logging.StreamHandler(stream=sys.stdout)

jsonFmt = jsonlogger.JsonFormatter(
    "%(name)s %(asctime)s %(levelname)s %(filename)s %(lineno)s %(process)d %(message)s",
    rename_fields={"levelname": "severity", "asctime": "timestamp"},
    )
    datefmt="%Y-%m-%dT%H:%M:%SZ",

stdoutHandler.setFormatter(jsonFmt)
logger.addHandler(stdoutHandler)

logger.setLevel(logging.INFO)

[highlight]
try:
    1 / 0
except ZeroDivisionError as e:
    logger.error(e, exc_info=True)
    logger.exception(e)
    logger.critical(e, exc_info=True)
[/highlight]
```

```text
[output]
{"name": "__main__", "timestamp": "2023-02-06T09:28:54Z", "severity": "ERROR", "filename": "example.py", "lineno": 26, "process": 913135, "message": "division by zero", "exc_info": "Traceback (most recent call last):\n  File \"/home/betterstack/community/python-logging/example.py\", line 24, in <module>\n    1 / 0\n    ~~^~~\nZeroDivisionError: division by zero"}
{"name": "__main__", "timestamp": "2023-02-06T09:28:54Z", "severity": "CRITICAL", "filename": "example.py", "lineno": 27, "process": 913135, "message": "division by zero", "exc_info": "Traceback (most recent call last):\n  File \"/home/betterstack/community/python-logging/example.py\", line 24, in <module>\n    1 / 0\n    ~~^~~\nZeroDivisionError: division by zero"}
{"name": "__main__", "timestamp": "2023-02-06T09:28:54Z", "severity": "ERROR", "filename": "example.py", "lineno": 28, "process": 913135, "message": "division by zero", "exc_info": "Traceback (most recent call last):\n  File \"/home/betterstack/community/python-logging/example.py\", line 24, in <module>\n    1 / 0\n    ~~^~~\nZeroDivisionError: division by zero"}
```

The `error()` and `exception()` methods produced exactly the same output, while
`critical()` differs only in the `severity` property. In all three cases, the
exception info is added to the record under the `exc_info` property. Note that
the `exc_info` argument should only be used in an exception context otherwise
`exc_info` will be set to `NoneType: None` in the output.

```text
{"name": "__main__", "timestamp": "2023-02-06T09:35:27Z", "severity": "ERROR", "filename": "example.py", "lineno": 21, "process": 923890, "message": "error", "exc_info": "NoneType: None"}
```

If you want to add a stack trace to any of your logs outside an exception
context, use the `stack_info` argument instead:

```python
logger.debug("debug", stack_info=True)
logger.error("error", stack_info=True)
```

The stack trace can be found under the `stack_info` property:

```text
[output]
{"name": "__main__", "timestamp": "2023-02-06T09:39:47Z", "severity": "DEBUG", "filename": "example.py", "lineno": 21, "process": 934209, "message": "debug", "stack_info": "Stack (most recent call last):\n  File \"/home/betterstack/community/python-logging/example.py\", line 21, in <module>\n    logger.debug(\"debug\", stack_info=True)"}
{"name": "__main__", "timestamp": "2023-02-06T09:39:47Z", "severity": "ERROR", "filename": "example.py", "lineno": 22, "process": 934209, "message": "error", "stack_info": "Stack (most recent call last):\n  File \"/home/betterstack/community/python-logging/example.py\", line 22, in <module>\n    logger.error(\"error\", stack_info=True)"}
```

### Logging uncaught exceptions

Uncaught exceptions are caused by a failure to handle a thrown exception in the
program with a `try/catch` block. When an such an exception occurs, the program
terminates abruptly and an error message (traceback) is printed to the console.

It is helpful to [log uncaught
exceptions](https://betterstack.com/community/questions/how-to-log-uncaught-exceptions-in-python/) at the `CRITICAL` level so
that you can identify the root cause of the problem and take appropriate action
to fix it. If you're sending your logs to a log management tool like
[Logtail](https://betterstack.com/logtail), you can configure alerting on such
errors so that they are speedily resolved to prevent recurrence.

![Screenshot from 2023-02-08 11-45-23.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/befee414-854c-4405-2258-7102cee1eb00/lg1x=822x762)

Here's how you can ensure such exceptions are logged properly in Python:

```python
import sys
import logging
from pythonjsonlogger import jsonlogger

logger = logging.getLogger(__name__)

stdoutHandler = logging.StreamHandler(stream=sys.stdout)

jsonFmt = jsonlogger.JsonFormatter(
    "%(name)s %(asctime)s %(levelname)s %(filename)s %(lineno)s %(process)d %(message)s",
    rename_fields={"levelname": "severity", "asctime": "timestamp"},
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)

stdoutHandler.setFormatter(jsonFmt)

logger.addHandler(stdoutHandler)
logger.setLevel(logging.DEBUG)


[highlight]
def handle_exception(exc_type, exc_value, exc_traceback):
    if issubclass(exc_type, KeyboardInterrupt):
        sys.__excepthook__(exc_type, exc_value, exc_traceback)
        return

    logger.critical("Uncaught exception", exc_info=(exc_type, exc_value, exc_traceback))


sys.excepthook = handle_exception

# Cause an unhandled exception
raise RuntimeError("Test unhandled")
[/highlight]
```

```text
[output]
{"name": "__main__", "timestamp": "2023-02-07T14:36:42Z", "severity": "CRITICAL", "filename": "example.py", "lineno": 26, "process": 1437321, "message": "Uncaught exception", "exc_info": "Traceback (most recent call last):\n  File \"/home/betterstack/community/python-logging/example.py\", line 31, in <module>\n    raise RuntimeError(\"Test unhandled\")\nRuntimeError: Test unhandled"}
```

With this setup in place, you'll always know when an uncaught exception occurs
and diagnosing the cause it should be a breeze since all the details have been
recorded in the log.

## Logging to a file

Next, let's discuss how to store Python logs in a file. This can be done in many
ways but the most basic way involves setting up a `Handler` that transports the
logs to a file. Fortunately the `logging.FileHandler` class exists for this
purpose:

```python
import sys
import logging
from pythonjsonlogger import jsonlogger


logger = logging.getLogger(__name__)

stdoutHandler = logging.StreamHandler(stream=sys.stdout)
[highlight]
fileHandler = logging.FileHandler("logs.txt")
[/highlight]

jsonFmt = jsonlogger.JsonFormatter(
    "%(name)s %(asctime)s %(levelname)s %(filename)s %(lineno)s %(process)d %(message)s",
    rename_fields={"levelname": "severity", "asctime": "timestamp"},
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)

stdoutHandler.setFormatter(jsonFmt)
[highlight]
fileHandler.setFormatter(jsonFmt)
[/highlight]

logger.addHandler(stdoutHandler)
[highlight]
logger.addHandler(fileHandler)
[/highlight]

logger.setLevel(logging.DEBUG)

logger.debug("A debug message")
logger.error("An error message")
```

Once a new `FileHandler` object is created, you can set your preferred format
for the handler and add it to the `Logger` as shown above. When you execute the
program, the logs will be printed to the standard output as before but also
stored in a `logs.txt` file in the current working directory.

```command
cat logs.txt
```

```text
[output]
{"name": "__main__", "timestamp": "2023-02-06T10:19:34Z", "severity": "DEBUG", "filename": "example.py", "lineno": 30, "process": 974925, "message": "A debug message"}
{"name": "__main__", "timestamp": "2023-02-06T10:19:34Z", "severity": "ERROR", "filename": "example.py", "lineno": 31, "process": 974925, "message": "An error message"}
```

If you're logging to multiple `Handlers`s (as above) you don't have to use the
same format for all of them. For example, structured JSON logs can be a little
hard to read in development so you can retain the plain text formatting for the
`stdoutHandler` while JSON formatted logs go to a file to be further processed
through log management tools.

```python
[label example.py]
import sys
import logging

logger = logging.getLogger(__name__)

stdoutHandler = logging.StreamHandler(stream=sys.stdout)
fileHandler = logging.FileHandler("logs.txt")

[highlight]
stdoutFmt = logging.Formatter(
    "%(name)s: %(asctime)s | %(levelname)s | %(filename)s:%(lineno)s | %(process)d >>> %(message)s"
)
[/highlight]

jsonFmt = jsonlogger.JsonFormatter(
    "%(name)s %(asctime)s %(levelname)s %(filename)s %(lineno)s %(process)d %(message)s",
    rename_fields={"levelname": "severity", "asctime": "timestamp"},
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)

[highlight]
stdoutHandler.setFormatter(stdoutFmt)
[/highlight]
fileHandler.setFormatter(jsonFmt)

logger.addHandler(stdoutHandler)
logger.addHandler(fileHandler)

logger.setLevel(logging.DEBUG)

logger.debug("A debug message")
logger.error("An error message")
```

```command
python example.py
```

```text
[output]
__main__: 2023-02-06 10:34:25,172 | DEBUG | example.py:30 | 996769 >>> A debug message
__main__: 2023-02-06 10:34:25,173 | ERROR | example.py:31 | 996769 >>> An error message
```

```command
cat logs.txt
```

```text
[output]
{"name": "__main__", "timestamp": "2023-02-06T10:19:34Z", "severity": "DEBUG", "filename": "example.py", "lineno": 30, "process": 974925, "message": "A debug message"}
{"name": "__main__", "timestamp": "2023-02-06T10:19:34Z", "severity": "ERROR", "filename": "example.py", "lineno": 31, "process": 974925, "message": "An error message"}
```

You can take this further by setting a different minimum log levels on the
`Handler`s or using a `Filter` object to prevent certain logs from being sent to
any of the destinations. I'll leave you to experiment further with that on your
own.

### Automatically rotating log files

When you're logging to files, you need to be careful not to allow the file grow
too large and consume a huge amount of disk space. By rotating log files, older
logs can be compressed or deleted, freeing up space and reducing the risk of
disk usage issues. Additionally, rotating logs helps to maintain an easily
manageable set of log files, and can also be used to reduce the risk of
sensitive information exposure by removing logs after a set period of time.

We generally recommend using
[Logrotate](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) to manage
log file rotation since it is the standard way to do it on Linux servers.
However, the `logging` module also provides two `Handler`s to help with solving
this problem:
[RotatingFileHandler](https://docs.python.org/3/library/logging.handlers.html#rotatingfilehandler)
and
[TimedRotatingFileHandler](https://docs.python.org/3/library/logging.handlers.html#timedrotatingfilehandler).

```command
from logging.handlers import RotatingFileHandler

fileHandler = RotatingFileHandler("logs.txt", backupCount=5, maxBytes=5000000)
```

The `RotatingFileHandler` class takes the filename as before but also a few
other properties. The most crucial of these are `backupCount` and `maxBytes`.
The former determines how many backup files will be kept while the latter
determines the maximum size of a log file before it is rotated. In this manner,
each file is kept to a reasonable size and older logs don't clog up storage
space unnecessarily.

With this setting in place, the `logs.txt` file will be created and written to
as before until it reaches 5 megabytes. It will subsequently be renamed to
`logs.txt.1` and a new `logs.txt` file will be created once again. When the new
file gets to 5 MB, it will be renamed to `logs.txt.1` and the previous
`logs.txt.1` file will be renamed to `logs.txt.2`. This process continues until
we get to `logs.txt.5`. At that point, the oldest file (`logs.txt.5`) gets
deleted to make way for the newer logs.

The `TimedRotatingFileHandler` class works in a similar manner, except that it
uses timed intervals to determine when the log file should be rotated. For
example, you can use the following configuration to rotate files once a day at
midnight, while keeping a maximum of 5 backup files.

```python
from logging.handlers import TimedRotatingFileHandler

fileHandler = TimedRotatingFileHandler(
    "logs.txt", backupCount=5, when="midnight"
)
```

## The Python logging hierarchy

Before closing out this tutorial, let's touch base on Python's logging hierarchy
and how it works. The Python logging hierarchy is a way of organizing loggers
into a tree structure based on their names with the root logger at the top.

Each custom logger has a unique name, and loggers with similar names form a
hierarchy. When a logger is created, it inherits log levels and handlers from
the nearest ancestor that does if it doesn't have those settings on itself. This
allows for fine-grained control over how log messages are handled.

For example, a logger named `app.example` is the child of the `app` logger which
in turn is the child of the "root" logger:

```python
import logging

app_logger = logging.getLogger("app")
module_logger = logging.getLogger("app.module")

print(app_logger.parent)
print(module.parent)
```

```text
[output]
<RootLogger root (WARNING)>
<Logger app (WARNING)>
```

Notice how the log level of the app logger is `WARNING` despite not setting a
log level on it directly. This is because the default log level for custom
loggers is a special `NOTSET` value which causes Python traverse its chain of
ancestors until one with a level other than `NOTSET` is found, or the root is
reached. Since `root` is set to `WARNING` by default, the effective level of
`app` (and `app.example`) is also warning. However, if root also has a level of
`NOTSET`, then all messages will be processed.

The `propagate` argument in the Python logging module is used to control whether
log messages should be passed up the logging hierarchy to parent loggers. By
default, this argument is set to `True`, meaning that log messages are
propagated up the hierarchy.

If the `propagate` argument is set to `False` for a particular logger, log
messages emitted by that logger will not be passed up the hierarchy to its
parent loggers. This allows for greater control over log message handling, as it
allows you to prevent messages from being handled by parent loggers.

For example, consider a logging hierarchy with a root logger, an `app` logger,
and a `app.module1` logger. If the `propagate` argument is set to `False` for
the `app.module1` logger, log messages emitted by this logger will only be
handled by handlers attached directly to it and will not be passed up to the
`app` logger or the `root` logger.

In general, it's a good practice to set the `propagate` argument to `False` only
when necessary, as it can lead to unexpected behavior and make it harder to
manage logging in a complex application. However, in some cases, it may be
desirable to turn off propagation in order to provide greater control over
logging behavior.

## Best practices for logging in Python

Let's wrap up this article by looking at a few best practices to help you put
together an effective logging strategy in your Python applications:

1. **Use meaningful logger names**: Give loggers meaningful names that reflect
   their purpose, using dots as separators to create a hierarchy. For example, a
   logger for a module could be named `module.submodule`. You can use the
   `__name__` variable to achieve this naming convention.

2. **Avoid using the root logger**: The root logger is a catch-all logger that
   can be difficult to manage. Instead, create specific loggers for different
   parts of your application.

3. **Set the appropriate log levels**: For example, you can use `WARNING` in
   production and `DEBUG` in development or testing environments.

4. **Centralize your logging configuration**: Centralizing your logging
   configuration in a single location will make it much easier to manage.

5. **Aggregate your logs**: Consider using a library like
   [logtail-python](https://github.com/logtail/logtail-python) for centralizing
   your logs, as it provides advanced features like centralized logging,
   aggregation, and alerting.

6. **Include as much context as necessary**: Ensure that relevant context
   surrounding the event being logged is included in the log record. At a
   minimum, records should always include the severity level, the logger name,
   and the time the message was emitted.

7. **Avoid logging sensitive information**: Avoid logging sensitive information,
   such as passwords, security keys or user data, as it could compromise the
   security of your application.

8. **Test your logging configuration**: Test your logging configuration in
   different scenarios to ensure that it behaves as expected before deploying to
   production.

9. **Rotate log files regularly**: Regularly rotate log files to keep them from
   growing too large and becoming difficult to manage. We recommend using
   [Logrotate](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) but you
   can also use the `RotatingFileHandler` or `TimedRotatingFileHandler` as
   demonstrated in this article.


## Centralizing your logs with Better Stack

Once you've implemented these logging best practices, the next step is centralizing your logs for analysis and monitoring. [Better Stack](https://betterstack.com/logs) provides OpenTelemetry-native log management at a fraction of the cost of traditional platforms—30x cheaper than Datadog with predictable pricing starting at $0.25/GB.

Better Stack's eBPF-based collector gathers logs, metrics, and network traces from your Kubernetes or Docker clusters without any code changes. The remotely controlled collector uses OpenTelemetry under the hood, letting you adjust sampling, compression, and batching on the fly.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/_pv2tKoBnGo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


If your applications produce plaintext logs, Better Stack automatically transforms them into structured JSON during ingestion. You can click on any field to filter context instantly, and query your data using live tail filtering, a drag-and-drop builder, SQL, or PromQL—all executing in sub-seconds even across petabytes of data.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


**Key features:**

- Zero-instrumentation log collection with eBPF
- Automatic log structuring from plaintext to JSON
- Live tail filtering and one-click pattern detection
- SQL and PromQL queries with sub-second response times
- Mark logs "as spam" to avoid billing for noise
- Customizable retention periods per source
- Built-in anomaly detection and incident management
- eBPF-based service maps and distributed tracing

Getting started takes just minutes: sign up for a [free account](https://betterstack.com/logs), install the collector or use OpenTelemetry, and start querying your logs immediately.
## Final thoughts and next steps

We've covered a lot of ground so far in this tutorial, and I'm sure you'd like
to know how all these features come together in a real-world application.
Therefore, we've provided another comprehensive tutorial discussing a practical
example of [how to use the Python`logging` module in a Django web
application](https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/) and how to use a log management
platform to analyze and manage your application logs. When your application is ready, you can check how to [optimize your deployment](https://betterstack.com/community/guides/scaling-python/dockerize-django/) process across different environments.

By following through with the tutorial you'll see many of the `logging` features
we've discussed here in action, and get a more solid understanding of how to use
it in your projects.

Thanks for reading, and happy logging!
