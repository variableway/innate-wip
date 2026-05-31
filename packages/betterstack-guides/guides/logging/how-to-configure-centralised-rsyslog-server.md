# How to Set Up Centralized Logging on Linux with Rsyslog

This tutorial describes how you can configure a centralized logging service on
Linux with [Rsyslog](https://www.rsyslog.com/). Such a centralized configuration
is beneficial when administering logs from multiple servers since you won't have
to log into each server to review its logs, particularly if there's a huge
number of servers.

With a centralized logging solution, the host server will receive log entries
from all client servers so that they can be monitored, analyzed, and archived is
one place. Usually
[cloud-hosted log management solutions](https://betterstack.com/log-management) are
favored for their easy set up, rich feature-set, and transparent costs, but
self-hosted solutions can be a more appropriate option in some uses.

Rsyslog is a good and popular choice for setting up centralized logging as it
offers stunning performance (up to one million log entries per second), message
delivery over TCP, SSL, and TLS, multi-threading, and highly configurable
filtering and output formats. It can also forward incoming log entries to other
destinations after certain transformations are applied to them.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/JocDslKu3j4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[summary]
  <p><b>By reading through this article, you will learn how to do the following:</b></p>
  <ul class="checkmark-list">
    <li>Configure a central logging server that receives all log messages from
    various clients.</li>
    <li>Configure Rsyslog on each client server that forwards all its logs to
    the logging server.</li>
  </ul>
[/summary]

## Prerequisites

To follow through with this tutorial, you must have access to two Linux systems.
One of them will act as the centralized logging server, while the other will
pose as the production service that is generating logs. A non-root user with
`sudo` access is required on both systems.

The commands shown in this guide pertain to Debian-based distributions (such as
Ubuntu), but the concepts remain the same regardless of your Linux distribution
of choice. Also note that the client and server do not have to be the same
distribution although they will be portrayed as the same in this guide.

To simplify this tutorial, the traffic between both systems won't be encrypted,
and everyone with access to the network will be able to read your logs.
Therefore, ensure to encrypt the traffic between the servers to prevent this
from happening in your production systems.

![Better Stack log management dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)

[summary]
### Centralize and monitor your Linux logs with Better Stack

While this tutorial shows how to build a self-hosted Rsyslog server, [Better Stack](https://betterstack.com/log-management) provides cloud-based centralized logging with live tailing, SQL queries, and automated alerts. 

Forward logs from your Rsyslog clients (or your central Rsyslog server) using rsyslog's `omfwd` module, Vector, or OpenTelemetry. Get started in minutes without managing infrastructure.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


[/summary]


## Step 1 — Finding the private IP address of the centralized server (optional)

First off, you need to find out the private IPv4 addresses of the host server if
you don't intend to transmit your logs over the internet. Otherwise, you can use
the public IP address of the server.

Go ahead and connect to the server through `ssh`. Replace the placeholders in
the command below as appropriate.

```command
ssh <username>@<your_server_public_ip_address>
```

After connecting to the host server, you can determine its private IP address by
executing the `hostname` command as shown below:

```command
hostname -I
```

You should get an output that looks like this:

```text
[output]
0.0.0.0 2a01:4f8:c010:5f07::1
```

The first value of the output (`0.0.0.0`) is the private IPv4 address of the
server. This may be the same as the public IP address on some systems.

You can now proceed to the next step where we'll verify that Rsyslog is
installed and enabled on both the client and server.

## Step 2 — Installing and enabling the Rsyslog service

In this section, we will verify the status of the Rsyslog service on both the
client and host server. You can check if Rsyslog is installed on a system
through the command below:

```command
rsyslogd -v
```

You should get the following output if everything goes well:

```text
[output]
rsyslogd  8.2001.0 (aka 2020.01) compiled with:
        PLATFORM:                               x86_64-pc-linux-gnu
        PLATFORM (lsb_release -d):
        FEATURE_REGEXP:                         Yes
        GSSAPI Kerberos 5 support:              Yes
        FEATURE_DEBUG (debug build, slow code): No
        32bit Atomic operations supported:      Yes
        64bit Atomic operations supported:      Yes
        memory allocator:                       system default
        Runtime Instrumentation (slow code):    No
        uuid support:                           Yes
        systemd support:                        Yes
        Config file:                            /etc/rsyslog.conf
        PID file:                               /run/rsyslogd.pid
        Number of Bits in RainerScript integers: 64

See https://www.rsyslog.com for more information.
```

Since Ubuntu already pre-installs `rsyslog`, you can go ahead and confirm its
active status through the command below:

```command
systemctl status rsyslog
```

You should observe the following output:

```text
[output]
● rsyslog.service - System Logging Service
     Loaded: loaded (/lib/systemd/system/rsyslog.service; enabled; vendor preset: enabled)
     Active: active (running) since Mon 2022-02-07 12:41:41 UTC; 2 days ago
TriggeredBy: ● syslog.socket
       Docs: man:rsyslogd(8)
             https://www.rsyslog.com/doc/
   Main PID: 638 (rsyslogd)
      Tasks: 4 (limit: 2275)
     Memory: 180.4M
     CGroup: /system.slice/rsyslog.service
             └─638 /usr/sbin/rsyslogd -n -iNONE
```

If it's not active, go ahead and start the service through the command below:

```command
sudo systemctl start rsyslog
```

## Step 3 — Configuring the host server to receive logs

Now that we've confirmed that Rsyslog is installed and running on the host
server, go ahead and open its configuration file for editing using a text editor
such as `nano`:

```command
sudo nano /etc/rsyslog.conf
```

The file has the following contents (truncated for brevity):

```text
[label /etc/rsyslog.conf]
#################
#### MODULES ####
#################

module(load="imuxsock") # provides support for local system logging
#module(load="immark")  # provides --MARK-- message capability

# provides UDP syslog reception
#module(load="imudp")
#input(type="imudp" port="514")

# provides TCP syslog reception
#module(load="imtcp")
#input(type="imtcp" port="514")

# provides kernel logging support and enable non-kernel klog messages
module(load="imklog" permitnonkernelfacility="on")

###########################
#### GLOBAL DIRECTIVES ####
###########################

. . .
```

Find the following lines that are commented out:

```text
[label /etc/rsyslog.conf]
# provides UDP syslog reception
#module(load="imudp")
#input(type="imudp" port="514")

# provides TCP syslog reception
#module(load="imtcp")
#input(type="imtcp" port="514")
```

These lines load the `imudp` and `imtcp` modules for listening at the specified
UDP or TCP ports (both at the port `514`). You can listen to both ports if you
wish or change the port number as you see fit.

For this tutorial, we will use a TCP connection alone. Enable it by uncommenting
the following two lines of code (remove the `#` prefix):

```text
[label /etc/rsyslog.conf]
module(load="imtcp")
input(type="imtcp" port="514")
```

Save changes in file `/etc/rsyslog.conf` and exit the editor.

If your system includes a firewall configuration, you must also allow the new
TCP service at the specified port with `ufw`. It requires `sudo` because it
changes the firewall rules.

```command
sudo ufw allow 514/tcp
```

After running the command above, the firewall won't interfere with Rsyslog
traffic. Go ahead and restart the `rsyslog` service to apply the new
configuration:

```command
sudo systemctl restart rsyslog.service
```

Finally, you can check that the TCP port 514 is opened with the `ss` utility.
`sudo` is required because this utility reads sockets:

```command
sudo ss -tulnp | grep "rsyslog"
```

Here's a brief explanation of the `ss` parameters utilized above:

- `-u`: display UDP sockets.
- `-t`: display TCP sockets.
- `-l`: display only listening sockets.
- `-n`: do not convert port number into human-readable service name.
- `-p`: display process that uses the socket.

The output of `ss` is filtered by `grep`, which prints only lines containing
`rsyslog`:

```text
[output]
tcp    LISTEN  0       25                  0.0.0.0:514            0.0.0.0:*      users:(("rsyslogd",pid=440497,fd=5))
tcp    LISTEN  0       25                     [::]:514               [::]:*      users:(("rsyslogd",pid=440497,fd=6))
```

The output above shows that the Rsyslog service is already listening at
port 514.

## Step 4 — Setting up the remote log storage location

By default, all logs received from TCP port 514 will be merged in the `/var/log`
directory with the system's log file. This is typically unwanted behavior
because it mixes all remote logs with the host server's local logs, making it
more difficult to search and filter later on. To prevent this behavior, you need
to edit the Rsyslog configuration.

Once again, open up the `/etc/rsyslog.conf` file with your text editor and add
the following lines at the beginning of the file:

```text
[label /etc/rsyslog.conf]
$template RemoteLogs,"/var/log/%HOSTNAME%/%PROGRAMNAME%.log"
*.* ?RemoteLogs
& ~
```

The `$template RemoteLogs` directive instructs Rsyslog to store all incoming log
entries in the location that is defined by the third parameter. In our case, the
remote logs will continue to be stored in `/var/log` directory, but each client
will have its own subdirectory with a name equivalent to client hostname. This
subdirectory will store each log entry in a file that matches the client program
that generated it.

On the following line, the `*.* ?RemoteLogs` directive applies the `RemoteLogs`
configuration rule at all facilities with all priority levels (in other words,
to all logs). Finally, the `& ~` directive defines that Rsyslog stops processing
log input after it is stored to a file defined in previous lines. The default
configuration will overwrite the previous rule without this line.

Save the file, then restart the `rsyslog` service with `systemctl`:

```command
sudo systemctl restart rsyslog.service
```

At this point, your Rsyslog server is now fully configured to receive logs from
any number of remote clients. You should consider mounting the `/var/log`
directory in a separate partition from the one that the host system resides on
so that incoming logs do not fill up the storage of the host server.

## Step 5 — Forwarding logs from an Rsyslog client

In this section, we will instruct our Rsyslog client to forward all its logs to
the central Rsyslog server. First off, you must connect to your client server
through `ssh`:

```command
ssh <username>@<your_server_ip_address>
```

Once you're logged in successfully, edit the default Rsyslog configuration at
`/etc/rsyslog.d/50-default.conf` with a text editor (`sudo` is required for
write permission):

```command
sudo nano /etc/rsyslog.d/50-default.conf
```

At the `*.* @@<your_rsyslog_server_ip_address>:514` directive on a new line at
the beginning of the file. Make sure to replace the placeholder with the actual
IPv4 address of the server that you retrieved in step 1.

```text
[label /etc/rsyslog.d/50-default.conf]
#  Default rules for rsyslog.
#
#                       For more information see rsyslog.conf(5) and /etc/rsyslog.conf

*.* @@0.0.0.0:514

#
# First some standard log files.  Log by facility.
#
auth,authpriv.*                 /var/log/auth.log
*.*;auth,authpriv.none          -/var/log/syslog
#cron.*                         /var/log/cron.log
#daemon.*                       -/var/log/daemon.log
kern.*                          -/var/log/kern.log
#lpr.*                          -/var/log/lpr.log
mail.*                          -/var/log/mail.log
#user.*                         -/var/log/user.log
```

The directive you just added above defines that the Rsyslog service should send
all facilities with all priority levels (in other words, all logs) to the IP
address (`0.0.0.0` in the above example) of the centralized server at TCP
port 514. If you set up this directive using `@` instead of `@@`, then it will
forward the logs to the UDP port.

Note that the `*.*` syntax determines that all log entries on the server should
be forwarded. If you want to forward only specific logs, you can specify the
service name instead of `*` such as `cron.* @@0.0.0.0:514` or
`apache2.* @@0.0.0.0:514`. You can also forward logs to more than one server:

```text
[label /etc/rsyslog.d/50-default.conf]
*.* @@0.0.0.0:514

*.* @@192.168.122.235

cron.* @@192.168.122.237:514
```

After saving your changes to the file, restart the `rsyslog` service to apply
the new configuration:

```command
sudo systemctl restart rsyslog.service
```

At this point, your Rsyslog client is now fully configured to send its logs to
the centralized Rsyslog server.

## Step 6 — Testing your configuration

Now that you've configured both the Rsyslog client and centralized server, let's
go ahead and verify that our changes have had the desired effect. Go ahead and
manually create a log entry on the client through the `logger` command:

```command
logger 'test from client'
```

Afterward, confirm that the entry is present in the `/var/log/syslog` file
through the `tail` command:

```command
sudo tail /var/log/syslog
```

You should see the following message near the end of the output:

```text
[output]
Feb  9 22:17:42 ubuntu-20-04 root: test from client
```

Now, switch to the centralized Rsyslog server and view the contents of the
`/var/log` directory:

```command
ls /var/log
```

You should see a directory that corresponds to the hostname of the client
system. In this example, the hostname of the client server is `ubuntu-20-04` and
you can observe a `ubuntu-20-04` directory in the output below.

```text
[output]
alternatives.log  btmp                   dpkg.log    lastlog        ubuntu-2gb-nbg1-1/          wtmp
apache2/          cloud-init.log         faillog     private/       ubuntu-advantage.log
apt/              cloud-init-output.log  journal/    syslog         ubuntu-advantage-timer.log
auth.log          dist-upgrade/          kern.log    syslog.1       ufw.log
bootstrap.log     dmesg                  landscape/  ubuntu-20-04/  unattended-upgrades/
```

Examine the last 10 lines of the `root.log` file in this subdirectory:

```command
sudo tail /var/log/<your_client_hostname>/root.log
```

You should see the identical log entry observed on the client server:

```text
[output]
2022-02-09T22:17:42+00:00 ubuntu-20-04 root: test from client
```

At this point, it is clear that your Rsyslog client-server configuration is
working as expected.

## Conclusion and next steps

In this tutorial, you created a centralized logging service with Rsyslog. We
started by discussing the value that a centralized logging service provides,
then set up the host Rsyslog server that will store all the log entries of
individual clients. Afterward, we configured a client server to forward its logs
to the central server and tested our configuration to confirm that it was
working correctly.

You're now all set to **forward logs to the centralized server from as many
clients as you want**. To guarantee that the log entries from each client are
stored in their own directory, ensure that each client's hostname is unique. Also
don't forget to employ [Log
rotation](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) on the host
server to prevent the log files from growing too large and to automatically
delete the logs that are older than a certain number of days or weeks.

For more resources about Rsyslog, learn how to [collect, process, and ship log data](https://betterstack.com/community/guides/logging/rsyslog-explained/).


While this self-hosted Rsyslog setup gives you complete control, you can also forward logs from your Rsyslog server to [Better Stack](https://betterstack.com/log-management) to gain additional capabilities like **live tailing, SQL queries, automated anomaly detection, and built-in incident management**.

Thanks for reading, and happy logging!