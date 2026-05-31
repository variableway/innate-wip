# A Complete Guide to Managing Log Files with Logrotate

Controlling the sizes of log files on a Linux server is crucial due to their
continuous growth. As log files accumulate, they can consume valuable storage
space, strain server resources, and cause performance and memory issues.

To
address this problem, log rotation is commonly employed. It involves renaming or
compressing log files before they become too large, while also removing or
archiving old logs to free up storage space.

On most Linux distributions, the
preferred tool for log rotation is the
[logrotate](https://github.com/logrotate/logrotate) program, which we will be
focusing on in this tutorial.

Let's get started!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/-tM6DsYam0c" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Prerequisites

Before proceeding with the rest of this tutorial, please ensure that you have:

- A basic knowledge of working with the Linux command line.
- A Linux server that includes the non-root user with `sudo` access. We'll be
  using Ubuntu 22.04 throughout in this guide but everything should work even if
  you're on some other distribution.
- Prior knowledge of [how to work with system log files on
  Linux](https://betterstack.com/community/guides/logging/how-to-view-and-configure-linux-logs-on-ubuntu-20-04/) and [Journalctl](https://betterstack.com/community/guides/logging/how-to-control-journald-with-journalctl/).

[ad-logs]

## Why file-based logging matters

Sending your application logs to a file is the first step towards persisting
them and making them available for historical analysis, auditing, and
troubleshooting, although you'll likely want to [aggregate them in the
cloud](https://betterstack.com/community/guides/logging/log-aggregation/) to unlock the full potential of your log data.

Even when you've adopted a log management service like
[Better Stack](https://betterstack.com/uptime), we generally don't recommend sending
the logs to the service directly from the application code for a few reasons:

1. If a network connection or logging endpoint becomes temporarily unavailable,
   the application has to attempt resource-intensive retry logic to resume log
   streaming, which could impact overall performance.

2. If there's a persistent outage, the logs could be dropped and lost forever
   which could impact the troubleshooting process, ability to comply with
   regulations, or even conduct security investigations.

Therefore, we recommend persisting your logs to a local file to provide some
redundancy, then use a log forwarder like [Vector](https://vector.dev/) to
transmit them to their final destination.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/8NMpHrVnJes" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

This approach has a few notable
advantages:

1. It decouples the log generation process from the log transmission process.
   This separation of concerns allows the application to focus on its core
   functionality without being concerned about the intricacies of log
   transmission. It also simplifies application development and maintenance, as
   you can rely on the log forwarder to handle the complexities of log delivery.

2. Log forwarders can typically aggregate logs from multiple sources, such as
   different applications or servers, into a centralized location and this
   flexibility allows you to adapt your log management infrastructure as your
   needs evolve, without requiring changes to individual applications.

3. Log forwarders can handle network disruptions, retries, and buffering of log
   data so that the log data is delivered reliably even in the event of an
   extended outage.

4. They can support different log formats and protocols, making it easier to
   send logs to multiple destinations or perform transformations on the log
   data.

## The necessity of log rotation

Once you've started persisting your logs to local files, you'll need to
implement a process for keeping individual files from becoming too large, and
also a way to remove or archive older logs that are no longer needed to free up
disk space.

When log files get too large, they become tedious to work with and searching for
the records relevant to your current tasks can take a long time due to the large
volume of records.

Therefore, implementing log rotation to spread the log data over several files
and to remove older items is a must. It involves renaming log files on a
predefined schedule or when the file reaches a predefined size. Once the
specified condition is met, the log file is renamed to preserve its contents and
make way for a new file.

Typically an auto incrementing number or timestamp is appended to the filename
to indicate its time of rotation which is often helpful in narrowing down your
search when investigating an issue that occurred on a specific date.

After the file is renamed, a new log file with the same name is created to
capture the latest entries from the application or service. A cleanup process is
also initiated to prevent an accumulation of rotated log files as older logs
beyond a specified retention period are removed. This process repeats
indefinitely as long as the log rotation mechanism is working.

## Getting started with Logrotate

The `logrotate` daemon is pre-installed and active by default in Ubuntu and most
mainstream Linux distributions. If Logrotate is not installed on your machine,
ensure to install it first through your distribution's package manager.

```command
logrotate --version
```

```text
[output]
logrotate 3.19.0

    Default mail command:       /usr/bin/mail
    Default compress command:   /bin/gzip
    Default uncompress command: /bin/gunzip
    Default compress extension: .gz
    Default state file path:    /var/lib/logrotate/status
    ACL support:                yes
    SELinux support:            yes
```

The Logrotate daemon uses configuration files to specify all the log rotation
details for an application. The default setup consists of the following aspects:

- `/etc/logrotate.conf`: this is the main configuration file for the Logrotate
  utility. It defines the global settings and defaults for log rotation that are
  applied to all log files unless overridden by individual Logrotate
  configuration files in the `/etc/logrotate.d/` directory.
- `/etc/logrotate.d`: this directory includes files that configure log rotation
  policies specific to the log files produced by a individual applications or
  services.

We will examine both configuration possibilities below.

### The main Logrotate configuration

First off, let's view the main Logrotate configuration file at
`/etc/logrotate.conf`. Go ahead and print its contents with the `cat` utility:

```command
cat /etc/logrotate.conf
```

The command above prints the entire contents of this file:

```text
# see "man logrotate" for details

# global options do not affect preceding include directives

# rotate log files weekly
weekly

# use the adm group by default, since this is the owning group
# of /var/log/syslog.
su root adm

# keep 4 weeks worth of backlogs
rotate 4

# create new (empty) log files after rotating old ones
create

# use date as a suffix of the rotated file
#dateext

# uncomment this if you want your log files compressed
#compress

# packages drop log rotation information into this directory
include /etc/logrotate.d

# system-specific logs may also be configured here.
```

Here's a description of what each of the above configuration directives mean
(lines that begin with `#` indicate a comment):

- `weekly`: represents the frequency of log rotation. Alternatively, you can
  specify another time interval (`hourly`, `daily`, `monthly`, or `yearly`).
  Since the `logrotate` utility is typical run once per day, you may need to
  change this configuration if a if a shorter rotation frequency than `daily` is
  desired ([see below](#changing-the-system-logrotate-schedule)).
- `su root adm`: log rotation is performed with the root user and admin group.
  By using this directive, you can ensure that the rotated log files are owned
  by a specific user and group, which can be useful for access control and
  permissions management. This is particularly relevant when the log files need
  to be accessed or managed by a specific user or group with appropriate
  privileges.
- `rotate 4`: log files are rotated four times before old ones are removed. If
  `rotate` is set to zero, then the old versions are removed immediately and not
  rotated. If it is set to `-1`, the older logs will not be remove at all except
  if affected by `maxage`.
- `create`: immediately after rotation, create a new log file with the same name
  as the one just rotated.
- `dateext`: if this option is enabled, rotated log files will be renamed by
  appending a date to their filenames, allowing for better organization and
  differentiation of log files based on the date of rotation (especially when
  the frequency of rotation is `daily` or greater). The default scheme for
  rotated files is `logname.1`, `logname.2`, and so on, but enabling this option
  changes it to `logname.YYYYMMDD`. You can change the date format through the
  `dateformat` and `dateyesterday` directives.
- `compress`: this rule determines whether old log files should be compressed
  (using gzip by default) or not. Log compression is turned off by default but
  you can enable it to save on disk space.
- `include`: this directive is used to include additional configuration files or
  snippets. It allows you to modularize and organize your Logrotate
  configuration by splitting it into multiple files. In this case, the files in
  the `/etc/logrotate.d` directory have been included in the configuration.

As noted earlier, the `/etc/logrotate.conf` file serves as a global
configuration file for Logrotate, providing default settings and options for log
rotation across the system. It sets the stage for log rotation but can be
extended or overridden by the configuration files in the `/etc/logrotate.d/`
directory which typically configure the rotation policy for specific application
logs.

### Application-specific configuration

Next, let's view the contents of the `/etc/logrotate.d` directory. It typically
contains additional Logrotate configuration files for various applications or
services installed on your machine:

```command
ls /etc/logrotate.d/
```

```text
[output]
alternatives  apt      btmp  rsyslog                 ufw                  wtmp
apport        bootlog  dpkg  ubuntu-advantage-tools  unattended-upgrades
```

You will observe that quite a few programs have their log rotation configuration
in this directory. Each configuration file within `/etc/logrotate.d/` focuses on
a particular application or log file set, specifying the log file path, rotation
frequency, compression settings, and any additional directives necessary for
managing the logs of that specific application or service.

Having separate configuration files in this directory allows for easy
customization and maintenance of log rotation settings for individual
applications or services without affecting other log files. For example, let's
take a look at the config file for [the Rsyslog
utility](https://betterstack.com/community/guides/logging/how-to-configure-centralised-rsyslog-server/) through the `cat` command:

```command
cat /etc/logrotate.d/rsyslog
```

You'll see the program's output appear on the screen:

```text
[output]
/var/log/syslog
/var/log/mail.info
/var/log/mail.warn
/var/log/mail.err
/var/log/mail.log
/var/log/daemon.log
/var/log/kern.log
/var/log/auth.log
/var/log/user.log
/var/log/lpr.log
/var/log/cron.log
/var/log/debug
/var/log/messages
{
        rotate 4
        weekly
        missingok
        notifempty
        compress
        delaycompress
        sharedscripts
        postrotate
                /usr/lib/rsyslog/rsyslog-rotate
        endscript
}
```

The above configuration specifies the rotation rules for several log files
located in the `/var/log/` directory. It also includes the following directives
in addition to the ones we examined in the previous section:

- `missingok`: continue log rotation without reporting any error if any of the
  specified log files are missing.
- `notifempty`: ensures that log files are not rotated if they are empty. If a
  log file is empty, it won't trigger rotation.
- `delaycompress`: delays compression of the rotated log files until the next
  rotation cycle. This allows for the previous log file to be available for
  analysis before compression.
- `sharedscripts`: ensures that the commands or scripts specified in the
  `prerotate` or `postrotate` directive are executed only once, regardless of
  the number of log files being rotated. By default, `logrotate` executes the
  commands/scripts separately for each log file being rotated.
- `postrotate` and `endscript`: encloses the commands or scripts to be executed
  after log rotation. In this case, the `/usr/lib/rsyslog/rsyslog-rotate` script
  is executed after a successful rotation. It sends the `SIGHUP` signal to the
  Rsyslog service so that it can close and reopen the log file for writing.

Overall, this configuration ensures that the specified log files are rotated
weekly, compressed, and limited to a maximum of `4` rotated log files. It also
includes additional directives for handling missing or empty log files and
executes a post-rotation script specific to Rsyslog.

Other useful directives to note include:

- `size`: specifies the maximum size in bytes, kilobytes, megabytes, or
  gigabytes that a log file can reach before rotation is initiated. This causes
  the default schedule to be ignored if as long as `size` is specified after the
  time directive (`hourly`, `daily`, etc).

```text
[label /etc/logrotate.d/myapp]
/var/log/myapp.log {
    daily
    [highlight]
    size 10M
    [/highlight]
    . . .
}
```

In this example, Logrotate will trigger rotation when myapp.log reaches 10
megabytes in size. Once the size threshold is crossed, rotation will be
initiated regardless of the time schedule (`daily` in this case).

- `minsize`: the log files are rotated according to the specified time schedule,
  but not before the specified size is reached. Therefore, when `minsize` is
  used, both file size and timestamp are considered to determine if the file
  should be rotated.

```text
[label /etc/logrotate.d/myapp]
/var/log/myapp.log {
    daily
    [highlight]
    minsize 10M
    [/highlight]
    . . .
}
```

When using `minsize`, rotation will not occur until the file reaches a minimum
of 10 megabytes even if the daily schedule is met.

- `maxsize`: specifies that the log files are rotated once they exceed the
  stated file size, even when the time interval has not yet been reached.

```text
[label /etc/logrotate.d/myapp]
/var/log/myapp.log {
    weekly
    [highlight]
    maxsize 10M
    [/highlight]
    . . .
}
```

In this snippet, rotation will occur when a size of 10 megabytes is reached.
Otherwise, it will rotate weekly.

[summary]
### Centralize your rotated logs with Better Stack
While Logrotate manages file rotation and compression on your servers, [Better Stack](https://betterstack.com/log-management) provides centralized log management with SQL queries, anomaly detection, and real-time alerts. Forward logs using Vector, rsyslog, or OpenTelemetry—retain and query everything without archiving to S3.
**Predictable pricing starting at $0.25/GB.** Start free in minutes.
[/summary]
![Better Stack log management dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)

## Choosing the appropriate log rotation strategy

Logrotate offers two directives that specify how the log rotation should be
handled: `create` and `copytruncate`. The former is the default, and its works
by renaming a log file (say `myapp.log`) to `myapp.log.1`, before creating a new
`myapp.log` file will be created to continue logging.

![mermaid-diagram-2023-05-04-134302.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ea357635-b203-4dbe-41ce-5dc8675f4800/md1x =1116x979)

```text
[label /etc/logrotate.d/myapp]
/var/log/myapp.log {
    rotate 7
    [highlight]
    create
    [/highlight]
    . . .
}
```

In `copytruncate` mode, the `myapp.log` file is copied to a new `myapp.log.1`
file, then the original file is emptied (truncated), allowing the application to
continue writing to it as if it were a new file. This mode is useful if your
application or process does not handle log file rotation gracefully by
automatically switching to the new log file after rotation.

![mermaid-diagram-2023-05-04-133432.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6775f924-de3c-463a-c697-efc1a3a6ed00/orig =1116x979)

```text
[label /etc/logrotate.d/myapp]
/var/log/myapp.log {
    rotate 7
    [highlight]
    copytruncate
    [/highlight]
    . . .
}
```

It's worth noting that while `copytruncate` avoids interrupting the logging
process, it may cause a brief period of log loss during the rotation process
since the original file is truncated. However, this is usually acceptable for
applications that don't rely on continuous log analysis and can tolerate
occasional gaps in the logs.

## Configuring log rotation for a custom application

So far, we've seen how Logrotate can be used to manage the log files for system
services and pre-installed utilities on your Linux server. Now, let's look at
how to do the same thing for custom applications or services that you've
deployed to the server.

To simulate an application that writes logs continuously to a file, create the
following bash script somewhere on your filesystem. It writes fictional but
realistic-looking log records to a file every second:

```bash
[label logify.sh]
#!/bin/bash

logfile="/var/log/logify/log_records.log"

# Function to generate a random log record
generate_log_record() {
    local loglevel=("INFO" "WARNING" "ERROR")
    local services=("web" "database" "app" "network")
    local timestamps=$(date +"%Y-%m-%d %H:%M:%S")
    local random_level=${loglevel[$RANDOM % ${#loglevel[@]}]}
    local random_service=${services[$RANDOM % ${#services[@]}]}
    local message="This is a sample log record for ${random_service} service."

    echo "${timestamps} [${random_level}] ${message}"
}

# Main loop to write log records every second
while true; do
    log_record=$(generate_log_record)
    echo "${log_record}" >> "${logfile}"
    sleep 1
done
```

Save the file, then make it executable:

```command
chmod +x logify.sh
```

Afterward, create the `/var/log/logify` directory using elevated privileges,
then change the ownership of the directory to your user so that the script can
write files to the directory:

```command
sudo mkdir /var/log/logify
```

```command
sudo chown -R $USER:$USER /var/log/logify/
```

You can now execute the script and it should begin to write the logs to the file
every second:

```command
./logify.sh
```

```command
cat /var/log/logify/log_records.log
```

```text
[output]
2023-04-29 08:07:25 [WARNING] This is a sample log record for database service.
2023-04-29 08:07:26 [ERROR] This is a sample log record for app service.
2023-04-29 08:07:27 [INFO] This is a sample log record for app service.
2023-04-29 08:07:28 [ERROR] This is a sample log record for app service.
2023-04-29 08:07:29 [INFO] This is a sample log record for database service.
2023-04-29 08:07:31 [ERROR] This is a sample log record for web service.
2023-04-29 08:07:32 [INFO] This is a sample log record for network service.
2023-04-29 08:07:33 [INFO] This is a sample log record for network service.
. . .
```

At this stage, you must set up a log rotation policy to prevent the
`log_records.log` file from growing too large and taking up valuable disk space
on the server. There are two main options for doing this:

1. Create a new Logrotate configuration file and place it in the
   `/etc/logrotate.d/` directory to perform log rotation according to the
   system's default schedule (it runs once per day by default
   [but you can change it](#changing-the-system-logrotate-schedule).

2. Create the configuration file that is independent of the system's Logrotate
   schedule and execute Logrotate at your preferred pace using through a
   cronjob.

### Creating a standard Logrotate configuration

In this section, you will create a standard configuration file for your
application logs and place it in the `/etc/logrotate.d/` directory. Go ahead and
create a new `logify` file in the `/etc/logrotate.d/` directory with your text
editor:

```command
sudo nano /etc/logrotate.d/logify
```

Add the following text to the file:

```text
/var/log/logify/*.log
{
    daily
    missingok
    rotate 7
    compress
    notifempty
}
```

The configuration above applies to all the files ending with `.log` in the
`/var/log/logify/` directory. We've already discussed what each directive here
does earlier, so we won't go over that again here.

Save the file and test the new configuration by executing the command below. The
`--debug` option instructs `logrotate` to operate in test mode where only debug
messages are printed.

```command
sudo logrotate /etc/logrotate.conf --debug
```

You should spot an entry for the `logify` configuration that looks similar to
what is displayed below:

```text
[output]
. . .

rotating pattern: /var/log/logify/*.log
 after 1 days (7 rotations)
empty log files are not rotated, old logs are removed
considering log /var/log/logify/log_records.log
Creating new state
  Now: 2023-04-29 10:35
  Last rotated at 2023-04-29 10:00
  log does not need rotating (log has already been rotated)

. . .
```

The above output indicates that the configuration file at
`/etc/logrotate.d/logify` has been found by the `logrotate` program. Therefore,
the log files specified therein will now be rotated according to the defined
policy along with the other system and application logs.

If you want to test that the log rotation works without without waiting for the
specified schedule, you can use the `-f/--force` option like this:

```command
sudo logrotate -f /etc/logrotate.d/logify
```

You will observe that the old log file was renamed and compressed and a new one
was created:

```command
ls /var/log/logify/
```

```text
[output]
log_records.log  log_records.log.1.gz
```

Another way to verify if a particular log file is rotating or not, and to check
the last date and time of its rotation, examine the `/var/lib/logrotate/status`
file (or `/var/lib/logrotate/logrotate.status` on Red Hat systems) like this:

```command
sudo cat /var/lib/logrotate/status | grep 'logify'
```

```text
[output]
"/var/log/logify/log_records.log" 2023-4-29-10:39:50
```

### Creating a system-independent Logrotate configuration

As mentioned earlier, a system-independent Logrotate configuration is one that
is not run on the default system schedule. Such a configuration will not be
included in the `/etc/logrotate.d/` directory. Instead, you place the file in
some other directory and create a cron job that will execute Logrotate with the
configuration file at custom time interval.

Change into your home directory, and create a `logify` directory therein:

```command
cd ~
```

```command
mkdir logify
```

Next, edit your `logify.sh` script and change the `logfile` variable to the
following:

```bash
logfile="$HOME/logify/log_records.log"
```

Afterward, rerun the script so that the logs are now written to the `~/logify`
directory:

```command
./logify
```

To create a system-independent Logrotate configuration for these logs, you must
create your configuration file outside of `/etc/logrotate.d/`. Therefore, go
ahead and create a `logrotate.conf` file within the `~/logify` directory:

```command
nano ~/logify/logrotate.conf
```

Populate the file with the following contents:

```text
[label logify/logrotate.conf]
/home/<user>/logify/*.log
{
    hourly
    missingok
    rotate 7
    compress
    notifempty
}
```

This configuration is the same as in the previous section, except that `daily`
has been changed to `hourly` so that the log files are rotated every hour
instead of once per day.

You also need to create a Logrotate state file which stores information such as
the last rotation date and time, the number of rotations performed, and other
relevant details. This allows Logrotate to accurately perform rotations and
prevent unnecessary rotations when they are not required.

In the default Logrotate setup, the state file is located in the
`/var/lib/logrotate/` directory. However, we will create a custom one through
the command below:

```command
logrotate ~/logify/logrotate.conf --state ~/logify/logrotate.state
```

The `--state` option tells `logrotate` to use an alternative state file located
at `~/logify/logrotate.state`. The `logrotate` command will create this file if
it doesn't already exist, and you can view its content with `cat`:

```command
cat /home/<user>/logify/logrotate.state
```

You'll see the program's output appear on the screen:

```text
[output]
logrotate state -- version 2
"/home/<user>/logify/log_records.log" 2023-4-29-20:0:0
```

The output indicates that Logrotate identified the relevant log file and when it
last considered them for rotation. The next step here is to set up a [cron
job](https://betterstack.com/community/guides/linux/cron-jobs-getting-started/) to execute the `logrotate` file at your desired
frequency (hourly in this case).

Go ahead and open the cron jobs configuration file by executing `crontab -e` in
your terminal:

```command
crontab -e
```

The `-e` option is used to edit the current user's cron jobs using the editor
specified by the `$VISUAL` or `$EDITOR` environmental variables. The above
command should open a configuration file in your preferred text editor specified
by one of these variables.

At the bottom of the file, add the following line:

```text
0 * * * * /usr/sbin/logrotate /home/<user>/logify/logrotate.conf --state /home/<user>/logify/logrotate.state
```

This new line specifies that the cron job will be executed every hour (at minute
0), and the `logrotate` command will run with your custom configuration and
state file. The full path of the `logrotate` binary is used here just to be
safe.

Save and close the modified file. You will observe the following output:

```text
crontab: installing new crontab
```

Now that your log rotation policy is all set up, you can view the `~/logify`
directory after an hour to confirm that the log file therein are rotated
according to the defined policy. For more details about cron jobs [see the
following tutorial](https://betterstack.com/community/guides/linux/cron-jobs-getting-started/) or type `man cron` in your
terminal.

## Changing the system Logrotate schedule

As mentioned earlier, when using the default system configuration, Logrotate
only runs once per day which means using the `hourly` option in a configuration
will be ineffective. However, you can modify this behaviour by changing the
location of the script that runs Logrotate. On Ubuntu, its located at
`/etc/cron.daily/logrotate` which indicates that the script is run once per day
by the system's daily cronjob. If you want to change the schedule to `hourly`,
move the script to the `/etc/cron.hourly/` directory using the command below:c

```command
sudo mv /etc/cron.daily/logrotate /etc/cron.hourly
```

Afterward, the script should be executed by the system's hourly cronjob so that
the `hourly` option works normally henceforth.

## Running commands or scripts before or after log rotation

Logrotate provides the ability to run arbitrary commands or scripts before and
after log rotation through the `prerotate` and `postrotate` directives. As their
names implies, the former executes commands or scripts _before_ log rotation
while the latter does the same thing _after_ log rotation. Both directives are
closed using the `endscript` directive.

You can use `prerotate` to perform any necessary preparations or actions
required prior to the rotation, while `postrotate` should be used to perform
tasks such as restarting services, notifying stakeholders, or further processing
of the rotated log files.

For example, you can monitor your log rotation configuration by pinging a
monitoring service like [Better Stack](https://betterstack.com/uptime) so
that if the rotation does not execute as scheduled, you'll get an alert to
investigate the problem further.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/H8ruTb4C2sM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

![Screenshot from 2023-04-29 21-45-25.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/745d2a62-53a1-485e-609a-3bb1f3946a00/orig =3024x1586)

```text
[label ~/logify/logrotate.conf]
/home/<user>/logify/*.log
{
    hourly
    missingok
    rotate 7
    compress
    notifempty
    [highlight]
    sharedscripts
    postrotate
      curl https://betteruptime.com/api/v1/heartbeat/<heartbeat_id>
    endscript
    [/highlight]
}
```

In this example, `postrotate` is used to report that the log rotation was
successful according to the defined schedule. If this report is not received
within the expected period, an incident will be created and you will receive
notifications at the configured channels (such as Email, Slack, SMS, etc). Its
always a good idea to set up such monitoring so that if there's an issue with
the rotation, you catch and fix it quickly before it causes more severe
problems.

Note that `postrotate` commands or scripts are only executed when at least one
file that matches the specified pattern was rotated. The `sharedscripts`
directive above is used to specify that the commands in `prerotate` and
`postrotate` blocks should be run only once no matter how many log files were
rotated. Normally, the commands are run once per rotated log file which is not
ideal in this scenario.

![Screenshot from 2023-04-29 21-45-25.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f1144d64-4d26-4a16-3a53-9bd53c9f6c00/lg2x=4113x2841)

If `prerotate` or `postrotate` commands or scripts are not executing as
expected, ensure that they have the correct permissions and are executable. You
can use the `chmod +x` command to make the scripts or binaries executable where
applicable. Additionally, double-check that the paths to the scripts are
accurate and that any dependencies required by the scripts are installed.

## Modifying Logrotate access permissions

As seen earlier in `/etc/logrotate.conf`, Logrotate performs its duties with the
privileges of the `root` user and the `adm` group. This allows the tool to
perform the log rotation operation with elevated permissions, typically required
to access and manage system logs.

This also means that newly created log files by the tool will be owned by the
`root` user and group, but this may sometimes prevent the application or service
producing the logs from being able to access the file. In such situations, you
need to modify your settings to ensure that the right access permissions are set
on the file.

Hence, the `create` directive provides a few additional options:

```text
[label /etc/logrotate.d/myapp]
/var/log/myapp.log
{
    [highlight]
    create 644 <user> <group>
    [/highlight]
}
```

In this example, when Logrotate creates a new log file (`myapp.log`) after
rotation, it will set the file permissions to 644 (read-write for the owner, and
read-only for the group and others). The file will be owned by `myuser` and
assigned to `mygroup`.

## Debugging Logrotate problems

You need to ensure that the Logrotate utility is running correctly at all times
so that your scheduled log rotation tasks are executed as expected. If log files
are not rotating as expected, it could be due to incorrect configuration or
permissions issues.

To fix such problems, first check the Logrotate status file at
`/var/lib/logrotate/status` to ensure that the log file is indeed included in
the rotation schedule and to confirm when it was last rotated.

```command
sudo cat /var/lib/logrotate/status
```

If a pattern that matches the log file is not included here, you may need to
verify if a corresponding configuration file for the application or service is
present in the `/etc/logrotate.d/` directory.

The `logrotate` command also provides a helpful `-d/--debug` option to test and
debug configuration issues by simulating log rotation without actually rotating
the logs. For example, if you notice that the rotated logs are not being
compressed and you run `logrotate` in debug mode, you may observe the following
output indicating that the `compress` directive was misspelled:

```command
sudo logrotate /etc/logrotate.d/logify --debug
```

```text
[output]
. . .
reading config file /etc/logrotate.d/logify
error: /etc/logrotate.d/logify:7 unknown option 'compresss' -- ignoring line
. . .
```

Another useful option is `-v/--verbose` which provides detailed output and
information about the log rotation process. When enabled, Logrotate displays
additional messages, including the files being rotated, the actions taken, and
any errors or warnings encountered during the rotation.

If you're running `logrotate` through a cronjob, you can specify the `--verbose`
option and redirect its standard output and standard error to a file using the
syntax below:

```text
0 * * * * /usr/sbin/logrotate -v /home/<user>/logify/logrotate.conf --state /home/<user>/logify/logrotate.state >> </path/to/logrotate.log> 2>&1
```

For the system cronjob, you must edit the `logrotate` script that's located in
`/etc/cron.daily/` by default. Note that when enabling verbose mode here, it'll
include information about all logs being rotated on the system which can be
pretty huge and mostly irrelevant. We recommend using the cron method shown
above if you only care about the logs for a specific service or application.

```bash
[label /etc/cron.daily/logrotate]
#!/bin/sh

# skip in favour of systemd timer
if [ -d /run/systemd/system ]; then
    exit 0
fi

# this cronjob persists removals (but not purges)
if [ ! -x /usr/sbin/logrotate ]; then
    exit 0
fi

[highlight]
/usr/sbin/logrotate -v /etc/logrotate.conf >> </path/to/logrotate.log> 2>&1
[/highlight]
EXITVALUE=$?
if [ $EXITVALUE != 0 ]; then
    /usr/bin/logger -t logrotate "ALERT exited abnormally with [$EXITVALUE]"
fi
exit $EXITVALUE
~
```

The next time Logrotate executes, the `logrotate.log` file will be created in
the specified directory and you'll find all the details of the log rotation.
Here's some example output from a successful rotation attempt:

```text
[label /path/to/logrotate.log]
reading config file /home/betterstack/logify/logrotate.conf
acquired lock on state file /home/betterstack/logify/logrotate.stateReading state from file: /home/betterstack/logify/logrotate.state
Allocating hash table for state file, size 64 entries
Creating new state
Creating new state
Creating new state
Creating new state

Handling 1 logs

rotating pattern: /home/betterstack/logify/*.log
 forced from command line (7 rotations)
empty log files are not rotated, old logs are removed
considering log /home/betterstack/logify/log_records.log
  Now: 2023-04-30 09:19
  Last rotated at 2023-04-30 09:19
  log needs rotating
considering log /home/betterstack/logify/logrotate.log
  Now: 2023-04-30 09:19
  Last rotated at 2023-04-30 09:00
  log does not need rotating (log is empty)
rotating log /home/betterstack/logify/log_records.log, log->rotateCount is 7
dateext suffix '-2023043009'

. . .
```

![Screenshot from 2023-04-30 10-06-12.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4c7594f7-cc29-4b8c-e8e1-080dfe40b900/lg2x=4113x2841)

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Once you're collecting Logrotate logs as above, you can forward them to
[Better Stack telemetry](https://betterstack.com/) so that you can easily search for key
events and receive alerts when an error is encountered.

![Screenshot from 2023-04-30 10-08-25.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b0a27545-e737-4f5e-952b-b4c809ca8900/orig=4113x2841)

## Final thoughts

In this tutorial, we explored log rotation in Linux and its implementation using
the Logrotate program. We began by examining the configuration files and
discussing key directives commonly encountered. We then created a standard
Logrotate configuration for a custom application and then transitioned to a
system-independent configuration, before discussing some common problems with
Logrotate and how to troubleshoot them effectively.

To further expand your knowledge of Logrotate and explore its full capabilities,
I encourage you to consult its manual page. Simply run `man logrotate` in your
terminal to access the comprehensive documentation.

Thanks for reading, and happy logging!