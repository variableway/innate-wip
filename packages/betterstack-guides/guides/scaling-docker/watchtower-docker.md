# Automating Docker Container Updates with Watchtower

When you work with Docker containers in production environments, keeping your
container images updated is critical for security and performance. However,
manually checking for updates and redeploying containers can be tedious and
time-consuming. 

This is where [Watchtower](https://github.com/containrrr/watchtower) comes in - a utility that automates the
process of monitoring and updating Docker containers based on changes to their
underlying images.

In this guide, we'll explore how to set up Watchtower to automatically monitor
your Docker containers for image updates. We'll cover different deployment
methods, how to manage multiple containers, and even how to set up a
monitoring-only mode with email notifications when you need more control over
the update process.

[ad-logs]

## Understanding Watchtower's functionality

Watchtower operates by monitoring the repositories of images used by your
running Docker containers. When a new version of an image is pushed to the
repository, Watchtower can automatically:

1. Pull the updated image
2. Gracefully stop the running container
3. Start a new container using the updated image with the same parameters
4. Remove the old container (if configured to do so)

This process ensures your containers always run the latest available versions of
their base images without requiring manual intervention.

## Setting up your environment

Before diving into Watchtower configurations, ensure your server is properly set
up with:

- A non-root user with sudo privileges.
- Docker installed and running.
- Docker Compose installed (for certain deployment methods).
- A Docker Hub account (if you plan to test with custom images).

Let's get started with the implementation options.

## Deploying Watchtower with Docker run

The simplest way to deploy Watchtower is using Docker's run command. We'll first
create a test container to monitor, then deploy Watchtower to watch it.

### Creating a container to monitor

For demonstration purposes, let's create a simple container based on Ubuntu's
official image. We'll use the `sleep infinity` command to keep the container
running, as containers exit when they have no active processes:

```command
docker run -d \
  --name demo-ubuntu \
  ubuntu \
  sleep infinity
```

This command:

- Creates a detached container (`-d` flag)
- Names it `demo-ubuntu`
- Uses the official Ubuntu image
- Keeps it running with the `sleep` command

### Launching Watchtower

Now that we have a container to monitor, we can deploy Watchtower. Unlike
traditional applications, Watchtower itself runs in a Docker container:

```command
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  demo-ubuntu
```

Let's break down this command:

- The `-d` flag runs Watchtower in detached mode
- `--name watchtower` gives our container a recognizable name
- `-v /var/run/docker.sock:/var/run/docker.sock` mounts the Docker socket,
  allowing Watchtower to communicate with the Docker API
- `containrrr/watchtower` is the official Watchtower image
- `demo-ubuntu` is the name of the container we want Watchtower to monitor

When you run this command for the first time, Docker will pull the Watchtower
image:

```text
[output]
Unable to find image 'containrrr/watchtower:latest' locally
latest: Pulling from containrrr/watchtower
1045b2f97fda: Pull complete
35a104a262d3: Pull complete
1a0671483169: Pull complete
Digest: sha256:bbf9794a691b59ed2ed3089fec53844f14ada249ee5e372ff0e595b73f4e9ab3
Status: Downloaded newer image for containrrr/watchtower:latest
b6d1b765b2b8480357f246d3bcc3f422ff492b3deabb84cb0ab2909e2d63b9d3
```

You can verify both containers are running with:

```command
docker ps
```

```text
[output]
CONTAINER ID   IMAGE                   COMMAND                  CREATED         STATUS         PORTS      NAMES
b6d1b765b2b8   containrrr/watchtower   "/watchtower custom_…"   2 minutes ago   Up 2 minutes   8080/tcp   watchtower
56ac4341d662   ubuntu                  "sleep infinity"         6 minutes ago   Up 5 minutes              demo-ubuntu
```

With this setup, Watchtower will check for updates to the Ubuntu image every 24
hours (the default interval). When an update becomes available, Watchtower will
automatically:

1. Stop the `demo-ubuntu` container
2. Pull the updated Ubuntu image
3. Start a new `demo-ubuntu` container with the same parameters using the
   updated image

### Managing the Watchtower container

Like any Docker container, you can stop and remove Watchtower when needed:

```command
docker stop watchtower demo-ubuntu
```

And to remove the containers:

```command
docker rm watchtower demo-ubuntu
```

## Using Docker Compose for Watchtower deployment

While the `docker run` command works well for simple deployments, Docker Compose
provides a more maintainable approach for managing container configurations.

### Creating a Docker Compose file

First, create a directory for your project and navigate into it:

```command
mkdir ~/watchtower-project && cd ~/watchtower-project
```

Now create a Docker Compose file:

```command
vim docker-compose.yml
```

Add the following content to define both your target container and Watchtower:

```yaml
[label docker-compose.yml]
version: "3"
services:
  ubuntu:
    image: ubuntu
    container_name: demo-ubuntu
    command: sleep infinity

  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: demo-ubuntu
```

This configuration creates:

- A service named `ubuntu` that runs the Ubuntu image in a container named
  `demo-ubuntu`
- A service named `watchtower` that monitors the `demo-ubuntu` container

### Starting the containers

Launch both containers using Docker Compose:

```command
docker compose up -d
```

The `-d` flag runs the containers in detached mode, allowing you to continue
using your terminal.

This accomplishes the same result as the previous `docker run` commands but with
the advantage of having all configuration in a single file that can be
version-controlled.

## Monitoring multiple containers

One of Watchtower's strengths is its ability to monitor multiple containers at
once. Let's expand our configuration to handle several containers.

### Modifying the Docker Compose file

Open your Docker Compose file again:

```command
nano docker-compose.yml
```

Let's add more services to be monitored:

```yaml
[label docker-compose.yml]
version: "3"
services:
  ubuntu:
    image: ubuntu
    container_name: demo-ubuntu
    command: sleep infinity

  nginx:
    image: nginx
    container_name: demo-nginx
    ports:
      - "8080:80"

  postgres:
    image: postgres:14
    container_name: demo-postgres
    environment:
      POSTGRES_PASSWORD: example
    volumes:
      - postgres-data:/var/lib/postgresql/data

  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: demo-ubuntu demo-nginx

volumes:
  postgres-data:
```

In this expanded configuration:

- We've added Nginx and PostgreSQL containers
- Watchtower is explicitly configured to monitor only `demo-ubuntu` and
  `demo-nginx`, but not the PostgreSQL container

Note that if you don't specify container names in the Watchtower command, it
will monitor all running containers by default. The explicit naming approach
gives you more control over which containers to update automatically.

### Customizing the check interval

By default, Watchtower checks for updates every 24 hours (86,400 seconds). For
testing purposes or when more frequent checks are needed, you can change this
interval.

Let's modify the Watchtower configuration to check every 30 minutes:

```yaml
[label docker-compose.yml]
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 1800 demo-ubuntu demo-nginx
```

The `--interval` flag specifies the time between checks in seconds. Here, we've
set it to 1800 seconds (30 minutes).

### Applying the changes

Update your running containers with the new configuration:

```command
docker compose up -d --force-recreate
```

The `--force-recreate` flag ensures that all containers are recreated with the
updated configuration, even if their image hasn't changed.

## Testing updates with custom images

To see Watchtower in action, we can create a custom image, make changes to it,
and observe how Watchtower handles the updates.

### Creating and modifying a custom image

Let's create a simple custom image based on Node.js:

1. Create a directory for your custom image:

```command
mkdir ~/custom-node-app
cd ~/custom-node-app
```

2. Create a Dockerfile:

```command
nano Dockerfile
```

3. Add the following content:

```dockerfile
[label Dockerfile]
FROM node:22-alpine
WORKDIR /app
CMD ["node", "-e", "console.log('Hello from v1'); setTimeout(() => {}, 3600000);"]
```

This creates a simple image that logs a message and then waits for an hour.

4. Build and tag the image:

```command
docker build -t yourusername/custom-node:v1 .
```

Replace `yourusername` with your Docker Hub username.

5. Push the image to Docker Hub:

```command
docker login
docker push yourusername/custom-node:v1
```

### Adding the custom image to Docker Compose

Modify your Docker Compose file to include the custom image:

```command
nano ~/watchtower-project/docker-compose.yml
```

Add the following service:

```yaml
[label docker-compose.yml]
  custom-node:
    image: yourusername/custom-node:v1
    container_name: demo-custom-node
```

And add it to the Watchtower command:

```yaml
[label docker-compose.yml]
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 300 demo-ubuntu demo-nginx demo-custom-node
```

We've reduced the interval to 5 minutes (300 seconds) to see the update more
quickly.

Apply the changes:

```command
cd ~/watchtower-project
docker compose up -d --force-recreate
```

### Making changes to the custom image

Now, let's update our custom image:

```command
cd ~/custom-node-app
nano Dockerfile
```

Modify the CMD instruction:

```dockerfile
[label Dockerfile]
FROM node:22-alpine
WORKDIR /app
CMD ["node", "-e", "console.log('Hello from v2 - UPDATED!'); setTimeout(() => {}, 3600000);"]
```

Build and push the updated image with the same tag:

```command
docker build -t yourusername/custom-node:v1 .
docker push yourusername/custom-node:v1
```

Since we're using the same tag, Watchtower will detect this as an update to the
existing image.

### Observing the update

Within 5 minutes (our configured interval), Watchtower should detect the update
and restart the container. You can check the logs to confirm:

```command
docker logs watchtower
```

```output
time="2025-04-28T15:30:00Z" level=info msg="Found new yourusername/custom-node:v1 image (sha256:abc123...)"
time="2025-04-28T15:30:01Z" level=info msg="Stopping /demo-custom-node (abc123...)"
time="2025-04-28T15:30:04Z" level=info msg="Creating /demo-custom-node"
```

You can also verify the container has been updated by checking its logs:

```command
docker logs demo-custom-node
```

```output
Hello from v2 - UPDATED!
```

This demonstrates how Watchtower automatically detects and applies updates to
images, even when the image tag remains the same.

## Monitor-only mode with notifications

In production environments, you might not want containers to update
automatically. Instead, you might prefer to be notified when updates are
available and apply them manually during scheduled maintenance windows.

Watchtower supports a "monitor-only" mode that will alert you to available
updates without automatically applying them.

### Setting up email notifications

Let's modify our Docker Compose file to enable monitor-only mode with email
notifications:

```command
nano ~/watchtower-project/docker-compose.yml
```

Update the Watchtower service:

```yaml
[label docker-compose.yml]
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - WATCHTOWER_MONITOR_ONLY=true
      - WATCHTOWER_NOTIFICATIONS=email
      - WATCHTOWER_NOTIFICATION_EMAIL_FROM=your-email@gmail.com
      - WATCHTOWER_NOTIFICATION_EMAIL_TO=recipient@example.com
      - WATCHTOWER_NOTIFICATION_EMAIL_SERVER=smtp.gmail.com
      - WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PORT=587
      - WATCHTOWER_NOTIFICATION_EMAIL_SERVER_USER=your-email@gmail.com
      - WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PASSWORD=your-app-password
    command: --interval 300 demo-ubuntu demo-nginx demo-custom-node
```

Replace the email addresses and password with your own. For Gmail, you'll need
to use an App Password instead of your regular password.

The `WATCHTOWER_MONITOR_ONLY=true` environment variable is what enables
monitor-only mode.

### Applying the configuration

Update your containers with the new configuration:

```command
docker compose up -d --force-recreate
```

### Testing the notifications

To test the notification system, push another update to your custom image:

```command
cd ~/custom-node-app
nano Dockerfile
```

Make a small change:

```dockerfile
[label Dockerfile]
FROM node:22-alpine
WORKDIR /app
CMD ["node", "-e", "console.log('Hello from v3 - FOR NOTIFICATION TEST'); setTimeout(() => {}, 3600000);"]
```

Build and push:

```command
docker build -t yourusername/custom-node:v1 .
docker push yourusername/custom-node:v1
```

Within the configured interval, you should receive an email notification about
the available update. The email will look something like this:

```text
Subject: Watchtower updates on hostname

Watchtower 1.4.0
Using notifications: email
Checking containers: demo-ubuntu, demo-nginx, demo-custom-node
Found new yourusername/custom-node:v1 image (sha256:def456...)
```

### Manually applying updates

When you're ready to apply the update, you can do so manually using Watchtower
in run-once mode:

```command
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --run-once \
  demo-custom-node
```

This command:

- Creates a temporary Watchtower container (`--rm` ensures it's removed after
  completion)
- Runs it once and exits (`--run-once`)
- Updates only the specified container (`demo-custom-node`)

## Advanced Watchtower configurations

Watchtower offers several advanced options to customize its behavior.

### Cleanup of old images

By default, Watchtower doesn't remove old images after updating. To enable
automatic cleanup:

```yaml
[label docker-compose.yml]
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - WATCHTOWER_CLEANUP=true
    command: --interval 86400 demo-ubuntu demo-nginx
```

The `WATCHTOWER_CLEANUP=true` environment variable instructs Watchtower to
remove old images after updating containers.

### Scheduling updates

Instead of using intervals, you can schedule updates using cron expressions:

```yaml
[label docker-compose.yml]
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --schedule "0 0 * * 0" demo-ubuntu demo-nginx
```

This example schedules updates to occur at midnight every Sunday.

### Respecting stop signals

Some applications require specific signals to shut down gracefully. You can
adjust Watchtower's behavior:

```yaml
[label docker-compose.yml]
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - WATCHTOWER_TIMEOUT=60
    command: --interval 86400 demo-ubuntu demo-nginx
```

The `WATCHTOWER_TIMEOUT=60` environment variable gives containers 60 seconds to
shut down gracefully before forcing termination.

### Private registry authentication

If you're using private Docker registries, you can configure authentication:

```yaml
[label docker-compose.yml]
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - $HOME/.docker/config.json:/config.json
    environment:
      - DOCKER_CONFIG=/
    command: --interval 86400 demo-ubuntu demo-nginx
```

This configuration mounts your Docker credentials file into the Watchtower
container for authentication with private registries.

## Handling persistent data

When containers are updated, any data not stored in volumes will be lost. Ensure
that all important data is stored in Docker volumes:

```yaml
[label docker-compose.yml]
  postgres:
    image: postgres:14
    container_name: demo-postgres
    environment:
      POSTGRES_PASSWORD: example
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

This configuration ensures that PostgreSQL data persists across container
updates.

## Best practices for production

When using Watchtower in production environments, consider these best practices:

1. **Use monitor-only mode**: For critical services, use monitor-only mode with
   notifications to control when updates occur

2. **Set appropriate intervals**: Daily or weekly checks are usually sufficient;
   avoid checking too frequently

3. **Schedule updates during low-traffic periods**: Use cron scheduling to
   perform updates when your services have minimal usage

4. **Test updates in staging first**: Have a staging environment where updates
   are applied before production

5. **Back up data before updates**: Important data should be backed up
   regularly, especially before potential updates

6. **Use specific image tags**: Avoid using the `:latest` tag; instead, use
   specific version tags for better control

7. **Log monitoring**: Set up log monitoring to track Watchtower's activities
   and catch any issues with updates

8. **Health checks**: Implement health checks for your services to ensure
   they're functioning correctly after updates

## Final thoughts

Watchtower provides a powerful solution for automating Docker container updates.
Whether you choose full automation or a monitored approach with manual control,
Watchtower can significantly reduce the maintenance burden of keeping containers
updated.

By combining Watchtower with proper volume management and careful planning, you
can create a robust container environment that stays current with the latest
image updates without compromising stability or data integrity.
