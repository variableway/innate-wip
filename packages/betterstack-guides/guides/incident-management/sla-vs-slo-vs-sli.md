# SLA vs. SLO vs. SLI: What’s the Difference? (Plus 5 Tips to Make a Great SLA)

<iframe width="100%" height="315" src="https://www.youtube.com/embed/pouVbehfnqQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Here is a quick breakdown of what each of those abbreviations means:

**SLA (Service Level Agreement) is an agreement between a service provider and customer.**

This document includes the promises the service provider makes about their service. For example: our uptime will be at least 99.99% monthly, and our support will respond to your questions within 24 hours on every business day.

**SLO (Service Level Objective) is an objective that the service provider focuses on to meet the SLA.**

SLOs are simply just different points stated in the SLA. A 99.99% uptime is an SLO; the 24-hour support response time is another SLO.

**SLI (Service Level Indicator) is the real number showing the actual fulfillment of a given SLO.**

For the uptime SLO, the goal for this month is 99.99%. Let’s say we are in the first week of the month, and the current uptime is 99.90%. This current measurement (99.90%) is the SLI of the uptime SLO.

<br>

Now that we have a basic understanding of these metrics, let’s explore each of those in more depth.

![Alexa AWS sla](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e9205094-d902-4713-8868-def286cc6700/public =1132x611)

## What is a Service Level Agreement (SLA)?

An SLA is an agreement between a service provider and a client. It covers the promises a provider makes when it comes to the performance and functionality of its software.

Uptime is one of the most common metrics that are included in SLAs. Here is an example of what a monthly uptime promise looks like in the [Amazon Alexa SLA](https://aws.amazon.com/legal/service-level-agreements/?aws-sla-cards.sort-by=item.additionalFields.serviceNameLower&aws-sla-cards.sort-order=asc&awsf.tech-category-filter=*all):

![Alexa AWS sla](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f85c151d-5fbf-4df5-40e8-bd382fcdef00/public =1366x707)

Notice the service credit percentages. Those mean that if this SLA point (monthly uptime) is not fulfilled, Amazon will provide its customers with credits (sometimes also called *earned backs*) which can be used for next month's billing. SLA penalties (what happens if the SLA is not met) often include direct customer credits, financial penalties or license extensions.

Most SLAs have more or less the same structure, including sections on:

- **Services:** What are the provided services.
- **Obligations:** What SLOs does the vendor need to fulfill during the agreement's duration to avoid any penalties.
- **Measurement:** What are the metrics used to quantify these obligations. These include performance indicators (or SLIs), methods used for measurement, frequency and detail of reporting.
- **Timeline:** How long is this SLA valid for and what are the dates on which it can be audited and renegotiated.
- **Penalties:** What consequences can the participants face in case of non-compliance with the SLA obligations.

## What are the problems with SLAs?

There are two main issues that occur with SLAs:

### SLOs are not properly defined

Defining what SLOs mean is the key to any good SLA. For example, downtime can be understood as a service that is completely down and unavailable, let’s say a cloud product’s dashboard was not loading at all. However, when such a dashboard would be so slow, it would load, but any reasonable work would be impossible. Would that be considered a downtime?

These questions must be settled to prevent any issues with a wrong interpretation of the SLA. Proper definitions of each SLO are thus necessary.

### Wrong SLOs are included, or vital SLOs are missing

The second main challenge with SLAs is that they are a combination of work from legal, sales, procurement, tech, and other teams. Most people behind an SLA won’t even use the service in the end, but they influence what terms are included.

Making of an SLA should include all the relevant parties, but it should also prioritize the needs of the people who will actually use the service in the end.

[![Better Uptime Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d29b94fa-9083-4c12-0074-d2fd16d11400/public =1247x768)](https://betterstack.com/better-uptime/)

[summary]
<h3>🔭 Want to check if your service providers comply with your SLAs?</h3>
<p>Go to <a href="https://betterstack.com/better-uptime/" target="_blank">Better Uptime</a> and start monitoring your service providers in 2 minutes.</p>
[/summary]

## What is a Service Level Objective (SLO)?

An SLO is an individual commitment in an SLA, like uptime or customer support response time. It’s what a customer can expect from the service as well as what the team providing the service needs to hit and measure themselves against.

## What are the problems with SLOs?

The main issue with SLOs is definitions. It’s easy to agree on uptime being at least 99.95% monthly, but it’s much harder to agree on what is the precise definition of uptime and, more importantly, downtime.

Here is an example of how [Google Earth SLA](https://cloud.google.com/earth-engine/sla) defines monthly uptime percentage (bottom of the image):

![AWS sla](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/917ac883-0a27-47ae-7909-8666e05db300/public =1132x497)

The interesting part is that downtime periods (that are used for calculating the monthly uptime) are only situations when the downtime is 10 minutes and longer. The downtime is defined as situation when more than 10% of requests return an error. An error being only defined as HTTP Status 500: “Internal Error”.

This means that situations that include other than Status 500 errors or situations which result in 8% of all requests sent being unfillfiled won’t be calculated towards the downtime and this won’t influence the final monthly uptime percentage.

Having plain language descriptions with simply stated objectives makes any SLA much better.

## What is a Service Level Indicator (SLI)?

An SLI is the actual fulfillment of a given SLO. If the SLI (for example uptime percentage) doesn’t equal or exceeds the SLO (99.99% uptime, for example) stated in the SLA, the service provider is breaking the agreement and might face penalties.

## What are the problems with SLIs?

SLIs are greatly dependent on the SLOs they measure. The complexity of the SLOs will directly influence any issues connected to measuring the SLIs.

## Are SLAs necessary?

No. SLAs are not necessary, and many widely used software apps, even at the enterprise level, don’t offer SLAs. Arguments for and against having an SLA depend on your viewpoint:

### For service providers

The decision whether to offer SLAs or not is largely based on the nature of your customers. Usually the larger the customer and the deal, the more they will need to have an SLA to complete the purchase. Enterprises and some SMBs have procurement departments and internal purchasing guidelines that state what can be purchased and under which conditions.

In order to acquire larger customers and stay competitive with alternatives, service providers usually need to offer SLAs. However, this is not true for all software purchases within enterprises. Smaller purchases (usually made by a corporate card) can be made easily without the need for an SLA. Hence if you are selling smaller deals (under $1000s/per year) you probably won’t need an SLA.

[![Better Uptime Dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7c18d9d6-47ba-421e-b727-937667a20f00/public =961x601)](https://betterstack.com/better-uptime/status-page)

[summary]
<h3>‍✨ Want to broadcast your SLA compliance?</h3>
<p>Go to <a href="https://betterstack.com/better-uptime/status-page" target="_blank">Better Uptime</a> and create a public or private status page for your customers in 2 minutes.</p>
[/summary]

### For buyers

Looking at the penalties section, the SLA idea might sound lucrative. But it’s not always that simple. Firstly, an SLA usually requires some amount of work from different teams (DevOps, legal, finance etc.) to evaluate whether it’s actually useful. Secondly, any deal that includes an SLA is usually part of a longer sales process, which takes much more time than the conventional self-serve buying model.

And lastly, even though SLAs have benefits in the form of penalties — it’s not always a silver bullet for choosing the right provider. Some providers don’t have a very appealing SLA, but they have a much more reliable service. And that is, in the end, what is more valuable, a working service, not free credits. You can usually find historical reliability of a given vendor on their [status page](https://betterstack.com/community/guides/incident-management/what-is-status-page/) (below is an example of status.slack.com).

Of course, SLAs do have significant benefits. Especially for buyers looking for larger purchases, purchases with long-term commitment, or purchases with previously unknown vendors. For such purchases, an SLA gives peace of mind and sets a clear guideline for what can be expected from the service provider.

The tradeoff between a purchase with and without an SLA (or an SLA with better terms) is most often price, and that is what teams need to evaluate case by case.

![Slack status page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/03161a0c-4fed-4fa4-209f-372c5b53f700/public =1000x675)

## 5 tips to make a great SLA [For service providers]

If you are a service provider looking to craft a new SLA or update your existing onc, here are a few tips:

### 1. Write with customer pain-points in mind

When writing an SLA, it’s best to focus on providing assurances of what matters to the customer. For example, uptime for your development team means a combination of 5 components (server response time, CAPTCHA etc.) that needs to be managed. For your customer, however, uptime only means whether that your service is working or not.

Simplifying complex backend processes into simple metrics and client-view outcomes improves any SLA. Not just it’s more compelling to customers that know what the agreement actually means, but it also simplifies the responsibilities of the development team.

### 2. Use simple language

The fastest way to make your SLAs easier to read and understand is to ditch legal talk in favor of simple language. Simple language prevents misunderstandings with customers in the future.

### 3. Don’t track all the metrics

Customers have a few vital metrics that they need. It’s not necessary to include more metrics just because you are able to measure them. If they don’t matter (a lot) to your customers, it’s better to omit them and just focus on the important ones.

### 4. Be conservative with SLI estimates

When including SLOs, be realistic, there is no need to shoot for the moon. Even though you might be able to achieve 99.99% uptime, having a bigger *error budget* is always better. Not just because it doens’t put the development team under such stress but it also lowers the probability of failing to deliver on your SLA obligations. It’s always better to under-promise and over-deliver when it comes to SLAs.

[note]
<h3>💳 What is an error budget?</h3>
<p>Error budget is the maximum amount of downtime that a service can have without facing contractual consequences from the SLA: an SLA with a monthly uptime promise of 99.99% gives you an error budget of 4m and 22s.</p>

<p>Explore error budgets for different availability levels in the <a href="https://betterstack.com/community/guides/incident-management/availability-table/" target="_blank">availability table</a></p>
[/note]

### 5. Include factors outside of your control

Let’s say an SLA includes how fast a customer query must be answered. In some cases, however, you need some debugging data from the customer before the query can be answered. It’s vital to define those cases so that the customer understands there are exceptions to the SLA obligations and that not all the numbers about response times and similar will be true in all cases.

## Learn more

Want more resources on reliability and incident management? Check these out:

- [What Is a Status Page? And Why You Should Have One?](https://betterstack.com/community/guides/incident-management/what-is-status-page/)
- [What Is Incident Management? Beginner’s Guide](https://betterstack.com/community/guides/incident-management/what-is-incident-management/)
- [What Are Incident Severity Levels? (SEV1 to SEV3 explained)](https://betterstack.com/community/guides/incident-management/severity-levels/)
- [How to Create a Developer-Friendly On-Call Schedule in 7 steps](https://betterstack.com/community/guides/incident-management/on-call-scheduling/)
