# How to Collect, Process, and Ship Log Data with Fluent Bit

In distributed systems, efficient log shipping is essential. A [log shipper](https://betterstack.com/community/guides/logging/log-shippers-explained/) is a tool that gathers logs from various sources, like containers and servers and directs them to a central location for analysis. Several options, including LogStash and Fluentd, are available for this purpose. Among them, Fluent Bit stands out as a lightweight, high-performance log shipper introduced by Treasure Data.

[Fluent Bit](https://fluentbit.io/) was developed in response to the growing need for a log shipper that could operate in resource-constrained environments, such as embedded systems and containers. With a minimal memory footprint of 1MB, Fluent Bit efficiently collects logs from multiple sources, transforms the data, and forwards it to diverse destinations for storage and analysis. Key features of Fluent Bit include SQL Stream Processing, [backpressure](https://docs.fluentbit.io/manual/administration/backpressure) handling, Vendor-Neutral, and Apache 2 Licensed. Fluent Bit also shines with its flexibility because of the pluggable architecture, supporting easy integration and customization. With over 100 built-in plugins, it offers extensive options for collecting, filtering, and forwarding data.

Fluent Bit's reliability is underscored by its adoption by major cloud providers like DigitalOcean, AWS Cloud, and Google Cloud, processing vast amounts of data daily.

In this comprehensive guide, you will use Fluent Bit running in Docker containers to gather logs from diverse sources, transform, and deliver them to various destinations. The tutorial will walk you through reading logs from a file and forwarding them to the console using Docker. Subsequently, you will explore how Fluent Bit can collect logs from multiple containers and route them to a centralized location. Finally, you will monitor Fluent Bit's health to ensure its smooth operation.

## Prerequisites

To follow this guide, you need access to a system that has a non-root user account with `sudo` privileges. You should install [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) as this tutorial focuses on using Fluent Bit through Docker containers. If you're uncertain about the need for a log shipper, you can read [this article on log shippers](https://betterstack.com/community/guides/logging/log-shippers-explained/) to understand their benefits, how to choose one, and compare a few options.

Once you've met these prerequisites, create a root project directory that will contain the application and configuration files with the following command:

```command
mkdir log-processing-stack
```

Move into the newly created directory:

```command
cd log-processing-stack
```

Next, create a subdirectory named `logify` for the demo application you'll be building in the upcoming section:

```command
mkdir logify
```

Change into the subdirectory:

```command
cd logify
```

With these directories in place, you're ready to proceed to the next step, where you'll create the demo logging application.

[summary]

## Side note: Ship Fluent Bit logs to Better Stack

Once Fluent Bit is producing structured JSON, you can ship it to [Better Stack](https://betterstack.com/telemetry) and get instant search, live tail, and alerting without running your own storage.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Developing a demo logging application

In this section, you'll create a sample logging script using [Bash](<https://en.wikipedia.org/wiki/Bash_(Unix_shell)>) that generates log entries at regular intervals and writes them to a file.

Create a `logify.sh` file within the `logify` directory. You can use your preferred text editor. This tutorial uses `nano`:

```command
nano logify.sh
```

In your `logify.sh` file, enter the following contents to generate log entries with Bash:

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
    local log='{"status": "'$http_status_code'", "ip": "'$ip_address'", "level": '$level', "emailAddress": "'$emailAddress'", "msg": "'$random_message'", "pid": '$pid', "ssn": "'$ssn'", "timestamp": '$time'}'
    echo "$log"
}

while true; do
    log_record=$(create_log_entry)
    echo "${log_record}" >> "${filepath}"
    sleep 3
done
```

The `create_log_entry()` function generates log entries in JSON format and includes various details such as HTTP status codes, severity levels, and random log messages. It also intentionally includes sensitive fields like IP address, Social Security Number (SSN), and email address to demonstrate Fluent Bit's ability to remove or redact sensitive data. To learn more about best practices for logging sensitive data, refer to [our guide](https://betterstack.com/community/guides/logging/sensitive-data/).

Next, the infinite loop continuously invokes the `create_log_entry()` function to generate a log record every 3 seconds and append them to a specified file in the `/var/log/logify/` directory.

When you are finished, save the new changes and make the script executable:

```command
chmod +x logify.sh
```

Create a directory to store the application logs:

```command
sudo mkdir /var/log/logify
```

Assign ownership of the directory to the currently logged-in user:

```command
sudo chown -R $USER:$USER /var/log/logify/
```

Then, run the Bash script in the background:

```command
./logify.sh &
```

```text
[output]
[1] 134450
```

The script will start writing logs to the `app.log` file. To view the last few log entries, use the `tail` command:

```command
tail -n 4 /var/log/logify/app.log
```

```json
[output]
{"status": "200", "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Operation finished", "pid": 134450, "ssn": "407-01-2433", "timestamp": 1748596097}
{"status": "200", "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Task completed successfully", "pid": 134450, "ssn": "407-01-2433", "timestamp": 1748596100}
{"status": "200", "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Initialized application", "pid": 134450, "ssn": "407-01-2433", "timestamp": 1748596103}
{"status": "200", "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Task completed successfully", "pid": 134450, "ssn": "407-01-2433", "timestamp": 1748596106}
```

Each line in the output represents a log event or record.

With the log entries being generated, the next step is to set up Fluent Bit using Docker.

## Setting up Fluent Bit with Docker

In this section, you’ll set up the necessary file structure to run Fluent Bit using the official Docker image from [fluent/fluent-bit](https://hub.docker.com/r/fluent/fluent-bit/). Running Fluent Bit in Docker offers benefits like easier version control, environment isolation, and consistent deployment.

First, create a directory structure for Fluent Bit configuration files. Navigate back to your project root directory:

```command
cd ..
```

Create a directory for Fluent Bit configurations:

```command
mkdir fluent-bit-config
```

Navigate into the configuration directory:

```command
cd fluent-bit-config
```

At this point, you’ve created the directory structure needed for Fluent Bit’s configuration files. We won’t add any config files just yet—we’ll come back to this directory shortly when it’s time to set up and run Fluent Bit with Docker.

## How Fluent Bit works

Fluent Bit operates as a robust pipeline for handling log data. You can imagine it as a sequence where logs flow through distinct stages, each performing a specific task. Let's break down Fluent Bit's core components and plugins to provide a clearer understanding:

![Diagram illustrating the Fluent Bit observability pipeline](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fa0869a0-de54-4ccf-2432-1546560e1700/public =1054x263)

At the beginning of the pipeline, Fluent Bit collects logs from various sources. These logs then pass through a **Parser**, transforming unstructured data into structured log events. Subsequently, the log event stream encounters the **Filter**, which can enrich, exclude, or modify the data according to project requirements. After filtration, the logs are temporarily stored in a **Buffer**, either in memory or the filesystem, ensuring smooth processing. Finally, the **Router** directs the data to diverse destinations for analysis and storage.

To put this into practice, you can define Fluent Bit's behavior in a configuration file:

```text
[SERVICE]
    ...

[INPUT]
    ...

[FILTER]
    ...

[OUTPUT]
    ...
```

Let's look at these components in detail:

- `[SERVICE]`: contains global settings for the running service.
- `[INPUT]`: specifies sources of log records for Fluent Bit to collect.
- `[FILTER]`: applies transformations to log records.
- `[OUTPUT]`: determines the destination where Fluent Bit sends the processed logs.

For these components to do their tasks, they require a plugin. Here is a brief overview of the plugins available for Fluent Bit.

### Fluent Bit input plugins

For the `[INPUT]` component, the following are some of [input plugins](https://docs.fluentbit.io/manual/pipeline/inputs) that can come in handy:

- [`tail`](https://docs.fluentbit.io/manual/pipeline/inputs/tail/): monitors and collects logs from the end of a file, akin to the `tail -f` command.
- [`syslog`](https://docs.fluentbit.io/manual/pipeline/inputs/syslog): gathers Syslog logs from a Unix socket server.
- [`http`](https://docs.fluentbit.io/manual/pipeline/inputs/http): captures logs via a REST endpoint.
- [`opentelemetry`](https://docs.fluentbit.io/manual/pipeline/inputs/opentelemetry): fetches telemetry data from [OpenTelemetry sources](https://betterstack.com/community/guides/observability/what-is-opentelemetry/).

### Fluent Bit filter plugins

When you need to transform logs, Fluent Bit provides a range of [filter plugins](https://docs.fluentbit.io/manual/pipeline/filters/) suited for different modifications:

- [`record_modifier`](https://docs.fluentbit.io/manual/pipeline/filters/record-modifier): modifies log records.
- [`lua`](https://docs.fluentbit.io/manual/pipeline/filters/lua): alters log records using [Lua](https://www.lua.org/) scripts.
- [`grep`](https://docs.fluentbit.io/manual/pipeline/filters/grep): matches or excludes log records, similar to the `grep` command.
- [`modify`](https://docs.fluentbit.io/manual/pipeline/filters/modify): changes log records based on specified conditions or rules.

### Fluent Bit output plugins

To dispatch logs to various destinations, Fluent Bit offers versatile [output plugins](https://docs.fluentbit.io/manual/pipeline/outputs):

- [`file`](https://docs.fluentbit.io/manual/pipeline/outputs/file): write logs to a specified file.
- [`amazon_s3`](https://docs.fluentbit.io/manual/pipeline/outputs/s3): sends logs, metrics to Amazon S3.
- [`http`](https://docs.fluentbit.io/manual/pipeline/outputs/http): pushes records to an HTTP endpoint.
- [`websocket`](https://docs.fluentbit.io/manual/pipeline/outputs/websocket): forwards log records to a WebSocket endpoint.

Now that you have a rough idea of how Fluent Bit works, you can proceed to the next section to start using Fluent Bit with Docker.

## Getting started with Fluent Bit using Docker

In this section, you will configure Fluent Bit to read logs from a file using the [`tail`](https://docs.fluentbit.io/manual/pipeline/inputs/tail/) input plugin and display them in the console. You'll run Fluent Bit in a Docker container with properly mounted configuration files.

First, create the Fluent Bit configuration file:

```command
nano fluent-bit.conf
```

Add the following configuration code:

```text
[label fluent-bit-config/fluent-bit.conf]
[SERVICE]
    Flush        1
    Daemon       off
    Log_Level    debug

[INPUT]
    Name         tail
    Path         /var/log/logify/app.log
    Tag          filelogs

[OUTPUT]
    Name         stdout
    Match        filelogs
```

The `[SERVICE]` defines global settings for Fluent Bit. It specifies that Fluent Bit should flush every 1 second, run in the foreground, and set the log level to `debug`.

The `[INPUT]` uses the `tail` plugin to read logs from the specified file at `/var/log/logify/app.log`. The `Tag` allows other Fluent Bit components, such as `[FILTER]` and `[OUTPUT]`, to identify these log records.

The `[OUTPUT]` component uses the `stdout` plugin to forward logs to the console. The `Match` parameter ensures only logs with the `filelogs` tag are delivered to the console.

After making these changes, save the file.

Next, validate your configuration file for errors using Docker:

```command
docker run --rm -v $(pwd):/fluent-bit/etc -v /var/log/logify:/var/log/logify fluent/fluent-bit:latest --dry-run -c /fluent-bit/etc/fluent-bit.conf
```

```text
[output]
[2025/05/30 09:12:43] [ info] Configuration:
[2025/05/30 09:12:43] [ info]  flush time     | 1.000000 seconds
[2025/05/30 09:12:43] [ info]  grace          | 5 seconds
[2025/05/30 09:12:43] [ info]  daemon         | 0
[2025/05/30 09:12:43] [ info] ___________
[2025/05/30 09:12:43] [ info]  inputs:
[2025/05/30 09:12:43] [ info]      tail
[2025/05/30 09:12:43] [ info] ___________
[2025/05/30 09:12:43] [ info]  filters:
[2025/05/30 09:12:43] [ info] ___________
[2025/05/30 09:12:43] [ info]  outputs:
[2025/05/30 09:12:43] [ info]      stdout.0
[2025/05/30 09:12:43] [ info] ___________
[2025/05/30 09:12:43] [ info]  collectors:
configuration test is successful
```

If the output displays "configuration test is successful", your configuration file is valid and error-free.

Make sure your Bash program is still running in the background. If not, restart it.

Now, start Fluent Bit using Docker with the proper volume mounts:

```command
docker run --rm -v $(pwd):/fluent-bit/etc -v /var/log/logify:/var/log/logify fluent/fluent-bit:latest -c /fluent-bit/etc/fluent-bit.conf
```

The command mounts:

- Your configuration directory (`$(pwd)`) to `/fluent-bit/etc` inside the container
- The log directory (`/var/log/logify`) to the same path inside the container

When Fluent Bit starts, you should see an output similar to the following:

```text
[output]
...
[2025/05/30 09:13:57] [debug] [input:tail:tail.0] scan_glob add(): /var/log/logify/app.log, inode 259470
[2025/05/30 09:13:57] [debug] [input:tail:tail.0] 1 new files found on path '/var/log/logify/app.log'
[2025/05/30 09:13:57] [debug] [stdout:stdout.0] created event channels: read=33 write=34
[2025/05/30 09:13:57] [ info] [sp] stream processor started
[2025/05/30 09:13:57] [debug] [input:tail:tail.0] inode=259470 file=/var/log/logify/app.log promote to TAIL_EVENT
[2025/05/30 09:13:57] [ info] [output:stdout:stdout.0] worker #0 started
[2025/05/30 09:13:57] [ info] [input:tail:tail.0] inotify_fs_add(): inode=259470 watch_fd=1 name=/var/log/logify/app.log
[2025/05/30 09:13:57] [debug] [input:tail:tail.0] [static files] processed 0b, done
[2025/05/30 09:13:57] [debug] [input:tail:tail.0] inode=259470, /var/log/logify/app.log, events: IN_MODIFY
[2025/05/30 09:13:58] [debug] [task] created task=0x704401836960 id=0 OK
[2025/05/30 09:13:58] [debug] [output:stdout:stdout.0] task_id=0 assigned to thread #0
```

Following that, you will see the log messages appear:

```text
[output]
[0] filelogs: [[1748596437.607280423, {}], {"log"=>"{"status": "200", "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Connected to database", "pid": 134450, "ssn": "407-01-2433", "timestamp": 1748596437}"}]
...
[0] filelogs: [[1748596443.628922727, {}], {"log"=>"{"status": "200", "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Task completed successfully", "pid": 134450, "ssn": "407-01-2433", "timestamp": 1748596443}"}]
```

Fluent Bit is now displaying the log messages along with additional context. You can exit Fluent Bit by pressing `CTRL + C`.

## Transforming logs with Fluent Bit

When collecting logs with Fluent Bit, processing them to enhance their utility is often necessary. Fluent Bit provides a powerful array of [filter plugins](https://docs.fluentbit.io/manual/pipeline/filters/) designed to transform event streams effectively. In this section, we will explore various essential log transformation tasks:

- Parsing JSON logs.
- Removing unwanted fields.
- Adding new fields.
- Converting Unix timestamps to the ISO format.
- Masking sensitive data.

### Parsing JSON logs with Fluent Bit

When working with logs generated in JSON format, it's crucial to parse them accurately. This ensures the data maintains its integrity and adheres to the expected structure. This section will focus on parsing JSON log records as valid JSON to provide a well-defined structure.

To do that, let's examine a log event from the last section in detail:

```text
[output]
[0] filelogs: [[1748596443.628922727, {}], {"log"=>"{"status": "200", "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Task completed successfully", "pid": 134450, "ssn": "407-01-2433", "timestamp": 1748596443}"}]
...
```

Upon close inspection, you will see that Fluent Bit adds `key=value` pairs, and the data here needs a consistent JSON structure.

You can create a `Parser` to parse logs as JSON in Fluent Bit.

In your text editor, create a `parser_json.conf` file:

```command
nano parser_json.conf
```

In your `parser_json.conf` file, add the following code:

```text
[label fluent-bit-config/parser_json.conf]
[PARSER]
    Name         json_parser
    Format       json
```

The `[PARSER]` component takes the parser's name and the format in which log events should be parsed, which is `json` here.

In the Fluent Bit configuration file `fluent-bit.conf`, make the following modifications:

```text
[label fluent-bit-config/fluent-bit.conf]
[SERVICE]
    Flush        1
    Daemon       off
    Log_Level    debug
[highlight]
    Parsers_File parser_json.conf
[/highlight]

[INPUT]
    Name         tail
    Path         /var/log/logify/app.log
[highlight]
    Parser       json_parser
[/highlight]
    Tag          filelogs

[OUTPUT]
    Name         stdout
[highlight]
    format       json
[/highlight]
    Match        filelogs
```

The `Parsers_File` parameter references the `parser_json.conf` file, which defines the `json_parser` for parsing JSON logs.

In the `[INPUT]` component, you add the `Parser` parameter with the value `json_parser`. This specifies that the incoming logs should be parsed using the JSON parser defined in `parser_json.conf`.

Finally, in the `[OUTPUT]` section, you set the `format` parameter to `json`, ensuring that the logs forwarded to the output are in the JSON format.

After making these changes, save the configuration file and restart Fluent Bit using Docker:

```command
docker run --rm -v $(pwd):/fluent-bit/etc -v /var/log/logify:/var/log/logify fluent/fluent-bit:latest -c /fluent-bit/etc/fluent-bit.conf
```

```text
[output]
[{"date":1748596669.419202,"status":"200","ip":"127.0.0.1","level":30,"emailAddress":"user@mail.com","msg":"Connected to database","pid":134450,"ssn":"407-01-2433","timestamp":1748596669}]
...
[{"date":1748596681.45615,"status":"200","ip":"127.0.0.1","level":30,"emailAddress":"user@mail.com","msg":"Connected to database","pid":134450,"ssn":"407-01-2433","timestamp":1748596681}]
```

You can now observe that the logs are formatted in the JSON format.

Now, you can stop Fluent Bit with `CTRL + C`.

You have learned how to parse incoming JSON logs correctly. Fluent Bit provides various [parsers](https://docs.fluentbit.io/manual/pipeline/parsers) to handle diverse log formats:

- [`regex`](https://docs.fluentbit.io/manual/pipeline/parsers/regular-expression): uses regular expressions to parse log events
- [`logfmt`](https://docs.fluentbit.io/manual/pipeline/parsers/logfmt): parses log records which are in the Logfmt format.
- [`lstv`](https://docs.fluentbit.io/manual/pipeline/parsers/ltsv): parse log events in the LSTV format format.

These parsing methods offer flexibility, allowing Fluent Bit to handle many log formats efficiently.

Now that you can parse the JSON logs, you will alter the log records attribute in the next section.

### Adding and removing fields with Fluent Bit

In this section, you'll customize log records by removing sensitive data and adding new fields. Precisely, you will remove the `emailAddress` field due to its sensitive nature and add a `hostname` field to enhance log context.

Open your Fluent Bit configuration file in your text editor:

```command
nano fluent-bit.conf
```

Integrate the following `[FILTER]` component into your configuration:

```text
[label fluent-bit-config/fluent-bit.conf]
[SERVICE]
    Flush        1
    Daemon       off
    Log_Level    debug
    Parsers_File parser_json.conf

[INPUT]
    Name         tail
    Path         /var/log/logify/app.log
    Parser       json_parser
    Tag          filelogs

[highlight]
[FILTER]
    Name record_modifier
    Match filelogs
    Remove_key     emailAddress
    Record hostname ${HOSTNAME}
[/highlight]

[OUTPUT]
    Name         stdout
    format       json
    Match        filelogs
```

In the `[FILTER]` component, the `name` parameter denotes that the `record_modifier` plugin is being used. To exclude the `emailAddress` field, you use the `Remove_key` parameter. The `Record` parameter also introduces a new field called `hostname`, which is automatically populated with the system's hostname information.

Save your changes and restart Fluent Bit using Docker to apply the modifications:

```command
docker run --rm -v $(pwd):/fluent-bit/etc -v /var/log/logify:/var/log/logify fluent/fluent-bit:latest -c /fluent-bit/etc/fluent-bit.conf
```

When Fluent Bit runs, you will observe the log events without the `emailAddress` field, and the `hostname` field will be incorporated into the log events:

```json
[output]
[{"date":1748596765.786222,"status":"200","ip":"127.0.0.1","level":30,"msg":"Initialized application","pid":134450,"ssn":"407-01-2433","timestamp":1748596765,"hostname":"9b70a642063b"}]
...
[{"date":1748596783.852181,"status":"200","ip":"127.0.0.1","level":30,"msg":"Task completed successfully","pid":134450,"ssn":"407-01-2433","timestamp":1748596783,"hostname":"9b70a642063b"}]
...
```

That takes care of removing fields and adding new fields. In the next section, you will format the timestamps.

### Formatting dates with Fluent Bit

The Bash generates logs with a Unix timestamp, representing the number of seconds that elapsed since January 1st, 1970, at 00:00:00 UTC. While these timestamps are precise, they aren't user-friendly. As a result, you'll convert them into the more human-readable [ISO format](https://en.wikipedia.org/wiki/ISO_8601).

At the time of writing, it isn't easy to do this with existing plugins. A better option is to use a Lua script to perform the conversion and reference it in the configuration file using the `lua` plugin.

Create the `convert_timestamp.lua` file:

```command
nano convert_timestamp.lua
```

Next, add the following code to convert the timestamp field from Unix timestamp to ISO format:

```text
[label fluent-bit-config/convert_timestamp.lua]
function append_converted_timestamp(tag, timestamp, record)
  new_record = record
  new_record["timestamp"] = os.date("!%Y-%m-%dT%TZ", record["timestamp"])
  return 2, timestamp, new_record
end
```

The `append_converted_timestamp()` function creates a new record and sets the `timestamp` field to the value returned by the `os.date()` method, configured to format dates into the ISO format.

Save and exit your file. Open the Fluent Bit configuration:

```command
nano fluent-bit.conf
```

Update the configuration to include the Lua script in the `[FILTER]` component:

```text
[label fluent-bit-config/fluent-bit.conf]
[SERVICE]
    Flush        1
    Daemon       off
    Log_Level    debug
    Parsers_File parser_json.conf

[INPUT]
    Name         tail
    Path         /var/log/logify/app.log
    Parser       json_parser
    Tag          filelogs

[FILTER]
    Name record_modifier
    Match filelogs
    Remove_key     emailAddress
    Record hostname ${HOSTNAME}

[highlight]
[FILTER]
    Name lua
    Match filelogs
    Script convert_timestamp.lua
    Call append_converted_timestamp
[/highlight]

[OUTPUT]
    Name         stdout
    format       json
    Match        filelogs
```

The `[FILTER]` component uses the `lua` plugin to modify log records dynamically. The `Script` parameter holds the path to the Lua script file. Meanwhile, the `Call` parameter specifies the function within the Lua script that will be invoked to perform the conversion.

Upon saving the file, start Fluent Bit using Docker:

```command
docker run --rm -v $(pwd):/fluent-bit/etc -v /var/log/logify:/var/log/logify fluent/fluent-bit:latest -c /fluent-bit/etc/fluent-bit.conf
```

Fluent Bit will yield output similar to the following:

```json
[output]
[{"date":1748596859.127608,"hostname":"c66e6671838f","level":30,"msg":"Operation finished","timestamp":"2025-05-30T09:20:59Z","pid":134450,"ssn":"407-01-2433","status":"200","ip":"127.0.0.1"}]
...
[{"date":1748596883.217429,"hostname":"c66e6671838f","level":30,"msg":"Initialized application","timestamp":"2025-05-30T09:21:23Z","pid":134450,"ssn":"407-01-2433","status":"200","ip":"127.0.0.1"}]
```

The `timestamp` field is now in a human-readable ISO format. This change will improve the readability of your logs to understand when they occur.

### Working with conditional statements in Fluent Bit

While Fluent Bit doesn't natively support conditional statements, you can achieve similar functionality by leveraging the [modify](https://docs.fluentbit.io/manual/pipeline/filters/modify) plugin. In this section, you'll learn how to check if the `status` field equals `200` and add an `is_successful` field set to `true` when this condition is met.

First, open your `fluent-bit.conf` configuration file:

```command
nano fluent-bit.conf
```

Inside the file, add the following `[FILTER]` component:

```text
[label fluent-bit-config/fluent-bit.conf]
[SERVICE]
    Flush        1
    Daemon       off
    Log_Level    debug
    Parsers_File parser_json.conf

[INPUT]
    Name         tail
    Path         /var/log/logify/app.log
    Parser       json_parser
    Tag          filelogs

[FILTER]
    Name record_modifier
    Match filelogs
    Remove_key     emailAddress
    Record hostname ${HOSTNAME}

[FILTER]
    Name lua
    Match filelogs
    Script convert_timestamp.lua
    Call append_converted_timestamp

[highlight]
[FILTER]
    Name modify
    Match filelogs
    Condition Key_Value_Equals status "200"
    Add is_successful true
[/highlight]

[OUTPUT]
    Name         stdout
    format       json
    Match        filelogs
```

The `modify` plugin provides the `Condition` parameter with a `Key_Value_Equals` option that checks if the `status` field value equals "200". If the condition is met, the `Add` option appends an `is_successful` field to the log event.

Save the configuration file and start Fluent Bit using Docker:

```command
docker run --rm -v $(pwd):/fluent-bit/etc -v /var/log/logify:/var/log/logify fluent/fluent-bit:latest -c /fluent-bit/etc/fluent-bit.conf
```

```json
[output]
[{"date":1748596931.384633,"level":30,"msg":"Connected to database","hostname":"4f92d2283096","pid":134450,"ssn":"407-01-2433","timestamp":"2025-05-30T09:22:11Z","ip":"127.0.0.1","status":"200","is_successful":"true"}]
...
[{"date":1748596943.436222,"level":30,"msg":"Task completed successfully","hostname":"4f92d2283096","pid":134450,"ssn":"407-01-2433","timestamp":"2025-05-30T09:22:23Z","ip":"127.0.0.1","status":"200","is_successful":"true"}]
```

You will now see the `is_successful` field, indicating the outcomes where the `status` field equals `200`.

### Masking sensitive data with Fluent Bit

In the earlier steps, you successfully removed the `emailAddress` from the log records, yet sensitive fields like IP addresses and Social Security Numbers remain. For personal information safety in the logs, it's crucial to mask this data. This becomes especially pertinent when sensitive details are part of a field that can't be entirely removed.

While many built-in plugins redact entire value fields, using a Lua script is the best solution since you can easily specify and selectively mask specific data portions.

Create a `redact.lua` script with your text editor:

```command
nano redact.lua
```

Add the following code to the `redact.lua` script:

```text
[label fluent-bit-config/redact.lua]
-- Function to redact SSNs and IP addresses in any field
function redact_sensitive_portions(record)
    local redacted_record = {}  -- Initialize a new table for the redacted record

    for key, value in pairs(record) do
        local redacted_value = value  -- Initialize redacted_value with the original value

        -- Redact SSNs
        redacted_value, _ = string.gsub(redacted_value, '%d%d%d%-%d%d%-%d%d%d%d', 'REDACTED')

        -- Redact IP addresses
        redacted_value, _ = string.gsub(redacted_value, '%d+%.%d+%.%d+%.%d+', 'REDACTED')

        redacted_record[key] = redacted_value  -- Add the redacted value to the new table
    end

    return redacted_record
end

-- Entry point for Fluent Bit filter
function filter(tag, timestamp, record)
    local redacted_record = redact_sensitive_portions(record)
    return 1, timestamp, redacted_record
end

-- Return the filter object
return {
    filter = filter
}
```

In this code snippet, the `redact_sensitive_portions()` function iterates through each field, using the `string.gsub()` method to locate and replace IP addresses and Social Security Numbers with the text "REDACTED".

The `filter()` function acts as the entry point. It calls the `redact_sensitive_portions` function to mask sensitive portions within the log record. After processing, the modified record is returned through the `filter` object.

Now, open your Fluent Bit configuration file:

```command
nano fluent-bit.conf
```

Add the `[FILTER]` component to reference the `redact.lua` script:

```text
[label fluent-bit-config/fluent-bit.conf]
[SERVICE]
    Flush        1
    Daemon       off
    Log_Level    debug
    Parsers_File parser_json.conf

[INPUT]
    Name         tail
    Path         /var/log/logify/app.log
    Parser       json_parser
    Tag          filelogs

[FILTER]
    Name record_modifier
    Match filelogs
    Remove_key     emailAddress
    Record hostname ${HOSTNAME}

[FILTER]
    Name lua
    Match filelogs
    Script convert_timestamp.lua
    Call append_converted_timestamp

[FILTER]
    Name modify
    Match filelogs
    Condition Key_Value_Equals status "200"
    Add is_successful true

[highlight]
[FILTER]
    Name lua
    Match filelogs
    Script redact.lua
    Call filter
[/highlight]

[OUTPUT]
    Name         stdout
    format       json
    Match        filelogs
```

The `[FILTER]` component references the `redact.lua` file, and the `CALL` parameter invokes the `filter` function as the entry point.

When you are done, start Fluent Bit using Docker:

```command
docker run --rm -v $(pwd):/fluent-bit/etc -v /var/log/logify:/var/log/logify fluent/fluent-bit:latest -c /fluent-bit/etc/fluent-bit.conf
```

```json
[output]
[{"date":1748597021.737611,"hostname":"99364cec02ec","ip":"REDACTED","status":"200","level":"30","msg":"Connected to database","pid":"134450","is_successful":"true","timestamp":"2025-05-30T09:23:41Z","ssn":"REDACTED"}]
...
[{"date":1748597030.778092,"hostname":"99364cec02ec","ip":"REDACTED","status":"200","level":"30","msg":"Initialized application","pid":"134450","is_successful":"true","timestamp":"2025-05-30T09:23:50Z","ssn":"REDACTED"}]
```

The IP address and SSN have now been masked. In scenarios where a field contains both the IP address and SSN like this:

```json
[output]
{..., "privateInfo": "This is a sample message with SSN: 123-45-6789 and IP: 192.168.0.1"}
```

Fluent Bit will redact the sensitive portions only:

```text
[output]
{...,privateInfo":"This is a sample message with SSN: REDACTED and IP: REDACTED"}
```

Let's now stop the `logify.sh`. To do that, you will need program's process ID:

```command
jobs -l | grep "logify"
```

```text
[output]
[1]+ 134450 Running                 ./logify.sh &  (wd: ~/log-processing-stack/logify)
```

Then, terminate the program with the `kill` command and ensure the process ID has been substituted.

```command
kill -9 <134450>
```

Now that you can mask sensitive portions, you can move on to collecting logs from docker containers.

## Collecting logs from Docker containers and centralizing logs

In this section, you'll containerize the Bash program and use an [Nginx hello world Docker image](https://hub.docker.com/r/betterstackcommunity/nginx-helloworld), which has been preconfigured to generate JSON Nginx logs upon each incoming request. Subsequently, you will deploy a Fluent Bit container to collect logs from Bash and Nginx containers and forward them to [Better Stack](https://betterstack.com/) for centralization.

### Dockerizing the Bash script

Containerization lets you encapsulate the script and its dependencies, which makes it portable across different environments.

To containerize the Bash program, navigate back to the `logify` directory:

```command
cd ../logify
```

Create a `Dockerfile`, which will contain instructions on how to build the image:

```command
nano Dockerfile
```

In your `Dockerfile`, add the following lines of code:

```text
[label log-processing-stack/logify/Dockerfile]
FROM ubuntu:latest

COPY . .

RUN chmod +x logify.sh

RUN mkdir -p /var/log/logify

RUN ln -sf /dev/stdout /var/log/logify/app.log

CMD ["./logify.sh"]
```

In this `Dockerfile`, you start with the recent version of Ubuntu as the base image. You then copy the script into the container, make it executable, and create a directory where the application will write the logs. You then redirect all the log data written to `/var/log/logify/app.log` to the standard output. And finally, you specify the command to run when the container starts.

Now, move into the parent project directory:

```command
cd ..
```

Create a `docker-compose.yml` file to orchestrate multiple containers:

```command
nano docker-compose.yml
```

First, let's start with a basic configuration that includes just the logify service and Fluent Bit. This progressive approach ensures you can verify the first source works before adding others:

```text
[label log-processing-stack/docker-compose.yml]
services:
  logify-script:
    build:
      context: ./logify
    container_name: logify
    logging:
      driver: "fluentd"
      options:
        tag: docker.logify
        fluentd-address: 127.0.0.1:24224
    depends_on:
      - fluent-bit
    links:
      - fluent-bit

  fluent-bit:
    image: fluent/fluent-bit:latest
    volumes:
      - ./fluent-bit-config:/fluent-bit/etc
      - /var/run/docker.sock:/var/run/docker.sock
    command: ["fluent-bit", "-c", "/fluent-bit/etc/fluent-bit.conf"]
    container_name: fluent-bit
    ports:
      - "24224:24224"
```

In this configuration, the `logify-script` service is linked to the `fluent-bit` service and depends on it. The service is configured to use the `fluentd` driver for logging, and the `fluentd-address` specifies the address to which Docker will send the logs. The tag `docker.logify` helps identify the source of the Docker logs.

The `fluent-bit` service uses the pre-built [`fluent/fluent-bit`](https://hub.docker.com/r/fluent/fluent-bit) image and incorporates volume mappings for Fluent Bit's configuration files. The `command` parameter specifies the execution of `fluent-bit.conf` when the container starts. Additionally, port `24224` is exposed to receive logs from other containers.

Now, update the Fluent Bit configuration to handle Docker logs. Navigate to the `fluent-bit-config` directory:

```command
cd fluent-bit-config
```

Create a new configuration file for Docker log collection:

```command
nano fluent-bit.conf
```

Replace the existing configuration with the following:

```text
[label log-processing-stack/fluent-bit-config/fluent-bit.conf]
[SERVICE]
    HTTP_Server  On
    HTTP_Listen  0.0.0.0
    HTTP_PORT    2020
    Health_Check On
    HC_Errors_Count 5
    HC_Retry_Failure_Count 5
    HC_Period 5

[INPUT]
    Name        forward
    Listen      0.0.0.0
    Port        24224

[OUTPUT]
    Name         stdout
    Match        docker.logify
    format       json
```

This configuration uses the `forward` plugin to receive logs sent by Docker containers through port `24224`. For now, we're outputting to stdout to verify the setup works.

Navigate back to the project root and build the containers:

```command
cd ..
```

```command
docker compose up -d
```

Check that the containers are running:

```command
docker compose ps
```

You should see both containers running:

```text
[output]
NAME         IMAGE                                COMMAND                  SERVICE         CREATED         STATUS         PORTS
fluent-bit   fluent/fluent-bit:latest             "/fluent-bit/bin/flu…"   fluent-bit      9 seconds ago   Up 9 seconds   2020/tcp, 0.0.0.0:24224->24224/tcp, [::]:24224->24224/tcp
logify       log-processing-stack-logify-script   "./logify.sh"            logify-script   9 seconds ago   Up 8 seconds
```

View the Fluent Bit logs to see if it's collecting the logify container logs:

```command
docker compose logs fluent-bit
```

You should see logs from the logify container being processed by Fluent Bit:

```text
[output]
fluent-bit  | [{"date":1748597844.0,"container_id":"dc9535d28c625e35b7bbfd7425bbcf7edfca98b2a704e1ea8798031c44456776","container_name":"/logify","source":"stdout","log":"{\"status\": \"200\", \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Initialized application\", \"pid\": 1, \"ssn\": \"407-01-2433\", \"timestamp\": 1748597844}"}]
fluent-bit  | [{"date":1748597847.0,"container_id":"dc9535d28c625e35b7bbfd7425bbcf7edfca98b2a704e1ea8798031c44456776","container_name":"/logify","source":"stdout","log":"{\"status\": \"200\", \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Operation finished\", \"pid\": 1, \"ssn\": \"407-01-2433\", \"timestamp\": 1748597847}"}]
```

### Centralizing logs to Better Stack

Now that you've verified the basic setup works, let's centralize the logs to Better Stack.


If you want the simplest path, watch the quick walkthrough below. It shows how to set up a Better Stack collector and start shipping logs from a Docker or Kubernetes environment in minutes, with sensible defaults for batching, compression, and sampling:


<iframe width="100%" height="315" src="https://www.youtube.com/embed/_pv2tKoBnGo" title="Ship logs to Better Stack with the collector" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


If you prefer to keep using your existing Fluent Bit pipeline, skip the video and follow the step by step instructions in this section.

First, create a free [Better Stack account](https://telemetry.betterstack.com/users/sign-up). When you are logged in, visit the **Sources** section:

![Screenshot pointing to the **Sources** link](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/84a7ceaa-e302-4357-7bc2-79c6ecdc5a00/md1x =3024x1530)

Create a new source by clicking **Connect source**. Give it a clear name, like **"Logify App Logs"**, and select **Docker** as the platform. Then scroll down and click **Connect Source** to finish setup:

![Screenshot indicating the **Connect source** button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3617558f-4813-4d66-1082-42ba3a1fca00/md1x =3024x3384)

Once the source is created, copy both the **Source Token** and **Ingesting Host** fields to the clipboard:

![Screenshot with an arrow pointing to the "Source Token" field](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8adf65d1-e79a-4039-af20-3b5aca82c100/lg1x =3024x1530)

If you want a quick overview of how sources work in Better Stack, watch the short video below.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/_V81nd6P1iI" title="Better Stack sources overview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


Update the Fluent Bit configuration to send logs to Better Stack. Open the configuration file:

```command
cd fluent-bit-config
```

```command
nano fluent-bit.conf
```

Update the `[OUTPUT]` section:

```text
[label log-processing-stack/fluent-bit-config/fluent-bit.conf]
[SERVICE]
    HTTP_Server  On
    HTTP_Listen  0.0.0.0
    HTTP_PORT    2020
    Health_Check On
    HC_Errors_Count 5
    HC_Retry_Failure_Count 5
    HC_Period 5

[INPUT]
    Name        forward
    Listen      0.0.0.0
    Port        24224

[highlight]
[OUTPUT]
    name    http
    match   docker.logify
    tls     On
    host    <your_ingesting_host>
    port    443
    uri     /fluentbit
    header  Authorization Bearer <your_logify_source_token>
    header  Content-Type application/msgpack
    format  msgpack
    retry_limit 5
[/highlight]
```

Replace `<your_logify_source_token>` with the source token and `<your_ingesting_host>` with the ingesting host you copied from Better Stack. You can find both values in your source configuration.

Restart the services:

```command
cd ..
```

```command
docker compose down
```

```command
docker compose up -d
```

Once the fluent bit container is running, head back to the Better Stack source page and scroll to the **Verify data collection** section. After a short wait, you should see a **Logs received!** message—this confirms that logs from your Bash script container are being delivered to Better Stack:

![Logs received in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/aa4ecb9e-65eb-4518-5d0c-189d06e5c700/lg2x =3024x2527)

Check Better Stack to verify that the log entries are being successfully delivered. You should see the log entries uploading to Better Stack's interface in the live tail view:

![Screenshot displaying the log entries uploading to Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ba050eff-5604-4552-acc0-901fe204b100/md1x =3024x1530)

Select any log entry to see more detailed information and metadata:

![Screenshot of a log entry expanded in Better Stack, showing detailed metadata such as timestamp, container name, and log message content](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a87f7070-ae9d-40f5-6ca0-b08b7feb9900/orig =3024x1530)

If you want a quick tour of Live Tail and how to drill into individual log events, watch the walkthrough below:
<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="Better Stack Live Tail walkthrough" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>



### Adding Nginx container logs

Now that the first source is working correctly, let's add the Nginx container. First, create a new source for Nginx logs on Better Stack following the same steps as before, but name it "Nginx logs" and select "Fluent-bit" as the platform.

After creating the Nginx source, copy its source token and update the `docker-compose.yml` file to include the Nginx service:

```command
nano docker-compose.yml
```

Add the Nginx service to your configuration:

```text
[label log-processing-stack/docker-compose.yml]
version: '3'
services:
  logify-script:
    build:
      context: ./logify
    container_name: logify
    logging:
      driver: "fluentd"
      options:
        tag: docker.logify
        fluentd-address: 127.0.0.1:24224
    depends_on:
      - fluent-bit
    links:
      - fluent-bit

[highlight]
  nginx:
    image: betterstackcommunity/nginx-helloworld:latest
    container_name: nginx
    ports:
      - '80:80'
    logging:
      driver: "fluentd"
      options:
        tag: docker.nginx
        fluentd-address: 127.0.0.1:24224
    depends_on:
      - fluent-bit
    links:
      - fluent-bit
[/highlight]

  fluent-bit:
    image: fluent/fluent-bit:latest
    volumes:
      - ./fluent-bit-config:/fluent-bit/etc
      - /var/run/docker.sock:/var/run/docker.sock
    command: ["fluent-bit", "-c", "/fluent-bit/etc/fluent-bit.conf"]
    container_name: fluent-bit
    ports:
      - "2020:2020"
      - "24224:24224"
```

Now update the Fluent Bit configuration to handle both sources:

```command
cd fluent-bit-config
```

```command
nano fluent-bit.conf
```

Add a separate output for Nginx logs:

```text
[label log-processing-stack/fluent-bit-config/fluent-bit.conf]
[SERVICE]
    HTTP_Server  On
    HTTP_Listen  0.0.0.0
    HTTP_PORT    2020
    Health_Check On
    HC_Errors_Count 5
    HC_Retry_Failure_Count 5
    HC_Period 5

[INPUT]
    Name        forward
    Listen      0.0.0.0
    Port        24224

[OUTPUT]
    name    http
    match   docker.logify
    tls     On
    host    in.logs.betterstack.com
    port    443
    uri     /
    header  Authorization Bearer <your_logify_source_token>
    header  Content-Type application/msgpack
    format  msgpack
    retry_limit 5

[highlight]
[OUTPUT]
    name    http
    match   docker.nginx
    tls     On
    host    <your_ingesting_host>
    port    443
    uri     /fluentbit
    header  Authorization Bearer <your_nginx_source_token>
    header  Content-Type application/msgpack
    format  msgpack
    retry_limit 5
[/highlight]
```

Replace `<your_nginx_source_token>` with the Nginx source token and `<your_ingesting_host>` with the ingesting host from Better Stack.

Restart all services:

```command
cd ..
```

```command
docker compose down
```

```command
docker compose up -d
```

Generate some Nginx logs by sending HTTP requests:

```command
curl http://localhost:80/?[1-5]
```

The Nginx logs will be uploaded to Better Stack:

![Screenshot of Nginx logs delivered to Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4dbe8de1-f9cc-435c-8af0-0fca6573c300/md1x =3024x1530)

## Monitoring Fluent Bit health with Better Stack

Fluent Bit provides a `health` endpoint that allows you to monitor Fluent Bit's health using external tools like Better Stack. The health endpoint is already enabled in your configuration through the `[SERVICE]` section:

```text
[SERVICE]
    HTTP_Server  On
    HTTP_Listen  0.0.0.0
    HTTP_PORT    2020
    Health_Check On
    HC_Errors_Count 5
    HC_Retry_Failure_Count 5
    HC_Period 5
```

These configurations instruct Fluent Bit to start listening for requests on port `2020` to check its health status. Port `2020` is already exposed in your Docker Compose configuration.

Next, update the `docker-compose.yml` file to expose the port that hosts the health endpoint:

```text
[label log-processing-stack/docker-compose.yml]
    container_name: fluent-bit
    ports:
[highlight]
      - "2020:2020"
[/highlight]
      - "24224:24224"
```

Now, start the Fluent Bit service with the updated changes:

```command
docker compose up -d
```

Verify the health endpoint is functioning:

```command
curl -s http://127.0.0.1:2020/api/v1/health
```

```text
[output]
ok
```


If you prefer the quickest path, watch the short walkthrough below. It shows how to create an Uptime monitor for a health check endpoint:

<iframe width="560" height="315" src="https://www.youtube.com/embed/wRwS3-trbOo" title="Monitor a health check endpoint with Better Stack" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Next, log in to [Better Stack](https://uptime.betterstack.com/). On the **Monitors** page, click the **Create monitor** button:

![Screenshot of the monitors page, providing an option to create a monitor](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/59437b3d-ef9e-48e8-2fe5-70a68454b800/md2x =3024x1530)



Then, select the suitable triggering option in Better Stack, your preferred notification preferences and input your server's IP address or domain name, followed by the `/api/v1/health` endpoint on port `2020`. After that, click the **Create monitor** button:

![Screenshot of Better Stack configured with the necessary options](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1b5d37c8-e091-4d3c-141d-b0664fc50600/lg1x =3024x2380)

Upon completion, Better Stack will regularly monitor Fluent Bit's health endpoint:

![Screenshot of Better Stack monitoring `health` endpoint](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7b2d8a46-911f-40d8-264b-b891a1314500/md2x =3024x2856)

Let's see what happens when Fluent Bit malfunctions. Halt all services using the command:

```command
docker compose stop
```

After a brief interval, check Better Stack. The status will transition to "Down":

![Screenshot of Better Stack indicating that the health endpoint doesn't work](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c9074124-718d-4b3d-7f23-ec0e24599200/md2x =3024x2856)

When there is an outage, Better Stack will promptly notify you. An email alert will be dispatched detailing the downtime, allowing you to proactively manage Fluent Bit's health and swiftly address the problem:

![Screenshot of the email alert from Better Stack notifying of the endpoint's downtime](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/be285d35-3df2-4802-080b-5379d819c400/lg1x =2078x1280)

With these tools, you can proactively manage Fluent Bit's health and swiftly respond to operational interruptions.


[summary]

## Side note: Visualize and explore your logs in Better Stack

Once your logs are flowing, you can go beyond search and use Better Stack to visualize patterns over time. 

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Final thoughts

In this comprehensive article, you learned how Fluent Bit can be integrated with Docker, Nginx, and Better Stack for managing logs using a containerized approach. You started by running Fluent Bit in Docker containers to read logs from files and display them in the output. You then employed Fluent Bit to collect logs from multiple Docker containers and centralize them on Better Stack using a progressive setup that verified each source before adding others. Finally, you set up a `health` endpoint to monitor Fluent Bit's health using Better Stack.

You can now effectively manage logs on your system using Fluent Bit running in Docker containers. To delve deeper into Fluent Bit's capabilities, consult the [documentation](https://docs.fluentbit.io/). Fluent Bit offers powerful features such as SQL stream processing, which you can explore further [here](https://docs.fluentbit.io/manual/stream-processing/introduction). Additionally, to hone your skills in Docker and Docker Compose, refer to their respective documentation pages: [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose). To gain insights into Docker logging, consult our [comprehensive guide](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/).

Thanks for reading, and happy logging!