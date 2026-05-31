# Get Started with Job Scheduling in PHP

Task scheduling is a commonly used technique for automating tasks based on a
schedule. Such tasks may include backing up databases, processing a queue, or
creating system usage reports, as they are required to be repeated regularly
over time, or even indefinitely. It is better to schedule such tasks and monitor
them so they can run predictably in a timely fashion.

Many programming languages offer their own task scheduling solution, and in this
tutorial, we will discuss how to create scheduled jobs using PHP. We will also
discuss a monitoring solution to help you keep tabs on your scheduled tasks and
promptly notify you if something goes wrong.

![betteruptime-product.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d33c19b0-5850-4648-2f74-62b763bab800/orig =1637x842)

[summary]
### 🔭 Want to get alerted when your PHP scheduled tasks stop working?
Head over to [Better Uptime](https://betterstack.com/better-uptime/) start monitoring your jobs in 2 minutes
[/summary]

## Prerequisites

Before going through the rest of this article, ensure that you are using a Linux
machine with the `cron` installed. You also need the latest versions of
[PHP](https://www.php.net) and [Composer](https://getcomposer.org) installed.

## Getting started with PHP Cron scheduler

In this tutorial, we will utilize the
[php-cron-scheduler](https://github.com/peppeocchi/php-cron-scheduler) package
to implement task scheduling in PHP. It is a framework-agnostic package that can
be integrated into any project or run as a standalone job scheduler.

You can go ahead and install this package in a new `phpCronDemo` directory using
the commands below:

```command
mkdir phpCronDemo && cd phpCronDemo
```

```command
composer require peppeocchi/php-cron-scheduler
```

```text
[output]
Using version ^4.0 for peppeocchi/php-cron-scheduler
./composer.json has been created
Running composer update peppeocchi/php-cron-scheduler
. . .
 - Installing dragonmantank/cron-expression (v3.3.2): Extracting archive
 [highlight]
 - Installing peppeocchi/php-cron-scheduler (v4.0): Extracting archive
 [/highlight]
1 package suggestions were added by new dependencies, use `composer suggest` to see details.
Generating autoload files
1 package you are using is looking for funding.
Use the `composer fund` command to find out more!
```

Once the package is successfully installed, a `vendor` directory should be
present in the working directory. This directory should contain an
`autoload.php` file that will be used to import the installed packages into our
program.

Create a `scheduler.php` file at the root of your working directory and open it
in your text editor. It will serve as the starting point for all scheduled jobs
in this tutorial.

```command
nano scheduler.php
```

Add the following code to the file:

```php
[label scheduler.php]
<?php require_once __DIR__ . '/vendor/autoload.php';

use GO\Scheduler;

// Create a new scheduler
$scheduler = new Scheduler();

// Schedule jobs

// Run the scheduler
$scheduler->run();
```

First, you need to tell PHP where the `autoload.php` file is located and then
import the `Scheduler` class from the installed package. Next, create a new
instance of `Scheduler` and run it using the `run()` method. The scheduler
configuration is omitted for now, but it will be added in the next section.

Before this scheduler can start working, you must activate it by setting up a
Cron Job that executes the `scheduler.php` script every minute. Open your
`crontab` with the following command:

```command
crontab -e
```

Add the following line to the end of the file:

```text
* * * * * php <absolute_path>/scheduler.php
```

This Cron Job activates the scheduler by executing the script every minute so
that the scheduler can evaluate your scheduled tasks and run the ones that are
due. In the next section, you will define your first scheduled task and see it
in action.

## Scheduling your first job

After you've created and activated your scheduler, you can start scheduling
jobs. The `php-cron-scheduler` package offers three methods for this purpose,
depending on what type of job you wish to schedule. For example, the `raw()`
method is used to schedule the execution of a Linux command like this:

```php
[label scheduler.php]
. . .

$scheduler = new Scheduler();

[highlight]
$scheduler->raw(
  "curl https://en.wikipedia.org/wiki/Main_Page -o wikipedia.html"
);
[/highlight]

$scheduler->run();
```

This particular example will schedule a `curl` command which downloads the
Wikipedia homepage to an HTML file in the current directory.

At this point, you've defined the task to be scheduled. Next you need to define
how often it should be executed. Let's make the job run every minute for
example:

```php
[label scheduler.php]
. . .

$scheduler = new Scheduler();

$scheduler
  ->raw("curl https://en.wikipedia.org/wiki/Main_Page -o wikipedia.html")
  [highlight]
  ->everyMinute();
  [/highlight]

$scheduler->run();
```

Using the `everyMinute()` method ensures that the scheduled task is executed
every minute. Once you save the `scheduler.php` file, wait for a minute, and you
should observe the creation of the `wikipedia.html` file. View the contents of
the file with the following command to confirm that it is working as expected:

```command
cat wikipedia.html
```

```text
[output]
<!DOCTYPE html>
<html class="client-nojs" lang="en" dir="ltr">
<head>
<meta charset="UTF-8"/>
<title>Wikipedia, the free encyclopedia</title>
. . .
</html>
```

## Scheduling PHP scripts and functions

You can also schedule PHP functions or scripts using the `php-cron-scheduler`
package as shown below. Note that functions always run in the foreground, while
scripts run in the background by default.

Here's how to schedule a PHP function using the `call()` method:

```php
$scheduler->call(
  function ($args) {
    return $args["user"];
  },
  [["user" => $user]],
  "myCustomIdentifier"
);
```

The `call()` method takes three parameters:

1. The function to be scheduled,
2. The arguments to be passed to the function,
3. An optional identifier.

On the other hand, the `php()` method is used to schedule PHP scripts as shown
below:

```php
$scheduler->php(
  "script.php", // The script to execute
  "php", // The path to the PHP binary that is used to execute the script
  [
    "username" => "jack",
    "verified" => true,
  ],
  "myCustomIdentifier"
);
```

It takes four arguments, as shown in the list below, but only the first one is
required:

1. The path to the PHP script to execute.
2. The path to the PHP binary. If you didn't add PHP to your environmental
   variables, you need to specify the absolute path instead. The location could
   differ depending on how you installed PHP.
3. The arguments that should be passed to the PHP script. These arguments must
   be in in key/value pairs in an associative array.
4. The script identifier.

Scheduling a script in this manner allows you to automate more complex tasks.
For example, here is a script that retrieves the current weather information and
saves it to a text file:

```php
[label weather.php]
<?php

$location = json_decode(file_get_contents("http://ipinfo.io/json"));

$coordinate = $location->loc;
$coordinate = explode(",", $coordinate);

$weather = json_decode(
  file_get_contents(
    "https://api.openweathermap.org/data/2.5/weather?lat={$coordinate[0]}&lon={$coordinate[1]}&appid=<api_key>"
  )
);

$text = "Todays weather is " . $weather->weather[0]->main;
$file = fopen("weather.txt", "w");
fwrite($file, $text);
fclose($file);
```

This script uses the [ipinfo.io](https://ipinfo.io) API to retrieve your
coordinates based on your IP address, then the coordinates are used to get the
current weather forecast through the
[OpenWeatherMap](https://openweathermap.org) API. Note that you need to register
for a free OpenWeatherMap account and replace the `<api_key>` placeholder with
your API key.

Once the weather information is extracted, it is saved to a `weather.txt` file.
You can schedule this script to run every morning at 06:00 AM like this:

```php
[label scheduler.php]
<?php require_once __DIR__ . "/vendor/autoload.php";

use GO\Scheduler;

[highlight]
$scheduler->php("weather.php")->daily("06:00");
[/highlight]

$scheduler->run();
```

## Setting up job execution times

Let's now discuss how you can set up an execution schedule for your tasks. The
`php-cron-scheduler` package offers several other helpers besides the
`everyMinute()` and `daily()` methods we already covered. These helpers are
shown in the list below:

- `everyMinute()`: This helper defaults to every minute, but you can pass a
  `$minute` parameter to make the task run at a different interval. For example,
  `everyMinute(5)` will execute the job every five minutes.
- `hourly()`: Schedules the job to run once every hour at minute 0. You can pass
  a `$minute` parameter so that the job runs at minute `$minute` of the hour.
  For example, `hourly(15)` means the job will run at 00:15, 01:15, 02:15, and
  so on.
- `daily()`: Runs once every day. You can pass two parameters (`$hour` and
  `$minute`) or a string (`hour:minute`) to determine the exact time this job is
  scheduled. If not set, the job will run at 00:00 every day.

There are also additional helpers for weekdays. Just like `daily()`, you can
pass parameters `$hour` and `$minute` or a string to set the exact time, but it
defaults to 00:00.

```php
$scheduler->php("script.php")->sunday();
$scheduler->php("script.php")->monday();
$scheduler->php("script.php")->tuesday();
$scheduler->php("script.php")->wednesday();
$scheduler->php("script.php")->thursday();
$scheduler->php("script.php")->friday();
$scheduler->php("script.php")->saturday();

$scheduler->php("script.php")->saturday(10); # Saturday at 10:00
$scheduler->php("script.php")->saturday(11, 30); # Saturday at 11:30
$scheduler->php("script.php")->saturday("15:25"); # Saturday at 15:25
```

There are helpers for months as well, and they default to running on the first
day of the month at 00:00. You can pass three parameters `$day`, `$hour` and
`$minute` to set the exact date and time if you wish. Note that these helper
methods do not accept a string as input.

```php
$scheduler->php("script.php")->january();
$scheduler->php("script.php")->february();
$scheduler->php("script.php")->march();
$scheduler->php("script.php")->april();
$scheduler->php("script.php")->may();
$scheduler->php("script.php")->june();
$scheduler->php("script.php")->july();
$scheduler->php("script.php")->august();
$scheduler->php("script.php")->september();
$scheduler->php("script.php")->october();
$scheduler->php("script.php")->november();
$scheduler->php("script.php")->december();

$scheduler->php("script.php")->december(25); # December 25th
$scheduler->php("script.php")->december(25, 12, 30); # December 25th at 12:30
```

It is also possible for you to combine these helpers to create a more random
schedule. For instance, if you want a job to run every Wednesday and Friday at
05:00 and 14:00, this is what you can do:

```php
$scheduler
  ->php("script.php")
  ->wednesday("05:00")
  ->wednesday("14:00")
  ->friday("05:00")
  ->friday("14:00");
```

If you are more comfortable using [Cron expressions](https://betterstack.com/community/guides/linux/cron-jobs-getting-started/),
you can use the `at()` method to create the same schedule as follows:

```php
$scheduler->php("script.php")->at("0 5,14 * * 3,5");
```

Lastly, a `date()` method is provided for scheduling a task to be executed
exactly once on the specified date and time. The method takes a string or an
instance of [`DateTime`](https://www.php.net/manual/en/class.datetime.php):

```php
$scheduler->php("script.php")->date("2022-09-13 12:20");
$scheduler->php("script.php")->date(new DateTime("2022-09-13"));
```

## Defining conditions for job execution

One of the benefits of using PHP to schedule tasks instead of Cron is that you
can harness the power of a programming language to define conditions other than
a date and time for carrying out task execution.

The scheduler's `when()` method is provided for this purpose. It takes a
callback function as its input, and the job only executes when the function
returns `true`. For example, you can schedule a job that executes when PHP is
using more than 1MB of memory:

```php
$scheduler->php("script.php")->when(function () {
  if (memory_get_usage() >= 1048576) {
    return true;
  } else {
    return false;
  }
});
```

## Defining pre and post job execution behavior

The `php-cron-scheduler` package also provides some hooks for specifying any
functions to run before and after a scheduled job is executed. These are the
`before()` and `then()` methods shown below:

```php
$scheduler
  ->php("weather.php")
  [highlight]
  ->before(function () {
    // execute this before evaluating `weather.php`
  })
  ->then(function ($output) {
    // execute this after evaluating `weather.php`
  })
  [/highlight]
  ->everyMinute();
```

Notice the sequence of this chain of methods. The `before()` and `then()`
methods come after the `php()` method, followed by the scheduling method. The
`$output` parameter in the `then()` method is automatically injected by the
scheduler, containing the output of the `weather.php` script (if any).

## Sending job output to files

In the weather report example, the `fopen()` function was used to write the
weather information to a local file. However, there is an easier and more
convenient way to deal with the output from scripts, commands, or functions
through the `php-cron-scheduler` package.

First, you must ensure that your function, command, or script produces an
output. For example, you can modify your `weather.php` file as follows:

```php
[label weather.php]
. . .
$text = "Todays weather is " . $weather->weather[0]->main;
[highlight]
echo $text;
[/highlight]
```

Next, go to your `scheduler.php` file, and add an `output()` method:

```php
[label scheduler.php]
. . .
$scheduler
  ->php("weather.php")
  [highlight]
  ->everyMinute()
  ->output(["weather.txt"]);
  [/highlight]

$scheduler->run();
```

For demonstration purposes, the schedule is changed to `everyMinute()`. Wait for
the job to execute, then run the following command to see the output:

```command
cat weather.txt
```

```text
[output]
Todays weather is Clouds
```

The `output()` method takes an array as its input, allowing you to save the
output to multiple files like this:

```php
$scheduler
  ->php("weather.php")
  ->everyMinute()
  ->output(["weather.txt", "weather.log"]);
```

## Monitoring PHP scheduled tasks with Better Uptime

[Better Uptime](https://betterstack.com/better-uptime) is a cloud-based
monitoring tool that allows you to keep tabs on your scheduled jobs and get
notified through if a task didn't execute as scheduled for any reason. This
section will discuss how to configure Better Uptime to monitor your scheduled
tasks.

First, you need to
[create a free Better Uptime account](https://betteruptime.com/users/sign-up?)
if you don't have one already. Once signed in, click **Heartbeats** on the top
left of the dashboard and create a new heartbeat.

![Better Uptime Heartbeats](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9fb78f83-5f71-4a7b-9400-cd3059e89800/public =1303x768)

Choose an appropriate name for your monitor and select how often you expect this
job to be repeated. In the **On-call escalation section**, pick how you wish to
be notified when the job fails to execute. After you are done, click **Save
Changes**.

![Better Uptime create heartbeat](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/282ebcbd-f842-40e4-3c33-3e1fc9657900/public =901x768)

You should see this page:

![Better Uptime heartbeat URL](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/173bbfa7-8305-448b-fc7e-d2a8bd7b7e00/public =829x768)

Notice the highlighted section in the middle. This URL is how Better Uptime
monitors your scheduled task. Every time a job executes, you should ensure that
a HEAD, GET, or POST request is made to this URL.

For example, head back to the `scheduler.php` file and add the following
highlighted code:

```php
[label scheduler.php]
. . .
// Schedule jobs
$scheduler
  ->php("weather.php")
  [highlight]
  ->then(function () {
    file_get_contents("https://betteruptime.com/api/v1/heartbeat/<api_key>");
  })
  [/highlight]
  ->everyMinute()
  ->output(["weather.txt"]);

// Run the scheduler
$scheduler->run();
```

Here, the `file_get_contents()` function is used to make a GET request to the
Better Uptime API each time the `weather.php` script is executed. Next, go to
the Better Uptime monitor you just created and wait for the job to execute. Once
Better Uptime starts receiving requests, the monitor will be marked as "Up",
which means that the Cron Job is up and running.

![Better Uptime heartbeat Running](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/824f4d3e-4442-45e8-e65b-a11fdd404f00/public =1366x586)

You can simulate an incident by commenting out the `file_get_contents()` line.
If Better Uptime does not receive a request within the configured time frame,
the heartbeat will be marked as "Down", which means that an incident was
detected.

![Better Uptime heartbeat Incident](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3702538b-2e4e-4e6e-af87-ca45fcf28500/public =1366x591)

You will also receive an alert in the configured channels:

![Better Uptime heartbeat Alert](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/70b604c8-165b-4a6c-dfd9-df6d35ed4800/public =883x768)

## Conclusion

In this tutorial, we discussed how to schedule tasks such as Linux commands, PHP
functions and scripts using the PHP Cron Scheduler package. We also demonstrated
how to specify conditional triggers for your tasks, and how to monitor scheduled
task with Better Uptime.

There are many more options when it comes to using scheduling tasks in PHP in production, from [sending emails](https://mailtrap.io/blog/php-email-sending/) to database backups. Hopefully, this guide gives you the basics to explore more on your own. If you are using Laravel, feel free to get more specific insight in our [Laravel task scheduling guide](https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/).

Thanks for reading, and happy scheduling!
