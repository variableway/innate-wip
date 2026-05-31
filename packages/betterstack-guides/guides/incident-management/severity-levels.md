# What Are Incident Severity Levels? (SEV1 to SEV3 explained)

**Not all incidents are created equal — prioritizing incidents based on the
impact they have on your business improves collaboration and makes for faster
incident resolution.**

**But how do you prioritize incidents?**

**Enter severity levels.**

## What are severity levels?

Severity levels is a measurement of the impact an
[incident](https://betterstack.com/community/guides/incident-management/what-is-incident-management/) has on your business. Commonly used
severenity ranking is from SEV 1 (severity 1) to SEV 3 (severity 3), where SEV 1
is a critical incident and SEV 3 is a minor incident.

**SEV 1 incident** could be a situation when a service is down for all users or
customers, when there has been a major security breach or when customer data are
lost. A SEV 1 is defined as a critical incident with high impact on the
business.

**SEV 2 incident** could be a situation when a significant part of the core
functionality is not-working or when a service is unavailable for a subset of
users or customers. A SEV 2 is defined as a major incident with significant
impact on the business.

**SEV 3 incident** could be a situation when a system issue causes a slight
inconvenience to the users or customers, but doesn’t influence any major system
functions. A SEV 3 is defined as a minor incident with low impact on the
business.

| Severity | Description                            | Example                                         |
| -------- | -------------------------------------- | ----------------------------------------------- |
| SEV 1    | Critical incident with high impact     | A service is down for all customers             |
| SEV 2    | Major incident with significant impact | A service is down for a sub-set of customers    |
| SEV 3    | Minor incident with low impact         | A bug is creating an inconvenience to customers |

The levels can go beyond SEV 3. At larger organisations SEV 4 and SEV 5 are
often used. The number of severity levels can be determined by each
organisation, but 3 levels are generally enough. More severity levels can lead
to confusion and more time spent on accessing which severity level an incident
is instead of actually going forward and start working on the resolution.

## Why are severity levels used?

Severity levels isn't just just fancy speak of DevOps teams. SEV levels put
everyone on the same page when an incident happens and can significantly improve
the [incident response time](https://betterstack.com/community/guides/incident-management/mttr-and-other-incident-metrics/).

Main benefit of using severity levels is that a team can connect a level to a
specific process or automation so whenever such incident occurs no improvisation
is necessary and pre-made workflows are started.

For example a SEV 1 incident could be connected to an immediate [status
page](https://betterstack.com/community/guides/incident-management/what-is-status-page/) update and to alerting an c-level company executives.
A SEV 3 incident on the other hand can be connected to a much low-level workflow
— for example a ticket being created in Jira.

## Severity vs. Priority, what’s the difference?

In most cases, severity = priority.

The more severe the incident is, the more of a priority it is for the developer
team. An infrastructure incident that takes down the whole company online
presense is the highest priority for the DevOps team right away. But in some
cases, you can have a high-priority incident that is not high in severity.

For example, if a recent homepage edit causes that the h1 title tag is not
formatted properly, it’s certainly not very severe as the core functionality is
not affected. However, it’s a high priority because it can damage the brand
image of the company and cause confusion among current or potential customers.

Similarly, you can have high-severity, but low-priority incidents. For example
an incident that’s is making your product unavailable for 0.01% of all your
customers has a critical impact, because it’s making the product unusable. But
it’s low-priority because it’s only influencing a very small subset of
customers.

Because these _low-severity + high-priority_ and _high-severity + low-priority_
incidents exist we need to distinguish the differences between severity and
priority:

- **Severity** measures the impact an incident has on the business — It answers
  questions about the **consequences of an incident**.
- **Priority** measures incident’s urgency — It answers questions about **what
  should be fixed first**.

The fact that priority tells us what should be fixed first it’s usually better
to focus on working with priorities instead of severity levels. Let’s have a
look how the priority levels first approach looks like.

## How to use priority levels?

Priority levels work same as severity levels when it comes to numbering. The
lower the number the more priority the incident has.

The main difference is that priority level tells us what incident needs to be
solved first, instead of just stating which incident is the most severe (has the
most impact).

| Priority | Description                                                | Example                                          |
| -------- | ---------------------------------------------------------- | ------------------------------------------------ |
| P1       | Critical incident that needs to be addressed immediatelly. | A service is down for all customers.             |
| P2       | Major incident that needs to be addressed quickly.         | A service is down for a sub-set of customers.    |
| P3       | Minor incident that can be handled within working hours.   | A bug is creating an inconvenience to customers. |

## Simplyfying things: issues with P1 and SEV 3

Severity and priority levels are great in theory, but in practise they are often
too complicated. The main reason for having a severity levels setup is to
simplify incident communication within a team, not to complicate it. The goal is
to say P1 or SEV 3 and get everyone on the same page immediatelly.

This is sadly often not the case. Especially in high stress situations like
being waken up by an [on-call alert](https://betterstack.com/community/guides/incident-management/on-call-scheduling/) in the middle of the
night. Similarly less technical people might think of SEV 3 as the highest
severity level, while it’s the lowest.

To simplify this we can switch to only using human words. This means that
instead of using code words like SEV 1, we can use regular words like _critical
incident_ for all SEV 1 or P1 incidents.

Here is how an alternative naming could look like:

| Standardized code word | Alternative naming |
| ---------------------- | ------------------ |
| P1 or SEV 1            | Critical incident  |
| P2 or SEV 2            | Major incident     |
| P3 or SEV 3            | Minor incident     |

## Defining incident levels with examples

Another way to make incident levels more approachable is to define them with
real-life examples relevant to your specific product. For example if you are
running an Airbnb competitor you could define incident levels as following:

| Priority | Airbnb competitor definition (example)                                                                                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | At least 10% of users can’t book new stay and/or at least 10% of current customers can sign in and manage their bookings.<br><br> Privacy of confidential customer information was breached.<br><br> Some customers loss data about their bookings.   |
| P2       | Maximum of 10% of user can’t book new stay and/or maximum 10% of current customers can sign in and manage their bookings.<br><br>All customers can’t reschedule or change their bookings.<br><br>New users can’t add more people when booking a stay. |
| P3       | Some of search filters are not working properly when new users pick new bookings.<br><br>Site is slower when loading images in listings.                                                                                                              |

This example is simplified, but the essence is that with this table any
technical or non-technical team member has a very clear understanding what kind
of incident is the company facing.

## Final thoughs

Using severity, priority or just alternative human worded incident levels is a
great way to step up your incident management.

But keep in mind that any incident levels are only as good as the workflows that are connected with them.
And that real-life definitions and examples from your business are the key to
the success of any incident levels implementation.

Learn more about how to improve your incident response:

- [Explained: All Meanings of MTTR and Other Incident
  Metrics](https://betterstack.com/community/guides/incident-management/mttr-and-other-incident-metrics/)
- [How to Create a Developer-Friendly On-Call Schedule in 7
  steps](https://betterstack.com/community/guides/incident-management/on-call-scheduling/)
- [4 Copy-Pastable Incident Templates for Status Pages](https://betterstack.com/community/guides/incident-management/incident-templates/)
