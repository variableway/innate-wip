# A Complete Guide to Semantic Logger for Ruby on Rails

While [the built-in Ruby logger provides basic
logging](https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/), it lacks features like context-aware structured
logging, asynchronous writes, and multi-destination support.
[Semantic Logger](https://github.com/reidmorrison/semantic_logger/) addresses
these limitations by offering:

- **Structured logging** in JSON or [logfmt](https://betterstack.com/community/guides/logging/logfmt/).
- **Asynchronous logging** to prevent blocking application execution.
- **Multi-destination logging**, allowing logs to be sent to files, databases,
  and external services.
- **Automatic log enrichment** with contextual data and metrics.
- **Seamless Rails integration**.

In this article, we'll explore how to effectively use Semantic Logger to improve
Ruby and Rails application logging, and turn unstructured logs to structured
data that facilitates [observability](https://betterstack.com/community/guides/observability/what-is-observability/).

Let's dive in!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/b7SWkjgcuMU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## What is Semantic Logger?

Semantic Logger is a high-performance logging framework that brings structured,
leveled, and efficient logging to Ruby applications.

It is widely used due to its flexibility, ease of integration with Rails, and
ability to log to multiple outputs, such as files, databases, or log management
services.

It operates **asynchronously** by default using a separate logging thread. When
your code logs something, the message goes into a queue and a separate thread
processes this queue.

This **non-blocking behavior** ensures that logging does not slow down
application execution.

```ruby
# Asynchronous mode (Default)
class OrderService
  def process_order
    logger.info("Starting order processing")  # Returns immediately
    # Code continues while log writes in background
  end
end
```

To ensure that all logs are written before the application exits, **Semantic
Logger automatically flushes the log queue**. You can also trigger a manual
flush when necessary with:

```ruby
SemanticLogger.flush
```

If logs need to be written immediately, **synchronous mode** can be enabled
using:

```ruby
SemanticLogger.sync!
```

Or, when using a `Gemfile`:

```ruby
[label Gemfile]
gem "semantic_logger", require: "semantic_logger/sync"
```

In this mode, log messages are written in the same thread, meaning execution
waits until logging is completed:

```ruby
# Synchronous (After SemanticLogger.sync!)
class OrderService
  def process_order
    logger.info("Starting order processing")  # Waits for log to be written
    # Code continues only after log is written
  end
end
```

The tradeoff is between performance with asynchronous logging and
immediacy/reliability with synchronous logging.

[ad-logs]

## Getting started with Semantic Logger

To use Semantic Logger in your Ruby project, add it to your `Gemfile`:

```ruby
[label Gemfile]
source 'https://rubygems.org'

[highlight]
gem 'semantic_logger'
[/highlight]
```

Then install it by running:

```command
bundle install
```

```text
[output]
. . .
Fetching semantic_logger 4.16.1
Installing semantic_logger 4.16.1
Bundle complete! 1 Gemfile dependency, 3 gems now installed.
Use `bundle info [gemname]` to see where a bundled gem is installed.
```

Semantic Logger offers several key components:

- **Logger**: The main interface for logging messages with different levels
  (e.g., `info`, `error`).
- **Appenders**: Defines where logs are sent (e.g., console, files, external
  services).
- **Log formatters**: Customize log output formats, such as JSON or plain text.

Let's start with a simple setup that logs messages to the console:

```ruby
require 'semantic_logger'

# Set the default appender to STDOUT
SemanticLogger.add_appender(io: $stdout)

logger = SemanticLogger['MyApp']
logger.info('Application started')
logger.error('An error occurred')
```

Before logging with Semantic Logger, you need to specify a destination for the
logs with `add_appender()`. In the snippet above, the logs are directed to the
standard output.

You must also create an instance of the `Logger` class by supplying the name of
the class or application as seen above. This ensures that the logging entries
from each class are uniquely identified.

You can then call level methods like `info()`, `warn()` and others on the logger
instance to produce log entries.

This will yield the following output:

```text
[output]
2025-01-28 14:06:51.173156 I [1294858:60] MyApp -- Application started
2025-01-28 14:06:51.173174 E [1294858:60 main.rb:8] MyApp -- An error occurred
```

By default, Semantic Logger includes a timestamp, log level, process and thread
ID, logger name, and the message in its output. It also includes the file name
and line number in the case of errors.

Instead of creating a `logger` instance as seen above, you can use the
`SemanticLogger::Loggable` mixin to provide logging capabilities to a class:

```ruby
class Device
[highlight]
  include SemanticLogger::Loggable
[/highlight]

  def perform_operation
    logger.info('Operation completed')
  end
end

device = Device.new
device.perform_operation
```

You'll notice that the resulting log entry is correctly attributed to the class:

```text
[output]
2025-01-29 18:47:17.464853 I [1711333:60] Device -- Operation completed
```

## Using log levels

Semantic Logger supports the following [log levels](https://betterstack.com/community/guides/logging/log-levels-explained/):
`trace`, `debug`, `info`, `warn`, `error`, and `fatal`. These levels allow you
to control log verbosity by filtering messages based on severity.

These levels allow you to control log verbosity by filtering messages based on
severity.

```ruby
logger.trace('Trace message')
logger.debug('Debug message')
logger.info('Info message')
logger.warn('Warning message')
logger.error('Error message')
logger.fatal('Fatal message')
```

```text
[output]
2025-01-28 15:47:10.416653 I [1330085:60] MyApp -- Info message
2025-01-28 15:47:10.416689 W [1330085:60] MyApp -- Warning message
2025-01-28 15:47:10.416699 E [1330085:60 main.rb:16] MyApp -- Error message
2025-01-28 15:47:10.416724 F [1330085:60 main.rb:17] MyApp -- Fatal message
```

Semantic Logger follows the standard Ruby and Rails logging interface, so if
you're migrating from the default logger, you don't need to modify all existing
logging calls.

### Setting the default log level

By default, Semantic Logger logs at the `info` level, meaning that `trace` and
`debug` messages are ignored unless explicitly enabled.

You can control this by adjusting the global log level with:

```ruby
SemanticLogger.default_level = :warn
```

Now, only `warn`, `error`, and `fatal` logs will be recorded.

You can also override the default log level for a specific logger:

```ruby
class Device
  include SemanticLogger::Loggable

[highlight]
  logger.level = :error
[/highlight]
end
```

This ensures that only logs at `error` or higher are recorded for the `Device`
class.

You can also control log verbosity without modifying code through an environment
variable:

```ruby
SemanticLogger.default_level = ENV.fetch('LOG_LEVEL', 'info')
# or per logger
logger.level = ENV.fetch('LOG_LEVEL', 'info')
```

This makes it easy to adjust logging levels in different environments (such as
`debug` in development, `warn` in production).

### Suppressing logs with `silence`

The `silence` method allows you to increase the log level for a block of code
temporarily. By default, it suppresses all logs below `error`:

```ruby
# Silence all logging below :error level
logger.silence do
 logger.info "This will not be logged"
 logger.warn "Neither will this"
 logger.error "But errors will be logged!"
end
```

Internally, silence raises `default_level` to `error` and restores it after the
block.

You can also specify a custom log level:

```ruby
logger.silence(:warn) do
 logger.warn "warning message" # This will be logged
end
```

Some common use cases for `logger.silence` include:

- During batch operations where logging each item would be too verbose.
- When calling noisy third-party libraries.
- During testing, when you want to suppress certain log output.

However, note that `silence` does not affect loggers with explicitly set
levels—only those relying on the global default.

## Structuring your log entries

One of the key benefits of Semantic Logger is its support for [structured
logging](https://betterstack.com/community/guides/logging/structured-logging/). Instead of just text messages, structured logs are
designed for machine parsability, a prerequisite for [achieving an observable
system](https://betterstack.com/community/guides/observability/what-is-observability/).

Since [JSON is the most widely used structured format](https://betterstack.com/community/guides/logging/json-logging/), we'll
configure Semantic Logger to output logs in JSON:

```ruby
[highlight]
SemanticLogger.add_appender(io: $stdout, formatter: :json)
[/highlight]

logger.info('User signed in')
```

You'll see the output will now be in JSON format:

```json
[output]
{
  "host": "falcon",
  "application": "Semantic Logger",
  "timestamp": "2025-01-28T14:40:03.873527Z",
  "level": "info",
  "level_index": 2,
  "pid": 1327780,
  "thread": "60",
  "name": "MyApp",
  "message": "User signed in",
}
```

Note that the JSON output shown above is formatted for readability. The actual
entry is always a single-line JSON string ending with a newline character.

This JSON output contains a few additional details not found in the default
format such as the `host`, `application`, and `level_index` properties.

The numeric representation of log levels (`level_index`) makes it easier to
perform comparisons and set thresholds programmatically in log management tools.

![Image of using level_index in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3ae7cc29-9995-4a6c-921b-41e275a9bd00/md2x =4659x2660)

## Adding context to your logs

Semantic Logger allows you to enrich logs with contextual data beyond just the
log message. Each logging method supports additional parameters:

```ruby
log.method(<message>, <payload_or_exception> = nil, <exception> = nil, &block)
```

Here's a breakdown of each parameter:

- `<message>` (_required if no other parameter is provided_): The main log
  message.
- `<payload_or_exception>` (optional): It can either be:
  - **A hash**: Adds structured key-value data for **contextual logging**.
  - **An exception**: If an error object is passed, Semantic Logger will log its
    message and backtrace.
- `<exception>` (optional): If an exception is not provided in
  `<payload_or_exception>`, you can pass it here explicitly.
- `&block` (optional): The block is evaluated only if the log level is enabled.

You can include custom attributes in logs to provide more details about events:

```ruby
logger.info('User logged in', { user_id: user.id, ip: request.remote_ip, session_id: session.id })
```

They will appear in the logs under the `payload` key:

```json
{
  "host": "falcon",
  "application": "Semantic Logger",
  "timestamp": "2025-01-28T14:40:03.873527Z",
  "level": "info",
  "level_index": 2,
  "pid": 1327780,
  "thread": "60",
  "name": "MyApp",
  "message": "User signed in",
[highlight]
  "payload": {
    "user_id": 123,
    "ip": 127.0.0.1,
    "session_id": "abc123"
  }
[/highlight]
}
```

You can also log exceptions either in the second or third parameter as follows:

```ruby
begin
  raise 'Something went wrong'
rescue StandardError => e
[highlight]
  logger.error('An error occurred', { request_id: 123 }, e)
[/highlight]
  # or
[highlight]
  logger.error('An error occurred', e)
[/highlight]
end
```

In either case, an `exception` object will be included in the log entry with the
type of error, the error message, and a stack trace:

```json
[output]
{
  . . .
  "exception": {
    "name": "RuntimeError",
    "message": "Something went wrong",
    "stack_trace": [
      "main.rb:20:in `<main>'"
    ]
  }
}
```

If an exception has a cause (nested error), Semantic Logger will include both in
the same entry:

```json
[output]
{
  . . .
[highlight]
  "exception": {
    "name": "RuntimeError",
[/highlight]
    "message": "Failed to write to file",
    "stack_trace": [
      "main.rb:24:in `rescue in oh_no'",
      "main.rb:19:in `oh_no'",
      "main.rb:28:in `<main>'"
    ],
[highlight]
    "cause": {
      "name": "IOError",
[/highlight]
      "message": "not opened for reading",
      "stack_trace": [
        "main.rb:22:in `read'",
        "main.rb:22:in `oh_no'",
        "main.rb:28:in `<main>'"
      ]
    }
  }
}
```

### Contextual logging with `tagged`

Semantic Logger provides a convenient way to add contextual metadata to multiple
log entries using the `tagged` method.

It ensures that all logs within a specific block share common attributes, making
it easier to trace related events.

Here's how to use it:

```ruby
class WeatherStation
  include SemanticLogger::Loggable

  def initialize(station_id)
    @station_id = station_id
  end

  def calibrate_sensors
    logger.info('Starting sensor calibration', { station_id: @station_id, maintenance_type: 'calibration' })
    logger.info('Wind sensor calibrated', { bearing_adjusted: true, previous_direction: 'NW' })
  end
end

# Initialize the station
station = WeatherStation.new('STATION-SFO-01')

[highlight]
SemanticLogger.tagged(facility: 'SFO Airport', region: 'Bay Area') do
  station.calibrate_sensors
end
[/highlight]
```

You'll notice that both log entries produced within the block contain a
`named_tag` property with the shared `facility` and `region` fields:

```json
[output]
{
  "host": "falcon",
  "application": "Semantic Logger",
  "timestamp": "2025-01-29T19:08:29.310165Z",
  "level": "info",
  "level_index": 2,
  "pid": 1733346,
  "thread": "60",
[highlight]
  "named_tags": {
    "facility": "SFO Airport",
    "region": "Bay Area"
  },
[/highlight]
  "named_tags": {
  "name": "WeatherStation",
  "message": "Wind sensor calibrated",
  "payload": {
    "bearing_adjusted": true,
    "previous_direction": "NW"
  }
}
```

This way, you can easily include relevant contextual attributes to your log
entries without manually passing metadata in each log call.

## Working with appenders

Semantic Logger supports logging to multiple destinations beyond the console,
including:

- A text file,
- Any HTTP, UDP, or TCP endpoint,
- Log management services Better Stack, Papertrail, New Relic, etc,
- Error tracking tools,
- Databases like MySQL or MongoDB.

To configure where logs are sent, use the `add_appender()` method:

```ruby
SemanticLogger.add_appender(io: $stdout) # Logs to the standard output
```

You can also specify multiple appenders to store logs in different formats and
locations simultaneously. For example, you can log to a file and the console
with this configuration:

```ruby
SemanticLogger.add_appender(io: $stdout, formatter: :color)
SemanticLogger.add_appender(file_name: 'application.log', formatter: :json, level: :error)
```

With this setup, all logs will be written to the console in a colorized format:

![Semantic Logger in Ruby in colorized format](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/14f66aae-9f44-4019-d776-068978bc0200/orig =2164x672)

While the `application.log` will only contain the logs with `error` severity or
greater in JSON format:

```json
[label application.log]
{"host":"falcon","application":"Semantic Logger","timestamp":"2025-01-29T04:38:40.643648Z","level":"error","level_index":4,"pid":1425652,"thread":"60","file":"main.rb","line":15,"name":"MyApp","message":"Error message"}
{"host":"falcon","application":"Semantic Logger","timestamp":"2025-01-29T04:38:40.643675Z","level":"fatal","level_index":5,"pid":1425652,"thread":"60","file":"main.rb","line":16,"name":"MyApp","message":"Fatal message"}
```

If you're logging to a file, ensure to [configure log
rotation](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) on the server
or [container](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/).

For more appender configurations, refer to the
[Semantic Logger documentation](https://logger.rocketjob.io/appenders.html).

## Collecting performance measurements through logs

Semantic Logger provides a simple way to track metrics such as durations and
counts directly in the log entries.

For example, you can track the execution time of a block of code through the
`measure` methods:

```ruby
logger.measure_trace()
logger.measure_debug()
logger.measure_info()
logger.measure_warn()
logger.measure_error()
logger.measure_fatal()
```

These methods track execution time and can include custom payload data:

```ruby
logger.measure_info 'Sleep for 3 seconds' do
  sleep 3
end
```

Once the block completes, the log entry includes the execution duration:

```text
[output]
{
  . . .
[highlight]
  "duration_ms": 3003.161854983773,
  "duration": "3.003s",
[/highlight]
  "name": "MyApp",
  "message": "Sleep for 3 seconds"
}
```

To reduce log volume, you can log only if an operation exceeds a given duration:

```ruby
logger.measure_info 'I took more than a second', min_duration: 1000 do
  # log only if this block takes more than a second to run
end
```

This is useful for identifying slow operations without cluttering logs with fast
executions.

You can also associate a custom metric name with the log entry to make it easier
to aggregate and visualize such data in [log monitoring tools](https://betterstack.com/community/guides/logging/log-monitoring/):

```ruby
logger.measure_info 'called external API', metric: 'ExternalAPI/request_time' do
  # call external API
end
```

```json
[output]
{
  . . .
  "duration_ms": 1002.2141790250316,
  "duration": "1.002s",
  "name": "MyApp",
  "message": "called external API",
[highlight]
  "metric": "ExternalAPI/request_time"
[/highlight]
}
```

If you're looking for a dedicated metrics instrumentation tool, check out [Prometheus](https://betterstack.com/community/guides/monitoring/prometheus/) or [OpenTelemetry](https://betterstack.com/community/guides/observability/what-is-opentelemetry/)

## Integrating Semantic Logger in Rails

Semantic Logger integrates seamlessly with Rails to enable structured,
high-performance logging throughout your application.

To replace Rails' default logger with Semantic Logger, you can modify your
`config/application.rb` file as follows:

```ruby
[label config/application.rb]
require_relative "boot"

require "rails/all"

[highlight]
require "semantic_logger"
[/highlight]

Bundler.require(*Rails.groups)

module Myapp
  class Application < Rails::Application
[highlight]
    config.logger = SemanticLogger["Rails"]
    SemanticLogger.add_appender(io: $stdout, formatter: :color)
[/highlight]
  end
end
```

To replace Rails' default logger with Semantic Logger, modify
`config/application.rb`:

```ruby
class ApplicationController < ActionController::Base
  def hello
[highlight]
    logger.info("Info message")
[/highlight]
    render html: "hello, world!"
  end
end
```

```text
[output]
2025-01-29 11:28:00.133910 I [1597443:puma srv tp 001] ApplicationController -- Info message
```

For a more straightforward setup, use the `rails_semantic_logger` gem, which
automatically replaces the Rails logger:

```Gemfile
[label Gemfile]
gem "rails_semantic_logger"
```

It also automatically replaces the default loggers for:

- Sidekiq
- Bugsnag
- Mongoid
- Mongo
- Moped
- Resque
- Sidetiq
- DelayedJob

By using `rails_semantic_logger`, all logs from your Rails app and these
dependencies will follow the configured Semantic Logger format.

Once Semantic Logger is integrated, Rails' logs will start to appear in its
default format:

```text
[output]
2025-01-29 10:25:53.991568 I [1573174:puma srv tp 001] (44.9ms) ApplicationController -- Completed #hello -- {:controller=>"ApplicationController", :action=>"hello", :format=>"*/*", :method=
>"GET", :path=>"/", :status=>200, :view_runtime=>10.91, :db_runtime=>0.0, :queries_count=>0, :cached_queries_count=>0, :allocations=>4581, :status_message=>"OK"}
```

You can also include the source code file name and line number where the message
originated by setting `config.semantic_logger.backtrace_level` to the desired
level:

```ruby
config.semantic_logger.backtrace_level = :info # The default is :error
```

Now, each log entry includes the source file (`subscriber.rb`) and line number
(`138`) to help with debugging efforts:

```text
2025-01-29 10:37:59.904835 E [1578977:puma srv tp 001 subscriber.rb:138] (43.2ms) ApplicationController -- Completed #hello -- {:controller=>"ApplicationController", :action=>"hello", :format=>"*/*", :method=>"GET", :path=>"/", :status=>500, :view_runtime=>8.12, :db_runtime=>0.0, :queries_count=>0, :cached_queries_count=>0, :allocations=>4698, :status_message=>"Internal Server Error"}
```

### Customizing the Rails log output

By default, Rails logs several entries for each request it receives:

```text
2025-01-29 10:47:56.985250 I [1582027:puma srv tp 001 remote_ip.rb:96] Rack -- Started -- {:method=>"GET", :path=>"/", :ip=>"::1"}
2025-01-29 10:47:56.996849 D [1582027:puma srv tp 001] (0.097ms) ActiveRecord -- ActiveRecord::SchemaMigration Load -- {:sql=>"SELECT \"schema_migrations\".\"version\" FROM \"schema_migratio
ns\" ORDER BY \"schema_migrations\".\"version\" ASC /*application='Myapp'*/", :allocations=>23, :cached=>nil}
2025-01-29 10:47:57.014109 D [1582027:puma srv tp 001] ApplicationController -- Processing #hello
2025-01-29 10:47:57.059583 D [1582027:puma srv tp 001] ActionView -- Rendering -- {:template=>"html template"}
2025-01-29 10:47:57.059645 I [1582027:puma srv tp 001 subscriber.rb:138] (0.017ms) ActionView -- Rendered -- {:template=>"html template", :allocations=>10}
2025-01-29 10:47:57.059922 I [1582027:puma srv tp 001 subscriber.rb:138] (45.7ms) ApplicationController -- Completed #hello -- {:controller=>"ApplicationController", :action=>"hello", :forma
t=>"*/*", :method=>"GET", :path=>"/", :status=>200, :view_runtime=>5.29, :db_runtime=>0.0, :queries_count=>0, :cached_queries_count=>0, :allocations=>4802, :status_message=>"OK"}
```

A typical request emits the following entries:

- A "**Started**" entry when Rails receives a new HTTP request.
- A "**Processing**" entry when Rails starts executing a controller action.
- A "**Rendered**" entry when a view template is rendered.
- A "**Completed**" entry once the request is fully processed.

Except for "Completed", all other logs are at the `debug` level and only appear
in development or testing environments.

You can turn off specific log entries (`Started`, `Processing`, or `Rendered`)
in `config/application.rb`:

```ruby
config.rails_semantic_logger.started    = false
config.rails_semantic_logger.processing = false
config.rails_semantic_logger.rendered   = false
```

You'll also notice that entries generated by the `ActionController` and
`ActiveRecord` are converted to semantic data:

```text
2025-01-29 10:47:56.985250 I [1582027:puma srv tp 001 remote_ip.rb:96] Rack -- Started -- {:method=>"GET", :path=>"/", :ip=>"::1"}
2025-01-29 10:47:56.996849 D [1582027:puma srv tp 001] (0.097ms) ActiveRecord -- ActiveRecord::SchemaMigration Load -- {:sql=>"SELECT \"schema_migrations\".\"version\" FROM \"schema_migratio
ns\" ORDER BY \"schema_migrations\".\"version\" ASC /*application='Myapp'*/", :allocations=>23, :cached=>nil}
2025-01-29 10:47:57.059922 I [1582027:puma srv tp 001 subscriber.rb:138] (45.7ms) ApplicationController -- Completed #hello -- {:controller=>"ApplicationController", :action=>"hello", :forma
t=>"*/*", :method=>"GET", :path=>"/", :status=>200, :view_runtime=>5.29, :db_runtime=>0.0, :queries_count=>0, :cached_queries_count=>0, :allocations=>4802, :status_message=>"OK"}
```

You can disable this conversion with:

```ruby
config.rails_semantic_logger.semantic = false
```

The messages will now appear as follows:

```text
2025-01-29 11:09:53.608201 I [1590493:puma srv tp 001] Rails -- Started GET "/" for ::1 at 2025-01-29 11:09:53 +0100
2025-01-29 11:09:53.625462 D [1590493:puma srv tp 001] ActiveRecord::Base --   ActiveRecord::SchemaMigration Load (0.1ms)  SELECT "schema_migrations"."version" FROM "schema_migrations" ORDER
 BY "schema_migrations"."version" ASC /*application='Myapp'*/
2025-01-29 11:09:53.657161 I [1590493:puma srv tp 001] Rails -- Completed 200 OK in 16ms (Views: 1.9ms | ActiveRecord: 0.0ms (0 queries, 0 cached) | GC: 0.3ms)
```

### Modifying request completion entries

By default, Rails includes details like HTTP method, controller action, response
status, and execution times in the "Completed" log.

However, you can enhance these logs by adding custom metadata through the
`append_info_to_payload` method:

```ruby
class OrdersController < ApplicationController
  def show
    @order = Order.find(params[:id])
    render json: @order
  end

[highlight]
  def append_info_to_payload(payload)
    super
    payload[:order_id] = @order&.id
    payload[:customer_id] = @order&.customer_id
    payload[:total_amount] = @order&.total_amount
    payload[:payment_status] = @order&.payment_status
  end
[/highlight]
end
```

When this controller processes a request, the log entry will now include order
details:

```text
[output]
2025-01-29 11:26:23.411208 I [1595209:puma srv tp 002] (6.049ms) OrdersController -- Completed #show -- {:controller=>"OrdersController", :action=>"show", :format=>"*/*", :method
=>"GET", :path=>"/order", :status=>200, :view_runtime=>0.77, :db_runtime=>0.0, :queries_count=>0, :cached_queries_count=>0, :order_id=>12345, :customer_id=>789, :total_amount=>299.99, :payment_st
atus=>"paid", :allocations=>635, :status_message=>"OK"
```

If you need request-wide metadata across all controllers, define
`append_info_to_payload` in `ApplicationController`:

```ruby
class ApplicationController < ActionController::Base
  def append_info_to_payload(payload)
    super
    payload[:remote_ip] = request.remote_ip
    payload[:user_agent] = request.user_agent
  end
end
```

Now, every request log will automatically include the client's IP address and
browser details.

### Enabling structured JSON logging

To enable structured logging in Rails with Semantic Logger, configure the log
format in `config/application.rb`:

```ruby
[label config/application.rb]
. . .

module Myapp
  class Application < Rails::Application
[highlight]
    config.semantic_logger.add_appender(io: $stdout, formatter: :json)
    config.rails_semantic_logger.format = :json
[/highlight]
  end
end
```

All the log entries will now be presented in JSON format:

```text
[output]
{"host":"falcon","application":"Semantic Logger","environment":"development","timestamp":"2025-01-29T10:00:23.007882Z","level":"info","level_index":2,"pid":1586842,"thread":"puma srv tp 001"
,"duration_ms":45.08242005109787,"duration":"45.1ms","name":"ApplicationController","message":"Completed #hello","payload":{"controller":"ApplicationController","action":"hello","format":"*/
*","method":"GET","path":"/","status":200,"view_runtime":3.98,"db_runtime":0.0,"queries_count":0,"cached_queries_count":0,"allocations":4650,"status_message":"OK"}}
```

### Adding log tags

To include global metadata in every log entry, use the `config.log_tags` option.
This ensures application or request-wide attributes are automatically added to
all logs.

Here's an example that modifies `config/application.rb` to include the request
ID in every log entry:

```ruby
[label config/application.rb]
module Myapp
  class Application < Rails::Application
    . . .
    [highlight]
    config.log_tags = {
      request_id: :request_id
    }
    [/highlight]
  end
end
```

With this configuration, all log entries will contain a `request_id` inside the
`named_tags` field:

```json
[output]
{
  "host": "falcon",
  "application": "Semantic Logger",
  "environment": "development",
  "timestamp": "2025-01-29T17:07:36.005944Z",
  "level": "debug",
  "level_index": 1,
  "pid": 1698257,
  "thread": "puma srv tp 001",
[highlight]
  "named_tags": {
    "request_id": "701a41a3-19ef-4c5e-9df5-1d00cf415ed1"
  },
[/highlight]
  "name": "Rack",
  "message": "Started",
  "payload": {
    "method": "GET",
    "path": "/",
    "ip": "::1"
  }
}
```

This is a handy way to correlate all the logs generated by a single request
without manually adding `request_id` in every log statement.

## Centralizing and monitoring your Rails logs

So far, we've explored how to configure Semantic Logger, customize its log
output, and integrate it into Rails applications. The next step is centralizing
your logs to enable sophisticated log analysis, and long-term storage.

Instead of managing logs on individual servers, using a log management service
such as [Better Stack](https://betterstack.com/telemetry) allows you to:

- Aggregate logs from multiple environments in one place.
- Monitor application health and detect anomalies in real time.
- Set up proactive alerts to catch issues before they impact users.
- Correlate logs with metrics and traces for deeper insights.

![Better Stack Telemetry interface](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/019b39c2-8782-414e-5b9f-63a2ba04fb00/md2x =4659x2660)

The recommended approach is logging to the console or a file and using a log
forwarder such as [Vector](https://betterstack.com/community/guides/logging/vector-explained/), [Fluentd](https://betterstack.com/community/guides/logging/fluentd-explained/), or
the [OpenTelemetry Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/) to route logs to their
final destination.

This decouples logging from log storage, ensuring that your application remains
agnostic to the final log destination. It also means that log processing and
aggregation are handled externally which helps avoid additional performance
overhead.

If logging to the console or a file is not practical in your environment,
Semantic Logger supports direct integrations with various services through its
[appenders](https://logger.rocketjob.io/appenders.html).

```ruby
config.semantic_logger.add_appender(
  appender: :http,
  url:      "https://in.logs.betterstack.com",
  formatter: :json,
  header: {"Authorization" => "Bearer <token>"}
)
```

## Final thoughts

We've covered a lot of ground in this tutorial around how Semantic Logger
enhances logging in Ruby on Rails applications.

By offering everything required for a robust logging system, along with
flexibility and easy customization, Semantic Logger stands out as a strong
choice for your next Ruby project.

I hope this article has helped you understand how to integrate Semantic Logger
in your Ruby and Rails projects. For more details, be sure to check out the
[official Semantic Logger documentation](https://logger.rocketjob.io/).

Thanks for reading, and happy logging!
