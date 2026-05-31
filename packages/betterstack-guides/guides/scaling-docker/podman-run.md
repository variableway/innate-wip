# Podman Run: A Comprehensive Guide to Running Containers

At the heart of Podman's functionality lies the `podman run` command, which is
essential for launching containers.

Whether you're new to Podman or looking to enhance your container deployment
skills, understanding the nuances of this command is crucial for effective
containerization.

In this article, we'll explore the `podman run` command in detail, breaking down
its options, parameters, and practical applications.

By mastering this command, you'll be able to deploy and manage containers
efficiently with Podman's daemonless architecture.

[ad-logs]

## Basic Podman run syntax

At its most basic level, the `podman run` command follows this structure:

```command
podman run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

Let's break down these components:

- `podman run`: The base command telling Podman to create and start a container.
- `[OPTIONS]`: Optional flags that modify how the container runs.
- `IMAGE`: The container image to use.
- `[COMMAND]`: Optional command to execute inside the container.
- `[ARG...]`: Optional arguments for the command.

The simplest form of the command might look like:

```command
podman run caddy
```

This command pulls the latest Caddy image from a registry (if not already
present locally) and starts a container with default settings. When you run it
for the first time, you'll see output similar to:

```text
[output]
Unable to find image 'caddy:latest' locally
Trying to pull docker.io/library/caddy:latest...
Getting image source signatures
Copying blob sha256:2408cc74d12b done
Copying blob sha256:1c43bd95fd77 done
Copying blob sha256:943334fce8ae done
Copying config sha256:45958e825d5a done
Writing manifest to image destination
Storing signatures
```

Let's try another basic example using the official hello-world image:

```command
podman run hello-world
```

This command will display a welcome message that confirms your Podman
installation is working correctly:

```text
[output]
Hello from Podman!
This message shows that your installation appears to be working correctly.

To generate this message, Podman took the following steps:
 1. The Podman client contacted the local Podman engine.
 2. The Podman engine pulled the "hello-world" image from the Docker Hub.
 3. The Podman engine created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Podman engine streamed that output to the Podman client, which sent it
    to your terminal.
```

## Container states and modes

When running containers with Podman, it's important to understand the different
states and modes they can operate in, as this affects how you interact with
them.

### Attached mode (default behavior)

By default, Podman runs containers in attached mode, meaning the container is
connected to your terminal. In this mode, you can see the container's output in
real-time, and in some cases, provide input directly to the container.

```command
podman run alpine echo "Running in attached mode"
```

The output will appear directly in your terminal:

```text
Running in attached mode
```

After executing the command, the container exits because it has completed its
task.

### Detached mode (`-d` flag)

Detached mode runs the container in the background, freeing up your terminal for
other commands. This is particularly useful for long-running services like web
servers or databases.

```command
podman run -d caddy
```

Instead of seeing the container's output, you'll receive a container ID:

```text
7d7e92a7c58deb8b9d9e6836e6155d2126adcb754e4e99ed578c9bb56b31d3cb
```

You can verify the container is running with:

```command
podman ps
```

```text
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS        PORTS     NAMES
556d36710c4c   caddy     "/usr/bin/caddy run…"    2 seconds ago   Up 1 second   80/tcp    eager_newton
```

### Interactive mode (`-it` flags)

Interactive mode allows you to interact with the container as if you were
working directly in it. This is achieved by combining two flags:

- `-i` or `--interactive`: Keeps STDIN open.
- `-t` or `--tty`: Allocates a pseudo-TTY.

This combination is particularly useful for running shells or debugging:

```command
podman run -it ubuntu bash
```

You'll be placed directly into a bash shell within the Ubuntu container:

```text
root@f8d05968b4a2:/#
```

From here, you can run commands as if you were working on an Ubuntu system. To
exit, simply type `exit` or press `Ctrl+D`.

## Essential Podman run options

### Naming containers with `--name`

By default, Podman assigns random names to containers (like "eloquent_einstein"
or "bold_feynman"). Using the `--name` flag, you can assign meaningful names to
your containers, making them easier to identify and reference.

```command
podman run --name web_server caddy
```

Now, instead of using the container ID or auto-generated name, you can reference
it as `web_server` in other Podman commands:

```command
podman stop web_server
podman start web_server
```

### Port mapping with `--publish`

Containers have their own network space isolated from the host system. To access
services running inside a container, you need to map ports between the host and
container. This is done using the `-p` or `--publish` flag.

The format is `-p host_port:container_port`:

```command
podman run -d --name web_server -p 80:80 caddy
```

This maps port 80 on your host machine to port 80 in the container, allowing you
to access the Caddy web server by visiting `http://localhost` in your browser.

You can also map to non-standard ports:

```command
podman run -d --name web_server -p 8080:80 caddy
```

Now, the web server is available at `http://localhost:8080`.

Multiple port mappings can be specified for a single container:

```command
podman run -d --name web_server -p 8080:80 -p 8443:443 caddy
```

This maps both HTTP (port 80) and HTTPS (port 443) from the container to custom
ports on your host.

### Mounting volumes with `--volume`

Containers are ephemeral, so when a container is removed, any data created
inside it is lost. Volumes provide persistent storage by mounting directories
from the host system or named Podman volumes into the container.

Use the `-v` or `--volume` flag with the format `source:destination`:

```command
podman run -d --name web_server -p 80:80 -v /my/local/path:/usr/share/caddy caddy
```

This mounts the local directory `/my/local/path` to `/usr/share/caddy` in the
container. Any files placed in this directory on your host will be available to
the Caddy web server.

Using named volumes:

```command
podman volume create web_data
```

```command
podman run -d --name web_server -p 80:80 -v web_data:/usr/share/caddy caddy
```

Named volumes are managed by Podman and don't require you to specify a host
path.

### Specifying environment variables

Many container images can be configured using environment variables. The `-e` or
`--env` flag allows you to set these variables at runtime.

```command
podman run -d --name db -e MYSQL_ROOT_PASSWORD=secretpassword -e MYSQL_DATABASE=myapp mysql:5.7
```

This starts a MySQL container with a root password and creates a database named
`myapp`.

If you have multiple environment variables, you can add them one by one or use
an environment file:

```command
podman run -d --name web_app --env-file ./env my-web-app
```

### Entrypoint customization (`--entrypoint`)

Every container image has a default entrypoint, which is the command that
executes when the container starts. You can override this with the
`--entrypoint` flag:

```command
podman run --entrypoint /bin/bash caddy -c "echo Hello, custom entrypoint!"
```

This replaces Caddy's default entrypoint with `/bin/bash` and passes
`-c "echo Hello, custom entrypoint!"` as arguments.

Understanding the difference between `entrypoint` and `command` is crucial:

- The entrypoint is the executable that runs when the container starts.
- The command provides arguments to the entrypoint.

For example, in a typical image configuration:

- Entrypoint: `/usr/bin/caddy`
- Command: `run --config /etc/caddy/Caddyfile`

Together, they form the complete execution:
`/usr/bin/caddy run --config /etc/caddy/Caddyfile`.

## Container restart policies

Containers may stop due to errors or system reboots. Podman provides several
restart policies to control what happens in these scenarios:

### Default behavior (`--restart no`)

By default, containers won't automatically restart:

```command
podman run caddy
```

If this container exits or crashes, you'll need to restart it manually.

### Restart on failure (`--restart on-failure`)

To restart a container only when it exits with a non-zero status (indicating an
error):

```command
podman run --restart on-failure caddy
```

You can also specify a maximum number of restart attempts:

```command
podman run --restart on-failure:5 caddy
```

This will try to restart the container up to 5 times if it exits with an error.

### Always restart (`--restart always`)

To ensure a container always restarts, regardless of exit status:

```command
podman run --restart always caddy
```

This policy is useful for critical services that should always be running.

### Restart unless manually stopped (`--restart unless-stopped`)

Similar to `always`, but won't restart if you manually stop the container:

```command
podman run --restart unless-stopped caddy
```

This is often the most practical choice for production services, as it maintains
uptime while respecting manual interventions.

## Command organization and readability

As you add more options to your `podman run` command, it can become long and
difficult to read. Using backslashes helps organize multi-line commands:

```command
podman run -d \
 --name web_server \
 -p 80:80 \
 -p 443:443 \
 -v web_content:/usr/share/caddy \
 -e CADDY_HOST=example.com \
 --restart unless-stopped \
 caddy
```

This improves readability and makes it easier to update or troubleshoot complex
commands.

## Advanced Podman run features

### Resource constraints

Podman allows you to limit how much CPU and memory a container can use:

```command
podman run -d --name resource_limited \
 --memory="512m" \
 --cpus="0.5" \
 caddy
```

This limits the container to 512MB of memory and half of a CPU core.

### Health checks

You can add health checks to monitor a container's status:

```command
podman run -d --name monitored_container \
 --health-cmd="curl -f http://localhost/ || exit 1" \
 --health-interval=30s \
 --health-timeout=10s \
 --health-retries=3 \
 caddy
```

This configures Podman to check the container's health every 30 seconds by
executing a curl command inside the container.

### Network configuration

Containers can be connected to various network types:

```command
podman network create app_network
podman run -d --name web --network app_network caddy
```

You can also use host networking, which shares the host's network namespace:

```command
podman run -d --network host caddy
```

This bypasses Podman's network isolation, allowing the container to use the
host's network directly.

### Security options

Podman provides several security-related flags and has enhanced security
features compared to Docker:

```command
podman run -d --name secure_container \
 --security-opt="no-new-privileges:true" \
 --cap-drop=ALL \
 --cap-add=NET_BIND_SERVICE \
 caddy
```

This prevents privilege escalation, drops all capabilities, and only adds back
the specific capability needed to bind to privileged ports.

### Rootless containers

One of Podman's key advantages is its ability to run containers without root
privileges:

```command
podman run --user 1000:1000 -d caddy
```

Running rootless containers enhances security by reducing the attack surface and
preventing privilege escalation attacks.

### Container labels

Labels help organize and manage containers:

```command
podman run -d --name labeled_container \
 --label environment=production \
 --label application=frontend \
 caddy
```

These metadata labels don't affect container operation but are useful for
filtering and automation.

## Final thoughts

The `podman run` command is the cornerstone of Podman container deployment,
offering a wealth of options to customize container behavior.

From basic execution to complex configurations with networking, storage, and
resource constraints, mastering this command empowers you to deploy containers
efficiently while taking advantage of Podman's enhanced security features.

As you progress in your Podman journey, you'll develop command patterns that
suit your specific use cases, making containerization a seamless part of your
development and deployment workflows.

Remember that while `podman run` is powerful for individual containers, Podman
Compose provides a higher-level approach for multi-container applications,
building upon the concepts explored in this article.
