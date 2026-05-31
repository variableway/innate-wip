# Python Monitoring with Prometheus (Beginner's Guide)

This article provides a detailed guide on integrating [Prometheus
metrics](https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/) into your Python application.

It explores key concepts, including instrumenting your application with various
metric types, monitoring HTTP request activity, and exposing metrics for
Prometheus to scrape.

The complete source code for this tutorial is available in this
[GitHub repository](https://github.com/betterstack-community/prometheus-python).

Let's get started!

[ad-logs]

## Prerequisites

- Prior experience with Python and Flask, along with
  [a recent version of Python installed](https://www.python.org/downloads/).
- Familiarity with [Docker](https://www.docker.com/) and [Docker
  Compose](https://betterstack.com/community/guides/scaling-docker/docker-compose-getting-started/).
- Basic understanding of [how Prometheus works](https://betterstack.com/community/guides/monitoring/prometheus/).

## Step 1 — Setting up the demo project

To demonstrate Prometheus instrumentation in Python applications, let's set up a
simple "Hello World" Flask application along with the Prometheus server.

First, clone the repository to your local machine and navigate into the project
directory:

```command
git clone https://github.com/betterstack-community/prometheus-python
```

```command
cd prometheus-python
```

Here's the Flask application you'll be instrumenting:

```python
[label main.py]
from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

@app.route('/metrics')
def metrics():
    return '', 200

@app.route('/')
def hello():
    return 'Hello world!'

if __name__ == '__main__':
    port = int(os.getenv('PORT', '8000'))
    print(f'Starting HTTP server on port {port}')
    try:
        app.run(host='0.0.0.0', port=port, debug=True)
    except Exception as e:
        print(f'Server failed to start: {e}')
        exit(1)
```

This app exposes two endpoints: `/` returns a simple with "Hello world!"
message, and `/metrics` endpoint that will eventually expose the instrumented
metrics.

This project also includes a `compose.yaml` file, which defines two services:

```yaml
[label compose.yaml]
services:
  app:
    build:
      context: .
    environment:
      PORT: ${PORT}
    env_file:
      - ./.env
    ports:
      - 8000:8000
    volumes:
      - .:/app

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

volumes:
  prometheus_data:
```

The `app` service is the Flask application running on port `8000`, while
`prometheus` configures a Prometheus server to scrape the Flask app via the
`prometheus.yml` file:

```yaml
[label prometheus.yml]
global:
  scrape_interval: 10s

scrape_configs:
  - job_name: flask-app
    static_configs:
      - targets:
          - app:8000
```

Before starting the services, rename `.env.example` to `.env`. This file
contains the application's `PORT` setting:

```text
[label .env.example]
PORT=8000
```

Rename it with:

```command
mv .env.example .env
```

Then launch both services in detached mode with:

```command
docker compose up -d
```

You should see output similar to this:

```text
[output]
[+] Running 3/3
 ✔ Network prometheus-python_default  Created                    0.8s
 ✔ Container prometheus               Started                    1.3s
 ✔ Container app                      Started                    1.3s
```

To confirm that the Flask application is running, send a request to the root
endpoint:

```command
curl http://localhost:8000
```

This should return:

```text
[output]
Hello world
```

To verify that Prometheus is able to access the exposed `/metrics` endpoint,
visit `http://localhost:9090/targets` in your browser:

![Flask Demo target in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/781ca1dc-eced-45ca-b91e-8076d09afa00/md1x =1520x475)

With everything up and running, you're ready to integrate Prometheus in your
Python application in the next step.

## Step 2 — Installing the Prometheus Client

Before instrumenting your Flask application with Prometheus, you need to install
the [official Prometheus client](https://github.com/prometheus/client_python)
for Python applications.

Open your `requirements.txt` file and include the latest version of the
`prometheus_client` package:

```text
[label requirements.txt]
Flask==3.1.0
python-dotenv==1.0.1
prometheus_client
```

Then rebuild the `app` service by running the command below to ensure that the
`prometheus_client` dependency is installed:

```command
docker compose up -d --build app
```

Once the `app` service restarts, you may integrate Prometheus into your
application by modifying `main.py` as follows:

```python
[label main.py]
from flask import Flask
[highlight]
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
[/highlight]
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

@app.route('/metrics')
def metrics():
[highlight]
    """ Exposes application metrics in a Prometheus-compatible format. """
    return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}
[/highlight]

. . .
```

This modification introduces the `prometheus_client` package and its
`generate_latest()` function, which collects and returns metrics in a format
that Prometheus can scrape.

Once you've saved the file, visit `http://localhost:8000/metrics` in your
browser or use `curl` to see the default Prometheus metrics:

```command
curl http://localhost:8000/metrics
```

By default, Prometheus uses a global registry that automatically includes
standard Python runtime and process-level metrics:

```text
[output]
# HELP python_gc_objects_collected_total Objects collected during gc
# TYPE python_gc_objects_collected_total counter
python_gc_objects_collected_totalgeneration0 492.0
python_gc_objects_collected_totalgeneration1 325.0
python_gc_objects_collected_totalgeneration2 0.0
# HELP python_gc_objects_uncollectable_total Uncollectable objects found during GC
# TYPE python_gc_objects_uncollectable_total counter
python_gc_objects_uncollectable_totalgeneration0 0.0
python_gc_objects_uncollectable_totalgeneration1 0.0
python_gc_objects_uncollectable_totalgeneration2 0.0
. . .
```

![Default Prometheus Python metrics](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0d5fe1a6-087c-466a-b41b-cdadc1ab0400/public =1581x548)

If you want to disable these and expose only specific metrics, you need to
create a custom registry:

```python
[label main.py]
from flask import Flask
[highlight]
from prometheus_client import CollectorRegistry, generate_latest, CONTENT_TYPE_LATEST
[/highlight]
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

[highlight]
# Create a custom registry
registry = CollectorRegistry()
[/highlight]

@app.route('/metrics')
def metrics():
[highlight]
    """ Exposes only explicitly registered metrics. """
    return generate_latest(registry), 200, {'Content-Type': CONTENT_TYPE_LATEST}
[/highlight]

. . .
```

Since no custom metrics are registered yet, the `/metrics` endpoint will return
an empty response now. If you'd like to retain the default metrics, you can
import and register all default collectors as follows:

```python
[label main.py]
from flask import Flask
from prometheus_client import (
    CollectorRegistry,
    generate_latest,
    CONTENT_TYPE_LATEST,
[highlight]
    platform_collector,
    process_collector,
    gc_collector,
[/highlight]
)
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

registry = CollectorRegistry()

[highlight]
# Add default collectors to your registry
gc_collector.GCCollector(registry=registry)
platform_collector.PlatformCollector(registry=registry)
process_collector.ProcessCollector(registry=registry)
[/highlight]

. . .
```

With these modifications, the default metrics will be exposed along with any
custom metrics you register later on.

In the following sections, you will instrument the application with different
metric types, including Counters, Gauges, Histograms, and Summaries.

## Step 3 — Instrumenting a Counter metric

Let's start with a fundamental metric that tracks the total number of HTTP
requests made to the server. Since this value always increases, it is best
represented as a **Counter**.

Edit your `main.py` file to include counter instrumentation:

```python
[label main.py]
[highlight]
from flask import Flask, request
[/highlight]
from prometheus_client import (
    CollectorRegistry,
    generate_latest,
    CONTENT_TYPE_LATEST,
[highlight]
    Counter,
[/highlight]
)
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# Create a custom registry
registry = CollectorRegistry()

[highlight]
# Create a counter metric
http_requests_total = Counter(
    "http_requests_total",
    "Total number of HTTP requests received",
    ["status", "path", "method"],
    registry=registry,
)


@app.after_request
def after_request(response):
    """Increment counter after each request"""
    http_requests_total.labels(
        status=str(response.status_code), path=request.path, method=request.method
    ).inc()
    return response
[/highlight]

. . .
```

This implementation creates a Counter metric named `http_requests_total` with
labels for status code, path, and HTTP method. It uses Flask's `after_request()`
hook to automatically count all HTTP requests by incrementing the counter after
each request is processed and capturing the actual response status.

If you refresh `http://localhost:8000/metrics` several times, you'll see output
like:

```text
[output]
# HELP http_requests_total Total number of HTTP requests received
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/metrics",status="200"} 2.0
# HELP http_requests_created Total number of HTTP requests received
# TYPE http_requests_created gauge
http_requests_created{method="GET",path="/metrics",status="200"} 1.7397329609938126e+09
```

For each counter metric in your application, Prometheus Python client creates
two metrics:

1. The actual counter (`http_requests_total`)
2. A creation timestamp gauge (`http_requests_created`)

If you want to disable this behavior, you can use the
`disable_created_metrics()` function:

```python
[label main.py]
from flask import Flask, request
from prometheus_client import (
    CollectorRegistry,
    generate_latest,
    CONTENT_TYPE_LATEST,
    Counter,
[highlight]
    disable_created_metrics,
[/highlight]
)
from dotenv import load_dotenv
import os

load_dotenv()

[highlight]
disable_created_metrics()
[/highlight]

app = Flask(__name__)

registry = CollectorRegistry()
```

With this setup, you'll no longer see the `_created` metrics for all counters:

```command
curl http://localhost:8000/metrics
```

```text
[output]
# HELP http_requests_total Total number of HTTP requests received
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/metrics",status="200"} 9.0
http_requests_total{method="GET",path="/",status="200"} 2.0
```

You can view your metrics in the Prometheus client by heading to
`http://localhost:9090`. Then type `http_requests_total` into the query box and
click **Execute** to see the raw values:

![Python Counter metric in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6e009a9c-5fee-4de3-f0c2-f306320c7600/md2x =1581x548)

You can switch to the **Graph** tab to visualize the counter increasing over
time:

![Python Counter Graph in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/386616e4-7abd-405e-867d-19a22b2d9b00/orig =2368x1395)

In the next section, we'll explore how to instrument a Gauge metric!

## Step 4 — Instrumenting a Gauge metric

A **Gauge** represents a value that can fluctuate up or down, making it ideal
for tracking real-time values such as active connections, queue sizes, or memory
usage.

In this section, we'll use a Prometheus Gauge to monitor the number of active
requests being processed by the service.

Modify your `main.py` file to include the following:

```python
[label main.py]
from flask import Flask, request
from prometheus_client import (
    CollectorRegistry,
    generate_latest,
    CONTENT_TYPE_LATEST,
    Counter,
[highlight]
    Gauge,
[/highlight]
    disable_created_metrics,
)
from dotenv import load_dotenv
import os

. . .

[highlight]
# Define a Gauge metric for tracking active HTTP requests
active_requests_gauge = Gauge(
    "http_active_requests",
    "Number of active connections to the service",
    registry=registry
)

@app.before_request
def before_request():
    """Track start of request processing"""
    active_requests_gauge.inc()
[/highlight]

@app.after_request
def after_request(response):
    """Increment counter after each request"""
    http_requests_total.labels(
        status=str(response.status_code), path=request.path, method=request.method
    ).inc()
[highlight]
    active_requests_gauge.dec()
[/highlight]
    return response


. . .
```

The `active_requests_gauge` metric is created using `Gauge()` to track the
number of active HTTP requests at any given moment.

In the `before_request()` hook, the gauge is incremented when a new request
starts processing. In `after_request()`, the gauge is decremented when the
request is completed.

To observe the metric, you can add some random delay to the `/` route as
follows:

```python
[label main.py]
. . .
import os
[highlight]
import time
import random
[/highlight]

. . .

@app.route("/")
def hello():
[highlight]
    delay = random.uniform(1, 5)  # Random delay between 1 and 5 seconds
    time.sleep(delay)
[/highlight]
    return "Hello world!"

. . .
```

Then use a load testing tool like [wrk](https://github.com/wg/wrk) to generate
requests to the `/` route:

```command
wrk -t 10 -c 100 -d 1m --latency "http://localhost:8000"
```

Visiting the `/metrics` endpoint on your browser will show something like:

```text
[output]
. . .
# HELP http_active_requests Number of active connections to the service
# TYPE http_active_requests gauge
http_active_requests 101.0
```

This indicates that there are currently 101 active requests being processed by
your service.

You can also view the changing gauge values over time in Prometheus's Graph view
at `http://localhost:9090`:

![Python Gauge values in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/42f1f9d8-6313-4843-2841-b71c63074600/lg2x =2368x1395)

### Tracking absolute values

If you need a Gauge that tracks absolute but fluctuating values, you can set the
value directly instead of incrementing or decrementing it.

For example, to track the current memory usage of the Flask application, you can
define a gauge and use it to record the current memory usage of the process like
this:

```python
[label main.py]
. . .
[highlight]
import threading
import resource
[/highlight]

. . .

[highlight]
# Define a Gauge metric for tracking memory usage
memory_usage_gauge = Gauge(
    "memory_usage_bytes",
    "Current memory usage of the service in bytes",
    ["hostname"],
    registry=registry,
)

def collect_memory_metrics():
    """Background thread to collect memory metrics"""
    while True:
        memory = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        # Multiply by 1024 since maxrss is in KB on Unix
        memory_usage_gauge.labels(hostname="host1.domain.com").set(memory * 1024)
        time.sleep(1)


metrics_thread = threading.Thread(target=collect_memory_metrics, daemon=True)
metrics_thread.start()
[/highlight]

. . .
```

The `collect_memory_metrics()` function runs in a background thread to
continuously update the `memory_usage_gauge` metric every second. Here, `set()`
is used instead of inc/dec to set absolute values.

Here's the output you'll see in your `/metrics` endpoint:

```text
[output]
# HELP memory_usage_bytes Current memory usage of the service in bytes
# TYPE memory_usage_bytes gauge
memory_usage_bytes{hostname="host1.domain.com"} 3.4422784e+07
```

Next up, you'll instrument a Histogram metric to track HTTP request latency.

## Step 5 — Instrumenting a Histogram metric

Histograms are useful for tracking the distribution of measurements, such as
HTTP request durations. In Python, creating a Histogram metric is
straightforward with the `Histogram` class from `prometheus_client`.

Modify your `main.py` file to include the following:

```python
from flask import Flask, request
from prometheus_client import (
    CollectorRegistry,
    generate_latest,
    CONTENT_TYPE_LATEST,
    Counter,
    Gauge,
[highlight]
    Histogram,
[/highlight]
    disable_created_metrics,
)

. . .

[highlight]
# Define a Histogram metric for request duration
latency_histogram = Histogram(
    "http_request_duration_seconds",
    "Duration of HTTP requests",
    ["status", "path", "method"],
    registry=registry,
)
[/highlight]

@app.before_request
def before_request():
    """Track start of request processing"""
    active_requests_gauge.inc()
[highlight]
    request.start_time = time.time()
[/highlight]


@app.after_request
def after_request(response):
    """Increment counter after each request"""
    http_requests_total.labels(
        status=str(response.status_code), path=request.path, method=request.method
    ).inc()
    active_requests_gauge.dec()
[highlight]
    duration = time.time() - request.start_time
    latency_histogram.labels(
        status=str(response.status_code), path=request.path, method=request.method
    ).observe(duration)
[/highlight]
    return response

. . .
```

The `latency_histogram` metric is created to track the duration of each request
to the server. With such a metric, you can:

- Track response time distributions,
- Calculate percentiles (like p95, p99),
- Identify slow endpoints,
- Monitor performance trends over time.

Before a request is processed, the middleware stores the request start time.
After the request completes, the middleware calculates the total duration and
records it in the histogram.

After saving the file and refreshing the application a few times, visiting
`http://localhost:8000/metrics` will display the recorded histogram data:

```text
[output]
# HELP http_request_duration_seconds Duration of HTTP requests
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.005"} 0
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.01"} 0
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.025"} 4
. . .
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="+Inf"} 154
http_request_duration_seconds_sum{method="GET",path="/",status="200"} 68.487667757
http_request_duration_seconds_count{method="GET",path="/",status="200"} 154
```

Let's understand what this output means:

- Each `_bucket` line represents the number of requests that took less than or
  equal to a specific duration. For example, `le="0.025"} 4` means four requests
  completed within 25 milliseconds.
- The `_sum` value is the total of all observed durations.
- The `_count` value is the total number of observations.

The histogram uses these default buckets (in seconds):

```text
[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, +Inf]
```

If these buckets don't suit your needs, you can specify custom ones:

```python
latency_histogram = Histogram(
    'http_request_duration_seconds',
    'Duration of HTTP requests',
    ['status', 'path', 'method'],
    [highlight]
    buckets=[0.1, 0.5, 1, 2.5, 5, 10],  # Custom buckets in seconds
    [/highlight]
    registry=registry
)
```

The real power of histograms comes when analyzing them in Prometheus. For
example, to calculate the 99th percentile latency over a 1-minute window you can
use:

```promql
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[1m])) by (le))
```

![Histogram query in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0c7fc914-e2a2-48d2-44d8-d42f3d34cf00/public =2017x1374)

This query will show you the response time that 99% of requests fall under,
which is more useful than averages for understanding real user experience.

With the histogram metric successfully instrumented, the next step is to explore
how to track additional insights using a Summary metric.

## Step 6 — Instrumenting a Summary metric

A Summary metric in Prometheus is useful for capturing pre-aggregated quantiles,
such as the median, 95th percentile, or 99th percentile, while also providing
overall counts and sums for observed values.

Unlike a histogram, which allows aggregation across instances on the Prometheus
server, a Summary metric calculates quantiles directly on the client side. This
makes it valuable when quantile calculations need to be performed independently
per instance without relying on Prometheus for aggregation.

To set up a Summary metric for monitoring request latency, update your `main.py`
file as follows:

```python
from flask import Flask, request
from prometheus_client import (
    CollectorRegistry,
    generate_latest,
    CONTENT_TYPE_LATEST,
    Counter,
    Gauge,
    Histogram,
[highlight]
    Summary,
[/highlight]
    disable_created_metrics,
)
from dotenv import load_dotenv
import os
import time
import random
[highlight]
import requests
[/highlight]

. . .

[highlight]
posts_latency_summary = Summary(
    "post_request_duration_seconds",
    "Duration of requests to https://jsonplaceholder.typicode.com/posts",
    ["method"],
    registry=registry,
)
[/highlight]


. . .

[highlight]
@app.route("/posts")
def get_posts():
    start_time = time.time()

    try:
        response = requests.get("https://jsonplaceholder.typicode.com/posts")
        response.raise_for_status()
    except requests.RequestException as e:
        return str(e), 500
    finally:
        # Record the request duration in the summary
        duration = time.time() - start_time
        posts_latency_summary.labels(method="GET").observe(duration)

    return response.json()
[/highlight]
. . .
```

The `posts_latency_summary` metric tracks the duration of requests to an
external API. In the `/posts` endpoint, the start time of the request is
recorded before sending a GET request to the API.

Once the request completes, the duration is calculated and recorded in the
Summary metric using `posts_latency_summary.observe(duration)`.

After saving the your changes, add the `requests` package to your
`requirements.txt` file as follows:

```text
[label requirements.txt]
Flask==3.1.0
python-dotenv==1.0.1
prometheus_client
[highlight]
requests
[/highlight]
```

Then rebuild the `app` service with:

```command
docker compose up -d --build app
```

Once the service is up, send requests to the `/posts` endpoint using a tool like
`wrk` to generate latency data:

```command
wrk -t 1 -c 5 -d 10s --latency "http://localhost:8000/posts"
```

The metrics endpoint will show output like:

```text
[output]
# HELP post_request_duration_seconds Duration of requests to https://jsonplaceholder.typicode.com/posts
# TYPE post_request_duration_seconds summary
post_request_duration_seconds_count{method="GET"} 35.0
```

Unfortunately, the `prometheus_client` package does not currently support
quantiles which makes this output useless. To fix this, you may use the
[prometheus-summary package](https://github.com/RefaceAI/prometheus-summary)
instead. It is fully compatible with native client `Summary` class and adds
support of configurable quantiles:

```text
[label requirements.txt]
Flask==3.1.0
python-dotenv==1.0.1
prometheus_client
requests
[highlight]
prometheus-summary
[/highlight]
```

```python
[label main.py]
from prometheus_summary import Summary # Use this Summary class instead
. . .
```

Once you rebuild the `app` service and send some load to the `/posts` endpoint
once again, you will now see the `post_request_duration_seconds` metric with the
following precomputed quantiles:

```text
# HELP post_request_duration_seconds Duration of requests to https://jsonplaceholder.typicode.com/posts
# TYPE post_request_duration_seconds summary
post_request_duration_seconds{method="GET",quantile="0.5"} 0.3418126106262207
post_request_duration_seconds{method="GET",quantile="0.9"} 0.35525965690612793
post_request_duration_seconds{method="GET",quantile="0.99"} 0.49892544746398926
post_request_duration_seconds_count{method="GET"} 25.0
post_request_duration_seconds_sum{method="GET"} 8.648272037506104
```

The median request time is about 341 milliseconds (0.341 seconds), 90% of
requests complete within 355 milliseconds (0.355 seconds), and 99% complete
within 498 milliseconds (0.498 seconds).

If you'd like to customize the quantiles, you can provide the `invarients`
argument with quantile-precision pairs. The default is:

```text
((0.50, 0.05), (0.90, 0.01), (0.99, 0.001))
```

```python
posts_latency_summary = Summary(
    "post_request_duration_seconds",
    "Duration of requests to https://jsonplaceholder.typicode.com/posts",
    ["method"],
[highlight]
    invariants=((0.50, 0.05), (0.75, 0.02), (0.90, 0.01), (0.95, 0.005), (0.99, 0.001)),
[/highlight]
    registry=registry,
)
```

In the Prometheus web interface, entering the metric name will display recorded
latency values:

![Prometheus Summary metric](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d4397644-2cb9-44b1-a053-8c8e2c930400/md2x =2017x1374)

## Final thoughts

In this tutorial, we explored setting up and using Prometheus metrics in a
Python application.

We covered how to define and register different types of metrics - counters for
tracking cumulative values, gauges for fluctuating measurements, histograms for
understanding value distributions, and summaries for calculating client-side
quantiles.

To build on this foundation, you might want to:

- Set up [Prometheus Alertmanager](https://betterstack.com/community/guides/monitoring/prometheus-alertmanager/) to create alerts
  based on your metrics.
- Connect your metrics to [Grafana](https://betterstack.com/community/guides/monitoring/visualize-prometheus-metrics-grafana/) or
  [Better Stack](https://betterstack.com/telemetry) for powerful visualization
  and dashboarding.
- [Explore PromQL](https://betterstack.com/community/guides/monitoring/promql/) to write more sophisticated queries for analysis.

Don't forget to see the
[final code](https://github.com/betterstack-community/prometheus-python/tree/final)
used in this tutorial on GitHub.

Thanks for reading, and happy monitoring!