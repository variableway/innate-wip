# Monitoring Linux with Prometheus and Node Exporter

Proactive monitoring allows you to identify and address resource bottlenecks,
errors, and unexpected load spikes before they impact your users.

This requires a monitoring system capable of collecting and analyzing metrics
from various sources, including servers, network devices, applications, and
containers.

[Prometheus](https://betterstack.com/community/guides/monitoring/prometheus/) is a popular open-source monitoring system whose core
is a time-series database for storing metrics. It is complemented by additional
components like [exporters](https://betterstack.com/community/guides/monitoring/prometheus-exporter/) for gathering data from various
sources, and the [Alertmanager](https://betterstack.com/community/guides/monitoring/prometheus-alertmanager/) for managing and
dispatching alerts.

This guide focuses on setting up Prometheus and
[Node Exporter](https://github.com/prometheus/node_exporter) on Linux servers to
monitor system-level metrics. Node Exporter is a lightweight agent that exposes
a wealth of hardware and kernel-related metrics for monitoring server health and
performance. For Windows environments, the analogous
[Windows Exporter](https://github.com/prometheus-community/windows_exporter)
serves a similar purpose.

By following the steps outlined in this guide, you'll gain the foundational
knowledge to effectively monitor your Linux-based infrastructure with Prometheus
and Node Exporter.

Let's get started!

[summary]

Side note: Turn incoming Prometheus metrics into a production ready dashboard

Better Stack makes it easy to instantly visualise CPU, memory, load, and network trends, so you can catch problems before users do.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="Creating dashboards in Better Stack" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Prerequisites

- Basic familiarity with [Prometheus monitoring](https://betterstack.com/community/guides/monitoring/prometheus/).
- [Docker](https://www.docker.com/) and [Docker
  Compose](https://betterstack.com/community/guides/scaling-docker/docker-compose-getting-started/) installed.

## Setting up Prometheus

The easiest way to set up Prometheus is through its
[official Docker image](https://hub.docker.com/r/prom/prometheus). Here's the
basic Docker Compose configuration you need to get started:

```yaml
[label docker-compose.yml]
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - prometheus_data:/prometheus
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.path=/prometheus
      - --web.console.libraries=/etc/prometheus/console_libraries
      - --web.console.templates=/etc/prometheus/consoles
      - --web.enable-lifecycle
    expose:
      - 9090
    ports:
      - 9090:9090
    networks:
      - host-monitoring

networks:
  host-monitoring:
    driver: bridge

volumes:
  prometheus_data:
```

Prometheus is set up to run on `http://localhost:9090` with its default
configuration. You can start the service with:

```command
docker compose up -d
```

It will launch accordingly:

```text
[output]
[+] Running 3/3
 ✔ Network prometheus-node-exporter_host-monitoring   Created    0.2s
 ✔ Volume "prometheus-node-exporter_prometheus_data"  Created    0.0s
 ✔ Container prometheus                               Created    0.1s
```

You can head over to `http://localhost:9090` in your browser to see the
Prometheus interface.

![Prometheus interface](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d4518823-be49-4511-6edb-dd6db0fe5200/lg2x
=1281x617)

By default, Prometheus is set up to collect its own metrics. You can confirm
this by typing `http://localhost:9090/target` in your browser address bar:

![Prometheus target](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/577e450a-9ae8-4664-b871-93dd34892d00/lg2x
=1281x617)

In the next step you will now set up the node exporter to collect host metrics
with a custom configuration file.

## Setting up Node Exporter

To set up Node Exporter, you can use its
[official Docker image](https://hub.docker.com/r/prom/node-exporter) or
[download a binary archive here](https://prometheus.io/download/#node_exporter).

Let's set it up with Docker Compose:

```yaml
[label docker-compose.yml]
services:
  . . .

[highlight]
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - --path.procfs=/host/proc
      - --path.rootfs=/rootfs
      - --path.sysfs=/host/sys
      - --collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)
    ports:
      - 9100:9100
    networks:
      - host-monitoring
[/highlight]

networks:
  host-monitoring:

volumes:
  prometheus_data:
```

This sets up a `node-exporter` service that listens on port `9100` (its default
port) and gathers its data from the host system.

The `volumes` section mounts the host's `/proc`, `/sys`, and `/` directories
into the container, which allows information about the host's system resources,
such as CPU usage, memory usage, and disk I/O.

The command section specifies the arguments to be passed to the node-exporter
binary. These arguments tell the `node-exporter` where to find the host's system
information so that it does not read the container's details instead.

You also need to set up a Prometheus configuration file so that it can scrape
the `node-exporter` metrics:

```yaml
[label prometheus.yml]
global:
  scrape_interval: 10s

scrape_configs:
  - job_name: node-exporter
    static_configs:
      - targets:
          - 'node-exporter:9100'
```

The address is specified as `node-exporter:9100`, which assumes that the Node
Exporter is running as a container named `node-exporter` in the same Docker
network and is listening on port 9100.

You'll need to modify the `prometheus` service to override the default
configuration with:

```yaml
[label docker-compose.yml]
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - prometheus_data:/prometheus
[highlight]
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
[/highlight]
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.path=/prometheus
      - --web.console.libraries=/etc/prometheus/console_libraries
      - --web.console.templates=/etc/prometheus/consoles
      - --web.enable-lifecycle
    ports:
      - 9090:9090
    networks:
      - host-monitoring

. . .
```

Once you're all set, you can recreate both services with:

```command
docker compose up -d --force-recreate
```

```text
[output]
[+] Running 2/2
 ✔ Container node-exporter  Started                              0.9s
 ✔ Container prometheus     Started                              0.9s
```

Return to the Prometheus' target page and you'll see that the `node-exporter`
service is now being scraped:

![Node exporter being scraped in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2d7fd4cb-7373-4312-cd82-eeaa29974700/md1x
=1281x496)

You can also visit the Node Exporter metrics page to view the raw data being
scraped in Prometheus:

```text
http://localhost:9100/metrics
```

![Node Exporter metrics page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/439d90ea-d1f7-4c89-a138-91e38bc5d000/orig
=1424x654)

## Configuring Node Exporter collectors

The Node Exporter exposes a host of hardware and OS-level metrics through
various collectors. These are components within the exporter that gather
specific types of metrics about the system.

Some of the collectors built into the Node Exporter include:

- `cpu`: Gathers metrics about CPU usage, such as idle time, user time, system
  time, and interrupts.
- `meminfo`: Collects information about memory usage, including total memory,
  free memory, and used memory.
- `diskstats`: Exposes disk I/O operations.
- `filesystem`: Provides data on filesystem usage, such as available space and
  inodes.
- `time`: Reports system time information.
- `processes`: Gathers information about running processes, such as their number
  and states.

There are over 70 collectors in Node exporter. You can find a complete list in
the
[Node Exporter documentation](https://github.com/prometheus/node_exporter#collectors)
along with their descriptions and supported operating systems.

The majority of the available exporters are
[enabled by default](https://github.com/prometheus/node_exporter#enabled-by-default),
but
[some are disabled](https://github.com/prometheus/node_exporter#disabled-by-default)
due to high cardinality or significant resource demands on the host.

You can enable a collector by providing a `--collector.<name>` flag, and you can
disable one by using `--no-collector.<name>` instead.

If you'd like to disable all the default collectors and only enable specific
ones, you can combine the flags below:

```text
--collector.disable-defaults --collector.<name> . . .
```

For example, to monitor overall process metrics, you must enable the `processes`
collector with `--collector.processes` which aggregates them from `/proc`:

```yaml
[label docker-compose.yml]
. . .
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - --path.procfs=/host/proc
      - --path.rootfs=/rootfs
      - --path.sysfs=/host/sys
      - --collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)
[highlight]
      - --collector.processes
[/highlight]
    ports:
      - 9100:9100
    networks:
      - host-monitoring
```

Once you recreate the services, you'll start seeing the metrics with the
`node_processes` prefix such as `node_processes_state`, `node_processes_pid`,
and others.

![Node processes metrics](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/baad6d37-d5b3-49f8-5864-8a30e8b2d100/lg2x
=1424x666)

A few collectors also can be configured to include or exclude certain patterns
using dedicated flags. You'll notice the following flag in your Docker Compose
configuration:

```text
--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)
```

This configures the `filesystem` collector to exclude specific mount points from
its metrics collection including `/sys`, `/proc`, `/dev`, `/host`, and `/etc`.

It's necessary to specify this when running Node Exporter in a containerized
environment to prevent the collection of metrics about the container's file
system.

Let's look at some of the most common Node exporter metrics you need to know
about.

## Exploring common Node Exporter metrics

While the Node Exporter provides a wide array of metrics, some are more commonly
used than others for monitoring system health and performance.

Here are some of the most common ones:

| **Metric Name**                       | **Type** | **Description**                                                                     |
| ------------------------------------- | -------- | ----------------------------------------------------------------------------------- |
| `node_cpu_seconds_total`              | Counter  | Total CPU time spent in different modes (`user`, `system`, `idle`, `iowait`, etc.). |
| `node_memory_MemTotal_bytes`          | Gauge    | Total amount of physical memory in bytes.                                           |
| `node_memory_MemFree_bytes`           | Gauge    | Amount of unused memory in bytes.                                                   |
| `node_memory_Buffers_bytes`           | Gauge    | Amount of memory used as buffers for I/O operations.                                |
| `node_memory_Cached_bytes`            | Gauge    | Amount of memory used for caching data.                                             |
| `node_filesystem_avail_bytes`         | Gauge    | Amount of free space available to non-root users on a filesystem in bytes.          |
| `node_filesystem_size_bytes`          | Gauge    | The total filesystem size in bytes.                                                 |
| `node_filesystem_free_bytes`          | Gauge    | The free space on a filesystem in bytes.                                            |
| `node_disk_read_bytes_total`          | Counter  | Number of bytes read from a disk.                                                   |
| `node_disk_written_bytes_total`       | Counter  | Number of bytes written to a disk.                                                  |
| `node_disk_reads_completed_total`     | Counter  | Total reads for a partition.                                                        |
| `node_disk_writes_completed_total`    | Counter  | Total writes for a partition.                                                       |
| `node_network_receive_bytes_total`    | Counter  | Bytes received on a network interface.                                              |
| `node_network_transmit_bytes_total`   | Counter  | Bytes transmitted on a network interface.                                           |
| `node_network_receive_packets_total`  | Counter  | Packets in received traffic.                                                        |
| `node_network_transmit_packets_total` | Counter  | Packets in sent traffic.                                                            |
| `node_network_receive_drop_total`     | Counter  | Packets dropped while receiving on a network interface.                             |
| `node_network_transmit_drop_total`    | Counter  | Packets dropped while transmitting on a network interface.                          |

As you can see, the Node exporter exposes a wide range of system metrics out of
the box. However, there are scenarios where you might need to expose custom
metrics specific to your host such as RAID controller statistics, information
about installed packages, or any other specialized metrics that are critical to
your monitoring needs.

Let's talk about that next.

[ad-uptime]

## Exposing custom host metrics

To expose custom metrics, you can leverage the `textfile` collector, which is
enabled by default in Node Exporter. This collector allows you to include custom
metrics by reading them from a set of text files that you can generate as
needed.

This approach is particularly useful for gathering data from sources that Node
Exporter cannot directly access.

The text files used must:

- Follow the same text-based format that Prometheus uses.
- Have a `.prom` file extension.

When Prometheus scrapes the Node Exporter, it includes all the metrics from
these files alongside the default metrics.

You can create these text files using any program or script based on the
specific data you want to collect. To ensure accuracy and consistency during
Prometheus scrapes, the file generation process must be **atomic**.

This means you should write the data to a temporary file first and then move it
to the target directory. This avoids scenarios where Prometheus reads partial or
incomplete data during a scrape.

To set this up, create a new directory somewhere on your filesystem and
configure Node Exporter to read `.prom` files from this directory as follows:

```command
mkdir textfiles
```

```yaml
[label docker-compose.yml]
. . .
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
      [highlight]
      - ./textfiles:/textfiles
      [/highlight]
    command:
      - --path.procfs=/host/proc
      - --path.rootfs=/rootfs
      - --path.sysfs=/host/sys
      - --collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)
      - --collector.processes
      - --collector.systemd
      [highlight]
      - --collector.textfile.directory=./textfiles
      [/highlight]
    ports:
      - 9100:9100
    networks:
      - host-monitoring
```

With this configuration, Node Exporter will read all the `.prom` files in the
`textfiles` directory and include their metrics in its output. Ensure to restart
the services afterward:

```command
docker compose up -d --force-recreate
```

To test this out, you can create a simple bash script that captures the system
uptime in seconds:

```bash
[label uptime-script.sh]
#!/bin/bash

# Define the output directory and files
OUTPUT_DIR="textfiles"
TMP_METRIC_FILE="/tmp/uptime.prom"
METRIC_FILE="$OUTPUT_DIR/uptime.prom"

# Ensure the output directory exists
mkdir -p "$OUTPUT_DIR"

# Collect custom metrics
# Example: Capture system uptime in seconds
UPTIME_SECONDS=$(awk '{print $1}' /proc/uptime)

# Define custom metrics
METRIC_NAME="system_uptime_seconds"
METRIC_HELP="# HELP $METRIC_NAME The system uptime in seconds"
METRIC_TYPE="# TYPE $METRIC_NAME gauge"

# Write metrics to the temporary file
{
  echo "$METRIC_HELP"
  echo "$METRIC_TYPE"
  echo "$METRIC_NAME $UPTIME_SECONDS"
} > "$TMP_METRIC_FILE"

# Move the temporary file to the final directory atomically
mv "$TMP_METRIC_FILE" "$METRIC_FILE"

# Print success message
echo "Uptime written to $METRIC_FILE"
```

This script collects the system's uptime and writes it as a metric to a
specified text file (`textfiles/uptime.prom`).

After saving the file, make it executable with:

```command
chmod +x uptime-script.sh
```

Then execute it with:

```command
./uptime-script.sh
```

You will see:

```text
[output]
Uptime written to textfiles/uptime.prom
```

To confirm this, view the contents of the file with:

```command
cat textfiles/uptime.prom
```

You'll see the following output:

```text
[output]
# HELP system_uptime_seconds The system uptime in seconds
# TYPE system_uptime_seconds gauge
system_uptime_seconds 1346404.27
```

At this point, you'll start seeing this metric in the Node Exporter `/metrics`
page:

![Custom textfile metrics in Node Exporter](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d37f651e-b390-4bf3-caf6-fa83013d3f00/lg2x
=1424x450)

You can also query the custom metric in Prometheus:

![Querying textfile metric in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/43cb5d12-6c1d-4c8d-dda4-312756c30600/md1x
=1430x482)

You can then use a [cron job](https://betterstack.com/community/guides/linux/cron-jobs-getting-started/) or a Systemd timer to
run the script periodically so that your custom metric remains up to date:

```sh
* * * * * /path/to/script.sh # execute the script every minute
```

If you're creating such text files in a language with a functioning Prometheus
client library, you don't need to create the Prometheus text format manually.
You can use the `WriteToTextfile()` function (or similar) to generate the text
file in the correct format.

![Prometheus' WriteToTextFile() documentation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/86cb1c99-8c0f-4107-12cf-f1c497ecc400/lg1x
=1430x486)

You can also check out further examples of useful scripts that can be used with
the `textfile` collector in
[this GitHub repository](https://github.com/prometheus-community/node-exporter-textfile-collector-scripts).

## Exploring common Node Exporter alerting rules

Collecting and querying Node Exporter metrics is only half the battle. To gain
value from this data, you need to define alerting rules that help you detect
critical issues promptly.

This section will only list a few alerting rules for host monitoring with Node
Exporter. To set up these rules with Alertmanager, you'll need to [read our
comprehensive guide on the subject](https://betterstack.com/community/guides/monitoring/prometheus-alertmanager/).

### 1. High memory usage

This alert is derived from the difference between `node_memory_MemTotal_bytes`
and `node_memory_MemAvailable_bytes`. It alerts when memory usage exceeds 90% of
the total available memory for 2 minutes:

```yaml
[label alerts.yml]
  - alert: HostOutOfMemory
    expr: (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100 < 10) * on(instance) group_left (nodename) node_uname_info{nodename=~".+"}
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: Host out of memory (instance {{ $labels.instance }})
      description: "Node memory is filling up (< 10% left)\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
```

### 2. Low disk space

This alert is triggered when the available disk space on `/` is less than 10% of
the total capacity for 2 minutes:

```yaml
[label alerts.yml]
  - alert: HostOutOfDiskSpace
    expr: ((node_filesystem_avail_bytes * 100) / node_filesystem_size_bytes < 10 and ON (instance, device, mountpoint) node_filesystem_readonly == 0) * on(instance) group_left (nodename) node_uname_info{nodename=~".+"}
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: Host out of disk space (instance {{ $labels.instance }})
      description: "Disk is almost full (< 10% left)\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
```

### 3. Node is unreachable

To detect host downtime, you can use the following rule:

```yaml
[label alerts.yml]
  # Node Down Alert
  - alert: NodeDown
    expr: up{job="node-exporter"} == 0
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "Node down ({{ $labels.instance }})"
      description: "The node {{ $labels.instance }} is down for the last 2 minutes."
```

For more examples, see the
[host and hardware section](https://samber.github.io/awesome-prometheus-alerts/rules.html#host-and-hardware)
of the Awesome Prometheus alerts collection.

## Visualizing Node Exporter metrics in Better Stack

Once you're done setting up Node Exporter to collect host metrics, the next step is to visualise them in a dashboard so you can see how your hosts are performing at a glance.

While Grafana OSS is a common choice, [Better Stack](https://betterstack.com/telemetry) lets you query, visualise, and alert on Prometheus metrics without the complexities of self hosting.

There are two common ways to send Prometheus metrics to Better Stack.

The recommended approach for most setups is using the [OpenTelemetry Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/). It scrapes your Node Exporter metrics locally and forwards them to Better Stack, so you don’t need to expose your exporters publicly. If you want a quick walkthrough of this method, watch the video below:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/OY7sFneB43w" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


Alternatively, you can use the scraping approach, where Better Stack scrapes your exporter endpoint directly. If you prefer that setup, follow [our documentation](https://betterstack.com/docs/logs/prometheus-scrape/) or watch this short video:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/vxVwbugxnd4" title="Prometheus (scrape) | Better Stack" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


In the rest of this section, we’ll use the [Collector’s contrib distribution](https://hub.docker.com/r/otel/opentelemetry-collector-contrib) and the
[prometheus receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/receiver/prometheusreceiver/README.md) to ingest your Node Exporter metrics and forward them to Better Stack.

To explore this, we'll replace the `prometheus` service in Docker Compose with the Collector, then use the `prometheusreceiver` to ingest the Node Exporter metrics and forward them to Better Stack.


To get started, [sign up](https://telemetry.betterstack.com/users/sign-up) for a
free Better Stack account and navigate to the **Telemetry** dashboard. From the
menu on the left, select **Sources** and click on **Connect Source**:

![Sources in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4451af2d-1fd4-4d21-6ead-4245283bcc00/orig
=3840x693)

Specify `Node exporter` as the name and **OpenTelemetry** as the platform, then
scroll to the bottom of the page and click **Connect source**.

![Connect Source in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bfa6e88e-2a7a-4f8f-de0c-1b74292de400/md2x
=3169x1784)

The new source will be created immediately:

![Source created in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0f4fa29b-aa99-4a10-0ba9-625b78795400/public
=3388x1982)

You'll get a **Source token** that should be copied to your clipboard for the
next step.

Afterwards, open up your `docker-compose.yml` config file, and update it as
follows:

```yaml
[docker-compose.yml]
services:
  collector:
    container_name: collector
    image: otel/opentelemetry-collector-contrib:latest
    volumes:
      - ./otelcol.yaml:/etc/otelcol-contrib/config.yaml
    networks:
      - host-monitoring

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
      - ./textfiles:/textfiles:ro
    command:
      - --path.procfs=/host/proc
      - --path.rootfs=/rootfs
      - --path.sysfs=/host/sys
      - --collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)
      - --collector.processes
      - --collector.systemd
      - --collector.textfile.directory=/textfiles
    ports:
      - 9100:9100
    networks:
      - host-monitoring

networks:
  host-monitoring:

volumes:
  prometheus_data:
```

The `prometheus` service has been remove and replaced with the `collector`
service which will be configured using an `otelcol.yaml` config file:

```yaml
[label otelcol.yaml]
receivers:
  prometheus:
    config:
      scrape_configs:
        - job_name: node-exporter
          scrape_interval: 10s
          static_configs:
            - targets: ['node-exporter:9100']

processors:
  attributes/betterstack:
    actions:
      - key: better_stack_source_token
[highlight]
        value: <your_source_token>
[/highlight]
        action: insert
  batch:

exporters:
  prometheusremotewrite/betterstack:
    endpoint: https://in-otel.logs.betterstack.com/metrics

service:
  pipelines:
    metrics/betterstack:
      receivers: [prometheus]
      processors: [batch, attributes/betterstack]
      exporters: [prometheusremotewrite/betterstack]
```

Here, the `prometheus` receiver is configured to scrape the metrics of the
`node-exporter` service every 10 seconds. This receiver is fully compatible with
the `prometheus.yml` configuration, making it a drop-in replacement.

Once the metrics are collected, they're batch processed, and assigned a
`better_stack_source_token` attribute, before being sent to the `endpoint`
specified in the `prometheusremotewrite/betterstack` exporter.

Once configured, you can restart your Docker Compose services with the
`--remove-orphans` flag to remove the orphaned `prometheus` service that is no
longer needed:

```command
docker compose up -d --force-recreate --remove-orphans
```

```text
[output]
[+] Running 3/3
 ✔ Container prometheus     Removed                              0.3s
 ✔ Container collector      Started                              1.0s
 ✔ Container node-exporter  Started                              0.9s
```

After a few seconds, head over to the Better Stack dashboard and scroll to the
bottom of the page to confirm that the metrics are now being received:

![Metrics received in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/84d28280-fa31-4ca7-25b9-0d3e9d0dd700/md1x
=3388x1771)

You're now ready to create a dashboard for your Node Exporter metrics. If you prefer a quick walkthrough, you can follow along in the short video below:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="Creating dashboards in Better Stack" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


To get started, select **Dashboards** on the top-left menu, and click **Create
dashboard**.

![Create dashboard in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/56a9fe6b-6037-41e5-6eee-501823c17d00/md2x
=3388x586)

In the resulting dialog, select the **Host (Prometheus)** template, and click
**Add dashboard**

![Add dashboard in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/be1f1aaa-597e-400c-f65e-ac3e970be800/lg2x
=3388x1771)

On the resulting dashboard, ensure that your **Node exporter** source is
selected.

You'll then see a comprehensive overview of how your server is performing in
real-time.

![Better Stack Node Exporter Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/03f39ea9-5a00-4e86-afea-5144f5b10900/md1x
=6143x3226)

From here, you can organize the panels as you see fit, create new ones, and
configure alerting as needed. See
[our documentation for more details](https://betterstack.com/docs/logs/dashboards/getting-started/).

## Final thoughts

This concludes our comprehensive guide to setting up Prometheus and Node
Exporter on your Linux servers! You should have a solid foundation for
collecting and visualizing critical system metrics by now.

Remember that this is just the beginning of your Prometheus journey! There's a
vast ecosystem of exporters, integrations, and advanced configurations to
explore as your monitoring needs evolve.

**With Better Stack's Prometheus-compatible platform**, you can offload the
complexities of self-hosting and focus on extracting valuable insights from your
data.

Better Stack also offers a comprehensive suite of observability tools, including
log management, incident management, and uptime monitoring, in our all in one
centralized platform.

[Take advantage of our free tier](https://betterstack.com/pricing) to experience
the benefits firsthand and effortlessly scale your monitoring as your
infrastructure grows.

Thanks for reading, and happy monitoring!