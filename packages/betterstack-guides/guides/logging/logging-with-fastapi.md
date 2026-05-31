# How to Get Started with Logging in FastAPI

Logging is an important part of building FastAPI apps. It helps you see what your API is doing, spot problems, and understand where it might be slowing down. 

FastAPI doesn’t have its own logging system, but it works well with Python’s built-in logging tools. 

In this guide, I’ll show you how to set up logging the right way in your FastAPI app.

[ad-logs]

## Prerequisites

Before diving into logging with FastAPI, you'll need:

- Python 3.7+ (required for FastAPI's async features)
- Basic familiarity with FastAPI concepts
- A development environment with your favorite code editor


## Getting started with logging in FastAPI

In this section, you'll set up a simple FastAPI project and see how adding logging can transform your understanding of what's happening inside your application. 

First, create a new directory for your project and move into it:

```command
mkdir fastapi-logging-demo && cd fastapi-logging-demo
```

Next, create and activate a virtual environment:

```command
python3 -m venv venv
```

```command
source venv/bin/activate
```

Then, install FastAPI with its standard dependencies:

```command
pip install "fastapi[standard]"
```

With the environment set up and dependencies installed, you’re ready to build your first FastAPI application.

## Creating a basic FastAPI application

Let's start by creating a minimal FastAPI app without any logging. Create a file called `main.py`:

```python
[label main.py]
from fastapi import FastAPI

app = FastAPI(title="Logging Demo API")

@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI Logging Demo"}

@app.get("/users/{user_id}")
async def read_user(user_id: int):
    return {"user_id": user_id, "name": "Sample User"}

@app.get("/items/")
async def list_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit, "items": []}
```
This code defines three simple endpoints: one for the root path, one to get user data by ID, and one to list items with pagination.

Now, run your FastAPI app using the FastAPI development server, which provides hot reloading and other development features:

```command
fastapi dev main.py
```

You'll see output similar to:

![Screenshot of the FastAPI server running](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e54489cc-6ed2-4a01-a668-2cabe922a800/orig =1586x1510)

Visit `http://127.0.0.1:8000/docs` in your browser to explore and test your API.

While this API works, you have limited visibility into what's happening when endpoints are called. 

You will see basic HTTP requests in the terminal:

```text
[output]
INFO 127.0.0.1:52301 - "GET /docs HTTP/1.1" 200
INFO 127.0.0.1:52301 - "GET /openapi.json HTTP/1.1" 200
INFO 127.0.0.1:52303 - "GET / HTTP/1.1" 200
INFO 127.0.0.1:52303 - "GET /favicon.ico HTTP/1.1" 404
INFO 127.0.0.1:52324 - "GET /items HTTP/1.1" 307
INFO 127.0.0.1:52324 - "GET /items/ HTTP/1.1" 200
INFO 127.0.0.1:52324 - "GET /favicon.ico HTTP/1.1" 404
```

However, you're missing important details about parameters, execution flow, and potential issues.

This becomes problematic when debugging or trying to understand API usage patterns.

## Adding logging to your FastAPI application

So far, your FastAPI app runs correctly and responds to requests, but you don’t get much information about what’s happening inside your endpoints. 


Now, let's update the same application to include logging:

```python
[label main.py]
from fastapi import FastAPI
[highlight]
import logging

# Configure basic logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# Create a logger instance
logger = logging.getLogger(__name__)
[/highlight]

app = FastAPI(title="Logging Demo API")

@app.get("/")
async def read_root():
[highlight]
    logger.info("Root endpoint accessed")
[/highlight]
    return {"message": "Welcome to the FastAPI Logging Demo"}

@app.get("/users/{user_id}")
async def read_user(user_id: int):
[highlight]
    logger.info(f"User data requested for user_id: {user_id}")
[/highlight]
    return {"user_id": user_id, "name": "Sample User"}

@app.get("/items/")
async def list_items(skip: int = 0, limit: int = 10):
    [highlight]
    logger.info(f"Item list requested with skip={skip}, limit={limit}")
    [/highlight]
    return {"skip": skip, "limit": limit, "items": []}
```
In the highlighted lines, you configure logging using Python’s built-in `logging` module and add `logger.info()` calls inside each endpoint. This lets you record useful messages whenever a route is accessed.

Save your changes. If you're using the FastAPI development server, it will restart automatically. Open `http://127.0.0.1:8000/` in your browser:

![Screenshot of root endpoint accessed in browser](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/961624d6-0763-4cd8-cba0-128bf6465500/lg2x =3248x1996)

You’ll see this log message in your terminal:

```text
[output]
2025-05-20 11:12:31 - main - INFO - Root endpoint accessed
```

Next, visit `http://127.0.0.1:8000/users/42`:

![Screenshot of user endpoint with ID 42](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8526e3d5-6843-4a20-e544-2b475e15cb00/lg1x =3248x1996)

This appears in your console:

```text
[output]
2025-05-20 11:13:56 - main - INFO - User data requested for user_id: 42
```

Finally, access `http://127.0.0.1:8000/items/?skip=5&limit=20`:

```text
[output]
2025-05-20 11:15:45 - main - INFO - Item list requested with skip=5, limit=20
```

These messages appear alongside the default FastAPI request logs:

```text
[output]
INFO   127.0.0.1:52458 - "GET / HTTP/1.1" 200
INFO   127.0.0.1:52483 - "GET /users/42 HTTP/1.1" 200
INFO   127.0.0.1:52510 - "GET /items/?skip=5&limit=20 HTTP/1.1" 200
```

With just a few lines of code, you’ve added useful logging that gives you clearer insight into your API’s behavior. 

You can now see which endpoints are hit, what parameters were passed, and in what order—an essential step as your app becomes more complex or moves into production.

## Understanding log levels
Logging isn't just about printing messages. It's about recording the right information at the right time. Python's built-in `logging` module includes several log levels that help you control what gets logged and when:

* `CRITICAL (50)`: Very serious errors that may cause the program to stop.
* `ERROR (40)`: Problems that prevent a function or request from completing properly.
* `WARNING (30)`: Something unexpected happened, but the app can continue.
* `INFO (20)`: General events that confirm the application is working as expected.
* `DEBUG (10)`: Detailed information useful during development and troubleshooting.

You can learn more about how these levels work and when to use them [in this article](https://betterstack.com/community/guides/logging/log-levels-explained/).

By default, FastAPI (through Python’s logging system) only shows logs at the INFO level and above. But during development, you may want more detailed output.

Let’s update the code to demonstrate each log level:

```python
[label main.py]
# ... previous imports and setup ...

@app.get("/")
async def read_root():
    [highlight]
    logger.debug("This is a debug message")
    logger.info("This is an info message")
    logger.warning("This is a warning message")
    logger.error("This is an error message")
    logger.critical("This is a critical message")
    [/highlight]
    return {"message": "Welcome to the FastAPI Logging Demo"}
```

By default, only the `INFO` level and above will appear in your logs. To see DEBUG messages too, change your logging level:

```python
[label main.py]
from fastapi import FastAPI
import logging

# Configure basic logging
logging.basicConfig(
[highlight]
    level=logging.DEBUG,  # Changed from INFO to DEBUG
[/highlight]
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# Create a logger instance
logger = logging.getLogger(__name__)
...
```

Restart your server and visit the root `http://127.0.0.1:8000/` endpoint. Now you'll see all the log messages, including DEBUG level:

```text
[output]
2025-05-20 11:33:46 - main - DEBUG - This is a debug message
2025-05-20 11:33:46 - main - INFO - This is an info message
2025-05-20 11:33:46 - main - WARNING - This is a warning message
2025-05-20 11:33:46 - main - ERROR - This is an error message
2025-05-20 11:33:46 - main - CRITICAL - This is a critical message
```

Using log levels helps you control the amount of output your application generates.

In development, it's helpful to log everything using the debug level. In production, you may want to limit logs to warnings and above to reduce clutter and focus on potential problems.

## Configuring your logging system

The `basicConfig` method you have been using is fine for quick setups, but it has limitations when you need more control, especially in production environments. 

For more advanced use cases, Python’s `logging.config.dictConfig()` lets you define a complete logging setup using a dictionary. 

This approach gives you control over formatters, handlers, loggers, and log levels.

Let's create a more sophisticated logging setup:

```python
[label main.py]
from fastapi import FastAPI
import logging
[highlight]
from logging.config import dictConfig
import sys

# Define the logging configuration
log_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "DEBUG",
            "formatter": "default",
            "stream": "ext://sys.stdout",
        },
    },
    "loggers": {
        "app": {"handlers": ["console"], "level": "DEBUG", "propagate": False},
    },
    "root": {"handlers": ["console"], "level": "DEBUG"},
}

# Apply the configuration
dictConfig(log_config)

# Create a logger instance
logger = logging.getLogger("app")
[/highlight]

app = FastAPI(title="Logging Demo API")

@app.get("/")
async def read_root():
[highlight]
    logger.debug("This is a debug message")
[/highlight]
    return {"message": "Welcome to the FastAPI Logging Demo"}
...
```

This configuration creates a structured logging setup that's more powerful than `basicConfig`. It defines:

* `formatters` define how log messages will look. Here, the `default` formatter adds timestamps, log levels, the logger name, and the message content

* `handlers` determine where the logs go. In this case, the `StreamHandler` sends output to the console using `sys.stdout`

* `loggers` allow you to control logging behavior for specific parts of your app. The `"app"` logger is configured to capture all messages at the DEBUG level or higher.

* `dictConfig(log_config)` applies the entire configuration in one step, replacing or updating the current logging setup

* `getLogger("app")` fetches the logger instance with the name `"app"`, matching the one defined in the `loggers` section.

Save the changes and restart the server.
When you visit `http://127.0.0.1:8000/`, you'll see a formatted log message in your console.

The earlier `basicConfig` output looked like this:

```text
[output]
2025-05-20 11:33:46 - main - DEBUG - This is a debug message
```

With `dictConfig`, it changes to:

```text
2025-05-20 11:44:22 [DEBUG] app: This is a debug message
```

The differences:

* The format uses brackets and colons instead of hyphens
* The logger name is now `app` (set manually), instead of `main` (from the module name).
* The layout comes from the custom `formatter`, giving you more control over how logs appear.

The `dictConfig` approach gives you more flexibility as your application grows. For example, you can easily add multiple handlers to send logs to different places or create different loggers for various application parts.

## Formatting your log records as JSON

For modern applications, especially those running in cloud environments, JSON-formatted logs are often more useful than plain text. 

They're structured, machine-readable, and easier to parse and analyze with log management tools.

Let's modify our logging configuration to output logs in JSON format:

```python
[label main.py]
from fastapi import FastAPI
import logging
from logging.config import dictConfig
import sys
[highlight]
import json
from datetime import datetime

# Custom JSON formatter
class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "module": record.module,
            "line": record.lineno,
            "message": record.getMessage()
        }
        
        # Add exception info if available
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_record)
[/highlight]

# Define the logging configuration
log_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        [highlight]
        "json": {
            "()": JsonFormatter
        }
        [/highlight]
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "DEBUG",
            [highlight]
            "formatter": "json",
            [/highlight]
            "stream": "ext://sys.stdout",
        },
    },
    "loggers": {
        "app": {"handlers": ["console"], "level": "DEBUG", "propagate": False},
    },
    "root": {"handlers": ["console"], "level": "DEBUG"},
}

# Apply the configuration
dictConfig(log_config)

...
```
In this code, you define a custom `JsonFormatter` class that formats each log record as a JSON object. It includes fields like timestamp, log level, logger name, module, line number, and the message itself. If there's an exception, it's also added to the log.

The formatter is then applied to the console handler by referencing `"formatter": "json"` in the logging config.

Now, when you run your application, your logs will be formatted as JSON objects:

```text
[output]
{"timestamp": "2025-05-20T09:56:34.300882", "level": "DEBUG", "logger": "app", "module": "main", "line": 59, "message": "This is a debug message"}
```

For the `http://127.0.0.1:8000/users/42` endpoint, you'll see:

```text
[output]
{"timestamp": "2025-05-20T09:57:19.885400", "level": "INFO", "logger": "app", "module": "main", "line": 65, "message": "User data requested for user_id: 42"}
```
This structured format makes logs much easier to work with, especially in production environments where tools like Better Stack, Elasticsearch, Datadog, or Logstash are used. JSON logs are easy to search, filter, and analyze at scale.

To suit your application's needs, you can also extend the `JsonFormatter` to include more context—such as request IDs, user data, or response times.

## Logging to files

Logging to the console is useful during development, but in production, you’ll often need to persist logs to files so you can analyze them later, debug issues after they occur, or integrate with monitoring tools.

Let’s update the logging configuration to add a file handler alongside the existing console output:


```python
[label main.py]
...
log_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json": {
            "()": JsonFormatter
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "DEBUG",
            "formatter": "json",
            "stream": "ext://sys.stdout",
        },
        [highlight]
        "file": {
            "class": "logging.FileHandler",
            "level": "INFO",
            "formatter": "json",
            "filename": "fastapi.log",
            "mode": "a",
        },
        [/highlight]
    },
    [highlight]
    "loggers": {
        "app": {"handlers": ["console", "file"], "level": "DEBUG", "propagate": False},
    },
    [/highlight]
    "root": {"handlers": ["console"], "level": "DEBUG"},
}
```

With this setup, log messages with a level of INFO or higher will be written to a file named `fastapi.log`. The `"mode": "a"` parameter tells Python to append to the file if it already exists, rather than overwriting it.

Let's revert our root endpoint to its original form:

```python
[label main.py]
...
@app.get("/")
async def read_root():
    [highlight]
    logger.info("Root endpoint accessed")
    [/highlight]
    return {"message": "Welcome to the FastAPI Logging Demo"}
```

Now when you visit `http://127.0.0.1:8000/`, the log message will be saved both to the console and to the file. You can check the contents of the log file with:

```command
cat fastapi.log
```

```text
[output]
{"timestamp": "2025-05-20T10:09:21.328026", "level": "INFO", "logger": "app", "module": "main", "line": 66, "message": "Root endpoint accessed"}
```

This gives you a permanent record of your application's behavior in a structured JSON format that's easy to analyze.

### Rotating your log files

Log files can grow very large for applications that run for extended periods. This can lead to disk space issues and slow file operations. To address this, Python's logging module provides several handlers for log rotation.

Let's update our configuration to use a `RotatingFileHandler`:

```python
[label main.py]
[label main.py]
from fastapi import FastAPI
import logging
from logging.config import dictConfig
import sys
import json
from datetime import datetime

# Custom JSON formatter
class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "module": record.module,
            "line": record.lineno,
            "message": record.getMessage(),
        }
        # Add exception info if available
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_record)

# Define the logging configuration
log_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"json": {"()": JsonFormatter}},
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "DEBUG",
            "formatter": "json",
            "stream": "ext://sys.stdout",
        },
        [highlight]
        "rotating_file": {  # This is the handler name
            "class": "logging.handlers.RotatingFileHandler",
            "level": "INFO",
            "formatter": "json",
            "filename": "fastapi.log",
            "maxBytes": 10485760,  # 10 MB
            "backupCount": 5,
        },
        [/highlight]
    },
    "loggers": {
        "app": {
            [highlight]
            "handlers": ["console", "rotating_file"],  # Use "rotating_file" instead of "file"
            [/highlight]
            "level": "DEBUG", 
            "propagate": False
        },
    },
    "root": {"handlers": ["console"], "level": "DEBUG"},
}

...
```

This configuration creates a log file that will grow up to 10 MB before being rotated. When rotation occurs, the current log is renamed to `fastapi.log.1`, and a new `fastapi.log` file is created. The system keeps up to 5 backup files, so you'll have `fastapi.log` plus `fastapi.log.1` through `fastapi.log.5`.

You can also rotate logs based on time with `TimedRotatingFileHandler`:

```python
"handlers": {
    "time_rotating_file": {
        "class": "logging.handlers.TimedRotatingFileHandler",
        "level": "INFO",
        "formatter": "json",
        "filename": "fastapi.log",
        "when": "midnight",
        "interval": 1,
        "backupCount": 7,
    },
},
```

This creates a new log file each day at midnight and keeps the last 7 days of logs. The old log files are named with a date suffix like `fastapi.log.2025-05-19`.

Log rotation is essential for production environments, where your application might run for weeks or months without restarting. 

It ensures you always have access to recent logs without consuming too much disk space, while still maintaining the JSON format that makes your logs easy to process and analyze.

## Centralizing your logs in the cloud

It's important to centralize your logging when your FastAPI application runs in production, whether across multiple instances or services or when collecting logs from databases and external systems.

Centralized logging helps you search, monitor, and troubleshoot issues across your entire stack. Tools like Better Stack allow you to collect and analyze logs from different sources in one place.

First, install the Better Stack Logs Python client:

```command
pip install logtail-python
```


To start using Better Stack Logs with your FastAPI application, first create an account at [betterstack.com](https://betterstack.com). After signing in, go to the **Sources** page and click **Connect source**:

![Better Stack Sources page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7199f84f-b711-4aef-8fc0-7bef50395900/lg2x =3024x1846)


Give your new source a clear name, such as "FastAPI Production API", and select **Python** as the platform:

![Creating a new source in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/67f8a6c1-364d-4d6a-d2a0-c39d2dfd9f00/lg1x =3024x3928)

After creating the source, you’ll receive a source token (e.g. `qU73jvQjZrNFHimZo4miLdxF`) and an ingestion host (e.g. `s1315908.eu-nbg-2.betterstackdata.com`). Copy both values—these will be used to configure log forwarding from your FastAPI app:

![Screenshot of source token and host](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0fb7e83f-b023-4a75-306d-4476510a9c00/orig =3024x1867)

Now, let's update our logging configuration to send logs to Better Stack:

```python
[label main.py]
from fastapi import FastAPI
import logging
from logging.config import dictConfig
import sys
import json
from datetime import datetime
[highlight]
from logtail import LogtailHandler
[/highlight]

# Custom JSON formatter
class JsonFormatter(logging.Formatter):
    def format(self, record):
        ...

# Define the logging configuration
log_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"json": {"()": JsonFormatter}},
    "handlers": {
        "console": {
            ....
        },
        "rotating_file": {
            ...
        },
        [highlight]
        "logtail": {
            "class": "logtail.LogtailHandler",
            "level": "INFO",
            "source_token": "insert_your_token",  # Replace with your actual token
            "host": "insert_your_injestion_host",
        }
        [/highlight]
    },
    "loggers": {
        "app": {
            [highlight]
            "handlers": ["console", "rotating_file", "logtail"],
            [/highlight]
            "level": "DEBUG", 
            "propagate": False
        },
    },
    "root": {"handlers": ["console"], "level": "DEBUG"},
}
...
```


Once your app is running with this configuration, logs will be sent to Better Stack automatically. Refresh `http://127.0.0.1:8000/` a few times, then head over to the **Live tail** page to view logs in real time:

![Live tail page showing incoming logs](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4c43b6b5-4e4f-4d81-5a62-df6a0eea0e00/md2x =3024x1530)

In **Live tail**, you can see logs as they come in, and apply filters to narrow down by log level, message content, or timestamp.

Click any log entry to expand and view more details, including metadata like the module and line number:

![Expanded log entry view](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5ff371ab-f352-41dd-7d50-647a2bc8f700/md1x =3024x1634)

Centralizing your FastAPI logs in Better Stack gives you access to a powerful toolset for monitoring, debugging, and analyzing your application's behavior in production.

## Final thoughts

Good logging helps you understand what your FastAPI app is doing, find problems quickly, and keep things running smoothly. In this guide, you learned how to log in to the console, save logs to files, format them as JSON, and send them to a service like Better Stack for easier monitoring.

FastAPI doesn’t have its own logging system, but it works really well with Python’s built-in logging tools. Whether you’re just getting started or running your app in production, having the right logs makes it easier to debug and manage your application.

If you use other Python frameworks, check out our logging guides for [Django](https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/) and [Flask](https://betterstack.com/community/guides/logging/how-to-start-logging-with-flask/), too—they follow the same ideas.

With a solid logging setup, you’ll be better prepared to build, test, and scale your apps confidently.
