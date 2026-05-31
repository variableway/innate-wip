# Ruby on Rails Monitoring with Prometheus

This article provides a detailed guide on integrating Prometheus metrics into
your Ruby on Rails application.

It explores key concepts, including instrumenting your application with various
metric types, monitoring HTTP request activity, and exposing metrics for
Prometheus to scrape.

Let's get started!

[ad-logs]

## Prerequisites

- Prior experience with
  [Ruby on Rails](https://guides.rubyonrails.org/install_ruby_on_rails.html),
  along with a recent version of Ruby installed.
- Familiarity with Docker and Docker Compose.
- Basic understanding of [how Prometheus works](https://betterstack.com/community/guides/monitoring/prometheus/).

## Step 1 — Setting up the demo project

To demonstrate Prometheus instrumentation in Rails applications, let's set up a
simple "Hello World" Rails application along with the Prometheus server.

First, create a new Rails application and navigate into the project directory:

```command
rails new prometheus-rails-demo --minimal
```

```command
cd prometheus-rails-demo
```

Let's create a simple controller with two routes - one for our main page and one
for our metrics endpoint:

```ruby
[label app/controllers/home_controller.rb]
class HomeController < ApplicationController
 def index
   render plain: 'Hello world!'
 end

 def metrics
   render plain: '', status: 200
 end
end
```

Update your routes file to include these endpoints:

```ruby
[label config/routes.rb]
Rails.application.routes.draw do
 root 'home#index'
 get '/metrics', to: 'home#metrics'
end
```

This app exposes two endpoints: root (`/`) returns a simple "Hello world!"
message, and a `/metrics` endpoint that will eventually expose the instrumented
metrics.

Next, create a `Dockerfile` in your project root:

```dockerfile
[label Dockerfile]
FROM ruby:3.2

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

CMD ["rails", "server", "-b", "0.0.0.0"]
```

Now, create a `compose.yaml` file to set up both the Rails application and
Prometheus server:

```yaml
[label compose.yaml]
services:
 app:
   build:
     context: .
   environment:
     PORT: 3000
     RAILS_ENV: development
   ports:
     - 3000:3000
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

The `app` service is the Rails application running on port `3000`, while
`prometheus` configures a Prometheus server to scrape the Rails app via the
`prometheus.yml` file, which we'll create next:

```yaml
[label prometheus.yml]
global:
 scrape_interval: 10s

scrape_configs:
 - job_name: rails-app
   static_configs:
     - targets:
         - app:3000
```

Launch both services in detached mode with:

```command
docker compose up -d
```

To confirm that the Rails application is running, send a request to the root
endpoint:

```command
curl http://localhost:3000
```

This should return:

```text
Hello world!
```

To verify that Prometheus is able to access the exposed `/metrics` endpoint,
visit `http://localhost:9090/targets` in your browser. With everything up and
running, you're ready to integrate Prometheus in your Ruby on Rails application
in the next step.

## Step 2 — Installing the Prometheus client

Before instrumenting your Rails application with Prometheus, you need to install
the official Prometheus client for Ruby applications.

Add the `prometheus-client` gem to your `Gemfile`:

```ruby
[label Gemfile]
gem 'prometheus-client'
```

Then install the gem:

```command
bundle install
```

Then rebuild the `app` service to ensure that the `prometheus-client` dependency
is installed:

```command
docker compose up -d --build app
```

Once the `app` service restarts, integrate Prometheus into your application by
modifying the `metrics` action in your controller:

```ruby
[label app/controllers/home_controller.rb]
require 'prometheus/client'
require 'prometheus/client/formats/text'

class HomeController < ApplicationController
  def index
    render plain: 'Hello world!'
  end

  def metrics
    content_type = Prometheus::Client::Formats::Text::CONTENT_TYPE
    render plain: Prometheus::Client::Formats::Text.marshal(Prometheus::Client.registry),
           content_type: content_type
  end
end
```

This modification introduces the `prometheus-client` gem and its functionality
to collect and return metrics in a format that Prometheus can scrape.

Once you've saved the file, visit `http://localhost:3000/metrics` in your
browser or use `curl` to see the default Prometheus metrics:

```command
curl http://localhost:3000/metrics
```

By default, Prometheus uses a global registry that automatically includes
standard Ruby runtime metrics. If you want to use a custom registry to expose
only specific metrics, modify your controller:

```ruby
[label app/controllers/home_controller.rb]
require 'prometheus/client'
require 'prometheus/client/formats/text'

class HomeController < ApplicationController
  # Create a custom registry
  @@registry = Prometheus::Client::Registry.new

  def index
    render plain: 'Hello world!'
  end

  def metrics
    content_type = Prometheus::Client::Formats::Text::CONTENT_TYPE
    render plain: Prometheus::Client::Formats::Text.marshal(@@registry),
           content_type: content_type
  end
end
```

Since no custom metrics are registered yet, the `/metrics` endpoint will return
an empty response now. In the following sections, you will instrument the
application with different metric types, including Counters, Gauges, Histograms,
and Summaries.

## Step 3 — Instrumenting a Counter metric

Let's start with a fundamental metric that tracks the total number of HTTP
requests made to the server. Since this value always increases, it is best
represented as a **Counter**.

To automatically track HTTP requests in Rails, we'll create a middleware. First,
create a new file for our middleware:

```ruby
[label lib/prometheus/middleware/collector.rb]
require 'prometheus/client'

module Prometheus
  module Middleware
    class Collector
      def initialize(app, registry = Prometheus::Client.registry)
        @app = app
        @registry = registry

        # Create a counter metric
        @http_requests_total = @registry.counter(
          :http_requests_total,
          docstring: 'Total number of HTTP requests received',
          labels: [:status, :path, :method]
        )
      end

      def call(env)
        # Process the request
        response = @app.call(env)

        # Record the request
        record_request(env, response)

        # Return the response
        response
      end

      private

      def record_request(env, response)
        status = response.first.to_s
        path = env['PATH_INFO']
        method = env['REQUEST_METHOD']

        @http_requests_total.increment(labels: { status: status, path: path, method: method })
      end
    end
  end
end
```

Next, create a file to configure the middleware:

```ruby
[label config/initializers/prometheus.rb]
require 'prometheus/middleware/collector'

Rails.application.middleware.use Prometheus::Middleware::Collector
```

This implementation creates a Counter metric named `http_requests_total` with
labels for status code, path, and HTTP method. It uses a custom middleware to
automatically count all HTTP requests by incrementing the counter after each
request is processed.

After restarting your application, if you refresh
`http://localhost:3000/metrics` several times, you'll see output like:

```promql
HELP http_requests_total Total number of HTTP requests received
TYPE http_requests_total counter
http_requests_total{method="GET",path="/metrics",status="200"} 2
```

You can view your metrics in the Prometheus client by heading to
`http://localhost:9090`. Then type `http_requests_total` into the query box and
click **Execute** to see the raw values.

![Ruby Counter metric in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6e009a9c-5fee-4de3-f0c2-f306320c7600/md2x =1581x548)

You can switch to the **Graph** tab to visualize the counter increasing over
time:

![Ruby Counter Graph in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/386616e4-7abd-405e-867d-19a22b2d9b00/orig =2368x1395)

## Step 4 — Instrumenting a Gauge metric

A **Gauge** represents a value that can fluctuate up or down, making it ideal
for tracking real-time values such as active connections, queue sizes, or memory
usage.

In this section, we'll use a Prometheus Gauge to monitor the number of active
requests being processed by the service. Let's update our middleware:

```ruby
[label lib/prometheus/middleware/collector.rb]
require 'prometheus/client'

module Prometheus
  module Middleware
    class Collector
      def initialize(app, registry = Prometheus::Client.registry)
        @app = app
        @registry = registry

        # Create a counter metric
        @http_requests_total = @registry.counter(
          :http_requests_total,
          docstring: 'Total number of HTTP requests received',
          labels: [:status, :path, :method]
        )

        # Define a Gauge metric for tracking active HTTP requests
        @active_requests_gauge = @registry.gauge(
          :http_active_requests,
          docstring: 'Number of active connections to the service'
        )
      end

      def call(env)
        # Track start of request processing
        @active_requests_gauge.increment

        # Process the request
        response = @app.call(env)

        # Record the request
        record_request(env, response)

        # Track end of request processing
        @active_requests_gauge.decrement

        # Return the response
        response
      end

      private

      def record_request(env, response)
        status = response.first.to_s
        path = env['PATH_INFO']
        method = env['REQUEST_METHOD']

        @http_requests_total.increment(labels: { status: status, path: path, method: method })
      end
    end
  end
end
```

The `active_requests_gauge` metric is created using `gauge()` to track the
number of active HTTP requests at any given moment.

When a new request starts processing, the gauge is incremented. After the
request is completed, the gauge is decremented.

To observe the metric in action, let's add a delay to the root route:

```ruby
[label app/controllers/home_controller.rb]
class HomeController < ApplicationController
  def index
    # Random delay between 1 and 5 seconds
    sleep rand(1..5)
    render plain: 'Hello world!'
  end

  # metrics method stays the same
end
```

Using a load testing tool like
[Apache Benchmark](https://httpd.apache.org/docs/2.4/programs/ab.html) to
generate requests to the `/` route:

```command
ab -n 100 -c 10 http://localhost:3000/
```

Visiting the `/metrics` endpoint on your browser will show something like:

```promql
#HELP http_active_requests Number of active connections to the service
#TYPE http_active_requests gauge
http_active_requests 10
```

This indicates that there are currently 10 active requests being processed by
your service.

![Ruby Gauge values in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/42f1f9d8-6313-4843-2841-b71c63074600/lg2x =2368x1395)

### Tracking absolute values

If you need a Gauge that tracks absolute but fluctuating values, you can set the
value directly instead of incrementing or decrementing it.

For example, to track the current memory usage of the Rails application, you can
define a gauge and use it to record the current memory usage of the process:

```ruby
[label lib/prometheus/memory_collector.rb]
require 'prometheus/client'
require 'socket'

module Prometheus
  class MemoryCollector
    def initialize(registry = Prometheus::Client.registry)
      @registry = registry

      # Define a Gauge metric for tracking memory usage
      @memory_usage_gauge = @registry.gauge(
        :memory_usage_bytes,
        docstring: 'Current memory usage of the service in bytes',
        labels: [:hostname]
      )

      Thread.new do
        collect_memory_metrics
      end
    end

    private

    def collect_memory_metrics
      while true
        # Get memory usage in bytes (using GetProcessMem gem or similar)
        memory = get_memory_usage() * 1024
        @memory_usage_gauge.set(
          memory,
          labels: { hostname: Socket.gethostname }
        )
        sleep 1
      end
    end

    def get_memory_usage
      # On Linux, read from /proc/self/status
      if File.exist?('/proc/self/status')
        File.open('/proc/self/status') do |file|
          file.each_line do |line|
            if line.start_with?('VmRSS:')
              return line.split[1].to_i
            end
          end
        end
      end

      # Fallback: return 0
      0
    end
  end
end
```

And initialize it in the Rails configuration:

```ruby
[label config/initializers/prometheus.rb]
require 'prometheus/middleware/collector'
require 'prometheus/memory_collector'

Rails.application.middleware.use Prometheus::Middleware::Collector
Prometheus::MemoryCollector.new
```

The `collect_memory_metrics` method runs in a background thread to continuously
update the `memory_usage_gauge` metric every second. Here, `set()` is used
instead of increment/decrement to set absolute values.

## Step 5 — Instrumenting a Histogram metric

Histograms are useful for tracking the distribution of measurements, such as
HTTP request durations. In Ruby, creating a Histogram metric is straightforward
with the `histogram` method of the Prometheus registry.

Let's update our middleware to track request durations:

```ruby
[label lib/prometheus/middleware/collector.rb]
require 'prometheus/client'

module Prometheus
  module Middleware
    class Collector
      def initialize(app, registry = Prometheus::Client.registry)
        @app = app
        @registry = registry

        # Create a counter metric
        @http_requests_total = @registry.counter(
          :http_requests_total,
          docstring: 'Total number of HTTP requests received',
          labels: [:status, :path, :method]
        )

        # Define a Gauge metric for tracking active HTTP requests
        @active_requests_gauge = @registry.gauge(
          :http_active_requests,
          docstring: 'Number of active connections to the service'
        )

        # Define a Histogram metric for request duration
        @latency_histogram = @registry.histogram(
          :http_request_duration_seconds,
          docstring: 'Duration of HTTP requests',
          labels: [:status, :path, :method]
        )
      end

      def call(env)
        start_time = Time.now

        # Track start of request processing
        @active_requests_gauge.increment

        # Process the request
        response = @app.call(env)

        # Calculate request duration
        duration = Time.now - start_time

        # Record the request
        record_request(env, response, duration)

        # Track end of request processing
        @active_requests_gauge.decrement

        # Return the response
        response
      end

      private

      def record_request(env, response, duration)
        status = response.first.to_s
        path = env['PATH_INFO']
        method = env['REQUEST_METHOD']

        @http_requests_total.increment(labels: { status: status, path: path, method: method })
        @latency_histogram.observe(
          duration,
          labels: { status: status, path: path, method: method }
        )
      end
    end
  end
end
```

The `latency_histogram` metric is created to track the duration of each request
to the server. With such a metric, you can:

- Track response time distributions
- Calculate percentiles (like p95, p99)
- Identify slow endpoints
- Monitor performance trends over time

Before a request is processed, the middleware records the start time. After the
request completes, the middleware calculates the total duration and records it
in the histogram.

After saving the file and restarting the application, make several requests to
see the histogram data in the `/metrics` endpoint:

```promql
#HELP http_request_duration_seconds Duration of HTTP requests
#TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.005"} 0
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.01"} 0
http_request_duration_seconds_bucket{method="GET",path="/",status="200",le="0.025"} 4
...
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

The histogram uses default buckets (in seconds), but you can specify custom
ones:

```ruby
@latency_histogram = @registry.histogram(
  :http_request_duration_seconds,
  docstring: 'Duration of HTTP requests',
  labels: [:status, :path, :method],
  buckets: [0.1, 0.5, 1, 2.5, 5, 10]  # Custom buckets in seconds
)
```

The real power of histograms comes when analyzing them in Prometheus. For
example, to calculate the 99th percentile latency over a 1-minute window you can
use:

```promql
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[1m])) by (le))
```

This query will show you the response time that 99% of requests fall under,
which is more useful than averages for understanding real user experience.

![Histogram query in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0c7fc914-e2a2-48d2-44d8-d42f3d34cf00/public =2017x1374)

## Step 6 — Instrumenting a Summary metric

A Summary metric in Prometheus is useful for capturing pre-aggregated quantiles,
such as the median, 95th percentile, or 99th percentile, while also providing
overall counts and sums for observed values.

Let's create a new controller for an external API request and add a Summary
metric:

```ruby
[label app/controllers/posts_controller.rb]
require 'prometheus/client'
require 'net/http'
require 'json'

class PostsController < ApplicationController
  # Create a summary metric
  @@registry = Prometheus::Client.registry
  @@posts_latency_summary = @@registry.summary(
    :post_request_duration_seconds,
    docstring: 'Duration of requests to jsonplaceholder',
    labels: [:method]
  )

  def index
    start_time = Time.now

    begin
      uri = URI('https://jsonplaceholder.typicode.com/posts')
      response = Net::HTTP.get_response(uri)

      if response.is_a?(Net::HTTPSuccess)
        posts = JSON.parse(response.body)
      else
        posts = []
      end
    rescue => e
      render plain: e.message, status: 500
      return
    ensure
      # Record the request duration in the summary
      duration = Time.now - start_time
      @@posts_latency_summary.observe(duration, labels: { method: 'GET' })
    end

    render json: posts
  end
end
```

Update your routes to include this controller:

```ruby
[label config/routes.rb]
Rails.application.routes.draw do
  root 'home#index'
  get '/metrics', to: 'home#metrics'
  get '/posts', to: 'posts#index'
end
```

The `posts_latency_summary` metric tracks the duration of requests to an
external API. In the `/posts` endpoint, the start time of the request is
recorded before sending a GET request to the API.

Once the request completes, the duration is calculated and recorded in the
Summary metric using `posts_latency_summary.observe(duration)`.

After restarting the application, make several requests to the `/posts` endpoint
to generate latency data:

```command
ab -n 20 -c 5 http://localhost:3000/posts
```

The metrics endpoint will show output like:

```promql
#HELP post_request_duration_seconds Duration of requests to jsonplaceholder
#TYPE post_request_duration_seconds summary
post_request_duration_seconds_sum{method="GET"} 8.648272037506104
post_request_duration_seconds_count{method="GET"} 25
post_request_duration_seconds{method="GET",quantile="0.5"} 0.3418126106262207
post_request_duration_seconds{method="GET",quantile="0.9"} 0.35525965690612793
post_request_duration_seconds{method="GET",quantile="0.99"} 0.49892544746398926
```

The median request time is about 341 milliseconds (0.341 seconds), 90% of
requests complete within 355 milliseconds (0.355 seconds), and 99% complete
within 498 milliseconds (0.498 seconds).

![Prometheus Summary metric](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d4397644-2cb9-44b1-a053-8c8e2c930400/md2x =2017x1374)

## Final thoughts

In this tutorial, we explored setting up and using Prometheus metrics in a Ruby
on Rails application.

We covered how to define and register different types of metrics - counters for
tracking cumulative values, gauges for fluctuating measurements, histograms for
understanding value distributions, and summaries for calculating client-side
quantiles.

To build on this foundation, you might want to:

- Set up [Prometheus Alertmanager](https://betterstack.com/community/guides/monitoring/prometheus-alertmanager/) to create alerts
  based on your metrics
- Connect your metrics to Grafana or Better Stack for powerful visualization and
  dashboarding
- Explore [PromQL](https://betterstack.com/community/guides/monitoring/promql/) to write more sophisticated queries for analysis

Thanks for reading, and happy monitoring!
