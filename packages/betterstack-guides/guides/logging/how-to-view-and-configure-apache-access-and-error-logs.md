# How to View and Configure Apache Access & Error Logs

At the time of writing, the [Apache HTTP server](https://httpd.apache.org/) is
used by [30.8%](https://w3techs.com/technologies/details/ws-apache) of all web
servers in operation. If you're responsible for managing any system that
utilizes Apache, then you will surely interact with its logging infrastructure
on a regular basis. This tutorial will introduce you to logging in Apache and
how it can help you diagnose, troubleshoot, and quickly resolve any problem you
may encounter on your server.

You will learn where logs are stored, how to access them, and how to customize
the log output and location to fit your needs. You will also learn how to
centralize Apache logs in a log management system for easier tracing, searching,
and filtering of logs across your entire stack.

[summary]
## Side note: Get an Apache logs dashboard

Save hours of sifting through Apache logs. Centralize with [Better Stack](https://betterstack.com/log-management) and start visualizing your log data in minutes.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Prerequisites

To follow through with this tutorial, you should set up a Linux server that
includes a non-root user with `sudo` privileges. Additionally, you also need the
Apache HTTP server installed and enabled on the server, which can be done by
executing the relevant commands below.

On Debian-based distributions like Ubuntu:

```command
sudo apt install apache2
```

```command
sudo systemctl enable apache2
```

```command
sudo systemctl start apache2
```

On RHEL, Fedora or CentOS:

```command
sudo dnf install httpd
```

```command
sudo systemctl enable httpd
```

```command
sudo systemctl start httpd
```

Please note that the rest of the commands, directory configurations, and
conventions used in this tutorial pertain to Debian-based distributions like
Ubuntu. Still, the concepts remain the same for other distributions.

## Step 1 — Getting started with Apache logging

Apache logs are files that record everything the Apache web server is doing for
later analysis by the server administrator. The records of all Apache events are
placed in two different text files:

- **Access Log**: this file stores information about incoming requests. You'll
  find details about each request such as the requested resource, response
  codes, time taken to generate the response, IP address of the client, and
  more.
- **Error Log**: this file contains diagnostic information about any errors were
  encountered while processing requests.

## Step 2 — Locating the Apache log files

The log files' location depends on the operating system the Apache web server is
running. On Debian-based operating systems like Ubuntu, the access log file is
located in `/var/log/apache2/access.log`. On CentOS, RHEL, or Fedora, the access
log file is stored in `/var/log/httpd/access_log`.

A typical access log entry might look like this:

```
[output]
::1 - - [06/Jun/2025:11:11:54 +0000] "GET / HTTP/1.1" 200 327 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
```

Similarly, the error log file is located in `/var/log/apache2/error.log` on
Debian-based systems and `/var/log/httpd/error_log` on CentOS, RHEL, or Fedora.
A typical error log entry might look like this:

```
[output]
[Fri Jun 06 12:03:28.470305 2021] [php7:error] [pid 731] [client ::1:51092] script '/var/www/html/missing.php' not found or unable to stat
```

In the next section, we'll discuss how to view these log files from the command
line.

## Step 3 — Viewing Apache Log files

One of the most common ways to view an Apache log file is through the `tail`
command which prints the last 10 lines from a file. When the `-f` option is
supplied, the command will watch the file and output its contents in real-time.

```command
sudo tail -f /var/log/apache2/access.log
```

You should observe the following output on the screen:

```
[output]
. . .
196.251.85.66 - - [06/Jun/2025:11:11:54 +0000] "GET /.env_sample HTTP/1.1" 404 453 "-" "Mozilla/5.0 (Windows NT 10.0; rv:45.9) Gecko/20100101 Goanna/3.2 Firefox/45.9 PaleMoon/27.4.0"
179.43.161.218 - - [06/Jun/2025:11:14:52 +0000] "GET / HTTP/1.1" 200 3460 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36 Edg/90.0.818.46"
204.76.203.212 - - [06/Jun/2025:11:24:19 +0000] "GET / HTTP/1.1" 200 3460 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36 Edg/90.0.818.46"
5.183.209.244 - - [06/Jun/2025:11:40:25 +0000] "GET / HTTP/1.1" 200 10926 "-" "-
```

To view the entire contents of the file, you can use the `cat` command or open
the file in a text editor like `nano` or `vim`:

```command
cat /var/log/apache2/access.log
```

You may also want to filter the log entries in the log file by a specific term.
In such cases, you should use the `grep` command. The first argument to `grep`
is the term you want to search for, while the second is the log file that will
be searched. In example below, we are filtering all the lines that contain the
word `GET`:

```command
sudo grep GET /var/log/apache2/access.log
```

This should present the following output:

```
[output]
. . .

196.251.85.66 - - [06/Jun/2025:11:11:54 +0000] "GET /.env_sample HTTP/1.1" 404 453 "-" "Mozilla/5.0 (Windows NT 10.0; rv:45.9) Gecko/20100101 Goanna/3.2 Firefox/45.9 PaleMoon/27.4.0"
179.43.161.218 - - [06/Jun/2025:11:14:52 +0000] "GET / HTTP/1.1" 200 3460 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36 Edg/90.0.818.46"
204.76.203.212 - - [06/Jun/2025:11:24:19 +0000] "GET / HTTP/1.1" 200 3460 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36 Edg/90.0.818.46"
5.183.209.244 - - [06/Jun/2025:11:40:25 +0000] "GET / HTTP/1.1" 200
```

## Step 4 — Examining Apache access log formats

The access log records all requests that are processed by the server. You can
see what resources are being requested, the status of each request, and how long
it took to process their response. In this section, we'll dive deeper into how
to customize the information that is displayed in this file.

Before you can derive value from reading a log file, you need to understand the
format that is being used for each of its entries. The `CustomLog` directive is
what controls the location and format of the Apache access log file. This
directive can be placed in the server configuration file
(`/etc/apache2/apache2.conf`) or in your virtual host entry. Note that defining
the same `CustomLog` directive in both files may cause problems.

Let's look at the common formats used in Apache access logs and what they mean.

### Common Log Format

The [Common Log Format](https://httpd.apache.org/docs/current/logs.html#common)
is the standardized access log format format used by many web servers because it
is easy to read and understand. It is defined in the `/etc/apache2/apache2.conf`
configuration file through the `LogFormat` directive.

When you run the command below:

```command
sudo grep common /etc/apache2/apache2.conf
```

You will observe the following output:

```
[output]
LogFormat "%h %l %u %t \"%r\" %>s %O" common
```

The line above defines the nickname `common` and associates it with a particular
log format string. A log entry produced by this format will look like this:

```
[output]
127.0.0.1 alice Alice [06/June/2025:11:26:42 +0200] "GET / HTTP/1.1" 200 3477
```

Here's an explanation of the information contained in the log message above:

- `%h` → `127.0.0.1`: the hostname or IP address of the client that made the
  request.
- `%l` → `alice`: remote log name (name used to log in a user). A placeholder
  value (`-`) will be used if it is not set.
- `%u` → `Alice`: remote username (username of logged-in user). A placeholder
  value (`-`) will be used if it is not set.
- `%t` → `[06/June/2025:11:26:42 +0200]`: the day and time of the request.
- `\"%r\"` → `"GET / HTTP/1.1"` - the request method, route, and protocol.
- `%>s` → `200` - the response code.
- `%O` → `3477` - the size of the response in bytes.

### Combined Log Format

The [Combined Log Format](https://httpd.apache.org/docs/2.4/logs.html#combined)
is very similar to the Common log format but contains few extra pieces of
information.

It's also defined in the `/etc/apache2/apache2.conf` configuration file:

```command
sudo grep -w combined /etc/apache2/apache2.conf
```

You will observe the following output:

```
[output]
LogFormat "%h %l %u %t \"%r\" %>s %O \"%{Referer}i\" \"%{User-Agent}i\"" combined
```

Notice that it is exactly the same as the Common Log Format, with the addition
of two extra fields. Entries produced in this format will look like this:

```
[output]
127.0.0.1 alice Alice [06/June/2025:11:18:36 +0200] "GET / HTTP/1.1" 200 3477 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"
```

Here's an explanation of the two additional fields that are not present in the
Common log format:

- `\"%{Referer}i\"` → `"-"`: the URL of the referrer (if available, otherwise
  `-` is used).
- `\"%{User-Agent}i\"` ->
  `"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"`:
  detailed information about the user agent of the client that made the request.

## Step 5 — Creating a custom log format

You can define a custom log format in the `/etc/apache2/apache2.conf` file by
using the `LogFormat` directive followed by the actual format of the output and
a nickname that will be used as an identifier for the format. After defining the
custom format, you'll pass its nickname to the `CustomLog` directive and restart
the `apache2` service.

In this example, we will create a log format named `custom` that looks like
this:

```
[output]
LogFormat "%t %H %m %U %q %I %>s %O %{ms}T" custom
```



Open your `/etc/apache2/apache2.conf` file and place the line above below the
other `LogFormat` lines:

```text
[label etc/apache2/apache2.conf]
...
LogFormat "%{Referer}i -> %U" referer
LogFormat "%{User-agent}i" agent
[highlight]
LogFormat "%t %H %m %U %q %I %>s %O %{ms}T" custom
[/highlight]
```

It will produce access log entries with the following
details:

- `%t`: date and time of the request.
- `%H`: the request protocol.
- `%m`: the request method.
- `%U`: the URL path requested.
- `%q`: query parameters (if any).
- `%I`: total bytes received including the request headers.
- `%>s`: final HTTP status code.
- `%O`: number of bytes sent in the response.
- `%{ms}T`: time taken to generate the response in milliseconds.

You can find all other formatting options and their description on
[this page](https://httpd.apache.org/docs/current/mod/mod_log_config.html#formats).

To enable the custom format for subsequent access log entries, you must change
the value of the `CustomLog` directive in your virtual hosts file and restart
the `apache2` service with [Systemctl](https://betterstack.com/community/guides/logging/how-to-control-systemd-with-systemctl/).

Open up the default virtual hosts file using the command below:

```command
sudo nano /etc/apache2/sites-available/000-default.conf
```

Find the following line:

```
[output]
CustomLog ${APACHE_LOG_DIR}/access.log combined
```

And change it to:

```
[output]
CustomLog ${APACHE_LOG_DIR}/access.log custom
```

Save the file by pressing `Ctrl-O` then `Ctrl-X`, then restart the `apache2`
service using the command below:

```command
sudo systemctl restart apache2
```

Afterward, make the following request to your server using `curl`:

```command
curl --head 'http://<your_server_ip>?name=john&age=30'
```

You should observe the following response:

```
[output]
HTTP/1.1 200 OK
Date: Fri, 06 Jun 2025 12:20:11 GMT
Server: Apache/2.4.58 (Ubuntu)
Last-Modified: Fri, 06 Jun 2025 11:01:55 GMT
ETag: "29af-636e52880f64f"
Accept-Ranges: bytes
Content-Length: 10671
Vary: Accept-Encoding
Content-Type: text/html
```

Go ahead and view the last 10 messages in the access log file:

```command
sudo tail /var/log/apache2/access.log
```

The log entry that describes the request will look like this:

```
[output]
[06/Jun/2025:12:32:06 +0000] HTTP/1.1 HEAD /index.html ?name=john&age=30 92 200 255 1
```

It's also possible to create multiple access log files by specifying the
`CustomLog` directive more than once. In the example below, the first line logs
into a `custom.log` file using the `custom` log format, while the second uses
the `common` format to write entries into `access.log`. Similarly, the
`combined.log` file contains messages formatted according to the `combined` log
format.

```
[output]
CustomLog ${APACHE_LOG_DIR}/custom.log custom
CustomLog ${APACHE_LOG_DIR}/access.log common
CustomLog ${APACHE_LOG_DIR}/combined.log combined
```

## Step 6 - Formatting your logs as JSON

Although many log management systems support the default Apache logging formats,
it might be best to log in a structured format like JSON since that's the go-to
format for structured logging in the industry and it is universally supported.
Here's a conversion of our `custom` log format into JSON:

```text
[label /etc/apache2/apache2.conf]
...
LogFormat "%{User-agent}i" agent
[highlight]
LogFormat "{ \"timestamp\":\"%t\", \"protocol\":\"%H\", \"method\":\"%m\", \"request\":\"%U\", \"query\":\"%q\", \"request_size_in_bytes\":\"%I\", \"status_code\":\"%>s\", \"response_size_in_bytes\":\"%O\", \"time_taken_ms\":\"%{ms}T\" }" json
[/highlight]
```
```text
[label /etc/apache2/sites-available/000-default.conf] 
CustomLog ${APACHE_LOG_DIR}/access.log json
```

This produces log entries with the following formatting:

```json
[output]
{
  "timestamp": "[06/Jun/2025:12:35:26 +0000]",
  "protocol": "HTTP/1.1",
  "method": "HEAD",
  "request": "/index.html",
  "query": "?name=john&age=30",
  "request_size_in_bytes": "92",
  "status_code": "200",
  "response_size_in_bytes": "255",
  "time_taken_ms": "0"
}
```

[ad-logs]

## Step 7 — Configuring Apache error logs

The server error log contains information about any errors that the web server
encountered while processing incoming requests as well as other diagnostic
information. You can choose where the error messages will be transported to
using the `ErrorLog` directive in your virtual host configuration file. This
transport is usually a log file on the filesystem.

Here is an example from default virtual host configuration file
`/etc/apache2/sites-available/000-default.conf`:

```
[output]
ErrorLog ${APACHE_LOG_DIR}/error.log
```

On Debian-based distributions, the default error log is in the
`/var/log/apache2/error.log` file, while in Fedora/CentOS/RHEL, it placed in the
`/var/log/httpd/error_log` file. If the path argument to `ErrorLog` is not
absolute, then it is assumed to be relative to the
[ServerRoot](https://httpd.apache.org/docs/2.4/mod/core.html#serverroot).

A common practice is to monitor the error log continuously for any problems
during development or testing. This is easily achieved through the `tail`
command:

```command
sudo tail -f /var/log/apache2/error.log
```

You will observe the following output:

```
[output]
[Fri Jun 06 12:22:02.458723 2025] [core:notice] [pid 844354:tid 124116142696320] AH00094: Command line: '/usr/sbin/apache2'
[Fri Jun 06 12:24:59.735074 2025] [mpm_event:notice] [pid 844354:tid 124116142696320] AH00492: caught SIGWINCH, shutting down gracefully
[Fri Jun 06 12:24:59.843106 2025] [mpm_event:notice] [pid 844628:tid 134591834847104] AH00489: Apache/2.4.58 (Ubuntu) configured -- resuming normal operations
[Fri Jun 06 12:24:59.843448 2025] [core:notice] [pid 844628:tid 134591834847104] AH00094: Command line: '/usr/sbin/apache2'
[Fri Jun 06 12:32:03.858576 2025] [mpm_event:notice] [pid 844628:tid 134591834847104] AH00492: caught SIGWINCH, shutting down gracefully
[Fri Jun 06 12:32:03.976519 2025] [mpm_event:notice] [pid 845198:tid 139909693675392] AH00489: Apache/2.4.58 (Ubuntu) configured -- resuming normal operations
[Fri Jun 06 12:32:03.976851 2025] [core:notice] [pid 845198:tid 139909693675392] AH00094: Command line: '/usr/sbin/apache2'
[Fri Jun 06 12:35:23.598168 2025] [mpm_event:notice] [pid 845198:tid 139909693675392] AH00492: caught SIGWINCH, shutting down gracefully
```

Aside from logging directly to a file, you can also forward your logs to a
[Syslog](https://betterstack.com/community/guides/logging/how-to-configure-centralised-rsyslog-server/). You can do this by
specifying [`syslog`](https://httpd.apache.org/docs/2.4/mod/core.html#errorlog)
instead of a file path as the argument to `ErrorLog`:

```
[output]
ErrorLog syslog
```

## Step 8 — Customizing the error log format

Like the Apache access logs, the format of the error messages can be controlled
through the `ErrorLogFormat` directive, which should be placed in the main
config file or virtual host entry. It looks like this:

```
[output]
ErrorLogFormat "[%{u}t] [%l] [pid %P:tid %T] [client\ %a] %M"
```

The above configuration produces a log entry in the following format:

```
[output]
[Fri Jun 06 15:52:57.234792 2022] [error] [pid 24372:tid 24507] [client 20.113.27.135:34579] AH01276: Cannot serve directory /var/www/html/: No matching DirectoryIndex (index.html) found, and server-generated directory index forbidden by Options directive
```

Here's an explanation of the formatting options used above:

`%{u}t`: the current time, including microseconds. `%l`: the log level of the
message. `%P`: the process identifier. `%T`: the thread identifier. `%a`: the
client IP address. `%M`: the actual log message.

Note that when the data for a formatting option is not available in a particular
event, it will be omitted from the log entirely as the Apache error log doesn't
use placeholder values for missing parameters.

You can find a complete description of all the available error formatting
options in the
[Apache docs](https://httpd.apache.org/docs/current/mod/core.html#errorlogformat).

## Step 9 — Customizing the error log level

In the virtual host configuration file, you can also control the level of
messages that will be entered into the error log through the
[LogLevel directive](https://httpd.apache.org/docs/2.4/mod/core.html#loglevel).
When you specify a particular value, messages from all other levels of higher
severity will be logged as well. For example, when `LogLevel error` is
specified, messages with a severity of `crit`, `alert`, and `emerg` will also be
logged.

```
[output]
LogLevel error
```

These are the levels available in increasing order of severity:

- `trace1` - `trace8`: trace messages (lowest severity).
- `debug`: messages used for debugging.
- `info`: informational messages.
- `notice`: normal but significant conditions.
- `warn`: warnings.
- `error`: error conditions that doesn't necessarily require immediate action.
- `crit`: critical conditions that requires prompt action.
- `alert`: errors that require immediate action.
- `emerg`: system is unusable.

If the `LogLevel` directive is not set, the server will set the log level to
`warn` by default.

## Step 10 — Centralizing your Apache logs

Now that you've configured your Apache logs, let's centralize them with a dedicated log management service. This will allow you to view, search, and analyze your Apache logs from a single dashboard, making it easier to monitor your web server's performance and troubleshoot issues.

[Better Stack](https://betterstack.com/logs) provides an excellent solution for centralized log management with powerful search capabilities and real-time monitoring. We'll use Vector to forward your Apache logs to Better Stack.

![Better Stack log management dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)


[Sign up](https://telemetry.betterstack.com/users/sign-up) for a free Better Stack account and navigate to the **Sources** section. Click **Connect source** and create a new source:

![Screenshot pointing to the **Connect source** button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/84a7ceaa-e302-4357-7bc2-79c6ecdc5a00/md1x =3024x1530)

Provide a name, such as `Apache Web Server Logs`, and set the platform to `Vector`. Then click **Create source**:

![Form fields to name the source and select the 'Vector' platform, with 'Create source' button highlighted](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/37f28b5d-fefe-4b2b-0a00-c01670948c00/lg1x =3024x3384)

After creating the source, copy your **source token** and **ingestion host** from the Better Stack interface. You'll need these values for the Vector configuration.

![Better Stack interface showing the generated source token and ingestion host details](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/39c556f5-8c7f-427f-5643-49548808c800/orig =3024x1530)

Next, create a directory for your Apache logging setup:

```command
mkdir apache-logs-vector && cd apache-logs-vector
```

Create a `vector.yaml` configuration file:

```command
nano vector.yaml
```

Add the following configuration, replacing `<your_ingestion_host>` and `<your_source_token>` with your Better Stack values:

```yaml
sources:
  apache_logs:
    type: file
    include:
      - /var/log/apache2/*.log

sinks:
  betterstack:
    type: http
    method: post
    inputs:
      - apache_logs
    uri: "https://<your_ingestion_host>/"
    encoding:
      codec: json
    auth:
      strategy: bearer
      token: "<your_source_token>"
```

Create a Docker Compose file to run Vector:

```command
nano docker-compose.yml
```

```yaml
services:
  vector:
    image: timberio/vector:0.40.0-alpine
    container_name: apache-vector
    volumes:
      - ./vector.yaml:/etc/vector/vector.yaml:ro
      - /var/log/apache2:/var/log/apache2:ro
    restart: unless-stopped
```


Start Vector with:

```command
docker compose up -d
```

Generate some Apache logs by making requests to your server:

```command
curl http://localhost/?[1-5]
```
```command
curl http://localhost/missing-file
```


Return to Better Stack and wait for the source status to update to **“Logs received!”**. Once you see this confirmation, click **Live tail** to view your logs streaming in real time:

![Better Stack source status showing 'Logs received!' and the Live Tail button ready to be clicked](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/21539cd2-9529-4df8-0281-09a4fe020d00/md1x =3024x3990)

In **Live tail**, you’ll see both access and error logs being streamed to Better Stack automatically:

![Live tail view showing real-time access and error logs in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/935330ac-15d5-4550-ecc9-4eabe47ec400/lg2x =3024x1530)

Click on any log entry to view its details and JSON structure:

![Expanded log entry view displaying detailed JSON fields in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c56f8779-d5c4-47e5-ef10-1757c5e1a600/lg2x =3024x1530)

Want to learn how Live tail works in Better Stack? This video covers real-time streaming, histogram navigation, time range filters, JSON inspection, queries, presets, and Explore values.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


You can use dashboards to visualize your logs and spot patterns faster. If you want to learn how, watch this video to see how to create dashboards from templates, adjust time ranges, customize charts, and share dashboards.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

To stop Vector:

```command
docker compose down
```

That's it! Vector now automatically reads all Apache log files from the `/var/log/apache2/` directory and forwards them to Better Stack for centralized monitoring and analysis.

## Final thoughts

In this tutorial, you learned about the different types of logs that the Apache
web server stores, where you can find those logs, and how to view their
contents. We also discussed Apache access and error log formatting and how to
create your custom log formats, including a structured JSON format. Finally, we
considered how you can manage all your Apache logs in one place by using
Vector to stream each entry to a log management service.

Don't forget to [read the docs](https://httpd.apache.org/docs/2.4/logs.html) to
find out more about all the logging features that Apache has to offer. Thanks
for reading!