# How To Start Logging With Serilog

Serilog is an easy-to-set-up logging library for .NET with a clear API. In the
long list of the Serilog's features you can find:

- Support of structured logging, which allows logs to be treated as data sets
  rather than text.
- Compatibility with asynchronous applications and systems.
- Multiple logging targets, such as
  [files](https://github.com/serilog/serilog-sinks-file),
  [console](https://github.com/serilog/serilog-sinks-console),
  [email](https://github.com/serilog/serilog-sinks-email), and
  [many other outputs](https://github.com/serilog/serilog/wiki/Provided-Sinks).
- [Message templates](https://messagetemplates.org/), that helps you to
  serialize objects using the `@` operator

Serilog is useful in the simplest small applications as well as in large and
complex ones. Due to its rich configuration abilities, you can use it in all
your projects.

In this tutorial you will learn how to:

- Create a Console Application project in Visual Studio
- Install Serilog and its dependencies
- Create and configure the Serilog global logger
- Integrate the logger into the C# Console Application

## Prerequisites

You will need:

- Windows 10 installed.
- Visual Studio installed.


[summary]
### Centralize your logs with Better Stack

While Serilog handles structured logging in your application, [Better Stack](https://betterstack.com/log-management) provides centralized log management with live tailing, SQL and PromQL queries, automated anomaly detection, and incident management.


[Start free in minutes](https://betterstack.com/log-management)

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]
## Step 1 — Creating a Project

To get started, you need to create a new project. You can do it in several ways
in Visual Studio. The first one is to select **Create a new project** in Visual
Studio start window.

If the Visual Studio IDE is already open, you can follow the path on the top
menu bar **File > New > Project **and create a new project this way.

The last way is by using the shortcut: `Ctrl + Shift + N`.

## Step 2 — Installing Dependencies

Before starting to work on the application, you need to install some dependency
packages. Visual Studio provides multiple ways to use the NuGet Package Manager.
In the tutorial we will use the Package Manager Console.

The first thing you have to do is to open the Package Manager Console. You can
do it using **Tools > NuGet Package Manager > Package Manager Console**.
Alternatively, you can sequentially press `ALT`, `V`, `E`, and `O`.

In the console that opens, run the following commands one by one.

    Install-Package Serilog

    Install-Package Serilog.Sinks.Console

    Install-Package Serilog.Sinks.File

The `Serilog` package contains the types. While the `Serilog.Sinks` namespace
includes logging providers, such as Console, Debug, File, HTTP, and others.

## Step 3 — Creating a Logger

Now, you are ready to create a logger with the basic configuration.

For the application, we're going to use the Serilog's levels system. The system
consists of the 6 levels:

- **Fatal** — used for reporting about errors that are forcing shutdown of the
  application.
- **Error** — used for logging serious problems occurred during execution of the
  program.
- **Warning**  — used for reporting non-critical unusual behavior.
- **Information** — used for informative messages highlighting the progress of
  the application for sysadmin and end user.
- **Debug** — used for debugging messages with extended information about
  application processing.
- **Verbose** — the noisiest level, used for tracing the code.

Default level, if no minimum level is specified, is the information level.

Creating a logger in Serilog is pretty straightforward. You can get the working
logger in a few lines.

The following code should be written in the `Program.cs` file:

    Program.cs
    using System;
    using Serilog;

    namespace SerilogAdvanced
    {
        class Program
        {
            static void Main(string[] args)
            {
                Log.Logger = new LoggerConfiguration()
                                // add console as logging target
                                .WriteTo.Console()
                                // set default minimum level
                                .MinimumLevel.Debug()
                                .CreateLogger();
            }
        }
    }

## Step 4 — Configuring the Logger

Serilog has rich configuration abilities and provides 2 ways how to configure
the logger: programmatically or via a configuration file. You can get advanced
information about each of them
[in the documentation](https://github.com/serilog/serilog/wiki/Configuration-Basics).

In the tutorial we're going to configure the logger programmatically. We've
decided to add 2 extra logging targets for the application.

The first logging target is a file for warnings and higher severity logs
structured in JSON. Serilog has a built-in JSON formatter which we are going to
use in the logger.

The second logging target is a rolling file for all logs. A rolling file is a
file used for a certain amount of time. After the rolling interval will pass,
the program will automatically create a new file with a date stamp of the
creation in the name.

    Program.cs
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
                Log.Logger = new LoggerConfiguration()
                                // add console as logging target
                                .WriteTo.Console()
                                // add a logging target for warnings and higher severity  logs
                                // structured in JSON format
                                .WriteTo.File(new JsonFormatter(),
                                              "important.json",
                                              restrictedToMinimumLevel: LogEventLevel.Warning)
                                // add a rolling file for all logs
                                .WriteTo.File("all-.logs",
                                              rollingInterval: RollingInterval.Day)
                                // set default minimum level
                                .MinimumLevel.Debug()
                                .CreateLogger();
    	}
        }
    }

## Step 5 — Creating Extra Classes

We're going to use 2 extra classes. To create a new file for a class, you can
press `CRTL + SHIFT + A` and select C# class in the window that opens.

The first file will contain a `Person` class. You can see its code in the
snippet below.

    Person.cs
    using Serilog;
    using System;

    namespace SerilogAdvanced
    {
        class Person
        {
            public string Name { get; set; }
            public string LastName { get; set; }

            public Person(string name, string lastName)
            {
                Name = name;
                LastName = lastName;

                Log.Debug("Created a person {@person} at {now}", this, DateTime.Now);
            }
        }
    }

The second file will contain a `Car` class. You can see its code in the snippet
below.

    Car.cs
    using System;
    using Serilog;

    namespace SerilogAdvanced
    {
        class Car
        {
            public string Model { get; set; }
            public int YearReleased { get; set; }
            public Person Owner { get; set; }

            public Car(string model, int yearReleased, Person owner)
            {
                Model = model;
                YearReleased = yearReleased;
                Owner= owner;

                Log.Debug("Created a car {@person} at {now}", this, DateTime.Now);
            }
        }
    }

Also, if you'd like to reduce the byte count of the log events, you may prefer
the `CompactJsonFormatter` instead of the Serilog's default  `JsonFormatter`.

## Step 6 — Logging

To demonstrate how the logger works, we will log some simple messages.

    Program.cs
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
                Log.Logger = new LoggerConfiguration()
                                // add console as logging target
                                .WriteTo.Console()
                                // add a logging target for warnings and higher severity  logs
                                // structured in JSON format
                                .WriteTo.File(new JsonFormatter(), "important.json")
                                // add a rolling file for all logs
                                .WriteTo.File("all.logs",
                                              restrictedToMinimumLevel: LogEventLevel.Warning,
                                              rollingInterval: RollingInterval.Day)
                                // set default minimum level
                                .MinimumLevel.Debug()
                                .CreateLogger();

                // create 2 persons
                var person1 = new Person("Jonh", "Gold");
                var person2 = new Person("James", "Miller");
                // create 2 cars
                var car1 = new Car("Tesla Model S", 2020, person1);
                var car2 = new Car("Tesla Model X", 2020, person2);
    	    // logging
                Log.Verbose("Some verbose log");
                Log.Debug("Some debug log");
                Log.Information("Person1: {@person}", person1);
                Log.Information("Car2: {@car}", car2);
                Log.Warning("Warning accrued at {now}", DateTime.Now);
                Log.Error("Error accrued at {now}", DateTime.Now);
                Log.Fatal("Problem with car {@car} accrued at {now}", car1, DateTime.Now);
            }
        }
    }

Now, let's build and run the program. You can simply do this by pressing
`CTRL + F5`.

After the execution, your console's output should look like:

    Output
    [01:08:21 DBG] Created a person {"Name": "Jonh", "LastName": "Gold", "$type": "Person"} at 05/07/2021 01:08:21
    [01:08:21 DBG] Created a person {"Name": "James", "LastName": "Miller", "$type": "Person"} at 05/07/2021 01:08:21
    [01:08:21 DBG] Created a person {"Model": "Tesla Model S", "YearReleased": 2020, "Owner": {"Name": "Jonh", "LastName": "Gold", "$type": "Person"}, "$type": "Car"} at 05/07/2021 01:08:21
    [01:08:21 DBG] Created a person {"Model": "Tesla Model X", "YearReleased": 2020, "Owner": {"Name": "James", "LastName": "Miller", "$type": "Person"}, "$type": "Car"} at 05/07/2021 01:08:21
    [01:08:21 DBG] Some debug log
    [01:08:21 INF] Person1: {"Name": "Jonh", "LastName": "Gold", "$type": "Person"}
    [01:08:21 INF] Car2: {"Model": "Tesla Model X", "YearReleased": 2020, "Owner": {"Name": "James", "LastName": "Miller", "$type": "Person"}, "$type": "Car"}
    [01:08:21 WRN] Warning accrued at 05/07/2021 01:08:21
    [01:08:21 ERR] Error accrued at 05/07/2021 01:08:21
    [01:08:21 FTL] Problem with car {"Model": "Tesla Model S", "YearReleased": 2020, "Owner": {"Name": "Jonh", "LastName": "Gold", "$type": "Person"}, "$type": "Car"} accrued at 05/07/2021 01:08:21

Now, let's check the logs written in the files. The files are located in the
same folder as your executable. In our case it is
`C:\\Users\\username\\source\\repos\\SerilogAdvanced\\SerilogAdvanced\\bin\\Debug\\netcoreapp3.1`.

First, your `important.json` file should look like.

    important.json
    {"Timestamp":"2021-05-07T01:08:21.5384429+01:00","Level":"Warning","MessageTemplate":"Warning accrued at {now}","Properties":{"now":"2021-05-07T01:08:21.5380346+01:00"}}
    {"Timestamp":"2021-05-07T01:08:21.5778513+01:00","Level":"Error","MessageTemplate":"Error accrued at {now}","Properties":{"now":"2021-05-07T01:08:21.5777435+01:00"}}
    {"Timestamp":"2021-05-07T01:08:21.5801829+01:00","Level":"Fatal","MessageTemplate":"Problem with car {@car} accrued at {now}","Properties":{"car":{"_typeTag":"Car","Model":"Tesla Model S","YearReleased":2020,"Owner":{"_typeTag":"Person","Name":"Jonh","LastName":"Gold"}},"now":"2021-05-07T01:08:21.5799493+01:00"}}

Second, the file for all logs will contain the current date. In our case, this
is `all-20210507.logs`.

    all-20210507.logs
    2021-05-07 01:08:21.236 +01:00 [DBG] Created a person {"Name":"Jonh","LastName":"Gold","$type":"Person"} at "2021-05-07T01:08:21.2119367+01:00"
    2021-05-07 01:08:21.404 +01:00 [DBG] Created a person {"Name":"James","LastName":"Miller","$type":"Person"} at "2021-05-07T01:08:21.4044950+01:00"
    2021-05-07 01:08:21.431 +01:00 [DBG] Created a person {"Model":"Tesla Model S","YearReleased":2020,"Owner":{"Name":"Jonh","LastName":"Gold","$type":"Person"},"$type":"Car"} at "2021-05-07T01:08:21.4308327+01:00"
    2021-05-07 01:08:21.476 +01:00 [DBG] Created a person {"Model":"Tesla Model X","YearReleased":2020,"Owner":{"Name":"James","LastName":"Miller","$type":"Person"},"$type":"Car"} at "2021-05-07T01:08:21.4768049+01:00"
    2021-05-07 01:08:21.513 +01:00 [DBG] Some debug log
    2021-05-07 01:08:21.514 +01:00 [INF] Person1: {"Name":"Jonh","LastName":"Gold","$type":"Person"}
    2021-05-07 01:08:21.515 +01:00 [INF] Car2: {"Model":"Tesla Model X","YearReleased":2020,"Owner":{"Name":"James","LastName":"Miller","$type":"Person"},"$type":"Car"}
    2021-05-07 01:08:21.538 +01:00 [WRN] Warning accrued at "2021-05-07T01:08:21.5380346+01:00"
    2021-05-07 01:08:21.577 +01:00 [ERR] Error accrued at "2021-05-07T01:08:21.5777435+01:00"
    2021-05-07 01:08:21.580 +01:00 [FTL] Problem with car {"Model":"Tesla Model S","YearReleased":2020,"Owner":{"Name":"Jonh","LastName":"Gold","$type":"Person"},"$type":"Car"} accrued at "2021-05-07T01:08:21.5799493+01:00"


## Centralizing your .NET logs with Better Stack

Once you've configured Serilog in your .NET application, the next step is centralizing those logs for effective monitoring and analysis across all your services. [Better Stack](https://betterstack.com/log-management) provides OpenTelemetry-native log management.


Better Stack works seamlessly with Serilog's structured JSON output. You can continue logging to files and console with Serilog while using Better Stack's collector or log shippers like Vector to forward logs to centralized storage. This keeps your application code clean while enabling powerful querying with SQL, PromQL, or live tail filtering—all executing in sub-seconds even across terabytes of data.

![Better Stack log management dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)

**Live tail your .NET logs in real-time**

Monitor your Serilog output as it happens with Better Stack's live tail feature. Filter by log level, search for specific properties, or track errors across your .NET services instantly—perfect for debugging during development or monitoring production deployments.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

**Visualize your application health**

Better Stack automatically parses your Serilog properties and lets you create custom dashboards to visualize error rates, response times, and application metrics. Track trends over time, set up alerts on anomalies, and gain insights into your .NET application's behavior without writing complex queries.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


Getting started takes just minutes: sign up for a [free account](https://betterstack.com/log-management), configure Serilog to output JSON, and forward your logs using Better Stack's collector or your preferred log shipper.

## Final thoughts

Proper logging can greatly assist in the support and development of your
application. This may seem like a daunting task, but Serilog is a fast and
configurable logging framework that greatly simplifies the task.

In the tutorial, you have configured your logging system with multiple logging
targets for a .NET console application with Serilog.

Now developing and maintaining your .NET applications will be much easier!
