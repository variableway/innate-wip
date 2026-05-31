# How to Monitor Docker Containers

[Docker](https://www.docker.com/) transforms how you deploy applications by providing lightweight, portable containers that run anywhere. 

However, as your containerized applications scale in production, you need to monitor their performance, resource utilization, and health. Good container monitoring helps you find bottlenecks, prevent outages, and optimize resources across your infrastructure.

This guide shows you how to build robust monitoring solutions for your Docker containers.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/t779DVjCKCs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Prerequisites

Before you start container monitoring, ensure that Docker is installed on your system. This guide assumes you're running Docker version 20.04 or later; however, most concepts are also applicable to earlier versions. You should also know basic Docker concepts like containers, images, and volumes.


## Setting up your environment

To get the most out of this tutorial, create a practical environment with multiple containers that you can monitor throughout the guide. This hands-on approach helps you understand monitoring concepts while building real skills.

Start by creating a new directory for your monitoring project:

```command
mkdir docker-monitoring-tutorial && cd docker-monitoring-tutorial
```

Create a simple web application that you can monitor. First, build a basic Node.js application:

```javascript
[label app.js]
const express = require('express');
const app = express();
const port = 3000;

let requestCount = 0;
let errors = 0;

app.get('/', (req, res) => {
  requestCount++;
  res.json({ 
    message: 'Hello World!', 
    requests: requestCount,
    uptime: process.uptime()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/error', (req, res) => {
  errors++;
  res.status(500).json({ error: 'Simulated error', count: errors });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
```

Create a `package.json` file:

```json
[label package.json]
{
  "name": "monitoring-demo",
  "version": "1.0.0",
  "main": "app.js",
  "dependencies": {
    "express": "^5.1.0"
  },
  "scripts": {
    "start": "node app.js"
  }
}
```

Now, create a Dockerfile for your application:

```dockerfile
[label Dockerfile]
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run the application:

```command
docker build -t monitoring-demo .
```

```command
docker run -d --name web-app -p 3000:3000 monitoring-demo
```

Verify the application works:

```command
curl http://localhost:3000
```
```text
[output]
{"message":"Hello from containerized app!","timestamp":"2025-07-09T15:38:55.412Z"}%                                                              
```

```command
curl http://localhost:3000/health
```

Or in the browser like this:

![Screenshot of the health output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a75bbcc8-3a05-4f12-350f-81b672b75f00/public =3248x1996)

You should see JSON responses confirming the application works. You'll use this application throughout the tutorial to demonstrate various monitoring techniques.

## Basic container monitoring with Docker commands

Now that you have a running container, explore Docker's built-in monitoring capabilities. These native tools give you immediate insights without requiring additional software.

### Real-time container statistics

The `docker stats` command shows live performance data for your running containers:

```command
docker stats web-app
```

You'll see output like this:

```text
[output]
CONTAINER ID   NAME      CPU %     MEM USAGE / LIMIT     MEM %     NET I/O       BLOCK I/O   PIDS
9d6d833b7fdd   web-app   0.00%     40.58MiB / 7.654GiB   0.52%     1.05kB / 0B   0B / 0B     18
```

Generate some load to see the metrics change. In another terminal, generate some requests:

```command
for i in {1..100}; do curl -s http://localhost:3000 > /dev/null; done
```

Watch how the CPU percentage and network I/O values increase in the `docker stats` output. This real-time feedback helps you understand your container's resource consumption patterns.

To capture a snapshot instead of continuous monitoring:

```command
docker stats --no-stream web-app
```
```text
[output]
CONTAINER ID   NAME      CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O    PIDS
9d6d833b7fdd   web-app   0.00%     43.48MiB / 7.654GiB   0.55%     49.2kB / 56.9kB   0B / 4.1kB   18
```
### Examining container details

While `docker stats` shows real-time performance data, you often need more detailed information about your container's configuration and current state. The `docker inspect` command provides comprehensive details about how your container is configured and running.

Get complete container information in JSON format:

```command
docker inspect web-app
```

This produces extensive JSON output with hundreds of configuration details. For monitoring purposes, you'll typically want to extract specific information using formatting options.

Check if any memory limits are configured for your container:

```command
docker inspect web-app --format='{{.HostConfig.Memory}}'
```

```text
[output]
0
```

A value of `0` indicates no memory limit is set. Verify your container's current running status:

```command
docker inspect web-app --format='{{.State.Status}}'
```

```text
[output]
running
```

You can also check the boolean running state:

```command
docker inspect web-app --format='{{.State.Running}}'
```

```text
[output]
true
```

### Process monitoring inside containers

Beyond container-level statistics, you need visibility into the processes running inside your containers. This helps identify resource-intensive operations and understand what's happening within your application.

View processes running inside your container using Docker's top command:

```command
docker top web-app
```
```text
[output]
UID                 PID                 PPID                C                   STIME               TTY                 TIME                CMD
root                1565                1546                0                   15:44               ?                   00:00:00            npm start
root                1601                1565                0                   15:44               ?                   00:00:00            node app.js
```

For more detailed process information:

```command
docker exec web-app ps aux
```

You'll see the Node.js process and any child processes:

```text
[output]
PID   USER     TIME  COMMAND
    1 root      0:00 npm start
   18 root      0:00 node app.js
   25 root      0:00 ps aux
```
This information helps you identify resource-intensive operations within your containers.

Check system resources from inside the container:

```command
docker exec web-app cat /proc/meminfo | head -5
```

```text
[output]
MemTotal:        8025360 kB
MemFree:         6998344 kB
MemAvailable:    7364392 kB
Buffers:           40008 kB
Cached:           447776 kB
```

```command
docker exec web-app cat /proc/loadavg
```
```text
[output]
0.25 0.24 0.22 2/326 42
```
These commands show how the container sees system resources, which can differ from the host system's perspective.

## Implementing container health checks

Building on your basic monitoring, implement health checks for your web application. Health checks provide automated container health assessment beyond simply checking if the process runs.

### Adding health checks to your application

Health checks go beyond basic process monitoring by actively testing your application's functionality. Docker can automatically run health check commands at regular intervals to verify your application is responding correctly.

First, rebuild your container with a health check. Update the Dockerfile:

```dockerfile
[label Dockerfile]
FROM node:22-alpine
WORKDIR /app

[highlight]
# Install curl for health checks
RUN apk add --no-cache curl
[/highlight]

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000

[highlight]
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
[/highlight]

CMD ["npm", "start"]
```

The `HEALTHCHECK` instruction configures Docker to test your `/health` endpoint every 30 seconds. If the health check fails 3 times in a row, Docker marks the container as unhealthy.

Stop the existing container to prepare for the rebuild:

```command
docker stop web-app
```

Remove the container completely:

```command
docker rm web-app
```

Build the updated image with health check capabilities:

```command
docker build -t monitoring-demo .
```

Run the new container with integrated health monitoring:

```command
docker run -d --name web-app -p 3000:3000 monitoring-demo
```

### Monitoring health check results

Now that your container includes health checks, Docker automatically monitors your application's health and reports the status. This provides more reliable monitoring than simply checking if the process is running.

Check the health status of your container:

```command
docker ps
```

```text
[output]
CONTAINER ID   IMAGE                  COMMAND                  CREATED          STATUS                   PORTS                    NAMES
64304da1b871   monitoring-demo        "docker-entrypoint.s…"   10 seconds ago   Up 9 seconds (healthy)   0.0.0.0:3000->3000/tcp   web-app
```
You'll see a status like `Up 25 seconds (healthy)` once the health check passes. To see detailed health check information:

```command
docker inspect web-app --format='{{json .State.Health}}' | jq
```

```json
[output]
{
  "Status": "healthy",
  "FailingStreak": 0,
  "Log": [
    {
      "Start": "2025-07-09T15:55:59.895713385Z",
      "End": "2025-07-09T15:55:59.965304843Z",
      "ExitCode": 0,
      "Output": "  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n                                 Dload  Upload   Total   Spent    Left  Speed\n\r  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0{\"status\":\"healthy\",\"timestamp\":\"2025-07-09T15:55:59.960Z\",\"uptime\":4.911826628}\r100    80  100    80    0     0  11999      0 --:--:-- --:--:-- --:--:-- 13333\n"
    }
  ]
}
```

This command shows the last several health check results, including timestamps and exit codes.

### Testing health check failure

Simulate a health check failure by stopping the application inside the container:

```command
docker exec web-app ps aux | grep node
```

```text
[output]
   18 root      0:00 node app.js
```

```command
docker exec web-app kill 18
```

Monitor the health status in a second terminal:

```command
while true; do docker ps --format 'table {{.Names}}\t{{.Status}}'; sleep 2; done
```

```text
[output]
NAMES     STATUS
web-app   Up 2 minutes (unhealthy)
```

You'll see the status change from `healthy` to `unhealthy` after the configured retries fail. This shows how health checks detect application failures even when the container still runs.

Restart the container to restore normal operation:

```command
docker restart web-app
```

```command
docker ps
```

```text
[output]
CONTAINER ID   IMAGE             COMMAND                  CREATED         STATUS                            PORTS                    NAMES
f3a1b2c3d4e5   monitoring-demo   "docker-entrypoint.s…"   5 minutes ago   Up 10 seconds (health: starting)   0.0.0.0:3000->3000/tcp   web-app
```

The status will show `(health: starting)` and then change to `(healthy)` once the health checks pass again:

```text
[output]
NAMES                    STATUS
web-app                  Up 38 seconds (healthy)
```

## Container log analysis and monitoring

Now explore container logging, which is crucial for monitoring application behavior and troubleshooting issues. You'll build on your existing setup to implement comprehensive log monitoring.

### Accessing and analyzing container logs

Docker captures all output from your application's standard output and error streams. The `docker logs` command provides access to these logs for analysis and troubleshooting.

View logs from your web application:

```command
docker logs web-app
```

```text
[output]

> monitoring-demo@1.0.0 start
> node app.js

App running on port 3000
...
```

For continuous monitoring, use the follow flag to watch logs in real-time:

```command
docker logs -f web-app
```

## Final thoughts

Throughout this tutorial, you've built a solid foundation for Docker container monitoring using basic commands, health checks, and log analysis. These techniques provide essential visibility into your containerized applications and help you detect issues quickly.

As your applications grow, you'll need to expand these techniques with more advanced tools like [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/). The foundation you've built here will serve you well as you scale your monitoring infrastructure.

For more advanced monitoring techniques, explore the [official Docker documentation](https://docs.docker.com/config/containers/logging/) and consider integrating with cloud-native monitoring solutions like [Better Stack](/).

Thanks for following along with this Docker monitoring tutorial, and happy monitoring!