# How to Collect, Process, and Ship Log Data with Rsyslog

Modern computing systems generate diverse log messages, encompassing vital information from system logs (including kernel and boot messages), applications, databases, and network services or daemons. These logs play a crucial role in troubleshooting and diagnosing issues when they arise, and are often effective when they have been centralized.

To centralize logs, you can use a [log shipper](https://betterstack.com/community/guides/logging/log-shippers-explained/), a tool designed to collect logs from various sources and forward them to diverse locations. [Rsyslog](https://www.rsyslog.com/) is a prominent log shipper operating based on the [syslog](https://en.wikipedia.org/wiki/Syslog) protocol.

Rsyslog ships with advanced features, such as filtering, and supports both [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) and [UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol) protocols for transporting messages. It can handle logs related to mail, authorizations, kernel messages, and more. 

This comprehensive tutorial will guide you through using Rsyslog to collect, process, and forward log data to a central location. First, you will configure Rsyslog to read logs from a file. Next, you will explore how to process logs using Rsyslog. Finally, you will centralize the logs to Better Stack.

## Prerequisites
Before you begin, ensure you have access to a system with a non-root user account that has `sudo` privileges. 

Once you've confirmed these prerequisites, create a directory to store your configuration files and applications:

```common
mkdir log-processing-stack
```

Next, navigate into the newly created directory:

```command
cd log-processing-stack
```

With the directory set up, you're ready to install Rsyslog.

[summary]

## Side note: Ship Rsyslog logs to Better Stack

Once you are collecting the logs you care about, you can forward them to [Better Stack](https://betterstack.com/telemetry) for centralized storage, instant search, live tail, and alerting without running your own logging backend.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/_pv2tKoBnGo" title="Ship logs to Better Stack with the collector" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Installing Rsyslog

Rsyslog is pre-installed on many systems and may sometimes need to be updated. It's considered best practice to install the latest version to ensure you have access to the most recent features and security enhancements. 

Below are the installation instructions, tested on Ubuntu 22.04. For other systems, consult the [Rsyslog documentation](https://www.rsyslog.com/doc/v8-stable/installation/index.html) for installation guidelines.

First, install the latest version of Rsyslog:

```command
sudo apt-get install rsyslog
```

If you see the message "rsyslog is already the newest version," it indicates that you have the latest version installed.

Confirm the installation and check the Rsyslog version with the following:

```command
rsyslogd -v
```

You should see an output similar to this:

```text
[output]
rsyslogd  8.2312.0 (aka 2023.12) compiled with:
	PLATFORM:				x86_64-pc-linux-gnu
	PLATFORM (lsb_release -d):
	FEATURE_REGEXP:				Yes
	GSSAPI Kerberos 5 support:		Yes
	FEATURE_DEBUG (debug build, slow code):	No
	32bit Atomic operations supported:	Yes
	64bit Atomic operations supported:	Yes
	memory allocator:			system default
	Runtime Instrumentation (slow code):	No
	uuid support:				Yes
	systemd support:			Yes
	Config file:				/etc/rsyslog.conf
	PID file:				/run/rsyslogd.pid
	Number of Bits in RainerScript integers: 64
```

Additionally, ensure that the Rsyslog service is active and running:

```command
systemctl status rsyslog
```

You should see the status as "active (running)," confirming that Rsyslog is operational:

```text
[output]
● rsyslog.service - System Logging Service
     Loaded: loaded (/usr/lib/systemd/system/rsyslog.service; enabled; preset: enabled)
[highlight]
     Active: active (running) since Thu 2025-05-22 09:36:01 UTC; 2 weeks 0 days ago
[/highlight]
TriggeredBy: ● syslog.socket
       Docs: man:rsyslogd(8)
             man:rsyslog.conf(5)
             https://www.rsyslog.com/doc/
   Main PID: 927 (rsyslogd)
      Tasks: 4 (limit: 4540)
     Memory: 64.3M (peak: 65.0M)
        CPU: 1min 6.787s
     CGroup: /system.slice/rsyslog.service
             └─927 /usr/sbin/rsyslogd -n -iNONE

Warning: some journal files were not opened due to insufficient permissions.
```

With Rsyslog successfully installed and running, let's understand how it works.

## How Rsyslog works

Before delving into how Rsyslog collects application logs, it's essential to understand how it works with system logs.

![Diagram showing daemons sending logs to Rsyslog and redirecting them to separate files](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d0327c98-2b6e-4491-eea0-e03044e2e600/public =1626x672)

In your system, various applications like SSHD, mail clients/servers, and cron tasks generate logs at frequent intervals. These applications write log messages to the `/dev/log` file as if it were a regular file (pseudo device). 

The Rsyslog daemon monitors this file, collecting logs as they are written, and redirects them to individual plain text files in the `/var/log` directory, including the `/var/log/syslog` file. Rsyslog can route logs to their appropriate files by inspecting header information, such as priority and message origin, which it uses for filtering.

The routing of these messages is based on rules defined in the `50-default.conf` file, located in the `/etc/rsyslog.d/` directory, which we'll explore shortly. Rsyslog operates with default configurations, whether freshly installed or already existing.

However, data originates from diverse sources, and these sources might lack rules in the default configurations.

Building on this knowledge, Rsyslog can be extended to collect logs from additional inputs and redirect them to various destinations, including remote ones, as illustrated in the diagram below:

![Rsyslog diagram](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e1059300-eedd-4b6d-0238-e29e17fdd000/orig =780x587)

To understand this process, imagine Rsyslog as a pipeline. On one end, Rsyslog collects inputs, transforms them, and forwards them to the other end—the destination.

This can be achieved with a custom configuration file in the `/etc/rsyslog.d/` directory, structured as follows:

```text
module(load="<module_name>")

# Collect logs
input(...)

# Modify logs
template(name="<template_name>") {}

# Redirect logs to the destination
action(type="<module_name>")
```

The main components include:

- `input`: collects logs from various sources.
- `template`: modifies the log message format.
- `action`: delivers logs to different destinations.

Rsyslog uses modules extensively to accomplish its tasks.

### Rsyslog inputs

Rsyslog features modules designed to collect logs from various sources, identifiable by names starting with the `im` prefix. Here are a few examples of these input modules:

- [imhttp](https://www.rsyslog.com/doc/master/configuration/modules/imhttp.html): collects plaintext messages via HTTP.
  
- [imjournal](https://www.rsyslog.com/doc/master/configuration/modules/imjournal.html): fetches system journal messages into Syslog.
  
- [imfile](https://www.rsyslog.com/doc/master/configuration/modules/imfile.html): reads text files and converts their contents into Syslog messages.
  
- [imdocker](https://www.rsyslog.com/doc/master/configuration/modules/imdocker.html): collects logs from Docker containers using the Docker REST API.

### Rsyslog Message Modification Modules

For modifying log messages, Rsyslog provides [message modification modules](https://www.rsyslog.com/doc/master/configuration/modules/idx_messagemod.html) typically prefixed with `mm`:

- [mmjsonparse](https://www.rsyslog.com/doc/master/configuration/modules/mmjsonparse.html): parses structured log messages conforming to the CEE/lumberjack spec.

- [mmfields](https://www.rsyslog.com/doc/master/configuration/modules/mmfields.html): extracts specific fields from log entries.

- [mmkubernetes](https://www.rsyslog.com/doc/master/configuration/modules/mmkubernetes.html): adds Kubernetes metadata to each log event.

- [mmanon](https://www.rsyslog.com/doc/master/configuration/modules/mmanon.html): anonymizes IP addresses for privacy.

### Rsyslog output modules

Rsyslog offers a wide array of [output modules](https://www.rsyslog.com/doc/master/configuration/modules/idx_output.html), recognizable by names starting with the `om` prefix. These modules allow forwarding log messages to various destinations:

- [omfile](https://www.rsyslog.com/doc/master/configuration/modules/omfile.html): writes log entries to a file on the local system.

- [ommysql](https://www.rsyslog.com/doc/master/configuration/modules/ommysql.html): sends log entries to a MySQL database.

- [omrabbitmq](https://www.rsyslog.com/doc/master/configuration/modules/omrabbitmq.html): forwards log data to RabbitMQ, a popular message broker.

- [omelasticsearch](https://www.rsyslog.com/doc/master/configuration/modules/omelasticsearch.html): delivers log output to Elasticsearch, a robust search and analytics engine.

Now that you have an idea of the available Rsyslog modules and what they do, let's analyze the Rsyslog configuration file in greater detail.

## Understanding the Rsyslog configuration

When Rsyslog starts running on your system, it operates with a default configuration file. It collects logs from various processes and directs them to plain text files in the `/var/log` directories.

Rsyslog relies on rules predefined in the default configuration file. You can also define your own rules, global directives, or modules.

### Rsyslog rules

To comprehend how rules work, open the `50-default.conf` configuration file in your preferred text editor. This tutorial uses `nano`, a command-line text editor:

```command
sudo nano /etc/rsyslog.d/50-default.conf
```

In the initial part of the file, you'll find contents similar to this (edited for brevity):

```text
[label /etc/rsyslog.d/50-default.conf]
...
auth,authpriv.*                 /var/log/auth.log
*.*;auth,authpriv.none          -/var/log/syslog
#cron.*                         /var/log/cron.log
#daemon.*                       -/var/log/daemon.log
kern.*                          -/var/log/kern.log
...
```

The lines in the file are rules. A rule comprises a filter for selecting log messages and an action specifying the path to send the logs. Lines starting with `#` are comments and won't be executed.

Consider this line:

```text
kern.*                          -/var/log/kern.log
```

This line can be divided into a selector filtering syslog messages `kern.*` and an action specifying the path to forward the logs `-/var/log/kern.log`.

Let's examine the selector `kern.*` in detail. `kern.*` is a Facility/Priority-based filter, a commonly used method for filtering syslog messages.

`kern.*` can be interpreted as follows:

```text
FACILITY.PRIORITY
```

- **FACILITY**: a subsystem generating log messages. `kern` is an example of a facility alongside other subsystems like `authpriv`, `cron`, `user`, `daemon`, `mail`, `auth`, `syslog`, `lpr`, `news`, `uucp`, etc. To define all facilities, you can use `*`.

- **PRIORITY**: specifies the log message priority. Priorities include `debug`, `info`, `notice`, `warning`, `warn` (same as `warning`), `err`, `error` (same as err), `crit`, `alert`, `emerg`, `panic`. If you want to send logs with any priority level, you can use `*`. Optionally, you can use the priority keyword `none` for facilities without specified priorities.

Filter and action are separated by one or more spaces or tabs.

The last part, `-/var/log/kern.log`, is the action indicating the target file where content is sent.

In this configuration file, most rules direct output to various files, which you can find in `/var/log`.

Close the configuration file and use the following command to list all contents in the `/var/log` directory:

```command
ls -l /var/log/
```

The output will include files like:

```text
[output]
total 444
total 444
-rw-r--r--  1 root      root                 0 Oct 22 04:33 alternatives.log
drwxr-xr-x  2 root      root              4096 Oct 27 08:37 apt
[highlight]
-rw-r-----  1 syslog    adm               7596 Oct 27 08:44 auth.log
[/highlight]
-rw-r--r--  1 root      root                 0 Oct 22 04:33 bootstrap.log
-rw-rw----  1 root      utmp                 0 Feb 17  2023 btmp
[highlight]
-rw-r-----  1 syslog    adm             105503 Oct 27 08:33 cloud-init.log
-rw-r-----  1 root      adm               5769 Oct 27 08:33 cloud-init-output.log
[/highlight]
drwxr-xr-x  2 root      root              4096 Feb 10  2023 dist-upgrade
[highlight]
-rw-r-----  1 root      adm              46597 Oct 27 08:33 dmesg
[/highlight]
-rw-r--r--  1 root      root              6664 Oct 27 08:37 dpkg.log
-rw-r--r--  1 root      root             32032 Oct 27 08:33 faillog
drwxr-sr-x+ 4 root      systemd-journal   4096 Oct 27 08:33 journal
[highlight]
-rw-r-----  1 syslog    adm              70510 Oct 27 08:44 kern.log
[/highlight]
drwxr-xr-x  2 landscape landscape         4096 Oct 27 08:33 landscape
-rw-rw-r--  1 root      utmp            292292 Oct 27 08:35 lastlog
drwx------  2 root      root              4096 Feb 17  2023 private
[highlight]
-rw-r-----  1 syslog    adm             136675 Oct 27 08:44 syslog
[/highlight]
-rw-r--r--  1 root      root              4748 Oct 27 08:37 ubuntu-advantage.log
[highlight]
-rw-r-----  1 syslog    adm              10487 Oct 27 08:44 ufw.log
drwxr-x---  2 root      adm               4096 Oct 22 04:28 unattended-upgrades
[/highlight]
-rw-rw-r--  1 root      utmp              3840 Oct 27 08:35 wtmp
```

Most files Rsyslog creates belong to the `syslog` user and the `adm` group. Other applications besides Rsyslog also create logs in this directory, such as MySQL and Nginx.

This behavior of creating files with these attributes is defined in another default configuration file, `/etc/rsyslog.conf`.

### Rsyslog global directives and modules

When Rsyslog runs, it reads the `/etc/rsyslog.conf` file, another default configuration already defined. This file contains global directives, modules, and references to all the configuration files in the `/etc/rsyslog.d/` directory, including the `/etc/rsyslog.d/50-default.conf` we examined in the previous section.

Open the `/etc/rsyslog.conf` configuration file using the following command:

```command
nano /etc/rsyslog.conf
```

Locate the following section near the bottom of the file:

```text
[label /etc/rsyslog.conf]
...
#
# Set the default permissions for all log files.
#
$FileOwner syslog
$FileGroup adm
$FileCreateMode 0640
$DirCreateMode 0755
$Umask 0022
$PrivDropToUser syslog
$PrivDropToGroup syslog
...
```

In this file, there are properties such as `$FileOwner` and `$FileGroup` that specify the file owner and group, along with file permissions. If you need to change ownership, this is the section to look at. Any keyword prefixed with `$` is a variable you can modify.

Further down the configuration file, you'll find lines like:

```text
[output]
...
#
# Where to place spool and state files
#
$WorkDirectory /var/spool/rsyslog

#
# Include all config files in /etc/rsyslog.d/
#
$IncludeConfig /etc/rsyslog.d/*.conf
```

The `$WorkDirectory` specifies the location Rsyslog uses to store state files, and `$IncludeConfig` includes all the configuration files defined in the `/etc/rsyslog.d` directory. Rsyslog will read any configuration file you create in this directory. This is where you will define your custom configurations.

Now that you understand that Rsyslog has default configurations that route most system logs to various files in `/var/log`, you are ready to create a demo application that generates logs. Later, you'll configure Rsyslog to read these logs.

## Developing a demo logging application

In this section, you'll create a logging application built with the [Bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) scripting language. The application will generate JSON logs at regular intervals, simulating a high-traffic real-world application.

To begin, ensure you are in the `processing-stack/logify` directory and create a subdirectory for the demo logging application:

```command
mkdir logify
```

Navigate into the directory:

```command
cd logify
```

Next, create a `logify.sh` file:

```command
nano logify.sh
```

In your `logify.sh` file, add the following code to produce logs:

```bash
[label log-processing-stack/logify/logify.sh]
#!/bin/bash
filepath="/var/log/logify/app.log"

create_log_entry() {
    local info_messages=("Connected to database" "Task completed successfully" "Operation finished" "Initialized application")
    local random_message=${info_messages[$RANDOM % ${#info_messages[@]}]}
    local http_status_code=200
    local ip_address="127.0.0.1"
    local level=30
    local pid=$$
    local ssn="407-01-2433"
    local time=$(date +%s)
    local log='{"status": '$http_status_code', "ip": "'$ip_address'", "level": '$level', "msg": "'$random_message'", "pid": '$pid', "ssn": "'$ssn'", "time": '$time'}'
    echo "$log"
}

while true; do
    log_record=$(create_log_entry)
    echo "${log_record}" >> "${filepath}"
    sleep 3
done
```

The `create_log_entry()` function generates structured logs in JSON format with details, such as severity level, message, and HTTP status code. It then enters an infinite loop that repeatedly calls the `create_log_entry()` function to write logs to a specified file in the `/var/log/logify` directory.

When you finish writing the code, save and exit the file. Then make the file executable:

```command
chmod +x logify.sh
```

Next, create the `/var/log/logify` directory to store the application logs:

```command
sudo mkdir /var/log/logify
```

Assign the currently logged-in user in the `$USER` variable as the owner of the `/var/log/logify` directory:

```command
sudo chown -R $USER:$USER /var/log/logify/
```

Run the `logify.sh` script in the background:

```command
./logify.sh &
```

The `&` sign tells the OS to run the script in the background, allowing you to continue using the terminal for other tasks while the program runs.

When you press enter, the script will start running and you'll see something like:

```command
[1] 652089
```

Here, `652089` is the process ID, which can be used to terminate the script if needed.

Now, view the `app.log` contents with the `tail` command:

```command
tail -n 4 /var/log/logify/app.log
```

The output will show structured JSON logs similar to this:

```json
[output]
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Connected to database", "pid": 169516, "ssn": "407-01-2433", "timestamp": 1749119648}
{"status": 200, "ip": "127.0.0.1", "level": 30, "msg": "Operation finished", "pid": 652089, "ssn": "407-01-2433", "time": 1749119651}
{"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Task completed successfully", "pid": 169516, "ssn": "407-01-2433", "timestamp": 1749119651}
{"status": 200, "ip": "127.0.0.1", "level": 30, "msg": "Task completed successfully", "pid": 652089, "ssn": "407-01-2433", "time": 1749119654}
```

With the application generating structured JSON logs, you are now ready to use Rsyslog to read these log entries.

## Getting started with Rsyslog

Now that you have developed an application to produce logs at regular intervals, you will use Rsyslog to read the logs from a file and transform them into syslog messages stored under the `/var/log/syslog` file.

To begin, create a configuration file with a name of your choosing in the `/etc/rsyslog.d` directory:

```command
sudo nano /etc/rsyslog.d/51-rsyslog-logify.conf
```

In the `52-rsyslog-logify.conf` file, add the following configuration:

```text
[label /etc/rsyslog.d/51-rsyslog-logify.conf]
global(
  workDirectory="/var/spool/rsyslog"
)

# Load the imfile module to read logs from a file
module(load="imfile")

# Define a new input for reading logs from a file
input(type="imfile"
      File="/var/log/logify/app.log"
      Tag="FileLogs"
      PersistStateInterval="10"
      Facility="local0")

# Send logs with the specified tag to the console
if $syslogtag == 'FileLogs' then {
    action(type="omfile"
           file="/var/log/syslog")
}
```

In the first line, the `global()` directive configures the working directory to store state files. The files allow Rsyslog to track the parts of the logs it has processed.

Next, the `module()` method is used to load the [`imfile`](https://www.rsyslog.com/doc/v8-stable/configuration/modules/imfile.html) module, which is used to read logs from files.

Following that, you define an input using the `imfile` module to read logs from the specified path under the `File` parameter. You then add a tag, `FileLogs`,to each log entry processed, and the `PersistStateInterval` parameter specifies how often the state file should be written when reading the logs.

Finally, a conditional expression checks if the log tag equals the `FileLogs` tag. If true, an action using the `omfile` module is defined to forward the logs to the `/var/log/syslog` file.

After you are finished, save and exit the configuration file.

Before restarting Rsyslog, its a good idea to check the configuration file for syntax errors. Enter the following command to check if the configuration file has no syntax errors:

```command
rsyslogd -f /etc/rsyslog.d/51-rsyslog-logify.conf -N1
```

When the configuration file has no errors, you will see output similar to this:

```text
[output]
rsyslogd: version 8.2312.0, config validation run (level 1), master config /etc/rsyslog.d/51-rsyslog-logify.conf
rsyslogd: End of config validation run. Bye.
```

Now restart Rsyslog:

```command
sudo systemctl restart rsyslog.service
```

When Rsyslog restarts, it will start sending the logs to `/var/log/syslog`. To check the logs in real-time as they get written, enter the following command:

```command
sudo tail -f /var/log/syslog
```

The log entries will be displayed, showing the timestamp, hostname, log tag, and the log message:

```text
2025-06-05T10:35:36.187305+00:00 ubuntu FileLogs {"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Task completed successfully", "pid": 169516, "ssn": "407-01-2433", "timestamp": 1749119736}
2025-06-05T10:35:36.187305+00:00 ubuntu FileLogs {"status": 200, "ip": "127.0.0.1", "level": 30, "emailAddress": "user@mail.com", "msg": "Task completed successfully", "pid": 169516, "ssn": "407-01-2433", "timestamp": 1749119736}
2025-06-05T10:35:38.913045+00:00 ubuntu FileLogs {"status": 200, "ip": "127.0.0.1", "level": 30, "msg": "Initialized application", "pid": 652089, "ssn": "407-01-2433", "time": 1749119738}
2025-06-05T10:35:38.913045+00:00 ubuntu FileLogs {"status": 200, "ip": "127.0.0.1", "level": 30, "msg": "Initialized application", "pid": 652089, "ssn": "407-01-2433", "time": 1749119738}
...
```

 Since the `/var/log/syslog` file contains logs from other processes, it's common to see logs from sources such as `kernel`.

Now that Rsyslog can read application logs, you can further process the log messages as needed.

## Transforming Logs with Rsyslog

When Rsyslog reads log entries, you can transform them before sending them to the output. You can enrich them with new fields or format them differently. One common transformation is formatting logs as JSON using Rsyslog templates.

### Formatting logs in JSON with Rsyslog templates

Rsyslog allows you to format logs into various formats using [templates](https://www.rsyslog.com/doc/v8-stable/configuration/templates.html). By default, Rsyslog automatically formats log messages, even if no templates are specified, using its built-in templates. However, you might want to format your logs in JSON, which is structured and machine parsable.

If you look at the logs Rsyslog is currently formatting, you will notice that the logs are not structured:

```text
2025-06-05T10:35:38.913045+00:00 ubuntu FileLogs {"status": 200, "ip": "127.0.0.1", "level": 30, "msg": "Initialized application", "pid": 652089, "ssn": "407-01-2433", "time": 1749119738}
```

Many remote destinations prefer structured logs, so it's a good practice to structure the log messages.

In Rsyslog, you can use templates with the `template()` object to modify and structure logs. Open the configuration file:

```command
sudo nano /etc/rsyslog.d/51-rsyslog-logify.conf
```

Add the template to the configuration file:

```text
[label /etc/rsyslog.d/51-rsyslog-logify.conf]
...
input(type="imfile"
      File="/var/log/logify/app.log"
      Tag="FileLogs"
      PersistStateInterval="10"
      Facility="local0")

[highlight]
template(name="json-template" type="list" option.jsonf="on") {
    property(outname="@timestamp" name="timereported" dateFormat="rfc3339" format="jsonf")
    property(outname="host" name="hostname" format="jsonf")
    property(outname="severity" name="syslogseverity" caseConversion="upper" format="jsonf" datatype="number")
    property(outname="facility" name="syslogfacility" format="jsonf" datatype="number")
    property(outname="syslog-tag" name="syslogtag" format="jsonf")
    property(outname="source" name="app-name" format="jsonf" onEmpty="null")
    property(outname="message" name="msg" format="jsonf")
}
[/highlight]

if $syslogtag == 'FileLogs' then {
    action(
        type="omfile"
        file="/var/log/syslog"
[highlight]
        template="json-template"
[/highlight]
    )
}
```

In the configuration above, you define a `json-template` template using the `template()` object. This template formats the syslog message as JSON. The template includes various [property statements](https://www.rsyslog.com/doc/v8-stable/configuration/templates.html#property-statement) to add fields to the syslog message. Each property statement specifies the `name` of the property to access and the `outname`, which defines the output field name in the JSON object. The `format` parameter is set to `"jsonf"` to format the property as JSON. Some properties include a timestamp, host, syslog-tag, and the syslog message itself.

Finally, you add the `template` parameter in the action section, referencing the newly defined `json-template`.

After saving your file, restart Rsyslog:

```command
sudo systemctl restart rsyslog
```

Now, check the logs being written:

```command
sudo tail -f /var/log/syslog
```

The output shows that the syslog messages are now formatted as JSON. They also include additional fields that provide more context:

```json
{"@timestamp":"2025-06-05T10:40:25.189748+00:00", "host":"ubuntu", "severity":5, "facility":16, "syslog-tag":"FileLogs", "source":"FileLogs", "message":"{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Task completed successfully\", \"pid\": 169516, \"ssn\": \"407-01-2433\", \"timestamp\": 1749120025}"}
...
```

The logs in the output are now structured in JSON format and contain more detailed information. Next, you will add custom fields to the log event.

### Adding Custom Fields with Rsyslog

In Rsyslog, you can add custom fields to log entries using [constant statements](https://www.rsyslog.com/doc/v8-stable/configuration/templates.html#constant-statement). These statements allow you to insert fixed values into log messages.

First, open the configuration file:

```command
sudo nano /etc/rsyslog.d/51-rsyslog-logify.conf
```

Add a new constant statement to include a custom field called `environment` with the value `dev`:

```text
[label /etc/rsyslog.d/52-rsyslog-logify.conf]
template(name="json-template" type="list" option.jsonf="on") {
    property(outname="@timestamp" name="timereported" dateFormat="rfc3339" format="jsonf")
    property(outname="host" name="hostname" format="jsonf")
    property(outname="severity" name="syslogseverity" caseConversion="upper" format="jsonf" datatype="number")
    property(outname="facility" name="syslogfacility" format="jsonf" datatype="number")
    property(outname="syslog-tag" name="syslogtag" format="jsonf")
    property(outname="source" name="app-name" format="jsonf" onEmpty="null")
    property(outname="message" name="msg" format="jsonf")
[highlight]
    constant(outname="environment" value="dev" format="jsonf")
[/highlight]
}
```

In the configuration above, a `constant` statement has been added with the `outname` set to `environment` and the `value` set to `dev`. This constant statement inserts a fixed field named `environment` with the value `dev` into each log entry.

Save and exit the configuration file. Then, restart Rsyslog to apply the changes:

```command
sudo systemctl restart rsyslog
```

To verify if the custom field has been added, tail the syslog file:

```command
sudo tail -f /var/log/syslog
```

You will observe that Rsyslog has included an `environment` field in each log entry at the end of the log event:

```json
{"@timestamp":"2025-06-05T10:42:31.631819+00:00", "host":"ubuntu", "severity":5, "facility":16, "syslog-tag":"FileLogs", "source":"FileLogs", "message":"{\"status\": 200, \"ip\": \"127.0.0.1\", \"level\": 30, \"emailAddress\": \"user@mail.com\", \"msg\": \"Operation finished\", \"pid\": 169516, \"ssn\": \"407-01-2433\", \"timestamp\": 1749120151}", "environment": "dev"}
```

Now that you can add custom fields to log events, you are ready to forward logs to Better Stack.


## Configuring Rsyslog with Better Stack

Better Stack provides an automated setup script that configures Rsyslog to forward logs. Run the following command, replacing `$SOURCE_TOKEN` with your actual source token from Better Stack:

```command
wget -qO- https://telemetry.betterstack.com/rsyslog/$SOURCE_TOKEN | sudo sh
```

This script will automatically:
- Detect your system configuration
- Create the necessary Rsyslog configuration for Better Stack as `70-logtail.conf`
- Set up secure TLS connections to Better Stack's servers


If you want the simplest path, watch the quick walkthrough below. It shows how to set up a Better Stack collector and start shipping logs from a Docker or Kubernetes environment in minutes, with sensible defaults for batching, compression, and sampling.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/_pv2tKoBnGo" title="Ship logs to Better Stack with the collector" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

If you prefer to keep using your existing Rsyslog pipeline, skip the video and follow the step by step instructions in this section.


First, install the required TLS package for secure log forwarding:

```command
sudo apt-get install rsyslog-gnutls
```

Next, create a free [Better Stack account](https://telemetry.betterstack.com/users/sign-up). Once registered, proceed to the **Sources** section in your dashboard and click the **Connect source** button:

![Screenshot with an arrow pointing to the "Connect source"](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/84a7ceaa-e302-4357-7bc2-79c6ecdc5a00/md1x =3024x1530)


Provide a name for your source, such as "Logify logs," and select "Rsyslog" as the platform:

![Screenshot of the Better Stack interface with the source filled as "Logify logs" and platform chosen as "Rsyslog"](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5ad0c44e-4e5c-4feb-f492-ad3f59058900/lg1x =3024x3928)

After creating the source, copy the **Source Token** and **Ingesting Host** provided by Better Stack:

![Screenshot showing an arrow pointing at the "Source Token" field](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/48d4cdc5-8558-43a3-89f9-20a2096a0000/public =3024x1502)


If you want a quick overview of how sources work in Better Stack, watch the short video below.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/_V81nd6P1iI" title="Better Stack sources overview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


Run the following command, replacing `$SOURCE_TOKEN` with your actual source token from Better Stack:

```command
wget -qO- https://telemetry.betterstack.com/rsyslog/$SOURCE_TOKEN | sudo sh
```
```text
[output]
Starting Betterstackdata.com automatic rsyslog setup

Setting up rsyslog...

[0/3] Checking prerequisites
- wget OK

[1/3] Testing Let's Encrypt SSL certificates setup
- curl OK
- OK

[2/3] Writing rsyslog configuration into /etc/rsyslog.d/70-logtail.conf

[3/3] Restarting rsyslog

Better Stack rsyslog setup is complete.
```

This script will automatically:
- Detect your system configuration
- Create the necessary Rsyslog configuration for Better Stack
- Set up secure TLS connections to Better Stack's servers

However, since you want to send only your logify application logs (not all system logs), you need to modify the generated configuration to specifically target your application logs.


After running the Better Stack setup script, you need to customize the `70-logtail.conf` file to read logs from your logify application. 

Open the Better Stack configuration file for editing:

```command
sudo nano /etc/rsyslog.d/70-logtail.conf
```

The file will contain the Better Stack forwarding configuration. You need to add the file reading configuration at the beginning of this file. Add the following lines at the very top of the file, before any existing content:

```text
[label /etc/rsyslog.d/70-logtail.conf]
global(DefaultNetstreamDriverCAFile="/etc/ssl/certs/ca-certificates.crt")
[highlight]
global(
  workDirectory="/var/spool/rsyslog"
)

# Load the imfile module to read logs from a file
module(load="imfile")

# Define a new input for reading logs from a file
input(type="imfile"
      File="/var/log/logify/app.log"
      Tag="FileLogs"
      PersistStateInterval="10"
      Facility="local0")
[/highlight]

template(name="LogtailFormat" type="list") {
  ...
}
# Existing Better Stack configuration below...

```

Next, you need to modify the action section to only send your logify logs to Better Stack. Find the `action` section in the file (it will contain `type="omfwd"`) and wrap it with a conditional statement.

The generated configuration will look like this:

```text
[label /etc/rsyslog.d/70-logtail.conf]
...
action(
 type="omfwd"
 protocol="tcp"
 target="YOUR_INGESTING_HOST"
 port="6514"
 template="LogtailFormat"
 TCP_Framing="octet-counted"
 StreamDriver="gtls"
 StreamDriverMode="1"
 StreamDriverAuthMode="x509/name"
 StreamDriverPermittedPeers="*.betterstackdata.com"
 queue.spoolDirectory="/var/spool/rsyslog"
 queue.filename="logtail"
 queue.maxdiskspace="75m"
 queue.type="LinkedList"
 queue.saveonshutdown="on"
)
```

**Important**: You must wrap this entire `action` block with a conditional statement to filter only your logify logs. Modify it to:

```text
[label /etc/rsyslog.d/70-logtail.conf]
# Send only FileLogs (our logify application) to Better Stack
[highlight]
if $syslogtag == 'FileLogs' then {
[/highlight]
    action(
     type="omfwd"
     protocol="tcp"
     target="YOUR_INGESTING_HOST"
     port="6514"
     template="LogtailFormat"
     TCP_Framing="octet-counted"
     StreamDriver="gtls"
     StreamDriverMode="1"
     StreamDriverAuthMode="x509/name"
     StreamDriverPermittedPeers="*.betterstackdata.com"
     queue.spoolDirectory="/var/spool/rsyslog"
     queue.filename="logtail"
     queue.maxdiskspace="75m"
     queue.type="LinkedList"
     queue.saveonshutdown="on"
    )
[highlight]
}
[/highlight]
```

Without this conditional statement, Rsyslog will send ALL system logs to Better Stack, not just your logify application logs.


Since you're now reading logs directly in the Better Stack configuration, remove your previous local configuration to avoid conflicts:

```command
sudo rm /etc/rsyslog.d/51-rsyslog-logify.conf
```


Before restarting Rsyslog, validate your configuration file for syntax errors:

```command
rsyslogd -f /etc/rsyslog.d/70-logtail.conf -N1
```

When the configuration file has no errors, you will see output similar to this:

```text
[output]
rsyslogd: version 8.2312.0, config validation run (level 1), master config /etc/rsyslog.d/70-logtail.conf
rsyslogd: End of config validation run. Bye.
```

Now restart Rsyslog to apply the new configuration:

```command
sudo systemctl restart rsyslog
```

To verify that your logs are being sent to Better Stack, first ensure your logify script is still running:

```command
ps aux | grep logify
```
```text
[output]
dev       169516  0.0  0.0   7740  3456 ?        S    Jun02   3:06 /bin/bash ./logify.sh
```

If the script is not running, restart it:

```command
cd log-processing-stack/logify
./logify.sh &
```


To monitor the log forwarding process, check the Rsyslog service status:

```command
sudo systemctl status rsyslog
```

You can also monitor Rsyslog's activity in real-time:

```command
sudo journalctl -u rsyslog -f
```


After a few moments, navigate to your Better Stack dashboard and go to "Live tail." You should see your logify application logs appearing in real-time:

![View real-time logs in Live Tail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2befa9d6-3836-4282-1d46-0bc70685f900/lg2x =3024x1530)

If you want a quick tour of Live Tail and how to drill into individual log events, watch the walkthrough below.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="Better Stack Live Tail walkthrough" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


Click on any log entry to view its detailed information:

![View log entry details](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/87e5f197-5552-4405-84cf-3979e92efc00/lg2x =3024x1530)


[summary]

## Side note: Visualize and explore your logs in Better Stack

Once your logs are flowing, you can go beyond search and use Better Stack to visualize patterns over time.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]



## Final thoughts

In this comprehensive guide, you explored the functionality and flexibility of Rsyslog for effective log management. You began by learning how Rsyslog works, then progressed to using it to read logs from various programs, transform log data into JSON format, and add custom fields.

Finally, you configured Rsyslog to forward logs to Better Stack.

With this foundation, you're now well-prepared to integrate Rsyslog into your own projects. To deepen your understanding, check out the [official Rsyslog documentation](https://www.rsyslog.com/).

While Rsyslog is a powerful log shipper, there are several other tools available. To compare alternatives and choose the right solution for your needs, explore our [log shippers guide](https://betterstack.com/community/guides/logging/log-shippers-explained/).


Thank you and happy logging!