# 4 On-Call Schedule Templates (With Benefits and Downsides)

First time building an on-call schedule? Don’t reinvent the wheel. Just start with what works and adjust it as you go.

Here are the most popular on-call templates with **pros** and **cons** to use them.

1. [Workweek and weekend](https://betterstack.com/community/guides/incident-management/on-call-templates/#workweek-and-weekend)
2. [Workweek and weekend with a backup](https://betterstack.com/community/guides/incident-management/on-call-templates/#workweek-and-weekend-with-a-backup)
3. [Follow the sun](https://betterstack.com/community/guides/incident-management/on-call-templates/#follow-the-sun)
4. [Rotating / fully customized](https://betterstack.com/community/guides/incident-management/on-call-templates/#rotating-fully-customized)

[summary]
### Build your on-call schedule with Better Stack

While choosing the right on-call template is crucial, [Better Stack](https://betterstack.com/incident-management) makes implementing any schedule effortless. Create rotating calendars, set up primary and secondary schedules, manage escalation policies, and coordinate your entire team's on-call workflow in one platform.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/E8JQPRVR20E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Workweek and weekend

Engineers are on-call during the workweek and weekend — 7 days in a row. The on-call week is intense. However, the rest of the month is on-call free. This practice is used in [Google](https://sre.google/sre-book/being-on-call/) and is also doable for teams of any size.

Depending on your team size, you have several options.

- **Workweek and weekend (monthly)**: One workweek and weekend every month, then the rest of the month free. For this, you’ll need at least four team members.
- **Workweek and weekend (bi-weekly)**: One workweek and weekend, then one week and weekend off. You can do this with only two people in a team.

![Xnapper-2023-10-31-17.16.45 (1).png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3e8e1faf-7140-4271-54da-a5252de7e600/lg2x =1004x752)

**Necessary team size:** 2+ team members

➕ **Pros**

- **Simplicity**: Weekly rotation is easy to understand, set up, and manage.
- **Works for any team size**: This schedule accommodates teams from two team members.
- **Rest time**: For larger teams (at least four people), this schedule allows each engineer to have three weeks with no on-call responsibilities, allowing for rest time.

➖ **Cons**

- **Night shifts**: Simplicity comes here at the cost of working 24/7 for a whole week.
- **Intense**: Being ready to respond for a whole week in a row can be tiring, especially when incidents pile up.
- **Inflexible:** When team members have specific on-call requirements, such as not working during some days, it won’t work.

## Workweek and weekend with a backup

This is an improved version of the regular workweek and weekend (sometimes called primary and secondary schedule). It includes a secondary on-call calendar called a backup. If the regular (primary) on-call person doesn’t acknowledge the incident within a given timeframe, it’s escalated to the backup.

Again, you can go with either one week once a month setup if you have a larger team or a bi-weekly setup if you have a smaller team.

![backup on-call (1).png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/815c075e-6df2-485b-81fe-db7c0536c200/lg1x =1484x1113)

[note]
There is an option for a third on-call tier, which escalates to the team lead. If everything is set up correctly with the team, the escalation to the third tier should be only an infrequent occurrence event.
[/note]

**Necessary team size:** 4+ team members

➕ **Pros**

- **Security:** Every team member has a backup in the rare case that they can’t respond. Making the incident response more secure in theory.
- As well as **simplicity, intensive,** and **inflexible,** as explained above.

➖ **Cons**

- **Needs a larger team**: At least four people are necessary for two weeks. Since primary and secondary are both fully-fledged on-call duties, the second week will be used for rest by the first two team members and vice versa.
- **More management:** The backup on-call must be treated equally to the primary on-call. It can be difficult to properly communicate that even on backup duty, people must be ready to respond immediately.
- As well as Night shifts and **rest time,** as explained above.
- 
[summary]
### Set up primary and secondary on-call schedules

[Better Stack](https://betterstack.com/incident-management) simplifies multi-tiered on-call management with flexible calendar rotation, automatic escalations, and backup scheduling. Create workweek and weekend rotations, follow-the-sun schedules, or fully customized setups that work for teams of any size.

**Reduce alert fatigue with intelligent escalation.** Start free today.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/SHgvlblx2zg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Follow the sun

This model leverages the timezone difference between different team members. It allows all on-call engineers to have only business hours duties and avoid night shifts. It’s the most protective of a healthy sleep schedule.

Achieving a complete elimination of night shifts requires specific team locations across different time zones. The reality in most cases is that the follow the sun eliminates only some parts of the night shifts, but only rarely creates a smooth nine-to-five on-call schedule.

You can of course implement follow the sun model only with two people, given that they have a reasonable time difference, and eliminate at least some non-standard working hours.

![Xnapper-2023-10-31-17.19.52 (1).png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/539abdc4-435b-420a-0f06-84eedadae000/public =1008x756)

[note]
If you want to see the overlaps of working hours across different time zones, use a tool like [Worldtimebuddy](https://www.worldtimebuddy.com/).
[/note]

**Necessary team size:** 2+ team members across specific time zones

➕ **Pros**

- **No night shifts:** You only solve incidents during work hours. No night-time work.

➖ **Cons**

- **Responsibility switching:** There are usually several people being on-call every day. If issues occur at the end of one team member's on-call time, passing over the investigation and resolution of the incident to another person can be complicated and stressful.
- **No free days**: If you follow a basic schedule, you will be on-call daily. That’s why it is usually better to switch things around and have weeks without any on-call duties. It all depends on the size of the team. The larger the team, the more options you have.

## Rotating / fully customized

This encompasses any fully customized schedule, and it usually includes rotations that can occur daily, weekly, or monthly.

The rotating schedule is usually used by larger on-call teams (20+), allowing for a fully tailored on-call setup, gaining benefits from all of the previous three schedules.

It usually prefers the follow-the-sun practice to minimize night shifts, but it also combines it with monthly or bi-weekly rotations, so team members get free days. The team size can also accommodate individual team preferences like people taking 24-hour shifts for the whole weekend once a month and then not being on-call for the rest of the month.

Monetary and days off incentives are common in those setups to minimize the on-call downsides on the team's performance and maximize the system's resilience.

**Necessary team size:** Usually 20+

➕ **Pros**

- **Flexibility**: Since it’s fully customized, it allows for maximum team flexibility.
- **Performance**: Maximizing the team's performance (incident response speed, troubleshooting speeds, and collaboration) is the goal of going for this lengthy custom setup.

➖ **Cons**

- **Team size**: A large distributed team is necessary to create it.
- **Planning and management**: With complexity comes more management. And there is also the initial investment of planning based on individual team members’ preferences and capabilities.

[summary]
### Manage complex on-call rotations effortlessly

[Better Stack](https://betterstack.com/incident-management) handles everything from simple bi-weekly rotations to complex follow-the-sun schedules across global teams. Configure escalation policies, set up severities, manage maintenance windows, and ensure 24/7 coverage with push notifications, SMS, and phone call alerts.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/tEremIcyuv8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
[/summary]



## Learn more

Still unsure about your optimal on-call setup? Read our guide on [How to Create a Developer-Friendly On-Call Schedule in 7 steps](https://betterstack.com/community/guides/incident-management/on-call-scheduling/) and see what are all the things you should consider when building a good schedule.

If you want to understand the workings of incident management, start with our [beginner’s guide](https://betterstack.com/community/guides/incident-management/what-is-incident-management/).

Any questions or comments? Let us know at [hello@betterstack.com](mailto:hello@betterstack.com).

If you’re working on a new on-call schedule, you can book a [free consultancy call](https://calendly.com/d/cn2k-gvn-s7w) with us.