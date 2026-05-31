# What is API Monitoring?

**API monitoring is an automated way of checking whether an API is functioning
correctly.** When API encounters issues with authentication, redirects, or
returned content, the API monitoring spots the issue and alerts the right person
on the development team.

[![Better Uptime Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/55594fcc-5410-4421-5e0e-cc5728fd9b00/public =1247x768)](https://betterstack.com/better-uptime/)

[summary]
<h3>🔭 Want to get alerted when your API stops working?</h3>
<p>Go to <a href="https://betterstack.com/better-uptime/" target="_blank">Better Uptime</a> and start monitoring your endpoints in 2 minutes.</p>
[/summary]

## How does API monitoring work?

The API monitoring process works by **sending automated
[HTTP requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
requests at a pre-defined frequency to the desired URL and checking for the
desired response**. Depending on the API’s use case a corresponding HTTP code is
sent (usually a `GET`, `POST`, `PUT` or `PATCH`). For requests with parameters,
a specific request body can be added to the checks as well. The pre-defined
frequency depends on the specific user need but generally ranges anywhere from
30 seconds for business use-cases up to 10 or more minutes for hobby projects.

The desired response from the API endpoint is usually the `200 OK` HTTP response
code (other codes might be applicable as well in specific cases). To assure the
correct function the response can be checked for a desired keyword, like a
specific parameter for example.

The authentication is automatically monitored as well since every request
includes some form of user credentials. The two main authentication methods are
_Basic access authentication_ (this includes the HTTP authentication username
and password) and _Bearer token authentication_ (this includes the Bearer
token). Similarly, the redirects are monitored and if there is an error along
the way an API incident is created and the [API monitoring
tool](https://betterstack.com/community/comparisons/api-monitoring-tools/) starts alerting according to the [on-call calendar](https://betterstack.com/community/guides/incident-management/on-call-scheduling/).

## What is an API incident?

An API incident is a period of time during which a given API service is
unavailable or not functioning properly. Any users that are trying to use the
API during the time of the incident will either receive an error or a wrong
message.

An API incident can be also a situation where the request sent by the monitor
doesn’t receive a response in a given time frame. The request timeout can be
anywhere from 5 seconds to 1 minute, depending on the priority of the monitor.

## How to receive API incident alerts?

After an incident is spotted by the API monitor it needs to be communicated to
the service admins. This process is called [incident alerting or on-call
alerting](https://betterstack.com/community/guides/incident-management/what-is-incident-management/). This is because, in case of an incident,
the person from a team who is currently on-call (has scheduled duty) receives
the incident alert.

The most common types of getting alerted by an API monitor include automated
phone calls, SMS, Slack, and Microsoft Teams messages. Ways of alerting depend
on factors like the importance of the monitored service, time of the day, and
team preference.

## What information do API alerts include?

API alerts include information about what API check went wrong and when. It also
includes information about the error that triggered the incident, specifically
the received response. This can be a simple error message (like
`401 Unauthorized error`) or a regular API response, that is just missing the
desired content.

API alerts also include a call to action for the on-call person to take. Those
usually include the option to acknowledge the incident or to view the incident.

## Process after receiving an alert? The API incident resolution process

After an alert is received it should be acknowledged immediately. If the alert
is not acknowledged in a specified time frame (usually 3 minutes), the person
next in line on the on-call duty is alerted. This process could continue further
until the whole team is alerted. The best practice however is to have the
on-call schedule set up in a way that the first team member is always ready to
solve incoming incidents.

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

## Why use API monitoring?

### Fix issues before they affect your users

Businesses that provide API functionality to their users can use API monitoring
to make sure that their service is working correctly. Since API monitoring is a
fully automated process that can run as often as every 30 seconds. The best-case
scenario is that, any incidents are fixed quickly, keeping the number of
affected users to a minimum.

### Monitor 3rd parties integrations

API integrations like payment processing, site search, recommendation plugins,
CRMs or analytics are integral in many modern applications.

Monitoring their functionality is necessary to accommodate for any performance
degradations or downtime incidents. Monitoring them is also essential in both
incident communication to your users and holding your vendors accountable.
Although some vendors have [public status pages](https://betterstack.com/community/guides/incident-management/status-page-examples/), like
[status.stripe.com](https://status.stripe.com/) it's always better to
double-check.

![Stripe status page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/62b351b8-a71a-42e2-a992-d8fd3bc9c800/public =973x700)

### Measure SLAs guarantee

Service level agreements (SLAs) are an essential part of enterprise offerings
for many software businesses. Outbidding a competitor with better availability
can play a decisive role in the sales process.

Vendors can use uptime monitoring to arm themselves with data showing adherence
to their SLAs. While their clients can do the same to get paid penalties when
the SLAs are not adhered to.

### Benchmark and plan improvements

By consistently running over a long period of time API monitoring gives a unique
insight into apps performance - specifically availability and latency. This set
of historical data allows to benchmark against competitors or older versions of
the same apps or products.

## What are the main benefits and drawbacks of API monitoring?

### Benefits

- **Automated with regular frequency:** API monitors can run every minute, every
  hour, 24 hours a day, 7 days a week, the whole year. It’s a fully automated
  script and once set it needs little to no maintenance, while still providing
  the same valuable information.
- **Simple to set up and use:** Monitors for any API URL can be set up in
  minutes while providing the functionality information right from the start.
  Since it offers wide options for setups (request types, authorization etc.) it
  can be applied widely across APIs of different use cases.
- **Global testing:** It allows for testing from different endpoints around the
  world. This allows distinguishing regional errors from incidents affecting all
  users and allows for optimization for a global audience.

### Drawbacks

- **Limited downtime cause reporting:** API monitoring lacks the information
  that could answer why the incident happened. Since it only monitors the final
  output and not the actual workings of the app. To get better idea about the
  root cause, application performance management (APM) or a
  [log management](https://betterstack.com/logtail) tool needs to be used.

## Where does API monitoring fit in the synthetic monitoring setup?

API monitoring is an important part of the [synthetic
monitoring](https://betterstack.com/community/guides/monitoring/what-is-synthetic-monitoring/) toolbox for anyone with a public API.
When it comes to website monitoring, API checks are ideally accompanied by
regular [uptime monitoring](https://betterstack.com/community/guides/monitoring/what-is-uptime-monitoring/) as well as [SSL
certificate checks](https://betterstack.com/community/guides/monitoring/what-is-ssl-certificate-monitoring/) and [domain expiration
checks](https://betterstack.com/community/guides/monitoring/what-is-domain-expiration-monitoring/) to prevent any security issues or
loss of valuable business assets respectively.

Synthetic monitoring also offers monitoring options like checking specific
ports, [DNS](https://betterstack.com/community/guides/monitoring/what-is-dns-monitoring/) or Transaction monitoring. Check [22 synthetic monitoring tools](https://betterstack.com/community/comparisons/synthetic-monitoring-tools/) we have tested ourselves. 

## How to start API monitoring in 2 minutes with Better Uptime?

[Better Uptime](https://betterstack.com/better-uptime) is an infrastructure monitoring tool
that offers API monitoring. Here is how to get notified whenever an API URL
doesn’t return response for `GET` request including the word `data`.

- **[Once signed up](https://betteruptime.com/users/sign-up)**, head
  to *Monitors → Create monitor*
- Enter your API URL in the **URL to monitor** field
- Change *Alert us when the host above selection* to **Doesn't contain a
  keyword**
- Enter your keyword (eg. `data`) in the **Keyword to find in page** input
- **Select an authentication method**: either use _Basic access authentication_
  or _Bearer token authentication_
- Select the way how you want to get alerted, be it a phone call, Slack
  notification or an email
- Click create monitor

For more information, explore
[Better Uptime docs](https://docs.betteruptime.com/).
