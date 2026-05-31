# Monitoring Linux Authentication Logs: A Practical Guide

<iframe width="100%" height="315" src="https://www.youtube.com/embed/H4LSiY7I4ps" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Linux authentication logs are not just about tracking access to your servers;
they're the key to understanding patterns, identifying potential breaches, and
enhancing your overall security posture.

Achieving a comprehensive monitoring solution doesn't mean you have to become a
security expert overnight or invest in expensive tools.

Through this detailed guide, I'll demonstrate how accessible and effective
monitoring Linux authentication logs can be, with a hands-on approach to every
step of the process.

We'll delve into:

- Effective strategies for organizing and structuring your authentication logs.
- How to use log monitoring to detect and nullify security risks.
- Visualizing authentication data using graphs and tables.

Let's get started!

## Prerequisites

Before diving into this guide, ensure you have a Linux server ready, configured
with a non-root user that has `sudo` privileges.

This tutorial uses
[Ubuntu 22.04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-22-04)
for demonstration, but the principles apply broadly to other Linux
distributions.

To begin, connect to your server with the command below, substituting your own
details:

```command
ssh <username>@<your_server_ip>
```

With the server prepared, our first task is to delve into the authentication
logs. This will enable you to scrutinize login attempts and spot any activities
that don't reflect your usage.

## Step 1 — Inspecting Linux authentication logs

After accessing your server, you can examine the authentication logs to
understand various security and access-related events. Utilize the command below
to monitor the system authentication log file in real-time:

For Ubuntu/Debian systems:

```command
sudo tail -f /var/log/auth.log
```

For Fedora, Red Hat, or CentOS:

```command
sudo tail -f /var/log/secure
```

You'll see output similar to this:

```text
[output]
Feb 10 15:45:09 ubuntu-lts sshd[47341]: Failed password for root from 103.106.189.143 port 60824 ssh2
Feb 10 15:45:11 ubuntu-lts sshd[47341]: Connection closed by authenticating user root 103.106.189.143 port 60824 [preauth]
Feb 10 15:45:11 ubuntu-lts sshd[47339]: Failed password for root from 180.101.88.228 port 11349 ssh2
Feb 10 15:45:12 ubuntu-lts sshd[47343]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=103.106.189.143  user=root
Feb 10 15:45:14 ubuntu-lts sshd[47339]: Failed password for root from 180.101.88.228 port 11349 ssh2
Feb 10 15:45:14 ubuntu-lts sshd[47343]: Failed password for root from 103.106.189.143 port 33990 ssh2
Feb 10 15:45:16 ubuntu-lts sshd[47343]: Connection closed by authenticating user root 103.106.189.143 port 33990 [preauth]
Feb 10 15:45:16 ubuntu-lts sshd[47339]: Received disconnect from 180.101.88.228 port 11349:11:  [preauth]
Feb 10 15:45:16 ubuntu-lts sshd[47339]: Disconnected from authenticating user root 180.101.88.228 port 11349 [preauth]
Feb 10 15:45:16 ubuntu-lts sshd[47339]: PAM 2 more authentication failures; logname= uid=0 euid=0 tty=ssh ruser= rhost=180.101.88.228  user=root
Feb 10 15:45:18 ubuntu-lts sshd[47345]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=103.106.189.143  user=root
Feb 10 15:45:21 ubuntu-lts sshd[47345]: Failed password for root from 103.106.189.143 port 35180 ssh2
. . .
```

You can also use the [journalctl](https://betterstack.com/community/guides/logging/how-to-control-journald-with-journalctl/) command to view the authentication logs when filtering by the `ssh` service:

```command
journalctl -u ssh
```

This real-time log stream provides insights into authentication attempts,
highlighting failed password entries, successful logins, session disconnections,
root privilege escalations, and other significant events. Let's look at an
example that records a login failure:

```text
Feb 10 15:45:14 ubuntu-lts sshd[47343]: Failed password for root from 103.106.189.143 port 33990 ssh2
```

The log provides the "who" `root`), the "what" (Failed password), the "when"
(Feb 10 15:45:14), the "where" (103.106.189.143) and the "how" (`ssh2`) of the
authentication event. Thanks to these specifics, it is feasible to track trends
in login origins, methods, and to pinpoint authentication attacks.

As you can see, the system is constantly gathering vast amounts of data, but
without actively monitoring these logs, it's impossible to detect malicious
activities that can lead to breaches.

In the following step, we'll focus on transforming these log records into a
[structured JSON format](https://betterstack.com/community/guides/logging/json-logging/) for more efficient parsing, filtering and
analysis by log monitoring tools.

## Step 2 — Structuring Linux authentication logs

Although the records written to the `auth.log` file adhere to the Syslog format,
the log message itself is [completely unstructured](https://betterstack.com/community/guides/logging/log-formatting/) which
presents a challenge for consistent monitoring.

Log parsing is essential to transform these varied log messages into a uniform,
easily analyzable format. This involves transforming each log entry into
structured data, isolating critical information like usernames, IP addresses,
and other contextual details into distinct fields. For example, you can easily
look for which usernames or IP addresses generate the highest number of failed
logins when such data is captured in a named attribute.

To demonstrate how to gather and transform unstructured logs into a structured
format, we'll use [Vector](https://vector.dev), a log shipper that stands out
for its performance, ease of use, and low resource usage.

Begin by
[following the official guide](https://vector.dev/docs/setup/installation/package-managers/apt/)
to install Vector and prepare your system for advanced log handling.

After installation, create or open the Vector configuration file located at
`/etc/vector/vector.yaml`:

```command
sudo nano /etc/vector/vector.yaml
```

Replace its contents with the following configuration:

```yaml
[label /etc/vector/vector.yaml]
sources:
  auth_logs:
    type: file
    include:
      - /var/log/auth.log

transforms:
  parse_auth_log:
    inputs:
      - auth_logs
    type: remap
    source: |
      . |= parse_linux_authorization!(.message)

      .event = {
          "category": "authentication"
      }

      if contains(.message, "Failed password") {
          .event.name = "failed password"
          .context = parse_regex!(.message, r'Failed password for (invalid user )?(?P<username>\w+) from (?P<ip_address>[\d.]+) port (?P<port>\d+) (?P<protocol>\w+)')
      } else if contains(.message, "Invalid user") {
          .event.name = "invalid user"
          .context = parse_regex!(.message, r'Invalid user (?P<username>\w+) from (?P<ip_address>[\d.]+) port (?P<port>\d+)')
      } else if contains(.message, "Accepted") {
          .event.name = "successful login"
          .context = parse_regex!(.message, r'Accepted (?P<auth_method>\w+) for (?P<username>\w+) from (?P<ip_address>[\d.]+) port (?P<port>\d+) (?P<protocol>\w+)(: )?(?P<ssh_signature>RSA SHA256:[A-Za-z0-9+/=]+)?')
      } else if contains(.message, "Received disconnect") {
          .event.name = "disconnect user"
          .context = parse_regex!(.message, r'Received disconnect from (?P<ip_address>[\d.]+)(?: port (?P<port>\d+))?:(?P<error_code>\d+):.*\[(?P<stage>\w+)\]')
      } else if contains(.message, "Disconnected") {
          .event.name = "disconnect user"
          .context = parse_regex!(.message, r'Disconnected from (invalid |authenticating )?user (?P<username>\w+) (?P<ip_address>[\d.]+) port (?P<port>\d+) \[(?P<stage>\w+)\]')
      } else if contains(.message, "session opened for user") {
          .event.name = "session opened"
          .context = parse_regex!(.message, r'pam_unix\((?P<service>\S+):(?P<pam_activity>\S+)\): session opened for user (?P<sudo_user>\S+)\(uid=(?P<sudo_user_id>\d+)\) by (?P<username>\S+)?\(uid=(?P<user_id>\d+)\)')
      } else if contains(.message, "session closed for user") {
            .event.name = "session closed"
            .context = parse_regex!(.message, r'pam_unix\((?P<service>\S+):(?P<pam_activity>\S+)\): session closed for user (?P<sudo_user>\S+)')
      } else if contains(.message, "TTY=") {
            .event.name = "sudo command"
            .context = parse_regex!(.message, r'(?P<username>\S+) : ((?P<error>.*?) ; )?TTY=(?P<tty>\S+) ; PWD=(?P<pwd>\S+) ; USER=(?P<sudo_user>\S+) ;( COMMAND=(?P<command>.+))?')
      } else if contains(.message, "authentication failure") {
            .event.name = "sudo authentication failure"
            .context = parse_regex!(.message, r'pam_unix\((?P<service>\S+):(?P<pam_activity>\S+)\): (?P<error>.*?); ?logname=(?P<logname>.*?) ?uid=(?P<uid>\d+) ?euid=(?P<euid>\d+) ?tty=(?P<tty>\S+) ?ruser=(?P<ruser>.*?) ?rhost=(?P<rhost>.*?)( user=(?P<user>\w+))?')
      }

sinks:
  print:
    type: console
    inputs:
      - parse_auth_log
    encoding:
      codec: json
```

To save time, I'm going to gloss over the configuration details here, but you
can check our [Vector tutorial](https://betterstack.com/community/guides/logging/vector-explained/) to learn more about its
concepts and log parsing syntax.

To summarize, the above configuration directs Vector to:

1. Read logs from `/var/log/auth.log`.
2. Parse each entry, extracting key information using regular expressions and
   categorizing events.
3. Output the transformed logs to the console in JSON format.

Please note that this example does not accurately parse every single log message
format that could be present in the `auth.log` file, but it should suffice for
demonstration purposes.

To activate Vector and see the parsed logs in action, execute:

```command
sudo vector
```

You will observe the following in your terminal:

```text
[output]
2024-02-10T16:24:25.649333Z  INFO vector::app: Log level is enabled. level="info"
2024-02-10T16:24:25.650544Z  INFO vector::app: Loading configs. paths=["/etc/vector/vector.yaml"]
2024-02-10T16:24:25.753544Z  INFO vector::topology::running: Running healthchecks.
2024-02-10T16:24:25.754023Z  INFO vector::topology::builder: Healthcheck passed.
2024-02-10T16:24:25.754073Z  INFO vector::topology::builder: Healthcheck passed.
2024-02-10T16:24:25.754499Z  INFO source{component_kind="source" component_id=auth_logs component_type=file}: vector::sources::file: Starting file server. include=["/var/log/auth.log"] exclu
de=[]
2024-02-10T16:24:25.755199Z  INFO vector: Vector has started. debug="false" version="0.35.0" arch="x86_64" revision="e57c0c0 2024-01-08 14:42:10.103908779"
2024-02-10T16:24:25.755600Z  INFO vector::app: API is disabled, enable by setting `api.enabled` to `true` and use commands like `vector top`.
2024-02-10T16:24:25.756187Z  INFO source{component_kind="source" component_id=auth_logs component_type=file}:file_server: file_source::checkpointer: Loaded checkpoint data.
[highlight]
2024-02-10T16:24:25.756824Z  INFO source{component_kind="source" component_id=auth_logs component_type=file}:file_server: vector::internal_events::file::source: Resuming to watch file. file=
/var/log/auth.log file_position=15899101
[/highlight]
{"appname":"sudo","event":{"category":"authentication"},"file":"/var/log/auth.log","host":"ubuntu-lts","hostname":"ubuntu-lts","message":"pam_unix(sudo:session): session closed for user root","source_type":"file","timestamp":"2024-02-10T16:24:24Z"}
{"appname":"sudo","event":{"category":"authentication"},"file":"/var/log/auth.log","host":"ubuntu-lts","hostname":"ubuntu-lts","message":"ayo : TTY=pts/5 ; PWD=/home/ayo ; USER=root ; COMMAND=/usr/bin/vector","source_type":"file","timestamp":"2024-02-10T16:24:25Z"}
{"appname":"sudo","event":{"category":"authentication"},"file":"/var/log/auth.log","host":"ubuntu-lts","hostname":"ubuntu-lts","message":"pam_unix(sudo:session): session opened for user root (uid=0) by ayo(uid=1000)","source_type":"file","timestamp":"2024-02-10T16:24:25Z"}
{"file":"/var/log/auth.log","host":"ubuntu-lts","message":"Feb 10 16:24:25 ubuntu-lts sshd[48693]: Failed password for root from 103.106.189.143 port 54756 ssh2","source_type":"file","timestamp":"2024-02-10T16:24:25.757389859Z"}
```

The initial messages are Vector's system logs, detailing steps like
configuration loading and file monitoring startup. From the highlighted line,
Vector begins to output processed log entries.

Each entry is now parsed into a JSON object, with key event details meticulously
categorized for easier processing. Let's focus on a specific log entry to
examine its composition:

```json
{
  "appname": "sshd",
  "context": {
    "ip_address": "180.101.88.228",
    "port": "55488",
    "stage": "preauth",
    "username": "root"
  },
  "event": {
    "category": "authentication",
    "name": "disconnect user"
  },
  "file": "/var/log/auth.log",
  "host": "ubuntu-lts",
  "hostname": "ubuntu-lts",
  "message": "Disconnected from authenticating user root 180.101.88.228 port 55488 [preauth]",
  "procid": 48687,
  "source_type": "file",
  "timestamp": "2024-02-10T16:24:28Z"
}
```

This JSON record directly corresponds to the following log line from `auth.log`:

```text
Feb 10 16:24:28 ubuntu-lts sshd[48687]: Disconnected from authenticating user root 180.101.88.228 port 55488 [preauth]
```

The transformation into JSON shows the power of [structured logging](https://betterstack.com/community/guides/logging/structured-logging/) through
distinct fields for critical information like timestamps in ISO 8601 format,
event categories, and other contextual details.

With the logs now in a uniform format, the process of monitoring, searching, and
analyzing becomes significantly more efficient, enabling rapid identification of
security incidents and operational insights across your system.

In the next section, you will proceed to centralize your server authentication
logs in a log management service for easy monitoring.

## Step 3 — Centralizing your authentication logs

Before you can monitor your Linux authentication logs with dashboards and
alerting, they need to be shipped off the server to a centralized log management
platform that supports monitoring features.

One such solution is [Better Stack](https://betterstack.com/logs/) which offers
log monitoring with comprehensive incident management built-in so that you can
easily monitor your authentication logs and get alerted to possible attacks or
other suspicious activity. You can
[sign up for a free account here](https://telemetry.betterstack.com/users/sign-up).

Upon signing into Better Stack, direct your attention to the **Logs & Metrics**
dashboard. Navigate to **Sources** found within the left sidebar and initiate a
new source by clicking **Connect source**:

![connect-source.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1737f7bc-908b-404f-e419-aece5bf70300/lg2x
=3038x812)

For the source setup, label it as **Linux Authentication Logs** and choose
**Vector** as the integration platform:

![source-setup.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fee8a47c-151f-4502-9719-904fc2f6ac00/public
=2222x924)

Following the source creation, you'll be presented with a **Source token**;
ensure to copy this token for subsequent steps:

![copy-source-token.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3c685b22-42c6-407a-6dd3-65e90a166d00/lg1x
=2234x994)

Back on your server, it's time to refine your `/etc/vector/vector.yaml`
configuration to incorporate Better Stack as a log forwarding destination:

```yaml
[label /etc/vector/vector.yaml]
. . .

sinks:
  print:
    type: "console"
    inputs:
      - "parse_auth_log"
    encoding:
      codec: "json"

[highlight]
  better_stack_http_sink:
    type: "http"
    method: "post"
    inputs:
      - "parse_auth_log"
    uri: "https://in.logs.betterstack.com/"
    encoding:
      codec: "json"
    auth:
      strategy: "bearer"
      token: "<your_source_token>"
[/highlight]
```

This modification instructs Vector to not only locally display the parsed logs
but also securely transmit them to Better Stack over HTTP. Once you've updated
the configuration file, quit the existing `vector` process with `Ctrl-C` and
relaunch it:

```command
sudo vector
```

With this setup, your authentication logs will be systematically forwarded to
Better Stack. To verify successful transmission, visit the Better Stack
dashboard again and explore the **Live Tail** feature.

Observing your logs being streamed in real time confirms a successful
integration, thus ensuring comprehensive visibility into your server's
authentication activities without the need for direct server access:

![live-tail.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0230e4b7-595d-456e-4cc3-efdd83684800/public
=3026x1474)

Although the logs are now centralized, your log monitoring journey has only just
begun. The next step is to harness these logs for proactive monitoring and
alerting, which we will explore in the following section.

## Step 4 — Setting up a log monitoring dashboard

With your authentication logs now centralized, it's time to unlock their full
potential by visualizing critical data points. Creating a comprehensive
dashboard enables you to effortlessly monitor key metrics such as login
attempts, active sessions, and other significant events that may require further
scrutiny.

![Linux Authentication Log Monitoring Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/94ecb481-eed6-449e-6d9b-6fd899f7c400/orig
=3768x2450)

Start by heading to the **Dashboards** section in Better Stack, then click
**Create dashboard**:

![create-dashboard.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d1be1bfa-dc14-4166-860c-999a7989f700/orig
=3034x806)

While Better Stack offers a variety of predefined dashboard templates, we'll opt
for a **Blank dashboard** to illustrate customization capabilities.

![blank-dashboard.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fc7f82bd-f856-44e5-e46c-1419938c8400/md1x
=2042x1296)

Next, select the **Linux Authentication Logs** source from the **Presets** menu
and click the **Save** button.

![dash-source.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cb1cbf6e-d68f-4e1b-60bc-c90530517400/public
=1780x962)

With the source selected, click the **Create chart** button and select the **SQL
expression** option on the resulting page:

![sql-expression.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d2b7f4bc-b64d-40cc-336c-c5cfc5bfd100/public
=3038x2474)

Dashboard charts can be created in various ways, but one of the most flexible is
through SQL queries. The default query counts the number of logs received in the
selected sources over the selected period (last 3 hours by default). This data
is then plotted on a line chart to show the authentication and authorization
activity over time.

Click the **Save chart** button on the top right, then return to your dashboard.
You will be greeted with the following screen showing the chart you just
created:

![dash-1.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fc537e1f-d2e3-40f4-7024-4b480b895600/lg1x
=2580x898)

From here, you can rename, re-configure, or remove it as needed.

![remove-chart.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ab8f4e4b-f240-436d-1639-cd6704c0de00/md2x
=1364x700)

In the next section, we'll examine how to set up log fields for grouping
purposes so that they may subsequently be used in dashboard queries.

## Step 5 — Selecting metrics to query

Before you can create visual representations of your log data, you must be
familiar with the structure of the records. Take, for example, a log entry
representing a failed login attempt:

```json
{
  "appname": "sshd",
  "context": {
    "ip_address": "180.101.88.225",
    "port": "14347",
    "protocol": "ssh2",
    "username": "root"
  },
  "event": {
    "category": "authentication",
    "name": "failed password"
  },
  "file": "/var/log/auth.log",
  "host": "ubuntu-lts",
  "hostname": "ubuntu-lts",
  "message": "Failed password for root from 180.101.88.225 port 14347 ssh2",
  "procid": 177242,
  "source_type": "file",
  "timestamp": "2024-02-15T17:27:40Z"
}
```

Brute force attacks typically involve numerous attempts at guessing username and
password combinations. While the passwords are not recorded in the logs, it's
straightforward to identify the most frequently targeted usernames and trace the
source of these attacks through the fields present in such log entries.

Conversely, a successful login event provides similar data, augmented with
authentication methods and SSH signatures:

```json
{
  "appname": "sshd",
  "context": {
    "auth_method": "publickey",
    "ip_address": "102.89.44.150",
    "port": "23793",
    "protocol": "ssh2",
    "ssh_signature": "RSA SHA256:8Gdo7Q35uybWwTaGAoWrQXowqn0MEGaErerTlpR7nTM",
    "username": "ayo"
  },
  "event": {
    "category": "authentication",
    "name": "successful login"
  },
  "file": "/var/log/auth.log",
  "host": "ubuntu-lts",
  "hostname": "ubuntu-lts",
  "message": "Accepted publickey for ayo from 102.89.44.150 port 23793 ssh2: RSA SHA256:8Gdo7Q35uybWwTaGAoWrQXowqn0MEGaErerTlpR7nTM",
  "procid": 177261,
  "source_type": "file",
  "timestamp": "2024-02-15T17:35:05Z"
}
```

To leverage the ingested fields for dashboard queries, you must add it to the
**Logs & metrics** section in your source advanced settings.

Head back to the **Sources** section, locate **Linux Authentication Logs**, and
select **Configure** from the options menu.

![configure-source.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1ea0fa31-1bc3-482d-47a9-7dc3f9d60000/md2x
=2056x388)

On the resulting page, find the **Logs to metrics** tab and click on it, then
scroll to the **Group by** section where default groupings are available for
immediate use.

To add custom groupings, such as querying using the `context.username` field,
fill in the inputs as follows:

- **Column name**: `username`.
- **SQL expression**: Utilize
  `JSONExtract(raw, 'context', 'username', 'Nullable(String)')`. The
  `JSONExtract()` function parses a JSON record and extracts a value of the
  provided ClickHouse data type which is `Nullable(String)` in this case. This
  data type is chosen here since not all records will contain a
  `context.username` field so we're making it nullable to prevent errors. You
  can examine other
  [ClickHouse data types here](https://clickhouse.com/docs/en/sql-reference/data-types).
- **Codec**: Opt for `String (LowCardinality, ZSTD)` for efficient
  [compression](https://clickhouse.com/docs/en/sql-reference/statements/create/table#column-compression-codecs)
  of string data.

Once you're done, click the **Add button** to add it to the list, then add the
following groupings as well:

```text
event_name JSONExtract(raw, 'event', 'name', 'Nullable(String)') String (LowCardinality, ZSTD)
```

```text
ip_address JSONExtract(raw, 'context', 'ip_address', 'Nullable(String)') String (LowCardinality, ZSTD)
```

```text
auth_method JSONExtract(raw, 'context', 'auth_method', 'Nullable(String)') String (LowCardinality, ZSTD)
```

The **Group by** section should now look like this:

![group-by-new.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f0ee6ab2-ebfb-4ec5-0584-5e50fbb2ae00/md2x =2286x1550)

Once you save the changes, you should see a message informing you when the newly
added metrics will be available for querying.

Refreshing the page after the stated time should clear the message, confirming
that they are now ready to be used in your SQL queries.

![logs-to-metrics-delay.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/179e8666-638d-4939-9f11-586a795d9900/public =2204x728)

In the next section, we'll use each custom grouping above to query and filter
the authentication log data, then plot the results on various charts.

## Step 6 — Visualizing successful and failed logins

Moving forward, let's enrich our dashboard with visual representations that
aggregate and highlight the pattern of successful and failed login attempts over
time.

Navigate to the **Dashboards** section and select your previously created
dashboard. To add a new visualization, click the + icon at the top right corner
and opt for **Log filtering**. In the query space provided, input:

```text
event.name:"failed password"
```

![log-filtering.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a0eede4f-4322-4453-6f55-75366110c200/md1x
=2024x418)

This query specifically isolates records tagged "failed password" under the
`event.name` field, allowing you to scrutinize the influx of such events to your
server.

For the visualization type, select a bar chart:

![choose-bar-chart.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8a0d502a-1c1e-4910-c26f-c816a7825a00/lg1x
=536x475)

Once you've configured the chart, consider naming it something descriptive, like
**SSH Login Attempts**, then finalize by hitting the **Save chart** button.

Return to your main dashboard screen to see the chart in action:

![ssh-login-attempts.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cd925883-bea6-4b26-b256-d25b8d1c3d00/orig
=1588x892)

The data reveals an unrelenting flow of scanning and brute force attacks,
manifesting as a consistent rate of failed login attempts each hour on this
server. With access to both the usernames and IP addresses associated with these
attempts, you can further organize this information into a comprehensive table
for deeper analysis.

Create a new chart, and choose the **SQL** option, then populate the
editor with the following contents:

```sql
SELECT username as "User", countMerge(events_count) AS "Attempts"
FROM {{source}}
WHERE {{time}} BETWEEN {{start_time}} AND {{end_time}}
AND event_name = 'failed password'
AND username IS NOT NULL
GROUP BY username
ORDER BY "Attempts" DESC
```

This SQL command aggregates failed login attempts by distinct usernames within
the chosen timeframe, ordering the results to spotlight the most frequent
targets.

Next, adjust the **Chart settings** to display this data as a table. This
visualization will reveal the top usernames attackers attempted to compromise:

![preview-usernames.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3af5395a-f8a9-44ae-97fe-3ec68ad2f700/lg1x
=1910x946)

Following a similar approach, create another chart to aggregate attack origins
by IP address with the SQL query below. Remember to set this chart as a table
for a clear data representation.

```sql
SELECT ip_address as "IP Address", countMerge(events_count) AS "Attempts"
FROM {{source}}
WHERE {{time}} BETWEEN {{start_time}} AND {{end_time}}
AND event_name = 'failed password'
AND ip_address IS NOT NULL
GROUP BY ip_address
ORDER BY "Attempts" DESC
```

Lastly, to track successful logins, utilize the following SQL query to capture
successful login events and display them in a table format:

```sql
SELECT {{time}} as "Timestamp", username as "User", ip_address as "IP Address", auth_method as "Auth method"
FROM {{source}}
WHERE {{time}} BETWEEN {{start_time}} AND {{end_time}}
  AND event_name = 'successful login'
ORDER BY "Timestamp" DESC
```

If you need to generate successful login records, try logging in and out of your
server a few times.

Your dashboard should now look like this:

![dash-3.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bf0ef873-caad-4d4c-72ff-44645d1ba500/public
=2584x1316)

With this setup, you're able to easily see both failed and successful login
attempts, alongside the most frequently targeted usernames and source IP
addresses.

In the next section, you'll add alerting mechanisms to augment this setup,
ensuring you're promptly notified of any abnormal occurrences or potential
security breaches.

## Step 7 — Setting up alerting policies

After visualizing essential events and metrics through charts and tables, the
next step is to incorporate alert mechanisms to ensure that you're promptly
notified of significant occurrences or deviations from the norm, allowing for
swift action.

As an example, let's set up an alert for any successful `root` login attempts.

Start by creating a new visualization and apply the following criteria through
the **Log filtering** option:

```text
event.name="successful login" context.username=root
```

Opt for a bar chart to visually inspect any occurrences. Should there be no
recorded successful root logins within your specified timeframe, expect to see
an empty chart.

![empty-chart.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d3287fac-74ec-4c66-ccc7-3dd83a9a3600/public
=1884x870)

Next, proceed to the **Alerts** section and initiate a new alert configuration:

![create-alert.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7676d04c-5cbe-45d7-724b-9e0ac3ab5f00/lg1x
=760x662)

Here, set up the alert to trigger upon any occurrence, setting the threshold to
`0` to ensure any root login activates the notification.

Within **Advanced settings**, default notification methods (such as email) are
sufficient for this demonstration, though customization is available for
specific needs.

![alert-settings.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/90c26ca5-bbc7-4de2-141f-a41c34c58a00/lg1x
=1920x1080)

Under **Advanced settings**, you can configure how the alert should be delivered
and when, but we'll use the default settings here (via email).

After configuring, save your settings and revisit the dashboard to observe the
new chart.

To test the alert, access your server via SSH as the `root` user:

```command
ssh root@<your_server_ip>
```

Allow a brief period for the dashboard to update, whereupon the recent root
login will be reflected in your visualization and subsequently in the
"Successful logins" table.

![root-login.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/af86a4a4-6b9b-4acd-7140-2676ac2cb900/md1x
=1300x660)

![root-login-2.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/503e5dec-c640-44fc-b535-34c7c4176300/lg2x
=1294x290)

An email alert detailing the root login event will be dispatched to you,
signaling the system's effective monitoring and alerting capability:

![email-alert.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7d5b4f3a-ff23-42f5-ea2e-c51690df8a00/md1x
=1780x1414)

This framework of monitoring and alerting can be extended to cover a range of
other scenarios, such as:

- Repeated authentication failures for usernames that match a valid user, which
  could reveal potential leaks before a compromise.
- Successful logins from strange IP addresses not in a whitelist.
- [Credential stuffing attacks](https://owasp.org/www-community/attacks/Credential_stuffing)
  where an attacker mixes and matches breached login credentials to try and
  match a real user account.
- Successful logins that use password authentication instead of key-based
  authentication.
- Privilege escalation to `root` by users not on a whitelist.
- Frequent failed attempts to gain root access, which could imply an attacker's
  presence within the system.

In the next section, you will use the monitoring insights to further secure your
system and prevent recurrence of the issue.

## Step 8 — Taking action by securing your server

Continuously monitoring your Linux authentication logs has highlighted the
relentless attack attempts that servers face. Therefore, it's necessary to adopt
robust security measures to safeguard them as much as possible.

To enhance your server's defenses, consider implementing the following
strategies:

- Disabling root login over SSH to reduce the risk of unauthorized system
  control.
- Changing the default SSH port from `22` to reduce the volume of automated
  attacks.
- Disabling password authentication in favor of more secure SSH keys.
- Utilizing a firewall to restrict access, blocking all unauthorized entry
  points.
- Use [Fail2Ban](https://github.com/fail2ban/fail2ban) to dynamically ban IPs
  that exhibit suspicious behavior, such as excessive failed login attempts.
- Restricting permissions rigorously, ensuring users have only the access they
  need, thereby limiting potential damage from compromised accounts.
- Setting up multi-factor authentication.
- Adopting [port knocking](https://en.wikipedia.org/wiki/Port_knocking) as a
  stealth method to hide SSH ports from attackers.

### A practical example: disabling root login over SSH

Following the above section, let's configure the server to turn off root access
via SSH so that logging in as root is no longer possible.

On your server, edit the SSH configuration file with root privileges:

```command
sudo nano /etc/ssh/sshd_config
```

Find the line that reads `PermitRootLogin`, uncomment it, and change it to `no`.
If the line doesn't exist, add it:

```text
[label /etc/ssh/ssh_config]
PermitRootLogin no
```

Save your changes and restart the SSH service to enforce the new policy:

```command
sudo systemctl restart sshd
```

Attempt to SSH as `root` to verify the setting is enforced:

```command
ssh root@<your_server_ip>
```

The login attempt should be rejected, indicating root SSH access is correctly
disabled:

```text
[output]
Received disconnect from <your_server_ip> port 22:2: Too many authentication failures
Disconnected from <your_server_ip> port 22
```

By implementing these measures, you'll significantly strengthen your server
against intrusions. If a `root` login alert is triggered after these settings
are applied, it's a clear indicator of a security compromise, necessitating
immediate investigation (perhaps the `PermitRootLogin` setting was re-enabled).

For comprehensive server hardening, explore additional security practices such
as the ones detailed in
[this GitHub repository](https://github.com/imthenachoman/How-To-Secure-A-Linux-Server).

## Final thoughts

In this article, we've explored the steps for collecting, transforming, and
monitoring Linux authentication logs to proactively detect and respond to
security threats within your server infrastructure.

With Better Stack, we've demonstrated how centralized logging coupled with
powerful visualization and alerting tools can significantly enhance your ability
to oversee and secure your server environment.

Thanks for reading, and happy monitoring!