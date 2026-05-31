# Using Prometheus as a Backend for OpenTelemetry Metrics

In today's microservices-heavy world, effective observability is critical for
maintaining system health and understanding behavior. However, organizations
often find themselves juggling multiple monitoring tools, each with their own
strengths and specializations.

Enter the powerful combination of [OpenTelemetry](https://betterstack.com/community/guides/observability/what-is-opentelemetry/) and
[Prometheus](https://betterstack.com/community/guides/monitoring/prometheus/). OpenTelemetry has emerged as the standard for
collecting telemetry data across different languages and platforms, while
Prometheus continues to excel as a robust metrics store with powerful querying
capabilities. Bringing these two tools together creates a formidable
observability stack.

With the recent release of Prometheus 3.0, this integration has become more
natural than ever before. In this article, we'll explore how to leverage
Prometheus as a backend for your OpenTelemetry metrics, unlocking the best of
both worlds for your monitoring needs.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/jN9YpPOom3U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Why combine OpenTelemetry and Prometheus?

Before diving into implementation details, let's understand why this combination
makes sense:

1. **Standardized instrumentation** - OpenTelemetry provides vendor-neutral APIs
   and SDKs across many languages, allowing you to instrument your code once and
   send data to multiple backends.

2. **Powerful storage and querying** - Prometheus offers an efficient
   time-series database with [PromQL](https://betterstack.com/community/guides/monitoring/promql/), giving you a rich language for
   analyzing metrics.

3. **Flexible deployment** - Scale each component independently based on your
   needs, from small single-node setups to distributed clusters.

4. **Community support** - Both projects have large, active communities driving
   continuous improvements, ensuring long-term viability.

5. **Unified observability** - Combine metrics with traces and logs through the
   broader OpenTelemetry ecosystem while leveraging Prometheus's strengths.

This integration allows you to standardize instrumentation across your
organization while maintaining Prometheus as your metrics source of truth. Teams
can continue using familiar Prometheus tooling while benefiting from
OpenTelemetry's extensive instrumentation libraries.

## Setting up the integration

Let's walk through the steps required to get OpenTelemetry metrics flowing into
Prometheus.

First, we need to configure Prometheus to accept [OpenTelemetry Protocol (OTLP)
data](https://betterstack.com/community/guides/observability/otlp/). By default, this receiver is disabled for security reasons, so we
need to explicitly enable it:

```command
prometheus --web.enable-otlp-receiver
```

Or with Docker compose:

```yaml
[label compose.yaml]
services:
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
[highlight]
      - --web.enable-otlp-receiver
[/highlight]
    ports:
      - 9090:9090

volumes:
  prometheus_data:
```

This starts Prometheus with the OTLP receiver enabled, making the endpoint
`/api/v1/otlp/v1/metrics` available for receiving metrics. Since this endpoint
doesn't provide authentication by default, you should only enable it in
environments where you can control access through other means like network
policies or firewalls.

Next, let's update the Prometheus configuration to handle the unique aspects of
OpenTelemetry data. Create or modify your `prometheus.yml` file:

```yaml
[label prometheus.yml]
storage:
  tsdb:
    out_of_order_time_window: 30m

otlp:
  promote_resource_attributes:
    - service.instance.id
    - service.name
    - service.namespace
    - deployment.environment
    - k8s.namespace.name
    - k8s.pod.name

  # Optional: keep the original service.name and service.instance.id
  # in target_info even though they're used for job and instance
  keep_identifying_resource_attributes: true
```

This configuration:

- Enables a 30-minute window for out-of-order sample ingestion, crucial when
  receiving metrics from multiple sources.
- Specifies which OpenTelemetry resource attributes should be promoted to
  Prometheus labels.
- Sets a translation strategy that preserves UTF-8 characters in metric and
  label names.
- Optionally keeps the identifying attributes in target_info for more flexible
  querying.

![A terminal showing Prometheus starting with the OTLP receiver enabled and logs indicating successful configuration](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fb87b45c-e5a6-4570-9ffd-d65009c39900/public =2998x1884)

### Instrumenting your application with OpenTelemetry

Now that Prometheus is ready to receive data, let's instrument an application to
send OpenTelemetry metrics. Here's an example using Node.js:

```javascript
[label otel.js]
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
	MeterProvider,
	PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { NodeSDK, metrics } from "@opentelemetry/sdk-node";
import {
	ATTR_SERVICE_NAME,
	ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

const resource = Resource.default().merge(
	new Resource({
		[ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME,
		[ATTR_SERVICE_VERSION]: "0.1.0",
	}),
);

const metricReader = new PeriodicExportingMetricReader({
	exporter: new OTLPMetricExporter(),

	// Default is 60000ms (60 seconds). Set to 3 seconds for demonstrative purposes only.
	exportIntervalMillis: 3000,
});

const sdk = new NodeSDK({
	resource,
	metricReader,
});

process.on("beforeExit", async () => {
	await sdk.shutdown();
});

sdk.start();
```

```javascript
[label app.js]
import "dotenv/config";
import "./otel.js";
import { metrics } from "@opentelemetry/api";
import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 3000;

const meter = metrics.getMeter(process.env.OTEL_SERVICE_NAME);

// Create instruments
const itemsProcessedCounter = meter.createCounter("inventory.items.processed", {
	description: "Number of inventory items processed",
});

const processingDurationHistogram = meter.createHistogram(
	"inventory.processing.duration",
	{
		description: "Duration of inventory processing operations",
		unit: "ms",
	},
);

const inventoryLevelGauge = meter.createUpDownCounter("inventory.level", {
	description: "Current inventory level",
});

app.get("/process/:count", (req, res) => {
	const count = Number.parseInt(req.params.count, 10);
	const startTime = Date.now();

	// Simulate processing
	setTimeout(() => {
		// Record metrics
		itemsProcessedCounter.add(count);
		processingDurationHistogram.record(Date.now() - startTime);
		inventoryLevelGauge.add(-count);

		res.json({ processed: count });
	}, Math.random() * 500);
});

app.get("/restock/:count", (req, res) => {
	const count = Number.parseInt(req.params.count, 10);
	inventoryLevelGauge.add(count);
	res.json({ restocked: count });
});

app.listen(PORT, () => {
	console.log(`Inventory service running on port ${PORT}`);
});
```

This application creates a more realistic inventory service that:

- Provides API endpoints for processing and restocking inventory
- Tracks multiple metric types: counter (items processed), histogram (processing
  duration), and gauge (inventory level)
- Includes both standard and custom resource attributes
- Exports metrics to Prometheus every 15 seconds

You should also configure this application using environment variables:

```text
[label .env]
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=http://localhost:9090/api/v1/otlp/v1/metrics
OTEL_SERVICE_NAME="inventory-service"
OTEL_RESOURCE_ATTRIBUTES="service.instance.id=123456,deployment.environment=production,custom.team=inventory-management"
OTEL_METRIC_EXPORT_INTERVAL=3000
```

With this in place, starting the application and sending requests to the
endpoints will trigger the creation of the OpenTelemetry metrics which will be
sent to the specified `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT`:

```command
node app.js
```

```text
[output]
Inventory service running on port 3000
```

```command
curl http://localhost:3000/process/4
```

```text
[output]
{"processed":4}
```

## Understanding the data model

One of the most important aspects of successful Prometheus-OpenTelemetry
integration is understanding how the data models interact. Let's explore some
key concepts.

In OpenTelemetry, resource attributes describe the entity producing telemetry
data—they're essentially metadata about your application or service. Examples
include service name, instance ID, environment, or Kubernetes pod name.

When sending these attributes to Prometheus, you have two main options:

1. **Promote them to labels** - This makes the attributes directly available for
   querying and filtering in PromQL.
2. **Access them via `target_info`** - All attributes are stored in a special
   metric that you can join with your application metrics

```yml
[label prometheus.yml]
otlp:
  promote_resource_attributes:
    - service.instance.id
    - service.name
    - service.namespace
    - deployment.environment
    - k8s.namespace.name
    - k8s.pod.name
```

OpenTelemetry uses `service.name` and `service.instance.id` to identify the
source of metrics. Prometheus maps these automatically to its own `job` and
`instance` labels, making OpenTelemetry metrics fit naturally into the
Prometheus model.

While promoting attributes to labels makes them easily accessible in queries, be
cautious about promoting too many. Each additional label increases cardinality,
which can impact Prometheus performance. A good rule of thumb is to keep the
total number of unique label combinations below a few million.

Prometheus and OpenTelemetry also differ in their approaches to metric
temporality and naming conventions. Prometheus 3.0 bridges these gaps by
converting delta metrics to cumulative form, supporting UTF-8 characters, and
applying consistent naming transformations (like adding `_total` suffix to
counters).

[ad-logs]

## Querying OpenTelemetry metrics in Prometheus

Once your metrics are flowing into Prometheus, you can query them using PromQL.
Let's look at some examples using our inventory service metrics.

To see the total number of processed items:

```promql
inventory_items_processed_total
```

![Processed items in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9d3a3749-4fcf-44dc-72ea-e77f10f9f400/lg2x =3282x1604)

Notice that Prometheus has added `_total` to our counter metric name.

To calculate the processing rate over the last 5 minutes:

```promql
rate(inventory_items_processed_total[5m])
```

For our gauge metric (inventory level), no suffix is added:

```promql
inventory_level
```

If you promoted attributes like `deployment.environment`, you can use them
directly in queries:

```promql
rate(inventory_items_processed_total{deployment_environment="production"}[5m])
```

This shows the processing rate only for production environments.

For attributes not promoted to labels, use the `target_info` metric:

```promql
rate(inventory_items_processed_total[5m])
* on (job, instance) group_left (custom_team)
target_info
```

![Prometheus showing rate](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f414136e-3546-45d1-9655-e3ba32a86d00/orig =2192x1254)

This query adds the custom team information to our processing rate metric.

## Advanced features and troubleshooting

Prometheus 3.0 introduces several advanced features that make working with
OpenTelemetry data easier.

With UTF-8 support, you can use more natural naming conventions in your metrics.
If you set the translation strategy to `NoUTF8EscapingWithSuffixes`, metrics
with dots or other special characters will be preserved.

```yaml
[label prometheus.yml]
otlp:
  translation_strategy: NoUTF8EscapingWithSuffixes
```

However, you may see the following error when querying the metric in Prometheus
as more work is still being done to improve interoperability.

![Error in Prometheus](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9439b529-459d-457f-c261-68f1d2576100/public =3230x1672)

For OpenTelemetry setups using delta temporality, enable Prometheus's
experimental support:

```command
prometheus --web.enable-otlp-receiver --feature-flag=otlp-deltatocumulative
```

This converts delta metrics to cumulative form behind the scenes, allowing you
to use standard PromQL functions without changes to your queries.

If you're not seeing expected metrics in Prometheus, check these common issues:

1. **Connectivity**: Ensure your application can reach the Prometheus server.
2. **OTLP configuration**: Confirm the correct endpoint and protocol settings.
3. **Prometheus logs**: Look for ingestion errors or rejected samples.
4. **Export interval**: Try reducing it for faster feedback during testing.
5. **Naming transformations**: Remember that Prometheus may modify metric names
   if `translation_strategy: NoUTF8EscapingWithSuffixes` isn't specified.

## Production considerations

As your metrics volume grows, you may need to:

- Deploy multiple OpenTelemetry collectors to distribute load.
- Scale Prometheus horizontally using solutions like Thanos or Cortex.
- Implement sampling for high-volume metrics.

A typical scaling pattern involves OpenTelemetry SDKs sending to nearby
collectors, which then aggregate and forward to Prometheus.

Alternatively, you can sign up for a
[free Better Stack account](https://betterstack.com/telemetry) for an easy way
to get started with metrics, logs, dashboards, and more without worrying about
scaling considerations. We have a generous forever-free tier and plans for every
use case. [Get started for free now!](https://betterstack.com/users/sign-up)

## Final thoughts

Integrating OpenTelemetry with Prometheus combines the strengths of two powerful
observability tools—the flexible, vendor-neutral instrumentation of
OpenTelemetry with the robust metrics storage and querying capabilities of
Prometheus.

With Prometheus 3.0's improved OpenTelemetry support, this integration has
become more seamless than ever. By following the guidelines in this article, you
can successfully implement a unified metrics pipeline that leverages the best of
both ecosystems.

As both projects continue to evolve, we can expect even better integration in
the future, further simplifying the observability landscape for organizations of
all sizes.

Thanks for reading!