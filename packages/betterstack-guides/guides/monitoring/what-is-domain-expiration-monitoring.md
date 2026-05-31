# What is Domain Expiration Monitoring?

**Domain expiration monitoring is an automated way of checking the domain
expiration date.** When the given domain is about to expire, domain expiration
monitoring spots it and alerts the right person on the development team.

[![Better Uptime Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/55594fcc-5410-4421-5e0e-cc5728fd9b00/public =1247x768)](https://betterstack.com/better-uptime/)

[summary]
<h3>🔭 Want to get alerted before your domain expires?</h3>
<p>Go to <a href="https://betterstack.com/better-uptime/" target="_blank">Better Uptime</a> and start with domain monitoring in 2 minutes.</p>
[/summary]

## How does domain expiration monitoring work?

The domain expiration monitoring process works by **sending automated requests
at a pre-defined frequency to the desired domain and checking for the expiration
date**. A request like `Whois` is used to get the expiration date saved in the
[domain name registrar.](https://en.wikipedia.org/wiki/Domain_name_registrar)

When the return expiration date is within a specific timeframe (for example 60
or 30 days before expiry) the monitor starts what is called an incident and
starts alerting according to the [on-call calendar](https://betterstack.com/community/guides/incident-management/on-call-scheduling/).

## How to check when a specific domain expires?

To check for a specific domain expiration you can use the
[who.is](http://who.is) tool. In the results look for the `Expires On` in the
important dates section (see the example below).

![Whois](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a67591fe-2440-494d-c419-890be53cae00/public =805x232)

## How to receive domain expiration alerts?

After an incident is spotted by the monitor (script checking a domain) it needs
to be communicated to the admins. This process is called [incident alerting or
on-call alerting](https://betterstack.com/community/guides/incident-management/what-is-incident-management/). This is because, in case of an
incident, the person from a team who is currently on-call (has scheduled duty)
receives the downtime alert.

The most common types of getting alerted by an domain expiration monitor include
automated phone calls, SMS, Slack, and Microsoft Teams messages. Ways of
alerting depend on factors like the importance of the monitored domain, time of
the day, and team preference.

## Why use domain expiration monitoring?

### Protect valuable business assets

Domain expiration monitoring is a fully automated process that can run every day
without any need for manual action. It is easy to set up and maintain monitoring
practice that protects from losing any domain assets due to expiration.

### Extra layer of protection

Domain registration companies tend to notify their users of any domains that are
expiring soon. However, those alerts are usually via email and can get lost.
Connecting those expiration alerts to on-call alerting can provide extra layer
of protection and prevent missing those vital alerts.

### Domain management at scale

Large companies that manage hundreds of domains are often using external
expiration monitoring to make sure all teams manage their domains properly and
no business assets are lost.

### Domain management for clients

Agencies and consultants often tend to manage and consult for businesses with
domains they don’t own. Having the option to monitor whether their clients
manage their domains properly is often highly desired.

### New domain acquisition

Sometimes there are domains that are about to expire and you want to get alerted
when it happens in order to acquire them. Expiration monitoring can help with
this use-case as well.

## Where does domain expiration monitoring fit in the synthetic monitoring setup?

Domain expiration monitoring is a useful addition to other [synthetic
monitoring](https://betterstack.com/community/guides/monitoring/what-is-synthetic-monitoring/) setups like [uptime
checks](https://betterstack.com/community/guides/monitoring/what-is-uptime-monitoring/) or [SSL certificate
checks](https://betterstack.com/community/guides/monitoring/what-is-ssl-certificate-monitoring/). Best practice for monitoring
websites is to connect domain expiration checks with uptime and SSL checks in
order to get the full picture about the status of the given site.

Synthetic monitoring also offers advanced monitoring options like [checking an
API](https://betterstack.com/community/guides/monitoring/what-is-api-monitoring/), [DNS](https://betterstack.com/community/guides/monitoring/what-is-dns-monitoring/) or Transaction
monitoring.

## How to start domain expiration monitoring in 2 minutes with Better Uptime?

**[Better Uptime](https://betterstack.com/better-uptime)** is a synthetic monitoring tool
that offers a wide range of monitoring options including domain expiration
monitoring. Here is how to get notified whenever a domain is about to expire in
the next 14 days.

- **[Once signed up](https://betteruptime.com/users/sign-up)**, head
  to *Monitors → Create monitor*
- Enter your URL in the URL to monitor the text field, let’s make it
  `example.com`
- Select the way how you want to get alerted, be it a phone call, Slack
  notification, or an email
- Click Advanced settings
- Go to domain expiration dropdown and select `Alert 14 days before`
- Click create monitor

For more information, explore
[Better Uptime docs](https://docs.betteruptime.com/).
