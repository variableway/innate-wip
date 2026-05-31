# How to Configure Nginx as a Reverse Proxy for Node.js Applications

Node.js has built-in web server capabilities that is perfectly capable of being
used in production. However, the conventional advice that has persisted from its
inception is that you should always hide a production-ready Node.js application
behind a reverse proxy server.

In this tutorial, you will learn why the recommended practice of placing a
reverse proxy in front of a Node.js server is a good one to follow and how you
can set one up quickly with only a few lines of code. We'll start by discussing
what a reverse proxy is and the benefits it provides before you get some
hands-on practice by setting up a reverse proxy for a Node.js application
through [NGINX](https://www.nginx.com/), one of the most popular options for
this purpose.

[summary]
## Side note: Get a Node.js logs dashboard

Save hours of sifting through Node.js logs. Centralize with [Better Stack](https://betterstack.com/logs) and start visualizing your log data in minutes.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Prerequisites

Before you proceed with the remainder of this tutorial, ensure that you have met
the following requirements:

- SSH access to a Linux server that includes a non-root user with root access.
  An Ubuntu 20.04 server will be used in this tutorial.
- A recent version of [Node.js](https://nodejs.org/en/download/) and
  [npm](https://www.npmjs.com/get-npm) installed on your server.
- Optionally, you should have a domain name pointing to your server's IP
  address.

## What is a reverse proxy, and why should you use it?

A reverse proxy is a special kind of web server that accepts requests from
various clients, forwards each request to the appropriate server that can handle
it, and returns the server's response to the originating client. It is usually
positioned at the edge of the network to intercept client requests before they
reach the origin server. It is often configured to modify the request in some
manner before routing it appropriately.

Once a response is sent back by the origin server, it also goes through the
reverse proxy where further processing may occur. For example, the response body
may be subjected to gzip compression or encryption for security purposes.
Another common use case for a reverse proxy is to enable SSL or TLS in
situations where the underlying server does not support it.

The use of a reverse proxy provides several benefits for web applications:

- It increases the security of your backend servers by preventing information
  about them (such as their IP address, programming language, e.t.c.) from
  leaking to the outside world. This makes it much harder for malicious actors
  to launch a targeted attack (such as a
  [Distributed Denial of Service (DDoS)](https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/)
  attack) on the server. Instead, the attack will be directed at the reverse
  proxy. Many of them provide features to help fend off such attacks by
  blacklisting a particular client IP, or limiting network connections from a
  specific client.
- Compressing responses before they are delivered back to the client helps save
  bandwidth and data costs for end-users.
- Caching responses at the reverse proxy means that they can be served directly
  without consulting the origin server, which can decrease response times
  significantly. An added benefit is that the load on the origin server is much
  reduced, which will increase performance.
- It can encrypt the communications between server and client so that resources
  on the server are freed up for the application's business logic. In addition,
  dedicated reverse proxy tools like NGINX are typically able to outperform
  Node.js in SSL (or TLS) encryption and decryption.
- Load balancing is an everyday use case for reverse proxies. They can
  distribute the load evenly for applications with multiple back-end servers to
  achieve an optimal user experience and ensure high availability. It can also
  redirect traffic to a server that's geographically closest to the originating
  client to decrease latency.

There are many options to select from when it comes to reverse proxy
servers—[Apache](https://httpd.apache.org/), [HAProxy](http://www.haproxy.org/),
[NGINX](https://www.nginx.com/), [Caddy](https://caddyserver.com/) and
[Traefix](https://traefik.io/) to name a few. NGINX is chosen here because of
its track record as the
[most popular](https://w3techs.com/blog/entry/nginx_is_now_the_most_popular_web_server_overtaking_apache)
and performant option in its category with lots of features that should satisfy
most use cases.

NGINX can be used as a reverse proxy, load balancer, mail proxy and HTTP cache.
It is also often used to serve static files from the filesystem, an area it
[particularly excels in](https://web.archive.org/web/20160929154731/http://blog.modulus.io/supercharge-your-nodejs-applications-with-nginx)
when compared to Node.js (over twice as fast compared to Express' static
middleware).

Before we install and set up NGINX on our Linux server, let's create a Node.js
application in the next step.

## Step 1 — Setting up a Node.js project

In this step, you will set up a basic Node.js application that will be used to
demonstrate the concepts discussed in this article. This application will
provide a single endpoint for retrieving price change statistics for various
cryptocurrencies in the last 24 hours. It utilizes a free API from
[Binance](https://binance-docs.github.io/apidocs/) as the data source.

Create a directory on your filesystem for this demo Node.js project and change
into it:

```command
mkdir cypto-stats && cd cypto-stats
```

Initialize your project with a `package.json` file:

```command
npm init -y
```

Afterwards, install the necessary dependencies:
[fastify](https://www.fastify.io/) as the web server framework,
[got](https://github.com/sindresorhus/got) for making HTTP requests, and
[node-cache](https://www.npmjs.com/package/node-cache) for in-memory caching.

```command
npm install fastify got node-cache
```

Once the installation completes, create a new `server.js` file in the root of
your project directory and open it in a text editor:

```command
nano server.js
```

Go ahead and populate the file with the following code, which sets up a
`/crypto` endpoint for retrieving the price change statistics and caching it for
five minutes.

```javascript
[label server.js]
const fastify = require("fastify")({
  logger: true,
});
const got = require("got");
const NodeCache = require("node-cache");

const appCache = new NodeCache();

fastify.get("/crypto", async function (_req, res) {
  try {
    let tickerPrice = appCache.get("24hrTickerPrice");

    if (tickerPrice == null) {
      const response = await got("<https://api2.binance.com/api/v3/ticker/24hr>");
      tickerPrice = response.body;

      appCache.set("24hrTickerPrice", tickerPrice, 300);
    }

    res
      .header("Content-Type", "application/json; charset=utf-8")
      .send(tickerPrice);
  } catch (err) {
    fastify.log.error(err);
    res.code(err.response.code).send(err.response.body);
  }
});

fastify.listen(3000, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
```

Save and close the file, then return to your terminal and run the following
command to start the server on port 3000:

```command
node server.js
```

You should see the following output, indicating that the server started
successfully:

```json
[output]
{"level":30,"time":1638163169765,"pid":3474,"hostname":"Kreig","msg":"Server listening at <http://127.0.0.1:3000>"}
```

Now that a running Node.js application is in place, let's go ahead and install
the NGINX server in the next section.

## Step 2 — Installing and setting up NGINX

In this step, you will install NGINX on your server through its package manager.
Since NGINX is already in the default Ubuntu repositories, you should first
update the local package index and install the `nginx` package.

Run the following commands in a separate terminal instance:

```command
sudo apt update
```

```command
sudo apt install nginx
```

After the installation is complete, run the following command to confirm that it
was installed successfully and see the installed version.

```command
nginx -v
```

You should observe the following output:

```
[output]
nginx version: nginx/1.18.0 (Ubuntu)
```

If you cannot install NGINX successfully using the method described above, try
the alternative procedures listed on the
[NGINX installation guide](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)
and ensure that you're able to install NGINX before proceeding.

After installing NGINX, Ubuntu should enable and start it automatically. You can
confirm that the `nginx` service is up and running through the command below:

```command
sudo systemctl status nginx
```

The following output indicates that the service started successfully:

```
[output]
● nginx.service - A high performance web server and a reverse proxy server
    Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
    Active: active (running) since Sun 2021-11-28 12:17:36 UTC; 6s ago
    Docs: man:nginx(8)
    Process: 532819 ExecStartPre=/usr/sbin/nginx -t -q -g daemon on; master_process on; (code=exited, status=0/S>
    Process: 532829 ExecStart=/usr/sbin/nginx -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
    Main PID: 532831 (nginx)
    Tasks: 2 (limit: 1136)
    Memory: 5.7M
    CGroup: /system.slice/nginx.service
            ├─532831 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
            └─532832 nginx: worker process

Nov 28 12:17:36 ubuntu-20-04 systemd[1]: Starting A high performance web server and a reverse proxy server...
```

If you're running a system firewall, don't forget to allow access to NGINX
before proceeding:

```command
sudo ufw allow 'NGINX Full'
```

You can now open your server's IP address in the browser to verify that
everything is working. You should see the default NGINX landing page:

![Screenshot of the default NGINX landing page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6c264055-4978-4c8c-a5b0-d2969f4f3b00/public =1335x736)

If you're not sure about your server's public IP address, run the command below
to print it to the standard output:

```command
curl -4 icanhazip.com
```

Now that you've successfully installed and enabled NGINX, you can proceed to the
next step where it will be configured as a reverse proxy for your Node.js
application.

## Step 3 — Configuring NGINX as a Reverse Proxy

In this step, you will create a server block configuration file for your
application in the NGINX `sites-available` directory and set up NGINX to proxy
requests to your application.

First, change into the `/etc/nginx/sites-available/` directory:

```command
cd /etc/nginx/sites-available/
```

Create a new file in this directory with the domain's name on which you wish to
expose your application, and open it in your text editor. This tutorial will use
`your_domain`, but ensure to replace it with your actual domain (if available).

```command
nano your_domain
```

Once open, populate the file with the following NGINX server block:

```
[label your_domain]
server {
    server_name <your_domain>;

    location / {
        proxy_pass <http://localhost:3000>;
    }
}
```

If you don't have a domain name for your application, you can use your server's
public IP address instead:

```
[label your_domain]
server {
	server_name <your_server_ip>;

	location / {
	    proxy_pass <http://localhost:3000>;
	}
}
```

The `server` block above defines a virtual server used to handle requests of a
defined type. The `server_name` directive indicates the server IP address or
domain name that is mapped to your IP address, while the `location` block is
used to define how NGINX should handle requests for the specified URI. Finally,
the `proxy_pass` directive is used here to direct all requests in the root
location to the specified address.

Once you've saved the file, head back to your terminal and create a symbolic
link (symlink) of this `your_domain` file in the `/etc/nginx/sites-enabled`
directory:

```command
sudo ln -s /etc/nginx/sites-available/your_domain /etc/nginx/sites-enabled/your_domain
```

The difference between the `sites-available` and `sites-enabled` directory is
that the former is for storing all of your virtual host (website)
configurations, whether or not they're currently enabled, while the latter
contains symlinks to files in the `sites-available` folder so that you can
selectively disable a virtual host by removing its symlink.

Before your changes can take effect, you need to reload the `nginx`
configuration as shown below:

```command
sudo nginx -s reload
```

In the next step, we'll test the NGINX reverse proxy by making requests to the
running app through the server's public IP address or connected domain to
confirm that it works as expected.

[ad-logs]

## Step 4 — Testing your application

At this point, you should be able to access your Node.js application via the
domain or public IP address of the Ubuntu server. Run the command below to
access the `/crypto` endpoint with curl:

```command
curl <your_domain>/crypto
```

or

```command
curl <your_server_ip>/crypto
```

You should see the following output (truncated):

```json
[output]
[
  {
    "symbol":"ETHBTC",
    "priceChange":"0.00114000",
    "priceChangePercent":"1.531",
    "weightedAvgPrice":"0.07509130",
    "prevClosePrice":"0.07445100",
    "lastPrice":"0.07558400",
    "lastQty":"0.06960000",
    "bidPrice":"0.07559700",
    "bidQty":"1.34580000",
    "askPrice":"0.07559800",
    "askQty":"4.62410000",
    "openPrice":"0.07444400",
    "highPrice":"0.07580100",
    "lowPrice":"0.07432200",
    "volume":"61307.31800000",
    "quoteVolume":"4603.64643133",
    "openTime":1638075364169,
    "closeTime":1638161764169,
    "firstId":311613024,
    "lastId":311773622,
    "count":160599
  },
  {
    "symbol":"LTCBTC",
    "priceChange":"-0.00001900",
    "priceChangePercent":"-0.544",
    "weightedAvgPrice":"0.00348225",
    "prevClosePrice":"0.00348900",
    "lastPrice":"0.00347100",
    "lastQty":"3.11600000",
    "bidPrice":"0.00347100",
    "bidQty":"3.85200000",
    "askPrice":"0.00347200",
    "askQty":"20.40000000",
    "openPrice":"0.00349000",
    "highPrice":"0.00353000",
    "lowPrice":"0.00341900",
    "volume":"90987.24300000",
    "quoteVolume":"316.84041690",
    "openTime":1638075364074,
    "closeTime":1638161764074,
    "firstId":74054439,
    "lastId":74085858,
    "count":31420
  }
]
```

Once you can access your Node.js application in the manner described above,
you've successfully set up NGINX as a reverse proxy for your application.

## Step 5 — Load balancing multiple Node.js servers

Load balancing refers to the process of distributing incoming traffic across
multiple servers so that the workload is spread evenly between them. The main
benefit of load balancing is that it improves the responsiveness and
availability of the application.

In this step, you'll use the [pm2](https://pm2.keymetrics.io/) process manager
to create many independent instances of your Node.js application and configure
NGINX to distribute incoming requests evenly between them.

Return to your Node.js project directory in the terminal, and run the following
command to install the `pm2` package:

```command
npm install pm2@latest
```

Afterward, open the `server.js` file in your text editor:

```command
nano server.js
```

And change the following lines:

```javascript
[label server.js]
. . .

fastify.listen(300 + process.env.NODE_APP_INSTANCE, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
```

The `NODE_APP_INSTANCE` environmental variable to used to a number that's used
to differentiate between running processes. Since no two instances of an app
spawned by `pm2` can have the same number, each one will use a different port on
the server:

Save and close the file, then kill the previous server instance with `Ctrl-C`
before running the command below to start the application in cluster mode using
the total number of available CPU cores on your server.

```command
npx pm2 start server.js -i max --name "cryptoStats"
```

You should observe a similar output to the one below:

```
[output]
[PM2] Starting /home/ayo/crypto-stats/server.js in cluster_mode (0 instance)
[PM2] Done.
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ cryptoStats        │ cluster  │ 0    │ online    │ 0%       │ 48.1mb   │
│ 1  │ cryptoStats        │ cluster  │ 0    │ online    │ 0%       │ 44.6mb   │
│ 2  │ cryptoStats        │ cluster  │ 0    │ online    │ 0%       │ 43.5mb   │
│ 3  │ cryptoStats        │ cluster  │ 0    │ online    │ 0%       │ 33.1mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

Afterward, check the logs to see the ports where the Node.js application
instances are running:

```command
npx pm2 logs
```

A subset of the output for the above command is shown below:

```
[output]
. . .
0|cryptoSt | {"level":30,"time":1638172796810,"pid":29333,"hostname":"Kreig","msg":"Server listening at <http://127.0.0.1:3000>"}
0|cryptoSt | {"level":30,"time":1638172796859,"pid":29340,"hostname":"Kreig","msg":"Server listening at <http://127.0.0.1:3001>"}
0|cryptoSt | {"level":30,"time":1638172796917,"pid":29349,"hostname":"Kreig","msg":"Server listening at <http://127.0.0.1:3002>"}
0|cryptoSt | {"level":30,"time":1638172797000,"pid":29362,"hostname":"Kreig","msg":"Server listening at <http://127.0.0.1:3003>"}
```

In this case, the application has four instances on ports `3000`, `3001`,
`3002`, and `3003`. Armed with this information, we can now configure NGINX as a
[load balancer](https://betterstack.com/community/comparisons/best-load-balancers/). Return to the `/etc/nginx/sites-available` directory:

```command
cd /etc/nginx/sites-available
```

Open the `your_domain` file in your text editor:

```command
nano your_domain
```

Update the file as shown below:

```
upstream cryptoStats {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}

server {
    server_name <your_domain_or_server_ip>;

    location / {
        proxy_pass <http://cryptoStats>;
    }
}
```

In the example above, there are four instances of the Node.js application
running on ports 3000 to 3003. All requests are proxied to the `cryptoStats`
server group, and NGINX applies load balancing to distribute the requests. Note
that when the load balancing method is not specified, it defaults to
`round-robin`.

Ensure to reload the NGINX configuration once again to apply your changes:

```command
sudo nginx -s reload
```

At this point, incoming requests to the domain or IP address will now be evenly
distributed across all specified servers in a round-robin fashion.

![betteruptime-product.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d33c19b0-5850-4648-2f74-62b763bab800/orig =1637x842)

[summary]
### 🔭 Want to get alerted when your Node.js app stops working?
Head over to [Better Uptime](https://betterstack.com/better-uptime/) start monitoring your endpoints in 2 minutes

<iframe width="100%" height="315" src="https://www.youtube.com/embed/YUnoLpCy1qQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Conclusion and next steps

In this tutorial, you learned how to set up NGINX as a reverse proxy for a
Node.js application. You also utilized its load balancing feature to distribute
traffic to multiple servers, another recommended practice for production-ready
applications. Of course, NGINX can do a lot more than what we covered in this
article, so ensure to read through [its documention](https://nginx.org/en/docs/)
to learn more about how you can use its extensive features to achieve various
results.

Thanks for reading, and happy coding!
