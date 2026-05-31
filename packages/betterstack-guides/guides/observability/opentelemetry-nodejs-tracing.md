# Distributed Tracing in Node.js with OpenTelemetry

OpenTelemetry is an observability framework that simplifies the process of
capturing and standardizing telemetry data—such as logs, traces, and
metrics—across various programming languages and platforms.

It provides a consistent approach to instrumenting applications, regardless of
programming language, frameworks, or observability tools you're using.

In this guide, **we'll explore how to use OpenTelemetry to add tracing to your
Node.js applications**.

By the end of this tutorial, you'll be equipped to monitor and analyze your
application's performance through detailed trace data, identify bottlenecks, and
optimize its behavior effectively.

Let's begin!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/wQKjCDD7nfk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Prerequisites

- Prior Node.js development experience.
- Docker and Docker Compose installed.
- Basic understanding of [distributed tracing terminology](https://betterstack.com/community/guides/observability/distributed-tracing/)
  terminology.
- Basic familiarity with [OpenTelemetry concepts](https://betterstack.com/community/guides/observability/what-is-opentelemetry/).

## Step 1 — Setting up the demo project

In this tutorial, you'll learn how to instrument a Node.js application to
generate traces using OpenTelemetry.

[The application](https://github.com/betterstack-community/json-to-yaml-nodejs) you'll
work with is designed for converting JSON to YAML. It features GitHub social
login with cookie-based session management to prevent unauthorized access.

To get started, clone the application repository to your local machine:

```command
git clone https://github.com/betterstack-community/json-to-yaml-nodejs.git
```

Navigate into the project directory and install the necessary dependencies:

```command
cd json-to-yaml-nodejs
```

```command
npm install
```

Here's the top-level directory structure of the project:

```text
.
├── auth
│   ├── app.js
│   ├── controllers
│   ├── db
│   ├── public
│   ├── redis.js
│   ├── routes
│   ├── schemas
│   ├── server.js
│   └── views
├── auth.Dockerfile
├── config
│   ├── db.js
│   ├── env.js
│   └── logger.js
├── converter
│   ├── app.js
│   ├── controllers
│   ├── routes
│   └── server.js
├── converter.Dockerfile
├── docker-compose.yml
├── LICENSE
├── package.json
├── package-lock.json
├── README.md
├── screenshot.png
└── tags
```

The `auth` directory contains the service responsible for authentication and
session management, while the `converter` directory hosts the service that
handles the conversion from JSON to YAML.

All user requests are processed through the `auth` service before reaching the
`converter` service. The setup also relies on Redis, PostgreSQL, and the GitHub
API to illustrate how tracing can help you understand service interactions.

Next, rename the `.env.sample` file to `.env`:

```command
mv .env.sample .env
```

Before starting the services, you'll need to
[create a GitHub application](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app)
to enable
[GitHub OAuth](https://docs.github.com/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
for user authentication.

Open the **GitHub Developer Settings** page at
`https://github.com/settings/apps` in your browser:

![GitHub New App page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9aebf276-1f74-43af-8e8c-dc2e6bde8c00/lg1x
=1439x616)

Click the **New GitHub App** button, provide a suitable name, and set the
**Homepage URL** to `http://localhost:8000` with the **Callback URL** set to
`http://localhost:8000/auth/github/callback`.

![GitHub Register New App page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6f3c3790-db58-410c-e5a3-3e1f24d1d500/md2x
=1439x1283)

Scroll down the page and make sure to uncheck the **Webhook** option, as it
won't be needed for this tutorial:

![Deactivate WebHook](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1d3a0886-f129-4830-cd1d-d7bd02670b00/orig
=3102x1978)

Once you're done, click **Create GitHub App** at the bottom of the page:

![GitHub Create App Button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0ec2c147-4935-4a1e-9b59-2eaf54dfdc00/orig
=3102x1978)

On the resulting page, click the **Generate a new client secret** button, then
copy both the generated token and the **Client ID**:

![GitHub App Copy Client Secret and Client ID](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/95625ba6-349c-4bc5-4635-d1e02758bd00/lg2x
=3102x2434)

Now, return to your terminal, open the `.env` file in your text editor, and
update the highlighted lines with the copied values:

```command
code .env
```

```text
[label .env]
. . .
[highlight]
GITHUB_CLIENT_ID=<your_github_client_id>
GITHUB_CLIENT_SECRET=<your_github_client_secret>
[/highlight]
. . .
```

Finally, launch the application and its associated services. You can start the
entire setup locally using Docker Compose:

```command
docker compose up -d --build
```

This command will initiate the following containers:

```text
[output]
. . .
 ✔ Service auth                                      Built      12.3s
 ✔ Service converter                                 Built       1.7s
 ✔ Network json-to-yaml-nodejs_json-to-yaml-network  Created     0.2s
 ✔ Container json-to-yaml-db                         Healthy    11.4s
 ✔ Container json-to-yaml-redis                      Healthy    11.4s
 ✔ Container json-to-yaml-auth                       Started    11.4s
 ✔ Container json-to-yaml-converter                  Started    11.6s
```

- The `auth` container handles authentication and is accessible at
  `http://localhost:8000`. The `app` container runs the `converter` service on
  port 8001 in the container but isn't exposed to `localhost`. Both services are
  utilizing `nodemon` for live reloading on file changes.
- The `db` container runs PostgreSQL, while `redis` runs Redis.

With everything up and running, navigate to `http://localhost:8000` in your
browser to access the application UI:

![JSON Converter Page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/56c3f657-9ab8-4421-743f-70c134db1a00/orig
=2510x1520)

After authenticating with GitHub, you'll be redirected to the following page:

![JSON Converter Authenticated](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2712d7c6-2df6-4a3d-2b9d-e6298b907100/md1x
=2998x1846)

Input a valid JSON object in the provided field, and click the **Convert**
button:

```json
{
  "trailingComma": "es5",
  "tabWidth": 4,
  "semi": false,
  "singleQuote": true
}
```

You should see the resulting YAML response displayed in your browser:

![JSON Converter showing YAML response](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d2d893d8-1d01-4060-c26b-282ec6506e00/lg2x
=2138x762)

You've successfully set up and explored the demo application in this initial
step.

In the upcoming sections, you'll learn how to instrument the services with the
Node.js OpenTelemetry SDK and [visualize the traces in Jaeger](https://betterstack.com/community/guides/observability/jaeger-guide/).

[summary]
### Skip manual OpenTelemetry instrumentation

While manual instrumentation gives you control over your traces, [Better Stack Tracing](https://betterstack.com/tracing/) uses eBPF to automatically instrument your Kubernetes or Docker workloads without code changes. Your traces start flowing immediately, and databases get recognized automatically without configuring exporters or collectors.

**Predictable pricing and up to 30x cheaper than Datadog.** Start free in minutes.
[/summary]

![Better Stack Tracing bubble up view highlighting the root cause of a slow request](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ea6d6faf-b150-4ef2-0765-02113ea7b100/md2x =4160x2378)


## Step 2 — Initializing the Node.js OpenTelemetry SDK

Now that you've set up with the sample application, it's time to implement basic
trace instrumentation using OpenTelemetry. This will allow the application to
generate traces for every HTTP request it processes.

To get started, you'll need to set up the OpenTelemetry SDK in your application.
Install the required dependencies by running the following command in your
terminal:

```command
npm install @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/sdk-trace-node \
  @opentelemetry/api
```

This command installs these OpenTelemetry SDK components:

- [@opentelemetry/sdk-node](https://www.npmjs.com/package/@opentelemetry/sdk-node):
  Provides the core functionality for initializing the OpenTelemetry SDK in a
  Node.js environment.
- [@opentelemetry/auto-instrumentations-node](https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node):
  Automatically instruments supported libraries and frameworks, allowing you to
  trace requests without manually adding instrumentation code.
- [@opentelemetry/sdk-trace-node](https://www.npmjs.com/package/@opentelemetry/sdk-trace-node):
  Contains the tracing implementation for Node.js applications, enabling the
  capture of span data for monitored operations.
- [@opentelemetry/api](https://www.npmjs.com/package/@opentelemetry/api):
  Defines the data types and interfaces for creating and manipulating telemetry
  data according to the OpenTelemetry specification.

After installing the necessary packages, create a file named `otel.js` in the
root directory of your project and insert the following code into this file:

```javascript
[label otel.js]
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";

const sdk = new NodeSDK({
	traceExporter: new ConsoleSpanExporter(),
	instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

This code sets up OpenTelemetry to automatically instrument a Node.js
application and export the generated trace data directly to the console.

The `getNodeAutoInstrumentations()` function enables automatic instrumentation
for supported libraries and frameworks, such as Fastify, Redis, and PostgreSQL
(`pg`), which are used in both the `auth` and `converter` services.

By adopting this approach, tracing becomes much simpler to implement as it
eliminates the need for manually instrumenting each library.

It does come at a cost of increasing the size of your dependencies so if this is
a concern, ensure to
[search the OpenTelemetry Registry](https://opentelemetry.io/ecosystem/registry/?language=js&component=instrumentation)
for specific instrumentation packages for the libraries you're actually using.

![Screenshot of OpenTelemetry Registry](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/aefcb166-ef18-4b6a-b0d6-c301868bae00/lg2x
=3158x2030)

To activate tracing in both services, simply register the `otel.js` file at the
beginning of the `auth/server.js` and `converter/server.js` files as shown
below:

```javascript
[auth/server.js]
import '../otel.js';
. . .
```

```javascript
[converter/server.js]
import '../otel.js';
. . .
```

With this in place, you'll start seeing the trace data in the console when you
view the logs for the running services:

```command
docker compose logs -f auth converter
```

If you visit `http://localhost:8000/auth` in your browser, you will see an
output similar to what's shown below:

```javascript
[output]
{
  resource: {
    attributes: {
      'service.name': 'unknown_service:/usr/local/bin/node',
      'telemetry.sdk.language': 'nodejs',
      'telemetry.sdk.name': 'opentelemetry',
      'telemetry.sdk.version': '1.26.0',
      'process.pid': 60,
      'process.executable.name': '/usr/local/bin/node',
      'process.executable.path': '/usr/local/bin/node',
      'process.command_args': ['/usr/local/bin/node', '/node/app/auth/server.js'],
      'process.runtime.version': '20.17.0',
      'process.runtime.name': 'nodejs',
      'process.runtime.description': 'Node.js',
      'process.command': '/node/app/auth/server.js',
      'process.owner': 'root',
      'host.name': 'a4e67b9cd391',
      'host.arch': 'amd64'
    }
  },
  instrumentationScope: {
    name: '@opentelemetry/instrumentation-http',
    version: '0.53.0',
    schemaUrl: undefined
  },
  traceId: '22695de23822cd0d7a401cc0494e5e16',
  parentId: undefined,
  traceState: undefined,
  name: 'GET',
  id: '4fe792539cbf5b61',
  kind: 1,
  timestamp: 1728405972211000,
  duration: 46121.586,
  attributes: {
    'http.url': 'http://localhost:8000/auth',
    'http.host': 'localhost:8000',
    'net.host.name': 'localhost',
    'http.method': 'GET',
    'http.scheme': 'http',
    'http.target': '/auth',
    'http.user_agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'http.flavor': '1.1',
    'net.transport': 'ip_tcp',
    'net.host.ip': '172.31.0.4',
    'net.host.port': 8000,
    'net.peer.ip': '172.31.0.1',
    'net.peer.port': 53694,
    'http.status_code': 200,
    'http.status_text': 'OK'
  },
  status: {
    code: 0
  },
  events: [],
  links: []
}
```

In this example, the `resource` section includes critical information about the
application, such as its name, SDK details, process attributes, and the host
environment, which helps identify where the span originated.

You'll notice that the `service.name` attribute is reported as
`unknown_service`. This is because the `OTEL_SERVICE_NAME` environmental
variable isn't defined at the moment.

To set it up, add the following to the bottom of your `.env` file:

```text
[label .env]
. . .
AUTH_OTEL_SERVICE_NAME=auth-service
CONVERTER_OTEL_SERVICE_NAME=converter-service
```

Then modify your `auth` and `converter` services by adding the highlighted lines
below:

```yaml
[label docker-compose.yml]
services:
  auth:
    build:
      dockerfile: auth.Dockerfile
      context: .
      target: ${NODE_ENV}
    container_name: json-to-yaml-auth
    environment:
      . . .
[highlight]
      OTEL_SERVICE_NAME: ${AUTH_OTEL_SERVICE_NAME}
[/highlight]
    env_file:
      - ./.env
    depends_on:
      redis:
        condition: service_healthy
      postgres:
        condition: service_healthy
    ports:
      - 8000:8000
    networks:
      - json-to-yaml-network
    volumes:
      - .:/node/app

  converter:
    build:
      dockerfile: converter.Dockerfile
      context: .
      target: ${NODE_ENV}
    container_name: json-to-yaml-converter
    environment:
      CONVERTER_PORT: ${CONVERTER_PORT}
      LOG_LEVEL: ${LOG_LEVEL}
[highlight]
      OTEL_SERVICE_NAME: ${CONVERTER_OTEL_SERVICE_NAME}
[/highlight]
      . . .
```

Save the file, then recreate all the services with:

```command
docker compose up -d --force-recreate
```

```text
[output]
[+] Running 4/4
 ✔ Container json-to-yaml-auth       Started                    13.6s
 ✔ Container json-to-yaml-db         Healthy                    12.5s
 ✔ Container json-to-yaml-redis      Healthy                    12.5s
 ✔ Container json-to-yaml-converter  Started                    12.5s
```

Once the services are up again, repeat the request to
`http://localhost:8000/auth` then take a look at the logs once more:

```command
docker compose logs -f auth converter
```

You'll see that the service name is now correctly reported:

```javascript
[output]
{
  resource: {
    attributes: {
    [highlight]
      'service.name': 'auth-service',
    [/highlight]
      . . .
    }
  },
  instrumentationScope: {
    name: '@opentelemetry/instrumentation-http',
    version: '0.56.0',
    schemaUrl: undefined
  },
  traceId: '99619981a891e027234e27acdbfcc2a0',
  parentId: undefined,
  traceState: undefined,
  name: 'GET',
  id: '0f9741d356468e14',
  kind: 1,
  timestamp: 1734027011683000,
  duration: 40781.088,
  attributes: {
    . . .
  },
  status: {
    code: 0
  },
  events: [],
  links: []
}
```

The `instrumentationScope` shows that the instrumentation was handled by the
`@opentelemetry/instrumentation-http` library, while the `traceId` uniquely
identifies the trace that this span belongs to.

Since this is a root span, the `parentId` is undefined, and the `kind` property
indicates that this is a server-side span (represented by the value of 1). The
`timestamp` denotes when the span began, and the `duration` reflects how long
the request took to process in microseconds.

The `attributes` section captures various HTTP and network details, providing
context about the request's origin, destination, and behavior.

For further details on how OpenTelemetry represents telemetry data (including
logs, traces, and metrics), [consult our comprehensive OTLP guide](https://betterstack.com/community/guides/observability/otlp/).

In the next step, you'll set up the OpenTelemetry Collector to collect and
export the raw span data to Jaeger, an open source distributed tracing backend
tool.

## Step 3 — Setting up the OpenTelemetry Collector

[The OpenTelemetry Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/) is the recommended way to
collect telemetry data from instrumented services, process them, and export them
to one or more observability backends.

You can set it up by adding a new `collector` service to your
`docker-compose.yml` file as follows:

```yaml
[docker-compose.yml]
services:
  # . . .

  collector:
    container_name: json-to-yaml-collector
    image: otel/opentelemetry-collector:latest
    volumes:
      - ./otelcol.yaml:/etc/otelcol/config.yaml
    networks:
      - json-to-yaml-network

. . .
```

The `collector` service uses
[otel/opentelemetry-collector](https://hub.docker.com/r/otel/opentelemetry-collector)
image and it mounts the (currently nonexistent) local configuration file
(`otelcol.yaml`) into the container. If you're using the
[Contrib distribution](https://hub.docker.com/r/otel/opentelemetry-collector-contrib)
instead, ensure that your configuration file is mounted to the appropriate path
like this:

```yaml
collector:
  container_name: json-to-yaml-collector
[highlight]
  image: otel/opentelemetry-collector-contrib:latest
[/highlight]
  volumes:
[highlight]
    - ./otelcol.yaml:/etc/otelcol-contrib/config.yaml
[/highlight]
```

Once you've saved the changes, create the collector configuration file in your
project root and populate it with the following contents:

```yaml
[label otelcol.yaml]
receivers:
  otlp:
    protocols:
      http:
        endpoint: json-to-yaml-collector:4318

processors:
  batch:

exporters:
  otlp/jaeger:
    endpoint: json-to-yaml-jaeger:4317
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/jaeger]
```

This OpenTelemetry Collector configuration defines how the collector receives,
processes, and exports trace data. Here's a high-level overview of its
components:

### Receivers

The `otlp` receiver is configured to accept telemetry data via the OpenTelemetry
Protocol. It specifies that the collector will accept incoming trace data from
applications or services sending OTLP-formatted telemetry data over HTTP at the
`json-to-yaml-collector:4318` endpoint.

### Processors

The configuration includes a `batch` processor, which is responsible for
batching multiple trace data points together before they are sent to the
exporter. This improves performance and reduces the number of outgoing requests
by sending larger, aggregated payloads.

### Exporters

The `otlp/jaeger` exporter is set up to send the processed trace data to a
Jaeger instance. It uses the `json-to-yaml-jaeger:4317` endpoint, where the
`jaeger` service is expected to be reachable (we'll set this up in the next
step).

The configuration also specifies `tls.insecure: true`, indicating that the
exporter will not verify the TLS certificate of the Jaeger endpoint. This is
useful for development or testing environments but should not be used in
production settings.

### Service

The `service` section defines the data processing pipeline for traces. In this
case, the pipeline for traces takes data from the `otlp` receiver, processes it
with the `batch` processor, and then exports it using the `otlp/jaeger`
exporter.

---

Once you've configured the OpenTelemetry Collector through the `otelcol.yaml`
file, you need to modify your Node.js instrumentation to transmit trace spans in
the OTLP format to the Collector instead of outputting them to the console.

First, you need to install the trace exporter for OTLP (http/json) through the
command below:

```command
npm install --save @opentelemetry/exporter-trace-otlp-http
```

Once installed, update your `otel.js` file as follows:

```javascript
[otel.js]
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
[highlight]
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
[/highlight]
import { NodeSDK } from "@opentelemetry/sdk-node";

[highlight]
const exporter = new OTLPTraceExporter();
[/highlight]
const sdk = new NodeSDK({
[highlight]
	traceExporter: exporter,
[/highlight]
	instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

In this code, a new instance of the `OTLPTraceExporter` is configured to send
trace data to an OTLP endpoint which is configured to be
`http://localhost:4318/v1/traces` by default.

Since your Collector instance is not exposed to `localhost`, you need to change
this endpoint through the `OTEL_EXPORTER_OTLP_ENDPOINT` environmental variable
as follows:

```text
[label .env]
. . .
OTEL_EXPORTER_OTLP_ENDPOINT=http://json-to-yaml-collector:4318
```

```yaml
[label docker-compose.yml]
services:
  auth:
    . . .
    environment:
      . . .
      OTEL_SERVICE_NAME: ${AUTH_OTEL_SERVICE_NAME}
[highlight]
      OTEL_EXPORTER_OTLP_ENDPOINT: ${OTEL_EXPORTER_OTLP_ENDPOINT}
[/highlight]
    . . .

  converter:
    . . .
    environment:
      . . .
      OTEL_SERVICE_NAME: ${CONVERTER_OTEL_SERVICE_NAME}
[highlight]
      OTEL_EXPORTER_OTLP_ENDPOINT: ${OTEL_EXPORTER_OTLP_ENDPOINT}
[/highlight]
    . . .

```

This updated value corresponds to the Collector's hostname within our Docker
Compose setup and the port it listens on for OTLP data over HTTP. This now means
that the generated trace data will be sent to
`http://json-to-yaml-collector:4318/v1/traces`.

Under the hood, the exporter is also configured to use a `BatchSpanProcessor` by
default so that the generated spans are batched before being exported.

In the next step, you'll configure a Jaeger instance to receive the trace data
from the OpenTelemetry Collector.


## Step 4 — Setting up Jaeger

Before you can visualize your traces, you need to set up a Jaeger instance to
ingest the data from the Collector. This is easy to do through the
[jaegertracing/all-in-one image](https://hub.docker.com/r/jaegertracing/all-in-one)
which which provides an easy way to run all of Jaeger's backend components and
user interface in one container.

Open your `docker-compose.yml` file and modify it as follows:

```yaml
[label docker-compose.yml]
services:
  # . . .
  collector:
    container_name: json-to-yaml-collector
    image: otel/opentelemetry-collector:latest
    volumes:
      - ./otelcol.yaml:/etc/otelcol/config.yaml
[highlight]
    depends_on:
      jaeger:
        condition: service_healthy
[/highlight]
    networks:
      - json-to-yaml-network

[highlight]
  jaeger:
    container_name: json-to-yaml-jaeger
    image: jaegertracing/all-in-one:latest
    environment:
      JAEGER_PROPAGATION: w3c
    ports:
      - 16686:16686
    healthcheck:
      test: [CMD, wget, -q, -S, -O, "-", "localhost:14269"]
    networks:
      - json-to-yaml-network
[/highlight]
```

These modifications introduce a `jaeger` service whose UI is exposed at
`http://localhost:16686` to make it accessible outside the Docker network.

Once you've saved the file, relaunch all the services with:

```command
docker compose up -d --build
```

```text
[output]
 ✔ Network json-to-yaml-nodejs_json-to-yaml-network  Created     0.2s
 ✔ Container json-to-yaml-db                         Healthy    11.1s
 ✔ Container json-to-yaml-jaeger                     Healthy    31.5s
 ✔ Container json-to-yaml-redis                      Healthy    11.6s
 ✔ Container json-to-yaml-collector                  Started    31.6s
 ✔ Container json-to-yaml-auth                       Started    11.6s
 ✔ Container json-to-yaml-converter                  Started    11.8s
```

With the services ready, head to your application at `http://localhost:8000` and
generate some traces by authenticating with GitHub and converting some JSON to
YAML:

![JSON to YAML conversion process](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0e9a5dbf-9ddd-4950-50ce-41e23f006400/lg1x
=1762x1003)

![JSON to YAML conversion results](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/57a97ef9-3954-4547-fad1-67088754b900/md2x
=2140x814)

Then, open the Jaeger UI in your browser at `http://localhost:16686`, find the
**auth-service** entry, and click **Find Traces**:

![JSON to YAML traces in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5921bf5d-2a19-4bc7-3cd6-f7381c45b700/md1x
=1868x1129)

You should see a list traces generated by the application. Click on any one of
them to see the component spans. For example, here are the spans for an
authenticated request to the homepage:

![Spans in JSON-to-YAML Converter](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3ff6734e-dd15-4415-e0f0-85e70d010a00/orig
=1868x700)

The trace timeline shows you the chronological order of events within that
specific request, and you'll see where the interactions with Redis and
PostgreSQL occur.

In the next section, we'll look at how to customize the Node.js instrumentation
to make the generated traces even more meaningful.

## Step 5 — Customizing the Node.js auto instrumentation

Now that you've started seeing your application traces in Jaeger, let's look at
some of the customization options for the automatic instrumentation.

First, let's disable the instrumentation for filesystem calls so that spans are
no longer generated for the `fs`, `tcp`, and `dns` calls you may have observed
in the previous section.

You can do this by disabling the `@opentelemetry/instrumentation-fs` and
`@opentelemetry/instrumentation-net`, and `@opentelemetry/instrumentation-dns`
packages through the `OTEL_NODE_DISABLED_INSTRUMENTATIONS` environmental
variable:

```text
OTEL_NODE_DISABLED_INSTRUMENTATIONS=fs,net,dns
```

However, it's usually more more convenient to only explicitly enable the
instrumentations you need through the `OTEL_NODE_ENABLED_INSTRUMENTATIONS` as
in:

```text
[label .env]
. . .
OTEL_NODE_ENABLED_INSTRUMENTATIONS=http,fastify,redis,pg,undici
```

```yaml
[label docker-compose.yml]
services:
  auth:
    . . .
    environment:
      . . .
      OTEL_EXPORTER_OTLP_ENDPOINT: ${OTEL_EXPORTER_OTLP_ENDPOINT}
[highlight]
      OTEL_NODE_ENABLED_INSTRUMENTATIONS: ${OTEL_NODE_ENABLED_INSTRUMENTATIONS}
[/highlight]
    . . .

  converter:
    . . .
    environment:
      . . .
      OTEL_EXPORTER_OTLP_ENDPOINT: ${OTEL_EXPORTER_OTLP_ENDPOINT}
[highlight]
      OTEL_NODE_ENABLED_INSTRUMENTATIONS: ${OTEL_NODE_ENABLED_INSTRUMENTATIONS}
[/highlight]
    . . .

```

This way, only the following instrumentations will be enabled:

- [@opentelemetry/instrumentation-http](https://www.npmjs.com/package/@opentelemetry/instrumentation-http):
  Instrumentation for the `http` and `https` module.
- [@opentelemetry/instrumentation-fastify](https://www.npmjs.com/package/@opentelemetry/instrumentation-fastify):
  Fastify instrumentation.
- [@opentelemetry/instrumentation-redis](https://www.npmjs.com/package/@opentelemetry/instrumentation-redis):
  Instrumentation for the
  [node_redis package](https://github.com/NodeRedis/node_redis).
- [@opentelemetry/instrumentation-pg](https://www.npmjs.com/package/@opentelemetry/instrumentation-pg):
  Automatic instrumentation for the
  [pg module](https://github.com/brianc/node-postgres).
- [@opentelemetry/instrumentation-undici](https://www.npmjs.com/package/@opentelemetry/instrumentation-undici):
  Instrumentation for the Node.js global `fetch` API.

Next, let's change the span names for incoming requests from generic names like
`GET` or `POST` to more specific names like `HTTP GET <endpoint>`. Modify your
`otel.js` file as follows:

```javascript
[label otel.js]
// . . .

const sdk = new NodeSDK({
	traceExporter: exporter,
	instrumentations: [
[highlight]
		getNodeAutoInstrumentations({
			"@opentelemetry/instrumentation-http": {
				requestHook: (span, request) => {
					span.updateName(`HTTP ${request.method} ${request.url}`);
				},
			},
		}),
[/highlight]
	],
});
```

To customize a specific instrumentation, you need to provide the name of the
instrumentation as a key to `getNodeAutoInstrumentation()` and its configuration
object as the value.

For example, the
[@opentelemetry/instrumentation-http](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http)
is what instruments the HTTP requests received by the server so its what you
need to customize here. The `requestHook()` updates the span name to something
more readable so that you can easily distinguish it amongst other spans.

After saving the file, run the command below to restart the `auth` and
`converter` services:

```command
docker compose up -d auth converter
```

Once they're back up and running, generate some new spans by clicking around the
application UI. You will now observe the following traces in Jaeger with updated
span names:

![Updated Span names in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7d2ae083-72ea-4709-7161-e09f14b60b00/public
=1868x728)

To customize the other instrumentation packages, please see their respective
documentation.

## Step 6 — Adding custom trace instrumentation

While instrumentation libraries capture telemetry at the system boundaries, such
as inbound/outbound HTTP requests or database calls, they don't capture what's
happening within your application itself. To achieve that, you'll need to write
custom instrumentation.

In this section, let's add custom instrumentation for the JSON to YAML
conversion function. Currently, you'll see the following trace for such
operations:

![JSON to YAML conversion trace](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/948621f8-2a32-42be-88cf-5d80ba40ee00/md1x
=1868x608)

This trace shows that an HTTP POST request was received by the `auth-service` to
the `/convert` endpoint, which subsequently issued a POST request to the
`converter-service`'s `/convert-yaml` endpoint.

Let's develop this trace further, by adding a span for the conversion process
itself, not just the entire request.

To do this, you'll need to modify your `converter` service as follows:

```javascript
[label converter/controllers/convert.controller.js]
[highlight]
import process from "node:process";
import { trace } from "@opentelemetry/api";
[/highlight]
import { stringify } from "yaml";

[highlight]
const tracer = trace.getTracer(process.env.OTEL_SERVICE_NAME);
[/highlight]

function convertToYAML(req, reply) {
	let body;

	try {
[highlight]
		const span = tracer.startSpan("parse json");
[/highlight]
		body = JSON.parse(req.body.json);
[highlight]
		span.end();
[/highlight]
	} catch (err) {
		req.log.error(err, "Parsing JSON body failed");

		return reply.status(400).send("Invalid JSON input");
	}

[highlight]
	const span = tracer.startSpan("convert json to yaml");
[/highlight]
	const yaml = stringify(body);
[highlight]
	span.end();
[/highlight]

	reply.send(yaml);
}

export { convertToYAML };
```

This code snippet introduces some custom spans to your application.

First, it obtains a `tracer` instance using
`trace.getTracer(process.env.OTEL_SERVICE_NAME)`. This tracer is associated with
your service name to provide context for the spans it generates.

Before you can obtain a working tracer with the `getTrace()` method, you need to
register a trace provider with `trace.setGlobalTracerProvider()`. However, since
we're using the `auto-instrumentations-node` package, this step is unnecessary
as global tracer has already been registered.

Once you have a `tracer`, you can create spans around the operations you'd like
to track. You only need to call `startSpan()` before the operation and
`span.end()` afterwards.

Once you restart the `converter` service with:

```command
docker compose up -d converter
```

You can repeat the JSON to YAML conversion once again in your application. When
you return to Jaeger, you'll observe that two new spans have been added to the
traces generated for such operations:

![Custom Node.js spans in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b4edb230-58f8-4988-9db3-c84cf383ac00/md2x
=1868x661)

As you can see, parsing the JSON body was much quicker than the conversion from
JSON to YAML. While this is not an interesting insight, it serves to illustrate
just how you can track various operations in your services to figure out what
the bottleneck is when debugging problems.

## Simplifying tracing with Better Stack

Throughout this tutorial, you've seen how to manually instrument a Node.js application with OpenTelemetry. While this approach gives you granular control, it requires installing SDK packages, configuring exporters, setting up collectors, and maintaining instrumentation code as your application evolves.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/7tQ7haFmSXI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[Better Stack Tracing](https://betterstack.com/tracing/) takes a different approach using eBPF technology. Point it at your Kubernetes or Docker cluster and it automatically instruments your workloads without modifying your code. Here's what you get:

- Traces start flowing immediately without installing SDK dependencies or configuring exporters
- Databases like PostgreSQL, MySQL, Redis, and MongoDB get recognized and instrumented automatically
- Context propagation works out of the box across your services
- Visual "bubble up" investigation lets you select services and timeframes through drag and drop
- AI analyzes your service map and logs during incidents, suggesting potential causes
- OpenTelemetry-native architecture keeps your trace data portable
- Works with Jaeger or any OpenTelemetry-compatible backend
- Combines traces, logs, metrics, and incident management in one platform

If you'd like to try automatic instrumentation while keeping the flexibility of OpenTelemetry, check out Better Stack Tracing.


## Final thoughts

I hope this tutorial has equipped you with a solid understanding of OpenTelemetry and how to instrument your Node.js applications to generate traces.

To deepen your knowledge, explore the [official OpenTelemetry documentation](https://opentelemetry.io/docs/languages/js/), which provides a more comprehensive insight into its features.

[The OpenTelemetry Registry](https://opentelemetry.io/ecosystem/registry/?language=javascript) is also a valuable resource for discovering a wide range of auto-instrumentation libraries tailored to popular Node.js frameworks and libraries.

If manual instrumentation feels like too much overhead for your setup, [Better Stack Tracing](https://betterstack.com/tracing/) handles OpenTelemetry automatically with eBPF, so you can skip the SDK integration steps while keeping the same observability benefits.

You can find the complete code for this tutorial on [GitHub](https://github.com/betterstack-community/json-to-yaml-nodejs/tree/final).

Thanks for following along, and happy tracing!