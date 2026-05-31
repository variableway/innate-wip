# PHP and Laravel Monitoring with Prometheus

This article provides a detailed guide on integrating [Prometheus
metrics](https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/) into your Laravel application.

It explores key concepts, including instrumenting your application with various
metric types, monitoring HTTP request activity, and exposing metrics for
Prometheus to scrape.

The complete source code for this tutorial is available in this GitHub
repository.

Let's get started!

[ad-logs]

## Prerequisites

- Prior experience with PHP and Laravel, along with a recent version of PHP
  installed.
- Familiarity with Docker and [Docker Compose](https://betterstack.com/community/guides/scaling-docker/docker-compose-getting-started/).
- Basic understanding of [how Prometheus works](https://betterstack.com/community/guides/monitoring/prometheus/).

## Step 1 — Setting up the demo project

To demonstrate Prometheus instrumentation in Laravel applications, let's set up
a simple "Hello World" Laravel application along with the Prometheus server.

First, clone the repository to your local machine and navigate into the project
directory:

```command
git clone https://github.com/betterstack-community/prometheus-laravel
```

```command
cd prometheus-laravel
```

Here's the Laravel route configuration you'll be instrumenting:

```php
[label routes/web.php]
<?php

use Illuminate\Support\Facades\Route;

Route::get('/metrics', function () {
    return response('', 200);
});

Route::get('/', function () {
    return 'Hello world!';
});
```

This app exposes two endpoints: `/` returns a simple "Hello world!" message, and
`/metrics` endpoint that will eventually expose the instrumented metrics.

This project also includes a `compose.yaml` file, which defines two services:

```yaml
[label compose.yaml]
services:
  app:
    build:
      conpromql: .
      dockerfile: Dockerfile
    environment:
      APP_PORT: ${APP_PORT}
    env_file:
      - ./.env
    ports:
      - 8000:8000
    volumes:
      - .:/var/www/html

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

The `app` service is the Laravel application running on port 8000, while
`prometheus` configures a Prometheus server to scrape the Laravel app via the
`prometheus.yml` file:

```yaml
[label prometheus.yaml]
global:
  scrape_interval: 10s

scrape_configs:
  - job_name: laravel-app
    static_configs:
      - targets:
          - app:8000
```

Before starting the services, rename `.env.example` to `.env`. This file
contains the application's `PORT` setting:

```command
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

```promql
[output]
[+] Running 3/3
 ✔ Network prometheus-laravel_default  Created                    0.8s
 ✔ Container prometheus               Started                    1.3s
 ✔ Container app                      Started                    1.3s
```

To confirm that the Laravel application is running, send a request to the root
endpoint:

```command
curl http://localhost:8000
```

```command
[output]
Hello world
```

To verify that Prometheus is able to access the exposed `/metrics` endpoint,
visit `http://localhost:9090/targets` in your browser:

![Target in prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/781ca1dc-eced-45ca-b91e-8076d09afa00/md1x =1520x475)

With everything up and running, you're ready to integrate Prometheus in your
Laravel application in the next step.

## Step 2 — Installing the Prometheus client

Before instrumenting your Laravel application with Prometheus, you need to
install a Prometheus client package for PHP.

We'll use the popular
[promphp/prometheus_client_php](https://github.com/PromPHP/prometheus_client_php)
package, which provides a comprehensive PHP implementation of [Prometheus metric
types](https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/).

Install it via Composer:

```command
composer require promphp/prometheus_client_php
```

Now, let's create a new service provider to handle Prometheus configuration. In
Laravel, service providers are the central place to configure your application's
services:

```command
php artisan make:provider PrometheusServiceProvider
```

Then edit `app/Providers/PrometheusServiceProvider.php`:

```php
[label app/Providers/PrometheusServiceProvider.php]
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Prometheus\CollectorRegistry;
use Prometheus\Storage\APC;

class PrometheusServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(CollectorRegistry::class, function () {
            return new CollectorRegistry(new APC());
        });
    }
}
```

This provider creates a singleton instance of `CollectorRegistry`, which is the
central registry for all Prometheus metrics in your application.

For simplicity, we're using in-memory storage (`InMemory`), but in production,
you might want to use Redis or another persistent storage adapter.

Register the provider in `config/app.php`:

```php
[label config/app.php]
'providers' => [
    // Other providers...
    App\Providers\PrometheusServiceProvider::class,
],
```

Now update your metrics endpoint in `routes/web.php` to expose the metrics:

```php
[label routes/web.php]
<?php

use Prometheus\CollectorRegistry;
use Prometheus\RenderTextFormat;

Route::get('/metrics', function (CollectorRegistry $registry) {
    $renderer = new RenderTextFormat();
    return response($renderer->render($registry->getMetricFamilySamples()))
        ->header('Content-Type', RenderTextFormat::MIME_TYPE);
});
```

This endpoint will expose metrics in a Prometheus-compatible format. Visit
`http://localhost:8000/metrics` in your browser or use `curl` to see the
response:

```command
curl http://localhost:8000/metrics
```

Currently, the response will be empty since we haven't registered any metrics
yet. In the following sections, we'll instrument the application with different
metric types.

## Step 3 — Instrumenting a Counter metric

Let's start with a fundamental metric that tracks the total number of HTTP
requests made to your Laravel application. Since this value always increases, it
is best represented as a Counter.

A Counter in Prometheus is a cumulative metric that represents a single
monotonically increasing counter. It can only increase or be reset to zero on
restart. Counters are perfect for metrics like:

- Total number of requests
- Total number of completed tasks
- Total number of errors

Create a new middleware to handle the metrics collection:

```php
[label app/Http/Middleware/PrometheusMiddleware.php]
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Prometheus\CollectorRegistry;

class PrometheusMiddleware
{
    private $registry;
    private $counter;

    public function __construct(CollectorRegistry $registry)
    {
        $this->registry = $registry;
        $this->counter = $registry->getOrRegisterCounter(
            'app',
            'http_requests_total',
            'Total number of HTTP requests',
            ['status', 'path', 'method']
        );
    }

    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $this->counter->inc([
            'status' => $response->getStatusCode(),
            'path' => $request->path(),
            'method' => $request->method()
        ]);

        return $response;
    }
}
```

This implementation creates a Counter metric named `http_requests_total` with
labels for status code, path, and HTTP method. The middleware uses Laravel's
HTTP lifecycle to automatically count all requests by incrementing the counter
after each request is processed.

Register the middleware in `app/Http/Kernel.php`:

```php
[label app/Http/Kernel.php]
protected $middleware = [
    // ...
    \App\Http\Middleware\PrometheusMiddleware::class,
];
```

If you refresh `http://localhost:8000/metrics` several times, you'll see output
like:

```promql
# HELP app_http_requests_total Total number of HTTP requests
# TYPE app_http_requests_total counter
app_http_requests_total{status="200",path="metrics",method="GET"} 2
app_http_requests_total{status="200",path="/",method="GET"} 1
```

You can view your metrics in the Prometheus UI by heading to
`http://localhost:9090`. Type `app_http_requests_total` into the query box and
click Execute to see the raw values:

![Python Counter metric in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6e009a9c-5fee-4de3-f0c2-f306320c7600/md2x =1581x548)

Switch to the Graph tab to visualize the counter increasing over time:

![Python Counter Graph in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/386616e4-7abd-405e-867d-19a22b2d9b00/orig =2368x1395)

## Step 4 — Instrumenting a Gauge metric

A Gauge represents a value that can fluctuate up or down, making it ideal for
tracking real-time values such as active connections, queue sizes, or memory
usage. Unlike Counters that only increase, Gauges can both increase and
decrease.

In this section, we'll use a Prometheus Gauge to monitor the number of active
requests being processed by your Laravel application. Update your
`PrometheusMiddleware.php`:

```php
[label app/Http/Middleware/PrometheusMiddleware.php]
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Prometheus\CollectorRegistry;

class PrometheusMiddleware
{
    private $registry;
    private $counter;
    private $gauge;

    public function __construct(CollectorRegistry $registry)
    {
        $this->registry = $registry;

        // Previous counter definition...

        $this->gauge = $this->registry->getOrRegisterGauge(
            'app',                         // namespace
            'http_active_requests',        // name
            'Number of active HTTP requests', // help text
        );
    }

    public function handle(Request $request, Closure $next)
    {
        $this->gauge->inc();  // Increment before processing

        $response = $next($request);

        $this->counter->inc([
            $response->getStatusCode(),
            $request->path(),
            $request->method()
        ]);

        $this->gauge->dec();  // Decrement after processing

        return $response;
    }
}
```

The `http_active_requests` gauge metric is incremented when a new request starts
processing and decremented when the request completes.

To observe the gauge in action, let's add some artificial delay to the root
route to simulate longer-running requests. Update your `routes/web.php`:

```php
[label routes/web.php]
Route::get('/', function () {
    $delay = random_int(1, 5);  // Random delay between 1 and 5 seconds
    sleep($delay);
    return 'Hello world!';
});
```

Now use a load testing tool like [wrk](https://github.com/wg/wrk) to generate
concurrent requests:

```command
wrk -t 10 -c 100 -d 1m --latency "http://localhost:8000"
```

Visiting the `/metrics` endpoint will show something like:

```promql
# HELP app_http_active_requests Number of active HTTP requests
# TYPE app_http_active_requests gauge
app_http_active_requests 42
```

This indicates that there are currently 42 active requests being processed by
your Laravel application.

### Tracking absolute values

Gauges are also perfect for tracking absolute but fluctuating values. For
example, to track the current memory usage of your Laravel application, you can
modify the middleware:

```php
class PrometheusMiddleware
{
    public function __construct(CollectorRegistry $registry)
    {
        // Previous metrics...

        $this->memoryGauge = $this->registry->getOrRegisterGauge(
            'app',
            'memory_usage_bytes',
            'Current memory usage in bytes',
            ['type']
        );
    }

    public function handle(Request $request, Closure $next)
    {
        // Previous metric collection...

        // Set absolute memory values
        $this->memoryGauge->set(
            memory_get_usage(true),
            ['real']
        );
        $this->memoryGauge->set(
            memory_get_usage(false),
            ['emalloc']
        );

        return $response;
    }
}
```

This will produce metrics like:

```text
# HELP app_memory_usage_bytes Current memory usage in bytes
# TYPE app_memory_usage_bytes gauge
app_memory_usage_bytes{type="real"} 6291456
app_memory_usage_bytes{type="emalloc"} 2097152
```

You can visualize these gauge values over time in Prometheus's Graph view at
`http://localhost:9090`:

![PHP Gauge values in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/42f1f9d8-6313-4843-2841-b71c63074600/lg2x =2368x1395)

## Step 5 — Instrumenting a Histogram metric

Histograms are useful for tracking the distribution of measurements, such as
request durations. A histogram samples observations (usually request durations
or response sizes) and counts them in configurable buckets.

Let's instrument your Laravel application with a histogram to track HTTP request
durations. Update your `PrometheusMiddleware.php`:

```php
[label app/Http/Middleware/PrometheusMiddleware.php]
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Prometheus\CollectorRegistry;

class PrometheusMiddleware
{
    private $registry;
    private $counter;
    private $gauge;
    private $histogram;

    public function __construct(CollectorRegistry $registry)
    {
        $this->registry = $registry;

        // Previous metrics...

        $this->histogram = $registry->getOrRegisterHistogram(
            'app',
            'http_request_duration_seconds',
            'HTTP request duration in seconds',
            ['status', 'path', 'method'],
            [0.1, 0.25, 0.5, 1, 2.5, 5]
        );
    }

    public function handle(Request $request, Closure $next)
    {
        $this->gauge->inc();
        $start = microtime(true);

        $response = $next($request);

        $duration = microtime(true) - $start;

        $this->counter->inc([
            'status' => $response->getStatusCode(),
            'path' => $request->path(),
            'method' => $request->method()
        ]);

        $this->histogram->observe(
            $duration,
            [
                'status' => $response->getStatusCode(),
                'path' => $request->path(),
                'method' => $request->method()
            ]
        );

        $this->gauge->dec();

        return $response;
    }
}
```

After generating some traffic to your application, the `/metrics` endpoint will
show histogram data like this:

```promql
# HELP app_http_request_duration_seconds HTTP request duration in seconds
# TYPE app_http_request_duration_seconds histogram
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="0.1"} 12
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="0.25"} 25
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="0.5"} 45
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="0.75"} 78
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="1.0"} 89
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="2.5"} 95
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="5.0"} 98
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="7.5"} 99
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="10.0"} 100
app_http_request_duration_seconds_bucket{status="200",path="/",method="GET",le="+Inf"} 100
app_http_request_duration_seconds_sum{status="200",path="/",method="GET"} 47.423
app_http_request_duration_seconds_count{status="200",path="/",method="GET"} 100
```

Let's understand what this output means:

- Each `_bucket` line represents the number of requests that took less than or
  equal to a specific duration. For example, `le="0.5"}` 45 means 45 requests
  completed within 0.5 seconds.
- The `_sum` value (47.423) is the total of all observed durations.
- The `_count` value (100) is the total number of observations.

This data allows you to analyze the distribution of request durations. For
example, in Prometheus you can calculate the 95th percentile latency using:

```promql
histogram_quantile(0.95, sum(rate(app_http_request_duration_seconds_bucket[5m])) by (le))
```

This query shows the response time that 95% of requests fall under, which is
more useful than averages for understanding real user experience.

![Histogram query in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0c7fc914-e2a2-48d2-44d8-d42f3d34cf00/public =2017x1374)

## Step 6 — Instrumenting a Summary metric

A Summary metric in Prometheus is similar to a histogram but calculates
quantiles on the client side. This makes it valuable when you need precise
quantiles per instance without relying on Prometheus for aggregation.

Let's create a service to monitor external API calls using a Summary metric:

```command
php artisan make:service ExternalApiService
```

Edit `app/Services/ExternalApiService.php`:

```php
[label app/Services/PostsService.php]
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Prometheus\CollectorRegistry;

class PostsService
{
    private $registry;
    private $summary;

    public function __construct(CollectorRegistry $registry)
    {
        $this->registry = $registry;
        $this->summary = $registry->getOrRegisterSummary(
            'app',
            'external_api_request_duration_seconds',
            'Duration of external API requests',
            ['endpoint']
        );
    }

    public function getPosts()
    {
        $start = microtime(true);

        try {
            $response = Http::get('https://jsonplaceholder.typicode.com/posts');
            $response->throw();
            return $response->json();
        } finally {
            $duration = microtime(true) - $start;
            $this->summary->observe($duration, ['endpoint' => 'posts']);
        }
    }
}
```

Add a new route to test the summary metric:

```php
[label routes/web.php]
use App\Services\PostsService;

Route::get('/posts', function (PostsService $service) {
    return $service->getPosts();
});
```

The summary metrics will look like this:

```promql
# HELP app_external_api_request_duration_seconds External API request duration in seconds
# TYPE app_external_api_request_duration_seconds summary
app_external_api_request_duration_seconds{endpoint="posts",quantile="0.5"} 0.342
app_external_api_request_duration_seconds{endpoint="posts",quantile="0.9"} 0.456
app_external_api_request_duration_seconds{endpoint="posts",quantile="0.99"} 0.891
app_external_api_request_duration_seconds_sum{endpoint="posts"} 12.423
app_external_api_request_duration_seconds_count{endpoint="posts"} 32
```

This tells us that:

- The median (50th percentile) request time is 342ms
- 90% of requests complete within 456ms
- 99% of requests complete within 891ms
- We've made 32 requests with a total duration of 12.423 seconds

![Prometheus Summary metric](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d4397644-2cb9-44b1-a053-8c8e2c930400/md2x =2017x1374)

## Final thoughts

We've explored how to integrate Prometheus metrics into a Laravel application,
covering the setup of monitoring infrastructure and the implementation of
different metric types. Through this tutorial, you've learned how to use
Counters for tracking cumulative values, Gauges for fluctuating measurements,
Histograms for value distributions, and Summaries for client-side quantiles.

To build on this foundation, you might want to set up [Prometheus
Alertmanager](https://betterstack.com/community/guides/monitoring/prometheus-alertmanager/) for metric-based alerts, connect your
metrics to [Better Stack](https://betterstack.com/telemetry) or other
visualization tools, explore [PromQL](https://betterstack.com/community/guides/monitoring/promql/) for sophisticated queries, and add
business-specific metrics for your application.

The metrics we've implemented provide a solid starting point for monitoring your
Laravel application, but they're just the beginning. Consider what aspects of
your specific application would benefit from monitoring, and extend these
patterns to create a comprehensive observability solution that meets your needs.

Thanks for reading, and happy monitoring!
