# Logging vs Error Tracking: Two Sides of the Same Coin? 

Monitoring the health and performance of your applications is a critical aspect
of software development and IT operations.

Two terms you'll often encounter are "logging" and "error tracking." While they
might seem similar at first glance, they serve distinct purposes and offer
different insights into your software's health and performance.

In this article, we'll delve into the key differences between the two, shedding
light on how each contributes to a comprehensive monitoring strategy.

Let's get started by understanding what logging is.

[ad-logs]

## What is logging?

For decades, logs has been an essential part of debugging applications in any
environment. It is the most basic form of application monitoring in which
notable events in a program are recorded (usually to a file) so that one can
piece together what happened during the course of program execution.

A notable event could be any action or occurrence deemed important for
understanding the program's behavior, such as routine actions, function calls,
errors and warnings, performance markers, debugging information, security
events, and many more.

Traditionally, logs were unstructured text, designed to be readable by humans
but difficult for machines to process. However, since modern systems no longer
run at an easily comprehensible human scale, [structured logging](https://betterstack.com/community/guides/logging/json-logging/)
is becoming more commonplace.

With structured logs, you can feed the data to an automated platform for
analysis and alerting, rather than relying on humans to sift through mountains
of data and spot patterns in real-time.

Now that you understand what logging is let's look at what is error tracking is
and how it's different.

## What is error tracking?

Error tracking is a specialized form of logging that zeroes in on capturing and
analyzing errors and exceptions within your application. While general logging
records a wide range of events, error tracking focuses on gathering detailed
context around specific errors to help you understand their impact and resolve
them efficiently.

Some key information captured by error tracking includes:

- The type of the error and its message.
- The sequence of function calls leading up to the error (stack trace).
- The user context that led to the error, and how it affects the user
  experience.
- Information about the system where the error occurred (e.g., operating system,
  browser version).

This data is then sent to a specialized error monitoring platform for processing
and aggregation. This platform alerts you to new issues and assists in
prioritizing them for effective troubleshooting.

Error tracking organizes errors with similar messages and stack traces into
collective issues, along with metadata such as total error counts, first seen
and last seen dates, occurrence frequency, the number of affected user sessions,
and more. This insight helps you understand which issues most significantly
affect your customers and should be addressed first.

When it comes to resolving these issues, having detailed context allows for
better correlation with other events, like recent deployments. After a fix is
implemented, this system also helps you verify whether the issue has been fully
resolved or if new problems have arisen.

In summary, error tracking lets you:

- Consolidate similar errors into groups, making it simpler to prioritize major
  issues and filter out less relevant ones.
- See the specific application versions impacted by an issue.
- Get alerted to spikes in error rates or the emergence of new issues.
- Track errors over time to see their history, frequency, and current status
  (resolved, ongoing, ignored, etc).
- See your overall application health by checking whether error volumes are
  trending up or down.

## The key differences between logging and error tracking

The major differences between logging and error tracking are summarized below:

| Feature            | Logging                                                                                                          | Error Tracking                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Scope**          | Captures a wide range of events for analyzing system behaviour                                                   | Focuses primarily on capturing and analyzing errors and exceptions                                                  |
| **Data collected** | Records all kinds of system events including debugging information, informational messages, warnings, and errors | Collects errors and exceptions only                                                                                 |
| **Detail Level**   | Varies depending on log level and configuration. Can range from very detailed to high-level summaries.           | Provides detailed technical information for each error such as stack traces, environment details, and user context. |
| **Use Cases**      | Used for troubleshooting, system monitoring, security auditing, business analytics, and more.                    | Used for error identification, prioritization, debugging, and software quality measurement                          |
                     |

## Deciding between logging and error tracking

The choice between logging and error tracking hinges on your specific needs and
objectives. If you require immediate alerts about errors as they arise in
production, need to identify recurring issues and their impacts, and want to
prioritize fixes, then error tracking is essential.

On the other hand, if you want a broader understanding of your system's overall
behavior, need detailed audit records for compliance, or wish to analyze user
behavior and usage patterns, then investing in a comprehensive logging solution
is the way to go.

In the majority of cases, the best approach involves using both in tandem for
comprehensive system monitoring and troubleshooting, because they work hand in
hand for investigating errors, crashes and other issues.

For example, imagine that you noticed a problem in your application where an
operation is taken far too long, triggering a timeout error. You've been alerted
of the problem, so you quickly turn to your error tracking platform to
investigate the issue.

You then discover that a number of timeout errors have occurred in the past few
minutes meaning that it's not just a transient issue, but one that indicates a
persistent problem. You then proceed to dig around a bit to see the error's
distribution across environments, sources, and users.

To see how the error came about, you then head to your observability tool check
your logs (and traces) to provide more context to what events that lead up to
the error. You will ideally have an unique ID in the error report that helps you
connect it with related logs, traces, and other telemetry data.

Doing this helps you see how an error in one service may have propagated to
another, discover what aspect of the process is slowing things down. Once you've
zeroed in on the method calls that are slow, you can then investigate further to
see how the calls that timeout differ from the ones that don't.

Perhaps the issue is isolated to a specific set of users, database queries,
third-party API calls, or any number of other parameters. Doing this lets you
get to the root cause of the issue to implement the appropriate fix, and also
follow up with affected users once the fix is deployed.

Logging and error tracking are not competing solutions – they are synergistic
parts of a broader observability strategy that helps you gain a comprehensive
understanding of your application's behavior, identify and resolve issues
quickly, and ultimately deliver a more reliable and enjoyable experience to your
users.

## How to get started with error tracking

Getting started with error tracking involves a few key steps that will help you
gain control over your application's reliability and stability:

1. **Choose an error tracking platform**: There are various error tracking tools
   available, both open-source and commercial. Evaluate your needs based on
   factors like features, integrations, and pricing to select the platform that
   best suits your requirements. Popular examples are Sentry, Bugsnag, Rollbar,
   Raygun, and others.

2. **Integrate the error tracking SDK**: Most error tracking platforms offer
   SDKs for popular programming languages and frameworks. Install the
   appropriate SDK into your application's codebase and configure it to capture
   relevant error data.

3. **Capture and aggregate errors**: Once integrated, the error tracking tool
   will automatically capture exceptions and errors as they occur. These errors
   will be aggregated into a central dashboard, allowing you to see an overview
   of all the issues affecting your application.

4. **Set up alerting**: Configure your error tracking platform to send alerts
   when critical errors occur or when specific error patterns emerge. This will
   help you stay on top of issues and proactively address them before they
   escalate.

5. **Triage and prioritize issues**: Examine the collected errors and prioritize
   them based on frequency, severity, and impact on users. Look for patterns or
   common causes to identify which issues to tackle first.

6. **Analyze and debug**: Dive into the details of each error, including stack
   traces, environment details, and user context. This information will help you
   quickly diagnose the root cause and implement fixes.

7. **Monitor and iterate**: Continuously monitor your error tracking dashboard
   for new errors and trends. Use the insights gained to refine your error
   handling strategies, improve code quality, and enhance overall application
   reliability.

## Final thoughts

In summary, combining both methods allow for a comprehensive monitoring
approach: logging offers a broad view of your application's activity, while
error tracking focuses on errors and exceptions, providing the necessary context
for issue prioritization and troubleshooting.

With both strategies in place, you can proactively identify and address issues,
improve the user experience, and ultimately build more reliable and resilient
software.

Thanks for reading!