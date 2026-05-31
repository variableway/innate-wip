# The Ultimate Guide to AWS Lambda Metrics

[AWS Lambda](https://aws.amazon.com/lambda/) is a serverless computing service
that automatically handles infrastructure resources, triggered by events from
other services. It's cost-effective as it only runs functions when needed.
However, it requires a different monitoring approach than traditional servers
since system metrics like CPU usage aren't directly available.

Effective monitoring involves understanding function usage, resource needs, and
interactions with other services. This helps avoid issues like throttling due to
insufficient concurrency or errors from upstream services.

Lambda pricing depends on execution time, memory allocation, and request count,
so monitoring is key to cost management. To optimize your Lambda functions, it's
important to monitor metrics related to function utilization and performance,
invocations, concurrency, and provisioned concurrency.

This guide will delve into those key metrics, offering insights into Lambda's
functionality and how to leverage data from logs and traces for comprehensive
application monitoring.

Let's get started!

[ad-uptime]

# Key AWS Lambda metrics to monitor

Lambda offers a wide variety of metrics for monitoring the efficiency of your
function code, invocations, and concurrency. Most of these metrics are readily
available in CloudWatch (at no charge), while others require extraction from
Lambda logs.

They cover areas like function invocation, performance and efficiency, and
concurrency. You can monitor these metrics through Amazon CloudWatch by building
dashboards and setting alarms to respond to changes in utilization, performance,
or error rates.

You can also send them to other monitoring platforms like
[Better Stack](https://betterstack.com) which we'll cover in a separate article.
In this section, we'll look at the some of the key metrics to be aware of in AWS
Lambda.

## 1. Function invocation metrics

In AWS Lambda, a function invocation is a request to execute your Lambda
function code. Each time your Lambda function is triggered by an event or called
directly, it counts as an invocation.

When invoking a Lambda function, you can choose between synchronous or
asynchronous invocation. Synchronous invocation requires waiting for the
function to process the event and return a response before proceeding, while
asynchronous invocation queues the event for processing and returns a response
immediately, allowing your application to continue without waiting. The
`InvocationType` parameter in the Invoke API dictates this behavior, with
`RequestResponse` for synchronous and `Event` for asynchronous invocation.

When you invoke a function, you can choose to invoke it synchronously or
asynchronously. With synchronous invocation, you wait for the function to
process the event and return a response. In such cases, you have to determine
the strategy for handling errors such as retrying the request or sending it to a
queue for debugging.

With asynchronous invocation, Lambda queues the event for processing and returns
a response immediately so that the caller can move on to the next task once it
has confirmed that the event was added to the queue successfully.

If the function returns an error, Lambda retries it twice before discarding the
event. You can also configure a dead-letter queue (DLQ) (which could be
[Amazon SQS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-dead-letter-queue.html)
or [SNS](https://docs.aws.amazon.com/sns/latest/dg/sns-getting-started.html))
for tracking such discarded events so that you can examine them later for
troubleshooting and potential reprocessing.

Regardless of how your functions are invoked, Lambda emits several metrics and
logs to help you monitor their outcomes in real-time. Standard metrics like
invocation count and errors are available for all functions, while other metrics
are tailored to specific invocation types. We'll look at a few of these in this
section:

| Metric Name        | Description                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `Invocations`      | The number of times your function is invoked, including both successful and failed invocations. |
| `Errors`           | The number of invocations that result in an error.                                              |
| `DeadLetterErrors` | The number of times Lambda failed to send a discarded event to a dead-letter queue.             |

### Invocations

The `Invocations` metric refers to the total number of times that your function
code is invoked, regardless of whether it succeeded or failed. Monitoring this
value can help you understand how your functions are performing, and identify
peak usage periods, traffic trends for capacity planning, resource allocation,
and cost optimization.

A sudden spike or drop in invocations can indicate unexpected behavior or issues
with your application or its dependencies. By monitoring this metric, you can
quickly detect such anomalies and investigate their cause.

### Errors

Lambda's `Errors` metric counts the number of invocations that results in a
function error (errors that occur during the execution of your function code).
It does not count invocation errors that occur before your function starts
running (due to issues like missing permissions or invalid request parameters).

A spike in your error rate (`Errors` / `Invocations`) might point to a problem
within the Lambda function itself or a related AWS service. Examining other
telemetry data, such as [Lambda logs](https://betterstack.com/community/guides/logging/aws-lambda-logging/), can help you pinpoint
the cause and resolve the issue.

### Dead letter errors

The Lambda runtime may sometime encounter issues when trying to deliver a
discarded event to the dead-letter queue. This could be due to permission
errors, misconfigured resources, or size limits.

When any of these issues occur, Lambda increments the `DeadLetterErrors` metric
in CloudWatch. Monitoring and alerting on this metric lets you detect potential
data loss caused by failed deliveries to the DLQ.

### Async events received

The `AsyncEventsReceived` metric provides visibility into the total number of
events that has been successfully received and queued for processing by Lambda
when using asynchronous invocation. Monitoring this metric lets you detect when
there's an undesired increase in the number of events queued for processing
which could indicate trigger misconfiguration.

### Async events age

The `AsyncEventAge` metric measures the time duration between when an event is
successfully queued by Lambda for asynchronous invocation and when the Lambda
function is invoked to process the event. An increasing value could indicate
issues like:

- **Throttling**: If your function is being throttled (hitting its concurrency
  limit), events will accumulate in the queue, leading to increased age.
- **Errors**: If your function encounters errors and retries are triggered, the
  event's age will increase with each retry attempt.
- **Backlogs**: A sudden surge in events or slower function processing can cause
  a backlog in the queue, leading to older events.
- **Cold starts**: If your function experiences frequent cold starts, this can
  add to the event's waiting time.

If you notice a rise in this metric, investigate the `Errors` metric to pinpoint
any function errors, and the `Throttles` metric to detect potential concurrency
bottlenecks.

### Async events dropped

The `AsyncEventsDropped` metric tracks the total number of events that were not
successfully processed by your Lambda function and were ultimately dropped. If a
dead-letter queue (DLQ) or `OnFailure` destination is configured, events are
routed there before being discarded. Events can be dropped for various reasons,
such as:

- **Maximum event age or retry attempts**: Lambda has limits on how long an
  event can stay in the queue or how many times it can be retried before being
  dropped.
- **Throttling**: Lambda function reaching its concurrency limit, causing some
  events to be dropped.
- **Function Errors**: Exceptions or bugs in your code preventing successful
  processing.

Monitoring and alerting on this metric will allow you to detect such situations
early and take corrective actions.

## 2. Performance metrics

AWS Lambda performance metrics provide insights into how a single function
invocation performs so that you identify potential bottlenecks, and optimize for
better performance. Here are some of the key performance metrics to keep an eye
on:

| Metric name                        | Description                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `Duration`                         | The amount of time your function code spends processing an event in milliseconds.                       |
| `Billed Duration`                  | The amount of time billed for your function's execution in milliseconds.                                |
| `Init Duration`                    | The time it takes for the runtime environment to initialize before your handler code starts executing.  |
| `Memory Size`                      | The amount of memory allocated to your Lambda function.                                                 |
| `Max Memory Used`                  | The maximum amount of memory used by your function during execution.                                    |
| `Post Runtime Extensions Duration` | The time taken by the runtime extension to complete after the function execution ends, in milliseconds. |
| `Iterator Age`                     | For stream-based event sources, the age of the last record for each batch of records processed.         |

### Duration and billed duration

The `Duration` metric in measures the time your function's code takes (in
milliseconds) to process an event from the start of its invocation to the
completion of its execution.

Since AWS Lambda pricing is based on this `Duration` value rounded up to the
nearest 1ms (billed duration), monitoring it is important for optimizing both
performance and cost by identifying slow functions due to inefficient code or
latency caused by external dependencies.

The `Duration` metric also supports percentile statistics that help filter out
extreme values that can distort the average and maximum, giving you a more
accurate picture of typical performance. For instance, the `p95` statistic
reveals the maximum duration for 95% of invocations, excluding the slowest 5%.

### Init duration

The `Init duration` metric can be found in the `REPORT` log line for each
function invocation. It tracks how long it look to set up an execution
environment for your function (cold starts):

```text
REPORT RequestId: 765b52b4-2600-4348-9ec4-c7f7f1346c57 Duration: 259.72 ms Billed Duration: 260 ms Memory Size: 128 MB Max Memory Used: 69 MB Init Duration: 189.15 ms
```

If your Lambda functions frequently experiences lengthy initialization times due
to cold starts, you can
[configure provisioned concurrency](https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html)
mitigate this latency and improve response times. Note that this value is not
counted towards the `Duration` metric.

### Memory size and max memory used

Monitoring memory size and max memory used in AWS Lambda is necessary for
preventing resource over-provisioning (which increases costs) and
under-provisioning (which risks performance issues). These metrics are also
captured in the `REPORT` log examined earlier which shows that the memory used
(68 MB) is more than half of the available memory (128 MB):

```text
REPORT RequestId: 765b52b4-2600-4348-9ec4-c7f7f1346c57 Duration: 259.72 ms Billed Duration: 260 ms Memory Size: 128 MB Max Memory Used: 69 MB Init Duration: 189.15 ms
```

Analyzing memory usage trends and alerting if the memory consumption approaches
the configured maximum helps with identifying memory-bound functions where
increasing the memory can help resolve the compute bottlenecks. Or if you see
that the memory usage is consistently only a fraction of available memory, you
could reduce the allocated memory to reduce costs.

### Post runtime extensions duration

[Lambda extensions](https://docs.aws.amazon.com/lambda/latest/dg/lambda-extensions.html)
are a way to augment your Lambda functions with additional functionality, such
as monitoring, observability, security, and more. They run alongside your
function code and can perform tasks before, during, and after your function's
execution.

The `PostRuntimeExtensionsDuration` metric specifically focuses on the time
spent (in milliseconds) by extensions after your function's handler has
completed. This includes tasks like sending [logs, metrics, or
traces](https://betterstack.com/community/guides/observability/logging-metrics-tracing/) to external services, performing cleanup
actions, or interacting with other AWS resources.

Monitoring this metric allows you to understand how much additional execution
time your extensions are adding to your Lambda function. This can help you
decide between similar extensions or identify extensions that are causing
performance issues.

### Iterator age

The `IteratorAge` metric in AWS Lambda pertains to the age of the oldest record
in the event stream your function is processing. It is specifically relevant for
stream-based invocations, where your Lambda function is triggered by events from
sources like DynamoDB Streams or Kinesis Streams.

The higher the `IteratorAge` value, the greater the lag between when a record is
added to the stream and when your function processes it. This could indicate
that your function is not keeping up with the incoming data stream.

A growing `IteratorAge` may be caused by various scenarios such as high
ingestion rates, insufficient function concurrency, slow execution due to
inefficient code or external dependencies, invocation errors, or limitations in
the stream's throughput capacity.

Keeping a close eye on the `IteratorAge` metric allows you to detect such issues
and take corrective action. This might involve optimizing your function code,
increasing concurrency, adjusting batch sizes, or scaling the stream's
throughput.

## 3. Concurrency metrics

[Concurrency in AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html)
refers to the number of function instances that are executing simultaneously at
any given time. Each concurrent execution represents an independent environment
where your Lambda function code runs to handle a request.

The Lambda manages function concurrency automatically by scaling up or down the
number of execution environments based on incoming request traffic. When a
function receives a request, it will either use a pre-existing but idle
environment to process it, or if none are available, a new environment will be
created for that specific request.

Since each execution environment can process up to 10 requests per second, the
number of concurrent environments required depends on how quickly the functions
process each request.

For example, if you're receiving 100 requests per second and each request takes
an average of 200ms to be processed, the number of concurrent environments
required to handle the load will be 20 (100 rps \* 0.2 seconds). If the function
execution time increases to 500ms, you will need 50 concurrent environments (100
rps \* 0.5 seconds).

However, there are limits to how many execution environments that can be active
at the same time. Here are some key concepts to take note of:

- **Total account concurrency**: There is a limit on the total number of
  function instances that can execute simultaneously across all functions within
  your AWS account in a specific region. By default, this limit is 1000, but you
  can request an increase.

- **Reserved concurrency**: You can reserve a portion of your account's
  concurrency limit for specific functions. This prevents other functions from
  using that concurrency, ensuring your critical functions always have enough
  capacity to handle requests. Reserved concurrency also acts as a limit that
  prevents the overconsumption of resources by a single function.

- **Unreserved concurrency**: Unreserved concurrency is the remaining pool of
  concurrent executions available to all functions that do not have reserved
  concurrency. Lambda requires that a minimum of 100 concurrent executions
  per-region are always available to such functions.

- **Provisioned concurrency**: This is a feature in Lambda that keeps a
  specified number of execution environments initialized and ready to respond
  immediately to invocations. It's designed to eliminate cold starts, which are
  delays caused by initializing a new environment when a function is invoked
  after a period of inactivity.

Tracking concurrency metrics in AWS Lambda is key to optimizing function
performance and managing resource allocation. By monitoring concurrency, you can
identify overprovisioned functions, scale resources to match demand, and set
reserved concurrency to control scaling behavior and prevent resource
contention.

Lambda provides the following metrics to help you monitor and manage
concurrency:

| Metric name                                 | Description                                                                                                             |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `ConcurrentExecutions`                      | The number of function instances that are processing events at any given time.                                          |
| `UnreservedConcurrentExecutions`            | The number of concurrent function executions that are using the unreserved portion of your account's concurrency limit. |
| `Throttles`                                 | The number of invocation requests that are throttled due to concurrency limits being exceeded.                          |
| `ProvisionedConcurrentExecutions`           | The number of function instances with provisioned concurrency processing events.                                        |
| `ProvisionedConcurrencyUtilization`         | The percentage of provisioned concurrency that is being utilized.                                                       |
| `ProvisionedConcurrencyInvocations`         | The number of times your function is invoked using provisioned concurrency.                                             |
| `ProvisionedConcurrencySpilloverExecutions` | The number of times your function is invoked without provisioned concurrency when all provisioned instances are in use. |

#### Concurrent executions

The `ConcurrentExecutions` metric represents the number of function instances
that are actively processing events at any given time. By tracking and alerting
on this metric, you can see how close your functions are to reaching their
concurrent executions quota for the region or the reserved concurrency limits,
which could lead to throttling if exceeded.

#### Unreserved concurrent executions

The `UnreservedConcurrentExecutions` metric lets you monitor the number of
concurrent function executions that are using the unreserved portion of your
account's concurrency limit. If there's a spike in this metric, it could
indicate that one or more functions are consuming all the available unreserved
concurrency which could lead to the throttling of all other functions.

To mitigate such issues, you should reserve concurrency for your most important
functions, but keep in mind that Lambda will throttle any function that uses all
of its reserved concurrency.

#### Throttles

When the number of concurrent executions reaches or exceeds the defined
per-region concurrency limits, Lambda throttles additional requests by returning
a "429 Too Many Requests" error and incrementing the `Throttles` metric.

These throttled requests are not counted as `Invocations` or `Errors`, so you
must monitor the `Throttles` metric to detect when your Lambda functions are
hitting concurrency limits and potentially causing delays or failures in your
application.

If you're consistently exhausting your concurrency limits, you can take several
actions such as requesting a higher limit from AWS, reducing the execution time
of your functions to free up concurrency faster, or reserving units of
concurrency for specific functions to avoid throttling during peak traffic
hours.

#### Provisioned concurrent executions

The `ProvisionedConcurrentExecutions` metric tells you how many of your
pre-initialized execution environments (provisioned concurrency) are currently
busy handling requests. If the number is consistently low, you might be
over-provisioning and wasting resources. But if it frequently reaches the
maximum, you might need to increase your provisioned concurrency to avoid
throttling.

#### Provisioned concurrency utilization

The `ProvisionedConcurrencyUtilization` metric measures the percentage of your
function's invocations that are benefiting from the faster response times
enabled by provisioned concurrency. Since provisioned concurrency incurs
additional costs, monitoring this metric helps you understand the balance
between the cost of provisioning and the benefits of faster response times. It
also helps you gauge how effectively you're utilizing your provisioned
concurrency so that you're not consistently paying for unused resources.

#### Provisioned concurrency invocations

While the `Invocations` metric tracks all function invocations that use both
provisioned and non-provisioned concurrency, the
`ProvisionedConcurrencyInvocations` metric only tracks the invocations that use
provisioned concurrency. A sudden decrease in these invocations could signal a
problem within the function itself or a disruption in an upstream service that
triggers it.

#### Provisioned concurrency spillover invocations

When the number of concurrent requests surpasses the provisioned concurrency
limit, the excess requests are not rejected. Instead, they "spill over" and are
handled by additional execution environments that are created on-demand. These
on-demand environments might experience cold starts, leading to increased
latency for those specific invocations.

The `ProvisionedConcurrencySpilloverInvocations` metric tracks the number of
invocations that were handled by these on-demand environments due to exceeding
the provisioned concurrency limit. A high spillover rate might indicate that
your provisioned concurrency is insufficient to handle peak traffic so that you
can determine whether to increase your provisioned concurrency.

## Defining custom metrics

While Lambda automatically generates a wealth of built-in metrics, you can also
create and track custom metrics in your application domain to yield even more
insight into your business-specific features.

The default AWS Lambda metrics are emitted at a standard resolution which
provides a one-minute granularity, but custom metrics offers the flexibility by
allowing you to also define standard or high-resolution (one-second)
granularity.

Each custom metric must be published to a namespace, which isolates groups of
custom metrics, so often a namespace equates to an application or workload
domain. You can develop graphs, dashboards, and statistical analysis on custom
metrics in the same way as you can for AWS-generated metrics.

There are two primary ways to create custom metrics in Lambda:

### 1. Embedded Metric Format (EMF)

This involves embedding custom metrics in a specific format alongside your
function's structured log entries. CloudWatch will then automatically extract
metric data from these logs so that you can you can visualize and alert on them
for real-time incident detection.

### 2. CloudWatch PutMetricData API

This API lets enables you to send custom metric data directly to CloudWatch from
your Lambda function code. It's a more direct approach and offers greater
control over metric definitions.

## Final thoughts

In this post, we've covered the inner workings of AWS Lambda and highlighted
many essential metrics for optimizing your serverless functions and managing
costs.

In the next post, we'll dive into the practical aspects of collecting, viewing,
and monitoring your Lambda metrics so that you can unlock the full potential of
your serverless applications.

Thanks for reading!