# How To Start Logging With Log4net

The log4net is a logging framework for .NET based on Apache log4j. It supports
multiple logging targets, structured output, logging hierarchy, and everything a
modern logging framework should support. In the long list of its features, you
can find:

- Custom formatting layout
- Support of structured logging, that allows them to be treated as data sets
  rather than text
- [Compatibility](https://www.nuget.org/packages/log4net.async/) with asynchronous
  applications and systems
- Multiple logging targets, such as files, console, console, email, and
  [many other outputs](https://logging.apache.org/log4net/log4net-1.2.12/release/sdk/log4net.Appender.html)

Log4net is useful in the simplest small applications as well as in large and
complex ones. Due to log4net's rich configuration abilities, you can use it in
all your projects.

Also, log4net has a
[great documentation](https://logging.apache.org/log4net/features.html),
a lot of related materials, and a large developer community.

In the tutorial you will learn how to:

- Create a Console Application project in Visual Studio.
- Install log4net and its dependencies.
- Create and configure the log4net logger with structured output.
- Integrate the logger into the C# Console Application.


## Prerequisites

You will need:

- Windows 10 installed.
- Visual Studio installed.

[ad-logs]

## Step 1 — Creating a project

To get started, you need to create a new project. You can do it in several ways
in Visual Studio. The first one is to select **Create a new project** in Visual
Studio start window.

If the Visual Studio IDE is already open, you can follow the path on the top
menu bar **File > New > Project **and create a new project this way.

The last way we are going to show you is to use the shortcut:
`Ctrl + Shift + N`.

## Step 2 — Installing Dependencies

Before starting work on the application, you need to install some dependency
packages. Visual Studio provides multiple ways to use the NuGet Package Manager.
In the tutorial we will use the Package Manager Console.

So, the first thing you have to do is to open the Package Manager Console. You
can do it using **Tools > NuGet Package Manager > Package Manager Console**.
Alternatively, you can sequentially  press `ALT`, `V`, `E`, and `O`.

In the console that opens, run the following commands one by one.

    Install-Package log4net

    Install-Package log4net.Ext.Json

The `log4net` package is the root package of log4net.

The `log4net.Ext.Json` package provides an easy-to-use JSON layout to your
application.


[summary]
## Side note: Ship your log4net logs to Better Stack

Once your .NET application starts generating logs with log4net, [Better Stack](https://betterstack.com/logs) gives you powerful querying, real-time search, and beautiful dashboards to monitor your applications in production.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Step 3 — Creating a Logger

Before creating the logger, you need to add the log4net assembly to your
project. Since the `Assembly.cs` file has been replaced by
`<project_name>.csproj`, you can simply add the assembly to your application's
entry point, the `Program.cs` file.

You can see an example in the code snippet below:

    Program.cs
    using System;

    [assembly: log4net.Config.XmlConfigurator(ConfigFile = "log4net.config")]

    namespace log4netAdvanced
    {
        class Program
        {
            static void Main(string[] args)
            {
    		Console.WriteLine("Helo World!");
            }
        }
    }

At the moment, you are ready to create a logger. For the application, we are
going to use the simplest way to do it in log4net — the `LogManager` class. It
provides the `GetLogger` method to get a unique logger per each class. Unlike
the globally configured logger, the logger per class helps you to easily capture
the source of the log message.

The `GetLogger` method has many overloads. However, the most useful are the ones
accepting `string` or `Type` as the only parameter. You can manually specify a
class type or a string name for each logger. However, we are going to use the
recommended way, the built-in tools to identify the caller class.

The logger will use log4net's default log levels system. The system consists of
the 5 levels:

- **Fatal** — used for reporting about errors that are forcing shutdown of the
  application.
- **Error** — used for logging serious problems occurred during execution of the
  program.
- **Warn**  — used for reporting non-critical unusual behavior.
- **Info** — used for informative messages highlighting the progress of the
  application for sysadmin and end user.
- **Debug** — used for debugging messages with extended information about
  application processing.

Let's start coding. Your `Program.cs` file should look like the code snippet
below.

    Program.cs
    using System;

    [assembly: log4net.Config.XmlConfigurator(ConfigFile = "log4net.config")]

    namespace log4netAdvanced
    {
        class Program
        {
            private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

            static void Main(string[] args)
            {

            }
        }
    }}

## Step 4 — Configuring the Logger

Log4net has three main components: loggers, appenders, and layouts, and because
of that, it has rich configuration abilities. It provides two ways how to
configure the logging system: programmatically or via a configuration file. You
can get advanced information about each of them
[in the documentation](https://logging.apache.org/log4net/manual/configuration.html).

In the tutorial we're going to configure the logger using `log4net.config` file.

The first thing to do is to create a `log4net.config` file in the root of your
application. You can do it by pressing `CRTL + SHIFT + A` and entering the
`log4net.config` name in the opened window.

Then, you have to set the file's **Copy to Output Directory** property to **Copy
always**. It can be done by right-clicking the file in the solution explorer and
selecting the Properties option.

The config file must look like that:

    log4net.config
    <?xml version="1.0" encoding="utf-8" ?>
    <log4net>
        <root>
        </root>
    </log4net>

Now, let's write a config.The config is written in the XML language. If you are
not familiar with the XML language, you may dive
[in the great XML tutorial by w3school](https://www.w3schools.com/xml/default.asp).

In our case the config consists of 2 parts: setting up the root logger and
setting up the appenders.

We've decided to add 3 logging targets for the application: the console and 2
files. In the config file, each of them will be represented by a separate XML
element. Let's write the appenders in the `log4net.config` file.

The first appender writes all logs generated by the application to the console.

    log4net.config
    <?xml version="1.0" encoding="utf-8" ?>
    <log4net>
      <root>
      </root>

      <!--the console appender-->
      <appender name="console" type="log4net.Appender.ConsoleAppender">
        <!--specifying the displayed layout-->
        <layout type="log4net.Layout.PatternLayout">
          <conversionPattern value="%date %level %logger - %message%newline" />
        </layout>
      </appender>
    </log4net>

The second appender writes all logs generated by the application to the
`c:\\logs\\all.log` file.

    log4net.config
    <?xml version="1.0" encoding="utf-8" ?>
    <log4net>
      <root>
      </root>

      <!--the console appender-->
      <appender name="console" type="log4net.Appender.ConsoleAppender">
        <!--specifying the displayed layout-->
        <layout type="log4net.Layout.PatternLayout">
          <conversionPattern value="%date %level %logger - %message%newline" />
        </layout>
      </appender>

    <!--a file appender for all logs-->
      <appender name="all_logs_file" type="log4net.Appender.FileAppender">
        <!--specifying the file-->
        <file value="c:\\logs\\all.log" />
        <!--specifying the displayed layout-->
        <layout type="log4net.Layout.PatternLayout">
          <conversionPattern value="%date %level %logger - %message%newline" />
        </layout>
      </appender>
    </log4net>

The third appender writes warnings and higher severity logs structured in JSON
to the `c:\\logs\\important.log` file.

    log4net.config
    <?xml version="1.0" encoding="utf-8" ?>
    <log4net>
      <root>
      </root>

      <!--the console appender-->
      <appender name="console" type="log4net.Appender.ConsoleAppender">
        <!--specifying the displayed layout-->
        <layout type="log4net.Layout.PatternLayout">
          <conversionPattern value="%date %level %logger - %message%newline" />
        </layout>
      </appender>

    <!--a file appender for all logs-->
      <appender name="all_logs_file" type="log4net.Appender.FileAppender">
        <!--specifying the file-->
        <file value="c:\\logs\\all.log" />
        <!--specifying the displayed layout-->
        <layout type="log4net.Layout.PatternLayout">
          <conversionPattern value="%date %level %logger - %message%newline" />
        </layout>
      </appender>

    <!--a file appender for important logs structured in JSON-->
      <appender name="important_logs_file" type="log4net.Appender.FileAppender">
        <!--specifying the file-->
        <file value="c:\\logs\\important.log" />
        <!--filter the low-severity logs-->
        <filter type="log4net.Filter.LevelRangeFilter">
          <param name="LevelMin" value="WARN"/>
        </filter>
        <!--json formatted log4net logging-->
        <layout type="log4net.Layout.SerializedLayout, log4net.Ext.Json">
          <decorator type="log4net.Layout.Decorators.StandardTypesDecorator, log4net.Ext.Json" />
          <member value="date:date" />
          <member value="level:level" />
          <member value="logger:logger" />
          <member value="message:messageObject" />
          <member value="exception:exception" />
        </layout>
      </appender>
    </log4net>

After that, we can set up the root logger. We will send all logs to all
appenders.

    <log4net>
      <root>
        <!--sending all logs to all appenders-->
        <level value="ALL" />
        <appender-ref ref="console" />
        <appender-ref ref="all_logs_file" />
        <appender-ref ref="important_logs_file" />
      </root>

      <!--the console appender-->
      <appender name="console" type="log4net.Appender.ConsoleAppender">
        <!--specifying the displayed layout-->
        <layout type="log4net.Layout.PatternLayout">
          <conversionPattern value="%date %level %logger - %message%newline" />
        </layout>
      </appender>

      <!--a file appender for all logs-->
      <appender name="all_logs_file" type="log4net.Appender.FileAppender">
        <!--specifying the file-->
        <file value="c:\\logs\\all.log" />
        <!--specifying the displayed layout-->
        <layout type="log4net.Layout.PatternLayout">
          <conversionPattern value="%date %level %logger - %message%newline" />
        </layout>
      </appender>

      <!--a file appender for important logs structured in JSON-->
      <appender name="important_logs_file" type="log4net.Appender.FileAppender">
        <!--specifying the file-->
        <file value="c:\\logs\\important.log" />
        <!--filter the low-severity logs-->
        <filter type="log4net.Filter.LevelRangeFilter">
          <param name="LevelMin" value="WARN"/>
        </filter>
        <!--json formatted log4net logging-->
        <layout type="log4net.Layout.SerializedLayout, log4net.Ext.Json">
          <decorator type="log4net.Layout.Decorators.StandardTypesDecorator, log4net.Ext.Json" />
          <member value="date:date" />
          <member value="level:level" />
          <member value="logger:logger" />
          <member value="message:messageObject" />
          <member value="exception:exception" />
        </layout>
      </appender>
    </log4net>

## Step 5 — Creating Extra Classes

We're going to use 2 extra classes. To create a new file for a class, you can
press `CRTL + SHIFT + A` and select C# class in the window that opens.

The first file will contain a `Person` class. You can see its code in the
snippet below.

    Person.cs
    using System;
    using log4net;

    namespace log4netAdvanced
    {
        class Person
        {
            // create a static logger field
            private static ILog logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

            public string Name { get; set; }
            public string LastName { get; set; }

            public Person(string name, string lastName)
            {
                Name = name;
                LastName = lastName;

                logger.Info(String.Format("Created a person {0} at {1}", this, DateTime.Now));
            }

            public override string ToString() {
                return String.Format("[{0} {1}]", Name, LastName);
            }
        }
    }

The second file will contain a `Car` class. You can see its code in the snippet
below.

    Car.cs
    using System;
    using log4net;

    namespace log4netAdvanced
    {
        class Car
        {
            // create a static logger field
            private static ILog logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

            public string Model { get; set; }
            public int YearReleased { get; set; }
            public Person Owner { get; set; }

            public Car(string model, int yearReleased, Person owner)
            {
                Model = model;
                YearReleased = yearReleased;
                Owner = owner;

                logger.Debug(String.Format("Created a car {0} at {1}", this, DateTime.Now));
            }

            public override string ToString()
            {
                return String.Format("[{0} ({1}), owned by {2}]", Model, YearReleased, Owner);
            }
        }
    }

Unlike Serilog and NLog, log4net doesn't support `@` — the _destructing
operator_, so we've decided to create a custom string representation for each
class. Also, we have to pass an already formatted string into the logger's
methods.

If you are interested in the JSON-like serialization of the objects, you should
use [the Newton.Json package](https://www.nuget.org/packages/Newtonsoft.Json/),
more specifically, the `JsonConvert.SerializeObject` method.

## Step 6 — Logging

To demonstrate how the logger works, we will log some simple messages, at least
one of each level. It's a pretty straightforward task, because of the clear
log4net API.

More specifically, log4net logger provides 5 methods for logging: `Debug`,
`Info`, `Warn`, `Error`, and `Fatal`.

    Program.cs
    using System;

    [assembly: log4net.Config.XmlConfigurator(ConfigFile = "log4net.config")]

    namespace log4netAdvanced
    {
        class Program
        {
            private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

            static void Main(string[] args)
            {
                // create 2 persons
                var person1 = new Person("Jonh", "Gold");
                var person2 = new Person("James", "Miller");
                // create 2 cars
                var car1 = new Car("Tesla Model S", 2020, person1);
                var car2 = new Car("Tesla Model X", 2020, person2);
                // logging
                logger.Debug("Some debug log");
                logger.Info(String.Format("Person1: {0}", person1));
                logger.Info(String.Format("Car2: {0}", car2));
                logger.Warn(String.Format("Warning accrued at {0}", DateTime.Now));
                logger.Error(String.Format("Error accrued at {0}", DateTime.Now));
                logger.Fatal(String.Format("Serious problem with car {0} accrued at {1}", car1, DateTime.Now));
            }
        }
    }

Now, let's build and run the program. You can simply do this by pressing
`CTRL + F5`.

After the execution, your console's output should look like:

    Output
    2021-05-27 05:21:41,857 INFO log4netAdvanced.Person - Created a person [Jonh Gold] at 5/27/2021 5:21:41 AM
    2021-05-27 05:21:41,883 INFO log4netAdvanced.Person - Created a person [James Miller] at 5/27/2021 5:21:41 AM
    2021-05-27 05:21:41,884 DEBUG log4netAdvanced.Car - Created a car [Tesla Model S (2020), owned by [Jonh Gold]] at 5/27/2021 5:21:41 AM
    2021-05-27 05:21:41,885 DEBUG log4netAdvanced.Car - Created a car [Tesla Model X (2020), owned by [James Miller]] at 5/27/2021 5:21:41 AM
    2021-05-27 05:21:41,885 DEBUG log4netAdvanced.Program - Some debug log
    2021-05-27 05:21:41,885 INFO log4netAdvanced.Program - Person1: [Jonh Gold]
    2021-05-27 05:21:41,885 INFO log4netAdvanced.Program - Car2: [Tesla Model X (2020), owned by [James Miller]]
    2021-05-27 05:21:41,886 WARN log4netAdvanced.Program - Warning accrued at 5/27/2021 5:21:41 AM
    2021-05-27 05:21:41,917 ERROR log4netAdvanced.Program - Error accrued at 5/27/2021 5:21:41 AM
    2021-05-27 05:21:41,917 FATAL log4netAdvanced.Program - Serious problem with car [Tesla Model S (2020), owned by [Jonh Gold]] accrued at 5/27/2021 5:21:41 AM

Now, let's check the logs written in the files. The files are located in the
`C:\\logs`.

The first, check your `important.json` file, it should look like that:

    Output
    {"date":"2021-05-27T05:21:41.8863086+03:00","level":"WARN","logger":"log4netAdvanced.Program","message":"Warning accrued at 5/27/2021 5:21:41 AM"}
    {"date":"2021-05-27T05:21:41.9174374+03:00","level":"ERROR","logger":"log4netAdvanced.Program","message":"Error accrued at 5/27/2021 5:21:41 AM"}
    {"date":"2021-05-27T05:21:41.9178429+03:00","level":"FATAL","logger":"log4netAdvanced.Program","message":"Serious problem with car [Tesla Model S (2020), owned by [Jonh Gold]] accrued at 5/27/2021 5:21:41 AM"}

The second, check your `all.json` file, it should look like that:

    Output
    2021-05-27 05:21:41,857 INFO log4netAdvanced.Person - Created a person [Jonh Gold] at 5/27/2021 5:21:41 AM
    2021-05-27 05:21:41,883 INFO log4netAdvanced.Person - Created a person [James Miller] at 5/27/2021 5:21:41 AM
    2021-05-27 05:21:41,884 DEBUG log4netAdvanced.Car - Created a car [Tesla Model S (2020), owned by [Jonh Gold]] at 5/27/2021 5:21:41 AM
    2021-05-27 05:21:41,885 DEBUG log4netAdvanced.Car - Created a car [Tesla Model X (2020), owned by [James Miller]] at 5/27/2021 5:21:41 AM
    2021-05-27 05:21:41,885 DEBUG log4netAdvanced.Program - Some debug log
    2021-05-27 05:21:41,885 INFO log4netAdvanced.Program - Person1: [Jonh Gold]
    2021-05-27 05:21:41,885 INFO log4netAdvanced.Program - Car2: [Tesla Model X (2020), owned by [James Miller]]
    2021-05-27 05:21:41,886 WARN log4netAdvanced.Program - Warning accrued at 5/27/2021 5:21:41 AM
    2021-05-27 05:21:41,917 ERROR log4netAdvanced.Program - Error accrued at 5/27/2021 5:21:41 AM
    2021-05-27 05:21:41,917 FATAL log4netAdvanced.Program - Serious problem with car [Tesla Model S (2020), owned by [Jonh Gold]] accrued at 5/27/2021 5:21:41 AM

[summary]
## Side note: Visualize your log4net output across all environments

Your console and file appenders generate valuable logs, but finding specific events across `all.log` and `important.log` files becomes painful at scale. [Better Stack](https://betterstack.com/logs) transforms your log4net output into actionable insights with live tail, powerful filters, and custom dashboards.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Final thoughts

Proper logging can greatly assist in the support and development of your
application. This may seem like a daunting task, but log4net is a fast and
configurable logging framework that greatly simplifies the task.

In the tutorial, you have configured your logging system with multiple logging
targets for a .NET console application with log4net.

Now developing and maintaining your .NET applications will be much easier!
