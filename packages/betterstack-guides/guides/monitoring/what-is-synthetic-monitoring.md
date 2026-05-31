# What Is Synthetic Monitoring? <br> Beginner’s Guide

## What is Synthetic Monitoring?

**Synthetic monitoring is a way of monitoring websites and applications by
simulating user actions.** Its purpose is to test
the *availability*, *performance,* and *function* of a given service.

Synthetic monitoring is called an *active* or *proactive* monitoring solution as
it runs automated tests at a pre-defined frequency. In comparison, Real User
Monitoring (RUM) is considered a *passive* monitoring solution, meaning it needs
real users to initiate the test.

[![Better Uptime Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/55594fcc-5410-4421-5e0e-cc5728fd9b00/public =1247x768)](https://betterstack.com/better-uptime/)

[summary]
<h3>🔭 Want to get alerted when your service stops working?</h3>
<p>Go to <a href="https://betterstack.com/better-uptime/" target="_blank">Better Uptime</a> and start with synthetic monitoring in 2 minutes.</p>
[/summary]

## How does synthetic monitoring work?

[Synthetic monitoring tools](https://betterstack.com/community/comparisons/synthetic-monitoring-tools/) work by sending
automated requests from a robot client to your app, simulating what a regular
user would do. Here is an example of synthetic monitoring method called [uptime
monitoring](https://betterstack.com/community/guides/monitoring/what-is-uptime-monitoring/):

[note]
<h3>🔭 &nbsp;Monitoring homepage availability</h3>
<p>A common use case is when we want to check whether our homepage is accessible to visitors from the web 24/7. To make sure it is, we can use an automated script called <a href="https://betterstack.com/community/guides/what-is-uptime-monitoring/">uptime monitor</a>, which will test it automatically for us every x minutes.</p>
<p>Practically this monitor sends a <code class="prettyprint">GET</code> request to the homepage automatically on a specified interval, 1 minute for example. If the given URL doesn't respond with a working site: <code class="prettyprint">200 OK</code> response code, the monitor starts an incident and proceeds to alert the on-call team.</p>
<p>Learn more about <a href="https://betterstack.com/community/guides/what-is-uptime-monitoring/">how uptime monitoring work in detail</a>.</p>
[/note]

## What are the types of synthetic monitoring?

Synthetic monitoring is an approach to monitoring rather than a specific method.
It encompasses different types of monitoring, which are used to monitor
_availability_, *performance*, and *function*. The types are:

### Availability Monitoring

Availability monitoring checks the availability (accessibility) of a given
service. The **main forms of availability monitoring** are:

- [Uptime monitoring](https://betterstack.com/community/guides/monitoring/what-is-uptime-monitoring/) checks the availability of a
  given URL, as shown in the example above.
- [Ping monitoring](https://betterstack.com/community/guides/monitoring/what-is-ping-monitoring/) checks the availability of any
  given endpoint by sending a simple ping request. An example is pinging a
  server to ensure that it is reachable.
- [SSL certificate monitoring](https://betterstack.com/community/guides/monitoring/what-is-ssl-certificate-monitoring/) checks the
  validity of websites’ security certificates. This prevents situations when
  Google shows security warnings to users accessing sites without valid SSL
  certificates.
- [Domain expiration monitoring](https://betterstack.com/community/guides/monitoring/what-is-domain-expiration-monitoring/) checks
  the expiration date of a given domain, preventing domain loss.

**Advanced availability monitoring options** include:

- [API monitoring](https://betterstack.com/community/guides/monitoring/what-is-api-monitoring/) checks API functionality by sending
  requests and testing whether they are provided with correct responses - either
  a success code or a specific data.
- [DNS monitoring](https://betterstack.com/community/guides/monitoring/what-is-dns-monitoring/) checks that the Domain Name System
  (DNS) is configured correctly. This often helps to discover many hacker
  attacks early.

### Web Performance Monitoring

Web performance monitoring or page speed monitoring gives visibility into the
perceived user experience on a given website, on a specific device, or with a
particular web browser. The **two main types of performance monitoring** are:

- **Real browser monitoring** (RBM) checks website's performance by using a real
  browser window. It loads the website with all its elements exactly how a real
  user would see it.
- **Mobile website monitoring** checks the performance like RBM but also
  simulates screen sizes and resolutions of specific mobile devices. This gives
  more insights into the performance on iOS and Android devices.

### Transaction Monitoring

Transaction monitoring checks that paths users usually take on your website work
correctly. These paths usually include multi-step processes like signup, user
login, search, payment confirmations, and more. Transaction monitoring is
ideally combined with real browser monitoring to simulate everything a real user
could do and encounter on a website to provide the most accurate picture.

## What are the benefits of synthetic monitoring?

### Automated with regular frequency

Synthetic monitoring can run every minute, every hour, 24 hours a day, 7 days a
week, the whole year. It’s a fully automated script, and once set, it needs
little to no maintenance while still providing the same valuable information.

### Wide usability

Different monitor types allow for testing anything from the latency of a
homepage to the load times of specific steps of a user signup flow. This gives
space to many applications and helps developers to monitor everything they need.

### Global testing

With monitors based around the world, it allows checking the availability,
performance, and function from different locations worldwide. This allows
distinguishing regional errors from incidents affecting all users and allows for
optimization for a global audience. Here is an example of spiked response times
in the Asia region shown by the [Better Uptime](https://betterstack.com/better-uptime)
dashboard.

![Better Uptime global testing dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ac3529fb-e9fb-4ce9-ae2f-9db17cbf9d00/public =974x524)

### Browser and device-specific

Accessing whether a service works correctly becomes much easier by simulating
real user behavior. Thanks to the browser and specific device monitoring, any
performance changes can be quickly discovered and investigated.

### Works inside and outside the firewall

Synthetic monitoring can be applied both inside and outside of the firewall -
meaning that you can also monitor machines inside your data centers or local
network, not just from the global perspective.

## Why use synthetic monitoring?

### Fix issues before they affect your users

Synthetic monitoring automatically monitors any performance degradation or
availability issues of websites, apps, or APIs. If any issue is identified, it
starts the [incident management](https://betterstack.com/community/guides/incident-management/what-is-incident-management/) process, alerting
the right person on the team, according to the [on-call schedule](https://betterstack.com/community/guides/incident-management/on-call-scheduling/).

As it is fully automated and can run as often as every 30 seconds, it helps with
discovery of any problems right when they occur. And in best scenarios, it
allows the teams to fix them before they affect a significant number of users.

Combined with a swift incident response, good synthetic monitoring can
significantly improve the time it takes to acknowledge an incident
([MTTA](https://betterstack.com/community/guides/incident-management/mttr-and-other-incident-metrics/)) and the time it takes to resolve an
incident ([MTTR](https://betterstack.com/community/guides/incident-management/mttr-and-other-incident-metrics/)). Check further information about [incident management tools](https://betterstack.com/community/comparisons/incident-management-tools/) to optimise your monitoring process.

### Protect vital business processes

Every online business has essential business transactions that are of the
highest importance. Those actions that users take directly influence the bottom
line. They include new signups, cart checkouts, or subscription payments.

With synthetic monitoring, and specifically transaction monitoring, these
processes can be monitored from over the globe, assuring they are working
correctly.

### Benchmark and plan improvements

By consistently running over a long period of time, synthetic monitoring gives a
unique insight into app's performance. With data about latency, page speed, and
more, you can identify long-term trends and explore potential improvements.

This set of historical performance data also allows benchmarking against
competitors or older versions of apps and products.

### Improve user experience

By monitoring and recording data from real browser monitoring, you can get
valuable insights into what parts of the website might cause a bad experience
for users. You can pinpoint performance issues from a website to a specific
component and optimize them.

### Hold 3rd parties accountable

Integrations like payment processing, site search, recommendation plugins, CDNs,
CRMs or analytics are integral in many modern applications.

Monitoring their functionality is necessary to accommodate for any performance
degradations or downtime incidents. Monitoring them is also essential in both
incident communication to your users and holding your vendors accountable.
Although some vendors have [public status pages](https://betterstack.com/community/guides/incident-management/status-page-examples/), like
[status.hubspot.com](https://status.hubspot.com/) it's always better to
double-check.

![Hubspot status page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7a779ebf-fd17-43ed-7a9e-9569506ace00/public =973x610)

### Measure SLAs guarantee

Service level agreements (SLAs) are an essential part of enterprise offerings
for many software businesses. Outbidding a competitor with better availability
can play a decisive role in the sales process.

Vendors can use [synthetic monitoring providers](https://betterstack.com/community/comparisons/synthetic-monitoring-tools/) to
arm themselves with data showing adherence to their SLAs. While their clients
can do the same to get paid penalties when the SLAs are not adhered to.

### Prepare for launches

When starting to serve new world locations, synthetic monitoring helps you to
access the performance at the new geography before the real launch.

Similarly, when publishing new websites or new process flows, synthetic
monitoring can check if everything is working correctly before you start
directing real users to it.

## Synthetic vs. Real User Monitoring (RUM) monitoring?

**Real user monitoring (RUM)**, in comparison to synthetic monitoring, is
an *active* monitoring method, which means it is initiated by real user
activity. RUM shows you how users are interacting with your website right in
real-time.

At the core, it is advanced website analytics like Google or Cloudflare
Analytics, focusing on websites performance rather than on referral channels or
conversions. **RUM can be summed into 4 main points:**

### Based on real users

RUM monitoring shows you how real users are interacting with you website in
real-time. It tracks data like visits, load times, performance from different
geographic locations, devices, and browsers.

Even though you can simulate browsers from different locations with synthetic
monitoring as well, you can never really know how thousands of users are
experiencing your service without RUM.

### Tracks all user actions

RUM tracks everything that is happening in real-time compared to synthetics,
which only runs scheduled pre-defined tests. By tracking real user behavior, you
can identify trends and problems which you didn’t even know existed.

You might, for example, identify outliers in performance for some geographical
locations, which you didn’t before thought of testing with synthetics.

### Requires traffic

To get any valuable insights with RUM you need to have users visiting your
website. Without traffic, you won’t have enough data to draw actionable
conclusions. Because of that, RUM is usually set up after synthetic monitoring,
and once substantial website traffic is achieved.

### Big data

The issue with RUM is that it produces large volumes of data that need to be
analyzed to be valuable. Compared to synthetics, which answers simple questions,
like _is homepage reachable?_ or _is website's SSL certificate valid?_, RUM only
shows what is happening, and you need to find the questions to ask.

Since both synthetic and real user monitoring provides great insights, the best
practice is to use them together and enjoy the benefits of both.

## How to start with synthetic monitoring?

[Better Uptime](https://betterstack.com/better-uptime) is a synthetic monitoring tool that
offers a wide range of monitoring options. Here is how to get notified whenever
a URL becomes unavailable (returns code other than `200 OK`).

- [Once signed up](https://betteruptime.com/users/sign-up), head to *Monitors →
  Create monitor*
- Enter your URL or IP address in the URL to monitor the text field, let’s make
  it example.com
- Select the way how you want to get alerted, be it a phone call, Slack
  notification, or an email
- Click create monitor

For more information, explore
[Better Uptime docs](https://docs.betteruptime.com/).
