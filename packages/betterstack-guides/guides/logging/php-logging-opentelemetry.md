# Practical Logging for PHP Applications with OpenTelemetry

With the rise of microservices, collecting performance metrics, utilizing
distributed tracing, and implementing effective logging strategies have become
increasingly crucial for understanding the stability and performance of
applications in the context of complex distributed systems. In response to this
need, a proliferation of tools and platforms has saturated the market, offering
a variety of choices for baking observability right into your PHP applications.

However, the lack of proper standardization across these tools has introduced a
lot of complexity and confusion for developers to deal with. Should you use
push-based or pull-based monitoring? Should you go for an agent-based or
agentless setup? Which formats, protocols, and backends available for traces,
metrics, and logs should you choose for your particular use case?

These questions have been troubling developers and organizations for quite some
time, and [OpenTelemetry](https://betterstack.com/community/guides/observability/what-is-opentelemetry/) attempts to provide a solution
by proposing a unified standard for observability instrumentation in
applications, irrespective of the specific programming language, framework, or
observability backend being used.

OpenTelemetry is a project whose main goal is to provide a consistent and
easy-to-understand programming interface that developers can use in their
applications to gather telemetry data. It also promotes the use (and provides
the implementation) of a standard component for data collection called the
OpenTelemetry Collector, which has the capability of exporting data for
long-term storage to a wide array of specialized observability backends.

In the following tutorial, you'll learn how to use the OpenTelemetry framework
to instrument your PHP applications with code that gathers log data. You'll
further witness how the OpenTelemetry SDK helps you correlate that data with
other observability signals emitted from your applications (traces in
particular) and how all of these can provide a comprehensive overview of the
interactions between the microservices in a distributed system, helping you
pinpoint and resolve any issues that arise during the application lifecycle.

Without further ado, let's get started!

[ad-logs]

## Prerequisites

- Basic Linux skills.
- Prior PHP development experience.
- Familiarity with Docker and Docker Compose.
- Basic understanding of [distributed tracing terminology](https://betterstack.com/community/guides/observability/distributed-tracing/)
  (spans and traces)
- Basic understanding of microservice architecture concepts.

If you plan to follow along with the practical examples in this tutorial, it
will be helpful to sign up for a
[free Better Stack account](https://betterstack.com/users/sign-up).

## Exploring a distributed system

Your main goal in this tutorial will be to work on a distributed system and
modify a particular microservice in that system to emit logs using
OpenTelemetry. The system consists of several microservices that interact with
each other to accomplish a simple but important task. They must continuously
inform the customers of a larger business application of certain important
events affecting their user accounts. The diagram below provides a bit more
clarity:

![distributed system architecture](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8a794a0c-5828-4b55-797b-f567708a7400/lg2x =1137x397)

A `producer` service emits events to an
[SQS work queue](https://aws.amazon.com/sqs/). Each event in the queue holds
three critical pieces of information:

1. `id` specifies a unique identifier (a
   [v4 UUID](https://www.uuidgenerator.net/version4)) useful for tracking,
   correlation, and deduplication.
2. `name` identifies the event type. There are three unique event types in this
   system:
   - `MaintenanceScheduled` notifies about planned maintenance activities that
     may impact the overall system availability.
   - `SuspiciousActivityDetected` notifies about unusual activities detected in
     customer accounts.
   - `TermsOfServiceUpdated` notifies about important updates to the service
     agreement terms.

3. `context` includes essential details about the emitted event, such as which
   customer it's addressed to, as well as all additional information required
   for communicating about the event with the customer.

In practical terms, you may think of the `producer` service as the messaging
submodule of the larger business application. In this example, its sample
implementation randomly generates events according to an externally specified
`SQS_SEND_INTERVAL` (set to 15 seconds by default).

Next is the `notification-engine` service, which is the main focus of this
tutorial. It receives event messages from the SQS work queue and takes the
following four steps as a result:

1. It requests an email template that fits the specified event type from the
   `cms` service (the `cms` service will be covered in a moment).
2. It takes the returned template string and substitutes all template variables
   with actual values obtained from the event `context` to construct a valid
   email message.
3. It performs a quick A/B test and chooses a suitable email service provider.
4. It sends the constructed email message to the customer through the selected
   email service provider.

This tutorial assumes that the email service provider is some popular
third-party service such as [Mailgun](https://www.mailgun.com/) or
[Postmark](https://postmarkapp.com/). However, both services will be stubbed out
locally with [Mailpit](https://mailpit.axllent.org/) (an SMTP server simulator),
so you won't be integrating with any actual email providers.

As for the `cms` service, it simulates an internal platform used by designers
for creating and managing email templates and other content. The `cms` exposes a
convenient REST API that engineers working on other microservices can use to
integrate with it.

Now that you have an idea of how the example distributed system works, it's time
to see how to launch all of its services locally.

## Running the examples

Clone the repository containing the distributed system example locally:

```command
git clone https://github.com/betterstack-community/otel-php-logging.git
```

Then `cd` into its folder:

```command
cd otel-php-logging
```

Issue the following command:

```command
tree -L 1 --dirsfirst
```

You'll observe the following directory structure:

```text
[output]
.
├── cms
├── notification-engine
├── producer
├── compose.yaml
├── Dockerfile
├── elasticmq.conf
└── otelcol.yaml

3 directories, 4 files
```

- The `cms`, `notification-engine`, and `producer` folders contain the source
  code of each corresponding microservice.
- `compose.yaml` serves as a configuration file that defines the services,
  networks, and volume mounts necessary for launching the entire distributed
  system locally with Docker (via `docker compose`).
- `Dockerfile` defines the common building steps for making Docker images for
  each microservice.
- `elasticmq.conf` is a configuration file for the
  [ElasticMQ](https://github.com/softwaremill/elasticmq) service (`queue` in
  `compose.yaml`) that runs locally as an SQS substitute. Essentially, it tells
  ElasticMQ to create a new queue named `notification-events` upon its startup.
- `otelcol.yaml` is a configuration file for the
  [OpenTelemetry Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/) which acts as a centralized data collection point for
  metrics, traces, and logs emitted from the microservices in this example (more
  on that later).

You can launch the entire setup locally by running:

```command
docker compose up -d --build
```

When you do, Docker images will be built automatically for the `cms`,
`notification-engine`, and `producer` microservices, and you'll see the
following containers getting started:

```text
[output]
 ✔ Container otel-php-logging-postmark-1             Healthy    32.6s
 ✔ Container otel-php-logging-jaeger-1               Healthy    32.6s
 ✔ Container otel-php-logging-queue-1                Healthy    32.6s
 ✔ Container otel-php-logging-mailgun-1              Healthy    32.6s
 ✔ Container otel-php-logging-collector-1            Started    31.1s
 ✔ Container otel-php-logging-cms-1                  Started    32.0s
 ✔ Container otel-php-logging-producer-1             Started    32.0s
 ✔ Container otel-php-logging-notification-engine-1  Started    32.7s
```

- The `cms`, `notification-engine`, and `producer` containers run the
  corresponding microservices. You already know how they work and what they do.
- The `queue` container runs ElasticMQ.
- The `mailgun` and `postmark` containers run Mailpit.
- The `collector` container runs the OpenTelemetry Collector.
- The `jaeger` container runs [Jaeger](https://www.jaegertracing.io/), a popular
  end-to-end distributed tracing system providing mechanisms for storage,
  retrieval, and visualization of trace data.

`mailgun`, `postmark`, and `jaeger` all expose convenient web UIs for easier
testing and debugging, and you'll be using them all in this tutorial.

They are available at:

- `localhost:18025` for `mailgun`.
- `localhost:28025` for `postmark`.
- `localhost:16686` for `jaeger`.

You'll see how the system works in practice in the next section.

## Viewing trace data in Jaeger

All microservices in the provided example have OpenTelemetry tracing
instrumentation already setup, so assuming all Docker containers are up and
running, you should be able to [use Jaeger for exploring and analyzing their
trace data](https://betterstack.com/community/guides/observability/jaeger-guide/) to verify that the system works.

Go ahead and open the Jaeger UI, located at `localhost:16686`. Keep in mind that
it takes a minute or so for the first traces to get indexed in Jaeger, so make
sure to refresh the UI until all three services (`producer`, `cms`, and
`notification-engine`) appear as choices in the **Service** dropdown. When they
do, select `producer` and click **Find Traces**:

![Jaeger UI main page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b3a5e653-3507-4b10-45bc-d354426a7600/orig =956x803)

You'll see a list of traces capturing the journey of each notification request
as it flows through the various services within your distributed system. Keep in
mind that some traces may be incomplete if the related inter-service requests
are still in-flight at the time of observation.

Click on one of the complete requests to explore this further (the number of
reported spans should be five for a complete trace):

![Jaeger trace search](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fc7902e1-b7c1-4e94-a862-4517d588cc00/lg1x =961x822)

You'll see a similar report:

![Jaeger trace timeline](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/708495c7-6387-4fa7-b186-f912729e2d00/lg2x =1481x463)

The trace timeline shows you the chronological order of events within that
specific notification request. This particular request started with the
`producer` pushing a message to the `notification-events` queue in SQS (i.e.,
ElasticMQ) and the `notification-engine` receiving that message a few seconds
later.

The `notification-engine` then started processing the message and asked the
`cms` service for the corresponding email template, to which the `cms` service
responded accordingly. Finally, after assembling the template into a complete
email message, the `notification-engine` contacted the `postmark` service to
deliver the relevant email notification.

It seems like the services are behaving as expected, so the system is working!

You can go ahead and stop the services for now (the `-t 0` flag will cause them
to shut down immediately without having to wait for the `sleep` timeouts in the
`producer` and the `notification-engine` to expire):

```command
docker compose down -t 0
```

As you can see, tracing can be a really powerful companion for understanding
request flow in a distributed system. Yet, there are situations where it's not
sufficient to diagnose issues affecting your system's behavior. In many cases,
[logging](https://betterstack.com/community/guides/logging/) can offer a wealth of additional information and help you
troubleshoot problems that distributed tracing might not be able to detect
alone.

In the next section, you'll explore some relevant examples that clearly
illustrate how logging and tracing can be used to complement each other.

## Setting up application logging

In this section, you'll be setting up logging for the `notification-engine`
service. You may assume that the other services (`cms` and `producer`) are not
under your direct control and that your sole responsibility is to make the
`notification-engine` easier to troubleshoot and more observable than it already
is.

First, examine what you're starting with, and `cd` into the
`notification-engine` folder:

```command
cd notification-engine
```

Open up the `composer.json` file and explore its contents:

```json
[label ./notification-engine/composer.json]
{
  "autoload": {
    "psr-4": {
      "Demo\\Project\\": "src/"
    }
  },
  "require": {
    "aws/aws-sdk-php": "^3.304",
    "nette/mail": "^4.0",
[highlight]
    "open-telemetry/sdk": "^1.0",
    "open-telemetry/exporter-otlp": "^1.0",
    "ext-opentelemetry": "*"
[/highlight]
  },
  "config": {
    "allow-plugins": {
      "php-http/discovery": false
    }
  }
}
```

Among other things, you'll notice that the `notification-engine` application
depends on the
[open-telemetry/sdk](https://packagist.org/packages/open-telemetry/sdk) and
[open-telemetry/exporter-otlp](https://packagist.org/packages/open-telemetry/exporter-otlp)
packages, as well as the
[ext-opentelemetry](https://pecl.php.net/package/opentelemetry) PHP extension.

The OpenTelemetry extension is primarily used for tracing and isn't a mandatory
requirement for logging, but it could be useful for that too. I'll explain how
it helps with logging later on in this tutorial.

As for the Composer packages:

- The `open-telemetry/sdk` package provides a working implementation of the
  [OpenTelemetry specification](https://opentelemetry.io/docs/specs/otel/) that
  you can use to create traces, record metrics, and emit logs from PHP
  applications. Underneath, it relies on the packages
  [open-telemetry/api](https://packagist.org/packages/open-telemetry/api),
  [open-telemetry/context](https://packagist.org/packages/open-telemetry/context),
  and
  [open-telemetry/sem-conv](https://packagist.org/packages/open-telemetry/sem-conv).
  - `open-telemetry/api` provides the interfaces described in the OpenTelemetry
    specification. The SDK essentially implements these interfaces. The API
    package also ships some dummy (no-op) implementations that you could
    optionally use for rapid prototyping and testing.
  - `open-telemetry/context` provides an implementation of the
    [context mechanism](https://opentelemetry.io/docs/specs/otel/context/)
    outlined in the OpenTelemetry specification. In OpenTelemetry, the `Context`
    is a special object used for carrying correlation identifiers (such as trace
    ID and span ID) across service calls and process boundaries for all of your
    observability signals (i.e., traces, metrics, and logs).
  - `open-telemetry/sem-conv` provides a large number of public constants
    corresponding to the IDs and known values tracked by the OpenTelemetry
    attribute registry (the attribute registry is part of the
    [OpenTelemetry Semantic Conventions](https://betterstack.com/community/guides/observability/opentelemetry-semantic-conventions/)
    specification). As a best practice, you should use these constants in your
    code whenever possible to ensure consistent naming for the pieces of
    telemetry flowing through your PHP applications.
- The `open-telemetry/exporter-otlp` provides an implementation that, broadly
  speaking, accumulates the signals generated in your application and sends them
  over the network to an OTLP collection backend (such as the OpenTelemetry
  Collector) via either HTTP or gRPC.

Without a doubt, the de facto standard logging library in the PHP world is
[Monolog](https://github.com/Seldaek/monolog), and OpenTelemetry can integrate
nicely with it through the
[open-telemetry/opentelemetry-logger-monolog](https://packagist.org/packages/open-telemetry/opentelemetry-logger-monolog)
package.

Let's quickly recap how Monolog works. In Monolog, a `Logger` (the main object
that you invoke in your PHP code to write logs) uses handlers and processors to
fulfill its duties. Whenever you pass a new entry to the `Logger`, it constructs
a new `LogRecord` object and engages the available processors (if any) to enrich
that record with additional pieces of contextual information (e.g., HTTP request
data, IP address information, process ID, etc.).

The `Logger` then cycles through its available handlers and each one decides on
a destination that the `LogRecord` should be sent to (e.g., a local file, a
database system, an email server, etc.). In this process, the handler may
optionally utilize a specific formatter to convert the raw record into a more
structured format (such as JSON or Syslog) before routing it to its final
destination.

This is summarized in the sequence diagram below:

![Monolog request flow](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2704a015-4135-4460-12ba-c62804ab9d00/lg1x =1021x387)

If you're new to Monolog and don't understand it well enough, you may want to go
through our guide, [How to Get Started with Monolog Logging in
PHP](https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/) to get familiar with the main concepts.

Now that you have a general idea of how Monolog works, it's time to see how the
`open-telemetry/opentelemetry-logger-monolog` package fits the overall picture.
The `opentelemetry-logger-monolog` package defines a custom Monolog handler.
That handler takes in Monolog `LogRecord` objects and converts them to
OpenTelemetry `LogRecord` objects (OpenTelemetry `LogRecord` conforms to the
[Logs Bridge API](https://opentelemetry.io/docs/specs/otel/logs/bridge-api/)
specification and differs from a Monolog `LogRecord`).

The handler then routes the converted objects to a special `Logger` provided to
your application by the OpenTelemetry SDK. This is not a Monolog `Logger` but an
OpenTelemetry `Logger` that provides an integration point with the broader
OpenTelemetry instrumentation. From there on, OpenTelemetry instrumentation
takes over, and the `LogRecord` object is sent to the configured destination
(the OpenTelemetry Collector) through the OTLP Exporter.

This is summarized in the sequence diagram below:

![OpenTelemetry Logger request flow](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/10148ab5-f905-409d-20ad-e9b567554e00/lg1x =1299x408)

Another way to view this is that the `opentelemetry-logger-monolog` handler acts
as a bridge between Monolog and OpenTelemetry. Now that you know what it does,
you can go ahead and add it to the `notification-engine` application using the
following command:

```command
composer require open-telemetry/opentelemetry-logger-monolog
```

To ensure that all platform requirements are satisfied, you may prefer to
execute the `composer require` command inside a Docker container running the
`notification-engine` image created earlier by Docker Compose. You only have to
mount the local application folder to the container to ensure that the
respective changes to the `composer.json` and `compose.lock` files will persist,
and set the user ID appropriately to avoid permission issues. You can do that
with the following command:

```command
docker run -it --rm -u $(id -u):$(id -g) -v ./notification-engine:/app notification-engine:0.1.0 composer require open-telemetry/opentelemetry-logger-monolog
```

You can now open up the main `index.php` file and construct a new
`\Monolog\Logger` to inject into your `Application`:

```php
[label ./notification-engine/index.php]
<?php

require __DIR__ . '/vendor/autoload.php';

\Demo\Project\Instrumentation\Tracing::register();

$sqsClient = new Aws\Sqs\SqsClient(['http' => ['connect_timeout' => 1]]);
$httpClient = new \GuzzleHttp\Client(['connect_timeout' => 1]);
$httpFactory = new \GuzzleHttp\Psr7\HttpFactory();

[highlight]
$handler = new \OpenTelemetry\Contrib\Logs\Monolog\Handler(
    \OpenTelemetry\API\Globals::loggerProvider(),
    \Monolog\Level::Info,
);
$logger = new \Monolog\Logger('notification-engine', [$handler]);
[/highlight]

$app = new Demo\Project\Application(
    $sqsClient,
    $httpClient,
    $httpFactory,
[highlight]
    $logger,
[/highlight]
);
$app->registerSmtpServer('mailgun');
$app->registerSmtpServer('postmark');

$app->run();
```

This also requires adjusting the `Application` constructor a little bit to take
in the new argument:

```php
[label ./notification-engine/src/Application.php]
<?php

namespace Demo\Project;

use Aws\Sqs\SqsClient;
. . .
[highlight]
use Psr\Log\LoggerInterface;
[/highlight]
use Throwable;

class Application
{
    /** @var DemoSmtpMailer[] */
    private array $smtpServers;

    public function __construct(
        private readonly SqsClient $sqsClient,
        private readonly ClientInterface $httpClient,
        private readonly RequestFactoryInterface $httpFactory,
[highlight]
        private readonly LoggerInterface $logger,
[/highlight]
    ) {}
. . .
```

With that, you're ready to start emitting logs from within the
`notification-engine`.

Add the following lines to the very beginning of the `run()` and
`processMessage()` methods in the `Application` class:

```php
[label ./notification-engine/src/Application.php]
. . .
class Application
{
. . .
    public function run()
    {
[highlight]
        $this->logger->info('running notification engine');
[/highlight]
. . .
    }
. . .
    private function processMessage(array $message, int $startTime): void
    {
[highlight]
        $this->logger->info('processing message from SQS queue');
[/highlight]
. . .
    }
}
```

In the next section, you'll learn precisely what the OpenTelemetry
instrumentation does internally to emit these log messages.

## Understanding the OpenTelemetry SDK

Take another good look at the way `$handler` is being constructed in
`index.php`:

```php
[label ./notification-engine/index.php]
. . .
$handler = new \OpenTelemetry\Contrib\Logs\Monolog\Handler(
[highlight]
    \OpenTelemetry\API\Globals::loggerProvider(),
[/highlight]
    \Monolog\Level::Info,
);
. . .
```

What the `\OpenTelemetry\API\Globals::loggerProvider()` call does is crucial to
understanding how the handler and related OpenTelemetry instrumentation work
internally.

When you install the `open-telemetry/sdk` package, it utilizes the
[file autoloading mechanism](https://getcomposer.org/doc/04-schema.md#files)
provided by Composer to register a special `SdkAutoloader`. The `SdkAutoloader`
is called at the beginning of each PHP request and is responsible for
bootstrapping the instrumentation provided by the OpenTelemetry SDK. This
includes setting up the main `Context` and initializing the global
`TracerProvider`, `MeterProvider`, and `LoggerProvider` factories. These
factories can be used for constructing new `Tracer`, `Meter`, and `Logger`
objects as needed.

The `\OpenTelemetry\API\Globals::loggerProvider()` call injects the global
`LoggerProvider` factory into the OpenTelemetry Monolog handler. This factory
enables the handler to create and reuse an OpenTelemetry `Logger` object, which
serves as the conduit for passing `LogRecords`.

The `SdkAutoLoader`, however, only does all this if the environment variable
`OTEL_PHP_AUTOLOAD_ENABLED` is explicitly defined and set to `true`. This is
already done for the `notification-engine` through the provided `Dockerfile`:

```yaml
[label Dockerfile]
FROM composer:2.7.2 AS composer
FROM php:8.3.6-cli-alpine3.19

# Copy `composer` binary to main image.
COPY --from=composer /usr/bin/composer /usr/bin/composer

# Install OpenTelemetry and Protobuf extensions.
RUN apk update \
    && apk add --virtual .build_deps $PHPIZE_DEPS \
    && pecl install opentelemetry-1.0.3 \
    && pecl install protobuf-4.26.1 \
    && docker-php-ext-enable opentelemetry protobuf \
    && apk del --no-network .build_deps \
    && rm -rf /tmp/pear ~/.pearrc

# Copy application source code to main image.
COPY --chown=www-data:www-data . /app

[highlight]
# Define OpenTelemetry environment variables.
ENV OTEL_PHP_AUTOLOAD_ENABLED=true
ENV OTEL_EXPORTER_OTLP_ENDPOINT=http://collector:4318
ENV OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
ENV OTEL_PROPAGATORS=baggage,tracecontext
ENV OTEL_TRACES_EXPORTER=otlp
ENV OTEL_METRICS_EXPORTER=none
ENV OTEL_LOGS_EXPORTER=none
[/highlight]

# Install Composer packages and run the application.
USER www-data
WORKDIR /app
RUN composer install --no-dev
CMD ["-f", "index.php"]
```

Among the many things the `Dockerfile` does is establish a sensible set of
defaults for the OpenTelemetry environment variables. Besides
`OTEL_PHP_AUTOLOAD_ENABLED`, it sets a few more:

- `OTEL_EXPORTER_OTLP_ENDPOINT` specifies the destination that telemetry data
  from the application should be sent to. It defaults to `http://collector:4318`
  which corresponds to the `collector` service defined in the provided
  `compose.yaml`.
- `OTEL_EXPORTER_OTLP_PROTOCOL` specifies the exact protocol to be used for
  sending telemetry data to the collector endpoint. It defaults to
  `http/protobuf`, which means that raw telemetry data will be serialized to a
  binary protobuf representation and then sent to the collector over HTTP (other
  possible values are `grpc`, `http/json`, and `http/ndjson`).
- `OTEL_PROPAGATORS` specifies the context propagation mechanisms available for
  processing telemetry data. It defaults to `baggage,tracecontext`, which means
  that the headers described by the [Baggage](https://www.w3.org/TR/baggage/)
  specification and the [Trace Context](https://www.w3.org/TR/trace-context/)
  specification (namely: `baggage`, `traceparent`, and `tracestate`) can be used
  for establishing and retaining relationships between telemetry data emitted
  from different microservices (more on that later).
- `OTEL_TRACES_EXPORTER` specifies the default output mechanism for exporting
  trace data. It defaults to `otlp`, which means that the OTLP exporter
  (`open-telemetry/exporter-otlp`) will be used.
- `OTEL_METRICS_EXPORTER` specifies the default output mechanism for exporting
  metric data. It defaults to `none`, which means that metric data isn't going
  to be exported anywhere.
- `OTEL_LOGS_EXPORTER` specifies the default output mechanism for exporting log
  data. It defaults to `none`, which means that log data isn't going to be
  exported anywhere.

As all three services (`cms`, `notification-engine`, and `producer`) share the
same `Dockerfile`, the `notification-engine` will get the value `none` for
`OTEL_LOGS_EXPORTER`, which will prevent it from emitting logs. You should
therefore go ahead and modify its service definition in the provided
`compose.yaml` file as follows:

```yaml
[label compose.yaml]
. . .
services:
  notification-engine:
    image: notification-engine:0.1.0
    build:
      context: notification-engine
      dockerfile: ../Dockerfile
    environment:
      <<: *aws-settings
      CMS_API_URL: http://cms
      OTEL_SERVICE_NAME: notification-engine
[highlight]
      OTEL_LOGS_EXPORTER: otlp
      OTEL_LOGS_PROCESSOR: simple
[/highlight]
      SQS_RECEIVE_INTERVAL: 3
. . .
```

By setting the `OTEL_LOGS_EXPORTER` to `otlp`, you're instructing the
`SdkAutoloader` to create a global `LoggerProvider` that constructs `Logger`
objects configured to pass `LogRecords` to the embedded OTLP exporter which
sends these `LogRecords` to a collector over HTTP.

On the other hand, the `OTEL_LOGS_PROCESSOR` variable specifies a processor that
the OpenTelemetry `Logger` should use when handling `LogRecords`. Don't confuse
this with a Monolog log processor. Here, the processor's job is to group the
data so it can be processed more efficiently, not to enrich it.

The diagram below summarizes this:

![LogRecord flow diagram](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fa1b8e43-cf7c-49b3-3a07-e47f51e4cf00/md2x =758x283)

The `simple` log processor passes every `LogRecord` created with a call to
`$this->logger` directly to the configured OTLP exporter. A more common value
here is `batch`. The `batch` log processor puts `LogRecord` objects into a
buffer and sends them to the exporter in bulk at regular intervals or when the
buffer exceeds a certain size.

This is usually the more desired option in a production environment, as it leads
to a bit more balanced and predictable load on the collector backend. However,
records won't appear instantly in the logging backend, which is something you'd
probably want to avoid in development as it may slow down your debugging
efforts. That's what makes `simple` a more suitable choice for this tutorial.

You may have also noticed the `OTEL_SERVICE_NAME` environment variable. It
specifies a unique name for your service to act as an identifier in logs and
traces. Its value is always included in every piece of telemetry data leaving
the service. All three services defined in the `compose.yaml` file (`cms`,
`producer`, and `notification-engine`) have an established `OTEL_SERVICE_NAME`.

To sum this up, at the start of each PHP request, the `SdkAutloader` utilizes
the provided `OTEL_*` environment variables to configure the OpenTelemetry
instrumentation for your application according to your preferences. With logging
in particular, it configures the global `LoggerProvider`, which is responsible
for creating (and configuring) `Logger` objects. The OpenTelemetry Monolog
handler relies on this global `LoggerProvider` to construct its `Logger` object,
which sends `LogRecords` to their final destination.

## Understanding the OpenTelemetry Collector

At this point, the `notification-engine` contains all the instrumentation
necessary for sending log records to the OpenTelemetry Collector. However, the
precise role of the collector remains somewhat unclear.

It's important to understand that the OpenTelemetry Collector is not an
observability backend. It's rather a sophisticated data processor capable of
receiving all kinds of observability signals from external applications and
routing them to appropriate observability backends for long-term storage,
analysis, and visualization.

A collector consists of receivers, processors, and exporters linked together by
pipelines.

- Receivers determine how telemetry data may enter the collector. They can be
  push-based (i.e., external applications pushing data by connecting to the
  collector) or pull-based (i.e., the collector pulling data by connecting to
  external applications).
- Processors can optionally batch, filter, sanitize, and transform incoming
  telemetry data before it's passed to an exporter.
- Exporters are responsible for sending processed data to external observability
  backends for long-term storage and analysis.
- Pipelines act as the glue between receivers, processors, and exporters. They
  orchestrate the flow of telemetry data from receivers through processors to
  exporters.

The easiest way to understand all of this is to go through the `otelcol.yaml`
file, which provides configuration to the local OpenTelemetry Collector:

```yaml
[label otelcol.yaml]
receivers:
  otlp:
    protocols:
      http:
processors:
  batch:
exporters:
  otlp/jaeger:
    endpoint: jaeger:4317
    tls:
      insecure: true
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/jaeger]
```

Let's go through this file, section by section, starting with the `receivers`:

```yaml
receivers:
  otlp:
    protocols:
      http:
```

This fragment declares a single push-based receiver of type `otlp`. This means
that the receiver will expect incoming payloads formatted in accordance with the
[OTLP format](https://opentelemetry.io/docs/specs/otlp/) specification. The
`protocols` setting specifies that the payloads should be sent over HTTP. Thus,
when the OpenTelemetry Collector starts up, it will launch a new HTTP server
listening for incoming OTLP-encoded requests on port `4317`.

The `processors` come next:

```yaml
processors:
  batch:
```

Processors are entirely optional. They serve as an intermediary between the
receivers and the exporters and allow you to perform operations on the received
data before a pipeline sends it to an exporter. Here, the fragment configures a
`batch` processor, whose purpose is to group collected data into batches in
order to reduce the number of individual network requests needed for
transmitting that data to an external backend (thus improving the overall
network performance).

And then come the `exporters`:

```yaml
exporters:
  otlp/jaeger:
    endpoint: jaeger:4317
    tls:
      insecure: true
```

This fragment declares a single exporter of type `otlp` named `jaeger` (the
labeling format `<type>/<name>` can be used not only for declaring `exporters`
but also for `receivers`, `processors`, and `pipelines`). Here, the name
`jaeger` carries no special meaning (you could have easily named it `otlp/foo`
with equal success) other than providing a reference to that specific exporter
in subsequent pipeline configurations.

The `endpoint` setting specifies `jaeger:4317` as the destination address, which
points to the local Jaeger instance declared in the provided `compose.yaml`
file. Since the local Jaeger container exposes its default OTLP endpoint over an
insecure HTTP connection, the `insecure` option of the `tls` setting has to be
set to `true`. Otherwise, connections between the OpenTelemetry Collector and
Jaeger would fail due to TLS handshake errors.

Finally, you have the `pipelines` configuration:

```yaml
service:
  extensions: [health_check]
[highlight]
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/jaeger]
[/highlight]
```

The pipeline declared above is of type `traces` (which means it only works on
trace data), and it configures the OpenTelemetry Collector to pass all data
received through the `otlp` receiver for batching to the `batch` processor
before eventually sending it to Jaeger through the `otlp/jaeger` exporter.

As you can see, the configuration format is quite straightforward and flexible
enough to allow you to easily customize how data is received, processed, and
exported within the OpenTelemetry Collector with the help of pipeline
definitions. The following section will teach you how to create a pipeline for
receiving log data and exporting it to an external logging backend for
visualization.

## Configuring a logging backend

Now that you have a clear picture of how pipeline definitions work in the
OpenTelemetry Collector, the next step is to configure a logging backend for
storing and visualizing logs emitted from the `notification-engine` service.
This section will guide you through the process by using Better Stack as the
logging backend.

You'll have to set up a new log source on Better Stack first. Log into your
[Better Stack account](https://betterstack.com/users/sign-in) and navigate to
**Logs & Metrics** > **Sources**:

![Sources](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/22a528b5-60c5-46d3-48e7-ee67b06ace00/lg1x =958x362)

Click **Connect source**:

![Connect source](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c8abe941-401e-41de-678e-01d717c5a700/md1x =962x245)

Input a **Name** (e.g., **OpenTelemetry tutorial**) and specify
**OpenTelemetry** as the **Platform**. When you're ready, click **Create
source**:

![Create source](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8d55fd6a-94be-40a6-5605-39714d684700/md1x =957x745)

You'll be redirected to a new page confirming that the source was created. From
the **Basic Information** section displayed on that page, grab the value listed
under the **Source token** field and store it somewhere safe for later use.
You'll need this value in a moment when tweaking the OpenTelemetry Collector
configuration file (I have intentionally left the token unmasked on the
screenshot below, but please make sure to keep your token safe and don't share
it freely with others):

![Source token](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/71251d5d-3d14-44f0-22e0-268af596d100/lg2x =966x932)

Open up the `otelcol.yaml` file and apply the following changes:

```yaml
[label otelcol.yaml]
receivers:
  otlp:
    protocols:
      http:
processors:
[highlight]
  attributes/betterstack:
    actions:
      - key: better_stack_source_token
        value: <your_source_token>
        action: insert
[/highlight]
  batch:
exporters:
  otlp/jaeger:
    endpoint: jaeger:4317
    tls:
      insecure: true
[highlight]
  otlp/betterstack:
    endpoint: "https://in-otel.logs.betterstack.com:443"
[/highlight]
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/jaeger]
[highlight]
    logs/betterstack:
      receivers: [otlp]
      processors: [batch, attributes/betterstack]
      exporters: [otlp/betterstack]
[/highlight]
```

Once more, let's go through the changes, section by section.

You've added a new `processor` of type `attributes` named `betterstack`:

```yaml
attributes/betterstack:
  actions:
    - key: better_stack_source_token
      value: <your_source_token>
      action: insert
```

The attributes processor inserts a new attribute named
`better_stack_source_token` to each received log record and assigns it a value
of `<your_source_token>` (here, replace `<your_source_token>` with the actual
token that you copied earlier from the Better Stack UI, e.g., mine was
`cQp1jhkzNgqRYXF1RrGHUkd8`).

Moving on, you've added a new `exporter` of type `otlp`, also named
`betterstack`:

```yaml
otlp/betterstack:
  endpoint: "https://in-otel.logs.betterstack.com:443"
```

That exporter instructs the OpenTelemetry Collector that collected telemetry
data can be sent to an OTLP receiver endpoint available at
`https://in-otel.logs.betterstack.com:443`.

Lastly, you've added a new `pipeline` of type `logs`, also bearing the name
`betterstack`, that connects everything together:

```yaml
logs/betterstack:
  receivers: [otlp]
  processors: [batch, attributes/betterstack]
  exporters: [otlp/betterstack]
```

The `betterstack` pipeline takes all log records collected from the default
`otlp` receiver and sends them (sequentially) to the `batch` processor and then
to the `attributes/betterstack` processor. As a result, each log record receives
the `better_stack_source_token` attribute. The processed records are then sent
to the Better Stack OTLP endpoint through the `otlp/betterstack` exporter. As
each emitted record contains a `better_stack_source_token` attribute, the OTLP
receiver knows how to properly route the record to the correct log source on
Better Stack ("OpenTelemetry tutorial") so you can view it accordingly.

Now that everything is configured, restart all services to emit your first log
records:

```command
docker compose up -d --build
```

Go back to the Better Stack web UI and click on **Live tail**:

![Live tail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7ddbddca-f104-426c-f3f4-fb73944b5600/md1x =960x291)

After a minute or so, you'll see the first set of log messages appearing in the
Better Stack UI:

![Log records](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a36365a6-d581-46a3-8f82-bbe78bb18600/lg2x =960x294)

The integration works! But to understand the real advantage of logs, it's best
to go through a few practical examples showing you how logging can be used to
troubleshoot issues affecting your distributed system. You'll explore this in
the next section.

## Using logs for troubleshooting

In this section, you'll see that logging can be helpful in many error scenarios,
where trace data may not be sufficient for fully identifying particular issues.
You'll go through several practical examples to guide you through that
realization:

- Detecting breaking changes in the SQS event schema.
- Detecting response errors in the CMS service.
- Detecting mail service connectivity errors.

![Error scenarios](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ff59d908-9229-42a7-e59c-e10f3cc73000/lg2x =1137x397)

Let's see these in action.

### Detecting breaking changes in the SQS event schema

Before you begin, please stop the `notification-engine` and `producer` services
as this example will require their modification:

```command
docker compose down -t 0 producer notification-engine
```

Consider a scenario where the maintainers of the `producer` service
unintentionally introduced a breaking change to the event schema without
realizing or giving you a prior notice. For instance, they renamed the `name`
field to `type`. You can simulate this by modifying the `toArray` method of the
`Event` abstract class in the `producer` service as follows:

```php
[label ./producer/src/Event/Event.php]
<?php

namespace Demo\Project\Event;

use Faker\Generator;

abstract class Event
{
. . .
    public function toArray(): array
    {
        return [
            'id' => $this->id,
[highlight]
            'type' => $this->name,
[/highlight]
            'context' => $this->getContext(),
        ];
    }
. . .
}
```

Rebuild and recreate the `producer` and `notification-engine` services:

```command
docker compose up -d --build producer notification-engine
```

If you open up Jaeger and find the traces for the `producer` service, you'll see
some odd results:

![producer traces](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2de3fc4d-e5eb-4309-8dff-49839c4ea300/lg1x =959x792)

Only the earliest trace includes information about the `notification-engine`
service, and there are only two spans recorded instead of the expected five.
Furthermore, any subsequent traces only include a single span from the
`producer` service and nothing more.

In this case, tracing properly shows you what's happening but not why. There's
an issue somewhere along the service chain, but it cannot be identified with
tracing alone.

There's not much information on Better Stack either:

![producer traces](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4db61b5e-65b3-4bda-2c1d-7f16ebeb6700/public =958x257)

Indeed, it appears that the `notification-engine` initially received a message
from the `producer`, but there's no indication of any other log records emitted
after that.

You may find one interesting correlation, though. Take a look at the trace ID of
the earliest trace recorded in Jaeger after recreating the services:

![Jaeger trace ID](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3dc9e8f9-239a-4ca7-529c-32bd6a77a700/md2x =962x379)

And compare it to what's reported on Better Stack:

![Better Stack trace ID](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/80268a9a-f7cc-4c91-f12d-3ef9209b4800/md1x =959x221)

The IDs are identical! Thanks to the OpenTelemetry SDK, the trace ID associated
with the initial message emitted from the `producer` (`eb57346`) has been
propagated to the `notification-engine` log record. This allows you to easily
correlate log records with distributed traces across all of your services, which
is one of the most significant benefits of using OpenTelemetry instrumentation
for logging throughout your applications rather than directly integrating them
with external logging backends.

As no further log records are being emitted from the `notification-engine`
service, it appears that something went wrong at runtime but was not properly
reported.

If you execute the following command:

```command
docker compose ps -a --format '{{.Status}}' notification-engine
```

You'll see that the `notification-engine` service has exited with a status code
of `1`:

```text
[output]
Exited (1) About a minute ago
```

It now makes sense why subsequent traces only report spans from the `producer`
service, and why no further log records are listed on Better Stack—there is
simply no `notification-engine` running.

Go ahead and examine the `notification-engine` container logs:

```command
docker compose logs notification-engine
```

The following error will be reported:

```text
[output]
notification-engine-1  |
notification-engine-1  | Warning: Undefined array key "name" in /app/src/Application.php on line 70
notification-engine-1  | Demo\Project\Helper\Str::kebab(): Argument #1 ($value) must be of type string, null given, called in /app/src/Application.php on line 70
```

Why was this error logged in the Docker container but not on Better Stack? The
key lies in the `run` method of `Application` class in the `notification-engine`
service. Its current implementation relies on the following error-handling
logic:

```php
[label ./notification-engine/src/Application.php]
. . .
class Application
{
. . .
    public function run()
    {
        $this->logger->info('running notification engine');
        while (true) {
            try {
                $this->processQueue();
            } catch (Throwable $e) {
[highlight]
                error_log($e->getMessage());
                exit(1);
[/highlight]
            }
        }
    }
. . .
}
```

By default, the `error_log` call sends the error message to the `STDERR` stream
of the container. You can, however, easily replace this with a call to
`$this->logger`, provide a clearer message to describe the event that you are
logging, and include the original exception for additional context:

```php
[label ./notification-engine/src/Application.php]
. . .
class Application
{
. . .
    public function run()
    {
        $this->logger->info('running notification engine');
        while (true) {
            try {
. . .
            } catch (Throwable $e) {
[highlight]
                $this->logger->alert('terminating notification engine', ['exception' => $e]);
[/highlight]
                exit(1);
            }
        }
    }
. . .
}
```

Restart the `notification-engine` to see how this changes the situation:

```command
docker compose up -d --build notification-engine
```

An `ALERT` message now appears on Better Stack:

![Better Stack alert log](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/211b341a-4581-42cf-ab27-68e6d0d46c00/md2x =962x407)

If you expand the record and delve into its `context`, you'll see the exact
exception that triggered the alert condition:

![log record exception context](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e2bbaed5-b96b-4493-780d-0e7874804900/public =960x707)

By using the recorded trace ID (in this case,
`b671a2f169245bd3500e063166d01fa0`), you can also easily locate the relevant
trace in Jaeger:

![locate Jaeger trace](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/80887766-9e8d-4930-6ef7-53173692e900/lg1x =960x595)

If that's hard to find visually, you can always use the search box:

![Jaeger trace search](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c66fffeb-ece0-42b6-363e-9b7f84d00600/public =959x428)

This provides a lot more info about the problem, and by going through the
recorded stack trace, you can easily narrow the issue down to the following line
in `Application.php`:

```php
$url = sprintf('%s/api/v1/templates/%s', getenv('CMS_API_URL'), Str::kebab($event['name']));
```

`$event['name']` is expected to be a `string`, but it appears to be `null`. To
confirm that this is the issue, you may add further details about the event
being processed to the log records emitted from the `processMessage` method as
follows:

```php
[label ./notification-engine/src/Application.php]
. . .
class Application
{
. . .
    private function processMessage(array $message, int $startTime): void
    {
[highlight]
        // decode raw message body to JSON
        $event = json_decode($message['Body'], true);
        $this->logger->info('processing message from SQS queue', ['event' => $event]);
[/highlight]

        // retrieve template from CMS
        $url = sprintf('%s/api/v1/templates/%s', getenv('CMS_API_URL'), Str::kebab($event['name']));
        $response = $this->httpClient->sendRequest(
            $this->httpFactory->createRequest('GET', $url)
        );
. . .
    }
```

Rerun the `notification-engine` service, and let's see what happens:

```command
docker compose up -d --build notification-engine
```

A new set of log messages appears on Better Stack:

![Better Stack log messages](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/baea6465-7eb6-441a-532a-ade7ed35ab00/orig =954x448)

When you look into the `context` of the newly recorded log message, it becomes
absolutely clear that the event contains a `type` field instead of a `name`
field, proving that the event schema has been broken and a fix needs to be
implemented:

![process message event context](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8b4ef767-858d-4894-0067-fc6e9a545300/lg2x =957x698)

You can use this information to either ask the maintainers of the `producer`
service to implement a fix or to adapt the `notification-engine` service
yourself to work with the new event format. Either way, none of the traces
showed you this data, so here logging complemented them to help you identify the
issue.

Before proceeding with the next example, go ahead and revert the changes that
you made the `producer` service:

```command
git restore producer
```

Additionally, stop all running services to clean up the event queue and erase
all traces recorded so far:

```command
docker compose down -t 0
```

Let's continue with the next example.

### Detecting response errors in the CMS service

This example will require modifying the `notification-engine` and the `cms`
services. Consider a scenario where the team maintaining the `cms` service
updates its API endpoints, and the old URI used for retrieving templates
(`/api/v1/templates/{key}`) is no longer available.

You can simulate this scenario by commenting out the template route in the
`index.php` file of the `cms` service:

```php
[label ./cms/public/index.php]
. . .
[highlight]
/*
[/highlight]
// Add routes
$app->get('/api/v1/templates/{key}', function (Request $request, Response $response, array $args) use ($eventToTemplateMap, $tracer) {
    $parent = Globals::propagator()->extract($request->getHeaders());
    $span = $tracer->spanBuilder('HTTP GET /api/v1/templates/{key}')->setSpanKind(SpanKind::KIND_SERVER)->setParent($parent)->startSpan();
    $key = $args['key'];
    if (isset($eventToTemplateMap[$key])) {
        $body = file_get_contents($eventToTemplateMap[$key]);
        $response->getBody()->write($body);
    } else {
        $response->withStatus(404);
        $span->setStatus(StatusCode::STATUS_ERROR, sprintf('Key "%s" not found', $key));
    }
    $span->end();

    return $response;
});
[highlight]
*/
[/highlight]
$app->run();
```

Restart all services to see what's going to happen:

```command
docker compose up -d --build
```

The earliest trace in Jaeger shows only four spans (instead of five) and no
errors. That's interesting. Go ahead and open this trace:

![Jaeger traces](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8e7959bd-4f65-414c-6a55-aa26cba29000/md2x =960x815)

It appears that `notification-engine` executed all of its steps successfully,
and an email notification was sent through the `postmark` service, yet no
interaction with the `cms` service has been recorded:

![Jaeger trace](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d722b6b8-97ff-47de-9517-9f8651b8c500/orig =1463x435)

This is strange, as the `notification-engine` is supposed to obtain the email
template body from the `cms` service before sending out any notifications, but
nothing unusual appears in Better Stack for this trace ID as well:

![Jaeger trace](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/902cc0b6-a1a6-4138-4acf-d503ffcffd00/md1x =966x344)

Expand the log record and examine which customer the notification was addressed
to by digging into the event context:

![email address](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f7820c09-4125-493a-93f6-297a2b347800/public =955x548)

The reported recipient appears to be `taylor90@hotmail.com`, and the related
trace indicates that the notification was sent through the `postmark` service.
You can use the web UI of the postmark service (`localhost:28025`) to check what
the user received exactly.

Navigate to `localhost:28025`, input the email address into the presented search
bar, and hit **Enter** to find the result:

![email search](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d893a60c-8f99-4ae2-fc11-e925bb2edd00/md1x =958x211)

Once you open the matching message, a disaster strikes: instead of receiving a
properly formatted email message, the customer got a printout of the Slim
framework 404 page:

![email message body](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/20f0d4be-7974-43a9-f375-1fde42afcc00/public =960x465)

This reveals two issues:

- The `cms` service tracing instrumentation doesn't seem to capture spans for
  routes that don't exist. This is a problem that the team behind the `cms`
  service should address, yet it affects the data that you see in your
  distributed tracing backend and prevents the real issue from being detected
  more easily.
- The `notification-engine` service that you are responsible for is obviously
  not handling erroneous HTTP responses correctly, and there's no adequate
  logging and tracing instrumentation to provide sufficient details about the
  problem. While the tracing instrumentation could eventually be improved by
  parsing the HTTP response codes when recording the `sendRequest` spans (e.g.,
  marking them as errors when the response code is anything other than `200`),
  logging can provide an additional safety net by capturing detailed information
  about unsuccessful responses.

Stop the `notification-engine` container:

```command
docker compose down -t 0 notification-engine
```

Go ahead and make the following modifications to the `Application.php` file:

```php
[label ./notification-engine/src/Application.php]
. . .
class Application
{
. . .
    private function processMessage(array $message, int $startTime): void
    {
        $event = json_decode($message['Body'], true);
        $this->logger->info('processing message from SQS queue', ['event' => $event]);

        // retrieve template from CMS
        $url = sprintf('%s/api/v1/templates/%s', getenv('CMS_API_URL'), Str::kebab($event['name']));
        $response = $this->httpClient->sendRequest(
[highlight]
            $request = $this->httpFactory->createRequest('GET', $url)
[/highlight]
        );

[highlight]
        // log CMS service response errors.
        $statusCode = $response->getStatusCode();
        if ($statusCode !== 200) {
            $message = sprintf('Received %d response from CMS service', $statusCode);
            $this->logger->error($message, [
                'method' => $request->getMethod(),
                'url' => $request->getUri(),
            ]);
            return;
        }
[/highlight]
. . .
    }
}
```

Recreate the `notification-engine` container and let's see what's going to
happen:

```command
docker compose up -d --build notification-engine
```

This time the traces only show three spans instead of four, because a `return`
statement was added to prevent the `notification-engine` from sending emails
when the `cms` service returns a non-200 response:

![Jaeger traces](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/05f39de5-1f1f-4461-ac91-15ccbf5a3a00/lg2x =958x819)

Each request properly stops after the first HTTP GET call, indicating a
potential issue at that particular step:

![Jaeger trace](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2eb31dce-bf81-4132-955b-dd0de6c70100/lg2x =1500x406)

Thanks to the newly added `$this->logger->error()` call, there's now also
sufficient information on Better Stack to suggest that something might be wrong
with the `cms` service.

![Better Stack error log](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/544e6e29-115c-4e73-7c12-921c86e10100/public =957x333)

The log record `context` reports useful details about the HTTP request, which
you can use as additional clues for troubleshooting the issue:

![Better Stack error log context](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ed1827e7-f639-4cc0-15a8-741087b3aa00/lg2x =958x523)

This is an excellent example where log data complements trace data. The traces
show you that something wrong is happening, and the logs show you why it is
happening. By combining these two pieces of information, you can quickly
pinpoint the root cause of the problem and take appropriate action to resolve it
efficiently.

With that, it's time to explore one final example, but first, go ahead and
revert your changes to the `cms` service:

```command
git restore cms
```

Then stop all currently running services to clear all data and start fresh in
the next example:

```command
docker compose down -t 0
```

### Detecting mail service connectivity errors

Start all services once again:

```command
docker compose up -d --build
```

In this last example, consider that one of the two email providers you've been
using went down. For instance, you can simulate this by stopping the `mailgun`
container:

```command
docker compose down -t 0 mailgun
```

The tracing instrumentation in the `notification-engine` service is advanced
enough to highlight the error in the tracing backend.

![trace error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ebff5be1-f239-4969-5043-adee918f2100/lg1x =958x785)

If you explore the specific span, you'll see additional information indicating
that the `notification-engine` is unable to resolve the hostname of the
`mailgun` service:

![span error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e985354f-50d4-4861-7324-39269ab86200/md2x =1502x675)

Although helpful, what this information fails to convey is whether this error is
fatal or not (in other words, whether the `notification-engine` can recover from
it automatically or not). Thanks to the logging code you added in the previous
examples, the logs on Better Stack indicate that the `notification-engine`
encountered a critical error (`ALERT`) resulting in the abrupt termination of
the `notification-engine` service:

![Better Stack alert error message](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fb879d60-3d1f-4a51-bbcd-5fa4f86edb00/md2x =956x297)

This requires immediate attention! And because you're also including the
exception stack trace in the log record, it's easy to identify the root cause of
the issue and troubleshoot it efficiently:

![exception context](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2e0614df-fe2a-4646-e56f-ef3906a3e800/lg2x =959x682)

This is another example of log data complementing trace data to let you evaluate
the severity of a given problem and prioritize its resolution accordingly.

This wraps up the troubleshooting examples, and you can stop all running
services:

```command
docker compose down -t 0
```

## Understanding the OpenTelemetry PHP extension

One last thing to discuss before wrapping up this tutorial is the OpenTelemetry
PHP extension. Earlier, I mentioned that the OpenTelemetry extension is not
mandatory for using the OpenTelemetry SDK to set up logging instrumentation for
your application.

The main advantage of using the OpenTelemetry extension is to prevent
cross-cutting concerns from leaking into your core business logic. In other
words, the extension allows you to separate your observability code from your
core application code.

Internally, the OpenTelemetry extension uses the Zend Observer API introduced in
PHP 8.0 to intercept function calls, so it can hook onto methods and execute
arbitrary logic right before a method starts running and then again right before
the method is about to return. This allows for seamlessly integrating
observability features into your source code without cluttering it with logging
statements.

The OpenTelemetry extension exposes a global function called `hook` that can be
used for that purpose. As always, this is best illustrated with an example, so
consider a scenario where your main goal is to extract the following
`$this->logger` calls out of the main `run` method defined in the `Application`
class of the `notification-engine` service:

```php
[label ./notification-engine/src/Application.php]
<?php
. . .
class Application
{
. . .
    public function run()
    {
[highlight]
        $this->logger->info('running notification engine');
[/highlight]
        while (true) {
            try {
                $this->processQueue();
            } catch (Throwable $e) {
[highlight]
                $this->logger->alert('terminating notification engine', ['exception' => $e]);
[/highlight]
                exit(1);
            }
        }
    }
    }
. . .
}
```

Go ahead and remove the highlighted lines, ensuring there are no `$this->logger`
calls left in the `run` method.

Next, under the `./src/Instrumentation` folder of the `notification-engine`
service, create a new file named `Logging.php` and populate it with the
following contents:

```php
[label ./notification-engine/src/Instrumentation/Logging.php]
<?php

namespace Demo\Project\Instrumentation;

use Demo\Project\Application;
use Psr\Log\LoggerInterface;
use Throwable;
use function OpenTelemetry\Instrumentation\hook;

class Logging
{
    public static function register(LoggerInterface $logger)
    {
        hook(
            Application::class,
            'run',
            pre: static function (Application $app, array $params, string $class, string $function, ?string $filename, ?int $lineno) use ($logger) {
                $logger->info('running notification engine');
            },
        );

        hook(
            Application::class,
            'processQueue',
            post: static function (Application $app, array $params, $returnValue, ?Throwable $exception) use ($logger) {
                if ($exception) {
                    $logger->alert('terminating notification engine', ['exception' => $exception]);
                }
                return $returnValue;
            }
        );
    }
}
```

This file defines a new `Logging` class, which exposes a single public static
method named `register`. The `register` method makes two calls to the `hook`
function provided by the OpenTelemetry extension.

The first call attaches a `pre` callback to the `run` method in the
`Application` class:

```php
hook(
    Application::class,
    'run',
    pre: static function (Application $app, array $params, string $class, string $function, ?string $filename, ?int $lineno) use ($logger) {
        $logger->info('running notification engine');
    },
);
```

As a result, a `$logger->info('running notification engine');` call will always
precede the execution of the `run` method in the `Application` class.

The second call attaches a `post` callback to the `processQueue` method in the
`Application` class:

```php
hook(
    Application::class,
    'processQueue',
    post: static function (Application $app, array $params, $returnValue, ?Throwable $exception) use ($logger) {
        if ($exception) {
            $logger->alert('terminating notification engine', ['exception' => $exception]);
        }
        return $returnValue;
    }
);
```

As a result, a `$logger->alert('terminating notification engine')` call will
always precede the return of the `processQueue` method in the `Application`
class.

Logging and other observability statements can be separated from your main
application logic thanks to this mechanism. Activating the hooks is as easy as
invoking the `register` method from your `index.php` file:

```php
[label ./notification-engine/index.php]
. . .
$handler = new \OpenTelemetry\Contrib\Logs\Monolog\Handler(
    \OpenTelemetry\API\Globals::loggerProvider(),
    \Monolog\Level::Info,
);
$logger = new \Monolog\Logger('notification-engine', [$handler]);
[highlight]
\Demo\Project\Instrumentation\Logging::register($logger);
[/highlight]
. . .
```

Recreate and rebuild all services to verify that this works:

```command
docker compose up -d --build
```

Then go ahead and stop the `mailgun` service (like in the previous example) to
trigger a fatal error:

```command
docker compose down -t 0 mailgun
```

Navigate back to the Better Stack interface and check what's logged:

![Better Stack logs](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/63d29fe8-3fb1-4239-d136-794fc00ac200/md2x =958x346)

As you can see, everything works like before, with the only difference that the
two original logging statements were removed from the main `Application` class
and placed into a dedicated `Logging` class responsible for the centralization
of all logging-related concerns. That's how you can use the `hook` function
provided by the OpenTelemetry PHP extension to keep your code more clean and
organized.

## Final thoughts

You've covered a lot of ground with this tutorial, and you should now have a
solid idea of what OpenTelemetry is and how it can help you with logging in your
PHP applications.

To learn more about the OpenTelemetry project, consider visiting the
[official website](https://opentelemetry.io/) and exploring the
[documentation](https://opentelemetry.io/docs/). I found the
[PHP Language API & SDK section](https://opentelemetry.io/docs/languages/php/)
particularly useful when researching how OpenTelemetry could be integrated into
PHP applications.

For tracing in particular, the
[OpenTelemetry Registry](https://opentelemetry.io/ecosystem/registry/?language=php)
is a great place to find numerous auto-instrumentation libraries that cover many
of the popular PHP frameworks, libraries, and extensions, such as
[Laravel](https://laravel.com/),
[Guzzle](https://packagist.org/packages/guzzlehttp/guzzle),
[PDO](https://www.php.net/manual/en/intro.pdo.php), and many more. I personally
find the traces they generate a bit too generic, though, and prefer to exert
more control over my telemetry data by writing customized instrumentation code
and storing it in a separate `Instrumentation` package in my applications (this
is a bit opposite to what the official documentation suggests, so use that
approach with caution, and choose the method that yields the best results for
your specific use case).

If you want to learn more about configuring the OpenTelemetry Collector, I'd
suggest digging into the
[opentelemetry-collector](https://github.com/open-telemetry/opentelemetry-collector)
and
[opentelemetry-collector-contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib)
repositories on GitHub, and more specifically, their respective `receiver`,
`exporter`, and `processor` subfolders. They contain comprehensive documentation
and examples that can help you understand how to set up and customize the
collector according to your specific needs.

Finally, if you're interested in learning more about the internals of the
OpenTelemetry PHP extension (and know a little bit of C), I highly recommend
checking out the
[opentelemetry-php-instrumentation](https://github.com/open-telemetry/opentelemetry-php-instrumentation)
repository on GitHub, where its source code is located. It should give you a lot
of additional insights on how it works internally and integrates with the Zend
Observer API.

As always, remember to test your OpenTelemetry instrumentation thoroughly before
deploying your applications to production to ensure that the captured data is
accurate, useful, and easy to work with.

Thanks for reading, and until next time!
