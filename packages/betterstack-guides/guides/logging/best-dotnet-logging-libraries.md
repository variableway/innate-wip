# Logging in .NET: A Comparison of the Top 4 Libraries

Logging libraries vary in strengths, with some better suited for specific tasks
than others. Certain projects demand lightweight solutions, while others require
robust capabilities to handle high log data volumes. As a result, choosing a
logging library can be challenging, especially with numerous options available.

This article aims to comprehensively compare various .NET logging libraries,
assisting you in making an informed decision for your project's specific needs.

Let's get started!

[summary]

## Side note: Centralize your .NET logs so you can debug production faster

No matter which library you choose, you can ship logs to [Better Stack](https://betterstack.com/logs) to search and troubleshoot in one place instead of digging through scattered log files.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## 1. Microsoft.Extensions.Logging

![Sreenshot of Microsoft documentation page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/16aee5d5-956f-4b9c-a3ae-81855a5f8300/orig
=3024x1514)

The `Microsoft.Extensions.Logging` is a flexible logging framework, which uses
the
[ILogger](https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.logging.ilogger)
API. It was introduced as the default logging framework in the .NET Core
framework and is well supported across the .NET spectrum, including with
ASP.NET, NuGet packages, and Entity Framework.

This framework was developed to cater to the varying logging needs of different
projects. Sometimes, a project may start with one logging library and later
decide to switch to a more sophisticated one, which often requires significant
code changes. The main goal of `Microsoft.Extensions.Logging` is to provide a
layer of abstraction over the logging API used in your project. It introduces a
provider system, allowing logs to be routed to various destinations or libraries
like Serilog or NLog. This approach helps to minimize dependency on any single
logging framework.

`Microsoft.Extensions.Logging` accommodates several severity levels: `Trace,`
`Debug,` `Information,` `Warning,` `Error,` and `Critical.` It also includes
various
[built-in Logging Providers](https://docs.microsoft.com/en-us/dotnet/core/extensions/logging-providers#built-in-logging-providers):

- `Console`: Directs logs to the console.
- `Debug`: Channels log events to the debug output window, viewable in IDEs like
  Visual Studio.

- `EventSource`: Routes log events to an event source.

- `EventLog`: Transmits logs to the Windows Event Log (only on Windows).

Beginning with `Microsoft.Extensions.Logging` is made easy, as demonstrated in
the subsequent example:

```csharp
using System;
using Microsoft.Extensions.Logging;

public class Program
{
    static void Main(string[] args)
    {
        using ILoggerFactory factory = LoggerFactory.Create(builder => builder.AddConsole().SetMinimumLevel(LogLevel.Information)); // Set to Information level
        ILogger logger = factory.CreateLogger("Program");

        logger.LogTrace("Trace message");
        logger.LogDebug("Debug message");
        logger.LogInformation("Info message");
        logger.LogWarning("Warning message");
        logger.LogError("Error message");
        logger.LogCritical("Critical message");
    }
}
```

In this example, you set up a logger that sends logs to the console with a
minimum severity level of `Information`. When run, it will show output that
looks like this:

```text
[output]
info: Program[0]
      Info message
warn: Program[0]
      Warning message
fail: Program[0]
      Error message
crit: Program[0]
      Critical message
```

You can also add context data to enrich the logs with information:

```csharp
using System;
using Microsoft.Extensions.Logging;

public class Program
{
    static void Main(string[] args)
    {
        using ILoggerFactory factory = LoggerFactory.Create(builder => builder.AddConsole().SetMinimumLevel(LogLevel.Information));
        ILogger logger = factory.CreateLogger("Program");

        string productName = "Example Product";
        int quantity = 3;
        decimal totalPrice = 150.99M;

        logger.LogInformation($"Ordering {quantity} units of {productName} with a total price of {totalPrice:C}");
    }
}
```

After the file runs, it logs the following:

```text
[output]
info: Program[0]
      Ordering 3 units of Example Product with a total price of ¤150.99
```

### Microsoft.Extensions.Logging pros

- High performance, especially with
  [source-generation logging](https://learn.microsoft.com/en-us/dotnet/core/extensions/logger-message-generator).
- Standardizes your code, allowing compatibility with any logging framework.
- Lightweight in terms of resource usage.
- Easy to configure.

### Microsoft.Extensions.Logging cons

- Inability to send logs to a file.
- [Limited support](https://github.com/dotnet/runtime/issues/35995) for
  structured logging.
- Lack of useful features such as object state observation through
  destructuring, and LogContext.

## 2. Serilog

![Screenshot of Serilog Github homepage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/80b4a24f-c76a-44f8-419c-4d82ce6ec200/md1x
=1200x600)

Serilog is one of the most popular and fastest logging frameworks available for
.NET applications. Its features include support for structured logging and
configuration options in XML or JSON format. Additionally, Serilog supports
numerous sinks (destinations), such as cloud servers, databases, and message
queues.

Getting started with Serilog is straightforward. Here's a simple example:

```c#
using System;
using Serilog;

namespace SerilogAdvanced
{
    class Program
    {
        static void Main(string[] args)
        {
            using var log = new LoggerConfiguration()
                .WriteTo.Console()
                .CreateLogger();

            log.Information("Hello, Serilog!");
        }
    }
}
```

When you run this program, it produces output similar to the following:

```text
[output]
[10:38:47 INF] Hello, Serilog!
```

While you've encountered one severity level so far, Serilog offers five logging
level methods: `Verbose()`, `Debug()`, `Information()`, `Warning()`, `Error()`,
and `Fatal`.

As mentioned, Serilog is highly configurable. To be able to configure it
successfully, first, you need to be familiar with the following components:

- [Sinks](https://github.com/serilog/serilog/wiki/Configuration-Basics#sinks):
  the destinations to which logs are forwarded, such as databases or the
  console. A curated list of examples can be found
  [here](https://github.com/serilog/serilog/wiki/Provided-Sinks).

- [Output Templates](https://github.com/serilog/serilog/wiki/Configuration-Basics#output-templates):
  responsible for formatting log entries.

- [Enrichers](https://github.com/serilog/serilog/wiki/Configuration-Basics#enrichers):
  modify or add properties to a log entry.

- [Filters](https://github.com/serilog/serilog/wiki/Configuration-Basics#filters):
  enable the filtering of logs based on specified criteria.

Now, let's look at an example that demonstrates how to configure Serilog to
format logs as JSON and use sinks to forward logs to various destinations while
setting the minimum severity level for each destination based on specific needs:

```csharp
using System;
using Serilog;
using Serilog.Events;
using Serilog.Formatting.Json;

namespace SerilogAdvanced
{
    class Program
    {
        static void Main(string[] args)
        {
            using var log = new LoggerConfiguration()
                             .WriteTo.Console()
                             .WriteTo.File(new JsonFormatter(),
                                           "app.json",
                                           restrictedToMinimumLevel: LogEventLevel.Warning)
                             .WriteTo.File("all-.logs",
                                           rollingInterval: RollingInterval.Day)
                             .MinimumLevel.Debug()
                             .CreateLogger();
            log.Information("Hello, Serilog!");
            log.Warning("Warning, Serilog!");
        }
    }
}
```

In this example, logs are formatted into JSON and directed to an `app.json` file
with a minimum severity warning level. Simultaneously, other logs are stored in
the `all-*.logs` file.

When you run the file, the console shows the following output:

```text
[output]
]10:58:58 INF] Hello, Serilog!
[10:58:59 WRN] Warning, Serilog!
```

You will also find that the `app.json` log file has been created with the
following JSON logs:

```json
[output]
{"Timestamp":"2023-11-30T10:58:59.0672316+00:00","Level":"Warning","MessageTemplate":"Warning, Serilog!"}
```

And the `all-20231130.logs` file, will have the following contents:

```text
[output]
2023-11-30 10:58:58.992 +00:00 [INF] Hello, Serilog!
2023-11-30 10:58:59.067 +00:00 [WRN] Warning, Serilog!
```

Serilog also facilitates adding context data to logs, which simplifies the
debugging process. Here's an example:

```csharp
using System;
using Serilog;

namespace SerilogAdvanced
{
    class Program
    {
        static void Main(string[] args)
        {

            using var log = new LoggerConfiguration()
                .WriteTo.Console()
                .CreateLogger();

            var orderId = 123;
            var customerId = "ABC123";

            log.Information("Processing order {OrderId} for customer {CustomerId}", orderId, customerId);

            Log.CloseAndFlush();
        }
    }
}
```

After running your file, the log entry will look the following:

```text
[output]
[11:06:46 INF] Processing order 123 for customer ABC123
```

### Serilog pros

- Offers extensive support for various sinks (destinations).

- Benefits from active development and a robust community, ensuring continuous
  improvement and support.
- Features a wide array of plugins to expand its functionality.

- Supports advanced capabilities like
  [destructuring](https://github.com/serilog/serilog/wiki/Structured-Data#preserving-object-structure)
  and
  [LogContext](https://github.com/serilog/serilog/wiki/Enrichment#the-logcontext)
  for enhanced logging details.

### Serilog cons

- [Unable to immediately recreate and write to the current rolling file](https://github.com/serilog/serilog-sinks-file/issues/128),
  which can delay logging to new files.
- Doesn't natively log exceptions as structured objects, often necessitating
  third-party tools like
  [Serilog.Exceptions](https://github.com/RehanSaeed/Serilog.Exceptions) for
  structured error logging.
- Requires a substantial number of dependencies for full setup, potentially
  complicating the initial configuration process.

**Learn more**: [How To Start Logging With Serilog
](https://betterstack.com/community/guides/logging/how-to-start-logging-with-serilog/)

## 3. Nlog

![Screenshot of Nlog](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/42a77288-e06e-46dc-124c-547cca9ee300/public
=1200x600)

[NLog](https://nlog-project.org/) is a robust logging library for .NET, known
for its high performance, flexibility, and full support for structured logging.

NLog supports the following severity levels: `Fatal,` `Error,` `Warn,` `Info,`
`Debug,` and `Trace.`

Here's a simple example that demonstrates how to get started with NLog:

```csharp
using System;
using NLog;

namespace LoggerExample
{
    class Program
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();

        static void Main(string[] args)
        {
            logger.Info("Hello from Nlog");
            logger.Error("Error from Nlog");

            LogManager.Shutdown();
        }
    }
}
```

The Logger is configured to log informational and error messages in this
example. When you run the file, you won't see any output.

For Nlog to work, it needs proper configuration, which can be done
programmatically or using a configuration file.

Regardless of which configuration you choose, you will need to familiarize
yourself with the following concepts:

- **Targets**: these are the destinations to which logs are sent; examples
  include files, databases, and the console.
- **Rules**: defines the target to send logs to and the minimum severity level.
- **Layouts**: format log messages in various formats such as JSON, CSV, etc.
- **Filters**: Filter logs according to given criteria.

With that, let's look at a programmatically configured example:

```csharp
using NLog;
using NLog.Common;
using NLog.Config;
using NLog.Targets;
using NLog.Layouts;

namespace LoggerExample
{
    class Program
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        static void Main(string[] args)
        {
            // Create logging configuration
            var config = new LoggingConfiguration();

            // Define file target with JSON layout
            var fileTarget = new FileTarget { FileName = "myApp.log" };
            fileTarget.Layout = new JsonLayout
            {
                Attributes = {
                    new JsonAttribute("timestamp", "${date:format=yyyy-MM-ddTHH:mm:ssZ}"),
                    new JsonAttribute("level", "${level}"),
                    new JsonAttribute("message", "${message}"),
                    new JsonAttribute("exception", "${exception:format=Message}")
                }
            };
            config.AddTarget("file", fileTarget);

            // Define console target
            var consoleTarget = new ConsoleTarget();
            config.AddTarget("console", consoleTarget);

            // Create logging rules
            var fileRule = new LoggingRule("*", LogLevel.Info, fileTarget);
            config.LoggingRules.Add(fileRule);

            var consoleRule = new LoggingRule("*", LogLevel.Debug, consoleTarget);
            config.LoggingRules.Add(consoleRule);

            // Set configuration
            LogManager.Configuration = config;

            // Log messages
            logger.Info("Hello from Nlog");
            logger.Error("Error from Nlog");
        }
    }
}
```

In this example, you've configured two targets: `FileTarget` to send logs to a
file (`myApp.log`) and `ConsoleTarget` to display logs in the console. The
`FileTarget` is configured to use a `JsonLayout` for formatting the log messages
in JSON format.

You then set up rules that define the minimum severity level and the target for
each rule. This ensures that logs with a severity level of `Info` and above go
to the file, while logs with a severity level of `Debug` and above go to the
console.

Now, when you run the program, it will produce output similar to the following:

```text
[output]
2023-11-30 13:06:52.4780|INFO|LoggerExample.Program|Hello from Nlog
2023-11-30 13:06:52.5209|ERROR|LoggerExample.Program|Error from Nlog
```

It will also write JSON logs to the `myApp.log` file in the `/bin/Debug/net8.0`
directory, containing the following contents:

```text
[output]
{ "timestamp": "52Z", "level": "Info", "message": "Hello from Nlog" }
{ "timestamp": "52Z", "level": "Error", "message": "Error from Nlog" }
```

As mentioned, NLog can also be configured using an XML configuration file
(`nlog.config`):

```xml
<?xml version="1.0" encoding="utf-8"?>
<nlog xmlns="http://www.nlog-project.org/schemas/NLog.xsd"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.nlog-project.org/schemas/NLog.xsd NLog.xsd">

    <targets>
        <target name="file" type="File" fileName="myApp.log">
            <layout type="JsonLayout">
                <attributes>
                    <attribute name="timestamp" layout="${date:format=yyyy-MM-ddTHH:mm:ssZ}" />
                    <attribute name="level" layout="${level}" />
                    <attribute name="message" layout="${message}" />
                    <attribute name="exception" layout="${exception:format=Message}" />
                </attributes>
            </layout>
        </target>

        <target name="console" type="Console" />
    </targets>

    <rules>
        <logger name="*" minLevel="Info" target="file" />
        <logger name="*" minLevel="Debug" target="console" />
    </rules>

</nlog>
```

This way, you don't have to configure programmatically; you add all the
configurations in the external file, whichever suits you better.

### NLog pros

- It is fast.
- Offers flexible configuration options, allowing both programmatic and
  file-based setups.
- Has comprehensive and well-maintained and documentation.
- Supports enhanced logging capabilities with features like the
  [asynchronous wrapper](https://nlog-project.org/documentation/v5.0.0/html/T_NLog_Targets_Wrappers_AsyncTargetWrapper.htm).
- Extensible through a variety of third-party plugins.

### NLog cons

- Configuration can sometimes become challenging, especially for complex
  scenarios.
- While growing in popularity, NLog's community is still smaller compared to
  other libraries like Serilog, which might affect support and resource
  availability.
- Limited integration with
  [C# interpolated strings](https://github.com/NLog/NLog/issues/825).

**Learn more**: [How To Start Logging With NLog
](https://betterstack.com/community/guides/logging/how-to-start-logging-with-nlog/)

[ad-logs]

## 4. Log4net

![Screenshot of Log4net Github homepage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/847f428e-127c-49d3-7811-07345af6dd00/lg2x
=1200x600)

[Log4net](https://logging.apache.org/log4net/) is a powerful logging framework
for .NET that draws inspiration from Java's Log4j logging framework. It is known
for its high-performance, modular, and extensively designed architecture,
allowing it be extended through the use of plugins. Furthermore, It can be
configured through XML or using dynamic configuration options.

You can kick off using Log4net with an example like this:

```csharp
using log4net;
using log4net.Config;

public class Program
{
    private static readonly ILog logger = LogManager.GetLogger(typeof(Program));
    public static void Main(string[] args)
    {
        BasicConfigurator.Configure();

        logger.Info("This is an info message");

    }
}
```

In this example, Log4net is configured to send logs to the console.

After running the file, the output will look like this:

```text
[output]
118 [1] INFO Program (null) - This is an info message
```

Log4net is flexible and allows you to configure its behavior. Before configuring
it, it helps to understand these two key components:

- **Appenders**: destinations to which logs are forwarded. These destinations
  can include databases, files, or the console.
- **layouts** : Layouts format log messages, determining how the information is
  presented.

To configure Log4net, you use the `log4net.config` file:

```text
<log4net>
  <appender name="RollingFile" type="log4net.Appender.FileAppender">
    <file value="app.log" />
    <layout type='log4net.Layout.SerializedLayout, log4net.Ext.Json'>
      <decorator type='log4net.Layout.Decorators.StandardTypesDecorator, log4net.Ext.Json' />
      <default />
    </layout>
  </appender>

  <!-- Add a Console Appender -->
  <appender name="ConsoleAppender" type="log4net.Appender.ConsoleAppender">
    <layout type='log4net.Layout.SerializedLayout, log4net.Ext.Json'>
      <decorator type='log4net.Layout.Decorators.StandardTypesDecorator, log4net.Ext.Json' />
      <default />
    </layout>
  </appender>

  <root>
    <level value="ALL" />
    <appender-ref ref="RollingFile" />
    <!-- Reference the Console Appender -->
    <appender-ref ref="ConsoleAppender" />
  </root>
</log4net>
```

This configuration includes two appenders: `ConsoleAppender`, which directs logs
to the console, and `RollingFile`, which sends logs to a file and rolls them
based on size or date. Both of these appenders use a `<layout>` that uses the
[`log4net.Ext.Json`](https://www.nuget.org/packages/log4net.Ext.Json/) package
to format logs as JSON.

For the configuration to work, the configuration file must be referenced in the
code, as demonstrated here:

```csharp
...
class Program
{
    private static readonly ILog log = LogManager.GetLogger(typeof(Program));

    static void Main()
    {
[highlight]
        XmlConfigurator.Configure(new System.IO.FileInfo("log4net.config"));
[/highlight]

        log.Info("This is an info message");
        log.Warn("This is a warning message");
    }
}
```

Running the program yields the following output:

```text
[output]
{"date":"2023-11-30T13:46:23.9033810+00:00","level":"INFO","logger":"Program","thread":"1","ndc":"(null)","message":"This is an info message"}
{"date":"2023-11-30T13:46:23.9363428+00:00","level":"WARN","logger":"Program","thread":"1","ndc":"(null)","message":"This is a warning message"}
```

The `app.log` in the `bin/Debug/net8.0` or any directory of your choosing will
also contain the JSON content:

```text
[output]
{"date":"2023-11-30T13:46:23.9033810+00:00","level":"INFO","logger":"Program","thread":"1","ndc":"(null)","message":"This is an info message"}
{"date":"2023-11-30T13:46:23.9363428+00:00","level":"WARN","logger":"Program","thread":"1","ndc":"(null)","message":"This is a warning message"}
```

### Log4net pros

- Easy to extend with plugins.
- Features dynamic configuration, allowing changes without needing to restart
  the application.
- Compatible with a wide range of frameworks, including .NET Framework 1+, Mono
  1+, and others, ensuring broad application.
- Known for its maturity and stability.

### Log4net cons

- Configuration processes can be complex and daunting, particularly for new
  users.
- Finding .NET Core specific documentation can be challenging, complicating its
  implementation for modern applications.
- The .NET Core implementation of Log4net is missing several features like
  colored console outputs, stack trace patterns, and others, as detailed
- Encounters compatibility issues with Linux due to
  [kernel calls in the Log4net codebase](https://issues.apache.org/jira/browse/LOG4NET-658),
  leading to potential operational problems.
- Updates for Log4net are infrequent, with the
  [last major version released on NuGet in 2022](https://www.nuget.org/packages/log4net/#versions-body-tab),
  raising concerns about its ongoing maintenance and support.

**Learn more**: [How To Start Logging With Log4net
](https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4net/)

## 5. ZLogger

![Screenshot of ZLogger Github homepage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/692c42e2-e871-45ae-ae77-c3b9ca3ed800/public
=1200x600)

### ZLogger Overview

[ZLogger](https://github.com/Cysharp/ZLogger) is a modern, zero-allocation
text/structured logger for .NET and Unity, enhancing
`Microsoft.Extensions.Logging`. It achieves high performance and minimal
overhead by using
[string interpolation](https://devblogs.microsoft.com/dotnet/string-interpolation-in-c-10-and-net-6/)
and
[IUtf8SpanFormattable](https://learn.microsoft.com/en-us/dotnet/api/system.iutf8spanformattable?view=net-8.0)
for UTF8 output, unlike typical UTF16-based loggers.

It supports various output destinations like `File`, `RollingFile`, `InMemory`,
`Console`, `Stream`, and an `AsyncBatchingProcessor`.

Getting started with ZLogger is quite straightforward:

```csharp
using Microsoft.Extensions.Logging;
using ZLogger;

using var factory = LoggerFactory.Create(logging =>
{
    logging.SetMinimumLevel(LogLevel.Trace);

    // Output Structured Logging, setup options
    logging.AddZLoggerConsole(options => options.UseJsonFormatter());
});


var logger = factory.CreateLogger("Program");
var userName = "AliceSmith";
var action = "login";

// Use **Log** method and string interpolation to log a user login message
logger.LogInformation($"User '{userName}' just performed a '{action}' action.");
```

When run, it yields an output similar to this:

```text
[output]
{"Timestamp":"2024-01-07T19:07:01.5530174+00:00","LogLevel":"Information","Category":"Program","Message":"User \u0027AliceSmith\u0027 just performed a \u0027login\u0027 action.","{OriginalFormat}":"User \u0027AliceSmith\u0027 just performed a \u0027login\u0027 action."}
```

### ZLogger pros

- Offers high performance through the zero-allocation approach.
- Specifically designed to support the latest .NET features.
- Simplifies structured logging setup without the need for extensive
  configurations.
- Customization is straightforward and can be done directly in the code.
- Provides seamless integration support for Unity.

### ZLogger cons

- Lacks a variety of log forwarding destinations compared to Serilog and NLog.
- As a newer tool, ZLogger has a smaller community, which may pose challenges in
  finding support and resources.

[summary]

## Side note: Visualize your .NET logs so patterns jump out instantly

Once your app is logging with Serilog, NLog, or Log4net, [Better Stack](https://betterstack.com/logs) helps you turn those events into dashboards so you can spot error spikes, warning trends, and noisy endpoints without manually digging through log streams.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Final thoughts

In this article, we've explored several .NET logging frameworks. If you're
uncertain about which to choose, we suggest starting with
Microsoft.Extensions.Logging. It offers abstractions over other logging systems,
allowing for easy switching as your project evolves. Depending on your specific
needs, consider pairing it with a more comprehensive framework like Serilog or
NLog for enhanced logging capabilities.

Thanks for reading, and happy logging!