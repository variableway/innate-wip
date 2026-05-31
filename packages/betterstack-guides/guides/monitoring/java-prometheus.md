# Instrumenting Java Apps with Prometheus Metrics

This article provides a detailed guide on integrating [Prometheus
metrics](https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/) into your Java application.

It explores key concepts, including instrumenting your application with various
metric types, monitoring HTTP request activity, and exposing metrics for
Prometheus to scrape.

Let's get started!

[ad-logs]

## Prerequisites

- Prior experience with Java and Spring Boot, along with
  [a recent JDK installed](https://adoptium.net/)
- [Maven](https://maven.apache.org/) or [Gradle](https://gradle.org/) for
  dependency management
- Familiarity with [Docker](https://www.docker.com/) and [Docker
  Compose](https://betterstack.com/community/guides/scaling-docker/docker-compose-getting-started/)
- Basic understanding of [how Prometheus works](https://betterstack.com/community/guides/monitoring/prometheus/)

## Step 1 — Setting up the demo project

To demonstrate Prometheus instrumentation in Java applications, let's set up a
simple "Hello World" Spring Boot application along with the Prometheus server.

First, create a new Spring Boot project. The easiest way is to use
[Spring Initializr](https://start.spring.io/). Select:

- Maven or Gradle (we'll use Maven for this tutorial)
- Java 17
- Spring Boot 3.4.2
- Dependencies: Spring Web

![screenshot-2025-02-20-14-40-12.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/782b3d24-f16b-4bdf-8eff-520b25cc3c00/md2x =2208x1040)

Click **Generate** to download the project, then extract it and open it in your preferred IDE.

Here's the initial application class:

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class DemoApplication {

   public static void main(String[] args) {
       SpringApplication.run(DemoApplication.class, args);
   }

   @GetMapping("/")
   public String hello() {
       return "Hello world!";
   }

   @GetMapping("/metrics")
   public String metrics() {
       return "";
   }
}
```

This app exposes two endpoints: `/` returns a simple "Hello world!" message, and
`/metrics` endpoint that will eventually expose the instrumented metrics.

Create a `docker-compose.yml` file in your project root:

```yaml
[label docker-compose.yml]
services:
 app:
   build:
     context: .
     dockerfile: Dockerfile
   environment:
     SERVER_PORT: ${SERVER_PORT}
   ports:
     - "8080:8080"
   volumes:
     - .:/app
     - ~/.m2:/root/.m2

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
     - "9090:9090"

volumes:
 prometheus_data:
```

Create a `Dockerfile` for the Spring Boot application:

```dockerfile
[label Dockerfile]
FROM eclipse-temurin:17-jdk-focal

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN ./mvnw dependency:go-offline

COPY src ./src

CMD ["./mvnw", "spring-boot:run"]
```

Create a `prometheus.yml` configuration file:

```yaml
[label prometheus.yml]
global:
 scrape_interval: 10s

scrape_configs:
 - job_name: spring-app
   static_configs:
     - targets:
         - app:8080
```

Before starting the services, create an `.env` file:

```text
SERVER_PORT=8080
```

Launch both services with:

```bash
docker compose up -d
```

You should see output similar to:

```text
[+] Running 3/3
✔ Network prometheus-java_default  Created                    0.8s
✔ Container prometheus            Started                    1.3s
✔ Container app                   Started                    1.3s
```

To confirm that the Spring Boot application is running, send a request to the
root endpoint:

```bash
curl http://localhost:8080
```

This should return:

```text
Hello world!
```

To verify that Prometheus can access the exposed `/metrics` endpoint, visit
`http://localhost:9090/targets` in your browser:

![Java Demo target in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/781ca1dc-eced-45ca-b91e-8076d09afa00/md1x =1520x475)

## Step 2 — Installing the Prometheus client

Before instrumenting your Spring Boot application with Prometheus, you need to
install the Micrometer and Prometheus dependencies. Micrometer provides a
vendor-neutral metrics facade that Spring Boot uses for its metrics system.

Update your `pom.xml` to include these dependencies:

```xml
<dependencies>
   <!-- Existing dependencies -->
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-actuator</artifactId>
   </dependency>
   <dependency>
       <groupId>io.micrometer</groupId>
       <artifactId>micrometer-registry-prometheus</artifactId>
   </dependency>
</dependencies>
```

Next, configure Spring Boot Actuator to expose the Prometheus endpoint. Add
these settings to your `application.properties` file:

```properties
[label application.properties]
# Expose all actuator endpoints
management.endpoints.web.exposure.include=*

# Enable metrics endpoint
management.endpoint.metrics.enabled=true

# Enable prometheus endpoint
management.endpoint.prometheus.enabled=true
```

With these dependencies and configurations in place, Spring Boot will
automatically expose a `/actuator/prometheus` endpoint that Prometheus can
scrape. Update your `prometheus.yml` configuration to use this new endpoint:

```yaml
global:
 scrape_interval: 10s

scrape_configs:
 - job_name: spring-app
   metrics_path: /actuator/prometheus
   static_configs:
     - targets:
         - app:8080
```

Rebuild your application:

```bash
docker compose up -d --build app
```

Now when you visit `http://localhost:8080/actuator/prometheus`, you'll see the
default metrics that Spring Boot automatically collects:

```text
# HELP jvm_memory_used_bytes The amount of used memory
# TYPE jvm_memory_used_bytes gauge
jvm_memory_used_bytes{area="heap"} 4.2467328E7
jvm_memory_used_bytes{area="nonheap"} 5.4423552E7

# HELP process_uptime_seconds The uptime of the Java virtual machine
# TYPE process_uptime_seconds gauge
process_uptime_seconds 30.88

# HELP jvm_threads_live_threads The current number of live threads
# TYPE jvm_threads_live_threads gauge
jvm_threads_live_threads 23.0
...
```

These default metrics include important JVM statistics like:

- Memory usage (heap and non-heap)
- Garbage collection statistics
- Thread counts
- CPU usage
- HTTP request statistics

While these built-in metrics are valuable, let's explore how to create custom
metrics for your application's specific needs. In the following sections, we'll
implement different types of metrics:

- Counters for tracking cumulative values
- Gauges for fluctuating measurements
- Timers for measuring durations
- Distributions for analyzing value ranges

Each metric type serves different monitoring needs, and understanding them will
help you choose the right one for your specific requirements.

## Step 3 — Implementing a Counter metric

Let's start with a fundamental metric that tracks the total number of HTTP
requests made to your Spring Boot application. Since this value always
increases, it is best represented as a **Counter**.

A Counter in Prometheus is a cumulative metric that represents a single
monotonically increasing counter. It can only increase or be reset to zero on
restart. Think of it like an odometer in a car - it only goes up.

Create a metrics configuration class to define your Counter:

```java
package com.example.demo.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MetricsConfig {

    @Bean
    public Counter requestCounter(MeterRegistry registry) {
        return Counter.builder("http.requests.total")  // metric name
                .description("Total number of HTTP requests")  // metric description
                .tags("app", "demo")  // metric labels
                .register(registry);  // register with Spring's metric registry
    }
}
```

This configuration:

- Creates a Counter named `http.requests.total`
- Adds a description that will appear in Prometheus
- Adds tags (labels in Prometheus terms) to help categorize the metric
- Registers the Counter with Spring's metric registry

Next, create a web filter that will increment the counter for each request:

```java
package com.example.demo.filter;

import io.micrometer.core.instrument.Counter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class MetricsFilter extends OncePerRequestFilter {
    private final Counter requestCounter;

    public MetricsFilter(Counter requestCounter) {
        this.requestCounter = requestCounter;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) {
        requestCounter.increment();  // Increment before processing the request
        filterChain.doFilter(request, response);
    }
}
```

The filter:

- Extends `OncePerRequestFilter` to ensure it runs exactly once per request
- Receives the Counter through dependency injection
- Increments the counter before passing the request along

After making several requests to your application, visiting the
`/actuator/prometheus` endpoint will show:

```text
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{app="demo"} 42.0
```

For each counter metric, Prometheus creates two data points:

1. The actual counter (`http_requests_total`)
2. A creation timestamp gauge (`http_requests_created`)

You can visualize your counter data in the Prometheus UI at
`http://localhost:9090`. Enter `http_requests_total` in the query box and click
**Execute**:

![Java Counter metric in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6e009a9c-5fee-4de3-f0c2-f306320c7600/md2x =1581x548)

Switch to the **Graph** tab to see the counter increasing over time:

![Java Counter Graph in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/386616e4-7abd-405e-867d-19a22b2d9b00/orig =2368x1395)

Counters are ideal for tracking:

- Total number of requests processed
- Number of errors encountered
- Bytes of data transferred
- Number of items completed
- Any other value that only increases

In the next section, we'll explore Gauge metrics, which are better suited for
values that can both increase and decrease.

## Step 4 — Implementing a Gauge metric

A **Gauge** represents a value that can fluctuate up or down. Unlike Counters
that only increase, Gauges are perfect for metrics like current memory usage,
active requests, or queue size.

Let's modify our `MetricsConfig` class to include a gauge that tracks the number
of active requests:

```java
package com.example.demo.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.concurrent.atomic.AtomicInteger;

@Configuration
public class MetricsConfig {

   private final AtomicInteger activeRequests = new AtomicInteger(0);

   @Bean
   public Counter requestCounter(MeterRegistry registry) {
       return Counter.builder("http.requests.total")
               .description("Total number of HTTP requests")
               .tags("app", "demo")
               .register(registry);
   }

   @Bean
   public AtomicInteger gaugeActive(MeterRegistry registry) {
       return registry.gauge("http.requests.active",
               Tags.of("app", "demo"),
               new AtomicInteger(0));
   }
}
```

Update the filter to track active requests:

```java
@Component
public class MetricsFilter extends OncePerRequestFilter {
   private final Counter requestCounter;
   private final AtomicInteger activeRequests;

   public MetricsFilter(Counter requestCounter, AtomicInteger activeRequests) {
       this.requestCounter = requestCounter;
       this.activeRequests = activeRequests;
   }

   @Override
   protected void doFilterInternal(HttpServletRequest request,
                                 HttpServletResponse response,
                                 FilterChain filterChain) throws ServletException, IOException {
       activeRequests.incrementAndGet();  // Increment at start of request
       try {
           requestCounter.increment();
           filterChain.doFilter(request, response);
       } finally {
           activeRequests.decrementAndGet();  // Decrement after request completes
       }
   }
}
```

To observe the gauge in action, let's add some random delay to the root
endpoint:

```java
@GetMapping("/")
public String hello() throws InterruptedException {
   Thread.sleep(ThreadLocalRandom.current().nextInt(1000, 5000));
   return "Hello world!";
}
```

Now use a load testing tool like [wrk](https://github.com/wg/wrk) to generate
concurrent requests:

```bash
wrk -t 10 -c 100 -d 1m --latency "http://localhost:8080"
```

Visit the `/actuator/prometheus` endpoint to see your gauge metric:

```text
# HELP http_requests_active Number of active HTTP requests
# TYPE http_requests_active gauge
http_requests_active{app="demo"} 42.0
```

This indicates that there are currently 42 active requests being processed by
your application. Unlike the counter metric that keeps increasing, this gauge
value will fluctuate up and down as requests start and complete.

You can observe the changing gauge values over time in Prometheus's Graph view
at `http://localhost:9090`:

![Java Gauge values in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/42f1f9d8-6313-4843-2841-b71c63074600/lg2x =2368x1395)
### Tracking Static Values

If you need a gauge that tracks absolute but fluctuating values, you can set the
value directly instead of incrementing or decrementing it. For example, to track
the current memory usage of the JVM:

```java
@Configuration
public class MetricsConfig {
   // Previous beans...

   @Bean
   public void memoryMetrics(MeterRegistry registry) {
       Gauge.builder("jvm.memory.used", Runtime.getRuntime(),
           runtime -> runtime.totalMemory() - runtime.freeMemory())
           .description("JVM memory currently used")
           .baseUnit("bytes")
           .register(registry);
   }
}
```

This will produce metrics like:

```text
# HELP jvm_memory_used JVM memory currently used
# TYPE jvm_memory_used gauge
jvm_memory_used{unit="bytes"} 384716234
```

Gauges are perfect for metrics like:

- Current memory usage
- Current CPU utilization
- Active connections
- Queue size
- Temperature readings
- Any value that can increase or decrease

In the next section, we'll explore how to use a Histogram metric to track the
distribution of request durations.

## Step 5 — Implementing a Histogram metric

Histograms are useful for tracking the distribution of measurements, such as
request durations. A histogram samples observations and counts them in
configurable buckets, making it ideal for analyzing patterns in your metrics.

Let's add a histogram to track HTTP request durations. Update your
`MetricsConfig`:

```java
package com.example.demo.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.Histogram;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.concurrent.atomic.AtomicInteger;

@Configuration
public class MetricsConfig {
   // Previous counter and gauge beans...

   @Bean
   public Timer requestLatencyHistogram(MeterRegistry registry) {
       return Timer.builder("http.request.duration.seconds")
               .description("HTTP request duration in seconds")
               .tags("app", "demo")
               .publishPercentiles(0.5, 0.95, 0.99)
               .register(registry);
   }
}
```

Update the metrics filter to record request durations:

```java
@Component
public class MetricsFilter extends OncePerRequestFilter {
   private final Counter requestCounter;
   private final AtomicInteger activeRequests;
   private final Timer requestLatencyHistogram;

   public MetricsFilter(Counter requestCounter,
                       AtomicInteger activeRequests,
                       Timer requestLatencyHistogram) {
       this.requestCounter = requestCounter;
       this.activeRequests = activeRequests;
       this.requestLatencyHistogram = requestLatencyHistogram;
   }

   @Override
   protected void doFilterInternal(HttpServletRequest request,
                                 HttpServletResponse response,
                                 FilterChain filterChain) throws ServletException, IOException {
       activeRequests.incrementAndGet();

       Timer.Sample sample = Timer.start();
       try {
           requestCounter.increment();
           filterChain.doFilter(request, response);
       } finally {
           sample.stop(requestLatencyHistogram);
           activeRequests.decrementAndGet();
       }
   }
}
```

After generating some traffic to your application, you'll see histogram data
like this:

```text
# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{app="demo",le="0.1"} 12
http_request_duration_seconds_bucket{app="demo",le="0.2"} 25
http_request_duration_seconds_bucket{app="demo",le="0.5"} 45
http_request_duration_seconds_bucket{app="demo",le="1.0"} 78
http_request_duration_seconds_bucket{app="demo",le="2.5"} 95
http_request_duration_seconds_bucket{app="demo",le="5.0"} 98
http_request_duration_seconds_bucket{app="demo",le="+Inf"} 100
http_request_duration_seconds_sum{app="demo"} 47.423
http_request_duration_seconds_count{app="demo"} 100
```

Let's understand what this output means:

- Each `_bucket` line represents the number of requests that took less than or
  equal to a specific duration
- For example, `le="0.5"} 45` means 45 requests completed within 0.5 seconds
- The `_sum` value (47.423) is the total of all observed durations
- The `_count` value (100) is the total number of observations

You can calculate useful statistics from histogram data. For example, to find
the 95th percentile latency over a 5-minute window, use this PromQL query:

```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

This tells you the response time that 95% of requests fall under, which is more
useful than averages for understanding real user experience:

![Histogram query in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0c7fc914-e2a2-48d2-44d8-d42f3d34cf00/public =2017x1374)

Histograms are particularly useful for:

- Request latencies
- Response sizes
- Queue processing times
- Any measurement where understanding the distribution is important

In the next section, we'll explore Summary metrics, which provide an alternative
way to track quantiles.

## Step 6 — Implementing a Summary metric

A Summary metric in Prometheus, like a histogram, captures size or duration
measurements. However, while histograms calculate quantiles on the server side,
summaries compute them on the client. Let's use a Summary to track external API
call latencies.

Create a service to demonstrate summary metrics:

```java
package com.example.demo.service;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Summary;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ExternalApiService {
   private final Summary requestLatency;
   private final RestTemplate restTemplate;

   public ExternalApiService(MeterRegistry registry) {
       this.requestLatency = Summary.builder("external_api.request.duration")
               .description("External API request duration")
               .quantiles(0.5, 0.95, 0.99)  // Track 50th, 95th, and 99th percentiles
               .register(registry);

       this.restTemplate = new RestTemplate();
   }

   public Object fetchPosts() {
       long start = System.nanoTime();
       try {
           return restTemplate.getForObject(
               "https://jsonplaceholder.typicode.com/posts",
               Object.class
           );
       } finally {
           long duration = System.nanoTime() - start;
           requestLatency.record(duration / 1_000_000_000.0);  // Convert to seconds
       }
   }
}
```

Add a controller to use this service:

```java
@RestController
public class ApiController {
   private final ExternalApiService apiService;

   public ApiController(ExternalApiService apiService) {
       this.apiService = apiService;
   }

   @GetMapping("/posts")
   public Object getPosts() {
       return apiService.fetchPosts();
   }
}
```

After making several requests to the `/posts` endpoint, you'll see summary
metrics like:

```text
# HELP external_api_request_duration External API request duration
# TYPE external_api_request_duration summary
external_api_request_duration{quantile="0.5"} 0.341
external_api_request_duration{quantile="0.95"} 0.465
external_api_request_duration{quantile="0.99"} 0.591
external_api_request_duration_sum 12.423
external_api_request_duration_count 32
```

This output tells us:

- The median (50th percentile) request time is 341 milliseconds
- 95% of requests complete within 465 milliseconds
- 99% of requests complete within 591 milliseconds
- We've made 32 requests with a total duration of 12.423 seconds

In Prometheus, enter the metric name to see these values:
![Prometheus Summary metric](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d4397644-2cb9-44b1-a053-8c8e2c930400/md2x =2017x1374)

### When to Use Summary vs Histogram

While both Summaries and Histograms can track distributions of values, they
serve different purposes:

**Use Summaries when:**

- You need accurate quantiles for a single instance
- The client can compute quantiles efficiently
- You don't need to aggregate quantiles across instances

**Use Histograms when:**

- You need to aggregate quantiles across multiple instances
- You want to calculate different quantiles at query time
- You're tracking latencies that might change dramatically

## Final Thoughts

In this tutorial, we've explored how to integrate Prometheus metrics into a
Spring Boot application. We've covered:

Spring Boot and Micrometer provide a robust foundation for monitoring, making it
straightforward to expose both built-in metrics about your JVM and
application-specific metrics that matter to your business.

Consider these next steps:

- Set up [Prometheus Alertmanager](https://betterstack.com/community/guides/monitoring/prometheus-alertmanager/) to create alerts
  based on your metrics.
- Connect your metrics to [Grafana](https://betterstack.com/community/guides/monitoring/visualize-prometheus-metrics-grafana/) for
  powerful visualization and dashboarding.
- Explore [PromQL](https://betterstack.com/community/guides/monitoring/promql/) to write more sophisticated queries for analyzing
  your metrics.

When implementing metrics in your Spring Boot applications, remember to use
dependency injection for metric instances, keep metric collection code isolated
in services and filters, choose meaningful metric names and labels, and document
your metrics for team visibility.

Thanks for reading, and happy monitoring!

[prometheus-metrics-explained]:
  https://prometheus.io/docs/concepts/metric_types/
[docker-compose-getting-started]:
  https://docs.docker.com/compose/gettingstarted/
[prometheus]: https://prometheus.io/docs/introduction/overview/
[prometheus-alertmanager]:
  https://prometheus.io/docs/alerting/latest/alertmanager/
[visualize-prometheus-metrics-grafana]:
  https://grafana.com/docs/grafana/latest/getting-started/get-started-grafana-prometheus/
[promql]: https://prometheus.io/docs/prometheus/latest/querying/basics/
