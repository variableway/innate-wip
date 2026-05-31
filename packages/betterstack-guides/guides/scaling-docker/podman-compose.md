# Podman Compose Tutorial for Beginners

[Podman Compose](https://github.com/containers/podman-compose) is a powerful
tool for managing multi-container applications, offering a lightweight and
secure alternative to Docker Compose.

In this tutorial, we'll walk you through the basics of Podman Compose, from
installation to real-world use cases, with practical examples to help you get
started.

[ad-logs]

## What is Podman Compose?

Podman Compose is a tool that allows you to define and manage multi-container
applications using a `compose.yaml` file. It is built on top of Podman, a
daemonless container engine that provides rootless containers for enhanced
security. Unlike Docker Compose, Podman Compose does not rely on a central
daemon, making it more lightweight and secure.

Podman Compose is compatible with Docker Compose files, meaning you can use your
existing `compose.yaml` files with minimal changes. This makes it an excellent
choice for developers looking to transition from Docker to Podman.

## Installing Podman and Podman Compose

Before using Podman Compose, we need to install two tools: Podman itself, and
Podman Compose (a Python-based wrapper).

### Installing Podman

On Linux, Podman is available through most official repositories. For example,
on Ubuntu:

```command
sudo apt update
```

```command
sudo apt install podman -y
```

On Fedora-based systems:

```command
sudo dnf install podman -y
```

For macOS or Windows users, the easiest way is to install
[Podman Desktop](https://podman-desktop.io/), which includes Podman and a
graphical interface.

![Screenshot From 2025-03-24 08-40-41.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/95c138c0-dc42-41d3-53b6-c965d8cb0b00/md2x =2588x1532)

You can verify Podman installation by running:

```command
podman --version
```

```text
[output]
podman version 5.4.1
```

### Installing Podman Compose

Podman Compose is a Python tool and can be installed using `pip`. If you don't
already have Python and pip installed, install them first using your system
package manager.

Once ready, install Podman Compose:

```command
pip install podman-compose
```

Verify the installation:

```command
podman-compose version
```

```text
[output]
podman-compose version 1.3.0
podman version 5.4.1
```

### Setting up a non-root user

One of the key advantages of Podman is its support for rootless containers. To
run containers as a non-root user, you need to configure user namespaces and
subuid/subgid mappings. Run the following commands to set this up:

```command
sudo usermod --add-subuids 100000-165535 --add-subgids 100000-165535 $USER
```

This command assigns a range of UIDs and GIDs to your user, allowing Podman to
map container users to your host system securely.

## Understanding how Podman Compose works

Podman Compose reads a `compose.yaml` file and runs the services using Podman
commands rather than Docker. Since it's not an exact reimplementation, some
features or behaviors may differ slightly.

However, for basic development workflows and most common use cases, Podman
Compose works as a drop-in replacement for Docker Compose.

Here's an example of a simple `compose.yaml` file:

```yaml
[label compose.yaml]
services:
  web:
    image: nginx
    ports:
      - "8000:80"
```

This file defines a single service called `web` which is an Nginx web server.
This service maps port 8080 on the host to port 80 in the container.

To start the container, run:

```command
podman-compose up
```

![Screenshot From 2025-03-24 08-31-59.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3dd87cf6-4752-4a93-5cff-0939ebee0600/md1x =2390x1430)

This command will pull the required images, create the containers, and start
them. You can access the web application by navigating to
`http://localhost:8000` in your browser.

![Screenshot From 2025-03-24 08-32-40.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/eb5ee343-c632-47b4-5a1b-185650927600/lg2x =2182x1128)

While Podman Compose is compatible with Docker Compose files, there are some
differences to be aware of:

- **Rootless containers**: Podman Compose runs containers as a non-root user by
  default, enhancing security.
- **Daemonless architecture**: Podman does not rely on a central daemon, making
  it more lightweight.
- **Command differences**: Some Docker Compose commands may behave differently
  in Podman Compose.

To stop the server, run:

```command
podman-compose down
```

## Working with volumes, networks, and logs

Podman Compose automatically creates a network for your services. You can
inspect it using:

```command
podman network ls
```

To view logs from a specific service:

```command
podman-compose logs web
```

To access a container's shell, use:

```command
podman exec -it <container-id> /bin/sh
```

To list volumes:

```command
podman volume ls
```

## Running containers as a non-root user

One of Podman’s key advantages is its ability to run containers **without root
access**. This makes development and testing safer by isolating container
permissions.

You don’t need to configure anything special—just use Podman Compose from your
regular user account. Podman will automatically use user namespaces.

For example:

```command
whoami
podman-compose up
```

You’ll see that everything runs under your user context.


## Using .env files for configuration

Podman Compose also supports `.env` files to manage your environment variables
outside of your YAML file.

Create a `.env` file:

```text
[label .env]
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=mydb
```

Update your Compose file to reference these variables:

```yaml
[label docker-compose.yml excerpt]
environment:
  POSTGRES_USER: ${POSTGRES_USER}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  POSTGRES_DB: ${POSTGRES_DB}
```

This makes your setup more portable and secure.

## Migrating from Docker Compose

Already using Docker Compose? Good news: you can often reuse the same
`docker-compose.yml` file with Podman Compose.

Just copy the file over and try:

```command
podman-compose up
```

If you run into errors, check for Docker-specific features like `build.context`
quirks or named volumes that may behave slightly differently under Podman.

## Final thoughts

Podman Compose is a versatile tool for managing multi-container applications,
offering a secure and lightweight alternative to Docker Compose.

With its compatibility with Docker Compose files and support for rootless
containers, it's an excellent choice for both development and production
environments.

By following this tutorial, you should be well-equipped to start using Podman
Compose in your own projects.

Thanks for reading!