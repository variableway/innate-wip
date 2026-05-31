# 7 Steps to Reducing Your Logging Costs

In modern application environments, the sheer volume of log data being generated
can make indexing all of it a costly endeavor.

To avoid exorbitant logging costs, you need to balance the risks of data
overload with the necessity of maintaining comprehensive observability.

The dilemma often lies in choosing between reducing costs by filtering logs and
retaining complete data for potential troubleshooting and analysis needs.

In this article, we will discuss several strategies you can employ to filter out
non-essential log data to manage costs, while still getting the most value out
of your log data.

Let's begin!

[ad-logs-small]

## Step 1 — Start by measuring your logging costs

Before you can start optimizing your log usage and costs, you must assess your
current spending on logging tools and associated engineering resources.

You may begin by noting down the specific volumes of log data you're currently
processing and their ingestion, storage (for the retention period), and querying
costs.

If you're utilizing logging tools that are not part of your primary cloud
logging service, ensure to include their associated costs in the estimate.

This might involve accounting for the expenses related to compute power and
storage, charges for using data processing services like Apache Kafka or Redis,
network fees incurred when [aggregating log data](https://betterstack.com/community/guides/logging/log-aggregation/), and the
investment in engineering personnel dedicated to managing your organization's
logging infrastructure.

Once you know where the majority of your logging spend originates from, you can
now begin to apply the most relevant techniques below to reduce the spend

## Step 2 — Cut down your log volume

In many cases, the most effective way to reduce logging spend is to eliminate
the logs you don't need. This approach can be beneficial even with fixed-price
contracts with cloud providers, as it can reduce other costs in your pipeline,
such as those associated with processing and transferring the log data.

For example, do you really need to log all incoming requests to your servers? If
you don't need request-level auditing, it may be best to only log requests that
lead to 500 errors to allow for future investigation.

![Screenshot 2024-01-15 at 13-18-59 Live tail Better Stack.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0d13bc09-5f0b-4d60-7d39-b4db444dcf00/md2x =3118x1806)

If you're using logs questions like how many requests per second, error rates,
most frequently accessed routes, and more, [you probably
shouldn't](https://betterstack.com/community/guides/logging/logging-best-practices/). Metrics are a much more effective and
cheaper tool for answering these type of questions.

This also means [logging at the correct level](https://betterstack.com/community/guides/logging/log-levels-explained/) to
eliminate chatty logs that don't add much value. While most production systems
default to `INFO`, you can go up to `WARN` or even `ERROR` if you only care
about logs when the system is experiencing issues and [dynamically increase log
verbisity on demand when needed](https://betterstack.com/community/guides/logging/change-log-levels-dynamically/).

## Step 3 — Sample your logs

Incorporating log sampling is a strategy that deserves greater attention in the
industry, particularly as a proactive measure rather than a reactive solution to
escalating costs.

Since it involves selectively recording a percentage of chatty log data to
reduce volume, it can be challenging to implement in environments accustomed to
retaining all logs. The difficulty lies in shifting the established culture and
practices where logs are used for purposes that may be better served by other
means, like metrics or traces.

When implemented at a stage where logging costs are not yet a concern, it allows
for a smoother transition and less resistance to change. It also reduces the
likelihood of encountering entrenched practices that make the adoption of
sampling a prolonged and frustrating process for all parties involved.

An increasing amount of logging frameworks are incorporating simple built-in
sampling tools that you can use to get started. If your needs become more
complex, designing a custom sampling strategy, like varying rates for different
log levels, message types, or based on the presence of a certain field can be
highly effective.

**Learn more:** [How to Reduce Logging Costs with Sampling](https://betterstack.com/community/guides/logging/log-sampling/)

## Step 4 — Configure an appropriate log retention period

In many cloud-based logging systems, logs are often stored for a default period
(such as 7 days) without incurring additional storage costs. Retaining logs
beyond this default period often leads to increased costs.

To avoid this, assess the actual utility of your logs over time and adjust the
retention period to the minimum necessary duration. This adjustment can lead to
immediate cost reductions.

You can also adapt your retention strategy based on current needs. For instance,
extending the retention period might be beneficial around major feature releases
. Conversely, during periods of low activity consider shortening the retention
period.

Expiring your logs doesn't necessarily mean you have to throw them all away
permanently though. It's usually important to maintain access to certain logs
for future needs, such as for investigating past incidents or for
compliance/auditing reasons.

Therefore, consider archiving expired logs in cost-effective storage solutions
like S3 buckets (or similar). These solutions are much cheaper than keeping them
on the primary logging platform.

Usually, you only need to create an IAM role and an S3 bucket in your cloud
provider. Then, use the archival tools available in your logging platform to
specify the bucket and provide necessary access credentials. This setup ensures
that you can access and re-ingest logs if needed later, without incurring high
costs.

![Screenshot from 2024-01-15 18-02-21.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c315594c-d89f-418c-5a39-e6df01f19700/lg2x =2246x1950)

## Step 5 — Rate limit your error logs

During outages, database or API downtime, or other erroneous states, a surge in
error messages may occur in your system leading to repetitive error logs that
offer limited additional value often with expensive stack traces.

One way to guard against this is to rate-limit how often a given logger will log
the same error. This not only reduces the volume of unnecessary logs during an
outage but also improves application performance and ensures that costs remain
predictable even during system failures.

You can do this by implementing a mechanism that triggers when a specific error
message exceeds a predefined threshold. Once this limit is reached, the system
ceases to log further instances of that error. This way, you'll get the
essential error information without overwhelming the system (and increasing your
costs) with redundant data during high-error periods!

The ideal way to rate-limit error logs is to use a framework that supports such
features (either built-in or as a plugin) since it means the log will not be
generated in the first place, but if this is not possible a [log
collector](https://betterstack.com/community/guides/logging/log-shippers-explained/) can also help you filter out redundant log
data effectively.

## Step 6 — Set up alerting to detect logging spikes

To prevent spikes in log-related costs, you should monitor the volume of logs
and set up alerting to help you detect issues before they result in significant
charges.

Here's a general approach to setting up these alerts in cloud logging
environments:

1. First, you must ensure that current volume of logs being processed is within
   your budgetary constraints.

2. Next, access the section of your logging platform where logs-based metrics
   are displayed.

3. Create or locate a system-defined metric related to your log ingestion
   volume.

4. Use the available options to create an alarm for this metric and configure
   the notification channels.

## Step 7 — Switch vendors

Reducing logging costs is sometimes most effective when you reassess your choice
of logging vendors. This involves considering whether your current vendor's
offerings align with your actual usage and needs, and if not, exploring
alternatives that could offer better value.

When choosing a vendor, be aware of the potential for vendor lock-in where you
might feel dependent on a single vendor's services. This can limit your
flexibility and potentially lead to higher costs in the future.

[Better Stack](https://betterstack.com/logs/) is a cloud-based log management
tool that comes with advanced features for parsing, analyzing, filtering, and
visualizing logs, handling large data volumes for faster insights. It supports
with many log collectors and application environments with detailed integration
guides available.

Key features include live tailing, customizable dashboards, real-time
monitoring, and incident management. Better Stack also offers custom alert
setups, allowing you to receive notifications through your preferred channels
when anomalies are detected. Despite the advanced functionality, it remains
user-friendly and cost-effective, with plans starting at only $25/month.

## Final thoughts

In this article, we covered 7 strategies to optimize and reduce your logging
costs. We hope these tips will assist you in achieving more efficient and
cost-effective logging practices.

Thanks for reading, and happy logging!