# How to Collect, Process, and Ship Log Data with Vector

In most systems, logs are crucial in maintaining the system's health and troubleshooting issues. While application-specific log records are valuable, they often fall short when it comes to gaining comprehensive insights. To achieve a deeper understanding, you must gather and analyze logs from various sources, including Docker containers, syslog, databases, and more. This is where a [log aggregator](https://betterstack.com/community/guides/logging/log-shippers-explained/) comes into play. A log aggregator is a tool designed to collect, transform, and route logs from diverse sources to a central location, enhancing your ability to analyze and troubleshoot effectively. Many log aggregators are available, such as Vector, [Fluentd](https://betterstack.com/community/guides/logging/fluentd-explained/), and [Filebeat](https://betterstack.com/community/guides/logging/filebeat-explained/), to mention a few. However, in this article, we will focus on Vector.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/We7s8KFY7Qg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[Vector](https://vector.dev/) is a robust open-source log aggregator developed by Datadog. It empowers you to build observability pipelines by seamlessly fetching logs from many sources, transforming the data as needed, and routing it to your preferred destination. Vector stands out for its lightweight nature, exceptional speed, and memory efficiency, mainly owing to its implementation in Rust, a programming language renowned for its memory management capabilities.

Vector offers a rich set of features commonly found in log aggregators, including support for plugins that enable integration with various data sources and destinations, real-time monitoring, and robust security features. Additionally, Vector can be configured for high availability, ensuring it can handle substantial volumes of logs without compromising performance.

This comprehensive guide will explore how to leverage Vector to collect, forward, and manage logs effectively. we'll start by building a sample application that writes logs to a file. Next, we'll walk you through using Vector to read and direct the logs to the console. Finally, we'll delve into log transformation, centralization, and monitoring to ensure the health and reliability of your Vector-based log management setup.

## Prerequisites

To complete this tutorial, you will need a system with a non-root user that has `sudo` privileges. You must install [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) on your system. If you're unfamiliar with log shippers, you can read [this article](https://betterstack.com/community/guides/logging/log-shippers-explained/) to learn more about their advantages.

Once you've met these requirements, create a root project directory to house your application, configurations, and Dockerfiles: 

```command
mkdir log-processing-stack
```
This directory will serve as the foundation for your project as you progress through the tutorial.

Afterward, move into the directory:

```command
cd log-processing-stack
```

Next, create a directory dedicated to your demo application. Then move into the newly created directory:

```command
mkdir logify && cd logify
```

[summary]

## Side note: Ship Vector logs to Better Stack

Once Vector is producing structured JSON, you can ship it to Better Stack for fast search, live tail, and alerting without running your own storage.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Developing a demo logging application

In this section, you will create a sample [Bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) script that generates logs at regular intervals. 

In the `logify` directory,  create a new file named `logify.sh` with the text editor of your choice:

```command
nano logify.sh
```

In your `logify.sh` file, and add the following code:

```bash
[label log-processing-stack/logify/logify.sh]
#!/bin/bash
filepath="/var/log/logify/app.log"

create_log_entry() {
    local info_messages=("Connected to database" "Task completed successfully" "Operation finished" "Initialized application")
    local random_message=${info_messages[$RANDOM % ${#info_messages[@]}]}
    local http_status_code=200
    local ip_address="127.0.0.1"
    local emailAddress="user@mail.com"
    local level=30
    local pid=$$
    local ssn="407-01-2433"
    local time=$(date +%s)
    local log='{"status": '$http_status_code', "ip": "'$ip_address'", "level": '$level', "emailAddress": "'$emailAddress'", "msg": "'$random_message'", "pid": '$pid', "ssn": "'$ssn'", "time": '$time'}'
    echo "$log"
}

while true; do
    log_record=$(create_log_entry)
    echo "${log_record}" >> "${filepath}"
    sleep 3
done
```

The `create_log_entry()` function creates a log entry in the JSON format, which includes fields such as the HTTP status code, IP address, a random log message, process ID, social security number, and a timestamp. The script then enters an infinite loop, repeatedly calling this function to generate the log entries and appending them to the specified log file in the `/var/log/logify` directory.

Note that while this example includes personal information, such as email addresses, social security numbers, and IP addresses, it is primarily intended for demonstration purposes. Vector can filter out sensitive data by either removing personal information fields or redacting them, which is crucial for maintaining data privacy and security. You'll learn how to implement it later in the tutorial.

Once you are finished, save the changes you've made to the file. Run the following command to make the script executable:

```command
chmod +x logify.sh
```

Next, create the `/var/log/logify` where the application will store the logs:

```command
sudo mkdir /var/log/logify
```

Change the directory ownership to the user specified in the $USER environment variable, which contains the currently logged-in user:

```command
sudo chown -R $USER:$USER /var/log/logify/
```

Now, execute the script in the background by adding `&` at the end:

```command
./logify.sh &
```
The `bash` job control system yields output that includes the process ID:

```text
[output]
[1] 101999
```
The process ID, which is `101999` in this case, will be used to terminate the script later.

Next, view the contents of the log file using the `tail` command:

```command
tail -n 4 /var/log/logify/app.log
```

```json
[output]
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Connected to database", "pid": 101999, "ssn": "407-01-2433", "time": 1748504841}
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Initialized application", "pid": 101999, "ssn": "407-01-2433", "time": 1748504844}
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Connected to database", "pid": 101999, "ssn": "407-01-2433", "time": 1748504847}
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Task completed successfully", "pid": 101999, "ssn": "407-01-2433", "time": 1748504850}
```

## Setting up Vector with Docker

Now that you can generate logs, you will set up Vector using Docker. We'll use the official [`timberio/vector`](https://hub.docker.com/r/timberio/vector) Docker image, which provides a lightweight and efficient way to run Vector without installing it directly on your system.

First, let's create a directory structure for Vector configuration. Go back to `log-processing-stack` directory:

```command
cd ..  
```

Then, create a new directory for your Vector configuration:

```command
mkdir vector
```
That's all we need for now. We'll return to this directory shortly when it's time to add the actual configuration files.

## How Vector works

With Vector now ready to be deployed via Docker, let's explore how it works.

![Diagram showing Vector observability pipeline](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/147f8cb5-2295-48e9-a0dc-f47c222b2400/lg2x)

To understand Vector, imagine it as a pipeline. At one end, Vector ingests raw logs and standardizes them into a unified log event format. As the log event travels through Vector, it can undergo various manipulations using "transforms" to manipulate and enhance its content. Finally, at the end of the pipeline, the log event can be sent to multiple destinations for storage or analysis.

You can define the data sources, transforms, and destinations in a configuration file. When using Docker, this configuration file will be mounted into the container. This configuration file is organized into the following components:

```text
sources:
  <unique_source_name>:
    # source configuration properties go here

transforms:
  <unique_transform_name>:
    # transform configuration properties go here

sinks:
  <unique_destination_name>:
    # sink configuration properties go here
```

This structure allows you to configure and customize Vector to suit your specific log aggregation and processing needs.

Let's analyze the components:

- `sources`: this section defines the data sources that Vector should read.
- `transforms`: specifies how the data should be manipulated or transformed.
- `sinks`: defines the destinations where Vector should route the data.

Each component requires you to specify a plugin. For sources, the following are some of the [inputs](https://vector.dev/docs/reference/configuration/sources/) you can use:

- [File](https://vector.dev/docs/reference/configuration/sources/file/): fetch logs from files.
- [Docker Logs](https://vector.dev/docs/reference/configuration/sources/docker_logs/):
  gather logs from Docker containers.
- [Socket](https://vector.dev/docs/reference/configuration/sources/socket/):
  collect logs sent via the socket client.
- [Syslog](https://vector.dev/docs/reference/configuration/sources/syslog/):
  fetches logs from Syslog.

To process the data, here are some of the
[transforms](https://vector.dev/docs/reference/configuration/transforms/) that can come in handy:

- [Remap with VRL](https://vector.dev/docs/reference/configuration/transforms/remap/):
  an expression-oriented language designed to transform your data.

- [Lua](https://vector.dev/docs/reference/configuration/transforms/lua/): use
  the Lua programming language to transform log events.

- [Filter](https://vector.dev/docs/reference/configuration/transforms/filter/):
  filter events according to the specified conditions.

- [Throttle](https://vector.dev/docs/reference/configuration/transforms/throttle/):
  rate limit log streams.

Finally, let's look at some of the
[sinks](https://vector.dev/docs/reference/configuration/sinks) available for Vector:

- [HTTP](https://vector.dev/docs/reference/configuration/sinks/http/): forward logs to an HTTP endpoint.
- [WebSocket](https://vector.dev/docs/reference/configuration/sinks/websocket/):
  deliver observability data to a WebSocket endpoint.
- [Loki](https://vector.dev/docs/reference/configuration/sinks/loki/): forward
  logs to Grafana Loki.
- [Elasticsearch](https://vector.dev/docs/reference/configuration/sinks/elasticsearch/):
  deliver logs to Elasticsearch.

In the next section, you will use [file](https://vector.dev/docs/reference/configuration/sources/file) source to read logs from a file and forward the records to the console using the [console](https://vector.dev/docs/reference/configuration/sinks/console/) sink.

## Getting started with Vector

Now that you know how Vector works, you will configure it to read log records from the `/var/log/logify/app.log` file and redirect them to the console using Docker.

Create a Vector configuration file in the `vector` directory:

```command
nano vector/vector.yaml
``` 

Add the following configuration:

```text
[label log-processing-stack/vector/vector.yaml]
sources:
  app_logs:
    type: "file"
    include:
      - "/var/log/logify/app.log"

sinks:
  print:
    type: "console"
    inputs:
      - "app_logs"
    encoding:
      codec: "json"
```

In the `sources` component, you define a `app_logs` source to reads logs from a file. The `type` option specifies the `file` source, and you define the `include` option, which contains the path to the file that should be read.

In the `sinks` component, you define a `print` sink, which specifies the destination to send the logs. To redirect them to the console, you set the `type` to the `console` sink. Next, you specify the source component from which the logs will originate, which is the `app_logs` source in this case. Finally, you specify that logs should be in JSON format using `encoding.codec`.

Now you can run Vector using Docker with the following command:

```command
docker run --rm \
  -v $(pwd)/vector/vector.yaml:/etc/vector/vector.yaml:ro \
  -v /var/log/logify:/var/log/logify:ro \
  timberio/vector:latest-alpine \
  --config /etc/vector/vector.yaml
```

This command:
- `--rm`: Removes the container when it stops
- `-v $(pwd)/vector/vector.yaml:/etc/vector/vector.yaml:ro`: Mounts your configuration file into the container as read-only
- `-v /var/log/logify:/var/log/logify:ro`: Mounts the log directory into the container as read-only
- `timberio/vector:latest-alpine`: Uses the latest Alpine-based Vector image
- `--config /etc/vector/vector.yaml`: Specifies the configuration file path

When Vector starts, you will see output confirming that it has started:

```text
[output]
2025-05-29T07:53:21.925722Z  INFO vector::app: Log level is enabled. level="info"
2025-05-29T07:53:21.927170Z  INFO vector::app: Loading configs. paths=["/etc/vector/vector.yaml"]
2025-05-29T07:53:21.933143Z  INFO vector::topology::running: Running healthchecks.
2025-05-29T07:53:21.933290Z  INFO vector: Vector has started. debug="false" version="0.47.0" arch="x86_64" revision="3d5af22 2025-05-20 13:53:41.638057046"
2025-05-29T07:53:21.933304Z  INFO vector::app: API is disabled, enable by setting `api.enabled` to `true` and use commands like `vector top`.
2025-05-29T07:53:21.933425Z  INFO vector::topology::builder: Healthcheck passed.
2025-05-29T07:53:21.933594Z  INFO source{component_kind="source" component_id=app_logs component_type=file}: vector::sources::file: Starting file server. include=["/var/log/logify/app.log"] exclude=[]
2025-05-29T07:53:21.934326Z  INFO source{component_kind="source" component_id=app_logs component_type=file}:file_server: file_source::checkpointer: Attempting to read legacy checkpoint files.
2025-05-29T07:53:21.937338Z  INFO source{component_kind="source" component_id=app_logs component_type=file}:file_server: vector::internal_events::file::source: Found new file to watch. file=/var/log/logify/app.log
...
```

After a few seconds, you will start seeing log messages in JSON format appear at the end:

```json
[output]
{"file":"/var/log/logify/app.log","host":"cf088a0fe2a2","message":"{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Initialized application\", \"pid\": 101999, \"ssn\": \"407-01-2433\", \"time\": 1748504820}","source_type":"file","timestamp":"2025-05-29T07:53:21.937600042Z"}
{"file":"/var/log/logify/app.log","host":"cf088a0fe2a2","message":"{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Connected to database\", \"pid\": 101999, \"ssn\": \"407-01-2433\", \"time\": 1748504823}","source_type":"file","timestamp":"2025-05-29T07:53:21.937620774Z"}
...
```

The output confirms that Vector can successfully read the log files and route the logs to the console. Vector has automatically added several fields such as `file`, `host`, `message`, `source_type`, and `timestamp` to each log entry for further context.

You can now press `CTRL + C` to exit Vector.

## Transforming the logs

It's uncommon to send logs without processing them in some way. Often, you may need to enrich them with important fields, redact sensitive data, or transform plain text logs into a structured format like JSON, which is easier for machines to parse.

Vector offers a powerful language for data manipulation called Vector Remap Language (VRL). VRL is a high-performance, expression-oriented language designed for transforming data. It provides functions for parsing data, converting data types, and even includes conditional statements, among other capabilities.

In this section, you will use VRL to process data in the following ways:

- Parsing JSON logs.
- Removing fields.
- Adding new fields.
- Converting timestamps.
- Redacting sensitive data.

### Vector Remap Language(VRL) dot operator
Before we dive into transforming logs with VRL, let's cover some fundamentals that will help you understand how to use it efficiently.

To get familiar with the syntax, Vector provides a `vector vrl` subcommand, which starts a Read-Eval-Print Loop (REPL). To use it, you need to provide it with the `--input` option, which accepts a JSON file with log events.

First, make sure you are in the `log-processing-stack/logify` and create an `input.json` file:

```command
nano input.json
```

In your `input.json` file, add the following log event from the output in the last section:

```json
[label log-processing-stack/logify/input.json]
{"file":"/var/log/logify/app.log","host":"cf088a0fe2a2","message":"{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Connected to database\", \"pid\": 101999, \"ssn\": \"407-01-2433\", \"time\": 1748504823}","source_type":"file","timestamp":"2025-05-29T07:53:21.937620774Z"}
```
Make sure there are no trailing spaces at the end to avoid errors.

Then, start the REPL using Docker:

```command
docker run --rm -it \
  -v $(pwd)/input.json:/input.json:ro \
  timberio/vector:latest-alpine \
  vrl --input /input.json
```

Type a single dot into the REPL prompt:

```command
.
```
When Vector reads the log event in the `input.json` file, the dot operator will return the following:

```json
[output]
{ "file": "/var/log/logify/app.log", "host": "cf088a0fe2a2", "message": "{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Connected to database\", \"pid\": 101999, \"ssn\": \"407-01-2433\", \"time\": 1748504823}", "source_type": "file", "timestamp": "2025-05-29T07:53:21.937620774Z" }
```

The `.` references the incoming event, and every event that Vector processes can be accessed using the dot notation.

To access a property, you prefix it with a `.` like so:

```command
.host
```
```text
[output]
"cf088a0fe2a2"
```
You can also reassign the value of `.` to another property:

```command
. = .host
```

Now, type the `.` again:

```command
.
```

It will no longer refer to the original object but to the "host" property:

```text
[output]
"cf088a0fe2a2"
```

Now you can exit the REPL with `CTRL` + `C`.

Now that you are familiar with the dot operator, you will explore VRL in more detail in the upcoming sections, starting with parsing JSON logs.

### Parsing JSON logs using Vector

To begin, if you examine the log in the output closely on the `message` property, you will notice that even though the log entry was originally in the JSON format, Vector has converted it into a string:

```json
[output]
{
  "file": "/var/log/logify/app.log",
  "host": "vector-test",
  "message": "{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Task completed successfully\", \"pid\": 12655, \"ssn\": \"407-01-2433\", \"time\": 1694551048}",
  "source_type": "file",
  "timestamp": "2025-05-29T07:53:21.937620774Z"
}
```

To configure Vector to parse JSON logs, open the configuration file. Make sure you're in the `log-processing-stack` directory:

```command
nano vector/vector.yaml
```

Next, define a transform and set it to use the [`remap`](https://vector.dev/docs/reference/configuration/transforms/remap/) transform:

```text
[label log-processing-stack/vector/vector.yaml]
sources:
  ...

[highlight]
transforms:
  app_logs_parser:
    inputs:
      - "app_logs"
    type: "remap"
    source: |
      # Parse JSON logs
      ., err = parse_json(.message)
[/highlight]

sinks:
  print:
    type: "console"
    inputs:
[highlight]
      - "app_logs_parser"
[/highlight]
    encoding:
      codec: "json"
```

You define a transform named `app_logs_parser` to process the logs. You specify that the input for this component should come from the source reading the records, which is `app_logs` here. Next, you configure the component to use the `remap` transform, which enables you to use the Vector Remap Language (VRL).

The `source` option contains the VRL syntax `., err = parse_json(.message)` wrapped in triple quotes. In VRL, you need to enclose your syntax in triple quotes whenever you write VRL code.

As explored in the previous section, the `.` refers to the entire object Vector processes. To select a specific attribute within the object, you use a field name and prefix it with a dot. With that, here is how Vector executes `., err = parse_json(.message)`:

1. `.message`: returns the entire string within the `message` field.
2. `parse_json(.message)`: The method parses the JSON data.
3. `., err`: If parsing JSON is successful, the `.` is set to the result of calling the `parse_json()` method; otherwise, the `err` variable is initialized.

Finally, in the `sinks.print` component, you update the `inputs` to specify that the logs now come from the `transforms.app_logs_parser` component.

Save the changes you have made. Now run Vector with the updated configuration:

```command
docker run --rm \
  -v $(pwd)/vector/vector.yaml:/etc/vector/vector.yaml:ro \
  -v /var/log/logify:/var/log/logify:ro \
  timberio/vector:latest-alpine \
  --config /etc/vector/vector.yaml
```

When Vector runs, you will be able to observe that the log messages are being parsed successfully:

```json
[output]
{"emailAddress":"user@mail.com","ip":"127.0.0.1","level":30,"msg":"Operation finished","pid":101999,"ssn":"407-01-2433","status":200,"time":1748506542}
...
```

In the output, the object has now been parsed, and we no longer see the additional fields that were added by Vector; only the logs remain. If the fields Vector added are helpful, you can replace `., err = ...` with `.message, err = ....`. However, for brevity in the output, we will keep them removed for the rest of this tutorial. You can now stop the container by pressing `Ctrl` + `C`. 

So far, we've explored how to parse JSON logs. However, Vector also comes with [parser functions](https://vector.dev/docs/reference/vrl/functions/#parse-functions) for various other formats, including:

- [`parse_csv`](https://vector.dev/docs/reference/vrl/functions/#parse_csv): useful for parsing CSV log data.
- [`parse_logfmt`](https://vector.dev/docs/reference/vrl/functions/#parse_logfmt): helpful for parsing structured logs in the [Logfmt format](https://betterstack.com/community/guides/logging/logfmt/).
- [`parse_syslog`](https://vector.dev/docs/reference/vrl/functions/#parse_syslog): suitable for parsing Syslog.
- [`parse_grok`](https://vector.dev/docs/reference/vrl/functions/#parse_grok): useful for parsing unstructured log data.

These parsers provide flexibility for handling various log formats and structures.

When working with parser functions, it's a recommended practice to address potential runtime errors. For additional details on this practice, you can refer to the [runtime errors](https://vector.dev/docs/reference/vrl/errors/#assigning) on Vector's website.

### Adding and removing fields with Vector

Now that you can parse JSON logs, you will remove sensitive details, such as the `emailAddress`. After that, you will add a new `environment` field to indicate whether the logs are from production or development.

Update the Vector configuration file with the following lines:

```text
[label log-processing-stack/vector/vector.yaml]
...
transforms:
  app_logs_parser:
    inputs:
      - "app_logs"
    type: "remap"
    source: |
      # Parse JSON logs
      ., err = parse_json(.message)
[highlight]
      # Remove emailAddress field
      del(.emailAddress)

      # Add an environment field
      .environment = "dev"
[/highlight]
...
```
In the above snippet, the `del()` function removes the `emailAddress` field. Afterward, a new `environment` field is added to the JSON object with the value `dev`. If the field already exists, its value would be overwritten.

After making the changes to the Vector configuration file, restart Vector with Docker:

```command
docker run --rm \
  -v $(pwd)/vector/vector.yaml:/etc/vector/vector.yaml:ro \
  -v /var/log/logify:/var/log/logify:ro \
  timberio/vector:latest-alpine \
  --config /etc/vector/vector.yaml
```

When you do, you will see output similar to the following:

```json
[output]
{"environment":"dev","ip":"127.0.0.1","level":30,"msg":"Task completed successfully","pid":101999,"ssn":"407-01-2433","status":200,"time":1748506768}
...
```

As you can see in the output, the `emailAddress` field has been deleted, and a new `environment` field has been added to the object.

The `del()` function is one of the [path functions](https://vector.dev/docs/reference/vrl/examples/#path-examples) that Vector provides. Other helpful functions are listed below:

- [`exists`](https://vector.dev/docs/reference/vrl/examples/#exists): helpful when you want to check if a field or an [array](https://vector.dev/docs/reference/vrl/examples/#array-examples) element exists.

- [`remove`](https://vector.dev/docs/reference/vrl/examples/#remove): useful when you want to remove a field whose path you don't know.

- [`set`](https://vector.dev/docs/reference/vrl/examples/#set): helpful when you want to dynamically insert a value into an object or array.

That takes care of modifying attributes on a log event. In the next section, you will format dates using Vector.

### Formatting dates with Vector

The application produces logs in Unix timestamps, representing the number of seconds elapsed since January 1st, 1970, at 00:00:00 UTC. To make the timestamps human-readable, you must convert them into a readable format.

In the configuration file, add the following lines:

```text
[label log-processing-stack/vector/vector.yaml]
...
transforms:
  app_logs_parser:
    inputs:
      - "app_logs"
    type: "remap"
    source: |
      # Parse JSON logs
      ., err = parse_json(.message)

      # Remove emailAddress field
      del(.emailAddress)

      # Add an environment field
      .environment = "dev"
[highlight]
      # Format date to the ISO format
      .time = from_unix_timestamp!(.time)
      .time = format_timestamp!(.time, format: "%+")
[/highlight]
...
```

The `from_unix_timestamp!()` function converts a Unix timestamp to a VRL timestamp. It's return value overwrites the time field, which is subsequently overwritten once again with the value from the `format_timestamp!()` function. The function formats the date in ISO format according to the `%+` format directive. 

You may notice that the functions end with `!`. This signifies that the functions are fallible, meaning they can fail and require error handling.

After saving the configuration file, restart Vector, and you'll see output similar to the following:

```json
[output]
{"environment":"dev","ip":"127.0.0.1","level":30,"msg":"Operation finished","pid":101999,"ssn":"407-01-2433","status":200,"time":"2025-05-29T08:21:16+00:00"}
...
```

The date is now in a human-readable ISO format.

The `from_unix_timestamp!()` function used in this section is one of the [conversion functions](https://vector.dev/docs/reference/vrl/examples/#convert-examples) that Vector provides. The following functions can also be helpful when converting data of various types:

- [`to_unix_timestamp`](https://vector.dev/docs/reference/vrl/functions/#to_unix_timestamp): converts a value into the Unix timestamp.
- [`to_syslog_facility`](https://vector.dev/docs/reference/vrl/functions/#to_syslog_facility): helpful when converting values into [Syslog facility code](https://en.wikipedia.org/wiki/Syslog#Facility).
- [`to_syslog_level`](https://vector.dev/docs/reference/vrl/functions/#to_syslog_level): coerce a value into a [Syslog severity level](https://vector.dev/docs/reference/vrl/functions/#to_syslog_facility:~:text=%2C%20a%20Syslog-,severity%20level,-%2C%20into%20its%20corresponding).

To better understand date formatting in logs, see our comprehensive [log formatting](https://betterstack.com/community/guides/logging/log-formatting/) guide.

### Working with conditional statements

VRL also provides conditional statements, instructing the computer to decide based on conditions. They work similarly to other programming languages like JavaScript. In this section, you will use a conditional statement to check if the `status` equals `200` and add a `success` field if the condition evaluates to `true`.

To accomplish this, add the following conditional statement:

```text
[label log-processing-stack/vector/vector.yaml]
...
transforms:
  app_logs_parser:
    inputs:
      - "app_logs"
    type: "remap"
    source: |
      # Parse JSON logs
      ., err = parse_json(.message)

      # Remove emailAddress field
      del(.emailAddress)

      # Add an environment field
      .environment = "dev"

      # Format date to the ISO format
      .time = from_unix_timestamp!(.time)
      .time = format_timestamp!(.time, format: "%+")
[highlight]
      if .status == 200 {
        .success = true
      }
[/highlight]
...
```

The `if` statement checks if the `status` equals `200` and adds a new `success` field. 

After saving, restart Vector, and you will see output that looks like this:

```json
[output]
{"environment":"dev","ip":"127.0.0.1","level":30,"msg":"Operation finished","pid":101999,"ssn":"407-01-2433","status":200,"success":true,"time":"2025-05-29T08:23:05+00:00"}
...
```

The `success` field has been added successfully to the object.

When working with conditional statements, it would be helpful to be familiar with [type functions](https://vector.dev/docs/reference/vrl/functions/#type-functions):

- [`is_json`](https://vector.dev/docs/reference/vrl/functions/#is_json): useful when you want to check if a value is valid JSON.
- [`is_boolean`](https://vector.dev/docs/reference/vrl/functions/#is_boolean): handy when you want to check if a value is a boolean.
- [`is_string`](https://vector.dev/docs/reference/vrl/functions/#is_string): helpful when you want to check if the given value is a string.

### Redacting sensitive data

The log message still contains [sensitive fields](https://betterstack.com/community/guides/logging/sensitive-data/), like IP addresses and social security numbers. Private user information shouldn't be logged to avoid it falling into the wrong hands. Therefore, redacting sensitive data is a good practice, especially when you can't remove a field entirely. To accomplish this, Vector provides the `redact()` function, which can redact any data.

In the configuration, add the following code to redact the IP address and social security number:

```text
[label log-processing-stack/vector/vector.yaml]
...
transforms:
  app_logs_parser:
    inputs:
      - "app_logs"
    type: "remap"
    source: |
      # Parse JSON logs
      ., err = parse_json(.message)

      # Remove emailAddress field
      del(.emailAddress)

      # Add an environment field
      .environment = "dev"

      # Format date to the ISO format
      .time = from_unix_timestamp!(.time)
      .time = format_timestamp!(.time, format: "%+")

      if .status == 200 {
        .success = true
      }
[highlight]
      # Redact field values
      . = redact(., filters: ["us_social_security_number", r'^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$'])
[/highlight]
...
```

The `redact()` method takes the entire object and applies the filters. Filters can be either regular expressions (regex) or built-in filters. Currently, Vector only has one built-in filter that can redact social security numbers, `us_social_security_number`. For other sensitive information, you need to use regex. In this example, the regex filter matches any IPV4 IP address and redacts them.

Save the changes, and restart Vector to yield output that looks like this:

```json
[output]
{"environment":"dev","ip":"[REDACTED]","level":30,"msg":"Initialized application","pid":101999,"ssn":"[REDACTED]","status":200,"success":true,"time":"2025-05-29T08:24:44+00:00"}
...
```

You can now stop Vector by pressing `CTRL + C`. To stop the `logify.sh` script, type the following command to obtain the process ID:

```command
jobs -l | grep "logify"
```
```text
[output]
[1]+ 101999 Running                 ./logify.sh &  (wd: ~/nginx-logging-tutorial/log-processing-stack/logify)
```
Terminate the program with its process ID:

```command
kill -9 101999
```
Be sure to replace `101999` with the actual process ID of the program you want to stop.

Now that you can transform logs, you will use Vector to collect records from multiple sources and forward them to a central location.

## Collecting logs from Docker containers and centralizing logs

In this section, you will containerize the Bash script and use a [Nginx hello world Docker image](https://hub.docker.com/r/betterstackcommunity/nginx-helloworld) preconfigured to produce Nginx logs in JSON format every time it receives a request. Then, you will use Vector to collect logs from both containers and centralize the logs on [Better Stack](https://telemetry.betterstack.com/) for analysis and monitoring.

### Dockerizing the Bash script

In this section, you will create a Dockerfile to containerize the Bash script you wrote earlier.

Make sure you are in the `log-processing-stack/logify` directory. Next, create a `Dockerfile`, which specifies what should be included in a container when it is running:

```command
nano Dockerfile
```
In your `Dockerfile`, add the instructions:

```text
[label log-processing-stack/logify/Dockerfile]
FROM ubuntu:latest

COPY . .

RUN chmod +x logify.sh

RUN mkdir -p /var/log/logify

RUN ln -sf /dev/stdout /var/log/logify/app.log

CMD ["./logify.sh"]
```

In the Dockerfile, you specify the latest Ubuntu image, copy the contents of the local directory into the container, make the script executable, and then create a dedicated directory to store the application logs. To ensure that logs are accessible, you redirect them to the standard output (stdout) using a symbolic link. Lastly, you specify the command to execute the script when the container initiates.

You will now write a `docker-compose.yml` file to define the Bash script and Nginx services.

First, change the directory into the root project directory:

```command
cd ..
```

Create a `docker-compose.yml` in your text editor:

```command
nano docker-compose.yml
```
Then add the following Docker Compose instructions:

```text
[label log-processing-stack/docker-compose.yml]
services:
  logify-script:
    build:
      context: ./logify
    image: logify:latest
    container_name: logify
  nginx:
    image: betterstackcommunity/nginx-helloworld:latest
    logging:
      driver: json-file
    container_name: nginx
    ports:
      - '80:80'
```

In the configuration file, you define a `logify-script` service that will build an image with the name `logify:latest` based on the Dockerfile in the `./logify` directory. You then define a `nginx` service to listen on port 80 for incoming HTTP requests. If there is a service currently running on port 80, you should terminate it.

To build the images and create the services, run the following command in the same directory as your `docker-compose.yml` file:

```command
docker compose up -d
```

The `-d` flag allows the containers to run in the background.

You can check the status of the containers with this command:

```command
docker compose ps
```

```text
[output]
NAME      IMAGE                                          COMMAND              SERVICE         CREATED          STATUS          PORTS
logify    logify:latest                                  "./logify.sh"        logify-script   16 seconds ago   Up 15 seconds
nginx     betterstackcommunity/nginx-helloworld:latest   "/runner.sh nginx"   nginx           16 seconds ago   Up 15 seconds   0.0.0.0:80->80/tcp, [::]:80->80/tcp
```

Send five requests to the `nginx` service  using the `curl` command:

```command
curl http://localhost:80/?[1-5]
```

Following that, check the logs of the containers in your Docker Compose setup:

```command
docker compose logs
```

```json
[output]
logify  | {"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Operation finished", "pid": 1, "ssn": "407-01-2433", "time": 1748507479}
...
logify  | {"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Operation finished", "pid": 1, "ssn": "407-01-2433", "time": 1748507461}
nginx  | {"timestamp":"2025-05-29T08:31:12+00:00","pid":"8","remote_addr":"172.18.0.1","remote_user":"","request":"GET /?4 HTTP/1.1","status": "200","body_bytes_sent":"11109","request_time":"0.000","http_referrer":"","http_user_agent":"curl/8.5.0","time_taken_ms":"1748507472.760"}
...
nginx  | {"timestamp":"2025-05-29T08:31:12+00:00","pid":"8","remote_addr":"172.18.0.1","remote_user":"","request":"GET /?5 HTTP/1.1","status": "200","body_bytes_sent":"11109","request_time":"0.000","http_referrer":"","http_user_agent":"curl/8.5.0","time_taken_ms":"1748507472.761"}
```

The output displays all the logs from the `nginx` and  `logify` containers.

With your containers running and producing logs, the next step is to set up a Vector container to read and centralize these logs.

### Defining the Vector service with Docker Compose

In this section, you will define the Vector service in your Docker Compose setup to collect from the existing containers and centralize logs in [Better Stack](https://telemetry.betterstack.com/). You will also create a Vector configuration file that specifies how the log records should be collected and processed.

In the root directory, open the `docker-compose.yml` file:

```command
nano docker-compose.yml
```

Then add the following code in the `docker-compose.yml` file:

```text
[label log-processing-stack/docker-compose.yml]
services:
  logify-script:
    build:
      context: ./logify
    image: logify:latest
    container_name: logify
  nginx:
    image: betterstackcommunity/nginx-helloworld:latest
    logging:
      driver: json-file
    container_name: nginx
    ports:
      - '80:80'
[highlight]
  vector:
    image: timberio/vector:latest-alpine
    volumes:
      - ./vector:/etc/vector
      - /var/run/docker.sock:/var/run/docker.sock
    command: ["-c", "/etc/vector/vector.yaml"]
    ports:
      - '8686:8686'
    container_name: vector
    depends_on:
      - logify-script
      - nginx
[/highlight]
```

The `vector` service definition uses the official [timberio/vector](https://hub.docker.com/r/timberio/vector) Docker image with the Alpine variant for smaller size. It also mounts the `vector` directory containing the Vector configuration file into the container and the Docker daemon socket to access container logs.

### Setting up Better Stack for log centralization

Before configuring Vector to collect logs, you need to set up a destination for your logs. We will use Better Stack to centralize the records so you can monitor and analyze them in one place.

If you want a quick overview of what shipping logs from Vector to Better Stack looks like end to end, watch the short walkthrough below:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/8NMpHrVnJes" title="Ship logs to Better Stack with the collector" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


Create a free [Better Stack account](https://telemetry.betterstack.com/users/sign-up) and navigate to the [Telemetry page](https://telemetry.betterstack.com/). From the menu on the left, choose **Sources** and click on **Connect source**:

![The Better Stack Sources page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/84a7ceaa-e302-4357-7bc2-79c6ecdc5a00/md1x =3024x1530)

Create a source for the Bash script logs. Provide a suitable name for the source (e.g., "Logify App Logs") and choose **Docker** as the platform, then scroll down to the bottom of the page and click **Connect Source**:

![Creating a source in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/09ec7a83-6a54-444a-5f86-03f08006cc00/md2x =3024x3384)

After creating the source, you will receive a **source token** (e.g., `qU73jvQjZrNFHimZo4miLdxF`) and an **ingestion host** (e.g., `s1315908.eu-nbg-2.betterstackdata.com`). Be sure to save both values, as you'll need them when configuring log forwarding in your Vector configuration file:

![Copy source token and injection host in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1056ee4e-00e5-4c16-b0b7-91b030a2ca00/lg2x =3024x1530)

If you want a quick visual overview of how sources work and where these values live in the UI, watch the short walkthrough below:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/_V81nd6P1iI" title="Better Stack sources overview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Afterward, execute the following command to obtain the Docker image names:

```command
docker ps
```
```text
CONTAINER ID   IMAGE                                          COMMAND              CREATED          STATUS          PORTS                                 NAMES
412f0f8cad51   betterstackcommunity/nginx-helloworld:latest   "/runner.sh nginx"   34 minutes ago   Up 34 minutes   0.0.0.0:80->80/tcp, [::]:80->80/tcp   nginx
d0eeb92cc5ca   logify:latest                                  "./logify.sh"        34 minutes ago   Up 34 minutes
```

Now, create the Vector configuration file to collect logs from Docker containers:

```command
nano vector/vector.yaml
```

Replace the content in `vector.yaml` with the following configuration:

```text
[label log-processing-stack/vector/vector.yaml]
sources:
  bash_logs:
    type: docker_logs
    include_images:
      - "logify:latest"

sinks:
  better_stack_bash:
    type: http
    method: post
    inputs:
      - "bash_logs"
[highlight]
    uri: "https://<your_bash_ingesting_host>/"
[/highlight]
    encoding:
      codec: json
    auth:
      strategy: bearer
[highlight]
      token: "<your_bash_source_token>"
[/highlight]
```

Make sure to replace `<your_ingesting_host>` and `<your_betterstack_source_token>` with the actual ingestion host and source token provided on your Better Stack Sources page.

The `sources.bash_logs` component uses the `docker_logs` source to read logs from containers built from the `logify:latest` image. The collected logs are then sent to Better Stack over HTTP using the specific ingestion host and source token you obtained earlier.


Save and exit the configuration file, then start the Vector service:

```command
docker compose up -d
```

Once the `vector` container is running, return to the Better Stack source page and scroll down to the **Verify data collection** section. After a few moments, you should see a **Logs received!** message, confirming that your Bash script container logs are being shipped to the service.

![Logs received in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2f3ac2fc-56e7-4af4-e918-1e33e056fa00/orig =3024x2677)

Click on the **Live tail** link to see your container logs streaming in:

![Better Stack live tail page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7ab732b3-484f-410c-38de-fab0bdaeac00/lg2x =3024x1530)

You should now see logs from your `logify` container appearing in Better Stack. These logs will include useful metadata such as container names, image names, and timestamps.

Clicking on any log entry will reveal additional details:

![log entry details](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/89b8428a-51f7-4636-423c-17024402c900/md1x =3024x1530)

Now that you've verified the Bash script logs are working correctly, you can add sources for the Nginx and Vector logs. Create two more sources in Better Stack:

1. **Nginx Logs** - for collecting logs from the Nginx container
2. **Vector Logs** - for collecting Vector's internal logs

Follow the same process as before to create these sources and note down their respective source tokens and ingestion hosts.

Once you have all three sources created, update your Vector configuration file:

```command
nano vector/vector.yaml
```

Add the additional sources and sinks to your configuration:

```text
[label log-processing-stack/vector/vector.yaml]
sources:
  bash_logs:
    type: docker_logs
    include_images:
      - "logify:latest"
[highlight]
  nginx_logs:
    type: docker_logs
    include_images:
      - "betterstackcommunity/nginx-helloworld:latest"
  
  vector_logs:
    type: internal_logs
[/highlight]

sinks:
  better_stack_bash:
    type: http
    method: post
    ... 

[highlight]
  better_stack_nginx:
    type: http
    method: post
    inputs:
      - "nginx_logs"
    uri: "https://<your_nginx_ingesting_host>/"
    encoding:
      codec: json
    auth:
      strategy: bearer
      token: "<your_nginx_source_token>"

  better_stack_vector:
    type: http
    method: post
    inputs:
      - "vector_logs"
    uri: "https://<your_vector_ingesting_host>/"
    encoding:
      codec: json
    auth:
      strategy: bearer
      token: "<your_vector_source_token>"
[/highlight]
```
Remember to replace `<your_nginx_ingesting_host>`, `<your_vector_ingesting_host>`, `<your_nginx_source_token>`, and `<your_vector_source_token>` with the actual values from your Better Stack Sources page.

Save the file and restart the containers:

```command
docker compose up -d
```

Now send some requests to the `nginx` service to generate logs:

```command
curl http://localhost:80/?[1-5]
```

The logs from Nginx will be sent to their dedicated Better Stack source. To see Vector's internal logs, stop all the containers and start them again:

```command
docker compose stop
```
```
docker compose up -d
```

You can now see that the logs are being sent to their respective sources. Here are the Nginx logs appearing in live tail:

![Nginx logs in Better Stack live tail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/448b58c1-9a30-4b65-2bb5-ac9e00e64400/lg1x =3024x1530)

Here are the Vector logs showing Vector's startup and operational information:

![Vector logs in Better Stack live tail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1e0ff332-ac88-44af-a783-9f2445326800/public =3024x1530)


If you want a quick tour of Live Tail and how to drill into individual log events, watch the short walkthrough below:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="Better Stack Live Tail walkthrough" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

With this setup, you have successfully centralized all your Docker container logs in separate sources within Better Stack, making it easier to monitor, debug, and analyze each service independently while maintaining centralized access.

Save and exit the configuration file.

## Monitoring Vector health with Better Stack

Vector provides a `/health` endpoint that tools like Better Stack can periodically check. If Vector becomes unhealthy or goes down, you can configure Better Stack to send alerts through phone or email, enabling you to address any issues promptly.

To set up health monitoring for Vector, open the `vector.yaml` file:

```command
nano vector/vector.yaml
```
 Then add the following code at the top of the configuration file:

```text
[label log-processing-stack/vector/vector.yaml]
[highlight]
api:
  enabled: true
  address: "0.0.0.0:8686"
[/highlight]
sources:
  bash_logs:
    type: "docker_logs"
    include_images:
      - "logify:latest"
  
  nginx_logs:
    type: "docker_logs"
    include_images:
      - "betterstackcommunity/nginx-helloworld:latest"
  
  vector_logs:
    type: "internal_logs"
# ... rest of configuration
```

This configuration enables the API and makes the `/health` endpoint accessible online.

For these changes to take effect, stop and discard the containers:

```command
docker compose down
```
Start the containers again:

```command
docker compose up -d
```

Verify that the `/health` endpoint works:

```command
curl http://localhost:8686/health
```

```text
[output]
{"ok":true}
```
If you prefer the quickest path, watch the short walkthrough below. It shows how to create an Uptime monitor for a health check endpoint:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/wRwS3-trbOo" title="Monitor a health check endpoint with Better Stack" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

With your free Better Stack account, log in to [Better Stack](https://uptime.betterstack.com/).

On the **Monitors** page, click the **Create monitor** button:

![On the monitors page, which allows a user to create a monitor](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3ae9237f-cb0f-4a9b-d969-edf33ddb3c00/md2x =3024x1530)

Next, enter the relevant details and then click the **Create monitor** button:
![Screenshot of Better Stack with the necessary options set](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e02dcb5a-bdeb-4c4a-a68c-00de87b67a00/orig =3024x2380)

In the screenshot, you select the option to trigger Better Stack and provide the server's IP address or domain name with the endpoint on port 8686. In addition, you choose how you want to be notified.

At this point, Better Stack will start monitoring the endpoint and provide performance statistics:

![Screenshot of Better Stack monitoring the endpoint](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8395e39b-2e2d-4108-965b-866bdffc5600/public =3024x2856)

Let's see what will happen if the endpoint stops working. To do that, stop the services:

```command
docker compose stop
```

After a minute or two passes, you will see that Better Stack will update the status to "Down":

![Screenshot of Better Stack monitoring the endpoint showing status is "Down"](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d49a48a9-b11a-4ee2-50c7-4d9aec415b00/md1x =3024x2856)

If you chose to be notified by email, you will receive an email alert:

![Screenshot of the Better Stack email alert](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9d7767be-57b0-486b-f850-ecc28e677700/md1x =1886x1188)

[summary]

## Side note: Visualize and explore your logs in Better Stack

Once your logs are flowing, you can go beyond search and use Better Stack to explore patterns over time and drill into spikes and anomalies.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Final thoughts

In this comprehensive article, we delved deep into Vector and set up a log processing stack using Vector, Docker, Nginx, and Better Stack. We covered various topics, from creating Vector configurations and dockerizing your Bash script and Nginx to centralizing logs with Better Stack.

With the knowledge gained, you are now well-prepared to manage logs efficiently using Docker containers, whether for troubleshooting, enhancing performance, or ensuring compliance with your applications and services.

To further expand your knowledge with Vector, consult [the documentation](https://vector.dev/docs/). For more insights into Docker and Docker Compose, refer to their respective documentation pages: [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose). 

Thanks for reading, and happy logging!