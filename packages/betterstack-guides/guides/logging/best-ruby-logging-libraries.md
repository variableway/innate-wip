# Logging in Ruby: A Comparison of the Top 6 Libraries

Although Ruby provides a `Logger` class in its standard library, it is missing
several features that are necessary for a [robust logging
setup](https://betterstack.com/community/guides/logging/logging-framework/) in production applications. Due to its limitations, a
number of alternatives have sprung up in the community to offer more
comprehensive logging capabilities for Ruby applications.

These alternatives provide an enhanced logging experience that aligns with the
rigors of modern software development and the complexities of production
environments. This article will discuss and compare a few of the logging
solutions in Ruby, shedding light on their unique features, advantages, and use
cases.

We'll begin with the standard `Logger` class, and then evaluate five of the best
third-party options. Let's get started!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/b7SWkjgcuMU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## 1. The Logger class

![Screenshot from 2023-08-30 22-03-30.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/92ebc3fe-a4a4-4acc-7a86-e80fe9fa1200/lg2x =2422x1472)

Ruby ships with a
[Logger class](https://ruby-doc.org/stdlib-2.4.0/libdoc/logger/rdoc/Logger.html) in its standard
library, which provides a simple API to record event logs without using a
third-party framework. It supports the following [log
levels](https://betterstack.com/community/guides/logging/log-levels-explained/):

```ruby
require 'logger'

logger = Logger.new($stdout)

logger.debug('database query executed')
logger.info('user signed in')
logger.warn('disk space is 95% full')
logger.error('encountered an unexpected error while backing up database')
logger.fatal('application crashed')
```

```text
[output]
D, [2023-08-30T12:06:15.252379 #505263] DEBUG -- : database query executed
I, [2023-08-30T12:06:15.252419 #505263]  INFO -- : user signed in
W, [2023-08-30T12:06:15.252426 #505263]  WARN -- : disk space is 95% full
E, [2023-08-30T12:06:15.252430 #505263] ERROR -- : encountered an unexpected error while backing up database
F, [2023-08-30T12:06:15.252434 #505263] FATAL -- : application crashed
```

The default log level here is `DEBUG`, but it can be easily changed through the
`level` method on a logger instance:

```ruby
logger.level = Logger::ERROR
```

```text
[output]
E, [2023-08-30T15:55:38.870752 #632021] ERROR -- : encountered an unexpected error while backing up database
F, [2023-08-30T15:55:38.870783 #632021] FATAL -- : application crashed
```

Notably, the `Logger` class does not support the `TRACE` level. If you need it
or other custom levels, you can create a custom logger class that inherits from
`Logger` and add one or more custom levels as shown in [our logging in Ruby
article](https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/#using-custom-log-levels-in-ruby).

[Formatting your log entries](https://betterstack.com/community/guides/logging/log-formatting/) is done through the
`logger.formatter` property. It accepts a `proc` object with the following four
parameters: `severity`, `datetime`, `progname`, and `msg`. You can use these
four parameters to construct your custom format and return a string representing
the formatted entry. Note that you can also add other properties that you want
to see in all entries, like the process ID example included below:

```ruby
logger.formatter = proc do |severity, datetime, progname, msg|
  datefmt = datetime.strftime('%Y-%m-%dT%H:%M:%S.%6N')
  "time=#{datefmt} level=#{severity.ljust(5)} pid=#{Process.pid} msg='#{msg}'\n"
end
```

```text
[output]
time=2023-08-30T12:14:01.133053 level=INFO pid=519895 msg='user signed in'
```

Logging in JSON is not directly supported, but you can implement a custom
formatter using the `json` module as follows:

```ruby
logger.formatter = proc do |severity, datetime, progname, msg|
  datefmt = datetime.strftime('%Y-%m-%dT%H:%M:%S.%6N')
  {
    timestamp: datefmt,
    level: severity.ljust(5),
    pid: Process.pid,
    msg: msg
  }.to_json + "\n"
end
```

```json
{"timestamp":"2023-08-30T12:15:24.673590","level":"INFO ","pid":521057,"msg":"user signed in"}
```

Logging to a file can be achieved by passing a filename to the `new()` method:

```ruby
logger = Logger.new('app.log')
```

It also supports basic [log
rotation](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) through the
second and third arguments, which lets you configure how many files should be
retained and the maximum size for individual files.

```ruby
# retain a maximum of five 10-megabyte files
Logger.new('app.log', 5, 10 * 1024 * 1024)
```

The `Logger` class is a simple way to start logging in Ruby, but it's a little
light on features. If you need more than what it offers, please see the other
options on this list.

[ad-logs]

## 2. Semantic Logger

![semantic_logger.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f890edca-04b1-4dea-5329-edb099f1a300/md1x =1200x600)

[Semantic logger](https://betterstack.com/community/guides/logging/semantic-logger/) is a
framework that aims to replace existing Ruby and Rails loggers. It can produce
both human and machine-readable logs, and it supports a wide variety of
destinations through its
[built-in appenders](https://logger.rocketjob.io/appenders.html). It also claims
to be capable of producing thousands of logs per second without slowing down the
application by using an in-memory queue in a separate thread.

Getting started with Semantic Logger is straightforward. Once you install the
library, you can import it into your project and create an instance of the
logger by supplying the name of the class/application. You also need to specify
a destination for the logs using the `add_appender()` method:

```ruby
require 'semantic_logger'
SemanticLogger.add_appender(io: $stdout)
logger = SemanticLogger['MyApp']

logger.trace('entered main function')
logger.debug('database query executed')
logger.info('server started on port 8080')
logger.warn('disk space is 95% full')
logger.error('encountered an unexpected error while backing up database')
logger.fatal('application crashed')
```

```text
[output]
2023-08-30 10:52:06.113367 I [291531:60] MyApp -- server started on port 8080
2023-08-30 12:02:37.277804 W [291531:60] MyApp -- disk space is 95% full
2023-08-30 10:52:06.113383 E [291531:60 main.rb:10] MyApp -- encountered an unexpected error while backing up database
2023-08-30 10:52:06.113398 F [291531:60 main.rb:11] MyApp -- application crashed
```

Semantic logger defaults to the `INFO` level, but you can customize this through
the `default_level` property as follows:

```ruby
require 'semantic_logger'
[highlight]
SemanticLogger.default_level = :trace
[/highlight]
SemanticLogger.add_appender(io: $stdout)
. . .
```

You should observe the `TRACE` and `DEBUG` messages in the program's output
afterward:

```text
[output]
2023-08-30 10:55:45.703627 T [303347:60] MyApp -- entered main function
2023-08-30 10:55:45.703640 D [303347:60] MyApp -- database query executed
2023-08-30 10:55:45.703645 I [303347:60] MyApp -- server started on port 8080
2023-08-30 12:02:37.277804 W [303347:60] MyApp -- disk space is 95% full
2023-08-30 10:55:45.703648 E [303347:60 main.rb:11] MyApp -- encountered an unexpected error while backing up database
2023-08-30 10:55:45.703658 F [303347:60 main.rb:12] MyApp -- application crashed
```

Formatting the logs is done through the `formatter` option on the
`add_appender()` method. For example, here's how to colorize the records to make
them more easily distinguishable in development environments:

```ruby
SemanticLogger.add_appender(io: $stdout, formatter: :color)
```

![Screenshot from 2023-08-30 10-58-54.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/33d7ec5d-4849-467e-481e-eacc65f54500/lg1x =2432x884)

In production, you likely want to output your logs as structured JSON so that
they can be easily parsed and monitored by log management tools. Semantic Logger
provides the `:json` formatter for this purpose:

```ruby
SemanticLogger.add_appender(io: $stdout, formatter: :json)
```

```json
[output]
{"host":"fedora","application":"Semantic Logger","timestamp":"2023-08-30T09:05:11.087391Z","level":"trace","level_index":0,"pid":336086,"thread":"60","name":"MyApp","message":"entered main function"}
{"host":"fedora","application":"Semantic Logger","timestamp":"2023-08-30T09:05:11.087409Z","level":"debug","level_index":1,"pid":336086,"thread":"60","name":"MyApp","message":"database query executed"}
{"host":"fedora","application":"Semantic Logger","timestamp":"2023-08-30T09:05:11.087414Z","level":"info","level_index":2,"pid":336086,"thread":"60","name":"MyApp","message":"server started on port 8080"}
{"host":"fedora","application":"Semantic Logger","timestamp":"2023-08-30T09:05:11.087415Z","level":"warn","level_index":3,"pid":336086,"thread":"60","name":"MyApp","message":"disk space is 95% full"}
{"host":"fedora","application":"Semantic Logger","timestamp":"2023-08-30T09:05:11.087416Z","level":"error","level_index":4,"pid":336086,"thread":"60","file":"main.rb","line":11,"name":"MyApp","message":"encountered an unexpected error while backing up database"}
{"host":"fedora","application":"Semantic Logger","timestamp":"2023-08-30T09:05:11.087428Z","level":"fatal","level_index":5,"pid":336086,"thread":"60","file":"main.rb","line":12,"name":"MyApp","message":"application crashed"}
```

You can log to multiple destinations simultaneously using the same or different
formats by using multiple appenders like this:

```ruby
SemanticLogger.add_appender(io: $stdout, formatter: :color)
SemanticLogger.add_appender(file_name: 'app.log', formatter: :json)
```

This configuration produces a coloured output to the console, and a
JSON-formatted output to a file called `app.log` so that you get the best of
both worlds.

Semantic Logger also allows you to add arbitrary contextual values to a log
entry as follows:

```ruby
logger.info('user signed in', user_id: 123_456, provider: 'facebook')
```

```text
[output]
2023-08-30 11:22:31.164988 I [394737:60] MyApp -- user signed in -- { :user_id => 123456, :provider => "facebook" }
```

You can also add one or more properties to multiple log entries through the
`tagged` block as follows:

```ruby
SemanticLogger.tagged(username: 'John', user_id: 123_456) do
  # All log entries in this block will include the above named tags
  logger.debug('user signed in')
  logger.debug('user opened document', doc_id: 'xyz')
  logger.debug('user signed out')
end
```

```json
[output]
2023-08-30 11:30:07.355499 D [414838:60] {username: John, user_id: 12345} MyApp -- user signed in
2023-08-30 11:30:07.355525 D [414838:60] {username: John, user_id: 12345} MyApp -- user opened document -- { :doc_id => "xyz" }
2023-08-30 11:30:07.355535 D [414838:60] {username: John, user_id: 12345} MyApp -- user signed out
```

Another useful feature is its ability to measure various operations in the
program through the level method prefixed with `measure`:

```ruby
logger.measure_debug 'request a random quote' do
  response = HTTP.get('https://api.quotable.io/quotes/random?tags=history%7Ccivil-rights')
  p response.parse
end
```

The duration of the operation will be present in the logs:

```text
2023-08-30 11:50:04.462807 D [469071:540] (1.930s) MyApp -- request a random quote
```

There's a lot more that Semantic Logger offers, so do check out its
[documentation](https://logger.rocketjob.io/) to learn more.

## 3. Ougai

![ougai.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/740d15ed-921c-47a0-fe58-402beefb8b00/public =1200x600)

[Ougai](https://github.com/tilfin/ougai) is a logging framework that focuses
mainly on outputting structured data, though it also supports human-readable and
colorized logs. It was made to extend the standard `Logger` class in Ruby by
adding a few quality-of-life improvements. For example, it supports the `TRACE`
level by default and formats its output as JSON:

```ruby
require 'ougai'

logger = Ougai::Logger.new($stdout)
logger.level = Ougai::Logger::TRACE

logger.trace('entered main function')
logger.debug('database query executed')
logger.info('user signed in')
logger.warn('disk space is 95% full')
logger.error('encountered an unexpected error while backing up database')
logger.fatal('application crashed')
```

```json
[output]
{"name":"main","hostname":"fedora","pid":684730,"level":10,"time":"2023-08-30T16:25:53.470+02:00","v":0,"msg":"entered main function"}
{"name":"main","hostname":"fedora","pid":684730,"level":20,"time":"2023-08-30T16:25:53.471+02:00","v":0,"msg":"database query executed"}
{"name":"main","hostname":"fedora","pid":684730,"level":30,"time":"2023-08-30T16:25:53.471+02:00","v":0,"msg":"user signed in"}
{"name":"main","hostname":"fedora","pid":684730,"level":40,"time":"2023-08-30T16:25:53.471+02:00","v":0,"msg":"disk space is 95% full"}
{"name":"main","hostname":"fedora","pid":684730,"level":50,"time":"2023-08-30T16:25:53.471+02:00","v":0,"msg":"encountered an unexpected error while backing up database"}
{"name":"main","hostname":"fedora","pid":684730,"level":60,"time":"2023-08-30T16:25:53.471+02:00","v":0,"msg":"application crashed"}
```

You can add contextual properties to individual entries as follows:

```ruby
logger.info('user signed in', user_id: 123_456, username: 'johndoe')
```

```json
[output]
{"name":"main","hostname":"fedora","pid":688088,"level":30,"time":"2023-08-30T16:27:38.283+02:00","v":0,"msg":"user signed in","user_id":123456,"username":"johndoe"}
```

You can also add properties to all logs through the `with_fields` property on a
logger:

```ruby
logger.with_fields = { app_version: 'v1.2.3' }
```

```json
[output]
{"name":"main","hostname":"fedora","pid":694621,"level":30,"time":"2023-08-30T16:30:55.699+02:00","v":0,"msg":"user signed in","user_id":123456,"username":"johndoe","app_version":"v1.2.3"}
{"name":"main","hostname":"fedora","pid":694621,"level":40,"time":"2023-08-30T16:30:55.699+02:00","v":0,"msg":"disk space is 95% full","app_version":"v1.2.3"}
```

Another helpful feature is its ability to add contextual attributes to a set of
events to avoid repetition at log point:

```ruby
require 'ougai'

logger = Ougai::Logger.new($stdout)
logger.level = Ougai::Logger::TRACE

logger.with_fields = { app_version: 'v1.2.3' }

child_logger = logger.child({ user_id: 123_456, username: 'johndoe' })

child_logger.debug('user signed in')
child_logger.debug('user opened document', doc_id: 'xyz')
child_logger.debug('user signed out')
```

```json
[output]
{"name":"main","hostname":"fedora","pid":702804,"level":20,"time":"2023-08-30T16:35:49.567+02:00","v":0,"msg":"user signed in","user_id":123456,"username":"johndoe","app_version":"v1.2.3"}
{"name":"main","hostname":"fedora","pid":702804,"level":20,"time":"2023-08-30T16:35:49.567+02:00","v":0,"msg":"user opened document","doc_id":"xyz","user_id":123456,"username":"johndoe","app_version":"v1.2.3"}
{"name":"main","hostname":"fedora","pid":702804,"level":20,"time":"2023-08-30T16:35:49.567+02:00","v":0,"msg":"user signed out","user_id":123456,"username":"johndoe","app_version":"v1.2.3"}
```

Since Ougai extends the built-in `Logger` class, it supports logging to files
and auto-rotating logs in the same manner discussed earlier in the `Logger`
section above. It also supports pretty printing logs through the
[Amazing Print](https://github.com/amazing-print/amazing_print) package. Once
installed, you may be use it as follows:

```ruby
require 'ougai'

logger = Ougai::Logger.new($stdout)
[highlight]
logger.formatter = Ougai::Formatters::Readable.new
[/highlight]
. . .
```

![ougai_amazing_print.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f118cb66-99b0-425e-7b8f-31b8f0342000/md2x =2316x1774)

To learn more about Ougai and see the other things it can do, please check out
its [GitHub repo](https://github.com/tilfin/ougai).

## 4. Logging

![twp_logging.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/39e53138-a955-4f04-8fb9-e36c40784700/lg1x =1200x600)

The [Logging](https://github.com/twp/logging) library is flexible logging
library for Ruby programs heavily inspired by [Java's
Log4j](https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4j/) module. It features a hierarchical
logging system, multiple output destinations, custom formatting, and much more.
By default, it is configured to produce the same output as the standard `Logger`
class:

```ruby
require 'logging'

logger = Logging.logger($stdout)

logger.debug('database query executed')
logger.info('user signed in')
logger.warn('disk space is 95% full')
logger.error('encountered an unexpected error while backing up database')
logger.fatal('application crashed')
```

```text
[output]
D, [2023-08-30T16:52:24.614290 #759283] DEBUG : database query executed
I, [2023-08-30T16:52:24.614328 #759283]  INFO : user signed in
W, [2023-08-30T16:52:24.614338 #759283]  WARN : disk space is 95% full
E, [2023-08-30T16:52:24.614345 #759283] ERROR : encountered an unexpected error while backing up database
F, [2023-08-30T16:52:24.614351 #759283] FATAL : application crashed
```

You can also name your logger and configure the destination of the logs using
the provided `add_appenders()` method:

```ruby
require 'logging'

logger = Logging.logger['example']
logger.add_appenders(Logging.appenders.stdout)
. . .
```

```text
[output]
DEBUG  example : database query executed
 INFO  example : user signed in
 WARN  example : disk space is 95% full
ERROR  example : encountered an unexpected error while backing up database
FATAL  example : application crashed
```

The default level can be customized in two ways. Either through the `level`
property on the `logger`:

```ruby
logger = Logging.logger['example']
logger.level = :warn
```

Or through the `level` property on the appender:

```ruby
logger.add_appenders(Logging.appenders.stdout(level: :warn))
```

The result is the same either way:

```text
[output]
WARN  example : disk space is 95% full
ERROR  example : encountered an unexpected error while backing up database
FATAL  example : application crashed
```

To format your logs, a few predefined layouts are available: `basic` (the
default), `json`, `yaml`, and `pattern` (for custom formats):

```ruby
logger.add_appenders(Logging.appenders.stdout(level: :info, layout: Logging.layouts.json))
```

```json
[output]
{"timestamp":"2023-08-30T17:28:54.939779+02:00","level":"INFO","logger":"example","message":"user signed in"}
{"timestamp":"2023-08-30T17:28:54.956600+02:00","level":"WARN","logger":"example","message":"disk space is 95% full"}
{"timestamp":"2023-08-30T17:28:54.956620+02:00","level":"ERROR","logger":"example","message":"encountered an unexpected error while backing up database"}
{"timestamp":"2023-08-30T17:28:54.956631+02:00","level":"FATAL","logger":"example","message":"application crashed"}
```

Multiple
[appenders](https://github.com/TwP/logging/blob/master/examples/appenders.rb)
with different formats can be configured like this:

```ruby
require 'logging'

Logging.color_scheme('bright',
                     levels: {
                       info: :green,
                       warn: :yellow,
                       error: :red,
                       fatal: %i[white on_red]
                     },
                     date: :blue,
                     logger: :cyan,
                     message: :magenta)

logger = Logging.logger['example']

logger.add_appenders(
  Logging.appenders.stdout(
    layout: Logging.layouts.pattern(
      pattern: '[%d] %-5l %c: %m\n',
      color_scheme: 'bright'
    )
  ),
  Logging.appenders.rolling_file(
    'app.log',
    age: 'daily',
    layout: Logging.layouts.json
  )
)
. . .
```

The colorized entries will be printed to the console, while the JSON-formatted
entries will be placed in the `app.log` file.

![Screenshot from 2023-08-30 17-45-28.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2d14b0eb-266b-4574-28e3-2232efbd9600/public =2908x1272)

To learn about Logging's other features,
[see the examples folder](https://github.com/TwP/logging/blob/master/examples)
in its GitHub repository.

## 5. Yell

![yell.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/31b17d8b-ec58-44ba-fcd7-eb174ac1d200/public =1200x600)

[Yell](https://github.com/rudionrails/yell) is a logging library designed to be
a drop-in replacement for the standard `Logger` class in Ruby. It supports the
same log levels you can see below:

```ruby
require 'yell'

logger = Yell.new($stdout)

logger.debug('database query executed')
logger.info('user signed in')
logger.warn('disk space is 95% full')
logger.error('encountered an unexpected error while backing up database')
logger.fatal('application crashed')
```

```text
[output]
2023-08-30T17:53:16+02:00 [DEBUG] 964757 : database query executed
2023-08-30T17:53:16+02:00 [ INFO] 964757 : user signed in
2023-08-30T17:53:16+02:00 [ WARN] 964757 : disk space is 95% full
2023-08-30T17:53:16+02:00 [ERROR] 964757 : encountered an unexpected error while backing up database
2023-08-30T17:53:16+02:00 [FATAL] 964757 : application crashed
```

Changing the default log level is done directly through the `new()` method:

```ruby
logger = Yell.new($stdout, level: :error)
```

```text
[output]
2023-08-30T20:01:15+02:00 [ERROR] 1318438 : encountered an unexpected error while backing up database
2023-08-30T20:01:15+02:00 [FATAL] 1318438 : application crashed
```

You can prepare a more elaborate configuration using adapters. In this case,
`DEBUG`, `INFO`, and `WARN` logs are sent to the standard output, while `ERROR`
and `FATAL` entries are sent to the standard error:

```ruby
logger = Yell.new do |l|
  l.adapter($stdout, level: %i[debug info warn])
  l.adapter($stderr, level: %i[error fatal])
end
```

Logging to a file can be done using the `:file` or `:datefile` adapter. The
latter adds a timestamp to the provided filename, while the former does not:

```ruby
logger = Yell.new do |l|
  l.adapter(:file, 'app.log', level: %i[debug info warn]) # produces app.log
  l.adapter(:datefile, 'error.log', level: 'gte.error') # produces error.20230830.log
end
```

With Yell, you can format log messages using the
[provided placeholders](https://github.com/rudionrails/yell/wiki/101-formatting-log-messages).
Although JSON isn't supported by default, you can do something like this to
produce JSON-formatted output:

```ruby
logger = Yell.new do |l|
  l.adapter($stdout, level: %i[debug info warn], format: '{"time": "%d", "msg": "%m", "level": "%L", "pid": %p}')
end
```

```json
[output]
{"time": "2023-08-30T20:19:48+02:00", "msg": "database query executed", "level": "DEBUG", "pid": 1390809}
{"time": "2023-08-30T20:19:48+02:00", "msg": "user signed in", "level": "INFO", "pid": 1390809}
{"time": "2023-08-30T20:19:48+02:00", "msg": "disk space is 95% full", "level": "WARN", "pid": 1390809}
```

Note that Yell doesn't appear to be actively maintained at the time of writing
given its last commit in 2021.

## 6. MrLogaLoga

![mr-loga-loga.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/10f8bca3-4eb2-477d-1393-5227f7d8e100/lg2x =1200x600)

[MrLogaLoga](https://github.com/hschne/mr-loga-loga) is a relatively new logging
library that focuses on making it easy to add contextual information to log
entries. By default, it produces the same output as the standard `Logger` class:

```text
[output]
D, [2023-08-30T20:30:45.674216 #1430267] DEBUG -- : database query executed
I, [2023-08-30T20:30:45.674286 #1430267]  INFO -- : user signed in
W, [2023-08-30T20:30:45.674296 #1430267]  WARN -- : disk space is 95% full
E, [2023-08-30T20:30:45.674304 #1430267] ERROR -- : encountered an unexpected error while backing up database
F, [2023-08-30T20:30:45.674310 #1430267] FATAL -- : application crashed
```

However, unlike the standard logger, it's possible to attach contextual data at
log point. There are a few ways to do this:

```ruby
# Dynamic context method chaining
logger.query('SELECT 1;').duration('200ms').debug('database query executed')
# Using contextual arguments directly on the level method
logger.info('user signed in', username: 'johndoe', user_id: 123_456)
# Passing an explicit context
logger.context(space_used: '1234278MB', space_remaining: '100MB').warn('disk space is 95% full')
```

```text
[output]
D, [2023-08-30T20:35:15.275648 #1450800] DEBUG -- : database query executed query=SELECT 1; duration=200ms
I, [2023-08-30T20:35:15.275688 #1450800]  INFO -- : user signed in username=johndoe user_id=123456
W, [2023-08-30T20:35:15.275701 #1450800]  WARN -- : disk space is 95% full space_used=1234278MB space_remaining=100MB
```

Notice that the contextual properties use the `key=value` format by default. If
you need a fully structured output, you can use the `Json` formatter as follows:

```ruby
logger = MrLogaLoga::Logger.new($stdout, formatter: MrLogaLoga::Formatters::Json.new)
```

```json
[output]
{"severity":"DEBUG","datetime":"2023-08-30T20:47:30.478459","pid":1493435,"message":"database query executed","query":"SELECT 1;","duration":"200ms"}
{"severity":"INFO","datetime":"2023-08-30T20:47:30.478507","pid":1493435,"message":"user signed in","username":"johndoe","user_id":123456}
{"severity":"WARN","datetime":"2023-08-30T20:47:30.478521","pid":1493435,"message":"disk space is 95% full","space_used":"1234278MB","space_remaining":"100MB"}
```

While MrLogaLoga is a little light on features, it conveniently enables
contextual logging in Ruby programs for those who don't require the extensive
capabilities of comprehensive frameworks like Semantic Logger.

## Final thoughts

The landscape of third-party logging frameworks in Ruby is not as robust as in
other languages such as [Go](https://betterstack.com/community/guides/logging/best-golang-logging-libraries/),
[Node.js](https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/), or
[Python](https://betterstack.com/community/guides/logging/best-python-logging-libraries/), but there are still a few good options.
We generally recommend using the Semantic Logger for its comprehensive features
or Ougai if you need only some quality-of-life improvements over the standard
`Logger` class.

Thanks for reading, and happy logging!