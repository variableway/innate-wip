# How to Collect, Process, and Ship Log Data with Fluentd

In today's complex computing environments, operating systems, applications, and databases generate logs crucial for understanding system behavior, diagnosing issues, and ensuring smooth operations. Centralizing these logs simplifies error analysis and troubleshooting. To achieve this centralization, you need a [log shipper](https://betterstack.com/community/guides/logging/log-shippers-explained/)—a tool designed to collect logs from multiple sources, process  and forward them to a centralized location for analysis. 

[Fluentd](https://www.fluentd.org/) is a robust, open-source log shipper developed by Treasure Data. It excels at capturing logs from various sources, unifying them for processing, and forwarding them to multiple destinations for analysis and monitoring. Fluentd distinguishes itself with its lightweight memory footprint, consuming as little as 30-40MB of memory. Its pluggable architecture empowers the community to extend its capabilities through plugins, which currently boasts a library of over 1000 plugins. Additionally, Fluentd implements buffering mechanisms to prevent data loss and can handle substantial data volumes. Currently, Fluentd is being used by over 5000 companies, and the documentation claims that the largest user is collecting logs from more than 50,000 servers.

In this comprehensive guide, you'll use Fluentd in Docker containers to collect, process, and forward logs to various destinations. To begin, you'll create a sample application that generates logs to a file. Next, you'll use Fluentd to read the logs from the file and redirect them to the console. As you progress, you'll transform logs, collect them from containerized environments, and centralize log data. Lastly, you'll monitor Fluentd's health to ensure it operates without issues. 

<iframe width="100%" height="315" src="https://www.youtube.com/embed/ephdg9usWyc?si=E1hM5qOWhdFH2ezo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Prerequisites

Before you begin, ensure you have access to a system with a non-root user account with `sudo` privileges. You should install [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) on your system. If you're not familiar with log shippers, you can explore their benefits by reading [this article](https://betterstack.com/community/guides/logging/log-shippers-explained/).

With these prerequisites in place, create a root project directory using the following command:

```command
mkdir log-processing-stack
```

Navigate to the newly created directory:

```command
cd log-processing-stack
```

Inside this project directory, create a subdirectory for the demo application and move into the directory:

```command
mkdir logify && cd logify
```

Now you're ready to proceed with creating the demo logging application.

[ad-logs]

## Developing a demo logging application

In this section, you'll create a sample logging application with [Bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) that generates logs at regular intervals. 

In the `logify` directory, create a Bash script file named `logify.sh` using your preferred text editor:

```command
nano logify.sh
```

 In your `logify.sh` file, add the following contents to create the application:

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

The `create_log_entry()` function creates log entries in JSON format, containing details such as the HTTP status code, IP address, severity level, a random log message, and a timestamp. The sensitive fields like the IP address, Social Security Number(SSN), and email address have been intentionally added to demonstrate Fluentd's capability to filter out sensitive information later. For logging best practices, consult [this guide](https://betterstack.com/community/guides/logging/sensitive-data/).

Following this, you establish an infinite loop that continuously invokes the `create_log_entry()` function to generate log entries and append them to an `app.log` file in the `/var/log/logify/` directory.

Once you're finished, save your modifications and make the script executable:

```command
chmod +x logify.sh
```

Afterward, create the `/var/log/logify` directory that will contain the application logs:

```command
sudo mkdir /var/log/logify
```

Change the ownership of the `/var/log/logify` directory to the user specified in the $USER environment variable, which represents the currently logged-in user:

```command
sudo chown -R $USER:$USER /var/log/logify/
```

Now,  run the script in the background:

```command
./logify.sh &
```
The `&` puts the running script in the background. 

When the program starts, it will display output that looks like this:

```text
[output]
[1] 124134
```
`124134` is the process ID, which can be used to terminate the script later.

To view the contents of the `app.log` file,  type the `tail` command:

```command
tail -n 4 /var/log/logify/app.log
```

```json
[output]
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Task completed successfully", "pid": 124134, "ssn": "407-01-2433", "timestamp": 1748586917}
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Operation finished", "pid": 124134, "ssn": "407-01-2433", "timestamp": 1748586920}
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Initialized application", "pid": 124134, "ssn": "407-01-2433", "timestamp": 1748586923}
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Task completed successfully", "pid": 124134, "ssn": "407-01-2433", "timestamp": 1748586926}
```

You have now successfully created a logging application that produces sample log entries.

## Setting up Fluentd with Docker

Now that you can generate logs with the demo app, let's set up Fluentd using Docker. Using Docker provides several advantages: consistent environment, easier deployment, and simplified dependency management.

First, navigate back to the root project directory:

```command
cd ..
```

Create a directory for Fluentd configuration files:

```command
mkdir fluentd-config
```

We'll use the official [Fluentd Docker image](https://hub.docker.com/r/fluent/fluentd/) which comes pre-configured with essential plugins and a lightweight footprint.

To verify that Docker is properly installed and running, check the version:

```command
docker --version
```

You should see output similar to:

```text
[output]
Docker version 28.1.1, build 4eba377
```

That’s all we need for now. We’ll revisit this directory shortly when we begin creating the Fluentd configuration files.

## How Fluentd works

With Docker ready, let's explore how Fluentd works before diving into the configuration.

![Diagram illustrating the Fluentd observability pipeline](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7f9a7b07-58b5-47ac-7683-a05131749d00/md1x=892x560)

To understand Fluentd, you need to visualize it as a pipeline. Fluentd captures logs from multiple sources at one end of the pipeline and transforms them into a standardized log event format. As these log events traverse through the Fluentd pipeline, they can be processed, enriched, or filtered according to your requirements. Finally, at the end of the pipeline, Fluentd can efficiently forward these log events to various destinations for in-depth analysis.

To implement this concept, you can configure Fluentd by defining the log sources, transformations, and destinations in a configuration file. When running Fluentd in Docker, this configuration file will be mounted into the container.

The configuration file is structured using the following directives:

```text
<source>
  ....
</source>

<filter unique.id>
   ...
</filter>

<match unique.id>
   ...
</match>
```

Let's explore these directives in detail:

- `<source>...</source`: specifies the log source from which Fluentd should collect logs.
- `<filter>...</filter>`: defines transformations or modifications to log events.
- `<match>...</match>`: the destination where Fluentd should forward the processed logs.

Each of these directives requires you to specify a plugin that carries out its respective task.

### Fluentd input plugins

For the `<source>` directive, you can choose from a variety of [input plugins](https://docs.fluentd.org/input) that suit your needs:

- [`in_tail`](https://docs.fluentd.org/input/tail/): read log events from the end of a file.
- [`in_syslog`](https://docs.fluentd.org/input/syslog): collects logs from the Syslog protocol through UDP or TCP.
- [`in_http`](https://docs.fluentd.org/input/http): provides log events through a REST endpoint.
- [`in_exec`](https://docs.fluentd.org/input/exec): executes external programs and retrieves event logs from them.

### Fluentd filter plugins

When it comes to processing or filtering the data, Fluentd offers a range of [filter plugins](https://docs.fluentd.org/filter/) to cater to your specific requirements:

- [`filter_record_transformer`](https://docs.fluentd.org/filter/record_transformer): modifies log events.
- [`grep`](https://docs.fluentd.org/filter/grep): filters log events that match a specified pattern, similar to the `grep` command.
- [`geoip`](https://docs.fluentd.org/filter/geoip): adds geographic information to log events.
- [`parser`](https://docs.fluentd.org/filter/parser): parses event logs.

### Fluentd output plugins

To forward logs to various destinations, Fluentd provides a variety of [output plugins](https://docs.fluentd.org/output#list-of-output-plugins) to choose from:

- [`out_file`](https://docs.fluentd.org/output/file): writes log events to files.
- [`out_opensearch`](https://docs.fluentd.org/output/opensearch): delivers log events to Opensearch.
- [`out_http`](https://docs.fluentd.org/output/http): uses HTTP/HTTPS to write log records.
- [`roundrobin`](https://docs.fluentd.org/output/roundrobin): distributes log entries to multiple outputs in a round-robin fashion.

In the next section, we will demonstrate how to use the [`in_tail`](https://docs.fluentd.org/input/tail/) plugin to read log events from a file and send the log entries to the console using the [`stdout`](https://docs.fluentd.org/output/stdout) plugin.

## Getting started with Fluentd 

Now that you understand how Fluentd works, let's create a configuration file instructing Fluentd to read log entries from a file and display them in the console.

Create a Fluentd configuration file in the `fluentd-config` directory:

```command
nano fluentd-config/fluent.conf
```

Add the following lines of code to create your first Fluentd configuration:

```text
[label fluentd-config/fluent.conf]
<source>
  @type tail
  path /var/log/logify/app.log
  pos_file /tmp/fluentd-file.log.pos
  tag file.logs
  format none
</source>

<match file.logs>
  @type stdout
</match>
```

The `<source>` directive reads log events from the end of a file. The `@type` option specifies the plugin to use, which is the `tail` plugin here. The `path` option defines the file's path to be read. The `pos_file` option specifies a file that Fluentd will use to keep track of its position when reading the file. Lastly, the `tag` option provides a unique name for this directive, which the `<filter>` or `<match>` directives can reference.

The `<match file.logs>` directive defines a matching rule that tells Fluentd how to handle data with a specific tag, which in this case is `file.logs`. To send these logs to the console, you set the `type` to the `stdout` plugin.

After making the changes, save the file.

Before running Fluentd, it's a good practice to validate your configuration file for errors. You can do this with Docker by running a dry-run:

```command
docker run --rm -v $(pwd)/fluentd-config:/fluentd/etc -v /var/log:/var/log fluent/fluentd:latest -c /fluentd/etc/fluent.conf --dry-run
```

```text
[output]
2025-05-30 06:42:05 +0000 [info]: init supervisor logger path=nil rotate_age=nil rotate_size=nil
2025-05-30 06:42:05 +0000 [info]: parsing config file is succeeded path="/fluentd/etc/fluent.conf"
2025-05-30 06:42:05 +0000 [info]: gem 'fluentd' version '1.18.0'
2025-05-30 06:42:05 +0000 [info]: starting fluentd-1.18.0 as dry run mode ruby="3.2.8"
2025-05-30 06:42:05 +0000 [info]: using configuration file: <ROOT>
  <source>
    @type tail
    path "/var/log/logify/app.log"
    pos_file "/var/log/fluent/file.log.pos"
    tag "file.logs"
    format none
    <parse>
      @type none
      unmatched_lines
    </parse>
  </source>
  <match file.logs>
    @type stdout
  </match>
</ROOT>
2025-05-30 06:42:05 +0000 [info]: finished dry run mode
```

If no errors or issues are reported, the configuration file is ready for execution.

If you stopped your logging script earlier, move into the `logify` application subdirectory again:

```command
cd logify
```

Rerun the script in the background:

```command
./logify.sh &
```

Now navigate back to the project root and start Fluentd using Docker:

```command
cd ..
```

Create the Fluentd log directory and set proper permissions:

```command
sudo mkdir -p /var/log/fluent
```
```command
sudo chown -R $USER:$USER /var/log/fluent
```

Start Fluentd with Docker:

```command
docker run --rm -v $(pwd)/fluentd-config:/fluentd/etc -v /var/log:/var/log fluent/fluentd:latest -c /fluentd/etc/fluent.conf
```

The command breakdown:

- `--rm`: removes the container when it stops
- `-v $(pwd)/fluentd-config:/fluentd/etc`: mounts your configuration directory
- `-v /var/log:/var/log`: mounts the log directory so Fluentd can access your application logs
- `fluent/fluentd:latest`: uses the official Fluentd Docker image
- `-c /fluentd/etc/fluent.conf`: specifies the configuration file path inside the container

Once Fluentd is running, you will see output that resembles the following:

```text
[output]
...
2025-05-30 06:50:30 +0000 [info]: starting fluentd-1.18.0 pid=7 ruby="3.2.8"
2025-05-30 06:50:30 +0000 [info]: spawn command to main:  cmdline=["/usr/local/bin/ruby", "-Eascii-8bit:ascii-8bit", "/usr/local/bundle/bin/fluentd", "-c", "/fluentd/etc/fluent.conf", "--plugin", "/fluentd/plugins", "--under-supervisor"]
2025-05-30 06:50:31 +0000 [info]: #0 init worker0 logger path=nil rotate_age=nil rotate_size=nil
2025-05-30 06:50:31 +0000 [info]: adding match pattern="file.logs" type="stdout"
2025-05-30 06:50:31 +0000 [info]: adding source type="tail"
2025-05-30 06:50:31 +0000 [info]: #0 starting fluentd worker pid=16 ppid=7 worker=0
2025-05-30 06:50:31 +0000 [info]: #0 following tail of /var/log/logify/app.log
2025-05-30 06:50:31 +0000 [info]: #0 fluentd worker is now running worker=0
```

Following that, the log messages will appear:

```text
[output]
2025-05-30 06:51:29.959945549 +0000 file.logs: {"message":"{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Task completed successfully\", \"pid\": 124134, \"ssn\": \"407-01-2433\", \"timestamp\": 1748587889}"}
2025-05-30 06:51:30.291452283 +0000 file.logs: {"message":"{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Initialized application\", \"pid\": 125150, \"ssn\": \"407-01-2433\", \"timestamp\": 1748587890}"}
2025-05-30 06:51:32.972080525 +0000 file.logs: {"message":"{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Task completed successfully\", \"pid\": 124134, \"ssn\": \"407-01-2433\", \"timestamp\": 1748587892}"}
2025-05-30 06:51:33.301134577 +0000 file.logs: {"message":"{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Connected to database\", \"pid\": 125150, \"ssn\": \"407-01-2433\", \"timestamp\": 1748587893}"}
...
```

Fluentd is now displaying the log messages along with additional context. You can exit Fluentd by pressing `CTRL + C`.

With Fluentd configured to read logs from a file and display them in the console, you are now ready to explore log transformations in the next section.

## Transforming  logs with Fluentd

After Fluentd collects logs from various sources, processing and manipulating the records often becomes necessary. This process can involve transforming unstructured logs in plain text into structured formats, such as JSON or Logfmt, which are easier for machines to parse. Additionally, you may need to enrich the logs with crucial fields, remove unwanted data, or mask sensitive information to ensure privacy.

Fluentd provides a range of [filter](https://docs.fluentd.org/filter) plugins that allow you to manipulate the event streams. In this section, we will explore how to use these filter plugins to perform the following tasks:

- Parsing JSON logs.
- Removing unwanted fields.
- Adding new fields.
- Converting Unix timestamps to the ISO format.
- Maskng sensitive data.

### Parsing JSON logs with Fluentd

When working with logs in JSON format, it's essential to parse them correctly for structured analysis. In this section, you'll configure Fluentd to parse JSON logs effectively.

Let's begin by examining a log event from the output of the previous section:

```text
[output]
2025-05-30 06:51:29.959945549 +0000 file.logs: {"message":"{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Task completed successfully\", \"pid\": 124134, \"ssn\": \"407-01-2433\", \"timestamp\": 1748587889}"
}
```

You'll notice that the log message is enclosed in double quotes, and many of the double quotes within the JSON structure have been escaped with backslashes.

To ensure that Fluentd can work with these logs effectively and parse them as valid JSON, you need to add a `<parse>` section to your Fluentd directives. This section supports parser plugins and can be placed within the `<source>`, `<match>`, or `<filter>` directive.

Open the Fluentd configuration file:

```command
nano fluentd-config/fluent.conf
```

Next, add the `<parse>` section under the `<source>` directive to parse the JSON logs:

```text
[label fluentd-config/fluent.conf]
<source>
  @type tail
  path /var/log/logify/app.log
  pos_file /tmp/fluentd-file.log.pos
  tag file.logs
  format none
[highlight]
  <parse>
    @type json
  </parse>
[/highlight]
</source>

<match file.logs>
  @type stdout
</match>
```

The `@type` parameter within the `<parse>` section specifies that the `json` plugin should be used to parse the log events.

To ensure that Fluentd correctly parses the JSON logs, save your configuration changes and run Fluentd:

```command
docker run --rm -v $(pwd)/fluentd-config:/fluentd/etc -v /var/log:/var/log fluent/fluentd:latest -c /fluentd/etc/fluent.conf
```

Fluentd will collect the log events as they are generated. You will see output similar to this:

```text
[output]
2025-05-30 06:53:27.412729262 +0000 file.logs: {"status":200,"ip":"127.0.0.1","level":30,"emailAddress":"user@mail.com","msg":"Connected to database","pid":124134,"ssn":"407-01-2433","timestamp":1748588007}
2025-05-30 06:53:27.697872740 +0000 file.logs: {"status":200,"ip":"127.0.0.1","level":30,"emailAddress":"user@mail.com","msg":"Initialized application","pid":125150,"ssn":"407-01-2433","timestamp":1748588007}
2025-05-30 06:53:30.422330464 +0000 file.logs: {"status":200,"ip":"127.0.0.1","level":30,"emailAddress":"user@mail.com","msg":"Initialized application","pid":124134,"ssn":"407-01-2433","timestamp":1748588010}
2025-05-30 06:53:30.709683311 +0000 file.logs: {"status":200,"ip":"127.0.0.1","level":30,"emailAddress":"user@mail.com","msg":"Initialized application","pid":125150,"ssn":"407-01-2433","timestamp":1748588010}
...
```

In the output, the log events have been parsed successfully, and the properties are no longer escaped. If you closely look at the output, you will notice that Fluentd adds a timestamp and a tag name next to each JSON log event.

To remove this additional information, you can use the `<format>` section. Stop Fluentd again and open the configuration file:

```command
nano fluentd-config/fluent.conf
```

Add the following code under the `<match>` directive in your configuration file:

```text
[label fluentd-config/fluent.conf]
<source>
  @type tail
  path /var/log/logify/app.log
  pos_file /tmp/fluentd-file.log.pos
  tag file.logs
  format none
  <parse>
    @type json
  </parse>
</source>

<match file.logs>
  @type stdout
[highlight]
  <format>
  @type json
  </format>
[/highlight]
</match>
```

The `<format>` section formats the log entries, and the `@type` parameter specifies the `json` plugin used for formatting.

Save the changes and start Fluentd again:

```command
docker run --rm -v $(pwd)/fluentd-config:/fluentd/etc -v /var/log:/var/log fluent/fluentd:latest -c /fluentd/etc/fluent.conf
```

You will observe output similar to this:

```json
[output]
{"status":200,"ip":"127.0.0.1","level":30,"emailAddress":"user@mail.com","msg":"Connected to database","pid":124134,"ssn":"407-01-2433","timestamp":1748588109}
{"status":200,"ip":"127.0.0.1","level":30,"emailAddress":"user@mail.com","msg":"Connected to database","pid":125150,"ssn":"407-01-2433","timestamp":1748588110}
...
```

Notice that the output no longer includes timestamps. You can now stop Fluentd.

In this section, we've explored how to parse JSON logs using Fluentd. However, log records come in various formats, and Fluentd provides a range of [`<parser>`](https://docs.fluentd.org/configuration/parse-section) plugins to handle different log formats effectively:

- [`nginx`](https://docs.fluentd.org/parser/nginx): parses Nginx logs.
- [`csv`](https://docs.fluentd.org/parser/csv): parses log entries in CSV format.
- [`regexp`](https://docs.fluentd.org/parser/regexp): parses logs according to the given regex pattern.
- [`apache2`](https://docs.fluentd.org/parser/apache2): parses Apache2 log entries.

For the `<format>` section, Fluentd offers several built-in formatter plugins to customize the output format of log events:

- [`csv`](https://docs.fluentd.org/formatter/csv): outputs log events in the CSV format.
- [`ltsv`](https://docs.fluentd.org/formatter/ltsv): formats log events in the LTSV format.
- [`msgpack`](https://docs.fluentd.org/formatter/msgpack): converts logs to the Msgpack binary data format.

With these tools at your disposal, you can effectively parse and format logs in various formats to suit your specific needs. In the next section, we'll explore how to add and remove unwanted fields from log entries, providing you with even greater control over your log data.

### Adding and removing fields with Fluentd

In this section, you will enhance data privacy by removing [sensitive information](https://betterstack.com/community/guides/logging/sensitive-data/) from the log entries. Specifically, you'll remove the `emailAddress` field and add a new `hostname` field to the log events.

To achieve this, open your configuration file in your text editor:

```command
nano fluentd-config/fluent.conf
```
Make the following modifications within the source configuration:

```text
[label fluentd-config/fluent.conf]
<source>
  @type tail
  path /var/log/logify/app.log
  pos_file /var/log/fluent/file.log.pos
  tag file.logs
  format none
  <parse>
    @type json
  </parse>
</source>

[highlight]
<filter file.logs>
  @type record_transformer
  remove_keys emailAddress
  <record>
    hostname "#{Socket.gethostname}"
  </record>
</filter>
[/highlight]

<match file.logs>
  @type stdout
  <format>
  @type json
  </format>
</match>
```

The `<filter>` section is used to modify log records. The `@type` specifies that the [`record_transformer`](https://docs.fluentd.org/filter/record_transformer) plugin will transform log events. To remove a specific property, such as the `emailAddress` field, you use the `remove_keys` parameter. Additionally, you introduce a new `hostname` field using the `<record>` section, specifying both the field name and its value.

After making these changes, save the configuration file and restart Fluentd:

```command
docker run --rm -v $(pwd)/fluentd-config:/fluentd/etc -v /var/log:/var/log fluent/fluentd:latest -c /fluentd/etc/fluent.conf
```

With Fluentd running, you can now observe the updated log entries. These logs will no longer contain the `emailAddress` field, and a new `hostname` field will be present:

```json
[output]
{"status":200,"ip":"127.0.0.1","level":30,"msg":"Task completed successfully","pid":124134,"ssn":"407-01-2433","timestamp":1748588209,"hostname":"4480d35ca530"}
^C2025-05-30 06:56:49 +0000 [info]: Received graceful stop
{"status":200,"ip":"127.0.0.1","level":30,"msg":"Task completed successfully","pid":125150,"ssn":"407-01-2433","timestamp":1748588209,"hostname":"4480d35ca530"}
...
```

This modification ensures that sensitive data is excluded from the log entries while enriching them with relevant information like the `hostname`. You can now stop Fluentd and proceed to the next section to format dates.

### Formatting dates with Fluentd

The Bash script you've previously created generates logs with Unix timestamps, representing the number of seconds since January 1st, 1970, at 00:00:00 UTC. These timestamps can be challenging to read. So in this section, you'll convert them into a more human-readable format, precisely the [ISO format](https://en.wikipedia.org/wiki/ISO_8601).

To perform this conversion, open your configuration file:

```command
nano fluentd-config/fluent.conf
```

Add the following lines to your file:
 
```text
[label fluentd-config/fluent.conf]
...
<filter file.logs>
  @type record_transformer
[highlight]
  enable_ruby true
[/highlight]
  remove_keys emailAddress
  <record>
    hostname "#{Socket.gethostname}"
[highlight]
    timestamp ${Time.at(record["timestamp"]).strftime("%Y-%m-%dT%H:%M:%S.%L%z")}
[/highlight]
  </record>
</filter>
...
```

The `enable_ruby` option lets you use Ruby expressions inside `${...}`. You then redefine the `timestamp` field and use a Ruby expression within `${...}` to convert the Unix timestamp to the ISO format. The expression `Time.at(record["timestamp"])` creates a Ruby [`Time` object](https://ruby-doc.org/core-2.6.3/Time.html) with the Unix timestamp value, and the `strftime()` method formats the timestamp into the ISO format for readability.

After saving the new changes, start Fluentd with the following command:

```command
docker run --rm -v $(pwd)/fluentd-config:/fluentd/etc -v /var/log:/var/log fluent/fluentd:latest -c /fluentd/etc/fluent.conf
```

Fluentd will yield output similar to the following:

```json
[output]
{"status":200,"ip":"127.0.0.1","level":30,"msg":"Task completed successfully","pid":124134,"ssn":"407-01-2433","timestamp":"2025-05-30T06:58:43.000+0000","hostname":"60c63140cb57"}
{"status":200,"ip":"127.0.0.1","level":30,"msg":"Connected to database","pid":125150,"ssn":"407-01-2433","timestamp":"2025-05-30T06:58:43.000+0000","hostname":"60c63140cb57"}
...
```

In the output, the `timestamp` field is presented in a human-readable ISO format, making it much easier to understand and work with. This adjustment enhances the readability of your log data, making it more user-friendly for analysis and troubleshooting.

### Working with conditional statements in Fluentd

Fluentd allows you to leverage the Ruby [ternary operator](https://www.educative.io/answers/what-is-the-ternary-operator-in-ruby) when the `enable_ruby` option is enabled. This operator allows you to write concise conditional statements, facilitating Fluentd's ability to make decisions based on specified conditions. In this section, you'll use the ternary operator to check if the `status` field equals `200`. If the condition is met, Fluentd will add an `is_successful` field with a value of `true`; otherwise, it will be set to `false`.

First, open your configuration file:

```command
nano fluentd-config/fluent.conf
```
To implement this conditional statement, enter the following code:

```text
[label fluentd-config/fluent.conf]
...
<filter file.logs>
  @type record_transformer
  enable_ruby true
  remove_keys emailAddress
  <record>
    hostname "#{Socket.gethostname}"
    timestamp ${Time.at(record["timestamp"]).strftime("%Y-%m-%dT%H:%M:%S.%L%z")}
    [highlight]
    is_successful ${record["status"] == 200 ? "true" : "false"}
    [/highlight]
  </record>
</filter>
...
```

In the code snippet above, you use the ternary operator to check if the `status` field equals `200`. If the condition is true, the `is_successful` field is assigned the value `true`; conversely, if the condition is false, the `is_successful` field is assigned the value `false`.

Start Fluentd again:

```command
docker run --rm -v $(pwd)/fluentd-config:/fluentd/etc -v /var/log:/var/log fluent/fluentd:latest -c /fluentd/etc/fluent.conf
```

```json
[output]
{"status":200,"ip":"127.0.0.1","level":30,"msg":"Connected to database","pid":124134,"ssn":"407-01-2433","timestamp":"2025-05-30T06:59:52.000+0000","hostname":"87e3cc753d46","is_successful":"true"}
{"status":200,"ip":"127.0.0.1","level":30,"msg":"Task completed successfully","pid":125150,"ssn":"407-01-2433","timestamp":"2025-05-30T06:59:53.000+0000","hostname":"87e3cc753d46","is_successful":"true"}
...
```

As you observe the log entries, you will notice the presence of the `is_successful` field, indicating whether a log entry corresponds to a successful event(`true`) or not (`false`) based on the `status` field value.

This addition of conditional statements in Fluentd provides a powerful way to manipulate log data and add context or flags to log entries based on specific conditions.

### Redacting sensitive data with Fluentd
Even though you have removed the `emailAddress` from the log messages, sensitive fields like the IP address and Social Security Number are still present. To ensure that personal information remains secure, you should redact this sensitive data, especially when it cannot be removed entirely.

Open your Fluentd configuration file again:

```command
nano fluentd-config/fluent.conf
```
You can redact the IP address and social security number with the following code:

```text
[label fluentd-config/fluent.conf]
...
<filter file.logs>
  @type record_transformer
  enable_ruby true
  remove_keys emailAddress
  <record>
    hostname "#{Socket.gethostname}"
    timestamp ${Time.at(record["timestamp"]).strftime("%Y-%m-%dT%H:%M:%S.%L%z")}
    is_successful ${record["status"] == 200 ? "true" : "false"}
    [highlight]
    ip ${record["ip"].gsub(/(\d+\.\d+\.\d+\.\d+)/, 'REDACTED')}
    ssn ${record["ssn"].gsub(/(\d{3}-\d{2}-\d{4})/, 'REDACTED')}
    [/highlight]
  </record>
</filter>
...
```

The `gsub()` method locates specific strings based on the provided regular expressions and replaces them with the text 'REDACTED'. The first `gsub()` operation replaces IP addresses, and the second one replaces SSNs.


After saving these changes, run Fluentd with the following command:

```command
docker run --rm -v $(pwd)/fluentd-config:/fluentd/etc -v /var/log:/var/log fluent/fluentd:latest -c /fluentd/etc/fluent.conf
```

```json
[output]
{"status":200,"ip":"REDACTED","level":30,"msg":"Connected to database","pid":124134,"ssn":"REDACTED","timestamp":"2025-05-30T07:01:05.000+0000","hostname":"ecdfc3f25a74","is_successful":"true"}
{"status":200,"ip":"REDACTED","level":30,"msg":"Initialized application","pid":125150,"ssn":"REDACTED","timestamp":"2025-05-30T07:01:05.000+0000","hostname":"ecdfc3f25a74","is_successful":"true"}
...
```

You will observe that both the IP address and SSN fields have been successfully redacted from the log entries.

In scenarios where you have private information within the same string, like this:

```json
[output]
{..., "privateInfo": "This is a sample message with SSN: 123-45-6789 and IP: 192.168.0.1"}
```

You can simultaneously selectively redact sensitive portions, such as the SSN and IP address:

```text
 ...
 privateInfo ${record["privateInfo"].gsub(/(\d{3}-\d{2}-\d{4})/, 'REDACTED').gsub(/(\d+\.\d+\.\d+\.\d+)/, 'REDACTED')}
 ...
```

Upon redaction, the output will resemble the following:

```text
[output]
{...,privateInfo":"This is a sample message with SSN: REDACTED and IP: REDACTED"}
```

By effectively masking sensitive data, Fluentd enhances the security and privacy of your log entries. You can now stop Fluentd and the `logify.sh` script.

You can stop the `logify.sh` by entering the following command in your terminal to obtain the process ID:

```command
jobs -l | grep "logify"
```
```text
[output]
[1]- 124134 Running                 ./logify.sh &  (wd: ~/log-processing-stack/logify)
```
Kill the program with the command that follows, and be sure to substitute the process ID:

```command
kill -9 <124134>
```
In the next section, we will explore how to collect logs from Docker containers using Fluentd and centralize them with Better Stack.

## Collecting logs from Docker containers and centralizing logs

In this section, you will containerize the Bash script and use the [Nginx hello world Docker image](https://hub.docker.com/r/betterstackcommunity/nginx-helloworld), which is preconfigured to generate JSON Nginx logs for each incoming request. Subsequently, you will employ a Fluentd container to collect logs from both containers and transmit them to [Better Stack](https://betterstack.com/) for monitoring and analysis.

### Setting up Docker Compose for log collection

In this section, you'll create a Docker Compose setup that includes the Bash script, Nginx service, and Fluentd for log collection. This approach provides better orchestration and makes it easier to manage multiple containers.

First, ensure you are in the root project directory:

```command
pwd
```
```text
[output]
/home/dev/log-processing-stack
```

### Dockerizing the Bash script

Create a `Dockerfile` for the logging script in the `logify` directory:

```command
nano logify/Dockerfile
```

In your `Dockerfile`, add the following instructions:

```text
[label log-processing-stack/logify/Dockerfile]
FROM ubuntu:latest

COPY . .

RUN chmod +x logify.sh

RUN mkdir -p /var/log/logify

RUN ln -sf /dev/stdout /var/log/logify/app.log

CMD ["./logify.sh"]
```
In this `Dockerfile`, you use the latest version of Ubuntu as the base image. You then copy the script into the container, ensure it's executable, and create a directory for log files. Additionally, you set up a redirection mechanism that sends any data written to `/var/log/logify/app.log` to the standard output. This configuration lets you conveniently view the container's logs using the `docker logs` command. Finally, you specify that the script should be executed when the container is launched.


Create a `docker-compose.yml` file in the root directory:

```command
nano docker-compose.yml
```

Start with a simple setup to get the first source working:

```text
[label log-processing-stack/docker-compose.yml]
services:
  logify-script:
    build:
      context: ./logify
    container_name: logify
    depends_on:
      - fluentd
    logging:
      driver: "fluentd"
      options:
        tag: docker.logify

  fluentd:
    build:
      context: ./fluentd-docker
    volumes:
      - ./fluentd-docker/fluent.conf:/fluentd/etc/fluent.conf
    container_name: fluent
    ports:
      - "24224:24224"
      - "24224:24224/udp"
```


Now, create a directory for the Fluentd Docker configuration:

```command
mkdir fluentd-docker && cd fluentd-docker
```

Create a `Dockerfile` to customize the official Fluentd image:

```command
nano Dockerfile
```

In your `Dockerfile`, enter the following custom instructions:

```text
[label log-processing-stack/fluentd-docker/Dockerfile]
FROM fluent/fluentd:latest
USER root
RUN ["fluent-gem", "install", "fluent-plugin-logtail"]
USER fluent
```

This `Dockerfile` uses the [Fluentd base image](https://hub.docker.com/r/fluent/fluentd/) and installs the `fluent-plugin-logtail` gem, which enables Fluentd to forward logs to Better Stack. The user is set to `fluent` to ensure Fluentd runs with appropriate permissions.


Next, create a `fluent.conf` configuration file:

```command
nano fluent.conf
```

Start with a basic configuration for the first source:

```text
[label log-processing-stack/fluentd-docker/fluent.conf]
<source>
  @type forward
  port 24224
  bind 0.0.0.0
</source>

<match docker.logify.**>
  @type stdout
</match>
```

This configuration specifies that Fluentd should listen for logs on port `24224`, accepting log data from services configured to send their logs to Fluentd using the [forward](https://docs.fluentd.org/output/forward) input. For now, we'll output to stdout to verify everything works.


Navigate back to the root directory and build the Docker images:

```command
cd ..
```
```command
docker compose up --build
```

You should see logs from the `logify-script` being processed by Fluentd and displayed in the console. The output will look similar to this:

```text
[output]
fluent  | 2025-05-30 07:09:19.000000000 +0000 docker.logify: {"log":"{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Connected to database\", \"pid\": 1, \"ssn\": \"407-01-2433\", \"timestamp\": 1748588959}","container_id":"30b0cac2a751dd80f73043263cdd1ab4a39d8ef7a067f1997a34d81721f1de73","container_name":"/logify","source":"stdout"}
```

This confirms that Fluentd is successfully collecting logs from the Docker container.

### Setting up Better Stack for log centralization

Before setting up Fluentd to collect logs, you need to choose where to send them. We'll use Better Stack to keep all your logs in one place, so it's easier to monitor and analyze them.

Start by creating a free [Better Stack account](https://telemetry.betterstack.com/users/sign-up). Then go to the [Telemetry page](https://telemetry.betterstack.com/). In the left-hand menu, click **Sources**, then select **Connect source**:

![The Better Stack Sources page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/84a7ceaa-e302-4357-7bc2-79c6ecdc5a00/md1x =3024x1530)

Create a new source for the Bash script logs. Give it an appropriate name, like **"Logify App Logs"**, and choose **Docker** as the platform. Then scroll to the bottom of the page and click **Connect Source**:

![Creating a source in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3617558f-4813-4d66-1082-42ba3a1fca00/md1x =3024x3384)

Once you create the source, Better Stack will give you a **source token** (for example, `qU73jvQjZrNFHimZo4miLdxF`) and an **ingestion host** (like `s1315908.eu-nbg-2.betterstackdata.com`). Make sure to save both — you’ll need them later when setting up log forwarding in your Fluentd config file.

![Copy source token and injection host in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8adf65d1-e79a-4039-af20-3b5aca82c100/lg1x =3024x1530)


Next, stop the current Docker Compose with `CTRL` + `C`. Then update the `fluent.conf` file to forward logs to Better Stack:

```command
nano fluentd-docker/fluent.conf
```

Replace the stdout output with the logtail plugin for Better Stack integration:

```text
[label log-processing-stack/fluentd-docker/fluent.conf]
<source>
  @type forward
  port 24224
  bind 0.0.0.0
</source>

<match docker.logify.**>
[highlight]
  @type logtail
  @id output_logify_logtail
  source_token <your_logify_source_token>
  ingesting_host <your_logify_ingesting_host>
  flush_interval 2
[/highlight]
</match>
```

The `<match docker.logify.**>` tells Fluentd to match log entries with tags starting with `docker.logify` and forward them to Better Stack using the `logtail` plugin. Make sure to replace `<your_logify_source_token>` and `<your_logify_ingesting_host>` with the actual source token and ingesting host from your Better Stack Sources page.

Start the services again:

```command
docker compose up -d
```

After the `fluentd` container is up and running, go back to the Better Stack source page and scroll down to the **Verify data collection** section. Within a few moments, you should see a **Logs received!** message, confirming that your Bash script container logs are successfully being sent to Better Stack:

![Logs received in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/aa4ecb9e-65eb-4518-5d0c-189d06e5c700/lg2x =3024x2527)

Click on the **Live tail** link to see your container logs streaming in:

![Better Stack live tail page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6281ac42-b0ad-4a27-8138-fade10891b00/lg2x =3024x1530)

You’ll now see logs from your `logify` container showing up in Better Stack. Each log includes helpful metadata like the container name, image name, and timestamp.

Click on any log entry to view more detailed information:

![log entry details](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e53c83e6-c496-47b9-9330-2c143d53ec00/lg1x =3024x1530)

Your Bash script logs are now being forwarded to Better Stack successfully!

Now that you've confirmed the first source is working properly, it's time to set up sources for the remaining logs. Create two additional sources in Better Stack:

1. **Nginx Logs** – to collect logs from the Nginx container
2. **Fluentd Logs** – to capture Fluentd's own internal logs

Use the same steps as before to create these sources. Be sure to save each source’s token and ingestion host—you’ll need them for the Fluentd configuration.


After setting up the additional sources, your Better Stack interface should look like this:

![Better Stack sources for Logify, Nginx, and Fluentd](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2c955f3e-b275-4c52-13d9-6b42619efc00/md2x =3024x2188)


Once that’s done, go ahead and stop the current setup so you can update it with the new configurations.


```command
docker compose down
```

Update the `docker-compose.yml` file to add the Nginx service:

```text
[label log-processing-stack/docker-compose.yml]
services:
  logify-script:
    build:
      context: ./logify
    container_name: logify
    depends_on:
      - fluentd
    logging:
      driver: "fluentd"
      options:
        tag: docker.logify

[highlight]
  nginx:
    image: betterstackcommunity/nginx-helloworld:latest
    container_name: nginx
    ports:
      - '80:80'
    depends_on:
      - fluentd
    logging:
      driver: "fluentd"
      options:
        tag: docker.nginx
[/highlight]

  fluentd:
    build:
      context: ./fluentd-docker
    volumes:
      - ./fluentd-docker/fluent.conf:/fluentd/etc/fluent.conf
    container_name: fluent
    ports:
      - "24224:24224"
      - "24224:24224/udp"
```

Update the `fluent.conf` file to handle multiple sources:

```command
nano fluentd-docker/fluent.conf
```

Add match directives for all sources:

```text
[label log-processing-stack/fluentd-docker/fluent.conf]
<source>
  @type forward
  port 24224
  bind 0.0.0.0
</source>

<match docker.logify.**>
  ...
</match>

[highlight]
<match docker.nginx.**>
  @type logtail
  @id output_nginx_logtail
  source_token <your_nginx_source_token>
  ingesting_host <your_nginx_ingesting_host>
  flush_interval 2
</match>

<label @FLUENT_LOG>
<match fluent.*>
  @type logtail
  @id output_fluent_logtail
  source_token <your_fluentd_source_token>
  ingesting_host <your_fluentd_ingesting_host>
  flush_interval 2
</match>
</label>
[/highlight]
```

Make sure to replace `<your_nginx_source_token>`, `<your_nginx_ingesting_host>`, `<your_fluentd_source_token>`, and `<your_fluentd_ingesting_host>` with the actual source tokens and ingesting hosts from your Better Stack Sources page.

The `<match docker.nginx.**>` directive forwards logs with tags starting with `docker.nginx.` to Better Stack.

To match Fluentd internal logs, you define a `<label @FLUENT_LOG>` and a matching condition `<match fluent.*>` to forward logs with tags starting with "fluent" to Better Stack.

Start all services:

```command
docker compose up -d
```

Send some requests to the Nginx service to generate logs:

```command
curl http://localhost:80/?[1-5]
```

Now you can see that the logs are being sent to their respective sources in Better Stack. Here are the Nginx logs appearing in live tail:

![Nginx logs in Better Stack live tail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9acacfc1-6b34-4ac5-d139-07f6c8432800/orig =3024x1530)

Here are the Fluentd logs showing Fluentd's startup and operational information:

![Fluentd logs in Better Stack live tail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/09eb2f4d-8336-408b-bc01-423548f56200/lg1x =3024x1530)

With this setup, you have successfully centralized all your Docker container logs in separate sources within Better Stack, making it easier to monitor, debug, and analyze each service independently while maintaining centralized access.

## Monitoring Fluentd health with Better Stack

Fluentd doesn’t have a built-in `/health` endpoint for external monitoring, but it does include a monitoring agent that gathers internal metrics and makes them available in JSON format at the `/api/plugins.json` endpoint.

To enable access to these internal metrics through the REST API, start by opening the `fluent.conf` configuration file:

```command
nano fluentd-docker/fluent.conf
```

Add these lines at the top of the `fluent.conf` configuration file:

```text
[label log-processing-stack/fluentd-docker/fluent.conf]
[highlight]
<source>
  @type monitor_agent
  bind 0.0.0.0
  port 24220
</source>
[/highlight]

<source>
  @type forward
  port 24224
  bind 0.0.0.0
</source>
...
```

The `<source>` sets up a Fluentd monitoring agent that exposes internal metrics on port `24220`.

Next, update the `docker-compose.yml` file to expose the port for the Fluentd internal metrics API endpoint:

```text
[label log-processing-stack/docker-compose.yml]
  fluentd:
    ...
    ports:
[highlight]
      - "24220:24220"
[/highlight]
      - "24224:24224"
      - "24224:24224/udp"
```

Restart Fluentd with the following command:

```command
docker compose up -d
```

Verify that Fluentd's `/api/plugins.json` endpoint works:

```command
curl http://localhost:24220/api/plugins.json
```

```json
[output]
{"plugins":[{"plugin_id":"object:8ac","plugin_category":"input","type":"monitor_agent","config":{"@type":"monitor_agent","bind":"0.0.0.0","port":"24220"},"output_plugin":false,"retry_count":null,"emit_records":0,"emit_size":0},
...
buffer_total_queued_size":0,"retry_count":0,"emit_records":3,"emit_size":0,"emit_count":3,"write_count":1,"rollback_count":0,"slow_flush_count":0,"flush_time_count":1429,"buffer_stage_length":0,"buffer_stage_byte_size":0,"buffer_queue_byte_size":0,"buffer_available_buffer_space_ratios":100.0,"retry":{}}]}
```

Next, log in to [Better Stack](https://uptime.betterstack.com/).

Once you are on the **Monitors** page, click the **Create monitor** button:

![Screenshot of the monitors page, providing an option to create a monitor](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/59437b3d-ef9e-48e8-2fe5-70a68454b800/md2x =3024x1530)

Afterward, enter the relevant information and click the **Create monitor** button:

![Screenshot of Better Stack configured with the necessary options](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4546b437-141e-4a6a-c556-f40889e0c000/lg2x =3024x2380)

In this setup, you can choose your preferred method to trigger Better Stack and provide the server's IP address or domain name along with the `/api/plugins.json` endpoint on port `24220`. Finally, select how you would like to be notified.

Once the configuration is complete, Better Stack will initiate monitoring of the Fluentd endpoint, delivering valuable performance statistics:

![Screenshot of Better Stack monitoring the REST API endpoint](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/964cb912-8a98-4bff-182d-b215df523e00/orig =3024x2856)

To demonstrate the response when Fluentd stops running, causing the endpoint to cease functioning, stop all the services with:

```command
docker compose stop
```

After returning to Better Stack, you'll notice the status changes to **"Down"** after a short delay:

![Screenshot of Better Stack indicating that the endpoint is down](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e17a991d-9d2e-4f0e-b006-9a3ae46bfa00/lg2x =3024x2856)

If email alerts are enabled, Better Stack will notify you as soon as the endpoint goes down:

![Screenshot of the email alert from Better Stack notifying of the endpoint's downtime](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/90da1146-a861-46c3-9329-ce494dde9300/lg2x =1908x1284)

With that, you can proactively manage Fluentd's health and promptly address any interruptions in its operation.

## Final thoughts

In this comprehensive article, you explored Fluentd running in Docker containers and how it integrates seamlessly with Docker logging drivers, Nginx, and Better Stack for effective log management. You learned how to use both standalone Docker commands and Docker Compose for orchestrating Fluentd alongside other services. You began by creating Fluentd configuration files and Docker setups, followed by using Fluentd to gather logs from multiple containers and centralize them within Better Stack. Additionally, you learned how to monitor Fluentd's health using Better Stack, ensuring proactive alerts in case of any disruptions.

With this knowledge, you can use Fluentd effectively in containerized environments for log collection and forwarding. For further learning, refer to the [Fluentd documentation](https://docs.fluentd.org) and the [official Fluentd Docker image documentation](https://hub.docker.com/r/fluent/fluentd/). To deepen your understanding of Docker and Docker Compose, explore their respective documentation pages: [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose). For additional insights into Docker logging, refer to our [comprehensive guide](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/).

If you're curious about Fluentd alternatives, check out our guide on [log shippers](https://betterstack.com/community/guides/logging/log-shippers-explained/).

Thanks for reading, and happy logging!