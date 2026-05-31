# Creating Grafana Dashboards for Prometheus: A Beginner's Guide


[Prometheus](https://github.com/prometheus/prometheus) and
[Grafana](https://github.com/grafana/grafana) are two powerful open-source tools
that, when combined, form a robust solution for monitoring and visualizing the
health of your systems.

This tutorial provides a comprehensive guide to setting up Prometheus and
Grafana, integrating Node Exporter for metric collection, and crafting
insightful dashboards tailored to your specific needs.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/pGSkPutCKtQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

By the end of this tutorial, you'll have a fully functional monitoring stack,
complete with dynamic dashboards that adapt to your environment.

You'll also learn how to simplify queries with variables and leverage pre-built
dashboards to save time and enhance your monitoring capabilities.

Let's get started!

## Prerequisites

To follow through with this tutorial, you only need a recent version of
[Docker](https://docs.docker.com/engine/install/) installed on your machine.
It'll also be helpful to know the basics of [Prometheus monitoring](https://betterstack.com/community/guides/monitoring/prometheus/).

[summary]
### Get started with Better Stack dashboards

While Grafana requires setting up Prometheus as a data source and manually creating panels, [Better Stack](https://betterstack.com/infrastructure-monitoring) provides ready-to-use dashboards with OpenTelemetry-native monitoring.

[Start monitoring for free](https://betterstack.com/users/sign-up).

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]



## Setting up Prometheus and Node Exporter

Before you can start creating dashboards with Grafana, you'll need a source of
[metrics data](https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/). In this section, we'll set up
Prometheus and Node Exporter to collect system-level metrics on Unix systems
which will later be visualized in Grafana.

The easiest way to get started is by running both services using Docker Compose,
which simplifies running multi-container services on a single machine.

Here's the Docker Compose file in full:

```yml
[label compose.yaml]
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - 9090:9090

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
  default:
    name: prometheus-grafana
    driver: bridge

volumes:
  prometheus_data:
```

This file sets up the `prometheus` and `node-exporter` services to run on ports
9090 and 9100, respectively. The `prometheus` service requires a configuration
file, which you must place in the same directory as the Compose file:

```yml
[label prometheus.yml]
global:
  scrape_interval: 10s

scrape_configs:
  - job_name: node-exporter
    static_configs:
      - targets:
          - 'node-exporter:9100'
```

This configuration file instructs Prometheus to scrape metrics from the
`node-exporter` service running at port 9100 on the same Docker network.

The `node-exporter` is already configured to collect host metrics by binding to
the `/proc`, `/sys`, and `/` directories. This setup allows it to gather
detailed information about the host's system resources, including CPU usage,
memory consumption, and disk I/O, and expose them in the Prometheus' metrics
format.

To see the services in action, launch them by running the following command in
the Compose file's directory:

```command
docker compose up -d
```

Docker will download the `prometheus` and `node-exporter` images to your machine
if they are not already present, and the containers will start in the
background:

```text
[output]
. . .
[+] Running 3/3
 ✔ Network prometheus-grafana  Created                     0.3s
 ✔ Container node-exporter     Started                     0.8s
 ✔ Container prometheus        Started                     0.7s
```

You can confirm their status by running:

```command
docker compose ps
```

The output should indicate that both services are running:

```text
NAME            IMAGE                       COMMAND                  SERVICE         CREATED              STATUS              PORTS
node-exporter   prom/node-exporter:latest   "/bin/node_exporter …"   node-exporter   About a minute ago   Up About a minute   0.0.0.0:9100->9100/tcp, :::9100->9100/tcp
prometheus      prom/prometheus:latest      "/bin/prometheus --c…"   prometheus      About a minute ago   Up About a minute   0.0.0.0:9090->9090/tcp, :::9090->9090/tcp
```

To confirm that Prometheus is able to scrape the Node Exporter metrics
successfully, visit `http://localhost:9090/targets` in your browser. You should
see the `node-exporter` source reported as **Up**:

![Node Exporter Source in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d69c654b-8bd3-4e33-cc10-8d1443490200/md1x =1704x483)

If you'd like to learn more about the metrics collected and exposed by Node
Exporter, and how to customize or query them, [read our comprehensive guide on
the subject](https://betterstack.com/community/guides/monitoring/monitor-linux-prometheus-node-exporter/).

In the next section, you'll set up Grafana to visualize the metrics collected by
Node Exporter.

## Setting up Grafana

Grafana provides two editions of its Docker images:
[Grafana Enterprise](https://hub.docker.com/r/grafana/grafana-enterprise) and
[Grafana Open Source](https://hub.docker.com/r/grafana/grafana-oss). In this
tutorial, we will use the Open Source edition.

To add Grafana to your setup, modify your `compose.yaml` file as follows:

```yml
[compose.yaml]
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - 9090:9090

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

[highlight]
  grafana:
    image: grafana/grafana-oss:latest
    container_name: grafana
    ports:
      - 3000:3000
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus
[/highlight]

networks:
  default:
    name: prometheus-grafana
    driver: bridge

volumes:
  prometheus_data:
[highlight]
  grafana_data:
[/highlight]
```

The Grafana instance is set up to listen on `http://localhost:3000`, its default
port. To add Grafana to your running Docker Compose stack, execute the following
command:

```command
docker compose up -d
```

This command will create and start the new `grafana` service without
interrupting the already running services. You should see output similar to the
following:

```text
[output]
[+] Running 3/3
 ✔ Container node-exporter  Running                        0.0s
 ✔ Container prometheus     Running                        0.0s
[highlight]
 ✔ Container grafana        Started                        0.5s
[/highlight]
```

To confirm that the `grafana` service is running, use:

```command
docker compose ps grafana
```

You should see output like this:

```text
NAME      IMAGE                    COMMAND     SERVICE   CREATED         STATUS         PORTS
grafana   grafana/grafana:latest   "/run.sh"   grafana   8 minutes ago   Up 8 minutes   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp
```

You can now visit `http://localhost:3000` to access the Grafana user interface.
You will be greeted by the login page:

![Grafana login page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3be188e3-e1e7-41ae-ee71-a74e50998300/lg1x =1704x949)

The default username is `admin`, and the default password is also `admin`. Upon
logging in, you will be prompted to change the default password. You can choose
to do so immediately or skip this step for now:

![Grafana change password form](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f6c3caf6-8e80-417e-d4ea-7c197733bf00/lg2x =1739x1013)

Once logged in, you will be taken to the Grafana homepage:

![Grafana homepage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7e58f031-e524-421e-b0dc-e6767ec37100/orig =1739x1013)

In the next section, you will configure your running Prometheus server as a data
source in Grafana.

## Configuring the Prometheus data source

Before you can start using Grafana for dashboarding, you need to connect at
least one data source.

To get started, navigate to **Connections > Add new connection** in the Grafana
menu or go to `http://localhost:3000/connections/add-new-connection`:

![Grafana add connections](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/176e85e6-8c1d-4a59-3ce8-afb48d119700/md2x =1739x1013)

Use the search bar to locate the **Prometheus** option under **Data Sources**,
and click on it:

![Grafana data source](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a8065c9d-efa8-46d3-7640-b41b9cd4bc00/orig =1739x1013)

Click the **Add new data source** button on the next page:

![Add new data source Prometheus Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/995f0a8e-a1fb-436c-4b60-0dfaa4a15a00/public =1739x800)

In the configuration form, find the **Connection** section, and enter
`http://prometheus:9090` as the **Prometheus server URL**:

![Add Prometheus Connection URL](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1e26f0c8-fce1-402b-210a-a887a283e500/lg2x =1739x778)

You can leave the other fields as is, then scroll to the bottom and click **Save
& test**:

![Save and test data source in Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/aca1c9c0-9822-4223-66f3-9a0627f86e00/lg2x =1739x778)

You will see the following confirmation message:

![Prometheus data source is successful](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/79cc73a2-8f41-41a3-f119-1641d19b0c00/orig =1739x778)

With your Prometheus data source connected, you are now ready to create your
first Grafana dashboard. This will be covered in the next section.

## Creating a new Grafana dashboard

To create a new dashboard, navigate to the **Dashboards** section in the menu,
or go to `http://localhost:3000/dashboards`. Click the **New > New dashboard**
button on the resulting page:

![Creating a new Grafana dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f975db39-993b-45c5-498f-eca259264b00/md1x =1602x678)

Grafana provides several options at this stage. You can:

- Add a new visualization from scratch.
- Import a library of shared visualizations.
- Import an entire dashboard from a file or other Grafana users.

![Grafana new dashboard page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f690e14a-0884-466b-2ca0-ab8361fa9000/md1x =2042x1192)

In this section, I'll demonstrate how to create a dashboard from scratch. Later
in the guide, we'll explore importing pre-built dashboards as well.

Click the **Add visualization** button, then select the previously added
**prometheus** data source:

![Grafana select data source](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6c5dba3f-387c-4bc3-13c8-e8216f890500/orig =2042x1192)

This will open the edit view for a new panel. Here, you'll find:

- The **Visualization** section, where the resulting chart or graph will appear.
- The **Query** section, where you'll input the queries to fetch data.
- The **Panel** options section, where you can customize the panel's appearance.

![Grafana new panel edit view](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9e981b44-013c-460c-f0d3-96884c87ca00/md2x =2042x1192)

For our first visualization, let's display the uptime of the monitored machine.
Use the following [PromQL query](https://betterstack.com/community/guides/monitoring/promql/):

```promql
node_time_seconds{instance="node-exporter:9100",job="node-exporter"} - node_boot_time_seconds{instance="node-exporter:9100",job="node-exporter"}
```

The `node_time_seconds` metric provides the current time in seconds while
`node_boot_time_seconds` metric provides the boot time of the node in seconds.
Subtracting `node_boot_time_seconds` from `node_time_seconds` calculates the
uptime of the node in seconds.

In the **Query** tab, switch to the **Code** mode and enter the above query.
Then click **Run queries**:

![Enter PromQL query in Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5153de8b-df89-427d-8b2e-5b5144960400/lg1x =2042x1139)

By default, Grafana uses a time series graph to display data points against a
time axis. Since we intend to display the node uptime value in human-readable
form, change the visualization to **Stat**:

![Select the Stat visualization](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cf079583-fedf-41bf-9cac-f8c28ec5c100/orig =2042x1139)

You'll see something like this:

![Selected Stat visualization](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/aa37b424-3fd9-441a-ea98-41446f3f4200/md1x =2042x1139)

The Stat visualization will display a large, prominent number, ideal for quickly
conveying key information.

Currently, the raw value is displayed in seconds, which isn't very helpful. To
make it more readable, set the **Unit** field to **seconds (s)** under
**Standard options**. This converts the uptime into a human-readable format:

![Stats is human readable](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0b97d852-ef0e-4117-9b32-fd7d520b6e00/md2x =2042x1139)

To simplify the display, scroll to **Stat styles**, change **Color mode** and
**Graph mode** to **None**. This removes unnecessary visual elements, leaving a
clean uptime display:

![Uptime value in Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ffe9afdc-bbfe-435d-de5e-2a9ec711ea00/orig =2042x1139)

If you're satisfied with the result, update the **Title** and **Description**
under **Panel options**, and click **Apply** to add it to your dashboard:

![Add panel name and description](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2e86c81f-9438-4c5b-6b99-1ba8f94efa00/md1x =2113x1141)

Finally, save your dashboard by clicking the save icon:

![Panel added to dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c35b8c7b-49d3-4190-55dd-dbfc6de89300/md2x =1619x903)

Give the dashboard a name and click **Save**:

![Save Grafana dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4d4dcd4f-4327-4203-af17-4797cdbc4700/lg1x =1619x903)

And there you have it! Your dashboard is successfully updated with its first
panel.

In the next section, we'll explore creating a time series graph.

## Creating a time series chart

To enhance your dashboard, let's add a new panel that visualizes the memory
usage of the monitored node over time. Here are some relevant metrics for memory
usage:

- `node_memory_MemTotal_bytes`: Total physical memory available on the system.
- `node_memory_MemFree_bytes`: Amount of physical memory that is unused and
  available.
- `node_memory_Buffers_bytes`: Memory used by kernel buffers.
- `node_memory_Cached_bytes`: Memory used for file system caches. This memory is
  typically available for applications if needed.
- `node_memory_SwapTotal_bytes`: Total swap memory available.
- `node_memory_SwapFree_bytes`: Free swap memory available.

In this section, you'll create a time series chart showing the total memory and
memory used over time.

Start by clicking the **Add > Visualization** button to create a new panel in
your existing dashboard:

![Add new Grafana visualization](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/20d20775-5caf-4366-5bd7-5e89dc2e6a00/md1x =1619x903)

To display the total amount of RAM available, enter the following query into the
**Metrics browser** input under the **A** query panel, then click **Run
queries**:

```promql
node_memory_MemTotal_bytes{instance="node-exporter:9100",job="node-exporter"}
```

You will see a straight line since the total memory capacity of the node doesn't
change over time:

![Plotting total memory usage in Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/088aa0a3-e8ed-4118-741d-7f50228d9400/md2x =2230x1335)

To make things more interesting, add another query by clicking the **Add query**
button at the bottom of the **Query** tab. Enter the following PromQL query to
calculate memory usage, then click **Run queries**:

```promql
node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes
```

You will see the following result:

![Calculating memory usage in Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/811d5513-f081-48ca-34e1-e47193a06c00/md1x =2249x1369)

The yellow line represents memory usage, which you can now compare to the total
memory available.

To make the graph easier to read, update the **Legend** for each query to
**Total Ram** and **Used Ram** respectively, then set the **Unit** to
**bytes(IEC)** as highlighted below:

![Customizing the time series graph in Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d61dfc8a-7e9c-4fcf-b303-1324f4646f00/md2x =2408x1562)

Your graph is now more intuitive and easier to understand. Add a title and
description to the panel as described earlier, then click **Apply** to save it
to your dashboard:

![Node exporter dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/45f67456-59c4-4272-1340-d17c3dd9a600/md2x =2408x769)

Don't forget to save your dashboard after adding the new panel to ensure your
changes are preserved.

[summary]
### Build charts visually without writing queries

While Grafana requires PromQL knowledge to create visualizations, [Better Stack](https://betterstack.com/dashboards) offers an intuitive drag-and-drop query builder. Simply select your metrics, choose aggregations, and apply filters to build comprehensive dashboards—no code required. For advanced users, SQL and PromQL options are also available.


<iframe width="100%" height="315" src="https://www.youtube.com/embed/5ron8pXkVwo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
[/summary]


## Creating a Gauge chart

A gauge chart is ideal for displaying values that represent a single point in
time, such as utilization, capacity, or thresholds. The Node Exporter exposes
several metrics that are well-suited for visualization using gauge charts,
including CPU usage, memory consumption, disk utilization, and network
bandwidth.

For demonstration purposes, let's visualize the amount of disk space remaining
on the node as a percentage. You can do this by adding a new visualization and
selecting the **Gauge** chart:

![Selecting the Gauge chart in Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/184bd5f5-160f-47e2-07c0-ff17a988ad00/lg1x =2408x1268)

Use the following PromQL query to calculate the filesystem usage percentage for
the root mount point:

```promql
1 -  (node_filesystem_avail_bytes{mountpoint="/",instance="node-exporter:9100"} / node_filesystem_size_bytes{mountpoint="/",instance="node-exporter:9100"})
```

Enter the query into the query input field and click **Run queries**. The raw
value, which will be between 0 and 1, will be displayed:

![Run query for Gauge visualization](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f1b0bbd0-9ac1-4514-a64b-255ecaa1a100/lg1x =2408x1268)

When plotting a Gauge chart for values with a known range, you can enter them in
the **Min** and **Max** fields respectively under **Standard options**. You can
also specify the **Unit** as **Percent (0.0-0.1)** as shown below to display the
value as a percentage:

![Specify minimum and maximum values for Gauge in Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b5e755c8-8d2c-4437-0a2b-44df796ef900/md1x =2113x1141)

You can also add color-coding to the different value thresholds so that you can
quickly see what nodes are dangerously close to using up all their disk space.

Scroll down to the **Thresholds** section, and change the **Thresholds mode** to
**Percentage**. By default, values above 80% is considered high and displayed in
a bright red colour:

![Displaying Gauge value in red](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/30b3987a-2152-4b6e-697b-6e0b02972700/public =2408x1268)

You can adjust this depending on your needs. For example, you can add a
"warning" threshold that is between 80-90% utilization and a "danger" threshold
for 90% and above:

![Warning and Danger thresholds in Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5209471d-0f46-4c14-6a5b-bfd102d87a00/md2x =2408x1268)

Once satisfied with the settings, give the panel a title and description, then
click **Add** to add it to your dashboard.

![Added Gauge to Grafana Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0aacc77c-b0a6-4fd9-3796-2be763d0d300/public =2408x1268)

With the gauge chart added, you're now ready to simplify your PromQL queries
using Grafana dashboard variables. Afterward, we'll explore how to find and
import pre-existing dashboards in Grafana.

## Simplifying queries in Grafana with variables

Hardcoding labels in PromQL queries can make your dashboards inflexible. If
these values change or you add more nodes to monitor, your dashboard will break,
and you'll need to manually update each panel. To avoid this, you can use
Dashboard variables, which make dashboards reusable, dynamic, and shareable.

To get started with variables, click the **cog icon** on the dashboard, then go
to the **Variables** tab and click **Add variable**:

![Clicking Dashboard cog icon in Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9780864c-7d4a-41ca-edf2-663e393bf100/lg2x =2408x601)

![Variables page in Grafana dashboard settings](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/71bd6ae0-8348-4a01-4dd5-60e63ecb4200/orig =2408x997)

Select **Query** as the variable type. Query variables fetch values dynamically
from your data source:

![Query variable in Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/12f83789-06b5-4b44-54bc-25a84637a900/md2x =1300x666)

Let's add a `job` variable that references the `job` label in Node Exporter
metrics. Set the **Name** and **Label** to **job** and **Job** respectively,
then select **Label values** under **Query type**:

![Filling the dashboard variable options](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d88e7f6e-1ddb-4b9b-01fa-921398732b00/orig =2298x1372)

In the **Label** field, enter `job`, and for the **Metric** field, use
`node_uname_info`. This ensures that the `job` label values are derived from the
`node_uname_info` metric and you can use any metric that includes the `job`
label.

Scroll down to see a **Preview of the values**. In this example, the value will
be `node-exporter`. Click **Apply** to save the variable:

![Filling the query variable options](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e98aeb69-e202-4cca-3577-3a09d86c4500/public =2298x1372)

In the **Settings** page, click **Save dashboard**:

![Saving the Grafana dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f1f85965-afbf-40c6-f054-935a182ed300/md2x =2298x749)

The `job` variable will now appear at the top of the dashboard, and its value
will default to `node-exporter`:

![Grafana variables in Dashboard panel](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6d6b7da7-ffaa-4963-019d-5ab22d6b9400/public =2298x1204)

To update a panel to use the variable, hover over the panel and click **Edit**:

![Clicking edit on a Grafana panel](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/32210385-4bae-48b3-2a55-6682a6106100/lg1x =2298x1204)

Replace hardcoded `job` values in PromQL queries with `$job`. For example,
update the **Uptime** panel query to:

```promql
node_time_seconds{instance="node-exporter:9100",job="$job"} - node_boot_time_seconds{instance="node-exporter:9100",job="$job"}
```

Click **Run queries** to verify that the panel works as expected, then click
**Apply** and save the dashboard:

![Save panel after using variable in Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6b6111ae-2e5d-449a-39b6-eac4d93bac00/md2x =2298x1204)

Everything should keep working the same way as before:

![Grafana dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/df2928cd-cb17-40e8-5227-7035c5d49600/lg2x =2298x1204)

You can repeat this process for the `instance` label matcher. This allows you to
dynamically monitor new nodes without manually changing label values in every
visualization.

[summary]
### Query with SQL for familiar data analysis

While Grafana dashboard variables help reduce query repetition, [Better Stack](https://betterstack.com/infrastructure-monitoring) lets you query your metrics using standard SQL—a language most developers already know. Write complex queries, join data, and create custom aggregations without learning PromQL syntax.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/kf97nwgL88M" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Importing dashboards in Grafana

When monitoring commonly used software or systems, you can often save
significant time by importing
[pre-built dashboards](https://grafana.com/grafana/dashboards/) into Grafana.

These dashboards are created by community members or the Grafana team and
provide an excellent starting point for visualizing your metrics.

For instance,
[this Node Exporter dashboard](https://grafana.com/grafana/dashboards/1860-node-exporter-full/)
visualizes nearly all default metrics from the Node Exporter. Here's how to
import it into your Grafana instance:

Navigate to the **Dashboards** page at `http://localhost:3000/dashboards`, and
click the **New > New dashboard** option:

![Create a new dashboard in Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e613dba7-d8dc-49d9-4422-06cfcb8f5100/lg1x =2113x806)

On the resulting page, click the **Import dashboard** button:

![Select import dashboard in Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3b6bc171-d3ed-4d83-95a4-c9896f832c00/lg2x =2113x1141)

Enter the URL of the **Node Exporter Full** dashboard into the input field and
click **Load**:

```text
https://grafana.com/grafana/dashboards/1860-node-exporter-full/
```

![Adding dashboard URL in Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8f30d4f7-6628-4fa0-5b0c-a7ac3ca52f00/lg1x =2113x1141)

On the next page, select your **Prometheus** source and click **Import**:

![Import dashboard in Grafana](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b37906f3-c12d-429f-af85-f42231eff400/public =2113x1141)

The Node Exporter dashboard will now appear, and it should look like this:

![Node Exporter Full dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/dae23b39-88e3-4097-497a-0d47f1bc2800/md2x =3072x1612)

You can explore the various visualizations within the imported dashboard.
Customize panels to fit your specific needs or delete unnecessary ones.

Pre-built dashboards are highly flexible and can save you significant time while
still allowing you to tailor them to your requirements.

[summary]
### Extract metrics from logs automatically

While Prometheus requires custom exporters to expose new metrics, [Better Stack](https://betterstack.com/log-management) automatically converts your logs into queryable metrics. Track business-specific KPIs, application behaviors, and custom events without writing instrumentation code or deploying additional exporters.

**Unify logs, metrics, and traces in a single platform.**

<iframe width="100%" height="315" src="https://www.youtube.com/embed/HOalldfV7Vk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Final thoughts

We've covered a lot of ground in this tutorial, and hopefully you're now well acquainted with the basics of visualizing Prometheus metrics with Grafana.

You've learned how to set up Prometheus and Grafana, create basic visualizations, and even import pre-built dashboards to accelerate your monitoring efforts.

But the journey doesn't stop here! There's a lot more to learn when it comes to monitoring with Prometheus and Grafana so ensure to check out [their documentation](https://grafana.com/docs/) and [our other guides](https://betterstack.com/community/guides/monitoring/) to learn more.

If managing your own Prometheus and Grafana infrastructure feels like a burden, consider a fully managed observability platform like [Better Stack](https://betterstack.com/telemetry).

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Better Stack provides a streamlined solution for collecting, visualizing, and analyzing your Prometheus metrics alongside logs, traces, and errors in one unified platform. The eBPF-based auto-instrumentation eliminates the need for manual exporter configuration, while flexible querying options (SQL, PromQL, and drag-and-drop) make it accessible for both beginners and advanced users.

You can easily integrate your existing Prometheus setup and leverage Better Stack's [pre-built dashboards](https://betterstack.com/dashboards) to get started immediately. With pricing that's 30x cheaper than Datadog and a 60-day money-back guarantee, you can evaluate the platform risk-free.

[Sign up for a free account here](https://betterstack.com/users/sign-up).

Thanks for reading, and happy monitoring!