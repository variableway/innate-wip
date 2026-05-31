# Monitoring Node.js Apps with OpenTelemetry Metrics

This tutorial provides a concise guide to implementing OpenTelemetry metrics
within your Node.js applications. We'll cover the essentials of setting up the
OpenTelemetry SDK, working with fundamental metric types (`Counter`,
`UpDownCounter`, `Gauge`, and `Histogram`), and instrumenting your code to
automatically capture HTTP metrics.

You'll also learn how to customize data aggregation, efficiently collect and
filter metrics, and ultimately send this data to an OpenTelemetry Collector for
routing to a backend of your choice. This hands-on approach will equip you with
the knowledge and skills to leverage OpenTelemetry for enhanced observability
and performance analysis in your Node.js applications.

Let's get started!

[ad-logs]

## Prerequisites

Before proceeding with this tutorial, it will be helpful to review the basics of
[metrics in OpenTelemetry](https://betterstack.com/community/guides/observability/opentelemetry-metrics/).

## Step 1 — Setting up the demo project

Let's start by setting up the demo project, a basic Fastify "Hello World"
server. Clone the
[GitHub repository](https://github.com/betterstack-community/otel-metrics-golang)
to your machine:

```command
git clone https://github.com/betterstack-community/otel-metrics-nodejs
```

Then navigate to the project directory:

```command
cd otel-metrics-nodejs
```

The project uses Docker Compose, defined in `docker-compose.yml`, to set up two
services:

```yaml
[label docker-compose.yml]
services:
  app:
    build:
      context: .
      target: ${NODE_ENV}
    container_name: nodejs-metrics-demo
    environment:
      PORT: ${PORT}
      LOG_LEVEL: ${LOG_LEVEL}
      OTEL_SERVICE_NAME: ${OTEL_SERVICE_NAME}
      OTEL_EXPORTER_OTLP_ENDPOINT: ${OTEL_EXPORTER_OTLP_ENDPOINT}
    env_file:
      - ./.env
    ports:
      - 8000:8000
    networks:
      - nodejs-metrics-demo-network
    volumes:
      - .:/node/app

  collector:
    container_name: nodejs-metrics-demo-collector
    image: otel/opentelemetry-collector:latest
    volumes:
      - ./otelcol.yaml:/etc/otelcol/config.yaml
    networks:
      - nodejs-metrics-demo-network

networks:
  nodejs-metrics-demo-network:
```

- `app`: This service runs the application on port `8000`. It uses
  [nodemon](https://www.npmjs.com/package/nodemon) for live reloading on file
  changes.

- `collector`: This service runs the [OpenTelemetry
  Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/) and configures it using the `otelcol.yaml`
  file.

Before launching the services, rename the `.env.example` file to `.env`. This
file contains basic configuration settings for the application:

```text
[label .env]
NODE_ENV=development
PORT=8000
OTEL_SERVICE_NAME=nodejs-metrics-demo
LOG_LEVEL=info
OTEL_EXPORTER_OTLP_ENDPOINT=http://nodejs-metrics-demo-collector:4318
```

```command
mv .env.example .env
```

To launch both services, execute this command:

```command
docker compose up
```

You should see output similar to the following:

```text
[output]
. . .
nodejs-metrics-demo            | > otel-metrics-nodejs@1.0.0 dev
nodejs-metrics-demo            | > nodemon main.js
nodejs-metrics-demo            |
nodejs-metrics-demo            | [nodemon] 3.1.7
nodejs-metrics-demo            | [nodemon] to restart at any time, enter `rs`
nodejs-metrics-demo            | [nodemon] watching path(s): *.*
nodejs-metrics-demo            | [nodemon] watching extensions: js,mjs,cjs,json
nodejs-metrics-demo            | [nodemon] starting `node main.js`
nodejs-metrics-demo            | {"level":30,"time":1730991149200,"pid":32,"hostname":"f1dce9ace51f","msg":"Server listening at http://127.0.0.1:8000"}
nodejs-metrics-demo            | {"level":30,"time":1730991149201,"pid":32,"hostname":"f1dce9ace51f","msg":"Server listening at http://192.168.32.3:8000"}
. . .
```

To test the application, send a request to the root endpoint from a different
terminal:

```command
curl http://localhost:8000
```

The response should be:

```text
[output]
Hello world
```

Now that the services are up and running, let's go ahead and set up the
OpenTelemetry SDK in the next step.

## Step 2 — Initializing the OpenTelemetry SDK

Before you can instrument your application with OpenTelemetry, install the
required packages:

```command
npm install @opentelemetry/api @opentelemetry/resources @opentelemetry/sdk-metrics @opentelemetry/semantic-conventions
```

This installs the following OpenTelemetry SDK components:

- [@opentelemetry/api](https://www.npmjs.com/package/@opentelemetry/api):
  Provides the Node.js implementation of OpenTelemetry APIs.
- [@opentelemetry/sdk-metrics](https://www.npmjs.com/package/@opentelemetry/sdk-metrics):
  Implements the OpenTelemetry Metrics SDK for Node.js.
- [@opentelemetry/sdk-node](https://www.npmjs.com/package/@opentelemetry/sdk-node):
  This package provides the full OpenTelemetry SDK for Node.js.
- [@opentelemetry/semantic-conventions](https://www.npmjs.com/package/@opentelemetry/semantic-conventions):
  This package implements [OpenTelemetry semantic
  conventions](https://betterstack.com/community/guides/observability/opentelemetry-semantic-conventions/).
- [@opentelemetry/resources](https://www.npmjs.com/package/@opentelemetry/resources):
  Enables the creation and representation of OpenTelemetry resources.
- [@opentelemetry/instrumentation](https://www.npmjs.com/package/@opentelemetry/instrumentation):
  This package provides a Scope type to signal the source of telemetry data.

Next, initialize a `MeterProvider` to manage metrics within your application.
This step is crucial; otherwise, OpenTelemetry defaults to a no-operation mode,
and no data is collected.

Create an `otel.js` file at the project root with the following code to set up
the OpenTelemetry SDK:

```javascript
[otel.js]
import { Resource } from "@opentelemetry/resources";
import {
	ConsoleMetricExporter,
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
	exporter: new ConsoleMetricExporter(),

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

This code configures a metrics system for your Node.js application using
OpenTelemetry. It defines a `resource` to identify your application, specifying
its name and version. A `metricReader` is created, set to export metrics to the
console every three seconds for demonstration purposes. Finally, a `NodeSDK()`
is configured with the defined `metricReader` and `resource`, and initialized.

Now, modify your `main.js` file to incorporate the OpenTelemetry setup:

```go
[label main.js]
[highlight]
import "./otel.js";
[/highlight]
import Fastify from "fastify";

. . .
```

This imports the `otel.js` file, initializing the OpenTelemetry SDK within your
application.

With this foundation in place, you can proceed to automatically instrument the
Fastify server to collect metrics.

## Step 3 — Automatically instrument HTTP server metrics

OpenTelemetry offers automatic instrumentation for popular libraries, saving you
time and allowing you to concentrate on metrics specific to your business logic.
Since this application uses the Fastify server, you'll utilize the corresponding
instrumentation package:
[@opentelemetry/instrumentation-fastify](https://www.npmjs.com/package/@opentelemetry/instrumentation-fastify).

If you're using a different framework (such as Express), you can find the
appropriate instrumentation library in the
[OpenTelemetry Registry](https://opentelemetry.io/ecosystem/registry/?language=js&component=instrumentation).

Install the Fastify instrumentation along with the generic HTTP instrumentation:

```command
npm install @opentelemetry/instrumentation-http @opentelemetry/instrumentation-fastify
```

Then, update your `otel.js` file:

```javascript
[label otel.js]
[highlight]
import { FastifyInstrumentation } from "@opentelemetry/instrumentation-fastify";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
[/highlight]
import { Resource } from "@opentelemetry/resources";

. . .

const sdk = new NodeSDK({
	resource,
	metricReader,
[highlight]
	instrumentations: [new HttpInstrumentation(), new FastifyInstrumentation()],
[/highlight]
});

. . .
```

These packages automatically add both metric and trace instrumentation for the
`http` and `fastify` packages. Since you haven't set up a trace provider yet,
traces will default to a no-op implementation.

After modifying the code, the server will automatically restart. Send a request
to the root endpoint next:

```command
curl http://localhost:8000
```

```text
[output]
Hello world
```

You'll observe the following output in your console:

```json
{
  descriptor: {
[highlight]
    name: 'http.server.duration',
[/highlight]
    type: 'HISTOGRAM',
    description: 'Measures the duration of inbound HTTP requests.',
    unit: 'ms',
    valueType: 1,
    advice: {}
  },
  dataPointType: 0,
  dataPoints: [
    {
      attributes: {. . .},
      startTime: [ 1731050420, 601000000 ],
      endTime: [ 1731050423, 231000000 ],
      value: {
        min: 4.938558,
        max: 4.938558,
        sum: 4.938558,
        buckets: {
          boundaries: [
               0,    5,    10,   25,
              50,   75,   100,  250,
             500,  750,  1000, 2500,
            5000, 7500, 10000
          ],
          counts: [
            0, 1, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0
          ]
        },
        count: 1
      }
    }
  ]
}
{
  descriptor: {
[highlight]
    name: 'http.client.duration',
[/highlight]
    type: 'HISTOGRAM',
    description: 'Measures the duration of outbound HTTP requests.',
    unit: 'ms',
    valueType: 1,
    advice: {}
  },
  dataPointType: 0,
  dataPoints: [
    {
      attributes: { 'http.method': 'POST', 'net.peer.name': 'localhost' },
      startTime: [ 1731062189, 890000000 ],
      endTime: [ 1731062197, 316000000 ],
      value: {
        min: 5.970701,
        max: 5.970701,
        sum: 5.970701,
        buckets: {
          boundaries: [
               0,    5,    10,   25,
              50,   75,   100,  250,
             500,  750,  1000, 2500,
            5000, 7500, 10000
          ],
          counts: [
            0, 0, 1, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0
          ]
        },
        count: 1
      }
    }
  ]
}
```

Currently, only two metrics are automatically instrumented:

1. `http.server.duration`: A histogram measuring the duration of inbound HTTP
   requests, with data grouped into buckets for analyzing response times.
2. `http.client.duration`: A histogram measuring the duration of bound HTTP
   requests.

In the next steps, you'll we'll look at creating custom metrics specific to your
needs.

## Step 4 — Creating a Counter metric

To demonstrate the creation of a `Counter` metric, let's track the cumulative
number of HTTP requests received by the server.

Edit your `main.js` file to include the new metric setup:

```javascript
import "./otel.js";
[highlight]
import { metrics } from "@opentelemetry/api";
[/highlight]
import Fastify from "fastify";

[highlight]
const meter = metrics.getMeter(process.env.OTEL_SERVICE_NAME);

const httpRequestCounter = meter.createCounter("http.server.requests", {
	description: "Total number of HTTP requests received.",
	unit: "{requests}",
});
[/highlight]

const fastifyApp = Fastify({
	logger: true,
});

fastifyApp.get("/", (req, reply) => {
[highlight]
	httpRequestCounter.add(1);
[/highlight]
	reply.send("Hello World!");
});

const address = await fastifyApp.listen({
	host: "0.0.0.0",
	port: process.env.PORT || "8000",
});
```

This code snippet introduces a custom counter metric to your application.

First, it obtains a `meter` instance using
`metrics.getMeter(process.env.OTEL_SERVICE_NAME)`. This `meter` is associated
with your service name, providing context for the metrics it generates.

Then, it defines a counter metric named `http.server.requests` with the
description "Total number of HTTP requests received". This counter will track
the cumulative number of HTTP requests handled by your server.

Inside the route handler for the root path, the counter is incremented each time
a new request is received.

The server will automatically restart after you save these changes. Send another
request to the server's root:

```command
curl http://localhost:8000
```

You'll now see the new counter metric in the console output:

```json
[output]
{
  descriptor: {
    name: 'http.server.requests',
    type: 'COUNTER',
    description: 'Total number of HTTP requests received.',
    unit: '{requests}',
    valueType: 1,
    advice: {}
  },
  dataPointType: 3,
  dataPoints: [
    {
      attributes: {},
      startTime: [ 1731062906, 735000000 ],
      endTime: [ 1731062907, 834000000 ],
      value: 1
    }
  ]
}
```

This output shows the `http.server.requests` counter metric with a value of `1`,
indicating that one HTTP request has been processed since the server started.
The `startTime` and `endTime` fields represent the time interval over which this
count was recorded.

## Step 5 — Creating an UpDownCounter metric

An `UpDownCounter` metric is used to track values that can both increase and
decrease. This makes it well-suited for monitoring things like the current
number of active requests being handled by your server. Here, you'll implement
an `UpDownCounter` to keep track of these in-progress requests.

Modify your `main.js` file to incorporate this new metric:

```go
[label main.js]
import "./otel.js";
import { metrics } from "@opentelemetry/api";
import Fastify from "fastify";

const meter = metrics.getMeter(process.env.OTEL_SERVICE_NAME);

const httpRequestCounter = meter.createCounter("http.server.requests", {
	description: "Total number of HTTP requests received.",
	unit: "{requests}",
});
[highlight]
const activeRequestUpDownCounter = meter.createUpDownCounter(
	"http.server.active_requests",
	{
		description: "Number of in-flight requests.",
		unit: "{requests}",
	},
);
[/highlight]

const fastifyApp = Fastify({
	logger: true,
});

fastifyApp.get("/", async (req, reply) => {
	httpRequestCounter.add(1);
[highlight]
	activeRequestUpDownCounter.add(1);
	await new Promise((resolve) => setTimeout(resolve, 5000));
[/highlight]
	reply.send("Hello World!");
[highlight]
	activeRequestUpDownCounter.add(-1);
[/highlight]
});

const address = await fastifyApp.listen({
	host: "0.0.0.0",
	port: process.env.PORT || "8000",
});
```

In this code, `activeRequestUpDownCounter` is your new `UpDownCounter`. When the
server receives a request, this counter increases by one; when a response is
sent, it decreases by one.

This provides a real-time view of the number of requests currently being
processed. To make this behavior more visible, a simulated delay of 5 seconds is
introduced using `new Promise()` to keep requests active for a longer period.

After saving the file, generate some traffic to the server's root endpoint. You
can use a tool like [wrk](https://github.com/wg/wrk) for this:

```command
wrk -t 10 -c400 -d 10s --latency "http://localhost:8000"
```

This command simulates a high volume of traffic with 10 threads and 400
connections sustained over 10 seconds.

While the load test is running, you'll observe the `http.server.active_requests`
metric fluctuating, reflecting the number of requests currently in progress.
Once the `wrk` command finishes, this value will eventually return to 0.

```json
[output]
{
  descriptor: {
    name: 'http.server.active_requests',
    type: 'UP_DOWN_COUNTER',
    description: 'Number of in-flight requests.',
    unit: '{requests}',
    valueType: 1,
    advice: {}
  },
  dataPointType: 3,
  dataPoints: [
    {
      attributes: {},
      startTime: [ 1731064111, 178000000 ],
      endTime: [ 1731064165, 514000000 ],
      value: 400
    }
  ]
}
```

This output displays the `http.server.active_requests` metric, which reached a
value of 400 during the load test. This indicates that, at its peak, the server
was concurrently handling 400 requests. This will eventually go down to 0 when
the command exits.

## Step 6 — Creating a Guage metric

A Gauge metric in OpenTelemetry is used to capture measurements at a specific
point in time. Unlike counters, which accumulate values over time, gauges
reflect the current state of a metric. This is ideal for tracking values like
memory usage, CPU utilization, or temperature, which fluctuate continuously.

In this step, you'll create a Gauge metric to monitor the memory usage of your
Node.js process. You'll use the `ObservableGauge` instrument, as the memory
measurement isn't directly tied to a specific event but needs to be observed
periodically.

Here's the code to set up the gauge:

```javascript
[label main.js]
[highlight]
const memoryUsageObservableGuage = meter.createObservableGauge(
	"system.memory.heap",
	{
		description: "Memory usage of the allocated heap objects.",
		unit: "By",
	},
);
memoryUsageObservableGuage.addCallback((result) => {
	result.observe(process.memoryUsage().heapUsed);
});
[/highlight]

const fastifyApp = Fastify({
	logger: true,
});

. . .
```

This code defines an `ObservableGauge` named `system.memory.heap` to track heap
memory usage. The `addCallback` function provides the logic for observing the
metric. Inside the callback, `process.memoryUsage().heapUsed` retrieves the
current heap memory usage, and `result.observe()` reports this value to
OpenTelemetry.

Since the metrics are configured to be collected every 3 seconds (as defined in
`otel.js`), this callback function, and thus the memory measurement, will also
execute every 3 seconds.

You'll then see output like this in your console:

```jsonc
[output]
{
  descriptor: {
    name: 'system.memory.heap',
    type: 'OBSERVABLE_GAUGE',
    description: 'Memory usage of the allocated heap objects.',
    unit: 'By',
    valueType: 1,
    advice: {}
  },
  dataPointType: 2,
  dataPoints: [
    {
      attributes: {},
      startTime: [ 1731077051, 834000000 ],
      endTime: [ 1731077051, 834000000 ],
      value: 14233384
    }
  ]
}
```

This output shows the `system.memory.heap` gauge reporting a value of `14233384`
bytes, which represents the heap memory used at that specific moment. You'll
notice that the `startTime` and `endTime` are identical because gauge
measurements represent a snapshot in time.

## Step 7 — Creating a Histogram metric

Histograms are a powerful tool for understanding the distribution of values in
your application. They group measurements into buckets, allowing you to see how
often values fall within certain ranges. This is particularly useful for metrics
like the duration of operations, where you might want to know the percentage of
requests that take longer than a specific time.

In OpenTelemetry, creating a histogram is done using the
`meter.createHistogram()` method:

```javascript
import "./otel.js";
[highlight]
import { PerformanceObserver, performance } from "node:perf_hooks";
[/highlight]
import { metrics } from "@opentelemetry/api";
import Fastify from "fastify";

. . .
[highlight]
const requestDurHistogram = meter.createHistogram(
	"http.client.request.duration",
	{
		description: "The duration of an outgoing HTTP request.",
		unit: "s",
		advice: {
			explicitBucketBoundaries: [
				0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1, 2.5, 5, 7.5, 10,
			],
		},
	},
);
[/highlight]

const fastifyApp = Fastify({
	logger: true,
});

[highlight]
const observer = new PerformanceObserver((list) => {
	for (const entry of list.getEntries()) {
		if (entry.initiatorType === "fetch") {
			requestDurHistogram.record(entry.duration / 1000, {
				url: entry.name,
			});
		}
	}

	performance.clearResourceTimings();
});

observer.observe({ entryTypes: ["resource"] });
[/highlight]

fastifyApp.get("/", async (req, reply) => {
	httpRequestCounter.add(1);
	activeRequestUpDownCounter.add(1);
	await new Promise((resolve) => setTimeout(resolve, 5000));
	reply.send("Hello World!");
	activeRequestUpDownCounter.add(-1);
});

[highlight]
fastifyApp.get("/posts", async (_request, reply) => {
	const response = await fetch("https://jsonplaceholder.typicode.com/posts");
	reply.send(await response.json());
});
[/highlight]
```

This code defines a histogram named `http.client.request.duration` to measure
the time taken for outgoing HTTP requests. It also configures explicit bucket
boundaries, allowing you to categorize request durations into specific ranges.

To capture the duration of HTTP requests made using the fetch API, a
`PerformanceObserver()` is used. This observer listens for resource entries,
which include network requests. When a fetch request completes, the observer
records the request duration in the histogram along with the URL of the request.

Now, when you make a request to the `/posts` endpoint, which fetches data from
an external API, the observer will capture the request duration and record it in
the histogram:

```command
curl http://localhost:8000/posts
```

This will generate output similar to the following:

```json
{
  descriptor: {
    name: 'http.client.request.duration',
    type: 'HISTOGRAM',
    description: 'The duration of an HTTP request.',
    unit: 's',
    valueType: 1,
    advice: {
      explicitBucketBoundaries: [
        0.005, 0.01, 0.025, 0.05,
        0.075,  0.1,  0.25,  0.5,
         0.75,    1,   2.5,    5,
          7.5,   10
      ]
    }
  },
  dataPointType: 0,
  dataPoints: [
    {
      attributes: { url: 'https://jsonplaceholder.typicode.com/posts' },
      startTime: [ 1731096474, 842000000 ],
      endTime: [ 1731096477, 526000000 ],
      value: {
        min: 1.0245768009999991,
        max: 1.0245768009999991,
        sum: 1.0245768009999991,
        buckets: {
          boundaries: [
            0.005, 0.01, 0.025, 0.05,
            0.075,  0.1,  0.25,  0.5,
             0.75,    1,   2.5,    5,
              7.5,   10
          ],
          counts: [
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 1, 0,
            0, 0, 0
          ]
        },
        count: 1
      }
    }
  ]
}
```

This output shows the `http.client.request.duration` histogram capturing the
duration of the request to `https://jsonplaceholder.typicode.com/posts`. The
value field provides details about the distribution:

- `min`: The minimum observed duration.
- `max`: The maximum observed duration.
- `sum`: The total duration of all observed requests.
- `buckets`: The number of requests falling into each predefined bucket.
- `count`: The total number of requests observed.

This histogram data gives you insights into the distribution of request
durations, helping you identify performance bottlenecks and optimize your
application.

## Step 8 — Sending metrics data to an OpenTelemetry backend

After configuring your application to gather metrics, the next crucial step is
to send this valuable data to an OpenTelemetry backend. This backend will enable
you to analyze, visualize, and gain insights from your metrics. A standard and
efficient method is to utilize the OpenTelemetry Collector.

This component acts as an intermediary, receiving metrics from your application,
processing them, and then forwarding them to the backend of your choice. This
approach provides flexibility, as the Collector can seamlessly integrate with a
wide range of backend systems. In this step, we'll send the collected metrics to
[Better Stack](https://betterstack.com/telemetry).

Begin by creating a
[free Better Stack account](https://telemetry.betterstack.com/users/sign-up).
Once you're logged in, navigate to the
[Telemetry dashboard](https://telemetry.betterstack.com/dashboard). In the
**Sources** menu, select **Connect source**:

![Connect source](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d1932bab-aac5-4d87-44ec-0cdd32bbad00/public
=3840x1051)

Give your source a descriptive name like **Node.js Metrics Demo** and choose
**OpenTelemetry** as the platform. Then, click **Create source**:

![Creating a source in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7321a77a-f5b0-4e60-d02d-a5572b667000/md1x
=2829x1802)

This will take you to a page displaying details about your newly created source.
You'll need the source token from this page to configure the OpenTelemetry
Collector:

![Copy the source token](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/22a90694-9d46-4874-a561-4cca3e03cc00/lg1x
=2499x1289)

If you scroll down, you'll see a message indicating that Better Stack is waiting
to receive metrics:

![Waiting for metrics](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/db7c0ef6-6f71-4083-e66e-b0eb706fb800/lg1x
=2103x1107)

Now, switch back to your code editor and open the `otelcol.yaml` file. Locate
the `<source_token>` placeholder and replace it with the token you copied from
Better Stack:

```yaml
[label otelcol.yaml]
receivers:
  otlp:
    protocols:
      http:
        endpoint: otel-metrics-demo-collector:4318

processors:
  attributes/betterstack:
    actions:
      - key: better_stack_source_token
[highlight]
        value: <source_token>
[/highlight]
        action: insert
  batch:

exporters:
  prometheusremotewrite/betterstack:
    endpoint: https://in-otel.logs.betterstack.com/metrics

service:
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [batch, attributes/betterstack]
      exporters: [prometheusremotewrite/betterstack]
```

Next, install the
[@opentelemetry/exporter-metrics-otlp-http package](https://www.npmjs.com/package/@opentelemetry/exporter-metrics-otlp-http),
which allows your Node.js application to send metrics via HTTP:

```command
npm install --save @opentelemetry/exporter-metrics-otlp-http
```

After the installation, modify your `otel.js` file to use this exporter:

```javascript
[label otel.js]
[highlight]
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
[/highlight]

. . .

const metricReader = new PeriodicExportingMetricReader({
[highlight]
	exporter: new OTLPMetricExporter(),
[/highlight]

	// Default is 60000ms (60 seconds). Set to 3 seconds for demonstrative purposes only.
	exportIntervalMillis: 3000,
});

. . .
```

This configuration tells your application to send metrics to the HTTP endpoint
specified by the `OTEL_EXPORTER_OTLP_ENDPOINT` environment variable, which is
set to `http://nodejs-metrics-demo-collector:4318`.

To apply these changes, restart your Docker Compose services:

```command
docker compose restart
```

Once the containers have restarted, trigger some activity in your application to
generate metrics. You can simply send a request to the server's root endpoint:

```command
curl http://localhost:8000
```

Return to your Better Stack dashboard and you should see a "Metrics received"
message, confirming that your application's metrics are now being successfully
ingested by Better Stack.

![Metrics received in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/11ba4591-3387-45c8-170e-da23effade00/md1x
=2103x1107)

You can now explore Better Stack's built-in OpenTelemetry dashboards to
visualize and analyze your metrics. We'll delve into more advanced visualization
and analysis techniques in a future tutorial.

## Final thoughts

This tutorial provided a comprehensive overview of implementing OpenTelemetry
metrics in your Node.js applications. We covered the key aspects of setting up
the OpenTelemetry SDK, instrumenting your application to capture valuable
metrics, and efficiently managing the collected data. By routing your metrics
through the OpenTelemetry Collector, you gain the flexibility to send them to
various backend systems for analysis and visualization.

OpenTelemetry empowers you to build more resilient and performant applications
by providing a unified framework for distributed tracing, metrics, and logs.
This observability enables you to gain deep insights into your application's
behavior and make data-driven decisions to optimize its performance and enhance
user experience.

As you continue your OpenTelemetry journey, consider exploring distributed
tracing to understand the flow of requests within your application or
configuring custom processors in the OpenTelemetry Collector to tailor data
processing to your specific needs.

Happy monitoring!