#  On-call Compensation Models (and How to Solve On-Call Pay)

Working on weekends, staying late, and waking up at 4:00 in the morning. On-call can be very difficult, and it’s important to compensate people fairly.

## How to think about on-call pay

On-call is an inconvenience that people take home from work. They need to adjust their lifestyles accordingly, and the company needs to acknowledge that.

The two main things to consider when deciding how to pay for on-call are:

- **Incident severity:** If on-call teams need to be ready at a moment’s notice to solve business-critical problems, the stress and inconvenience need to be accounted for. On the other hand, teams with low-incident urgency might not even need an extra on-call pay.
- **Incident frequency:** If teams receive many alerts (or if the alerts include many false positives, duplicate alerts, etc.), especially during out-of-work hours, it can be very hard on them. Compared to teams with highly optimized systems and only a few incidents per month.

**Read mode:** [How to Create a Developer-Friendly On-Call Schedule in 7 Steps?](https://betterstack.com/community/guides/incident-management/on-call-scheduling/)

[summary]
### Track on-call duties and incidents automatically

While fair compensation is crucial for on-call teams, [Better Stack](https://betterstack.com/incident-management) makes tracking on-call time and incident response effortless. Monitor who's on-call, track incident frequency and severity, measure response times, and generate detailed reports to inform your compensation model.

**30x cheaper than Datadog with predictable pricing.** Start free today.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/E8JQPRVR20E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## 4 Common on-call compensation models

Here are some commonly used models for setting up an on-call pay.

## 1. No additional pay

This is often the default setup for many smaller companies, either because downtime isn’t a significant concern or because of a lack of dedicated resources.

No additional pay isn’t inherently a wrong setup. When people don’t spend significant time resolving incidents, or when they only solve incidents during business hours, it can work perfectly well.

It stops working when resolving incidents becomes a stressful inconvenience for the on-call members.

When companies transform and start pushing for more rigorous on-call KPIs, SLAs, and hitting metrics, this form of no-compensation needs to change ,as it can no longer rely on on-call people to take the bullet for the team.

**Pros**

- **Simplicity**: For many startups, this is the easiest way to introduce on-call
- **Low management**: There are no management overhead costs connected to specific compensation calculations

**Cons**

- **Unfair**: Not paying people properly to work outside of the regular working hours is inherently unfair

## 2. Part of base salary

With this model, on-call responsibilities and expectations are clearly outlined in the contract and reflected in the salary. For example, a year base salary contract should include that it comes with a responsibility to be on-call once a week every month.

The main benefit is that there is a new level of monetary motivation and organizational recognition for the on-call teams compared to the first model.

Monthly calculations of on-call duties aren’t necessary, which makes it simple to implement and manage this model.

The main downside is scheduling flexibility. There is little motivation to switch duties because there is no extra reward for it — everyone is compensated equally. When switches occur, they tend to be transactional: “I will take a day for you if you take a day for me”.

**Pros**

- **Fair:** It can be very fair, but depends on the management setup.
- **Low management**: There are no management overhead costs connected to specific compensation calculations
- **Minimises team haggling**: It’s easy to over-engineer on-call and create complex incentives, that can waste team’s time on internal debates instead of actually increasing productivity. Leaving the compensation private gives on-call people extra pay, without the internal turmoil.

**Cons**

- **Could be simplistic**: For larger teams with more resources it is worth it exploring more complex models, see below.

## 3. Paid for time spent on incidents

An alternative model to the base salary pay is to pay only for the time spent working on an incident.

Every time someone gets an incident alert outside of the regular working hours, they’ll be compensated. Creating a direct relationship between incidents and monetary rewards, making the compensation easy to understand.

At first glance, this usually seems like the most fair setup. The more work disturbs your out-of-work life, the more you get compensated.

However, this model can be tricky because it inherently creates a financial disincentive to reduce incidents and to treat incidents with the necessary urgency. Yes, it’s an extreme scenario, but some might indeed make way for incidents, or at least not take all necessary precautions to prevent them.

Another issue is that when incidents don’t occur, on-call people receive no extra pay, even if they still have the responsibility and stress connected to being ready to respond in minutes.

**Pros**

- **Work and compensation correlation**: It compensates anyone who has to tackle incidents fairly.

**Cons**

- **Disincentive to reduce incidents**: It can be counterproductive as teams get financial rewards for not preventing incidents.
- **No extra pay for on-call:** Similarly, when everything works just fine, there are no financial benefits to the on-call team. But they still need to be ready at moment’s notice.
- **Extra management**: Tracking time spent on incidents is not simple and requires management time.

[summary]
### Reduce false positives and optimize on-call workload

[Better Stack](https://betterstack.com/incident-management) helps minimize unnecessary alerts that drain your on-call budget. Configure intelligent escalation policies, set up severity-based routing, eliminate duplicate alerts, and reduce false positives—ensuring your team only responds to real incidents that matter.

**Lower incident frequency, improve team happiness.** Start free today.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/OOnkpVC6VnU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## 4. Paid for on-call time

This setup is simply paying employees for the time they spend on-call, even if no issues arise. It’s usually a fixed weekly or monthly amount that’s added to the base salary.

Paying for the whole time is a great way to justify the need to be ready and available at a moment’s notice — tackling the main downside of the pay by incident model.

It’s very close to the base salary model when it comes to simplicity, but it also gives a layer of transparency to the team (everyone usually knows the on-call rate).

The main disadvantage of paying for on-call time is that incidents occur at random, making some duties easy and some extremely challenging. Naturally, this can cause some team members to feel this compensation is unfair.

**Pros**

- **Fair and simple**: Everyone who needs to carry a laptop around and be ready to respond is compensated for it.
- **Low management**: There are no management overhead costs connected to specific compensation calculations

**Cons**

- **No on-call is the same**: Some team members might experience severe incidents, while others might go weeks without an alert.

## How to improve these compensation models

If you’re not sure about what model to pick, here are a few ways you can improve and customize them to yout liking.

- **Paying more for severe incidents:** Severe incidents can take several hours to resolve.  Creating different rates for “high” and “low” workloads is a way of acknowledging the extra amount of stress and work connected to those incidents.
- **Paying more for off-hour incidents**: In the case of on-call schedules that go during off-hours, you can choose to compensate team members for incidents during these times more. It’s a great way of compensating for the loss of their personal time.
- **Paying more for quick response times**: Extra compensations can also be tied to a specific threshold of [incident management metrics, like MTTA and MTTR](https://betterstack.com/community/guides/incident-management/mttr-and-other-incident-metrics/). Rewarding a specific on-call person or even whole teams when the target KPIs are hit.
- **Paying more to on-call helpers**: Some people are often pulled into the on-call investigation, either because of their needed expertise or because they’re just helpful. In any case, those have a huge positive benefit to the company, and the right pay is more than fair.

[summary]
### Build a sustainable on-call system your team deserves

[Better Stack](https://betterstack.com/incident-management) supports fair on-call practices with comprehensive scheduling, automatic escalations, detailed incident tracking, and performance metrics. Create workweek rotations, follow-the-sun schedules, or custom setups that respect your team's time while maintaining reliability.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/SHgvlblx2zg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Learn more

Still unsure about your optimal on-call setup? Read our guide on [how to create a developer-friendly on-call in 7 steps](https://betterstack.com/community/guides/incident-management/on-call-scheduling/).

If you’re creating a brand new on-call, read our article on the 4 most popular [on-call schedule templates](https://betterstack.com/community/guides/incident-management/on-call-templates/).

Any questions or comments? Let us know at [hello@betterstack.com](mailto:hello@betterstack.com).

If you’re working on a new on-call schedule, you can book a [free consultancy call](https://calendly.com/d/cn2k-gvn-s7w) with us.