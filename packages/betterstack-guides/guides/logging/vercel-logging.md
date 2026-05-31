# A Complete Guide to Logging in Vercel

Vercel is a cloud-based platform that simplifies the process of developing and
deploying frontend web applications. With Vercel, you can create
high-performance applications without the need for complex server management or
infrastructure configuration, and it offers a seamless development experience.

One of the standout features of Vercel is its automatic scaling of web
applications based on traffic, ensuring that your websites and applications
remain speedy even during times of high traffic. As your application scales,
you'll encounter more log data, but Vercel offers a range of monitoring and log
analytics tools to help you quickly identify and resolve issues.

In this article, we'll cover the basics of logging with Vercel, including the
various types of logs available, how to access them, and how to integrate
external log management platforms to bypass Vercel's limitations.

## Prerequisites

Before you begin reading this article, please ensure that you have already
signed up for a [Vercel account](https://vercel.com/login) and have installed
Node.js [Node.js](https://nodejs.org/en/download) and
[npm](https://www.npmjs.com/) on your computer.

[ad-logs]

## Setting up a demo app

For demonstration purposes, let's create a new Next.js project and deploy it to
Vercel. Use the following command to initialize a new project:

```command
npx create-next-app@latest --typescript
```

You will be prompted with a few questions where you must specify the project
name, whether or not to enable experimental features, and so on.

![Initialize Next.js project](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f48b64f6-2bc8-4670-3659-ada665adb500/md1x=1556x1028)

Next, initialize this project as a new Git repository, and publish it to GitHub.
From there, you can connect the repository to Vercel directly. To do this, you
must create a new Vercel project and then import the Git repository you just
created:

![Import git repo](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/77d6f5b8-41c4-4f0d-22c3-7be3ccb4b100/lg2x=3248x1986)

After that, you can add additional configurations to the project.

![Configure project](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b742ddbe-6c61-4408-bf12-57fb1f9b8800/md1x=3248x1986)

Click **Deploy** and wait for the project to build. This could take several
minutes to complete. After the build process is over, you should see the
following success page.

![Deploy success](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8232b834-3aae-4295-bfba-901de0fa4c00/lg2x=3248x1986)

## Types of logs in Vercel

Vercel provides three distinct types of logs: build logs, runtime logs, and
activity logs:

1. **Build logs**: the logs generated during the application's build time are
   called build logs. They are created automatically and detail the actions
   taken during the build process. While each deployment's build logs are stored
   indefinitely, they will be truncated if the total size exceeds 4MB. Below is
   an example of what build logs look like:

   ```text
   [14:04:29.077] Running build in San Francisco, USA (West) – sfo1
   [14:04:29.131] Cloning github.com/ericnanhu/vercel-nextjs (Branch: main, Commit: ba81cb8)
   [14:04:29.997] Cloning completed: 866.116ms
   [14:04:30.802] Running "vercel build"
   [14:04:31.238] Vercel CLI 28.16.6
   [14:04:31.484] Installing dependencies...
   . . .
   [14:04:42.558] Serverless regions: Washington, D.C., USA
   [14:04:42.558] Deployed outputs in 2s
   [14:04:42.921] Build completed. Populating build cache...
   [14:04:46.621] Uploading build cache [66.90 MB]...
   [14:04:48.180] Build cache uploaded: 1.559s
   ```

2. **Runtime logs**: they capture all the activity that occurs while your
   application is running. This includes HTTP
   requests,[serverless function logs](https://vercel.com/docs/concepts/functions/serverless-functions/quickstart),
   [edge middleware logs](https://vercel.com/docs/concepts/functions/edge-middleware/quickstart),
   and
   [edge function logs](https://vercel.com/docs/concepts/functions/edge-functions/quickstart).
   The logs provide detailed information on the application's performance and
   any errors or warnings that occur during runtime. Here is an example of what
   runtime logs would look like:

   ```text
   2023-03-01T02:12:57.341Z  2023-03-01T02:12:57.362Z      a2f0b874-0e61-42b0-868f-68e2dd8c3c45    INFO    A log message.
   2023-03-01T02:12:57.341Z  Duration: 7.60 ms     Billed Duration: 8 ms   Memory Size: 1024 MB    Max Memory Used: 99 MB
   ```

   To push runtime logs to Vercel, you can use the default Console module or
   popular JavaScript logging frameworks such as
   [Pino](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/) or
   [Winston](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/).
   Vercel will automatically collect and store these logs for analysis.

3. **Activity logs** track the actions and activities of your team members,
   including who performed an action and when it occurred. These logs provide
   detailed information such as the user who performed the action, the type of
   event, the account role, and the timestamp. Below is an example of an
   activity log record:

   ```text
   jack added Development, Preview, Production Environment Variable LOGTAIL_SOURCE_TOKEN to Project vercel-nextjs
   ```

## How to view Vercel logs

Vercel offers two convenient methods for checking log records. You can either
use the Vercel CLI, or the web dashboard interface.

### 1. Using Vercel CLI

Vercel provides a command-line tool that allows you to retrieve logs and view
them locally. To use this tool, you must first install `vercel` by executing the
following command:

```command
npm i -g vercel
```

Once the installation process is complete, you can check the version of the
installed Vercel CLI by running the following command:

```command
vercel --version
```

```text
[output]
Vercel CLI 28.16.15
28.16.15
```

Next, run the following command to connect to a Vercel project:

```command
vercel
```

If this is your first time using the Vercel CLI, you will be prompted to log in
to your account. Once you've logged in, you'll be asked a series of questions.
Follow the instructions and be sure to link to an existing project (i.e., the
Vercel project you just created).

```text
[output]
? Set up and deploy “~/web/<project_name>”? [Y/n] y
? Which scope do you want to deploy to? My Awesome Team
? Link to existing project? [y/N] y
? What’s the name of your existing project? <project_name>
🔗 Linked to <team_name>/<project_name> (created .vercel and added it to .gitignore)
```

To retrieve log records for a specific deployment, use the following command:

```command
vercel logs <deployment_url>
```

```text
[output]
Vercel CLI 28.16.7
> Fetched deployment "<deployment_url>" in <team_name> [299ms]
2023-02-27T19:04:29.077Z  Running build in San Francisco, USA (West) – sfo1
2023-02-27T19:04:29.131Z  Cloning github.com/<branch> (Branch: main, Commit: ba81cb8)
2023-02-27T19:04:29.188Z
2023-02-27T19:04:29.997Z  Cloning completed: 866.116ms
2023-02-27T19:04:30.802Z  Running "vercel build"
2023-02-27T19:04:31.238Z  Vercel CLI 28.16.6
2023-02-27T19:04:31.484Z  Installing dependencies...
. . .
```

You will find the deployment URL on the **Project** page:

![Deployment URL](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/320dc295-5519-4a0b-a49b-9f067e7b4100/lg1x=3248x1986)

Note that this command will only pull the build logs for the specified
deployment. If you wish to view the corresponding runtime logs, you must add a
`--follow` or `-f` flag so that `vercel` watches for additional log output.

```command
vercel logs <deployment_url> -f
```

Our demo project comes with a sample function at
`https://<deployment_url>/api/hello`. In a different terminal, send a few GET
requests to this URL so that some runtime logs are generated:

```command
curl 'https://<deployment_url>/api/hello'
```

Wait for a few minutes, and you should observe the following log record in the
Vercel CLI:

```text
[output]
2023-03-01T22:13:56.372Z  Duration: 39.85 ms    Billed Duration: 40 ms  Memory Size: 1024 MB    Max Memory Used: 100 MB
```

Besides the `-f` flag, there are several other useful options available for the
`vercel logs` command, as shown below:

- The `-n` flag is used to specify the number of log lines to output.

  ```command
  vercel logs <deployment_url> -n 5
  ```

  ```text
  [output]
  Vercel CLI 28.16.7
  > Fetched deployment "vercel-nextjs-fk8lu4094-eric-betterstack-s-team.vercel.app" in eric-betterstack [381ms]
  2023-02-27T19:04:42.558Z  Deployed outputs in 2s
  2023-02-27T19:04:42.921Z  Build completed. Populating build cache...
  2023-02-27T19:04:42.971Z
  2023-02-27T19:04:46.621Z  Uploading build cache [66.90 MB]...
  2023-02-27T19:04:48.180Z  Build cache uploaded: 1.559s
  ```

- The `--output` or `-o` flag is used to specify an output format, either
  `short` (default) or `raw`.

  ```command
  vercel logs <deployment_url> -o raw
  ```

  ```command
  vercel logs <deployment_url> --output=raw
  ```

  ```text
  [output]
  Vercel CLI 28.16.7
  > Fetched deployment "vercel-nextjs-fk8lu4094-eric-betterstack-s-team.vercel.app" in eric-betterstack [309ms]
  Running build in San Francisco, USA (West) – sfo1
  Cloning github.com/ericnanhu/vercel-nextjs (Branch: main, Commit: ba81cb8)
  Cloning completed: 866.116ms
  ```

- The `--since` flag is used to return logs only after a specific date, using
  the ISO 8601 format.

  ```command
  vercel logs <deployment_url> --since 2019-09-04T07:05:43+00:00
  ```

- The `--until` flag is used to return logs only up until a specific date, using
  the ISO 8601 format.

  ```command
  vercel logs <deployment_url> --until 2022-10-08T09:12:31+00:00
  ```

### 2. Using the Vercel dashboard

To view logs through the Vercel dashboard, go to the project dashboard and click
the **View Build Logs** button.

![Project page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cc08b08c-3f4d-4089-1159-87a4d717c100/md1x=3248x1986)

For the **Build logs**, you can see the timestamp and the log message. And you
can also use the filter to show only the error or warning messages, which will
be displayed in different colors.

![Build logs](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/be5d041e-3a1b-4f62-ecbc-b49fe3582d00/md2x=3248x1986)

To view **Runtime logs**, you should click the **Logs** tab. You should observe
several log records in the resulting page, and you can click any of them to view
more details.

![Runtime logs](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/57ee7da2-27d8-46d7-ae86-b958236c2700/lg2x=3248x1986)

It's important to note that runtime logs in Vercel are only stored for a maximum
of 1 hour. If you need to store logs long-term, you will need to rely on a
third-party log management platform, which we will discuss in the next section.

As for the **Activity logs**, you can find them by navigating to your team's
homepage and selecting the **Activity** tab.

![Activity logs](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ca389fa1-07d6-4a32-3425-cf4ba1a66d00/public
=3248x1986)

## Enable Web Vitals metrics

[Web Vitals Metrics](https://vercel.com/docs/concepts/analytics/web-vitals#vercel-web-vitals-metrics)
is an application monitoring feature provided by Vercel. It collects real user
metrics to estimate a score, letting you know how users actually experience your
application.

You can enable this feature by going to **Dashboard** → **Analytics**, and
enable Performance Analytics:

![enable performance analytics](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fd4dc676-d094-445b-3876-a6b1d5b13700/md2x =3248x1986)

Then you will be asked to redeploy the project, and after the build process is
over, Vercel will start collecting performance performance data next time your
application is visited.

![web vitals](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8137f8e3-235f-401a-e70d-7c99c3f26a00/lg2x =3248x1986)

## How to aggregate and centralize Vercel logs

While Vercel stores build logs and activity logs indefinitely, it does not offer
long-term storage for runtime logs, which are only stored for a maximum of 1
hour. To store runtime logs long-term, you will need to send them to a different
log management platform such as the ones offered on the
[Vercel marketplace](https://vercel.com/integrations#logging).

We highly recommend using [Logtail](https://betterstack.com/logtail) for
managing your Vercel logs. It is a cloud-based solution that enables you to
view, search, and analyze all of your logs in one place. Logtail allows you to
set up alerts and notifications based on specific log events, so you can quickly
identify and resolve issues as they arise. Furthermore, Logtail offers team
collaboration features that enable different teams within your organization to
collect insights that meet their unique requirements.

Vercel offers easy integration with Logtail. Head over to the
[Logtail integration page](https://vercel.com/integrations/logtail), and click
**Add Integration** button.

![Logtail integration](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c92e4477-3e15-4fa5-a211-0a4f0cc66100/md2x=3248x1984)

Choose the scope, and click **Continue**.

![Choose scope](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ce4d5936-9f63-47f1-5a58-570ad7e3a000/md2x=3248x1984)

Choose which project you wish to add to Logtail.

![Choose project](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5250bbc3-07f4-4151-b9b0-5df391bbdf00/md1x=3248x1984)

And lastly, add the integration.

![Add integration](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ec496ee9-8854-46f3-4efd-2d427940ee00/lg2x=3248x1984)

You will then be redirected to Logtail, where you need to confirm that you want
Logtail to connect to Vercel.

![connect-to-vercel.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/dda94205-4643-438e-8a03-c099c245c200/lg2x=1824x1536)

Give Logtail a few seconds to set things up, and then you will be redirected to
the integrations page. Click **Configure** to access Logtail.

![logtail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/64aea077-a6bd-466c-1a69-8070e6d4a200/md2x=3248x1984)

At this point, new logs will be sent to Logtail for storage, viewing, and
further analysis.

![live tail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7370f09d-1653-42f4-f522-e2eefc189700/lg2x=3248x1984)

You may also opt to send the Web Vitals metrics to Logtail as well. Go back to
the `pages/_app.js` file, and add the following code:

```javascript
[label pages/_app.js]
. . .
export { reportWebVitals } from '@logtail/next';
```

Redeploy the application, and then visit your app from a browser. You should
start receiving Web Vitals metrics in Logtail.

![web vitals in Logtail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/25a4f427-dd98-42ad-0afa-3f90441d4c00/md2x =3248x1986)

### Setting up configurable log drains

Vercel's configurable log drains enable you to send logs to any endpoint URL via
the HTTP protocol, giving you far more options than the limited integrations
available in the marketplace. With this feature, you can select log sources, log
formats (either JSON or NDJSON), endpoint URLs, and even custom headers.

At the time of writing this article, the configurable log drains feature was
still in beta and not yet available to the public. We will update this section
as soon as the feature becomes available.

## Conclusion

In this article, we covered the fundamentals of logging in Vercel, including the
various types of logs available, how to view logs, and how to send logs to
third-party platforms for long-term storage and analysis. We also provided a
list of best practices for logging in Vercel to help you leverage the platform's
full potential. It's worth noting that some of the logging features mentioned in
this article are still in development, and we will update this guide as soon as
they become available to the public. We hope you found this article useful.

Thank you for reading, and happy logging!
