# How to Design Escalation Policies (for Easy Incident Management)?

You are on-call and receive an incident notification. But the incident is from part of the app that you haven’t worked with at all. What do you do?

Enter the realm of escalation policies — and let’s create your ultimate backup plan when incidents happen to get the better of you.

## What is incident escalation & escalation policy?

**Incident escalation** is a situation when the current on-call person (or the responsible incident responder) cannot resolve the incident alone and needs to bring in a more experienced colleague.

**Escalation policy** is a set of rules for how the incident escalation is handled. It defines who is the dedicated person to which the incident is assigned when the initial responder needs help. 

It also defines what happens if the on-call person doesn’t acknowledge the incident within a given timeframe. For example, if the first-in-line person doesn’t respond to the alert within 5 minutes, who will receive the incident alert next?

[note]
## Automatic vs. manual escalation policy

**Automatic escalation policy** can be created in a incident management platform like Better Stack. This means that if the primary on-call person doesn’t acknowledge an alert, it’s automatically escalated according to the policy.

**Manual escalation policy** is when a the on-call person specifically escalates an incident to a different team member. Common examples are following the hierarchical or functional escalations.

[/note]

## How to design escalation policies?

Since the best setup always depends on the size of your team, complexity of your systems, and more. Here are the 4 steps that should help any team.

## Step 1: Mapping how new incidents are created

Most incidents are created either using some kind of [monitoring solution](https://betterstack.com/website-monitoring) or are reported manually.

We’ll focus on the incidents automatically created by monitors. We need to know where the new incidents are coming from, specifically what service, app, or system is triggering them. Based on that, we can connect them to the right escalation policy.

Let’s say that you automatically monitor your website’s SSL certificate. If the certificate expires or, for some reason, becomes invalid, the monitor will alert you and potentially also create an incident. 

Since a non-working SSL certificate is a significant issue that will prevent people from visiting your website. This means that the severity of this potential incident will be high. We’ll note this down and connect it to the relevant monitor.

We should do this for all of the monitors that can create incidents automatically. The final table will depend on the scope of our monitoring setup but should resemble something like this:

| Monitor | Potential severity |
| --- | --- |
| SSL certificates - homepage | High severity |
| Daily database backup | High severity |
| CPU at 50% | Low severity |

If you’re getting started, you can use a simple high and low severity matrix. If you’re looking for something more complex, feel free to use: SEV1, SEV2, or SEV3. It's entirely up to your preference. Feel free to explore more severity options in: [What Are Incident Severity Levels? (SEV1 to SEV3 explained) article](https://betterstack.com/community/guides/incident-management/severity-levels/).

## Step 2: Connect escalation policies to fit the severities

With the table overview ready, we can now create escalation policies that match the severity of those potential incidents.

Here is an example of how those can look like in real life.

- **High-severity escalation policy:** For these incidents, we want to alert the on-call person right away. Assuming that we have a [primary and secondary on-call schedule](https://betterstack.com/community/guides/incident-management/on-call-templates/), the initial on-call person will receive the alert right after the incident is created. If they don’t acknowledge within 5 minutes, the incident will be automatically escalated to the secondary on-call person. Here is how this setup would look like in Better Stack:

![hggg.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ecc69d28-d0f1-4cca-63ab-6fc67cb90c00/orig =1208x906)

- **Low-severity escalation policy:** For incidents that are not that important, we can set up less aggressive escalations. For example, we don’t have to escalate to another person during weekends or outside working hours.

![low urg.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a689ad8c-1fae-4d5a-499b-321e264ff200/lg2x =1704x1278)

The escalation policies will depend largely on your on-call schedule. If you don’t have an on-call schedule yet, feel free to start with: [4 On-Call Schedule Templates (With Benefits and Downsides)](https://betterstack.com/community/guides/incident-management/on-call-templates/).

## Step 3: Define when to use manual escalations

So far we have explored automated escalation policies, however in some cases we need to use manual escalations.

The two most commonly used manual escalation policies are:

- **Hierarchical escalation** is when an incident is passed onto a more experienced (senior) team member. In practice, this means that if the first on-call person can’t resolve the incident, they escalate to their manager, and so on, until the issue is resolved.
- **Functional escalation** is when an incident is passed onto a person with more knowledge related to the incident, not necessarily seniority. This means that if an incident relates to a part of the product that the current on-call person is not familiar with enough, she escalates it to the colleague responsible for that product. This person is usually more equipped to tackle the issue.

If it happens that the on-call responder finds out that the incident is indeed outside of her expertise, it’s good to formalize who should be escalated to.

Often teams use a mix of automatic escalations and manual escalations. This way, you can ensure that high-severity incidents get escalated to the right person even if the initial person doesn’t respond — thanks to automatic escalation policies.

But also that if the initial responders finds out that it needs to be passed on a specific team member outside of the automatic escalation policy there is a process on how to do that. Setting a good run-book on how to do manual escalations is a good way to decrease MTTR.

## Step 4: Measure, iterate, and improve

As products, organizations, and teams develop, there is always a need to iterate and fine-tune to accommodate for changes. Don’t be afraid to revisit old processes and ask your team for feedback frequently. Incident management and on-call are not static processes.

### Measuring on-call performance

The end goal of having an on-call team is usually a target uptime that is usually based on a company SLA. This [availability table](https://betterstack.com/community/guides/incident-management/availability-table/) shows the different target levels of uptime from 99.9% up to 99.999% (so-called five nines).

[Incident metrics](https://betterstack.com/community/guides/incident-management/mttr-and-other-incident-metrics/) like MTTR (mean time to resolve) are common KPIs for on-call teams. Measuring them is the first step. Once you have them set up, experiment with different alerting and escalation policies to see what best influences MTTR and MTTA.

### Measuring on-call well-being

Measuring the happiness of on-call engineers is equally important to any performance metrics. The best way to do this is by regular 1:1s with the team, which yields qualitative feedback.

Combine their feedback with the KPIs performance and make sure that there is a healthy balance between the two. Some changes might yield KPI gains but might be detrimental to the well-being of the team in the long term.

## Learn more

New to incident management? Read [How to Create a Developer-Friendly On-Call Schedule in 7 steps](https://betterstack.com/community/guides/incident-management/on-call-scheduling/). If you want to know more about escalation policies in Better Stack, see our [docs](https://betterstack.com/docs/uptime/escalation-policies/).

If you want to understand the workings of incident management, start with our [beginner’s guide](https://betterstack.com/community/guides/incident-management/what-is-incident-management/).

Any questions or comments? Let us know at [hello@betterstack.com](mailto:hello@betterstack.com).

If you’re working on a new on-call schedule, you can book a [free consultancy call](https://calendly.com/d/cn2k-gvn-s7w) with us.