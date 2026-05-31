# Logging in Caddy: A Complete Guide

Logging in [Caddy](https://betterstack.com/community/guides/web-servers/caddy/) is designed to be efficient, flexible, and
developer-friendly. Under the hood, it uses the high-performance [Zap logging
library](https://betterstack.com/community/guides/logging/go/zap/) to provide [structured logging](https://betterstack.com/community/guides/logging/structured-logging/) out of the box, ensuring zero
allocation overhead even under high load.

When you start Caddy, you'll see server logs in a machine-readable JSON format
that describes server operations and events. However, by default, HTTP request
logging is disabled. To gain visibility into your web traffic, you'll need to
explicitly enable access logging in your `Caddyfile`.

Throughout this guide, you'll learn how to:

- Configure and customize request logging
- Format logs for both human readability and machine processing
- Filter and transform log fields
- Protect sensitive information
- Forward logs to central logging systems

Let's begin!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/y3oo7MGo1DA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Prerequisites

To follow through with this tutorial, you only need basic command-line skills
and a recent version of [Docker](https://docs.docker.com/engine/install/)
installed on your system to experiment with the configuration snippets below.

## Setting up Caddy with Docker

[Caddy's official Docker image](https://hub.docker.com/_/caddy) provides a
streamlined way to deploy and experiment with the web server. This approach
ensures a clean, isolated environment for testing and development.

Let's create a dedicated directory for this tutorial and launch Caddy on :

```command
mkdir caddy-logging-tutorial && cd caddy-logging-tutorial
```

```command
docker run --name caddy-server --rm -p 80:80 caddy
```

Let's break down the Docker command:

- `--name caddy-server`: Creates an identifiable container name.
- `--rm`: Cleans up the container once its stopped.
- `-p 80:80`: Opens the HTTP port for web traffic.

Docker will pull the Caddy image automatically if it's not already on your
system and launch the container immediately.

You might see the following error if the port 80 is already in use:

```text
[output]
docker: Error response from daemon: driver failed programming external connectivity on endpoint caddy-server (b71810794286abc8bc791be97e5bd93d71a943b955b0843befdc134001d78e49): failed to bin
d port 0.0.0.0:80/tcp: Error starting userland proxy: listen tcp4 0.0.0.0:80: bind: address already in use.
```

This means you'll need to free up port 80 before proceeding. A successful launch
displays startup information like this:

```json
[output]
{"level":"info","ts":1739084748.8252573,"msg":"using config from file","file":"/etc/caddy/Caddyfile"}
{"level":"info","ts":1739084748.8262916,"msg":"adapted config to JSON","adapter":"caddyfile"}
{"level":"info","ts":1739084748.8272777,"logger":"admin","msg":"admin endpoint started","address":"localhost:2019","enforce_origin":false,"origins":["//localhost:2019","//[::1]:2019","//127.
0.0.1:2019"]}
{"level":"warn","ts":1739084748.8273637,"logger":"http.auto_https","msg":"server is listening only on the HTTP port, so no automatic HTTPS will be applied to this server","server_name":"srv0
","http_port":80}
{"level":"info","ts":1739084748.8274624,"logger":"tls.cache.maintenance","msg":"started background certificate maintenance","cache":"0xc000468e00"}
{"level":"info","ts":1739084748.8275497,"logger":"http.log","msg":"server running","name":"srv0","protocols":["h1","h2","h3"]}
{"level":"info","ts":1739084748.853014,"msg":"autosaved config (load with --resume flag)","file":"/config/caddy/autosave.json"}
{"level":"info","ts":1739084748.8530247,"msg":"serving initial configuration"}
{"level":"info","ts":1739084748.8591967,"logger":"tls","msg":"cleaning storage unit","storage":"FileStorage:/data/caddy"}
{"level":"info","ts":1739084748.8593786,"logger":"tls","msg":"finished cleaning storage units"}
```

You can now visit `http://localhost` in your browser to verify the setup. You
should see Caddy's default page:

![Caddy's default homepage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cd772b51-4fa8-4e2b-ce04-80d275295300/public =1425x1054)

When you return to your terminal, you'll notice that Caddy remains silent during
these requests since it's configured with minimal logging by default. While the
server processes your requests, it won't display access logs unless explicitly
configured to do so.

You're now ready to explore Caddy's logging capabilities in detail. You may use
`Ctrl-C` to stop the `caddy-server` container before proceeding.

## Enabling request logs in Caddy

Caddy lets you configure request logging through its `log` directive in its
configuration file. The most basic syntax looks like this:

```text
[label Caddyfile]
<your_domain_name> {
[highlight]
    log
[/highlight]
}
```

This enables access logging to the `default` logger which logs to `stderr` by
default. You can change the destination by specifying the `output` subdirective:

```text
[label Caddyfile]
<your_domain_name> {
	log {
[highlight]
		output stdout
[/highlight]
	}
}
```

With this configuration, the logs will now be forwarded to the standard output.
Other `output` options include:

- `stderr`: Standard error output stream.
- `file </path/to/file>`: Write to a specific log file
- `discard`: Disable logging entirely
- `net <address>`: Write logs to a network address.

When running Caddy in Docker, it's best to output logs to `stdout` or `stderr`.
This approach leverages [Docker's logging mechanisms](https://betterstack.com/community/guides/logging/docker-logs/), giving you
access to logs via `docker logs` and automatic log rotation.

For non-containerized Caddy deployments, you have two options:

1. Use Caddy's built-in file logging and configure rotation:

   ```text
   [label Caddyfile]
   <your_domain_name> {
       log {
   [highlight]
           output file /var/log/caddy/access.log {
               roll_size 10MB # Create new file when size exceeds 10MB
               roll_keep 5 # Keep at most 5 rolled files
               roll_keep_days 14 # Delete files older than 14 days
           }
   [/highlight]
       }
   }
   ```

2. Log to a file and manage rotation with the [standard logrotate
   utility](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/)

   ```text
   [label Caddyfile]
   <your_domain_name> {
       log {
   [highlight]
           output file /var/log/caddy/access.log
   [/highlight]
       }
   }
   ```

Each approach has its merits - Caddy's built-in rotation is simpler to configure
but less flexible, while `logrotate` offers more advanced features and
standardizes log file management across all your servers.

If you're following along with the Docker example, create a `Caddyfile` in your
project directory and place the following contents therein:

```text
[label Caddyfile]
:80 {
	# Ensure the default Caddy page continues to work
	root * /usr/share/caddy
	file_server

[highlight]
	# Enable request logging to stderr
	log
[/highlight]
}
```

Once you've saved the file, launch the `caddy-server` container in the
background with and mount the configuration file to `/etc/caddy/Caddyfile`:

```command
docker run -d \
 --name caddy-server \
 -p 80:80 \
 -v ./Caddyfile:/etc/caddy/Caddyfile:ro \
 caddy
```

When you refresh `http://localhost` in your browser, you can now use the
`docker logs` command to view the request logs:

```command
docker logs -n 1 caddy-server
```

You will see a similar output to the following:

```json
{"level":"info","ts":1739088509.125909,"logger":"http.log.access","msg":"handled request","request":{"remote_ip":"172.17.0.1","remote_port":"52492","client_ip":"172.17.0.1","proto":"HTTP/1.1
","method":"GET","host":"localhost","uri":"/","headers":{"User-Agent":["Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"],"Sec-Fetch-Mod
e":["navigate"],"Sec-Fetch-Dest":["document"],"If-Modified-Since":["Fri, 06 Sep 2024 23:18:01 GMT"],"Accept-Language":["en-US,en;q=0.9"],"Connection":["keep-alive"],"Sec-Ch-Ua":["\"Not A(Bra
nd\";v=\"8\", \"Chromium\";v=\"132\""],"Sec-Ch-Ua-Platform":["\"Linux\""],"Upgrade-Insecure-Requests":["1"],"Sec-Fetch-User":["?1"],"Accept-Encoding":["gzip, deflate, br, zstd"],"Cookie":["R
EDACTED"],"Cache-Control":["max-age=0"],"Sec-Ch-Ua-Mobile":["?0"],"Accept":["text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/sign
ed-exchange;v=b3;q=0.7"],"Sec-Fetch-Site":["none"],"If-None-Match":["\"d3zl2qa5ottsedi\""]}},"bytes_read":0,"user_id":"","duration":0.003175926,"size":0,"status":304,"resp_headers":{"Etag":[
"\"d3zl2qa5ottsedi\""],"Server":["Caddy"],"Vary":["Accept-Encoding"]}
```

Caddy uses the [JSON log format](https://betterstack.com/community/guides/logging/json-logging/) by default for all its logs. The
request log entries provides essential data for monitoring server activity,
debugging issues, and analyzing traffic patterns such as the request details
(IP, method, host, URI, response size), performance metrics (like duration), and
headers.

Headers that potentially contain sensitive data (`Cookie`, `Set-Cookie`,
`Authorization`, and `Proxy-Authorization`) are redacted by default in the
request logs. You can disable this protection using the
[log_credentials global option](https://caddyserver.com/docs/caddyfile/options#log-credentials).

In the next section, we'll take a look at customizing the log format so you can
adjust the contents for your desired purposes.

[ad-logs]

## Customizing the default log format

Within the `log` directive, you can use `format` to control how logs get encoded
and formatted. You can use the `json` encoder to format your logs as JSON
(already the default), or use `console` to format the logs for human-readability
while preserving some structure.

```text
[label Caddyfile]
<your_domain_name> {
   log {
[highlight]
    format console
[/highlight]
   }
}
```

After making changes to your `Caddyfile`, you must restart the `caddy-server`
container before the changes take effect:

```command
docker restart caddy-server
```

With the log `format` set to `console`, the request logs will now be encoded as
follows:

```text
[output]
2025/02/09 08:34:32.306 INFO    http.log.access.log0    handled request {"request": {"remote_ip": "172.17.0.1", "remote_port": "55860", "client_ip": "172.17.0.1", "proto": "HTTP/1.1", "method": "GET", "host": "localhost", "uri": "/404", "headers": {"Sec-Fetch-Mode": ["navigate"], "Accept-Encoding": ["gzip, deflate, br, zstd"], "Accept-Language": ["en-US,en;q=0.9"], "Cookie": ["REDACTED"], "Connection": ["keep-alive"], "Upgrade-Insecure-Requests": ["1"], "Sec-Ch-Ua": ["\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\""], "Sec-Fetch-Site": ["none"], "User-Agent": ["Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"], "Sec-Fetch-User": ["?1"], "Sec-Ch-Ua-Mobile": ["?0"], "Sec-Fetch-Dest": ["document"], "Sec-Ch-Ua-Platform": ["\"Linux\""], "Accept": ["text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"]}}, "bytes_read": 0, "user_id": "", "duration": 0.000073208, "size": 0, "status": 404, "resp_headers": {"Server": ["Caddy"]}}
```

The `console` format is only slightly more human-readable than `json`. The main
difference is that it prefixes each log entry with a timestamp and log level in
a more readable format. However, the request details are still encoded as JSON.

For truly human-readable logs, you might want to consider using a custom log
format with the transform directive.

The `format` directive also allows extensive customization of log field names
and formatting. You can rename key fields, adjust time formats, and control how
levels and durations are displayed.

Here's a `Caddyfile` demonstrating the most common `format` options:

```text
[label Caddyfile]
<your_domain_name> {
    log {
        output stdout
        format json {
            message_key     msg           # Key for the log message
            level_key      severity       # Key for the log level
            time_key       timestamp      # Key for the timestamp
            name_key       logger         # Key for the logger name
            caller_key     function       # Key for the caller information
            stacktrace_key stack          # Key for error stacktraces
            time_format    "2006-01-02 15:04:05 MST"  # RFC3339-like format
            time_local                    # Use local timezone
            duration_format "ms"          # Show durations in milliseconds
            level_format   "upper"        # Uppercase log levels
        }
    }
}
```

This produces request logs that look like this:

```json
[output]
{
  "severity": "INFO",
  "timestamp": "2025-02-09 08:52:36 UTC",
  "logger": "http.log.access.log0",
  "msg": "handled request",
  "request": {. . .},
  "bytes_read": 0,
  "user_id": "",
  "duration": 5,
  "size": 0,
  "status": 304,
  "resp_headers": {. . .}
}
```

The next section will take a look at how you can take even greater control of
your log's contents with the `filter` encoder.

## Fine-tuning log output with filters

The `filter` encoder provides fine-grained control over your log fields,
allowing you to select, rename, and modify specific parts of Caddy's request
logs.

You can remove unnecessary fields to reduce log volume, transform field names to
match your existing logging standards, or redact sensitive information like
passwords and tokens.

The `filter` encoder in Caddy follows this structure:

```text
[label Caddyfile]
format filter {
	fields {
		<field> <filter> ...
	}
	<field> <filter> ...
	wrap <encode_module> ...
}
```

- `fields { ... }`: This groups field selections and transformations. Inside
  `fields`, each line follows `<field> <filter>` pattern:
  - `<field>` can be a simple field name or a nested path using `>`.
  - `<filter>` specifies how to transform the field (`delete`, `rename` etc).
- You can also omit the `fields` block entirely and specify `<field> <filter>`
  directly within the `<filter>` block.
- The `wrap` directive determines the final output format .

Note that the `ts`, `level`, `logger`, and `msg` fields cannot be customized
with the `filter` encoder (use the `format` options discussed above instead),
but all other fields are fair game.

Let's take a look at some common filtering operations you can achieve with the
`filter` encoder.

### Deleting fields

To remove specific fields from your logs, use the `delete` directive within the
`filter` encoder. It's a useful way to reduce log verbosity or remove sensitive
fields entirely:

```text
[label Caddyfile]
<your_domain_name> {
	log {
[highlight]
		format filter {
			request delete # Remove request field entirely
			wrap json
		}
[/highlight]
	}
}
```

The above configuration removes the `request` field entirely from the log entry.
You can also delete nested fields by using `>` as follows:

```text
<your_domain_name> {
	log {
		format filter {
[highlight]
			request>headers>Authorization delete # Remove Authorization header
			resp_headers>Server delete # Delete resp_headers.Server field
[/highlight]
			wrap json
		}
	}
}
```

At the time of writing, you cannot use wildcards to select multiple fields (such
as `request>headers>Sec-*`) so you must use list each field like this:

```text
<your_domain_name> {
	log {
		format filter {
[highlight]
            request>headers>Sec-Ch-Ua-Mobile delete
            request>headers>Sec-Fetch-Site delete
            request>headers>Sec-Fetch-User delete
            request>headers>Sec-Fetch-Mode delete
            request>headers>Sec-Fetch-Dest delete
[/highlight]
			wrap json
		}
	}
}
```

### Renaming fields

The `filter` encoder can also rename Caddy's log fields ensure they're
consistent with other observability data:

```text
[label Caddyfile]
<your_domain_name> {
	log {
		format filter {
[highlight]
			request>uri rename path
			status rename status_code
[/highlight]
		}
	}
}
```

### Replacing fields

The `replace` filter can be used to modify entire field values with a static
string:

```text
[label Caddyfile]
<your_domain_name> {
	log {
		format filter {
[highlight]
			user_id replace [REDACTED]
[/highlight]
		}
	}
}
```

The `regexp` filter provides a more flexible way to find and replace within log
fields as you can select specific portions of the string to replace:

```text
[label Caddyfile]
<your_domain_name> {
	log {
		format filter {
			request>uri regexp apikey=[A-Za-z0-9]+ apikey=[REDACTED]
		}
	}
}
```

If either filter is used on a field that is an array of strings, the replacement
will be applied to each value in the array.

### Obscuring sensitive fields

In Caddy, the `ip_mask` filter can be used to anonymize IP addresses in request
logs:

```text
[label Caddyfile]
<your_domain_name {
	log {
		format filter {
[highlight]
			request>client_ip ip_mask {
				ipv4 24 # Applies a /24 subnet mask, anonymizing the last part of IPv4 addresses.
				ipv6 56 # Keep only the first 56 bits of an IPv6 address
			}
[/highlight]
		}
	}
}
```

For other values, you can use the `hash` filter which generates SHA-256 hashes
and truncates them to the first 4 bytes (8 characters):

```text
[label Caddyfile]
<your_domain_name {
	log {
		format filter {
[highlight]
            request>client_ip hash
[/highlight]
		}
	}
}
```

This creates shorter, consistent identifiers without exposing sensitive data:

```json
[output]
{
    "request": {
        "client_ip": "8c6976e5",
    }
}
```

### Manipulating query parameters in URLs

Caddy also provides an easy way to delete, replace, or obscure URL query
parameters. It may be used as follows:

```text
[label Caddyfile]
<your_domain_name> {
	log {
		format filter {
[highlight]
			request>uri query {
				delete apikey
				replace secret_code [REDACTED]
				hash email_address
			}
		}
[/highlight]
	}
}
```

The behaviour of `delete`, `replace` and `hash` are identical to the standalone
filters except that they operate on the specified query parameters:

With this configuration, this `request.uri` value:

```text
/api/user?apikey=123456789&secret_code=mysecret&email_address=user@example.com
```

Will become:

```text
/api/user?secret_code=[REDACTED]&email_address=f0e4c2f7
```

## Adding new fields to request logs

Caddy allows you to add custom fields to request logs using the `append` format.
It has a similar signature to `filter`:

```text
format append {
	fields {
		<field> <value>
	}
	<field> <value>
	wrap <encode_module> ...
}
```

This is useful for injecting metadata, static values, or dynamically extracted
details into your logs:

```text
[label Caddyfile]
<your_domain_name> {
	log {
[highlight]
		format append {
			operating_system {system.os}
            server_env {env.SERVER_ENV}
             static_field static_value
		}
[/highlight]
	}
}
```

Note that only
[globally available variables](https://caddyserver.com/docs/conventions#placeholders)
can be used with append, but request-level variables cannot be used as the
fields are added outside of the HTTP request context.

## Creating human-readable logs with Transform Encoder

While structured JSON logs are recommended for production use, human-readable
logs can be helpful during development or for hobby deployments.

The [transform encoder plugin](https://github.com/caddyserver/transform-encoder)
lets you format logs in a more readable style, but it is not present in the
official Docker image.

To use this plugin, you'll need to create a custom image that adds this module.
Here's the `Dockerfile` you need:

```Dockerfile
[label Dockerfile]
ARG VERSION=2.9.1

FROM caddy:${VERSION}-builder AS builder

RUN xcaddy build \
  --with github.com/caddyserver/transform-encoder

FROM caddy:${VERSION}

COPY --from=builder /usr/bin/caddy /usr/bin/caddy
```

You can then build the image by running:

```command
ocker build -t custom-caddy .
```

Once the image is built, stop and remove your existing `caddy-server` container
with:

```command
docker rm -f caddy-server
```

Then modify your `Caddyfile` to use the `transform` encoder as follows:

```text
[label Caddyfile]
<your_domain_name> {
	log {
[highlight]
		format transform "{common_log}"
[/highlight]
	}
}
```

The `{common_log}` placeholder refers to the popular
[Apache Common Log format](https://en.wikipedia.org/wiki/Common_Log_Format)
which is used by other web servers like
[Nginx](https://betterstack.com/community/guides/logging/how-to-view-and-configure-nginx-access-and-error-logs/) or
[Apache](https://betterstack.com/community/guides/logging/how-to-view-and-configure-apache-access-and-error-logs/) when generating
request logs.

Once configured, launch a new Caddy container based on the `custom-caddy` image
with:

```command
docker run --name caddy-server -d -p 80:80 -v ./Caddyfile:/etc/caddy/Caddyfile:ro custom-caddy
```

When you visit `http://localhost` once again, the corresponding request log
entry will be in the Common Log format:

```text
[output]
172.17.0.1 - - [09/Feb/2025:19:34:37 +0000] "GET / HTTP/1.1" 200 18753
```

If you'd like to create your own custom format, ensure to checkout the
[transform encoder documentation](https://github.com/caddyserver/transform-encoder)
on GitHub.

## Centralizing and monitoring Caddy logs

Once you've configured Caddy logs to your liking, you can forward them to a log
management system for centralized analysis and [monitoring](https://betterstack.com/community/guides/logging/log-monitoring/).
Once possible solution is [Better Stack](https://betterstack.com/logs).

A common approach is deploying a log shipper alongside your web server so that
it can collect the logs and ingest them into Better Stack.

Start by signing up for a
[free Better Stack account](https://betterstack.com/users/sign-up) and navigate
to the [Telemetry dashboard](https://telemetry.betterstack.com/). Then, from the
menu on the left, choose **Sources** and click on **Connect source**:

![Connect source in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3287a865-7021-49b5-67b2-1634f5b0c500/lg2x =2864x616)

Specify `Caddy logs` as the name and `Vector` as the platform, then scroll to
the bottom of the page and click **Connect source**:

![Create source in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/38e52476-54b4-40e1-14f6-507bf4581b00/orig =6143x3226)

With the source created, you'll see the **Source token** and **Ingestion host**
fields. Ensure to copy them both to your clipboard or

![Copy source token and ingesting host](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/50743ae7-3093-4ed0-3796-fa26e2bb8400/md2x =2864x1966)

Return to your terminal and create a configuration file that instructs Vector to
collect logs from the `caddy-server` container and ingest them into Better
Stack:

```yaml
[label vector.yaml]
sources:
  caddy:
    type: docker_logs
    include_images:
      - caddy
      - custom-caddy

sinks:
  betterstack:
    type: http
    method: post
    inputs: [caddy]
[highlight]
    uri: <ingestion_host>
[/highlight]
    encoding:
      codec: json
    auth:
      strategy: bearer
[highlight]
      token: <source_token>
[/highlight]
```

Replace the `<ingestion_host>` and `<source_token>` placeholders in the
configuration above with the values copied from your Better Stack source.

Once configured, open a new terminal, and launch a vector container that mounts
the configuration file and the Docker socket which is required to read and
collect the logs from containers created from the specified images:

```command
docker run \
 -d \
 --name vector \
 -v ./vector.yaml:/etc/vector/vector.yaml \
 -v /var/run/docker.sock:/var/run/docker.sock:ro \
 timberio/vector:latest-alpine
```

Once the `vector` container launches in the background, generate some request
logs by refreshing `http://localhost` a few times. You should observe a **Logs
received** message in your Better Stack source:

![Better Stack source logs received](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e3af6306-7b04-483a-d1b2-723b223b4800/lg1x =2708x1324)

You can then click the **Live tail** link to see the logs streaming in from your
Caddy servers.

![Better Stack live tail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8b41068b-803e-48ff-a115-31a4f2bcfa00/public =6143x3226)

From here, you can search, filter, and analyze your log data as your see fit.
You can also visualize important metrics contained in the logs or set up
alerting when certain events or patterns are detected.

Feel free to explore [our documentation](https://betterstack.com/docs/logs/using-logtail/querying-data-in-logtail/) to learn all about the features Better
Stack provides for gaining deeper insights into your logs.

## Final thoughts

In this guide, you learned how to configure and customize Caddy's logging
system and leverage its built-in logging capabilities.

You explored how to format logs for both human readability and machine
processing, implement field filtering and transformation, and protect sensitive
information. You also discovered how to integrate Caddy logs with a modern
observability platform.

With these techniques, you can now effectively monitor your Caddy server, gain
insights into your web traffic, and maintain comprehensive logs while ensuring
optimal performance.

The combination of Caddy's zero-overhead logging and flexible configuration
options provides a solid foundation for your web server monitoring needs.

Thanks for reading, and happy logging!
