# Instrumenting Java Apps with OpenTelemetry Metrics

This article provides a detailed guide on integrating OpenTelemetry metrics into
your Java application.

It explores key concepts, including instrumenting your application with various
metric types, monitoring HTTP request activity, and exporting metrics to
visualization tools.

Let's get started!

[ad-logs]

## Prerequisites

- Prior experience with Java and Spring Boot, along with
  [a recent JDK installed](https://adoptium.net/)
- [Maven](https://maven.apache.org/) or [Gradle](https://gradle.org/) for
  dependency management
- Familiarity with [Docker](https://www.docker.com/) and
  [Docker Compose](https://docs.docker.com/compose/gettingstarted/)
- Basic understanding of [how OpenTelemetry works](https://betterstack.com/community/guides/observability/what-is-opentelemetry/)

## Step 1 — Setting up the demo project

To demonstrate OpenTelemetry instrumentation in Java applications, let's set up
a simple "Hello World" Spring Boot application along with the Prometheus server
for visualizing metrics.

First, create a new Spring Boot project. The easiest way is to use
[Spring Initializr](https://start.spring.io/). Select:

- Maven or Gradle (we'll use Maven for this tutorial)
- Java 23
- Spring Boot 3.4.3
- Dependencies: Spring Web

![Screenshot 2025-03-17 at 10-25-56 Spring Initializr.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ac3df4cb-eca7-44ae-7fd4-27d2ea627200/lg2x =3670x2178)

Download and extract the project, then open it in your preferred IDE.

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
`/metrics` endpoint that will eventually expose the instrumented metrics. The
empty metrics endpoint is a placeholder we'll expand later.

Create a `compose.yaml` file in your project root to set up both our application
and Prometheus server in Docker:

```yaml
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

This configuration sets up two services: our Spring Boot application and
Prometheus. The volumes ensure code changes are reflected in real-time and data
is persisted.

Create a `Dockerfile` for the Spring Boot application:

```dockerfile
FROM eclipse-temurin:17-jdk-focal

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN ./mvnw dependency:go-offline

COPY src ./src

CMD ["./mvnw", "spring-boot:run"]
```

This Dockerfile uses the Eclipse Temurin JDK 17 image and configures Maven to
run our Spring Boot application.

Create a `prometheus.yml` configuration file to tell Prometheus where to find
metrics:

```yaml
global:
 scrape_interval: 10s

scrape_configs:
 - job_name: spring-app
   static_configs:
     - targets:
         - app:8080
```

This configuration tells Prometheus to scrape metrics from our app every 10
seconds. In Docker Compose networking, "app" refers to our Spring Boot
container.

Before starting the services, create an `.env` file:

```text
SERVER_PORT=8080
```

Launch both services with:

```bash
docker compose up -d
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

## Step 2 — Installing OpenTelemetry dependencies

Now let's add the OpenTelemetry dependencies to your Spring Boot application.
Unlike Prometheus with Micrometer, OpenTelemetry provides a vendor-neutral API
for observability that includes not just metrics, but also traces and logs.

Update your `pom.xml` to include these dependencies:

```xml
<dependencies>
   <!-- Existing dependencies -->
   <dependency>
       <groupId>io.opentelemetry</groupId>
       <artifactId>opentelemetry-api</artifactId>
       <version>1.32.0</version>
   </dependency>
   <dependency>
       <groupId>io.opentelemetry</groupId>
       <artifactId>opentelemetry-sdk</artifactId>
       <version>1.32.0</version>
   </dependency>
   <dependency>
       <groupId>io.opentelemetry</groupId>
       <artifactId>opentelemetry-exporter-prometheus</artifactId>
       <version>1.32.0-alpha</version>
   </dependency>
   <dependency>
       <groupId>io.opentelemetry</groupId>
       <artifactId>opentelemetry-semconv</artifactId>
       <version>1.32.0-alpha</version>
   </dependency>
</dependencies>
```

These dependencies provide:

- The OpenTelemetry API for defining metrics
- The SDK that implements the API
- The Prometheus exporter for exposing metrics
- Semantic conventions for standardized naming

Next, create a configuration class to set up OpenTelemetry with Prometheus
export:

```java
package com.example.demo.config;

import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.metrics.MeterProvider;
import io.opentelemetry.exporter.prometheus.PrometheusHttpServer;
import io.opentelemetry.sdk.OpenTelemetrySdk;
import io.opentelemetry.sdk.metrics.SdkMeterProvider;
import io.opentelemetry.sdk.metrics.export.PeriodicMetricReader;
import io.opentelemetry.sdk.resources.Resource;
import io.opentelemetry.semconv.resource.attributes.ResourceAttributes;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenTelemetryConfig {

    @Bean
    public OpenTelemetry openTelemetry() {
        // Create a resource with application metadata
        Resource resource = Resource.getDefault()
                .merge(Resource.create(Attributes.of(
                        ResourceAttributes.SERVICE_NAME, "demo-app",
                        ResourceAttributes.SERVICE_VERSION, "1.0.0"
                )));

        // Set up the Prometheus exporter
        PrometheusHttpServer prometheusExporter = PrometheusHttpServer.builder()
                .setPort(9464)
                .build();

        // Create a meter provider
        SdkMeterProvider meterProvider = SdkMeterProvider.builder()
                .setResource(resource)
                .registerMetricReader(prometheusExporter)
                .build();

        // Create and return the OpenTelemetry instance
        return OpenTelemetrySdk.builder()
                .setMeterProvider(meterProvider)
                .buildAndRegisterGlobal();
    }

    @Bean
    public MeterProvider meterProvider(OpenTelemetry openTelemetry) {
        return openTelemetry.getMeterProvider();
    }
}
```

This configuration:

1. Creates a resource that identifies your application with a name and version
2. Sets up a Prometheus HTTP server to expose metrics on port 9464
3. Configures a meter provider that will collect metrics and send them to
   Prometheus
4. Builds and registers a global OpenTelemetry instance for your application to
   use

Update your `prometheus.yml` configuration to scrape metrics from the
OpenTelemetry exporter:

```yaml
global:
 scrape_interval: 10s

scrape_configs:
 - job_name: spring-app
   static_configs:
     - targets:
         - app:9464
```

Notice we're now targeting port 9464 where the OpenTelemetry Prometheus exporter
will expose metrics.

Rebuild your application:

```bash
docker compose up -d --build app
```

Now when you visit `http://localhost:9464/metrics`, you'll see the default
metrics that OpenTelemetry automatically collects.

## Step 3 — Implementing a Counter Metric

Let's implement our first custom metric - a counter to track the total number of
HTTP requests to our application. A counter is a cumulative metric that only
increases over time or resets to zero (like a car's odometer).

Create a metrics service to define and manage your OpenTelemetry metrics:

```java
package com.example.demo.service;

import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.metrics.LongCounter;
import io.opentelemetry.api.metrics.Meter;
import io.opentelemetry.api.metrics.MeterProvider;
import org.springframework.stereotype.Service;

@Service
public class MetricsService {

    private final LongCounter requestCounter;

    public MetricsService(MeterProvider meterProvider) {
        Meter meter = meterProvider.get("com.example.demo");

        // Create a counter for HTTP requests
        this.requestCounter = meter.counterBuilder("http.requests.total")
                .setDescription("Total number of HTTP requests")
                .build();
    }

    public void incrementRequestCounter() {
        requestCounter.add(1, Attributes.builder().put("app", "demo").build());
    }
}
```

In this service:

- We create a meter named "com.example.demo" as a namespace for our metrics
- We define a counter named "http.requests.total" with a clear description
- We provide a method to increment the counter with an attribute that identifies
  our app

Next, create a web filter that will increment the counter for each request:

```java
package com.example.demo.filter;

import com.example.demo.service.MetricsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class MetricsFilter extends OncePerRequestFilter {
    private final MetricsService metricsService;

    public MetricsFilter(MetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {
        metricsService.incrementRequestCounter();  // Increment before processing the request
        filterChain.doFilter(request, response);
    }
}
```

This filter:

- Extends Spring's `OncePerRequestFilter` to ensure it runs exactly once per
  request
- Injects our metrics service
- Increments the request counter for every HTTP request
- Continues the filter chain to process the request normally

After making several requests to your application, visiting the `/metrics`
endpoint will show:

```text
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{app="demo"} 42
```

The value will keep increasing as more requests are processed. This is perfect
for tracking total events, throughput, or error counts.

## Step 4 — Implementing a Gauge Metric

Unlike counters that only increase, gauges represent values that can fluctuate
up and down, like current temperature or memory usage. In OpenTelemetry, we
implement gauges using an UpDownCounter.

Let's add a gauge to track the number of active requests in our application:

```java
package com.example.demo.service;

import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.metrics.LongCounter;
import io.opentelemetry.api.metrics.LongUpDownCounter;
import io.opentelemetry.api.metrics.Meter;
import io.opentelemetry.api.metrics.MeterProvider;
import org.springframework.stereotype.Service;

@Service
public class MetricsService {

    private final LongCounter requestCounter;
    private final LongUpDownCounter activeRequestsGauge;

    public MetricsService(MeterProvider meterProvider) {
        Meter meter = meterProvider.get("com.example.demo");

        // Create a counter for HTTP requests
        this.requestCounter = meter.counterBuilder("http.requests.total")
                .setDescription("Total number of HTTP requests")
                .build();

        // Create a gauge (implemented as an UpDownCounter) for active requests
        this.activeRequestsGauge = meter.upDownCounterBuilder("http.requests.active")
                .setDescription("Number of active HTTP requests")
                .build();
    }

    public void incrementRequestCounter() {
        requestCounter.add(1, Attributes.builder().put("app", "demo").build());
    }

    public void incrementActiveRequests() {
        activeRequestsGauge.add(1, Attributes.builder().put("app", "demo").build());
    }

    public void decrementActiveRequests() {
        activeRequestsGauge.add(-1, Attributes.builder().put("app", "demo").build());
    }
}
```

The key additions here:

- We create an UpDownCounter that works like a gauge
- We provide methods to both increment and decrement the value
- This lets us track a value that rises and falls over time

Update the filter to track active requests:

```java
@Component
public class MetricsFilter extends OncePerRequestFilter {
    private final MetricsService metricsService;

    public MetricsFilter(MetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {
        metricsService.incrementRequestCounter();
        metricsService.incrementActiveRequests();  // Increase at request start

        try {
            filterChain.doFilter(request, response);
        } finally {
            metricsService.decrementActiveRequests();  // Decrease at request end
        }
    }
}
```

This filter now:

- Increments the active request gauge when a request begins
- Ensures we decrement it when the request ends (even if errors occur) using a
  try-finally block

To observe the gauge in action, let's add some random delay to the root
endpoint:

```java
@GetMapping("/")
public String hello() throws InterruptedException {
   java.util.concurrent.ThreadLocalRandom random = java.util.concurrent.ThreadLocalRandom.current();
   Thread.sleep(random.nextInt(1000, 5000));  // Random delay between 1-5 seconds
   return "Hello world!";
}
```

This delay simulates processing time and allows multiple concurrent requests to
accumulate, making our active request gauge more interesting to observe.

## Step 5 — Implementing a Histogram Metric

Histograms are essential for understanding the distribution of values like
request durations. They track not just a single number but the spread of values
across predefined buckets.

Update your `MetricsService` to include a histogram:

```java
package com.example.demo.service;

import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.metrics.LongCounter;
import io.opentelemetry.api.metrics.LongUpDownCounter;
import io.opentelemetry.api.metrics.Meter;
import io.opentelemetry.api.metrics.MeterProvider;
import io.opentelemetry.api.metrics.DoubleHistogram;
import org.springframework.stereotype.Service;

@Service
public class MetricsService {

    private final LongCounter requestCounter;
    private final LongUpDownCounter activeRequestsGauge;
    private final DoubleHistogram requestDurationHistogram;

    public MetricsService(MeterProvider meterProvider) {
        Meter meter = meterProvider.get("com.example.demo");

        // Create a counter for HTTP requests
        this.requestCounter = meter.counterBuilder("http.requests.total")
                .setDescription("Total number of HTTP requests")
                .build();

        // Create a gauge for active requests
        this.activeRequestsGauge = meter.upDownCounterBuilder("http.requests.active")
                .setDescription("Number of active HTTP requests")
                .build();

        // Create a histogram for request durations
        this.requestDurationHistogram = meter.histogramBuilder("http.request.duration.seconds")
                .setDescription("HTTP request duration in seconds")
                .setUnit("s")  // Explicitly set the unit to seconds
                .build();
    }

    // Previous methods...

    public void recordRequestDuration(double durationSeconds) {
        requestDurationHistogram.record(durationSeconds, Attributes.builder().put("app", "demo").build());
    }
}
```

Key points about the histogram:

- We use a `DoubleHistogram` because durations are typically fractional values
- We set a unit of "s" (seconds) to make the metric more understandable
- The histogram automatically distributes values across predefined buckets

Update the filter to record request durations:

```java
@Component
public class MetricsFilter extends OncePerRequestFilter {
    private final MetricsService metricsService;

    public MetricsFilter(MetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {
        metricsService.incrementRequestCounter();
        metricsService.incrementActiveRequests();

        long startTime = System.nanoTime();  // High-precision timestamp before request
        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.nanoTime() - startTime;
            // Convert nanoseconds to seconds with floating-point precision
            metricsService.recordRequestDuration(duration / 1_000_000_000.0);
            metricsService.decrementActiveRequests();
        }
    }
}
```

This enhancement:

- Takes a high-precision timestamp before processing the request
- Calculates the duration after the request completes
- Converts from nanoseconds to seconds (dividing by 1 billion)
- Records the duration in our histogram

Histograms are particularly useful for analyzing latency patterns and setting
SLOs (Service Level Objectives). In Prometheus, you can calculate percentiles
(e.g., p95, p99) to understand the experience of most users while ignoring
outliers.

## Step 6 — Adding Context to Metrics with Attributes

Attributes (labels in Prometheus terminology) let you segment metrics by
different dimensions like endpoint, HTTP method, or status code. This provides
more granular analysis.

Let's enhance our metrics with additional context:

```java
@Component
public class MetricsFilter extends OncePerRequestFilter {
    private final MetricsService metricsService;

    public MetricsFilter(MetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {
        // Create attributes with endpoint and method information
        Attributes attributes = Attributes.builder()
                .put("app", "demo")
                .put("endpoint", request.getRequestURI())
                .put("method", request.getMethod())
                .build();

        metricsService.incrementRequestCounter(attributes);
        metricsService.incrementActiveRequests(attributes);

        long startTime = System.nanoTime();
        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.nanoTime() - startTime;

            // Add status code to attributes for the histogram
            Attributes histogramAttributes = Attributes.builder()
                    .putAll(attributes)
                    .put("status", response.getStatus())
                    .build();

            metricsService.recordRequestDuration(duration / 1_000_000_000.0, histogramAttributes);
            metricsService.decrementActiveRequests(attributes);
        }
    }
}
```

This enhanced filter:

- Creates attributes containing the URI path and HTTP method
- Adds the HTTP status code to histogram attributes after the response is
  generated
- Allows you to analyze metrics by endpoint, method, and response status

Update the `MetricsService` to accept attributes in its methods:

```java
public void incrementRequestCounter(Attributes attributes) {
    requestCounter.add(1, attributes);
}

public void incrementActiveRequests(Attributes attributes) {
    activeRequestsGauge.add(1, attributes);
}

public void decrementActiveRequests(Attributes attributes) {
    activeRequestsGauge.add(-1, attributes);
}

public void recordRequestDuration(double durationSeconds, Attributes attributes) {
    requestDurationHistogram.record(durationSeconds, attributes);
}
```

With these attributes, you can now answer questions like:

- Which endpoints have the highest traffic?
- Which endpoints have the slowest response times?
- What percentage of requests to a specific endpoint result in errors?

Be careful not to add too many unique attribute combinations, as this can lead
to "cardinality explosion" that impacts performance.

## Step 7 — Implementing External API Monitoring

Let's create a service to monitor external API calls using OpenTelemetry:

```java
package com.example.demo.service;

import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.metrics.DoubleHistogram;
import io.opentelemetry.api.metrics.Meter;
import io.opentelemetry.api.metrics.MeterProvider;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ExternalApiService {
   private final DoubleHistogram apiLatencyHistogram;
   private final RestTemplate restTemplate;

   public ExternalApiService(MeterProvider meterProvider) {
       Meter meter = meterProvider.get("com.example.demo");

       this.apiLatencyHistogram = meter.histogramBuilder("external_api.request.duration")
               .setDescription("External API request duration in seconds")
               .setUnit("s")
               .build();

       this.restTemplate = new RestTemplate();
   }

   public Object fetchPosts() {
       long startTime = System.nanoTime();
       try {
           return restTemplate.getForObject(
               "https://jsonplaceholder.typicode.com/posts",
               Object.class
           );
       } finally {
           long duration = System.nanoTime() - startTime;
           apiLatencyHistogram.record(
               duration / 1_000_000_000.0,  // Convert to seconds
               Attributes.builder()
                   .put("api", "jsonplaceholder")
                   .put("endpoint", "/posts")
                   .build()
           );
       }
   }
}
```

This service:

- Creates a histogram to track API call durations
- Wraps the API call with timing logic
- Records the duration with attributes identifying the external API and endpoint

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

This pattern lets you monitor external dependencies, identify performance
bottlenecks, and set alerts for problematic third-party services.

## Final thoughts

In this tutorial, we explored how to integrate OpenTelemetry metrics into a
Spring Boot application. We implemented counters for tracking cumulative values,
gauges for fluctuating measurements, and histograms for analyzing distributions.

OpenTelemetry offers several advantages over traditional monitoring approaches:
it provides vendor-neutral instrumentation, combines metrics with tracing and
logging, and implements standardized conventions across different programming
languages.

For a production deployment, consider setting up an [OpenTelemetry Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/) to
process and route your telemetry data to different backends, and connect your
metrics to observability tools like [Better Stack](https://betterstack.com/telemetry) to create comprehensive dashboards.

Remember to focus on actionable metrics that directly tie to user experience and
business goals, and create alerts for critical thresholds to ensure proactive
monitoring of your applications.
