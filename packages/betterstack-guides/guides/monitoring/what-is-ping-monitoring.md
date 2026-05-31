# What is Ping Monitoring?

**Ping monitoring is an automated way of checking whether an internet
destination such as an IP or a domain address responds to ping.** When service
becomes unavailable or stops responding during an outage (downtime), ping
monitoring spots the issue and alerts the right person on the development team.

[![Better Uptime Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/55594fcc-5410-4421-5e0e-cc5728fd9b00/public =1247x768)](https://betterstack.com/better-uptime/)

[summary]
<h3>🔭 Want to get alerted when your server stops responding to ping?</h3>
<p>Go to <a href="https://betterstack.com/better-uptime/" target="_blank">Better Uptime</a> and start with ping monitoring in 2 minutes.</p>
[/summary]

## How does ping monitoring work?

The ping monitoring process works by **sending automated ICMP echo requests at a
pre-defined frequency to the desired destination and checking for the desired
response**. The pre-defined frequency depends on the specific user's need but
generally ranges anywhere from 30 seconds for business use-cases up to 10 or
more minutes for hobby projects.

The desired response from the monitored destination is the reply, where no
packets were lost. If the correct reply is received no further action is taken
and the monitoring continues. When the ping doesn’t receive a reply, the monitor
starts what is called a downtime incident and starts alerting according to the
[on-call calendar](https://betterstack.com/community/guides/incident-management/on-call-scheduling/).

[note]
<h3>💡 What is an ICMP echo request and an ICMP echo reply?</h3>

<p><a href="https://en.wikipedia.org/wiki/Internet_Control_Message_Protocol" target="_blank">ICMP</a> stands for <i>Internet Control Message Protocol.</i> It supports the communication between particular end-points on the internet network, including your device connected to the internet.</p>

<p>Control messages used by ICMP provide communication feedback between two destinations on the internet. Communication has two phases: echo-request and echo-reply. The first device sends the message to the destination requesting the reply. The destination gets the message and replies back to the sender. That's what we call the echo-reply. The ICMP messages were designed to help identify network issues and the accessibility of the devices on the internet.</p>
[/note]

## What is a downtime incident?

A downtime incident is a period of time during which a given destination is not
responding to ping. This is how a ping response would look like in terminal if
[Cloudflare DNS](https://1.1.1.1/) was down for example.

```bash
[output]
PING 1.1.1.1 (1.1.1.1) 56(84) bytes of data.
From 169.154.0.0 icmp_seq=1 Destination Host Unreachable
From 169.154.0.0 icmp_seq=2 Destination Host Unreachable
From 169.154.0.0 icmp_seq=3 Destination Host Unreachable
From 169.154.0.0 icmp_seq=4 Destination Host Unreachable
From 169.154.0.0 icmp_seq=5 Destination Host Unreachable
--- 1.1.1.1 ping statistics ---
5 packets transmitted, 0 received, +5 errors, 100% packet loss, time 9ms
pipe 3
```

A downtime incident can be also a situation where the request sent by the ping
monitor doesn’t receive a response in a given time frame. The request timeout
can be anywhere from 5 seconds to 1 minute, depending on the priority of the
monitor. Setting the monitor sensitivity correctly is key in avoiding large
amounts of alerts.

## How to receive downtime incident alerts?

After an incident is spotted by the [ping monitoring
tool](https://betterstack.com/community/comparisons/ping-monitoring-tools/) it needs to be communicated to you. This process is
called [incident alerting or on-call alerting](https://betterstack.com/community/guides/incident-management/what-is-incident-management/).
On-call (or on-call calendar) is basically a scheduled duties calendar that
defines which team member is responsible for incoming incidents.

The most common types of getting alerted by a ping monitor are automated phone
calls, SMS, Slack, and Microsoft Teams messages. Ways of alerting depend on
factors like the importance of the monitored service, time of the day, and team
preference. For example push notifications or emails are generally used for less
vital monitors.

## What information do ping alerts include?

Ping alerts include information about what monitor went down and when. It also
includes information about the error that triggered the incident, specifically
the details about received packages. There are 3 situations that can cause a
ping incident:

- The host doesn’t respond to ping.
- No packets are returned.
- There is partial packet loss.

Downtime alerts also include a call to action for the on-call person to take.
Those usually include the option to acknowledge the incident or to view the
incident.

## Process after receiving an alert? The downtime incident resolution process

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

## Why use ping monitoring?

### Fix issues before they affect your users

Ping monitoring is a fully automated process that can run as often as every 30
seconds, which helps to discover any issues right away. In a best-case scenario,
any downtime is fixed quickly, keeping the number of affected users to a
minimum.

### Investigate network issues

Ping is the most basic way of checking IPs availability and is the first thing
to check when troubleshooting unknown downtime errors. Compared to more complex
ways of monitoring like [HTTP monitoring](https://betterstack.com/community/guides/monitoring/what-is-uptime-monitoring/) or [API
monitoring](https://betterstack.com/community/guides/monitoring/what-is-api-monitoring/) it gives a basic network situation overview
so any investigation can start from there.

### Benchmark and plan improvements

By consistently running over a long period of time ping monitoring gives a
unique insight into apps performance - specifically uptime and response times
(round-times). This set of historical data allows to benchmark against
competitors or older versions of the same apps or products. Here is an example
of spiked response times in the Asia region shown by the
[Better Uptime](https://betterstack.com/better-uptime) dashboard.

![Better Uptime global testing dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ac3529fb-e9fb-4ce9-ae2f-9db17cbf9d00/public =974x524)

## What are the main benefits and drawbacks of ping monitoring?

### Benefits

- **Automated with regular frequency:** Ping monitoring can run every minute,
  every hour, 24 hours a day, 7 days a week, the whole year. It’s a fully
  automated script and once set it needs little to no maintenance, while still
  providing the same valuable information.
- **Simple to set up and use:** Monitors for any IP or address can be set up in
  minutes while providing the availability information right from the start.
  Since it provides simple up/down information it can be applied widely across
  websites, apps, servers and more.
- **Global testing:** It allows for testing from different endpoints around the
  world. This allows distinguishing regional errors from incidents affecting all
  users and allows for optimization for a global audience.
- **Lower layer monitoring:** Ping monitoring allows you to create dedicated
  monitors for your database, email client, or website and check them
  separately, instead of having a single monitor for an entire system.

### Drawbacks

- **Limited downtime cause reporting:** Ping monitoring lacks the information
  that could answer why the downtime happened. Since it only monitors the final
  output and not the actual workings of the app. To get a better idea about the
  root cause, application performance management (APM) or a
  [log management tool](https://betterstack.com/logtail) needs to be used.
- **Limited functionality monitoring:** Since it only monitors a specific IP
  status it can miss smaller issues that don’t cause downtime, but still
  significantly interfere with the user experience. For example, a website is
  available but a significant part doesn’t work correctly, to monitor functions
  other tools like [API monitoring](https://betterstack.com/community/guides/monitoring/what-is-api-monitoring/), transaction
  monitoring, or [keyword monitoring](https://betterstack.com/community/guides/monitoring/what-is-uptime-monitoring/) within uptime
  checks need to be used.

## Where does ping monitoring fit in the synthetic monitoring setup?

Ping monitoring is the main but not the only part of the [synthetic
monitoring](https://betterstack.com/community/guides/monitoring/what-is-synthetic-monitoring/) toolbox. When it comes to monitoring,
ping checks of servers, DNS or IP addresses are ideally accompanied by regular
[uptime checks](https://betterstack.com/community/guides/monitoring/what-is-uptime-monitoring/). This provides better visibility into
functionality of monitored services.

When dealing with public websites [SSL certificate
checks](https://betterstack.com/community/guides/monitoring/what-is-ssl-certificate-monitoring/) and [domain expiration
monitoring](https://betterstack.com/community/guides/monitoring/what-is-domain-expiration-monitoring/) is recommended to prevent any
security issues or loss of valuable business assets.

## How to start monitoring ping in 2 minutes with Better Uptime?

[Better Uptime](https://betterstack.com/better-uptime) is an infrastructure monitoring tool
that offers reliable ping monitoring. Here is how to get notified whenever an IP
address becomes unavailable (doesn't respond to ping).

- [Once signed up](https://betteruptime.com/users/sign-up), head to _Monitors →
  Create monitor_
- Change _Alert us when the host above selection_ to **Doesn't respond to ping**
- Enter your IP address in the monitor text field, let’s make it `1.1.1.1` for
  example
- Select the way how you want to get alerted, be it a phone call, Slack
  notification or an email
- Click create monitor

For more information, explore
[Better Uptime docs](https://docs.betteruptime.com/).
