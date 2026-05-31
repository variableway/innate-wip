# Why Are Status Pages Important: 5 Reasons (And How to Get Started)

There are over 50,000 [status pages](https://betterstack.com/community/guides/incident-management/what-is-status-page/) live as of 2023 hosted on [Better Stack](https://betterstack.com) alone.

The official GitHub status page gets 832k visits every month, Slack gets 348k, and Stripe around 47k, according to [Similar web](https://www.similarweb.com/website/status.stripe.com/#overview).

No matter what website or business you run, status pages are the golden standard for incident communication.

Let’s look at a few reasons why they are so important.

## Reason 1: Independent channel is vital when everything goes down

Look at the GitHub setup. They have a dedicated domain: [githubstatus.com](https://githubstatus.com), where the status page and all the incident communication lives. That’s no coincidence.

![Shared - make status page an independent com. channel (3).png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d3137fca-a054-4b5c-a0b4-2e12f3fffe00/public =1400x1000)

Thanks to this setup, if anything is wrong with the main site, the status site remains independent and working.

In cases when your whole infrastructure goes down, it’s best to have either a completely dedicated domain or at least a subdomain hosted somewhere else. Stripe or Slack uses the ``status.company.com`` subdomain format for example.

## Reason 2: Manual 1:1 communication is slow and stressful

Let’s save you some developer time. Wants every CTO ever.

During incidents, the engineering team has most of the work on their hands that needs to be done ASAP.

There is nothing worse than having to answer emails from the C-level asking when it will be fixed. From the support team about what they can say to customers. And from everyone else at the company that wants to know what’s up.

![flow of information in a company during incidents.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/02853299-a0aa-4417-ec97-2686ac719a00/md2x =1080x1080)

Status page creates a single source of truth that engineering can communicate through with everyone else at the company. 

This saves developers stress, speeds up information sharing, and gives them more time that can be directed toward resolution.

[summary]
## Side note: Automate incident communication with Better Stack's status pages

Stop manually updating everyone during incidents. [Better Stack's status pages](https://betterstack.com/uptime) automatically sync with your uptime monitors and incident management system, keeping your team and customers informed without any manual work. When an incident is detected, your status page updates instantly and subscribers get notified via email, Slack, or SMS.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/v7veE29LdyI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Reason 3: Users want honesty — status pages bring transparency

This goes for both existing and potential customers.

If your current customers are having issues, it’s easy for them to just take to Twitter and start a wave of negative PR. Being transparent, acknowledging an ongoing issue, and communicating helps to prevent all of this.

Well, at least in most cases.

![Screenshot 2023-09-11 at 21.41.15.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5005d756-0995-4318-8835-52b3cda9e700/md1x =1196x280)

Any potential customers can also see the historical uptime for the last 90 days. Especially for business buyers, a good uptime is often a key in their buying process. Here is it from [status.betterstack.com](https://status.betterstack.com/).

![Screenshot 2023-09-11 at 21.41.56.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c4dea71e-7d58-4436-4a7b-cac4494a7500/public =1750x444)

## Reason 4: Pro-active incident communication builds trust and decreases support queries

Say the bad news first.

When customers get the incident updates automatically without doing anything — it builds trust like nothing else.

This is also true for communicating with other teams in the company.

![Screenshot 2023-09-11 at 21.47.36.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0cc93ed5-83ad-4cf3-1b64-432a711cbb00/lg1x =998x192)

It’s much better if they hear the news right away from you than if they find it out on their own and have to chase you down for answers. You can also set up status and scheduled maintenance subscriptions and automate the whole process.

## Reason 5: Control your reputation and brand image

Mainly a problem for larger companies, but still relevant.

When something doesn’t work, savvy users will most certainly turn to Google and search for *[company] status* or *[company] down.*

![Screenshot 2023-09-11 at 21.50.59.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/df60e051-d6d2-4d22-bcab-9acdfeb71400/public =1618x800)

If you don’t have a status page that can be found, users will get their information from any of the numerous 3rd party status aggregators. These build a wall between you and your users and make you lose control of the narrative.

## How to get started with a status page

Convinced that you need to get a status page? Here’s how you can get started.

## 1. Pick the right URL format

This will be the place where everyone will go. Make sure it’s in the common format or at least easy to remember.

And as said at the beginning. Make sure it’s hosted independently of the main app or website.

![Copy of Dev team (Instagram Post) (1500 x 1080 px) (1500 x 500 px) (1000 x 500 px) (1500 x 1080 px) (1500 x 1000 px) (3).png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f81c5f8c-fa16-4b2b-2887-b5d84c113f00/orig =1700x1000)

Our recommendation is to go with ``status.yourdomain.com`` format because it’s the most common and doesn’t require setup and management of other domains.

**Further reading:**
[See how others handle URL formats: here are 7 status page examples to learn from](https://betterstack.com/community/guides/incident-management/status-page-examples/)

## 2. Pick whether to build, self-host, or buy

It really depends on your preference. There are 3 main options to pick from:

- **Option 1: Creating a custom page and hosting it independently** — this gives you the most control but requires both design and engineering resources. This option includes server costs, SSL certificates, domain management, and more. Usually, only the largest companies like [status.stripe.com](https://status.stripe.com/) or  [status.slack.com](https://status.slack.com/) go for this option.

- **Option 2: Self-hosting an open-source project** — significantly easier than the first option because it removes the need for design and much of the engineering work. However, the need to set up and manage a separate hosting solution remains.

- **Option 3: Using a SaaS solution to manage it** — easiest to set up and manage since everything is handled by a provider like Better Stack. The [free forever plan](https://betterstack.com/uptime/pricing) includes up to 5 custom domain status pages, which fit most of the company’s use-case.

**Further reading:**
[Best open-source status page tools](https://betterstack.com/community/comparisons/open-source-status-page-tools/)

## 3. Select what to share with the world

Status pages can be either public or private.

**Public** ones are most suitable for companies with many users or when communicating non-sensitive information.

**Private** ones are used more by B2B companies with fewer customers or by agencies that want to provide dedicated pages for each of their customers. They are also suitable for any team-wide communication. Development, support, c-level, and other teams often have private pages, each with information only relevant to them.

![Shared - make status page an independent com. channel (5).png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bc4bc69f-83cf-4390-0b97-5ed0fb896200/orig =1400x1000)

## 4. Make your status page on-brand

If you’re feeling creative, you can use your status page as an easter-egg-like experience for your users.

Here is a design of the old [redditstatus.com](https://www.redditstatus.com/) page. It has been sadly redesigned into a safer format recently.

![Untitled (18).png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5bdfe3a4-d994-456b-f995-40509b9d9700/orig =1284x1058)

Feel free to be creative. It doesn’t have to stop at just adding your logo.

## 5. Prepare templates to communicate incidents

Most people skip this step, but it makes your life so much easier later on.

If you expect to do any sort of public communication of incidents, it’s best to write down a simple template for each step of the incident. This way, once there is an incident, you don’t have to be creative and just copy-paste the message.

![Screenshot 2023-09-11 at 14.56.05.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/06504cf1-d655-4e23-fa14-2f947db5da00/md1x =2354x1084)

Here is an example:

- **Investigating message:** *We’re investigating an issue with [service affected] that is impacting some users. We’re working to fix the problem as quickly as we can. We’ll share another update shortly.*
- **Resolved message:** *We’re back! [service affected] should be up and running. Thanks for bearing with us.*

**Further reading:**
[4 Copy-Pastable Incident Templates for Status Pages](https://betterstack.com/community/guides/incident-management/incident-templates/)

## 6. Share it with your users

Now that you’ve got your status page, it’s time to let your users know.

Your goal here is to make sure your customers actually make use of it. Sharing it on Twitter and other socials is a great start. Or try sending a product update or including it in your newsletter.

![Screenshot 2023-09-13 at 12.48.16.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/89a13599-5edd-41e0-69cc-1a067cd1cf00/lg2x =1206x362)

If you have documentation, support pages, or an intercom pop-up, you can add it there to make sure everyone finds it. Adding it to the footer of your homepage is also popular.

![Screenshot 2023-09-13 at 18.49.29.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4e9c141f-e879-492f-89ee-f8c8d1768500/md2x =1736x338)

## Learn more

Looking to learn more about incident management? Check out these guides:

- [What Is a Status Page? (And 5 Benefits of Getting One)](https://betterstack.com/community/guides/incident-management/what-is-status-page/)
- [Best free status page tools](https://betterstack.com/community/comparisons/free-status-page-tools/)
- [What Is Incident Management? Beginner’s Guide](https://betterstack.com/community/guides/incident-management/what-is-incident-management/)
- [How to Create a Developer-Friendly On-Call Schedule in 7 steps ](https://betterstack.com/community/guides/incident-management/on-call-scheduling/)

Any questions or comments? Let us know at hello@betterstack.com.

If you’re considering getting a status page, you can book a [free consultancy call](https://calendly.com/d/cn2k-gvn-s7w) with us.