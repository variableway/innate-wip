# Reducing Docker Image Sizes: From 1.2GB to 150MB (or less)

Docker containers have revolutionized how we package and deploy applications,
but as projects grow in complexity, Docker images often become bloated. Large
images lead to slower deployments, increased bandwidth usage, higher storage
costs, and an expanded attack surface. Optimizing Docker images isn't just about
saving space—it's about creating more efficient, secure, and maintainable
applications.

This article explores practical techniques for reducing Docker image sizes,
using a Node.js application as our primary example but providing principles
applicable to any technology stack.

Let's get started!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/t779DVjCKCs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Understanding Docker image layers

Docker images consist of read-only layers that represent instructions in your
`Dockerfile`. When you modify a file and rebuild an image, only the layers that
have changed need to be rebuilt. This layer caching mechanism is powerful but
can be problematic if not used thoughtfully.

Each instruction in a `Dockerfile` creates a new layer, and the history of these
layers persists even when files are deleted in subsequent layers. For example,
if you download a large file in one layer and delete it in another, the final
image will still contain the large file in its history, consuming unnecessary
space.

To visualize layers in an existing image, use the `docker history` command:

```command
docker history node:latest
```

```text
[output]
IMAGE          CREATED        CREATED BY                                      SIZE      COMMENT
e8aff90ae3dc   2 weeks ago    /bin/sh -c #(nop)  CMD ["node"]                 0B
<missing>      2 weeks ago    /bin/sh -c #(nop)  ENTRYPOINT ["docker-ent…     0B
<missing>      2 weeks ago    /bin/sh -c #(nop)  COPY file:4d192565a7220f…    388B
<missing>      2 weeks ago    /bin/sh -c set -ex   && for key in     6A010…   7.73MB
. . .
```

Understanding how layers work is the foundation for optimizing Docker images, as
we'll see in the strategies below.

[ad-uptime]

## Base image selection

Your choice of base image has the most significant impact on your final image
size. For Node.js applications, consider these options:

```dockerfile
[label Dockerfile]
# Full image: includes many tools which are unnecessary for most projects
FROM node:latest  # ~1GB+

# Slim variant: minimal Debian with Node.js
FROM node:22-slim  # ~220MB

# Alpine variant: extremely minimal Linux distribution
FROM node:22-alpine  # ~150MB
```

![Screenshot From 2025-03-10 08-31-15.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cb7c3c23-7a66-4b00-f138-6c0f3a161300/md1x =1682x768)

The Alpine-based images are dramatically smaller because they use
[Alpine Linux](https://alpinelinux.org/), a distribution designed specifically
for containers and security. However, Alpine uses `musl` instead of `glibc`,
which can occasionally cause compatibility issues with certain dependencies that
include native code.

When selecting a base image, consider the specific requirements of your
application, your team's familiarity with the base OS, potential compatibility
issues with your dependencies, and security implications of each option.

For most web applications, Alpine images provide an excellent balance of size
and functionality. However, if you have complex native dependencies, you might
need to use the slim variant or address the specific compatibility challenges.

## Using .dockerignore effectively

The `.dockerignore` file works similarly to `.gitignore`, letting you exclude
files and directories from the Docker build context. This not only speeds up the
build process but also prevents unnecessary or sensitive files from being
included in your image.

Here's an effective `.dockerignore` for a Node.js project:

```text
[label .dockerignore]
# Dependencies
node_modules
npm-debug.log

# Source control
.git
.gitignore

# Environment and config
.env
.env.local
.env.*

# Testing and documentation
tests/
coverage/
docs/

# OS files
.DS_Store
Thumbs.db

# Build outputs
dist/
build/
```

The benefits of a well-crafted `.dockerignore` file include faster builds by
reducing the build context size, prevention of accidentally including sensitive
data, smaller final images by excluding unnecessary files, and more consistent
builds across different environments.

Always review and update your `.dockerignore` file as your project evolves to
ensure you're not including files that don't belong in your production image.

## Dockerfile best practices for layer optimization

The order of commands in your `Dockerfile` significantly impacts caching and,
consequently, rebuild times. A key principle is to order commands from least
likely to change to most likely to change.

For a Node.js application, package dependencies change less frequently than
application code, so they should be installed first:

```dockerfile
[label Dockerfile]
FROM node:22-alpine
WORKDIR /app

# Copy dependency files first
COPY package.json package-lock.json ./

# Install dependencies in a separate layer
RUN npm ci --production

# Copy application code (changes frequently)
COPY . .

EXPOSE 3000
CMD ["node", "index.js"]
```

This approach means that if your application code changes but your dependencies
remain the same, Docker can use the cached layer containing the installed
dependencies, significantly speeding up builds.

Another key practice is to combine related commands in a single `RUN`
instruction to create fewer layers:

```dockerfile
[Dockerfile]
RUN npm ci --production && \
    npm cache clean --force && \
    rm -rf /tmp/* /var/cache/apk/*
```

This not only creates fewer layers but ensures that temporary files don't bloat
your image, as they're removed in the same layer where they're created.

## Multi-stage builds for dramatic size reduction

Multi-stage builds are one of the most powerful techniques for reducing Docker
image sizes. They allow you to use different base images for building and
running your application.

Here's how a multi-stage build works for a Node.js application that needs to be
transpiled or bundled:

```dockerfile
[Dockerfile]
# Build stage
FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /app
# Copy only the built artifacts and production dependencies
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

This approach separates your build environment from your runtime environment.
The final image contains only the compiled assets and production dependencies,
not the source code, development dependencies, or build tools.

For even more dramatic size reductions, consider using specialized base images
in your production stage:

```dockerfile
[label Dockerfile]
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage using distroless
FROM gcr.io/distroless/nodejs:18
WORKDIR /app
COPY --from=builder /app/dist ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["main.js"]
```

Distroless images contain only your application and its runtime dependencies—not
even a shell or package manager. This dramatically reduces the attack surface
and image size.

## Cleaning up within layers

To minimize layer size, it's essential to clean up temporary files and caches
within the same `RUN` instruction that creates them. Each package manager has
its own cleanup commands:

For Alpine-based images:

```dockerfile
[label Dockerfile]
RUN apk add --no-cache some-package && \
    # Do some work with the package
    rm -rf /var/cache/apk/*
```

For Debian-based images:

```dockerfile
[label Dockerfile]
RUN apt-get update && \
    apt-get install -y --no-install-recommends some-package && \
    # Do some work with the package
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

For Node.js applications:

```dockerfile
[label Dockerfile]
RUN npm ci --production && \
    npm cache clean --force
```

These cleanup steps are particularly important in the final image. In
multi-stage builds, you can be less concerned about cleanup in the builder stage
since those layers won't be included in the final image.

## Language-specific optimizations

### Node.js optimizations

For Node.js applications, several techniques can significantly reduce your image
size. First, use `npm ci` instead of `npm install` whenever possible. This
command is not only faster but also more deterministic, as it installs exact
versions based on your `package-lock.json` file.

When building production images, the `--production` flag is crucial as it
prevents the installation of `devDependencies`, which often account for a large
portion of a project's dependencies:

```dockerfile
[label Dockerfile]
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
[highlight]
RUN npm ci --production
[/highlight]
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

For projects that require build steps, you can install all dependencies for
building but prune development dependencies before the final stage:

```dockerfile
[label Dockerfile]
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
# Install all dependencies including dev
RUN npm ci
COPY . .
# Build with dev dependencies available
RUN npm run build
# Remove dev dependencies afterward
[highlight]
RUN npm prune --production
[/highlight]
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

You can further optimize by carefully managing your dependencies. Use tools like
[depcheck](https://www.npmjs.com/package/depcheck) to identify and remove unused
dependencies.

For modern Node.js applications, leverage ES modules and tree-shaking to
eliminate dead code. Tools like [esbuild](https://esbuild.github.io/) can bundle
your application with only the code actually used:

```dockerfile
[label Dockerfile]
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Bundle the application with tree-shaking
[highlight]
RUN npx esbuild --bundle --minify --platform=node --target=node16 --outfile=dist/bundle.js src/index.js
[/highlight]

FROM node:22-alpine
WORKDIR /app
# Only copy the bundled application
COPY --from=builder /app/dist/bundle.js ./index.js
EXPOSE 3000
CMD ["node", "index.js"]
```

This approach not only reduces image size but can also improve startup time.

### Python optimizations

Python applications face unique challenges with Docker images due to the
overhead of virtual environments and package caching. An effective multi-stage
build for Python involves creating wheels in one stage and installing them in
another:

```dockerfile
[label Dockerfile]
FROM python:3.10-alpine AS builder
WORKDIR /app
# Install build dependencies
RUN apk add --no-cache gcc musl-dev python3-dev
COPY requirements.txt .
# Create wheels for faster installation
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

FROM python:3.10-alpine
WORKDIR /app
COPY --from=builder /wheels /wheels
COPY requirements.txt .
# Install from pre-built wheels
RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt && \
    rm -rf /wheels
COPY . .
CMD ["python", "app.py"]
```

For more complex Python applications, consider these additional optimizations:

For a Python application using a dependency manager like Poetry, you can
optimize further:

```dockerfile
[label Dockerfile]
FROM python:3.10-slim AS builder
WORKDIR /app
RUN pip install poetry
COPY pyproject.toml poetry.lock ./
# Configure poetry to not use virtual environments in Docker
RUN poetry config virtualenvs.create false
# Export dependencies as requirements.txt
RUN poetry export -f requirements.txt > requirements.txt
# Build wheels
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

FROM python:3.10-slim
WORKDIR /app
# Copy only requirements and wheels
COPY --from=builder /app/requirements.txt .
COPY --from=builder /wheels /wheels
# Install from wheels
RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt && \
    rm -rf /wheels
# Copy application code
COPY . .
CMD ["python", "app.py"]
```

For Django or Flask applications, a production-ready Docker setup might look
like:

```dockerfile
[label Dockerfile]
FROM python:3.10-slim AS builder
WORKDIR /app
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc && \
    rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

FROM python:3.10-slim
WORKDIR /app
# Copy wheels and install dependencies
COPY --from=builder /wheels /wheels
COPY requirements.txt .
RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt && \
    rm -rf /wheels
# Copy application code
COPY . .
# Collect static files
RUN python manage.py collectstatic --noinput
# Remove development settings and compile Python bytecode
RUN python -m compileall .
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "myproject.wsgi:application"]
```

### Java optimizations

Java applications often result in large Docker images due to the JVM's size and
the typical build process. Modern Java applications can leverage several
techniques to significantly reduce image size.

First, consider using the JLink tool to create a custom JRE with only the
modules your application needs:

```dockerfile
[label Dockerfile]
FROM eclipse-temurin:17 AS builder
WORKDIR /app
COPY . .
RUN ./mvnw package
# Create custom JRE
RUN jlink \
    --add-modules $(jdeps --print-module-deps target/app.jar),jdk.crypto.ec \
    --strip-debug \
    --no-man-pages \
    --no-header-files \
    --compress=2 \
    --output /customjre

FROM alpine:3.16
WORKDIR /app
# Copy custom JRE and application
COPY --from=builder /customjre /opt/java/openjdk
COPY --from=builder /app/target/app.jar /app/app.jar
ENV PATH="/opt/java/openjdk/bin:$PATH"
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

For Spring Boot applications, leverage the layered JAR feature to optimize layer
caching:

```dockerfile
[label Dockerfile]
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY . .
RUN ./mvnw spring-boot:build-image -Dspring-boot.build-image.imageName=my-app

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Extract the layers from the builder image
COPY --from=builder /app/target/layers/dependencies/ ./
COPY --from=builder /app/target/layers/spring-boot-loader/ ./
COPY --from=builder /app/target/layers/snapshot-dependencies/ ./
COPY --from=builder /app/target/layers/application/ ./
EXPOSE 8080
CMD ["java", "org.springframework.boot.loader.JarLauncher"]
```

Modern Java frameworks like Quarkus and Micronaut also offer native compilation,
which can reduce both image size and startup time:

```dockerfile
[label Dockerfile]
FROM quay.io/quarkus/ubi-quarkus-mandrel:21.3-java17 AS builder
WORKDIR /app
COPY . .
RUN ./mvnw package -Pnative

FROM quay.io/quarkus/quarkus-micro-image:1.0
WORKDIR /app
COPY --from=builder /app/target/*-runner /app/application
RUN chmod 775 /app
EXPOSE 8080
CMD ["./application", "-Dquarkus.http.host=0.0.0.0"]
```

These native images start in milliseconds and can be as small as 20-50MB, a
dramatic improvement over traditional Java applications.

### Go optimizations

Go is already well-suited for containerization due to its ability to create
static binaries that don't require runtime dependencies. To create minimal Go
Docker images, leverage multi-stage builds with the `scratch` or `distroless`
base image:

```dockerfile
[label Dockerfile]
FROM golang:1.24-alpine AS builder
WORKDIR /app
# Copy go.mod and go.sum first for better caching
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# Build a static binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

FROM scratch
WORKDIR /app
# Copy only the binary
COPY --from=builder /app/app .
EXPOSE 8080
CMD ["./app"]
```

The `scratch` image contains absolutely nothing—not even a shell or basic
utilities. This results in extremely small images (often just a few MB) but
makes debugging more challenging.

For more complex Go applications, consider these additional optimizations:

```dockerfile
[label Dockerfile]
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# Build with additional flags to reduce size
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags="-s -w" -o app .

FROM scratch
WORKDIR /app
# Copy CA certificates for HTTPS
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
# Copy the binary
COPY --from=builder /app/app .
EXPOSE 8080
CMD ["./app"]
```

For applications requiring more functionality, the distroless image provides a
middle ground:

```dockerfile
[label Dockerfile]
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

FROM gcr.io/distroless/static
WORKDIR /app
COPY --from=builder /app/app .
EXPOSE 8080
CMD ["./app"]
```

### PHP optimizations

PHP applications can be challenging to optimize due to their reliance on the web
server and runtime environment. However, several techniques can significantly
reduce PHP Docker image sizes.

First, use the official PHP Alpine images as a base and install only necessary
extensions:

```dockerfile
[Dockerfile - PHP Alpine Base]
FROM php:8.1-fpm-alpine
WORKDIR /var/www/html

# Install only required extensions
RUN apk add --no-cache \
    libpng-dev \
    libzip-dev \
    && docker-php-ext-install \
    pdo_mysql \
    gd \
    zip \
    && apk del libpng-dev libzip-dev

COPY . .
```

For applications using Composer, implement multi-stage builds to avoid including
the Composer binary and development dependencies in the final image:

```dockerfile
[Dockerfile - PHP Composer Optimization]
FROM composer:2.3 AS composer
WORKDIR /app
COPY composer.json composer.lock ./
# Install dependencies and optimize autoloader
RUN composer install --no-scripts --no-dev --optimize-autoloader

FROM php:8.1-fpm-alpine
WORKDIR /var/www/html
# Install production extensions
RUN apk add --no-cache \
    libpng \
    libjpeg \
    freetype \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) pdo_mysql gd

# Copy only the vendor directory from the composer stage
COPY --from=composer /app/vendor ./vendor
# Copy application code
COPY . .

# Cleanup
RUN rm -rf /tmp/* /var/cache/apk/*
```

For Laravel applications, you can further optimize by extracting only the
necessary parts of the framework:

```dockerfile
[label Dockerfile]
FROM composer:2.3 AS composer
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-dev --optimize-autoloader

FROM php:8.1-fpm-alpine AS base
WORKDIR /var/www/html
# Install required extensions
RUN apk add --no-cache libpng libjpeg freetype icu \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) pdo_mysql gd intl opcache

# Copy composer dependencies
COPY --from=composer /app/vendor ./vendor

# Copy only necessary Laravel directories
COPY app ./app
COPY bootstrap ./bootstrap
COPY config ./config
COPY database ./database
COPY public ./public
COPY resources ./resources
COPY routes ./routes
COPY storage ./storage
COPY artisan .
COPY .env.example ./.env

# Set correct permissions and optimize
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    chmod -R 775 storage bootstrap/cache

# Configure opcache for production
RUN { \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=4000'; \
    echo 'opcache.revalidate_freq=0'; \
    echo 'opcache.fast_shutdown=1'; \
    echo 'opcache.enable_cli=1'; \
    } > /usr/local/etc/php/conf.d/opcache-recommended.ini

EXPOSE 9000
CMD ["php-fpm"]
```

When developing API services, you might not need a full-featured PHP
installation. Consider specialized image configurations:

```dockerfile
[label Dockerfile]
FROM php:8.1-cli-alpine
WORKDIR /app

# Install minimal extensions
RUN apk add --no-cache libpq-dev \
    && docker-php-ext-install -j$(nproc) pdo_pgsql

COPY . .
# Remove development files
RUN rm -rf tests phpunit.xml .git .github

EXPOSE 8000
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
```

## Measuring and monitoring image sizes

To optimize effectively, you need to measure your progress. Several tools can
help analyze Docker image sizes:

```bash
[terminal]
docker images my-node-app
```

```
[output]
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
my-node-app   latest    f7ca19a9d5b5   30 minutes ago  123MB
```

For more detailed analysis, you can use
[dive](https://github.com/wagoodman/dive):

```command
dive my-node-app
```

![Screenshot From 2025-03-10 08-48-03.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/06a46253-1184-41c2-99f4-f98ef7567400/public =2756x1326)

The `dive` tool provides an interactive way to explore image layers, showing
wasted space and helping identify optimization opportunities. You can see
exactly which files are added in each layer and how much space they consume.

Integrating size checks into your CI/CD pipeline can prevent image bloat over
time. For example, you might set a maximum image size and fail builds that
exceed it:

```bash
#!/bin/bash
# Check if image size exceeds limit
SIZE=$(docker images my-app:latest --format "{{.Size}}" | sed 's/MB//')
if (( $(echo "$SIZE > 200" | bc -l) )); then
  echo "Image size of ${SIZE}MB exceeds the 200MB limit"
  exit 1
fi
```

## Balancing image size with other considerations

While smaller is generally better, don't sacrifice functionality or reliability
for size. Consider these tradeoffs:

1. **Debugging capabilities** can be limited in minimal images, as they often
   lack shells and debugging tools. For production environments, you might need
   to implement alternative logging and monitoring strategies.

2. **Build time** might increase with complex multi-stage builds or extensive
   optimization steps. Evaluate whether the longer build times are worth the
   size reduction, especially in development environments.

3. **Maintenance** can become more complex with highly optimized Dockerfiles.
   Ensure your team understands the optimization techniques used and document
   the rationale behind them.

4. **Compatibility issues** may arise with minimal environments, particularly
   with dependencies that have native components or specific OS requirements.
   Always test thoroughly after implementing size optimizations.

For many teams, a pragmatic approach is to start with a solid multi-stage build
pattern, use Alpine or slim variants where compatible, implement basic cleanup
steps, and measure the results and optimize further if needed.

## Final thoughts

Reducing Docker image sizes is both an art and a science. By selecting
appropriate base images, leveraging multi-stage builds, properly ordering your
Dockerfile instructions, and implementing language-specific optimizations, you
can significantly reduce image sizes without sacrificing functionality.

Remember these key principles: choose the smallest base image that meets your
needs, use multi-stage builds to separate build and runtime environments, order
instructions to maximize cache utilization, clean up temporary files in the same
layer they're created, use `.dockerignore` to exclude unnecessary files,
implement language-specific optimizations, and measure and monitor your
progress.

Following these practices will lead to faster deployments, reduced costs, and
improved security—a win for both development teams and production environments.