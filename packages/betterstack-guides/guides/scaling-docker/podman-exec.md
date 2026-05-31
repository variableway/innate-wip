# Podman Exec: A Beginner's Guide

[Podman](https://podman.io) provides powerful containerization technology that enables developers to build, ship, and run applications in isolated environments called containers. After launching containers, you may need to interact with them to debug an issue.

The `podman exec` command serves as your gateway into running containers, allowing you to execute commands inside them without interrupting their normal operation. Think of it as opening a door into a container's isolated environment without stopping or restarting it.

This tutorial explores the `podman exec` command, demonstrating how to run one-off commands in containers and how to gain interactive shell access for more complex operations. 

You'll learn practical techniques for container inspection, debugging, and management that will become essential tools in your Podman workflow.

Let's get started!

[ad-logs]

## Getting started with Podman Exec

Before diving into Podman Exec, there are a few prerequisites:

1. Podman must be installed on your system.
2. You need at least one running container.

If you're entirely new to Podman, you should first install Podman on your system following the [official Podman documentation](https://podman.io/getting-started/installation), then start a container. For beginners, a simple container to practice with is the official `nginx` web server:

```command
podman run --name my-nginx -d nginx
```

This command starts an nginx container in detached mode (`-d`), naming it `my-nginx`. The container will run in the background.

To see which containers are currently running on your system, use:

```command
podman ps
```

```text
[output]
CONTAINER ID   IMAGE   COMMAND                  CREATED         STATUS         PORTS     NAMES
7a3c1af5f11a   nginx   "/docker-entrypoint.…"   5 seconds ago   Up 4 seconds   80/tcp    my-nginx
```

The output shows all running containers, their IDs, the base image, running time, exposed ports, and names. You'll need either the `CONTAINER ID` or `NAME` to use `podman exec`. The basic syntax is as follows:

```command
podman exec [OPTIONS] CONTAINER COMMAND
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

Now, let's try a simple `podman exec` command:

```command
podman exec my-nginx ls -la
```

This command lists all files in the root directory of the "my-nginx" container using the `ls -la` command. You should see output similar to this:

```text
[output]
total 80
drwxr-xr-x   1 root root 4096 Mar  7 15:10 .
drwxr-xr-x   1 root root 4096 Mar  7 15:10 ..
-rwxr-xr-x   1 root root    0 Mar  7 15:10 .containerenv
drwxr-xr-x   2 root root 4096 Feb 27 00:00 bin
drwxr-xr-x   2 root root 4096 Dec  9 22:52 boot
. . .
```

Congratulations! You've just executed your first command inside a running Podman container. This simple example demonstrates the core functionality of Podman Exec.

## Running one-off commands in a Podman Container

The simplest way to use `podman exec` is to run individual commands inside a container. For example, to check the `nginx` version in our running container:

```command
podman exec my-nginx nginx -v
```

```text
[output]
nginx version: nginx/1.27.0
```

To check the operating system details inside the container:

```command
podman exec my-nginx cat /etc/os-release
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

These commands run and exit immediately, showing only the output. But what if you need to run multiple commands or navigate through the container's filesystem?

This is where running an interactive shell becomes necessary so let's look at that next.

## Accessing a container's shell with interactive mode

For more complex operations, you'll want to access a shell inside the container. This is where the interactive (`-i`) and tty allocation (`-t`) flags become useful:

```command
podman exec -it my-nginx /bin/bash
```

This command starts an interactive bash shell inside the "my-nginx" container. The `-i` flag keeps STDIN open, while `-t` allocates a pseudo-TTY, simulating a terminal environment. Combined, they provide an interactive shell experience.

After running this command, your prompt will change to indicate you're now inside the container:

```text
root@7a3c1af5f11a:/#
```

Now you can navigate and execute commands as if you were directly logged into the container:

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

To exit the interactive shell and return to your host system's shell, simply type:

```command
exit
```

## Working with environment variables

Podman Exec allows you to pass environment variables to your commands using the `-e` flag:

```command
podman exec -e VAR1=value1 -e VAR2=value2 my-nginx env
```

```text
[output]
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=0756f0d455ee
NGINX_VERSION=1.27.0
NJS_VERSION=0.8.4
NJS_RELEASE=2~bookworm
PKG_RELEASE=2~bookworm
VAR1=value1
VAR2=value2
HOME=/root
```

This capability is particularly useful when running scripts that depend on certain environment configurations.

## Running commands as a different user

By default, commands executed with `podman exec` run as the root user inside the container. However, you can specify a different user with the `-u` flag:

```command
podman exec -u nginx my-nginx whoami
```

```text
nginx
```

This command runs `whoami` as the `nginx` user instead of `root`. The ability to change users is crucial for security and for testing applications that run under specific user accounts.

## Specifying a different working directory

You can specify the working directory for your command with the `-w` flag:

```command
podman exec -w /etc/nginx my-nginx ls -la
```

```text
total 36
drwxr-xr-x 1 root root 4096 Mar  7 15:10 .
drwxr-xr-x 1 root root 4096 Mar  7 15:10 ..
drwxr-xr-x 1 root root 4096 Mar  7 15:10 conf.d
-rw-r--r-- 1 root root  664 Mar  5 16:14 fastcgi_params
-rw-r--r-- 1 root root 5349 Mar  5 16:14 mime.types
...
```

This command lists the contents of the `/etc/nginx` directory without having to navigate there first.

## Running commands in detached mode

The `-d` flag runs the command in the background (detached mode):

```command
podman exec -d my-nginx touch /tmp/background-task-complete
```

This command creates a file in the container but returns immediately without waiting for the command to complete. Detached mode is useful for starting long-running processes within containers.

## Podman Exec in Rootless Environments

One of Podman's key advantages over Docker is its native support for rootless containers. When using `podman exec` in a rootless environment:

```command
podman exec --user $(id -u) my-container whoami
```

This runs the command as your current user inside the container, reducing security risks associated with running containers as root.

## Executing commands in Podman pods

Podman introduces the concept of pods, which are groups of containers that share the same network namespace. To execute a command in a specific container within a pod:

```command
podman exec -it pod-name:container-name bash
```

This feature is particularly useful in Kubernetes-like environments where multiple containers work together.

## Final thoughts

Podman Exec allows you to interact with running containers without disrupting them, bridging the gap between Podman's isolated container philosophy and your practical needs for troubleshooting.

While containerization emphasizes immutable infrastructure, Podman Exec acknowledges that you sometimes need to look inside containers. Use it for temporary debugging and troubleshooting, but make permanent changes through proper image rebuilds.

Podman's compatibility with Docker commands makes it easy to transition between the two tools, while its emphasis on security with rootless containers and daemonless architecture offers significant advantages for enterprise environments and security-conscious developers.

Thanks for reading!