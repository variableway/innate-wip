# Containerizing Laravel Applications with Docker

[Docker](https://www.docker.com/) empowers developers to encapsulate their
applications and dependencies into self-contained images, ensuring seamless
deployment across diverse environments, and thus freeing you from infrastructure
concerns.

The process involves writing a `Dockerfile`, building a Docker image, and then
running it as a container. This guide specifically focuses on preparing Docker
images for Laravel applications in development and production contexts.

By the end, you'll possess the knowledge to run Laravel applications confidently
within containers either locally or on your chosen deployment platform.

Let's get started!

[ad-uptime]

## Prerequisites

- Prior PHP and Laravel development experience.
- Familiarity with the Linux command-line.
- Access to a Linux machine with
  [Docker Engine](https://docs.docker.com/engine/install/) installed.
- [Composer](https://getcomposer.org/) installed locally.

## Step 1 — Setting up the demo project

To demonstrate Laravel application development and deployment with Docker, I'll
assume you already have a Laravel application ready. If not, you can clone the
[Laravel Blog application](https://github.com/betterstack-community/laravel-blog)
prepared for this demonstration. It's a simple
[CRUD application](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)
that persists created posts to a MySQL database.

![Blog post demo](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3f66e7c6-0901-40c4-5b5c-fcdde93b3600/public =2055x1043)

Our goal is to containerize this Laravel application using Docker, making it
easily deployable in various environments.

Execute the command below to clone the application from GitHub:

```command
git clone https://github.com/betterstack-community/laravel-blog
```

Then navigate into the project directory and install its dependencies:

```command
cd laravel-blog
composer install
```

Copy the example environment file and generate the application key:

```command
cp .env.example .env
php artisan key:generate
```

Before we can test the application, let's set up a MySQL database through the
[official MySQL Docker image](https://hub.docker.com/_/mysql). Without an active
MySQL instance, the blogging application will fail to work.

Open a separate terminal and run the command below to launch a MySQL container:

```command
docker run \
  --rm \
  --name laravel-blog-db \
  --env POSTGRES_PASSWORD=admin \
  --env POSTGRES_DB=laravel_blog \
  --volume pg-data:/var/lib/postgresql/data \
  --publish 5432:5432 \
  postgres:bookworm
```

This command sets up a PostgreSQL container named `laravel-blog-db`, removes it
upon stopping (`--rm`), and maps port 3306 to your host machine. It also sets
the default database name to `laravel_blog` and creates a password (`admin`) for
the default `postgres` user.

Update your `.env` file with these database credentials:

```text
[label .env]
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=laravel_blog
DB_USERNAME=postgres
DB_PASSWORD=admin
```

Run the database migrations and seed the database with sample data:

```command
php artisan migrate --seed
```

Install and build the frontend assets:

```command
npm install
npm run build
```

Finally, start the Laravel development server:

```command
php artisan serve
```

Visit `http://localhost:8000` in your browser, and you should see the blog
application running:

![Application homepage showing blog posts](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ade30cd6-96c7-419b-93fd-fd389768f600/public =1595x329)

You can create, edit, and delete posts to test the application's functionality.
Each post has a title and content, with timestamps for creation and updates. The
application uses Tailwind CSS for styling and includes proper validation and
error handling.

![3.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2b937bab-70e5-4243-8b0b-ee2a579f6100/public =1489x825)

![4.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e4195a08-2f23-4594-228a-82334b2c9100/lg1x =1362x626)

Now that you've confirmed the functionality of your Laravel application, let's
proceed to the next step where you'll create a `Dockerfile` for the project.

## Step 2 — Writing a Dockerfile for your Laravel app

Before you can build a Docker image for your Laravel application, you need to
create a [Dockerfile](https://docs.docker.com/engine/reference/builder/). This
text file guides the Docker engine through the process of assembling the image
that will encapsulate your application and its runtime environment.

Here's the `Dockerfile` for our blog application:

```Dockerfile
# Use PHP 8.2 FPM Debian as base image
FROM php:8.2-fpm-bookworm AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
   git \
   curl \
   libpng-dev \
   libonig-dev \
   libxml2-dev \
   zip \
   unzip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Set permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Document that Laravel runs on port 9000 by default
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
```

Let's break down this Dockerfile line by line:

```Dockerfile
FROM php:8.2-fpm-bookworm AS base
```

We're using the official PHP-FPM 8.2 image based on Debian Bookworm. PHP-FPM
(FastCGI Process Manager) is particularly well-suited for web applications like
Laravel, offering better performance than traditional CGI-based solutions.

While Alpine Linux is a popular choice for containerized applications due to its
small size, we're using Debian for better compatibility and stability. Alpine's
musl libc can sometimes cause unexpected issues with PHP extensions and Laravel
dependencies.

```Dockerfile
RUN apt-get update && apt-get install -y \
   git \
   curl \
   libpng-dev \
   libonig-dev \
   libxml2-dev \
   zip \
   unzip
```

This installs necessary system dependencies:

- `git` for version control and some Composer operations
- `curl` for downloading files
- `libpng-dev` for GD image manipulation
- `libonig-dev` for multibyte string support
- `libxml2-dev` for XML handling
- `zip` and `unzip` for Composer package management

```Dockerfile
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd
```

This installs required PHP extensions:

- `pdo_mysql` for MySQL database connectivity
- `mbstring` for multibyte string support
- `exif` for image metadata handling
- `pcntl` for process control
- `bcmath` for arbitrary precision mathematics
- `gd` for image processing

```Dockerfile
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
```

This copies the Composer binary from the official Composer image, enabling
dependency management within our container.

```Dockerfile
WORKDIR /var/www
```

Sets the working directory to `/var/www`, which is the conventional location for
web applications in Debian-based systems.

```Dockerfile
COPY . .
```

Copies all files from your local project directory into the container's
`/var/www` directory.

```Dockerfile
RUN composer install --no-interaction --optimize-autoloader --no-dev
```

Installs production dependencies while:

- Skipping development dependencies with `--no-dev`
- Optimizing the autoloader with `--optimize-autoloader`
- Preventing interactive questions with `--no-interaction`

```Dockerfile
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
```

Sets proper ownership for Laravel's writable directories, ensuring the web
server can write to them.

```Dockerfile
EXPOSE 9000
```

Documents that PHP-FPM listens on port 9000. This port will need to be bound to
a web server like Nginx.

```Dockerfile
CMD ["php-fpm"]
```

Starts PHP-FPM when the container launches.

This `Dockerfile` creates a production-ready image for your Laravel application.
However, we'll need to pair it with a web server like Nginx to handle HTTP
requests, which we'll cover in the next section.

## Step 3 — Building the Docker image

With your `Dockerfile` ready, it's time to build the Docker image. However,
let's create a `.dockerignore` file in your project's root directory first. This
file instructs Docker to exclude specified files and directories from the build
context:

```text
[label .dockerignore]
/.git
/.idea
/.vscode
/node_modules
/public/hot
/public/storage
/storage/*.key
/vendor
.env
.env.backup
.phpunit.result.cache
docker-compose.override.yml
Homestead.json
Homestead.yaml
npm-debug.log
yarn-error.log
*.log
.gitignore
.gitattributes
```

Now, build the Docker image by executing:

```command
docker build . -t laravel-blog
```

The `-t` flag assigns the name `laravel-blog` to the image. You can also add a
version tag:

```command
docker build . -t laravel-blog:1.0.0
```

Without a tag, Docker defaults to `latest`.

Verify that the new image is in your local image library:

```command
docker image ls laravel-blog
```

```text
REPOSITORY     TAG       IMAGE ID       CREATED         SIZE
laravel-blog   latest    9075f0b2ee42   6 minutes ago   512MB
```

## Step 4 — Launching the services with Docker Compose

Before launching a container, stop any running Laravel development server and
PostgreSQL containers. We'll recreate our setup with Docker Compose to manage
all services together.

Create a new file called `compose.yaml`:

```yaml
[label compose.yaml]
services:
 app:
   build:
     context: .
     target: base
   container_name: laravel-blog-app
   restart: unless-stopped
   volumes:
     - ./:/var/www
     - ./php/local.ini:/usr/local/etc/php/conf.d/local.ini

 nginx:
   image: nginx:alpine
   container_name: laravel-blog-nginx
   restart: unless-stopped
   ports:
     - "8000:80"
   volumes:
     - ./:/var/www
     - ./nginx/conf.d/:/etc/nginx/conf.d/

 db:
   image: postgres:bookworm
   container_name: laravel-blog-db
   restart: unless-stopped
   environment:
     POSTGRES_DB: ${DB_DATABASE}
     POSTGRES_PASSWORD: ${DB_PASSWORD}
   volumes:
     - dbdata:/var/lib/mysql

volumes:
 dbdata:
```

Create the necessary configuration files. First, make a directory for Nginx
configuration:

```command
mkdir -p nginx/conf.d
```

Create `nginx/conf.d/app.conf`:

```nginx
[label nginx/conf.d/app.conf]
server {
   listen 80;
   index index.php index.html;
   error_log  /var/log/nginx/error.log;
   access_log /var/log/nginx/access.log;
   root /var/www/public;

   location ~ \.php$ {
       try_files $uri =404;
       fastcgi_split_path_info ^(.+\.php)(/.+)$;
       fastcgi_pass app:9000;
       fastcgi_index index.php;
       include fastcgi_params;
       fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
       fastcgi_param PATH_INFO $fastcgi_path_info;
   }

   location / {
       try_files $uri $uri/ /index.php?$query_string;
       gzip_static on;
   }
}
```

Create a directory for PHP configuration:

```command
mkdir php
```

Create `php/local.ini`:

```ini
[label php/local.ini]
upload_max_filesize=40M
post_max_size=40M
```

Update your `.env` file to use the container names for services:

```env
[label .env]
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel_blog
DB_USERNAME=laravel
DB_PASSWORD=secret
```

Now you can start all services using Docker Compose:

```command
docker compose up -d
```

Run the migrations and seed the database:

```command
docker compose exec app php artisan migrate --seed
```

![5.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b02feff5-746b-48b9-4901-3d9382674700/orig =3182x1352)

Visit `http://localhost:8000` to see your containerized Laravel application in
action.

![Blog post demo](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3f66e7c6-0901-40c4-5b5c-fcdde93b3600/public =2055x1043)

## Final thoughts

You now have a complete Docker setup for Laravel that supports both development
and production environments. This configuration provides:

- Isolated development environment
- Easy onboarding for new team members
- Consistent deployment across different platforms
- Efficient development workflow with hot reloading
- Production-ready configuration with optimizations

Consider exploring:

- [Laravel Sail](https://laravel.com/docs/sail) for official Docker development
  environment
- [Docker Swarm](https://docs.docker.com/engine/swarm/) or
  [Kubernetes](https://kubernetes.io/) for orchestration
- [GitHub Actions](https://github.com/features/actions) or
  [GitLab CI](https://docs.gitlab.com/ee/ci/) for automated builds
- [Laravel Horizon](https://laravel.com/docs/horizon) for queue monitoring
- [Laravel Telescope](https://laravel.com/docs/telescope) for debugging

The complete source code for this tutorial is available on GitHub at
[laravel-blog](https://github.com/betterstack-community/laravel-blog).