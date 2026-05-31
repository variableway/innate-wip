# A Practical Guide to Distributed Tracing with Jaeger

**Distributed tracing is a technique that empowers you to track requests** as they
navigate complex distributed systems. It reveals the path of requests,
processing times, service connections, and potential failure points.

Jaeger is a leading open-source distributed tracing tool that **excels in
collecting, storing, and visualizing traces across microservices**, enabling
comprehensive system monitoring and troubleshooting. Its integration with
Kubernetes and support for popular storage solutions like Elasticsearch and
Cassandra make it ideal for large-scale, dynamic environments.

In this article, we will explore Jaeger's architecture and provide a
step-by-step guide on how to implement tracing with Jaeger, from initial setup
to visualizing and analyzing trace data for improved system performance and
reliability.

Let's get started!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/wQKjCDD7nfk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


## Prerequisites

Before proceeding with this article, ensure that you meet the following
requirements:

- Basic familiarity with Docker and Docker Compose.
- A recent version of [Docker](https://docs.docker.com/engine/install/)
  installed on your local machine.
- A recent version of [Go](https://go.dev/doc/install) installed (optional).
- Basic understanding of [distributed tracing terminology](https://betterstack.com/community/guides/observability/distributed-tracing/)
  (spans and traces).

## What is Jaeger?

![An overview of Jaeger's user interface](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cfc6f16c-02e8-466b-ace5-7380e7a44000/public =2801x1700)

Jaeger is a distributed tracing backend that emerged at Uber in 2015 after being
inspired by
[Google's Dapper](https://research.google/pubs/dapper-a-large-scale-distributed-systems-tracing-infrastructure/)
and [Twitter's OpenZipkin](https://zipkin.io/). It later joined the Cloud Native
Computing Foundation (CNCF) as an incubating project in 2017, before being
promoted to graduated status in 2019.

**Its core function is to monitor and troubleshoot distributed applications by
providing a clear view of request flows and trace data** throughout the system.
This allows for the identification of performance bottlenecks, the root cause of
errors, and a deeper understanding of service dependencies.

While Jaeger itself doesn't provide tracing instrumentation, it initially
maintained OpenTracing-compatible tracers. However,
[these have been deprecated](https://www.jaegertracing.io/docs/1.17/client-libraries/#deprecating-jaeger-clients)
in favor of [OpenTelemetry-based instrumentation](https://betterstack.com/community/guides/observability/what-is-opentelemetry/), which
is the recommended method for generating trace data in the OpenTelemetry
Protocol (OLTP) format.

Essentially, OpenTelemetry handles the collection of telemetry data (including
logs, metrics, and traces), while Jaeger focuses on the storage, visualization,
and analysis of trace data specifically. Jaeger does not support logs or metrics.

Although OpenTelemetry is the preferred approach, Jaeger maintains compatibility
with Zipkin instrumentation for those who have already invested in it.


[summary]
### Instrument tracing without code changes

While Jaeger provides powerful distributed tracing capabilities, [Better Stack Tracing](https://betterstack.com/tracing/) can instrument your Kubernetes or Docker workloads without code changes. Start ingesting traces in about 5 minutes.

**Predictable pricing and up to 30x cheaper than Datadog.** Start free in minutes.
[/summary]

![Better Stack Tracing bubble up view highlighting the root cause of a slow request](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ea6d6faf-b150-4ef2-0765-02113ea7b100/md2x =4160x2378)


## How does Jaeger work?

Jaeger's operation revolves around collecting and analyzing trace data generated
by distributed systems. This assumes that your application is already
instrumented to produce such data using OpenTelemetry SDKs or compatible
libraries.

With that in mind, here's a brief overview of how it all works:

1. **Collection**: Instrumented applications generate spans representing units
   of work within a trace. These spans are then sent to a local OpenTelemetry
   collector, or directly to the Jaeger collector via OTLP exporters, which
   aggregates and batches them.

2. **Processing**: Jaeger's processing pipeline receives the trace data,
   validating it, applying sampling to manage volume (if configured), and
   enriching it with additional details.

3. **Storage**: The processed spans are subsequently stored them in a scalable
   storage backend such as Cassandra or Elsasticsearch.

4. **Ingester (optiona)**: If a message queue like Apache Kafka buffers the
   collector and storage, the Jaeger ingester reads from Kafka and writes to the
   storage.

5. **Querying**: The Jaeger query service enables data querying by providing an
   API to retrieve trace data from the configured storage.

6. **Visualization**: Jaeger provides a web interface for querying your trace
   data and analyzing the results to identify performance bottlenecks, and
   troubleshoot issues.

Now that you understand the internal mechanisms of Jaeger, let's move on to the
practical steps of setting it up in your local environment.

## Setting up Jaeger locally

As we explored in the previous section, Jaeger consists of several components
working together to manage trace data. For convenient local testing, we'll
utilize the [all-in-one](https://hub.docker.com/r/jaegertracing/all-in-one)
Docker image which bundles the Jaeger UI, collector, query, and agent components
with an in-memory storage.

To run it locally, use the command below:

```command
docker run --rm --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 14250:14250 \
  -p 14268:14268 \
  -p 14269:14269 \
  -p 9411:9411 \
  jaegertracing/all-in-one:latest
```

This command launches a self-contained Jaeger instance, accessible through the
UI at `http://localhost:16686`. It's capable of accepting trace data from
various sources, including OpenTelemetry and Zipkin.

Here's the breakdown of the exposed ports:

- `6831/udp`: Accepts `jaeger.thrift` spans (Thrift compact)
- `6832/udp`: Accepts `jaeger.thrift` spans (Thrift binary)
- `5778`: Jaeger configuration
- `16686`: Jaeger UI
- `4317`: OpenTelemetry Protocol (OTLP) gRPC receiver
- `4318`: OpenTelemetry Protocol (OTLP) HTTP receiver
- `14250`: Accepts `model.proto` spans over gRPC
- `14268`: Accepts `jaeger.thrift` spans directly over HTTP
- `14269`: Jaeger health check
- `9411`: Zipkin compatibility

In this guide, we only need OLTP over HTTP and the Jaeger UI so you can run a
shorter version of the command:

```command
docker run \
  --rm \
  --name jaeger \
  -p 4318:4318 \
  -p 16686:16686 \
  -p 14268:14268 \
  jaegertracing/all-in-one:latest
```

You should see the following messages in the terminal (truncated for brevity),
confirming that the various services are listening on their respective ports:

```json
[output]
. . .
{"msg":"Query server started","http_addr":"[::]:16686","grpc_addr":"[::]:16685"}
{"msg":"Health Check state change","status":"ready"}
{"msg":"Starting GRPC server","port":16685,"addr":":16685"}
{"msg":"[core] [Server #7 ListenSocket #8]ListenSocket created"}
{"msg":"Starting HTTP server","port":16686,"addr":":16686"}
```

When you open `http://localhost:16686` in your browser, you should also observe
the Jaeger user interface. Since it's backed by an in-memory database, there's
not much to see here:

![Jaeger search interface in the browser](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5211a6a7-0bca-4fc2-1aa4-388914aa9a00/public =2897x1661)

With Jaeger successfully running, let's now introduce the demo project we'll use
to generate trace data for visualization.

## Setting up the demo application

Jaeger provides a demo application called
[HotROD](https://github.com/jaegertracing/jaeger/tree/main/examples/hotrod),
simulating a ride-sharing service with multiple microservices, all instrumented
with OpenTelemetry for trace generation.

A standalone Docker image is also provided for this application so you can run
the command below in a separate terminal to get set up:

```command
docker run \
  --rm \
  --name hotrod \
  --link jaeger \
  --env OTEL_EXPORTER_OTLP_ENDPOINT=http://jaeger:4318 \
  -p 8080-8083:8080-8083 \
  jaegertracing/example-hotrod:latest \
  all
```

```text
[output]
. . .
cobra@v1.8.1/command.go:985     Starting all services
frontend/server.go:78   Starting        {"service": "frontend", "address": "http://0.0.0.0:8080"}
customer/server.go:57   Starting        {"service": "customer", "address": "http://0.0.0.0:8081"}
route/server.go:55      Starting        {"service": "route", "address": "http://0.0.0.0:8083"}
driver/server.go:63     Starting        {"service": "driver", "address": "0.0.0.0:8082", "type": "gRPC"}
```

As you can see from the logs, there are four service: `frontend`, `customer`,
`route`, and `driver`. You can access the main user interface by opening
`http://localhost:8080` in your browser:

![HotROD application](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a5bc755f-6479-4a66-e255-cfe0d6cd2700/md1x =2566x933)

The interface displays four customers, and clicking on any of them simulates
requesting a ride, showing the assigned driver and estimated arrival time.

You'll also see some other bits of information on the screen:

1. The web client ID (`8258` in my case) on the top left is a random session ID
   assigned each time you refresh the page.

2. The driver's licence plate (`T757873C`) that is responding to the request.

3. The request ID (`req: 8258-1`) is an amalgamation of the client ID and a
   sequence number.

4. The latency which shows how long the backend took to respond (`737ms`).

The interface also provides links to view traces generated by the current client
or the current request in Jaeger. Clicking the **open trace** link will open the
corresponding trace in the Jaeger UI:

![Opening a trace in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2e9c2927-321a-4f82-a8c3-a638c0f39d00/lg2x =2570x1774)

Next, we'll delve deeper into how to interpret and utilize this trace data in
Jaeger for understanding and optimizing your applications.

## Examining the HotROD architecture

We've learned that the HotROD application comprises four microservices, but to
understand the request flow and interactions, we can leverage Jaeger's ability
to automatically generate architecture diagrams.

The previous ride-sharing request provided Jaeger with enough data to create a
visual representation. Go to the **System Architecture** page in the Jaeger UI
to see it in action:

![Jaeger Force Directed Graph](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/81a9cfeb-9313-49d7-e2e1-6f1aa2eb7100/public =2984x1557)

While the **Force Directed Graph** is useful for large architectures, for
HotROD's smaller scale, switch to the **DAG** (Directed Acyclic Graph) tab:

![Jaeger Directed Acyclic Graph](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7a709e8b-15b6-4d6c-a381-7bef0ae3e100/orig =2988x2066)

### Interpreting the diagram

This diagram reveals the components involved in fulfilling the ride request. We
see the `frontend` initiating calls to three downstream services, two of which
further interact with MySQL and Redis.

The graph also indicates the frequency of calls to each service, for example,
`route` was called 10 times, and `redis-manual` was called 14 times. A single
`frontend` request triggered 27 service interactions.

While this diagram offers a high-level overview, it doesn't detail the request
flow or individual service response times. To gain these insights, we'll examine
the actual traces in the next section.

## Viewing trace data in Jaeger

To view the request trace data in Jaeger, you can click the **open trace** link
in the HotROD interface like you did earlier. Another way is to open the Jaeger
search page at `http://localhost:16686/search` where you'll see all the names of
the services in the **Services** dropdown.

Select the root service (`frontend` in this case) and click the **Find Traces**
button:

![Selecting services and finding traces in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/388b868e-e188-4d1e-aee6-3784d531c300/lg2x =2988x2086)

You may see more than one trace depending on how long the application has been
running, but the one we're interested in here is the trace for the
`frontend: /dispatch` entry which should be the first one on the list:

![HotROD frontend trace entry in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f3cabe76-e557-4b83-aa7f-78166ebbed00/lg2x =1857x295)

This entry summarizes the trace, displaying the total spans, any errors, the
involved services, and the duration of the backend operation (`730.02ms`), which
might differ slightly from the frontend UI's report due to network latency.

Clicking the entry opens the timeline view, revealing details about the trace.
The left side shows the hierarchy of calls, while the right side presents a
Gantt chart visualizing each span's timing.

![Trace timeline view in Jaeger with Gantt chart](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b4ad5324-f08d-41e5-da57-2bc24252d800/lg1x =2570x1774)

Red circles with exclamation marks signify error-generating calls. Clicking
these spans reveals details like the error tag and captured logs explaining the
error ("redis timeout" in this case):

![Jaeger Trace timeline showing redis-manual error in HotROD trace](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2d5156d6-b8b9-4012-ae9a-227610054400/md1x =2474x1476)

### Understanding the timeline view

The trace timeline visualizes the chronological sequence of events within the
ride-sharing request. Each colored bar on the Gantt chart signifies a span (a
unit of work performed by a service), showing its duration and timing relative
to other spans in the trace.

In this specific request:

1. The `frontend` service receives a `/dispatch` request, initiating the
   process.
2. The `frontend` then makes a GET request to the `/customer` endpoint of the
   `customer` service.
3. The `customer` service executes a `SELECT SQL` query on MySQL, returning the
   results to the `frontend`.
4. Upon receiving the results, the `frontend` makes an RPC call to the `driver`
   service (`driver.DriverService/FindNearest`), which then makes multiple calls
   to Redis (some failing).
5. After the `driver` service completes, the `frontend` executes a sequence of
   GET requests to the `/route` endpoint of the `route` service.
6. Finally, the results are sent back to the external caller and displayed in
   the HotROD UI.

This demonstrates the power of tracing in understanding request flow within
distributed systems. In the following section, we'll explore the specific
contents of a span in Jaeger for deeper insights.

## Digging deeper into spans

Each span within a trace holds a wealth of information so let's expand the root
span (`frontend /dispatch`) in the trace timeline to explore its contents. The
header displays the operation name, start time, duration, and the service
responsible for the span. As the root span, it encompasses the entire trace
duration.

![The root span in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4cf49e87-ba13-4fab-84fe-cbf682c3c400/md2x =2520x459)

The span consists of three sections:

### 1. Tags

These are key-value pairs attached to individual spans for capturing
context-specific information like HTTP status codes, database query parameters,
or custom attributes.
[OpenTelemetry Semantic Conventions provide](https://github.com/open-telemetry/semantic-conventions)
standardized attribute names for common scenarios, ensuring consistency and
portability across systems.

### 2. Process

Process tags are associated with the entire service and added to all its spans.
These include details like hostname, version, environment, and other static
attributes.

### 3. Logs

Logs captured during a span's execution offer insights into the service's
behavior in a specific operation. These logs can also be [viewed through
Docker](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/) (`docker logs hotrod`), but Jaeger
provides a more focused view within the trace context.

#### Understanding service behavior through span logs

![HotROD frontend service logs in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d766707b-0402-4444-af73-f8c87e447300/lg2x =1590x950)

Span logs can reveal application actions without requiring you to delve into the
code. Here's a summary of the `frontend` service operation according to the
logs:

1. It requests customer data (with `customer_id=123`) from the customer service.

2. Upon receiving the customer's location (115,277), it forwards it to the
   `drivers` service to find nearby drivers.

3. Once drivers are found, the `route` service is called 10 times (matching the
   number of drivers) to calculate the shortest routes between driver and
   customer locations.
4. The driver with the shortest route is dispatched, and the estimated arrival
   time (eta) is recorded.

By combining Gantt charts, span tags, and span logs, Jaeger offers a holistic
view of distributed workflows, allowing easy navigation between high-level
overviews and detailed analysis of individual operations.

## Diagnosing and fixing performance issues

One of the primary advantages of distributed tracing lies in its capability to
diagnose and pinpoint performance bottlenecks within complex systems. In this
section, we'll discuss how to interpret Jaeger's trace timeline and span details
to identify the sources of latency in the HotROD application.

### Analyzing the trace timeline

Let's return to the high level overview of the trace timeline in Jaeger:

![Overview of HotROD trace timeline in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/07ae2bb3-44ba-4590-14c6-91688994f900/lg2x =3838x2051)

From the timeline, we can make the key observations:

1. The initial `customer` service call is critical as it blocks further
   progress. It consumes nearly 40% of the total time, indicating a prime target
   for optimization.
   ![Initial call to customer service](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0de294b0-0da5-4753-7133-48a6588a9c00/lg2x
   =3840x664)

2. The `driver` service initially issues a `FindDriverIDs` request to the
   `redis-manual` backend which retrieves a set of driver IDs closest to the
   user's location as seen in the logs.
   ![driver service initial request span](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cf6c6127-49e1-49ee-bd71-f36b7ab4d200/md1x
   =3826x542)

3. After obtaining the driver IDs, the system queries the `redis-manual` service
   to fetch each driver's data. However, these queries are executed
   sequentially, forming a distinct "staircase" pattern in the trace timeline.
   This sequential execution appears unnecessary and inefficient, as these
   queries could be performed concurrently to significantly reduce the overall
   latency.
   ![driver service sequential request span](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/311c0cef-c01c-417b-1566-958838a3ba00/orig
   =3806x766)

4. The `route` service calls demonstrate a concurrent execution pattern, where
   multiple requests are handled simultaneously, but not fully in parallel. The
   maximum number of concurrent requests is limited to three, indicating the use
   of a fixed-size thread pool or similar mechanism to manage the execution.
   This suggests an opportunity for optimization, as increasing the pool size or
   exploring alternative concurrency models could potentially improve overall
   performance.
   ![route service request spans](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0ee4da16-e9a2-438e-eee8-c66664395900/lg1x
   =3812x1020)

Even a cursory examination of the timeline reveals potential areas for
improvement. Some optimizations are straightforward, like parallelizing Redis
and `route` queries, while others, like improving the customer service query,
require further investigation.

### Simulating a high traffic scenario

To further understand how the service handles increased load, let's simulate a
scenario with numerous concurrent requests. You can either rapidly click
customer buttons in the HotROD UI or use the following command:

```command
seq 1 50 | xargs -I {} -n1 -P10  curl --header "Baggage: session=9000,request=9000-{}" "http://localhost:8080/dispatch?customer=392"
```

This command generates 50 concurrent requests with custom baggage headers
(session and request ID) for tracking. If using the browser, you'll find similar
details in the request headers:

![Baggage request header in Chrome DevTools](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/25514478-e82a-4dc3-40c1-97ee5801e800/md2x =3880x1922)

Upon returning to Jaeger's Search page and refreshing, you'll likely see a surge
in traces. Sort them by **Longest First** to identify the most time-consuming
requests:

![Trace results sorted by longest first in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fa430510-a178-4515-e4c8-4e186d66c500/public =2836x1562)

You might observe that the longest trace now takes significantly longer than the
initial single request (e.g., 3.15 seconds vs. 730ms in my case), indicating
significant performance degradation under higher load.

### Identifying the bottleneck

Examining the longest trace reveals that the MySQL query now dominates the
overall duration, consuming approximately 86% of the total time. This query is
the primary bottleneck hindering the service's scalability.

Expanding the `SQL SELECT` span reveals logs that explain the delay:

![SQL SELECT span expanded in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a600b323-865e-4ce4-a628-f1e5f51fce00/orig =3803x704)

1. The "Waiting for lock behind 8 transactions" event shows that the current
   request has to wait for eight other requests to complete their queries first
   before it is able to continue. It also provides the identities of the eight
   requests through the `blockers` property (as supplied by the `request`
   portion of the `Baggage` header)

2. Approximately 2.4 seconds later, the other requests are finally done and it's
   able to acquire the lock. It also mentions that there are two other requests
   waiting behind it and provides their identities as well.

These logs suggest the application is configured to allow only one database
connection at a time, causing significant contention and delays when multiple
requests are made concurrently.

### Examining the source code and fixing the bottleneck

The only way to assess if our inference is correct is to grab the source code.
You can do this by cloning the
[Jaeger repository](https://github.com/jaegertracing/jaeger) to your machine:

```command
git clone https://github.com/jaegertracing/jaeger.git
```

Navigate into the `jaeger` directory, then open the
`examples/hotrod/services/customer/database.go` file in your text editor:

```command
cd jaeger
```

```command
code examples/hotrod/services/customer/database.go
```

In this file, you'll find code simulating a single database connection shared
across goroutines, along with a default latency for queries:

```go
[label examples/hotrod/services/customer/database.go]
. . .

func (d *database) Get(ctx context.Context, customerID int) (*Customer, error) {
	d.logger.For(ctx).Info("Loading customer", zap.Int("customer_id", customerID))

	ctx, span := d.tracer.Start(ctx, "SQL SELECT", trace.WithSpanKind(trace.SpanKindClient))
	span.SetAttributes(
		otelsemconv.PeerServiceKey.String("mysql"),
		attribute.
			Key("sql.query").
			String(fmt.Sprintf("SELECT * FROM customer WHERE customer_id=%d", customerID)),
	)
	defer span.End()

[highlight]
	if !config.MySQLMutexDisabled {
		// simulate misconfigured connection pool that only gives one connection at a time
		d.lock.Lock(ctx)
		defer d.lock.Unlock()
	}

	// simulate RPC delay
	delay.Sleep(config.MySQLGetDelay, config.MySQLGetDelayStdDev)
[/highlight]

	if customer, ok := d.customers[customerID]; ok {
		return customer, nil
	}
	return nil, errors.New("invalid customer ID")
}
```

The highlighted section intentionally creates a bottleneck by locking the
database connection and introducing a delay. However, the application also
includes configuration flags to disable these bottlenecks for demonstration
purposes.

If you have Go installed on your machine, you can change into the
`examples/hotrod` directory, and build the program with:

```command
cd examples/hotrod
```

```command
go build
```

A new `hotrod` binary will now be available in your current working directory.
To discover the available flags, run the `help` subcommand:

```command
./hotrod help
```

```text
[output]
HotR.O.D. - A tracing demo application.

. . .

Flags:
  -b, --basepath string                  Basepath for frontend service(default "/")
  -c, --customer-service-port int        Port for customer service (default 8081)
  -d, --driver-service-port int          Port for driver service (default 8082)
[highlight]
  -D, --fix-db-query-delay duration      Average latency of MySQL DB query (default 300ms)
  -M, --fix-disable-db-conn-mutex        Disables the mutex guarding db connection
  -W, --fix-route-worker-pool-size int   Default worker pool size (default 3)
[/highlight]
. . .
```

The three highlighted flags provided for fixing the performance issues we
observed. You can use `--fix-db-query-delay/-D` to reduce the fixed default
latency of 300ms for SQL queries, and `--fix-disable-db-conn-mutex/-M` to
disable the blocking behavior.

Let's go ahead and apply these flags to the HotROD application to see their
effect. Ensure to stop the existing Docker container with the command below
before launching the new instance:

```command
docker container stop hotrod
```

Now launch the new instance with:

```command
./hotrod all -D 50ms -M
```

The services should all start right up as before:

```text
[output]
fix: overriding MySQL query delay       {"old": "300ms", "new": "50ms"}
fix: disabling db connection mutex
Starting all services
Starting        {"service": "frontend", "address": "http://0.0.0.0:8080"}
Starting        {"service": "customer", "address": "http://0.0.0.0:8081"}
Starting        {"service": "route", "address": "http://0.0.0.0:8083"}
Starting        {"service": "driver", "address": "0.0.0.0:8082", "type": "gRPC"}
```

In a new terminal, repeat the high traffic scenario command with a different
session ID:

```command
seq 1 50 | xargs -I {} -n1 -P10  curl --header "Baggage: session=9001,request=9001-{}" "http://localhost:8080/dispatch?customer=392"
```

After the requests complete, refresh Jaeger's search page and filter by **Last 5
Minutes** to see the latest traces, sorting by **Longest First**:

![Viewing the latest trace data in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0645b47a-2931-4ce1-3e62-1e3410e68300/public =3833x1671)

The highest reported latency is now 1.88 seconds which is a significant
improvement from the previous result, although the trend of increasing latency
per request continues.

Clicking on a few traces shows that the `SQL SELECT` span now takes around
50-100ms to complete showing that it is no longer the bottleneck in this
operation.

![SQL SELECT trace is no longer the bottleneck](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/da8a7d5c-6067-4116-7601-14681a12b000/public =3818x905)

You'll also observe that the requests to the `route` service are exhibiting the
staircase pattern, and there is a significant gap between each request, leading
to latency still being relatively high and continuing to increase per additional
request.

![Requests to the route service exhibits staircase pattern](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2e7c8c66-3a7b-475a-e7dc-7302f1c2b500/lg1x =3804x833)

This suggests the bottleneck lies in how the `route` service is called, not
within the service itself. Examining the `services/frontend/best_eta.go` file
confirms this:

```go
[label services/frontend/best_eta.go]
. . .
// getRoutes calls Route service for each (customer, driver) pair
func (eta *bestETA) getRoutes(ctx context.Context, customer *customer.Customer, drivers []driver.Driver) []routeResult {
	results := make([]routeResult, 0, len(drivers))
	wg := sync.WaitGroup{}
	routesLock := sync.Mutex{}
	for _, dd := range drivers {
		wg.Add(1)
		driver := dd // capture loop var
		// Use worker pool to (potentially) execute requests in parallel
		eta.pool.Execute(func() {
			route, err := eta.route.FindRoute(ctx, driver.Location, customer.Location)
			routesLock.Lock()
			results = append(results, routeResult{
				driver: driver.DriverID,
				route:  route,
				err:    err,
			})
			routesLock.Unlock()
			wg.Done()
		})
	}
	wg.Wait()
	return results
}
```

The `getRoutes()` function receives the customer information and list of drivers
that was retrieved earlier from the `drivers` service. It then executes the
`route` service asynchronously for each driver through a pool of goroutines
(`eta.pool.Execute()`). The pool size is configured according to the
`config.RouteWorkerPoolSize` which defaults to `3` as you can see below:

```go
[label services/frontend/best_eta.go]
. . .
func newBestETA(tracer trace.TracerProvider, logger log.Factory, options ConfigOptions) *bestETA {
	return &bestETA{
		customer: customer.NewClient(
			tracer,
			logger.With(zap.String("component", "customer_client")),
			options.CustomerHostPort,
		),
		driver: driver.NewClient(
			tracer,
			logger.With(zap.String("component", "driver_client")),
			options.DriverHostPort,
		),
		route: route.NewClient(
			tracer,
			logger.With(zap.String("component", "route_client")),
			options.RouteHostPort,
		),
[highlight]
		pool:   pool.New(config.RouteWorkerPoolSize),
[/highlight]
		logger: logger,
	}
}
. . .
```

```go
[label services/config/config.go]
var (
    . . .
	// RouteWorkerPoolSize is the size of the worker pool used to query `route` service.
	// Can be overwritten from command line.
	RouteWorkerPoolSize = 3
    . . .
)
```

This explains why we initially saw three parallel requests to the `route`
service when we initially analyzed a single request trace. As the number of
requests increases, the pool becomes saturated and we're only able to execute
one additional request when a worker becomes free. This explains why you're now
seeing one request at a time and why there are gaps between requests (since all
workers are in use at the time).

The fix for this is increasing the number of workers in the pool which can be
done through the `-W/--fix-route-worker-pool-size` option. Since goroutines are
quite cheap (only a few kilobytes allocation), you can set this to a relatively
high number like 10,000 depending on the maximum number of requests you'd like
to be active at a given time.

Go ahead and restart the HotROD server by pressing `Ctrl-C` and typing:

```command
./hotrod all -D 50ms -M -W 10000
```

The logs report that the worker pool size was indeed updated:

```text
[output]
fix: overriding MySQL query delay       {"old": "300ms", "new": "50ms"}
fix: disabling db connection mutex
[highlight]
fix: overriding route worker pool size  {"old": 3, "new": 10000}
[/highlight]
Starting all services
```

When you simulate the high traffic experiment once again and observe the new
traces, you will see that the command finishes much quicker than before:

```command
seq 1 50 | xargs -I {} -n1 -P10  curl --header "Baggage: session=9002,request=9002-{}" "http://localhost:8080/dispatch?customer=392"
```

Opening the latest traces now reports the highest latency to be around `380ms`,
and you can see that all requests to the route service are now performed in
parallel:

![Updated traces in Jaeger](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1370564c-cc6c-4d48-24f1-33eacc99e400/md2x =2851x827)

![HotROD route service requests are not parallelized](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/497e7a03-2ac5-476f-9838-b58c02f32e00/md2x =3833x1334)

With these simple steps, you've been able to significantly improved the
performance of the service just by reading the traces, understanding where the
bottlenecks are, and fixing the issues.


## Simplify tracing with automated instrumentation

We've seen how Jaeger provides powerful visualization and analysis of trace data. However, the journey from development to production tracing often involves significant instrumentation work: adding OpenTelemetry SDKs to your codebase, configuring exporters, managing sampling strategies, and maintaining this instrumentation as your services evolve.


<iframe width="100%" height="315" src="https://www.youtube.com/embed/7tQ7haFmSXI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[Better Stack Tracing](https://betterstack.com/tracing/) eliminates this instrumentation burden through eBPF-based automatic instrumentation:

- Connect your Kubernetes or Docker cluster and start collecting traces immediately with zero code changes. Databases like PostgreSQL, MySQL, Redis, and MongoDB are automatically recognized and instrumented.

- Investigate slow requests visually through the "bubble up" feature with drag and drop, similar to the detective work we performed with HotROD, but automated.

- Get AI-powered assistance when troubleshooting production issues. The AI SRE analyzes your service map and logs to suggest root cause hypotheses while you remain in control.

- Enjoy predictable pricing up to 30x cheaper than alternatives like Datadog with complete data ingestion instead of sampling.

Try Better Stack to experience how automated instrumentation and intelligent analysis can accelerate your distributed tracing workflow.

## Final thoughts

In this guide, we explored Jaeger's capabilities as a powerful distributed tracing tool, enabling us to monitor and troubleshoot complex microservices-based applications.

By applying these techniques to the HotROD demo application, **we demonstrated how Jaeger can be effectively utilized to optimize system performance and ensure seamless user experiences** in modern distributed architectures. We identified bottlenecks through timeline analysis, traced request flows across multiple services, and applied targeted fixes that dramatically improved performance under load.

As you continue your journey with distributed tracing, remember that understanding the flow of requests and data is paramount to building reliable and efficient systems. **Jaeger provides a solid foundation for trace visualization and analysis**, especially when you need fine-grained control over your tracing infrastructure.

If you're looking to accelerate your implementation, [Better Stack Tracing](https://betterstack.com/tracing/) offers an automated approach that eliminates the instrumentation overhead we discussed earlier. 

**With eBPF-based collection and OpenTelemetry compatibility**, you can start gathering traces from your Kubernetes or Docker workloads in minutes while maintaining the flexibility to use Jaeger or other OpenTelemetry-compatible backends as your needs evolve.

Thanks for reading, and happy tracing!
