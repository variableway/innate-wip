# How to Get Started with Logging in Flask

Logging is a crucial component in the software life cycle. It allows you to take
a peek inside your application and understand what is happening, which helps you
address the problems as they appear.
[Flask](https://flask.palletsprojects.com/en/2.1.x/) is one of the most popular
web frameworks for Python and logging in Flask is based on the standard [Python
`logging` module](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/). In this article, you will
learn how to create a functional and effective logging system for your Flask
application.

[summary]

## Side note: Get a Python logs dashboard

Save hours of sifting through Python logs. Centralize with [Better Stack](https://betterstack.com/logs) and start visualizing your log data in minutes.

See the [Python demo dashboard live](https://telemetry.betterstack.com/dashboards/iP9roB).

<iframe src="https://telemetry.betterstack.com/dashboards/iP9roB" width="100%" height="400"></iframe>
[/summary]

## Prerequisites

Before proceeding with this article, ensure that you have a recent version of
[Python 3](https://www.python.org/downloads/) installed on your machine. To best
learn the concepts discussed here, you should also create a new Flask project so
that you may try out all the code snippets and examples.

Create a new working directory and change into it with the command below:

```command
mkdir flask-logging && cd flask-logging
```

Create and activate a virtual environment:

```command
python3 -m venv venv
```

```command
source venv/bin/activate
```

Install the latest version of Flask with the following command.

```command
pip install Flask
```

## Getting started with logging in Flask

To get started, you need to create a new Flask application first. Go to the root
directory of your project and create an `app.py` file.

```command
code app.py
```

```python
[label app.py]
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, World!"

@app.route("/info")
def info():
    return "Hello, World! (info)"

@app.route("/warning")
def warning():
    return "A warning message. (warning)"

if __name__ == "__main__":
    app.run(debug=True)
```

In this example, a new instance of the Flask application (`app`) is created and
three new routes are defined. When these routes are accessed, different
functions will be invoked, and different strings will be returned.

Next, you can add logging calls to the `info()` and `warning()` functions so
that when they are invoked, a message will be logged to the console.

```python
[label app.py]
. . .
@app.route("/info")
def info():
    [highlight]
    app.logger.info("Hello, World!")
    [/highlight]
    return "Hello, World! (info)"


@app.route("/warning")
def warning():
    [highlight]
    app.logger.warning("A warning message.")
    [/highlight]
    return "A warning message. (warning)"
...
```

The highlighted lines above show how to access the [standard Python logging
module](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/) via `app.logger`. In this example, the
`info()` method logs `Hello, World!` at the `INFO` level, and the `warning()`
method logs `"A warning message"` at the `WARNING` level. By default, both
messages are logged to the console.

To test this logger, start the dev server using the following command:

```command
flask run
```

```text
[output]
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

Keep the Flask dev server running and open up a new terminal window. Run the
following command to test the `/warning` route:

```command
curl http://127.0.0.1:5000/warning
```

The following text should be returned:

```text
[output]
A warning message. (warning)
```

And then, go back to the dev server window, and a log message should appear:

```text
[output]
[2025-05-28 16:49:48,499] WARNING in app: A warning message.
```

As you can see, the output contains a lot more information than just the log
message itself. The `warning()` method will automatically include the timestamp
(`[2025-05-28 16:49:48,499]`), the log level (`WARNING`), and the program that
logged this message (`app`).

However, if you visit the `/info` route, you will observe that the "Hello
World!" message isn't logged as expected. That's because Flask ignores messages
with log level lower than `WARNING` by default, but we'll show how you can
customize this behavior shortly.

One more thing to note is that every time you make changes to your Flask
application, such as adding more loggers or modifying related configurations,
you need to stop the dev server (by pressing `CTRL+C`), and then restart it for
the changes to take effect.

## Understanding log levels

Log levels are used to indicate how urgent a log record is, and the `logging`
module used under the hood by Flask offers six different [log
levels](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/), each associated with an integer
value: `CRITICAL` (50), `ERROR` (40), `WARNING` (30), `INFO` (20) and `DEBUG`
(10). You can learn more about log levels and how they are typically used by
reading [this article](https://betterstack.com/community/guides/logging/log-levels-explained/).

Each of these log level has a corresponding method, which allows you to send log
entry with that log level. For instance:

```python
[label app.py]
. . .
@app.route("/")
def hello():
[highlight]
    app.logger.debug("A debug message")
    app.logger.info("An info message")
    app.logger.warning("A warning message")
    app.logger.error("An error message")
    app.logger.critical("A critical message")
[/highlight]
    return "Hello, World!"
...
```

However, when you run this code, only messages with log level higher than `INFO`
will be logged. That is because you haven't configured this logger yet, which
means Flask will use the default configurations leading to the dropping of the
`DEBUG` and `INFO` messages.

Remember to restart the server before making a request to the `/` route:

```command
curl http://127.0.0.1:5000/
```

```text
[output]
[2025-05-28 16:56:59,763] WARNING in app: A warning message
[2025-05-28 16:56:59,763] ERROR in app: An error message
[2025-05-28 16:56:59,763] CRITICAL in app: A critical message
```

In the next section, we will discuss how to override the default Flask logging
configurations so that you can customize its behavior according to your needs.

## Configuring your logging system

Flask recommends that you use the `logging.config.dictConfig()` method to
overwrite the default configurations. Here is an example:

```python
[label app.py]
from flask import Flask
[highlight]
from logging.config import dictConfig
[/highlight]

[highlight]
dictConfig(
    {
        "version": 1,
        "formatters": {
            "default": {
                "format": "[%(asctime)s] %(levelname)s in %(module)s: %(message)s",
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
                "formatter": "default",
            }
        },
        "root": {"level": "DEBUG", "handlers": ["console"]},
    }
)
[/highlight]

app = Flask(__name__)

. . .
```

Let's take a closer look at this configuration. First of all, the `version` key
represents the schema version and, at the time this article is written, the only
valid option is `1`. Having this key allows the schema format to evolve in the
future while maintaining backward compatibility.

Next, the `formatters` key is where you specify formatting patterns for your log
records. In this example, only a `default` formatter is defined. To define a
format, you need to use
[`LogRecord` attributes](https://docs.python.org/3/library/logging.html#logrecord-attributes),
which always start with a `%` symbol.

For example, `%(asctime)s` indicates the timestamp in ASCII encoding, `s`
indicates this attribute corresponds to a string. `%(levelname)s` is the log
level, `%(module)s` is the name of the module that pushed the message, and
finally, `%(message)s` is the message itself.

Inside the `handlers` key, you can create different handlers for your loggers.
Handlers are used to push log records to various destinations. In this case, a
`console` handler is defined, which uses the `logging.StreamHandler` library to
push messages to the standard output. Also, notice that this handler is using
the `default` formatter you just defined.

Finally, the `root` key is where you specify configurations for the `root`
logger, which is the default logger unless otherwise specified.
`"level": "DEBUG"` means this `root` logger will log any messages higher than or
equal to `DEBUG`, and `"handlers": ["console"]` indicates this logger is using
the `console` handler you just saw.

One last thing you should notice in this example is that the configurations are
defined before the application (`app`) is initialized. It is recommended to
configure logging behavior as soon as possible. If the `app.logger` is accessed
before logging is configured, it will create a default handler instead, which
could be in conflict with your configuration.

## Formatting your log records

Let's take a closer look at how to format log records in Flask. In the previous
section, we introduced some `LogRecord` attributes and discussed how you can use
them to create custom log messages:

```python
[label app.py]
. . .

dictConfig(
    {
        "version": 1,
        "formatters": {
            "default": {
        [highlight]
                "format": "[%(asctime)s] %(levelname)s | %(module)s >>> %(message)s",
        [/highlight]
            }
        },
        . . .
    }
)

. . .

@app.route("/")
def hello():
    [highlight]
    app.logger.info("An info message")
    [/highlight]
    return "Hello, World!"
```

This configuration produces a log record that is formatted like this:

```text
[output]
[2025-05-28 17:02:03,425] INFO | app >>> An info message
```

Some of the attributes support further customization. For example, you can
customize how the timestamp is displayed by adding a `datefmt` key in the
configurations:

```python
[label app.py]
. . .

dictConfig(
    {
        "version": 1,
        "formatters": {
            "default": {
                "format": "[%(asctime)s] %(levelname)s | %(module)s >>> %(message)s",
                [highlight]
                "datefmt": "%B %d, %Y %H:%M:%S %Z",
                [/highlight]
            }
        },
        . . .
    }
)

. . .
```

This yields a timestamp in the following format:

```text
[output]
[May 28, 2025 17:03:26 CAT] INFO | app >>> An info message
```

You can read
[this article](https://www.w3schools.com/python/python_datetime.asp) to learn
more about customizing timestamps in Python. Besides `%(asctime)s`
`%(levelname)s` , `%(module)s`, and `%(message)s`, there are several other
[LogRecord attributes](https://docs.python.org/3/library/logging.html#logrecord-attributes)
available. You can find all of them in the linked documentation.

## Logging to files

Logging to the console is great for development, but you will need a more
persistent medium to store log records in production so that you may reference
them in the future. A great way to start persisting your logs is to send them to
local files on the server. Here's how to set it up:

```python
[label app.py]
. . .
dictConfig(
    {
        "version": 1,
        . . .
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
                "formatter": "default",
            },
            [highlight]
            "file": {
                "class": "logging.FileHandler",
                "filename": "flask.log",
                "formatter": "default",
            },
            [/highlight]
        },
        [highlight]
        "root": {"level": "DEBUG", "handlers": ["console", "file"]},
        [/highlight]
    }
)
. . .
@app.route("/")
def hello():

    app.logger.info("An info message")

    return "Hello, World!"
```

A new `file` handler is added to the `handlers` object and it uses the
`logging.FileHandler` class. It also defines a `filename` which specifies the
path to the file where the logs are stored. In the `root` object, the `file`
handler is also registered so that logs are sent to the console and the
configured file.

Once you restart your server, make a request to the `/hello` and observe that a
`flask.log` file is generated at the root directory of your project. You can
view its contents the following command:

```command
cat flask.log
```

```text
[output]
. . .
[May 28, 2025 17:07:56 CAT] INFO | _internal >>> 127.0.0.1 - - [28/May/2025 17:07:56] "GET / HTTP/1.1" 200 -
```

### Rotating your log files

The `FileHandler` discussed above does not support log rotation so if you desire
to rotate your log files, you can use either `RotatingFileHandler` or
`TimedRotatingFileHandler`. They take the same parameters as `FileHandler` with
some extra options.

For example, `RotatingFileHandler` takes two more parameters:

- `maxBytes` determines the maximum size of each log file. When the size limit
  is about to be exceeded, the file will be closed, and another file will be
  automatically created.
- `backupCount` specifies the number of files that will be retained on the disk,
  and the older files will be deleted. The retained files will be appended with
  a number extension `.1`, `.2`, and so on.

```python
[label app.py]
. . .

dictConfig(
    {
        "version": 1,
        . . .
        "handlers": {
            [highlight]
            "size-rotate": {
                "class": "logging.handlers.RotatingFileHandler",
                "filename": "flask.log",
                "maxBytes": 1000000,
                "backupCount": 5,
                "formatter": "default",
            },
            [/highlight]
        },
        [highlight]
        "root": {"level": "DEBUG", "handlers": ["size-rotate"]},
        [/highlight]
    }
)
. . .
```

Notice that we are using `logging.handlers.RotatingFileHandler` and not
`logging.RotatingFileHandler`. In this example, this logging system will retain
six files, from `flask.log`, `flask.log.1` up to `flask.log.5`, and each one has
a maximum size of 1MB.

On the other hand, `TimedRotatingFileHandler` splits the log files based on
time. Here's how to use it:

```python
[label app.py]
. . .

dictConfig(
    {
        "version": 1,
        . . .
        "handlers": {
            [highlight]
            "time-rotate": {
                "class": "logging.handlers.TimedRotatingFileHandler",
                "filename": "flask.log",
                "when": "D",
                "interval": 10,
                "backupCount": 5,
                "formatter": "default",
            },
            [/highlight]
        },
        "root": {
            "level": "DEBUG",
            [highlight]
            "handlers": ["time-rotate"],
            [/highlight]
        },
    }
)
. . .
```

The`interval` specifies the time interval, and `when` specifies the unit, which
could be any of the following:

- `"S"`: seconds
- `"M"`: minutes
- `"H"`: hours
- `"D"`: days
- `"W0"`-`"W6"`: weekdays, `"W0"` indicates Sunday. You can also specify an
  `atTime` option, which determines at what time the rollover happens. The
  `interval` option is not used in this case.
- `"midnight"`: creates a new file at midnight. You can also specify an `atTime`
  option, which determines at what time the rollover happens.

When we are using the `TimedRotatingFileHandler`, the old file will be appended
a timestamp extension in the format `%Y-%m-%d_%H-%M-%S`
(`time-rotate.log.2025-07-19_13-02-13`).

If you need more flexibility when it comes to log rotation, you're better off
using a utility like
[logrotate](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) instead as
Python's file rotation handlers are not designed for heavy production workloads.

![Logtail dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a94f9e5f-8f47-493f-381b-e67d79521d00/md1x =3024x1530)
[summary]

### 🔭 Want to centralize and monitor your Flask logs?

Head over to [Logtail](https://betterstack.com/logtail/) and start ingesting your logs in 5 minutes.
[/summary]

## Logging HTTP requests

Since Flask is a web framework, your application will likely be handling many
HTTP requests, and logging information about them will help you understand what
is happening inside your application. To demonstrate relevant concepts, we'll
setup a
[demo application](https://github.com/betterstack-community/flask-world-clock)
where users can search for a location and get its current time, and then we will
create a logging system for it (see the
[logging branch](https://github.com/betterstack-community/flask-world-clock/tree/logging)
for the final implementation).

Start by moving out of the root directory and cloning the repository to your machine using the following command:

```command
git clone https://github.com/betterstack-community/flask-world-clock.git
```

Change into the project directory:

```command
cd flask-world-clock
```

You can check the structure of this project using the `tree` command:

```command
tree
```

```text
[output]
flask-world-clock
├── LICENSE
├── README.md
├── app.py
├── requirements.txt
├── screenshot.png
├── templates
│   ├── fail.html
│   ├── home.html
│   ├── layout.html
│   └── success.html
└── worldClock.log
```

Create and activate a virtual environment for this project:

```command
python3 -m venv venv
```

```command
source venv/bin/activate
```

Install the required dependencies by running the command below:

```command
pip install -r requirements.txt
```

Start the development server:

```command
flask run
```

```text
[output]
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

If you see this output, that means the world clock app is up and running. You
can access it by visiting [http://127.0.0.1:5000](http://127.0.0.1:5000) in your
browser. You should first land on the home page:

![World Clock Home](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a33d7d17-ffd0-479e-cc14-50403e5c9400/public =1306x768)

If you type in a query, and a location is successfully found. You should see the
result page:

![World Clock Success](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f0d7a3a0-146f-42b6-8189-df930d156900/public =1306x768)

If a location is not found, then you should see the fail page:

![World Clock Fail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/dd6f0374-fc33-46d3-169e-4692e111de00/public =1306x768)

This project also uses two API services,
[Nominatim](https://nominatim.org/release-docs/develop/) which is a geolocation
tool that returns a coordinate given a search query, and the
[Time API](https://timeapi.io/swagger/index.html) which gives you the current
time based on coordinates. Please read the linked documentations if you don't
know how to use them. This project will also use the
[requests](https://requests.readthedocs.io/en/latest/) module to make API
requests, so make sure you have it installed.

```python
[label app.py]
from flask import Flask, request, render_template
import requests

app = Flask(__name__)


@app.route("/")
def home():

    return render_template("home.html")


@app.route("/search", methods=["POST"])
def search():

    # Get the search query
    query = request.form["q"]

    # Add proper headers for Nominatim API
    headers = {
        'User-Agent': 'Flask World Clock App (your-email@example.com)'
    }

    # Pass the search query to the Nominatim API to get a location
    location = requests.get(
        "https://nominatim.openstreetmap.org/search",
        params={"q": query, "format": "json", "limit": "1"},
        headers=headers
    ).json()

    # If a location is found, pass the coordinate to the Time API to get the current time
    if location:
        coordinate = [location[0]["lat"], location[0]["lon"]]

        time = requests.get(
            "https://timeapi.io/api/Time/current/coordinate",
            {"latitude": coordinate[0], "longitude": coordinate[1]},
        )

        return render_template("success.html", location=location[0], time=time.json())

    # If a location is NOT found, return the error page
    else:

        return render_template("fail.html")

```

### Creating a logging system for your Flask project

Next, it is time for you to add logging to this application. The
[logging branch](https://github.com/betterstack-community/flask-world-clock/tree/logging)
of the repository includes the complete setup.

You can start by setting up the configurations:

```python
[label app.py]
from flask import Flask, request, render_template
[highlight]
from logging.config import dictConfig
[/highlight]
import requests


[highlight]
dictConfig(
    {
        "version": 1,
        "formatters": {
            "default": {
                "format": "[%(asctime)s] [%(levelname)s | %(module)s] %(message)s",
                "datefmt": "%B %d, %Y %H:%M:%S %Z",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "default",
            },
            "file": {
                "class": "logging.FileHandler",
                "filename": "worldClock.log",
                "formatter": "default",
            },
        },
        "root": {"level": "DEBUG", "handlers": ["console", "file"]},
    }
)
[/highlight]

app = Flask(__name__)
. . .
```

Make sure you put the configurations before you declare the Flask application
(`app = Flask(__name__)`). This configuration specifies a `default` formatter,
which is tied to both `console` and `file` handler. And these handlers are then
assigned to the `root` logger. The console handler will push the log records to
the console, and the file handler will push the records to a file named
`worldClock.log`.

Next, you can start creating logging calls for each route. For example, when
users visit your application, they would first make a request to the `home`
route. Therefore, you can assign that request a unique ID, and then you can log
that ID like this:

```python
[label app.py]
from flask import Flask, request, render_template
[highlight]
from flask import session
[/highlight]
from logging.config import dictConfig
import requests

[highlight]
import uuid
[/highlight]

. . .

app = Flask(__name__)
[highlight]
app.secret_key = "<secret_key>"
[/highlight]


@app.route("/")
def home():

    [highlight]
    session["ctx"] = {"request_id": str(uuid.uuid4())}

    app.logger.info("A user visited the home page >>> %s", session["ctx"])
    [/highlight]

    return render_template("home.html")
```

This example uses
[sessions](https://flask.palletsprojects.com/en/2.2.x/api/?highlight=session#flask.session)
to store the `request_id`, and for the sessions to be secure, you need to create
a secret key for your application.

Go ahead and do the same for the `search` route as well:

```python
[label app.py]
. . .
@app.route("/search", methods=["POST"])
def search():

    # Get the search query
    query = request.form["q"]
    [highlight]
    app.logger.info(
        "A user performed a search. | query: %s >>> %s", query, session["ctx"]
    )
    [/highlight]
    headers = {
        'User-Agent': 'Flask World Clock App (your-email@example.com)'
    }
    # Pass the search query to the Nominatim API to get a location
    location = requests.get(
        "https://nominatim.openstreetmap.org/search",
        {"q": query, "format": "json", "limit": "1"},
    ).json()

    # If a location is found, pass the coordinate to the Time API to get the current time
    if location:

        [highlight]
        app.logger.info(
            "A location is found. | location: %s >>> %s", location, session["ctx"]
        )
        [/highlight]

        coordinate = [location[0]["lat"], location[0]["lon"]]

        time = requests.get(
            "https://timeapi.io/api/Time/current/coordinate",
            {"latitude": coordinate[0], "longitude": coordinate[1]},
        )

        return render_template("success.html", location=location[0], time=time.json())

    # If a location is NOT found, return the error page
    else:

        [highlight]
        app.logger.info("A location is NOT found. >>> %s", session["ctx"])
        [/highlight]

        return render_template("fail.html")
```

Besides logging information about the request, you can also log something about
the response as well. To do that, create a function with the
`@app.after_request` decorator.

```python
[label app.py]
. . .
@app.after_request
def logAfterRequest(response):

    app.logger.info(
        "path: %s | method: %s | status: %s | size: %s >>> %s",
        request.path,
        request.method,
        response.status,
        response.content_length,
        session["ctx"],
    )

    return response
```

Restart the dev server and go to [http://127.0.0.1:5000](http://127.0.0.1:5000),
and you will see the following log entries being displayed.

```text
[output]
[May 28, 2025 17:48:52 CAT] [INFO | app] A user visited the home page >>> {'request_id': 'd2c594ae-c680-48bc-8e05-f895727fa73f'}
[May 28, 2025 17:48:52 CAT] [INFO | app] path: / | method: GET | status: 200 OK | size: 946 >>> {'request_id': 'd2c594ae-c680-48bc-8e05-f895727fa73f'}
```

When a search action is successful:

```text
[output]
[May 28, 2025 17:49:30 CAT] [INFO | app] A user performed a search. | query: new york >>> {'request_id': 'd2c594ae-c680-48bc-8e05-f895727fa73f'}
```

If a location is found:

```text
[output]
[May 28, 2025 17:49:31 CAT] [INFO | app] A location is found. | location: [{..}] >>> {'request_id': 'd2c594ae-c680-48bc-8e05-f895727fa73f'}
[May 28, 2025 17:50:02 CAT] [INFO | app] path: /search | method: POST | status: 200 OK | size: 1177 >>> {'request_id': 'd2c594ae-c680-48bc-8e05-f895727fa73f'}
```

If a location is not found:

```text
[output]
[May 28, 2025 17:51:03 CAT] [INFO | app] A user performed a search. | query: idufvuiew >>> {'request_id': 'b316b464-769a-4b9f-853c-a3bc0e407680'}
[May 28, 2025 17:51:04 CAT] [INFO | app] A location is NOT found. >>> {'request_id': 'b316b464-769a-4b9f-853c-a3bc0e407680'}
[May 28, 2025 17:51:04 CAT] [INFO | app] path: /search | method: POST | status: 200 OK | size: 497 >>> {'request_id': 'b316b464-769a-4b9f-853c-a3bc0e407680'}
```

## Working with multiple loggers

In the previous examples, you are only using the `root` logger, but in fact, it
is possible for you to create multiple loggers and configure them separately.

```python
[label app.py]
from flask import Flask, request, render_template
from flask import session
from logging.config import dictConfig

[highlight]
import logging
[/highlight]
import requests
import uuid


dictConfig(
    {
        "version": 1,
        "formatters": {
            . . .
        },
        "handlers": {
            . . .
        },
        [highlight]
        "root": {"level": "DEBUG", "handlers": ["console"]},
        [/highlight]

        [highlight]
        "loggers": {
            "extra": {
                "level": "INFO",
                "handlers": ["file"],
                "propagate": False,
            }
        },
        [/highlight]
    }
)

[highlight]
root = logging.getLogger("root")
extra = logging.getLogger("extra")
[/highlight]

app = Flask(__name__)


@app.route("/")
def hello():
[highlight]
    root.debug("A debug message")
    root.info("An info message")
    root.warning("A warning message")
    root.error("An error message")
    root.critical("A critical message")

    extra.debug("A debug message")
    extra.info("An info message")
    extra.warning("A warning message")
    extra.error("An error message")
    extra.critical("A critical message")

    return "Hello, World!"
[/highlight]
```

In the first highlighted section, an `extra` logger is defined. This logger has
a minimum log level `INFO`, and it uses the handler `time-rotate`. However,
notice that it has an extra option called `propagate`. It determines whether or
not this logger should propagate to its parent, which is the `root` logger. The
default value is `True`, which means messages logged to the `extra` logger will
also be logged by the `root` logger, unless we set its value to `False`.

If you execute the above code, you will get the following output in the console:

```text
[output]
[May 28, 2025 18:11:22 CAT] [DEBUG | app] A debug message
[May 28, 2025 18:11:22 CAT] [INFO | app] An info message
[May 28, 2025 18:11:22 CAT] [WARNING | app] A warning message
[May 28, 2025 18:11:22 CAT] [ERROR | app] An error message
[May 28, 2025 18:11:22 CAT] [CRITICAL | app] A critical message
```

And the following logs in the `worldClock.log` file:

```command
cat worldClock.log
```

```text
[output]
[May 28, 2025 18:11:22 CAT] [INFO | app] An info message
[May 28, 2025 18:11:22 CAT] [WARNING | app] A warning message
[May 28, 2025 18:11:22 CAT] [ERROR | app] An error message
[May 28, 2025 18:11:22 CAT] [CRITICAL | app] A critical message

```

Notice that the `DEBUG` message is ignored here. By creating multiple loggers
for your application, you can create a more complex logging system.

For example, previously, we mentioned that you can include contextual
information in your log record like this:

```python
app.logger.debug("A debug message: %s", "test message")
```

However, this method can be very inefficient since you'll have to micromanage
each logging call, and sometimes the same information should be included in many
different log records. To solve this problem, you can have the `extra` logger
use a different formatter, which include custom information as demonstrated in this example:

```python
[label example.py]
. . .
dictConfig(
    {
        "version": 1,
        "formatters": {
            "default": {
                "format": "[%(asctime)s] %(levelname)s | %(module)s >>> %(message)s",
                "datefmt": "%B %d, %Y %H:%M:%S %Z",
            },
            "extra": {
                "format": "[%(asctime)s] %(levelname)s | %(module)s >>> %(message)s >>> User: %(user)s",
                "datefmt": "%B %d, %Y %H:%M:%S %Z",
            },
        },
        "handlers": {
            "console1": {
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
                "formatter": "default",
            },
            "console2": {
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
                "formatter": "extra",
            },
        },
        "root": {"level": "DEBUG", "handlers": ["console1"]},
        "loggers": {
            "extra": {
                "level": "DEBUG",
                "handlers": ["console2"],
                "propagate": False,
            }
        },
    }
)
. . .
```

In this new configuration, the `root` logger uses the `console1` handler, which
applies the `default` formatter. The `extra` logger, on the other hand, uses the
`console2` handler, which applies the `extra` formatter. The `extra` formatter
expects a custom field, `%(user)s`, and you can pass this `user` field using the
`extra` parameter like this:

```python
. . .
extra = logging.getLogger("extra")


@app.route("/")
def hello():
    [highlight]
    extra.info("A user has visited the home page", extra={"user": "Jack"})
    [/highlight]
    return "Hello, World!"
```

Upon restarting the Flask dev server, and visiting the `/` route, you get the
following log record:

```text
[output]
[May 28, 2025 13:31:32 EDT] INFO | app >>> A user has visited the home page >>> User: Jack
```

One more thing to note is that the `extra` formatter always expects a `user`
field, so if you have a log record without a `user` field, you should not use
the `extra` formatter. This is also why you can not use the `root` logger with
the `extra` formatter, because the `root` logger is also used by Flask to record
internal logs, and they don't have a `user` field.


Now, in your `app.py` file, revert the home route back to this:

```python
[label app.py]
...
@app.route("/")
def home():
    [highlight]
    session["ctx"] = {"request_id": str(uuid.uuid4())}

    app.logger.info("A user visited the home page >>> %s", session["ctx"])

    return render_template("home.html")
    [/highlight]
...
```

With that done, you are ready to centralize logs in the cloud.

## Centralizing your logs in the cloud

After your application has been deployed to production, it will start to
generate logs which may be stored in various servers. It is very inconvenient
having to log into each server just to check some log records. In such cases, it
is probably better to use a cloud-based log management system such as [Better Stack Telemetry](https://betterstack.com/telemetry), so that you can manage, monitor and
analyze all your log records together.

First, you'll need to create an account at [Better Stack Telemetry](https://betterstack.com/telemetry). Once you're logged in, look for the **Sources** section in the sidebar and click **Connect source**:

![Telemetry sources](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/de9884d6-87ca-457b-838f-963c39f2a900/lg2x =3024x748)

You'll need to give your log source a name and select **Python** as the platform since we're working with Flask:

![Create Better Stack Telemetry source](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c7984d32-f7ce-45ef-4901-c6b4400d8300/public =3024x3928)

After creating the source, Better Stack will give you two important pieces of information: a source token (something like `qU73jvQjZrNFHimZo4miLdxF`) and an ingestion host (like `s1315908.eu-nbg-2.betterstackdata.com`). Copy both of these - you'll need them to configure your Flask app:

![Screenshot of the Better Stack interface showing a created log source with the source token and ingestion host highlighted](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d2b5e5c6-3bfc-4dd6-f39e-b37d515c7800/public =2312x1444)

Back in your Flask project, install the Better Stack Python package:

```command
pip install logtail-python
```


Setup the `LogtailHandler` like this:

```python
[label app.py]
. . .
dictConfig(
    {
        "version": 1,
        "formatters": {
            ...
        },
        "handlers": {
            "console": {
                ...
            },
            "file": {
                ...
            },
            [highlight]
            "logtail": {
                "class": "logtail.LogtailHandler",
                "source_token": "<your_source_token>",
                "host": "https://<your_ingesting_host>",
                "formatter": "default",
            },
            [/highlight]
        },
[highlight]
        "root": {"level": "DEBUG", "handlers": ["console", "file", "logtail"]},
[/highligt]
        "loggers": {
            "extra": {
                "level": "INFO",
                "handlers": ["file"],
                "propagate": False,
            }
        },
    }
)

# Rest of your Flask app code...
```
Make sure to replace `<your_source_token>` and `<your_ingesting_host>` with the actual values you copied earlier. In a production app, you should store these as environment variables instead of hardcoding them.

Save your changes and restart your Flask app. Now when you use your world clock application, the logs will still appear in your console and log file as before, but they'll also be sent to Better Stack in real-time.

Head back to Better Stack and click on **Live tail** to see your logs streaming in. You can filter logs by clicking the dropdown in the top-left corner:

![Better Stack Telemetry sources filter](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/32c4018d-c308-4ecc-b179-945d19a62800/lg1x =1596x620)

You will now be able to see all log entries:

![Screenshot of log entries in Better Stack Telemetry](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a94f9e5f-8f47-493f-381b-e67d79521d00/md1x =3024x1530)

Click on any log entry to see all its details:

![Better Stack Telemetry logs](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e1491af1-9c33-42b1-e138-3306b55f0100/lg1x =3024x1530)


## Final thoughts

In this article, we briefly discussed how to start logging in Flask. Logging in
Flask is based on Python's `logging` module, and in this tutorial, you learned
how to create a logging system using its handlers, log levels, and formatters.
However, we merely scratched the surface of the `logging` module, and it offers
us lots of other functionalities such as the `Filter` object, the
`LoggerAdapter` object and so on. You can read more about logging in Python in
[this article](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/).

Thanks for reading, and happy logging!
