# Load Testing Node.js with Artillery: A Beginner's Guide

Monitoring and alerting are great ways to keep tabs on your application's
behavior, health, and performance. However, they primarily offer a reactive
approach to identifying issues.

For instance, imagine that you're preparing for a high-traffic sales event like
Black Friday. While monitoring tools can help you keep track of performance and
alert you to degraded performance incidents, wouldn't it be better to simulate
such traffic spikes and uncover hidden issues in advance, potentially averting
downtime and financial loss?

This is where load testing comes into play, acting as a proactive counterpart to
monitoring. Through open-source load testing tools like
[Artillery](https://artillery.io/), you can simulate real-world traffic
conditions and user behaviors to help identify and resolve performance
bottlenecks before they impact end users.

In this article, I'll introduce you to various Artillery features to help you
fortify your applications against real-world performance challenges, and ensure
a smoother, more reliable user experience even in high-traffic situations.

[ad-uptime]

## Prerequisites

The sole requirement for following through with this tutorial is that you must
have a [recent version of Node.js](https://nodejs.org/en/download) installed on
your computer.

## Step 1 — Downloading the demo project

To explore Artillery's features, I've prepared a
[sample application](https://github.com/betterstack-community/artillery-auth-app)
that comes with a selection of routes ready for a thorough load testing
exercise.

Begin by cloning the demo project from GitHub with the following command:

```command
git clone https://github.com/betterstack-community/artillery-auth-app.git
```

After you've finished cloning the project, navigate to the project directory and
install the required dependencies for the project:

```command
cd artillery-auth-app
```

```command
npm install
```

Once the dependencies are successfully installed, start the server with:

```command
npm start
```

You should see the following output confirming that the server is up and
running:

```text
[output]
> artillery-auth-app@1.0.0 start
> nodemon src/server.js

[nodemon] 3.1.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/server.js`
{"level":30,"time":1712124111989,"pid":3041280,"hostname":"clustering","msg":"Server listening at http://[::1]:3000"}
{"level":30,"time":1712124111991,"pid":3041280,"hostname":"clustering","msg":"Server listening at http://127.0.0.1:3000"}
{"level":30,"time":1712124111991,"pid":3041280,"hostname":"clustering","msg":"Fastify is listening on port: http://[::1]:3000"}
```

When you visit `http://localhost:3000/` in your browser, you'll be greeted by
the homepage:

![demo-app-home.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/81efa21b-58ce-4ab0-449b-4b875001c400/lg1x=2596x1474)

Going to the `/login` page and entering a valid email and password of at least
six characters will take you to the dashboard.

![demo-app-login.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4743e1e2-4566-420e-008b-a5b1e3714100/md2x
=2596x1474)

![Screenshot from 2024-04-05 20-23-40.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/eafba6cb-5871-459b-04b9-83063bc9a400/orig
=2128x964)

This sample application demonstrates basic authentication flow, which is common
in many web applications.

Our main goal here is to focus on load testing, particularly in simulating the
concurrent login attempts of multiple users.

Keep the application's server operational during this tutorial to facilitate the
upcoming steps. To avoid disruptions, use a separate terminal window for
subsequent commands.

With the web application up and running, you install Artillery next.

## Step 2 — Installing Artillery

In this section, you will install the latest version of Artillery into your
project with the following command:

```command
npm install artillery
```

Once the installation is complete, you can verify it by running the following
command:

```command
npx artillery -V
```

You should see output similar to the following:

```text
[output]

        ___         __  _ ____
  _____/   |  _____/ /_(_) / /__  _______  __ ___
 /____/ /| | / ___/ __/ / / / _ \/ ___/ / / /____/
/____/ ___ |/ /  / /_/ / / /  __/ /  / /_/ /____/
    /_/  |_/_/   \__/_/_/_/\___/_/   \__  /
                                    /____/


VERSION INFO:

Artillery: 2.0.9
Node.js:   v20.11.1
OS:        linux

```

This confirms that Artillery has been successfully installed in your project,
setting you up for the load testing exercises ahead.

## Step 3 — Getting started with Artillery

Once you've installed Artillery on your system, you can start load testing your
web application immediately.

The easiest way to get started is with the `quick` subcommand, which allows you
to test HTTP services by sending requests to a single endpoint, without writing
a test script:

```command
npx artillery quick --count 40 --num 20 http://localhost:3000/
```

Here, Artillery creates 40 virtual users for the load test, each of whom will
make 20 requests to the specified target URL, which means you will observe 800
total requests to the endpoint:

```text
[output]
. . .
--------------------------------
Summary report @ 06:18:12(+0000)
--------------------------------

http.codes.200: ............................................ 800
http.downloaded_bytes: ..................................... 725600
http.request_rate: ......................................... 249/sec
http.requests: ............................................. 800
http.response_time:
  min: ..................................................... 7
  max: ..................................................... 224
  mean: .................................................... 97.7
  median: .................................................. 100.5
  p95: ..................................................... 169
  p99: ..................................................... 198.4
http.responses: ............................................ 800
vusers.completed: .......................................... 40
vusers.created: ............................................ 40
vusers.created_by_name.0: .................................. 40
vusers.failed: ............................................. 0
vusers.session_length:
  min: ..................................................... 1421.3
  max: ..................................................... 2299.7
  mean: .................................................... 1985.8
  median: .................................................. 2018.7
  p95: ..................................................... 2186.8
  p99: ..................................................... 2186.8
```

While the test runs, Artillery prints a report every few seconds with a summary
of collected metrics for that elapsed time period. Once the test concludes, a
summary report is generated that amalgamates all the details about the test run,
which you can see above.

### Interpreting your Artillery summary report

Let's look at each of the metrics presented in the Artillery summary report and
what they all mean:

1. **http.codes.<status_code>**: Indicates the number of HTTP responses with the
   specified status code (200 in this case).

2. **http.downloaded_bytes**: This represents the total volume of data
   transferred from the server during the test.

3. **http.request_rate**: The rate of HTTP requests made per second over the
   test run period.

4. **http.requests**: This is the total number of requests sent while testing.

5. **http.response_time**: This describes various statistics related to response
   times in milliseconds:
   - **min**: The shortest response time recorded.
   - **max**: The longest response time recorded.
   - **mean**: The average response time.
   - **median**: The middle value of all response times.
   - **p95**: The response time at the 95th percentile, meaning 95% of response
     times were at or below this value.
   - **p99**: The response time at the 99th percentile, which means 99% of
     observed values were at or below this value.

6. **http.responses**: The total number of HTTP responses received, which should
   ideally match the number of requests sent.

7. **vusers.completed**: Number of virtual users that completed their test
   sessions.

8. **vusers.failed**: Shows any virtual users that failed to complete their
   sessions during the test run.

9. **vusers.session_length**: Provides insights into session length metrics,
   such as minimum, maximum, mean, median, 95th, and 99th percentile, helping
   understand the duration of user interactions under load.

When analyzing Artillery results, it's necessary to contextualize them based on
your performance requirements and expectations. Generally, you're aiming for low
response times, high request rates, and successful request outcomes with minimal
failures to see how much traffic your endpoints can handle under load.

This overview demonstrates how to run a basic load test and interpret the
results. Moving forward, we'll explore how to craft custom test scripts that
tackle various production use cases and requirements.

## Step 4 — Writing your first test script

After getting a taste of Artillery's basic load testing capabilities through the
`quick` command, it's time to dive deeper and learn how to write Artillery test
scripts. Artillery test scripts are usually written in YAML but can also be
written in JavaScript.

Using a test script allows for the reuse of test configurations, providing a
consistent framework for your team's testing efforts. It enables the
customization of scenarios and the design of more sophisticated testing
patterns.

This section will walk you through conducting a detailed load test using a
custom Artillery test script. Launch your preferred code editor and create a new
file named `artillery-load-test.yml`.

```command
code artillery-load-test.yml
```

Populate this file with the code snippet below:

```text
[label artillery-load-test.yml]
config:
  target: http://localhost:3000
  phases:
    - duration: 60
      arrivalRate: 5
      rampTo: 10
      name: Warm up

scenarios:
  - name: Test the homepage
    flow:
      - get:
          url: "/"
```

The script is structured into two primary sections: `config` and `scenarios`:

- In the `config` section, `http://localhost:3000` is designated at the base URL
  for your tests. The `phases` property specifies a test 60 seconds, which
  commences with 5 virtual users and gradually increases to 10 users by the end
  of the test.

- The `scenarios` section outlines each virtual user's actions in the
  application. We have a single scenario here that executes a GET request to the
  root endpoint.

To run your test script, use the following command:

```command
npx artillery run artillery-load-test.yml
```

This command executes your script, and you'll see an output detailing the
results of your load test:

```text
[output]
Test run id: txjzd_pqmmzt9497wgk3mnywm569k4y3cmx_9dbb
Phase started: Warm up (index: 0, duration: 60s) 06:21:33(+0000)
. . .

All VUs finished. Total time: 1 minute, 1 second

--------------------------------
Summary report @ 14:12:53(+0100)
--------------------------------

http.codes.200: ............................................ 450
http.downloaded_bytes: ..................................... 408150
http.request_rate: ......................................... 6/sec
http.requests: ............................................. 450
http.response_time:
  min: ..................................................... 2
  max: ..................................................... 10
  mean: .................................................... 5.8
  median: .................................................. 7
  p95: ..................................................... 8.9
  p99: ..................................................... 8.9
http.responses: ............................................ 450
vusers.completed: .......................................... 450
vusers.created: ............................................ 450
vusers.created_by_name.Test the homepage: .................. 450
vusers.failed: ............................................. 0
vusers.session_length:
  min: ..................................................... 3.2
  max: ..................................................... 29.7
  mean: .................................................... 8.9
  median: .................................................. 10.5
  p95: ..................................................... 13.6
  p99: ..................................................... 19.1
```

The report shows how the root endpoint behaves under a very light load, and
you'll observe that all 450 requests made to the application were completed
successfully.

With this introduction to using customized scripts for load testing, you're
ready to explore further by creating multiple load phases to simulate more
realistic traffic patterns, thereby gaining a deeper understanding of your
application's performance under various conditions.

## Step 5 — Testing multiple load phases with Artillery

Let's move from load testing with a single phase by simulating more complex user
behaviors through multi-phase testing in Artillery. This approach allows us to
examine how the system handles varying stress levels over time, including
warm-up, ramp-up, and sustained traffic phases. We'll also touch on monitoring
CPU and memory usage to gauge the server's performance under increasing loads.

To adopt a multi-phase testing strategy, adjust your `artillery-load-test.yml`
file to include the following configuration:

```text
[label artillery-load-test.yml]
config:
  target: http://localhost:3000
  phases:
    - duration: 60
      arrivalRate: 5
      rampTo: 10
      name: Warm up phase
    - duration: 60
      arrivalRate: 10
      rampTo: 50
      name: Ramp up to peak load
    - duration: 120
      arrivalRate: 50
      name: Sustained peak load

scenarios:
  - name: Test the homepage
    flow:
      - get:
          url: "/"
```

This configuration outlines three distinct testing phases:

- **Warm up phase**: Starts with a moderate load, increasing from 5 to 10 users
  per second over one minute. This simulates a gentle increase in traffic,
  letting the system adjust smoothly.
- **Ramp up to peak load phase**: Escalates the traffic from 10 to 50 users per
  second within a minute. This phase aims to mimic a rapid surge in user
  activity, testing how the system copes with abrupt demand spikes.
- **Sustained peak load phase**: Maintains a high traffic volume of 50 users per
  second for two minutes, challenging the server's ability to handle prolonged
  heavy loads.

Such testing patterns help with emulating real-world scenarios like sudden
popularity surges due to media coverage or social media trends. It helps ensure
that your application can withstand and perform under both gradual and sudden
increases in traffic.

Before running the test, prepare to monitor your server's performance using
tools like [htop](https://htop.dev/), which provides a real-time overview of CPU
and memory usage.

Go ahead and install htop (if not already installed) and launch it to keep an
eye on the server's resource consumption during the test:

```command
sudo apt install htop
```

After installation, launch htop:

```command
htop
```

![Screenshot from 2024-04-05 20-24-53.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/133c921c-7e33-4b4a-541b-640409833100/public
=3206x1356)

In htop, filter for your Node.js process to monitor its CPU and memory footprint
by pressing `F4` to filter the process list and type `src/server.js` to ensure
that only your Node.js process is left in the table. You can confirm this by
checking if the `PID` column in htop corresponds to the `pid` property in the
server logs.

Once you've filtered the list, return to your terminal to execute the
multi-phase load test:

```command
artillery run artillery-load-test.yml
```

As the test progresses, observe any significant changes in resource usage in
your Node.js application.

On my machine, I noticed a CPU usage of around 5-7% during the Warm-up phase,
which gradually ramped up to 15-17% in the Ramp-up phase where it stayed
throughout the Sustained peak load phase. On the other hand, memory usage stayed
consistently around ~130mb across the different phases on my system.

Following the test, ensure to review the results displayed in your terminal:

```text
[output]
. . .
All VUs finished. Total time: 4 minutes, 1 second

--------------------------------
Summary report @ 07:56:47(+0100)
--------------------------------

http.codes.200: ............................................ 8250
http.downloaded_bytes: ..................................... 7482750
http.request_rate: ......................................... 42/sec
http.requests: ............................................. 8250
http.response_time:
  min: ..................................................... 2
  max: ..................................................... 24
  mean: .................................................... 3.2
  median: .................................................. 3
  p95: ..................................................... 6
  p99: ..................................................... 8.9
http.responses: ............................................ 8250
vusers.completed: .......................................... 8250
vusers.created: ............................................ 8250
vusers.created_by_name.Test the homepage: .................. 8250
vusers.failed: ............................................. 0
vusers.session_length:
  min: ..................................................... 2.9
  max: ..................................................... 64.2
  mean: .................................................... 4.5
  median: .................................................. 3.9
  p95: ..................................................... 8.6
  p99: ..................................................... 12.8
```

In this case, you can see that the server is easily able to handle up to 50
concurrent users per second and that 99% of the requests were completed in under
8.9ms.

## Step 6 — Simulating user journeys with Artillery

Real-world user flows often involve multiple endpoints navigated in sequence.
For example, in an e-commerce scenario, a user journey might involve browsing
the product catalog, selecting an item, and adding it to the shopping cart.

In the case of our authentication application, a realistic user journey could
begin on the homepage, continue to the login page, and conclude when they sign
into their dashboard.

To effectively simulate such user behavior, it's necessary to enhance the
`artillery-load-test.yml` script to mimic this sequence of interactions:

```text
[label artillery-load-test.yml]
config:
  target: http://localhost:3000
  phases:
    - duration: 60
      arrivalRate: 5
      rampTo: 10
      name: Warm up phase
    - duration: 60
      arrivalRate: 10
      rampTo: 50
      name: Ramp up to peak load
    - duration: 120
      arrivalRate: 50
      name: Sustained peak load

scenarios:
  - flow:
    - get:
         url: "/"
      - get:
          url: "/login"
      - think: 2
      - post:
          url: "/login"
          json:
            email: test@example.com
            password: password123
```

This script features a scenario that simulates a user navigating through the
website by making GET requests to the homepage and login page respectively,
before pausing for two seconds to simulate the time a user spends entering their
email and password on the login form, and then sending a POST request to
indicate form submission.

Artillery is set up to follow redirects by default, and since successful logins
redirect to the `/dashboard`, there's no need to explicitly make another request
to this route in the test script.

When you run the test script once again, you will once again observe a detailed
report of the test run:

```command
npx artillery run artillery-load-test.yml
```

```text
. . .
All VUs finished. Total time: 4 minutes, 3 seconds

--------------------------------
Summary report @ 08:43:00(+0100)
--------------------------------

http.codes.200: ............................................ 24750
http.codes.303: ............................................ 16500
http.downloaded_bytes: ..................................... 34757250
http.request_rate: ......................................... 198/sec
http.requests: ..............................................41250
http.response_time:
  min: ......................................................0
  max: ......................................................25
  mean: .....................................................3.6
  median: ...................................................4
  p95: ......................................................8.9
  p99: ......................................................13.1
http.responses: .............................................41250
vusers.completed: ...........................................8250
vusers.created: .............................................8250
vusers.created_by_name.0: ...................................8250
vusers.failed: ..............................................0
vusers.session_length:
  min: ......................................................2012.2
  max: ......................................................2070.7
  mean: .....................................................2021
  median: ...................................................2018.7
  p95: ......................................................2018.7
  p99: ......................................................2059.5
```

Upon completion, the report will detail the outcome, including metrics like
response codes, which now include 303 statuses indicating successful logins and
redirections. You'll also notice that the session length for each virtual user
is over two seconds, which aligns with `think` value in the test script.

Having established the framework for simulating user flows, the forthcoming
section will explore utilizing CSV files as data sources to log in multiple
users, further enhancing the realism and utility of Artillery load testing.

## Step 7 — Customizing user requests with a CSV file

In the previous test, we implemented a simplistic approach to users' credentials
by hard-coding a single username and password for the login scenario. This
approach isn't great as it doesn't account for the diversity of user actions,
given that all virtual users are funneled through a singular identity.

To address this limitation and add more realism to your load testing, you'll now
incorporate
[Artillery's payload feature](https://www.artillery.io/docs/reference/test-script#payload---loading-data-from-csv-files)
that allows for the dynamic inclusion of data into our tests from an external
CSV file, making it ideal for scenarios that demand a broader dataset, like
simulating multiple unique user logins.

To demonstrate this feature, prepare a CSV file named `signin_data.csv` that
houses a small collection of email addresses and passwords:

```text
[label signin_data.csv]
user1@example.com,password1
user2@example.com,password2
user3@example.com,password3
```

This file structure supports testing with various user accounts, each possessing
distinct credentials, even though the number of unique accounts is still
limited.

To utilize this CSV file within your `artillery-load-test.yml` script, you must
configure the script to include a `payload` section that specifies the path to
the CSV file and the fields to be used:

```text
[label artillery-load-test.yml]
config:
  target: http://localhost:3000
  phases:
    - duration: 60
      arrivalRate: 5
      rampTo: 10
      name: Warm up phase
    - duration: 60
      arrivalRate: 10
      rampTo: 50
      name: Ramp up to peak load
    - duration: 120
      arrivalRate: 50
      name: Sustained peak load
[highlight]
  payload:
    path: "./signin_data.csv"
    fields:
      - "email"
      - "password"
[/highlight]

scenarios:
  - flow:
      - get:
          url: "/"
      - get:
          url: "/login"
      - think: 2
      - post:
          url: "/login"
          json:
[highlight]
            email: "{{ email }}"
            password: "{{ password }}"
[/highlight]
```

By implementing the `payload` attribute, the script dynamically retrieves and
injects user credentials from the `signin_data.csv` file into each login
attempt. The first column is accessed under the `email` identifier, while the
second is accessed as `password`.

This strategy improves the test's realism by simulating a diverse set of user
behaviors and interactions, moving you closer to an accurate representation of
real-world usage.

## Step 8 — Generating dynamic data with Artillery custom hooks

Artillery's custom hooks unlock the potential for significantly more dynamic and
realistic load testing scenarios by allowing the execution of custom JavaScript
functions at specified points during the test.

This is particularly useful for simulating diverse user interactions, such as
using different credentials for each virtual user, without being limited to a
predefined set of values.

Artillery supports four hooks that can be utilized for various purposes
throughout your load test:

- **beforeRequest**: Execute custom JavaScript before sending a request to allow
  for dynamic request parameter adjustments.
- **afterResponse**: Executes a custom function after a virtual user receives a
  response.
- **beforeScenario**: Run custom code before a scenario starts which is useful
  for setting up initial conditions.
- **afterScenario**: Clean up or process data after a scenario completes.

To simulate an authentication process with varied user credentials, you can
create a custom JavaScript function that generates a unique email and password
pair for each user action. Here's how you can implement it:

Create a `processor.mjs` file in your project's root with the following script
to generate random credentials:

```javascript
[label processor.mjs]
// Generate a random string of specified length
const generateRandomString = (length) =>
  Math.random().toString(36).substr(2, length);

// Function to generate random credentials and store them in the context
const getRandomCredentials = (requestParams, context, ee, next) => {
  const email = `user_${generateRandomString(8)}@example.com`;
  const password = generateRandomString(10);
  context.vars.email = email; // Store the email in the context
  context.vars.password = password; // Store the password in the context
  next(); // Proceed to the next action
};

export { getRandomCredentials };
```

This script defines a `getRandomCredentials()` function that produces unique
email addresses and passwords. These credentials are then stored in
`context.vars`, allowing them to be accessible in the test script. The `next()`
function must be called at the end to ensure the continuation of the scenario
flow.

You can incorporate the `getRandomCredentials()` function into your load testing
by updating the `artillery-load-test.yml` script accordingly:

```text
[label artillery-load-test.yml]
config:
  target: http://localhost:3000
  phases:
    - duration: 60
      arrivalRate: 5
      rampTo: 10
      name: Warm up phase
    - duration: 60
      arrivalRate: 10
      rampTo: 50
      name: Ramp up to peak load
    - duration: 120
      arrivalRate: 50
      name: Sustained peak load
[highlight]
  processor: "./processor.mjs"
[/highlight]

scenarios:
  - flow:
      - get:
          url: "/"
      - get:
          url: "/login"
      - think: 2
      - post:
          url: "/login"
[highlight]
          beforeRequest: getRandomCredentials
[/highlight]
          json:
            email: "{{ email }}"
            password: "{{ password }}"
```

The configuration above directs the test script to the `processor.mjs` file and
specifies `getRandomCredentials()` as a `beforeRequest` hook, ensuring each
login request is uniquely populated with dynamically generated credentials.

When you run the configured load test with:

```command
DEBUG=http npx artillery run artillery-load-test.yml
```

Enabling
[debug mode](https://www.artillery.io/docs/reference/engines/http#debugging)
allows you to view details about each request (URL, method, headers, etc.),
values captured during a request, and any errors that occurred during the test
run.

You'll observe that each login attempt is executed with a different set of
credentials, effectively simulating a diverse user base:

```text
[output]
. . .
2024-04-02T04:57:15.362Z http request: {
  "url": "http://localhost:3000/login",
  "method": "POST",
  "json": {
    "email": "user_76ht869x@example.com",
    "password": "e5a1197y4z"
  }
}

2024-04-02T04:57:15.416Z http request: {
  "url": "http://localhost:3000/login",
  "method": "POST",
  "json": {
    "email": "user_uru9og4f@example.com",
    "password": "mcpdrm4p9h"
  }
}
. . .
```

In the next section, you'll see how you can extend Artillery even further with
custom plugins.

## Step 9 — Extending Artillery with plugins

Artillery supports extending its core capabilities with plugins that allow you
to generate realistic test data, integrate with monitoring systems, and even
test complex scenarios.

Some plugins are built into the core `artillery` package, while others are
distributed as regular npm packages, which are
[named with an artillery-plugin- prefix](https://www.npmjs.com/search?q=artillery-plugin-).

In this section, we'll explore using
[Artillery's fake-data plugin](https://www.artillery.io/docs/reference/extensions/fake-data)
to effortlessly generate realistic test data, moving away from the need to
manually craft test values.

This example illustrates how to incorporate the plugin into your testing
strategy. It's a core plugin, so you can use it straightaway without installing
anything:

```text
[label artillery-load-test.yml]
config:
  target: http://localhost:3000
  phases:
    - duration: 60
      arrivalRate: 5
      rampTo: 10
      name: Warm up phase
    - duration: 60
      arrivalRate: 10
      rampTo: 50
      name: Ramp up to peak load
    - duration: 120
      arrivalRate: 50
      name: Sustained peak load
[highlight]
  plugins:
    fake-data: {}
[/highlight]

scenarios:
  - flow:
      - get:
          url: "/"
      - get:
          url: "/login"
      - think: 2
      - post:
          url: "/login"
[highlight]
          json:
            email: "{{ $randEmail() }}"
            password: "{{ $randPassword() }}"
[/highlight]
```

By activating the `fake-data` plugin, you no longer need to write custom
functions to generate test values. Instead, you specify the plugin in your
configuration and use its functions, such as `$randEmail()` and
`$randPassword()`, to dynamically generate authentic-looking email addresses and
passwords directly in your test scenarios.

Run the test with the following command:

```command
DEBUG=http npx artillery run artillery-load-test.yml
```

The output verifies the test's successful execution using dynamically generated,
plausible data:

```text
[output]
. . .
2024-04-05T09:43:34.072Z http request: {
  "url": "http://localhost:3000/login",
  "method": "POST",
  "headers": {
    "user-agent": "Artillery (https://artillery.io)"
  },
  "json": {
    "email": "aleksander_koster674@chello.com",
    "password": "dd0sdtQsxfQpzNH"
  }
}
2024-04-05T09:43:34.077Z http request: {
  "url": "http://localhost:3000/login",
  "method": "POST",
  "headers": {
    "user-agent": "Artillery (https://artillery.io)"
  },
  "json": {
    "email": "aleksander_koster674@chello.com",
    "password": "dd0sdtQsxfQpzNH"
  }
}
. . .
```

Artillery's plugin ecosystem extends beyond just generating fake data. Other
notable plugins include:

- [ensure](https://www.artillery.io/docs/reference/extensions/ensure), which
  checks if a metric meets a specific criteria.
- [publish-metrics](https://www.artillery.io/docs/reference/extensions/publish-metrics),
  which allows forwarding events, metrics, or traces from Artillery tests to
  external monitoring systems.
- [hls](https://www.artillery.io/docs/reference/extensions/hls), offering
  support for HTTP Live Streaming (HLS) in HTTP scenarios, broadening
  Artillery’s utility for testing streaming services.

See the [npm registry](https://www.npmjs.com/search?q=artillery-plugin-) for
more relevant plugins.

## Step 10 — Generating test reports with Artillery

Artillery displays a concise summary of your load tests in the console, but it
also supports generating detailed JSON reports. These reports offer a deep dive
into performance metrics, enabling thorough test result analysis.

To create a JSON report of your load test, utilize the `--output` flag with your
Artillery command, specifying the filename for your report:

```command
artillery run --output report.json artillery-load-test.yml
```

Executing this command produces a file named report.json in your working
directory, containing exhaustive details on the test execution, including
metrics like request rates, response times, and error counts.

Artillery currently provides the ability to convert these JSON reports into a
more accessible HTML format, but it's worth noting that this feature is expected
to be phased out in a future major update of Artillery in favor of the
[Artillery Cloud Dashboard](https://www.artillery.io/cloud) (currently in beta).
[The maintainers have noted](https://github.com/artilleryio/artillery/discussions/2405#discussioncomment-8080651)
that access to reporting will be available in the free plan.

For the time being, if you're interested in transforming your JSON report into
an HTML document for easier review, this can be accomplished using:

```command
artillery report report.json
```

After converting the report to HTML, you can view it in any web browser:

![Screenshot from 2024-04-05 08-14-35.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3ec7881f-bef2-47d5-d131-c03f1cc8eb00/lg1x
=2508x1656)

The HTML version presents the data in a visually appealing format, making it
straightforward to gauge various performance indicators such as response times,
error rates, and overall throughput.

## Step 11 — Setting request headers with Artillery

Artillery allows you to customize request headers which is useful when testing
endpoints that vary their behavior based on these headers.

For instance, an endpoint might return data in JSON format if the `Accept`
header of the request is set to `application/json`, or it might default to HTML
for other values.

To test this behavior, you can set up a load test in Artillery as follows:

```text
[label artillery-load-test.yml]
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Test API endpoint for JSON response"
    flow:
      - get:
          url: "/api/data"
[highlight]
          headers:
            Accept: "application/json"
[/highlight]
```

This setup instructs Artillery to send a GET request to `/api/data` with the
`Accept` header set to `application/json`, indicating that the client expects
the response to be in JSON format.

When executing the test with this setup:

```command
DEBUG=http npx artillery run artillery-load-test.yml
```

You should see in the debug output that the `Accept` header in the request is
set to `application/json`, which correctly communicates the desired format for
the response:

```text
[output]
. . .
2024-04-03T09:42:24.375Z http request: {
  "url": "http://localhost:3000/api/data",
  "method": "GET",
  "headers": {
    "user-agent": "Artillery (https://artillery.io)",
    "accept": "application/json"
  }
}
. . .
```

## Step 12 — Integrating Artillery into CI/CD pipelines

Integrating Artillery load testing into your CI/CD pipelines is a proactive
approach to identifying performance issues early in the development process.
This integration ensures that performance benchmarks are automatically evaluated
with each code commit, providing immediate feedback on the impact of changes.

Automated load testing within CI/CD pipelines serves as an essential checkpoint
that helps with preventing performance regressions and ensuring that new
features do not degrade the user experience.

It's important to understand that meaningful load testing doesn't necessarily
involve simulating peak traffic scenarios; even moderate load simulations can
help ensure that performance degradations are caught in development before any
changes are deployed to production.

Two Artillery plugins you might find useful in CI/CD contexts are:

1. The
   [ensure plugin](https://www.artillery.io/docs/reference/extensions/ensure):
   It helps with validating specific performance metrics against predefined
   thresholds. If the specified criteria aren't met, Artillery exits with a
   non-zero code, signaling a test failure.

2. The
   [expect plugin](https://www.artillery.io/docs/reference/extensions/expect):
   It adds support for checks and assertions on HTTP requests to enable
   functional testing in Artillery tests.

Artillery can be integrated with all the most popular platforms, such as GitHub
Actions, CircleCI, Jenkins, AWS CodeBuild, GitLab CI/CD, and others. Please see
the [documentation](https://www.artillery.io/docs/cicd) for more specific
integration instructions.

## Final thoughts

Artillery can do a lot more than what we've covered in this article, but I hope
that I've convinced you that it's a useful tool that can help complement your
observability and monitoring efforts.

For more insights into how Artillery works and other things it can do, please
see the [official documentation](https://www.artillery.io/docs).

Thanks for reading, and happy testing!