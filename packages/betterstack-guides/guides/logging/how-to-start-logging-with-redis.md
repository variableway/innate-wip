# How To Start Logging With Redis

Redis is one of the most popular in-memory **databases**. Redis is a NoSQL
database and is based on key-value storing. If you administrate applications and
services, you typically want to discover information about the system service
status. The logging of the application is the primary source of this
information. Redis offers built-in support for logging with **Syslog**. Also,
Redis offers a Docker image that sends logs into the **Docker logging** driver.

In this tutorial, you will do following actions:

- You will **install** the Redis server, and **configure** logging to the
  **Syslog**.
- You will **view** Redis logs in the Syslog by querying **journalctl** and also
  by viewing the log file itself.
- You will **configure** the Redis log rotation with the **logrotate** daemon.
- You will **download** the **Redis Docker** image, run it in the container and
  **view** the Docker logs related to this container.

## Prerequisites

You will need:

- Ubuntu 20.04 distribution including the non-root user with `sudo` access.
- You should understand the basics of [Docker](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/)
  and [Syslog](https://betterstack.com/community/guides/logging/how-to-view-and-configure-apache-access-and-error-logs/)

[summary]
## Side note: Make Redis Syslog logs instantly searchable in Better Stack

With [Better Stack](https://betterstack.com/logs), you can centralize Redis logs from Syslog and search them instantly across your fleet, then filter recurring warnings without scrolling through pages of output.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="Better Stack Live tail demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Step 1  — Configuring Logging with Syslog

Redis logs can be maintained through the **Syslog**, which is a logging daemon
for Linux that can maintain logs from multiple sources. Syslog allows forwarding
all logs, from different sources, to the centralised logging server for further
processing ([How to Configure Centralised Rsyslog
Server](https://betterstack.com/community/guides/logging/how-to-configure-centralised-rsyslog-server/)). On the other hand, if the
Syslog maintains too many logs, then it could cause a system performance
decrease.

In this step, we will configure the Redis server logging into the Syslog.

### Installing Redis

First of all, let's install the Redis server. Ubuntu 20.04 includes the Redis
package in the default `apt` repositories (installation requires `sudo`
privilege):

    $ sudo apt update
    $ sudo apt install redis-server

The first command will update Ubuntu repositories, and the second will download
and install required packages for the Redis server.

### Configuring Logging to the Syslog

Redis server configuration is defined in the file `/etc/redis/redis.conf`. Let's
open this file with your text editor (`sudo` required for the file
modification):

    $ sudo nano /etc/redis/redis.conf

The file contains following lines that defines log destination:

    # Specify the log file name. Also the empty string can be used to force
    # Redis to log on the standard output. Note that if you use standard
    # output for logging but daemonize, logs will be sent to /dev/null
    logfile /var/log/redis/redis-server.log

    # To enable logging to the system logger, just set 'syslog-enabled' to yes,
    # and optionally update the other syslog parameters to suit your needs.
    # syslog-enabled no

    # Specify the syslog identity.
    # syslog-ident redis

The directive `logfile` defines the name and directory of the log file. the
default configuration stores log into the directory `/var/log`. This is a
standard directory for the Syslog logging, and Syslog maintains all logs in this
directory by default, so we won't change this value. The directive
`syslog-enabled` is commented-out. You can uncomment this line, and set the
value to `yes` if you want to start logging into the Syslog. At last, you can
uncomment the directive `syslog-ident`, and set it to the program name. This
string will be prepended to every Syslog record.

Edited file will looks like following:

    # Specify the log file name. Also the empty string can be used to force
    # Redis to log on the standard output. Note that if you use standard
    # output for logging but daemonize, logs will be sent to /dev/null
    logfile /var/log/redis/redis-server.log

    # To enable logging to the system logger, just set 'syslog-enabled' to yes,
    # and optionally update the other syslog parameters to suit your needs.
    syslog-enabled yes

    # Specify the syslog identity.
    syslog-ident redis

Now, you can save and close the file.

At last, if you want to immediately apply the new configuration, you must
restart the Redis server with `systemctl` (`sudo` required):

    $ sudo systemctl restart redis

The option `restart redis` determines to restart Redis service. At this point,
your Redis server logs to the Syslog.

## Step 2 — Viewing Syslog Logs

There are two basic command-line possibilities if you want to view the Syslog
records related to the Redis:

- View the Syslog by querying journactl.
- View the Redis log file itself.

### Querying Journalctl

The **journald** is a service included in systemd (Ubuntu is systemd OS) that
controls all logs. The journald offers command-line utility **journalctl**, that
query Syslog records by different filters, and displays them. If you configure
your Redis server to log into the Syslog, then you can view the Syslog records
related to the Redis service with `journalctl`:

    $ journalctl -u redis-server.service

The option `-u` determines to show only Syslog records that belong to the
`redis-server.service` (the system name of the Redis service). You'll see the
program's output appear on the screen:

    Output
    Jun 23 08:38:24 alice redis-server[205912]: oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
    Jun 23 08:38:24 alice redis-server[205912]: Redis version=5.0.7, bits=64, commit=00000000, modified=0, pid=205912, just started
    Jun 23 08:38:24 alice redis-server[205912]: Configuration loaded
    Jun 23 08:38:24 alice systemd[1]: redis-server.service: Can't open PID file /run/redis/redis-server.pid (yet?) after start: Ope>
    Jun 23 08:38:24 alice redis[205915]:                 _._
                                                        _.-``__ ''-._
                                                   _.-``    `.  `_.  ''-._           Redis 5.0.7 (00000000/0) 64 bit
                                               .-`` .-```.  ```\\/    _.,_ ''-._
                                              (    '      ,       .-`  | `,    )     Running in standalone mode
                                              |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
                                              |    `-._   `._    /     _.-'    |     PID: 205915
                                               `-._    `-._  `-./  _.-'    _.-'
                                              |`-._`-._    `-.__.-'    _.-'_.-'|
                                              |    `-._`-._        _.-'_.-'    |           <http://redis.io>
                                               `-._    `-._`-.__.-'_.-'    _.-'
                                              |`-._`-._    `-.__.-'    _.-'_.-'|
                                              |    `-._`-._        _.-'_.-'    |
                                               `-._    `-._`-.__.-'_.-'    _.-'
                                                   `-._    `-.__.-'    _.-'
                                                       `-._        _.-'
                                                           `-.__.-'
    Jun 23 08:38:24 alice redis[205915]: Server initialized
    Jun 23 08:38:24 alice redis[205915]: WARNING overcommit_memory is set to 0! Background save may fail under low memory condition>
    Jun 23 08:38:24 alice redis[205915]: WARNING you have Transparent Huge Pages (THP) support enabled in your kernel. This will cr>
    Jun 23 08:38:24 alice redis[205915]: DB loaded from disk: 0.000 seconds
    Jun 23 08:38:24 alice redis[205915]: Ready to accept connections
    Jun 23 08:38:24 alice systemd[1]: Started Advanced key-value store.

The output shows all Syslog records related to the Redis. You can see that it
informs about recent server restart and warn about some optimisations that could
cause problems.

### Viewing Log File

Alternatively, to journactl, you can view the Redis log file itself, because the
Redis stores all messages into the Syslog, but also into the custom file. In the
previous step, we specified to store Redis logs into the file
`/var/log/redis/redis-server.log`. You can view this file by executing `cat`:

    cat /var/log/redis/redis-server.log

The `cat` utility print the content of the file on the standard output. You'll
see the program's output appear on the screen:

    Output
    205912:C 23 Jun 2021 08:38:24.512 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
    205912:C 23 Jun 2021 08:38:24.512 # Redis version=5.0.7, bits=64, commit=00000000, modified=0, pid=205912, just started
    205912:C 23 Jun 2021 08:38:24.512 # Configuration loaded
                    _._
               _.-``__ ''-._
          _.-``    `.  `_.  ''-._           Redis 5.0.7 (00000000/0) 64 bit
      .-`` .-```.  ```\\/    _.,_ ''-._
     (    '      ,       .-`  | `,    )     Running in standalone mode
     |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
     |    `-._   `._    /     _.-'    |     PID: 205915
      `-._    `-._  `-./  _.-'    _.-'
     |`-._`-._    `-.__.-'    _.-'_.-'|
     |    `-._`-._        _.-'_.-'    |           <http://redis.io>
      `-._    `-._`-.__.-'_.-'    _.-'
     |`-._`-._    `-.__.-'    _.-'_.-'|
     |    `-._`-._        _.-'_.-'    |
      `-._    `-._`-.__.-'_.-'    _.-'
          `-._    `-.__.-'    _.-'
              `-._        _.-'
                  `-.__.-'

    205915:M 23 Jun 2021 08:38:24.515 # Server initialized
    205915:M 23 Jun 2021 08:38:24.515 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
    205915:M 23 Jun 2021 08:38:24.515 # WARNING you have Transparent Huge Pages (THP) support enabled in your kernel. This will create latency and memory usage issues with Redis. To fix this issue run the command 'echo never > /sys/kernel/mm/transparent_hugepage/enabled' as root, and add it to your /etc/rc.local in order to retain the setting after a reboot. Redis must be restarted after THP is disabled.
    205915:M 23 Jun 2021 08:38:24.515 * DB loaded from disk: 0.000 seconds
    205915:M 23 Jun 2021 08:38:24.515 * Ready to accept connections

The output shows the same records as the journalctl, but with a different
timestamp format and without some metadata header include in the Syslog (name of
the process and others).

## Step 3 — Configuring Logrotation

The log files size must be controlled because their size always grows over time.
Linux solves this problem with a concept called log rotation. In this step, we
will configure log rotation for Redis with Syslog. For further information about
log rotation, read the tutorial [How to Manage Logs with Logrotate on Ubuntu
20.04](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/).

The Syslog includes a daemon **Logrotate** that maintains all logs rotation.
Ubuntu 20.04 uses Logrotate by default (including Redis log rotation if
installed). Logrotate configuration for the Redis log rotation is defined in the
file `/etc/logrotate.d/redis-server`. Let's open this file (`sudo` required for
the file editing):

    $ sudo nano /etc/logrotate.d/redis-server

The file contains following lines that defines log rotation for the Redis
server:

    /var/log/redis/redis-server*.log {
            weekly
            missingok
            rotate 12
            compress
            notifempty
    }

The directives in the curly brackets define how to rotate the log in the
directory defined above them. The file defines that Redis rotate logs with the
following settings:

- `weekly`: Logs are rotated every week. Alternatively, you can specify another
  time interval (`daily`, `weekly`, `monthly`, or `yearly`). You can also
  specify to rotate every hour (`hourly`), but note that the logrotate daemon
  runs daily. In such a case, you have to change the logrotate cron job interval
  to be able to really rotate logs hourly.
- `missingok`: Daemon do not report any error if the log file is missing.
- `rotate 12`: Log files are rotated 12 times before being removed. If rotate is
  set to 0 then old versions are removed rather than rotated.
- `compress`: Old versions of log files are compressed with `gzip` by default.
- `notifempty`: Do not rotate the log if it is empty.

All possible directives are described in logrotate manual pages. You can see
them by executing `man logrotate`. You can change these settings, remove some of
them, or add another. The specific configuration is up to you. When you edit
settings that match your use case, you can save and close the file. Now, your
Redis logs will be rotated periodically with Logrotate.

## Step 4 — Logging Redis with Docker

In case that you want to run the Redis inside a Docker container, you must use
some Docker **logging driver** for the Redis log maintenance. You can read all
about the Docker logging driver in the tutorial [How to Start Logging With
Docker](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/).

### Downloading Redis Container

Let's use the `docker pull` command with the image name `redis` to retrieve an
official Redis image from [Docker Hub](https://hub.docker.com/_/redis/) (`sudo`
required):

    $ sudo docker pull redis

You'll see the program's output appear on the screen:

    Output
    Using default tag: latest
    latest: Pulling from library/redis
    69692152171a: Already exists
    a4a46f2fd7e0: Pull complete
    bcdf6fddc3bd: Pull complete
    2902e41faefa: Pull complete
    df3e1d63cdb1: Pull complete
    fa57f005a60d: Pull complete
    Digest: sha256:7c80c223cf11e43f2184492354a737fb08af55e228d342b3e87dc2fa0e73a8e7
    Status: Downloaded newer image for redis:latest
    docker.io/library/redis:latest

The output shows that you fetch an image, and Docker stores it locally and makes
it available for running containers.

### Running Container and Viewing Log

Now, you can start the Redis container by executing `docker run` command (`sudo`
required):

    $ sudo docker run -d -p 24224:24224 --name my-redis redis

Option `-d` runs the container in the background and print container ID (typical
usage for database server). The option `-p 24224:24224` maps port `24224` in the
container to port `24224` on your computer. Option `--name my-redis` determines
the name of the container to `my-redis`.

If you want to view the log of Redis container, you can execute `docker logs`
with container name (`sudo` required):

    $ sudo docker logs my-redis

You'll see the program's output appear on the screen:

    Output
    1:C 23 Jun 2021 11:22:49.917 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
    1:C 23 Jun 2021 11:22:49.917 # Redis version=6.2.4, bits=64, commit=00000000, modified=0, pid=1, just started
    1:C 23 Jun 2021 11:22:49.917 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
    1:M 23 Jun 2021 11:22:49.918 * monotonic clock: POSIX clock_gettime
    1:M 23 Jun 2021 11:22:49.918 * Running mode=standalone, port=6379.
    1:M 23 Jun 2021 11:22:49.918 # Server initialized
    1:M 23 Jun 2021 11:22:49.918 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
    1:M 23 Jun 2021 11:22:49.919 * Ready to accept connections

The output shows log records related to Redis that informs about service
starting and initialisation. You can see that the Docker log is similar to the
Syslog log.

Because this container is the background process, you must stop it by executing
`docker rm --force` (`sudo` required). Otherwise, it will keep running on
background of your computer.


[summary]
## Side note: Visualize Redis logs instead of just reading them line by line

With [Better Stack](https://betterstack.com/logs), you can turn your Redis log stream into something you can *see* by filtering, grouping, and building visual dashboards around the events that matter.


<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
[/summary]

## Final thoughts

In this tutorial, you **installed** the Redis server, and **configured** the
**Syslog** logging. You **viewed** Redis logs in the Syslog by querying
**journalctl** and also by viewing the log file itself. You **configured** the
Redis log rotation with the **logrotate** daemon. You **downloaded** the **Redis
Docker** image, ran it in the container and **viewed** the Docker logs related
to this container.
