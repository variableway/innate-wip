#  How to Start Logging with Postfix

This tutorial explains how to start logging with Postfix.
[Postfix](http://www.postfix.org/) is a **mail server** that attempts to be
fast, easy to administer, and secure.

Nowadays, logging becoming an important part of almost every service. As a mail
server administrator, you will appreciate debugging troubles with the logs (for
example, when the mail server does not receive or deliver email).

Since Postfix 3.4, the mail server offers build-in logging support.
Alternatively, you can use more standard logging with the Syslog. This tutorial
will describe both approaches.

In this tutorial, you will do following actions:

- You will configure Postfix **logging with Syslog**, view the default settings,
  change them, and view the log content.
- You will configure custom Postfix **logging without Syslog**.
- You will set up a log rotation for Postfix with Syslog and **Logrotate**
  daemon. Alternatively, you will configure a **custom log rotation** without
  the Syslog.

## Prerequisites

You will need:

- Ubuntu 20.04 distribution including the non-root user with `sudo` access.
- [Installation](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-postfix-on-ubuntu-20-04)
  of the Postfix with the basic configuration (a minimal version of the Postfix
  must be 3.4, otherwise some logging features won't be supported).
- [Basic](https://www.digitalocean.com/community/tutorials/how-to-use-cron-to-automate-tasks-ubuntu-1804)
  understanding of how to use cron to automate tasks.

[summary]
## Side note: Centralize your mail server logs

Head over to [Better Stack](https://betterstack.com/logs) and start shipping your Postfix logs in minutes.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Step 1 — Configuring Logging with Syslog

Postfix logs can be maintained through the Syslog, which is a logging daemon for
Linux that can maintain logs from multiple sources. The advantage of the Syslog
is a centralised approach and built-in support of log rotation. On the other
hand, if the Syslog maintains too many logs, then it could cause a system
performance decrease. Postfix default installation on the Ubuntu 20.04 retrieved
through `apt` (`apt install postfix`), logs into the Syslog.

Postfix configuration is defined in the directory `/etc/postfix`, especially in
the files `main.cf` and `master.cf`. However, rather than editing these files
directly, you can use a command-line utility `postconf` that allows you to view
and change a configuration setting.

### Viewing Default Configuration

You can view your default configuration by executing `postconf` with the
argument `maillog_file`:

    $ postconf maillog_file

The directive `maillog_file` determines the name of an optional log file that is
written by the Postfix service. The directive can hold the following values:

- An empty value selects logging to the Syslog.
- A value `/dev/stdout` determines logging to standard output.
- Otherwise, the value holds an absolute path to the log file (typically,
  `/var/log/postfix.log`).

You'll see the program's output appear on the screen:

    Output
    maillog_file =

The output shows that Postfix logs into the Syslog.

### Changing Default Configuration

If your directive `maillog_file` holds a non-empty value and you want to log to
the Syslog, you must change it. Firstly, you must stop the Postfix service by
executing `postfix stop` (`sudo` required):

    $ sudo postfix stop

You'll see the program's output appear on the screen:

    Output
    postfix/postfix-script: stopping the Postfix mail system

Now, you can change the value of the directive `maillog_file` to an empty value
(`sudo` required):

    $ sudo postconf maillog_file=

At last, you must start Postfix with the new configuration:

    $ sudo postfix start

You'll see the program's output appear on the screen:

    Output
    postfix/postfix-script: warning: symlink leaves directory: /etc/postfix/./makedefs.out
    postfix/postfix-script: starting the Postfix mail system

At this point, your Postfix service logs are maintained with the Syslog.

The value in the `maillog_file` must start with a prefix that is specified in
the directive `maillog_file_prefixes` (default prefixes are `/var`, and
`/dev/stdout`). This is a safety feature to contain the damage from a single
configuration mistake. You can specify one or more prefix strings, separated by
comma or white space.

### Viewing Syslog

When your Postfix service logs into the Syslog, you can view these logs with the
**journactl** utility. If you don't know what is the journald and journactl, you
can read the tutorial [How to Control Journald with
Journalctl](https://betterstack.com/community/guides/logging/how-to-control-journald-with-journalctl/).

Let's view the Syslog records that belongs to the Postfix service by executing
`journactl`:

    $ journalctl -u postfix@-.service

The option `-u` specifies to list only records of the service with the name
`postfix@-.service` (the name of the Postfix service in the system). You'll see
the program's output appear on the screen:

    Output
    June 14 08:50:38 alice systemd[1]: Starting Postfix Mail Transport Agent (instance -)...
    June 14 08:50:39 alice postfix/master[55893]: daemon started -- version 3.4.13, configuration /etc/postfix
    June 14 08:50:39 alice systemd[1]: Started Postfix Mail Transport Agent (instance -).
    June 14 09:16:13 alice systemd[1]: Stopping Postfix Mail Transport Agent (instance -)...
    June 14 09:16:13 alice postfix/postfix-script[58960]: stopping the Postfix mail system
    June 14 09:16:13 alice postfix/master[55893]: terminating on signal 15
    June 14 09:16:13 alice systemd[1]: postfix@-.service: Succeeded.
    June 14 09:16:13 alice systemd[1]: Stopped Postfix Mail Transport Agent (instance -).
    June 14 09:16:13 alice systemd[1]: Starting Postfix Mail Transport Agent (instance -)...
    June 14 09:16:14 alice postfix/postfix-script[59643]: warning: symlink leaves directory: /etc/postfix/./makedefs.out
    June 14 09:16:14 alice postfix/postfix-script[59829]: starting the Postfix mail system
    June 14 09:16:14 alice postfix/master[59831]: daemon started -- version 3.4.13, configuration /etc/postfix
    June 14 09:16:14 alice systemd[1]: Started Postfix Mail Transport Agent (instance -).
    June 14 09:19:20 alice postfix/pickup[59832]: F3710A248D: uid=1000 from=<alice>
    June 14 09:19:21 alice postfix/cleanup[60444]: F3710A248D: message-id=<20210614071920.F3710A248D@alice>
    June 14 09:19:21 alice postfix/qmgr[59833]: F3710A248D: from=<alice@example.com>, size=304, nrcpt=1 (queue active)
    June 14 09:19:21 alice postfix/local[60446]: F3710A248D: to=<alice@example.com>, orig_to=<alice>, relay=local, delay=0.04, delay>
    June 14 09:19:21 alice postfix/qmgr[59833]: F3710A248D: removed
    ...

The output shows syslog records about Postfix, starting, stopping, but also
about sending mails.

### Configuring Log Destination

Syslog typically stores log records into the file `/var/log/syslog`. However,
the Syslog configuration allows storing log records into different files by the
facility (for further information, read the tutorial [How to view Linux logs and
their configuration on Ubuntu
20.04](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/). One of the
facilities is also a _mail_, soo the Syslog stores all mail logs into the file
`/var/log/mail.log`. You can view this file, and you will see that the content
is identical to the previous `journactl` query.

## Step 2 — Configuring Logging Without Syslog

If you don't want to use the Syslog daemon for the log maintenance, you can set
up Postfix to store logs into the **stdout**, **stderr**, or
**custom\*\***file\*\*.

Let's change the destination of the Postfix log. At first, you must stop the
Postfix service by executing `postfix stop` (`sudo` required):

    $ sudo postfix stop

Now, you can change the value of the directive `maillog_file` to the desired log
destination (`sudo` required):

    $ sudo postconf maillog_file=/some/log/file

There are two typical use cases:

- Logging to a **custom file** solves a usability problem for macOS and
  eliminates multiple problems for systemd-based systems. In this case, you can
  set up the value to the `/var/log/postfix.log`.
- Logging to stdout (`/dev/stdout`) is useful when Postfix runs in a
  **container** because Docker stores to the log everything captured from the
  stdout.

When you set up the value of the `maillog_file`, then you must start Postfix
with the new configuration:

    $ sudo postfix start

At this point, your Postfix service configuration is reloaded.

## Step 3 — Configuring Rotating Logs

The log files size must be controlled because their size always grows over time.
Linux solves this problem with a concept called _log rotation_. In this step, we
will configure log rotation for Postfix with Syslog, alternatively for custom
log without Syslog support.

### Syslog with Logrotate

If you are using Postfix with the Syslog then you can use **Logrotate** daemon.
Ubuntu 20.04 uses Logrotate by default, and it also rotates mail logs (including
Postfix, if installed). Logrotate configuration for the Postfix log rotation is
defined in the file `/etc/rsyslog.d/50-default.conf`. Let's open this file
(`sudo` required for the file editing):

    $ sudo nano /etc/rsyslog.d/50-default.conf

The file contains following lines that defines log rotation for the different
facilities:

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

The directives in the curly brackets define how to rotate the log defined above
them (for example, `mail.log`, `kern.log`, or `auth.log` have the same log
rotation settings). The file defines that mail log (including Postfix log
`/var/log/mail.log`) rotate logs with the following settings:

- `rotate 4`: Log files are rotated 4 times before being removed. If rotate is
  set to 0 then old versions are removed rather than rotated.
- `weekly`: Logs are rotated every week. Alternatively, you can specify another
  time interval (`daily`, `weekly`, `monthly`, or `yearly`). You can also
  specify to rotate every hour (`hourly`), but note that the logrotate daemon
  runs daily. In such a case, you have to change the logrotate cron job interval
  to be able to really rotate logs hourly.
- `missingok`: Daemon do not report any error if the log file is missing.
- `notifempty`: Do not rotate the log if it is empty.
- `delaycompress`: Postpone compression of the previous log file to the next
  rotation cycle, because it is still used by some program.
- `postrotate/endscript`: The lines between `postrotate` and `endscript` are
  executed after the log file is rotated.

All possible directives are described in logrotate manual pages (you can see
them by executing `man logrotate`). When you edit, remove, add settings that
match your use case, you can save, and close the file. Now, your Postfix logs
will be rotated periodically with Logrotate.

### Custom Log Rotation Without Syslog

If you set up logging into the **custom file** then Syslog no longer manages log
rotation of the Postfix service. Postfix offers command `postfix logrotate` that
do the following:

1. Rename the current log by appending a suffix that contains the date and time.
   Timestamp suffix format can be configured in the variable
   `maillog_file_rotate_suffix`. The default suffix is `%Y%m%d-%H%M%S`. For
   example, the log file `postfix.log` is renamed into the
   `postfix.log.20210615-114926`).
2. Postfix daemon is reloaded, and the old file is closed.
3. Old log is compressed. The compression program is configured with the
   variable `maillog_file_compressor` parameter (default: `gzip`).

You can run this command by hand, or you can create a **cronjob**. Let's create
cronjob by executing `crontab`:

    $ crontab -e

The `-e` option is used to edit the current crontab using the editor specified
by the environment variable. You'll be redirected to the file that defines
cronjobs. The file contains some commented-out instructions on how to use it:

    # Edit this file to introduce tasks to be run by cron.
    #
    # Each task to run has to be defined through a single line
    # indicating with different fields when the task will be run
    # and what command to run for the task
    #
    # To define the time you can provide concrete values for
    # minute (m), hour (h), day of month (dom), month (mon),
    # and day of week (dow) or use '*' in these fields (for 'any').
    #
    # Notice that tasks will be started based on the cron's system
    # daemon's notion of time and timezones.
    #
    # Output of the crontab jobs (including errors) is sent through
    # email to the user the crontab file belongs to (unless redirected).
    #
    # For example, you can run a backup of all your user accounts
    # at 5 a.m every week with:
    # 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
    #
    # For more information see the manual pages of crontab(5) and cron(8)
    #
    # m h  dom mon dow   command

Add the new line at the end of the file, and put there following line of the
code:

    # m h  dom mon dow   command
    0 1 * * * postfix logrotate

The code defines a new cron job that runs script `postfix logrotate` every day
at 1 am. However, you can set up a period that matches your use case. At this,
point you can save the file and close it. If everything succeeded then you will
see the following output in the console:

    Output
    crontab: installing new crontab

Now, your custom Postfix log will be rotated periodically with cronjob.

The command `postfix logrotate` does not remove old logs. You must treat them on
your own.


[summary]
## Side note: Visualize your Postfix logs in real-time

Stop tailing `/var/log/mail.log` manually. [Better Stack](https://betterstack.com/logs) transforms your Postfix logs into searchable dashboards—track delivery rates, spot bounce patterns, and identify authentication failures across all your mail servers.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Conclusion

In this tutorial, you configured Postfix **logging with Syslog**, viewed the
default settings, changed them, and view the log content. You configured custom
Postfix **logging without Syslog**. At last, you set up a log rotation for
Postfix with Syslog and **Logrotate** daemon. Alternatively, you configured a
**custom log rotation** without the Syslog.
