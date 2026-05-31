# Google Cloud Platform Logging with a Practical Example

The Google Cloud Platform (GCP) is a collection of cloud computing services
offered by Google. It includes a range of services such as computing power,
storage, and databases that can be used to build and run applications, as well
as machine learning and big data analytics tools.

GCP allows developers to build and host their applications on Google's
infrastructure, which is highly scalable and reliable. Additionally, GCP offers
a range of management and security tools to help businesses manage their cloud
resources.

In this article, we will focus on its logging functionality, which allows users
to collect, analyze, and monitor log data from their GCP resources. This data
can include logs from GCP services such as Compute Engine, Cloud SQL, Kubernetes
Engine, and custom applications running on GCP.

GCP logging provides a centralized location for storing and analyzing log data,
and allows users to set up alerts and notifications based on specific log
patterns or events. Additionally, GCP logging integrates with other GCP tools
such as Stackdriver Monitoring and BigQuery for further analysis and
visualization of log data.

[ad-logs]

## Prerequisites

Before continuing with this tutorial, you need to:

- Have a Google Cloud Platform account, and install the
  [gcloud CLI](https://cloud.google.com/sdk/docs/install) on your machine.
- Have a GitHub account, and have `git` installed on your machine.
- Understand some basic concepts in logging, such as [log
  levels](https://betterstack.com/community/guides/logging/log-levels-explained/), [log
  rotation](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/), log
  retention period, and so on.
- Understand how to use command line tools.

## Deploying the demo app

We have created a
[demo app](https://github.com/betterstack-community/gcp-logging) to help you get
started. First, you need to clone the project to your machine using the
following command:

```command
git clone https://github.com/betterstack-community/gcp-logging.git
```

Change into the project directory:

```command
cd gcp-logging
```

Run the following command to create a new Cloud project:

```command
gcloud projects create --name=gcp-logging
```

This project requires some configurations to work. First, you must
[enable billing](https://console.cloud.google.com/billing) for your GCP account.

![enable-billing.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cda35245-d6de-4d72-5be4-adffb4cd9b00/md2x =793x558)

After billing is enabled, you must also
[add the Storage Object Viewer role](https://console.cloud.google.com/iam-admin/iam)
to the principal named `xxx@cloudbuild.gserviceaccount.com`.

![edit-permission.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/12821703-4653-4206-063c-3ca91b37aa00/orig =2002x673)

And finally enable the
[Cloud Build API](https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com)
for this project:

![cloud-build-api.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/36baa06f-4047-44f1-d7de-92e0bcffef00/md1x =793x558)

Now, go back to the terminal and set this newly created project as the working
project:

```command
gcloud config set project <project_id>
```

Then create a new App Engine application inside the project:

```command
gcloud app create --region=us-central
```

And finally, deploy the application using the `gcloud` CLI:

```command
gcloud app deploy
```

```text
Services to deploy:

descriptor: [. . ./gcp-logging/app.yaml]
source: [. . ./gcp-logging]
target project: [<project_id>]
target service: [default]
target version: [20230117t150238]
target url: [<project-url>]
target service account: [App Engine default service account]


Do you want to continue (Y/n)?

Beginning deployment of service [default]...
╔════════════════════════════════════════════════════════════╗
╠═ Uploading 5 files to Google Cloud Storage ═╣
╚════════════════════════════════════════════════════════════╝
File upload done.
Updating service [default]...done.
Setting traffic split for service [default]...
done.

[highlight]
Deployed service [default] to [<project-url>]
[/highlight]

. . .
```

Visit the link from your browser, and you should see the welcome page.

![demo-app.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/423878d5-b51f-49a8-f917-c3c0d79cf000/lg2x =3248x1986)

This demo app doesn't seem like much, but the magic happens in the backend. If
you visit the [Logs Explorer](https://console.cloud.google.com/logs/query), you
should see the log records showing up.

![logs-explorer.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/39628e66-01db-47d9-da8a-ac47baa99000/orig =3248x1986)

## GCP logging basics

To get started, let's discuss how logging works in Google Cloud. The following
diagram from
[Google Cloud's documentation](https://cloud.google.com/logging/docs/routing/overview)
illustrates the entire architecture:

![gcp-logging-architecture.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/404c09f6-788f-4500-a3b8-24214dca5100/public =1460x1756)

By default, GCP will automatically collect logs from `stdout` and `stderr`. The
logs data stays in the Logs Router waiting to be sent to the correct
destination.

The **Logs Router** is the traffic control of GCP's logging architecture. The
router consists of multiple sinks, and each sink checks the log records against
the existing inclusion and exclusion filters and decide whether or not to let
them pass. If the log entry has a timestamp outside of the log retention period,
the entry will be discarded.

**Sinks** are part of the Logs Router, and it controls how the log entries are
routed. You can see them as different outlets which point to various
destinations. By default, there are two predefined sinks, `_Required` and
`_Default`, and they point to the `_Required` and `_Default` buckets,
respectively.

The sinks act independently of each other. You may create your custom sinks that
points to different destinations, and each log record can be passed by more than
one log sink.

The supported destinations include:

- GCP Logging log bucket: it provides basic storage in GCP Logging.
- Pub/Sub topics: it allows third-party applications to access the log entries.
- BigQuery datasets: it allows you to use big data analysis capabilities to
  process your logs.
- GCP Storage bucket: it is similar to a log bucket but better for long-term
  storage, as it is more cost-effective.

And lastly, the `_Required` log bucket contains Admin Activity audit logs,
System Event audit logs, and Access Transparency logs. These logs are retained
in the `_Required` log bucket for 400 days, and you are not allowed to modify
this retention period.

The `_Default` bucket, on the other hand, contains anything not ingested by the
`_Required` log bucket. You can't delete the `_Default` bucket, but you are
allowed to modify the retention period, which is 30 days by default.

## View and query logs in GCP

Next, let's take a closer look at the
[Logs Explorer](https://console.cloud.google.com/logs/query) and talk about how
to view and analyze log records in GCP. The Logs Explorer interface consists of
the following components:

![logs-explorer-components.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5bfaa490-db29-4435-09f6-97bcd86ade00/orig =3248x1986)

1. The **action toolbar** consists of a refine scope feature which allows you to
   change the scope of your search by limiting it to only the current project,
   or one or more storage views, a share button, and a learn button linking to
   the related documentation.
2. The **query pane** allows you to refine the search results further using the
   logging query language.
3. The **results toolbar** allows you to toggle the log fields pane and the
   histogram on and off, and create metrics and alerts based on your current
   query expression.
4. The **log fields pane** offers an overview of the log records. It breaks down
   the log entries by different dimensions such as severity level, log name,
   project ID, and so on.
5. The **histogram** visualizes the number of logs over a period of time, and
   differentiates low-severity, medium-severity and high-severity log entries
   using different colors.
6. The **query results pane** displays the result of your search query.

### The logging query language

The logging query language is an integral part of logging in GCP, which allows
you to search existing log entries, create filters, and more. This section
discusses how to use query expressions to search your logs. For instance, you
can search for texts across all logs and return the matching log entries.

![search-text.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ede06ed5-8e3e-41f9-0566-9753ea460c00/md2x =2512x458)

You can use the search box or edit the query expressions directly Notice that
the corresponding query expression will be generated below as you type in texts
in the search box. To execute this query expression, click the **Run query**
button on the top right corner.

You may also use regular expressions, which have the following format:

- Match a pattern:

```text
jsonPayload.message =~ "<regular_expression>"
```

- Does not match a pattern:

```text
jsonPayload.message !~ "<regular_expression>"
```

`jsonPayload.message` is called a
[log field](https://cloud.google.com/logging/docs/view/logging-query-language#log_fields),
which points to the log message your application sent to GCP. For example, you
can match all log entries whose massage starts with the word `Error`:

![search-regular-expression.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/39506ac0-ba04-4464-75ed-c9c7ffe1e300/md1x =2512x366)

Or use Boolean operators in the query expression:

![search-boolean.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9c56c717-5150-4547-1973-9b815943b800/md1x =2514x364)

When using Boolean operators (`AND`, `OR`, and `NOT`), you must note the
following rules:

- Parentheses are not permitted in the search term. The parentheses in search
  expressions are parsed as part of the search term. For example,
  `NOT((NOT a) OR (NOT b))` will give the following query expression:

```text
"NOT((NOT"
"a)" OR "(NOT"
"b))"
```

If you do need to use parentheses, please edit the query expression directly.

- The Boolean operators must be capitalized, and lowercases will be parsed as
  search terms. For instance, `a and b` will be parsed as:

```text
"a"
"and"
"b"
```

- You may combine different operators in one expression. For example, the search
  expression `a AND b OR c AND d` will turn into the following Logging query
  expression:

```text
"a"
"b" OR "c"
"d"
```

The `NOT` operator has the highest priority. For example, the search expression
`a AND b AND NOT c` will give:

```text
"a"
"b"
-"c"
```

Please refer to the
[official documentation](https://cloud.google.com/logging/docs/view/logging-query-language)
for more advanced query language syntax.

## Monitor your logs and set up alerts

Besides searching and querying logs, GCP also allows you to retrieve
[log based metrics](https://console.cloud.google.com/logs/metrics), visualize
the metrics, and set up alerts based on the metrics.

The system-defined metrics come with Google Cloud and cannot be altered.
However, you can generate charts or set up alerts based on these metrics.

The user-defined metrics, on the other hand, are customizable. There are two
types of user-defined metrics. The **counter metrics** count the number of log
entries based on a given filter, and the **distribution metrics** collect
numeric data from log entries.

Both metrics require you to specify a name, description, unit, and filter. The
filter utilizes the query expression we just discussed. Their only difference is
that the distribution metric requires you to define a field name, the log entry
field from which the metrics values are retrieved, and a regular expression that
extracts the numeric value from the field.

As an example, let's create a distribution metric that retrieves all log entries
whose message is `Low disk space.`, and the numeric value would be
`jsonPayload.size`.

First of all, choose distribution metric:

![metric-type.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b4cb0390-7fd5-4ac0-0258-81d9abf21300/md2x =1066x622)

Specify the details, such as name, description, and unit. In this case, the unit
should be MB, as the numeric value shows the remaining disk space.

![metric-detail.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/45f1e595-d0dd-4f78-1f0c-8dda046fdc00/lg1x =1060x552)

Next, set up the filter and specify the field name:

![metric-filter.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c4930df8-11a9-419a-5f20-1427875f3100/md2x =1076x844)

You can click on the **PREVIEW LOGS** button to see if your filter works
correctly:

![metric-preview.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/78994289-b8fa-4c91-d06f-0358f8a87400/lg2x =1598x1630)

You can also create custom labels if you want, but we'll skip that for now.
Finally, click **CREATE METRIC**, and you will be redirected to this page:

![metric-next.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/09af2b28-4102-4b8a-9359-68578daed700/md2x =3248x1986)

From here, you can choose your next step, such as creating charts in the
**Metrics Explorer**, or set up alerts based on this metric.

### Visualize the log metrics

Let's start by creating charts. Click **EXPLORE METRICS**, and you will be
directed to the **Metrics Explorer**:

![metrics-explorer.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1fc05429-49b7-4da6-4a30-fed0579d9100/lg2x =3248x1986)

On the left side, you'll be able to customize how data is displayed. Here is an
overview of some of the key settings.

- The **Group by** option allows you to combine data from multiple sources into
  one.
- After choosing a **Group by** option, you'll need to specify an
  **Aggregator**, which defines how the data should be combined. Some common
  options include `sum`, `min`, `max` and so on.
- The **Minimum alignment period** defines how often the aggregation takes
  place.
- Sometimes, the time series data have different periods or intervals. You must
  normalize the data, so they are of the same time period and interval. The
  **Aligner** specifies how you wish to normalize the data.

In our example, we only have one data source, so there is no point in using the
aggregator. However, you do need to normalize the time series data so that the
**Metrics Explorer** can process them:

![metrics-explorer-aligner.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/930c0527-32c0-4204-4280-b01b30be6900/orig =794x848)

After setting up the **Aligner**, a line chart should appear on the right side.
Here you have the option to select the chart type (line chart, area chart, bar
chart, etc), choose the time period, and save the chart.

![metrics-explorer-line.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/485cc186-54dd-421b-9ad3-0183b5254600/md1x =1632x788)

### Set up alerts based on metrics

Besides creating charts, you may also set up alerts from the metrics. Head back
to the **Next Steps** page and this time, click **CREATE ALERT**:

![alert.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2ff431ca-6313-44eb-63e7-3c5eab8b5600/orig =3248x1986)

In the **Transform data** section, you need to pay attention to two key
settings. The first one is the rolling window. It specifies the time frame for
which the data is calculated. For example, the mean of the remaining disk space
is below 50 MB for 10 minutes.

The second one is the rolling window function, which is the same as the aligner
we discussed before. It defines the function that is applied to the selected
time frame.

Click **Next** and move on to the next step. Here you can define conditions that
trigger the alarm. It can either be a threshold-based trigger, which sets off
when the numeric value is above or below a threshold for a period of time, or an
absence-based trigger that sets off when the value is absent for a period of
time.

![alert-trigger.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fa00009c-10d5-40cb-a1e8-67c69037d000/orig =1092x1098)

And then, in the next step, choose how to wish to be notified when the alert is
triggered.

![alert-notification.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b5d7276f-82d8-4bdc-e27d-45a119f01900/public =1088x1262)

Finally, review and save the alert policy.

## Creating custom log storage

Besides the `_Required` and `_Default` sinks we discussed before, GCP also
allows you to
[create custom log sinks](https://console.cloud.google.com/logs/router):

![sink.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ad5278be-98c8-46eb-ffe7-f11aacc7d600/orig =3248x1986)

You can create a new log bucket in the **Sink destination** section.

![sink-new-bucket.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1e80219c-a06a-434a-8e78-b6aaca678400/lg2x =1090x908)

![sink-bucket-retention.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/78bb9513-20bc-45d5-2f9d-341738aa6800/md1x =1070x612)

The log retention period indicates how long you wish the log entries to be
stored in this bucket, and older log entries will be removed. Setting a longer
retention period means you have to pay more. If you are looking for a long-term
storage, it is better to set up a storage bucket instead.

![sink-inclusion.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5296b883-f7af-428e-3a3a-20ba399bf200/md1x =1052x808)

Next, set up an inclusion filter, which determines what logs will be allowed to
pass the sink. This inclusion filter uses the same query language we discussed
before, and if you do not set an inclusion filter, all log entries will be
allowed to pass.

![sink-exclusion.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6894c2f0-11bf-41e4-4792-edf94eadf600/lg2x =1066x864)

And lastly, set up exclusion filters that decide which log entries get rejected.
You are allowed to set up multiple exclusion filters for each log sink.

## Access control

Finally, let's discuss the security issues. GCP comes with IAM (Identity and
Access Management) that allows you to decide which team members can access what
feature by assigning them different roles. For GCP logging, there are
[predefined roles](https://cloud.google.com/logging/docs/access-control#permissions_and_roles)
such as Logging Admin, Logs Bucket Writer, Logs Configuration Writer, and so on.

To view and manage users and roles, go to the
[IAM page](https://console.cloud.google.com/iam-admin/iam):

![iam.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5f2ac7cc-7c16-485b-4556-f4cd96376800/md1x =3248x1986)

To grant access to your team members, make sure they have an Gmail account,
Google Group account, Google service account, or Google Workspace domain
account. Type in the email address in the **New principals** field, and assign
roles below:

![iam-grant-roles.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cb17fd01-7d60-4a62-2afe-54e4d1b20e00/public =1058x630)

## Best practices for logging in GCP

As we've discussed before, by default, as long as your application is running,
GCP will automatically collect logs from `stdout` and `stderr`. The default
logging method of your preferred programming language would be good here.
However, things are a bit more complicated, and there are better options. We
have compiled a list of best practice guidelines you should follow when logging
in GCP.

Head back to the demo app, and look closely at the `main.py` file. There are a
few things you should note.

### 1. Use the client libraries

Google provides
[client libraries](https://cloud.google.com/logging/docs/reference/libraries)
for C#, Go, Java, Node.js, PHP, Python, and Ruby. It is better to use these
client libraries if you are building logging systems in these languages, as the
result log entries follow a certain format, making it easier for GCP to process.
For example, if you don't use the client library, GCP logging will not be able
to recognize the log level, and it will not display the correct icons in the
Logs Explorer.

Using client libraries:

![with-client-lib.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ff7daf7f-586c-46b1-5107-2257991f0f00/md2x =948x352)

Not using client libraries:

![without-client-lib.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5e46fcbf-c80e-4ac5-b38a-aab9f712ed00/lg2x =952x406)

The demo app uses the client library designed for Python applications.

### 2. Log as much as necessary

Be sure to log all events that pertain to the functioning of your application,
including errors, authentication attempts, data access and modifications, and
other important actions performed in your application.

### 3. Log contextual information

Each log record should contain enough contextual information that describes the
event. For example, you are running a blog application, and a user added a new
post. In this case, you shouldn't just record a simple message. Instead, you
should also include some information in the record, such as the user ID, post
ID, timestamp, user agent, and other relevant details about the event.

```python
logger.log_struct(
 {
 "message": "Error connecting to database.",
 "dbname": "maindb"
 },
 severity="ERROR",
)
```

### 4. Use structured logging format

Using a structured logging format ensures that your log records can be
automatically processed by various logging tools which will save you time when
investigating an issue. JSON is the go-to structured format for most people, but
other options like [logfmt](https://www.npmjs.com/package/logfmt) also exist.

![structured-logfmt.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bd7b4cc2-0e19-4da3-de82-eae4f3441a00/md1x =986x814)

### 5. Exclude sensitive information

Take adequate care to never log business secrets, or personal data such as email
addresses, passwords, or credit card information so that you don't compromise
user privacy or incur regulatory fines.

### 6. Use the appropriate log level

Always make sure your log records have the appropriate [log
level](https://betterstack.com/community/guides/logging/log-levels-explained/) so that you can easily differentiate between events
that require urgent attention from those that are merely informational.

```python
logger.log_struct(
 {
 "message": "Application crashed.",
 "code": 12345
 },
 [highlight]
 severity="CRITICAL"
 [/highlight]
)
```

## Logtail: a modern log management solution

If you've made it so far, you must have noticed some issues with GCP logging.
For example, the query results are not always updated in real-time, and
sometimes you have to wait minutes before the new log entries come through. And
the UI design isn't ideal either, as GCP tries to put too many items in one
window.

If you are looking for a modern alternative to GCP logging, consider sending
your application logs to Logtail instead.

[Logtail](https://betterstack.com/logtail) is a cloud-based log collection and
analysis tool. It allows users to collect, process, and analyze log data from
various sources, such as servers, applications, and cloud environments. Logtail
can also set alerts and notifications based on specific log patterns or events.
In addition, it provides a web-based interface for searching, filtering, and
visualizing log data in real time.

Logtail offers many client packages that allow you to send your application logs
to Logtail directly. We have also created detailed [logging guides](https://betterstack.com/community/guides/logging/) for
many different languages, such as the ones listed below:

- [Ruby](https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/)
- [Python](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/)
- [Node.js](https://betterstack.com/community/guides/logging/how-to-start-logging-with-node-js/)
- [Java](https://betterstack.com/community/guides/logging/how-to-start-logging-with-java/)
- [PHP](https://betterstack.com/community/guides/logging/how-to-start-logging-with-php/)
- [Go](https://betterstack.com/community/guides/logging/logging-in-go/)

## Final thoughts

In this article, we discussed some basic concepts regarding logging in GCP.
Together we explored how to view and search log entries, retrieve metrics from
the log data, visualize them and create alerts based on the metrics, and create
custom log sinks. And finally, we listed some best practice guidelines you
should follow when logging in GCP. These guidelines make sure you are using GCP
to its full potential. We hope this tutorial has helped you understand the
various logging features provided by GCP.

If you wish to dig deeper into the subject of logging, we also provide several tutorials regarding [log rotation](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/), [log levels](https://betterstack.com/community/guides/logging/log-levels-explained/), and [centralizing logs](https://betterstack.com/community/guides/logging/how-to-configure-centralised-rsyslog-server/) to help you build a more effective logging system.

Thanks for reading, and happy logging!