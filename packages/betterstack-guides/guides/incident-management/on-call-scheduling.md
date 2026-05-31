# How to Create a Developer-Friendly On-Call Schedule in 7 steps

It’s 4:00 in the morning. Phone rings. The website is down. Here we go again.

On-call is often the most stressful part of the job for developers. But it rarely gets the care it really deserves.

Here are actionable tips for both managers and individual developers that can significantly improve resolving downtimes.

## What is an on-call schedule?

**On-Call** is a practice of always having a team member on standby, ready to respond in case of an urgent incident, even if it occurs outside of regular working hours. It’s one of the core processes of [incident management](https://betterstack.com/community/guides/incident-management/what-is-incident-management/) and a key to minimizing downtime and ensuring a reliable service.

**On-Call schedule** is a dedicated calendar allowing teams to assign and monitor the on-call shifts.

[note]
### **💡 How others do it: On-call scheduling at Google**

Google SRE (site reliability engineering) teams usually have a schedule where each engineer is on-call for one week every month. During this week, they are ready to respond to incidents at any time of the day and night.

They spend the rest of the month on engineering (ideally 50% of their time) and on other operational, non-project tasks (around 25% of their time).

**Read more:** [Google SRE Book: Being On-call](https://sre.google/sre-book/being-on-call/)
[/note]

## How to create an on-call schedule

Creating a quality on-call is challenging because there is no one-fits-all model. But on-call doesn’t have to be difficult, sleep-depriving, or inevitably leading to burnout.

Here is how to approach it.

## Step 1: Understand team preferences

Everyone is different. Some people like to start working at 11 am and finish late at night. Some start at 7 am and want to spend the afternoons with the kids.

Before pushing pre-build templates used at Google, see what everyone prefers and centralize your findings into a single document. For each team member, you should know the following.

- **Timezone**
- **Regular working hours preference**
- **On-call preference**

Once that’s done, you will have something similar to this table.

| Team member | Timezone | Regular working hours preference | On-call preference |
| --- | --- | --- | --- |
| Katie | +0 UTM (London) | 9:00 - 17:00 | Prefers full-week on-call duty once a month and then the rest off. |
| Brandon | -8 UTM (San Francisco) | 10:00 - 18:00 | Can work Saturdays or Sundays from time to time if compensated for it. |
| Cecelia | -5 UTM (Atlanta) | 7:00 - 15:00 | No preference |
| David | +4 UTM (Dubai) | 9:00 - 17:00 | Can work on Sundays but wants Saturdays off. |

This mini research will give you a great starting position to fully understand what your teams’ preferences and capabilities are.

## Step 2: Pick one of the common schedules

With team preferences in place, you can start drafting the schedule.

If your initial research doesn’t land a schedule out of the gate, you can start by picking one of the battle-tested schedules.

### Workweek and weekend

Engineers are on-call during the workweek and weekend — 7 days in a row. The on-call week is intense. However, the rest of the month is on-call free. This practice is used in Google and is also doable for teams of any size. Depending on your team size, you have several options.

- **Workweek and weekend (monthly)**: One workweek and weekend every month, then the rest of the month is free. For this, you’ll need at least four team members.
- **Workweek and weekend (bi-weekly)**: One workweek and weekend, then one week and weekend off. You can do this with only two people in a team.

![Xnapper-2023-10-31-17.16.45 (1).png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3e8e1faf-7140-4271-54da-a5252de7e600/lg2x =1004x752)

### **Follow-the-sun**

This model leverages the timezone difference between different team members. It allows all on-call engineers to have only business hours duties and avoid night shifts. It’s the most protective of a healthy sleep schedule.

Completely eliminating night shifts requires specific team locations across different time zones. The reality in most cases is that the follow the sun eliminates only some parts of the night shifts but only rarely creates a smooth nine-to-five on-call schedule.

You can of course, implement follow the sun model only with two people, given that they have a reasonable time difference, and eliminate at least some non-standard working hours.

![Xnapper-2023-10-31-17.19.52 (1).png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/539abdc4-435b-420a-0f06-84eedadae000/public =1008x756)

**Read more**: [4 On-Call Schedule Templates (With Benefits and Downsides)](https://betterstack.com/community/guides/incident-management/on-call-templates/).

[summary]
### Create your on-call schedule with Better Stack

While planning on-call schedules requires understanding team preferences and choosing the right rotation model, [Better Stack](https://betterstack.com/incident-management) makes implementation seamless. Build workweek and weekend rotations, follow-the-sun schedules, or fully customized setups with automatic escalations and multi-channel alerting.

**30x cheaper than Datadog with predictable pricing.** Start free today.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/E8JQPRVR20E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Step 3: Create primary and backup on-call duties

If you have the luxury of a larger team and want to be extra safe, then set up primary and secondary (backup) schedules.

How it works is that If the primary on-call person doesn’t acknowledge the incident within a given timeframe, it’s escalated to the backup. Backup on-call carries the same responsibilities as the primary one, and it needs to be treated that way.

First, the team needs to understand that being a backup is no different from being a primary — you must be ready to react within minutes.

Secondly, managers must treat it that way and consider being a backup on-call engineer equivalent to regular on-call duties, especially regarding compensation.

![backup on-call (1).png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/815c075e-6df2-485b-81fe-db7c0536c200/lg1x =1484x1113)

[note]
There is an option for a third on-call tier, which escalates to the team lead. If everything is set up correctly with the team, the escalation to the third tier should be only an infrequent occurrence event.

The image above shows how this setup looks in [Better Stack](https://betterstack.com/uptime).
[/note]



## Step 4: Define the on-call process and responsibilities

Write down all the responsibilities of on-call engineers and make it crystal clear what is expected of everyone.

Responsibilities are specific to a given organization, but good questions to answer and write down include:

- **Defining success:** Are there specific metrics like MTTR that determine success?
- **Working during on-call:** Are developers doing development work during on-call time? And if yes, how are the deliverables (development work) checked in the context of incidents?
- **Working vs. non-working hours responsibilities**: Is there a difference between what is expected from an on-call person during working hours and non-working hours (night-time)?
- **SLAs/SLOs:** Are there any contractual obligations that must be achieved?
- **Vacations**: When and how does one apply for a vacation to make on-call planning possible?
- **Ad-hoc changes**: What is the process of changing on-call on the same day (for example, due to sickness)?
- **Compensation:** What is the compensation for on-call employees? What’s the maximum time a single person can be on-call every month?

**Read more:**

- [On-call Compensation Models (and How to Solve On-Call Pay)](https://betterstack.com/community/guides/incident-management/on-call-pay/)
- [SLAs and SLOs Explained](https://betterstack.com/community/guides/incident-management/sla-vs-slo-vs-sli/)

## Step 5: Ditch the spreadsheet and select a tool

Managing on-call from a spreadsheet is a thing of the past. There are dedicated tools built just for this. Here are the options.

- **Option 1: Selecting a SaaS solution to manage it —** easiest to set up and manage since everything is handled by a provider like [Better Stack](https://betterstack.com/uptime). This way, you can create on-call calendars and manage alerting in one place.
- **Option 2: Combining Google or Microsoft Calendar with an alerting tool —** if you already have a schedule in your calendar, you can pick a combined setup. Better Stack offers a native calendar integration, which gives you the ability to manage scheduling there but also to get access to all alerting capabilities (phone calls, SMS, emails, Slack & Teams notifications, and more).
- **Option 3: Self-hosting an open-source project —** this potentially gives you more control, but comes at the cost of more management. The most popular open-source tools are: [Cabot](https://github.com/arachnys/cabot),[Dispatch](https://github.com/Netflix/dispatch),[Openduty](https://github.com/openduty/openduty) (now archived), and [Response](https://github.com/monzo/response).

**Read more:** [Better Stack vs. Pagerduty vs. Opsgenie](https://betterstack.com/community/comparisons/pagerduty-vs-opsgenie/)


[summary]
### Ditch the spreadsheet for professional on-call management

[Better Stack](https://betterstack.com/incident-management) replaces manual spreadsheets with comprehensive on-call management. Create rotating calendars, integrate with Google Calendar, manage escalation policies, track incident metrics, and alert via phone, SMS, email, Slack, or Teams—all in one platform.

**Native calendar integration and 24/7 alerting included.** Start free today.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/OOnkpVC6VnU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Step 6: Nurture a supportive culture

Often dismissed as obvious by many, but it’s usually not that obvious.

Creating a supportive culture within a team can significantly improve both employee happiness and incident response effectiveness.

Every once in a while, personal emergencies or important life events come up. Encouraging team members to help each other and switch duties to step in for others makes all the difference. When teams care for each other, the on-call challenge feels much more manageable.


## Step 7: Measure, iterate, and improve

As products, organizations, and teams develop, there is always a need to iterate and fine-tune to accommodate for changes. Don’t be afraid to revisit old processes and ask your team for feedback frequently. On-call is not a static process.

**Measuring on-call performance**

The end goal of having an on-call team is usually a target uptime that is usually based on a company SLA. This [availability table](https://betterstack.com/community/guides/incident-management/availability-table/) shows the different target levels of uptime from 99.9% up to 99.999% (so-called five nines).

[Incident metrics](https://betterstack.com/community/guides/incident-management/mttr-and-other-incident-metrics/) like MTTR (mean time to resolve) are also common KPIs for on-call teams. Those are usually useful only once there is an established structure within the on-call process. They give a unique insight into how effective are the specific parts of the incident management process.

**Measuring on-call well-being**

Measuring the happiness of on-call engineers is equally important to any performance metrics. The best way to do this is by regular 1:1s with the team, which yields qualitative feedback.

The quantitative data to collect include:

- **Number of false positives**: How many alerts were not actionable, and engineers investigated something that actually wasn’t a problem? How can this be prevented?
- **Number of duplicate alerts:** How many alerts were duplicated, and what can we iterate to prevent engineers from being called multiple times for the incident they are already aware of?
- **Number of low-priority alerts:** How many alerts didn’t require immediate reaction from the on-call team, and how many of those were outside business hours?
- **Number of all alerts:** Is the current number of alerts manageable for the number of people on-call?

Here is an example of a split of incident alert types one might receive. Minimizing the low-priority, false positives, and duplicate alerts once should be one of the easy wins for quick on-call optimization.

![common URL fortmats of status pages (1000 x 1000 px) (1).png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/739c8b53-d8d3-4fd4-1faf-e369e78c2000/orig =1000x1000)

And of course, the fewer alerts an on-call person receives, the lower the chance of something like alert fatigue developing. 

[summary]
### Set up primary and backup schedules automatically

[Better Stack](https://betterstack.com/incident-management) simplifies multi-tiered on-call management with flexible escalation policies. Configure primary and secondary (backup) schedules, set acknowledgment timeframes, and ensure incidents never go unnoticed with automatic escalation to backup responders.

**Reduce alert fatigue with intelligent routing.** Start free today.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/SHgvlblx2zg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Learn more

Still unsure about your optimal on-call setup? Read the [pros and cons of the 4 most popular templates](https://betterstack.com/community/guides/incident-management/on-call-templates/).

If you want to understand the workings of incident management, start with our [beginner’s guide](https://betterstack.com/community/guides/incident-management/what-is-incident-management/).

Any questions or comments? Let us know at [hello@betterstack.com](mailto:hello@betterstack.com).

If you’re working on a new on-call schedule, you can book a [free consultancy call](https://calendly.com/d/cn2k-gvn-s7w) with us.