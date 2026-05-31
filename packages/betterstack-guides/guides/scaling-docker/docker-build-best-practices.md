# Best Practices for Building Docker Images

Docker images serve as the foundation for your containerized applications. How you build these images directly impacts your application's security, performance, reliability, and maintenance overhead. A well-crafted Docker image leads to consistent behavior across environments, faster deployments, and a more secure application stack.

This article explores essential best practices for building Docker images that are efficient, secure, and maintainable. I'll provide clear examples of what to do and what to avoid when crafting your Dockerfiles, along with practical code snippets you can adapt to your own projects.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/GHeZaoUpVcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Multi-stage builds for optimal image size

One of the most powerful techniques for creating efficient Docker images is using multi-stage builds. This approach allows you to use one stage for building your application and another stage for running it, resulting in significantly smaller images.

### ❌ Don't do this

A common mistake is building everything in a single stage, which includes all build dependencies in your final image:

```dockerfile
[label Dockerfile]
FROM node:22
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

This approach creates a bloated image containing npm, build tools, and other dependencies that aren't needed at runtime.

### ✅ Do this instead

Use multi-stage builds to separate the build environment from the runtime environment:

```dockerfile
[label Dockerfile]
# Build stage
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:22-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm install --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

This example uses a full Node.js image for building the application but then copies only the necessary files to a slimmer runtime image. The final image excludes all the build tools and dependencies, resulting in a much smaller size.

Multi-stage builds also enable parallel building of stages when possible, which can speed up your build process considerably.

## Choose the right base image

![Screenshot 2025-03-17 at 08-36-35 Explore Docker's Container Image Repository Docker Hub.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1008ba38-d010-479b-2860-4d2adb126f00/lg2x =6143x3226)

The foundation of your Docker image is the base image you select. This choice significantly impacts security, size, and functionality.

### ❌ Don't do this

Don't automatically reach for popular but bloated base images:

```dockerfile
[label Dockerfile]
FROM ubuntu:latest
RUN apt-get update && apt-get install -y python3 python3-pip
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD ["python3", "app.py"]
```

This approach brings in an entire Ubuntu distribution with many unnecessary packages.

### ✅ Do this instead

Select the smallest base image that meets your requirements:

```dockerfile
[label Dockerfile]
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

Even better, consider using Alpine-based images for extremely small footprints:

```dockerfile
[label Dockerfile]
FROM python:3.12-alpine
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

Look for base images with official badges from Docker Hub or verified publisher marks, as these tend to be more secure and better maintained. For production environments, consider having separate image selections for development/testing and production use cases.

## Pin image versions with specific tags

Using specific version tags and even image digests ensures consistency across builds and environments.

### ❌ Don't do this

Don't use floating tags like `latest` that can change unexpectedly:

```dockerfile
[label Dockerfile]
FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "index.js"]
```

This approach means you might get different Node.js versions over time, potentially breaking your application.

### ✅ Do this instead

Pin to a specific version tag:

```dockerfile
[label Dockerfile]
FROM node:22.1.0
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "index.js"]
```

For maximum reliability, use a digest hash to guarantee the exact image:

```dockerfile
[label Dockerfile]
FROM node:22.1.0@sha256:12a331df1e31e40b2f37d2524037973908895fb766b8bce742cdf8b1216e5ac2
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "index.js"]
```

Using specific tags or digests makes your builds deterministic and reproducible. While you may miss automatic updates for security patches, you gain complete control over when to update base images, reducing unexpected breaks.

## Optimize layer caching

Docker builds images in layers, and each instruction in a `Dockerfile` creates a new layer. Understanding this layering system allows you to optimize caching for faster builds.

### ❌ Don't do this

Don't invalidate the cache unnecessarily by placing frequently changing files early in your Dockerfile:

```dockerfile
[label Dockerfile]
FROM node:22
WORKDIR /app
# This copies everything including code that changes frequently
COPY . .
RUN npm install
CMD ["npm", "start"]
```

Every time you change a source file, this invalidates the cache for all subsequent steps, including the `npm install` command.

### ✅ Do this instead

Order your instructions from least to most frequently changing:

```dockerfile
[label Dockerfile]
FROM node:22
WORKDIR /app
# Copy package files first
COPY package*.json ./
# Install dependencies
RUN npm install
# Then copy the rest of the code
COPY . .
CMD ["npm", "start"]
```

This way, Docker can use the cached layer for the dependency installation step as long as your package files haven't changed, even if your source code has.

You can also use the `--no-cache` flag for critical steps where you always want to get the latest versions:

```command
docker build --no-cache -t my-image:1.0 .
```

## Properly handle apt-get and other package managers

When using package managers like apt-get in Debian-based images, proper usage patterns can prevent common issues.

### ❌ Don't do this

Don't separate update and install commands:

```dockerfile
[label Dockerfile]
FROM ubuntu:24.04
RUN apt-get update
RUN apt-get install -y nginx
RUN apt-get install -y curl
```

This approach caches the `apt-get update` result, which means later builds might install outdated packages.

### ✅ Do this instead

Always combine update and install in a single `RUN` instruction:

```dockerfile
[label Dockerfile]
FROM ubuntu:24.04
RUN apt-get update && apt-get install -y --no-install-recommends \
   nginx \
   curl \
&& rm -rf /var/lib/apt/lists/*
```

This pattern ensures:

1. The package list is always updated before installation
2. Unnecessary recommended packages are excluded
3. The apt cache is cleaned up, reducing image size
4. All packages are installed in a single layer

For version pinning with `apt`, you can specify exact versions:

```dockerfile
[label Dockerfile]
FROM ubuntu:24.04
RUN apt-get update && apt-get install -y --no-install-recommends \
   nginx=1.24.0-2ubuntu1 \
   curl=8.5.0-2ubuntu1 \
&& rm -rf /var/lib/apt/lists/*
```

[ad-uptime]

## Use .dockerignore to exclude unnecessary files

The `.dockerignore` file helps you exclude files and directories from the build context, improving build performance and preventing sensitive information from being included in your images.

### ❌ Don't do this

Don't send your entire project directory as build context:

```command
# Without .dockerignore, everything gets sent to Docker daemon
$ docker build -t myapp .
```

This includes logs, temp files, Git repositories, and other files not needed for the build.

### ✅ Do this instead

Create a `.dockerignore` file to exclude unnecessary files:

```text
[label .dockerignore]
.git
.github
.gitignore
node_modules
npm-debug.log
Dockerfile
.dockerignore
*.md
.env*
*.log
coverage
dist
build
tmp
```

This reduces the build context size, speeds up the build process, and helps prevent sensitive information from leaking into your images.

## Create ephemeral containers

Containers should be ephemeral—easily stopped, destroyed, and replaced with minimal configuration.

### ❌ Don't do this

Don't design containers that require special setup or store state internally:

```dockerfile
[label Dockerfile]
FROM ubuntu:24.04
RUN apt-get update && apt-get install -y mysql-server
# Database directly in container - data lost when container is removed
CMD ["mysqld"]
```

### ✅ Do this instead

Design for statelessness and use volumes for persistent data:

```dockerfile
[label Dockerfile]
FROM mysql:8.4
# Configuration through environment variables
ENV MYSQL_ROOT_PASSWORD=my-secret-pw
ENV MYSQL_DATABASE=app_db
# Data stored in a volume that persists beyond the container
VOLUME /var/lib/mysql
CMD ["mysqld"]
```

When you run this container, mount the volume to persist data:

```command
docker run -d \
 --name db \
 -v mysql_data:/var/lib/mysql \
 mysql:8.4
```

This approach allows containers to be replaced without data loss and follows the principles of the twelve-factor application methodology.

## Use appropriate instructions for ENV, COPY, and ADD

Understanding the nuances between similar `Dockerfile` instructions can help you choose the most appropriate one for your use case.

### ENV for environment variables

### ❌ Don't do this

Don't create multiple layers for environment variables:

```dockerfile
[label Dockerfile]
FROM node:22
ENV NODE_ENV=production
ENV APP_PORT=3000
ENV APP_VERSION=1.2.3
```

### ✅ Do this instead

Environment variables should be grouped logically:

```dockerfile
[label Dockerfile]
FROM node:22
# Group related environment variables
ENV NODE_ENV=production \
   APP_PORT=3000 \
   APP_VERSION=1.2.3
```

For variables that shouldn't persist in the final image, use this pattern:

```dockerfile
[label Dockerfile]
FROM node:22
# For temporary variables that shouldn't persist in the image
RUN export TEMP_VAR=value && \
   do-something-with $TEMP_VAR && \
   unset TEMP_VAR
```

### COPY vs ADD

### ❌ Don't do this

Don't use ADD for simple file copying:

```dockerfile
[label Dockerfile]
FROM node:22
# Using ADD for basic file copying is overkill
ADD ./app /app
```

### ✅ Do this instead

COPY is simpler and more explicit for basic file copying:

```dockerfile
[label Dockerfile]
FROM node:22
# Use COPY for basic file copying from build context
COPY ./app /app
```

ADD has additional features like auto-extraction of archives and URL support:

```dockerfile
[label Dockerfile]
FROM node:22
# Use ADD for extracting archives
ADD project.tar.gz /app/

# Use ADD for downloading files with checksum verification
ADD --checksum=sha256:24cb2a3f9ae9d9754ae493df3b41a2c4c75a05ab8c518165582edd0ef4eaff80 \
   https://example.com/download/package.zip /app/package.zip
```

Generally, prefer COPY unless you specifically need ADD's extra functionality.

## Set the appropriate user

Running containers as non-root users improves security by reducing the potential impact of container breaches.

### ❌ Don't do this

Don't run everything as root by default:

```dockerfile
[label Dockerfile]
FROM nginx:alpine
COPY app/ /usr/share/nginx/html
# Implicitly runs as root
CMD ["nginx", "-g", "daemon off;"]
```

### ✅ Do this instead

Create and use a non-privileged user:

```dockerfile
[label Dockerfile]
FROM nginx:alpine
# Create a non-root user
RUN addgroup -g 1000 appgroup && \
   adduser -u 1000 -G appgroup -h /home/appuser -D appuser

# Configure application
COPY --chown=appuser:appgroup app/ /usr/share/nginx/html

# For services that need to bind to privileged ports,
# start as root then switch to the non-root user
USER appuser

# For processes that don't need root
CMD ["nginx", "-g", "daemon off;"]
```

For applications that don't need to bind to privileged ports (below 1024), running as a non-root user from the start is even better.

## Use WORKDIR instead of RUN cd

The WORKDIR instruction sets the working directory for subsequent instructions in a clear, explicit way.

### ❌ Don't do this

Don't use `RUN cd` commands to change directories:

```dockerfile
[label Dockerfile]
FROM node:22
# Bad practice - using cd commands
RUN cd /opt && mkdir app
RUN cd /opt/app && npm init -y
COPY . /opt/app/
RUN cd /opt/app && npm install
CMD cd /opt/app && npm start
```

This approach is error-prone, harder to read, and doesn't actually change the working directory for subsequent instructions.

### ✅ Do this instead

Use `WORKDIR` to set the working directory:

```dockerfile
[label Dockerfile]
FROM node:22
# Good practice - using WORKDIR
WORKDIR /opt/app
RUN npm init -y
COPY . .
RUN npm install
CMD ["npm", "start"]
```

`WORKDIR` creates the directory if it doesn't exist and makes the intention clearer. It also simplifies file paths in subsequent instructions.

## Final thoughts

Building efficient Docker images requires attention to detail and an understanding of Docker's layering system. By following these best practices—using multi-stage builds, choosing appropriate base images, optimizing caching, and implementing proper security measures—you can create images that are smaller, more secure, and easier to maintain.

Remember that the `Dockerfile` is essentially documentation for how your application should be built and run. A clean, well-structured `Dockerfile` makes it easier for others (and your future self) to understand how your application works.

The practices outlined here should serve as guidelines rather than rigid rules. As with all aspects of software development, understanding the reasoning behind each practice allows you to make informed decisions about when to follow them and when your specific use case might require a different approach.

Thanks for reading!