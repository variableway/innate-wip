# Dozzle: Real-Time Log Viewer for Docker Containers

In the world of containerized applications, **managing and monitoring logs can quickly become chaotic and inefficient**. If you're working with Docker, you're likely familiar with the routine: juggling multiple terminal windows, running `docker logs -f` on each container, and endlessly scrolling to find that one crucial error message. **This fragmented workflow drains focus and slows down debugging**, pulling your attention away from actually solving the problem. But what if you could centralize everything into **one clean, real-time, and searchable interface**, without introducing the overhead of a complex logging stack?

This article explores how to achieve exactly that using **Dozzle, a lightweight, open-source, real-time log viewer built specifically for Docker containers**. You'll learn what makes Dozzle powerful, why it fits naturally into a developer’s workflow, and how to get it running **in under a minute**. From initial setup and interface navigation to advanced capabilities like **SQL-based log querying, webhook-driven alerts, and secure production deployment**, this guide covers it all. By the end, **you’ll have a faster, clearer, and dramatically more efficient Docker debugging workflow**.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/cyNv7UzNaU4" title="Better Stack Collector" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>



## What is Dozzle and why should you use it?

Dozzle is a simple yet powerful web-based application designed for one primary purpose: monitoring Docker container logs in real-time. It acts as a live log viewer that streams container output directly to your browser. Unlike comprehensive but heavy logging solutions like the ELK Stack (Elasticsearch, Logstash, Kibana) or Grafana Loki, Dozzle takes a minimalist approach.

![The Dozzle homepage, showcasing its clean interface and tagline.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4035aa4c-8d66-4486-bf38-357acf426f00/lg2x =1280x720)

### The stateless philosophy

**The most significant architectural choice behind Dozzle is that it is stateless.** This means it does not store any log files or data. When you open Dozzle, it connects to the Docker API on your host machine and begins streaming the live output from your containers. When you close the browser tab, the streaming stops, and nothing is persisted. This design has several profound advantages:

Because it doesn't store data, Dozzle has a minuscule resource footprint. The Docker image is incredibly small (around 7-10 MB), and its memory consumption is minimal. This makes it a perfect companion for local development environments where resources might be limited. You can run it alongside your applications without noticing any performance degradation.

With no database to write to or indexes to maintain, Dozzle is incredibly fast. The setup is nearly instantaneous, and the log streams appear in your browser with virtually no latency. This is critical during a debugging session when you need immediate feedback on your application's behavior.

Getting started with Dozzle requires just a single Docker command. It automatically discovers all running containers on the host, making the initial setup a breeze. There are no complex configuration files to edit or schemas to define.

Since logs are not stored, you don't have to worry about sensitive information being persisted on disk where it could potentially be compromised. Logs are streamed directly and ephemerally.

### Who is Dozzle for?

Dozzle is the perfect tool for developers, DevOps engineers, and anyone who needs immediate, real-time visibility into their containerized applications during the development and debugging phases. It excels in scenarios where you need to view logs from multiple microservices in a single, unified interface, quickly search and filter logs to find specific errors or events, monitor application startup sequences, and get immediate feedback on code changes without context-switching between terminals.

It supports not only single-host Docker setups but also Docker Swarm and Kubernetes, making it a versatile tool across different container orchestration platforms.

## Installing Dozzle

One of Dozzle's most appealing features is its incredibly simple setup process.

### Prerequisites

Before beginning, ensure you have Docker installed and running on your system. You can verify this by opening a terminal and running `docker --version`. This article also covers a Docker Compose setup, so having Docker Compose installed is beneficial for that part.

### Pulling the Dozzle Docker image

First, download the official Dozzle image from Docker Hub. This is a one-time step. Open your terminal and execute:

```command
docker pull amir20/dozzle:latest
```

This command contacts Docker Hub, finds the repository `amir20/dozzle`, and downloads the image tagged as `latest`.

![The `docker pull amir20/dozzle:latest` command being executed in the terminal.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/10817bf2-0c1b-4b35-3353-40adc5044e00/md2x =1280x720)

### Running the Dozzle container

With the image downloaded, you can now start a Dozzle container. The core of the setup is a single `docker run` command:

```command
docker run --name dozzle -d -v /var/run/docker.sock:/var/run/docker.sock -p 8080:8080 amir20/dozzle:latest --no-analytics
```

Breaking down this command:

`docker run` is the standard command to create and start a new Docker container. `--name dozzle` assigns a human-readable name to the container, making it easier to manage later on. `-d` runs the container in "detached" mode, meaning the container will run in the background.

**`-v /var/run/docker.sock:/var/run/docker.sock` is the most crucial part.** It mounts the Docker socket from the host machine into the Dozzle container. The Docker socket is a file that the Docker daemon listens to for API requests. By giving the Dozzle container access to this socket, it can communicate with the Docker daemon to get the list of containers and stream their logs. This is how Dozzle works its magic.

`-p 8080:8080` maps port 8080 on your host machine to port 8080 inside the Dozzle container. The format is `<host_port>:<container_port>`. This means you'll be able to access the Dozzle web interface through port 8080 on your local machine. If port 8080 is already in use, you can easily change it. For example, to use port 8181, you would use `-p 8181:8080`.

`amir20/dozzle:latest` specifies the image to use to create the container. `--no-analytics` is an optional flag that disables the collection of anonymous usage statistics.

![The `docker run` command for starting the Dozzle container, with the port mapping highlighted.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/223eefcc-6d0d-4d56-d4b5-85e064f74400/md1x =1280x720)

### Accessing the Dozzle web UI

That's it! Dozzle is now running. Open your web browser and navigate to `http://localhost:8080` (or whichever host port you specified). You should immediately see the Dozzle interface, populated with a list of all the containers currently running on your system.

![The Dozzle main user interface, showing a list of several running Docker containers.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7fe9f7ef-b866-4ad4-c1c6-6120745aa800/md1x =1280x720)

### Alternative setup with Docker Compose

For those who manage their application stacks with Docker Compose, adding Dozzle is just as simple. Open your `docker-compose.yml` file and add a new service definition for Dozzle:

```yaml
[label docker-compose.yml]
version: "3.8"

services:
  # ... your other application services

  dozzle:
    container_name: dozzle
    image: amir20/dozzle:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    ports:
      - "8080:8080"
    command: --no-analytics

# ... your volumes and networks
```

This configuration achieves the exact same result as the `docker run` command. Now, you can simply run `docker-compose up -d`, and Dozzle will start alongside the rest of your services, ready to monitor them.

## Navigating the Dozzle interface

The beauty of Dozzle lies in its simplicity and intuitive design. There is no steep learning curve. The interface is clean, uncluttered, and focused on delivering the information you need as quickly as possible.

### The main container view

When you first open Dozzle, you are presented with a list of all your running containers. For each container, you can see key information at a glance: the container name, the host machine the container is running on, whether the container is running or stopped, how long ago the container was created, and basic metrics like average CPU and memory consumption.

On the left-hand sidebar, you'll see a list of hosts (if you have a multi-host setup) and a filterable list of all containers, which is useful when you have a large number of services running.

### Live log streaming in action

**The core functionality of Dozzle is revealed when you click on a container from the list.** The main view will instantly switch to a live, auto-scrolling log stream for that container. New log lines appear at the bottom in real-time as your application generates them. This provides an immediate feedback loop that is invaluable for debugging.

When an action is triggered that causes an error, the `ERROR` log line appears in the Dozzle UI instantly. This is far superior to manually re-running `docker logs` and searching through the output. You see the consequence of an action the moment it happens.

![The split-screen view in Dozzle, with the container list on the left and a live, streaming log on the right.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b9a293af-665a-40b4-6fa3-b932fd627500/md1x =1280x720)

### Powerful search and filtering

At the top of the left sidebar is a search bar. This isn't just a simple name filter; it provides a quick and efficient way to find the container you're looking for, even in a crowded environment. You can start typing any part of a container's name (e.g., `db`, `api`, `worker`), and the list will instantly filter to show matching results. This allows you to jump directly to the logs you need without scrolling through a long list.

## Advanced capabilities with Dozzle v10+

While Dozzle's core strength is its simplicity, recent versions (v10 and later) have introduced powerful features that elevate it from a simple log viewer to a more sophisticated debugging and light-monitoring tool.

### Querying your logs with SQL and DuckDB

Perhaps the most exciting new feature is the integration of DuckDB, an in-process analytical database. **This integration allows you to run SQL queries directly against your log streams.** Instead of visually scanning through thousands of lines of logs, you can use the power of SQL to filter, aggregate, and analyze them programmatically.

This feature can be incredibly powerful for complex debugging scenarios. Imagine you want to find all log entries from a specific service that contain the word "Error" and occurred within a particular timeframe. Instead of manual searching, you could run a query like:

```sql
[label log-query.sql]
SELECT * FROM logs WHERE message LIKE '%Error%' AND timestamp > '2023-10-27 10:00:00';
```

This transforms your unstructured log data into a structured, queryable source of information, dramatically speeding up root cause analysis.

![The Dozzle UI displaying the output of a DuckDB SQL query, showing the structured result "42" as "answer".](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/30dad85e-244d-4ba7-f38c-da1a4bf42d00/public =1280x720)

### Setting up alerts and webhooks

Another game-changing feature in v10 is the ability to create alerts. **You can define conditions based on container metrics or log content.** For example, you can create an alert that triggers if a container's CPU usage goes above 80% for more than a minute, the phrase "FATAL ERROR" appears in a container's log, or a container unexpectedly restarts.

When an alert condition is met, Dozzle can trigger a webhook. A webhook is a simple HTTP request sent to a URL you specify. This allows you to integrate Dozzle with a wide range of third-party services. You could, for example, configure a webhook to send a notification to a Slack channel, create a ticket in Jira, or trigger a PagerDuty incident. This proactive monitoring capability means you can be notified of potential issues before they become critical problems.

## Production and security considerations

While Dozzle is a phenomenal development tool, you might also want to use it in staging or even production environments for live monitoring. When you expose Dozzle to the internet or an internal network, security becomes paramount.

### Securing your Dozzle instance

**By default, Dozzle has no authentication.** Anyone who can access the URL can see the logs of all your containers. This is a significant security risk, as the Docker socket it uses provides a high level of access to the host system.

Fortunately, Dozzle provides simple ways to secure your instance. You can enable authentication by providing environment variables when you run the container. This typically involves setting a username and password, which will prompt users for credentials before granting access to the UI. Always refer to the official Dozzle documentation for the most up-to-date and secure methods for enabling authentication.

### Deploying Dozzle in Kubernetes

Dozzle is not limited to Docker; it also works seamlessly with Kubernetes. You can deploy it within your cluster to monitor the logs from all your pods. The process involves creating a Kubernetes Deployment to run the Dozzle pod and a Service to expose it. The key is to correctly mount the necessary log directories from the cluster nodes into the Dozzle pod (e.g., `/var/log/pods/`) so it can discover and read the container logs. This can be achieved using a DaemonSet to ensure a Dozzle agent runs on every node or by mounting shared log volumes. Helm charts are often available to simplify this deployment process.

## Final thoughts

Dozzle brilliantly addresses a common and persistent pain point for developers working with containers. **It replaces the cumbersome and fragmented process of terminal-based log monitoring with a centralized, real-time, and user-friendly web interface.** By adhering to a stateless, lightweight philosophy, it delivers incredible speed and efficiency without consuming valuable system resources.

You've seen how to get Dozzle running in seconds, navigate its intuitive interface to view live log streams, and leverage its powerful search capabilities. You've also explored the advanced features in recent versions that transform it into an even more capable tool, with SQL-based log querying for deep analysis and webhook-powered alerts for proactive monitoring.

Every minute you spend wrestling with terminals is a minute you're not spending on solving the actual problem. By integrating Dozzle into your development and debugging workflow, you streamline your process, shorten your feedback loops, and ultimately become a more efficient and effective developer. Give it a try in your next Docker project; it might just become an indispensable part of your toolkit.