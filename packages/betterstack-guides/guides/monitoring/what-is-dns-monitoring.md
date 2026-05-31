# What is DNS Monitoring?

**[DNS](https://en.wikipedia.org/wiki/Domain_Name_System) (Domain Name System)
monitoring is an automated way of checking whether a domain name is being
correctly translated to a corresponding IP address.** When a DNS server doesn't
respond or when the searched domain doesn’t return the right IP address, the DNS
monitoring spots the issue and alerts the right person on the development team.

[![Better Uptime Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/55594fcc-5410-4421-5e0e-cc5728fd9b00/public =1247x768)](https://betterstack.com/better-uptime/)

[summary]
<h3>🔭 Want to get alerted when your DNS stops working correctly?</h3>
<p>Go to <a href="https://betterstack.com/better-uptime/" target="_blank">Better Uptime</a> and start with DNS monitoring in 2 minutes.</p>
[/summary]

## How does DNS monitoring work?

The DNS monitoring process works by **sending automated requests to the desired
DNS server and checking the results for a specific domain name.** The most
common use case is querying the DNS server with a URL and checking the returned
IP address returned in the `A Record` or `AAAA Record`.

The desired response for those queries is the correct IP address corresponding
to the used URL. For example, when checking the URL `google.com`, we are looking
for a response that includes IP `172.217.23.238`.

When the correct IP is received no further action is taken and the monitoring
continues. When a different one is returned, the monitor starts what is called a
DNS incident and starts alerting according to the [on-call calendar](https://betterstack.com/community/guides/incident-management/on-call-scheduling/).

## How to look up DNS records of a specific domain?

To check a DNS server for specific domain records you can use the
[DNS checker tool](https://dnschecker.org/all-dns-records-of-domain.php). In the
results look for the record type you are interested in (see the example below).

![DNS checker tool](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/10b51eb9-8ff5-45d5-1374-0518565ace00/public =1283x428)

[note]
<h3>🗃 What are the most used DNS servers?</h3>
<p>There are several providers of DNS servers, the most commonly used are:</p>
<ul>
<li><a href="https://developers.google.com/speed/public-dns" target="_blank">Google DNS</a> servers: <code class="prettyprint">8.8.8.8</code> and <code class="prettyprint">8.8.4.4</code></li>
<li><a href="https://www.cloudflare.com/en-gb/learning/dns/what-is-1.1.1.1/" target="_blank">Cloudflare DNS</a> servers: <a href="http://1.1.1.1/" target="_blank"><code class="prettyprint">1.1.1.1</code></a> and <a href="https://1.0.0.1/" target="_blank"><code class="prettyprint">1.0.0.1</code></a></li>
<li><a href="https://www.opendns.com/" target="_blank">OpenDNS DNS</a> servers: <code class="prettyprint">208.67.222.222</code> and <code class="prettyprint">208.67.220.220</code></li>
</ul>

<h3>📌 What records do DNS servers store?</h3>
<p>DNS servers store much more than just domain to IP translations. The most commonly used <a href="https://en.wikipedia.org/wiki/List_of_DNS_record_types" target="_blank">DNS records</a> are:</p>
<ul>
<li><strong>A record (Address record) -</strong> Specifies the IP (<a href="https://en.wikipedia.org/wiki/IPv4" target="_blank">IPv4</a>) of your domain, such as <code class="prettyprint">172.217.23.238</code>. It&#39;s important to monitor that the record matches the IP and vice versa. Non-matching data can signify an error or spoofing attack.</li>
<li><strong>AAAA record (IPv6 address record) -</strong> Specifies the <a href="https://en.wikipedia.org/wiki/IPv6" target="_blank">IPv6</a> of your domain, like <code class="prettyprint">2606:4700:3108::ac42:285e</code>. It should be also checked regularly that it matches the records.</li>
<li><strong>CNAME record (Canonical name record) -</strong> Specifies the aliases on the given domain. Monitoring CNAME records ensures that users are directed to the correct site.</li>
<li><strong>MX record (Mail exchange record) -</strong> Provides information about your mail server. Monitoring the MX record informs you when the mail communication gets interrupted.</li>
<li><strong>NS record (Nameserver record) -</strong> Provides information about which nameserver should be used by the resolver for the domain. It can also include backup nameservers in case of a failure of the primary server.</li>
<li><strong>SOA record (Start of authority) -</strong> Provides a serial number that is updated at every DNS record adjustment. With every change 1 is added to the serial number. Monitoring the SOA record helps to monitor for any unwanted DNS changes.</li>
<li><strong>TXT record (Text record) -</strong> Holds information about domain’s ownership, such as contact person information, phone numbers, etc.</li>
</ul>
[/note]

## What is a DNS incident?

A DNS incident is a period of time during which a given DNS is unavailable or
returns incorrect records.

A DNS incident can be also a situation where the request sent by the monitor
doesn’t receive a response in a given time frame. The request timeout can be
anywhere from 5 seconds to 1 minute, depending on the priority of the monitor.

## How to receive DNS incident alerts?

After an incident is spotted by the DNS monitor it needs to be communicated to
the service admins. This process is called [incident alerting or on-call
alerting](https://betterstack.com/community/guides/incident-management/what-is-incident-management/). This is because, in case of an incident,
the person from a team who is currently on-call (has scheduled duty) receives
the incident alert.

The most common types of getting alerted by a DNS monitor include automated
phone calls, SMS, Slack, and Microsoft Teams messages. Ways of alerting depend
on factors like the importance of the monitored service, time of the day, and
team preference.

## Process after receiving an alert? The DNS incident resolution process

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

The next steps in the incident resolution process are individual to different
teams and apps. For larger teams, they can include collaborations between a few
developers or even teams of developers, delegations of incidents to dedicated
team members, and more. There are some best practices that should be used by all
teams managing incidents. These include incident communication (both internal
and external) and incident post-mortems.

## Why use DNS monitoring?

Monitoring of DNS increases your service reliability and security. It is very
efficient in the detection of some common hacker attacks. There are two
well-known attacks, which can be detected by DNS monitoring:

- **DDoS attack** — DDoS (Distributed Denial of Service) is an attack, where a
  lot of computers across the world generate a large amount of request to a
  specific internet service (in our case, requests to a specific DNS server).
  The DNS is congested with fake requests and real users cannot use it. DNS
  monitoring can detects DNS unavailability or unacceptable response time.
- **DNS poisoning** — Is an attack where hackers falsify DNS records related to
  your domain. They can't directly change the DNS records of your domain. But
  there are advanced attacks, which allow that user browser receives a fake
  (poisoned) response. You can monitor the content of the DNS response and check
  if it is correct.

## What are the main benefits and drawbacks of DNS monitoring?

### Benefits

- **Automated with regular frequency:** DNS monitoring can run every minute,
  every hour, 24 hours a day, 7 days a week, the whole year. It’s a fully
  automated script and once set it needs little to no maintenance, while still
  providing the same valuable information.
- **Simple to set up and use:** DNS monitoring can be set up in minutes while
  providing the availability information right from the start.
- **Global testing:** It allows for testing from different endpoints around the
  world. This allows distinguishing regional errors from incidents affecting all
  users and allows for optimization for a global audience.

### Drawbacks

- **Limited incident cause reporting:** DNS monitoring lacks the information
  that could answer why any issues happened. Since it only monitors the final
  output and not the actual workings of the DNS settings. To get better idea
  about the root cause, application performance management (APM) or a
  [log management tool](https://betterstack.com/logtail) needs to be used.

## Where does DNS monitoring fit in the synthetic monitoring setup?

DNS monitoring is one of the more advanced [synthetic
monitoring](https://betterstack.com/community/guides/monitoring/what-is-synthetic-monitoring/) options. It’s commonly used by
advanced users as a tool for monitoring potential hacker attacks.

When it comes to website monitoring, DNS checks should be set up after basic
[uptime monitoring](https://betterstack.com/community/guides/monitoring/what-is-uptime-monitoring/) (ideally accompanied by [SSL
certificate](https://betterstack.com/community/guides/monitoring/what-is-ssl-certificate-monitoring/) and [domain expiration
checks](https://betterstack.com/community/guides/monitoring/what-is-domain-expiration-monitoring/)).

When setting up a [DNS monitoring tool](https://betterstack.com/community/comparisons/dns-monitoring-tools/) it might be useful
to also explore other advanced monitoring options like
[API](https://betterstack.com/community/guides/monitoring/what-is-api-monitoring/) or TCP/UDP port monitoring.

## How to start DNS monitoring in 2 minutes with Better Uptime?

**[Better Uptime](https://betterstack.com/better-uptime)** is an infrastructure monitoring
tool that offers reliable DNS monitoring. Here is how to get notified whenever a
Cloudflare DNS server doesn’t return `172.217.23.238` IP for `google.com` query.

- **[Once signed up](https://betteruptime.com/users/sign-up)**, head
  to *Monitors → Create monitor*
- Change *Alert us when the host above selection* to **DNS server doesn’t
  respond**
- Enter your DNS server to monitor in the text field, let’s make it `1.1.1.1` to
  check the Cloudflare DNS server
- Enter `google.com` as the domain that will be checked
- Enter `172.217.23.238` in the _Keyword to find in the DNS response_ to check
  the DNS response for this IP
- Select the way how you want to get alerted, be it a phone call, Slack
  notification or an email
- Click create monitor

For more information, explore
[Better Uptime docs](https://docs.betteruptime.com/).
