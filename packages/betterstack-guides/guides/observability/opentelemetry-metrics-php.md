# Instrumenting PHP Apps with OpenTelemetry Metrics

This article provides a detailed guide on integrating OpenTelemetry metrics into
your Laravel application.

It explores key concepts, including instrumenting your application with various
metric types, monitoring HTTP request activity, and exporting metrics to
visualization tools.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/UXGnIiS2pO0?si=RkvAxm4agVRggahE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Let's get started!

[ad-logs]

## Prerequisites

- Prior experience with PHP and Laravel, along with a recent version of PHP
  installed.
- Familiarity with Docker and [Docker Compose](https://betterstack.com/community/guides/scaling-docker/docker-compose-getting-started/).
- Basic understanding of [how OpenTelemetry works](https://betterstack.com/community/guides/observability/what-is-opentelemetry/).

## Step 1 — Setting up the demo project

To demonstrate OpenTelemetry instrumentation in Laravel applications, let's set
up a simple "Hello World" Laravel application along with the Prometheus server
for visualizing metrics.

First, create a new Laravel project:

```command
composer create-project laravel/laravel otel-laravel && cd otel-laravel
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

Create a `compose.yaml` file in your project root to set up both our application
and Prometheus server in Docker:

```yaml
[label compose.yaml]
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      APP_PORT: ${APP_PORT}
    env_file:
      - ./.env
    ports:
      - 8000:8000
    volumes:
      - .:/var/www/html

  collector:
    container_name: otel-metrics-demo-collector
    image: otel/opentelemetry-collector:latest
    volumes:
      - ./otelcol.yaml:/etc/otelcol/config.yaml
    networks:
      - otel-metrics-demo-network

volumes:
 prometheus_data:
```

The `app` service is the Laravel application running on port 8000, while
`collector` configures an OpenTelemetry Collector instance to receive the
metrics from the Laravel application.

Create a `Dockerfile` for the Laravel application:

```dockerfile
[label Dockerfile]
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
   git \
   curl \
   libpng-dev \
   libonig-dev \
   libxml2-dev \
   zip \
   unzip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy existing application directory contents
COPY . .

# Install dependencies
RUN composer install

# Expose port 8000
EXPOSE 8000

# Start PHP server
CMD php artisan serve --host=0.0.0.0 --port=8000
```

Create a `otelcol.yaml` configuration file:

```yaml
[label otelcol.yaml]
receivers:
  otlp:
    protocols:
      http:
        endpoint: otel-metrics-demo-collector:4318

processors:
  batch:

exporters:
  debug:

service:
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [debug]
```

Before starting the services, make sure your `.env` file contains the
application's `PORT` setting:

```text
[label .env]
APP_PORT=8000
```

Launch both services in detached mode with:

```command
docker compose up -d
```

You should see output indicating both containers have started successfully.

To confirm that the Laravel application is running, send a request to the root
endpoint:

```command
curl http://localhost:8000
```

This should return:

```text
Hello world!
```

To verify that Prometheus can access the exposed `/metrics` endpoint, visit
`http://localhost:9090/targets` in your browser.

With everything up and running, you're ready to integrate OpenTelemetry in your
Laravel application in the next step.

## Step 2 — Installing the OpenTelemetry SDK

Before instrumenting your Laravel application with OpenTelemetry, you need to
install the OpenTelemetry SDK for PHP.

Install the OpenTelemetry packages via Composer:

```command
composer require open-telemetry/sdk open-telemetry/exporter-prometheus open-telemetry/transport-grpc open-telemetry/sem-conv
```

Now, let's create a new service provider to handle OpenTelemetry configuration.
In Laravel, service providers are the central place to configure your
application's services:

```command
php artisan make:provider OpenTelemetryServiceProvider
```

Then edit `app/Providers/OpenTelemetryServiceProvider.php`:

```php
[label app/Providers/OpenTelemetryServiceProvider.php]
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use OpenTelemetry\SDK\Metrics\MeterProvider;
use OpenTelemetry\SDK\Metrics\MeterProviderInterface;
use OpenTelemetry\SDK\Resource\ResourceInfo;
use OpenTelemetry\SDK\Resource\ResourceInfoFactory;
use OpenTelemetry\SDK\Common\Attribute\Attributes;
use OpenTelemetry\Contrib\Otlp\MetricExporterFactory;
use OpenTelemetry\Contrib\Prometheus\MetricExporterFactory as PrometheusExporterFactory;
use OpenTelemetry\SDK\Metrics\View\View;
use OpenTelemetry\SemConv\ResourceAttributes;

class OpenTelemetryServiceProvider extends ServiceProvider
{
   public function register()
   {
       $this->app->singleton(MeterProviderInterface::class, function () {
           // Create a resource defining your application
           $resource = ResourceInfoFactory::defaultResource()->merge(
               ResourceInfo::create(Attributes::create([
                   ResourceAttributes::SERVICE_NAME => 'laravel-app',
                   ResourceAttributes::SERVICE_VERSION => '1.0.0',
               ]))
           );

           // Create the Prometheus exporter
           $prometheusExporter = (new PrometheusExporterFactory())->create();

           // Create and configure the meter provider
           $meterProvider = MeterProvider::builder()
               ->setResource($resource)
               ->addMetricExporter($prometheusExporter)
               ->build();

           return $meterProvider;
       });
   }
}
```

This provider:

- Creates a singleton instance of `MeterProviderInterface`, which is the central
  registry for all OpenTelemetry metrics in your application
- Sets up a resource that identifies your application with metadata
- Configures a Prometheus exporter for metrics
- Builds a meter provider that will collect metrics and make them available to
  Prometheus

Register the provider in `config/app.php`:

```php
[label config/app.php]
'providers' => [
   // Other providers...
   App\Providers\OpenTelemetryServiceProvider::class,
],
```

Now, let's create a controller to handle the metrics endpoint. Run:

```command
php artisan make:controller MetricsController
```

Update the controller at `app/Http/Controllers/MetricsController.php`:

```php
[label app/Http/Controllers/MetricsController.php]
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenTelemetry\SDK\Metrics\MeterProviderInterface;
use OpenTelemetry\Contrib\Prometheus\MetricExporterFactory;

class MetricsController extends Controller
{
   protected $meterProvider;

   public function __construct(MeterProviderInterface $meterProvider)
   {
       $this->meterProvider = $meterProvider;
   }

   public function metrics()
   {
       // Get the Prometheus exporter and render metrics
       $factory = new MetricExporterFactory();
       $exporter = $factory->create();
       $metrics = $exporter->getPrometheusRenderer()->render();

       return response($metrics)
           ->header('Content-Type', 'text/plain');
   }
}
```

Update your metrics endpoint in `routes/web.php`:

```php
[label routes/web.php]
use App\Http\Controllers\MetricsController;

Route::get('/metrics', [MetricsController::class, 'metrics']);
```

After implementing these changes, the `/metrics` endpoint will expose metrics in
a Prometheus-compatible format. Visit `http://localhost:8000/metrics` in your
browser or use `curl` to see the response:

```command
curl http://localhost:8000/metrics
```

Currently, the response will include basic information but no custom metrics
since we haven't registered any yet. In the following sections, we'll instrument
the application with different metric types.

## Step 3 — Implementing a Counter Metric

Let's start with a Counter that tracks the total number of HTTP requests made to
your Laravel application. A Counter is a cumulative metric that can only
increase or reset to zero and is ideal for tracking total events or operations.

Create a middleware to handle the metrics collection:

```command
php artisan make:middleware OpenTelemetryMiddleware
```

Then edit `app/Http/Middleware/OpenTelemetryMiddleware.php`:

```php
[label app/Http/Middleware/OpenTelemetryMiddleware.php]
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use OpenTelemetry\SDK\Metrics\MeterProviderInterface;
use OpenTelemetry\API\Metrics\CounterInterface;

class OpenTelemetryMiddleware
{
   private $meterProvider;
   private $requestCounter;

   public function __construct(MeterProviderInterface $meterProvider)
   {
       $this->meterProvider = $meterProvider;

       $meter = $meterProvider->getMeter('laravel-app');

       // Create a counter for total HTTP requests
       $this->requestCounter = $meter->createCounter(
           'http.requests.total',
           'Total number of HTTP requests',
           'requests'
       );
   }

   public function handle(Request $request, Closure $next)
   {
       $response = $next($request);

       // Increment the counter with appropriate attributes
       $this->requestCounter->add(1, [
           'status' => $response->getStatusCode(),
           'path' => $request->path() === '/' ? 'root' : $request->path(),
           'method' => $request->method()
       ]);

       return $response;
   }
}
```

This implementation:

1. Creates a meter from our meter provider with a namespace of 'laravel-app'
2. Creates a Counter metric named `http.requests.total` with a description and
   unit
3. Increments the counter after each request, adding attributes for status code,
   path, and HTTP method

Register the middleware in `app/Http/Kernel.php`:

```php
[label app/Http/Kernel.php]
protected $middleware = [
   // ...
   \App\Http\Middleware\OpenTelemetryMiddleware::class,
];
```

If you refresh `http://localhost:8000/metrics` several times, you'll see output
like:

```text
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{status="200",path="metrics",method="GET"} 2
http_requests_total{status="200",path="root",method="GET"} 1
```

You can view your metrics in the Prometheus UI by heading to
`http://localhost:9090`. Type `http_requests_total` into the query box and click
Execute to see the raw values and visualize the counter increasing over time.

## Step 4 — Implementing a Gauge Metric

A Gauge is a metric that represents a single numerical value that can
arbitrarily go up and down. Gauges are perfect for measuring values like current
memory usage, active connections, or queue sizes.

Let's update our middleware to track active requests with a gauge:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use OpenTelemetry\SDK\Metrics\MeterProviderInterface;
use OpenTelemetry\API\Metrics\CounterInterface;
use OpenTelemetry\API\Metrics\UpDownCounterInterface;

class OpenTelemetryMiddleware
{
   private $meterProvider;
   private $requestCounter;
   private $activeRequestsGauge;

   public function __construct(MeterProviderInterface $meterProvider)
   {
       $this->meterProvider = $meterProvider;

       $meter = $meterProvider->getMeter('laravel-app');

       // Create a counter for total HTTP requests
       $this->requestCounter = $meter->createCounter(
           'http.requests.total',
           'Total number of HTTP requests',
           'requests'
       );

       // Create a gauge (implemented as an up-down counter) for active requests
       $this->activeRequestsGauge = $meter->createUpDownCounter(
           'http.requests.active',
           'Number of active HTTP requests',
           'requests'
       );
   }

   public function handle(Request $request, Closure $next)
   {
       // Increment the active requests gauge before processing
       $this->activeRequestsGauge->add(1, [
           'path' => $request->path() === '/' ? 'root' : $request->path(),
       ]);

       $response = $next($request);

       // Increment the total requests counter
       $this->requestCounter->add(1, [
           'status' => $response->getStatusCode(),
           'path' => $request->path() === '/' ? 'root' : $request->path(),
           'method' => $request->method()
       ]);

       // Decrement the active requests gauge after processing
       $this->activeRequestsGauge->add(-1, [
           'path' => $request->path() === '/' ? 'root' : $request->path(),
       ]);

       return $response;
   }
}
```

In OpenTelemetry, gauges are typically implemented using an UpDownCounter, which
allows both incrementing and decrementing the value. Our implementation:

1. Creates an UpDownCounter metric named `http.requests.active`
2. Increments it at the start of request processing
3. Decrements it when the request completes

To observe the gauge in action, let's add some artificial delay to the root
route. Update your `routes/web.php`:

```php
Route::get('/', function () {
   $delay = random_int(1, 5);  // Random delay between 1 and 5 seconds
   sleep($delay);
   return 'Hello world!';
});
```

Now use a load testing tool like [wrk](https://github.com/wg/wrk) or simply open
multiple browser tabs to generate concurrent requests. Visiting the `/metrics`
endpoint will show something like:

```text
# HELP http_requests_active Number of active HTTP requests
# TYPE http_requests_active gauge
http_requests_active{path="root"} 8
```

This indicates that there are currently 8 active requests being processed by
your Laravel application.

### Tracking absolute values

Gauges are also perfect for tracking absolute values like memory usage. Let's
add memory metrics to our middleware:

```php
public function __construct(MeterProviderInterface $meterProvider)
{
   // Previous metrics...

   // Create a gauge for memory usage
   $this->memoryGauge = $meter->createUpDownCounter(
       'app.memory_usage_bytes',
       'Current memory usage in bytes',
       'bytes'
   );
}

public function handle(Request $request, Closure $next)
{
   // Previous metric collection...

   // Record current memory usage
   $memoryUsage = memory_get_usage(true);

   // Reset the gauge value (since we want absolute value, not incremental)
   $this->memoryGauge->add($memoryUsage, ['type' => 'real']);

   return $response;
}
```

This will produce metrics showing your application's memory usage over time,
which can be visualized in Prometheus's Graph view.

## Step 5 — Implementing a Histogram Metric

Histograms are useful for tracking the distribution of measurements, such as
request durations. They observe values and count them in configurable buckets,
allowing you to understand the distribution of values.

Let's update our middleware to track HTTP request durations with a histogram:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use OpenTelemetry\SDK\Metrics\MeterProviderInterface;
use OpenTelemetry\API\Metrics\CounterInterface;
use OpenTelemetry\API\Metrics\UpDownCounterInterface;
use OpenTelemetry\API\Metrics\HistogramInterface;

class OpenTelemetryMiddleware
{
   private $meterProvider;
   private $requestCounter;
   private $activeRequestsGauge;
   private $requestDurationHistogram;

   public function __construct(MeterProviderInterface $meterProvider)
   {
       $this->meterProvider = $meterProvider;

       $meter = $meterProvider->getMeter('laravel-app');

       // Previous metrics...

       // Create a histogram for request durations
       $this->requestDurationHistogram = $meter->createHistogram(
           'http.request.duration',
           'HTTP request duration in seconds',
           's'  // seconds
       );
   }

   public function handle(Request $request, Closure $next)
   {
       // Increment active requests gauge
       $this->activeRequestsGauge->add(1, [
           'path' => $request->path() === '/' ? 'root' : $request->path(),
       ]);

       // Start timing the request
       $startTime = microtime(true);

       $response = $next($request);

       // Calculate request duration
       $duration = microtime(true) - $startTime;

       // Increment request counter
       $this->requestCounter->add(1, [
           'status' => $response->getStatusCode(),
           'path' => $request->path() === '/' ? 'root' : $request->path(),
           'method' => $request->method()
       ]);

       // Record request duration in the histogram
       $this->requestDurationHistogram->record($duration, [
           'status' => $response->getStatusCode(),
           'path' => $request->path() === '/' ? 'root' : $request->path(),
           'method' => $request->method()
       ]);

       // Decrement active requests gauge
       $this->activeRequestsGauge->add(-1, [
           'path' => $request->path() === '/' ? 'root' : $request->path(),
       ]);

       return $response;
   }
}
```

This implementation:

1. Creates a Histogram metric named `http.request.duration`
2. Measures the duration of each request using microtime()
3. Records the duration in the histogram with the same attributes we use for the
   counter

After generating some traffic to your application, the `/metrics` endpoint will
show histogram data like this:

```text
# HELP http_request_duration HTTP request duration in seconds
# TYPE http_request_duration histogram
http_request_duration_bucket{status="200",path="root",method="GET",le="0.005"} 0
http_request_duration_bucket{status="200",path="root",method="GET",le="0.01"} 0
http_request_duration_bucket{status="200",path="root",method="GET",le="0.025"} 0
http_request_duration_bucket{status="200",path="root",method="GET",le="0.05"} 0
http_request_duration_bucket{status="200",path="root",method="GET",le="0.1"} 0
http_request_duration_bucket{status="200",path="root",method="GET",le="0.25"} 0
http_request_duration_bucket{status="200",path="root",method="GET",le="0.5"} 3
http_request_duration_bucket{status="200",path="root",method="GET",le="1"} 8
http_request_duration_bucket{status="200",path="root",method="GET",le="2.5"} 18
http_request_duration_bucket{status="200",path="root",method="GET",le="5"} 25
http_request_duration_bucket{status="200",path="root",method="GET",le="10"} 25
http_request_duration_bucket{status="200",path="root",method="GET",le="+Inf"} 25
http_request_duration_sum{status="200",path="root",method="GET"} 47.423
http_request_duration_count{status="200",path="root",method="GET"} 25
```

Let's understand this output:

- Each `_bucket` line shows how many requests completed within a specific time
  threshold
- For example, `le="1"} 8` means 8 requests completed within 1 second
- The `_sum` value is the total of all observed durations
- The `_count` value is the total number of observations

This data allows you to analyze the distribution of request durations. In
Prometheus, you can calculate the 95th percentile latency using:

```promql
histogram_quantile(0.95, sum(rate(http_request_duration_bucket[5m])) by (le))
```

This shows the response time that 95% of requests fall under, which is more
useful than averages for understanding real user experience.

## Step 6 — Monitoring External API Calls

Let's create a service to monitor external API calls using OpenTelemetry:

```command
php artisan make:service ExternalApiService
```

Edit `app/Services/ExternalApiService.php`:

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use OpenTelemetry\SDK\Metrics\MeterProviderInterface;
use OpenTelemetry\API\Metrics\HistogramInterface;

class ExternalApiService
{
   private $meterProvider;
   private $apiLatencyHistogram;

   public function __construct(MeterProviderInterface $meterProvider)
   {
       $this->meterProvider = $meterProvider;

       $meter = $meterProvider->getMeter('laravel-app');

       // Create a histogram for API call durations
       $this->apiLatencyHistogram = $meter->createHistogram(
           'external_api.request.duration',
           'External API request duration in seconds',
           's'
       );
   }

   public function getPosts()
   {
       $startTime = microtime(true);

       try {
           $response = Http::get('https://jsonplaceholder.typicode.com/posts');
           $response->throw();
           return $response->json();
       } finally {
           $duration = microtime(true) - $startTime;

           // Record the API call duration
           $this->apiLatencyHistogram->record($duration, [
               'api' => 'jsonplaceholder',
               'endpoint' => '/posts'
           ]);
       }
   }
}
```

Add a new route to test the external API service:

```php
use App\Services\ExternalApiService;

Route::get('/posts', function (ExternalApiService $service) {
   return $service->getPosts();
});
```

This service:

1. Creates a Histogram to track external API call durations
2. Measures the duration of each API call
3. Records the duration with metadata about which API and endpoint was called
4. Uses a try-finally block to ensure timing is recorded even if errors occur

## Final thoughts

In this tutorial, we integrated OpenTelemetry metrics into a Laravel
application. We implemented counters for tracking requests, gauges for
monitoring active connections and memory usage, and histograms for analyzing
response time distributions.

Thanks for reading!
