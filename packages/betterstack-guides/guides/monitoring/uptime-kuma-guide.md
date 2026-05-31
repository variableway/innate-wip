# A Complete Guide to Monitoring With Uptime Kuma

Managing the availability of your services, applications, and databases can be daunting, but [Uptime Kuma](https://github.com/louislam/uptime-kuma) makes it effortless. This free, open-source, self-hosted tool informs you about your infrastructure's health with real-time monitoring and timely alerts, enabling proactive responses.

With support for over 78 notification services—including email, Telegram, and Slack—Uptime Kuma ensures you stay connected. It also lets you create customizable status pages to keep your team and users updated on service health.

In this guide, you'll set up Uptime Kuma by configuring monitors and notifications, as well as creating status pages to track and share your infrastructure's status easily.

## Prerequisites

To get started, make sure you have:

- A basic web server with an active endpoint. This guide uses Python for
  simplicity, but you can use any server setup you choose.
- Optionally, install the
  [latest version of Docker](https://docs.docker.com/engine/install/), which
  simplifies running Uptime Kuma. You can also set it up without Docker, though
  it requires more effort.

## Getting started with Uptime Kuma

<iframe width="100%" height="315" src="https://www.youtube.com/embed/t4Nb-09oZSw" title="How to Setup Uptime Kuma - Self Hosted Monitoring" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


In this section, you’ll install Uptime Kuma on your system using Docker and set
up your admin account.

To get started, run the following command in your terminal:

```command
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

Here’s a breakdown of the command:

- `docker run`: initiates a new container using the Uptime Kuma image.
- `-d`: runs the container in the background (detached mode).
- `--restart=always` ensures the container restarts automatically if it crashes
  or when Docker is restarted.
- `-p 3001:3001`: maps port 3001 of your host to port 3001 inside the container,
  making Uptime Kuma accessible via this port.
- `-v uptime-kuma:/app/data`: mounts the `uptime-kuma` volume to the `/app/data`
  directory in the container, ensuring data persistence.
- `--name uptime-kuma`: assigns the name `uptime-kuma` to the container for
  easier reference.
- `louislam/uptime-kuma:1`: specifies the version `1` of the Uptime Kuma image to
  use.

Docker will download the Uptime Kuma image if it’s not already available
locally:

```text
[output]
Unable to find image 'louislam/uptime-kuma:1' locally
1: Pulling from louislam/uptime-kuma
...
Downloaded newer image for louislam/uptime-kuma:1
```

Once the download completes, Uptime Kuma will be running at
`http://localhost:3001`.

![Uptime Kuma signup page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3c3b5df7-676d-4194-d6b6-6e772e9a2a00/md2x =3024x1762)

You’ll be prompted to create an admin account. Enter your preferred details and
click **Create**:

![Filled signup page with username and password](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d01ffdc9-fe29-410c-6336-0bfa96fabc00/lg2x =3014x1740)

After creating the account, you’ll be redirected to the dashboard:

![Uptime Kuma dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/219bf7b7-761d-4e9a-328d-503b220f8d00/orig =3024x1766)

The dashboard displays the status of monitored services and offers insights into
uptime, downtime, and maintenance.

With Uptime Kuma now running, continue to the next section to set up your first
monitor.

## Creating a monitor with Uptime Kuma

In this section, you'll set up a simple server to monitor its status using Uptime Kuma.


Start by creating a basic HTTP server using Python (or any language you're comfortable with). Open your terminal and run:

```command
python -m http.server 8000
```

This command launches a simple HTTP server on port 8000. This server will act as the target for your Uptime Kuma monitor.

Next, click the **Add New Monitor** button in Uptime Kuma:

![Screenshot of Add New Monitor button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2a1ac188-2d0f-41d9-9370-d0664338f500/lg1x =996x484)

You will be redirected to the `/add` page, where you can enter the monitor
details. Once you’ve entered the necessary values, click **Save**:

![Screenshot of the monitor setup page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/93e07349-4cbb-4b2c-0945-b620515beb00/md2x =3024x1768)

For this example, you’ve chosen "HTTP(s)" as the monitor type to track a web
service. The `http://host.docker.internal:8000/` allows the Docker container
to connect to the service running on your host machine. The "Heartbeat Interval"
is automatically set to 60 seconds, meaning Uptime Kuma will check the server’s
availability every minute. After saving, you’ll be redirected to the monitor
status page:

![Screenshot of the monitor status page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f89e18de-92e1-4a5d-9222-ec3af259cc00/orig =3024x1768)

Here, you'll see that the `Simple Server` monitor is up with 100% uptime.

Now, let's simulate the server going down. Return to the terminal and press
`CTRL + C` to stop the server.

Once the server is stopped, Uptime Kuma will detect it and show that the monitor
is down:

![Screenshot showing the monitor down status](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/879e8ff1-21b3-4cf3-2761-cb7b6639c000/md2x =3010x1742)

To bring the server back up, rerun the following command:

```command
python -m http.server 8000
```

With your monitor set up, you can proceed to the next section to configure
notifications.

## Setting up notifications

In this section, you'll configure email notifications in Uptime Kuma to alert
you when something goes wrong. We'll use Gmail to send these alerts, so let's
start by setting that up.

First, configure an app password for your Gmail account. To do this, visit
[Google My Account → Security](https://myaccount.google.com/security?hl=en) and
enable 2-Step Verification.

![Screenshot showing 2-step verification enabled](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/888bf569-094d-4598-f58f-6d5b0f5ec000/md2x =1300x323)

Next, go to the [App passwords](https://myaccount.google.com/apppasswords)
section at the bottom of the page and click the marked arrow:

![Screenshot showing the App passwords section](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8a2220be-d4e0-4dc1-9a6d-72ecce9e1000/public =1670x354)

Create a new app password. You can name it anything you like—here, we’ll use
"UptimeKumaAlert". Enter the name in the text field and click **Create**.

![Screenshot showing app name entered in the form](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b79b861e-de15-4478-c406-a7926f3b8f00/public =1392x1076)

Once the password is generated, copy it and store it in a safe place, as you
won't be able to view it again.

![Screenshot showing app popup](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4e2e500c-5a8d-4405-582a-d9a07eabcf00/lg2x =1120x782)

Now, return to the Uptime Kuma tab and click **Edit** to configure
notifications:

![Screenshot of the edit notifications button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d001271c-d2c3-4628-e8ca-390cac43d400/md2x =2013x489)

You will be taken back to the monitor configuration page. Click **Setup
Notification**.

![Screenshot of the notification setup](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/29baa5ed-62b1-479e-f052-bc5d42f56b00/md2x =1914x921)

On the notification setup page, enter your email, SMTP details, and the app
password:

![Screenshot of notification setup form filled](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8f9d794b-e1d4-4fc2-b5f5-3913c7ff4700/lg2x =972x3245)

Here, you set the notification type to "Email (SMTP)", using `smtp.gmail.com` as
the SMTP hostname and port `587`. Then, you enter your Gmail credentials (with
the app password as the password) and fill both the "From Email" and "To Email"
fields with your Gmail address.

Next, click **Test**. You should receive an email indicating that Uptime Kuma
can send notifications:

![Screenshot of Gmail notification](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6c8221bd-39f1-4c4a-dc5d-55602ce26100/orig =780x322)

If everything works, click **Save** to confirm the notification setup.

![Screenshot of saving notification](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7b1e5c87-6476-44fa-8157-ce7be640a600/orig =522x128)

After saving, enable notifications for the monitor:

![Screenshot of enabling monitor](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/011f54f5-aea0-4f79-a88a-cf2ff5a54500/lg1x =1890x506)

Now, click on the monitor to view its current status:

![Screenshot of clicking the monitor](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2292cddf-0377-40b6-96eb-3dc8d7380c00/orig =956x688)

You should now see the status of the monitor:

![Screenshot of the monitor status](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/be58c45a-e306-49e7-c773-e55400b4b200/lg1x =3022x1580)

Stop the server by returning to the terminal and
pressing `CTRL + C` to test the notifications. After a short delay, check your Gmail inbox, and you’ll
receive an email indicating that the service is down:

![Screenshot of received email notification](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/dc3f262a-83ed-4e62-d3c4-92a0fc24c800/public =1522x580)

Once you restart the server, you will receive another email confirming that the
service is back up:

![Screenshot of service-up email](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/34f8ff5b-9061-4326-336a-fc2739d91400/md1x =724x398)

With email notifications successfully configured in Uptime Kuma, you'll proceed to create a status page in the next section.

## Creating a status page

Having set up notifications to receive alerts when services change status, it's time to create a status page. This page will be visible to users, informing them which services are operational.

To start, click the **Status Page** button in the navigation bar:

![Screenshot of the status page button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6e71d87e-ce43-4290-0522-532c4602bb00/md2x =3014x146)

Next, click on **New Status Page**:

![Screenshot showing where to click to create a new status page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/832ece99-340e-4901-eef1-57af99b07900/md1x =3024x1528)

You’ll then be redirected to a page where you can enter the status page name and
slug:

![Screenshot showing where to enter the status page name](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1ff94211-38d9-4786-86e9-a0363c965300/lg1x =3024x1528)

In this example, you name the status page and set the slug to `demo`. After
entering these details, click **Next**.

On the following page, you can add more information, such as a description and
footer text. Once you've done that, click **Add a Monitor** to select the
monitor the status page will track:

![Screenshot showing where to add a monitor](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/82965fe4-d42b-4bf3-1e0b-b1b6df666a00/lg2x =3024x1560)

After choosing the monitor, you’ll see that it is being tracked. Click **Save**
to save your changes:

![Screenshot of monitor added](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c7918ee8-d15a-456a-65da-3cf2c41ec700/md1x =3024x1610)

Once saved, the status page will be live:

![Screenshot of status page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/77cfe804-87d1-434e-a53c-0751cd58f900/md2x =3024x1560)

Since you’re logged in, you’ll see the **Edit Status Page** button, but if you
view the page in incognito mode, you’ll see how it looks to users:

![Screenshot of user view of the status page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3295ef4a-3b4c-4105-717d-27f58107d300/md2x =3004x1158)

To test if the status page updates correctly when the monitor goes down, stop
the server. After a few minutes, the status page will reflect the change,
showing the service is down:

![Screenshot of the status page showing service down](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9f722fb4-b97d-4fa6-b844-928293740700/orig =2888x1310)

With that, you’ve successfully created and tested your status page!


## Why you shouldn't use Uptime Kuma
While Uptime Kuma is a capable self-hosted monitoring tool, it may not suit all environments due to key limitations. A significant issue is its inability to support multiple users, leading to the absence of role-based access control (RBAC). Without multiple user accounts or RBAC, anyone with dashboard access can modify or delete critical settings, posing security risks for larger teams.

Another limitation is the absence of API support for tasks like adding, updating, or removing monitors. Although an API is [currently in development](https://github.com/louislam/uptime-kuma/issues/118), this gap hinders the ability to automate workflows effectively, which can be a significant drawback if you're relying on automation for efficiency.

Self-hosting Uptime Kuma also brings a maintenance burden. It requires regular server upkeep, applying updates, and ensuring security patches—all of which can be resource-intensive. This ongoing maintenance demands time and technical expertise that you might prefer to allocate elsewhere.

As your infrastructure grows, Uptime Kuma’s single-instance setup can encounter performance bottlenecks. This limitation makes it less suitable for large-scale environments that require distributed monitoring across multiple instances to handle increased load and ensure reliability.

Moreover, Uptime Kuma lacks built-in redundancy or failover features like data replication or automatic failover. If the instance goes down, so does your entire monitoring system, creating a risk of service blind spots. 

Lastly, the tool's health check functionality is limited due to the absence of an API for configuring or [customizing health checks](https://github.com/louislam/uptime-kuma/issues/4831) programmatically. While the Docker setup includes a basic health check, its fixed configuration may not suit all environments or use cases. This limitation restricts flexibility if you require more advanced or tailored health monitoring solutions.

## Monitoring with Better Stack
Better Stack is an excellent choice if you're looking for an alternative that simplifies monitoring and avoids self-hosting challenges. It offers scalability by eliminating the need to manage infrastructure, apply updates, or handle maintenance tasks, allowing you to expand your monitoring efforts without additional overhead.

Better Stack performs multi-location checks every 30 seconds from sites worldwide, ensuring more accurate incident detection and reducing the chance of false alarms—something not possible with a self-hosted Uptime Kuma setup.

It also provides:

- Built-in incident management features.
- Unlimited voice calls and SMS alerts.
- On-call scheduling.
- Incident escalation.

Moreover, Better Stack offers comprehensive API support for monitoring, incident management, on-call scheduling, and integrations. This enables automation and scaling as your organization grows, ensuring efficiency and adaptability.

Lastly, its user management system includes features like team creation, single sign-on (SSO), audit logs, and team-wide maintenance controls. These tools ensure that team members have appropriate permissions and visibility, enhancing security and collaboration within your organization.

Starting with Better Stack is easy. Simply create [a free account](https://betterstack.com/uptime), and you can swiftly deploy your monitor and set up notifications.

For instance, once you've set up a monitor, you'll see its status as "UP," indicating it's ready to go.

![Screenshot of the monitor status page showing that the service is up with a green 'UP' status in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9e44fcff-91ac-4bc6-80b8-65c821a9b100/orig =3024x2856)

If your server goes down, Better Stack will detect the issue and update the
status to "DOWN," triggering an immediate alert:

![Screenshot of the monitor status page in Better Stack showing the service as down, indicated by a red 'DOWN' status](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2f9c0a04-350d-4f29-6027-0bdfe7a23d00/lg1x =3024x2856)

You’ll then receive a notification, such as this email alert:

![Screenshot of an email alert from Better Stack notifying the user that the monitored service is down](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d588a34d-db2e-48dc-dbe9-31ed9f3d1300/md1x =2381x1647)

Additionally, you can create a custom status page with Better Stack, where you
can set up a company name and subdomain for your status page

Once live, your status page will show your service's operational status:

![Screenshot of a live status page in Better Stack, showing the monitored service as back online with a green 'Operational' status](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/47f934f9-13f8-4c24-8510-38c73b109e00/md2x =3024x2582)

With Better Stack, you can easily create monitors and status pages while
avoiding the complexities of self-hosting.

## Final thoughts

This article explored how to get started with Uptime Kuma by creating a monitor,
setting up notifications, and building a status page. With this, you should now
have a solid foundation for monitoring various services in your application
using Uptime Kuma. Check out our
[monitoring guides](https://betterstack.com/community/guides/monitoring/) to continue learning more about monitoring.

Thanks for reading, and happy monitoring!
