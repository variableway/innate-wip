# How to Use Docker Exec to Accessing Running Containers

[Docker](https://docker.com) provides powerful containerization technology that
enables developers to build, ship, and run applications in isolated environments
called containers. After launching containers, you may need to interact with
them to debug an issue.

The `docker exec` command serves as your gateway into running containers,
allowing you to execute commands inside them without interrupting their normal
operation. Think of it as opening a door into a container's isolated environment
without stopping or restarting it.

This tutorial explores the `docker exec` command, demonstrating how to run
one-off commands in containers and how to gain interactive shell access for more
complex operations. You'll learn practical techniques for container inspection,
debugging, and management that will become essential tools in your Docker
workflow.

Let's get started!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/oyD048gDg_k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Getting started with Docker Exec

Before diving into Docker Exec, there are a few prerequisites:

1. Docker must be installed on your system.
2. You need at least one running container.

If you're entirely new to Docker, you should first install Docker on your system
following the
[official Docker documentation](https://docs.docker.com/get-docker/), then start
a container. For beginners, a simple container to practice with is the official
`nginx` web server:

```command
docker run --name my-nginx -d nginx
```

This command starts an nginx container in detached mode (`-d`), naming it
`my-nginx`. The container will run in the background.

To see which containers are currently running on your system, use:

```command
docker ps
```

```text
[output]
CONTAINER ID   IMAGE   COMMAND                  CREATED         STATUS         PORTS     NAMES
7a3c1af5f11a   nginx   "/docker-entrypoint.…"   5 seconds ago   Up 4 seconds   80/tcp    my-nginx
```

The output shows all running containers, their IDs, the base image, running
time, exposed ports, and names. You'll need either the `CONTAINER ID` or `NAME`
to use `docker exec`. The basic syntax is as follows:

```command
docker exec [OPTIONS] CONTAINER COMMAND
```

Where:

- `[OPTIONS]` are various flags that modify the behavior of the command.
- `CONTAINER` is the identifier of the running container (name or ID).
- `COMMAND` is what you want to execute inside the container.

Here's the full list of options:

| Option                | Function                 | Description                                      |
| --------------------- | ------------------------ | ------------------------------------------------ |
| `-d`, `--detach`      | Background execution     | Runs command in background and returns to prompt |
| `--detach-keys`       | Custom exit sequence     | Defines keyboard shortcut to exit container      |
| `-e`, `--env`         | Environment variables    | Sets environment variables for the command       |
| `--env-file`          | Load variables from file | Imports multiple variables from specified file   |
| `-i`, `--interactive` | Input stream             | Keeps STDIN open for interactive commands        |
| `--privileged`        | Elevated permissions     | Grants extended privileges inside container      |
| `-t`, `--tty`         | Terminal allocation      | Allocates pseudo-TTY for shell interactions      |
| `-u`, `--user`        | User specification       | Runs command as specified username or UID        |
| `-w`, `--workdir`     | Working directory        | Sets starting directory for command execution    |



Now, let's try a simple `docker exec` command:

```command
docker exec my-nginx ls -la
```

This command lists all files in the root directory of the "my-nginx" container
using the `ls -la` command. You should see output similar to this:

```text
[output]
total 80
drwxr-xr-x   1 root root 4096 Mar  7 15:10 .
drwxr-xr-x   1 root root 4096 Mar  7 15:10 ..
-rwxr-xr-x   1 root root    0 Mar  7 15:10 .dockerenv
drwxr-xr-x   2 root root 4096 Feb 27 00:00 bin
drwxr-xr-x   2 root root 4096 Dec  9 22:52 boot
. . .
```

Congratulations! You've just executed your first command inside a running Docker
container. This simple example demonstrates the core functionality of Docker
Exec.

![Screenshot From 2025-03-28 10-03-07.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f14f1096-7b9e-4058-cad6-1dfaecbc1200/md2x =2652x1602)

## Running one-off commands in a Docker Container

The simplest way to use `docker exec` is to run individual commands inside a
container. For example, to check the `nginx` version in our running container:

```command
docker exec my-nginx nginx -v
```

```text
[output]
nginx version: nginx/1.27.0
```

To check the operating system details inside the container:

```command
docker exec my-nginx cat /etc/os-release
```

```text
[output]
PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"
NAME="Debian GNU/Linux"
VERSION_ID="12"
VERSION="12 (bookworm)"
VERSION_CODENAME=bookworm
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
```

These commands run and exit immediately, showing only the output. But what if
you need to run multiple commands or navigate through the container's
filesystem?

This is where running an interactive shell becomes necessary so let's look at
that next.

## Accessing a container's shell with interactive mode

For more complex operations, you'll want to access a shell inside the container.
This is where the interactive (`-i`) and tty allocation (`-t`) flags become
useful:

```command
docker exec -it my-nginx /bin/bash
```

This command starts an interactive bash shell inside the "my-nginx" container.
The `-i` flag keeps STDIN open, while `-t` allocates a pseudo-TTY, simulating a
terminal environment. Combined, they provide an interactive shell experience.

After running this command, your prompt will change to indicate you're now
inside the container:

```text
[output]
root@7a3c1af5f11a:/#
```

Now you can navigate and execute commands as if you were directly logged into
the container:

```command
ls /etc/nginx/
```

```text
[output]
conf.d  fastcgi_params  mime.types  modules  nginx.conf  scgi_params  uwsgi_params
```

```command
cat /etc/nginx/nginx.conf
```

To exit the interactive shell and return to your host system's shell, simply
type:

```command
exit
```

## Working with environment variables

Docker Exec allows you to pass environment variables to your commands using the
`-e` flag:

```command
docker exec -e VAR1=value1 -e VAR2=value2 my-nginx env
```

```text
[output]
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=0756f0d455ee
NGINX_VERSION=1.27.0
NJS_VERSION=0.8.4
NJS_RELEASE=2~bookworm
PKG_RELEASE=2~bookworm
[highlight]
VAR1=value1
VAR2=value2
[/highlight]
HOME=/root
```

This capability is particularly useful when running scripts that depend on
certain environment configurations.

## Running commands as a different user

By default, commands executed with `docker exec` run as the root user inside the
container. However, you can specify a different user with the `-u` flag:

```command
docker exec -u nginx my-nginx whoami
```

```text
[output]
nginx
```

This command runs `whoami` as the `nginx` user instead of `root`. The ability to
change users is crucial for security and for testing applications that run under
specific user accounts.

## Specifying a different working directory

You can specify the working directory for your command with the `-w` flag:

```command
docker exec -w /etc/nginx my-nginx ls -la
```

```text
[output]
total 36
drwxr-xr-x 1 root root 4096 Mar  7 15:10 .
drwxr-xr-x 1 root root 4096 Mar  7 15:10 ..
drwxr-xr-x 1 root root 4096 Mar  7 15:10 conf.d
-rw-r--r-- 1 root root  664 Mar  5 16:14 fastcgi_params
-rw-r--r-- 1 root root 5349 Mar  5 16:14 mime.types
...
```

This command lists the contents of the `/etc/nginx` directory without having to
navigate there first.

## Running commands in detached mode

The `-d` flag runs the command in the background (detached mode):

```command
docker exec -d my-nginx touch /tmp/background-task-complete
```

This command creates a file in the container but returns immediately without
waiting for the command to complete. Detached mode is useful for starting
long-running processes within containers.

[ad-logs]

## Best practices for using Docker Exec

### Security considerations

When using Docker Exec, keep these security considerations in mind:

1. **Avoid running as root when possible**: Use the `-u` flag to specify a
   non-root user whenever appropriate.

2. **Be cautious with environment variables**: Sensitive data passed with `-e`
   might be visible to other users on the system through process lists.

3. **Limit capabilities**: Use Docker's capability-based security to restrict
   what containerized processes can do, particularly for containers that allow
   exec access.

### When to use Docker Exec vs. other Docker commands

`docker exec` is powerful, but it's not always the right tool for monitoring or
debugging running containers. Here are some alternative options to consider:

- Use `docker cp` for file transfers between host and container.
- Use `docker logs` to view container output.
- Use `docker attach` to connect to the main process of a container.
- Use `Dockerfile` instructions for permanent changes to your container image.

### Creating aliases for frequently used Docker Exec commands

For commands you use often, create shell aliases to save time:

```command
alias dexec='docker exec -it'
```

Now you can simply use:

```command
dexec my-nginx bash
```

For more permanent aliases, add them to your shell's configuration file (like
`~/.bashrc` or `~/.zshrc`).

### Limiting resource usage

When running intensive commands inside containers, you may want to limit their
resource usage:

```command
docker exec --memory=256m --cpus=0.5 my-container intensive-task
```

This ensures that your command won't consume excessive resources on the host
system.

## Troubleshooting common issues

When using the `docker exec` command, you may encounter a few common errors.
Let's look at a few of them below:

### Container not running errors

If you try to use Docker Exec on a stopped container, you'll get an error:

```command
docker exec <container> ls
```

```text
[output]
Error response from daemon: container 0756f0d455ee36bcddafe2db754a8206cd8ec5fae3cca609385b0a7d1fae9737 is not running
```

Always check that your container is running with `docker ps` before using
`docker exec`. If a container is stopped, you can start it again with:

```command
docker container start <container>
```

### Permission denied problems

Permission issues are common when executing commands as non-root users:

```command
docker exec -u nginx my-nginx touch /root/test-file
```

```text
[output]
touch: cannot touch '/root/test-file': Permission denied
```

To resolve this, either use a different directory where the user has permissions
or temporarily switch to root:

```command
docker exec my-nginx touch /root/test-file
```

### Command not found errors

If you try to run a command that doesn't exist in the container, you'll get a
"command not found" error:

```command
docker exec my-nginx ps aux
```

```text
[output]
OCI runtime exec failed: exec failed: unable to start container process: exec: "ps": executable file not found in $PATH: unknown
```

This typically happens with minimal container images that don't include standard
utilities. You'll need to install the utility first or use a different approach.

## Final thoughts

Docker Exec allows you to interact with running containers without disrupting
them, bridging the gap between Docker's isolated container philosophy and your
practical needs for troubleshooting.

While Docker emphasizes immutable infrastructure, Docker Exec acknowledges that
you sometimes need to look inside containers. Use it for temporary debugging and
troubleshooting, but make permanent changes through proper image rebuilds.

Thanks for reading!
