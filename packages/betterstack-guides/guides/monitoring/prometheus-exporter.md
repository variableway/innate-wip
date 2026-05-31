# A Comprehensive Guide to Prometheus Exporters

[Prometheus](https://betterstack.com/community/guides/monitoring/prometheus/)' ability to collect and analyze
[metrics](https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/) from a wide range of sources is
essential for ensuring the health and performance of your applications and
infrastructure.

But what happens when the systems you want to monitor don't speak Prometheus's
language? **That's where exporters come in**.

They act as translators, converting metrics from diverse systems into a format
compatible with Prometheus. With Exporters, your monitoring capabilities become
virtually limitless. Regardless of the system or technology, there's likely an
exporter available to integrate it into your observability stack.

This article is your comprehensive guide to Prometheus exporters. We'll explore
what they are, how they work, how to customize them, and even how to build your
own if needed.

Let's get started!

[ad-logs]

## What are Prometheus Exporters?

Many applications and systems are not inherently designed to expose metrics in a
format that Prometheus can directly consume.

Exporters bridge this gap by acting as intermediaries, translating diverse data
formats into the standardized Prometheus format.

This allows Prometheus to monitor a broad array of targets, including those
without native Prometheus support.

Here's how it works:

1. **Metric collection**: An exporter gathers data from a specific source, which
   could be anything from a database like PostgreSQL to a hardware device like a
   network switch.
2. **Metric transformation**: The collected data is then converted into the
   Prometheus exposition format, making it compatible with Prometheus' scraping
   mechanism.
3. **Metric exposition**: The transformed metrics are exposed via an HTTP
   endpoint, allowing Prometheus to retrieve them at regular intervals.

[A vast ecosystem of exporters](https://prometheus.io/docs/instrumenting/exporters/)
exists, ranging from official Prometheus-maintained exporters to
community-contributed ones. Below are some popular examples:

- [Node Exporter](https://github.com/prometheus/node_exporter): Collects system
  metrics on Linux/Unix.
- [PostgreSQL Exporter](https://github.com/prometheus-community/postgres_exporter):
  Provides insights into the query execution times and other related statistics
  for PostgreSQL instances.
- [MySQL Exporter](https://github.com/prometheus/mysqld_exporter): The MySQL
  equivalent of the PostgreSQL exporter.
- [Blackbox Exporter](https://github.com/prometheus/blackbox_exporter): Allows
  blackbox probing of endpoints over HTTP, HTTPS, DNS, TCP, and gRPC.
- [JMX Exporter](https://github.com/prometheus/jmx_exporter): Collects metrics
  from a wide variety of JVM-based applications such as Apache Kafka and
  Cassandra.

When no existing exporter is available for a specific system, you can create a
custom exporter to collect and expose its metrics. We'll delve into how to
[write your own exporter](#writing-custom-exporters) later on in this article.

Let's look at how to use exporters next.

## How to use Prometheus Exporters

Using Prometheus exporters involves identifying the systems you want to monitor
and selecting the appropriate exporter if the system doesn't natively expose
Prometheus-compatible metrics.

Prometheus has a well-established presence in the monitoring space, resulting in
a vast ecosystem of exporters for various systems and applications. In most
cases, you won't need to build your own exporter, as the Prometheus community
and vendors have likely already created and maintained one for your needs.

For example, if you want to monitor your Nginx servers with Prometheus, you can
use the
[official NGINX Prometheus exporter](https://github.com/nginxinc/nginx-prometheus-exporter)
provided by the Nginx team.

![Nginx exporter GitHub image](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6caeeeb9-c329-4b50-3844-a0de2bd62200/md1x =1200x600)

Once you've selected the relevant exporter, you'll need to install it. Usually,
a static binary and a Docker image will be provided, but you should confirm the
specific options available from the exporter's documentation.

Once the exporter is installed, you must connect it to your system or
application. Most exporters only require minimal configuration to start working.

Next, you'll need to update your Prometheus configuration file to include the
exporter's HTTP endpoint as a scrape target. If Prometheus can successfully
scrape your metrics, you've set it up correctly.

Let's set up the Nginx Prometheus Exporter to monitor Nginx metrics to see this
process in action. You only need to have [Docker](https://www.docker.com/)
installed to follow along.

## Scraping Nginx metrics with Prometheus

Nginx exposes a handful of basic server metrics via the
[stub_status page](https://nginx.org/en/docs/http/ngx_http_stub_status_module.html#stub_status)
page which looks like this:

```text
Active connections: 10
server accepts handled requests
  1000 1000 5000
Reading: 2 Writing: 5 Waiting: 3
```

This page provides a snapshot of server activity, showing the number of active
connections, total accepted and handled connections, processed requests, and the
current state of connections: those reading client requests, writing responses,
and waiting for new requests.

Our task is to set up an Nginx exporter to collect these metrics, transform them
to the Prometheus format, and expose them for scraping by the Prometheus server.

To get started, let's use Docker Compose to configure and deploy the following
services:

- `nginx`: The web server exposing metrics via the `/stub_status` endpoint.
- `nginx-exporter`: Collects metrics from the Nginx `/stub_status` endpoint and
  transforms them to the Prometheus format.
- `prometheus`: Scrapes and stores the metrics exposed by the `nginx-exporter`.

Here's the `docker-compose.yml` file to set up the environment:

```yaml
[label docker-compose.yml]
services:
  nginx:
    image: nginx:latest
    container_name: nginx
    restart: unless-stopped
    ports:
      - 80:80
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    networks:
      - nginx-server

[highlight]
  nginx-exporter:
    image: nginx/nginx-prometheus-exporter:latest
    container_name: nginx_exporter
    depends_on:
      - nginx
    ports:
      - 9113:9113
    command:
      - -nginx.scrape-uri=http://nginx:80/stub_status
    networks:
      - nginx-server
[/highlight]

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
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
      - nginx-server

networks:
  nginx-server:

volumes:
  prometheus_data:
```

In this file, the `nginx` service is configured to listen at port 80, the
`nginx-exporter` is configured to listen at port 9113, while the `prometheus`
service is set up to listen at port 9090.

Looking at the `nginx-exporter` configuration, you'll see that it is configured
to scrape the status page at `http://nginx:80/stub_status` so that it can
access the raw Nginx metrics.

For this to work, you need to ensure your Nginx server exposes this page
accordingly. You can do this by extracting the Nginx configuration file from the
`nginx` image with:

```command
docker run --rm --entrypoint=cat nginx /etc/nginx/nginx.conf > nginx.conf
```

Then open the resulting `nginx.conf` file and modify it as follows:

```conf
[label nginx.conf]
. . .

http {
    . . .

[highlight]
    server {
        listen 80;
        server_name localhost nginx;

        location /stub_status {
          stub_status;
        }
    }
[/highlight]

    include /etc/nginx/conf.d/*.conf;
}
```

With this in place, the `/stub_status` endpoint will now be exposed and
accessible by the `nginx-exporter` service.

You'll also need to set up Prometheus to scrape the `nginx-exporter` by creating
a configuration file as follows:

```yaml
[label prometheus.yml]
global:
  scrape_interval: 10s

scrape_configs:
  - job_name: nginx
    static_configs:
      - targets:
          - nginx-exporter:9113
```

With this in place, you're all set to launch the services with:

```command
docker compose up -d
```

```text
[output]
[+] Running 4/4
 ✔ Network prometheus-exporter_nginx-server  Created             0.2s
 ✔ Container nginx                           Started             0.7s
 ✔ Container prometheus                      Started             0.7s
 ✔ Container nginx_exporter                  Started             0.8s
```

Once the services are started, make a request to `http://localhost/stub_status`
to see the raw Nginx metrics:

![Raw Nginx Metrics via stub_status](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/167a227e-45d5-49c0-81df-1a0094379c00/orig =2296x782)

Let's confirm that the Nginx exporter is able to scrape the metrics by heading
to `http://localhost:9113/metrics`. Look for metrics with the `nginx_` prefix,
such as:

```text
. . .
# HELP nginx_connections_active Active client connections
# TYPE nginx_connections_active gauge
nginx_connections_active 1

# HELP nginx_connections_handled Handled client connections
# TYPE nginx_connections_handled counter
nginx_connections_handled 3

# HELP nginx_http_requests_total Total HTTP requests
# TYPE nginx_http_requests_total counter
nginx_http_requests_total 30
. . .
```

If you're running Nginx plus, the exporter can scrape a lot more metrics. You
can see the full list in its
[GitHub repository](https://github.com/nginxinc/nginx-prometheus-exporter?tab=readme-ov-file#exported-metrics).

Finally, head over to `http://localhost:9090/targets` in your browser. You
should see the Nginx exporter listed and actively scraped:

![Prometheus targets](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f2cbbe72-40cf-427f-bb82-5a4380be7a00/public =1440x493)

With this setup complete, you can use Prometheus or an observability tool like
[Better Stack](https://betterstack.com/telemetry) to [query and visualize
metrics](https://betterstack.com/community/guides/monitoring/promql/).

## Preventing metrics explosion in Prometheus

Exporters often expose more metrics than you need, including metrics for the
monitored system or application, as well as the exporter itself.

Monitoring a large number of services without managing these metrics can lead to
a metrics explosion that could significantly increase storage costs and query
execution times.

To avoid this, it's necessary to drop unneeded metrics whenever possible. Here
are some strategies to achieve this:

### 1. Disabling unnecessary metrics in the exporter

Exporters often expose their own internal metrics, typically prefixed with
`promhttp_`, `process_`, or `go_`. For example:

```text
# HELP go_gc_duration_seconds A summary of the pause duration of garbage collection cycles.
# TYPE go_gc_duration_seconds summarygo_gc_duration_seconds{quantile="0"} 5.8137e-05
go_gc_duration_seconds{quantile="0.25"} 5.8137e-05
go_gc_duration_seconds{quantile="0.5"} 8.5096e-05
go_gc_duration_seconds{quantile="0.75"} 8.5096e-05
go_gc_duration_seconds{quantile="1"} 8.5096e-05
go_gc_duration_seconds_sum 0.000143233
go_gc_duration_seconds_count 2
# HELP process_open_fds Number of open file descriptors.
# TYPE process_open_fds gauge
process_open_fds 10
# HELP process_resident_memory_bytes Resident memory size in bytes.
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes 1.536e+07
# TYPE promhttp_metric_handler_requests_total counter
promhttp_metric_handler_requests_total{code="200"} 4
promhttp_metric_handler_requests_total{code="500"} 0
promhttp_metric_handler_requests_total{code="503"} 0
```

With the [Node exporter](https://betterstack.com/community/guides/monitoring/monitor-linux-prometheus-node-exporter/), you can use
the `--web.disable-exporter-metrics` flag to drop such metrics.

You can also disable certain collectors with:

```command
--no-collector.<name>
```

Or you can use an allowlist by combining the following flags:

```command
--collector.disable-defaults --collector.<name> ...
```

Ensure to check the documentation of the exporter you're using to see if similar
flags are available.

### 2. Using Prometheus metric relabeling

If the exporter does not support disabling metrics, Prometheus allows you to
drop unwanted metrics during scraping using [metric relabeling](https://betterstack.com/community/guides/monitoring/prometheus-relabeling/).

For example, to drop metrics prefixed with `go_`, add the following to your
Prometheus configuration:

```yaml
[label prometheus.yml]
global:
  scrape_interval: 10s

scrape_configs:
  - job_name: nginx
    static_configs:
      - targets:
          - nginx-exporter:9113
[highlight]
    metric_relabel_configs:
      - source_labels: [__name__]
        regex: go_.* # Drop all metrics starting with "go_"
        action: drop
[/highlight]
```

With this in place, you'll no longer see the `go_` prefixed metrics in
Prometheus.

---

Currently, the Nginx exporter does not support disabling specific metrics,
although there's an
[open issue](https://github.com/nginx/nginx-prometheus-exporter/issues/557)
tracking this feature. For now, you can use the metric relabeling technique to
drop unused metrics.

## Writing custom exporters

When monitoring a system that doesn't have an existing Prometheus exporter, you
may need to create a custom exporter.

To see how this works, let's recreate some functionality of the official Nginx
Prometheus Exporter by creating a custom exporter for Nginx metrics through its
`stub_status` module.

To get started, clone the
[custom-nginx-exporter](https://github.com/betterstack-community/custom-nginx-exporter)
repository to your machine and navigate into the created directory:

```command
git clone https://github.com/betterstack-community/custom-nginx-exporter
```

```command
cd custom-nginx-exporter
```

This repository contains an implementation of a custom exporter written in Go.
You can also create custom exporters with any language that has a working
[Prometheus client library](https://prometheus.io/docs/instrumenting/clientlibs/)
such as Python, Java, Rust, and others.

To examine the code, open up the `main.go` file in your text editor.

```command
code main.go
```

Here's the part that scrapes the raw Nginx metrics into structured data:

```go
[label main.go]
. . .

const templateMetrics string = `Active connections: %d
server accepts handled requests
%d %d %d
Reading: %d Writing: %d Waiting: %d
`

// StubStats represents NGINX stub_status metrics.
type StubStats struct {
	Connections StubConnections
	Requests    int64
}

// StubConnections represents connections related metrics.
type StubConnections struct {
	Active   int64
	Accepted int64
	Handled  int64
	Reading  int64
	Writing  int64
	Waiting  int64
}

// GetStubStats fetches the stub_status metrics.
func GetStubStats(endpoint string) (*StubStats, error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodGet,
		endpoint,
		http.NoBody,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create a get request: %w", err)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to get %v: %w", endpoint, err)
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf(
			"expected %v response, got %v",
			http.StatusOK,
			resp.StatusCode,
		)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read the response body: %w", err)
	}

	r := bytes.NewReader(body)

	stats, err := parseStubStats(r)
	if err != nil {
		return nil, fmt.Errorf(
			"failed to parse response body %q: %w",
			string(body),
			err,
		)
	}

	return stats, nil
}

func parseStubStats(r io.Reader) (*StubStats, error) {
	var s StubStats
	if _, err := fmt.Fscanf(r, templateMetrics,
		&s.Connections.Active,
		&s.Connections.Accepted,
		&s.Connections.Handled,
		&s.Requests,
		&s.Connections.Reading,
		&s.Connections.Writing,
		&s.Connections.Waiting); err != nil {
		return nil, fmt.Errorf("failed to scan template metrics: %w", err)
	}

	return &s, nil
}

. . .
```

The `templateMetrics` variable is a format string that represents the structure
of the NGINX `/stub_status` output. It matches the metrics exposed by the
endpoint, and each placeholder (`%d`) corresponds to a metric to be extracted.

The `GetStubStats()` function fetches the raw data from the `/stub_status`
endpoint and parses it into the `StubStats` struct by calling the
`parseSubStats()` function.

The second part of the code is what translates the Nginx `stub_status` metrics
into a format Prometheus can scrape. It uses the
[Prometheus Go client library](https://pkg.go.dev/github.com/prometheus/client_golang/prometheus)
to define, describe, and collect metrics dynamically:

```go
[label main.go]
. . .
// Metrics holds descriptions for NGINX-related metrics.
type metrics struct {
	ActiveConnectionsDesc   *prometheus.Desc
	ConnectionsReadingDesc  *prometheus.Desc
	ConnectionsAcceptedDesc *prometheus.Desc
	ConnectionsHandledDesc  *prometheus.Desc
	ConnectionsWaitingDesc  *prometheus.Desc
	ConnectionsWritingDesc  *prometheus.Desc
	HTTPRequestsTotalDesc   *prometheus.Desc
}

// NewMetrics initializes all metric descriptions.
func NewMetrics(namespace string) *metrics {
	return &metrics{
		ActiveConnectionsDesc: prometheus.NewDesc(
			namespace+"_connections_active",
			"Active client connections",
			nil, nil,
		),
		ConnectionsReadingDesc: prometheus.NewDesc(
			namespace+"_connections_reading",
			"Connections currently reading client request headers",
			nil, nil,
		),
		ConnectionsAcceptedDesc: prometheus.NewDesc(
			namespace+"_connections_accepted_total",
			"Total accepted client connections",
			nil, nil,
		),
		ConnectionsHandledDesc: prometheus.NewDesc(
			namespace+"_connections_handled_total",
			"Total handled client connections",
			nil, nil,
		),
		ConnectionsWaitingDesc: prometheus.NewDesc(
			namespace+"_connections_waiting",
			"Idle client connections",
			nil, nil,
		),
		ConnectionsWritingDesc: prometheus.NewDesc(
			namespace+"_connections_writing",
			"Connections where NGINX is currently writing responses to clients",
			nil, nil,
		),
		HTTPRequestsTotalDesc: prometheus.NewDesc(
			namespace+"_http_requests_total",
			"Total number of HTTP requests handled",
			nil, nil,
		),
	}
}

// CollectMetrics is a struct that collects metrics dynamically.
type CollectMetrics struct {
	metrics *metrics
}

// NewCollector creates a new instance of CollectMetrics.
func NewCollector(namespace string, reg prometheus.Registerer) *CollectMetrics {
	m := NewMetrics(namespace)
	c := &CollectMetrics{metrics: m}
	reg.MustRegister(c)
	return c
}

// Describe sends metric descriptions to the provided channel.
func (c *CollectMetrics) Describe(ch chan<- *prometheus.Desc) {
	ch <- c.metrics.ActiveConnectionsDesc
	ch <- c.metrics.ConnectionsReadingDesc
	ch <- c.metrics.ConnectionsAcceptedDesc
	ch <- c.metrics.ConnectionsHandledDesc
	ch <- c.metrics.ConnectionsWaitingDesc
	ch <- c.metrics.ConnectionsWritingDesc
	ch <- c.metrics.HTTPRequestsTotalDesc
}

// Collect dynamically collects metrics and sends them to Prometheus.
func (c *CollectMetrics) Collect(ch chan<- prometheus.Metric) {
	endpoint := os.Getenv("NGINX_STATUS_ENDPOINT")

	nginxStats, err := GetStubStats(endpoint)
	if err != nil {
		log.Println(err)
		return
	}

	activeConnections := float64(nginxStats.Connections.Active)
	connectionsReading := float64(nginxStats.Connections.Reading)
	connectionsAccepted := float64(nginxStats.Connections.Accepted)
	connectionsHandled := float64(nginxStats.Connections.Handled)
	connectionsWaiting := float64(nginxStats.Connections.Waiting)
	connectionsWriting := float64(nginxStats.Connections.Writing)
	httpRequestsTotal := float64(nginxStats.Requests)

	ch <- prometheus.MustNewConstMetric(c.metrics.ActiveConnectionsDesc, prometheus.GaugeValue, activeConnections)
	ch <- prometheus.MustNewConstMetric(c.metrics.ConnectionsReadingDesc, prometheus.GaugeValue, connectionsReading)
	ch <- prometheus.MustNewConstMetric(c.metrics.ConnectionsAcceptedDesc, prometheus.CounterValue, connectionsAccepted)
	ch <- prometheus.MustNewConstMetric(c.metrics.ConnectionsHandledDesc, prometheus.CounterValue, connectionsHandled)
	ch <- prometheus.MustNewConstMetric(c.metrics.ConnectionsWaitingDesc, prometheus.GaugeValue, connectionsWaiting)
	ch <- prometheus.MustNewConstMetric(c.metrics.ConnectionsWritingDesc, prometheus.GaugeValue, connectionsWriting)
	ch <- prometheus.MustNewConstMetric(c.metrics.HTTPRequestsTotalDesc, prometheus.CounterValue, httpRequestsTotal)
}
. . .
```

The `metrics` struct holds `prometheus.Desc` descriptions for Nginx-related
metrics. Each field in the struct corresponds to a specific Nginx metric, and it
is initialized by calling `NewMetrics()`.

The `CollectMetrics` struct implements the
[prometheus.Collector](https://pkg.go.dev/github.com/prometheus/client_golang/prometheus#Collector)
interface, which defines how metrics are described and collected dynamically.

In the `Describe()` method, metric descriptors are sent to a Prometheus-provided
channel, while the `Collect()` method dynamically collects Nginx metrics with
`GetStubStats()` and converts the collected data into Prometheus-compatible
metrics using `prometheus.MustNewConstMetric()`.

The `main()` function ties everything together by initializing the
`CollectMetrics` struct, creating an HTTP server listening on port 9113, and
exposing the metrics on the `/metrics` endpoint for Prometheus scraping:

```go
[label main.go]
. . .
func main() {
	mux := http.NewServeMux()

	reg := prometheus.NewRegistry()

	NewCollector("nginx", reg)

	handler := promhttp.HandlerFor(reg, promhttp.HandlerOpts{})

	mux.Handle("/metrics", handler)

	http.ListenAndServe(":9113", mux)
}
```

To see this in action, ensure that you don't have an existing `nginx`,
`nginx-exporter` or `prometheus` instance running. Then execute the following
command from the `custom-nginx-exporter` directory root:

```command
docker compose up
```

```text
[output]
[+] Running 4/4
 ✔ Network prometheus-exporter_nginx-server  Created             0.2s
 ✔ Container nginx                           Started             0.7s
 ✔ Container prometheus                      Started             0.7s
 ✔ Container custom-nginx-exporter           Started             0.8s
```

Once the services are running, visit `http://localhost:9113/metrics` to verify
the metrics are exposed:

```text
# HELP nginx_connections_accepted_total Total accepted client connections
# TYPE nginx_connections_accepted_total counter
nginx_connections_accepted_total 8
# HELP nginx_connections_active Active client connections
# TYPE nginx_connections_active gauge
nginx_connections_active 2
# HELP nginx_connections_handled_total Total handled client connections
# TYPE nginx_connections_handled_total counter
nginx_connections_handled_total 8
# HELP nginx_connections_reading Connections currently reading client request headers
# TYPE nginx_connections_reading gauge
nginx_connections_reading 0
# HELP nginx_connections_waiting Idle client connections
# TYPE nginx_connections_waiting gauge
nginx_connections_waiting 1
# HELP nginx_connections_writing Connections where NGINX is currently writing responses to clients
# TYPE nginx_connections_writing gauge
nginx_connections_writing 1
# HELP nginx_http_requests_total Total number of HTTP requests handled
# TYPE nginx_http_requests_total counter
nginx_http_requests_total 29
```

You can then query the metrics in Prometheus as follows:

![Querying Nginx metrics in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/182ac679-26e3-4324-e7a5-bd4404524d00/lg2x =2003x1323)

To see a production-grade implementation, check out the
[nginx-prometheus-exporter GitHub repository](https://github.com/nginxinc/nginx-prometheus-exporter)
or any of the other exporters available.

Prometheus also provides some
[guidelines and best practices](https://prometheus.io/docs/instrumenting/writing_exporters/)
for writing custom exporters so be sure to read through them accordingly.

## Final thoughts

Prometheus exporters play a crucial role in extending its monitoring
capabilities to systems and applications that do not natively expose metrics in
its format.

However, managing exporters efficiently is just as important as setting them up
in the first place.

By dropping unused metrics and using Prometheus' metric relabeling features, you
can optimize resource usage and keep metric collection and storage costs under
control.

Thanks for reading, and happy monitoring!
