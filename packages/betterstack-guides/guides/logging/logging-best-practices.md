# Logging Best Practices: 12 Dos and Don'ts

<iframe width="100%" height="315" src="https://www.youtube.com/embed/I2mWnh66Bkg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Deciding what to log is one of the most challenging aspects of application
development since it's difficult to foresee which pieces of information will
prove critical during troubleshooting.

Many developers resort to logging everything, generating a tremendous amount of
log data, which can be cumbersome to manage and expensive to store and process.

To maximize the effectiveness of your logging efforts and prevent excessive
logging, it's crucial to follow well-established logging best practices.

These guidelines are designed not only to improve the quality of your log data
but also to minimize the impact of logging on system performance.

By implementing the following logging strategies, you'll ensure that your logs
are both informative and manageable, leading to quicker issue resolution and
lower costs!

|                                              | Impact     | Difficulty |
| -------------------------------------------- | ---------- | ---------- |
| Establish clear logging objectives           | ⭐⭐⭐⭐⭐ | ⭐⭐       |
| Use log levels correctly                     | ⭐⭐⭐⭐⭐ | ⭐         |
| Structure your logs                          | ⭐⭐⭐⭐⭐ | ⭐⭐       |
| Write meaningful log entries                 | ⭐⭐⭐     | ⭐⭐⭐⭐   |
| Sample your logs                             | ⭐⭐⭐⭐   | ⭐⭐       |
| Use canonical log lines                      | ⭐⭐⭐⭐   | ⭐⭐       |
| Aggregate and centralize your logs           | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     |
| Establish log retention policies             | ⭐⭐⭐     | ⭐⭐       |
| Protect your logs                            | ⭐⭐⭐⭐⭐ | ⭐⭐       |
| Don't log sensitive data                     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   |
| Don't ignore the performance cost of logging | ⭐⭐⭐     | ⭐⭐⭐     |
| Don't use logs for monitoring                | ⭐⭐⭐     | ⭐         |

## 1. Do establish clear objectives for your logging

To prevent noisy logs that don't add any value, it's crucial to define the
objectives of your logging strategy. Ask yourself: what are the overarching
business or operational goals? What function is your application designed to
perform?

Once you've pinpointed these objectives, you can determine the key performance
indicators (KPIs) that will help you track your advancement towards these goals.

With a clear understanding of your aims and KPIs, you'll be in a better position
to make informed decisions about which events to log and which ones are best
left to track through other means (such as metrics and traces) instead of trying
to do everything through your logs

It's hard to get it this stuff right from the get-go, so you'll want to err on
the side of over logging and establish a regular review process to assess and
adjust your log levels to balance noise, identifying and rectifying overly
verbose logs or missing metrics.

Take error logging, for instance: the objective is not just to record errors,
but to enable their resolution. You should log the error details and the events
leading up to the error, providing a narrative that helps diagnose the
underlying issues.

The fix is usually straightforward once you know what's broken and why.

## 2. Do use log levels correctly

Log levels are the most basic signal for indicating the severity of the event
being logged. They let you distinguish routine events from those that require
further scrutiny.

Here's a summary of common levels and how they're typically used:

- `INFO`: Significant and noteworthy business events.
- `WARN`: Abnormal situations that may indicate future problems.
- `ERROR`: Unrecoverable errors that affect a specific operation.
- `FATAL`: Unrecoverable errors that affect the entire program.

Other common levels like `TRACE` and `DEBUG` aren't really about event severity
but the level of detail that the application should produce.

Most production environments typically default to `INFO` to prevent noisy logs
but the log will often not have enough detail to troubleshoot some kinds of
problems. You must plan to log at an increased verbosity temporarily while
investigating issues.

Modifying log verbosity is typically done through static config files or
environmental variables but a more agile solution involves implementing a
mechanism to [adjust log levels on the fly](https://betterstack.com/community/guides/logging/change-log-levels-dynamically/). This
can be done at the host level, for specific clients, or service-wide.

Some logging frameworks also provide the flexibility to alter log levels for
specific components or modules within an application rather than globally. This
approach allows for more granular control and minimizes unnecessary log output
even when logging at the `DEBUG` or `TRACE` level.

Remember to adjust the log level once you're done troubleshooting.

**Learn more**: [Log Levels Explained and How to Use Them](https://betterstack.com/community/guides/logging/log-levels-explained/)

## 3. Do structure your logs

Historical logging practices were oriented toward creating logs that are
readable by humans, often resulting in entries like these:

```text
[2023-11-03 08:45:33,123] ERROR: Database connection failed: Timeout exceeded.
Nov  3 08:45:10 myserver kernel: USB device 3-2: new high-speed USB device number 4 using ehci_hcd
ERROR:  relation "custome" does not exist at character 15
```

These types of logs lack a uniform format that machines can parse efficiently,
which can hinder automated analysis and extend the time needed for diagnosing
issues.

To streamline this process, consider the following steps:

Firstly, [adopt a logging framework](https://betterstack.com/community/guides/logging/logging-framework/) that allows you to log
in a structured format like JSON if your language does not provide such
capabilities in its standard library.

Secondly, configure your application dependencies to output structured data
where possible. For example, PostgreSQL produces plaintext logs by default but
as of version 15, it can be configured to
[emit logs in JSON format](https://betterstack.com/community/guides/logging/how-to-start-logging-with-postgresql/#structured-logging-in-json).

Thirdly, you can use [log shippers](https://betterstack.com/community/guides/logging/log-shippers-explained/) to parse and
transform unstructured logs into structured formats before they are shipped to
long-term storage.

As an example, consider [Nginx error
logs](https://betterstack.com/community/guides/logging/how-to-view-and-configure-nginx-access-and-error-logs/). At the time of
writing, they don't support native structuring but with a tool like
[Vector](https://betterstack.com/community/guides/logging/vector-explained/), you can convert an unstructured error log from this:

```text
172.17.0.1 - alice [01/Apr/2021:12:02:31 +0000] "POST /not-found HTTP/1.1" 404 153 "http://localhost/somewhere" "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36" "2.75"
```

To structured JSON like this:

```json
{
  "agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36",
  "client": "172.17.0.1",
  "compression": "2.75",
  "referer": "http://localhost/somewhere",
  "request": "POST /not-found HTTP/1.1",
  "size": 153,
  "status": 404,
  "timestamp": "2021-04-01T12:02:31Z",
  "user": "alice"
}
```

With your logs in a structured format, it becomes significantly easier to set up
custom parsing rules for monitoring, alerting, and visualization using log
management tools like [Better Stack](https://betterstack.com/logs).

For those times in development when you prefer to read logs that are easier on
the eyes, you can use tools designed to colorize and prettify logs, such as
[humanlog](https://github.com/humanlogio/humanlog), or check if your framework
offers built-in solutions for log beautification.


[summary]
### Centralize your application logs with Better Stack

Following these logging best practices is essential, but managing logs across distributed services requires centralized log management. [Better Stack](https://betterstack.com/log-management) delivers log management, distributed tracing, infrastructure monitoring, and incident management in one unified platform.

Get live tailing, powerful SQL and PromQL queries, automated anomaly detection, and seamless integrations for Docker, Kubernetes, and all major frameworks. 


[Start your free trial](https://betterstack.com/log-management) and see results in minutes.
[/summary]

![Better Stack log management dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)


## 4. Do write meaningful log entries

The utility of logs is directly tied to the quality of the information they
contain. Entries filled with irrelevant or unclear information will inevitably
be ignored, undermining the entire purpose of logging.

Approach log message creation with consideration for the reader, who might be
your future self. Write clear and informative messages that precisely document
the event being captured.

Including ample contextual fields within each log entry helps you understand the
context in which the record was captured, and lets you link related entries to
see the bigger picture. It also lets you quickly identify issues when a customer
reaches out with problems.

Essential details can include:

- Request or correlation IDs
- User IDs
- Database table names and metadata
- Stack traces for errors

Here's an example of a log entry without sufficient context:

```json
{
  "timestamp": "2023-11-06T14:52:43.123Z",
  "level": "INFO",
  "message": "Login attempt failed"
}
```

And here's one with just enough details to piece together who performed the
action, why the failure occurred, and other meaningful contextual data.

```json
{
  "timestamp": "2023-11-06T14:52:43.123Z",
  "level": "INFO",
  "message": "Login attempt failed due to incorrect password",
  "user_id": "12345",
  "source_ip": "192.168.1.25",
  "attempt_num": 3,
  "request_id": "xyz-request-456",
  "service": "user-authentication",
  "device_info": "iPhone 12; iOS 16.1",
  "location": "New York, NY"
}
```

Do explore the Open Web Application Security Project’s (OWASP) compilation of
[recommended event attributes](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#event-attributes)
for additional insights into enriching your log entries.

**Learn more**: [Log Formatting Best Practices](https://betterstack.com/community/guides/logging/log-formatting/)

## 5. Do sample your logs

For systems that generate voluminous amounts of data, reaching into hundreds of
gigabytes or terabytes per day, log sampling is an invaluable cost-control
strategy that involves selectively capturing a subset of logs that are
representative of the whole, allowing the remainder to be safely omitted without
affecting analysis needs.

This targeted retention significantly lowers the demands on log storage and
processing, yielding a far more cost-effective logging process.

A basic log sampling approach is capturing a predetermined proportion of logs at
set intervals. For instance, with a sampling rate of 20%, out of 10 occurrences
of an identical event within one second, only two would be recorded, and the
rest discarded.

```go
func main() {
    log := zerolog.New(os.Stdout).
        With().
        Timestamp().
        Logger().
[highlight]
    Sample(&zerolog.BasicSampler{N: 5})
[/highlight]

    for i := 1; i <= 10; i++ {
        log.Info().Msg("a log message: %d", i)
    }
}
```

For more nuanced control, advanced sampling methods can be employed, such as
adjusting sampling rates based on the content within the logs, varying rates
according to the severity of log levels or selectively bypassing sampling for
certain categories of logs.

For example, if your application is experiencing a run of errors it might start
writing out several identical log entries with large stack traces which could be
quite expensive especially for a high traffic service. To guard against this,
you can apply sampling to drop the majority of the logs without compromising
your ability to debug the issue.

Sampling is most efficiently implemented directly within the application,
provided that the logging framework accommodates such a feature. Alternatively,
the sampling process can be incorporated into your logging pipeline when the
logs are aggregated and centralized.

It's crucial to introduce log sampling in your logging process sooner rather
than later before costs become an issue.

## 6. Do employ canonical log lines per request

[A canonical log line](https://stripe.com/blog/canonical-log-lines) is a single,
comprehensive log entry that is created at the end of each request to your
service. This record is designed to be a condensed summary that includes all the
essential information about the request, making it easier to understand what
happened without needing to piece together information from multiple log
entries.

This way, when you troubleshoot a failed request, you only have a single log
entry to look at. This entry will have all the necessary details, including the
request's input parameters, the caller's identity and authentication method, the
number of database queries made, timing information, rate limit count, and any
other data you see fit to add.

Here's an example in [JSON format](https://betterstack.com/community/guides/logging/json-logging/):

```json
{
  "http_verb": "POST",
  "path": "/user/login",
  "source_ip": "203.0.113.45",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
  "request_id": "req_98765",
  "response_status": 500,
  "error_id": "ERR500",
  "error_message": "Internal Server Error",
  "oauth_application": "AuthApp_123",
  "oauth_scope": "read",
  "user_id": "user_789",
  "service_name": "AuthService",
  "git_revision": "7f8ff286cda761c340719191e218fb22f3d0a72",
  "request_duration_ms": 320,
  "database_time_ms": 120,
  "rate_limit_remaining": 99,
  "rate_limit_total": 100
}
```

## 7. Do aggregate and centralize your logs

Most modern applications are composed of various services dispersed across
numerous servers and cloud environments, with each one contributing to a
massive, multifaceted stream of log data.

In such systems, aggregating and centralizing logs is not just a necessity but a
strategic approach to gaining holistic insight into your application's
performance and health.

By funneling all logs into a centralized log management system, you'll create a
singular, searchable source of truth that simplifies monitoring, analysis, and
debugging efforts across your entire infrastructure.

Implementing a robust log aggregation and management system allows you to
correlate events across services, and accelerate incident response by enabling
quicker root cause analysis, and ensure regulatory compliance in data handling
and retention while reducing storage and infrastructure costs by consolidating
multiple logging systems.

With the right tools and strategies, proper log management turns a deluge of log
data into actionable insights, promoting a more resilient and performant
application ecosystem.

[ad-logs]

**Learn more**: [What is Log Aggregation? Getting Started and Best
Practices](https://betterstack.com/community/guides/logging/log-aggregation/)

## 8. Do configure a retention policy

When aggregating and centralizing your logs, a crucial cost-controlling measure
is configuring a retention policy.

Log management platforms often set their pricing structures based on the volume
of log data ingested and its retention period.

Without periodically expiring or archiving your logs, costs can quickly spiral,
especially when dealing with hundreds of gigabytes or terabytes of data. To
mitigate this, establish a retention policy that aligns with your organizational
needs and regulatory requirements.

This policy should specify how long logs must be kept active for immediate
analysis and at what point they can be compressed and moved to long-term,
cost-effective storage solutions or purged entirely.

You can apply different policies to different categories of logs. The most
important thing is to consider the value of the logs over time and ensure that
your policy reflects the balance between accessibility, compliance, and cost.

Remember also to set up an appropriate [log
rotation](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) strategy to
keep log file sizes in check on your application hosts.

## 9. Do protect logs with access control and encryption

Certain logs, such as database logs, tend to contain some degree of sensitive
information. Therefore, you must take steps to protect and secure the collected
data to ensure that it can only be accessed by personnel who genuinely need to
use it (such as for debugging problems).

Some measures include encrypting the logs at rest and in transit using strong
algorithms and keys so that the data is unreadable by unauthorized parties, even
if it is intercepted or compromised.

Choose a compliant log management provider that provides access control and
audit logging so that only authorized personnel can access sensitive log data,
and all interactions with the logs are tracked for security and compliance
purposes.

Additionally, you should verify the provider's practices regarding the handling,
storage, access, and disposal of your log data when it is no longer needed.

## 10. Don't log overly sensitive information

The mishandling of sensitive information in logs can have severe repercussions,
as exemplified by the incidents at
[Twitter](https://www.bleepingcomputer.com/news/security/twitter-admits-recording-plaintext-passwords-in-internal-logs-just-like-github/)
and
[GitHub](https://www.bleepingcomputer.com/news/security/github-accidentally-recorded-some-plaintext-passwords-in-its-internal-logs/)
in 2018.

Twitter inadvertently stored plaintext passwords in internal logs, leading to a
massive password reset initiative. GitHub also encountered a less extensive but
similar issue where user passwords were exposed in internal logs.

Although there was no indication of exploitation or unauthorized access in these
cases, they underscore the critical importance of ensuring sensitive information
is never logged.

A practical approach to preventing the accidental inclusion of sensitive data in
your logs is to hide sensitive information at the application level such that
even if an object containing sensitive fields is logged, the confidential
information is either omitted or anonymized.

For instance, in [Go's Slog package](https://betterstack.com/community/guides/logging/logging-in-go/), this is achievable by
implementing the `LogValuer` interface to control which struct fields are
included in logs:

```go
package main

import (
	"log/slog"
	"os"
)

type User struct {
	ID        string `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

[highlight]
func (u *User) LogValue() slog.Value {
	return slog.StringValue(u.ID)
}
[/highlight]

func main() {
	handler := slog.NewJSONHandler(os.Stdout, nil)
	logger := slog.New(handler)

	u := &User{
		ID:        "user-12234",
		FirstName: "Jan",
		LastName:  "Doe",
		Email:     "jan@example.com",
		Password:  "pass-12334",
	}

	logger.Info("info", "user", u)
}
```

Implementing the `LogValuer` interface above prevents all the fields of the
`User` struct from being logged. Instead, only the `ID` field is logged:

```text
[output]
{"time":"2023-11-08T08:10:54.942944689+02:00","level":"INFO","msg":"info","user":"user-12234"}
```

It's a good practice to always implement such interfaces for any custom objects
you create. Even if an object doesn't contain sensitive fields today, they may
be introduced in the future, resulting in leaks if it ends up being logged
somewhere.

Redacting sensitive data can also be done outside the application through your
logging pipeline to address cases that slip through initial filters.

You can catch a broader variety of patterns and establish a unified redaction
strategy for all your applications, even if they're developed in different
programming languages.

**Learn more**: [Redacting Sensitive Data with the OpenTelemetry
Collector](https://betterstack.com/community/guides/observability/redacting-sensitive-data-opentelemetry/)

## 11. Don't ignore the performance cost of logging

It's important to recognize that logging always incurs a performance cost on
your application. This cost can be exacerbated by excessive logging, using an
inefficient framework, or maintaining a suboptimal pipeline.

To illustrate, let's consider a basic Go application server:

```go
package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Login successful")
	})

	fmt.Println("Starting server at port 8080")

	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

This server, when tested without logging, handles around 192k requests per
second on my machine:

```command
wrk -t 1 -c 10 -d 10s --latency http://localhost:8080/login
```

```text
[output]
. . .
Requests/sec: 191534.19
Transfer/sec:     23.75MB
```

However, introducing logging with [Logrus](https://github.com/sirupsen/logrus),
a popular Go logging library leads to a 20% performance drop:

```go
func main() {
	l := logrus.New()
	l.Out = io.Discard
	l.Level = logrus.InfoLevel
	l.SetFormatter(&logrus.JSONFormatter{})

	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		l.WithFields(logrus.Fields{
			"user_id":    42,
			"event":      "login",
			"ip_address": "192.168.1.100",
		}).Info("User login event recorded")

		fmt.Fprintf(w, "Login successful")
	})

    . . .
}
```

```text
[output]
. . .
Requests/sec: 152572.85
Transfer/sec:     18.92MB
```

In contrast, adopting the newly introduced [Slog package](https://betterstack.com/community/guides/logging/logging-in-go/) results
in a much more modest performance reduction of about 3%:

```go
func main() {
	l := slog.New(slog.NewJSONHandler(io.Discard, nil))

	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		l.Info(
			"User login event recorded",
			slog.Int("user_id", 42),
			slog.String("event", "login"),
			slog.String("ip_address", "192.168.1.100"),
		)

		fmt.Fprintf(w, "Login successful")
	})

    . . .
}
```

```text
[output]
. . .
Requests/sec: 187070.78
Transfer/sec:     23.19MB
```

These examples highlight the importance of choosing efficient logging tools to
balance between logging needs and maintaining optimal application performance.

Another thing you should do is conduct load tests on your services at maximum
sustained load to verify their ability to manage log offloading during peak
traffic and avoid disk overflow.

You can also mitigate performance issues through other techniques like
[sampling](#5-do-sample-your-logs), offloading serialization and flushing to a
separate thread, or logging to a separate partition. Regardless of your
approach, proper testing and resource monitoring is crucial.

## 12. Don't rely on logs for monitoring

While logs are crucial for observing and troubleshooting system behavior, they
shouldn't be used for monitoring. Since they only capture predefined events and
errors, they aren't suitable for trend analysis or anomaly detection.

Metrics, on the other hand, excel in areas where logs fall short. They provide a
continuous and efficient stream of data regarding various application behaviors
and help define thresholds that necessitate intervention or further scrutiny.

They can help you answer questions like:

- What is the request rate of my service?
- What is the error rate of my service?
- What is the latency of my service?

Metrics allow for the tracking of these parameters over time, presenting a
dynamic and evolving picture of system behavior, health, and performance.

Their inherent structure and lightweight nature make them ideal for aggregation
and real-time analysis. This quality is crucial for creating dashboards that
help identify trends and patterns in system behavior.

[summary]
## Side note: Get an application logs dashboard

Save hours of sifting through your application logs. Centralize with [Better Stack](https://betterstack.com/logs) and start visualizing your log data in minutes.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
[/summary]


## Final thoughts

Starting with these 12 logging practices is a solid step towards better
application logs. However, continual monitoring and periodic reviews are
essential to ensure that your logs continue to fulfill ever-evolving business
needs.

Thanks for reading, and happy logging!
