# Logging in Docker: Strategies and Best Practices

[Docker provides a logging mechanism](https://betterstack.com/community/guides/logging/docker-logs/) that captures your
application's output and sends it to various destinations. Understanding how
this mechanism works is crucial for optimizing the performance and the
reliability of your logs.

In this guide, we'll delve into the world of Docker logging drivers, exploring
how they influence your container's behavior and how to choose the right driver
for your needs. We'll cover:

- How Docker captures and redirects container logs.
- How different drivers and configurations can impact your application's
  performance
- Ensuring your logs are captured consistently and without loss.
- Choosing the appropriate log delivery for your application logging.

By the end of this post, you'll be well equipped to make informed decisions
about your Docker logging strategy, and ensure both optimal performance and
reliable log capture.

Let's get started!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/Zlj39xXPu2k?si=qqw9apeHqZ87W5f2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Prerequisites

- Basic command-line skills.
- A recent version of [Docker](https://docs.docker.com/engine/install/)
  installed on your system.

[ad-logs]

## Logging to the standard output/error

The first step to understanding Docker logging is grasping the concept of
logging to the standard output and standard error streams.

When an application running inside a container writes messages to `stdout` or
`stderr`, Docker captures this output and makes it accessible through various
mechanisms. This forms the basis of Docker's logging system.

![Docker logging to stdout](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f6d0720d-75b7-4dca-93bd-6ee1e2226e00/lg1x
=2960x2104)

Since the `stdout` and `stderr` are universal concepts in operating systems,
this approach works seamlessly across different environments.

It's also a straightforward and standardized way for applications to generate
logs, regardless of their programming language or framework.

By default, Docker captures the data sent to these streams from your containers
and directs them to a logging driver, which determines where the logs are
ultimately stored and accessed.

If the containerized service is configured to write logs to a file instead of
the standard output or error streams, Docker's logging mechanisms won't work,
and the logs will be lost when the container is removed.

To prevent this, you should configure the application to send its logs to
`stdout` and `stderr`. If this isn't possible, you can create symbolic links
from the log files to `/dev/stdout` or `/dev/stderr`:

```Dockerfile
[label Dockerfile]
# forward logs to Docker's log collector
RUN ln -sf /dev/stdout <log_file_path> \
	&& ln -sf /dev/stderr <error_log_file_path>
```

This effectively tricks the application into writing to the standard streams,
allowing Docker to capture the logs.

## Choosing a logging driver

[Docker's logging driver](https://docs.docker.com/engine/logging/configure/) is
what dictates how the logs captured from the standard output and error streams
are processed and stored.

The default driver is
[json-file](https://docs.docker.com/config/containers/logging/json-file/) which
converts the container logs into JSON format and stores them in files on the
host machine.

You can check your Docker daemon's default logging driver with the command
below:

```command
docker info --format '{{.LoggingDriver}}'
```

You should see the following output:

```text
[output]
json-file
```

To see the logging driver configured for a specific container, use:

```command
docker inspect -f '{{.HostConfig.LogConfig.Type}}' <container>
```

```text
[output]
json-file
```

You can also find out the log file location for a container with:

```command
docker inspect -f '{{.LogPath}}' <container>
```

You will see a response that looks like this:

```text
[output]
/var/lib/docker/containers/<container-id>/<container-id>-json.log
```

Some of the
[other supported logging drivers](https://docs.docker.com/config/containers/logging/configure/#supported-logging-drivers)
are:

- `none`: Disables logging altogether. Useful when logs are not required or
  handled externally.
- `local`: The recommended driver for most use cases. It offers better
  performance and efficient disk usage compared to `json-file`.
- `syslog`: Sends logs to the [system's syslog
  daemon](https://betterstack.com/community/guides/logging/how-to-view-and-configure-linux-logs-on-ubuntu-20-04/), integrating
  with your system-wide logging infrastructure.
- `journald`: Uses the [journald logging
  system](https://betterstack.com/community/guides/logging/how-to-control-journald-with-journalctl/) on Linux distributions.
- `fluentd`, `splunk`, `awslogs`, `gcplogs`, etc: Forward logs to logging tools
  or cloud platforms for centralized management and analysis.

Although `json-file` is the current default for backward compatibility, `local`
**is generally recommended** due to its performance advantages and more
appropriate defaults, which include zero allocations for logging and [log
rotation](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/)/compression
enabled by default.

Let's look at how to configure it next.

## Configuring the default logging driver

You can set the default logging driver by creating or editing the Docker daemon
configuration file:

```command
sudo nano /etc/docker/daemon.json
```

Populate it with the following contents:

```json
[label /etc/docker/daemon.json]
{
  "log-driver": "local"
}
```

With the `local` driver, your container logs are automatically compressed and
rotated. By default, it retains the latest 100MB of logs per container, divided
into 5 compressed files of 20MB each.

If you'd like to modify the default options, you can specify the `log-opts`
property as follows:

```json
[label /etc/docker/daemon.json]
{
  "log-driver": "local",
  "log-opts": {
    "max-size": "20m",
    "max-file": "5",
    "compress": "true",
  }
}
```

Each property in the `log-opts` object must be a string (including boolean and
numeric values, as seen above). The supported options for the `local` driver
are:

- `max-size`: The maximum size of the log file before it is rotated (20MB). You
  may specify an integer plus the measuring unit (`k` for kilobytes, `m` for
  megabytes, and `g` for gigabytes).
- `max-file`: The maximum allowable number of log files for each container. When
  an excess file is created, the oldest one will be deleted. The `max-size`
  option must also be specified for this setting to take effect.
- `compress`: When set to `true`, the rotated log files will be compressed to
  save disk space.

After saving the file, you must restart the `docker` service to apply the
changes to newly created containers:

```command
sudo systemctl restart docker
```

To use a different logging driver or adjust logging options for a particular
container, simply include the `--log-driver` and `--log-opt` flags in your
`docker container create` or `docker run` command:

```command
docker run --log-driver syslog --log-opt syslog-address=tcp://192.168.1.10:514 -d <image>
```

Please see the
[documentation](https://docs.docker.com/engine/logging/configure/#supported-logging-drivers)
for the supported `log-opts` for each logging driver.

## Choosing a log delivery mode

The
[log delivery mode](https://docs.docker.com/config/containers/logging/configure/#configure-the-delivery-mode-of-log-messages-from-container-to-log-driver)
for a Docker container refers to how it prioritizes the delivery of incoming log
messages to the configured driver. The following two modes are supported:

### 1. Blocking mode (default)

In blocking mode, log messages are delivered synchronously. This means your
application waits for each log entry to be processed by the driver before
continuing execution.

This approach guarantees that each log message will be delivered to the driver,
but it can introduce performance overhead, especially with slow logging drivers.

Blocking mode is suitable for scenarios where log reliability is paramount and
the logging driver is fast (such as the `local` or `json-file` drivers that
write to the local disk).

### 2. Non-blocking mode

In non-blocking mode, log messages are processed asynchronously. Your
application continues running without waiting for log delivery. Messages are
buffered in memory and sent to the driver in the background.

This minimizes performance impact, even with high log volumes or slow drivers
but at the risk of losing log messages if the buffer overflows before the driver
can process them.

Non-blocking mode is ideal when application performance is critical and you're
using a remote logging driver that might experience latency.

### Configuring log delivery

You can configure the delivery mode in your Docker daemon configuration:

```json
[label /etc/docker/daemon.json]
{
  "log-driver": "syslog",
  "log-opts": {
    "mode": "non-blocking"
  }
}
```

Or when running a container:

```command
docker run --log-driver syslog --log-opt mode=non-blocking <image>
```

To improve reliability in non-blocking mode, you can increase the maximum buffer
size from its default 1 MB to a more suitable size through the `max-buffer-size`
property:

```json
[label /etc/docker/daemon.json]
{
  "log-driver": "syslog",
  "log-opts": {
    "mode": "non-blocking",
    [highlight]
    "max-buffer-size": "20m"
    [/highlight]
  }
}
```

This allows the buffer to hold more log messages before potentially overflowing,
giving the driver more time to process them.

## Centralizing your Docker logs

While Docker offers a variety of logging drivers and configurations, the `local`
driver in `blocking` mode often provides the best balance of performance and
reliability for most applications.

Writing logs to a local file is inherently fast, and blocking mode adds a layer
of reliability by ensuring that every log message is captured and safely stored
on disk. The `local` driver also provides control over log rotation and
compression, allowing you to fine-tune disk usage and log retention.

If your application generates a high volume of logs and performs disk-intensive
operations, you can also use the `local` driver in non-blocking mode to maintain
application performance by buffering logs in memory before writing them to disk.

[A log collector](https://betterstack.com/community/guides/logging/log-shippers-explained/) like [Vector](https://betterstack.com/community/guides/logging/vector-explained/) or the
[OpenTelemetry Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/) can then be employed to
stream the logs from the local files, apply any desired transformations, and
forward them to a centralized log management solution such as
[Better Stack](https://betterstack.com/telemetry).

![Better Stack live tail page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d4ee9c7d-df26-4725-ae07-a0f26dd63800/orig=6143x3226)

Deploying the log collector can be done in a **dedicated logging container**
that collects and processes logs from all other containers in your Docker
environment before forwarding them to a central location.

For more complex deployments, **a sidecar approach** pairs each application
container with a dedicated logging container. This allows for customized logging
strategies per application at the cost of increased resource consumption and
complexity.

## Final thoughts

Effectively managing Docker container logs is essential for maintaining
application health, troubleshooting issues, and gaining valuable insights into
your system's behavior.

By understanding the different logging drivers, configuring them appropriately,
and implementing best practices like centralization and log rotation, you can
ensure that your Docker logging strategy meets your needs.

Thanks for reading!
