# A Beginner's Guide to the Docker Run Command

At the heart of Docker's functionality lies the `docker run` command, which is
essential for launching containers.

Whether you're new to Docker or looking to enhance your container deployment
skills, understanding the nuances of this command is crucial for effective
containerization.

In this article, we'll explore the `docker run` command in detail, breaking down
its options, parameters, and practical applications. By mastering this command,
you'll be able to deploy and manage containers efficiently.

[ad-logs]

## Basic Docker run syntax

At its most basic level, the `docker run` command follows this structure:

```command
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

Let's break down these components:

- `docker run`: The base command telling Docker to create and start a container.
- `[OPTIONS]`: Optional flags that modify how the container runs.
- `IMAGE`: The container image to use.
- `[COMMAND]`: Optional command to execute inside the container.
- `[ARG...]`: Optional arguments for the command.

The simplest form of the command might look like:

```command
docker run nginx
```

This command pulls the [latest Nginx image](https://hub.docker.com/_/nginx) from
Docker Hub (if not already present locally) and starts a container with default
settings. When you run it for the first time, you'll see output similar to:

```text
[output]
Unable to find image 'nginx:latest' locally
latest: Pulling from library/nginx
a2abf6c4d29d: Pull complete
a9edb18cadd1: Pull complete
589b7251471a: Pull complete
186b1aaa4aa6: Pull complete
Digest: sha256:4d34523d254c63950f323be24968c3e19a9e9f6e324c34bbf236dfc7494bde96
Status: Downloaded newer image for nginx:latest
```

Let's try another basic example using the official
[hello-world](https://hub.docker.com/_/hello-world) Docker image:

```command
docker run hello-world
```

This command will display a welcome message that confirms your Docker
installation is working correctly:

```text
[output]
. . .
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.
. . .
```

<iframe width="100%" height="315" src="https://www.youtube.com/embed/giXlSlFLKwA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Container states and modes

When running containers, it's important to understand the different states and
modes they can operate in, as this affects how you interact with them.

### Attached mode (default behavior)

By default, Docker runs containers in attached mode, meaning the container is
connected to your terminal. In this mode, you can see the container's output in
real-time, and in some cases, provide input directly to the container.

```command
docker run alpine echo "Running in attached mode"
```

The output will appear directly in your terminal:

```text
[output]
Running in attached mode
```

After executing the command, the container exits because it has completed its
task.

### Detached mode (`-d` flag)

Detached mode runs the container in the background, freeing up your terminal for
other commands. This is particularly useful for long-running services like web
servers or databases.

```command
docker run -d nginx
```

Instead of seeing the container's output, you'll receive a container ID:

```text
[output]
7d7e92a7c58deb8b9d9e6836e6155d2126adcb754e4e99ed578c9bb56b31d3cb
```

You can verify the container is running with:

```command
docker ps
```

```text
[output]
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS        PORTS     NAMES
556d36710c4c   nginx     "/docker-entrypoint.…"   2 seconds ago   Up 1 second   80/tcp    sleepy_moore
```

### Interactive mode (`-it` flags)

Interactive mode allows you to interact with the container as if you were
working directly in it. This is achieved by combining two flags:

- `-i` or `--interactive`: Keeps STDIN open.
- `-t` or `--tty`: Allocates a pseudo-TTY.

This combination is particularly useful for running shells or debugging:

```command
docker run -it ubuntu bash
```

You'll be placed directly into a bash shell within the Ubuntu container:

```text
[output]
root@f8d05968b4a2:/#
```

From here, you can run commands as if you were working on an Ubuntu system. To
exit, simply type `exit` or press `Ctrl+D`.

## Essential Docker run options

### Naming containers with `--name`

By default, Docker assigns random names to containers (like "eloquent_einstein"
or "bold_feynman"). Using the `--name` flag, you can assign meaningful names to
your containers, making them easier to identify and reference.

```command
docker run --name web_server nginx
```

Now, instead of using the container ID or auto-generated name, you can reference
it as `web_server` in other Docker commands:

```command
docker stop web_server
docker start web_server
```

### Port mapping with `--publish`

Containers have their own network space isolated from the host system. To access
services running inside a container, you need to map ports between the host and
container. This is done using the `-p` or `--publish` flag.

The format is `-p host_port:container_port`:

```command
docker run -d --name web_server -p 80:80 nginx
```

This maps port 80 on your host machine to port 80 in the container, allowing you
to access the Nginx web server by visiting `http://localhost` in your browser.

![Screenshot From 2025-03-28 16-07-54.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/90755115-c711-406a-b74f-781b4702fc00/orig =2828x1344)

You can also map to non-standard ports:

```command
docker run -d --name web_server -p 8080:80 nginx
```

Now, the web server is available at `http://localhost:8080`.

Multiple port mappings can be specified for a single container:

```command
docker run -d --name web_server -p 8080:80 -p 8443:443 nginx
```

This maps both HTTP (port 80) and HTTPS (port 443) from the container to custom
ports on your host.

### Mounting volumes with `--volume`

Containers are ephemeral so when a container is removed, any data created inside
it is lost. [Volumes provide persistent storage](https://betterstack.com/community/guides/scaling-docker/docker-volumes/) by mounting
directories from the host system or named Docker volumes into the container.

Use the `-v` or `--volume` flag with the format `source:destination`:

```command
docker run -d --name web_server -p 80:80 -v /my/local/path:/usr/share/nginx/html nginx
```

This mounts the local directory `/my/local/path` to `/usr/share/nginx/html` in
the container. Any files placed in this directory on your host will be available
to the Nginx web server.

Using named volumes:

```command
docker volume create web_data
```

```command
docker run -d --name web_server -p 80:80 -v web_data:/usr/share/nginx/html nginx
```

Named volumes are managed by Docker and don't require you to specify a host
path.

### Specifying environment variables

Many container images can be configured using environment variables. The `-e` or
`--env` flag allows you to set these variables at runtime.

```command
docker run -d --name db -e MYSQL_ROOT_PASSWORD=secretpassword -e MYSQL_DATABASE=myapp mysql:5.7
```

This starts a MySQL container with a root password and creates a database named
`myapp`.

If you have multiple environment variables, you can add them one by one or use
an environment file:

```command
docker run -d --name web_app --env-file ./env my-web-app
```

Note that [Docker secrets](https://betterstack.com/community/guides/scaling-docker/docker-secrets/) is a better way to pass application
secrets.

### Entrypoint customization (`--entrypoint`)

Every Docker image has a default entrypoint. This the command that executes when
the container starts. You can override this with the `--entrypoint` flag:

```command
docker run --entrypoint /bin/bash nginx -c "echo Hello, custom entrypoint!"
```

This replaces Nginx's default entrypoint with `/bin/bash` and passes
`-c "echo Hello, custom entrypoint!"` as arguments.

Understanding the difference between `entrypoint` and `command` is crucial:

- The entrypoint is the executable that runs when the container starts.
- The command provides arguments to the entrypoint.

For example, in a typical image configuration:

- Entrypoint: `/usr/sbin/nginx`
- Command: `-g "daemon off;"`

Together, they form the complete execution: `/usr/sbin/nginx -g "daemon off;"`.

## Container restart policies

Containers may stop due to errors or system reboots. Docker provides several
restart policies to control what happens in these scenarios:

### Default behavior (`--restart no`)

By default, containers won't automatically restart:

```command
docker run nginx
```

If this container exits or crashes, you'll need to restart it manually.

### Restart on failure (`--restart on-failure`)

To restart a container only when it exits with a non-zero status (indicating an
error):

```command
docker run --restart on-failure nginx
```

You can also specify a maximum number of restart attempts:

```command
docker run --restart on-failure:5 nginx
```

This will try to restart the container up to 5 times if it exits with an error.

### Always restart (`--restart always`)

To ensure a container always restarts, regardless of exit status:

```command
docker run --restart always nginx
```

This policy is useful for critical services that should always be running.

### Restart unless manually stopped (`--restart unless-stopped`)

Similar to `always`, but won't restart if you manually stop the container:

```command
docker run --restart unless-stopped nginx
```

This is often the most practical choice for production services, as it maintains
uptime while respecting manual interventions.

## Command organization and readability

As you add more options to your `docker run` command, it can become long and
difficult to read. Using backslashes helps organize multi-line commands:

```command
docker run -d \
 --name web_server \
 -p 80:80 \
 -p 443:443 \
 -v web_content:/usr/share/nginx/html \
 -e NGINX_HOST=example.com \
 --restart unless-stopped \
 nginx
```

This improves readability and makes it easier to update or troubleshoot complex
commands.

## Advanced Docker run features

### Resource constraints

Docker allows you to limit how much CPU and memory a container can use:

```command
docker run -d --name resource_limited \
 --memory="512m" \
 --cpus="0.5" \
 nginx
```

This limits the container to 512MB of memory and half of a CPU core.

### Health checks

You can add health checks to monitor a container's status:

```command
docker run -d --name monitored_container \
 --health-cmd="curl -f http://localhost/ || exit 1" \
 --health-interval=30s \
 --health-timeout=10s \
 --health-retries=3 \
 nginx
```

This configures Docker to check the container's health every 30 seconds by
executing a curl command inside the container.

### Network configuration

Containers can be connected to various network types:

```command
docker network create app_network
docker run -d --name web --network app_network nginx
```

You can also use host networking, which shares the host's network namespace:

```command
docker run -d --network host nginx
```

This bypasses Docker's network isolation, allowing the container to use the
host's network directly.

### Security options

Docker provides several security-related flags:

```command
docker run -d --name secure_container \
 --security-opt="no-new-privileges:true" \
 --cap-drop=ALL \
 --cap-add=NET_BIND_SERVICE \
 nginx
```

This prevents privilege escalation, drops all capabilities, and only adds back
the specific capability needed to bind to privileged ports.

### Container labels

Labels help organize and manage containers:

```command
docker run -d --name labeled_container \
 --label environment=production \
 --label application=frontend \
 nginx
```

These metadata labels don't affect container operation but are useful for
filtering and automation.

## Best practices

- Keep images small by using minimal base images like Alpine:

```command
docker run -d alpine-nginx
```

- Use multi-stage builds to reduce final image size.

- Explicitly specify image tags rather than using `latest`:

```command
docker run -d nginx:1.20-alpine
```

- Always run containers as non-root users when possible:

```command
docker run -d --user 1000:1000 nginx
```

- Use read-only file systems where appropriate:

```command
docker run -d --read-only nginx
```

### Cleaning up resources

Unused containers and images consume disk space. Use these commands for cleanup:

```command
docker container prune     # Remove all stopped containers
docker image prune         # Remove unused images
docker volume prune        # Remove unused volumes
docker system prune -a     # Remove everything unused
```

![Screenshot From 2025-03-28 16-17-08.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d93618e8-d01c-45c2-2651-9223c5b54c00/md2x =2652x1602)

The `--rm` flag automatically removes a container when it exits which is handy
for quick testing:

```command
docker run --rm alpine echo "This container will be removed after execution"
```

## Final thoughts

The `docker run` command is the cornerstone of Docker container deployment,
offering a wealth of options to customize container behavior.

From basic execution to complex configurations with networking, storage, and
resource constraints, mastering this command empowers you to deploy containers
efficiently.

As you progress in your Docker journey, you'll develop command patterns that
suit your specific use cases, making containerization a seamless part of your
development and deployment workflows.

Remember that while `docker run` is powerful for individual containers, [Docker
Compose](https://betterstack.com/community/guides/scaling-docker/docker-compose-getting-started/) provides a higher-level approach for
multi-container applications, building upon the concepts explored in this
article.
