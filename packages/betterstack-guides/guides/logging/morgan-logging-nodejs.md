# Using Morgan for Request Logging in Express Apps

[Morgan](https://github.com/expressjs/morgan) is a popular used HTTP request
logger for [Node.js](https://nodejs.org/) applications, especially those built
with [Express](https://expressjs.com/) or similar frameworks. It provides a
straightforward, consistent way to log incoming HTTP requests, capturing details
like methods, URLs, response times, and status codes.

Morgan comes with predefined log formats—ranging from Apache-style combined logs
to simple one-line entries—and also allows custom token-based formats for more
fine-grained control.

In this guide, you’ll learn how to set up Morgan, integrate it with popular
frameworks, refine your log output, and route logs to various destinations.

[ad-uptime]

## Prerequisites

Before you begin, ensure you have a recent version of
[Node.js](https://nodejs.org/en/download/) and `npm` installed. This article also
assumes basic familiarity with building an Express application.

## Setting up the project directory

In this section, you'll create a directory for a simple Express application and set up the necessary configurations to get started with logging using Morgan.

First, create a new directory for your project and navigate into it. Then, initialize a new Node.js project using `npm`:

```command
mkdir morgan-logging && cd morgan-logging
```

```command
npm init -y
```

To use modern JavaScript features such as `import` statements, enable ECMAScript Modules in your project by updating the `package.json` file:

```command
npm pkg set type=module
```

This command sets the `type` field to `module` in your `package.json`, allowing you to use `import` and `export` syntax in your JavaScript files.

Next, install Express, a minimal and flexible Node.js web application framework:

```command
npm install express
```

Open your preferred code editor and create an `index.js` file in the root of your project directory with the following contents:

```javascript
[label index.js]
import express from "express";
const app = express();
const PORT = 3000

app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});

app.get("/about", (req, res) => {
  res.send("About Us");
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:3000");
});
```

With that, you are now ready to proceed to the next section.

## Why do you need Morgan?

Let’s start by testing our Express application without Morgan to understand the limitations of operating without a dedicated logging middleware. This demonstration will help illustrate why adding Morgan can significantly enhance your application's observability and debugging capabilities.

First, launch the server with:

```command
node --watch index.js
```

```text
[output]
Server running on http://localhost:3000
```

Next, open your browser and visit the following endpoints:

- `http://localhost:3000/`
- `http://localhost:3000/about`

After loading these pages, recheck your console. Notice that only the initial startup message is displayed:

```text
[output]
Server running on http://localhost:3000
```

The output has no logs indicating that the endpoints were accessed. This lack of request visibility introduces several significant drawbacks:

- Without logs, you can’t see which routes are being accessed or how frequently
- Identifying and diagnosing issues becomes challenging without a record of incoming requests and their outcomes
- You have no data on response times or status codes, making assessing and improving performance hard.
- Suspicious activities or potential security threats go unnoticed without logging.

These limitations underscore the need for a logging solution like Morgan, which provides comprehensive and consistent logging of HTTP requests, improving your ability to monitor, troubleshoot, and secure your application.

## Getting started with Morgan

In this section, you will enhance your existing Express application by adding Morgan. With Morgan, your application will gain the ability to log detailed information about incoming HTTP requests, making monitoring traffic and troubleshooting issues easier.

First, install Morgan on your machine:

```command
npm install morgan
```

Next, update your `index.js` file to use one of Morgan’s built-in formats. For example, let’s use the “combined” format, which closely resembles the Apache combined log style:

```javascript
[label index.js]
import express from "express";
[highlight]
import morgan from "morgan";
[/highlight]
const app = express();
const PORT = 3000;

[highlight]
app.use(morgan("combined"));
[/highlight]

app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});

...
```

Upon saving the changes, Node.js will automatically restart the server. Revisit the following endpoints:

- `http://localhost:3000/`
- `http://localhost:3000/about`

You will now see more detailed log entries that include the status code, response size, and user-agent:

```text
[output]
::1 - - [02/Jun/2025:10:15:14 +0000] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
::1 - - [02/Jun/2025:10:15:19 +0000] "GET /about HTTP/1.1" 304 - "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
```

These entries follow the Apache combined log format and provide comprehensive details such as the client’s IP address (`::1` for local IPv6), timestamp, HTTP method and URL (`GET /`), status code (`304`), response size, referrer, and the User-Agent string.

This structured information provides valuable insights into how users interact with your application.

## Understanding Morgan’s logging formats

Morgan provides several predefined log formats:

- **combined**: Similar to the Apache combined format; verbose and includes
  details like referrers and user-agents.
- **common**: A standard Apache common log output without referrers and user
  agents.
- **dev**: A concise color-coded output for development.
- **short**: A shorter version of the common format.
- **tiny**: The smallest output format, including basic request info and status
  code.

Switching formats is as easy as changing the string passed to `morgan()`:

```javascript
[label index.js]
...
[highlight]
app.use(morgan("tiny"));
[/highlight]

app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});
...
```

Now visit the `http://localhost:3000/` in your browser. You’ll see a simplified output such as the following in the terminal output:

```text
GET / 304 - - 9.933 ms
```

This minimal format is easier to scan during local development, but less
comprehensive than `combined`.

## Customizing Morgan’s output

Morgan allows you to customize its log outputs to better suit your needs. In addition to using predefined log formats, you can create your own by defining custom format strings or even supplying a function that returns a log line.

### Using custom tokens

Tokens are placeholders that Morgan substitutes with request-specific data at
runtime. Morgan includes built-in tokens such as `:method`, `:url`, `:status`,
and `:response-time`.

Creating custom tokens can significantly enhance the usefulness of your logs. One particularly valuable addition is a UUID (Universally Unique Identifier) for each request, ensuring that every log entry can be uniquely traced throughout your application.

To begin, install the `uuid` package:

```command
npm install uuid
```

Update `index.js` to generate and log a UUID with each request:

```javascript
[label index.js]
import express from "express";
import morgan from "morgan";
[highlight]
import { v4 as uuidv4 } from "uuid";
[/highlight]

const app = express();
const PORT = 3000;
[highlight]
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

// Define a custom Morgan token for Request ID
morgan.token("id", (req) => req.id);

// Use Morgan with the custom token in the log format
app.use(
  morgan(":id :method :url :status :res[content-length] - :response-time ms")
);
[/highlight]

app.get("/", (req, res) => {
  ...
});
```

Now, visit the endpoints again:

- `http://localhost:3000/`
- `http://localhost:3000/about`

```text
[output]
e17c72f8-cb0c-4559-9d4f-3d22b75e03d6 GET / 304 - - 16.537 ms
b06fda7c-57dd-4d8b-9a0f-3427122be655 GET /about 304 - - 1.729 ms
```

Each log line now includes a unique UUID for every request, allowing you to trace individual requests through your application more effectively.

### Using a custom format function

Building on the custom UUID token, you can achieve even greater control over your log output by defining a custom format function. Instead of relying on a predefined format string, you’ll supply a function that determines exactly how each log entry is structured. This level of customization is especially useful for producing machine-readable formats like JSON, which integrate smoothly with centralized logging systems.

To implement a custom format function, pass a logging function to Morgan that receives `(tokens, req, res)` and returns a string. This approach gives you the flexibility to include any data you need and format it however you like:

```javascript
[label index.js]
...
morgan.token("id", (req) => req.id);

[highlight]
app.use(
  morgan(function (tokens, req, res) {
    return JSON.stringify({
      requestId: tokens.id(req, res),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: parseInt(tokens.status(req, res), 10),
      responseTime: `${tokens["response-time"](req, res)} ms`,
    });
  })
);
[/highlight]
app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});
...
```

With this configuration in place, your logs will now appear as JSON:

```json
{"requestId":"4a240343-c22e-40f0-9c4b-5b937ecc8215","method":"GET","url":"/","status":304,"responseTime":"3.568 ms"}
{"requestId":"91093119-86ab-4861-bdad-7d35886751b7","method":"GET","url":"/about","status":304,"responseTime":"0.726 ms"}
```

Producing JSON logs makes it easier for automated systems to parse and index your log data. This structured format is especially beneficial in production environments where logs are aggregated, analyzed, and monitored through centralized platforms.

## Prettifying logs for development

When developing your application, having human-readable and color-coded logs can significantly improve the debugging experience. Morgan’s `dev` format is handy during development, providing colorized output and highlighting essential details like status codes.

To enable the `dev` format, adjust your code as follows:

```javascript
[label index.js]
import express from "express";
import morgan from "morgan";
import { v4 as uuidv4 } from "uuid";
const app = express();
const PORT = 3000;
[highlight]
app.use(morgan("dev"));
[/highlight]

app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});
...
```

After refreshing the endpoint, you’ll see output similar to the following:

![Colored and formatted log screenshot](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2f67645b-3364-435e-e21a-153f97421f00/lg2x =1404x1170)

The `dev` format uses colors to distinguish successful requests (green) from
errors (red) and so on, improving readability at a glance.

## Centralizing and monitoring your logs

As your application grows, logs generated by different services, servers, and containers become scattered and difficult to analyze. Without a unified view, identifying issues, tracking performance trends, and maintaining security standards is time-consuming and error-prone. Centralizing your logs in a single platform transforms scattered data into actionable intelligence, making your application more resilient and high-performing.

[Better Stack Telemetry](https://betterstack.com/telemetry) provides a great solution for centralizing and monitoring your Node.js logs. By directing Morgan’s structured, JSON-formatted logs to Better Stack, you gain the ability to:

- View all logs from your entire infrastructure in one place, eliminating the need to check multiple sources.
- Filter and query logs based on response times, status codes, or URLs
- Detect irregular patterns, suspicious activities, and errors before they escalate, maintaining a clear audit trail.
- Collaborate more effectively by sharing dashboards, alerts, and search results so everyone can respond with the same context.

You can route Morgan’s output to Better Stack using our [Node.js client library](https://www.npmjs.com/package/@logtail/node), which requires a source token and injection host from Better Stack. Install it with this:

```command
npm install @logtail/node
```

To get the source token, [sign up for a free account](https://betterstack.com/telemetry) with Better Stack. Once you’re logged in, navigate to the **Sources** link on the left and click the **Connect source** button:

![Screenshot of Better Stack sources page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d8ff872e-626d-4edb-e48f-6dbf17846300/lg2x =3024x1530)

Give your source a descriptive name, then select `JavaScript • Node.js` under the logs section. Finally, click the **Connect source** button:

![Screenshot of source selection](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/38b1e6a3-bf3e-43c1-ed73-360b3d4eb900/lg2x =3024x4740)

When you create a log source, the system provides two pieces that work together to authenticate and route your logs: a unique **source token** (e.g., `qU73jvQjZrNFHimZo4miLdxF`), and an **ingestion host** (e.g., `s1315908.eu-nbg-2.betterstackdata.com`) that specifies where to send the data:


![Screenshot showing the Source token](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e9e46247-3cab-45fd-28f7-7f87f3438d00/public =2296x1442)

Now, update your application’s logging configuration to output JSON logs as shown earlier:

```javascript
[label index.js]
import express from "express";
import morgan from "morgan";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 3000;

[highlight]
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

morgan.token("id", (req) => req.id);

app.use(
  morgan(function (tokens, req, res) {
    return JSON.stringify({
      requestId: tokens.id(req, res),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: parseInt(tokens.status(req, res), 10),
      responseTime: `${tokens["response-time"](req, res)} ms`,
    });
  })
);
[/highlight]
app.get("/", (req, res) => {
  ...
}
....
```

To send these logs to Better Stack, install the Logtail client and integrate it with Morgan like this:

```javascript
[label index.js]
import express from "express";
import morgan from "morgan";
import { v4 as uuidv4 } from "uuid";
[highlight]
import { Logtail } from "@logtail/node"
[/highlight]

const app = express();
const PORT = 3000;
[highlight]
const logtail = new Logtail("$SOURCE_TOKEN", {
  endpoint: 'https://$INGESTING_HOST',
});
[/highlight]
...
app.use(
  morgan((tokens, req, res) => {
[highlight]
    const entry = {
      requestId: tokens.id(req, res),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: parseInt(tokens.status(req, res), 10),
      response_time: tokens["response-time"](req, res),
    };
    logtail.info("HTTP request", entry);
    return null; // We return null so nothing prints to stdout
  })
[/highlight]
);
```
**Important**: Remember to replace `$SOURCE_TOKEN` and `$INGESTING_HOST` with your actual values from your Better Stack sources page before running the code.

After saving your changes, the server will restart. Revisit the endpoints.

Return to Better Stack, and your source will update to show “Logs received!”. Click **See Live tail** to view your logs in real-time:

![Screenshot of live tail in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fc47cea1-a1f8-4796-58bc-b18cb07abf00/md2x =2444x2955)

You’ll now see your logs appear within the Better Stack interface:

![Screenshot of logs in Better Stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c57d35b0-3592-46e5-e092-6f7ad300ef00/md2x =3024x1530)

You can click on any log entry to view more details:

![Screenshot of a detailed log entry](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2a836ea8-0ed2-48b5-92e0-7c913b47d700/lg1x =3024x1622)

With that, you can centralize and monitor your logs using Better Stack.

## Final thoughts

This article focused on [Morgan](https://github.com/expressjs/morgan), a straightforward yet effective middleware for logging HTTP requests in Node.js applications. While Morgan is an excellent choice for enhancing HTTP request visibility, it’s not your only option.

For instance, if you’re already using a comprehensive logging library like [Pino](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/), you might consider integrating [pino-http](https://github.com/pinojs/pino-http) instead of Morgan to handle HTTP request logging. This approach consolidates your logging stack under a single tool, reducing complexity and overhead.

Thanks for reading, and happy logging!
