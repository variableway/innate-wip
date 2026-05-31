# How to Collect, Process, and Ship Log Data with Logstash

Logs are invaluable assets, originating from various sources such as applications, containers, databases, and operating systems. When analyzed, they offer crucial insights, especially in diagnosing issues. For their effectiveness, it's essential to centralize them, allowing for in-depth analysis and pattern recognition all in one place. This centralization process involves using a [log shipper](https://betterstack.com/community/guides/logging/log-shippers-explained/), a tool designed to gather logs from diverse sources, process them, and then forward them to different destinations.

One powerful log shipper is [Logstash](https://www.elastic.co/logstash), a free and open-source tool created by Elastic and an integral part of the Elastic Stack, formerly known as the ELK stack. With a robust framework and over 200 plugins, Logstash offers unparalleled flexibility. These plugins enable Logstash to support various sources and perform complex manipulations, ensuring they are well-prepared before reaching their final destination.

In this comprehensive guide, you'll use Logstash with Docker to collect logs from various sources, process and forward them to multiple destinations. First, you'll use Logstash to collect logs from a file and send them to the console. Building upon that, you will use Logstash to [gather logs from multiple Docker containers](https://betterstack.com/community/guides/logging/docker-logs/) and centralize the logs. Finally, you'll monitor the health of a Logstash instance to ensure it performs optimally and reliably.

## Prerequisites

Before you begin, ensure you have access to a system with a non-root user account with `sudo` privileges. You'll need to have [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install) installed. If you're unfamiliar with log shippers, you can gain insights into their advantages by checking out [this article](https://betterstack.com/community/guides/logging/log-shippers-explained/).

With the prerequisites in order, create a root project directory named `log-processing-stack`. This directory will serve as the core container for your application and its configurations:

```command
mkdir log-processing-stack
```

Next, navigate into the newly created directory:

```command
cd log-processing-stack
```

Within the `log-processing-stack` directory, create a subdirectory named `logify` for the demo application:

```command
mkdir logify
```

Move into the `logify` subdirectory:

```command
cd logify
```

Now that the necessary directories are in place, you're ready to create the application.

[ad-logs]

## Developing a demo logging application

In this section, you will build a sample logging application using [Bash](<https://en.wikipedia.org/wiki/Bash_(Unix_shell)>) that generates logs at regular intervals and appends them to a file.

Within the `logify` directory, create a `logify.sh` file using your preferred text editor. For this tutorial, we will use `nano`:

```command
nano logify.sh
```

In your `logify.sh` file, add the following code to start generating logs using Bash:

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

The `create_log_entry()` function generates log entries in JSON format, containing essential details such as HTTP status codes, severity levels, and random log messages. We deliberately include sensitive fields like the IP address, Social Security Number (SSN), and email address. The reason is to showcase Logstash's ability to remove or redact sensitive data. For comprehensive guidelines on best practices for handling sensitive data in logs, consult [our guide](https://betterstack.com/community/guides/logging/sensitive-data/).

In the continuous loop, the `create_log_entry()` function is invoked every 3 seconds, generating a new log record. These records are then appended to a designated file in the `/var/log/logify/` directory.

After you finish writing the code, save your file. To grant the script execution permission, use the following command:

```command
chmod +x logify.sh
```

Next, create the `/var/log/logify` directory, which will serve as the destination for your application logs:

```command
sudo mkdir /var/log/logify
```

After creating the directory, change its ownership to the currently logged-in user specified in the `$USER` environment variable:

```command
sudo chown -R $USER:$USER /var/log/logify/
```

Next, run the Bash script in the background to start generating the logs:

```command
./logify.sh &
```

The program will continuously append logs to `app.log`. To view recent log entries, use the `tail` command:

```command
tail -n 4 /var/log/logify/app.log
```

This command displays the last four lines of `app.log`, allowing you to monitor the real-time log records that your application is generating.

When you run the command, you will see logs looking like this:

```json
[output]
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Connected to database", "pid": 531475, "ssn": "407-01-2433", "timestamp": 1749031783}
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Operation finished", "pid": 169516, "ssn": "407-01-2433", "timestamp": 1749031785}
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Connected to database", "pid": 531475, "ssn": "407-01-2433", "timestamp": 1749031786}
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Connected to database", "pid": 169516, "ssn": "407-01-2433", "timestamp": 1749031788}
```

In the output, the logs are structured in the JSON format, containing various fields.

With the program actively generating logs, your next step is setting up Logstash with Docker to process and analyze this data.

## Setting up Logstash 

In this section, you'll run Logstash 9.0 using Docker containers instead of installing it directly on your system. This approach offers better isolation, easier management, and consistent environments across different systems. Logstash 9.0 introduces several important changes including a new UBI9-based Docker image, improved SSL settings, and enhanced security features.

First, navigate back to the parent directory:

```command
cd ..
```

Create a directory structure for Logstash configuration files:

```command
mkdir -p logstash/config
```

Soon, you'll create the necessary configuration files for Logstash.

## How Logstash works

Before diving into Logstash, it's essential to grasp the fundamental concepts:

![Diagram illustrating Logstash data processing pipeline](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6d93bb9a-a646-411b-ce7f-269d00b9d100/lg2x)

Logstash is easier to understand when you imagine it as a pipeline. At one end of this pipeline are the **inputs**, representing the data sources. As log records traverse through the Logstash pipeline, they can be enriched, filtered, or manipulated according to your requirements. Ultimately, when they reach the pipeline's end, Logstash can deliver these logs to configured destinations for storage or analysis.

To create this data processing pipeline, you can configure Logstash using a configuration file.

A typical Logstash configuration file is structured as follows:

```text
input {
      plugin_name{...}
 }

filter {
     plugin_name{...}
}

output {
     plugin_name{...}
}
```

Let's explore the roles of these components:

- `input`: represents the sources of logs, such as files or HTTP endpoints.
- `filter`(optional): unify and transform log records.
- `output`: the destination for forwarding the processed logs.

For these inputs, filters, and outputs to fulfill their roles, they rely on plugins. These plugins are the building blocks that empower Logstash, allowing it to achieve a wide array of tasks. Let's explore these plugins to provide you with a clearer understanding of Logstash's capabilities.

### Logstash input plugins

For the inputs, Logstash provides
[input plugins](https://www.elastic.co/guide/en/logstash/current/input-plugins.html)
that can collect logs from various sources, such as:

- [HTTP](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-http.html): receives log records over HTTP endpoints.

- [Beats](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-beats.html): collect logs from the Beats framework.

- [Redis](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-redis.html): gather log records from a Redis instance.

- [Unix](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-unix.html):
  read log records via a Unix socket.

### Logstash filter plugins

When you want to manipulate, enrich, or modify logs, some of the
[filter plugins](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-http.html) here can help you do that:

- [JSON](https://www.elastic.co/guide/en/logstash/current/plugins-filters-json.html):
  parses JSON logs.
- [Grok](https://www.elastic.co/guide/en/logstash/current/plugins-filters-grok.html): parsing log data and structuring it.
- [I18n](https://www.elastic.co/guide/en/logstash/current/plugins-filters-i18n.html):
  removes special characters from your log records.
- [Geoip](https://www.elastic.co/guide/en/logstash/current/plugins-filters-geoip.html):
  adds geographical information.

### Logstash output plugins

After processing data, the following
[output](https://www.elastic.co/guide/en/logstash/current/output-plugins.html) plugins can be useful:

- [WebSocket](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-websocket.html):
  forward the logs to a WebSocket endpoint.
- [S3](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-s3.html):
  send log records to Amazon Simple Storage Service (Amazon S3).
- [Syslog](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-syslog.html):
  forward logs to a Syslog server.
- [Elasticsearch](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-elasticsearch.html):
  deliver log entries to Elasticsearch, which is part of the Elastic stack.

## Getting started with Logstash

Now that you understand how Logstash operates, you will use it to read log records from a file and display them in the console.

Create your first Logstash configuration file:

```command
nano logstash/config/logstash.conf
```

In your `logstash.conf` file, add the following lines to instruct Logstash to read logs from a file and forward them to the console:

```text
[label logstash/config/logstash.conf]
input {
  file {
    path => "/var/log/logify/app.log"
    start_position => "beginning"
  }
}

output {
  stdout {
    codec => rubydebug
  }
}
```

The `input` component uses the [`file`](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-file.html) plugin to read logs from a file. The `path` parameter specifies the location of the file to be read, and the `start_position` instructs Logstash to begin reading files from the beginning.

The `output` component uses the [`stdout`](https://www.elastic.co/guide/en/logstash/8.10/plugins-outputs-stdout.html) plugin to display logs in the console. The `rubydebug` codec is used for pretty printing.

After adding the code, save the file. To test your configuration file with Docker, run the following command:

```command
docker run --rm -v "$(pwd)/logstash/config:/usr/share/logstash/pipeline/" docker.elastic.co/logstash/logstash:9.0.1 --config.test_and_exit
```

```text
[output]
...
Configuration OK
[2025-06-04T10:12:08,648][INFO ][logstash.runner          ] Using config.test_and_exit mode. Config Validation Result: OK. Exiting Logstashogstash
```

If the output includes "Configuration OK," your configuration file is error-free.

Now, start Logstash using Docker by mounting both the configuration file and the log directory:

```command
docker run --rm -v "$(pwd)/logstash/config:/usr/share/logstash/pipeline/" -v "/var/log/logify:/var/log/logify" docker.elastic.co/logstash/logstash:9.0.1
```

When Logstash starts running, you will see output similar to this:

```text
[output]
Using bundled JDK: /usr/share/logstash/jdk
Sending Logstash logs to /usr/share/logstash/logs which is now configured via log4j2.properties
[2025-06-04T10:17:08,594][INFO ][logstash.runner          ] Log4j configuration path used is: /usr/share/logstash/config/log4j2.properties
[2025-06-04T10:17:08,604][INFO ][logstash.runner          ] Starting Logstash {"logstash.version"=>"9.0.1", "jruby.version"=>"jruby 9.4.9.0 (3.1.4) 2024-11-04 547c6b150e OpenJDK 64-Bit Server VM 21.0.7+6-LTS on 21.0.7+6-LTS +indy +jit [x86_64-linux]"}
...
[2025-06-04T10:17:11,753][INFO ][logstash.inputs.file     ][main] No sincedb_path set, generating one based on the "path" setting {:sincedb_path=>"/usr/share/logstash/data/plugins/inputs/file/.sincedb_6ff35dd80a4f58587f6a15aac8621421", :path=>["/var/log/logify/app.log"]}
[2025-06-04T10:17:11,757][INFO ][logstash.javapipeline    ][main] Pipeline started {"pipeline.id"=>"main"}
[2025-06-04T10:17:11,776][INFO ][filewatch.observingtail  ][main][c9f2074a79168ce5100234aafffb333e5a1e3150160bd36abd7c699e62cd0a03] START, creating Discoverer, Watch with file and sincedb collections
[2025-06-04T10:17:11,782][INFO ][logstash.agent           ] Pipelines running {:count=>1, :running_pipelines=>[:main], :non_running_pipelines=>[]}
```

Once Logstash starts running, the log events will be formatted and displayed neatly in the console:

```text
[output]
{
      "@version" => "1",
       "message" => "{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Connected to database\", \"pid\": 531475, \"ssn\": \"407-01-2433\", \"timestamp\": 1749031976}",
         "event" => {
        "original" => "{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Connected to database\", \"pid\": 531475, \"ssn\": \"407-01-2433\", \"timestamp\": 1749031976}"
    },
          "host" => {
        "name" => "93a990f8ae74"
    },
    "@timestamp" => 2025-06-04T10:15:05.578375496Z,
           "log" => {
        "file" => {
            "path" => "/var/log/logify/app.log"
        }
    }
}
...
```

In the output, Logstash has added additional fields, such as `host`, `file`, and `version`, to add more context.

Now that you can observe the formatted logs in the console, you can exit Logstash by pressing `CTRL + C`.

In the upcoming section, you will transform these logs before forwarding them to the desired output destination.

## Transforming logs with Logstash

In this section, you will enrich, modify fields, and mask sensitive information in your logs to ensure privacy and enhance the usefulness of the log data.

Logstash uses various [filter plugins](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-http.html) to manipulate log records. Using these plugins, you can perform essential operations such as:

- Parsing JSON logs.
- Removing unwanted fields.
- Adding new fields.
- Maskng sensitive data.

### Parsing JSON logs with Logstash

Since your application produces logs in JSON format, it is crucial to parse them. Parsing JSON logs is essential because it allows you to retain the benefits of the structured JSON format. 

To understand the importance of parsing data, consider the log event output from the previous section:

```text
[output]
{
       "message" => "{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Connected to database\", \"pid\": 531475, \"ssn\": \"407-01-2433\", \"timestamp\": 1749031976}",
         "event" => {
        "original" => "{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Connected to database\", \"pid\": 531475, \"ssn\": \"407-01-2433\", \"timestamp\": 1749031976}"
    },
    ...
}
```

Upon inspecting the log event, you will notice that the log message is in the string format, and some special characters are escaped with backslashes. To ensure that Logstash can parse these logs as valid JSON, you need to configure a filter in the Logstash configuration file.

Open the Logstash configuration file for editing:

```command
nano logstash/config/logstash.conf
```

Add the following code to the configuration file to parse JSON in the `message` field:

```text
[label logstash/config/logstash.conf]
input {
  file {
    path => "/var/log/logify/app.log"
    start_position => "beginning"
  }
}
[highlight]
filter {
  if [message] =~ /^{.*}$/ {
    json {
      source => "message"
    }
  }
}
[/highlight]

output {
  stdout {
    codec => rubydebug
  }
}
```

In the `filter` component, a conditional check if the `message` field contains a JSON object using a regex pattern. If the condition is met, the [`json`](https://www.elastic.co/guide/en/logstash/8.10/plugins-filters-json.html?) plugin parses the `message` field as valid JSON and adds the parsed fields to the log event.

To verify if the `message` field is being parsed as JSON, save your file and restart Logstash:

```command
docker run --rm -v "$(pwd)/logstash/config:/usr/share/logstash/pipeline/" -v "/var/log/logify:/var/log/logify" docker.elastic.co/logstash/logstash:9.0.1
```

```text
[output]
{
   .... 
           "event" => {
        "original" => "{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Initialized application\", \"pid\": 169516, \"ssn\": \"407-01-2433\", \"timestamp\": 1749032396}"
    },
         "message" => "{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Initialized application\", \"pid\": 169516, \"ssn\": \"407-01-2433\", \"timestamp\": 1749032396}",
[highlight]
      "@timestamp" => 2025-06-04T10:20:43.355224148Z,
              "ip" => "127.0.0.1",
             "msg" => "Initialized application",
             "pid" => 169516,
             "ssn" => "407-01-2433",
[/highlight]
             "log" => {
        "file" => {
            "path" => "/var/log/logify/app.log"
        }
    }
}
```

The logs have been successfully parsed as valid JSON and added to the `key=value` log event. You can stop Logstash now.

While your application produces logs in JSON format, it's important to note that logs can come in various formats. Logstash provides several `filter` plugins that enable parsing of different log events, such as:

- [`bytes`](https://www.elastic.co/guide/en/logstash/current/plugins-filters-bytes.html): parses string representations of computer storage sizes.

- [`csv`](https://www.elastic.co/guide/en/logstash/current/plugins-filters-csv.html): parses log records in CSV format.
- [`kv`](https://www.elastic.co/guide/en/logstash/current/plugins-filters-kv.html): parses entries in the `key=value` syntax.

These filter plugins are invaluable for parsing logs of diverse formats. In the next section, you will learn how to modify the log entries further to suit your requirements.

### Adding and removing fields with Logstash

In this section, you will remove the `emailAddress` field, which is considered [sensitive information](https://betterstack.com/community/guides/logging/sensitive-data/), and eliminate some redundant fields. Additionally, you will add a new field to the log event.

To modify the log event, open the Logstash configuration file:

```command
nano logstash/config/logstash.conf
```

Modify the `filter` section as follows:

```text
[label logstash/config/logstash.conf]
...
filter {
  if [message] =~ /^{.*}$/ {
    json {
      source => "message"
    }
  }
[highlight]
  mutate {
    remove_field => ["event", "message", "emailAddress"]
    add_field => { "env" => "development" }
  }
[/highlight]
}
...
```

The [`mutate`](https://www.elastic.co/guide/en/logstash/8.10/plugins-filters-mutate.html?) plugin manipulates log entries. The `remove_field` option accepts a list of fields to remove. Since the JSON parsing added all the fields to the log event, you no longer need the `event` and `message` fields. So you remove them.

To ensure data privacy, you also remove the `emailAddress` field. The `add_field` option adds a new field called `env` with the value "development".

Save the file and restart Logstash:

```command
docker run --rm -v "$(pwd)/logstash/config:/usr/share/logstash/pipeline/" -v "/var/log/logify:/var/log/logify" docker.elastic.co/logstash/logstash:9.0.1
```

The resulting log event will look like this:

```text
[output]
{
     "timestamp" => 1749032709,
    "@timestamp" => 2025-06-04T10:25:17.500686688Z,
           "log" => {
        "file" => {
            "path" => "/var/log/logify/app.log"
        }
    },
         "level" => 30,
           "msg" => "Connected to database",
           "pid" => 169516,
          "host" => {
        "name" => "db99b1807962"
    },
      "@version" => "1",
        "status" => 200,
            "ip" => "127.0.0.1",
           "env" => "development",
           "ssn" => "407-01-2433"
}
...
```

Removing the `event`, `message`, and `emailAddress` fields reduces the noise in the log event. The logs now contain only the essential information.

In the next section, you will add fields to the log event based on conditional statements.

### Working with conditional statements in Logstash

In this section, you will write a conditional statement that checks if the `status` field equals `200`. If true, Logstash will add an `is_successful` field with the value `true`; otherwise, it will be set to `false`.

Open the Logstash configuration file:

```command
nano logstash/config/logstash.conf
```

To create a conditional statement, add the following code:

```text
[label logstash/config/logstash.conf]
...
filter {
  if [message] =~ /^{.*}$/ {
    json {
      source => "message"
    }
  }

  mutate {
    remove_field => ["event", "message", "emailAddress"]
    add_field => { "env" => "development" }
  }
[highlight]
  # Add the 'is_successful' field based on the 'status' field
  if [status] == 200 {
    mutate {
      add_field => { "is_successful" => "true" }
    }
  } else {
    mutate {
      add_field => { "is_successful" => "false" }
    }
  }
[/highlight]
}
...
```

In the provided code, a conditional statement is implemented to check if the `status` field equals the value `200`. If true, the `is_successful` field is set to `true`; otherwise, it is set to `false`.

Save and exit the configuration file. Restart Logstash with the updated configuration:

```command
docker run --rm -v "$(pwd)/logstash/config:/usr/share/logstash/pipeline/" -v "/var/log/logify:/var/log/logify" docker.elastic.co/logstash/logstash:9.0.1
```

The resulting log event will include the `is_successful` field, indicating whether the operation was successful:

```text
[output]
{
           "status" => 200,
               "ip" => "127.0.0.1",
              "ssn" => "407-01-2433",
              "msg" => "Task completed successfully",
             "host" => {
        "name" => "fdf9a9d756c9"
    },
              "log" => {
        "file" => {
            "path" => "/var/log/logify/app.log"
        }
    },
              "pid" => 531475,
              "env" => "development",
         "@version" => "1",
            "level" => 30,
       "@timestamp" => 2025-06-04T10:26:55.694607835Z,
[highlight]
    "is_successful" => "true",
[/highlight]
        "timestamp" => 1749032810
}
...
```

The `is_successful` field indicates the operation's success in the log event. The field would be set to `false` if the status code differed.

### Redacting sensitive data with Logstash

In the previous section, you removed the `emailAddress` field from the log event. However, sensitive fields such as the IP address and Social Security Number(SSN) remain. To protect personal information, especially when complete removal isn't possible due to its integration within necessary strings, it's crucial to mask such data.

To redact the IP address and SSN, open the Logstash configuration file:

```command
nano logstash/config/logstash.conf
```

In the configuration file, add the code below to mask sensitive portions:

```text
[label logstash/config/logstash.conf]

...
input {
  file {
    path => "/var/log/logify/app.log"
    start_position => "beginning"
  }
}

filter {
[highlight]
  # Redact IP addresses
  mutate {
    gsub => [ "message", "(\d{3}-\d{2}-\d{4})", "REDACTED" ]
    gsub => [ "message", "\b(?:\d{1,3}\.){3}\d{1,3}\b", "REDACTED" ]
  }
[/highlight]
  # Parse JSON if the message field matches the JSON pattern
  if [message] =~ /^{.*}$/ {
    json {
      source => "message"
    }
  }
  mutate {
    remove_field => ["event", "message", "emailAddress"]
    add_field => { "env" => "development" }

  }

 # Add the 'is_successful' field based on the 'status' field
  if [status] == 200 {
    mutate {
      add_field => { "is_successful" => "true" }
    }
  } else {
    mutate {
      add_field => { "is_successful" => "false" }
    }
  }
}

output {
  stdout {
    codec => rubydebug
  }
}
...
```

In this code snippet, the `mutate` plugin is used with the `gsub()` method. It takes the `message` field, applies regular expressions to find sensitive portions, and replaces them with 'REDACTED' text. The first `gsub` regex replaces SSNs, and the second replaces IP addresses.

Save and exit the configuration file. Restart Logstash with the updated configuration:

```command
docker run --rm -v "$(pwd)/logstash/config:/usr/share/logstash/pipeline/" -v "/var/log/logify:/var/log/logify" docker.elastic.co/logstash/logstash:9.0.1
```

```text
[output]
{
    "is_successful" => "true",
            "level" => 30,
             "host" => {
        "name" => "1c0b31426a30"
    },
[highlight]
              "ssn" => "REDACTED",
[/highlight]
              "msg" => "Operation finished",
              "pid" => 531475,
              "env" => "development",
           "status" => 200,
       "@timestamp" => 2025-06-04T10:33:54.782784914Z,
         "@version" => "1",
    [highlight]
               "ip" => "REDACTED",
    [/highlight]
        "timestamp" => 1749032885,
              "log" => {
        "file" => {
            "path" => "/var/log/logify/app.log"
        }
    }
}
...
```

You will notice that sensitive information such as SSN and IP addresses have been successfully redacted from the log events.

Masking sensitive data is crucial, especially when dealing with fields like this:

```json
[output]
{..., "privateInfo": "This is a sample message with SSN: 123-45-6789 and IP: 192.168.0.1"}
```

The masking ensures that only sensitive portions are redacted, preserving the integrity of the rest of the message:

```text
[output]
{...,privateInfo": "This is a sample message with SSN: REDACTED and IP: REDACTED"}
```

Now that you can mask data, you can stop Logstash, and the `logify.sh` script. To stop the bash program, obtain the process ID:

```command
jobs -l | grep "logify"
```

```text
[output]
[1]+ 531475 Running                 ./logify.sh &  (wd: ~/log-processing-stack/logify)
```

Substitute the process ID on the `kill` command to terminate the process:

```command
kill -9 <23750>
```

With this change, you can move on to collecting logs from Docker containers.

## Collecting logs from Docker containers and centralizing logs

In this section, you will containerize the Bash program and leverage the [Nginx hello world Docker image](https://hub.docker.com/r/betterstackcommunity/nginx-helloworld), preconfigured to produce JSON Nginx logs every time it receives a request. Logstash will collect logs from the Bash program and the Nginx containers and forward them to [Better Stack](https://betterstack.com/) for centralization.

### Dockerizing the Bash script

First, you will containerize the Bash program responsible for generating log data. Containerization offers several benefits, including encapsulating the script and its dependencies and ensuring portability across various environments.

Make sure you are in the `log-processing-stack/logify` directory. Then, create a `Dockerfile`:

```command
cd logify
```
```command
nano Dockerfile
```

Inside your `Dockerfile`, include the following instructions for creating a Docker image for your Bash script:

```text
[label log-processing-stack/logify/Dockerfile]
FROM ubuntu:latest

COPY . .

RUN chmod +x logify.sh

RUN mkdir -p /var/log/logify

RUN ln -sf /dev/stdout /var/log/logify/app.log

CMD ["./logify.sh"]
```

In this `Dockerfile`, you begin with the latest Ubuntu image as the base. You then copy the program file, change permissions to make it executable, create a directory to store log files, and redirect all data written to `/var/log/logify/app.log` to the standard output. This redirection lets you view the container logs using the `docker logs` command. Finally, you specify the command to run when the Docker container starts.

Save and exit the file. Change back to the parent project directory:

```command
cd ..
```

In your editor, create a `docker-compose.yml` file:

```command
nano docker-compose.yml
```

Add the following code to define the Bash program and Nginx services:

```text
[label log-processing-stack/docker-compose.yml]
services:
  logify-script:
    build:
      context: ./logify
    container_name: logify
  nginx:
    image: betterstackcommunity/nginx-helloworld:latest
    container_name: nginx
    ports:
      - '80:80'
```

In this configuration file, you define two services: `logify-script` and `nginx`. The `logify-script` service is built using the `./logify` directory context. The `nginx` service uses a pre-built Nginx image. You then map port `80` on the host to port `80` within the container. Ensure no other services are running on port `80` on the host to avoid port conflicts.

After defining the services, build the Docker images and create the containers:

```command
docker compose up -d
```

The `-d` option starts the services in the background.

Check the container status to verify that they are running:

```command
docker compose ps
```

You will see "running" status under the "STATUS" column for the two containers:

```text
[output]
NAME      IMAGE                                          COMMAND              SERVICE         CREATED          STATUS          PORTS
logify    log-processing-stack-logify-script             "./logify.sh"        logify-script   13 seconds ago   Up 13 seconds
nginx     betterstackcommunity/nginx-helloworld:latest   "/runner.sh nginx"   nginx           13 seconds ago   Up 13 seconds   0.0.0.0:80->80/tcp, [::]:80->80/tcp
```

Now that the containers are running, send five HTTP requests to the Nginx service using `curl`:

```command
curl http://localhost:80/?[1-5]
```

View all the logs generated by the running containers with:

```command
docker compose logs
```

You will see logs similar to the following output, representing the data generated by both the Nginx service and the Bash program:

```text
[output]
nginx   | {"timestamp":"2025-06-04T10:38:17+00:00","pid":"8","remote_addr":"172.18.0.1","remote_user":"","request":"GET /?1 HTTP/1.1","status": "200","body_bytes_sent":"11109","request_time":"0.000","http_referrer":"","http_user_agent":"curl/8.5.0","time_taken_ms":"1749033497.468"}
...
nginx   | {"timestamp":"2025-06-04T10:38:17+00:00","pid":"8","remote_addr":"172.18.0.1","remote_user":"","request":"GET /?2 HTTP/1.1","status": "200","body_bytes_sent":"11109","request_time":"0.000","http_referrer":"","http_user_agent":"curl/8.5.0","time_taken_ms":"1749033497.469"}
```

This output displays all the logs generated by both services.

With the Bash program and Nginx service containers running and generating data, you can now move on to collecting these logs with Logstash using Docker.

### Setting up Logstash with Docker Compose for container log collection

First, you need to set up Better Stack to receive your logs. Create a free [Better Stack account](https://telemetry.betterstack.com/users/sign-up). Once you've logged in, navigate to the **Sources** section, then click the **Connect source** button:

![Screenshot pointing to the **Connect source** button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/84a7ceaa-e302-4357-7bc2-79c6ecdc5a00/md1x =3024x1530)

Next, provide your source a name like "Logify logs" and select "Docker" as the platform:

![Screenshot showing the name field set to "Logify logs" and the Platform set to "Docker"](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3617558f-4813-4d66-1082-42ba3a1fca00/md1x =3024x3384)

After creating the source, you'll see the integration details including the **Source Token** and **Ingesting Host**. Copy both values as you'll need them for the Logstash configuration:

![Screenshot with an arrow pointing to the "Source Token" and "Ingesting Host" value](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8adf65d1-e79a-4039-af20-3b5aca82c100/lg1x =3024x1530)


Now, create a new Logstash configuration file for container log collection:

```command
nano logstash/config/container-logs.conf
```

Add the following configuration to collect logs via GELF and forward Logify logs to Better Stack:

```text
[label log-processing-stack/logstash/config/container-logs.conf]
input {
  gelf {
    port => 5000
  }
}

filter {
  if [tag] == "docker.logify" {
    mutate { add_tag => "docker_logify" }
  }
}

output {
  if "docker_logify" in [tags] {
    http {
      url => "https://<your_logify_ingesting_host>"
      http_method => "post"
      headers => {
        "Authorization" => "Bearer <your_logify_source_token>"
      }
      format => "json"
    }
  }
  
  # Also output to console for verification
  stdout {
    codec => rubydebug
  }
}
```

Replace `<your_logify_source_token>` with your source token and `<your_logify_ingesting_host>` with your ingesting host URL that you copied from Better Stack. 

Now update your `docker-compose.yml` file to include the Logstash service and configure logging for your Logify container:

```command
nano docker-compose.yml
```

Update the file with the following configuration:

```text
[label log-processing-stack/docker-compose.yml]
version: '3'
services:
  logify-script:
    build:
      context: ./logify
    container_name: logify
[highlight]
    logging:
      driver: gelf
      options:
        gelf-address: "udp://127.0.0.1:5000"
        tag: docker.logify
    depends_on:
      - logstash
[/highlight]
  nginx:
    image: betterstackcommunity/nginx-helloworld:latest
    container_name: nginx
    ports:
      - '80:80'

[highlight]
  logstash:
    image: docker.elastic.co/logstash/logstash:9.0.1
    container_name: logstash
    volumes:
      - ./logstash/config/container-logs.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5000:5000/udp"
    networks:
      - default
[/highlight]
```

Note that we're only configuring logging for the `logify-script` service initially. The Nginx service doesn't have logging configuration yet - we'll add that after verifying the Logify logs are working.

Stop the current containers and start the new setup:

```command
docker compose down
```
```command
docker compose up -d
```

Check that all services are running:

```command
docker compose ps
```

You should see all containers running:

```text
[output]
NAME       IMAGE                                          COMMAND                  SERVICE         CREATED         STATUS         PORTS
logify     log-processing-stack-logify-script             "./logify.sh"            logify-script   5 seconds ago   Up 4 seconds
logstash   docker.elastic.co/logstash/logstash:9.0.1      "/usr/local/bin/dock…"   logstash        6 seconds ago   Up 5 seconds   5044/tcp, 0.0.0.0:5000->5000/udp, [::]:5000->5000/udp, 9600/tcp
nginx      betterstackcommunity/nginx-helloworld:latest   "/runner.sh nginx"       nginx           6 seconds ago   Up 5 seconds   0.0.0.0:80->80/tcp, [::]:80->80/tcp
```


To verify that Logify logs are being processed, check the Logstash container logs:

```command
docker compose logs logstash
```

Give it a moment, then head back to Better Stack to confirm that Filebeat is successfully sending logs. You should see the source status update to **“Logs received!”**. Once it does, click **Live tail** to start viewing your logs in real time:

![Better Stack dashboard showing a log source with the status 'Logs received!' and the 'Live tail' button highlighted for real-time log viewing](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9de92b0b-59ec-4566-ccea-0e9938dc3300/md1x =3024x2548)

In Live tail, you’ll see Logify logs being received in real time:

![Screenshot displaying the log entries in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cfb2412f-0be7-4c14-8dfd-4c0b80010400/md1x =3024x1532)

You can click on any log entry to view more detailed information:

![Expanded view of a single log entry showing detailed fields in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9f9081cd-7931-46fc-d26d-41e3c053cd00/public =3024x1532)


### Adding Nginx log collection

Now that you've verified the Logify logs are working in Better Stack's **Live tail**, you can add Nginx log collection. First, create another source in Better Stack for Nginx logs following the same steps as before, but name it "Nginx logs" and copy both its source token and ingesting host values.

Update your Logstash configuration to handle both Logify and Nginx logs:

```command
nano logstash/config/container-logs.conf
```

Update the configuration to include Nginx logs:

```text
[label log-processing-stack/logstash/config/container-logs.conf]
input {
  gelf {
    port => 5000
  }
}

filter {
  if [tag] == "docker.logify" {
    mutate { add_tag => "docker_logify" }
  }
[highlight]
  if [tag] == "docker.nginx" {
    mutate { add_tag => "docker_nginx" }
  }
[/highlight]
}

output {
  if "docker_logify" in [tags] {
    http {
      url => "https://<your_logify_ingesting_host>"
      http_method => "post"
      headers => {
        "Authorization" => "Bearer <your_logify_source_token>"
      }
      format => "json"
    }
  }
[highlight]
  if "docker_nginx" in [tags] {
    http {
      url => "https://<your_nginx_ingesting_host>"
      http_method => "post"
      headers => {
        "Authorization" => "Bearer <your_nginx_source_token>"
      }
      format => "json"
    }
  }
[/highlight]
  
  # Also output to console for verification
  stdout {
    codec => rubydebug
  }
}
```

Replace the Nginx source token and ingesting host URLs with the values from your second Better Stack source.

Now update the `docker-compose.yml` file to add logging configuration for the Nginx container:

```command
nano docker-compose.yml
```

Add logging configuration to the nginx service:

```text
[label log-processing-stack/docker-compose.yml]
services:
  logify-script:
    build:
      context: ./logify
    container_name: logify
    logging:
      driver: gelf
      options:
        gelf-address: "udp://127.0.0.1:5000"
        tag: docker.logify
    depends_on:
      - logstash
  nginx:
    image: betterstackcommunity/nginx-helloworld:latest
    container_name: nginx
    ports:
      - '80:80'
[highlight]
    logging:
      driver: gelf
      options:
        gelf-address: "udp://127.0.0.1:5000"
        tag: docker.nginx
    depends_on:
      - logstash
[/highlight]

  logstash:
    image: docker.elastic.co/logstash/logstash:9.0.1
    container_name: logstash
    volumes:
      - ./logstash/config/container-logs.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5000:5000/udp"
    networks:
      - default
```

Restart the services to apply the changes:

```command
docker compose down
```
```command
docker compose up -d
```

Generate some Nginx logs by making requests:

```command
curl http://localhost:80/?[1-5]
```


The Nginx logs will now be uploaded to Better Stack using the same HTTP-based integration pattern:

![Screenshot of Nginx logs in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/eef6da19-2e1e-4b26-fa1d-83079d130b00/lg2x =3024x1532)

Both log sources are now successfully integrated with Better Stack using Logstash's HTTP output plugin.

## Monitoring Logstash health with Better Stack

Logstash offers a monitoring API that starts automatically every time you run it. To monitor whether Logstash is up or down, you can add this endpoint to Better Stack to periodically check if the endpoint works.

First, update the `docker-compose.yml` file to expose and map the port for the Logstash monitoring API:

```command
nano docker-compose.yml
```

Add the monitoring API port to the Logstash service:

```text
[label log-processing-stack/docker-compose.yml]
  logstash:
    image: docker.elastic.co/logstash/logstash:9.0.1
    container_name: logstash
    volumes:
      - ./logstash/config/container-logs.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
[highlight]
      - "9600:9600"
[/highlight]
      - "5000:5000/udp"
    networks:
      - default
```

Restart the services to apply the changes:

```command
docker compose down
```
```command
docker compose up -d
```

Verify that the Logstash monitoring API endpoint works:

```command
curl -XGET 'localhost:9600/?pretty'
```

```json
[output]
{
  "host" : "1d89e10af6b7",
  "version" : "9.0.1",
  "http_address" : "0.0.0.0:9600",
  "id" : "6b559c89-f8f6-402d-931a-7940574b7c76",
  "name" : "1d89e10af6b7",
  "ephemeral_id" : "4c59ece1-c98a-441a-8c7f-476bc74cbadf",
  "snapshot" : false,
  "status" : "green",
  "pipeline" : {
    "workers" : 2,
    "batch_size" : 125,
    "batch_delay" : 50
  },
  "build_date" : "2025-04-29T15:24:44+00:00",
  "build_sha" : "4e850d791be668438b0d19f729fa734d4bc7657b",
  "build_snapshot" : false
```

Now, log in to [Better Stack](https://uptime.betterstack.com/).

On the **Monitors** page, click the **Create monitor** button:

![Screenshot of the monitors page with an option to create a monitor on Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/59437b3d-ef9e-48e8-2fe5-70a68454b800/md2x =3024x1530)


Next, enter and check the relevant information and click the **Create monitor** button:

![Screenshot of Better Stack configured with the necessary options](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c50e2b21-757d-4209-39d0-97fa946c6f00/md2x =3024x2380)

Choose your preferred way to trigger Better Stack and also provide your server's IP address or domain name on port `9600`. Finally, select how you prefer to be notified.

Upon completing the configuration, Better Stack will initiate monitoring the Logstash health endpoint and start providing performance statistics:

![Screenshot of Better Stack monitoring the health endpoint](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a2912413-490e-4243-9236-a37cf7da2400/lg2x =3024x2856)

To see what happens when Logstash is down, stop all the services with:

```command
docker compose stop
```

When you return to Better Stack, the status will be updated to "Down" after a few moments pass since the endpoint no longer works:

![Better Stack monitor indicating that the Logstash endpoint is "down"](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1b7f827f-54a0-4d11-0209-46d07ee79300/public =3024x2856)

If you configured Better Stack to send email alerts, you will receive a notification email similar to this:

![email alert from Better Stack in gmail otifying of the endpoint's downtime](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/df1f4990-532b-4e8e-f370-36ed39a4a500/orig =1868x1200)

With this, you can proactively manage Logstash's health and address any issues promptly.

## Final thoughts

In this article, you explored the comprehensive process of using Logstash 9.0 with Docker to collect, process, and forward logs, integrating it seamlessly with container environments, Nginx, and Better Stack for efficient log management.

As a next step, visit the [Logstash](https://www.elastic.co/guide/en/logstash/) documentation to explore more features. If you wish to enhance your knowledge of Docker and Docker Compose, consult their respective documentation pages: [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose). Additionally, for a comprehensive understanding of Docker logging mechanisms, check out this [guide](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/).

If you are interested in exploring Logstash alternatives, consider looking into various log shippers like Fluentd or Vector, which also work excellently with Docker environments.

Thanks for reading, and happy logging!