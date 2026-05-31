# How To Start Logging With MySQL

This tutorial shows you how to configure and view different MySQL logs. MySQL is
an open-source relational database based on SQL (Structured Query Language).
MySQL offers various built-in logs. In general, a database is the cornerstone of
almost every backend, and because of that administrators want to log this
service.

MySQL has logs with various purpose. We will focus on following four
logs:

- **Error log**: Records problems encountered starting, running, or stopping
  `mysqld`. This log is stored by default in the `/var/log` directory. It could
  be useful if you want to analyze the server itself.
- **General query logs**: Records every connection established with each client.
  This log records everything that client sent to the server. This log is useful
  to determine client problems.
- **Binary logs**: Record each event that manipulates data in the database.
  These log records operations such as a table creating, modification of schema,
  inserting new values, or querying tables. These logs are used to backup and
  recover the database.
- **Slow query log**: Record of each query, which execution took too much time.
  This log could be useful for the optimisation of slow SQL queries.

In this tutorial, you will do the following actions:

- You will install the MySQL server and view default **error log**.
- You will connect to MySQL server, view metadata about **general query logs**
  and view these logs.
- You will understand the concept of the MySQL **binary logs** and where to find
  them.
- You will enable and configure a **slow query log**, simulate some slow query
  and check this incident in the new log.

## Prerequisites

You will need:

- Ubuntu 20.04 distribution including the non-root user with `sudo` access.
- Basic knowledge of SQL languages (understanding of simple select query
  statement).

[ad-logs]

## Step 1 — Viewing Error Log

The MySQL server is maintained by the command-line program `mysqld`. This
program manages access to the MySQL data directory that contains databases and
tables. The problems encountered during `mysqld` starting, running, or stopping
are stored as a custom log in the directory `/var/log/mysql`. This log doesn't
include any information about SQL queries. It is useful for the analysis of the
MySQL server.

First of all, let's install the MySQL server. Ubuntu 20.04 allows to install the
MySQL from default packages with the `apt install` (installation requires `sudo`
privilege):

    $ sudo apt update
    $ sudo apt install mysql-server

The first command will update Ubuntu repositories, and the second will download
and install required packages for the MySQL server.

Now, the server is installed. The new service already creates a default error
log. You can list the directory `/var/log` and find a new subdirectory `mysql`
with `ls`:

    $ ls /var/log/

You'll see the program's output appear on the screen:

    Output
    alternatives.log       bootstrap.log           kern.log.4.gz
    alternatives.log.1     btmp                    lastlog
    alternatives.log.2.gz  btmp.1                  letsencrypt
    alternatives.log.3.gz  cups                    my-custom-app
    apache2                dist-upgrade            mysql
    apport.log             dmesg                   openvpn
    apport.log.1           dmesg.0                 private
    apport.log.2.gz        dmesg.1.gz              speech-dispatcher
    apport.log.3.gz        dmesg.2.gz              syslog
    apport.log.4.gz        dmesg.3.gz              syslog.1
    apport.log.5.gz        dmesg.4.gz              syslog.2.gz
    apport.log.6.gz        dpkg.log                syslog.3.gz
    apport.log.7.gz        dpkg.log.1              syslog.4.gz
    apt                    dpkg.log.2.gz           syslog.5.gz
    auth.log               dpkg.log.3.gz           syslog.6.gz
    auth.log.1             faillog                 syslog.7.gz
    auth.log.2.gz          fontconfig.log          teamviewer15
    auth.log.3.gz          gdm3                    test.log
    auth.log.4.gz          gpu-manager.log         ubuntu-advantage.log
    boot.log               gpu-manager-switch.log  unattended-upgrades
    boot.log.1             hp                      wtmp
    boot.log.2             installer               wtmp.1
    boot.log.3             journal                 Xorg.0.log
    boot.log.4             kern.log                Xorg.0.log.old
    boot.log.5             kern.log.1              Xorg.1.log
    boot.log.6             kern.log.2.gz           Xorg.1.log.old
    boot.log.7             kern.log.3.gz

The output shows also directory `mysql`. This directory contains by default
single log `error.log`. Let's view the content of file `error.log` with `cat`:

    cat /var/log/mysql/error.log

You'll see the program's output appear on the screen:

    Output
    2021-04-28T09:36:19.040254Z 0 [System] [MY-013169] [Server] /usr/sbin/mysqld (mysqld 8.0.23-0ubuntu0.20.04.1) initializing of server in progress as process 62373
    2021-04-28T09:36:19.046865Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.
    2021-04-28T09:36:20.482915Z 1 [System] [MY-013577] [InnoDB] InnoDB initialization has ended.
    2021-04-28T09:36:23.709432Z 6 [Warning] [MY-010453] [Server] root@localhost is created with an empty password ! Please consider switching off the --initialize-insecure option.
    2021-04-28T09:36:28.971810Z 6 [System] [MY-013172] [Server] Received SHUTDOWN from user boot. Shutting down mysqld (Version: 8.0.23-0ubuntu0.20.04.1).
    2021-04-28T09:36:33.851492Z 0 [System] [MY-010116] [Server] /usr/sbin/mysqld (mysqld 8.0.23-0ubuntu0.20.04.1) starting as process 62437
    2021-04-28T09:36:33.870257Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.
    2021-04-28T09:36:34.114770Z 1 [System] [MY-013577] [InnoDB] InnoDB initialization has ended.
    2021-04-28T09:36:34.222753Z 0 [ERROR] [MY-011292] [Server] Plugin mysqlx reported: 'Preparation of I/O interfaces failed, X Protocol won't be accessible'
    2021-04-28T09:36:34.222924Z 0 [ERROR] [MY-011300] [Server] Plugin mysqlx reported: 'Setup of socket: '/var/run/mysqld/mysqlx.sock' failed, can't create lock file /var/run/mysqld/mysqlx.sock.lock'
    2021-04-28T09:36:34.354295Z 0 [Warning] [MY-010068] [Server] CA certificate ca.pem is self signed.
    2021-04-28T09:36:34.354479Z 0 [System] [MY-013602] [Server] Channel mysql_main configured to support TLS. Encrypted connections are now supported for this channel.
    ...

The output shows that the file stores plain text records about the `mysqld`
server initialisation, and running.

## Step 2 — Viewing General Query Logs

The server writes records about each client event during connection to the
general query log. Basically, it keeps the information about all SQL statements
that happens. This log is useful when the administrators want to know what
clients exactly execute.

### Connecting to Server and Checking General Query Log Status

First of all, let's check the status of the general query log because this
logging feature can be turned off.

You can connect to MySQL server as a root client:

    $ sudo mysql

You will be redirected to MySQL command-line.

Now, you can view system variables related to the general query log by executing
command `show variables`:

    mysql> show variables like '%general%';

The clause specifies a pattern that should match the variable. In our case, the
pattern `'%general%'` specifies to show variables that contain the string
`general`. You'll see the program's output appear on the screen:

    Output
    +------------------+-----------------------------+
    | Variable_name    | Value                       |
    +------------------+-----------------------------+
    | general_log      | ON                          |
    | general_log_file | /var/lib/mysql/alice.log    |
    +------------------+-----------------------------+
    2 rows in set (0.01 sec)

The output shows two variables:

- `general_log`: the variable holds value `ON` (general log enable), or `OFF`
  (general log disabled).
- `general_log_file`: the variable defines where is the log stored in the file
  system.

As you can see, the general query log is by default enabled. We can disconnect
from the server by executing the `exit` command:

    mysql> exit;

You will be redirected back to the terminal.

### Viewing General Query Log

Now, you can view the content of this log with a `cat` (the `sudo` is required
because this file is maintained by the system):

    $ sudo cat /var/lib/mysql/alice.log

You'll see the program's output appear on the screen:

    Output
    /usr/sbin/mysqld, Version: 8.0.23-0ubuntu0.20.04.1 ((Ubuntu)). started with:
    Tcp port: 3306  Unix socket: /var/run/mysqld/mysqld.sock
    Time                 Id Command    Argument
    2021-04-28T10:47:28.713271Z	   10 Connect	root@localhost on  using Socket
    2021-04-28T10:47:28.713625Z	   10 Query	select @@version_comment limit 1
    2021-04-28T10:53:50.778598Z	   10 Query	show variables like '%general%'
    2021-04-28T13:35:41.944309Z	   10 Quit

The output shows all statement executed on the server. You can see the time
stamp and the specific command that was executed. There is also the executed
command `show variables like '%general%'`.

## Step 3 — Listing Binary Logs

The binary log contains events that manipulated the database. If you want to
recover the database, you need a backup and a binary log relevant to this
backup. There are multiple binary logs because they are versioned.

By default, the binary logs are enabled. You can check where are they stored.
Let's connect to the MySQL server as a root client:

    $ sudo mysql

You will be redirected to MySQL prompt.

Now, you can check the binary logs status by executing `show binary logs`:

    mysql> show binary logs;

The command will list the binary log files on the server:

    Output
    +---------------+-----------+-----------+
    | Log_name      | File_size | Encrypted |
    +---------------+-----------+-----------+
    | binlog.000001 |       179 | No        |
    | binlog.000002 |       403 | No        |
    | binlog.000003 |       770 | No        |
    | binlog.000004 |       179 | No        |
    | binlog.000005 |       403 | No        |
    | binlog.000006 |       892 | No        |
    +---------------+-----------+-----------+
    6 rows in set (0.00 sec)

The output shows all binary logs. Now, we can find out where are this logs
stored.

We can show logs location by executing command `show variables`:

    mysql> show variables like '%log_bin%';

We already use this `show` clause in the previous step. This time, the clause
shows variables that contain the string `log_bin`. You'll see the program's
output appear on the screen:

    Output
    +---------------------------------+-----------------------------+
    | Variable_name                   | Value                       |
    +---------------------------------+-----------------------------+
    | log_bin                         | ON                          |
    | log_bin_basename                | /var/lib/mysql/binlog       |
    | log_bin_index                   | /var/lib/mysql/binlog.index |
    | log_bin_trust_function_creators | OFF                         |
    | log_bin_use_v1_row_events       | OFF                         |
    | sql_log_bin                     | ON                          |
    +---------------------------------+-----------------------------+
    6 rows in set (0.00 sec)

The output shows that the binary logs are stored in directory `/var/lib/mysql`,
and they are labelled as `binlog.index` (for example `binlog.000001`).

We can disconnect from the server by executing the `exit` command:

    mysql> exit;

You will be redirected back to the terminal.

Now, let's list the directory `/var/lib/mysql` but only as a root because it is
owned and maintained by the system:

    $ sudo ls /var/lib/mysql

You'll see the program's output appear on the screen:

    Output
    auto.cnf	     ca.pem		            ib_logfile0	   private_key.pem
    binlog.000001	 client-cert.pem      ib_logfile1	   public_key.pem
    binlog.000002	 client-key.pem       ibtmp1		     server-cert.pem
    binlog.000003	 debian-5.7.flag      '#innodb_temp' server-key.pem
    binlog.000004	 EXAMPLE_DB	          alice.log	     sys
    binlog.000005	 '#ib_16384_0.dblwr'  alice.pid	     undo_001
    binlog.000006	 '#ib_16384_1.dblwr'  mysql		       undo_002
    binlog.index	 ib_buffer_pool       mysql.ibd
    ca-key.pem	   ibdata1	            performance_schema

The output shows that the directory `/var/lib/mysql` contains the binary log
files.

## Step 4 — Configuring Slow Query Log

MySQL allows to log queries, which took too much time. This mechanism is called
a slow query log.

### Enabling Slow Query Logging

By default, the slow query log is disabled. You can enable it by editing MySQL
configuration file `/etc/mysql/mysql.conf.d/mysqld.cnf` (`sudo` required):

    $ sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

The file contains following lines that holds configuration variables (by default
commented out):

    ...
    # Here you can see queries with especially long duration
    # slow_query_log          = 1
    # slow_query_log_file     = /var/log/mysql/mysql-slow.log
    # long_query_time = 10
    ...

These three lines holds following three configuration variables:

- `slow_query_log`: the slow query logging is disable (value `0`) or enabled
  (value `1`).
- `slow_query_log_file`: the slow query log is stored in the file
  `/var/log/mysql/mysql-slow.log`. You can specify your own file.
- `long_query_time`: by default, the slow query logs record each SQL query that
  takes more than 10 seconds. You can change this minimal time interval to
  another value. The value can be specified as a floating-point number where the
  value `1.0` refers to 1 second.

You can enable slow query log by uncommenting this three lines. Also, you can
set your own `long_query_time` value:

    ...
    # Here you can see queries with especially long duration
    slow_query_log          = 1
    slow_query_log_file     = /var/log/mysql/mysql-slow.log
    long_query_time = 5
    ...

In our example, we change the default `long_query_time` value to 5 seconds. Now,
you can save the file.

If you want immediately apply the new configuration rules then you must restart
the MySQL server with `systemctl` (`sudo` required):

    $ sudo systemctl restart mysql.service

Now, the MySQL server enables slow query log.

### Checking Slow Query Log Status

You can check that the log is enabled if you login into the MySQL server as a
root client:

    $ sudo mysql

You will be redirected to MySQL prompt.

Let's check the slow query log status by executing command `show variables`:

    mysql> show variables like '%slow_query_log%';

Once again, we use the `show` clause. This time, the clause shows variables that
contain the string `slow_query_log`. You'll see the program's output appear on
the screen:

    Output
    +---------------------+----------------------------------+
    | Variable_name       | Value                            |
    +---------------------+----------------------------------+
    | slow_query_log      | ON                               |
    | slow_query_log_file | /var/log/mysql/mysql-slow.log   |
    +---------------------+----------------------------------+
    2 rows in set (0.00 sec)

The output shows that the slow query log is enabled (the variable
`slow_query_log` holds the value `ON`). The log is stored in the file
`/var/log/mysql/mysql-slow.log`. You can see that it is the same file as the
file specified in the configuration script.

Let's view actual slow query time interval by executing the command
`show variables`:

    mysql> show variables like '%long_query_time%';

You'll see the program's output appear on the screen:

    Output
    +-----------------+-----------+
    | Variable_name   | Value     |
    +-----------------+-----------+
    | long_query_time |  5.000000 |
    +-----------------+-----------+
    1 row in set (0.00 sec)

The output shows that the variable `long_query_time` holds the value 5 seconds
(as we define in the configuration script).

### Viewing Slow Query Log

At last, we can check that the MySQL records slow queries to the new log. You
can execute the following select query that takes 6 seconds:

    mysql> select sleep(6);

The `select` will wait 6 seconds and then return 0:

    Output
    +----------+
    | sleep(6) |
    +----------+
    |        0 |
    +----------+
    1 row in set (6.01 sec)

The output shows that this query takes 6 seconds. As a result, it should be
recorded in a slow query log.

We can disconnect from the server by executing the `exit` command:

    mysql> exit;

You will be redirected back to the terminal.

At last, we can print content of the slow query log
`/var/log/mysql/mysql-slow.log` (the `sudo` is required because the file is
maintained by system):

    $ sudo cat /var/log/mysql/mysql-slow.log

You'll see the program's output appear on the screen:

    /usr/sbin/mysqld, Version: 8.0.23-0ubuntu0.20.04.1 ((Ubuntu)). started with:
    Tcp port: 3306  Unix socket: /var/run/mysqld/mysqld.sock
    Time                 Id Command    Argument
    # Time: 2021-04-29T06:28:55.445053Z
    # User@Host: root[root] @ localhost []  Id:    15
    # Query_time: 6.000443  Lock_time: 0.000000 Rows_sent: 1  Rows_examined: 1
    SET timestamp=1619677729;
    select sleep(6);

You can see that the output shows record about execution query
`select sleep(6)`.

## Conclusion

In this tutorial, you configured and viewed different MySQL logs. You installed
the MySQL server and viewed the **error log**. You connected to the server,
viewed the **general query logs** and their configuration. You listed **binary
logs**. At last, you enabled, configured and viewed a **slow query log**.
