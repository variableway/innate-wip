# How To Start Logging With NLog

NLog is a logging framework for .NET. It has rich log routing and management
capabilities and greatly helps you to produce and manage logs. NLog supports
structured logs, multiple logging targets, and everything a modern logging
framework should support. In the long list of the NLog's features, you can find:

- [Custom formatting layout](https://github.com/nlog/nlog/wiki/How-to-write-a-custom-layout-renderer)
- [Support of structured logging](https://github.com/nlog/nlog/wiki/How-to-use-structured-logging),
  that allows them to be treated as data sets rather than text
- [Compatibility](https://github.com/NLog/NLog/wiki/AsyncWrapper-target) with
  asynchronous applications and systems.
- Multiple logging targets, such as
  [files](https://github.com/nlog/nlog/wiki/File-target),
  [console](https://github.com/nlog/nlog/wiki/Console-target),
  [console](https://github.com/serilog/serilog-sinks-console),
  [email](https://github.com/NLog/NLog/wiki/Mail-target), and
  [many other outputs](https://nlog-project.org/config/?tab=targets).
- [Message templates](https://messagetemplates.org/), that helps you to
  serialize objects using the `@` operator

NLog is useful in the simplest small applications as well as in large and
complex ones. Due to its rich configuration abilities, you can use it in all
your projects.

In the tutorial you will learn how to:

- Create a Console Application project in Visual Studio.
- Install NLog and its dependencies.
- Create and configure the NLog logger.
- Integrate the logger into the C# Console Application.

[summary]
## Side note: Centralize your logs with Better Stack

Head over to [Better Stack](https://betterstack.com/log-management) and start shipping your NLog logs in minutes with our native .NET integration.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Prerequisites

You will need:

- Windows 10 installed.
- Visual Studio installed.

[ad-logs]

## Step 1 — Creating a Project

To get started, you need to create a new project. You can do it in several ways
in Visual Studio. The first one is to select **Create a new project** in Visual
Studio start window.

If the Visual Studio IDE is already open, you can follow the path on the top
menu bar **File > New > Project **and create a new project this way.

The last way we are going to show you is to use the shortcut:
`Ctrl + Shift + N`.

## Step 2 — Installing Dependencies

Before starting to work on the application, you need to install some dependency
packages. Visual Studio provides multiple ways to use the NuGet Package Manager.
In the tutorial we will use the Package Manager Console.

The first thing you have to do is to open the Package Manager Console. You can
do it using **Tools > NuGet Package Manager > Package Manager Console**.
Alternatively, you can sequentially press `ALT`, `V`, `E`, and `O`.

In the console that opens, run the following commands one by one.

    Install-Package NLog.Extensions.Logging

The `NLog.Extensions.Logging` package is the root package of NLog.

## Step 3 — Creating a Logger

For the application, we are going to use the simplest way to create a logger in
NLog — the `LogManager` class. It provides the `GetCurrentClassLogger` method to
get a unique logger per each class. Unlike the globally configured logger, the
logger per class helps you to easily capture the source of the log message.

The logger will use NLog's default log levels system. The system consists of the
following 6 levels:

- **Fatal** — used for reporting about errors that are forcing shutdown of the
  application.
- **Error** — used for logging serious problems occurring during execution of
  the program.
- **Warn**  — used for reporting non-critical unusual behaviour.
- **Info** — used for informative messages highlighting the progress of the
  application for sysadmins and end users.
- **Debug** — used for debugging messages with extended information about
  application processing.
- **Trace** — the noisiest level, used for tracing the code

Let's start coding. Your `Program.cs` file should look like the code snippet
below.

    Program.cs
    using NLog;
    using System;

    namespace NLogAdvanced
    {
        class Program
        {
            // create a static logger field
            private static Logger logger = LogManager.GetCurrentClassLogger();

            static void Main(string[] args)
            {

            }
        }
    }

## Step 4 — Configuring the Logger

NLog has rich configuration abilities and provides two ways to configure the
logger: programmatically or via a configuration file. You can get advanced
information about each of them
[in the documentation](https://nlog-project.org/config/).

In this tutorial we're going to configure the logger using the `nlog.config`
file.

The first thing we need to do is to create a `nlog.config` file in the root of
the application. You can do it by pressing `CRTL + SHIFT + A` and entering the
`nlog.config` name in the opened window.

Then, you have to set the file's **Copy to Output Directory** property to **Copy
always**. It can be done by right-clicking the file in the solution explorer and
selecting the Properties option.

The config file must look like that:

    nlog.config
    <?xml version="1.0" encoding="utf-8" ?>
    <!-- XSD manual extracted from package NLog.Schema: https://www.nuget.org/packages/NLog.Schema-->
    <nlog xmlns="http://www.nlog-project.org/schemas/NLog.xsd" xsi:schemaLocation="NLog NLog.xsd"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          autoReload="true"
          internalLogFile="c:\\logs\\console-example-internal.log"
          internalLogLevel="Info">
    </nlog>

Now, let's write a config. The config is written in the XML language. If you are
not familiar with the XML language, you may dive
[in the great XML tutorial by w3school](https://www.w3schools.com/xml/default.asp).

In our case the config consists of two parts: setting up the logging targets and
setting up the logging rules.

We've decided to add 3 logging targets for the application: the colorized
console and 2 files. In the config file, each of them will be represented by a
separate XML element. Let's write the targets in the `nlog.config` file.

    nlog.config
    <?xml version="1.0" encoding="utf-8" ?>
    <!-- XSD manual extracted from package NLog.Schema: https://www.nuget.org/packages/NLog.Schema-->
    <nlog xmlns="http://www.nlog-project.org/schemas/NLog.xsd" xsi:schemaLocation="NLog NLog.xsd"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          autoReload="true"
          internalLogFile="c:\\logs\\console-example-internal.log"
          internalLogLevel="Info">

      <!-- the targets to write to -->
      <targets>
        <!-- write logs to the files -->
        <target xsi:type="File" name="all_logs_file" fileName="c:\\logs\\all.log"/>
        <target xsi:type="File" name="important_logs_file" fileName="c:\\logs\\important.log"/>
        <!-- write logs to the console-->
        <target xsi:type="ColoredConsole" name="logconsole" />
      </targets>
    </nlog>

After that, we can create the rules. In NLog, each rule can be applied to
multiple loggers and targets and must be written as a separate XML element.

The first rule enforces all loggers to write all logs generated by the
application to the colorized console.

The second rule enforces all loggers to write logs with debug and higher
severity logs to the target named `all_logs_file`.

The third rule enforces all loggers to write warnings and higher severity logs
to the target named `important_logs_file`.

    nlog.config
    <?xml version="1.0" encoding="utf-8" ?>
    <!-- XSD manual extracted from package NLog.Schema: https://www.nuget.org/packages/NLog.Schema-->
    <nlog xmlns="http://www.nlog-project.org/schemas/NLog.xsd" xsi:schemaLocation="NLog NLog.xsd"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          autoReload="true"
          internalLogFile="c:\\logs\\console-example-internal.log"
          internalLogLevel="Info">

      <!-- the targets to write to -->
      <targets>
        <!-- write logs to the files -->
        <target xsi:type="File" name="all_logs_file" fileName="c:\\logs\\all.log"/>
        <target xsi:type="File" name="important_logs_file" fileName="c:\\logs\\important.log"/>
        <!-- write logs to the console-->
        <target xsi:type="ColoredConsole" name="logconsole" />
      </targets>

      <!-- rules to map from logger name to target -->
      <rules>
        <logger name="*" minlevel="Trace" writeTo="logconsole" />
        <logger name="*" minlevel="Debug" writeTo="all_logs_file" />
        <logger name="*" minlevel="Warn" writeTo="important_logs_file" />
      </rules>
    </nlog>

## Step 5 — Creating Extra Classes

We're going to use 2 extra classes. To create a new file for a class, you can
press `CRTL + SHIFT + A` and select C# class in the window that opens.

The first file will contain a `Person` class. You can see its code in the
snippet below.

    Person.cs
    using System;
    using NLog;

    namespace NLogAdvanced
    {
        class Person
        {
            // create a static logger field
            private static Logger logger = LogManager.GetCurrentClassLogger();

            public string Name { get; set; }
            public string LastName { get; set; }

            public Person(string name, string lastName)
            {

                Name = name;
                LastName = lastName;

                logger.Info("Created a person {@person} at {now}", this, DateTime.Now);
            }
        }
    }

The second file will contain a `Car` class. You can see its code in the snippet
below.

    Car.cs
    using System;
    using NLog;

    namespace NLogAdvanced
    {
        class Car
        {
            // create a static logger field
            private static Logger logger = LogManager.GetCurrentClassLogger();

            public string Model { get; set; }
            public int YearReleased { get; set; }
            public Person Owner { get; set; }

            public Car(string model, int yearReleased, Person owner)
            {
                Model = model;
                YearReleased = yearReleased;
                Owner = owner;

                logger.Debug("Created a car {@car} at {now}", this, DateTime.Now);
            }
        }
    }

With `@` — _destructuring operator_ we can break objects down into properties
with values.

## Step 6 — Logging

To demonstrate how the logger works, we will log some simple messages, at least
one of each level. It's a pretty straightforward task, because of the clear NLog
API.

More specifically, NLog logger provides 6 methods for logging: `Trace`, `Debug`,
`Info`, `Warn`, `Error`, and `Fatal`.

    Program.cs
    using NLog;
    using System;

    namespace NLogAdvanced
    {
        class Program
        {
            // create a static logger field
            private static Logger logger = LogManager.GetCurrentClassLogger();

            static void Main(string[] args)
            {
                // create 2 persons
                var person1 = new Person("Jonh", "Gold");
                var person2 = new Person("James", "Miller");
                // create 2 cars
                var car1 = new Car("Tesla Model S", 2020, person1);
                var car2 = new Car("Tesla Model X", 2020, person2);
                // logging
                logger.Trace("Some verbose log");
                logger.Debug("Some debug log");
                logger.Info("Person1: {@person}", person1);
                logger.Info("Car2: {@car}", car2);
                logger.Warn("Warning accrued at {now}", DateTime.Now);
                logger.Error("Error accrued at {now}", DateTime.Now);
                logger.Fatal("Serious problem with car {@car} accrued at {now}", car1, DateTime.Now);
            }
        }
    }

Now, let's build and run the program. You can simply do this by pressing
`CTRL + F5`.

After the execution, your console's output should look like:

    Output
    2021-05-27 00:17:51.1315|INFO|NLogAdvanced.Person|Created a person {"Name":"Jonh", "LastName":"Gold"} at 5/27/2021 12:17:51 AM
    2021-05-27 00:17:51.5391|INFO|NLogAdvanced.Person|Created a person {"Name":"James", "LastName":"Miller"} at 5/27/2021 12:17:51 AM
    2021-05-27 00:17:51.9188|DEBUG|NLogAdvanced.Car|Created a car {"Model":"Tesla Model S", "YearReleased":2020, "Owner":{"Name":"Jonh", "LastName":"Gold"}} at 5/27/2021 12:17:51 AM
    2021-05-27 00:17:51.9433|DEBUG|NLogAdvanced.Car|Created a car {"Model":"Tesla Model X", "YearReleased":2020, "Owner":{"Name":"James", "LastName":"Miller"}} at 5/27/2021 12:17:51 AM
    2021-05-27 00:17:51.9645|TRACE|NLogAdvanced.Program|Some verbose log
    2021-05-27 00:17:51.9809|DEBUG|NLogAdvanced.Program|Some debug log
    2021-05-27 00:17:51.9809|INFO|NLogAdvanced.Program|Person1: {"Name":"Jonh", "LastName":"Gold"}
    2021-05-27 00:17:51.9809|INFO|NLogAdvanced.Program|Car2: {"Model":"Tesla Model X", "YearReleased":2020, "Owner":{"Name":"James", "LastName":"Miller"}}
    2021-05-27 00:17:52.0096|WARN|NLogAdvanced.Program|Warning accrued at 5/27/2021 12:17:51 AM
    2021-05-27 00:17:52.0493|ERROR|NLogAdvanced.Program|Error accrued at 5/27/2021 12:17:52 AM
    2021-05-27 00:17:52.0781|FATAL|NLogAdvanced.Program|Serious problem with car {"Model":"Tesla Model S", "YearReleased":2020, "Owner":{"Name":"Jonh", "LastName":"Gold"}} accrued at 5/27/2021 12:17:52 AM

Now, let's check the logs written in the files. The files are located in the
`C:\\logs`.

The first, check your `important.json` file, it should look like.

    Output
    2021-05-27 00:17:52.0096|WARN|NLogAdvanced.Program|Warning accrued at 5/27/2021 12:17:51 AM
    2021-05-27 00:17:52.0493|ERROR|NLogAdvanced.Program|Error accrued at 5/27/2021 12:17:52 AM
    2021-05-27 00:17:52.0781|FATAL|NLogAdvanced.Program|Serious problem with car {"Model":"Tesla Model S", "YearReleased":2020, "Owner":{"Name":"Jonh", "LastName":"Gold"}} accrued at 5/27/2021 12:17:52 AM0

The second, check your `all.json` file, it should look like.

    Output
    2021-05-27 00:17:51.1315|INFO|NLogAdvanced.Person|Created a person {"Name":"Jonh", "LastName":"Gold"} at 5/27/2021 12:17:51 AM
    2021-05-27 00:17:51.5391|INFO|NLogAdvanced.Person|Created a person {"Name":"James", "LastName":"Miller"} at 5/27/2021 12:17:51 AM
    2021-05-27 00:17:51.9188|DEBUG|NLogAdvanced.Car|Created a car {"Model":"Tesla Model S", "YearReleased":2020, "Owner":{"Name":"Jonh", "LastName":"Gold"}} at 5/27/2021 12:17:51 AM
    2021-05-27 00:17:51.9433|DEBUG|NLogAdvanced.Car|Created a car {"Model":"Tesla Model X", "YearReleased":2020, "Owner":{"Name":"James", "LastName":"Miller"}} at 5/27/2021 12:17:51 AM
    2021-05-27 00:17:51.9809|DEBUG|NLogAdvanced.Program|Some debug log
    2021-05-27 00:17:51.9809|INFO|NLogAdvanced.Program|Person1: {"Name":"Jonh", "LastName":"Gold"}
    2021-05-27 00:17:51.9809|INFO|NLogAdvanced.Program|Car2: {"Model":"Tesla Model X", "YearReleased":2020, "Owner":{"Name":"James", "LastName":"Miller"}}
    2021-05-27 00:17:52.0096|WARN|NLogAdvanced.Program|Warning accrued at 5/27/2021 12:17:51 AM
    2021-05-27 00:17:52.0493|ERROR|NLogAdvanced.Program|Error accrued at 5/27/2021 12:17:52 AM
    2021-05-27 00:17:52.0781|FATAL|NLogAdvanced.Program|Serious problem with car {"Model":"Tesla Model S", "YearReleased":2020, "Owner":{"Name":"Jonh", "LastName":"Gold"}} accrued at 5/27/2021 12:17:52 AM


[summary]
## Side note: Visualize your .NET logs in dashboards

[Better Stack](https://betterstack.com/logs) transforms your NLog data into interactive dashboards that reveal patterns, track error rates, and help you spot issues before they escalate.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Conclusion

Proper logging can greatly assist in the support and development of your
application. This may seem like a daunting task, but NLog is a fast and
configurable logging framework that greatly simplifies the task.

In the tutorial, you have configured your logging system with multiple logging
targets for a .NET console application with NLog.

Now developing and maintaining your .NET applications will be much easier!