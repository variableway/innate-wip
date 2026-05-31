# Dockerizing Node.js Apps: A Complete Guide

Are you tired of the dreaded "it works on my machine" syndrome? By packaging
your application and its dependencies into portable, self-contained units called
containers, [Docker](https://www.docker.com/) ensures consistent behavior across
different environments, from development to production.

In this hands-on guide, I'll show you how to effortlessly "Dockerize" your
Node.js applications to unlock a smoother and more reliable development and
deployment process.

Let's get started!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/ozFFCrMedFM?si=uJHIRP4rg_PyoX4R" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Prerequisites

- Prior Node.js development experience.
- Familiarity with the Linux command-line.
- Access to a Linux machine with
  [Docker Engine](https://docs.docker.com/engine/install/) installed.

## Step 1 — Setting up the demo project

To demonstrate Node.js application development and deployment with Docker, we'll
use a
[URL shortener application](https://github.com/betterstack-community/fastify-url-shortener)
built with [Fastify](https://fastify.dev/) that stores shortened URLs in
PostgreSQL. Our goal is to create a custom Docker image to run this application
in various environments.

Begin by cloning the application from GitHub:

```command
git clone https://github.com/betterstack-community/fastify-url-shortener
```

Navigate into the project directory and install its dependencies:

```command
cd fastify-url-shortener
```

```command
npm install
```

Before running the application, we need a PostgreSQL database. Launch a
PostgreSQL Docker container using the Alpine variant of its
[official image](https://hub.docker.com/_/postgres):

```command
docker run \
  --rm \
  --name url-shortener-db \
  --env POSTGRES_PASSWORD=admin \
  --env POSTGRES_DB=url-shortener \
  --volume pg-data:/var/lib/postgresql/data \
  --publish 5432:5432 \
  postgres:alpine
```

If you don't have the `postgres:alpine` image, it will be downloaded from
DockerHub. The container will be named `url-shortener-db`, removed upon stopping
(`--rm`), and have port 5432 mapped to the same port on your host machine.

Two environmental variables are also supplied to the container:

1. `POSTGRES_PASSWORD`: This sets a password for the default `postgres` user.
   You must provide a value to this variable to use the PostgreSQL image.

2. `POSTGRED_DB`: This allows you to specify the name of the default database
   that will be created when the container is launched.

If you have a local PostgreSQL instance, stop it first to avoid port conflicts:

```command
sudo systemctl stop postgres
```

A successful launch of the container will output logs confirming database
readiness:

```text
[output]
. . .

2024-07-28 20:33:22.578 UTC [1] LOG:  starting PostgreSQL 16.3 (Debian 16.3-1.pgdg120+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit
2024-07-28 20:33:22.578 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2024-07-28 20:33:22.578 UTC [1] LOG:  listening on IPv6 address "::", port 5432
2024-07-28 20:33:22.591 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2024-07-28 20:33:22.606 UTC [29] LOG:  database system was interrupted; last known up at 2024-07-28 20:32:16 UTC
2024-07-28 20:33:22.672 UTC [29] LOG:  database system was not properly shut down; automatic recovery in progress
[highlight]
2024-07-28 20:33:23.094 UTC [1] LOG:  database system is ready to accept connections
[/highlight]
```

With the database running, open a new terminal, navigate to the project
directory, then copy `.env.sample` to `.env` and modify the `POSTGRES` entries
within as needed:

```command
cp .env.sample .env
```

```text
[label .env]
NODE_ENV=production
LOG_LEVEL=info
PORT=5000
[highlight]
POSTGRES_DB=url-shortener
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin
POSTGRES_HOST=localhost
[/highlight]
```

With the `.env` file created and updated, apply the database migrations and
start the Node.js application:

```command
npm run migrate:up
```

```text
[output]
Sequelize CLI [Node: 22.5.1, CLI: 6.6.2, ORM: 6.37.3]

Loaded configuration file "src/config/db.js".
Using environment "development".
== 20240729152055-create-url: migrating =======
== 20240729152055-create-url: migrated (0.038s)
```

```command
npm start
```

The console output will indicate the application running on port 5000:

```text
[output]
. . .
{"level":"info","time":"2024-07-28T20:58:44.149Z","pid":236289,"host":"fedora","msg":"Server listening at http://[::1]:5000"}
{"level":"info","time":"2024-07-28T20:58:44.149Z","pid":236289,"host":"fedora","msg":"Server listening at http://127.0.0.1:5000"}
[highlight]
{"level":"info","time":"2024-07-28T20:58:44.149Z","pid":236289,"host":"fedora","msg":"URL Shortener is running in development mode → PORT http://[::1]:5000"}
[/highlight]
```

You may now open `http://localhost:5000` to see the application interface:

![URL Shortener application user interface](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4f18fee3-1513-40f1-1966-48296734df00/lg2x
=1842x988)

Test its functionality by shortening a URL and clicking **Visit** to verify
redirection:

![URL Shortener app with shortened url](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9dd61b02-e521-4073-df56-4d0e27b3a700/md2x
=1842x988)

With a functional Node.js application set up, you're now ready to containerize
it using Docker.

[summary]

## Side note: Monitor your Dockerized app with Better Stack

Once your Node.js app is running in a container, make sure it stays reachable. **[Better Stack Uptime Monitoring](https://betterstack.com/uptime)** checks your endpoints from multiple regions and alerts you fast when something breaks, with timelines, error details, and screenshots so you can pinpoint the cause.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/YUnoLpCy1qQ" title="Better Stack uptime monitoring demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Step 2 — Creating a Docker image for your Node.js app

To deploy our Node.js application, we'll create a Docker image using a
[Dockerfile](https://docs.docker.com/engine/reference/builder/). This text file
provides instructions to the Docker engine on constructing the image.

Think of a Docker image as a template capturing your application and its
environment. It includes configuration details and a layered filesystem
containing the software required to run your application. A Docker container is
a live, isolated environment created from this image where your application
runs.

Essentially, Docker images define the application's build and packaging process,
while containers are the running instances.

Let's start by examining the format of the `Dockerfile` which is shown below:

```text
[label Dockerfile]
# Comment
COMMAND arguments
```

Any line that begins with a `#` is a comment (except
[parser directives](https://docs.docker.com/engine/reference/builder/#parser-directives)),
while other lines must contain a specific command followed by its arguments.
Although command names are not case-sensitive, they are often written in
uppercase to distinguish them from arguments.

Let's create a `Dockerfile` to build our URL shortener's Docker image:

```command
code Dockerfile
```

The first decision to make when writing a `Dockerfile` is choosing an
appropriate base image. This image must be capable of running Node.js code so
that your application can run within the container. A common choice is the
[official Node.js image](https://hub.docker.com/_/node) which comes
pre-installed with the necessary runtime environment for running Node.js
applications.

![Screenshot of Node.js image on DockerHub](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a191a418-5fda-4d07-eae0-2a2a270b9500/md2x
=1842x1392)

I recommend using the latest LTS version (v20.16.0 at the time of writing) to
guarantee stability when deploying to production. For the most up-to-date
information, check the
[Node.js releases page](https://nodejs.org/en/about/previous-releases).

There are also several variants to pick from, but I recommend using the latest
Alpine variant as it is known for being exceptionally lightweight and simple.

Go ahead and enter the base image into your `Dockerfile` as follows:

```text
[label Dockerfile]
# Use Node 20.16 alpine as base image
FROM node:20.16-alpine3.19 AS base
```

[This image sets up a functional Node.js environment](https://github.com/nodejs/docker-node/blob/766b2dec6f59b6c98bf190e818edb1b0c7e532c5/20/alpine3.19/Dockerfile),
saving us setup time. All subsequent instructions will be built upon this base.

Next, change the working directory within the image to `/build` with the
`WORKDIR` instruction:

```text
[label Dockerfile]
. . .

# Change the working directory to /build
WORKDIR /build
```

This directive avoids the need to run `mkdir` and `cd` when you want to navigate
into a new directory.

Installing your application dependencies is the next step. Before proceeding,
you need to copy the `package.json` and `package-lock.json` files into the image
with the `COPY` directive:

```text
[label Dockerfile]
. . .

# Copy the package.json and package-lock.json files to the /build directory
COPY package*.json ./
```

Copying `package.json` and `package-lock.json` first optimizes Docker builds by
leveraging [layer caching](https://docs.docker.com/build/cache/). Since
dependencies change less frequently than application code, this ensures that the
subsequent dependency installation instruction is only re-executed when those
files are modified, leading to significantly faster build times when only the
source code changes.

Let's add the instruction to install the application dependencies next:

```text
[label Dockerfile]
. . .

# Install production dependencies and clean the cache
RUN npm ci --omit=dev && npm cache clean --force
```

Here, we've opted for `npm ci` over `npm install` for faster and more consistent
builds. It removes any existing `node_modules` directory and installs production
dependencies (without `devDependencies`) precisely as listed in
`package-lock.json` without modifying this file. Clearing the cache also helps
reduce image size since it's not needed within the container.

Now that you've installed the application dependencies, the next step is to copy
the rest of the source code into the image:

```text
[label Dockerfile]
. . .

# Copy the entire source code into the container
COPY . .
```

Next, you can document the ports that a container built on this image will
listen on using the `EXPOSE` instruction:

```text
[label Dockerfile]
. . .

# Document the port that may need to be published
EXPOSE 5000
```

Finally, specify the command to run when starting the application:

```text
[label Dockerfile]
. . .

# Start the application
CMD ["node", "src/server.js"]
```

The `CMD` instruction defines the command for launching the application in a
container based on this image. We're using the `node` command directly here
instead of `npm start` because the latter doesn't forward termination signals
like `SIGTERM` to the application (for a graceful shutdown) but kills it
directly.

The final `Dockerfile` is thus:

```text
[label Dockerfile]
# Use Node 20.16 alpine as base image
FROM node:20.16-alpine3.19 AS base

# Change the working directory to /build
WORKDIR /build

# Copy the package.json and package-lock.json files to the /build directory
COPY package*.json ./

# Install production dependencies and clean the cache
RUN npm ci --omit=dev && npm cache clean --force

# Copy the entire source code into the container
COPY . .

# Document the port that may need to be published
EXPOSE 5000

# Start the application
CMD ["node", "src/server.js"]
```

With these instructions in place, you're ready to build the Docker image.

## Step 3 — Building the Docker image and launching a container

Having prepared your `Dockerfile`, you can create the Docker image using the
`docker build` command. Before proceeding, create a `.dockerignore` file in your
project's root directory to exclude unnecessary files from the build context.
This helps with reducing image size, speeding up builds, and preventing
accidental inclusion of sensitive information.

In our case, we'll ignore any `.env` files, the `.git` directory, and the
`node_modules` directory:

```text
[label .dockerignore]
**/*.env

# Dependencies
**/node_modules

# Other unnecessary files or directories
.git/
```

Now, build the Docker image from your project root:

```command
docker build . -t url-shortener
```

The `-t` flag assigns the `url-shortener` name to the image. You can also add a
specific tag, such as 0.1.0, using the command below. Without a tag, Docker
defaults to `latest`.

```command
docker build . -t url-shortener:0.1.0
```

After the build, verify the new image exists in your local library:

```command
docker image ls url-shortener
```

```text
[output]
REPOSITORY      TAG       IMAGE ID       CREATED          SIZE
url-shortener   latest    20f75e2d7b45   17 seconds ago   183MB
```

Now, run the image as a Docker container with `docker run`:

```command
docker run --rm --name url-shortener-app --publish 5000:5000 url-shortener
```

However, this command fails due to missing environment variables:

```text
[output]
/build/node_modules/env-schema/index.js:85
    const error = new Error(ajv.errorsText(ajv.errors, { dataVar: 'env' }))
                  ^

Error: env must have required property 'POSTGRES_USER', env must have required property 'POSTGRES_PASSWORD', env must have required property 'POSTGRES_DB'
    at envSchema (/build/node_modules/env-schema/index.js:85:19)
    at file:///build/src/config/env.js:46:16
    at ModuleJob.run (node:internal/modules/esm/module_job:222:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:316:24)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:123:5) {

. . .
```

The error indicates that the application could not find some required
environmental variables when starting the container. This makes sense since the
`.env` file wasn't copied over to the Docker image to prevent secrets from
leaking into the image.

To resolve this, pass environment variables from the `.env` file to the
container through the `--env-file` flag:

```command
docker run --rm --name url-shortener-app --publish 5000:5000 --env-file .env url-shortener
```

Now we get a different error:

```text
[output]
{"level":"fatal","time":"2024-07-28T23:07:58.786Z","pid":17,"host":"54431553635f","err":{"type":"ConnectionRefusedError","message":"","stack":"SequelizeConnectionRefusedError\n    at Client.
_connectionCallback (/build/node_modules/sequelize/lib/dialects/postgres/connection-manager.js:133:24)\n    at Client._handleErrorWhileConnecting (/app/node_modules/pg/lib/client.js:327:19)\n
   at Client._handleErrorEvent (/build/node_modules/pg/lib/client.js:337:19)\n    at Connection.emit (node:events:519:28)\n    at Socket.reportStreamError (/app/node_modules/pg/lib/connection.
js:58:12)\n    at Socket.emit (node:events:519:28)\n    at emitErrorNT (node:internal/streams/destroy:169:8)\n    at emitErrorCloseNT (node:internal/streams/destroy:128:3)\n    at process.pr
ocessTicksAndRejections (node:internal/process/task_queues:82:21)","name":"SequelizeConnectionRefusedError","parent":{"type":"AggregateError","message":"","stack":"AggregateError [ECONNREFUS
ED]: \n    at internalConnectMultiple (node:net:1118:18)\n    at afterConnectMultiple (node:net:1685:7)","aggregateErrors":[{"type":"Error","message":"connect ECONNREFUSED ::1:5432","stack":
"Error: connect ECONNREFUSED ::1:5432\n    at createConnectionError (node:net:1648:14)\n    at afterConnectMultiple (node:net:1678:16)","errno":-111,"code":"ECONNREFUSED","syscall":"connect"
,"address":"::1","port":5432},{"type":"Error","message":"connect ECONNREFUSED 127.0.0.1:5432","stack":"Error: connect ECONNREFUSED 127.0.0.1:5432\n    at createConnectionError (node:net:1648
:14)\n    at afterConnectMultiple (node:net:1678:16)","errno":-111,"code":"ECONNREFUSED","syscall":"connect","address":"127.0.0.1","port":5432}],"code":"ECONNREFUSED"},"original":{"type":"Ag
gregateError","message":"","stack":"AggregateError [ECONNREFUSED]: \n    at internalConnectMultiple (node:net:1118:18)\n    at afterConnectMultiple (node:net:1685:7)","aggregateErrors":[{"ty
pe":"Error","message":"connect ECONNREFUSED ::1:5432","stack":"Error: connect ECONNREFUSED ::1:5432\n    at createConnectionError (node:net:1648:14)\n    at afterConnectMultiple (node:net:16
78:16)","errno":-111,"code":"ECONNREFUSED","syscall":"connect","address":"::1","port":5432},{"type":"Error","message":"connect ECONNREFUSED 127.0.0.1:5432","stack":"Error: connect ECONNREFUS
ED 127.0.0.1:5432\n    at createConnectionError (node:net:1648:14)\n    at afterConnectMultiple (node:net:1678:16)","errno":-111,"code":"ECONNREFUSED","syscall":"connect","address":"127.0.0.
1","port":5432}],"code":"ECONNREFUSED"}},"msg":""}
{"level":"info","time":"2024-07-28T23:07:58.787Z","pid":17,"host":"54431553635f","msg":"Server closed"}
```

This occurs because the application is configured to connect a PostgreSQL
instance running on `localhost` within the container, where PostgreSQL isn't
running.

To enable communication between the application container and the
`url-shortener-db` container, create a custom
[Docker network](https://docs.docker.com/engine/userguide/networking/work-with-networks/):

```command
docker network create url-shortener
```

```text
[output]
b4cf8bc783d4cdcedfd623a8af1a6aa592b5b64d3e2bbaf3492064657d7f54f7
```

Stop the existing `url-shortener-db` container with `Ctrl-C`, and restart it on
the new `url-shortener` network through the `--network` option:

```command
docker run \
  --rm \
  --name url-shortener-db \
  --env POSTGRES_PASSWORD=admin \
  --env POSTGRES_DB=url-shortener \
  --volume pg-data:/var/lib/postgresql/data \
  --publish 5432:5432 \
[highlight]
  --network url-shortener \
[/highlight]
  postgres:alpine
```

Once it's up and running once again, update your `.env` file as follows:

```text
[label .env]
NODE_ENV=development
LOG_LEVEL=debug
PORT=5000
POSTGRES_DB=url-shortener-dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin
[highlight]
POSTGRES_HOST=url-shortener-db
[/highlight]
```

The `POSTGRES_HOST` variable has been updated from `localhost` to
`url-shortener-db`, which makes it possible for application container to
communicate with the PostgreSQL instance running in the `url-shortener-db`
container.

Finally, launch the application once again and apply the `--network` option like
this:

```command
docker run \
  --rm \
  --name url-shortener-app \
  --publish 5000:5000 \
  --env-file .env \
[highlight]
  --network url-shortener \
[/highlight]
  url-shortener
```

You will observe that it is successful now:

```text
[output]
. . .
{msg":"Connected to database"}
{msg":"Server listening at http://[::1]:5000"}
{msg":"Server listening at http://127.0.0.1:5000"}
{msg":"URL Shortener is running in production mode → PORT http://[::1]:5000"}
```

However, when you try to visit `http://localhost:5000`, you will observe that
the application doesn't load:

![localhost:5000 is not working on docker](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0aa31909-13a9-4e00-3df8-c6de395dce00/lg2x
=1842x1392)

Fastify (and other servers) typically listen for connections only on the local
interface (`127.0.0.1`) when running on a host machine. However, this isn't
sufficient within a Docker container as the host and other network devices can't
access it.

To enable external connections, Fastify needs to bind to an address accessible
outside the container. Using `0.0.0.0` achieves this by binding to all available
network interfaces, allowing Fastify to receive connections from any reachable
IP address.

Open your `server.js` file and modify the following line by adding the `host`
property:

```javascript
[label server.js]
. . .
const address = await app.listen({ host: '0.0.0.0', port: config.port });
. . .
```

Save the file, then quit the existing `url-shortener-app` container with
`Ctrl-C`. Now build a new version of your `url-shortener` Docker image to
replace the existing one:

```command
docker build . -t url-shortener
```

Once it finishes, relaunch the container once again:

```command
docker run \
  --rm \
  --name url-shortener-app \
  --publish 5000:5000 \
  --env-file .env \
  --network url-shortener \
  url-shortener
```

```text
[output]
. . .
{msg":"Connected to database"}
[highlight]
{msg":"Server listening at http://0.0.0.0:5000"}
{msg":"URL Shortener is running in production mode → PORT http://0.0.0.0:5000"}
[/highlight]
```

The application should now be accessible at `http://localhost:5000`.

## Step 4 — Setting up a web server

Web servers like [Nginx](https://betterstack.com/community/guides/scaling-nodejs/nodejs-reverse-proxy-nginx/) or [Caddy](https://betterstack.com/community/guides/web-servers/caddy/) are often
placed before Node.js applications to enhance performance and security. They
excel at tasks like load balancing, reverse proxying, serving static assets, and
handling SSL/TLS termination and caching. While Node.js can handle some of
these, a dedicated web server is often a more performant and robust solution for
production environments.

Let's set up a Caddy instance as a reverse proxy for our Node.js application.
Keep both the application and PostgreSQL containers running, then open a new
terminal and launch a Caddy container based on the
[official Alpine image](https://hub.docker.com/_/caddy):

Ensure to keep both application and PostgreSQL containers running, then open a
new terminal and launch a new container for Caddy by running the command below:

```command
docker run --rm --name url-shortener-caddy-server -p 80:80 caddy:alpine
```

```text
[output]
. . .
{"level":"info","ts":1722214551.173808,"logger":"http.log","msg":"server running","name":"srv0","protocols":["h1","h2","h3"]}
{"level":"info","ts":1722214551.174112,"msg":"autosaved config (load with --resume flag)","file":"/config/caddy/autosave.json"}
[highlight]
{"level":"info","ts":1722214551.1741202,"msg":"serving initial configuration"}
[/highlight]
{"level":"info","ts":1722214551.1805758,"logger":"tls","msg":"cleaning storage unit","storage":"FileStorage:/data/caddy"}
{"level":"info","ts":1722214551.1807494,"logger":"tls","msg":"finished cleaning storage units"}
```

Once you see the "serving initial configuration" message, you can visit
`http://localhost` in your browser to view the Caddy default page:

![The default Caddy Works! page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/109b6ec1-6745-49b0-bb4c-ec24c959e300/public
=1842x1392)

Exit the container with `Ctrl-C` and create a `Caddyfile` in the project root:

```command
code Caddyfile
```

Populate it with the following contents:

```text
[label Caddyfile]
http:// localhost {
	reverse_proxy url-shortener-app:5000
}
```

This `Caddyfile` configures a web server on `http://localhost` that forwards all
incoming requests to the `url-shortener-app` host listening on port 5000.

To see this in action, relaunch the Caddy container and add the highlighted
options below for persistent storage and network connectivity:

```command
docker run \
  --rm \
  --name url-shortener-caddy-server \
  -p 80:80 \
[highlight]
  -v caddy-config:/config \
  -v caddy-data:/data \
  -v $(pwd)/Caddyfile:/etc/caddy/Caddyfile \
  --network url-shortener \
[/highlight]
  caddy:alpine
```

This command now includes persistent volumes (`caddy-config` and `caddy-data)`
to store configuration and data, respectively. It also mounts your custom
`Caddyfile` and connects to the `url-shortener` network for communication with
the app container.

Now, when you access `http://localhost`, you should see the URL shortener
application functioning as it did before, but with the added benefits of a
dedicated web server. Do check out the
[Caddy docs](https://caddyserver.com/docs/) for more details.

![URL Shortener Application working via Caddy](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4f4241da-2232-4645-8a04-f410352c8f00/lg1x
=1842x1098)

## Step 5 — Using Docker Compose to manage multiple containers

I'm sure you'll agree that running multiple containers to get your application
going is quite tedious, especially if your application isn't a monolith like in
this demo but contains multiple microservices all running in standalone
containers.

This is where [Docker Compose](https://docs.docker.com/compose/) comes in.
Instead of manually creating and managing individual Docker containers using the
`docker run` command, Compose offers a solution by allowing you to define and
manage multi-container applications within a single YAML file. This streamlines
your workflow and provides a structured approach for complex applications.

Let's create a `docker-compose.yml` file in your project's root directory to
configure your Node.js application and its associated services:

```command
code docker-compose.yml
```

```yaml
[label docker-compose.yml]
services:
  app:
    build:
      context: .
    container_name: url-shortener-app
    environment:
      NODE_ENV: ${NODE_ENV}
      LOG_LEVEL: ${LOG_LEVEL}
      PORT: ${PORT}
      POSTGRES_HOST: ${POSTGRES_HOST}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: ${POSTGRES_USER}
    env_file:
     - ./.env
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - url-shortener

  caddy:
    image: caddy:alpine
    container_name: url-shortener-caddy-server
    depends_on:
      - app
    ports:
      - 80:80
    volumes:
      - caddy-config:/config
      - caddy-data:/data
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
    networks:
      - url-shortener

  postgres:
    image: postgres:alpine
    restart: always
    container_name: url-shortener-db
    env_file:
     - ./.env
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    healthcheck:
      test: [CMD-SHELL, "sh -c 'pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}'"]
      interval: 10s
      timeout: 5s
      retries: 5
    ports:
      - 5432:5432
    volumes:
      - pg-data:/var/lib/postgresql/data
    networks:
      - url-shortener

volumes:
  pg-data:
  caddy-config:
  caddy-data:

networks:
  url-shortener:
```

This configuration defines three services:

- `app`: Your URL shortener application that is dependent on a health `postgres`
  service.

- `caddy`: A Caddy web server acting as a reverse proxy, serving on port 80 and
  using a custom `Caddyfile`.

- `postgres`: An Alpine Linux-based PostgreSQL database, configured with
  specific settings and a health check to ensure readiness.

These services share the `url-shortener` network and utilize volumes to persist
data. Placeholders are used for environment variables, which will be populated
from your `.env` file when the containers are started. Notably, port 5000 isn't
published anymore, making the app accessible only via Caddy at
`http://localhost`.

Before bringing up your services with `docker compose`, run the command below to
stop and remove the existing containers with:

```command
docker stop $(docker ps -a -q)
```

```command
docker container prune -f
```

Now, run the following command to launch all three services with Compose:

```command
docker compose up --build
```

This builds the `app` image and launches all three services in the foreground.
You'll notice that the respective logs produced by each container are prefixed
with the container name as shown below:

```text
[output]
[+] Running 5/5
 ✔ Network fastify-url-shortener_url-shortener  Created          0.2s
 ✔ Volume "fastify-url-shortener_pg-data"       Created          0.0s
 ✔ Container url-shortener-db                   Created          0.1s
 ✔ Container url-shortener-app                  Created          0.1s
 ✔ Container url-shortener-caddy-server         Created          0.1s
Attaching to url-shortener-app, url-shortener-caddy-server, url-shortener-db
. . .

url-shortener-db            | 2024-07-30 12:43:54.957 UTC [1] LOG:  starting PostgreSQL 16.3 on x86_64-pc-linux-musl, compiled by gcc (Alpine 13.2.1_git20240309) 13.2.1 20240309, 64-bit
. . .
url-shortener-caddy-server  | {"level":"info","ts":1722343436.5617106,"logger":"tls","msg":"finished cleaning storage units"}
. . .
url-shortener-app           | {"level":"info","time":"2024-07-30T12:45:21.950Z","pid":17,"host":"d51e7abc421b","reqId":"
```

You can also run the services in the background through the `--detach` option.
Stop the existing instances with `Ctrl-C` first, then run:

```command
docker compose up --build --detach
```

```text
[output]
[+] Running 3/3
 ✔ Container url-shortener-db            Healthy        10.8s
 ✔ Container url-shortener-app           Started        11.2s
 ✔ Container url-shortener-caddy-server  Started        11.5
```

Verify they're running with `docker compose ps`:

```command
docker compose ps
```

```text
[output]
NAME                         IMAGE                       COMMAND                  SERVICE    CREATED         STATUS                   PORTS
url-shortener-app            fastify-url-shortener-app   "docker-entrypoint.s…"   app        3 minutes ago   Up 2 minutes
url-shortener-caddy-server   caddy:alpine                "caddy run --config …"   caddy      3 minutes ago   Up 2 minutes             443/tcp, 0.0.0.0:80->80/tcp, :::80->80/tcp, 2019/tcp, 443/udp
url-shortener-db             postgres:alpine             "docker-entrypoint.s…"   postgres   3 minutes ago   Up 3 minutes (healthy)   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp
```

To stop and remove the running containers, execute:

```command
docker compose down
```

```text
[output]
[+] Running 4/4
 ✔ Container webserver                          Removed              0.3s
 ✔ Container url-shortener                      Removed              0.2s
 ✔ Container url-shortener-db                        Removed              0.3s
 ✔ Network fastify-url-shortener_url-shortener  Removed              0.3s
```

There you have it! You can now launch all your services and their dependencies
with a single command and stop them again as needed. Creating additional
services is also as easy as adding a new service definition in the
`docker-compose.yml` file.

Let's move on now to exploring how to develop your application directly within
Docker.

[summary]

## Side note: Visualize your container logs in Better Stack

With **[Better Stack Logs](https://betterstack.com/logs)**, you can stream logs in real time, search across containers, and spot patterns like failing health checks or error spikes after a deploy.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Step 6 — Developing your Node.js application in Docker

Now that you've mastered image creation and multi-container management with
Docker Compose, let's transform Docker into a productive development
environment. This will simplify setup on your local machine and ensure a
standardized workflow for the rest of your team.

Begin by modifying your `Dockerfile` to make use of
[multi-stage builds](https://docs.docker.com/build/building/multi-stage/):

```text
[label Dockerfile]
# Use Node 20.16 alpine as base image
FROM node:20.16-alpine3.19 AS base

[highlight]
# Development stage
# =============================================================================
# Create a development stage based on the "base" image
FROM base AS development

# Change the working directory to /node
WORKDIR /node

# Copy the package.json and package-lock.json files to /node
COPY package*.json ./

# Install all dependencies and clean the cache
RUN npm ci && npm cache clean --force

# Change the working directory to /node/app
# This is where the project directory will be mounted to
WORKDIR /node/app

# Run the `dev` script for auto-reloading
CMD ["npm", "run", "dev"]

# Production stage
# =============================================================================
# Create a production stage based on the "base" image
FROM base AS production
[/highlight]

# Change the working directory to /build
WORKDIR /build

# Copy the package.json and package-lock.json files to the /build directory
COPY package*.json ./

# Install production dependencies and clean the cache
RUN npm ci --omit=dev  && npm cache clean --force

# Copy the entire source code into the container
COPY . .

# Document the port that may need to be published
EXPOSE 5000

# Start the application
CMD ["node", "src/server.js"]
```

We've introduced a `development` stage inheriting from the `base` image,
designed to execute `npm run dev` from the `/app` directory. The `production`
stage, intended for production builds, retains the original instructions.

The application dependencies are now being installed in the `/node` directory
without omitting the `devDependencies` this time around. This is essential since
you can't guarantee that everyone will be using host OS for development.

You'll also notice that we didn't copy the project's contents into `/node/app`
for the `development` stage; instead, we'll mount the local directory for live
development and enable automatic reloads via `nodemon`.

Next, update the `app` portion of your `docker-compose.yml` file:

```yaml
[label docker-compose.yml]
services:
  app:
    container_name: url-shortener-app
    build:
      context: .
      [highlight]
      target: ${NODE_ENV}
      [/highlight]
    env_file:
      - ./.env
    environment:
      NODE_ENV: ${NODE_ENV}
      LOG_LEVEL: ${LOG_LEVEL}
      PORT: ${PORT}
      POSTGRES_HOST: ${POSTGRES_HOST}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: ${POSTGRES_USER}
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - url-shortener
    [highlight]
    volumes:
      - .:/node/app
      - /node/app/node_modules
    [/highlight]

. . .
```

The `services.app.build.target` value is now set to `${NODE_ENV}` so that when
you're building the application appropriate stage is used instead according what
the value supplied through the `.env` file.

On the other hand, the current directory is mounted to the `/node/app` directory
within the container. This also mounts the local `node_modules` directory into
the container negating the effect of installing the dependencies to `/node` in
the first place.

To mitigate this, we've added an anonymous volume to hide the container's local
`node_modules` directory. Node.js's module resolution algorithm ensures that the
`node_modules` directory in the `/node` directory is found and used as a result.

To launch the application in development mode, all you need to do is change your
`NODE_ENV` entry to `development`:

```text
[label .env]
NODE_ENV=development
. . .
```

Then run:

```command
docker compose up --build
```

After building the Docker image, everything should start up the same way as
before:

```text
[output]
[+] Running 3/3
 ✔ Container url-shortener-db            Created                                                                                                                                         0.0s
 ✔ Container url-shortener-app           Recreated                                                                                                                                       0.2s
 ✔ Container url-shortener-caddy-server  Recreated                                                                                                                                       0.1s
Attaching to url-shortener-app, url-shortener-caddy-server, url-shortener-db
. . .
url-shortener-db            | 2024-07-30 14:43:31.061 UTC [1] LOG:  database system is ready to accept connections
url-shortener-app           |
[highlight]
url-shortener-app           | > url-shortener@1.0.0 dev
url-shortener-app           | > npx nodemon src/server.js
[/highlight]
url-shortener-app           |
. . .
url-shortener-caddy-server  | {"level":"info","ts":1722350622.1455085,"msg":"serving initial configuration"}
url-shortener-caddy-server  | {"level":"info","ts":1722350622.152146,"logger":"tls","msg":"storage cleaning happened too recently; skipping for now","storage":"FileStorage:/data/caddy","instance":"4dc8b8de-9c03-44e8-8c5c-3a61aa14c47c","try_again":1722437022.1521447,"try_again_in":86399.999999631}
url-shortener-caddy-server  | {"level":"info","ts":1722350622.1522992,"logger":"tls","msg":"finished cleaning storage units"}
[highlight]
url-shortener-app           | [nodemon] 3.1.4
url-shortener-app           | [nodemon] to restart at any time, enter `rs`
url-shortener-app           | [nodemon] watching path(s): *.*
url-shortener-app           | [nodemon] watching extensions: js,mjs,cjs,json
url-shortener-app           | [nodemon] starting `node src/server.js`
[/highlight]
. . .
url-shortener-app           | {"level":"info","time":"2024-07-30T14:43:42.459Z","pid":18,"host":"5d53b2894b01","msg":"URL Shortener is running in development mode → PORT http://0.0.0.0:5000"}
```

You'll notice that this time around, the `dev` script was executed and `nodemon`
is now watching for changes. Since we mounted the project directory to the
docker container, making changes as usual will trigger a restart of the
application.

You can test this out by adding a simple health check route to your application
code:

```javascript
[label src/routes/routes.js]
import urlSchema from '../schemas/url.schema.js';
import urlController from '../controllers/url.controller.js';
import rootController from '../controllers/root.controller.js';
import errorHandler from '../middleware/error.js';

export default async function fastifyRoutes(fastify) {
  fastify.get('/', rootController.render);

  fastify.post(
    '/shorten',
    {
      schema: {
        body: urlSchema,
      },
    },
    urlController.shorten
  );

[highlight]
  fastify.get('/health', (req, reply) => {
    reply.send({ status: 'ok' });
  });
[/highlight]

  fastify.get('/:shortID', urlController.redirect);

  fastify.setErrorHandler(errorHandler);
}
```

Once you save the file, you'll notice that the application restarts in the
`url-shortener-app` container:

```text
[output]
. . .
url-shortener-app           | [nodemon] restarting due to changes...
url-shortener-app           | [nodemon] starting `node src/server.js`
url-shortener-app           | {"level":"debug","time":"2024-07-30T14:58:22.430Z","pid":67,"host":"d07124bccc28","msg":"Executing (default): SELECT 1+1 AS result"}
url-shortener-app           | {"level":"debug","time":"2024-07-30T14:58:22.432Z","pid":67,"host":"d07124bccc28","msg":"Executing (default): SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'urls'"}
url-shortener-app           | {"level":"debug","time":"2024-07-30T14:58:22.437Z","pid":67,"host":"d07124bccc28","msg":"Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'urls' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;"}
url-shortener-app           | {"level":"info","time":"2024-07-30T14:58:22.442Z","pid":67,"host":"d07124bccc28","msg":"Connected to database"}
url-shortener-app           | {"level":"info","time":"2024-07-30T14:58:22.464Z","pid":67,"host":"d07124bccc28","msg":"Server listening at http://0.0.0.0:5000"}
url-shortener-app           | {"level":"info","time":"2024-07-30T14:58:22.464Z","pid":67,"host":"d07124bccc28","msg":"URL Shortener is running in development mode → PORT http://0.0.0.0:5000"}
```

You can now send a request to `http://localhost/health` and you should get the
correct response:

```command
curl http://localhost/health
```

```text
[output]
{"status":"ok"}
```

The only time you'll need to rebuild the image in development is when you add or
remove a dependency to your project.

With this setup, you only need access to the source code and Docker installed on
the host machine to create a complete Node.js development environment with a
single command.

If you're a VS Code user, you might want to check out the
[Dev Containers extension](https://code.visualstudio.com/docs/devcontainers/containers)
to enhance your local development workflow even further. The relevant tooling
for other editors may be found [here](https://containers.dev/supporting).

[summary]

## Side note: Trace Docker requests with eBPF (no code changes)

With **[Better Stack](https://betterstack.com/telemetry)**, you can use **eBPF instrumentation** to capture request traces automatically, even in containers, without adding tracing libraries or changing your app code.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/wQKjCDD7nfk" title="Better Stack tracing demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Final thoughts

Throughout this guide, you've gained hands-on experience in preparing a Docker
image for your Node.js application and using it for local development or
production deployment.

But this is just the beginning of your Docker journey! There are countless
opportunities for optimizing your development and deployment workflows even
further.

Ensure to check out the following resources on
[Dockerfile best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/),
[security recommendations](https://betterstack.com/community/guides/scaling-docker/docker-security-best-practices/), [logging in
Docker](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/) and [deploying containerized apps to
AWS](https://betterstack.com/community/guides/web-servers/deploy-docker-aws/) to take your usage to the next level.

If you'd like to continue experimenting with the demo app, do check out the
updated source code on
[GitHub](https://github.com/betterstack-community/fastify-url-shortener/tree/final).

Thanks for reading, and happy coding!
