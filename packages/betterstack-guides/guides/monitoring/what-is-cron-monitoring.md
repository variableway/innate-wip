# How to Monitor if Your Cron Jobs Run Correctly

If you’re relying on cron jobs with your app, making sure they run correctly every single time is a must.

No one wants their scheduled database backup or an email campaign to fail and not know about it.

In this post, you’ll learn how to set up a system that automatically monitors your cron jobs and alerts you in case of any issues.

## How to set up cron monitoring
You need a monitoring tool like Better Stack to do this, which is now used by over 150.000 developers.

[summary]
<h3>⚖️ What’s the difference: Cron job vs. heartbeat monitoring</h3>
<p>They are, in most cases the same. Cron job monitoring specifically refers to monitoring the specific job scheduler: cron. Heartbeat monitoring is a general name for monitoring any software system or device by expecting a regular “heartbeat” (usually a GET request) on a dedicated endpoint.</p>
[/summary]

### Free method (up to 10 monitors)
[Sign up for Better Stack](https://betterstack.com/uptime/pricing), go to the **Heartbeats** tab, and create a new heartbeat. There you can create up to 10 monitors for free.

![Screenshot 2023-08-16 at 11.40.00.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f8e71908-846a-4118-c213-4a8280973c00/lg2x =2974x1022)

You can specify how often your cron runs. If it’s an hourly database, make it every hour. The grace period is there to prevent false positives - in case something runs a little slower. 

![Screenshot 2023-08-16 at 11.48.36.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d379b4f9-e2fd-4abd-c501-b7f6ea26b300/md1x =1368x364)

Then pick how you want to get alerted if something goes wrong.

![Screenshot 2023-08-16 at 11.44.22.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0ed12aa9-214d-42ac-6de9-f4901e7de300/md1x =1368x358)

Now copy the unique monitor URL and add a simple HEAD, GET, or POST request to it at the end of the cron job script.

![Screenshot 2023-08-16 at 11.50.32.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7a0a5af8-d383-4aa9-3734-e1e20fcfc500/lg2x =2058x278)

Here is an example of how this would look like in a backup script.

```bash
    #!/usr/bin/env bash

    set -o errexit
    set -o xtrace

    date=`date "+%Y-%m-%d_%H:%M:%S"`
    file="/dumps/uptime.betterstack.$date.dump"

    time dokku postgres:export uptime > "$file"

    /usr/local/bin/aws s3 cp "$file" s3://uptime-dbbackups/

    rm "$file"

    # you get this URL in the Uptime dashboard
    curl "https://uptime.betterstack.com/api/v1/heartbeat/XXXXXXXXXXXXXXXXXXXXXX"
```


What happens here is that the Heartbeat URL we've created above expects a GET or POST request every day since having made the first request.

If the code above fails, our background job won't make the request to the Heartbeat URL. In that case, the heartbeat will alert the current on-call person and create an Incident.

### Paid method (unlimited monitors)

To have more than 10 monitors, [Sign up for Better Stack](https://betterstack.com/uptime/pricing) and choose any of the paid plans. Paid plan also includes other features, including regular uptime monitoring, incident alerting with on-call and status pages.

## How to run cron jobs everywhere and anytime

Here are quick tutorials how to set up cron jobs in different environments:

- [in Python](https://betterstack.com/community/questions/how-to-run-cron-jobs-in-python/)
- [in Node](https://betterstack.com/community/questions/how-to-run-cron-jobs-in-nodejs/)
- [in Java](https://betterstack.com/community/questions/how-to-run-cron-jobs-in-java/)
- [in Rails](https://betterstack.com/community/questions/how-to-run-cron-jobs-in-rails/)
- [in Go](https://betterstack.com/community/questions/how-to-run-cron-jobs-in-go/)
- [in PHP](https://betterstack.com/community/questions/how-to-run-cron-jobs-in-php/)
- [in Windows](https://betterstack.com/community/questions/how-to-setup-cron-job-in-windows/)

And here are the most common cron timing setups and how to do them:

- [Specific time and date](https://betterstack.com/community/questions/how-to-set-up-cron-job-for-specific-time-and-date/)
- [Last day of the month](https://betterstack.com/community/questions/how-to-run-cron-job-last-day-of-month/)
- [Weekly](https://betterstack.com/community/questions/how-to-run-cron-job-weekly/)
- [Every x-minutes](https://betterstack.com/community/questions/how-to-run-cron-jobs-every-5-10-15-or-30-minutes/)
- [Every x-seconds](https://betterstack.com/community/questions/how-to-run-cron-jobs-every-5-10-or-30-seconds/)


