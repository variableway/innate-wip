# How to Change Log Levels Dynamically at Runtime

Logging plays a crucial role in troubleshooting and monitoring software systems,
providing valuable insights into the behavior of your application at runtime. It
allows you to track the flow of program execution, identify and address runtime
errors, and analyze system performance.

One important aspect of logging is [log levels](https://betterstack.com/community/guides/logging/log-levels-explained/), which
categorize logged events based on severity. Besides organizing log entries, they
also enable you to control the verbosity of log output and filter entries based
on their significance.

In most production systems, the default minimum log level is set to INFO,
meaning only records with a level higher than or equal to INFO will be logged.
However, there are situations where you might need to adjust the log level to
increase or decrease the verbosity of the logs.

Ideally, a well-designed application should allow you to modify the minimum log
level without requiring a restart. After such change is made, it should also
propagate seamlessly across all instances of the application. Therefore, this
article will explore various methods to dynamically change log levels at
runtime, eliminating the need for application restarts.

[ad-logs-small]

## 1. Creating an API endpoint to change the log level

One of the most straightforward ways to change the log level of your application
without restarting is to create an API endpoint that accepts a payload
specifying the desired log level. For security reasons, this endpoint should be
protected and accessible only to authorized users.

Once a request is sent to the endpoint, you'll need to invoke a function that
updates the log level setting of your chosen [logging library or
framework](https://betterstack.com/community/guides/logging/logging-framework/). If your application runs on multiple servers,
you'll also need to propagate the change to all running instances. Depending on
your application's architecture, this may involve implementing a mechanism for
inter-process communication or using a messaging system, but such a set up is
outside the scope of this article.

Here's an example that implements the above steps in a
[Django](https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/) application that uses the [Loguru
framework](https://betterstack.com/community/guides/logging/loguru/) for logging. The exact method of setting up the endpoint and
changing the log level will differ in other languages or frameworks, but the
idea remains the same. Please refer to the relevant documentation to learn more.

First, you need to define a URL pattern in your project's `urls.py` file to map
the API endpoint to a view function:

```python
[label urls.py]
from django.urls import path
from api.views import change_log_level

urlpatterns = [
    # Define an API endpoint
    path('api/change-log-level/', change_log_level, name='change-log-level'),
]
```

Next, you need to determine the format of the JSON payload that will be sent to
the endpoint. In this example, we'll use a JSON payload with the `log_level`
field:

```json
{
  "log_level": "DEBUG"
}
```

Go ahead and implement the view function in the app's `views.py` file:

```python
[label views.py]
from django.http import JsonResponse

def change_log_level(request):
    # implement the logic here (see next snippet)
    return JsonResponse({"message": "Log level updated successfully."})
```

At this point, you must extract the `log_level` field from the request payload,
validate it, and then change the log level on the logger:

```python
[label views.py]
from django.http import JsonResponse
import json

def change_log_level(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method."}, status=405)

    payload = json.loads(request.body)
    log_level = payload.get("log_level")

    # Ensure that the log level is valid
    if log_level in [
        "TRACE",
        "DEBUG",
        "INFO",
        "SUCCESS",
        "WARNING",
        "ERROR",
        "CRITICAL",
    ]:
        # Then update the log level configuration
        logger.remove()
        logger.add(
            sys.stderr,
            format="{time:MMMM D, YYYY > HH:mm:ss!UTC} | {level} | {message} | {extra}",
            level=log_level,
            backtrace=False,
            diagnose=False,
        )

        # Log your changes so you know when it was changed (and ideally by whom)
        logger.info("log level updated to: {level}", level=log_level)

        return JsonResponse(
            {"message": f"Log level updated to {log_level} successfully."}
        )

    return JsonResponse(
        {"error": "The provided Log level field is invalid."}, status=400
    )
```

Once you send a request to this endpoint, you should observe that the change
takes effect in your application. For example, assuming the default level is
`INFO`, you can temporarily switch to the `DEBUG` level by sending the following
request:

```command
curl -X POST '<your_server_url>/api/change-log-level/' \
  -H 'Content-Type: application/json' \
  -d '{"log_level": "DEBUG"}'
```

You should observe the following response, confirming that the log level was
updated successfully:

```json
[output]
{"message": "Log level updated to DEBUG successfully."}
```

A basic way to propagate this change to all application instances is to create a
separate program that iterates through the IP address of each server and sends
the log level change request to each one:

```python
[label script.py]
import requests
import json

def changing_log_level(ip_addresses, log_level):
    for ip_address in ip_addresses:
        try:
            url = f"http://{ip_address}/api/change-log-level/"
            headers = {"Content-Type": "application/json"}
            response = requests.post(
                url, data=json.dumps({"log_level": log_level}), headers=headers
            )
            response.raise_for_status()
            print(f"Log level change successfully propagated on instance: {ip_address}")
        except requests.exceptions.RequestException as error:
            print(f"Error propagating log level change on instance: {ip_address}")
            print(error.response.text)

ip_addresses = ['192.168.1.101', '192.168.1.102', '192.168.1.103']
changing_log_level(ip_addresses, 'DEBUG')
```

![Using API](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/af688625-bf69-4fcb-e213-e611d6a02500/orig =709x457)

Don't forget to set up authentication for the route so that only authorized
personnel can make such requests to your server.

## 2. Sending UNIX signals to your program

[Signals](<https://en.wikipedia.org/wiki/Signal_(IPC)>) are a standardized way
to communicate and control processes on UNIX-like operating systems. You can
listen for a specific signal in your application and then take the appropriate
action. For example, you can listen for `SIGTERM` (the signal for program
termination), and perform a graceful shutdown before exiting the program.

The first step is to identify what signals to listen for. On Linux, there are
two specially designated signals that are not associated with any predefined
behavior. As a result, applications often use them to define custom actions.
These are `SIGUSR1` and `SIGUSR2`. For example, you can use the first signal to
increase the log level, and the second to decrease it. This works best when
[your logging framework](https://betterstack.com/community/guides/logging/logging-framework/) associates the log level with an
integer.

[ad-logs]

Here's a Node.js example (using
[Pino](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/)) that
listens for both signals and increments or decrements the log level as needed:

```javascript
const express = require('express');
const pino = require('pino');

const app = express();

const logger = pino()

function updateLogLevel(signal) {
  let currentLevel = logger.levelVal;

  if (signal === 'SIGUSR1') {
    currentLevel += 10;
  } else {
    currentLevel -= 10;
  }

  if (`${currentLevel}` in logger.levels.labels) {
    logger.level = logger.levels.labels[currentLevel];
    console.log('The log level has been successfully changed to', logger.level);

    return;
  }

  console.log('Invalid operation. Current level is', logger.level);
}

process.on('SIGUSR1', updateLogLevel);
process.on('SIGUSR2', updateLogLevel);

app.listen('3000', () => {
  console.log('server is listening on port 3000. Process ID is', process.pid);
});
```

Here, the `updateLogLevel()` function is invoked when the `SIGUSR1` and
`SIGUSR2` signals are received. The log level is subsequently incremented or
decremented as appropriate. A message is printed to the screen once the bounds
are exceeded in either direction.

Here's how to send either signal to a running application on Linux:

```command
kill -SIGUSR1 <process_id>
```

```command
kill -SIGUSR2 <process_id>
```

![Dynamically changing log levels in Node.js](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/354edab3-2903-4676-7e65-6d28309bf000/public =1806x1010)

## 3. Utilizing framework-specific configuration files

[Some logging frameworks](https://betterstack.com/community/guides/logging/logging-framework/) attempt to make changing log levels
at runtime easier by automatically scanning a configuration file for changes.
For example, [Logback](https://logback.qos.ch/), a popular logging framework for
Java applications, allows you to
[reload its configurations upon file modification](https://logback.qos.ch/manual/configuration.html#autoScan)
when the `scan` attribute of the <configuration> element is set to `true`.

```xml
[label logback.xml]
<configuration scan="true">
. . .
</configuration>
```

By default, the file will be scanned for changes once every minute, but you can
also specify a custom scanning period:

```xml
[label logback.xml]
<configuration scan="true" scanPeriod="30 seconds">
. . .
</configuration>
```

As an example, here is a simple Java program that logs some messages every 10
seconds using the Logback framework with [SLF4J](https://www.slf4j.org/):

```java
package com.example;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

public class App {

    private static final Logger logger = LoggerFactory.getLogger(App.class);

    public static void main(String[] args) {

        while (true) {
            logger.trace("Entering method foo()");
            logger.debug("Received request from 198.12.34.56");
            logger.info("User logged in: john");
            logger.warn("Connection to server lost. Retrying...");
            logger.error("Failed to write data to file: myFile.txt");

            // Sleep for 10 seconds
            try {
                Thread.sleep(10000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

Here's the corresponding Logback configuration for the above program. Notice
that its minimum log level is set to `INFO`, and the scan period is set to 10
seconds:

```xml
[label logback.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>

[highlight]
<configuration scan="true" scanPeriod="10 seconds">
[/highlight]
    <import class="ch.qos.logback.classic.encoder.PatternLayoutEncoder" />
    <import class="ch.qos.logback.core.ConsoleAppender" />

    <appender name="STDOUT" class="ConsoleAppender">
        <encoder class="PatternLayoutEncoder">
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} -- %msg.%n</pattern>
        </encoder>
    </appender>

    [highlight]
    <root level="info">
    [/highlight]
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

When you run the program, you will observe that only `INFO`, `WARN`, and `ERROR`
logs are printed:

![info level](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/95a1bfc6-5f76-4a64-204e-21b9b5c20000/md1x =1764x732)

Keep the application running, and edit the configuration file. Change the log
level into `DEBUG` as shown below:

```xml
[label logback.xml]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>

<configuration scan="true" scanPeriod="10 seconds">
    . . .

    [highlight]
    <root level="debug">
    [/highlight]
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

Wait for about 10 seconds after saving the file. You should observe that
`DEBUG`-level messages are now being included in the output without having to
restart the program:

![debug level](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8892dd58-7a30-494f-1ef3-73752ef09400/orig =1764x732)

If you're using [Log4J2](https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4j/), you can use the
`monitorInterval` attribute instead to achieve the same results:

```xml
[label log4j2.xml]
<?xml version="1.0" encoding="UTF-8"?>
[highlight]
<Configuration monitorInterval="10">
[/highlight]
. . .
</Configuration>
```

Likewise, if your logging framework of choice supports configuration files, do
investigate further to see if it provides a way to watch the file for changes
and reload its configuration.

## Final thoughts

In this article, we explored various approaches to dynamically change log levels
in production without restarting your application. We discussed creating APIs,
sending signals, and modifying configuration files. Each of these methods
provide varying levels of flexibility and can be adapted to different
programming languages, so you should definitely find a solution that meets your
requirements.

To learn more about log levels, we recommend reading our comprehensive tutorial
on [log levels and their usage](https://betterstack.com/community/guides/logging/log-levels-explained/) or [logging in microservices](https://betterstack.com/community/guides/logging/logging-microservices/). It will provide you with
a deeper understanding of log levels and their significance in logging. You can
also check out our other [logging guides here](https://betterstack.com/community/guides/logging/).

Thanks for reading, and happy logging!
