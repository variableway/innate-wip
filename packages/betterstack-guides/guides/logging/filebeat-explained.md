# How to Collect, Process, and Ship Log Data with Filebeat

Managing logs has become necessary in the ever-evolving landscape of modern computing. Operating systems, applications, and databases produce logs, which are invaluable for understanding system behavior, troubleshooting issues, and ensuring uninterrupted operations. To simplify the complex task of handling these logs, it becomes crucial to centralize the logs. This involves using a [log shipper](https://betterstack.com/community/guides/logging/log-shippers-explained/) to collect and forward the logs to a central location.

Enter [Filebeat](https://www.elastic.co/beats/filebeat), a powerful log shipper designed to streamline collecting, processing, and forwarding logs from diverse sources to various destinations. Developed with efficiency in mind, Filebeat ensures that managing logs is seamless and reliable. Its lightweight nature and ability to handle significant volumes of data make it a preferred choice among developers and system administrators.

In this comprehensive guide, you will explore the capabilities of Filebeat in depth using Docker containers. Starting with the basics, you'll set up Filebeat to collect logs from various sources. You'll then delve into the intricacies of processing these logs efficiently, gathering logs from Docker containers and forwarding them to different destinations for analysis and monitoring.

## Prerequisites

Before you begin, ensure you have access to a system with a non-root user account with `sudo` privileges. Additionally, ensure that you have [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your system. If you're new to the concept of log shippers and their significance, take a moment to explore their advantages by reading [this informative article](https://betterstack.com/community/guides/logging/log-shippers-explained/).

With these prerequisites in place, create a dedicated project directory:

```command
mkdir log-processing-stack
```

Navigate to the newly created directory:

```command
cd log-processing-stack
```

Create a subdirectory for the demo application and move into the directory:

```command
mkdir logify && cd logify
```

With these steps completed, you can create the demo logging application in the next section.

[ad-logs]

## Developing a demo logging application

In this section, you'll build a basic logging application using the [Bash](<https://en.wikipedia.org/wiki/Bash_(Unix_shell)>) scripting language. The application will generate logs at regular intervals, simulating a real-world scenario where applications produce log data.

In the `logify` directory, create a `logify.sh` file using your preferred text editor:

```command
nano logify.sh
```

In your `logify.sh` file, add the following code to generate logs:

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
    local log='{"status": '$http_status_code', "ip": "'$ip_address'", "level": '$level', "emailAddress": "'$emailAddress'", "msg": "'$random_message'", "pid": '$pid', "ssn": "'$ssn'", "timestamp": '$time'}'
    echo "$log"
}

while true; do
    log_record=$(create_log_entry)
    echo "${log_record}" >> "${filepath}"
    sleep 3
done
```

The `create_log_entry()` function generates log records in JSON format, encompassing essential details like severity level, message, HTTP status code, and other crucial fields. In addition, it includes sensitive fields, such as email address, Social Security Number(SSN), and IP address, which have been deliberately included to demonstrate Filebeat ability to mask sensitive data in fields.

Next, the program enters an infinite loop that repeatedly invokes the `create_log_entry()` function and writes the logs to a specified file in the `/var/log/logify` directory.

After you finish adding the code, save the changes and make the script executable:

```command
chmod +x logify.sh
```

Afterward, create the `/var/log/logify` directory to store your application logs:

```command
sudo mkdir -p /var/log/logify
```

Next, assign ownership of the `/var/log/logify` directory to the currently logged-in user using the `$USER` environment variable:

```command
sudo chown -R $USER:$USER /var/log/logify/
```

Run the `logify.sh` script in the background:

```command
./logify.sh &
```

The `&` symbol at the end of the command instructs the script to run in the background, allowing you to continue using the terminal for other tasks while the logging application runs independently.

When the program starts, it will display output that looks like this:

```text
[output]
[1] 513579
```

Here, `513579` represents the process ID, which can be used to terminate the script later if needed.

To view the contents of the `app.log` file, you can use the `tail` command:

```command
tail -n 4 /var/log/logify/app.log
```

This command displays the last 4 log entries in the `app.log` file in JSON format:

```json
[output]
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Task completed successfully", "pid": 513579, "ssn": "407-01-2433", "timestamp": 1749023382}
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Connected to database", "pid": 169516, "ssn": "407-01-2433", "timestamp": 1749023382}
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Operation finished", "pid": 513579, "ssn": "407-01-2433", "timestamp": 1749023385}
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Connected to database", "pid": 169516, "ssn": "407-01-2433", "timestamp": 1749023385}
```

You have now successfully created a logging application that generates sample log entries.

## Setting up Filebeat with Docker

Instead of installing Filebeat directly on the system, we'll use the official Docker image. This approach provides better isolation, easier management, and consistent behavior across different environments.

First,  Go back to `log-processing-stack` directory and create a directory structure for Filebeat configurations: 

```command
cd .. 
```
```command
mkdir filebeat-config
```

The official Filebeat Docker image is available from the **Elastic Docker registry** at `docker.elastic.co/beats/filebeat`, not from Docker Hub. You can find a list of all published Docker images and tags at [www.docker.elastic.co](https://www.docker.elastic.co).

To pull the latest Filebeat Docker image:

```command
docker pull docker.elastic.co/beats/filebeat:9.0.1
```

For the absolute latest version, you can check the [Elastic Docker registry](https://www.docker.elastic.co) for the most recent tag. As of this writing, version 9.0.1 is the latest.

You can verify the Filebeat version:

```command
docker run --rm docker.elastic.co/beats/filebeat:9.0.1 filebeat version
```

If successful, the output will resemble:

```text
[output]
filebeat version 9.0.1 (amd64), libbeat 9.0.1 [bce373f7dcd56a5575ad2c0ec40159722607e801 built 2025-04-29 23:44:32 +0000 UTC]
```

Now that Docker can run Filebeat, let's explore how it works.

## How Filebeat works

Before you start using Filebeat, it's crucial to understand how it works. In this section, we'll explore its essential components and processes, ensuring you have a solid foundation before diving into practical usage:

![Diagram showing how filebeat works](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/72b3b602-cfb6-4b36-7a99-0eddc405cd00/lg2x)

Understanding how Filebeat works mainly involves familiarizing yourself with the following components:

- **Harvesters**: harvesters are responsible for reading the contents of a file line by line. A harvester is initiated for each file when Filebeat is configured to monitor specific log files. These harvesters not only read the log data but also manage opening and closing files. By reading files incrementally, line by line, harvesters ensure that newly appended log data is efficiently collected and forwarded for processing.

- **Inputs**: inputs serve as the bridge between harvesters and the data sources. They are responsible for managing the harvesters and locating all the sources from which Filebeat needs to read log data. Inputs can be configured for various sources, such as log files, containers, or system logs. Users can specify which files or locations Filebeat should monitor by defining inputs.

After Filebeat reads the log data, the log events are transformed or enriched with data. And then finally sent to the specified destinations.

To put into practice, you can specify this behavior in a configuration file:

```text
filebeat.inputs:
  . . .
processors:
  . . .
output.plugin_name:
   . . .
```

Let's now look into each section in detail:

- `filebeat.inputs`: the input sources that a Filebeat instance should monitor.
- `processors`: enrich, modify, or filter data before it's sent to the output.
- `output.plugin_name`: the output destination where Filebeat should forward the log data.

Each of these directives requires you to specify a plugin that carries out its respective task.

Now, let's explore some inputs, processors, and outputs that can be used with Filebeat.

### Filebeat input plugins
Filebeat provides a range of [inputs](https://www.elastic.co/guide/en/beats/filebeat/current/configuration-filebeat-options.html#filebeat-input-types) plugins, each tailored to collect log data from specific sources:

- [container](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-input-container.html):
  collect [container logs](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/).
- [filestream](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-input-filestream.html#filebeat-input-filestream):
  actively reads lines from log files.
- [syslog](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-input-syslog.html):
  fetches log entries from Syslog.
- [httpjson](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-input-httpjson.html):
  read log messages from a RESTful API.

### Filebeat output plugins

Filebeat provides a variety of [outputs](https://www.elastic.co/guide/en/beats/filebeat/current/configuring-output.html) plugins, enabling you to send your collected log data to diverse destinations:

- [File](https://www.elastic.co/guide/en/beats/filebeat/current/file-output.html):
  writes log events to files.
- [Elasticsearch](https://www.elastic.co/guide/en/beats/filebeat/current/elasticsearch-output.html):
  enables Filebeat to forward logs to Elasticsearch using its HTTP API.
- [Kafka](https://www.elastic.co/guide/en/beats/filebeat/current/kafka-output.html):
  delivers log records to Apache Kafka.
- [Logstash](https://www.elastic.co/guide/en/beats/filebeat/current/logstash-output.html):
 sends logs directly to Logstash.

### Filebeat modules plugins
Filebeat streamlines log processing through its [modules](https://www.elastic.co/guide/en/beats/filebeat/current/configuration-filebeat-modules.html), providing pre-configured setups designed for specific log formats. These modules enable you to effortlessly ingest, parse, and enrich log data without requiring extensive manual configuration. Here are a few available [modules](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-modules.html) that can significantly simplify your log processing workflow:

- [Logstash](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-module-logstash.html).
- [AWS](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-module-aws.html).
- [PostgreSQL](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-module-postgresql.html).
- [Nginx](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-module-nginx.html).
- [RabbitMQ](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-module-rabbitmq.html#filebeat-module-rabbitmq).
- [HAproxy](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-module-haproxy.html).

## Getting started with Filebeat using Docker
Now that you understand the workings of Filebeat, let's configure it to read log entries from a file and display them on the console using Docker.

First, create the Filebeat configuration file in the `filebeat-config` directory:

```command
cd filebeat-config
```

```command
nano filebeat.yml
```

Add the following configuration:

```text
[label filebeat-config/filebeat.yml]
filebeat.inputs:
- type: filestream
  id: logify-logs
  paths:
    - /var/log/logify/app.log

output.console:
  pretty: true
```
In the `filebeat.inputs` section, you specify that Filebeat should read logs from a file using the `filestream` plugin. The `paths` parameter indicates the path to the log file that Filebeat will monitor, set here as `/var/log/logify/app.log`. The `id` field is required for filestream inputs and must be unique.

The `output.console` section sends the collected log data to the console. The `pretty: true` parameter ensures that log entries are presented in a readable and well-structured format when shown on the console.

Once you've added these configurations, save the file. 

Before executing Filebeat, you need to set the correct file permissions. Filebeat requires that configuration files are only writable by the owner:


```command
chmod 600 filebeat.yml
```

Before executing Filebeat, it's essential to verify the configuration file syntax to identify and rectify any errors using Docker:

```command
docker run --rm \
  -v $(pwd)/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro \
  docker.elastic.co/beats/filebeat:9.0.1 \
  filebeat test config
```

If the configuration file is correct, you should see the following output:

```text
[output]
Config OK
```

Now, run Filebeat using Docker with the standalone approach:

```command
docker run --rm \
  -v $(pwd)/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro \
  -v /var/log/logify:/var/log/logify:ro \
  --name filebeat-basic \
  docker.elastic.co/beats/filebeat:9.0.1
```

The command above:
- `--rm`: Removes the container when it stops
- `-v $(pwd)/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro`: Mounts the configuration file as read-only
- `-v /var/log/logify:/var/log/logify:ro`: Mounts the log directory as read-only
- `--name filebeat-basic`: Names the container for easy reference

As Filebeat starts running, it will display log entries similar to the following:

```text
[output]
...
{
  "@timestamp": "2025-06-04T07:52:54.769Z",
  "@metadata": {
    "beat": "filebeat",
    "type": "_doc",
    "version": "9.0.1"
  },
  "log": {
    "offset": 779629,
    "file": {
      "path": "/var/log/logify/app.log",
      "device_id": "2049",
      "inode": "259470",
      "fingerprint": "337d323bb6858c439b81fec30abaccc82f8576477737a881801695d2ad617b1f"
    }
  },
  "message": "{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Task completed successfully\", \"pid\": 169516, \"ssn\": \"407-01-2433\", \"timestamp\": 1748878010}",
  "input": {
    "type": "filestream"
  },
  "ecs": {
    "version": "8.0.0"
  },
  "host": {
    "name": "645301c4e5a2"
  },
  "agent": {
    "id": "c9c201f5-b93b-4719-976e-23eebfbbc91e",
    "name": "645301c4e5a2",
    "type": "filebeat",
    "version": "9.0.1",
    "ephemeral_id": "714a7298-45e8-4f57-bc8e-6426bf1a7d7d"
  }
}
...
```

Filebeat now displays log messages in the console. The log events from the Bash script are under the `message` field, and Filebeat has added additional fields to provide context. You can now stop Filebeat by pressing `CTRL + C`.

Having successfully configured Filebeat to read and forward logs to the console, the next section will focus on data transformation.

## Transforming logs with Filebeat 

When Filebeat collects data, you can process it before sending it to the output. You can enrich it with new fields, parse the data, and remove or redact sensitive fields to ensure data privacy.

In this section, you'll transform the logs in the following ways:

- Parsing JSON logs.
- Removing unwanted fields.
- Adding new fields.
- Masking sensitive data.

### Parsing JSON logs with Filebeat

As the demo logging application generates logs in JSON format, it's essential to parse them correctly for structured analysis.

Let's examine an example log event from the previous section:

```text
[output]
{
  ...
  "message": "{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Task completed successfully\", \"pid\": 169516, \"ssn\": \"407-01-2433\", \"timestamp\": 1748878010}",
  "input": {
    "type": "filestream"
  },
  ...
}
```

In the `message` field, double quotes surround the log event, and many fields are escaped with backslashes. This is not valid JSON; the `message` field contents have been converted to a string.

To parse the log event as valid JSON, update the configuration file:

```command
nano filebeat.yml
```

Update the configuration to add JSON parsing:

```text
[label filebeat-config/filebeat.yml]
filebeat.inputs:
- type: filestream
  id: logify-logs
  paths:
    - /var/log/logify/app.log

[highlight]
processors:
  - decode_json_fields:
      fields: ["message"]
      target: ""
[/highlight]

output.console:
  pretty: true
```
In the snippet above, you configure a `decode_json_fields` processor to decode JSON-encoded data in each log entry's `message` field and attach it to the log event.

Run Filebeat with the updated configuration:

```command
docker run --rm \
  -v $(pwd)/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro \
  -v /var/log/logify:/var/log/logify:ro \
  --name filebeat-json \
  docker.elastic.co/beats/filebeat:9.0.1
```

```text
[output]
{
  "@timestamp": "2025-06-04T07:55:03.658Z",
  "@metadata": {
    "beat": "filebeat",
    "type": "_doc",
    "version": "9.0.1"
  },
  "pid": 169516,
  "ssn": "407-01-2433",
  "log": {
    "offset": 699725,
    "file": {
      "path": "/var/log/logify/app.log",
      "device_id": "2049",
      "inode": "259470",
      "fingerprint": "337d323bb6858c439b81fec30abaccc82f8576477737a881801695d2ad617b1f"
    }
  },
  "message": "{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Task completed successfully\", \"pid\": 169516, \"ssn\": \"407-01-2433\", \"timestamp\": 1748876646}",
  "input": {
    "type": "filestream"
  },
  "ecs": {
    "version": "8.0.0"
  },
  "host": {
    "name": "deffe2f97ae8"
  },
  "agent": {
    "name": "deffe2f97ae8",
    "type": "filebeat",
    "version": "9.0.1",
    "ephemeral_id": "354e0fef-db29-48bf-b9fc-96a3bf5d011b",
    "id": "28d7a11c-5619-44b6-a094-6b59bb9c2313"
  },
[highlight]
  "timestamp": 1748876646,
  "ip": "127.0.0.1",
  "msg": "Task completed successfully",
  "status": 200,
  "level": 30,
  "emailAddress": "user@mail.com"
[/highlight]
}
...
```

In the output, you will see that all properties in the `message` field, such as `msg`, `ip`, etc., have been added to the log event. 

Now that you can parse JSON logs, you will modify attributes on a log event.

### Adding and removing fields with Filebeat

The log event contains a [sensitive](https://betterstack.com/community/guides/logging/sensitive-data/) `emailAddress` field that needs to be protected. In this section, you'll remove the `emailAddress` field and add a new field to the log event to provide more context.

Update the configuration file:

```command
nano filebeat.yml
```

Update the configuration to add field manipulation:

```text
[label filebeat-config/filebeat.yml]
filebeat.inputs:
- type: filestream
  id: logify-logs
  paths:
    - /var/log/logify/app.log

processors:
  - decode_json_fields:
      fields: ["message"]
      target: ""
[highlight]
  - drop_fields:
      fields: ["emailAddress", "message"]  

  - add_fields:
      fields:
        env: "development"  # Add a new 'env' field set to "development"
[/highlight]
output.console:
  pretty: true
```
To modify the log event, you add the `drop_fields` processor, which has a `field` option that takes a list of fields to be removed, including the sensitive `emailAddress` field and the `message` field. You remove the `message` field because after parsing the data, properties from the `message` field were incorporated into the log event, rendering the original `message` field obsolete.

After writing the code, run the configuration:

```command
docker run --rm \
  -v $(pwd)/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro \
  -v /var/log/logify:/var/log/logify:ro \
  --name filebeat-transform \
  docker.elastic.co/beats/filebeat:9.0.1
```

Upon running Filebeat, you will notice that the `emailAddress` field has been successfully removed, and a new `env` field has been added to the log event:

```json
[output]
d
{
  ....
  "agent": {
    "version": "9.0.1",
    "ephemeral_id": "875d13fe-aa4e-491f-84c7-94ac2ff3378d",
    "id": "525d8aa6-26f4-46cf-9941-ed9dc7c849e6",
    "name": "1f1af5b9fc53",
    "type": "filebeat"
  },
  "ssn": "407-01-2433",
  "level": 30,
  "pid": 169516,
  "log": {
    "offset": 658520,
    "file": {
      "path": "/var/log/logify/app.log",
      "device_id": "2049",
      "inode": "259470",
      "fingerprint": "337d323bb6858c439b81fec30abaccc82f8576477737a881801695d2ad617b1f"
    }
  },
  "input": {
    "type": "filestream"
  },
  "timestamp": 1748875942,
  "status": 200,
  "ip": "127.0.0.1",
  "fields": {
[highlight]
    "env": "development"
[/highlight]
  },
  "msg": "Operation finished"
}
...
```
Now that you can enrich and remove unwanted fields, you will work with conditional statements next.

### Working with conditional statements in Filebeat
Filebeat allows you to check a condition and add a field when it evaluates to true. In this section, you will check if the `status` value equals `200`, and if the condition is met, you will add an `is_successful` field to the log event.

Update the configuration file:

```command
nano filebeat.yml
```

Add conditional field processing:

```text
[label filebeat-config/filebeat.yml]
filebeat.inputs:
- type: filestream
  id: logify-logs
  paths:
    - /var/log/logify/app.log

processors:
  - decode_json_fields:
      fields: ["message"]
      target: ""
  - drop_fields:
      fields: ["emailAddress", "message"]  # Remove the 'emailAddress' field

  - add_fields:
      fields:
        env: "development"  # Add a new 'env' field set to "development"
[highlight]
  - add_fields:
      when:
        equals:
          status: 200
      target: ""
      fields:
        is_successful: true
[/highlight]

output.console:
  pretty: true
```

The `when` option checks if the `status` field value equals `200`. If true, the `is_successful` field is added to the log event.

Now, run the configuration:



```command
docker run --rm \
  -v $(pwd)/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro \
  -v /var/log/logify:/var/log/logify:ro \
  --name filebeat-conditional \
  docker.elastic.co/beats/filebeat:9.0.1
```

Filebeat will yield output that looks closely to this:

```json
[output]
{
  ...
  "host": {
    "name": "a3bc504aa467"
  },
  "ssn": "407-01-2433",
[highlight]
  "is_successful": true,
[/highlight]
  "input": {
    "type": "filestream"
  },
  "status": 200,
  "ip": "127.0.0.1"
}
...
```

In the output, the `is_successful` field has been added to the log entries with an HTTP status code of 200.

That takes care of adding a new field based on a condition.

### Redacting sensitive data with Filebeat

Earlier in the article, you removed the `emailAddress` field to ensure data privacy. However, sensitive fields such as IP addresses and Social Security Numbers (SSN) remain in the log event. Moreover, sensitive data can be inadvertently added to log events by other developers within an organization. Redacting data that match specific patterns allows you to mask any sensitive information without needing to remove entire fields, ensuring the message's significance is preserved.

Update the configuration file to add sensitive data redaction:

```command
nano filebeat.yml
```

Add the following configuration:

```text
[label filebeat-config/filebeat.yml]
filebeat.inputs:
- type: filestream
  id: logify-logs
  paths:
    - /var/log/logify/app.log

processors:
[highlight]
  - script:
      lang: javascript
      id: redact-sensitive-info
      source: |
        function process(event) {
            // Redact SSNs (e.g., 123-45-6789) from the "message" field
            event.Put("message", event.Get("message").replace(/\d{3}-\d{2}-\d{4}/g, "[REDACTED-SSN]"));

            // Redact IP addresses (e.g., 192.168.1.1) from the "message" field
            event.Put("message", event.Get("message").replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "[REDACTED-IP]"));
        }
[/highlight]
  - decode_json_fields:
      fields: ["message"]
      target: ""
  - drop_fields:
      fields: ["emailAddress"]  # Remove the 'emailAddress' field

  - add_fields:
      fields:
        env: "development"  # Add a new 'env' field set to "development"
  - add_fields:
      when:
        equals:
          status: 200
      target: ""
      fields:
        is_successful: true

output.console:
  pretty: true
```
In the added code, you define a script written in JavaScript that redacts sensitive information from a log event. The script uses regular expressions to identify SSNs and IP addresses, replacing them with `[REDACTED-SSN]` and `[REDACTED-IP]`, respectively.

Next, run the configuration:


```command
docker run --rm \
  -v $(pwd)/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro \
  -v /var/log/logify:/var/log/logify:ro \
  --name filebeat-redact \
  docker.elastic.co/beats/filebeat:9.0.1
```

```json
[output]
...
{
  "@timestamp": "2025-06-04T08:13:18.496Z", 
   "@metadata": {
    "beat": "filebeat",
    "type": "_doc",
    "version": "9.0.1"
  },
  "fields": {
    "env": "development"
  },
  "input": {
    "type": "filestream"
  },
[highlight]
  "ip": "[REDACTED-IP]",
[/highlight]
  "status": 200,
  "msg": "Operation finished",
  "pid": 169516,
  "timestamp": 1748871122,
  "log": {
    "file": {
      "path": "/var/log/logify/app.log",
      "device_id": "2049",
      "inode": "259470",
      "fingerprint": "337d323bb6858c439b81fec30abaccc82f8576477737a881801695d2ad617b1f"
    },
    "offset": 376373
  },
  "ecs": {
    "version": "8.0.0"
  },
  "host": {
    "name": "6079c3618796"
  },
  "agent": {
    "type": "filebeat",
    "version": "9.0.1",
    "ephemeral_id": "4e8cea1f-bd78-4068-b016-1b8e36e768af",
    "id": "a4a5b3a4-ac08-4488-aac0-a0251c0d4ec7",
    "name": "6079c3618796"
  },
  "level": 30,
  "is_successful": true,
[highlight]
  "ssn": "[REDACTED-SSN]"
[/highlight]
}
...
```

The log events in the output will now have the IP address and SSN fields redacted.

In scenarios where you have a field like the following:

```json
[output]
{..., "privateInfo": "This is a sample message with SSN: 123-45-6789 and IP: 192.168.0.1"}
```

After processing with Filebeat, only the sensitive portions will be removed, and the log event will appear as follows:

```text
[output]
{..., "privateInfo": "This is a sample message with SSN: [REDACTED-SSN] and IP: [REDACTED-IP]"}
```
The sensitive portions have now been redacted, and the context of the log message remains intact.

You can now stop the running Docker container by pressing `CTRL + C` and stop the `logify.sh` program.

To stop the bash script, obtain the process ID:

```command
jobs -l | grep "logify"
```
```text
[output]
[1]+ 513579 Running                 ./logify.sh &  (wd: ~/log-processing-stack/logify)
```
Substitute the process ID in the `kill` command:

```command
kill -9 513579
```
The program will now be terminated.

Having successfully redacted sensitive fields, you can now collect logs from Docker containers using Filebeat and centralize them for further analysis and monitoring.

## Collecting logs from Docker containers and centralizing logs

In this section, you will containerize the Bash script and use the [Nginx hello world Docker image](https://hub.docker.com/r/betterstackcommunity/nginx-helloworld), preconfigured to generate JSON Nginx logs for each incoming request. Subsequently, you will create a Filebeat container to gather logs from both containers and centralize them to [Better Stack](https://betterstack.com/) for analysis.

### Dockerizing the Bash script
In this section, you'll containerize the Bash script that generates log data. This step allows you to encapsulate the script and its dependencies.

Navigate back to the logify directory and create a `Dockerfile`:

```command
cd ../logify
```
```command
nano Dockerfile
```
In your `Dockerfile`, add the following code:

```text
[label log-processing-stack/logify/Dockerfile]
FROM ubuntu:latest

COPY . .

RUN chmod +x logify.sh

RUN mkdir -p /var/log/logify

RUN ln -sf /dev/stdout /var/log/logify/app.log

CMD ["./logify.sh"]
```
In the first line, the latest version of Ubuntu is specified as the base image. Next, the script is copied into the container, made executable, and a directory to store log files is created. Subsequently, any data written to `/var/log/logify/app.log` is redirected to the standard output so that it can be viewed using the `docker logs` command. Finally, you specify the command to run when the container is first launched.

Save and exit the file after making these changes. Then, change into the parent project directory:

```command
cd ..
```

Next, create a `docker-compose.yml` file to define the services and volumes for your Docker containers:

```command
nano docker-compose.yml
```
Define the Bash script and Nginx services:

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

In this Docker Compose file, you define two services: `logify-script` and `nginx`. The `logify-script` service is built from the `./logify` directory context, creating an image tagged as `logify:latest`. The `nginx` service uses the latest version of the [nginx-helloworld image](https://hub.docker.com/r/betterstackcommunity/nginx-helloworld) and the `json-file` logging driver for logging purposes. Additionally, port `80` on the host is mapped to port `80` within the container. Ensure no other services use port `80` to prevent conflicts. 

To build the `logify-script` service image and start the containers for each defined service, use the following command:

```command
docker compose up -d
```

The `-d` option puts the services in the background.

Now, check if the services are running:

```command
docker compose ps
```

You should see a "running" status under the "STATUS" column for both containers, which should look like this:

```text
[output]
NAME      IMAGE                                          COMMAND              SERVICE         CREATED          STATUS          PORTS
logify    logify:latest                                  "./logify.sh"        logify-script   26 seconds ago   Up 26 seconds
nginx     betterstackcommunity/nginx-helloworld:latest   "/runner.sh nginx"   nginx           26 seconds ago   Up 26 seconds   0.0.0.0:80->80/tcp, [::]:80->80/tcp
```

With the containers running, use the `curl` command to send HTTP requests to the Nginx service:

```command
curl http://localhost:80/?[1-5]
```

View all the logs from both containers with the following command:

```command
docker compose logs
```

```json
[output]
nginx  | {"timestamp":"2025-06-04T08:17:18+00:00","pid":"8","remote_addr":"172.18.0.1","remote_user":"","request":"GET /?1 HTTP/1.1","status": "200","body_bytes_sent":"11109","request_time":"0.000","http_referrer":"","http_user_agent":"curl/8.5.0","time_taken_ms":"1749025038.755"}
...
logify  | {"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Connected to database", "pid": 1, "ssn": "407-01-2433", "timestamp": 1749025042}
```

The output displays logs produced from both containers.

Now that the Bash script and Nginx services are running and generating logs, you can collect and centralize these logs using Filebeat.

### Setting up Better Stack source

Before configuring Filebeat to forward logs, let's set up Better Stack to receive them.

Start by creating a free [Better Stack account](https://telemetry.betterstack.com). Once you've logged in, navigate to the **Sources** section and click the **Connect source** button:

![Screenshot indicating the **Connect source** button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/84a7ceaa-e302-4357-7bc2-79c6ecdc5a00/md1x =3024x1530)


Give the source a meaningful name like *"Logify App Logs"*, select **Docker** as the platform, scroll to the bottom, and click **Connect Source**:

![Screenshot of the Better Stack interface with the name field filled as "Logify logs" and the Platform set to "Docker"](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/09ec7a83-6a54-444a-5f86-03f08006cc00/md2x =3024x3384)

After creating the source, you'll receive a **source token** (e.g., `qU73jvQjZrNFHimZo4miLdxF`) and an **ingestion host** (e.g., `s1315908.eu-nbg-2.betterstackdata.com`).
Save both—these are required when setting up log forwarding in your Filebeat config:

![Screenshot of Better Stack page with an arrow pointing to the "Source Token"  and "injection host" fields](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1056ee4e-00e5-4c16-b0b7-91b030a2ca00/lg2x =3024x1530)


Keep the token and injection host safe as you'll need them for the Filebeat configuration.

Now you'll configure Filebeat to collect logs from the logify container. Update the `filebeat.yml` configuration file to collect logs from Docker containers:

```command
cd filebeat-config
```
```command
nano filebeat.yml
```

Replace the existing configuration with the following, replacing `<your_source_token>` with your actual source token and `<your_ingestion_host>` with your ingestion host:

```text
[label filebeat-config/filebeat.yml]
filebeat.autodiscover:
  providers:
    - type: docker
      labels.dedot: true
      templates:
        - condition:
            contains:
              docker.container.image: "logify"
          config:
            - type: filestream
              id: container-${data.docker.container.id}
              prospector.scanner.symlinks: true
              parsers:
                - container: ~
              paths:
                - /var/lib/docker/containers/${data.docker.container.id}/*.log
              processors:
                - decode_json_fields:
                    fields: ["message"]
                    target: ""

output.elasticsearch:
  hosts: 'https://<your_ingestion_host>:443'
  path: '/elastic'
  headers:
    X-Better-Stack-Source-Token: '<your_source_token>'
```

In this configuration, you set up Filebeat's automatic log discovery to collect logs from Docker containers whose image names contain the substring `logify`. This corresponds to the container defined under the `logify-script` service. Filebeat uses the `container` input to read Docker logs specified under paths. Additionally, a processor is added to decode JSON fields.


Now, add the Filebeat service to your `docker-compose.yml` file:

```command
cd ..
```
```command
nano docker-compose.yml
```

Update the file to include the Filebeat service:

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
  filebeat-logify:
    image: docker.elastic.co/beats/filebeat:9.0.1
    container_name: filebeat-logify
    user: root
    command:
      - "-e"
      - "--strict.perms=false"
    volumes:
      - ./filebeat-config/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sockock
[/highlight]
```

In this updated configuration, the `filebeat-logify` service uses the official Filebeat Docker image, with the user set to `root`. The Filebeat configuration is mounted from the `filebeat-config` directory.

Start the Filebeat service:

```command
docker compose up -d
```

Check that all services are running:

```command
docker compose ps
```

Wait a bit, then revisit Better Stack to verify that Filebeat is forwarding logs. The source should now read “Logs received!”. After that, click **Live tail** to view your logs in real time:


![Better Stack dashboard showing a log source with the status 'Logs received!' and the 'Live tail' button highlighted for real-time log viewing."](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9de92b0b-59ec-4566-ccea-0e9938dc3300/md1x =3024x2548)

Navigate to your "Logify logs" source and you should see logs appearing in the live tail:

![Screenshot displaying the log entries in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ae2dc202-2fff-4aed-4ab5-c3e60423f200/lg2x =3024x1532)

The logs should show the processed JSON data from your logify application, confirming that Filebeat is successfully collecting and forwarding the logs.

### Adding Nginx logs

Now that you have successfully forwarded the Bash script logs, it's time to add Nginx service logs as well. First, create an additional source named "Nginx logs" in Better Stack by following the same steps you did previously. Make sure to copy both the **source token** and **ingestion host** to a safe place.

Now you'll need to create a separate Filebeat configuration and service to handle Nginx logs. Create a new configuration file:

```command
cd filebeat-config
```
```command
nano filebeat-nginx.yml
```

Add the following configuration, replacing `<your_nginx_source_token>` with your actual nginx source token and `<your_nginx_ingestion_host>` with your nginx ingestion host:

```text
[label filebeat-config/filebeat-nginx.yml]
filebeat.autodiscover:
  providers:
    - type: docker
      labels.dedot: true
      templates:
        - condition:
            contains:
              docker.container.image: "betterstackcommunity/nginx-helloworld"
          config:
            - type: filestream
              id: container-${data.docker.container.id}
              prospector.scanner.symlinks: true
              parsers:
                - container: ~
              paths:
                - /var/lib/docker/containers/${data.docker.container.id}/*.log
              processors:
                - decode_json_fields:
                    fields: ["message"]
                    target: ""

output.elasticsearch:
  hosts: 'https://<your_nginx_ingestion_host>:443'
  path: '/elastic'
  headers:
    X-Better-Stack-Source-Token: '<your_nginx_source_token>'
```


Now add the nginx Filebeat service to your `docker-compose.yml`:

```command
cd ..
```
```command
nano docker-compose.yml
```

Add the nginx Filebeat service:

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

  filebeat-logify:
    image: docker.elastic.co/beats/filebeat:9.0.1
    container_name: filebeat-logify
    user: root
    command:
      - "-e"
      - "--strict.perms=false"
    volumes:
      - ./filebeat-config/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock

[highlight]
  filebeat-nginx:
    image: docker.elastic.co/beats/filebeat:9.0.1
    container_name: filebeat-nginx
    user: root
    command:
      - "-e"
      - "--strict.perms=false"
    volumes:
      - ./filebeat-config/filebeat-nginx.yml:/usr/share/filebeat/filebeat.yml:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock
[/highlight]
```

Start the services:

```command
docker compose up -d
```

Send a few requests to the Nginx service to generate logs:

```command
curl http://localhost:80/?[1-5]
```

Now go back to Better Stack to confirm that the "Nginx logs" source is receiving the logs. Navigate to your "Nginx logs" source and your source will update to show "Logs received!". Click **Live tail** to view your logs in real-time:

![Screenshot of Nginx logs in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6acc179e-00e5-46de-ec1b-22dfaf540500/orig =3024x1532)

Click on any log entry to expand it and view more detailed information:

![Viewing expanded log details in Better Stack after selecting a single log entry.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2faabb7c-dcad-467b-028f-a498d244bf00/lg2x =3024x1532)

Both sources should now be receiving their respective logs, demonstrating successful log centralization with separate sources for different container types.

## Monitoring Filebeat health with Better Stack

Filebeat doesn't have a built-in `/health` endpoint for external monitoring of its instance's health. However, you can configure an endpoint for metrics. Doing so allows you to externally monitor Filebeat to determine whether it's up or down. In this tutorial, you will enable the HTTP endpoint for the `filebeat-logify` service. 

Open the `filebeat.yml` configuration file:

```command
cd filebeat-config
```
```command
nano filebeat.yml
```

Add the following lines at the top of the file:

```text
[label filebeat-config/filebeat.yml]
[highlight]
http.enabled: true
http.host: 0.0.0.0
http.port: 5066
[/highlight]

filebeat.autodiscover:
  providers:
  ...

output.elasticsearch:
  hosts: 'https://s1332781.eu-nbg-2.betterstackdata.com:443'
  path: '/elastic'
  headers:
    X-Better-Stack-Source-Token: 'T3jWxnJJowffDjDkriV5siJK'
```
The metric endpoint will be enabled and exposed on port `5066`.

Next, update the Docker Compose file to map port `5066` between the host and the container:

```command
cd ..
```
```command
nano docker-compose.yml
```

Update the `filebeat-logify` service to expose the metrics port:

```text
[label log-processing-stack/docker-compose.yml]
  filebeat-logify:
    image: docker.elastic.co/beats/filebeat:9.0.1
    container_name: filebeat-logify
    user: root
  [highlight]
    ports:
      - "5066:5066"
[/highlight]
    command:
      - "-e"
      - "--strict.perms=false"
    volumes:
      - ./filebeat-config/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock
```

Restart the Filebeat service to apply the changes:

```command
docker compose up -d
```

Verify that the Filebeat metrics endpoint is functioning properly:

```command
curl -XGET 'localhost:5066/?pretty'
```

```json
[output]
{
  "beat": "filebeat",
  "binary_arch": "amd64",
  "build_commit": "bce373f7dcd56a5575ad2c0ec40159722607e801",
  "build_time": "2025-04-29T23:44:32.000Z",
  "elastic_licensed": true,
  "ephemeral_id": "5828abd5-8591-48d5-9d3a-15b6281cd504",
  "gid": "0",
  "hostname": "6fc86bf74515",
  "name": "6fc86bf74515",
  "uid": "0",
  "username": "root",
  "uuid": "61654154-4353-478e-88ac-3556aa7f7dd5",
  "version": "9.0.1"
}
```

Next, sign into [Better Stack](https://uptime.betterstack.com/) uptime monitoring.

On the **Monitors** page, click the **Create monitor** button:

![Screenshot of the monitors page, providing an option to create a monitor](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/59437b3d-ef9e-48e8-2fe5-70a68454b800/md2x =3024x1530)


Choose the preferred method to trigger Better Stack, provide your server's IP address or domain name on port `5066`, and click the **Create monitor** button:

![Screenshot of Better Stack configured with the necessary options](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/878f016c-3ec7-4e4a-4442-fbd106d17b00/lg1x =3024x2380)

Better Stack will start monitoring the Filebeat endpoint and provide performance insights:

![Screenshot of Better Stack monitoring the REST API endpoint](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3da2cb09-3227-46de-2943-d33861d4d100/orig =3024x2856)

Now, let's observe how Better Stack responds when Filebeat stops working by stopping all the services:

```command
docker compose stop
```

After some time has passed, return to Better Stack to observe that the status has been updated to "Down":

![Screenshot of Better Stack indicating that the endpoint is down](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e5212e92-77f9-4da9-3696-d0464bda0000/public =3024x2856)

If you configured Better Stack to send you an email, check your email inbox. You will receive an email alert:

![Screenshot showing the email Alert that Better Stack sent](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e33b7441-ce60-4303-cd6c-8733530d7600/md2x =1912x1280)

That takes care of monitoring Filebeat using Better Stack.

## Final thoughts

In this tutorial, you learned how to use Filebeat with Docker to integrate with Docker containers, Nginx, and Better Stack to manage logs. You started by reading logs from a file and displaying them in a console using Docker containers. Then, you explored various ways to transform log messages using Docker-based Filebeat configurations. After that, you collected logs from multiple Docker containers and forwarded them to Better Stack. Finally, you monitored Filebeat's health using Better Stack and received alerts in case of issues.

As a next step, refer to the [Filebeat documentation](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-installation-configuration.html) for more in-depth information. To learn more about Docker and Docker Compose, explore their respective documentation pages: [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose). To enhance your Docker logging knowledge, check out our [comprehensive guide](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/).

Apart from Filebeat, there are other log shippers available that you can explore. Check out the [log shippers guide](https://betterstack.com/community/guides/logging/log-shippers-explained/) to learn about them.

Thanks for reading, and happy logging!