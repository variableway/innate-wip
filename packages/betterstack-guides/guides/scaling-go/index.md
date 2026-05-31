# Dockerizing Go Applications: A Step-by-Step Guide

[Docker](https://www.docker.com/) empowers developers to encapsulate their
applications and dependencies into self-contained images, ensuring seamless
deployment across diverse environments, and thus freeing you from infrastructure
concerns.

The process involves writing a `Dockerfile`, building a Docker image, and then
running it as a container. This guide specifically focuses on preparing Docker
images for Go applications in development and production contexts.

By the end, you'll possess the knowledge to run Go applications confidently
within containers either locally or on your chosen deployment platform.

Let's get started!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/UkruXt_ZOkE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Prerequisites

- Prior Go development experience.
- Familiarity with the Linux command-line.
- Access to a Linux machine with
  [Docker Engine](https://docs.docker.com/engine/install/) installed.

## Step 1 — Setting up the demo project

To demonstrate Go application development and deployment with Docker, I'll
assume you already have a Go application ready. If not, you can clone the
[Blogging application](https://github.com/betterstack-community/go-blog)
prepared for this demonstration to your computer. It's a simple
[CRUD application](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)
that persists created posts to a PostgreSQL database.

![Blog post demo](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f03f594f-efc1-4dd7-64dd-3cdc02af5600/md2x
=2182x1068)

Our goal is to containerize this Go application using Docker, making it easily
deployable in various environments.

Execute the command below to clone the application from GitHub:

```command
git clone https://github.com/betterstack-community/go-blog
```

Then navigate into the project directory and install its dependencies:

```command
cd go-blog
```

```command
go mod download
```

Once the dependencies are installed, build the application with:

```command
go build -o bin/go-blog
```

You will see a new `go-blog` binary within your current working directory's
`bin` folder. Before you execute the binary, let's set up a PostgreSQL database
through the
[official PostgreSQL Docker image](https://hub.docker.com/_/postgres). Without
an active PostgreSQL instance, the blogging application will fail to work.

Open a separate terminal and run the command below to launch a PostgreSQL
container based on the Bookworm variant of the image:

```command
docker run \
  --rm \
  --name go-blog-db \
  --env POSTGRES_PASSWORD=admin \
  --env POSTGRES_DB=go-blog \
  --volume pg-data:/var/lib/postgresql/data \
  --publish 5432:5432 \
  postgres:bookworm
```

This command sets up a PostgreSQL container named `go-blog-db`, removes it upon
stopping (`--rm`), and maps port 5432 to your host machine. It also sets the
default database name to `go-blog` and the password for the default `postgres`
user to `admin`.

You should see the following log entry confirming that the database is ready to
accept connections:

```text
[output]
. . .
2024-08-12 12:11:51.257 UTC [1] LOG:  database system is ready to accept connections
```

With the database now running, return to your project directory in a different
terminal and rename the `.env.sample` file to `.env`:

```command
mv .env.sample .env
```

Open the `.env` file in your text editor and populate it with the contents
below. The `POSTGRES_DB` and `POSTGRES_PASSWORD` variables should correspond to
the values used when starting the PostgreSQL container.

```text
[label .env]
GO_ENV=development
PORT=8000
LOG_LEVEL=info
POSTGRES_DB=go-blog
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin
POSTGRES_HOST=localhost
```

Once you're done, return to the terminal to run the database migrations. Our
demo project has just one migration file, which creates the `posts` table if it
doesn't already exist:

```sql
[label repository/migrations/000001_create_posts_table.up.sql]
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

To apply the migration, you must
[install golang-migrate](https://github.com/golang-migrate/migrate/tree/master/cmd/migrate#installation)
first, then execute:

```command
migrate -path repository/migrations/ -database "postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@<POSTGRES_HOST>/<POSTGRES_DB>?sslmode=disable" up
```

Ensure to replace the placeholders above with the appropriate values. In my
case, it will be:

```command
migrate -path repository/migrations/ -database "postgresql://postgres:admin@localhost:5432/go-blog?sslmode=disable" up
```

You will see the following message if the migration succeeds:

```text
[output]
1/u create_posts_table (54.393139ms)
```

Finally, launch the application with:

```command
./bin/go-blog
```

The following message confirms that the application is listening for connections
on port 8000:

```text
[output]
Server started on port 8000
```

To confirm that everything works, visit `http://localhost:8000` in your browser:

![Application empty state](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/18fa3842-8a77-4999-3d4d-83cf4a0ebe00/md2x
=2200x1186)

Create a new post to test out its functionality:

![Creating a new blog post](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ead72e6a-eeea-4f20-e62c-0b03417b7100/md1x
=2200x1284)

You should see the new post on the application home page:

![Application homepage showing blogpost](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b624321b-b686-4fce-5468-054f7c11a500/orig
=2200x1284)

Now that you've confirmed the functionality of your Go application, let's
proceed to the next step where you'll create a `Dockerfile` for the project.

## Step 2 — Writing a Dockerfile for your Go app

![Dockerfile for a Go Application](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8051f676-b203-47d8-ef3f-0ef303167200/md2x =1260x664)

Before you can build a Docker image for your Go application, you need to create
a [Dockerfile](https://docs.docker.com/engine/reference/builder/). This text
file guides the Docker engine through the process of assembling the image that
will encapsulate your application and its runtime environment.

The format of the `Dockerfile` is shown below:

```text
[label Dockerfile]
# Comment
COMMAND arguments
```

Any line starting with `#` denotes a comment (except
[parser directives](https://docs.docker.com/engine/reference/builder/#parser-directives)).
Other lines must include a specific command, followed by its corresponding
arguments. Although command names are not case-sensitive, they are commonly
capitalized to differentiate them from arguments.

Here's the `Dockerfile` for our blog application in full:

```Dockerfile
[label Dockerfile]
# Use Go 1.23 bookworm as base image
FROM golang:1.23-bookworm AS base

# Move to working directory /build
WORKDIR /build

# Copy the go.mod and go.sum files to the /build directory
COPY go.mod go.sum ./

# Install dependencies
RUN go mod download

# Copy the entire source code into the container
COPY . .

# Build the application
RUN go build -o go-blog

# Document the port that may need to be published
EXPOSE 8000

# Start the application
CMD ["/build/go-blog"]
```

This `Dockerfile` packages a Go application and its dependencies into a Docker
image. Here's a line-by-line explanation of its contents:

```Dockerfile
FROM golang:1.23-bookworm AS base
```

This line sets the foundation for your Docker image. It specifies that the image
will be built upon the [official Go image](https://hub.docker.com/_/golang)
using Debian's Bookworm release as its base.

While you will commonly see Alpine Linux being used as the base for Docker
images due to its small size, it's worth considering that its use can come with
potential drawbacks.

Notably, Alpine's reliance on [musl libc](https://en.wikipedia.org/wiki/Musl)
instead of the prevalent [glibc](https://en.wikipedia.org/wiki/Glibc) can create
compatibility hurdles for some software, potentially triggering unexpected
errors or crashes. This is especially likely to occur if your Go application
necessitates `CGO_ENABLED=1`.

Moreover, Alpine has a history of encountering DNS resolution issues with
certain hostnames, which can impede network connectivity and disrupt the smooth
operation of applications.

Therefore, it's generally recommended to select a more mainstream base image
such as Debian or Ubuntu. These distributions provide superior compatibility and
stability, potentially sparing you from time-consuming troubleshooting efforts
in the future.

We'll address the optimization of the final image size through the
implementation of multi-stage builds in a subsequent section of this tutorial.

```Dockerfile
WORKDIR /build
```

The `WORKDIR` instruction sets the working directory inside the container to
`/build`. All subsequent commands will be executed within this directory unless
explicitly stated otherwise.

```Dockerfile
COPY go.mod go.sum ./
```

This copies the `go.mod` and `go.sum` files from your project directory into the
`/build` directory within the image.

```Dockerfile
RUN go mod download
```

This command downloads all the dependencies listed in the previously copied
`go.mod` and `go.sum` files, ensuring they are available for the subsequent
build step.

```Dockerfile
COPY . .
```

This copies all files and directories from your current local directory into the
`/build` directory within the image.

```Dockerfile
RUN go build -o go-blog
```

The next step is to compile your Go application by executing the `go build`
command. The resulting executable is named `go-blog`.

```Dockerfile
EXPOSE 8000
```

This line informs Docker that the containerized application will likely listen
on port `8000`. You'll still need to use the `-p` flag to publish the container
port and map it to a host port.

```Dockerfile
CMD ["/build/go-blog"]
```

Finally, the `CMD` instruction specifies the default command to be executed when
a container is started from this image. In this case, it executes the `go-blog`
executable.

With these instructions in place, you're ready to build the Docker image.

## Step 3 — Building the Docker image and launching a container

With your `Dockerfile` ready, it's time to build the Docker image. However,
let's create a `.dockerignore` file in your project's root directory first. This
file instructs Docker to exclude the specified files and directories from the
build context to prevent unnecessary or sensitive files from accidentally being
included.

In our case, let's ignore the `bin` and `.git` directories, and any sensitive
configuration files:

```text
[label .dockerignore]
# Go build output
bin/

# Git metadata
.git/

# Sensitive configuration
*.env
```

One you've saved the file, build the Docker image by executing:

```command
docker build . -t go-blog
```

The `-t` flag assigns the `go-blog` name to the image. You can also add a
version tag, such as `0.1.0`, using the command below:

```command
docker build . -t go-blog:0.1.0
```

Without a tag, Docker defaults to `latest`.

After the build completes, confirm that the new image is present in your local
image library:

```command
docker image ls go-blog
```

```text
[output]
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
go-blog      latest    9075f0b2ee42   6 minutes ago   1.06GB
```

This image is quite large at 1.06GB, but you will see how to reduce it
significantly in
[Step 6](#step-6-creating-a-docker-driven-go-development-workflow) of this
tutorial.

For now though, let's launch a Docker container based on the `go-blog` image.
Before proceeding, be sure to stop any currently running instance of the Go
application with `Ctrl-C`, but keep your PostgreSQL container running as before.

Execute the following command to launch the container for your application:

```command
docker run --rm --name go-blog-app --publish 8000:8000 --env-file .env go-blog
```

This command creates a `go-blog-app` container from your `go-blog` image. The
`--rm` flag ensures the container is automatically removed when stopped, while
the `--publish 8000:8000` part maps port 8000 inside the container to port 8000
on the host machine.

The `--env-file` flag provides a handy way to configure your Go application
within the container through an `.env` file without exposing application secrets
in the Docker image.

However, you will observe the following error:

```text
[output]
2024/08/13 09:51:30 Unable to connect to database:failed to connect to `user=postgres database=go-blog`:
        127.0.0.1:5432 (localhost): dial error: dial tcp 127.0.0.1:5432: connect: connection refused
        [::1]:5432 (localhost): dial error: dial tcp [::1]:5432: connect: connection refused
```

This happens because your Go application is trying to establish a connection
with a PostgreSQL database assumed to be running on `localhost` _within_ the
`go-blog-app` Docker container. Since there's no PostgreSQL instance active
inside that container, it predictably fails.

To facilitate communication between your Go application container and your
PostgreSQL container, you need to use the container name (`go-blog-db` in this
case) as the database host instead of `localhost`, then create a
[dedicated Docker network](https://docs.docker.com/reference/cli/docker/network/),
and ensure both containers are placed on the network through the `--network`
option.

Enter the following command below to create the network:

```command
docker network create go-blog-network
```

```text
[output]
8cc2f57070e04be1add3b66fa8ce785f1d620e47972b2c4210aab4d3c3fd1f40
```

With the `go-blog` network created, stop the existing PostgreSQL container
instance and restart it on the new network through the `--network` option:

```command
docker container stop go-blog-db
```

```command
docker run \
  --rm \
  --name go-blog-db \
  --env POSTGRES_PASSWORD=admin \
  --env POSTGRES_DB=go-blog \
  --volume pg-data:/var/lib/postgresql/data \
  --publish 5432:5432 \
[highlight]
  --network go-blog-network \
[/highlight]
  postgres:bookworm
```

Once its up and running once again, update your project's `.env` file as
follows:

```text
[label .env]
GO_ENV=development
PORT=8000
LOG_LEVEL=info
POSTGRES_DB=go-blog
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin
[highlight]
POSTGRES_HOST=go-blog-db
[/highlight]
```

The `POSTGRES_HOST` environment variable has been changed from `localhost` to
the name of your database container (`go-blog-db`). This change allows the
application container to find the PostgreSQL instance running in the separate
database container once you apply the `--network` option:

```command
docker run \
  --rm \
  --name go-blog-app \
  --publish 8000:8000 \
  --env-file .env \
[highlight]
  --network go-blog-network \
[/highlight]
  go-blog
```

It should launch successfully now:

```text
[output]
Server started on port 8000
```

You can now interact with the application at `http://localhost:8000` once again
and it should keep working the same way as before.

[ad-uptime]

## Step 4 — Configuring up a web server

Web servers such as [Nginx](https://nginx.org/) or [Caddy](https://betterstack.com/community/guides/web-servers/caddy/) are often
deployed in front of Go applications to handle tasks like load balancing,
reverse proxying, serving static assets, SSL, and caching. This allows the
application to focus on the main business logic, while the web server handles
the ancillary tasks in a more robust and scalable manner.

In this section, we'll configure Caddy as a reverse proxy for our Go
application. Ensure that both the Go application and the PostgreSQL containers
are running, then open a new terminal and launch a container based on the
[official Caddy Docker image](https://hub.docker.com/_/caddy) with:

```command
docker run --rm --name go-blog-caddy -p 80:80 caddy
```

```json
[output]
. . .
{"level":"info","ts":1723543833.3596091,"msg":"serving initial configuration"}
{"level":"info","ts":1723543833.3660367,"logger":"tls","msg":"cleaning storage unit","storage":"FileStorage:/data/caddy"}
{"level":"info","ts":1723543833.366192,"logger":"tls","msg":"finished cleaning storage u
```

Once the "serving initial configuration" message appears, visiting
`http://localhost` in your browser will display the default "Caddy works!" page:

![The default Caddy Works! page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/109b6ec1-6745-49b0-bb4c-ec24c959e300/public
=1842x1392)

Terminate the container with `Ctrl-C`, and then create a `Caddyfile` in your
project's root:

```text
[label Caddyfile]
http://localhost {
	reverse_proxy go-blog-app:8000
}
```

This configures Caddy to listen on `http://localhost` and forward all incoming
requests to the `go-blog-app` container, which is expected to be listening on
port 8000.

To witness the effect, relaunch the Caddy container with these additions for
persistent storage and network integration:

```command
docker run \
   --rm \
   --name go-blog-caddy \
[highlight]
   -p 80:80 \
   -v caddy-config:/config \
   -v caddy-data:/data \
   -v $(pwd)/Caddyfile:/etc/caddy/Caddyfile \
   --network go-blog-network \
[/highlight]
   caddy
```

This command now incorporates:

- Persistent volumes (`caddy-config` and `caddy-data`) to store Caddy's
  configuration and data, respectively.
- A custom `Caddyfile` configuration.
- The `go-blog-network` facilitating communication with your Go application
  container.

At this stage, accessing `http://localhost` should present your Go application,
served through Caddy.

![Go application server served through Caddy](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4c9d37c6-377c-4046-c03a-dda6b0a78200/lg2x
=2200x1284)

## Step 5 — Orchestrating multiple containers with Docker Compose

Managing multiple containers can be cumbersome, especially for applications
comprising several microservices running independently. This is where
[Docker Compose](https://docs.docker.com/compose/) steps in.

It offers a structured approach to managing multi-container applications by
defining component services, networks, and volumes in a single YAML
configuration file. Then you can launch or stop all the services defined in your
configuration file with a single command.

Let's create a `docker-compose.yml` file in your project's root to orchestrate
your Go application and its dependencies:

```command
code docker-compose.yml
```

```yaml
[label docker-compose.yml]
services:
  app:
    build:
      context: .
    container_name: go-blog-app
    environment:
      PORT: ${PORT}
      LOG_LEVEL: ${LOG_LEVEL}
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
      - go-blog-network

  caddy:
    image: caddy
    container_name: go-blog-caddy
    depends_on:
      - app
    ports:
      - 80:80
    volumes:
      - caddy-config:/config
      - caddy-data:/data
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
    networks:
      - go-blog-network

  postgres:
    image: postgres:bookworm
    restart: always
    container_name: go-blog-db
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
      - go-blog-network

volumes:
  pg-data:
  caddy-config:
  caddy-data:

networks:
  go-blog-network:
```

This configuration defines three services:

- `app`: Your Go application, dependent on a healthy `postgres` service.
- `caddy`: A Caddy web server acting as a reverse proxy, serving on port 80 and
  using a custom `Caddyfile`.
- `postgres`: A PostgreSQL database, configured with specific settings and a
  health check.

These are the three services we've been manually launching with `docker run` in
the previous sections. They share the `go-blog-network` and utilize volumes for
data persistence.

Placeholders are used for environment variables, which are populated from your
`.env` file when the containers start. Notably, your Go app's port is no longer
directly exposed, making the app accessible only via Caddy at
`http://localhost`.

Before starting the services with `docker compose`, stop and remove the existing
containers with:

```command
docker stop go-blog-db go-blog-app go-blog-caddy
```

Now, launch all three services using Compose:

```command
docker compose up --build
```

This builds the `app` image and starts all three services in the foreground,
displaying their logs:

```text
[output]
. . .
go-blog-db     | 2024-08-13 11:10:21.712 UTC [29] LOG:  database system was shut down at 2024-08-13 11:08:18 UTC
go-blog-db     | 2024-08-13 11:10:21.723 UTC [1] LOG:  database system is ready to accept connections
go-blog-app    | Server started on port 8000
go-blog-caddy  | {"level":"info","ts":1723547432.817205,"msg":"using config from file","file":"/etc/caddy/Caddyfile"}
go-blog-caddy  | {"level":"info","ts":1723547432.818028,"msg":"adapted config to JSON","adapter":"caddyfile"}
go-blog-caddy  | {"level":"info","ts":1723547432.8187122,"logger":"admin","msg":"admin endpoint started","address":"localhost:2019","enforce_origin":false,"origins":["//127.0.0.1:2019","//lo
calhost:2019","//[::1]:2019"]}
. . .
```

Now refresh the `http://localhost` web page:

![Relation posts does not exist](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7efe79de-b41d-4463-e8ac-869c78b9c200/public
=1780x954)

The `posts` database table appears to be missing because we didn't run the
database migrations like we did earlier in Step 1.

However, instead of manually invoking the `migrate` command once again, let's
add a `migrate` service to the `docker-compose.yml` file that automatically
launches a container to execute the migrations:

```yaml
[label docker-compose.yml]
. . .

[highlight]
  migrate:
    image: migrate/migrate
    container_name: go-blog-migrate
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - go-blog-network
    volumes:
      - ./repository/migrations/:/migrations
    command: ["-path", "/migrations/", "-database", "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@go-blog-db/${POSTGRES_DB}?sslmode=disable", "up"]
[/highlight]

volumes:
  pg-data:
  caddy-config:
  caddy-data:

networks:
  go-blog-network:
```

The `migrate` service utilizes the
[migrate/migrate Docker image](https://hub.docker.com/r/migrate/migrate) to
automate database migrations. It waits for the PostgreSQL database to be
healthy, then applies any pending "up" migrations from your local
`repository/migrations` directory to the database, ensuring that its structure
stays aligned with your application's code.

Instead of depending on the `postgres` service, update the `app` service to
start when the `migrate` service exits successfully:

```yaml
[label docker-compose.yml]
services:
  app:
    build:
      context: .
    container_name: go-blog-app
    environment:
      PORT: ${PORT}
      LOG_LEVEL: ${LOG_LEVEL}
      POSTGRES_HOST: ${POSTGRES_HOST}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: ${POSTGRES_USER}
    env_file:
      - ./.env
    [highlight]
    depends_on:
      migrate:
        condition: service_completed_successfully
    [/highlight]
    networks:
      - go-blog-network

. . .
```

Return to your terminal and stop the existing services with:

```command
docker compose down
```

```text
[output]
[+] Running 4/4
 ✔ Container go-blog-caddy          Removed                      0.3s
 ✔ Container go-blog-app            Removed                      0.2s
 ✔ Container go-blog-db             Removed                      0.3s
 ✔ Network go-blog_go-blog-network  Removed                      0.4
```

Relaunch the services once again by executing:

```command
docker compose up --build
```

You will observe that the migration ran successfully before the `app` service
was launched:

```text
[output]
. . .
go-blog-db       | 2024-08-13 12:59:11.465 UTC [1] LOG:  database system is ready to accept connections
[highlight]
go-blog-migrate  | 1/u create_posts_table (55.800791ms)
go-blog-migrate exited with code 0
[/highlight]
go-blog-app      | Server started on port 8000
go-blog-caddy    | {"level":"info","ts":1723553953.7705374
```

When you return to the application user interface, it will load successfully,
and you can create blog posts as before.

![Application home page showing blog post](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/dce11931-8cdf-444e-d9aa-c71a87b4d900/md2x
=2182x1068)

There you have it! You can now manage all your services and their dependencies
with a single command, streamlining your development and deployment workflow.

Let's now explore developing your application directly within Docker for an even
better development experience!

## Step 6 — Creating a Docker-driven Go development workflow

Now that you've containerized your application and orchestrated its services
with Docker Compose, let's turn Docker into a productive development environment
for Go applications by integrating live reloading, while reducing the image size
for production builds.

Begin by modifying your `Dockerfile` to utilize
[multi-stage builds](https://docs.docker.com/build/building/multi-stage/):

```Dockerfile
[label Dockerfile]
# Use Go 1.23 bookworm as base image
FROM golang:1.23-bookworm AS base

# Development stage
# =============================================================================
# Create a development stage based on the "base" image
FROM base AS development

# Change the working directory to /app
WORKDIR /app

# Install the air CLI for auto-reloading
RUN go install github.com/air-verse/air@latest

# Copy the go.mod and go.sum files to the /app directory
COPY go.mod go.sum ./

# Install dependencies
RUN go mod download

# Start air for live reloading
CMD ["air"]

# Builder stage
# =============================================================================
# Create a builder stage based on the "base" image
FROM base AS builder

# Move to working directory /build
WORKDIR /build

# Copy the go.mod and go.sum files to the /build directory
COPY go.mod go.sum ./

# Install dependencies
RUN go mod download

# Copy the entire source code into the container
COPY . .

# Build the application
# Turn off CGO to ensure static binaries
RUN CGO_ENABLED=0 go build -o go-blog

# Production stage
# =============================================================================
# Create a production stage to run the application binary
FROM scratch AS production

# Move to working directory /prod
WORKDIR /prod

# Copy binary from builder stage
COPY --from=builder /build/go-blog ./

# Document the port that may need to be published
EXPOSE 8000

# Start the application
CMD ["/prod/go-blog"]
```

In this improved `Dockerfile`, we've introduced a `development` stage which uses
the [air CLI](https://github.com/air-verse/air) for a seamless code-edit-refresh
cycle, a `builder` stage to compile your Go application to a static binary, and
a `production` stage that only copies the compiled executable to the minimal
[scratch image](https://hub.docker.com/_/scratch), resulting in a smaller and
more efficient production image.

In the `development` stage, you'll notice that we didn't copy the project's
contents into `/app` directory. Instead, we'll mount the local project directory
to the `/app` directory within the container to enable automatic reloads via
`air`. You only need to update your `app` service as follows:

```yaml
[label docker-compose.yml]
services:
  app:
    build:
      context: .
[highlight]
      target: ${GO_ENV}
[/highlight]
    container_name: go-blog-app
    environment:
      PORT: ${PORT}
      LOG_LEVEL: ${LOG_LEVEL}
      POSTGRES_HOST: ${POSTGRES_HOST}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: ${POSTGRES_USER}
    env_file:
      - ./.env
    depends_on:
      migrate:
        condition: service_completed_successfully
    networks:
      - go-blog-network
[highlight]
    volumes:
      - .:/app
[/highlight]

. . .
```

Here, we've mounted the local project directory to `/app` within the container.
This allows you to make code changes directly on your host machine, and they'll
be reflected instantly inside the container.

The `services.app.build.target` value is also set to `${GO_ENV}` so that when
you're building the image, the appropriate stage is used according to the value
supplied through the `.env` file.

Once you're done, return to your terminal and execute the command below to stop
and remove your existing service instances:

```command
docker compose down
```

Then run:

```command
docker compose up --build
```

Assuming the `GO_ENV` variable in your `.env` file is set to `development`, the
corresponding stage will be triggered and you will see that the `air` CLI is
installed and launched successfully:

```text
[output]
. . .
go-blog-app      |
go-blog-app      |   __    _   ___
go-blog-app      |  / /\  | | | |_)
go-blog-app      | /_/--\ |_| |_| \_ v1.52.3, built with Go go1.23
go-blog-app      |
go-blog-app      | mkdir /app/tmp
go-blog-app      | watching .
go-blog-app      | watching bin
go-blog-app      | watching models
go-blog-app      | watching repository
go-blog-app      | watching repository/migrations
go-blog-app      | watching templates
go-blog-app      | !exclude tmp
go-blog-app      | building...
go-blog-app      | running...
go-blog-app      | Server started on port 8000
. . .
```

To confirm that live reload works, add a simple health check route to your
`main.go` file like this:

```go
[label main.go]
. . .
func main()
	. . .

[highlight]
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
			w.Write([]byte("OK"))
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})
[/highlight]

	fmt.Println("Server started on port 8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
```

Once you save the file, you'll notice that the change is detected by `air` which
automatically triggers a new build and execution of the updated binary:

```text
[output]
. . .
go-blog-app      | main.go has changed
go-blog-app      | building...
go-blog-app      | running...
go-blog-app      | Server started on port 8000
. . .
```

```command
curl http://localhost/health
```

```text
[output]
OK
```

When its time to build a production image, you can specify the `production`
stage with the `--target` flag like this:

```command
docker build . -t go-blog-prod --target production
```

Once the image builds, inspect it with:

```command
docker image ls go-blog-prod
```

```text
[output]
REPOSITORY     TAG       IMAGE ID       CREATED         SIZE
go-blog-prod   latest    0e40c49ab29b   5 seconds ago   17.8MB
```

You'll notice that the image size is now just 17.8Mb as opposed to the 1.06GB
observed in step 3. This reduction in image size has several benefits, including
faster image pull, reduced storage requirements, and quicker deployment times.

If you're launching your services in production with `docker compose`, you only
need to change your `GO_ENV` value to `production` before running
`docker compose up --build` as before.

## Final thoughts

You've successfully journeyed through the steps associated with crafting a
Docker image for your Go application, and how to leverage it for both local
development and production environments.

But remember that this is only the first step in your Docker adventure. There
are many paths to further refine your development and deployment processes.

Feel free to dig deeper into topics like:

- [Streamlining your Dockerfile](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/).
- [Enhancing security](https://betterstack.com/community/guides/scaling-docker/docker-security-best-practices/) in your containerized
  applications.
- [Effective logging strategies](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/) for Docker.
- [Deploying your Dockerized applications](https://betterstack.com/community/guides/web-servers/deploy-docker-aws/) seamlessly on
  cloud platforms like AWS.

Want to tinker with the demo? You'll find the
[final version](https://github.com/betterstack-community/go-blog/tree/final) of
the code on GitHub.

Keep learning, keep building, and most of all, have fun coding!