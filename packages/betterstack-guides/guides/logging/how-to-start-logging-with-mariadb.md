# How To Start Logging With MariaDB

This tutorial shows you how to configure and view different MariaDB logs.
MariaDB is an open-source relational database based on SQL (Structured Query
Language). MariaDB offers various built-in logs. In general, a database is the
basis of almost every backend, and administrators want to log this service.

MariaDB has four main logs with different purpose:

- **Error log**: Problems encountered during starting, running, or stopping the
  server. The database always generates records for this log, but the
  destination is configurable. It is useful when you want to analyze the server
  itself.
- **General query logs**: Records every connection established with each client.
  This log records every query that the client sent to the server. This log is
  useful to determine client problems. However, the log can grow large quite
  quickly.
- **Binary logs**: Record each event that manipulates data in a database. It
  records operations such as table creating, modification of schema, inserting
  new values, or querying tables. These logs are used to backup and recover the
  database.
- **Slow query log**: Record of each query, which execution took too much time.
  This log could be useful for the optimisation of slow SQL queries.

In this tutorial, you will do following actions:

- You will install the MariaDB server, configure and view default **error log**.
- You will connect to the MariaDB server, view metadata about **general query
  logs,** enable it and view these logs.
- You will enable the MariaDB **binary logs** and list them.
- You will enable and configure a **slow query log**, simulate some slow query
  and check this incident in the new log.

## Prerequisites

You will need:

- Ubuntu 20.04 distribution including the non-root user with `sudo` access.
- The server shouldn't include the installed MySQL server because there is a
  problem with coexistence with the MariaDB configuration. You can learn how to
  completely remove MySQL from the machine in the following
  [article](https://linuxscriptshub.com/uninstall-completely-remove-mysql-ubuntu-16-04/).
- Basic knowledge of SQL languages (understanding of simple select query
  statement).

[summary]

## Side note: Centralize MariaDB logs in Better Stack

Once MariaDB is writing logs to syslog or files, you can ship them to Better Stack for live tail, fast search, and alerting without running your own log storage.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Step 1 — Viewing and Configuring Error Log

The MariaDB server is maintained by the command-line program `mariadb`. This
program manages access to the MariaDB data directory that contains databases and
tables. The problems encountered during `mariadb` starting, running, or stopping
are recorded as an error log. This log doesn't include any information about SQL
queries. It is useful for the analysis of the MariaDB server.

### Installing MariaDB server

First of all, let's install the MariaDB server. Ubuntu 20.04 allows to install
the MariaDB from default packages with the `apt install` (installation requires
`sudo` privilege):

    $ sudo apt update
    $ sudo apt install mariadb-server

The first command will update Ubuntu repositories, and the second will download
and install required packages for the MariaDB server. Now, the server is
installed.

### Connecting to Server and Viewing the Default Configuration

The error log is always enabled, but the destination of this log is
configurable. Let's view the default configuration.

You can connect to MariaDB server as a root client:

    $ sudo mariadb

You will be redirected to MariaDB command-line.

Now, you can view system variables related to the error log by executing command
`show variables`:

    MariaDB> show variables like '%log_error%';

The clause specifies a pattern that should match the variable. In our case, the
pattern `'%log_error%'` specifies to show variables that contain the string
`log_error`. You'll see the program's output appear on the screen:

    Output
    +---------------+-------+
    | Variable_name | Value |
    +---------------+-------+
    | log_error     |       |
    +---------------+-------+
    1 row in set (0.002 sec)

The output shows the global variable `log_error`. This variable holds the
absolute path to file where are stored error log records. As you can see, it is
by default set to null. As a result, the error log output goes to **syslog**.

You can disconnect from the server by executing the `exit` command:

    MariaDB> exit;

You will be redirected back to the terminal.

### Viewing Error Log With Journal

Now, you can view the syslog records related to the MariaDB service with
`journalctl`:

    $ journalctl -u mariadb.service

The option `-u` with the name of the service MariaDB displays only records
related to this service:

    Output
    May 19 08:54:02 alice systemd[1]: Started MariaDB 10.5.10 database server.
    May 19 08:54:02 alice /etc/mysql/debian-start[17467]: Upgrading MySQL tables if necessary.
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: Looking for 'mysql' as: /usr/bin/mysql
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: Looking for 'mysqlcheck' as: /usr/bin/mysqlcheck
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: Phase 1/7: Checking and upgrading mysql database
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: Processing databases
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.column_stats                                 OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.columns_priv                                 OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.db                                           OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.event                                        OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.func                                         OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.global_priv                                  OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.gtid_slave_pos                               OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.help_category                                OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.help_keyword                                 OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.help_relation                                OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.help_topic                                   OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.index_stats                                  OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.innodb_index_stats                           OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.innodb_table_stats                           OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.plugin                                       OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.proc                                         OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.procs_priv                                   OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.proxies_priv                                 OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.roles_mapping                                OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.servers                                      OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.table_stats                                  OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.tables_priv                                  OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.time_zone                                    OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.time_zone_leap_second                        OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.time_zone_name                               OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.time_zone_transition                         OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.time_zone_transition_type                    OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.transaction_registry                         OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: Phase 2/7: Installing used storage engines... Skipped
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: Phase 3/7: Fixing views
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: Processing databases
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: information_schema
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql.user                                         OK
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: performance_schema
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: Phase 4/7: Running 'mysql_fix_privilege_tables'
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: Phase 5/7: Fixing table and database names
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: Processing databases
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: information_schema
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: mysql
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: performance_schema
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: Phase 6/7: Checking and upgrading tables
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: Processing databases
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: information_schema
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: performance_schema
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: Phase 7/7: Running 'FLUSH PRIVILEGES'
    May 19 08:54:05 alice /etc/mysql/debian-start[17470]: OK

The output shows that the syslog stores records about the `mariadb` server
initialisation, and running.

### Configuring Custom Error Log File

If you don't want to include MariaDB error log into syslog, you can set up a
custom log file. You can configure custom error log file by editing MariaDB
configuration file `/etc/mysql/mariadb.conf.d/50-server.cnf` (`sudo` required):

    $ sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf

The file contains the following lines that hold configuration variable
`log_error` (by default commented out):

    # Enable this if you want to have error logging into a separate file
    #log_error = /var/log/mysql/error.log

You can configure a custom error log file by uncommenting the line with the
variable `log_error`, and set up the absolute path to the log file:

    # Enable this if you want to have error logging into a separate file
    log_error = /var/log/mariadb/error.log

In our example, we change the default `log_error` value to the directory
`/var/log/mariadb` (the Linux default directory for logs). Now, you can save the
file.

Now, let's create a subdirectory `mariadb` in the `/var/log`. You can create the
subdirectory with the command `mkdir` (`sudo` required):

    $ sudo mkdir /var/log/mariadb

Next, you must set proper access right to this directory for the MariaDB daemon.
You can set up user and group owner of this subdirectory by command chown
(`sudo` required):

    $ sudo chown mysql:mysql /var/log/mariadb

The command chown set directory user to `mysql` and group to `mysql`, which is
the proper access rights for the MariaDB daemon.

At last, if you want immediately apply the new configuration rules then you must
restart the MariaDB server with `systemctl` (`sudo` required):

    $ sudo systemctl restart mariadb.service

Now, the MariaDB server record error log to custom file.

### Viewing Custom Error Log

You can view the new file with cat (`sudo` required because file is maintained
by the system):

    $ cat /var/log/mariadb/error.log

You'll see the program's output appear on the screen:

    Output
    2021-05-19 11:17:25 0 [Note] InnoDB: Uses event mutexes
    2021-05-19 11:17:25 0 [Note] InnoDB: Compressed tables use zlib 1.2.11
    2021-05-19 11:17:25 0 [Note] InnoDB: Number of pools: 1
    2021-05-19 11:17:25 0 [Note] InnoDB: Using crc32 + pclmulqdq instructions
    2021-05-19 11:17:25 0 [Note] mariadbd: O_TMPFILE is not supported on /tmp (disabling future attempts)
    2021-05-19 11:17:25 0 [Note] InnoDB: Using Linux native AIO
    2021-05-19 11:17:25 0 [Note] InnoDB: Initializing buffer pool, total size = 134217728, chunk size = 134217728
    2021-05-19 11:17:25 0 [Note] InnoDB: Completed initialization of buffer pool
    2021-05-19 11:17:25 0 [Note] InnoDB: 128 rollback segments are active.
    2021-05-19 11:17:25 0 [Note] InnoDB: Creating shared tablespace for temporary tables
    2021-05-19 11:17:25 0 [Note] InnoDB: Setting file './ibtmp1' size to 12 MB. Physically writing the file full; Please wait ...
    2021-05-19 11:17:25 0 [Note] InnoDB: File './ibtmp1' size is now 12 MB.
    2021-05-19 11:17:25 0 [Note] InnoDB: 10.5.10 started; log sequence number 45214; transaction id 20
    2021-05-19 11:17:25 0 [Note] Plugin 'FEEDBACK' is disabled.
    2021-05-19 11:17:25 0 [Note] InnoDB: Loading buffer pool(s) from /var/lib/mysql/ib_buffer_pool
    2021-05-19 11:17:25 0 [Note] InnoDB: Buffer pool(s) load completed at 210519 11:17:25
    2021-05-19 11:17:25 0 [Note] Server socket created on IP: '127.0.0.1'.
    2021-05-19 11:17:25 0 [Note] Reading of all Master_info entries succeeded
    2021-05-19 11:17:25 0 [Note] Added new Master_info '' to hash table
    2021-05-19 11:17:25 0 [Note] /usr/sbin/mariadbd: ready for connections.
    Version: '10.5.10-MariaDB-1:10.5.10+maria~focal'  socket: '/run/mysqld/mysqld.sock'  port: 3306  mariadb.org binary distribution

The output shows records similar to syslog records.

## Step 2 — Viewing General Query Logs

The server writes records about each client event during connection to the
general query log. Basically, it keeps the information about all SQL statements
that happened. This log is useful when the administrators want to know what
clients exactly execute. However, keep in mind that the general query log slows
down performance, and administrators usually turn it on only for a short time
for debugging.

### Connecting to Server and Checking General Query Log Status

First of all, let's check the status of the general query log because this
logging feature is usually turned off.

You can connect to MariaDB server as a root client:

    $ sudo mariadb

You will be redirected to MariaDB command-line.

Now, you can view system variables related to the general query log by executing
command `show variables`:

    MariaDB> show variables like '%general%';

The clause specifies a pattern that should match the variable. In our case, the
pattern `'%general%'` specifies to show variables that contain the string
`general`. You'll see the program's output appear on the screen:

    Output
    +------------------+--------------+
    | Variable_name    | Value        |
    +------------------+--------------+
    | general_log      | OFF          |
    | general_log_file | alice.log    |
    +------------------+--------------+
    2 rows in set (0.002 sec)

The output shows two variables:

- `general_log`: The variable holds value `ON` (general log enable), or `OFF`
  (general log disabled).
- `general_log_file`: The variable defines where is the log stored in the file
  system.

As you can see, the general query log is by default disabled. We can disconnect
from the server by executing the `exit` command:

    MariaDB> exit;

You will be redirected back to the terminal.

[ad-logs]

### Enabling the General Query Log

You can enable general query log by editing MariaDB configuration file
`/etc/mysql/mariadb.conf.d/50-server.cnf` (`sudo` required):

    $ sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf

The file contains the following lines that hold configuration variables (by
default commented out):

    # Both location gets rotated by the cronjob.
    # Be aware that this log type is a performance killer.
    # Recommend only changing this at runtime for short testing periods if needed!
    #general_log_file       = /var/log/mysql/mysql.log
    #general_log            = 1

You can configure a general query log file by uncommenting the lines with these
variables and set up the `general_log` to `1` (enabled) and `general_log_file`
to the absolute path to the log file:

    # Both location gets rotated by the cronjob.
    # Be aware that this log type is a performance killer.
    # Recommend only changing this at runtime for short testing periods if needed!
    general_log_file       = /var/log/mariadb/general-query.log
    general_log            = 1

In our example, we change the directory to the `/var/log/mariadb`, same as for
the error log. This directory has already proper access right, as we set in the
previous step.  Now, you can save the file.

### Viewing General Query Log

Next, let's view the content of the new log with a `cat` (the `sudo` is required
because this file is maintained by the system):

    $ sudo cat /var/log/mariadb/general-query.log

You'll see the program's output appear on the screen:

    Output
    /usr/sbin/mariadbd, Version: 10.5.10-MariaDB-1:10.5.10+maria~focal-log (mariadb.org binary distribution). started with:
    Tcp port: 0  Unix socket: /run/mysqld/mysqld.sock
    Time                Id Command  Argument
    210519 11:58:23      3 Connect  root@localhost on mysql using Socket
                         3 Query    SET SQL_LOG_BIN=0, WSREP_ON=OFF
                         3 Query    show variables like 'datadir'
                         3 Quit
                         4 Connect  root@localhost on  using Socket
                         4 Query    SELECT count(*) FROM mysql.user WHERE user='root' and password='' and plugin in ('', 'mysql_native_password', 'mysql_old_password')
                         4 Quit
                         5 Connect  root@localhost on  using Socket
                         5 Query    select concat('select count(*) into @discard from `',
                        TABLE_SCHEMA, '`.`', TABLE_NAME, '`')
          from information_schema.TABLES where TABLE_SCHEMA<>'INFORMATION_SCHEMA' and TABLE_SCHEMA<>'PERFORMANCE_SCHEMA' and ( ENGINE='MyISAM' or ENGINE='Aria' )
                         5 Quit
                         6 Connect  root@localhost on  using Socket
                         6 Query    select count(*) into @discard from `mysql`.`procs_priv`
                         6 Quit
    ...

The output shows all statement executed at each session. You can see the
timestamp of the session beginning and the list of SQL queries. There are
already a lot of queries because the system executes them at the server starting
(it retrieves the metadata about the environment).

## Step 3 — Enabling and Listing Binary Logs

The binary log contains events that manipulate the database. If you want to
recover the database, you need a backup and a binary log relevant to this
backup. There are multiple binary logs because they are versioned.

### Enabling Binary Logs

By default, the binary logs are disabled. You can enable binary logs by editing
MariaDB configuration file `/etc/mysql/mariadb.conf.d/50-server.cnf` (`sudo`
required):

    $ sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf

The file contains the following lines that hold configuration variable `log_bin`
(by default commented out):

    #log_bin                = /var/log/mysql/mysql-bin.log

You can enable binary logging by uncommenting the line with this variable and
set up the `log_bin` to the absolute path to the directory where you want to
store them:

    log_bin                = /var/log/mariadb/binary.log

In our example, we change the directory to the `/var/log/mariadb`, same as for
the error and general query logs. Now, you can save the file.

### Listing Binary Logs

At last, let's check the binary log configuration in the MariaDB server. Let's
connect to the MariaDB server as a root client:

    $ sudo mysql

You will be redirected to MariaDB prompt.

Now, you can check the binary logs status by executing `show binary logs`:

    MariaDB> show binary logs;

The command will list the binary log files on the server:

    Output
    +---------------+-----------+
    | Log_name      | File_size |
    +---------------+-----------+
    | binary.000001 |       325 |
    +---------------+-----------+
    1 row in set (0.000 sec)

The output shows all binary logs. We enable this service just a minute ago, soo
there is just a single file. However, there will be more binary logs indexed
with increasing suffix (for example, `binary.000002`, `binary.000003`) Now, we
can find out where are these logs stored.

We can show logs location by executing command `show variables`:

    MariaDB> show variables like '%log_bin%';

We already use this `show` clause in the previous step. This time, the clause
shows variables that contain the string `log_bin`. You'll see the program's
output appear on the screen:

    Output
    +---------------------------------+-------------------------------+
    | Variable_name                   | Value                         |
    +---------------------------------+-------------------------------+
    | log_bin                         | ON                            |
    | log_bin_basename                | /var/log/mariadb/binary       |
    | log_bin_compress                | OFF                           |
    | log_bin_compress_min_len        | 256                           |
    | log_bin_index                   | /var/log/mariadb/binary.index |
    | log_bin_trust_function_creators | OFF                           |
    | sql_log_bin                     | ON                            |
    +---------------------------------+-------------------------------+
    7 rows in set (0.002 sec)

The output shows that the binary logs are stored in directory
`/var/log/mariadb`, as we set up in the configuration file.

We can disconnect from the server by executing the `exit` command:

    MariaDB> exit;

You will be redirected back to the terminal.

### Viewing the Binary Log

The binary logs are not plain text files and you can not read them with the text
editor. However, the MariaDB includes command-line utility `mysqlbinlog`.

You can view the binary log `binary.000001` with this utility by executing the
following command (`sudo` required because the file `binary.000001` is
maintained by the system):

    $ sudo mysqlbinlog /var/log/mariadb/binary.000001

You'll see the program's output appear on the screen:

    Output
    /*!50530 SET @@SESSION.PSEUDO_SLAVE_MODE=1*/;
    /*!40019 SET @@session.max_insert_delayed_threads=0*/;
    /*!50003 SET @OLD_COMPLETION_TYPE=@@COMPLETION_TYPE,COMPLETION_TYPE=0*/;
    DELIMITER /*!*/;
    # at 4
    #210519 12:10:58 server id 1  end_log_pos 256 CRC32 0xb7f7dbc5 	Start: binlog v 4, server v 10.5.10-MariaDB-1:10.5.10+maria~focal-log created 210519 12:10:58 at startup
    # Warning: this binlog is either in use or was not closed properly.
    ROLLBACK/*!*/;
    BINLOG '
    MuSkYA8BAAAA/AAAAAABAAABAAQAMTAuNS4xMC1NYXJpYURCLTE6MTAuNS4xMCttYXJpYX5mb2Nh
    bC1sb2cAAAAAAAAAAAAy5KRgEzgNAAgAEgAEBAQEEgAA5AAEGggAAAAICAgCAAAACgoKAAAAAAAA
    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    AAAAAAAAAAAEEwQADQgICAoKCgHF2/e3
    '/*!*/;
    # at 256
    #210519 12:10:58 server id 1  end_log_pos 285 CRC32 0x218f4e3e 	Gtid list []
    # at 285
    #210519 12:10:58 server id 1  end_log_pos 325 CRC32 0x346ae813 	Binlog checkpoint binary.000001
    DELIMITER ;
    # End of log file
    ROLLBACK /* added by mysqlbinlog */;
    /*!50003 SET COMPLETION_TYPE=@OLD_COMPLETION_TYPE*/;
    /*!50530 SET @@SESSION.PSEUDO_SLAVE_MODE=0*/;

The output shows an encoded binary log. You can see the warning, which told us
that the log is still in use. You can read about the format and meaning of each
record in this log in the manual pages (`man mysqlbinlog`). The purpose of the
binary log is to allow [replication](https://mariadb.com/kb/en/replication/), as
well as assisting in backup operations.

## Step 4 — Configuring Slow Query Log

MariaDB allows to log queries, which took too much time. This mechanism is
called a slow query log. Once again, it is a heavy offload to database
performance, and you should use it just for a short time for database
performance optimisation.

### Enabling Slow Query Logging

By default, the slow query log is disabled. You can enable it by editing MariaDB
configuration file `/etc/mysql/mariadb.conf.d/50-server.cnf` (`sudo` required):

    $ sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf

The file contains following lines that holds configuration variables (by default
commented out):

    # Enable the slow query log to see queries with especially long duration
    #slow_query_log_file    = /var/log/mysql/mariadb-slow.log
    #long_query_time        = 10

The slow query log is configured by following three variables:

- `slow_query_log`: The slow query logging is disabled (value `0`) or enabled
  (value `1`).
- `slow_query_log_file`: The absolute path to the slow query log. You can
  specify your own file.
- `long_query_time`: By default, the slow query logs record each SQL query that
  takes more than 10 seconds. You can change this minimal time interval to
  another value. The value can be specified as a floating-point number where the
  value `1.0` refers to 1 second.

You can enable a slow query log by inserting the new line into the configuration
file with the variable `slow_query_log` with value `1` (the variable is not
included by default). Also, you can set up your own values to the variables
`slow_query_log_file` and `long_query_time` when you uncomment the lines with
these variables:

    # Enable the slow query log to see queries with especially long duration
    slow_query_log         = 1
    slow_query_log_file    = /var/log/mariadb/slow-query.log
    long_query_time        = 5

In our example, we change the default `long_query_time` value to 5 seconds and
set the log file to `/var/log/mariadb/slow-query` (same directory as for error,
general and binary logs). Now, you can save the file.

Once again, if you want immediately apply the new configuration rules then you
must restart the MariaDB server with `systemctl` (`sudo` required):

    $ sudo systemctl restart mariadb.service

Now, the MariaDB server enables slow query log.

### Checking Slow Query Log Status

You can check that the log is enabled if you login into the MariaDB server as a
root client:

    $ sudo mariadb

You will be redirected to MariaDB prompt.

Let's check the slow query log status by executing command `show variables`:

    MariaDB> show variables like '%slow_query_log%';

Once again, we use the `show` clause. This time, the clause shows variables that
contain the string `slow_query_log`. You'll see the program's output appear on
the screen:

    Output
    +---------------------+---------------------------------+
    | Variable_name       | Value                           |
    +---------------------+---------------------------------+
    | slow_query_log      | ON                              |
    | slow_query_log_file | /var/log/mariadb/slow-query.log |
    +---------------------+---------------------------------+
    2 rows in set (0.002 sec)

The output shows that the slow query log is enabled (the variable
`slow_query_log` holds the value `ON`).

Let's view actual slow query time interval by executing the command
`show variables`:

    MariaDB> show variables like '%long_query_time%';

You'll see the program's output appear on the screen:

    Output
    +-----------------+-----------+
    | Variable_name   | Value     |
    +-----------------+-----------+
    | long_query_time |  5.000000 |
    +-----------------+-----------+
    1 row in set (0.002 sec)

The output shows that the variable `long_query_time` holds the value 5 seconds
(as we define in the configuration script).

### Viewing Slow Query Log

At last, we can check that the MariaDB records slow queries to the new log. You
can execute the following select query that takes 6 seconds:

    MariaDB> select sleep(6);

The `select` will wait 6 seconds and then return 0:

    Output
    +----------+
    | sleep(6) |
    +----------+
    |        0 |
    +----------+
    1 row in set (6.001 sec)

The output shows that this query takes 6 seconds. As a result, it should be
recorded in a slow query log.

We can disconnect from the server by executing the `exit` command:

    MariaDB> exit;

You will be redirected back to the terminal.

At last, we can print the content of the slow query log
`/var/log/mariadb/slow-query.log` (the `sudo` is required because the file is
maintained by the system):

    $ sudo cat /var/log/mariadb/slow-query.log

You'll see the program's output appear on the screen:

    /usr/sbin/mariadbd, Version: 10.5.10-MariaDB-1:10.5.10+maria~focal-log (mariadb.org binary distribution). started with:
    Tcp port: 0  Unix socket: /run/mysqld/mysqld.sock
    Time		    Id Command	Argument
    # Time: 210519 14:09:32
    # User@Host: root[root] @ localhost []
    # Thread_id: 31  Schema:   QC_hit: No
    # Query_time: 6.000286  Lock_time: 0.000000  Rows_sent: 1  Rows_examined: 0
    # Rows_affected: 0  Bytes_sent: 64
    SET timestamp=1621426172;
    select sleep(6);

You can see that the output shows record about execution query
`select sleep(6)`.

[summary]

## Side note: Visualize and explore MariaDB logs in Better Stack

Once your MariaDB logs are centralized, you can go beyond search and use Better Stack to visualize patterns over time. This is especially useful for spotting spikes in errors, bursts of slow queries, or sudden increases in connection volume.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Final thoughts

In this tutorial, you configured and viewed different MariaDB logs. You
installed the MariaDB server, configured and viewed the **error log**. You
enabled and viewed the **general query logs** and their configuration. You
enabled and listed **binary logs**. At last, you enabled, configured and viewed
a **slow query log**.
