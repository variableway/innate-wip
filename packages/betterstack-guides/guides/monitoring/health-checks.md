# Get Started with Server Health Checks

Health checks are vital to maintaining the performance and reliability of
systems and applications. Whether it's a server, a network, or an application,
regular health checks can help identify problems before they become serious and
ensure that systems are running at peak performance.

They typically involve sending regular requests to a server or application to
check that it is responding as expected and that it is functioning properly. The
results of these health checks can be used to identify problems with the
application and to take appropriate action, such as restarting the application
or rolling back to a previous version.

In this article, we will explore the various types of health checks that can be
performed, the benefits of regularly performing health checks, and some best
practices for implementing health checks in your organization. So if you want to
ensure the health and stability of your systems and applications, read on to
learn more about health checks.

![Better Uptime – Monitors (Dark Mode).png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5bab55f8-674e-4850-7b9f-f2e4899fe800/lg1x =4000x2462)

[summary]
### 🔭 Want to get alerted when your application goes down?
Head over to [Better Uptime](https://betterstack.com/better-uptime/) start monitoring your jobs in 2 minutes
[/summary]

## Setting up a basic health check endpoint

The simplest health check endpoint that could work is one that returns a 200 OK
response. This is the bare minimum check you can implement to confirm that your
application is alive and able to handle incoming requests.

```javascript
app.get('/health', async (req, res) => {
  console.log('Health Check Request');
  res.status(200).send();
});
```

However, a positive response doesn't indicate that your application is
functioning optimally since no specific health checks are being performed in the
endpoint. In the following sections, we will discuss a few ways to measure
application health and some best practices to follow when implementing said
checks.

## A server health checklist

Server health can be measured in several ways and at various points in the
system. Some health checks can accurately determine if a specific server is
malfunctioning, but others can give false positives if you're not careful. Each
type of health check has its benefits so you must investigate the most relevant
ones for your situation and implement them accordingly to enable quick failure
detection and resolution.

The specific health checks you need to perform will depend on the type of
application and its operating environment. That said, there are quite a few
checks that are applicable in most scenarios, and they are listed below:

### 1. Liveness checks

These confirm that the application is listening on the expected port and is able
to accept and respond to new TCP connections. Servers that run for extended
periods may eventually break, and these checks are essential to detect such
situations so that it is promptly remedied (usually by restarting). You may
perform liveness checks under a `/health/live` endpoint:

```javascript
app.get('/health/live', async (req, res) => {
  res.status(200).send();
});
```

### 2. Readiness checks

Readiness checks ensure that the application instance is ready to receive
requests. This can usually be combined with the liveness check, but it is useful
to distinguish the two to easily detect situations where the application is
running but temporarily unable to serve traffic (due to some long-running
startup tasks or similar). A readiness check will prevent traffic from reaching
a server that is not ready.

```javascript
app.get('/health/ready', async (req, res) => {
  let isReady = false;

  // anything you need to verify before confirming your application is ready
  // to start handling incoming requests.

  if (isReady) {
    res.status(200).send();
  } else {
    res.status(503).send();
  }
});
```

### 3. Physical server resources

Local server resources that affect an application's ability to function should
also be checked to confirm healthy status. This includes memory, disk, and CPU
usage, read and write permissions, and more. You need to define your healthy
thresholds and then return a status report based on those limits. The methods
for retrieving such information will also vary depending on the application
environment as some do not allow direct system calls.

### 4. Process status

Applications often require supporting processes to function, and failures
involving such processes can be hard to detect. Therefore, a regular health
check should be performed to ensure that missing or malfunctioning support
processes can be quickly detected and fixed.

### 5. Core application dependencies

Dependency health checks confirm that an application can interact with core
dependencies such as databases, cache layer, or external APIs. Anything that is
crucial to the function of your application should be checked to confirm
availability and normal function before before your application is considered
healthy.

The example below checks the connection to the application's database and cache
layer to ensure that they are up and running:

```javascript
app.get('/health/dbs', async (req, res) => {
  try {
    await redisClient.ping();
    await db.query('SELECT 1');
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(503).send();
  }
});
```

To avoid overloading the database and degrading its performance, it's best to
choose a quick query when checking a database connection. In many cases, there
is no need to run a test query if you can establish a successful connection to
the database. If you do need to run a query, use a simple `SELECT` query like
`SELECT 1`.

### 6. Anomaly checks

An anomaly is anything that differs from the expected norm or baseline. This
could include a sudden increase in error rates from an application instance, a
surge in in-flight messages that are yet to be resolved, a sudden increase or
decrease in response times (relative to other instances of the application), or
even servers that are running an older and incompatible version of the
application.

Checking for anomalies is useful when your application is deployed to a cluster
of servers. Such checks compare the behavior of all the servers in the cluster
so that potential anomalies are identified and recovery strategies are applied
to the offending server.

## Handling health check failures

Once your health checks are in place, you need to choose a reporting or recovery
path (or both) for when a specific check fails. Usually, the failing server must
be acted upon by a central system that will decide the appropriate course of
action for the particular failure depending on how tolerant the service should
be to such failures.

There are several strategies for responding to health check failures. This
section will evaluate a few of them.

### 1. Restart or replace the server/application instance

Oftentimes, the right thing to do for a failing server/application instance is
to restart it immediately or replace it with a fresh instance. This is useful
when the application fails a liveness check for example. This strategy can
usually fix the problem and may not require any further action.

Take care not to restart your application like crazy when something bad happens
as that can make a bad situation worse. You can use the
[exponential backoff algorithm](https://en.wikipedia.org/wiki/Exponential_backoff)
to incrementally increase the time between restarts to reduce the pressure on
your dependencies. If the application fails even after multiple restarts, human
intervention may be required to fix the issue.

### 2. Take the server out of service

If a health check failure is caused by a problem local to a specific server,
temporarily taking it out of service can be an excellent solution to help it
recover from the failure before being restored again. Such strategy should be
implemented using the
[Circuit Breaker pattern](https://en.wikipedia.org/wiki/Circuit_breaker_design_pattern)
where traffic is cut to the server for a specified period. Once this period
expires, a limited number of requests are allowed to pass through. If they
succeed, the server is allowed to resume regular operation. Otherwise, the
timeout period is extended. If the server cannot automatically recover after
some time, further escalation may be necessary.

### 3. Temporarily degrade the quality of service

Service degradation is a strategy to fix failing health checks where your
application degrades its quality of service instead of shutting down entirely
after failing a health check. For example, if your database `INSERT`s become too
slow, you might fall back to read-only mode until the issue with your `INSERT`s
are fixed. This might make users temporarily unable to create new resources on
the service, but they'll be able to view existing ones just fine.
[This article from the Netflix Team](https://netflixtechblog.com/making-the-netflix-api-more-resilient-a8ec62159c2d)
explains how they made their API more resilient through fallbacks and service
degradation.

### 4. Utilize the fail-open pattern where appropriate

Taking a server out of operation for a health check failure only makes sense
when the cause of failure is localized to the server alone. If all the servers
are failing health checks at the same time (perhaps due to a failing shared
dependency), such automation can take down the entire service! In cases where
continued operation of the service is deemed more important than the failing
checks, you can employ _fail-open_ behavior, which ensures that traffic
continues to be routed to all servers as long as they can continue to perform
useful work despite the failing checks.

### 5. Send alerts to relevant team members

When a health check failure cannot be automatically resolved, human intervention
is often required to investigate and address the problem. To ensure that such
failures are detected and resolved quickly, you must set up an appropriate
service and configure it so that alerts on such failures reach you promptly.

![Better Uptime – Incidents (Dark Mode).png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0729871b-84b9-4012-fcc5-cf2b2617ac00/md1x =4000x2462)

For instance, [Better Uptime](https://betterstack.com/better-uptime/) can
deliver prompt alerts through phone calls, SMS, Slack, email, push
notifications, and more. It also provides [status pages](https://betterstack.com/community/guides/incident-management/what-is-status-page/)
for communicating downtime, and it integrates with several monitoring and
calendar tools to facilitate incident management and on-call scheduling,
respectively. For further resources on incident management, check [the most used incident management tools](https://betterstack.com/community/comparisons/incident-management-tools/).

## Health checks best practices

We've already ascertained the importance of regular health checks and some
strategies to mitigate failures. However, there are also certain best practices
that you should follow when implementing health checks to ensure that they are
effective and efficient. This section will explore some of these best practices
and discuss why they are useful guidelines to follow.

### 1. Differentiate between critical and non-critical dependencies

When performing health checks on application dependencies, it is best to
separate the checks for mandatory dependencies for the service from the optional
ones. This helps avoid a disproportionate reaction (such as removing servers
from service) when a non-critical dependency is failing.

### 2. Avoid cascading failures

A
[cascading failure](https://sre.google/sre-book/addressing-cascading-failures/)
is one of the most common causes of service outages. It occurs when a failing
dependency leads to the loss of an entire system by progressively toppling
service instances one after the other until there are no healthy instances
available.

For example, when servers are taken out of service due to a failing check, it
can create a downward spiral as the remaining servers must handle a greater
share of the incoming traffic. This increases the likelihood that they will also
become overloaded and fail health checks, which can
[eventually take the entire service down](https://doordash.engineering/2022/08/09/how-to-handle-kubernetes-health-checks/).

Some common strategies to avoid cascading failures include the following:

- **Provide graceful fallbacks**. For example, a failing database check can be
  mitigated by serving cached data or a default value for queries where data is
  only read and not modified.
- **Implement retries with exponential backoff**. Short and intermittent
  failures can be avoided by implementing retries using an
  [exponential backoff algorithms](https://en.wikipedia.org/wiki/Exponential_backoff)
  which gradually reduces the rate at which retries are performed until the
  dependency is deemed to have failed.
- **Utilize timeouts**. Judicious use of [timeouts](https://betterstack.com/community/guides/scaling-nodejs/nodejs-timeouts/) ensures
  that resources are never held up indefinitely while waiting for a response.
  For instance, slow database queries can lead to the pool of connections
  running out which may cause other services to start failing.
- **Limit the number of concurrent requests**. Imposing an upper limit on the
  number of concurrent requests to a service can help prevent flooding a server
  with concurrent requests that can slow it down. When the capacity is full, any
  excess load should be rejected or redirected to some other instance.
- **Don't crash on lousy input**. Crashing your application on a malformed or
  unexpected input or client request can quickly bring your entire fleet of
  servers down if the client keeps retrying the request. To guard against this,
  you can utilize fuzz testing to help detect and fix programs that crash on
  malformed inputs.
- **Avoid long startup times**. Services that perform a lot of work on startup
  can be problematic for several reasons. First, it complicates the autoscaling
  process as new instances may not be able to quickly mitigate an increase in
  load before users start experiencing issues. Secondly, if service instances
  fail for whatever reason, it will take a long time for the system to be
  restored to the usual capacity. These conditions can easily lead to an
  overload, so it is best to avoid this pattern whenever possible.

### 3. Run the health checks in the background

To ensure that your applications respond promptly to health check requests, you
can perform the checks in the background and update an `isHealthy` flag that is
subsequently used in the request handler logic. This pattern will allow server
instances to respond promptly to health checks, but you must take care to also
monitor the health of the background task as failure there could lead to
outdated status reports.

### 4. Guard against false positives

When implementing health checks for dependencies, take care to guard against
short and intermittent failures using techniques like retries, fallbacks,
timeouts, and the circuit breaker pattern. This can help to prevent false
positives where the failure is due to intermittent network issues or similar.
Without such guards, such failures can ripple through the service and ultimately
cause a system-wide outage.

### 5. Separate shallow and deep health checks

Health checks can be broadly categorized into two: shallow and deep. Shallow
health checks are typically quick and simple tests that are used to verify that
a service or dependency is available for use. These checks typically involve
sending a simple request to an API and checking for a response, or verifying
that an API's endpoint is accessible. They are often performed frequently, such
as every minute, in order to ensure that the subject under test is available and
functioning properly.

On the other hand, deep health checks are more comprehensive tests that are used
to verify the functionality of a dependency and ensure that is providing the
correct function to its dependants. Due to their expensive nature and
susceptibility to false positives, they are typically run less often compared to
shallow checks.

Separating shallow and deep health checks is crucial because it allows
developers and sysadmins to monitor the performance and reliability of an API
more effectively. For example, performing deep checks on a system that is trying
to recover from an outage can end up counterproductive. In such scenarios, you
can start with shallow checks and enable deeper checks when the system
stabilizes.

### 6. Only check health as frequently as necessary

Carefully planning the granularity of measurements is essential to ensure that
the data collected is useful and cost-effective. For example, if you're
targeting 99.9% annual uptime for your API, probing for a readiness check more
than once a minute is probably unnecessary. On the other hand, measuring CPU
load over the same period may not reveal short-term spikes that contribute to
high latency.

To optimize monitoring efforts, it may be helpful to internally sample
measurements on the server and then configure an external system to collect and
aggregate the data over time or across servers. This can allow for
high-resolution monitoring without incurring high costs for collection and
analysis.

### 7. Disable caching on your health check endpoints

To ensure that your health check endpoints always provide the most accurate and
up-to-date status, you must disable any form of caching on then. When caching is
enabled, an outdated status report may be returned. In addition, by serving
every request to the health check endpoint in real-time, you can ensure that the
endpoint always provides the most current status of your services.

## Monitoring server health with Better Uptime

Better Uptime lets you monitor your application health directly from its
[web interface](https://betterstack.com/better-uptime), and it offers built-in
incident management and alerting so you can quickly detect failures.

In its **Monitors** section, you can add one or more health check endpoints and
configure how they should be monitored. For example, you could indicate downtime
when the response from the endpoint is outside the 2XX range, or if a keyword is
present or absent in its response.

![Screenshot from 2022-12-18 10-35-52.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/94c4e276-4f3e-40d6-6933-f64fb82ea600/lg1x =1079x988)

After determining what a failing check looks like for the endpoint, you can
configure alerting and get automated notifications when the status of your
health checks change. It supports phone calls, SMS, email, and instant push
notifications (via the Better Uptime Android/iOS app), but you can also post new
incidents to platforms like Slack, or create a custom integration through its
webhook feature.

![Screenshot_20221218_103730_Gallery.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/85b51e24-278b-4d8c-d5fa-2d175871c400/lg1x =1440x1604)

It also supports configuring on-call duties through a calendar interface, such
that only the specific on-call person is notified when a health check is
failing. You can also configure an incident escalation policy such that if the
current on-call person doesn't acknowledge the incident within some minutes,
other team members are promptly notified.

## Final thoughts

Software can fail for various reasons ranging from bugs in the software itself
to hardware issues. Multiple layers of checks and monitoring are necessary to
catch all types of failures. When failures occur, it is important to detect them
quickly and apply the right strategies to correct the issue. It is also
necessary to have safeguards in place to prevent automated responses from
causing further problems, and to involve humans in uncertain situations.

There's a lot more to be said about setting up and monitoring health checks but
we hope the information in this article will get you more comfortable with
designing a health checks strategy for your production applications and
[monitoring them accordingly](https://betterstack.com/better-uptime) so that if
something unexpected happens, you will know exactly where to look.

Thanks for reading, and happy monitoring!
