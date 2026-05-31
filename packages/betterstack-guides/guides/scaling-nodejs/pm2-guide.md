# Running Node.js Apps with PM2 (Complete Guide)

[PM2](https://pm2.keymetrics.io/) is a renowned open-source process manager
tailored for Node.js applications. It acts as a guardian, streamlining
deployment, overseeing logs, monitoring resources, and ensuring minimal downtime
for every application it manages.

This article will introduce you to the key features of PM2 and help you leverage
it for deploying, overseeing, and scaling your Node.js applications effectively
in a production environment.


## Prerequisites

Before proceeding with this tutorial, ensure that you have a recent version of
[Node.js](https://nodejs.org/en/download/) and
[npm](https://www.npmjs.com/get-npm) installed on your machine.

[summary]
## Side note: Get alerted when your Node.js app goes down

Head over to [Better Stack](https://betterstack.com/uptime/) and start
monitoring your endpoints in 2 minutes.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/YUnoLpCy1qQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
[/summary]

## Step 1 — Setting up the demo application (optional)

In this guide, we'll explore various functionalities of PM2 using a
[sample Node.js application](https://github.com/betterstack-community/dadjokes).
If you have your project, you're welcome to use it as you follow along. If not,
let's get started by cloning the demo app repository:

```command
git clone https://github.com/betterstack-community/dadjokes
```

Once cloned, navigate into the project directory and set up its required
dependencies:

```command
cd dadjokes && npm install
```

This application fetches a humorous dad joke from the
[ICanHazdadjokes API](https://icanhazdadjokes.com/api) and displays it on a
webpage. To see it in action, initiate the server using:

```command
node server.js
```

```text
[output]
dadjokes server started on port: 3000
```

With the server up and running, open your browser and head to
[http://localhost:3000](http://localhost:3000). Here's what you can expect to
see:

![Screenshot of dadjokes application in Brave](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8bedba5d-ee07-4041-e37c-ec08262a2b00/public
=1348x768)

Having set up the demo app, we'll transition to installing PM2's npm package in
the next section.

## Step 2 — Installing PM2

To harness the power of PM2 for managing your Node.js applications, you'll first
need to install its [npm package](https://www.npmjs.com/package/pm2) as follows:

```command
npm install -g pm2
```

Go ahead and confirm the version you have installed through the following
command:

```command
pm2 --version
```

Here's the expected output:

```text
[output]
5.2.0
```

Interestingly, your PM2 installation actually provides four distinct
executables:

- `pm2`: The primary PM2 binary.
- `pm2-dev`: A development tool akin to
  [nodemon](https://www.npmjs.com/package/nodemon) that auto-restarts the
  Node.js process during development.
- `pm2-runtime`: A seamless alternative to the node command, tailored for
  containerized environments.
- `pm2-docker`: Essentially an alias for `pm2-runtime`.

In the sections ahead, we'll delve into the specific applications of each of
these executables. But for now, let's focus on establishing a foundational
development workflow using the `pm2-dev` binary in the next step.

## Step 3 — Launching your application in development mode

While PM2 is primarily renowned for its usefulness in production, it can also
serve you during the development phase through the `pm2-dev` binary. When you
kickstart your application using `pm2-dev`, it monitors the current directory.
Your application gets a swift restart if there are any changes in the directory
or its subdirectories.

To set things in motion, first ensure that any previously running instance of
your server is terminated with `Ctrl-C`. Then launch your server in development
mode:

```command
pm2-dev server.js
```

You should observe the following output:

```text
[output]
===============================================================================
--- PM2 development mode ------------------------------------------------------
Apps started         : server
Processes started    : 1
Watch and Restart    : Enabled
Ignored folder       : node_modules
===============================================================================
server-0  | dadjokes server started on port: 3000
```

At this point, changing any file in the `dadjokes` directory will cause the
server to restart. Try it out by modifying your `server.js` file as shown below.
Change the `title` property from 'Random Jokes' to 'Random Dad Jokes' and save
the file:

```javascript
[label server.js]
. . .
app.get('/', async (req, res, next) => {
  try {
    const response = await getRandomJoke();

    res.render('home', {
      [highlight]
      title: 'Random Dad Jokes',
      [/highlight]
      dadjokes: response,
    });
  } catch (err) {
    next(err);
  }
});
. . .
```

Now, shift your attention to the terminal where your development server is
active. You'll notice an output indicating PM2's awareness of the change and its
subsequent action to restart the server:

```text
[output]
. . .
[rundev] App server restarted
server-0  | dadjokes server started on port: 3000
```

For a deeper dive into `pm2-dev` and its capabilities, use the `--help` flag.
It'll unveil the available options to tailor `pm2-dev` to your needs. Up next,
we'll transition to the core features of the primary `pm2` binary.

## Step 4 — Starting your application in production

When it's time to shift from development to production, the `pm2 start` command
is one to use. First, ensure you've terminated any running development server
with `Ctrl-C`. Then, to launch your application in a production setting, use:

```command
pm2 start --name 'dadjokes' server.js
```

You should see the following output:

```text
[output]
[PM2] Starting /home/ayo/dev/demo/dadjokes/server.js in fork_mode (1 instance)
[PM2] Done.
┌─────┬─────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name        │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼─────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ dadjokes    │ default     │ 1.0.0   │ fork    │ 1658     │ 0s     │ 0    │ online    │ 0%       │ 18.3mb   │ ayo      │ disabled │
└─────┴─────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

This table confirms the successful background launch of the `dadjokes`
application. If your terminal window is compact, you might see fewer columns, so
consider expanding it for a comprehensive view.

Here's a breakdown of the table columns:

- `id`: A unique identifier assigned by `pm2` to the application.
- `name`: The application's name. If the `--name` flag isn't specified, it
  defaults to the entry file name (in this case, `server.js`).
- `namespace`: Allows for batch operations (like start/stop/restart) on a group
  of apps.
- `version`: The version number sourced from the app's `package.json`.
- `mode`: Can be either `fork` or `cluster`. It directs `pm2` to utilize the
  [child_process.fork](https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options)
  or the [cluster](https://nodejs.org/api/cluster.html) API.
- `pid`: The process's unique identifier.
- `uptime`: Duration since the application's launch. `↺:` Counts the number of
  application restarts. `status`: Current application status. `cpu`: Percentage
  of CPU usage. `mem`: Memory consumption. `user`: The username of the
  individual who initiated the application. `watching`: Indicates if pm2 is set
  to auto-restart the app upon detecting file changes in the directory or its
  subdirectories. This is controlled by the `--watch` option.

At this point, you can visit [http://localhost:3000](http://localhost:3000) in
your browser and everything should work just fine as before.

### Ensuring a graceful startup

If you need your application to connect to various services (such as databases,
caches, etc) on start up, you can use the `--wait-ready` flag which instructs
PM2 to await a `ready` signal from your application before marking it as
"online". Here's how to implement this:

```javascript
[label server.js]
. . .

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`dadjokes server started on port: ${server.address().port}`);
  [highlight]
  // simulate a ready application after 1 second
  setTimeout(function () {
    process.send('ready');
  }, 1000);
  [/highlight]
});
```

After integrating the highlighted lines into your application, you'll need to
delete the current instance and restart it, this time using the `--wait-ready`
flag:

```command
pm2 delete dadjokes
```

```command
pm2 start --name 'dadjokes' server.js --wait-ready
```

```text
[output]
[PM2] Starting /home/ayo/dev/demo/dadjokes/server.js in fork_mode (1 instance)
[PM2] Done.
┌─────┬─────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name        │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼─────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ dadjokes    │ default     │ 1.0.0   │ fork    │ 18529    │ 1s     │ 0    │ online    │ 0%       │ 57.4mb   │ ayo      │ disabled │
└─────┴─────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

By default, if the `ready` signal isn't received, PM2 will wait for three
seconds before designating your application as online. If you wish to adjust
this duration, you can use the `--listen-timeout` flag followed by the desired
timeout in milliseconds:

```command
pm2 start --name 'dadjokes' server.js --wait-ready --listen-timeout 10000
```

Up next, we'll delve into how you can monitor your application's resource
consumption and other pertinent metrics using PM2.

## Step 5 — Keeping tabs on application metrics

With your application in motion, PM2 offers a suite of subcommands—`list`,
`show`, and `monit`—to help you monitor its performance. To get an overview of
all active applications on your server, use:

```command
pm2 list
```

You should observe the following output:

```text
[output]
┌─────┬─────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name        │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼─────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ dadjokes    │ default     │ 1.0.0   │ fork    │ 18529    │ 3m     │ 0    │ online    │ 0%       │ 53.3mb   │ ayo      │ disabled │
└─────┴─────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

This command provides a snapshot of each application's status, uptime, memory
usage, and more. If you have multiple applications running, you can sort them
based on specific metrics:

```command
pm2 list --sort [name|id|pid|memory|cpu|status|uptime][:asc|desc]
```

As in:

```command
pm2 list --sort memory:desc
```

For a more detailed look at a specific application, use the `pm2 show` command
followed by the application's name or id:

```command
pm2 show dadjokes
```

[s/t]

For a live dashboard displaying metrics, metadata, and application logs, use:

```command
pm2 monit
```

![Screenshot of pm2 monit in action](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1d16bf0d-6177-49ad-79d3-dce30266e500/public
=1366x747)

[summary]

### 🔭 Want to get alerted when your Node.js app stops working?

Head over to [Better Uptime](https://betterstack.com/better-uptime/) start
monitoring your endpoints in 2 minutes [/summary]

## Step 6 — Ensuring application uptime with PM2

PM2's auto-restart capability is a boon for ensuring
[application uptime](https://betterstack.com/uptime). You can also restart your
application manually through the `pm2 restart` command as follows:

```command
pm2 restart dadjokes
```

```text
[output]
[PM2] Applying action restartProcessId on app [dadjokes](ids: [ 0 ])
[PM2] [dadjokes](0) ✓
┌─────┬─────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name        │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼─────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ dadjokes    │ default     │ 1.0.0   │ fork    │ 4873     │ 1s     │ 1    │ online    │ 0%       │ 52.6mb   │ ayo      │ disabled │
└─────┴─────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

Notice that the restart column (↺) has been incremented to `1`, indicating that
the application has been restarted once.

PM2's default behavior is to restart your application even if it exits
intentionally. For instance, triggering the `/graceful-shutdown` route in the
dadjokes application will gracefully shut it down by calling `process.exit(0)`:

```command
curl http://localhost:3000/graceful-shutdown
```

```text
[output]
Graceful shutdown!
```

On the other hand, accessing the `/crashme` route simulates an application
crash:

```command
curl http://localhost:3000/crashme
```

```text
[output]
Crashing server!
```

After these actions, executing the `pm2 list` command will show the restart
count has risen to 3, yet the application status remains online:

```command
pm2 list
```

```text
[output]
┌─────┬─────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name        │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼─────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ dadjokes    │ default     │ 1.0.0   │ fork    │ 10008    │ 2s     │ 3    │ online    │ 0%       │ 53.5mb   │ ayo      │ disabled │
└─────┴─────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

Currently, PM2 doesn't offer the flexibility to adjust restart behavior based on
an application's exit code. Although the `--stop-exit-codes` flag is
[documented](https://pm2.keymetrics.io/docs/usage/restart-strategies/), it seems
non-functional in the recent versions. This limitation is being tracked in an
[open GitHub issue](https://github.com/Unitech/pm2/issues/5208).

```command
pm2 start --stop-exit-codes 0 --name 'dadjokes' server.js
```

```text
[output]
error: unknown option `--stop-exit-codes'
```

In the next step, you will configure other auto-restart strategies through the
PM2 configuration file.

## Step 7 — Fine-tuning auto-restart strategies

PM2 employs an `ecosystem.config.js` file to consolidate
[configuration settings](https://pm2.keymetrics.io/docs/usage/application-declaration/)
for one or more applications. To generate this file in your project directory,
use:

```command
pm2 init simple
```

Upon execution, you should see:

```text
[output]
File /home/ayo/dev/demo/dadjokes/ecosystem.config.js generated
```

Edit the `ecosystem.config.js` file and update the `name` and `script` fields to
match your application:

```javascript
[label ecosystem.config.js]
module.exports = {
  apps: [{
  [highlight]
    name: 'dadjokes',
    script: './server.js',
  [/highlight]
  }]
}
```

With this configuration, you can manage all declared applications:

```command
pm2 start ecosystem.config.js
```

```command
pm2 restart ecosystem.config.js
```

```command
pm2 stop ecosystem.config.js
```

Let's now delve into advanced restart strategies:

### Restarting based on memory usage

PM2 can restart an application upon reaching a memory limit, preventing
potential "heap out of memory errors". Configure this using the
`max_memory_restart` option:

```javascript
[label ecosystem.config.js]
module.exports = {
  apps: [{
    name: 'dadjokes',
    script: './server.js',
    [highlight]
    max_memory_restart: '1G',
    [/highlight]
  }]
}
```

This restarts the dadjokes application if memory usage surpasses 1 Gigabyte. You
can also configure the `max_memory_restart` option in Kilobyte (K), and Megabyte
(M).

### Restarting based on a CRON schedule

PM2 can restart applications based on a [cron
schedule](https://betterstack.com/community/guides/linux/cron-jobs-getting-started/). For daily restarts:

```javascript
[label ecosystem.config.js]
module.exports = {
  apps: [{
    name: 'dadjokes',
    script: './server.js',
    [highlight]
    cron_restart: '0 */24 * * *',
    [/highlight]
  }]
}
```

To learn and test the cron syntax, consider using the
[crontab guru editor](https://crontab.guru/).

### Delayed restarts

You can introduce a delay before PM2 restarts an application using the
`restart_delay` option:

```javascript
[label ecosystem.config.js]
module.exports = {
  apps: [{
    name: 'dadjokes',
    script: './server.js',
    [highlight]
    restart_delay: 5000 // wait for five seconds before restarting
    [/highlight]
  }]
}
```

### Exponential backoff restart delay

Instead of setting a fixed delay before restarting the application, you can use
the `exp_backoff_restart_delay` option to to raise the time between restarts up
to 15 seconds incrementally. The initial delay time set through this option will
be multiplied by 1.5 after each restart attempt.

```javascript
[label ecosystem.config.js]
module.exports = {
  apps: [{
    name: 'dadjokes',
    script: './server.js',
    [highlight]
    exp_backoff_restart_delay: 100 // 100ms
    [/highlight]
  }]
}
```

With the above in place, the first restart attempt will be delayed by 100ms,
second restart 150ms, then 225ms, 337.5ms, 506.25ms, and so on. This delay is
reset to 0ms if the application remains online for over 30 seconds.

### Setting a maximum restart limit

PM2 provides a `max_restarts` option for configuring the maximum number of
unstable restarts before the application is considered to have encountered an
unrecoverable error. This lets you prevent your application from constantly
dying and restarting, which may waste resources.

You can also specify an unstable restart through the `min_uptime` option. This
allows you to specify the amount of time before your application is considered
"online":

```javascript
[label ecosystem.config.js]
module.exports = {
  apps: [{
    name: 'dadjokes',
    script: './server.js',
    [highlight]
    max_restarts: 16,
    min_uptime: 5000, // 5 seconds
    [/highlight]
  }]
}
```

Once an application has reached the maximum number of restarts, it will display
an `errored` status. Your intervention will be required before the app can be up
and running once again.

```text
┌─────┬────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name           │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ dadjokes    │ default     │ 1.0.0   │ fork    │ 0        │ 0      │ 15   │ errored   │ 0%       │ 0b       │ ayo      │ disabled │
└─────┴────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

### Disabling automatic restarts

To turn off automatic restarts entirely, set the `autorestart` option to
`false`:

```javascript
[label ecosystem.config.js]
module.exports = {
  apps: [{
    name: 'dadjokes',
    script: './server.js',
    [highlight]
    autorestart: false,
    [/highlight]
  }]
}
```

---

Now, go ahead and integrate these strategies into your `ecosystem.config.js`:

```javascript
[label ecosystem.config.js]
module.exports = {
  apps: [
    {
      name: 'dadjokes',
      script: './server.js',
      [highlight]
      exp_backoff_restart_delay: 100,
      max_memory_restart: '1G',
      max_restarts: 10,
      min_uptime: 2000,
      [/highlight]
    },
  ],
};
```

Remove the existing `dadjokes` instance:

```command
pm2 delete dadjokes
```

Then, relaunch it using the configuration file:

```command
pm2 start ecosystem.config.js
```

In the next section, you will discover how to start your Node.js application
automatically even after a system reboot.

## Step 8 — Launching applications on system startup

In the last section, we explored methods to keep your application resilient
against unexpected crashes. In this segment, we'll delve into how to set up a
Node.js application to autostart after system reboots or crashes using PM2 and
[Systemd on Linux](https://betterstack.com/community/guides/logging/how-to-control-systemd-with-systemctl/). Although PM2 is
compatible with various init systems, including `upstart`, `launchd`, `openrc`,
`rcd`, and `systemv`, this guide focuses on Systemd.

Begin by generating an init script for your system. This script will initiate
the pm2 daemon during system startup, which in turn will launch any saved
applications:

```command
pm2 startup systemd
```

The output should resemble:

```text
[output]
[PM2] Init System found: systemd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/home/<username>/.local/share/nvm/v20.5.0/bin /home/<username>/.local/share/nvm/v20.5.0/lib/node_modules/pm2/bin/pm2 startup systemd -u <username> --hp /home/<username>
```

Go ahead and run the generated command shown above to configure the Systemd
startup script:

```command
sudo env PATH=$PATH:/home/<username>/.local/share/nvm/v16.14.0/bin /home/<username>/.local/share/nvm/v16.14.0/lib/node_modules/pm2/bin/pm2 startup systemd -u <username> --hp /home/<username>
```

A successful command will yield:

```text
[output]
[PM2] Init System found: systemd

. . .

[PM2] [v] Command successfully executed.
+---------------------------------------+
[PM2] Freeze a process list on reboot via:
$ pm2 save

[PM2] Remove init script via:
$ pm2 unstartup systemd
```

If you encounter an error, it might indicate that the `pm2` service file was
created but couldn't be enabled. In such cases, manually enable the service:

```command
sudo systemctl enable pm2-<username>
```

To ensure that PM2 automatically starts any saved processes upon system boot,
save your PM2 process list:

```command
pm2 save
```

```text
[output]
pm2 save
[PM2] Saving current process list...
[PM2] Successfully saved in /home/<username>/.pm2/dump.pm2
```

Now, PM2 is set to launch saved processes on system boot automatically, and you
can update this list anytime with `pm2 save`. Test this by rebooting your system
and running `pm2 list` afterward. If any issues arise, use the following command
to launch all applications:

```command
pm2 resurrect
```

To deactivate the startup script, employ the `pm2 unstartup` command. It's a
good practice to do this whenever you upgrade Node.js, ensuring that the
subsequent `pm2` startup uses the updated Node.js binary.

If you need to disable the startup script, use the `pm2 unstartup` command. You
should always do this after upgrading your Node.js version so that when you run
`pm2 startup` again, it'll generate a startup configuration that uses the latest
Node.js binary.

At this point, you've learned all the ways PM2 ensures your application's
resilience against external disruptions like system reboots. For continuous
monitoring of your application's online status, consider implementing
[uptime monitoring checks](https://betterstack.com/uptime) for timely
notifications on server availability and other related issues.

## Step 9 — Stopping and deleting your application

PM2 offers the `stop` and `delete` commands to halt an application and expunge
it from the process list, respectively. These commands can target specific
applications by their names, ids, namespaces, configuration files, or you can
use the `all` keyword to target every application.

To halt all applications defined in the `ecosystem.config.js` file, use:

```command
pm2 stop ecosystem.config.js
```

```text
[output]
[PM2] [dadjokes](0) ✓
┌─────┬─────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name        │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼─────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ dadjokes    │ default     │ 1.0.0   │ fork    │ 0        │ 0      │ 3    │ stopped   │ 0%       │ 0b       │ ayo      │ disabled │
└─────┴─────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────���──────────┘
```

When you pass the `all` keyword, it causes the `delete` subcommand to act on all
the applications in the list:

```command
pm2 delete all
```

```text
[output]
[PM2] Applying action deleteProcessId on app [all](ids: [ 0 ])
[PM2] [dadjokes](0) ✓
┌─────┬───────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name      │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
└─────┴───────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

After deleting your application, you may need to run `pm2 save` to update
process list dump file.

### Ensuring a graceful shutdown

To guarantee a smooth shutdown when employing the `restart`, `stop`, `reload`,
or `delete` commands, it's crucial to catch the `SIGINT` or `SIGTERM` signals.
This ensures that any essential cleanup tasks are executed before the
application terminates, such as processing all current requests and releasing
resources like files and database connections.

Below is a sample that stops the server from accepting new connections when the
`SIGINT` and `SIGTERM` signals are detected, and then terminates the process:

```javascript
[label server.js]
. . .

function cleanupAndExit() {
  server.close(() => {
    console.log('dadjokes server closed');
    process.exit(0);
  });
}

[highlight]
process.on('SIGTERM', cleanupAndExit);
process.on('SIGINT', cleanupAndExit);
[/highlight]
```

## Step 10 — Managing your application logs

PM2 automatically archives logs generated by your application in the
`$HOME/.pm2/logs` directory. Logs directed to the standard output are stored in
the `<app_name>-out.log` file, while logs directed to the standard error are
stored in the `<app_name>-error.log` file.

```command
ls ~/.pm2/logs
```

```text
[output]
dadjokes-error.log  dadjokes-out.log
```

Within the `ecosystem.config.js` file, you can define the `error_file` and
`out_file` options to specify custom locations for the application's error and
output log files:

```javascript
[label ecosystem.config.js]
module.exports = {
  apps: [
    {
      name: 'dadjokes',
      script: './server.js',
      exp_backoff_restart_delay: 100,
      max_memory_restart: '1G',
      max_restarts: 10,
      min_uptime: 2000,
      [highlight]
      out_file: '<custom_path>', // use /dev/null to disable
      error_file: '<custom_path>', // use /dev/null to disable
      [/highlight]
    },
  ],
};
```

### Enabling log rotation

To ensure that your application log files are rotated before they get too large,
install the [pm2-logrotate](https://github.com/keymetrics/pm2-logrotate) module
as shown below:

```command
pm2 install pm2-logrotate
```

Afterward, when you run `pm2 list`, you should see a new "Module" section like
so:

```text
[output]
┌─────┬──────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name             │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼──────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ dadjokes         │ default     │ 1.0.0   │ fork    │ 9408     │ 3m     │ 0    │ online    │ 0%       │ 50.2mb   │ ayo      │ disabled │
└─────┴──────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
Module
┌────┬──────────────────────────────┬───────────────┬──────────┬──────────┬──────┬──────────┬──────────┬──────────┐
│ id │ module                       │ version       │ pid      │ status   │ ↺    │ cpu      │ mem      │ user     │
├────┼──────────────────────────────┼───────────────┼──────────┼──────────┼──────┼──────────┼──────────┼──────────┤
│ 1  │ pm2-logrotate                │ 2.7.0         │ 12068    │ online   │ 0    │ 0%       │ 21.4mb   │ ayo      │
└────┴──────────────────────────────┴───────────────┴──────────┴──────────┴──────┴──────────┴──────────┴──────────┘
```

By default, the `pm2-logrotate` module rotates log files once they exceed 10
megabytes. It retains up to 30 rotated files and deletes older ones. Backup
files are not compressed by default. You can adjust these settings and more by
referring to the module's documentation, or you use
[logrotate](https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/) to handle
log file rotation instead.

The `pm2 logs` command may come in handy in development for displaying incoming
application log entries in real time:

```command
pm2 logs dadjokes
```

```text
[output]
PM2        | 2022-03-14T09:18:30: PM2 log: App [dadjokes:0] starting in -fork mode-
PM2        | 2022-03-14T09:18:30: PM2 log: App [dadjokes:0] online
PM2        | 2022-03-14T09:23:18: PM2 log: Stopping app:dadjokes id:0
PM2        | 2022-03-14T09:23:18: PM2 log: App [dadjokes:0] exited with code [0] via signal [SIGINT]
PM2        | 2022-03-14T09:23:18: PM2 log: App [dadjokes:0] will restart in 100ms
PM2        | 2022-03-14T09:23:18: PM2 log: pid=21869 msg=process killed
PM2        | 2022-03-14T09:23:38: PM2 log: [PM2][WORKER] Reset the restart delay, as app dadjokes has been up for more than 30000ms

PM2      | App [dadjokes:0] starting in -fork mode-
PM2      | App [dadjokes:0] online
0|dadjokes  | Random Joke server started on port: 3000
0|dadjokes  | GET /joke 200 97 - 760.323 ms
0|dadjokes  | GET /joke 200 92 - 750.802 ms
0|dadjokes  | GET /joke 200 117 - 715.876 ms
```

To explore all available options for the `logs` command and customize its
output, use:

```command
pm2 logs --help
```

## Step 11 — Clustering with PM2

PM2 offers a cluster mode, enabling networked Node.js applications to harness
the full power of the host's CPUs without any code changes. This results in
launching multiple application instances (based on your machine's CPU count) on
the same port, effectively distributing incoming workloads among them and
enhancing performance.

Internally, PM2 relies on
[Node.js's cluster module](https://nodejs.org/api/cluster.html) to spawn child
processes that share the server port. Your application should be stateless to
maximize the benefits of PM2's cluster mode. This ensures that any reference to
past transactions is managed through a shared, stateful medium like a database
or cache.

To initiate your application in cluster mode, first remove it from the process
list. Then, specify the number of workers via the `instances` option and set the
`exec_mode` option to `cluster`:

```javascript
[label ecosystem.config.js]
module.exports = {
  apps: [
    {
      . . .
      [highlight]
      instances: 'max',
      exec_mode : 'cluster',
      [/highlight]
    },
  ],
};
```

Then, use the start command with the `-i` flag:

```command
pm2 start ecosystem.config.js -i max
```

Here, `max` instructs PM2 to spawn as many workers as there are CPU cores. While
you can specify a particular number, it's not recommended to exceed the number
of CPU cores, as it can lead to resource contention and performance issues.

A common practice is to spawn one worker less than the total CPU cores. If your
server has four cores, you'd typically spawn three workers. Achieve this in PM2
by setting `instances` to `-1`:

```javascript
[label ecosystem.config.js]
module.exports = {
  apps: [
    {
      . . .
      [highlight]
      instances: -1,
      [/highlight]
      exec_mode : 'cluster',
    },
  ],
};
```

Starting the application will yield:

```text
[PM2] App [dadjokes] launched (3 instances)
┌────┬─────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name        │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼─────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ dadjokes    │ default     │ 1.0.0   │ cluster │ 1000013  │ 0s     │ 0    │ online    │ 0%       │ 51.9mb   │ ayo      │ disabled │
│ 1  │ dadjokes    │ default     │ 1.0.0   │ cluster │ 1000023  │ 0s     │ 0    │ online    │ 0%       │ 48.1mb   │ ayo      │ disabled │
│ 2  │ dadjokes    │ default     │ 1.0.0   │ cluster │ 1000035  │ 0s     │ 0    │ online    │ 0%       │ 40.3mb   │ ayo      │ disabled │
└────┴─────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

You'll notice that the application launches in `cluster` mode, not `fork` as
before. The number of workers corresponds to your machine's CPU cores.

Using cluster mode ensures balanced request handling across workers. The
`NODE_APP_INSTANCE` environment variable can distinguish between processes,
handy for operations exclusive to one process.

Modify the `/joke` endpoint in your `server.js` file as shown below:

```javascript
[label server.js]
app.get('/joke', async (req, res, next) => {
  console.log('Request handled by process:', process.env.NODE_APP_INSTANCE);

  if (process.env.NODE_APP_INSTANCE === '0') {
    console.log('Executing some operation on process 0 only...');
  }

  try {
    const response = await getRandomJoke();
    res.json(response);
  } catch (err) {
    next(err);
  }
});
```

Restart the application through the command below:

```command
pm2 restart ecosystem.server.js
```

Afterward, send a handful of requests to the `/joke` endpoint and view the logs:

```command
pm2 logs dadjokes
```

```text
[output]
0|dadjokes  | Request handled by process: 0
0|dadjokes  | Executing some operation on process 0 only...
1|dadjokes  | Request handled by process: 1
2|dadjokes  | Request handled by process: 2
0|dadjokes  | Request handled by process: 0
0|dadjokes  | Executing some operation on process 0 only...
1|dadjokes  | Request handled by process: 1
0|dadjokes  | GET /joke 200 106 - 1935.223 ms
2|dadjokes  | Request handled by process: 2
0|dadjokes  | GET /joke 200 160 - 1137.809 ms
0|dadjokes  | Request handled by process: 0
0|dadjokes  | Executing some operation on process 0 only...
1|dadjokes  | Request handled by process: 1
2|dadjokes  | GET /joke 200 171 - 1083.629 ms
2|dadjokes  | GET /joke 200 100 - 2079.859 ms
2|dadjokes  | Request handled by process: 2
0|dadjokes  | Request handled by process: 0
0|dadjokes  | Executing some operation on process 0 only...
0|dadjokes  | GET /joke 200 119 - 1070.117 ms
2|dadjokes  | GET /joke 200 130 - 1073.907 ms
1|dadjokes  | GET /joke 200 142 - 6049.548 ms
1|dadjokes  | GET /joke 200 111 - 3412.896 ms
1|dadjokes  | GET /joke 200 148 - 5938.372 ms
0|dadjokes  | GET /joke 200 111 - 5827.303 ms
```

You'll observe that a number prefixes each log entry. This number is the `id`
for each worker process, and it can be accessed in the application code via
`process.env.NODE_APP_INSTANCE` as demonstrated earlier. Notice how we can
execute some code on process `0` only even though requests were sent to all
three worker instances (on our test machine, could be more or less on yours).

![Screenshot of pm2 load balancing](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66251724-2683-4160-dfe3-952c23dbfb00/public
=1357x768)

An advantage of cluster mode is zero-downtime reloads in production using
`pm2 reload`. This restarts processes sequentially, ensuring continuous
availability. Conversely, `pm2 restart` halts and restarts all processes
simultaneously, causing brief downtime.

PM2 also offers dynamic scaling with the scale command. For instance, to add two
workers:

```command
pm2 scale dadjokes +2
```

Or, to set a specific number of workers:

```command
pm2 scale dadjokes 2
```

This flexibility ensures your application can adapt to varying workloads quickly
and efficiently.

## Step 12 — Deploying your application to production

PM2 provides an
[integrated deployment system](https://pm2.keymetrics.io/docs/usage/deployment/)
to facilitate deploying your application to one or multiple remote servers. To
set this up, modify your `ecosystem.config.js` file as follows:

```javascript
[label ecosystem.config.js]
module.exports = {
  apps: [],
  [highlight]
  deploy: {
    production: {
      user: '<your_remote_server_username>',
      host: [<your_remote_server_ip>],
      ref: 'origin/master',
      repo: '<your_git_repo_url>',
      path: '/home/<your_server_username>/dadjokes',
      'post-setup': 'npm install',
      'post-deploy': 'pm2 startOrRestart ecosystem.config.js --env production',
    },
  },
  [/highlight]
};
```

Here's a breakdown of the production object properties:

- `user`: The username for authentication on the remote server.
- `host`: An array of IP addresses of the remote servers.
- `ref`: The git branch and remote to deploy, e.g., `origin/master`.
- `repo`: The git repository's remote URL (HTTPS or SSH).
- `path`: The directory on the remote server where the repository will be
  cloned.
- `post-setup`: Commands or scripts to run post cloning.
- `post-deploy`: Commands or scripts to run after deployment.

Before deploying to the specified host servers, ensure each has PM2 installed
and the necessary permissions to clone the Git repository (e.g., the correct SSH
key setup). Once set up, initiate the server provisioning with:

```command
pm2 deploy production setup
```

Here's the output to expect if everything goes well:

```text
[output]
--> Deploying to production environment
--> on host <your_remote_server_ip>
  ○ hook pre-setup
  ○ running setup
  ○ cloning https://github.com/betterstack-community/dadjokes
  ○ full fetch
Cloning into '/home/ayo/dadjokes/source'...
  ○ hook post-setup
  ○ setup complete
--> Success
```

If you encounter an error, it's likely SSH-related, preventing PM2 from
accessing the remote server or Git repository. Start your investigation by
ensuring that the `git clone <your_git_repo_url>` command works on the remote
server. For troubleshooting PM2 deployments, refer to this
[guide](https://pm2.keymetrics.io/docs/usage/deployment/).

After successful provisioning, deploy the application:

```command
pm2 deploy production
```

```command
pm2 deploy production --force # if there are local changes
```

A successful deployment will show:

```text
[output]
--> Deploying to production environment
--> on host <your_git_repo_url>

  ○ deploying origin/prod
  ○ executing pre-deploy-local
  ○ hook pre-deploy
  ○ fetching updates
  ○ full fetch
Fetching origin
  ○ resetting HEAD to origin/prod
HEAD is now at 4c31583 Add pm2 config file
  ○ executing post-deploy `pm2 startOrRestart ecosystem.config.js --env production`
[PM2][WARN] Applications dadjokes not running, starting...
[PM2][WARN] Environment [production] is not defined in process file
[PM2] App [dadjokes] launched (1 instances)
. . .
--> Success
```

Logging into your remote server and executing `pm2 list` will confirm the
application's deployment and operational status. Additionally, you can run
commands on each remote server without logging in using the `pm2 deploy`
command. For instance, to reload the `dadjokes` application on all remote
servers, run:

```command
pm2 deploy production exec "pm2 reload dadjokes"
```

A successful reload will display:

```text
[output]
--> Deploying to production environment
--> on host <your_remote_server_ip>
Use --update-env to update environment variables
[PM2] Applying action reloadProcessId on app [dadjokes](ids: [ 0 ])
[PM2] [dadjokes](0) ✓
--> Success
```

For a deeper dive into deployment commands and hooks, consult the
[relevant PM2 documentation](https://pm2.keymetrics.io/docs/usage/deployment/).

Note that while PM2 provides a
[Docker integration](https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/)
through its `pm2-runtime` command, the
[general recommendation](https://www.docker.com/blog/keep-nodejs-rockin-in-docker/)
is to forgo using PM2 if [you're deploying your Node.js application with Docker](https://betterstack.com/community/guides/scaling-nodejs/dockerize-nodejs/).


## Monitor PM2 apps with Better Stack

PM2 keeps your Node.js applications running, but you still need external monitoring to know when your services become unreachable or start failing. [Better Stack](https://betterstack.com/uptime) provides comprehensive uptime monitoring that works alongside PM2 to give you complete visibility into your application's availability.

Better Stack monitors your endpoints every 30 seconds from 171 locations worldwide, instantly alerting you via Slack, SMS, phone calls, or email when issues occur. This external monitoring catches problems PM2 can't detect—like network issues, DNS failures, load balancer problems, or when your entire server goes down.

![Better Stack uptime monitoring dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0f2494e7-2cce-4e28-3ebf-864ada2a2a00/md2x =2276x1170)

You can create HTTP, ping, keyword, or port monitors for your PM2-managed applications. Configure SSL certificate expiration checks, set custom headers for authentication, and use keyword monitoring to verify your app returns the correct response. Better Stack automatically tracks response times, uptime percentages, and provides detailed incident timelines.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/YUnoLpCy1qQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


If you're running scheduled jobs or workers with PM2, use Better Stack's heartbeat monitoring to verify they execute successfully. Your cron jobs or workers ping Better Stack when they complete—if the ping doesn't arrive within the expected interval, you get alerted immediately. This is perfect for monitoring database backups, data processing jobs, or any scheduled tasks managed by PM2.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/H8ruTb4C2sM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


Getting started takes just minutes: [sign up for a free account](https://betterstack.com/uptime), create monitors for your PM2-managed services, and configure alert channels.

## Final thoughts

PM2 is a powerful tool for managing and maintaining Node.js applications,
offering several features to streamline development and production workflows.
While we've covered many of its capabilities in this guide, a vast array of
features is still waiting to be explored.

Whether you're looking to integrate PM2 with Docker, run it without a daemon, or
set it up with NGINX as a reverse proxy, the possibilities are vast. The
[PM2 documentation](https://pm2.keymetrics.io/docs/usage/quick-start/) should be
your next stop to gain insights into those topics and many others.

Note that the complete source code from this tutorial is available on the
[prod branch of the dadjokes GitHub repository](https://github.com/betterstack-community/dadjokes/tree/prod).
It is a practical reference and a starting point for your projects.

Thanks for reading, and happy coding!