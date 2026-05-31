# The Four Golden Signals for SRE Monitoring

Modern systems are increasingly intricate, with numerous components interacting in sometimes unpredictable ways. To effectively monitor these systems, you need structured approaches that help you focus on the most important metrics.

The Four Golden Signals represent a service-centric monitoring approach that gives you direct insight into user experience and system health. Developed and documented by Google's SRE team, these signals have become a cornerstone of modern observability practices.

The Four Golden Signals are:

1. **Latency** - How long it takes to serve a request
2. **Traffic** - The amount of demand placed on your system
3. **Errors** - The rate of failed requests
4. **Saturation** - How "full" your service is

Together, these metrics provide a holistic view of service health. Latency and error metrics tell you about the quality of service your users are experiencing. Traffic metrics help you understand the load on your system and provide context for other measurements. Saturation metrics indicate when your service is approaching its limits and may soon experience degradation.

Let's explore each of these signals in depth to understand how they work together to form a comprehensive monitoring strategy.

[ad-logs]

## Understanding the Four Golden Signals

### 1. Latency

**Latency measures how long it takes to process a request**. This is typically measured in milliseconds or seconds and provides insight into the performance of your service from a user perspective.

When measuring latency, it's crucial to distinguish between successful and failed requests. Failed requests often have misleadingly low latencies (for example, an immediate error response) or extremely high latencies (like timeouts). By separating these measurements, you get a clearer picture of your service's actual performance.

Similar to duration metrics in the RED methodology, latency should be measured as a distribution rather than an average. This means tracking percentiles such as:

- The median (50th percentile or `p50`), which represents the typical user experience
- The 90th percentile (`p90`), showing how the slower 10% of requests perform
- The 99th percentile (`p99`), highlighting the experience of your slowest 1% of requests

Here's how you might implement latency tracking with Prometheus and Node.js:

```javascript
import { Histogram } from 'prom-client';

const requestLatency = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2.5, 5, 10]
});

function latencyMiddleware(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    requestLatency.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
        status_code: res.statusCode
      },
      duration
    );
  });
  
  next();
}
```

Monitoring latency helps you set realistic Service Level Objectives (SLOs) and detect performance degradations quickly, especially when they affect only a subset of requests.

### 2. Traffic

**Traffic metrics measure the demand placed on your system**. This is typically expressed as a rate of requests per second, though the specific unit varies by service type.

Traffic metrics serve as a foundational element of your monitoring strategy. They provide crucial context for interpreting other metrics and help you detect anomalies like unexpected spikes or drops in usage.

For different systems, traffic might be measured as:

- HTTP requests per second for web services
- Queries per second for databases
- Messages processed per second for queue systems
- Transactions per second for payment systems

When implementing traffic metrics, you'll typically use a counter that increases monotonically over time:

```javascript
import { Counter } from 'prom-client';

const requestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route']
});

function trafficMiddleware(req, res, next) {
  requestCounter.inc({
    method: req.method,
    route: req.route?.path || req.path
  });
  
  next();
}
```

Traffic metrics also help with capacity planning. By analyzing historical traffic patterns, you can predict future needs and scale your infrastructure appropriately. Seasonal patterns, day-of-week variations, and growth trends all become visible through traffic metrics.

### 3. Errors

**Error metrics track the rate of failed requests**. This includes any request that doesn't complete as expected, whether due to explicit errors, timeouts, or incorrect results.

Error metrics help you understand the reliability of your service from a user perspective. They're typically tracked both as an absolute rate (errors per second) and as a percentage of total requests.

When implementing error metrics, it's important to define clearly what constitutes an "error" for your service. For web services, HTTP status codes in the 4xx and 5xx ranges are often considered errors, though you might want to distinguish between client errors (4xx) and server errors (5xx).

Here's how you might implement error tracking with Prometheus:

```javascript
import { Counter } from 'prom-client';

const errorCounter = new Counter({
  name: 'http_request_errors_total',
  help: 'Total number of HTTP request errors',
  labelNames: ['method', 'route', 'status_code', 'error_type']
});

function errorHandler(err, req, res, next) {
  errorCounter.inc({
    method: req.method,
    route: req.route?.path || req.path,
    status_code: res.statusCode || 500,
    error_type: err.name || 'UnknownError'
  });
  
  res.status(500).send('Something went wrong');
}
```

Error metrics should include enough detail to help with troubleshooting. Adding dimensions like error type, affected endpoint, or error source can provide valuable context for debugging issues.

### 4. Saturation

**Saturation metrics indicate how "full" your service is**. They measure the proportion of your system's resources that are currently being used and help predict when the system might start experiencing performance degradation.

Saturation is often the most complex of the four signals because it varies by system type and resource. For a web service, saturation might involve:

- Thread pool utilization
- Database connection pool usage
- Memory consumption
- CPU utilization
- Network bandwidth usage

The key insight with saturation metrics is that most systems start to degrade before they reach 100% utilization. By identifying and monitoring the most constrained resources in your system, you can predict and prevent performance issues before they affect users.

Here's how you might implement saturation monitoring for a connection pool:

```javascript
import { Gauge } from 'prom-client';

const connectionPoolGauge = new Gauge({
  name: 'db_connection_pool_usage_ratio',
  help: 'Database connection pool usage ratio',
  labelNames: ['pool_name']
});

// Update the gauge regularly
function updateConnectionPoolMetrics() {
  const poolSize = db.pool.max;
  const activeConnections = db.pool.used;
  
  connectionPoolGauge.set(
    { pool_name: 'main' },
    activeConnections / poolSize
  );
}

setInterval(updateConnectionPoolMetrics, 5000);
```

For many systems, saturation is best measured by the presence of queuing. When a system starts to queue work instead of processing it immediately, that's a clear sign of saturation. Metrics like queue length or wait time can provide early warnings of impending problems.

## Implementing the Four Golden Signals with Prometheus

Prometheus has become the de facto standard for metrics collection in cloud-native environments. Its pull-based architecture, powerful query language, and extensive ecosystem make it an excellent choice for implementing the Four Golden Signals.

### Setting Up Prometheus

If you're new to Prometheus, start by setting up a basic instance. You can run Prometheus as a Docker container:

```bash
docker run -p 9090:9090 -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
```

Your `prometheus.yml` configuration file should include targets for your services:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'your-service'
    static_configs:
      - targets: ['localhost:8080']
```

### Exposing Metrics Endpoints

In your service, you'll need to expose an endpoint that Prometheus can scrape. For Node.js applications, you can use the `prom-client` library:

```javascript
import express from 'express';
import promClient from 'prom-client';

const app = express();
const register = promClient.register;

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(8080);
```


## The Four Golden Signals vs. Other Monitoring Frameworks

The Four Golden Signals aren't the only framework for monitoring. They complement other approaches like [RED (Rate, Errors, Duration) and USE (Utilization, Saturation, Errors)](https://betterstack.com/community/guides/monitoring/red-use-metrics/):

- **RED** focuses on service-level metrics, much like the Four Golden Signals, but doesn't explicitly include saturation.
- **USE** focuses on resource-level metrics, with a strong emphasis on infrastructure health.

The Four Golden Signals sit somewhere between these approaches, offering a balanced view that includes both service performance (Latency, Errors) and resource health (Saturation). Traffic provides context for all three frameworks.

For comprehensive monitoring, consider using elements from all three frameworks:

1. For service health: Track Latency, Traffic, and Errors (from Four Golden Signals or RED).
2. For resource health: Track Saturation (from Four Golden Signals) and detailed USE metrics.
3. For business impact: Add custom business metrics on top of these technical indicators.

## Setting Alerts Based on the Four Golden Signals

The Four Golden Signals provide a natural foundation for alerting. Here are some alerting strategies for each signal:

### Latency Alerts

Alert on sustained increases in high percentile latency (e.g., p99), as these often indicate developing problems. Set thresholds based on your Service Level Objectives (SLOs).

Example Prometheus Alert:

```yaml
- alert: HighLatency
  expr: histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route)) > 2
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High latency on {{ $labels.route }}"
    description: "P99 latency for {{ $labels.route }} is above 2 seconds"
```

### Traffic Alerts

Alert on significant deviations from expected traffic patterns. This includes both unexpected drops (which might indicate upstream issues) and unexpected spikes (which might indicate attacks or viral content).

Example Prometheus Alert:

```yaml
- alert: LowTraffic
  expr: sum(rate(http_requests_total[5m])) < 10
  for: 10m
  labels:
    severity: warning
  annotations:
    summary: "Unusually low traffic detected"
    description: "Request rate has fallen below 10 rps for 10 minutes"
```

### Error Alerts

Alert on error rates or percentages that exceed your SLOs. Different services may have different tolerance levels for errors.

Example Prometheus Alert:

```yaml
- alert: HighErrorRate
  expr: sum(rate(http_request_errors_total[5m])) / sum(rate(http_requests_total[5m])) > 0.05
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "High error rate detected"
    description: "Error rate is above 5% for 5 minutes"
```

### Saturation Alerts

Alert when resources approach their capacity limits. The specific thresholds depend on your system's characteristics, but a common approach is to alert well before 100% utilization.

Example Prometheus Alert:

```yaml
- alert: HighConnectionPoolSaturation
  expr: avg(db_connection_pool_usage_ratio) > 0.8
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "Connection pool nearing capacity"
    description: "Database connection pool usage is above 80% for 5 minutes"
```

## Final Thoughts

The Four Golden Signals provide a powerful framework for monitoring and observability in modern services. By implementing these metrics, you gain visibility into both the user experience and the system health, enabling you to quickly identify, diagnose, and resolve issues in your services.

While the implementation details may vary depending on your specific technology stack, the principles remain the same: monitor latency, traffic, errors, and saturation to get a comprehensive view of your service's health.

By combining the Four Golden Signals with other monitoring frameworks like RED and USE, you can build a robust observability platform that helps you maintain reliable, performant services and delights your users.
