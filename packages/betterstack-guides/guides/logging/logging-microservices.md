# Logging in Microservices: 5 Best Practices

In a microservices architecture, it is common to have many services distributed across multiple machines or containers. Due to this complexity, it is essential to implement logging in microservices to diagnose issues quickly.

In this article, we will explore some of the best practices for logging in microservices, enabling you to manage and analyze the logs from various services effectively.


| #   | Best practice                                   | Impact     | Difficulty |
| --- | ----------------------------------------------- | ---------- | ---------- |
| 1   | Standardize your logs          | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     |
| 2   | Centralize your logs in a log management system                          | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐         |
| 3   | Correlate your logs                     | ⭐⭐⭐⭐⭐ | ⭐⭐       |
| 4   | Track requests across services with distributed tracing                  | ⭐⭐⭐⭐⭐   | ⭐⭐⭐      |
| 5   | Implement security measures                      | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐         |


## 1. Standardize your logs

In the microservices architecture, services are often written in different programming languages and managed by diverse teams. This diversity naturally leads to complexity, where each service might generate logs in a unique format. 

For example, one service may produce structured logs in JSON format:

```json
{
  "level": 30,
  "time": 1677506333497,
  "pid": 39977,
  "hostname": "fedora",
  "msg": "Hello, world!"
}
```

In contrast, a legacy system might generate unstructured logs:

```text
2023-07-31 06:43:37 [warning] Resource usage is nearing capacity
```

This inconsistency in log formats poses a significant challenge when analyzing logs. In addition, the following are some challenges that can also occur:

- **Time discrepancies**: each machine in a microservices architecture operates on its own clock, leading to inconsistent timestamps. Additionally, timestamps might be presented in different formats, such as ISO or Unix time.

- **Lacking context data**: some log messages lack sufficient context to understand the events they represent, making troubleshooting difficult.

- **Sensitive information in logs**: logging sensitive data, like email addresses or credit card information, is a common pitfall. Despite best practices, some services might still produce logs with sensitive information, leading to security concerns.

To fix this issue, first, adopt a consistent log format across all microservices. JSON is a recommended choice due to its readability and machine-parseable structure:

   ```json
   {
     "level": 30,
     "time": "2023-02-23T06:25:33.497Z",
     "pid": 39977,
     "hostname": "fedora",
     "msg": "Hello, world!"
   }
   ```

Regarding timestamps, it's often better to use a format like [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601), as shown in the preceding code, which is a human-readable timestamp and includes timezone information.

To minimize time discrepancies, you can synchronize the clocks across different machines using protocols like the [Network Time Protocol (NTP)](https://en.wikipedia.org/wiki/Network_Time_Protocol).
 
Another thing you can do is to avoid [logging sensitive information](https://betterstack.com/community/guides/logging/sensitive-data/). In cases where it is unavoidable, you can use logging frameworks to redact sensitive parts from logs while still maintaining log utility.

Sometimes, it can be challenging to change logs from the source, especially when dealing with legacy systems or third-party tools. In that case, consider using [log collectors(also referred to as log shippers)](https://betterstack.com/community/guides/logging/log-shippers-explained/), which can collect the logs and change the logs format or redact the sensitive fields. However, be cautious with excessive formatting, which can strain CPU usage.

Incorporating these practices ensures that logs remain consistent, secure, and valuable, making troubleshooting and system analysis more effective.

**Learn more**: [9 Ways to Improve Log Formatting in Production](https://betterstack.com/community/guides/logging/log-formatting/)

[summary]
### Transform and standardize logs automatically

While standardizing logs at the source is ideal, legacy systems and third-party services often produce inconsistent formats. [Better Stack](https://betterstack.com/log-management) automatically parses unstructured logs into structured JSON and supports VRL (Vector Remap Language) for advanced log transformation and redaction—without straining your CPU.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="Live tail" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[Start collecting logs for free](https://betterstack.com/users/sign-up).
[/summary]

## 2. Centralize your logs in a log management system
One of the primary reasons to standardize logs is to review them, and in a microservices setup, services can run across multiple machines. Manually logging into each machine to read logs becomes exhausting. 

One way to alleviate this process is using an [SSH multiplexer](https://en.wikibooks.org/wiki/OpenSSH/Cookbook/Multiplexing), which allows you to execute commands across multiple servers. While this method can work for a few servers, it becomes impractical with an increasing number of servers.

As a remedy, you can [aggregate the logs](https://betterstack.com/community/guides/logging/log-aggregation/) from various services and store them in a single location, a process known as centralized logging. In this setup, you use a log collector, which operates independently of the services to collect log streams from each service and forward them to a central location for storage:

![Diagram showing a log collector sending Logs to a log management tool](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cfe4dc80-a032-4707-9aa9-a8b6af9b2800/md1x =1505x604)

This solution comprises several components:

- **Log collector**: a tool designed to collect logs from multiple sources, process them, and forward them to various destinations. These tools handle high volumes of logs per second without consuming excessive resources and can be configured for high availability. Examples include [Vector](https://betterstack.com/community/guides/logging/vector-explained/), [Fluentd](https://betterstack.com/community/guides/logging/fluentd-explained/), [Filebeat](https://betterstack.com/community/guides/logging/filebeat-explained/), [Fluent Bit](https://betterstack.com/community/guides/logging/fluent-bit-explained/), and [Logstash](https://betterstack.com/community/guides/logging/logstash-explained/).

- **Log management tool**: a fully managed solution that simplifies the storage, analysis, visualization, and archival of logs. An example is [Better Stack](https://www.betterstack.com/), which allows SQL-based querying for efficient log search and filtering.

With this approach, you can query all your logs in a single place.

## 3. Correlate your logs
In microservices, multiple interconnected services collaborate when a user initiates a request. Consider an online hotel booking system: when a user attempts to book a hotel room, the request triggers the Search service to find available hotels. Upon selecting a hotel, the Booking service handles the reservation, followed by the Payments service processing the transaction, and the Notification service confirming the booking with the user.  

![microservices architecture diagram](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ebddd034-1763-4df3-1a55-daceb5ebff00/public =1337x863)

If an error occurs in this scenario, it is challenging to identify the issue within a broader context. Even if you can read the logs from all services in a central location, determining the specific service responsible for the failure can be mysterious.

To address the challenge, you should use a correlation ID. At the start of a request, you can generate a unique correlation ID, which is then propagated to all downstream services. Each service involved in the request appends this correlation ID to its generated logs, placing it consistently within the log structure.

You can use your application's middleware to attach a correlation ID to a request. The ID can be in any value you desire; often, a universally unique identifier (UUID) is the preferred choice. The correlation ID is then passed along the request pathway, either by attaching it to request headers or query parameters. To ensure consistency, maintain a standardized header name, such as `X-Correlation-ID`.

To view all logs associated with a specific correlation ID, you can use the ID to filter the logs within your preferred log storage and analysis tool. In the following code, all log events without the `xyz-456` sample correlation ID have been filtered out:

```text
[output]
{
  "timestamp": "2023-10-15T14:30:46",
  "service": "Search",
  "logLevel": "INFO",
  "X-Correlation-ID": "xyz-456",
  "message": "Searching available hotels ..."
}
{
  "timestamp": "2023-10-15T14:30:47",
  "service": "Search",
  "logLevel": "INFO",
  "X-Correlation-ID": "xyz-456",
  "message": "Found 3 hotels matching criteria ..."
}
{
  "timestamp": "2023-10-15T14:30:48",
  "service": "Booking",
  "logLevel": "INFO",
  "X-Correlation-ID": "xyz-456",
  "message": "User selected Hotel XYZ ..."
}
...
```

In this example, every service involved in the request includes an "X-Correlation-ID" field containing the correlation ID created at the beginning of the request. With correlation IDs embedded in the logs, you can create specialized tools to track down a request as it traverses a microservices architecture.

## 4. Track requests across services with distributed tracing

Correlating your logs allows you to unify all logs in a single request. To build upon that, you should also use distributed tracing to track a request through various services. Distributed tracing adds details, such as request paths, status codes, start and end timestamps, and service dependencies, providing a comprehensive view of system interactions. 

In distributed tracing, a tool automatically assigns a unique trace ID  when an end user initiates a request. As the request propagates through services, each service creates a span containing the initial request's trace ID, a unique span ID, and the ID of the service that initiated the request (referred to as the "parent span"). 

Spans represent segments of a request's path. The span's content depends on the instrumentation tool used; [Opentelemetry](https://opentelemetry.io/), being vendor-neutral, has gained popularity due to its compatibility with various telemetry data management tools, both open source and commercial.

Here's an example of a span that Opentelemetry generates:

```text
{
  "name": "search_service",
  "context": {
    "trace_id": "0x5b8aa5a2d2c872e8321cf37308d69df2",
    "span_id": "0x051581bf3cb55c13"
  },
  "parent_id": null,
  "start_time": "2023-11-08T15:20:30.891Z",
  "end_time": "2023-11-08T15:20:30.897Z",
  "attributes": {
    "http.route": "hotel_search"
  },
  "events": [
    {
      "name": "Search Initiated",
      "timestamp": "2023-11-08T15:20:30.895Z",
      "attributes": {
        "user_id": 12345
      }
    }
  ]
}
```

In this context, the trace ID is inherited from the initial request, and the span has its unique span ID. Subsequent services attach their spans, linking them to the parent span using the "parent_id" field. All generated spans are then forwarded to a central collector for processing. 

After a complete request cycle, these spans are assembled into a trace, providing a comprehensive view of the request's journey through the distributed system:

```text
{
  "trace_id": "0x5b8aa5a2d2c872e8321cf37308d69df2",
  "spans": [
    {
      "context": {
        "trace_id": "0x5b8aa5a2d2c872e8321cf37308d69df2",
        "span_id": "0x4cfe3a1a593b7fa4",
        "..."
      },
      "parent_id": null,
      "..."
    },
    {
      "context": {
        "trace_id": "0x5b8aa5a2d2c872e8321cf37308d69df2",
        "span_id": "0x6f589e41e789eb60",
        "..."
      },
      "parent_id": "0x4cfe3a1a593b7fa4",
      "..."
    },
    {
      "context": {
        "trace_id": "0x5b8aa5a2d2c872e8321cf37308d69df2",
        "span_id": "0x6f589e41e789eb61",
        "..."
      },
      "parent_id": "0x6f589e41e789eb60",
      "..."
    }
    ...
  ]
}
```

To reconstruct the entire lifespan of a request as it traverses the distributed system, a dedicated distributed tracing tool like [Jaeger](https://www.jaegertracing.io/) or [Zipkin](https://zipkin.io/) can be employed. These tools reconstruct the request's full path using the spans and present them in a unified visualization, aiding in efficient analysis and troubleshooting:

![Diagram showing Jaeger trace](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/abcda34e-5f27-4fe7-569a-3a7f8375bf00/orig =3360x1859)

[summary]
### Visualize distributed traces and correlate with logs

[Better Stack](https://betterstack.com/tracing) provides OpenTelemetry-native distributed tracing that automatically tracks requests across your microservices. Visualize service dependencies, identify performance bottlenecks, and correlate traces with logs for complete observability—all in one platform.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/wQKjCDD7nfk" title="What is Better Stack?" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Better Stack's eBPF-based collector automatically captures traces from your Kubernetes and Docker clusters without code changes. View service maps, analyze trace spans with RED metrics, and create custom dashboards to monitor request latencies and error rates.

[Start tracing for free](https://betterstack.com/users/sign-up).
[/summary]

## 5. Implement security measures
Microservices involve a substantial flow of data over networks, with services communicating critical information to one another. Data transmission over networks introduces security risks, making systems vulnerable to malicious attacks. Attackers may attempt unauthorized access, tampering, or interception of this data. If attackers gain access to log data, they can obtain comprehensive records of system activities, including sensitive information, such as user private details and financial transactions.

Securing log data in microservices necessitates proactive approaches; the following are some strategies you can use:

- Data encryption
- Avoid logging sensitive data
- Regular backups and disaster recovery
- Monitoring and intrusion detection
- Authentication and authorization:

Securing data within microservices architecture demands a multi-faceted approach. It begins with encrypting data both in transit and at rest. For data in transit, appropriate encryption methods should be selected based on the communication protocols. For example, using HTTPS with TLS for HTTP communication and leveraging built-in TLS support in protocols like [gRPC](https://grpc.io/) significantly enhance data security during transmission. At rest, data should be encrypted using reputable encryption software, with regular encrypted backups in place to prevent unauthorized access.

Additionally, it is vital to exercise caution in logging practices. Sensitive information such as social security numbers, credit card details, and email addresses should never be included in logs. Logging such data increases the potential impact of a data breach, leading to severe privacy concerns and legal consequences.

Another important measure is a robust backup strategy and disaster recovery plan. Regularly backing up log data and ensuring these backups are encrypted is crucial. This not only helps in mitigating data loss but also facilitates swift recovery in the event of a security breach.

Real-time monitoring and intrusion detection systems are pivotal in identifying security threats. These tools can detect unauthorized access attempts and unusual data access patterns. When integrated, they trigger alerts, enabling immediate responses to potential security incidents.

Finally, implementing strong authentication and authorization mechanisms within the microservices architecture is paramount. Access controls should be meticulously designed to restrict access to sensitive log data. Only authorized personnel should have the capability to view or modify logs. Using robust identity management solutions ensures effective management of user access and permissions.

[summary]
### Secure log data with enterprise-grade compliance

[Better Stack](https://betterstack.com/log-management) is SOC 2 Type 2 compliant, GDPR adherent, and HIPAA-compatible. Encrypt logs in transit and at rest, host data in your own S3 bucket for complete control, and use role-based access control with audit logs to restrict who can view sensitive log data.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/_pv2tKoBnGo" title="Better Stack Collector" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

The eBPF-based collector securely captures telemetry from your microservices without exposing sensitive data, with automatic redaction capabilities built in.

[Secure your logs today](https://betterstack.com/users/sign-up).
[/summary]

## Final Thoughts

Logging in a microservices architecture is undeniably crucial, and in this article, we have delved into some of the best practices you can employ. While implementing effective logging can be a challenging task, its benefits are immense.

Throughout this tutorial, we covered a variety of tools. One worth exploring further is Opentelemetry, which you can learn more about in the [Opentelemetry documentation](https://opentelemetry.io/). Additionally, for visualizing traces, consider familiarizing yourself with how to use [Jaeger](https://www.jaegertracing.io/docs/1.50/) or [Zipkin](https://zipkin.io/). For further resources on logging dos and don'ts check our [latest article](https://betterstack.com/community/guides/logging/logging-best-practices/).

Thank you for reading, and happy logging!