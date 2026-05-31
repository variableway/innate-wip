# Solving Noisy Alerts and Preventing Alert Fatigue

Alert fatigue is a prevalent issue in monitoring and observability systems. It
occurs when on-call teams are overwhelmed with a flood of alerts, many of which
are either non-actionable or false positives.

This overload desensitizes team members, increasing the likelihood that critical
alerts requiring immediate attention are overlooked. The constant bombardment of
irrelevant notifications adds unnecessary pressure, leading to heightened
stress, anxiety, and eventually burnout. Over time, this negatively impacts
morale, job satisfaction, and the overall well-being of those on the front lines
of incident management.

Ultimately, alert fatigue undermines the very systems designed to ensure
stability and performance, turning them into a source of disruption by
overwhelming the teams responsible for maintaining them.

In this article, I'll share practical tips to help you mitigate alert fatigue
and create a more efficient, focused monitoring process.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/pouVbehfnqQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Identifying noisy alerts

The first step in optimizing your alerting workflow is to identify your noisiest
alerts—those that trigger frequently and contribute the most to alert fatigue.

These can generally fall into five categories:

### 1. False positives

**False positives occur when alerts are triggered for conditions that don't
actually indicate a problem**. For instance, an alert may fire due to a brief,
harmless spike in a metric, such as a CPU usage increase caused by a routine
process.

These alerts can lead to unnecessary investigations and distract your team from
real issues. To address false positives, review the alert thresholds and ensure
they're set to reflect true anomalies rather than minor, expected fluctuations.

### 2. Non-actionable alerts

**Non-actionable alerts are those that notify you of conditions that don't
require any immediate action or intervention**. For example, an alert might
notify your team every time a system enters a predictable state, such as the
start of an automated maintenance process.

These alerts clutter your notification system and waste valuable time. To
mitigate this, adjust the alert rules to filter out scenarios where no action is
needed.

### 3. Duplicate alerts

**Duplicate alerts occur when multiple alerts are triggered for the same
underlying issue**. For example, if a database goes down, separate alerts for
application failures, service dependencies, and user-facing errors may all fire
simultaneously.

While these alerts provide context, they can quickly overwhelm your team. Use
de-duplication mechanisms in your alerting tools, such as grouping related
alerts together or suppressing secondary alerts tied to a single root cause.

### 4. Outdated alerts

**Outdated alerts are triggered by conditions that are no longer relevant due to
changes in your infrastructure or monitoring needs**. For example, an alert may
be configured for a service that has been retired or replaced.

These alerts waste resources and can confuse team members unfamiliar with older
configurations. Regularly auditing and updating your alerting rules ensures that
only relevant alerts are firing.

### 5. Poorly configured alerts

**Poorly configured alerts are those with overly broad conditions, inappropriate
thresholds, or insufficient context**. For instance, an alert configured to fire
whenever memory usage exceeds 70% may generate unnecessary noise if memory usage
regularly peaks without impacting performance.

These alerts can also fail to provide actionable insights, leaving your team
unsure of how to respond. To address this, refine alert configurations by
setting meaningful thresholds and including sufficient context in the alert
messages.

[ad-uptime]

## How to address noisy alerts

After pinpointing your noisiest alerts, the next step is to refine them to
decrease their frequency and enhance their effectiveness. Making these
adjustments at the team level is often the most efficient approach, as it allows
teams to tailor their alerts to their specific workflows and responsibilities.

This section outlines five key actions to help you fine-tune your alerts and
maximize their value. Once these adjustments are in place, it's essential to
periodically revisit and review your alert configurations to ensure they
continue to align with your evolving monitoring needs. This could be done
quarterly, semiannually, or on a schedule that works best for your team.

The steps include:

### 1. Adding time tolerance to your alerts

**Longer evaluation windows in your alerting system can reduce alert noise**. By
considering more data points before triggering an alert, you can filter out
temporary anomalies and focus on persistent issues.

For example, Prometheus' alerting rules support a `for` clause defines the
evaluation window for an alert. Instead of triggering an alert at the first sign
of an issue, you can configure Alertmanager to wait and assess the situation
over a longer period.

Let's say you have an alert that triggers whenever a target can't be scraped. In
Prometheus, this might look like:

```yaml
[label alerts.yaml]
alert: TargetDown
expr: up == 0
```

The problem with this rule is that it fires after a single failed scrape.
Network blips or temporary outages can easily cause this, leading to unnecessary
alerts.

To make your alert less sensitive, use the `for` modifier to specify a duration.
This tells Prometheus to wait for a certain period before triggering the alert,
ensuring the issue is persistent and not just a fleeting hiccup.

Here's how you can improve the rule:

```yaml
[label alerts.yaml]
alert: TargetDown
expr: up == 0
[highlight]
for: 5m
[/highlight]
```

Now, the alert will only fire if the target remains unreachable for five
minutes.

This simple change can significantly reduce alert noise and prevent you from
being bombarded with alerts for transient issues.

### 2. Silencing alerts during scheduled downtimes

![Creating a silence in Alertmanager](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ad2dc13f-79ec-4345-16dd-ddf63e134900/public =1530x1057)

While proactive alerting is crucial, there are times when silence is golden.
Alertmanager offers powerful silencing mechanisms to suppress notifications when
they're not needed, helping you avoid alert fatigue and maintain focus.

### Types of silencing in Alertmanager

- **Inhibition**: Alert inhibition is a feature that suppresses specific alerts
  when related higher-priority alerts are already firing.

- **Silencing**: Temporarily muting alerts based on a time range and matching
  labels. Ideal for scheduled maintenance windows or during specific events
  where alerts are expected but not actionable.

### 3. Consolidating alerts with notification grouping

Alertmanager uses the `group_by` configuration to define how alerts should be
grouped before sending notifications.

Instead of sending separate notifications for every individual alert, it
consolidates related alerts based on shared labels. For example, alerts from the
same service or instance can be grouped into a single notification.

Here are the primary settings for notification grouping in the Alertmanager
configuration file:

- `group_by`: Specifies the labels used to group alerts. For example, you can
  group alerts by `alertname`, `job`, or `instance`.
- `group_wait`: Defines how long Alertmanager waits before sending the first
  notification for a group. This delay allows more related alerts to be grouped
  together.
- `group_interval`: Specifies how often notifications are sent for an ongoing
  group of alerts to avoid a flood of notifications for the same issue.
- `reapeat_interval`: Controls how often notifications are resent for unresolved
  alerts to ensure persistent issues remain visible.

```yaml
[label alertmanager.yaml]
route:
  receiver: 'team_notifications'
  group_by: ['alertname', 'job', 'service']
  group_wait: 30s          # Waits 30 seconds to gather related alerts
  group_interval: 5m       # Sends grouped updates every 5 minutes
  repeat_interval: 1h      # Resends notifications every hour for unresolved alerts
```

Let's say you have an alert that fires when disk space falls below a threshold.
Without grouping, you'd get separate alerts for every server with low disk
space.

```yaml
alert: LowDiskSpace
expr: node_filesystem_free_bytes / node_filesystem_size_bytes < 0.1
```

By adding a `service` label, you can group these alerts:

```yaml
alert: LowDiskSpace
expr: node_filesystem_free_bytes / node_filesystem_size_bytes < 0.1
labels:
  service: my_critical_app
```

## Other tips to prevent alert fatigue

### 1. Determine who needs to be alerted

One of the most effective ways to combat alert fatigue is to ensure that only
the necessary individuals receive alerts.

For instance, not everyone on the team needs to be notified when an SSL
certificate is nearing expiration—only a small group of people with the
expertise and authority to address the issue should be alerted.

The key is to think in terms of actions: if a person receiving an alert cannot
take any meaningful steps to resolve the problem, they should be removed from
the notification roster.

Alerts in incident management should function as performance-enhancing tools.
Their purpose is to deliver actionable information to the right people at the
right time, enabling them to quickly collaborate with others and address the
root cause.

Sending alerts to individuals who lack the necessary knowledge or capacity to
resolve the issue not only wastes their time but also dilutes the focus of those
who can act.

### 2. Implement on-call rotations

![better-stack-on-call.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f04465d2-efd1-4156-fe17-f418d4c2d100/md1x =960x600)

Even if you've minimized the number of alert recipients, alert fatigue can still
occur when the same individuals are consistently inundated with notifications.

To address this, establish a rotating on-call schedule to distribute alert
responsibilities evenly across your team.

Consider these key questions:

- Do you have enough team members available to handle on-call duties?
- Are certain individuals shouldering a disproportionate share of alerts?

By answering these questions, you can design a fair and balanced schedule that
ensures alerts are handled without overburdening any single person. Assign
reasonable time frames for on-call shifts, such as a few hours or days, and
rotate responsibilities regularly.

This approach allows one person to focus solely on alerts during their shift,
while others can dedicate their time to other tasks. Rotating shifts not only
helps prevent burnout but also ensures your team remains engaged and productive
across all areas of their work.

### 3. Reduce redundant alerts

While reminders play a valuable role in ensuring issues are addressed, excessive
redundancy in alerting is a major contributor to alert fatigue.

Research shows that every reminder after the initial alert decreases the
recipient's attention by approximately 30%. This means that flooding your team
with repetitive notifications can have the opposite effect of what's
intended—reducing their focus and delaying response times.

To be clear, this isn't a call to eliminate reminders altogether—they're
essential for ensuring critical issues aren't missed. Instead, it's about
striking the right balance by consolidating reminders where possible.

Optimize your alerting system to send follow-ups only when necessary, and avoid
overwhelming your team with unnecessary repetition. This will ensure alerts
remain effective and actionable.

### 4. Regularly review and improve alert systems

There's no universal solution to alert fatigue. It's a challenge that industries
like DevOps and cybersecurity constantly face, requiring ongoing improvement.

It's essential to regularly review your alerting system, as what works for one
team may not suit yours. Every team has unique workflows, and you'll need to
identify and address the specific issues causing fatigue.

Start by calculating Mean Time to Recovery (MTTR) to measure response
efficiency. For example, if your team spent 50 minutes recovering from 2
incidents in a week, the MTTR is 25 minutes. While not a perfect metric, MTTR
helps highlight areas needing improvement and shows how often alerts are missed.

Regular reviews—whether weekly, per sprint, or quarterly—help you refine your
system. Get feedback from the team, address pain points, and adjust thresholds
to reduce fatigue and improve alerting effectiveness.

### 5. Use a tool designed to combat alert fatigue

It might seem counterintuitive that an alerting tool can help combat alert
fatigue, but hear me out—using the right tool makes all the difference.

Alerts are essential. They ensure your systems stay healthy and can even detect
potential issues before they impact end users. The key is using a tool with
built-in features that address the challenges of alert fatigue, like those
outlined above.

[Better Stack](https://betterstack.com/incident-silencing) lets you control
alerts and manage who receives them, but it also simplifies creating and
managing on-call schedules.

With Betterstack, you can:

- Invite your team members and assign them to alerts.
- Set up on-call time frames (e.g., specific hours or days).
- Create and automate rotation schedules, ensuring seamless coverage—even
  outside of regular office hours.
- Automatically silence alerts that don't matter.
- Manage incident resolution directly in Slack.

![incident-sliencing-notification.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3241b138-42a5-45bb-af1a-291f70caec00/orig =650x235)

This approach allows the on-call team to focus solely on incoming alerts while
everyone else can focus on their work, knowing the system is in capable hands.
With a tool like this, you streamline alert management and significantly reduce
the strain of alert fatigue.

## Final thoughts

In this post, we've discussed what alert fatigue is, why it poses a significant
challenge, and how it often results from a monitoring strategy that lacks a
structured approach to ongoing optimization.

Regularly evaluating and fine-tuning your alerts can help mitigate alert fatigue
and keep it from becoming an issue in the future. We've also outlined how to
pinpoint your most frequent alerts, actionable steps to address them, and how
Better Stack can help you avoid alert fatigue altogether.

If you're new to Better Stack and looking to integrate it into your
observability stack, you can get started with a
[free account today](https://betterstack.com/users/sign-up).
