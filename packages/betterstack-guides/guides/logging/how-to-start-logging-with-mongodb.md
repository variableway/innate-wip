# How to Get Started with Logging in MongoDB

MongoDB is a popular open-source NoSQL database that stores data in Binary JSON
format. MongoDB is designed to be flexible and scalable, making it suitable for
a wide range of applications, including web and mobile applications, content
management systems, and data analytics platforms.

Logging is an essential component of any database management system, including
MongoDB, as it allows administrators and developers to track system behavior,
monitor performance, and diagnose issues quickly and efficiently if something
happens.

In this article, we will investigate how to configure logging options and how to
view and analyze log messages in MongoDB.

## Prerequisites

Before proceeding with this article, make sure:

- You are using Ubuntu 22.04 LTS and can log on as a user with `root`
  privileges.
- You have experience using command-line utilities.
- You understand some basic concepts in logging such as [log
  levels](https://betterstack.com/community/guides/logging/log-levels-explained/) and [log
  rotation](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/)


[ad-logs]

## Install MongoDB

To get started, you must
[install the latest version of the MongoDB server](https://www.mongodb.com/docs/v6.0/tutorial/install-mongodb-on-ubuntu/)
(currently V6.0) on your machine.

First, import the MongoDB public GPG Key with the following command:

```command
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
```

Create a list file for MongoDB:

```command
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```

Update the package database:

```command
sudo apt-get update
```

And finally, install the latest version of MongoDB:

```command
sudo apt-get install -y mongodb-org
```

After the installation process is done, you may start MongoDB with the following
command:

```command
sudo systemctl start mongod
```

Verify the status of MongoDB:

```command
sudo systemctl status mongod
```

![Start MongoDB](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2443bec5-0e80-4940-6942-02a66e68f400/lg2x =2089x762)

You may access MongoDB by starting a new `mongosh` session:

```command
mongosh
```

![Access MongoDB](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d365c13b-3227-4c30-df26-433320a71e00/md1x =2088x1463)

## MongoDB configurations

First of all, there are some logging-related configurations we must discuss. The
configuration file is located at `/etc/mongod.conf`, and you may open it with
the following command:

```command
sudo nano /etc/mongod.conf
```

In this article, we are only concerned with the `systemLog` section.

```text
[label /etc/mongod.conf]
. . .
# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
. . .
```

The `destination` option defines where the logs will be sent, either `file` or
`syslog`. If `file` is specified, you must also define a `path` pointing to the
log file. By default, the logs will be sent to `/var/log/mongodb/mongod.log`.

Besides `destination` and `path`, there are many other possible options for
`systemLog`, as shown in the list below:

- `verbosity`: Defines the minimum verbosity level (also known as severity level
  or [log level](https://betterstack.com/community/guides/logging/log-levels-explained/)) a log entry has to have to be logged by
  MongoDB. The verbosity levels in MongoDB are slightly more complicated than
  other technologies, and we'll discuss this in detail later.
- `quiet`: When set to `true`, MongoDB will run in the quiet mode, limiting the
  number of logs pushed to the destination. This is **not** recommended in a
  production environment.
- `traceAllExceptions`: When set to `true`, MongoDB will print verbose
  information in the log messages, providing additional information for
  debugging purposes.
- `syslogFacility`: This setting is related to your operating system's
  implementation of syslog. Common facilities include kernel, user, mail,
  system, network, etc. By default, `syslogFacility` is set to the user.
- `logAppend`: Determines if `mongos` and `mongod` would append new log entries
  to the end of the existing log file when they restart. If set to `false`,
  MongoDB will back up the old log file and create a new one.
- `logRotate`: Specifies MongoDB's behavior when log rotation occurs. Two
  acceptable values are `rename` and `reopen`. `rename` will rename the old log
  file by appending a timestamp to the file name and then open a new log file.
  `reopen` closes the original log file and then reopens it.
- `timeStampFormat`: Determines the format of the timestamp, either
  `iso8601-utc` (`1970-01-01T00:00:00.000Z`) or `iso8601-local`
  (`1969-12-31T19:00:00.000-05:00`).
- `component.<component>.verbosity`: This configuration option has many
  variants, allowing you to define different verbosity levels for individual
  MongoDB components.

  ```text
  systemLog:
   component:
      accessControl:
         verbosity: <int>
      command:
         verbosity: <int>
      . . .
  ```

After making changes to the configuration file, you need to restart MongoDB for
the changes to take effect.

```command
sudo systemctl restart mongod
```

The configuration settings mentioned above also have corresponding
[command-line options](https://www.mongodb.com/docs/v6.0/reference/configuration-file-settings-command-line-options-mapping/)
as shown in the linked article. However, the command-line utility does not
change the configuration file, which means the next time MongoDB starts, the
settings will be reset.

### Additional MongoDB server parameters

MongoDB also provides a set of
[configuration parameters](https://www.mongodb.com/docs/v6.0/reference/parameters/#logging-parameters)
besides the ones listed above. These parameters may be defined under the
`setParameter` option in the `mongod.conf` file so that they are set during
start-up:

```text
[label /etc/mongod.conf]
. . .
setParameter:
   <parameter1>: <value1>
   <parameter2>: <value2>
```

Or you may set a temporary value in the MongoDB shell (`mongosh`) using
`db.adminCommand()` function:

```command
db.adminCommand( { setParameter: 1, <parameter>: <value> } )
```

These parameters are used to customize MongoDB's behavior further. Some
logging-related parameters include:

- `logLevel`: Equivalent of `systemLog.verbosity`, allowing you to set verbosity
  level using the following command:

  ```command
  db.adminCommand( { setParameter: 1, logLevel: 2 } )
  ```

  ```text
  [output]
  { was: 0, ok: 1 }
  ```

- `logComponentVerbosity`: Equivalent of `systemLog.component.xxx.verbosity`,
  setting verbosity level for individual components.
- `maxLogSizeKB`: defines the maximum size of a single log entry's attribute
  field. If the log entry exceeds this limit, it will be truncated.

## View log messages

By default, MongoDB logs are stored at `/var/log/mongodb/mongod.log`. Execute
the following command to check its content:

```command
sudo cat /var/log/mongodb/mongod.log
```

```text
[output]
. . .
{"t":{"$date":"2023-03-16T14:31:51.393-04:00"},"s":"I",  "c":"NETWORK",  "id":51800,   "ctx":"conn15","msg":"client metadata","attr":{"remote":"127.0.0.1:42480","client":"conn15","doc":{"driver":{"name":"nodejs|mongosh","version":"5.1.0"},"os":{"type":"Linux","name":"linux","architecture":"x64","version":"5.15.90.1-microsoft-standard-WSL2"},"platform":"Node.js v16.19.1, LE (unified)","version":"5.1.0|1.8.0","application":{"name":"mongosh 1.8.0"}}}}
```

These logs are in JSON format and can be formatted for improved readability by
using a third-party command-line utility called `jq`, which can be installed
using the following command:

```command
sudo apt install -y jq
```

```text
[output]
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following packages were automatically installed and are no longer required:
  . . .
Use 'sudo apt autoremove' to remove them.
The following additional packages will be installed:
  libjq1
The following NEW packages will be installed:
  jq libjq1
0 upgraded, 2 newly installed, 0 to remove and 3 not upgraded.
```

Next, use `jq` to reformat the log messages:

```command
sudo cat /var/log/mongodb/mongod.log | jq
```

```text
[output]
. . .
{
  "t": {
    "$date": "2023-03-16T14:33:25.117-04:00"
  },
  "s": "I",
  "c": "NETWORK",
  "id": 23016,
  "ctx": "listener",
  "msg": "Waiting for connections",
  "attr": {
    "port": 27017,
    "ssl": "off"
  }
}
```

### Understand MongoDB log messages

Now let's take a closer look at the log messages. Each log entry is a JSON
object with the following fields:

- `"t"`: Records the timestamp of the log message in ISO-8601 format.
- `"s"`: The severity level of the log message.
- `"c"`: Specifies the component this log record belongs to.
- `"id"`: A unique identifier.
- `"ctx"`: Context information.
- `"msg"`: The message body.
- `"attr"`: Include additional information such as client data, file path, line
  number, etc.
- `"tags"`: Optional tags.
- `"truncated"`: Contains truncation information if the message is truncated.
- `"size"`: The original size of the entry before truncation.

## Verbosity levels

You may have noticed that we mentioned verbosity levels many times in this
article. It is an essential part of logging in MongoDB, and in this section,
we'll discuss MongoDB's verbosity levels in detail.

MongoDB provides the following verbosity levels:

- `"F"`: Fatal messages.
- `"E"`: Error messages.
- `"W"`: Warning messages.
- `"I"`: Informational messages. Corresponds to numeric value `0`.
- `"D1"`-`"D5"`: Debug messages, Corresponds to numeric value `1`-`5`.

You may use the numeric values to define the minimum verbosity level a log entry
must have to be logged by MongoDB. Notice that only informational and debug
messages have numeric values, meaning fatal, error, and warning messages will
always be logged.

MongoDB provides multiple ways to define minimum verbosity level. First, you may
use the `systemLog.verbosity` configuration option. Its default value is `0`,
meaning only fatal, error, warning, and informational messages will be logged.
You can give it a different numeric value, for example:

```text
[label /etc/mongod.conf]
. . .
systemLog:
  verbosity: 1
. . .
```

Restart the `mongod` instance, and MongoDB will start logging `D1` level debug
messages.

You can check the current verbosity level setting inside the MongoDB shell
(`mongosh`):

```command
db.getLogComponents()
```

```text
[output]
{
verbosity: 1,
accessControl: { verbosity: -1 },
assert: { verbosity: -1 },
command: { verbosity: -1 },
control: { verbosity: -1 },
executor: { verbosity: -1 },
geo: { verbosity: -1 },
index: { verbosity: -1 },
. . .
}
```

Notice the verbosity level is set to `-1` for individual components, which means
it will inherit the parent's value. You can change that value by specifying the
`systemLog.component.<component>.verbosity` option like this:

```text
[label /etc/mongod.conf]
systemLog:
  component:
    accessControl:
      verbosity: 0
    command:
      verbosity: 1
```

Restart `mongod` again, and this time, its verbosity level settings should be as
follows:

```text
[output]
{
  verbosity: 1,
  [highlight]
  accessControl: { verbosity: 0 },
  [/highlight]
  assert: { verbosity: -1 },
  [highlight]
  command: { verbosity: 1 },
  [/highlight]
  . . .
}
```

Besides editing the configuration file, MongoDB also allows you to modify the
verbosity level directly in the MongoDB shell using the following command:

```command
db.adminCommand( { setParameter: 1, logLevel: 2 } )
```

Or modify verbosity level for individual components:

```command
db.adminCommand( {
   setParameter: 1,
   logComponentVerbosity: {
      verbosity: 1,
      command: { verbosity: 2 },
      . . .
   }
} )
```

However, these components will not change the configuration file, which means
when MongoDB restarts, all verbosity settings will reset based on the
configuration file.

## Log rotation

Log rotation refers to the process of archiving and deleting old log files to
save disk space and improve performance. In MongoDB, log rotation can be
triggered in three different ways.

You can send a SIGUSR1 signal to the `mongod` or `mongos` process. For example,
if a `mongod` instance has a process ID (PID) of 2000, the following command
would trigger log rotation:

```command
kill -SIGUSR1 2000
```

Or you can run MongoDB's `logRotate` command. Enter the MongoDB shell and run
the following command:

```command
db.adminCommand( { logRotate : "server" } )
```

However, both methods require you to execute commands manually. The best way to
set up log rotation is by using [Ubuntu's default `logrotate`
utility](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/), which will
trigger log rotation periodically. Refer to the linked article to set up log
rotation for a custom application.

To use `logrotate`, you must go to the configuration file and set
`systemLog.logRotate` to `reopen`, which follows the typical Linux log rotate
behavior, and also set `systemLog.logAppend` to `true`, which is required by
`systemLog.logRotate: true`.

## Analyze log messages

Lastly, let's discuss how to analyze log entries generated by MongoDB.
Unfortunately, MongoDB doesn't offer such features, but there are third-party
tools you can use.

For example, we briefly mentioned the `jq` command-line utility and used it to
reformat log entries for improved readability. The `jq` utility can also parse
and analyze structured log messages. For instance, the following command returns
the top 10 log entries with unique `"msg"` values, sorted by frequency.

```command
jq -r ".msg" /var/log/mongodb/mongod.log | sort | uniq -c | sort -rn | head -10
```

Please refer to
[MongoDB documentation](https://www.mongodb.com/docs/v6.0/reference/log-messages/#log-parsing-examples)
or [`jq` documentation](https://stedolan.github.io/jq/manual/) for more details.

Besides `jq`, which is designed for parsing JSON messages, there are also tools
such as [`mtools`](https://rueckstiess.github.io/mtools/), which is explicitly
designed for analyzing MongoDB logs. The `mtools` allows you to create filters,
gather information regarding a log file, and even visualize log entries by
creating plots. Again, you may refer to the linked documentation for details.

### Integrate MongoDB with Logtail

However, both these methods require a lot of effort and are unsuitable for users
needing advanced features. A better option is to use a dedicated log management
platform such as Logtail.

Logtail is a cloud-based log processing and analytics platform that helps you
monitor your applications and quickly troubleshoot them if issues occur. Logtail
collects, parses, and analyzes your logs in real time, providing powerful
features such as alerts, dashboards, and integrations.

To integrate MongoDB with Logtail, head over to
[Logtail](https://betterstack.com/logtail) and create a new account. After you
are logged in, go to **Sources**, and connect a new source.

![New source](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0c4085b0-f678-40b6-d326-43e1b85a6b00/md1x =3063x1868)

After creating a new source, you will be redirected to this page, displaying the
source token, data retention period, etc.

![New source success](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b59a4942-f1e3-40a0-4659-802cbfd45200/public =3063x1886)

Scroll down to the installation instructions section, and follow the
instructions to connect your MongoDB.

![installation instructions](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fd1c5bfa-c721-457f-4f43-955ad5759500/md2x =3063x1880)

You might need to run the commands with `root` privileges, and if everything
goes correctly, you should get the following output.

![vector started](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bf8a92e8-e05d-423a-1ced-9e20463fd500/orig =2102x1190)

Save the changes and go to **Live tail**, and you should start receiving MongoDB
logs in Logtail.

![Live tail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b04960ec-a034-4803-5ebf-b33645ccae00/lg1x =3063x1868)

## Conclusion

This tutorial covers how to configure MongoDB's logging behavior, how to view
log messages, how to set up verbosity levels, how to rotate logs, as well as how
to analyze log messages using Logtail. This tutorial aims to help you understand
and use MongoDB's logging capabilities.

However, this article only discusses the basics of logging in MongoDB, and you'll likely be facing many other issues in practice. For example, when your application starts to scale, logging on to different servers to check the logs will become a tedious task. In this case, you should consider [aggregating the logs](https://betterstack.com/community/guides/logging/log-aggregation/) so that you may monitor them in one place. For additional resources head over to [MonoDB monitoring tools](https://betterstack.com/community/comparisons/mongodb-monitoring-tools/).

We hope this article has been helpful to you, and thank you for reading!
