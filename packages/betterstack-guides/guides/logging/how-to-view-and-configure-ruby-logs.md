# How to Get Started with Logging in Ruby

When it comes to building and maintaining robust Ruby applications, logging is
one essential aspect that can't be ignored. It allows you to keep track of a
program's behavior, catch errors and exceptions, and record important business
or security events. It can also aid in troubleshooting issues and debugging
problems in production environments especially [when the logs are
aggregated](https://betterstack.com/community/guides/logging/log-aggregation/) into a
[log management system](https://betterstack.com/logtail) for real-time
monitoring and analysis.

Logging in Ruby can be done in by using the built-in `Logger` class or a
third-party logging framework. Each approach has its strengths and weaknesses
and is suited to different use cases. Choosing the right logging solution for
your application is crucial, as it will impact how easy it is to maintain and
monitor your application in production.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/b7SWkjgcuMU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

This article aims to provide a comprehensive overview of logging in Ruby,
covering various logging solutions and their use cases. We will begin by diving
into the details of the `Logger` class, exploring its features and limitations.
We will then discuss third-party logging frameworks and how they can be used to
supplement or replace the `Logger` class to suit specific logging needs.

By the end of this article, you should have a solid understanding of logging in
Ruby and be well equipped to apply this knowledge to implement robust logging
solutions in your Ruby programs.


## Prerequisites

Before proceeding with this article, we recommend that you have a recent version
of [Ruby](https://www.ruby-lang.org/en/documentation/installation/) installed on
your machine. All the code snippets presented in this article were thoroughly
tested using Ruby 3.2.1, which was the latest version available at the time of
writing.

[ad-logs]

## Getting started with the Ruby Logger

Ruby provides the `Logger` class for logging in Ruby applications. It is
built-in to Ruby so you don't need to install anything to use it. Here's a
simple example that logs to the standard output:

```ruby
require 'logger'

logger = Logger.new($stdout) # create a new logger that writes to the console

logger.info('Starting application...')

# ... application code here ...

logger.error('An error occurred!')

# ... more application code ...

logger.info('Shutting down application...')
```

Before you can start logging in Ruby, you must require the `logger` module and
then create a new `logger` instance using the `Logger.new()` method which
accepts one compulsory argument: the destination of the records (`$stdout` in
this case).

Once we have a logger instance, we can use level methods such as `info()`,
`error()`, and others to log messages with different severity levels. Here's the
output to expect when you run the above program:

```text
[output]
I, [2023-04-17T19:50:35.871039 #33575]  INFO -- : Starting application...
E, [2023-04-17T19:50:35.871069 #33575] ERROR -- : An error occurred!
I, [2023-04-17T19:50:35.871075 #33575]  INFO -- : Shutting down application...
```

Each line in the output above corresponds to a log record and they follow the
default log format of the `Logger` class:

```text
SeverityLetter, [Timestamp #ProcessID] SeverityWord ProgramName: LogMessage
```

Here's what each part of the log format means:

- **SeverityLetter**: the severity level of the log message represented by a
  single letter (`I` for INFO, `E`, for ERROR, etc).

- **Timestamp**: the date and time when the log message was created, in the
  format `%Y-%m-%dT%H:%M:%S.%6N`.

- **ProcessID**: the process ID of the program that generated the log message.
- **SeverityWord**: the severity level of the message as a word (`INFO`,
  `DEBUG`, etc).
- **ProgramName**: the program name if set (using `logger.progname` for
  example).
- **LogMessage**: the message that was logged.

We will discuss how you can customize the output of your logs in a subsequent
section. First lets look at log levels in Ruby and how you can customize them

## Log Levels in Ruby

Ruby's `Logger` class supports five log levels: `DEBUG`, `INFO`, `WARN`,
`ERROR`, `FATAL`. Each log level represents how severe the event being recorded
is, and can they can also be used to control the amount of information that is
logged. By default, each logger created with `Logger.new()` is set to log at the
`DEBUG`.

Here's a brief explanation of what each log level means (see our
[log levels guide](https://betterstack.com/community/guides/logging/log-levels-explained/) for a more detailed analysis):

- **DEBUG**: used to log detailed information about the program intended for
  debugging purposes. Usually only used during development or troubleshooting.
- **INFO**: used to record normal and expected events in the program.
- **WARN**: indicates that something unexpected has happened, but the
  application can still continue at least for sometime.
- **ERROR**: indicates that an unexpected error has occurred that prevents a
  program function from working as expected.
- **FATAL**: indicates that a very serious error has occurred that may cause the
  program to crash.

The `Logger` class provides a corresponding method for each of the above levels:

```ruby
logger.debug('Started processing request for user 1234')
logger.info('Server started on port 3000')
logger.warn('Disk space low: only 5% remaining on /dev/sda1')
logger.error('Failed to write to file /var/log/application.log: permission denied')
logger.fatal('Fatal error: could not connect to database at localhost:3306')
```

```text
[output]
D, [2023-04-17T20:24:22.752275 #90147] DEBUG -- : Started processing request for user 1234
I, [2023-04-17T20:24:22.752306 #90147]  INFO -- : Server started on port 3000
W, [2023-04-17T20:24:22.752313 #90147]  WARN -- : Disk space low: only 5% remaining on /dev/sda1
E, [2023-04-17T20:24:22.752317 #90147] ERROR -- : Failed to write to file /var/log/application.log: permission denied
F, [2023-04-17T20:24:22.752321 #90147] FATAL -- : Fatal error: could not connect to database at localhost:3306
```

You can control the amount of output that your program emits by changing the
`level` property on a `Logger` instance. For example, you can ignore `DEBUG` and
`INFO` logs in a production environment by setting `logger.level` to `WARN` as
shown below:

```ruby
# add this before using any level method
logger.level = Logger::WARN
# or
logger.warn!
```

You can also set the preferred log level while creating the `Logger`:

```ruby
logger = Logger.new($stdout, level: Logger::WARN)
```

When you do this, the `DEBUG` and `INFO` entries will be suppressed:

```text
[output]
W, [2023-04-17T20:24:22.752313 #90147]  WARN -- : Disk space low: only 5% remaining on /dev/sda1
E, [2023-04-17T20:24:22.752317 #90147] ERROR -- : Failed to write to file /var/log/application.log: permission denied
F, [2023-04-17T20:24:22.752321 #90147] FATAL -- : Fatal error: could not connect to database at localhost:3306
```

### Setting the log level using an environmental variable

Instead of hardcoding the log level your program, it's better to set its value
using an environmental variables so that you can easily change the logging
behavior of your application without having to modify the code. This can be
especially useful in production environments where you may want to change the
log level without having to redeploy the application.

Here's how to change the logging level of a Ruby program using an environmental
variable:

```ruby
require 'logger'

logger = Logger.new($stdout)

[highlight]
log_level = ENV.fetch('RUBY_LOG_LEVEL', 'INFO')
logger.level = Logger.const_get(log_level)
[/highlight]
```

In this example, the `Logger.const_get()` method is used to convert the log
level string to a corresponding constant defined in the `Logger` class. This
allows you to provide the log level using a string like `DEBUG` or `WARN`,
instead of using a constant like `Logger::DEBUG` or `Logger::WARN`.

You can set the environmental variable when running the application, like this:

```command
RUBY_LOG_LEVEL=ERROR ruby main.rb
```

This will ensure that only events of `ERROR` severity and higher are logged. If
the `RUBY_LOG_LEVEL` variable is not set in the environment, it will default to
`INFO` instead.

### Using custom log levels in Ruby

Creating custom log levels can be useful in situations where the default log
levels provided by the `Logger` class are not sufficient for your needs. For
example, if you have an application with different types of errors that require
different levels of attention, you may want to define custom log levels to make
it easier to differentiate between them.

In Ruby's `Logger` class, you cannot create custom log levels directly. However,
you can define your own custom logger class that inherits from `Logger` and
defines its own log levels as constants.

Here's an example that adds the `TRACE` log level to Ruby:

```ruby
class CustomLogger < Logger
  TRACE = Logger::DEBUG - 1

  SEV_LABEL = {
    -1 => 'TRACE',
    0 => 'DEBUG',
    1 => 'INFO',
    2 => 'WARN',
    3 => 'ERROR',
    4 => 'FATAL'
  }.freeze

  def format_severity(severity)
    SEV_LABEL[severity] || 'ANY'
  end

  def trace(message)
    add(TRACE, message)
  end
end

logger = CustomLogger.new($stdout)
logger.level = CustomLogger::TRACE

logger.trace('Entering "calculate" method with arguments: x=5, y=10')
```

In this example, we've defined a new `CustomLogger` class that inherits from
`Logger`. The `TRACE` level is also defined with its corresponding instance
method, and the `format_severity` method of the `Logger` class is overridden so
that the correct label is used when logging at the `TRACE` level.

```text
[output]
T, [2023-04-18T07:25:52.635839 #58839] TRACE -- : Entering "calculate" method with arguments: x=5, y=10
```

Now that you've seen how the Ruby Logger works and how to set and customize log
levels, let's look at other ways to customize the Ruby logger

## Customizing the log format

You can customize the format of your Ruby logs using the `Logger#formatter`
property. The formatter is a block that takes four arguments: the severity
level, the time stamp, the program name, and the log message. You can use these
arguments to create a custom log format that includes the information you need.

Here's an example that prints each record using the
[logfmt](https://brandur.org/logfmt) standard which requires each field in the
record to be formatted as `key=value`:

```ruby
logger.formatter = proc do |severity, datetime, _progname, msg|
  datefmt = datetime.strftime('%Y-%m-%dT%H:%M:%S.%6N')
  "timestamp=#{datefmt} level=#{severity.ljust(5)} msg='#{msg}'\n"
end
```

This snippet uses a `proc` to overwrite the default format, and this change
yields the output below:

```text
[output]
timestamp=2023-04-18T09:48:15.903589 level=DEBUG msg='Started processing request for user 1234'
timestamp=2023-04-18T09:48:15.903611 level=INFO  msg='Server started on port 3000'
timestamp=2023-04-18T09:48:15.903616 level=WARN  msg='Disk space low: only 5% remaining on /dev/sda1'
timestamp=2023-04-18T09:48:15.903620 level=ERROR msg='Failed to write to file /var/log/application.log: permission denied'
timestamp=2023-04-18T09:48:15.903623 level=FATAL msg='Fatal error: could not connect to database at localhost:3306'
```

You can customize the log format further by including additional metadata that
you'd like to be present in all records generated by the program. For example,
you can include the process ID or the Git commit hash to keep track of the
running version in production. Here's an example:

```ruby
[highlight]
git_commit_hash = `git rev-parse HEAD`.strip
[/highlight]

logger.formatter = proc do |severity, datetime, _progname, msg|
  datefmt = datetime.strftime('%Y-%m-%dT%H:%M:%S.%6N')
  [highlight]
  "timestamp=#{datefmt} level=#{severity.ljust(5)} git_commit_hash=#{git_commit_hash} pid=#{Process.pid} msg='#{msg}'\n"
  [/highlight]
end
```

```text
[output]
timestamp=2023-04-18T09:57:35.895145 level=INFO git_commit_hash=13f2942d96a8a25b4da6e86bd5865c0eee13cc62 pid=106742 msg='Starting application...'
```

### Structured logging in JSON

JSON is a popular format for structured logging, as it allows for easy
integration with a variety of log management tools and systems. It's possible to
output your Ruby logs in the JSON format using a custom formatter as shown
below:

```ruby
require 'logger'
require 'json'

. . .

git_commit_hash = `git rev-parse HEAD`.strip

logger.formatter = proc do |severity, datetime, _progname, msg|
  datefmt = datetime.strftime('%Y-%m-%dT%H:%M:%S.%6N')
  {
    timestamp: datefmt,
    level: severity.ljust(5),
    git_commit_hash: git_commit_hash,
    pid: Process.pid,
    msg: msg
  }.to_json + "\n"
end
```

```json
[output]
{"timestamp":"2023-04-18T10:04:00.835675","level":"INFO ","git_commit_hash":"13f2942d96a8a25b4da6e86bd5865c0eee13cc62","pid":114761,"msg":"Starting application..."}
```

As you can see, all you need to do is create a dictionary with the key/value
pairs you'd like to include in your logs, and then call the `to_json` method on
it to convert it to a JSON object. A newline character is also added at the end
so that each JSON record is placed on its own line.

## Logging to files in Ruby

As mentioned earlier, the first argument to the `Logger.new()` method defines
where the log records created by the `Logger` instance should be stored. We'v
only used the standard output so far in this tutorial, but you can also log to a
file by providing the path to a file as shown below:

```ruby
logger = Logger.new('logs/app.log')
```

This snippet configures the `logger` to output to an `logs/app.log` file in the
current directory. Note that any intermediate directories must be created first
before executing the program otherwise you'll get an error.

```command
cat logs/app.log
```

```text
[output]
# Logfile created on 2023-04-18 10:23:38 +0100 by logger.rb/v1.5.3
{"timestamp":"2023-04-18T10:23:38.615776","level":"INFO ","pid":144698,"msg":"Starting application..."}
```

When logging to files, you should also configure [log rotation
policy](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) through the
second and third arguments to the `new` method so that the file does not grow to
an unmanageable size:

```ruby
Logger.new('app.log', 3) # retain 3 1-megabyte files
```

The above snippet configures the program to rotate the `app.log` file when it
reaches 1 megabyte (the default), and only 3 files are retained in total (the
older logs get deleted). You can change the maximum size of individual files
with the third argument:

```ruby
Logger.new('app.log', 3, 10 * 1024 * 1024) # retain 3 10-megabyte files
```

You can also rotate log files periodically through string arguments such as
`daily`, `weekly`, or `monthly`. See the
[Logger documentation](https://ruby-doc.org/3.2.0/stdlibs/logger/Logger.html#class-Logger-label-Log+File+Rotation)
for more details.

While Ruby's built-in log rotation features can be useful for basic log rotation
needs, they may not be sufficient for more complex or high-volume logging
scenarios. Therefore we recommend deferring your log rotation needs to dedicated
tools such as
[logrotate](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) which
provide better performance, flexibility, reliability, and integration with other
logging tools and systems.

## Logging errors in Ruby

You can log errors and exceptions in Ruby by feeding the error to the `error()`
or `fatal()` methods, whichever is more appropriate:

```ruby
begin
  result = 1 / 0
rescue StandardError => e
  logger.error(e)
end
```

You'll observe that the error is logged appropriately along with a stack trace:

```text
[output]
E, [2023-04-19T13:12:31.923335 #155487] ERROR -- : divided by 0 (ZeroDivisionError)
main.rb:24:in `/'
main.rb:24:in `<main>'
```

However, if you're [logging in JSON](#structured-logging-in-json) using the
technique demonstrated earlier, you will observe that the stack trace is missing
from the output:

```json
[output]
{"timestamp":"2023-04-19T13:14:10.199836","level":"ERROR","pid":159080,"msg":"divided by 0"}
```

A possible workaround to ensure that the stack trace is also included in the
JSON output is to explicitly include backtrace in the log message:

```ruby
logger.error(e.message + ' ' + e.backtrace.join(' '))
```

```json
[output]
{"timestamp":"2023-04-19T13:15:32.277236","level":"ERROR","pid":163713,"msg":"divided by 0 main.rb:24:in `/' main.rb:24:in `<main>'"}
```

Skip ahead to the
[section on third-party logging frameworks](#using-a-third-party-logging-framework)
to discover a more elegant way to log exceptions in Ruby programs.

## Limitations of the Ruby Logger

Although the `Logger` class is a handy tool to initiate logging in Ruby, it may
not be the best choice for production logging, depending on your application
needs. This is due to some inherent limitations that it has which may impact its
effectiveness in certain production environments. Here are a few notable ones:

1. The `Logger` class does not support context-aware logging, which can make it
   challenging to automatically attach contextual information (such as request
   IDs, transaction IDs, and other relevant metadata) to log messages. This
   limitation negates one of the main benefits of logging in a structured format
   such as JSON.

2. Logging to multiple destinations at once is often helpful when you want
   provide some redundancy in case one of the destinations fails or becomes
   unavailable, but `Logger` instances cannot do this on their own. The
   workaround here is to create multiple `Logger` instances that log to
   different destinations or use an external tool to filter the logs and
   redirect them to their final destination.

3. While you can log errors and exceptions as shown above, you have to do
   additional work to include the stack trace when outputting logs in JSON
   format. Even then, the output is not optimal as everything gets placed into
   the `msg` property.

Considering the limitations of the built-in logging solution, we suggest
[utilizing a third-party logging framework](https://betterstack.com/community/guides/logging/logging-framework/) for comprehensive
production logging. In the next section, we will explore some of the available
logging frameworks in the Ruby ecosystem and provide insights on how to choose
the right one to suit your logging needs.

## Using a third-party logging framework

If the capabilities of the built-in `Logger` class don't quite match up to your
expectations, you can adopt one of the third-party logging frameworks discussed
below.

### 1. Ougai

One of the well-known options for structured logging in Ruby is the
[Ougai](https://github.com/tilfin/ougai) gem. It extends the standard `Logger`
class and complements it with useful features such as pretty printing, child
loggers, JSON logging, exceptions with stack traces, and more.

You can install it in your project by running the command below:

```command
gem install ougai
```

Once the gem is installed, you must require it in your program and use it as
shown below:

```ruby
require 'ougai'

logger = Ougai::Logger.new($stdout)

logger.info('Hello from Ougai logger')
```

```json
[output]
{"name":"main","hostname":"fedora","pid":79872,"level":30,"time":"2023-04-19T11:57:06.167+01:00","v":0,"msg":"Hello from Ougai logger"}
```

Notice that Ougai defaults to structured logging in JSON and it includes some
extra properties that is not present when using the `Logger` class such as the
`name`, `hostname`, and `v` fields which represent the name of the file, the
hostname of the machine where the log was generated, and the log format version
([added for compatibility](https://github.com/tilfin/ougai/issues/55) with
[node-bunyan](https://github.com/trentm/node-bunyan)). Also, notice that the
`level` property is represented as a number where:

- `10` => TRACE (Ougai supports TRACE natively).
- `20` => DEBUG
- `30` => INFO
- `40` => WARN
- `50` => ERROR
- `60` => FATAL

The reasoning behind using a number for the log level instead of a label is to
enable the easy filtration of logs by using a query such as `level >= 30` to
show only records with `INFO` or greater severity. If you prefer to use a label,
please see the [this GitHub issue](https://github.com/tilfin/ougai/issues/83).

### Context-aware logging

When using Ougai, adding relevant metadata at log point is done by passing a
hash after the log message. For example:

```ruby
logger.debug('Calling external API at example.com', {
  api_url: 'https://api.example.com/products',
  request_body: {
    id: 42
  }
})
```

```json
[output]
{"name":"main","hostname":"fedora","pid":128605,"level":20,"time":"2023-04-19T12:34:18.648+01:00","v":0,"msg":"Calling external API at example.com","api_url":"https://api.example.com/products","request_body":{"id":42}}
```

When you want to include the same metadata in multiple logs, you can use a child
logger:

```ruby
# import and set up the logger
. . .
user_id = 1283
transaction_id = SecureRandom.uuid

logger.info('Hello from Ougai logger')

child_logger = logger.child({user_id:, transaction_id:})
# log transaction start
child_logger.info('Transaction started')

# perform some transaction steps
child_logger.debug('Payment processing', { order_id: '12345', payment_method: 'credit_card' })
child_logger.debug('Order fulfillment', { order_id: '12345', shipping_method: 'standard' })

# log transaction end
child_logger.info('Transaction completed')
```

```json
[output]
{"name":"main","hostname":"fedora","pid":240069,"level":30,"time":"2023-04-19T16:51:04.749+01:00","v":0,"msg":"Hello from Ougai logger"}
{"name":"main","hostname":"fedora","pid":240069,"level":30,"time":"2023-04-19T16:51:04.749+01:00","v":0,"msg":"Transaction started","user_id":1283,"transaction_id":"8472b740-697e-4126-8cdc-2ebf2895bf14"}
{"name":"main","hostname":"fedora","pid":240069,"level":20,"time":"2023-04-19T16:51:04.749+01:00","v":0,"msg":"Payment processing","order_id":"12345","payment_method":"credit_card","user_id":1283,"transaction_id":"8472b740-697e-4126-8cdc-2ebf2895bf14"}
{"name":"main","hostname":"fedora","pid":240069,"level":20,"time":"2023-04-19T16:51:04.749+01:00","v":0,"msg":"Order fulfillment","order_id":"12345","shipping_method":"standard","user_id":1283,"transaction_id":"8472b740-697e-4126-8cdc-2ebf2895bf14"}
{"name":"main","hostname":"fedora","pid":240069,"level":30,"time":"2023-04-19T16:51:04.749+01:00","v":0,"msg":"Transaction completed","user_id":1283,"transaction_id":"8472b740-697e-4126-8cdc-2ebf2895bf14"}
```

You can also use the `logger.with_fields` property to add custom metadata to all
logs in a module or even the entire program.
[See the documentation](https://github.com/tilfin/ougai#adding-custom-fields-to-all-logs)
for more details.

### Logging exceptions with Ougai

When you log exceptions with Ougai, an `err` property is added to the output
with its own `name`, `message`, and `stack` properties. This lets you quickly
filter errors by type and create more specific alerts in a log management tool:

```json
{"name":"main","hostname":"fedora","pid":197075,"level":50,"time":"2023-04-19T14:01:49.974+01:00","v":0,"msg":"divided by 0","err":{"name":"ZeroDivisionError","message":"divided by 0","stack":"main.rb:24:in `/'\n  main.rb:24:in `<main>'"}}
```

### 2. Semantic Logger

[Semantic Logger](https://betterstack.com/community/guides/logging/semantic-logger/) is a logging interface
for Ruby that can produce both human and machine-readable logs. It allows
logging to multiple destinations and can forward logs to centralized logging
systems. It is also built with performance in mind as logging is performed in a
separate thread so as not to slow down the application whilst logging to one or
more destinations.

Every log entry contains contextual information such as the class and file name
where the message originated, duration of code blocks, thread name, process ID,
exceptions, metrics, tagging, and custom fields. This additional context
provides useful insights into application behavior and aids in debugging and
monitoring.

Before you can start using Semantic Logger in your programs, you'll need to
install it first:

```command
gem install semantic_logger
```

Once the gem is installed, you can start using it in your Ruby application.
Here's an example that logs a message to the standard output using Semantic
Logger:

```ruby
require 'semantic_logger'
SemanticLogger.add_appender(io: $stdout)
logger = SemanticLogger['MyApp']
logger.info('Hello from semantic logger')
```

By default, the output is similar to the standard Ruby logger:

```text
[output]
2023-04-18 13:59:14.436080 I [249876:60] MyApp -- Hello from semantic logger
```

However, you can also configure it to produce structured JSON output:

```ruby
SemanticLogger.add_appender(io: $stdout, formatter: :json)
```

```json
[output]
{"host":"fedora","application":"Semantic Logger","timestamp":"2023-04-19T16:08:04.092164Z","level":"info","level_index":2,"pid":258049,"thread":"60","name":"MyApp","message":"Hello from semantic logger"}
```

Here's an example that configures Semantic Logger to output log records in JSON
format to a file and simultaneously log a colourized format to the standard
output:

```ruby
require 'semantic_logger'
SemanticLogger.add_appender(file_name: 'logs/development.log', formatter: :json)
SemanticLogger.add_appender(io: $stdout, formatter: :color)

logger = SemanticLogger['MyApp']
logger.info('Hello from semantic logger')
```

![Screenshot from 2023-04-18 14-17-36.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f38aae40-8a4a-4a51-8b7d-c6e38fbb1700/md2x =1416x508)

```command
cat logs/development.log
```

```json
[output]
{"host":"fedora","application":"Semantic Logger","timestamp":"2023-04-18T13:07:42.168913Z","level":"info","level_index":2,"pid":254990,"thread":"60","name":"MyApp","message":"Hello from semantic logger"}
```

### Logging exceptions with Semantic Logger

Semantic Logger provides proper support for logging exceptions by capturing
every detail about the exception including its stack trace:

```json
[output]
{"host":"fedora","application":"Semantic Logger","timestamp":"2023-04-19T16:09:28.554393Z","level":"error","level_index":4,"pid":259353,"thread":"60","file":"main.rb","line":9,"name":"MyApp","exception":{"name":"ZeroDivisionError","message":"divided by 0","stack_trace":["main.rb:7:in `/'","main.rb:7:in `<main>'"]}}
```

## Final thoughts and next steps

In this tutorial, we covered a lot of ground when it comes to logging in Ruby.
We explored the different logging solutions available, discussed their strengths
and limitations, and provided examples of how to log effectively using these
solutions.

But we know that understanding the theory of logging is only half the battle -
seeing it in action is equally important. That's why we've provided another
comprehensive tutorial that dives into a practical example of how to use logging
in a real-world application. This tutorial demonstrates [how to use a logging
framework in a Ruby on Rails web
application](https://betterstack.com/community/guides/logging/how-to-start-logging-with-ruby-on-rails/) and how to leverage a log
management platform to analyze and manage your application logs.

By following along with the tutorial, you'll see many of the logging features
we've discussed here in action and gain a more solid understanding of how to
implement them in your own projects. We hope that the knowledge and skills
you've acquired in this tutorial will help you build more robust, reliable, and
performant Ruby applications.

For more resources about Ruby logging, read our articles about [best ruby logging libraries](https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/).

Thanks for reading, and happy logging!