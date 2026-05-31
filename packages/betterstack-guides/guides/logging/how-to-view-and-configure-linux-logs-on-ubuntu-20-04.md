# How to View and Configure Linux System Logs on Ubuntu 20.04

This tutorial explains the basic administration of a Linux server through system
logs. A system log is a file that contains information about the events that
happened on the system during runtime.

[summary]
  <p><b>In this article, you will learn the following Linux logging basics:</b></p>
  <ul class="checkmark-list">
    <li>Where the Linux log files are stored, how are they formatted, and how to read them.</li>
    <li>How to read the most important logs (such as <code class="prettyprint">syslog</code>).</li>
    <li>How to configure the Ubuntu <code class="prettyprint">syslog</code> daemon.</li>
    <li>What Linux log rotation is all about and <a href="/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04">how to use the logrotate utility</a>.</li>
  </ul>
[/summary]

## Prerequisites

Before proceeding with the rest of this tutorial, ensure that you have a basic
knowledge of working with the Linux command line. While many of the concepts
discussed in this article are general applicable to all Linux distributions,
we'll be demonstrating them in Ubuntu only so ensure to set up an Ubuntu 20.04
server that includes a non-root user with `sudo` access.

![Better Stack log management dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)

[summary]
## Side note: Centralize your Linux logs across all servers

Head over to [Better Stack](https://betterstack.com/logs) and start shipping your Linux system logs in minutes. Stop SSH-ing into individual servers—aggregate syslog, auth logs, and application logs from your entire infrastructure in one dashboard.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
[/summary]

## Step 1 — Finding Linux system logs

All Ubuntu system logs are stored in the `/var/log` directory. Change into this
directory in the terminal using the command below:

```command
cd /var/log
```

You can view the contents of this directory by issuing the following command:

```command
ls /var/log
```

You should see a similar output to the following:

```
[output]
alternatives.log  auth.log       btmp            cloud-init-output.log  dmesg    dpkg.log  journal/  landscape/  private/  ubuntu-advantage-license-check.log  ubuntu-advantage-timer.log  unattended-upgrades/
apt/              bootstrap.log  cloud-init.log  dist-upgrade/          dmesg.0  faillog   kern.log  lastlog     syslog    ubuntu-advantage.log                ufw.log                     wtmp
```

Let's look at a few of the essential system log files that may be present in the
`/var/log` directory and what they contain:

- `/var/log/syslog`: stores general information about any global activity in the
  system.
- `/var/log/auth.log`: keeps track of all security-related actions (login,
  logout, or root user activity).
- `/var/log/kern.log`: stores information about events originating from the
  Linux kernel.
- `/var/log/boot.log`: stores system startup messages.
- `/var/log/dmesg`: contains messages related to device drivers.
- `/var/log/faillog`: keeps track of failed logins, which comes in handy when
  investigating attempted security breaches.

The `/var/log` directory is also used to store various application logs. For
example, if your distribution is bundled with Apache or MySQL, or installed
later, their log files will also be found here.

## Step 2 — Viewing Linux log file contents

Log files contain a large amount of information that are useful for monitoring
or analyzing activities performed by the system or a specific application.
Therefore, a Linux server administrator must learn the art of reading and
understanding the various messages present in log files to effectively diagnose
or troubleshoot an issue.

Before we can read log files, we ought to know how they are formatted. Let's
review two basic approaches to log file formatting and storage: plain text and
binary files.

### Plaintext log files

These logs are plain text files with a standardized content format. Ubuntu uses
a log template called
[RSYSLOG_TraditionalFileFormat](https://rsyslog-5-8-6-doc.neocities.org/rsyslog_conf_templates.html).
This log format consists of four main fields with a space delimiter:

1. **The timestamp** indicates the time when a log entry was created in the
   format `MMM dd HH:mm:ss` (e.g. `Sep 28 19:00:00`). Notice that this format
   does not include a year.
2. **Hostname** is the host or system that originally create the message.
3. **Application** is the application that created the message.
4. **Message** contains the actual details of an event.

Let's go ahead and review some log files in the plaintext format. Run the
command below to print the contents of the `/var/log/syslog` file with the
`tail` utility:

```command
sudo tail /var/log/syslog
```

This outputs the last 10 lines of the file:

```
[output]
Mar 23 12:38:09 peter dbus-daemon[1757]: [session uid=1000 pid=1757] Activating via systemd: service name='org.freedesktop.Tracker1' unit='tracker-store.service' requested by ':1.1' (uid=1000 pid=1754 comm="/usr/libexec/tracker-miner-fs " label="unconfined")
Mar 23 12:38:09 peter systemd[1743]: Starting Tracker metadata database store and lookup manager...
Mar 23 12:38:09 peter dbus-daemon[1757]: [session uid=1000 pid=1757] Successfully activated service 'org.freedesktop.Tracker1'
Mar 23 12:38:09 peter systemd[1743]: Started Tracker metadata database store and lookup manager.
Mar 23 12:38:40 peter tracker-store[359847]: OK
Mar 23 12:38:40 peter systemd[1743]: tracker-store.service: Succeeded.
Mar 23 12:39:01 peter CRON[359873]: (root) CMD (  [ -x /usr/lib/php/sessionclean ] && if [ ! -d /run/systemd/system ]; then /usr/lib/php/sessionclean; fi)
Mar 23 12:39:23 peter systemd[1]: Starting Clean php session files...
Mar 23 12:39:23 peter systemd[1]: phpsessionclean.service: Succeeded.
Mar 23 12:39:23 peter systemd[1]: Finished Clean php session files.
```

You'll notice that that each record in this file is formatted in the manner
described earlier. For example, the last record has its `timestamp` as _Mar 23
12:39:23_, `hostname` as _peter_, `application` as _systemd[1]_ and `message` as
_Finished Clean php session files_.

If you want to view the entire log file, you can use the `cat` utility or any
text editor such as `nano` or `vim`.

### Binary log files

While plaintext is the dominant storage format for log files, you will also
encounter binary log files that cannot be read with a normal text editor. The
`/var/log` directory contains multiple binary files that are related to the user
authorization:

- `/var/log/utmp`: tracks users that are currently logged into the system.
- `/var/log/wtmp`: tracks previously logged in users. It contains a past data
  from `utmp`.
- `/var/log/btmp`: tracks failed login attempts.

For these binary logs, special command-line tools are used to display the
relevant information in human-readable form. For example, to review the contents
of the `/var/log/utmp` file, run the `who` utility with `-H` option (this option
causes column labels to be printed in the output table):

```command
who -H
```

You'll see the program's output appear on the screen:

```
[output]
NAME   LINE         TIME             COMMENT
george pts/0        2021-03-21 15:29 (2001:67c:1220:80c:b1:a84e:69ee:f530)
willie pts/1        2021-03-21 07:20 (adsl-dyn22.78-98-29.t-com.sk)
bonnie pts/2        2021-03-21 10:31 (2001:67c:1220:80c:b1:a84e:69ee:f530)
peter  pts/6        2021-03-21 14:37 (100.64.97.50)
...
```

The output above describes all the currently logged in users, the time of login
and their host machine's IP address.

You can also review the contents of the `/var/log/wtmp` binary file through the
`last` command as shown below:

```command
last -R
```

You'll see the program's output appear on the screen:

```
[output]
peter    :1           Sat Mar 13 08:06   still logged in
reboot   system boot  Sat Mar 13 08:06   still running
peter    :1           Fri Mar 12 07:42 - down  (1+00:22)
reboot   system boot  Fri Mar 12 07:42 - 08:05 (1+00:23)
peter    :1           Sun Mar  7 11:20 - down  (4+20:21)
reboot   system boot  Sun Mar  7 11:20 - 07:41 (4+20:21)
peter    :1           Fri Mar  5 08:02 - crash (2+03:17)
reboot   system boot  Fri Mar  5 08:01 - 07:41 (6+23:39)
peter    :0           Tue Mar  2 08:38 - crash (2+23:23)
reboot   system boot  Tue Mar  2 08:38 - 07:41 (9+23:03)
peter    :1           Thu Feb 25 11:44 - down  (4+20:53)
reboot   system boot  Thu Feb 25 11:44 - 08:37 (4+20:53)

wtmp begins Thu Feb 25 11:43:23 2021
```

The output shows a table where the first column refers to the user name (the
pseudo-user reboot is recorded each time when the system is rebooted). The third
field refers to the login timestamp, and the last column shows the session
duration.

To review the `/var/log/btmp` file (containing failed login attempts), execute
the `lastb` command with `sudo` privileges:

```command
sudo lastb
```

You'll see the program's output appear on the screen:

```
[output]
falcon   tty3                  Thu Feb 12 07:10 - 07:10  (00:00)
ruby     tty1                  Thu Feb 12 07:09 - 07:09  (00:00)
sergio   tty1                  Thu Feb 12 07:09 - 07:09  (00:00)

btmp begins Thu Feb 25 11:43:32 2021
```

The output shows users that failed to login with the corresponding timestamp.

## Step 3 — Examining the syslog deamon configuration

All system logs are created and maintained by a background process called a
_daemon_. The traditional Linux daemon for logging is `syslogd`. However, Ubuntu
20.04 uses a daemon called `rsyslogd` which is a superset of `syslogd`. It uses
a special configuration file (`/etc/rsyslog.conf`) that specifies the logging
rules.

Go ahead and print the contents of the `/etc/rsyslog.conf` file with the `cat`
command:

```command
cat /etc/rsyslog.conf
```

This command prints the entire content of this configuration file, but we're
only going to show a truncated output here:

```
[output]
[label /etc/rsyslog.conf]
. . .

###########################
#### GLOBAL DIRECTIVES ####
###########################

#
# Use traditional timestamp format.
# To enable high precision timestamps, comment out the following line.
#
$ActionFileDefaultTemplate RSYSLOG_TraditionalFileFormat

# Filter duplicated messages
$RepeatedMsgReduction on

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

#
# Where to place spool and state files
#
$WorkDirectory /var/spool/rsyslog

#
# Include all config files in /etc/rsyslog.d/
#
$IncludeConfig /etc/rsyslog.d/*.conf
```

This file contains a lot of information, but we'll focus on two configuration
details. Firstly, a variable called `$ActionFileDefaultTemplate` defines the
syslog record format as described in Step 2. You can change the value of this
variable if the default log format is unsuitable for you. Secondly, the last
line in the file defines a variable called `$IncludeConfig` that specifies the
directory for additional configuration files.

In Ubuntu, all additional Rsyslog rules are placed in the
`/etc/rsyslog.d/50-default.conf` file by default. Go ahead and examine the
contents of this file with the `head` utility (the `-n 15` option specifies that
only the first 15 lines should be printed):

```command
head -n 15 /etc/rsyslog.conf/50-default.conf
```

You'll see the program's output appear on the screen:

```
[output]
#  Default rules for rsyslog.
#
#			For more information see rsyslog.conf(5) and /etc/rsyslog.conf

#
# First some standard log files.  Log by facility.
#
auth,authpriv.*			/var/log/auth.log
*.*;auth,authpriv.none		-/var/log/syslog
#cron.*				/var/log/cron.log
#daemon.*			-/var/log/daemon.log
kern.*				-/var/log/kern.log
#lpr.*				-/var/log/lpr.log
mail.*				-/var/log/mail.log
#user.*				-/var/log/user.log
```

The output contains `rsyslogd` configuration rules. Each non-empty line (or line
that does not start with the `#` character) defines a rule. The rule definition
starts with a _selector_ followed by one or more spaces and an _action field_:

- The selector specifies the facility with a corresponding priority. For
  example, the `*` selector refers to all facilities or priorities.
- The action field of a selector usually references a log file.

## Step 4 — Rotating log files in Linux

The size of log file must be controlled because they always grow over time. Each
system has limited resources and logs that are too large can lead to performance
and memory problems, not to mention the loss of storage space. Linux
distributions typically solve this problem through the concept of _log rotation_
which continuously repeats the following actions:

1. Instead of continuously writing to log file as it grows larger, the file name
   is changed to one with a version suffix, and creates a brand new file is
   created for new log entries. This means a log file has multiple backups which
   are optionally compressed.
2. When the backup files reaches a specified number, the system deletes the
   oldest ones.

Let's view an example of rotating log files in Linux. Execute the `ls` command
with following options:

```command
ls -l -h -t /var/log/syslog*
```

The `-l` option outputs a listing that includes various metadata about a file,
the `-h` option prints the file size in human-readable form, and the `-t` option
sorts the listing by modification time (newest first). The `/var/log/syslog*`
argument specifies that only files in the `/var/log` directory with the `syslog`
prefix should be included in the output.

You'll see the program's output appear on the screen:

```
[output]
-rw-r----- 1 syslog adm  47K mar 30 09:49 /var/log/syslog
-rw-r----- 1 syslog adm 3,5G mar 30 07:45 /var/log/syslog.1.gz
-rw-r----- 1 syslog adm 1,6M mar 29 10:06 /var/log/syslog.2.gz
-rw-r----- 1 syslog adm  29K mar 28 07:49 /var/log/syslog.3.gz
-rw-r----- 1 syslog adm  54K mar 27 08:08 /var/log/syslog.4.gz
-rw-r----- 1 syslog adm 6,4M mar 26 07:35 /var/log/syslog.5.gz
-rw-r----- 1 syslog adm  31K mar 25 08:01 /var/log/syslog.6.gz
```

This output describes all the versions of the `syslog` file. Typically, it is
the biggest log file on the system because, as explained earlier, it records
almost every event that occurs in the system. The older versions are labelled
with a version suffix (e.g. `syslog.6.gz` is the oldest syslog backup).

Notice that the backup files are all compressed with the standard GNU zip
compression algorithm. (as evidenced by the `.gz` extension). This helps with
space savings since log files can grow to the size of gigabytes (in our example
the biggest file is 3.5 GB). You'll also notice that these files cover a time
interval of only six days.

## Step 5 — Configuring the logrotate daemon

Log rotation is maintained by a system daemon called `logrotate`. Similar to the
`rsyslogd` utility, this daemon uses a special configuration file called
`logrotate.conf` in the `/etc` directory.

Go ahead and display the contents of the `logrotate` config file with `cat`
utility:

```command
cat /etc/logrotate.conf
```

This command prints the entire contents of the configuration file to the screen:

```
[output]
# see "man logrotate" for details
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

# system-specific logs may be also be configured here.
```

The output describes the global configuration for `logrotate`. In our example,
the log files are rotated weekly, the system keeps four rotation backups, and
compression is turned off. However, this is the most general configuration for
any log. We can also set up a more specific configuration for a particular log
file. In Ubuntu, the configuration for specific logs are placed in the
`/etc/logrotate.d` directory by default (you'll notice the presence of this
directory in `/etc/logrotate.conf`).

Let's view the contents of the `/etc/logrotate.d` directory by executing the
`ls` command:

```command
ls /etc/logrotate.d/
```

The output below describes all the utilities that have a specific log rotation
config:

```
[output]
alternatives  bootlog      dpkg               ubuntu-advantage-tools
apache2       btmp         ppp                ufw
apport        certbot      rsyslog            unattended-upgrades
apt           cups-daemon  speech-dispatcher  wtmp
```

You'll notice that the `rsyslog` daemon has its own log rotation configuration
file. Go ahead and display the first 15 lines of the `rsyslog` file with the
`head` utility:

```command
head -n 15 /etc/logrotate.d/rsyslog
```

You'll see the following output on the screen:

```
[output]
/var/log/syslog
{
	rotate 7
	daily
	missingok
	notifempty
	delaycompress
	compress
	postrotate
		/usr/lib/rsyslog/rsyslog-rotate
	endscript
}

/var/log/mail.info
/var/log/mail.warn
```

This output shows that the `syslog` file is rotated daily, and that seven
compressed backups are kept before older ones are deleted.

You can force `logrotate` to rotate a log file immediately by executing
following the command:

```command
sudo logrotate -fv /etc/logrotate.conf
```

The `-f` option forces immediate rotation and the `-v` option turns on verbose
mode (it will display messages during rotation). The execution of this command
shows the following output (truncated to save space):

```
[output]
reading config file /etc/logrotate.conf
including /etc/logrotate.d
reading config file alternatives
reading config file apache2
reading config file apport
reading config file apt
reading config file bootlog
reading config file btmp
reading config file certbot
reading config file cups-daemon
reading config file dpkg
reading config file ppp
reading config file rsyslog
reading config file speech-dispatcher
reading config file ubuntu-advantage-tools
reading config file ufw
reading config file unattended-upgrades
reading config file wtmp
. . .
```

The beginning of the output shows that the `logrotate` daemon reads all its
configuration files first before proceeding. The entire output is very long
because it prints every single detail of the rotation process.

[summary]
## Side note: Visualize your Linux logs in real-time

Transform scattered log files into unified dashboards. [Better Stack](https://betterstack.com/logs) aggregates syslog, auth logs, and application logs from all your Linux servers—giving you complete visibility into your infrastructure health.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Conclusion

In this tutorial, you've learnt the basics of system logs in Linux and how to
read and understand them. We discussed where the logs are typically placed and
the different log formats you will likely encounter. We also covered the
`rsyslogd` utility, which is responsible for maintaining log files in Ubuntu
before discussing log rotation and how to use the `logrotate` utility to keep
log files small and manageable. To learn more about all the utilities described
in this article, explore the
[Rsyslog](https://betterstack.com/community/guides/logging/how-to-configure-centralised-rsyslog-server/) server article and the
[Logrotate](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) article in
the [Logging guides](https://betterstack.com/community/guides/logging/).

Thanks for reading!
