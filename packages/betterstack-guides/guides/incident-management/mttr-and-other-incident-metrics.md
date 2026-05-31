# Explained: All Meanings of MTTR and Other Incident Metrics

## What is Mean time to recovery (MTTR)?

Mean time to recovery or mean time to restore is the average **time it takes to
recover from a product or system failure.**

It’s an essential metric in [incident management](https://betterstack.com/community/guides/incident-management/what-is-incident-management/)
as it shows how quickly you solve downtime incidents and get your systems back
up and running.

[note]
<h3>💡 &nbsp;Other meanings of MTTR</h3>
<p>MTTR usually stands for mean time to recovery, but it can also represent other metrics in the incident management process.</p>
<p>Because of its multiple meanings, it’s recommended to use the full names or be very clear in what is meant by it to prevent any misunderstandings.</p>
<p> The other 3 meanings of MTTR are:</p>
<ul>
  <li><b>Mean time to respond
  <li>Mean time to repair
  <li>Mean time to resolve</b>
</ul>
[/note]

<iframe width="100%" height="560"
src="https://youtube.com/embed/EfI5fqV0AeY?si=coco7wOWmavlXteI>"
title="YouTube video player"
frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>

## How to calculate MTTR?

Time to recovery (TTR) is a full-time of one outage - from the time the system
fails to the time it is fully functioning again. The average of all times it
took to recover from failures then shows the MTTR for a given system.

```
MTTR = sum of all time to recovery periods / number of incidents
```

_For example, if a system went down for 20 minutes in 2 separate incidents
during a course of a week, the MTTR for that week would be 10 minutes._

## Problems with MTTR

Mean time to recovery is often used as the ultimate incident management metric
and the north star KPI (key performance indicator) for many IT teams. It’s easy
to understand and provides a nice performance overview of the whole incident
management process.

However, it’s a very high-level metric that doesn't give insight into what part
of the process actually takes the most time. Since MTTR includes everything from
incident detection and alerting to repairs and resolution, it’s impossible to
say which part of the incident management process can or should be improved.

For example, high recovery time can be caused by incorrect settings of the
alerting system, which takes longer to alert the right person than it should.
But it can also be caused by issues in the repair process. Without more data,
it’s impossible to tell.

To solve this problem, we need to use other metrics that allow for analysis of
specific parts of the process. Let’s have a look.

## Mean time to respond (MTTR)

Mean time to respond is the average **time it takes to recover from a product or
service failure from the time the first failure alert** is received. The
difference between the mean time to recovery and mean time to respond gives the
time it takes for an alert to come in.

### How to calculate Mean time to respond?

The time to respond is a period between the time when an alert is received and
the resolution of the incident. The average of all incident response times then
gives the mean time to respond.

```
MTTR = sum of all time to respond periods / number of incidents
```

_For example, if you spent total of 40 minutes (from alert to fix) on 2 separate
incidents during a course of a week, the MTTR for that week would be 20
minutes._

### When to use Mean time to respond?

Mean time to respond helps you to see how much time of the recovery period comes
down to alerting systems and your team's repair capabilities - and access their
effectiveness.

There are two ways by which mean time to respond can be improved. First is
improving the speed of the system repairs - essentially decreasing the time it
takes from when the repairs start to when the system is back up and working.
This can be achieved by improving incident response playbooks or using better
error analytics or logging tools for example.

The second is by increasing the effectiveness of the alerting and escalation
process. This is because MTTR includes the timeframe between the time first
alert to the time the team starts working on the repairs. This time is called
Mean time to acknowledge (MTTA) and shows how effective is the alerting process.

Alerting people that are most capable of solving the incidents at hand or having
a [backup on-call person](https://betterstack.com/community/guides/incident-management/on-call-scheduling/) to step in if an alert is not acknowledged soon enough
are two ways of improving MTTA and consequently the Mean time to respond.

[note]
<h3>📖 &nbsp;What is an incident response playbook?</h3>
<p>A playbook is a set of practices and processes that are to be used during and after an incident.</p>
<p>It usually includes roles and responsibilities of the team, a writeup of workflows and checklist to go by during an incident as well as guides for the postmortem process.</p>
[/note]

## Mean time to repair (MTTR)

Mean time to repair is the average **time it takes to repair a system**. In
comparison to mean time to respond, it starts not after an alert is received,
but when the incident repairs actually begin.

### How to calculate Mean time to repair?

The time to repair is a period between the time when the repairs begin and when
they finish, and the system is fully operational again. The average of all
incident repair times then gives the mean time to repair.

```
MTTR = sum of all time to repair periods / number of incidents
```

_For example, if you spent total of 120 minutes (on repairs only) on 12 separate
incidents during a course of a week, the MTTR for that week would be 10
minutes._

### When to use Mean time to repair?

This metric is useful when you want to focus solely on the performance of the
team regarding the speed of the repairs. Depending on the specific use case it
might or might not include any time spent on diagnostics.

Having separate metrics for diagnostics and for actual repairs can be useful,
however in many cases those two go hand in hand. For example when the cause of
the incident is unknown, different tests and repairs are necessary to be done
several times before finding the root cause. For such incidents including
diagnostics together with repairs in a single Mean time to repair metric is the
only possible option.

## Mean time to resolve (MTTR)

Mean time to resolve is the average **time it takes to resolve a product or
service failure. The resolution is defined as a point in time when the cause of
an incident is identified and fixed.** This incident resolution prevents similar
incidents from occurring in the future.

### How to calculate Mean time to resolve?

The time to resolve is a period between the time when the incident begins and
the resolution of the specific incident. The average of all incident resolve
times then gives the mean time to resolve.

```
MTTR = sum of all time to resolve periods / number of incidents
```

_For example, if you spent total of 10 hours (from outage start to deploying a
fix of the root cause) on 2 separate incidents during a course of a month, the
MTTR for that month would be 5 hours._

### When to use Mean time to resolve?

Mean time to resolve is useful when compared with Mean time to recovery as the
difference shows how fast the team moves towards making the system more reliable
and preventing the past incidents from happening again. This comparison reflects
on the functioning of the postmortem and post-incident fixes processes.

## Mean time to acknowledge (MTTA)

Mean time to acknowledge is the average **time it takes for the team responsible
for the given product or service to acknowledge the incident from when the alert
is triggered.**

The main use of MTTA is to track team responsiveness and alert system
effectiveness. If your team is receiving too many alerts, they might become
overwhelmed and get to important alerts later than would be desirable.

This situation is called alert fatigue and is one of the main problems in
incident management. Luckily MTTA can be used to track this and prevent it from
becoming an issue. For further resources check the [most used incident management tools](https://betterstack.com/community/comparisons/incident-management-tools/).

[summary]
  <h2>Overview - when to use what metric</h2>
  <ul class="checkmark-list">
    <li><b>Mean time to recovery</b> - use as an overview metric to understand the overall performance of your incident management process</li>
    <li><b>Mean time to acknowledge</b> - use to access the effectiveness of your team’s responsiveness to alerts and the underlying escalation and alerting policies in place</li>
    <li><b>Mean time to respond</b> - use to access the effectiveness of your alerting and escalation process together with your repair capabilities</li>
    <li><b>Mean time to repair</b> - use to access the effectiveness of the repair process only, excluding any previous escalations or investigations</li>
    <li><b>Mean time to resolve</b> - use to access the effectiveness of the incident recovery process together with postmortem investigation and optimizations</li>
  </ul>
[/summary]
