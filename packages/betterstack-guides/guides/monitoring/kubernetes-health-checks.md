# Kubernetes Health Checks and Probes: What You Need to Know

If you've worked with Kubernetes for any length of time, you've likely
experienced the frustration of applications that appear to be running but aren't
actually functioning correctly. Perhaps requests time out, connections fail, or
users report errors even though your pods show a status of "Running." These
symptoms often indicate a gap between a container's technical "running" state
and its actual operational health.

Kubernetes addresses this gap through health checks, specifically implemented as
"probes". These probes act as guardians of your application's well-being,
continuously monitoring the health status of your pods and their hosted
applications. By implementing appropriate health checks, you can create a more
streamlined, automated, and reliable system.

Let's get started!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/nbbVJGNxnic" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Understanding Kubernetes health checks

At their core, Kubernetes health checks are simple mechanisms designed to verify
the operational status of your applications. Unlike comprehensive monitoring
systems that track metrics, logs, and detailed performance indicators, health
checks focus on answering basic but critical questions: Is this container
running? Can this container accept traffic? Has this container finished starting
up?

These simple checks are powerful because they integrate directly with
Kubernetes' control mechanisms. Based on the results of these checks, Kubernetes
can automatically take corrective actions, such as restarting containers,
redirecting traffic, or postponing health evaluations until an application is
fully initialized.

Health checks don't replace comprehensive monitoring solutions—they complement
them by providing a first line of defense that can take immediate action when
things go wrong. Think of health checks as the reflexes of your Kubernetes
system, while monitoring tools represent its conscious awareness and analysis
capabilities.

[ad-uptime]

## Types of Kubernetes probes

Kubernetes offers three distinct types of probes, each serving a specific
purpose in ensuring application health.

### 1. Liveness probes: Is your application alive?

A liveness probe answers a simple question: "Is this container running
correctly?" If a liveness probe fails, Kubernetes assumes the container is in a
broken state and restarts it.

Liveness probes are particularly useful for catching applications that have
entered a deadlock state, crashed internally, or become unresponsive while still
technically running. They provide an automated way to recover from these
conditions without manual intervention.

Consider this example of a liveness probe configuration:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-server
        image: nginx:latest
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /healthz
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
```

In this configuration, Kubernetes sends an HTTP GET request to the `/healthz`
endpoint on port 80 every 10 seconds, with an initial delay of 30 seconds after
the container starts. If the request fails three consecutive times (the default
failure threshold), Kubernetes will restart the container.

The key here is understanding that the liveness probe isn't concerned with
whether your application is performing optimally or even if it's ready to handle
traffic—it's solely focused on detecting completely broken containers that need
to be restarted. For this reason, liveness probes should check only the most
basic health indicators that would signal a need for a restart.

### 2. Readiness probes: Can your application accept traffic?

While liveness probes check if a container is running, readiness probes
determine if it's ready to receive traffic. If a readiness probe fails, the
container is temporarily removed from service load balancers but isn't
restarted.

Readiness probes are critical for applications that need time to initialize
before handling requests, connect to external dependencies like databases, or
periodically become unable to handle traffic (like during data reindexing).

Here's an example of a readiness probe:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api-service
  template:
    metadata:
      labels:
        app: api-service
    spec:
      containers:
      - name: api-container
        image: my-api:v1
        ports:
        - containerPort: 8080
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 5
          timeoutSeconds: 2
          successThreshold: 1
          failureThreshold: 3
```

With this configuration, the container won't receive traffic until the `/ready`
endpoint returns a success code. Once the application starts, Kubernetes waits
15 seconds before performing the first check, then checks every 5 seconds
afterward. If the endpoint fails three times in a row, Kubernetes marks the pod
as not ready and removes it from service endpoints.

Readiness probes should be more comprehensive than liveness probes. They should
verify that all the components your application depends on are available and
functioning. This might include checking database connections, cache
availability, or even confirming that specific application features are working
correctly.

### 3. Startup probes: Is your application initialized?

Startup probes were introduced to address a specific problem: applications with
variable or long startup times. Before startup probes, you had to configure
liveness probes with long initial delays to accommodate the worst-case startup
scenario—but this meant slow detection of failures after startup.

A startup probe checks if a container has successfully started. While the
startup probe is running, liveness and readiness probes are disabled. Once the
startup probe succeeds, these other probes become active.

Here's how to configure a startup probe for an application with a potentially
long startup time:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: slow-starting-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: slow-starting-app
  template:
    metadata:
      labels:
        app: slow-starting-app
    spec:
      containers:
      - name: app-container
        image: slow-app:latest
        ports:
        - containerPort: 8080
        startupProbe:
          httpGet:
            path: /healthz
            port: 8080
          failureThreshold: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
```

This configuration gives the application up to 300 seconds (30 failures × 10
seconds per check) to start up. Until the startup probe succeeds, the liveness
probe won't run. After successful startup, the liveness probe will check the
same endpoint every 10 seconds and restart the container if it fails 3
consecutive times.

Startup probes are especially valuable for legacy applications or those with
unpredictable initialization times. They prevent premature detection of failures
during the startup phase while still allowing for quick detection once the
application is running.

## Probe implementation methods

Kubernetes supports four main methods for implementing probes, each with its own
use cases and configuration options.

### HTTP GET requests

HTTP probes are the most common type and work by sending an HTTP GET request to
a specified endpoint. If the endpoint returns a status code between 200 and 399,
the probe succeeds. Any other status code or timeout is considered a failure.

HTTP probes are ideal for web applications and APIs that already expose health
check endpoints. Here's a basic example:

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
    httpHeaders:
    - name: Custom-Header
      value: MyValue
  initialDelaySeconds: 15
  periodSeconds: 10
```

This configuration sends a GET request to `http://<pod-ip>:8080/health` with a
custom header. The probe succeeds if the request returns a success status code.

HTTP probes offer significant flexibility through custom headers, specific
paths, and the ability to check different aspects of your application by
implementing various health check endpoints. They're generally the most
feature-rich option for health checking and work well for most web applications.

### TCP socket checks

TCP probes attempt to establish a TCP connection to a specified port. If the
connection can be established, the probe succeeds; otherwise, it fails.

TCP probes are useful for checking if a service is listening on a specific port,
especially for protocols other than HTTP:

```yaml
readinessProbe:
  tcpSocket:
    port: 3306
  initialDelaySeconds: 5
  periodSeconds: 10
```

This configuration checks if the container is listening on port 3306 (common for
MySQL). If a TCP connection can be established, the container is considered
ready.

TCP probes are simpler than HTTP probes and particularly useful for non-HTTP
services like databases, cache systems, or message brokers. They only verify
that a process is listening on a port, not that the service is functioning
correctly, so they're best used when a service listening on a port is a good
proxy for its health.

### Command execution (exec)

Exec probes execute a command inside the container. If the command exits with a
status code of 0, the probe succeeds; any other exit code is considered a
failure.

Exec probes are versatile and can check complex conditions by running scripts:

```yaml
livenessProbe:
  exec:
    command:
    - /bin/sh
    - -c
    - 'grep "ready" /app/status.txt'
  initialDelaySeconds: 5
  periodSeconds: 5
```

This probe runs a shell command that checks if the word "ready" appears in a
status file. This approach allows for customized health checking logic that
might not be possible with HTTP or TCP probes.

Exec probes are the most flexible option because you can run any command or
script that's available inside your container. This makes them suitable for
applications that don't expose HTTP endpoints or don't listen on network ports.
However, they also have more overhead than other probe types because they
involve launching a new process for each check.

### gRPC health checking

For applications that use gRPC, Kubernetes supports gRPC health checking probes.
This requires your application to implement the gRPC Health Checking Protocol:

```yaml
livenessProbe:
  grpc:
    port: 9000
    service: Health
  initialDelaySeconds: 10
  periodSeconds: 10
```

This configuration checks the gRPC Health service on port 9000. The specified
service (in this case, "Health") should implement the gRPC health checking
protocol.

gRPC probes are ideal for applications that already use gRPC for communication.
They provide a native way to check health without implementing additional HTTP
endpoints just for health checking. However, they require your application to
implement the standard gRPC health checking protocol, which might involve
additional development work.

## Probe configuration parameters

All probe types share a common set of configuration parameters that control
their behavior. Understanding these parameters is crucial for implementing
effective health checks.

### Timing and threshold parameters

The `initialDelaySeconds` parameter specifies the time to wait after container
startup before running the first probe. This is useful for applications that
need time to initialize. Without an appropriate initial delay, probes might fail
unnecessarily during the startup phase.

The `periodSeconds` parameter determines the interval between probe attempts,
with a default of 10 seconds. Lower values provide faster detection but increase
system load. For critical services, you might want more frequent checks, while
less critical services can use longer intervals.

The `timeoutSeconds` parameter sets the time to wait for a probe response before
considering it failed, defaulting to 1 second. Increase this for checks that
might take longer to complete, especially if your health check performs complex
operations or connects to external services.

The `successThreshold` parameter defines the number of consecutive successes
required after a failure to consider a probe successful again, with a default
of 1. For liveness and startup probes, this must be 1, but for readiness probes,
you can set higher values to ensure stability.

The `failureThreshold` parameter sets the number of consecutive failures
required to consider a probe failed, defaulting to 3. After this many failures,
Kubernetes will take action (restart for liveness, mark as not ready for
readiness). Higher values provide more tolerance for transient issues but delay
recovery actions.

### Example of balanced configuration

Here's an example configuration with carefully selected parameters:

```yaml
startupProbe:
  httpGet:
    path: /startup
    port: 8080
  failureThreshold: 12
  periodSeconds: 5

livenessProbe:
  httpGet:
    path: /health
    port: 8080
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  periodSeconds: 5
  timeoutSeconds: 1
  failureThreshold: 2
  successThreshold: 2
```

This configuration allows up to 60 seconds (12 × 5) for startup, checks liveness
every 10 seconds with a relatively generous timeout of 2 seconds, and checks
readiness more frequently (every 5 seconds) but with a shorter timeout (1
second). It requires two consecutive successful readiness checks after a
failure, providing stability by preventing flapping.

The key to effective probe configuration is understanding your application's
behavior and requirements. For instance, if your application occasionally
experiences brief spikes in response time, you might need longer timeouts or
higher failure thresholds to prevent unnecessary restarts or traffic removal.

## Practical implementation example

Let's walk through a practical example of implementing health checks for a web
application that connects to a database. This example demonstrates all three
probe types working together:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: my-web-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          value: "postgres-service"
        - name: DB_PORT
          value: "5432"

        # Gives the application time to connect to the database
        startupProbe:
          httpGet:
            path: /api/startup
            port: 3000
          failureThreshold: 30
          periodSeconds: 2

        # Checks if the application is running correctly
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          periodSeconds: 15
          timeoutSeconds: 3
          failureThreshold: 3

        # Checks if the application can serve traffic
        readinessProbe:
          httpGet:
            path: /api/ready
            port: 3000
          periodSeconds: 5
          timeoutSeconds: 2
          failureThreshold: 3
```

In this example, the startup probe gives the application up to 60 seconds to
initialize and connect to the database. Once started, the liveness probe checks
every 15 seconds if the application is running correctly. The readiness probe
checks every 5 seconds if the application can process requests.

This setup ensures that the application has sufficient time to start up and
establish its database connection, containers are restarted if they become
unhealthy, and traffic is only routed to pods that are ready to handle requests.

To deploy this configuration, you would use:

```bash
kubectl apply -f web-app-deployment.yaml
```

You can verify the probe status using the kubectl describe command:

```bash
kubectl describe pod web-app-pod-name
```

This will show events related to the probes:

```text
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  30s   default-scheduler  Successfully assigned default/web-app-xyz to node-1
  Normal  Pulling    29s   kubelet            Pulling image "my-web-app:latest"
  Normal  Pulled     25s   kubelet            Successfully pulled image "my-web-app:latest"
  Normal  Created    25s   kubelet            Created container web-app
  Normal  Started    24s   kubelet            Started container web-app
  Normal  Startup    10s   kubelet            Container web-app passed startup probe
```

The actual implementation of these health check endpoints in your application is
equally important. A simple implementation might look like this:

```javascript
const express = require('express');
const app = express();
const db = require('./database');

let isInitialized = false;

async function initialize() {
  try {
    await db.connect();
    isInitialized = true;
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Initialization failed:', error);
    // We don't set isInitialized to true, so startup probe will continue to fail
  }
}

initialize();

// Startup probe endpoint
app.get('/api/startup', (req, res) => {
  if (isInitialized) {
    res.status(200).send('Application initialized');
  } else {
    res.status(503).send('Application initializing');
  }
});

// Liveness probe endpoint
app.get('/api/health', (req, res) => {
  // Simple check - just verify the process is running
  // For a more comprehensive check, you might verify that
  // critical application components are functioning
  res.status(200).send('OK');
});

// Readiness probe endpoint
app.get('/api/ready', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = await db.ping();

    if (dbStatus) {
      res.status(200).send('Ready');
    } else {
      res.status(503).send('Database not available');
    }
  } catch (err) {
    console.error('Readiness check failed:', err);
    res.status(503).send('Not ready');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

This implementation provides distinct endpoints for each probe type, with
appropriate logic for each: the startup probe checks initialization status, the
liveness probe performs a simple health check, and the readiness probe verifies
database connectivity.

## Understanding the CrashLoopBackOff state

![CrashLoopBack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/213059eb-95a7-49ff-4210-505210b10100/md1x =1393x490)

When implementing health checks, especially liveness probes, you may encounter
the `CrashLoopBackOff` state. This occurs when Kubernetes repeatedly tries to
restart a container that keeps failing shortly after startup.

If a container fails a liveness probe multiple times, Kubernetes will restart
it. If these restarts happen too frequently, Kubernetes enters a backoff state,
increasing the wait time between restart attempts to prevent resource
exhaustion.

To troubleshoot `CrashLoopBackOff` states, check the pod's events with
`kubectl describe pod <pod-name>` and inspect the container logs with
`kubectl logs <pod-name> --previous`.

Common causes of `CrashLoopBackOff` related to probes include liveness probe
checking endpoints too early, probes with unreasonable timeouts, and application
bugs causing failures after startup.

The `CrashLoopBackOff` state is actually a protective mechanism in Kubernetes.
Rather than continuously restarting a failing container and potentially
consuming excessive resources, Kubernetes introduces increasing delays between
restart attempts. This gives operators time to identify and fix the underlying
issue while minimizing the impact on the rest of the cluster.

## Best practices for defining probes

To get the most benefit from Kubernetes health checks while avoiding common
pitfalls, follow these best practices:

### Separate health check endpoints

Create dedicated endpoints for different probe types: `/health` or `/liveness`
for liveness probes (simple checks), `/ready` for readiness probes (connectivity
checks), and `/startup` for startup probes (initialization checks).

This separation allows you to implement different logic for each endpoint:

```javascript
// Express.js example
app.get('/health', (req, res) => {
  // Simple check - just verify the process is running
  res.status(200).send('OK');
});

app.get('/ready', async (req, res) => {
  try {
    // Check database connection
    await db.ping();
    // Check cache connection
    await cache.ping();
    res.status(200).send('Ready');
  } catch (err) {
    res.status(503).send('Not Ready');
  }
});

app.get('/startup', async (req, res) => {
  try {
    // Check if initialization is complete
    if (appState.isInitialized()) {
      res.status(200).send('Started');
    } else {
      res.status(503).send('Initializing');
    }
  } catch (err) {
    res.status(503).send('Startup Error');
  }
});
```

By implementing separate endpoints with distinct logic, you give Kubernetes a
clearer picture of your application's state. This approach also makes it easier
to maintain and debug your health checks, as each endpoint has a single,
well-defined responsibility.

### Set appropriate timeouts

Set timeouts based on your application's behavior. For readiness probes, use
shorter timeouts (1-2 seconds). For liveness probes, allow slightly longer
timeouts (3-5 seconds). For startup probes, set the failureThreshold high enough
to accommodate worst-case startup times.

Timeout settings should reflect the actual performance characteristics of your
application. If your application consistently takes 3 seconds to respond under
normal load, a 1-second timeout will cause frequent false positives. Conversely,
if your application typically responds in milliseconds, a 10-second timeout
might delay detection of real issues.

### Balance probe frequency

Be mindful of how often probes run. Too frequent probes can create unnecessary
load on your application, while too infrequent probes might delay detection of
problems.

For most applications, readiness probes should run every 5-10 seconds, and
liveness probes every 15-30 seconds. These frequencies provide a good balance
between timely detection and minimal overhead, but you should adjust them based
on your application's importance and resource constraints.

### Use startup probes for slow-starting applications

If your application takes variable time to start, use a startup probe rather
than setting long initialDelaySeconds on liveness probes. This offers better
protection once the application is running.

Startup probes are one of the newer additions to Kubernetes' health check
capabilities, and they solve a specific problem: how to handle applications with
unpredictable startup times without compromising on fast failure detection after
startup. By using a startup probe, you can give your application as much time as
it needs to start while still detecting failures quickly once it's running.

## Common challenges with Kubernetes health checks

When a probe fails, Kubernetes provides minimal information about why it failed.
This is why it's important to implement comprehensive logging in your health
check endpoints:

```javascript
app.get('/ready', async (req, res) => {
  const checks = {
    database: false,
    cache: false,
    fileSystem: false
  };

  try {
    checks.database = await checkDatabase();
    checks.cache = await checkCache();
    checks.fileSystem = await checkFileSystem();

    const allHealthy = Object.values(checks).every(status => status === true);

    if (allHealthy) {
      res.status(200).json({ status: 'ready', checks });
    } else {
      console.error(`Readiness check failed: ${JSON.stringify(checks)}`);
      res.status(503).json({ status: 'not ready', checks });
    }
  } catch (err) {
    console.error(`Readiness check error: ${err.message}`);
    res.status(503).json({ status: 'error', message: err.message });
  }
});
```

This approach logs detailed diagnostic information while still providing a
simple pass/fail response to Kubernetes. The detailed logging helps you
troubleshoot issues when probes fail, while the structured response gives
Kubernetes the information it needs to make routing decisions.

### Potential resource overhead

Health checks consume resources, especially if configured to run too frequently.
For applications with hundreds or thousands of pods, this overhead can become
significant.

To minimize resource impact, keep health check logic simple and efficient, avoid
expensive operations in liveness probes, and consider using TCP checks for
simple connectivity verification. Remember that every probe execution requires
CPU, memory, and potentially network resources, so design your probes to be as
lightweight as possible while still providing meaningful health information.

## Comparison with other monitoring solutions

Kubernetes probes work alongside, not instead of, comprehensive monitoring
solutions. Here's how they complement each other:

Kubernetes probes provide immediate, automated recovery actions, focus on binary
health states (healthy/unhealthy), operate at the container level, and integrate
directly with Kubernetes scheduling.

Monitoring solutions like [Better Stack](https://betterstack.com/uptime) collect
detailed metrics and trends, provide visualization and alerting, offer
historical data for analysis, and support complex querying and dashboards.

![Screenshot of the monitor status page showing that the service is up with a green 'UP' status in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9e44fcff-91ac-4bc6-80b8-65c821a9b100/orig
=3024x2856)

For comprehensive application health management, use both: probes for automated
recovery and monitoring for visibility and analysis. Probes handle the
immediate, automated responses to failures, while monitoring systems provide the
broader context and historical data needed for troubleshooting and optimization.

## Final thoughts

Kubernetes health checks and probes are essential components of a resilient
containerized application architecture. By properly implementing liveness,
readiness, and startup probes, you create a self-healing system that can
automatically recover from failures, manage traffic intelligently, and provide
stability for your users.

Remember these key points: use liveness probes to detect and recover from broken
containers, use readiness probes to ensure traffic only goes to containers ready
to handle it, use startup probes for applications with variable initialization
times, configure appropriate timing parameters based on your application's
needs, and implement dedicated, lightweight endpoints for each probe type.

With well-designed health checks in place, your Kubernetes applications will be
more reliable, require less manual intervention, and provide a better experience
for your users.

Thanks for reading!