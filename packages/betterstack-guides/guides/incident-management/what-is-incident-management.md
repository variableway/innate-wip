# What Is Incident Management? Beginner’s Guide

**Incident management** is the process used by developer and IT operations teams
to respond to system failures (incidents) and restore normal service operations
as quickly as possible.

**Incident** is a broad term describing any event that causes either a decrease
in the quality or complete disruption of a given service. Incidents usually
require immediate response of the development or operations team, often referred
to as [on-call](https://betterstack.com/community/guides/incident-management/on-call-scheduling/) or response teams in incident management.

[![Better Uptime Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a0d98078-b9ad-4614-434d-4bcc76455200/public =1247x768)](https://betterstack.com/better-uptime/)

[summary]
<h3>🔮 Want to collaborate on solving incidents from one place?</h3>
<p>Go to <a href="https://betterstack.com/better-uptime/" target="_blank">Better Uptime</a> and start managing your incidents in 2 minutes.</p>
[/summary]

## Why is incident management important?

Incident management is an absolutely vital process for any organization that
aims to provide reliable service to its customers. Service outages usually come
with significant costs to the business, and teams need to have a solid strategy
to deal with them efficiently.

[note]
<h3>🔻 Real cost of downtime</h3>
<p>Facebook downtimes in the last few years are a great example of just how big of an impact outages have. In 2019 Facebook platform didn't work for 14 hours. The cost of this incident is estimated to be around <a href="https://www.managementstudyguide.com/economic-impact-of-facebook-outage.htm" target="_blank">$90 million</a>. In another downtime in 2021, the cost amounted to <a href="https://www.forbes.com/sites/abrambrown/2021/10/05/facebook-outage-lost-revenue/?sh=17709351231a" target="_blank">$65 million</a> in just a few hours.</p>
[/note]

Incidents come at great costs, be it directly in the form of loss of potential
revenue and loss of current customers or indirectly in the form of degradation
of the company’s public image or increased stress for employees.

Well-crafted incident management process minimizes these negative effects and
allows teams to:

- **Detect and resolve** incidents quickly
- **Communicate** incidents to customers and stakeholders and minimize any
  negative effects
- **Collaborate** effectively to solve incidents at hand and decrease any
  barriers in the way
- **Learn** from past incidents to continuously improve and build more reliable
  systems

## Steps of the incident management process

Incident management processes tend to be quite different depending on the type
of the company. As different companies use different tools and systems, have
different customers and stakeholders, there is no one fits all process.

Companies with software products generally tend to have a more standardized
approach to incident management with the steps as follows:

## 1. Detecting the incident

The founding stone of any incident management is a centralized source of truth,
which integrates different monitoring and reporting tools into one easily
navigable place. [Incident management tools](https://betterstack.com/community/comparisons/incident-management-tools/) like
[Better Uptime](https://betterstack.com/better-uptime) allow for on-call, support, and other
teams to collaborate in detecting, communicating, and solving incidents.

There are two ways a new incident can be started within those incident
management solutions. First is fully automatic via a monitoring integration, for
example, an [uptime monitor](https://betterstack.com/community/guides/monitoring/what-is-uptime-monitoring/) creating an incident
when it spots that homepage is unavailable. The second is a manual report. For
example when a customer submits a support ticket that their profile is not
loading correctly.

### Automatic monitoring for incidents

In the case of automatically reported incidents, the incident management
solution creates an incident once a monitor reports an error. Once the incident
is logged, it needs to be communicated to the team - this is done by alerting
the current on-call team member.

Alerts usually come in the form of automated phone calls for major incidents.
Slack & Microsoft teams and email alerts are used for less mission-critical
incidents. To make for easier communication of incidents, [severity levels](https://betterstack.com/community/guides/incident-management/severity-levels/) are often used when describing incidents.

### Manually reported incidents

For manually reported incidents, the on-call person is alerted by other team
members. Those are often on support or customer success teams and will pass on
the incident report from customers.

Support and other teams responsible for reporting manual incidents usually
submit their incident reports either via calling the on-call number (a static
number that automatically reroutes the call to the current on-call person) or by
filling in an incident form (usually on a dedicated sharable URL).

Before alerting the on-call team with any manually reported incident, it’s
necessary always to check whether the issue is really due to a system failure or
whether there might be a misconfiguration on the client side. This saves the
on-call team time and prevents alert fatigue.

## 2. Communicating with stakeholders

After an incident is detected and communicated to the respective on-call person,
it’s necessary to communicate it both internally and externally. Incident
communication is not just acknowledging that an incident exists but also posting
any new findings that occur during the investigation and resolution of the
incident. The communication and incident resolution processes work very much in
tandem.

The best practice is to center any incident communication around a [status
page](https://betterstack.com/community/guides/incident-management/what-is-status-page/), as it allows for easy internal (using
password-protected pages with email subscriptions) as well as external
communications (using a public status page).

### Internal communication

Internal communication includes any teams within the company that might be
influenced by the incident. It can include sales, which might be giving demos of
non-functioning products, or marketing spending on online ads bringing traffic
to a landing page that is down.

The goal of internal incident communication is to align company operations so
that the company’s resources loss is minimized by the incident.

### External communication

External communication of incidents is helpful for [multiple
reasons](https://betterstack.com/community/guides/incident-management/what-is-status-page/); the two main ones are saving customer support
resources and maintaining trust with customers.

By establishing a company status page as the first place to look for any
incident information and by communicating clearly what is going on during each
incident, customers might restrain from bombarding customer support with
questions. And when done properly, customers might even appreciate the honesty
of your downtime communication.

## 3. Resolving the incident

After an incident is detected and communicated to the respective on-call person,
the investigation and resolution process can start. This process follows along
the lines of the scientific method:

- Observing what is happening and confirming that the observations are correct
- Exploring hypotheses about why is it happening
- Preparing and executing experiments that either prove or disprove the
  hypothesis
- Repeating until the incident is resolved

In an ideal scenario, the first on-call person is also the person who is able to
solve the given incident. According to the practice of “you build it, you run
it” the developers being on-call should be the same people who built the
software. Those team members are generally more able to solve any issues as they
have a much better understanding of the system.

In some cases however the current on-call team members are unable to resolve the
issue without other team members. In that case, it’s necessary to escalate the
incident to a relevant person, usually more senior or with specific expertise in
the affected system.

### Response team crisis room

In case of incidents when multiple people are needed to collaborate, it’s
necessary to set up team communication channels. It’s best to use a tool that is
normally used within the company so that everyone is familiar with it. Tools
like Slack, Microsoft Teams, or Zoom are a great fit.

Chat tools like Slack are useful as they create a timestamped incident timeline,
which can be later revisited for postmortem analysis and learnings as well as
for incident management KPIs (key performance indicators) like
[MTTR](https://betterstack.com/community/guides/incident-management/mttr-and-other-incident-metrics/).

Video call tools like Zoom are great because they allow for the fastest
communication between team members while also creating a shared mental picture
of the situation.

By having the whole incident response team on the same call, troubleshooting can
be done in real-time, keeping everyone on the same page and allowing for any
brainstorming of ideas as well.

## 4. Writing postmortems

Once the incident is resolved, it’s necessary to do a root causes analysis and
find out why did it happen and what can be done, so it doesn't occur in the
future.

Postmortems should be written for all major incidents. They should include a
detailed timeline of what happened and when. It’s important to include
timestamps of:

- Time when the first alert was received
- Time when the first incident communication went out (internal and external)
- Times when any status page updates were posted
- Times when remediations run (new deployments etc.)
- Time the incident was resolved

They should also include any learnings that came from the incident and what
changes can be applied to the system going forward to make it more resilient to
similar incidents.

## What tools to use for incident management?

- **Monitoring** - to know that something is wrong with your system, you need to
  have [monitoring solutions](https://betterstack.com/community/comparisons/website-monitoring-tools/) in place. Those can be
  [open-source tools](https://betterstack.com/community/comparisons/open-source-website-monitoring/) like
  [Prometheus](https://prometheus.io/) or commercial ones like Better Uptime.
- **Incident tracking** - to keep track of incidents across multiple services,
  it’s great to have an incident management tool that will serve as a single
  centralized source of truth.
- **On-call scheduling and alerting** - to always alert the right person on your
  team, you need a reliable on-call alerting, ideally with scheduling
  capabilities so you can practice on-call rotations. Most incident management
  tools like Better Uptime have this capability.
- **Chat room** - to keep a timestamped record of what was going on during an
  incident and have a real-time chat platform during the downtime - Slack or
  Microsoft Teams come in handy.
- **Video call** - to host a fast response call with all the team members
  involved, video call tools like Zoom or Around are vital.
- **Status page** - to communicate [incident updates](https://betterstack.com/community/guides/incident-management/incident-templates/) both
  externally and internally.
- **Documentation tool** - to centralize postmortem and use them as a learning
  resource in the future.
