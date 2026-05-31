# What is Uptime Monitoring?

**Uptime monitoring is an automated way of checking whether a service such as a
website or an application is available.** When service goes down during an
outage (downtime), uptime monitoring spots the issue and alerts the right person
on the development team.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/pouVbehfnqQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## How does uptime monitoring work?

The uptime monitoring process works by **sending automated
[HTTP requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) at a
pre-defined frequency to a specific URL and checking for the desired response**.
`HTTP GET` requests are usually used. Other HTTP requests can be used as well,
for example when [monitoring APIs](https://betterstack.com/community/guides/monitoring/what-is-api-monitoring/) and other
functionality. The pre-defined frequency of the checks depends on the specific
user’s need but can generally range anywhere from 30 seconds for business
websites to 10 or more minutes for hobby projects.

The desired response from the monitored URL is the `200 OK` HTTP response code
(other codes might be acceptable as well in specific cases). Uptime monitor can
also be set to monitor for the desired keyword in the response. This is often
used in [health checks](https://betterstack.com/community/guides/monitoring/health-checks/) or when assuring correct display of a critical part of the
website. For instance, keywords like _signup_ or _subscribe_, are often checked
to assure that the most valuable user actions are working as they should.

When the correct code or keyword is received from an URL no further action is
taken and the monitoring continues. When a different code is returned (any of
the 5xx server errors for example), the monitor starts what is called a downtime
incident and starts alerting according to the [on-call calendar](https://betterstack.com/community/guides/incident-management/on-call-scheduling/).

[note]
<h3>🔍 &nbsp;How does keyword monitoring work?</h3>
<p>Keyword monitor checks for the presence or absence of the desired keyword in the HTML of the monitored URL.</p>
<p> Since the whole HTML code is checked, the keyword monitor can also check for specific code parts like a desired <code class="prettyprint">&lt;div&gt;</code> element or a signup button.
</p>

<h3>⚖️ &nbsp;Status code monitoring vs. Keyword monitoring</h3>
<p> It’s recommended to use keyword monitoring instead of simple response code monitoring as the default for uptime checks. This is because the keyword check prevents the situation where a non-error response code is returned, but the page content shows incorrectly.</p>
<p> When a keyword is checked as well it gives an extra layer of protection as it allows to check any key component of a given URL. Such elements can be a call to action like a subscribe to newsletter button or a title of a blog post.</p>
[/note]

## What is a downtime incident?

A downtime incident (or simply just downtime) is a period of time during which a
given service is unavailable. Any users that are trying to use the service
during the downtime will see the website's error page or an error page generated
by their browser. This is how a
[custom 500 error page looks at GitHub](https://github.com/500).

![GitHub 500 error page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a2385675-1ab6-4a17-0264-261b41834100/public =1130x768)

A downtime incident can be also a situation where the request sent by the
monitor doesn’t receive a response in a given time frame. The request timeout
can be anywhere from 2 seconds to 1 minute, depending on the priority of the
monitor. Setting the monitor sensitivity correctly is key in avoiding large
amounts of false-positive alerts.

## How to receive downtime incident alerts?

After an incident is spotted by the [uptime monitoring
tool](https://betterstack.com/community/comparisons/website-monitoring-tools/) it needs to be communicated to you. This process
is called [incident alerting or on-call alerting](https://betterstack.com/community/guides/incident-management/what-is-incident-management/).
On-call (or on-call calendar) is basically a scheduled duties calendar that
defines which team member is responsible for incoming incidents.

The most common ways of getting alerted by an uptime monitor are automated phone
calls, SMS, Slack, and Microsoft Teams messages. Ways of alerting depend on
factors like the importance of the monitored service, time of the day, and team
preference. For example push notifications or emails are generally used for less
vital monitors.

[ad-uptime]

## What information do downtime alerts include?

Downtime incident alerts include information about what monitor went down and
when. They also include information about the error that triggered the incident,
specifically the received response (see example from Twitter below) and a
screenshot of the site. Screenshots can’t be taken everywhere but in the case of
website monitoring, they offer a great insight into what went wrong and what
customers experienced.

```
[output]
Twitter / Error

This page is down
I scream. You scream. We all scream... for us to fix this page. Weâll stop making jokes and get things up and running soon.

Retry

Home
Status
Terms of Service
Privacy Policy
Cookie Policy
Imprint
Ads info
© Twitter
```

Downtime alerts also include a call to action for the on-call person to take.
Those usually include the option to acknowledge or to view the incident.

## Process after receiving an alert? The downtime incident resolution process

After an alert is received it should be acknowledged immediately. If the alert
is not acknowledged in a specified time frame (usually 3 to 5 minutes), the
person next in line on the on-call duty is alerted. This process could continue
further until the whole team is alerted. The best practice however is to have
the on-call schedule set up in a way that the first team member is always ready
to solve incoming incidents.

Once the incident is acknowledged the escalation process is paused and the team
can fully focus on solving it. The speed by which an alert is acknowledged is
called Time to acknowledge (TTA). Its average from different incidents called
Mean Time to Acknowledge (MTTA) is a widely used [incident management
metric](https://betterstack.com/community/guides/incident-management/mttr-and-other-incident-metrics/).

The next steps in the downtime resolution process are individual to different
teams and apps. For larger teams, they can include collaborations between a few
developers or even teams of developers, delegations of incidents to dedicated
team members, and more. There are some best practices that should be used by all
teams managing incidents. These include incident communication (both internal
and external) and incident post-mortems.

## Why use uptime monitoring?

### Fix issues before they affect your users

Uptime monitoring is a fully automated process that can run as often as every 30
seconds, which helps to discover any issues right away. In a best-case scenario,
any downtime is fixed quickly, keeping the number of affected users to a
minimum.

### Benchmark and plan improvements

By consistently running over a long period of time, uptime monitoring gives a
unique insight into apps performance - specifically uptime and latency. This set
of historical data allows to benchmark against competitors or older versions of
the same app or product.

### Measure SLAs guarantee

Service level agreements (SLAs) are an essential part of enterprise offerings
for many software businesses. Outbidding a competitor with better availability
can play a decisive role in the sales process.

Vendors can use uptime monitoring to arm themselves with data showing adherence
to their SLAs. While their clients can do the same to get paid penalties when
the SLAs are not adhered to.

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

## What are the main benefits and drawbacks of uptime monitoring?

### Benefits

- **Automated with regular frequency:** Uptime monitoring can run every minute,
  every hour, 24 hours a day, 7 days a week, the whole year. It’s a fully
  automated script and once set it needs little to no maintenance, while still
  providing the same valuable information.
- **Simple to set up and use:** Monitor for any URL can be set up in minutes
  while providing the availability information right from the start. Since it
  provides simple up/down information it can be applied widely across websites
  and apps of different types and use cases.
- **Global testing:** It allows for testing from different endpoints around the
  world. This allows distinguishing regional errors from incidents affecting all
  users and allows for optimization for a global audience.

### Drawbacks

- **Limited downtime cause reporting:** Uptime monitoring lacks the information
  that could answer why the downtime happened. Since it only monitors the final
  output and not the actual workings of the app. To get a better idea about the
  root cause, application performance management (APM) or a
  [log management service](https://betterstack.com/logtail) needs to be used.
- **Limited functionality monitoring:** Since it only monitors a specific URL
  status it can miss smaller issues that don’t cause downtime, but still
  significantly interfere with the user experience. Those can be issues with
  signup flow, checkout or other key processes. To monitor those, transactions
  or keyword monitoring needs to be used.

## Where does uptime monitoring fit in the synthetic monitoring setup?

Uptime monitoring is the main but not the only part of the [synthetic
monitoring](https://betterstack.com/community/guides/monitoring/what-is-synthetic-monitoring/) toolbox. When it comes to website
monitoring, uptime checks are ideally accompanied by [SSL certificate
checks](https://betterstack.com/community/guides/monitoring/what-is-ssl-certificate-monitoring/) and [Domain expiration
checks](https://betterstack.com/community/guides/monitoring/what-is-domain-expiration-monitoring/) to prevent any security issues or
loss of valuable business assets respectively.

Synthetic monitoring also offers monitoring options like [checking an
API](https://betterstack.com/community/guides/monitoring/what-is-api-monitoring/), [DNS](https://betterstack.com/community/guides/monitoring/what-is-dns-monitoring/) or Transaction
monitoring.

## How to start uptime monitoring in 2 minutes with Better Uptime?

[Better Uptime](https://betterstack.com/better-uptime) is an infrastructure monitoring tool
that offers [free](https://betterstack.com/better-uptime/pricing) uptime monitoring. Here is
how to get notified whenever a URL becomes unavailable (returns code other than
`200 OK`).

- [Once signed up](https://betteruptime.com/users/sign-up), head to _Monitors →
  Create monitor_
- Enter your URL or IP address in the URL to monitor the text field, let’s make
  it `example.com`
- Select the way how you want to get alerted, be it a phone call, Slack
  notification or an email
- Click create monitor

For more information, explore
[Better Uptime docs](https://docs.betteruptime.com/).
