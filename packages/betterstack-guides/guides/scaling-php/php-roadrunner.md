# Scaling PHP Applications with RoadRunner

In the PHP world, a traditional setup for running PHP applications in production
usually involves a web server (such as NGINX or Caddy) and a process manager
(such as PHP-FPM) that integrates with the web server over FastCGI to process
incoming requests.

Although available as an option, application servers are less widespread and not
that commonly used (at least not yet). This is likely because they employ a
slightly different approach to bootstrapping and request handling compared to
more traditional setups.

With PHP-FPM, each request is routed for processing to an FPM worker by the FPM
master process. Each FPM worker then bootstraps the PHP environment required for
executing the corresponding PHP code, after which that environment is destroyed
(memory is freed up, and internal PHP structures are deallocated).

This repeats for each subsequent request, and while mechanisms such as the
[PHP OPcache](https://www.php.net/manual/en/book.opcache.php) and
[APCu](https://www.php.net/manual/en/book.apcu.php) allow you to (broadly
speaking) retain certain parts of your execution environment for reuse across
multiple FPM workers and requests, you still cannot eliminate the bootstrapping
phase in its entirety.

Application servers like [RoadRunner](https://roadrunner.dev/) provide an
alternative by utilizing long-lived PHP processes that can handle multiple
requests without the need to constantly bootstrap new execution environments.
This can significantly reduce overhead and improve the performance of PHP
applications experiencing high traffic volumes.

The following tutorial will demonstrate exactly how this works by guiding you
through the development of a small and simple PHP application running on
RoadRunner that interacts with a couple of third-party services over the
network. In the process, you'll learn how to set up RoadRunner for local
development, how it operates internally, and how PHP applications can
effectively integrate with it to take advantage of its performance benefits.

Let's get started!

[ad-uptime]

## Prerequisites

- Prior PHP development experience.
- Familiarity with NGINX + PHP-FPM setups.
- Good familiarity with the Docker CLI.
- A recent version of [Docker](https://docs.docker.com/engine/install/)
  installed on your system (this tutorial uses Docker version 26.0.0).
- Knowing how to create custom Docker images for your PHP applications (see
  [Building Production-Ready Docker Images for PHP Apps](https://betterstack.com/community/guides/scaling-php/php-docker-images/)).

## Preparing your local environment

There are many ways to run RoadRunner locally. I generally prefer to keep my
local machine as clean and organized as possible, so I rely mostly on Docker for
PHP development.

Docker containers allow you to spin up and tear down different development
environments without cluttering your local system with unnecessary software
packages. This also ensures that your development environment remains consistent
across different machines and operating systems.

Therefore, this section will guide you through setting up a local environment
for developing RoadRunner applications based on Docker.

### Building a custom Docker image

To begin with, you need to prepare a custom Docker image that meets your
requirements. At the very least, this image has to include the
[PHP CLI](https://www.php.net/) for executing PHP code,
[Composer](https://getcomposer.org/) for installing third-party packages, and
[RoadRunner](https://roadrunner.dev/) for serving your application.

Choosing a suitable PHP base image to use as a starting point was covered in
great detail in [one of our previous tutorials](https://betterstack.com/community/guides/scaling-php/php-docker-images/). You can
refer back to that tutorial for more in-depth information on the topic, but for
local development in particular, you may want to choose one of the more
comprehensive Linux distributions of the
[official PHP image](https://hub.docker.com/_/php) (such as Debian `bullseye` or
`bookworm`) instead of Alpine, as these distributions come with a broader range
of tools and packages that may come in handy while prototyping your application
locally.

At the time of this writing, the latest stable PHP version is `8.3.4`, and the
latest Debian variant of its official Docker image is `bookworm`. Since you'll
be using RoadRunner as the application server instead of Apache or NGINX, you
won't need anything else included in the base image besides the PHP interpreter
itself.

The base image that covers all of these requirements at the time of this writing
is `php:8.3.4-cli-bookworm`:

![PHP base image on Docker Hub](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/dc93bb1c-06f6-437b-0f46-f76190aad500/lg2x =934x576)

Create a new `Dockerfile` and populate it with the following contents:

```text
[label Dockerfile]
FROM php:8.3.4-cli-bookworm
```

Using `php:8.3.4-cli-bookworm` as the base image ensures that the `php` binary
is available in your Docker container; however, you also need to bring in
`composer` and `rr`. As Composer and RoadRunner both have official Docker
images, you can add their compiled binaries to your image by using
[Docker multi-stage builds](https://docs.docker.com/build/building/multi-stage/).

The [official Composer image](https://hub.docker.com/_/composer) is hosted on
Docker Hub, and its latest stable version at the time of this writing is
`2.7.2`:

![Official Composer image on Docker Hub](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/138acf68-b537-4032-24f6-6ab7ba1e4000/md1x =716x775)

You can add the `composer` binary from the `composer:2.7.2` image to your custom
Docker image using a multi-stage build by adding the following instructions to
your `Dockerfile`:

```text
[label Dockerfile]
[highlight]
FROM composer:2.7.2 AS composer
[/highlight]
FROM php:8.3.4-cli-bookworm

[highlight]
COPY --from=composer /usr/bin/composer /usr/bin/composer
[/highlight]
```

The
[official RoadRunner image](https://github.com/roadrunner-server/roadrunner/pkgs/container/roadrunner)
is hosted on the GitHub container registry of the
[roadrunner-server](https://github.com/roadrunner-server) project. The latest
stable version at the time of this writing is `2023.3.12`:

![Official RoadRunner image on GHCR](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4fc87b1a-657c-49a4-921d-792d032b6100/md2x =755x809)

You can add the `rr` binary from the `roadrunner:2023.3.12` image to your custom
Docker image using a multi-stage build by adding the following instructions to
your `Dockerfile`:

```text
[label Dockerfile]
FROM composer:2.7.2 AS composer
[highlight]
FROM ghcr.io/roadrunner-server/roadrunner:2023.3.12 AS roadrunner
[/highlight]
FROM php:8.3.4-cli-bookworm

COPY --from=composer /usr/bin/composer /usr/bin/composer
[highlight]
COPY --from=roadrunner /usr/bin/rr /usr/local/bin/rr
[/highlight]
```

One last thing to consider is adding the `unzip` command to your image. It's
listed as an official requirement on the Composer website, and without its
presence, Composer will fail to install packages with a similar error:

```text
Failed to download <package-name> from dist: The zip extension and unzip/7z commands are both missing, skipping.
```

To add the `unzip` command, update your `Dockerfile` as follows:

```text
[label Dockerfile]
FROM composer:2.7.2 AS composer
FROM ghcr.io/roadrunner-server/roadrunner:2023.3.12 AS roadrunner
FROM php:8.3.4-cli-bookworm

COPY --from=composer /usr/bin/composer /usr/bin/composer
COPY --from=roadrunner /usr/bin/rr /usr/local/bin/rr

[highlight]
RUN set -eux; \
	apt-get update; \
	apt-get install -y --no-install-recommends unzip; \
	rm -rf /var/lib/apt/lists/*
[/highlight]
```

With these final adjustments, you have everything necessary to build the first
version of your development image. You can name this image `rr-dev-env` (short
for "**R**oad**R**unner **Dev**elopment **Env**ironment") and give it a version
identifier (e.g., `0.1.0`).

Run the following command to build the image:

```command
docker build -t rr-dev-env:0.1.0 .
```

### Setting up shell aliases

Now that the image is ready, it might not be immediately obvious how to
incorporate it into your local development workflow. Let's take a step back to
consider how you can utilize it.

When working on a PHP project, things such as installing dependencies, running
tests, interacting with the application server, etc., usually require you to
launch a shell inside your main project directory to run various `php`,
`composer`, and `rr` commands from the terminal.

For this to work, you usually need to have all of these binaries installed
directly on your local system using either the default package manager or by
downloading and installing them manually following their official installation
instructions.

Rather than going through all of this, you can emulate the same experience with
shell aliases that use your custom Docker image behind the scenes. Shell aliases
are shortcuts that allow you to run complex commands with a simple keyword. By
setting up aliases for `php`, `composer`, and `rr` running inside a Docker
container launched from your custom image, you can streamline your development
workflow and avoid the need to install any of these binaries directly on your
system.

For this to work correctly, each alias invocation needs to launch a new
interactive Docker container (with your project directory mounted as a volume)
and execute the desired command within that container. In this process, you need
to ensure that the command runs with the same privileges as your Linux user so
that file permissions and ownership are maintained correctly across your
project.

The Docker container can be a short-lived one that gets automatically removed
after the given command is executed. This will ensure a clean and isolated
environment for each subsequent task.

Last but not least, any necessary ports should be published, so that you can use
`localhost` to access the application server running inside the container.

The following `docker` command fulfills these requirements:

```command
docker run --rm -it -v ./:/app -w /app -u $(id -u):$(id -g) -p 8080:80 rr-dev-env:0.1.0 <COMMAND>
```

Here's a breakdown of its contents:

- `docker run` tells the Docker Engine to start a new container from the
  provided image.
- `--rm` ensures the container is automatically removed after the command
  finishes executing.
- `-it` ensures you can provide interactive input to the specified command.
- `-v ./:app` mounts your project directory as `/app` inside the container.
- `-w /app` marks `/app` as the default working directory inside the container.
- `-u $(id -u):$(id -g)` ensures that the specified command runs with the same
  user and group permissions as your Linux user.
- `-p 8080:80` ensures that you can use `localhost:8080` to access the
  application server listening on port `80` inside the container.
- `rr-dev-env:0.1.0` specifies the name of the image that your container should
  be started from (corresponding to the custom image you created earlier).
- `<COMMAND>` acts as a placeholder for the actual command you want to run
  inside the container.

Depending on the exact shell environment that you're using, you can specify your
aliases in `.bashrc`, `.zshrc`, or any other relevant shell configuration file.
This will make them persistent across sessions and ensure that they are
available every time you open up a new terminal.

Most Linux distributions come with Bash as the default shell, pre-configured to
allow storing your custom shell aliases in a file called `.bash_aliases` located
in your home directory.

Go ahead and create that file unless it already exists:

```command
touch ~/.bash_aliases
```

Then add the following aliases to the file:

```bash
[label ~/.bash_aliases]
alias rr-dev-env="docker run --rm -it -v ./:/app -w /app -u $(id -u):$(id -g) -p 8080:80 rr-dev-env:0.1.0"
alias composer="rr-dev-env composer --no-cache"
alias php="rr-dev-env php"
alias rr="rr-dev-env rr"
```

The `rr-dev-env` alias outlines the main `docker` command that the other three
aliases will expand upon. The `composer`, `php`, and `rr` aliases narrow that
command down to the specific binary to be executed inside the container. The
`composer` alias intentionally includes the `--no-cache` flag to prevent
unnecessary warnings from being displayed during package installation.

You have to either restart your shell session or source the `.bash_aliases` file
for the aliases to take effect:

```command
source ~/.bash_aliases
```

After you do that, go ahead and try them out:

```command
php --version
```

```text
[output]
PHP 8.3.4 (cli) (built: Mar 15 2024 23:59:35) (NTS)
Copyright (c) The PHP Group
Zend Engine v4.3.4, Copyright (c) Zend Technologies
```

```command
composer --version
```

```text
[output]
Composer version 2.7.2 2024-03-11 17:12:18
PHP version 8.3.4 (/usr/local/bin/php)
Run the "diagnose" command to get more detailed diagnostics output.
```

```command
rr --version
```

```text
[output]
rr version 2023.3.12 (build time: 2024-02-29T18:24:06+0000, go1.22.0), OS: linux, arch: amd64
```

It works! You're now ready to start using RoadRunner for local development.

## Initializing your application

It's time to see RoadRunner in action by creating a small PHP application that
makes use of its ability to persist the application state across multiple client
requests. But before we actually launch this application with RoadRunner, let's
first make sure it can process requests and generate responses by setting up its
basic structure and functionality.

Create a new directory for the project and `cd` into it:

```command
mkdir roadrunner-tutorial
cd roadrunner-tutorial
```

Initialize the project using Composer:

```command
composer init
```

An interactive prompt appears, asking you to specify a package name for your
application:

![composer init start](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9c7e4125-8cf0-46ef-29ed-3f4467448000/public =958x252)

You can name the package `demo/project` and stick mostly to the default options
for the remaining prompts. Feel free to omit the author specification, describe
your package type as a `project`, and postpone the specification of
dependencies.

The complete interaction could look like this:

![composer init end](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b973f69e-ec00-496c-e7ce-fc75e4e02b00/lg2x =994x803)

As a result, your project directory gets the following contents:

```command
ls -l
```

```text
[output]
total 12
-rw-r--r-- 1 marin marin  165 Apr  8 10:07 composer.json
drwxr-xr-x 2 marin marin 4096 Apr  8 10:07 src
drwxr-xr-x 3 marin marin 4096 Apr  8 10:07 vendor
```

With a `composer.json` file initialized, you can now focus on putting the
application together.

Naturally, every PHP web application needs a "front controller". This file
serves as the main entry point to the application, receiving all incoming
requests from the web server, routing them for processing to the appropriate
actions within the application, and finally emitting the corresponding response.

Popular frameworks such as [Symfony](https://symfony.com/) and
[Laravel](https://laravel.com/) place their front controllers in
`./public/index.php`, so you can use the same approach.

Make a new directory named `public`:

```command
mkdir public
```

Then create a new file named `index.php` inside that directory:

```command
touch public/index.php
```

Your project takes the following shape:

```command
tree -L 2
```

```text
[output]
.
├── composer.json
├── public
│   └── index.php
├── src
└── vendor
    ├── autoload.php
    └── composer
```

Begin setting up the basic structure of your front controller file by including
the Composer autoloader. This will ensure that all necessary application classes
and third-party packages will be loaded into your project when needed.

Populate your `index.php` with the following contents:

```php
[label public/index.php]
<?php

require __DIR__ . '/../vendor/autoload.php';
```

Now is a good time to work on the application kernel. In an effort to keep this
application as small and simple as possible, its kernel will act as a basic
request handler, implementing the [PSR-15](https://www.php-fig.org/psr/psr-15/)
`RequestHandlerInterface`. To satisfy this interface, the kernel has to be able
to construct objects conforming to the
[PSR-7](https://www.php-fig.org/psr/psr-7/) `ResponseInterface`.

This calls for the installation of some Composer packages:

- [psr/http-server-handler](https://packagist.org/packages/psr/http-server-handler):
  provides PSR-15 and PSR-7 interfaces that you can code against.
- [nyholm/psr7](https://packagist.org/packages/nyholm/psr7): provides a
  lightweight implementation for building valid `Response` objects compatible
  with PSR-7.

Go ahead and install these packages by running:

```command
composer require psr/http-server-handler nyholm/psr7
```

![composer require psr/http-server-handler nyholm/psr7](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/317ff291-a953-49a6-a89b-58f51b44e200/md2x =954x635)

Create a new file named `Application.php` in your `src` folder:

```command
touch src/Application.php
```

Populate your `Application.php` file with the following contents:

```php
[label src/Application.php]
<?php

namespace Demo\Project;

use Nyholm\Psr7\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class Application implements RequestHandlerInterface
{
    #[\Override] public function handle(ServerRequestInterface $request): ResponseInterface
    {
        return new Response(body: "Hello, world!");
    }
}
```

The `Application` class will take in any provided request and respond with a
simple "Hello, world!" string. This is a good start.

You now need to hook the application kernel to the front controller. To do this,
you must determine how the front controller can construct objects that satisfy
the `ServerRequestInterface`. Otherwise, it won't be able to invoke the `handle`
method on the `Application`.

As you know, the PHP engine exposes raw request information through its built-in
[superglobal variables](https://www.php.net/manual/en/language.variables.superglobals.php).
Utilizing these superglobals, you can easily build a valid `Request` object, but
implementing a class capable of doing this correctly yourself can prove to be
tedious and error-prone.

Therefore, let's use a readily available package such as
[nyholm/psr7-server](https://packagist.org/packages/nyholm/psr7-server) which
already provides the desired functionality.

Go ahead and add it to your project:

```command
composer require nyholm/psr7-server
```

![composer require nyholm/psr7-server](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ee128f99-6db4-4871-a38d-11c4975bc800/public =958x458)

Open up your front controller and add the following lines:

```php
[label public/index.php]
<?php

require __DIR__ . '/../vendor/autoload.php';

[highlight]
// initialize Application kernel
$app = new \Demo\Project\Application();

// create Request object
$psr17Factory = new \Nyholm\Psr7\Factory\Psr17Factory();
$creator = new \Nyholm\Psr7Server\ServerRequestCreator($psr17Factory, $psr17Factory, $psr17Factory, $psr17Factory);
$request = $creator->fromGlobals();

// pass Request object to Application kernel
$response = $app->handle($request);
[/highlight]
```

The code above initializes the `Application` kernel, creates a `Request` object
using the `ServerRequestCreator` class from the `nyholm/psr7-server` package,
and finally passes the `Request` for processing to the `Application` kernel.

As a result, the `Application` produces a `Response` object containing
information about the headers and body that will be sent out to the client.

You can either write the code to emit the response yourself or better yet, use
an existing package that contains the desired functionality. This is where the
[laminas/laminas-httphandlerrunner](https://packagist.org/packages/laminas/laminas-httphandlerrunner)
package can come in handy. It provides a `SapiEmitter` class that can take in
`Response` objects and emit the corresponding response body and headers using
the PHP SAPI.

Add this package to your project:

```command
composer require laminas/laminas-httphandlerrunner
```

![composer require laminas/laminas-httphandlerrunner](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/205f379a-c03a-4e81-9641-b67aae565800/md2x =958x459)

Then modify your front controller one last time as follows:

```php
[label public/index.php]
<?php

require __DIR__ . '/../vendor/autoload.php';

// initialize Application kernel
$app = new \Demo\Project\Application();

// create Request object
$psr17Factory = new \Nyholm\Psr7\Factory\Psr17Factory();
$creator = new \Nyholm\Psr7Server\ServerRequestCreator($psr17Factory, $psr17Factory, $psr17Factory, $psr17Factory);
$request = $creator->fromGlobals();

// pass Request object to Application kernel
$response = $app->handle($request);

[highlight]
// emit Response
$emitter = new \Laminas\HttpHandlerRunner\Emitter\SapiEmitter();
$emitter->emit($response);
[/highlight]
```

With that, the application is ready for a test run. Start a new PHP development
server with:

```command
php -S 0.0.0.0:80 public/index.php
```

```text
[output]
[Wed Apr  8 07:20:18 2024] PHP 8.3.4 Development Server (http://0.0.0.0:80) started
```

Open up `localhost:8080` in your browser to see the "Hello, world!" message:

!["Hello, world!" page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fa9a5e06-cc71-435b-516b-aaa97b03d400/public =959x197)

The application is up and running!

However, it's currently using the PHP development server, which works as a
standard web server (in the sense that your `index.php` file processes regular
HTTP requests parsed by the PHP SAPI).

In the next section, you'll work on launching this application with RoadRunner.

## Starting up RoadRunner

Starting the RoadRunner server is done by executing the following command:

```command
rr serve
```

However, issuing this command right now will yield an error:

```text
[output]
handle_serve_command: open /app/.rr.yaml: no such file or directory
```

That's because a RoadRunner configuration file is missing from your project. By
default, RoadRunner expects an `.rr.yaml` file to be provided at the root of the
project directory.

Go ahead and create one:

```command
touch .rr.yaml
```

Then populate it with the following contents:

```yaml
[label .rr.yaml]
version: "3"

server:
  command: "php public/index.php"

http:
  address: 0.0.0.0:80
```

- `version` specifies the schema of the configuration file.
- `server` activates the
  [Server plugin](https://docs.roadrunner.dev/plugins/server). The Server plugin
  regulates how worker pools are created. It expects you to define a `command`
  that each worker in the pool executes. In this particular case, the command is
  `php public/index.php`, which means that each worker will initiate a copy of
  your front controller (in the form of a long-running PHP process) for handling
  incoming requests.
- `http` activates the [HTTP plugin](https://docs.roadrunner.dev/http/http).
  During initialization, the HTTP plugin asks the Server plugin to create a new
  worker pool for handling HTTP requests. After that, it starts an HTTP server
  that listens for incoming connections at the provided `address` (`0.0.0.0:80`
  here means that the HTTP server will bind to port `80` on all available
  interfaces). Each incoming request is then forwarded to a worker for
  processing and generating a response.

Here, it's important to note that each worker is a goroutine (think lightweight
thread) running within the scope of the main RoadRunner process. Each worker
goroutine initiates its own dedicated PHP process (a separate Linux process) and
crosses the RoadRunner process boundary by exchanging messages with that
particular PHP process.

This is best illustrated with a diagram:

![RoadRunner architecture diagram](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b4d3ea60-81aa-4ce8-a248-de947c35f900/md2x =850x344)

The specifics of the RoadRunner architecture bring new requirements to your
front controller. You are no longer working with raw HTTP requests understood by
the PHP SAPI. RoadRunner uses the
[Goridge](https://github.com/roadrunner-server/goridge) protocol for
communication.

When a new HTTP request arrives at the server, RoadRunner selects one of the
available workers to handle it. The worker converts the request to a Goridge
message and passes it to its dedicated PHP process (which is running your front
controller code) for execution. The front controller process is then expected to
respond with another Goridge message, containing everything necessary for
RoadRunner to construct a valid HTTP response. Once the worker receives the
Goridge message, it converts it back to HTTP response data and lets the server
send it back to the client.

The main problem here is that the PHP CLI SAPI doesn't speak Goridge natively
and cannot populate its superglobals with the HTTP request data sent through the
Goridge message. This means that constructing `Request` objects from
superglobals in the front controller is no longer possible (and that's exactly
what the `ServerRequestCreator` that you used earlier relies on).

Using the `SapiEmitter` to transmit responses is also no longer possible, as it
is practically oblivious to the Goridge format and relies entirely on the PHP
SAPI to transmit HTTP response data.

Try rerunning the command from earlier:

```command
rr serve
```

It fails again, but this time with the following error:

```text
[output]
handle_serve_command: Function call error:
        serve error from the plugin *http.Plugin stopping execution, error: static_pool_allocate_workers: WorkerAllocate:
        goridge_frame_receive: unexpected EOF
```

That's exactly because of the front controller's inability to understand the
incoming Goridge message and respond accordingly.

It's time to adapt your application to RoadRunner.

Thankfully, the team behind RoadRunner provides several packages to aid with
this transition:

- [spiral/roadrunner-worker](https://packagist.org/packages/spiral/roadrunner-worker)
  provides everything necessary for sending and receiving Goridge messages from
  the RoadRunner worker connected to your PHP process.
- [spiral/roadrunner-http](https://packagist.org/packages/spiral/roadrunner-http)
  provides a higher level of abstraction over the `spiral/roadrunner-worker`
  package that lets you use `Request` and `Response` objects compliant with
  PSR-7 throughout your code while still being able to quickly convert them to
  and from the Gordige format as needed.

Add these packages to your project:

```command
composer require spiral/roadrunner-worker spiral/roadrunner-http
```

Contrary to what you might expect, this results in an error:

```text
[output]
Package spiral/roadrunner-worker has requirements incompatible with your PHP version, PHP extensions and Composer version:
    - spiral/roadrunner-worker v3.5.0 requires ext-sockets * but it is not present.
```

The `spiral/roadrunner-worker` package requires the
[PHP Sockets](https://www.php.net/manual/en/book.sockets.php) extension to be
present, but the Docker image you prepared earlier doesn't have it installed.

This is caused by an underlying dependency in the
[spiral/goridge](https://packagist.org/packages/spiral/goridge) package, which
implements the Goridge protocol specification. The Goridge protocol specifies
several possible
[communication methods](https://docs.roadrunner.dev/php-worker/worker#communication-methods)
between Go and PHP processes (so-called "Relays").

While the most efficient (and default) method of communication is through Unix
pipes, the protocol specifies TCP and Unix sockets as possible alternatives. To
satisfy the specification, any PHP program that integrates the Goridge library
is therefore required to have the capability of creating such sockets. Because
of this, the PHP Sockets extension is listed as a mandatory dependency, and even
though you won't use any sockets in your current application, you're still
required to install the extension.

Go back to your `Dockerfile` and modify it as follows:

```text
[label Dockerfile]
FROM composer:2.7.2 AS composer
FROM ghcr.io/roadrunner-server/roadrunner:2023.3.12 AS roadrunner
FROM php:8.3.4-cli-bookworm

COPY --from=composer /usr/bin/composer /usr/bin/composer
COPY --from=roadrunner /usr/bin/rr /usr/local/bin/rr

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends unzip; \
    rm -rf /var/lib/apt/lists/*

[highlight]
RUN docker-php-ext-install sockets
[/highlight]
```

Then build a new version for your development image:

```command
docker build -t rr-dev-env:0.2.0 .
```

Don't forget to reflect the updated version in your shell aliases:

```text
[label ~/.bash_aliases]
[highlight]
alias rr-dev-env="docker run --rm -it -v ./:/app -w /app -u $(id -u):$(id -g) -p 8080:80 rr-dev-env:0.2.0"
[/highlight]
alias composer="rr-dev-env composer --no-cache"
alias php="rr-dev-env php"
alias rr="rr-dev-env rr"
```

Source your `.bash_aliases` file or restart your shell session to apply the
changes.

```command
source ~/.bash_aliases
```

Then try rerunning the earlier command:

```command
composer require spiral/roadrunner-worker spiral/roadrunner-http
```

This time, the result is successful:

![composer require spiral/roadrunner-worker spiral/roadrunner-http](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/521119d5-da51-4e74-fcef-d3b0038cda00/md1x =989x908)

You can now proceed with adapting your front controller to the Goridge protocol.

Begin by changing the way `Request` objects are constructed. Replace the
following piece of code:

```php
[label public/index.php]
. . .
// create Request object
$psr17Factory = new \Nyholm\Psr7\Factory\Psr17Factory();
$creator = new \Nyholm\Psr7Server\ServerRequestCreator($psr17Factory, $psr17Factory, $psr17Factory, $psr17Factory);
$request = $creator->fromGlobals();
. . .
```

With the following piece of code:

```php
[label public/index.php]
// create Request object
[highlight]
$worker = \Spiral\RoadRunner\Worker::create();
[/highlight]
$psr17Factory = new \Nyholm\Psr7\Factory\Psr17Factory();
[highlight]
$creator = new \Spiral\RoadRunner\Http\PSR7Worker($worker, $psr17Factory, $psr17Factory, $psr17Factory);
$request = $creator->waitRequest();
[/highlight]
```

The `PSR7Worker` (`$creator`) waits for a Goridge message to arrive from the
RoadRunner server and constructs a PSR-7 `Request` object. The `Request` is then
passed to the `Application` kernel without any modifications:

```php
[label public/index.php]
$response = $app->handle($request);
```

Converting the `Response` to a Goridge message then requires replacing the
following code:

```php
[label public/index.php]
// emit Response
$emitter = new \Laminas\HttpHandlerRunner\Emitter\SapiEmitter();
$emitter->emit($response);
```

With the following code:

```php
[label public/index.php]
// emit Response
[highlight]
$creator->respond($response);
[/highlight]
```

Here, the `PSR7Worker` (`$creator`) assumes the additional role of a response
emitter, converting the PSR-7 `Response` object to a Goridge message, and
sending it back to the RoadRunner server.

The final code reads:

```php
[label public/index.php]
<?php

require __DIR__ . '/../vendor/autoload.php';

// initialize the Application kernel
$app = new \Demo\Project\Application();

// create Request object
$worker = \Spiral\RoadRunner\Worker::create();
$psr17Factory = new \Nyholm\Psr7\Factory\Psr17Factory();
$creator = new \Spiral\RoadRunner\Http\PSR7Worker($worker, $psr17Factory, $psr17Factory, $psr17Factory);
$request = $creator->waitRequest();

// pass Request object to the Application kernel
$response = $app->handle($request);

// emit Response
$creator->respond($response);
```

Go ahead and try starting the RoadRunner server once again:

```command
rr serve
```

This time the operation is successful:

![rr serve output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3f90aaaf-7579-47af-9151-e7d39994e000/lg2x =1263x364)

Try opening `localhost:8080`, and you should see a familiar message:

![localhost:8080](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a1a3c9c1-3b07-427e-5b90-be916d536800/md1x =956x194)

However, if you refresh the page a few times, you'll notice something odd in the
server logs:

![EventWorkerConstruct issue](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e3b3b105-6199-4fa9-6ab9-054755430d00/md1x =1252x277)

The server is constantly allocating new workers!

Recall from earlier how each worker in the RoadRunner worker pool is practically
linked to a distinct front controller instance running in a separate PHP
process. Your front controllers are therefore no longer expected to terminate
after each processed request. Instead, RoadRunner expects them to run
continuously, handling multiple requests over time.

You can achieve this by placing your request processing logic inside a while
loop.

Modify your front controller as follows:

```php
[label public/index.php]
<?php

require __DIR__ . '/../vendor/autoload.php';

// initialize the Application kernel
$app = new \Demo\Project\Application();

// create Request object
$worker = \Spiral\RoadRunner\Worker::create();
$psr17Factory = new \Nyholm\Psr7\Factory\Psr17Factory();
$creator = new \Spiral\RoadRunner\Http\PSR7Worker($worker, $psr17Factory, $psr17Factory, $psr17Factory);

[highlight]
while ($request = $creator->waitRequest()) {
    // pass the Request object to the Application kernel
    $response = $app->handle($request);

    // emit Response
    $creator->respond($response);
}
[/highlight]
```

Go ahead and restart the RoadRunner server, then refresh `localhost:8080` a
couple of times.

No matter how many requests you make this time, no additional workers are
allocated:

![no EventWorkerConstruct](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1b1bc877-cecb-40a5-5977-0b10c1c18900/orig =1260x297)

With this, your application is fully integrated with RoadRunner. Because the
front controller PHP script is now running continuously, the `Application`
object is constructed only once at the start of each individual PHP process,
which allows you to persist the application state across multiple requests.

Let's explore the advantages this brings in the following section.

## Exploring a practical use case

Now that you understand how RoadRunner works and how it achieves the persistence
of the application state between requests, let's explore a practical use case
that makes use of this feature to introduce an optimization that would otherwise
be impossible to implement with a process manager such as PHP-FPM.

Essentially, by constructing the `Application` object only once and then reusing
it, RoadRunner eliminates the application bootstrapping phase as a factor in
handling client requests. This often results in faster response times and
improved performance and can prove to be especially beneficial for high-traffic
PHP applications that require quick response times.

Stock Laravel and Symfony applications, for instance, can easily take anywhere
between 15-20 ms to boot all of their dependencies. Of course, mechanisms such
as the [PHP OPcache](https://www.php.net/manual/en/intro.opcache.php) can help
reduce this significantly, yet the boot process in real world applications is
rarely all about parsing and compiling PHP code for execution.

You're often required to perform additional tasks such as loading initial
settings from a database, performing filesystem operations, or sending network
requests to third-party APIs, and doing this repeatedly for each request
contributes to slower response times.

One could argue that all of this can be solved easily with caching, but it's
important to remember that not all data can be cached efficiently and securely,
and sometimes these additional tasks are still necessary for the application to
work correctly.

Consider a scenario where, upon startup, your application pulls sensitive
credentials from an external secrets management service such as
[Hashicorp Vault](https://www.vaultproject.io/), and then uses one of these
credentials to authenticate with a third-party feature flag management system
(such as [Flipt](https://www.flipt.io/)) to obtain the value of a specific
feature flag, which influences some behavior in the application. This scenario
may sound excessively complicated, but it's not unusual for a real world
application.

Imagine that in the application you've been working on, you want a feature flag
to control whether the "Hello, world!" greeting is displayed in its original
order or in reverse. The next few sections will walk you through the
implementation of this scenario and show you how an application server like
RoadRunner helps.

## Step 1 — Setting up the infrastructure

Implementing the presented scenario requires two infrastructure components to be
present: a secrets management service (Hashicorp Vault) and a feature flag
service (Flipt).

Both services have official images published on Docker Hub, so you can make use
of them along with [Docker Compose](https://docs.docker.com/compose/) to set up
the necessary infrastructure locally.

Go ahead and create a new file in your main project folder named `compose.yaml`:

```command
touch compose.yaml
```

Populate the file with the following contents:

```yaml
[label compose.yaml]
services:
  vault:
    container_name: vault
    image: hashicorp/vault:1.16.1
    ports:
      - 8200:8200
  flipt:
    container_name: flipt
    image: flipt/flipt:v1.39.2
    ports:
      - 8100:8080
    environment:
      - FLIPT_AUTHENTICATION_METHODS_TOKEN_ENABLED=true
```

When executed with `docker compose`, this file will create two containers named,
respectively, `vault` and `flipt` running the most recent versions of the
corresponding [hashicorp/vault](https://hub.docker.com/r/hashicorp/vault) and
[flipt/flipt](https://hub.docker.com/r/flipt/flipt) images. The web UIs of both
services will be accessible on `localhost:8200` for Vault and `localhost:8100`
for Flipt. The `flipt` container also has the
`FLIPT_AUTHENTICATION_METHODS_TOKEN_ENABLED` environment variable set to `true`
to enable the creation of static API tokens in the UI.

Start both services by executing:

```command
docker compose up -d
```

With both services up and running, it's time to perform their initial setup.

## Step 2 — Configuring Flipt

You can start with Flipt first, as it's a little easier to set up, plus you'll
need to store the API token from Flipt as an application secret in Vault.

Navigate to `localhost:8100` and select **Flags** from the menu on the left:

![Flipt homepage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/71405ad3-c062-43d7-285a-224dc704ab00/lg2x =991x466)

Click **New flag**:

![Flipt new flag button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c51c8c4e-6ce0-4bce-974c-03d310f5f300/lg1x =991x446)

Specify a **Name** (e.g. `show_reverse_greeting`) and set the type to
**Boolean**, then click **Create**:

![Flipt filled new flag form](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d89675bb-4104-4cf3-56e9-04ddb1dd1a00/md2x =991x765)

Navigate back to the **Flags** page and confirm that you're seeing the newly
created flag:

![Flipt flag list](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c5f3d9f5-ba85-4d4f-7604-c24ab46a2300/lg2x =1038x232)

To be able to read the value of that flag, your application needs to
authenticate with the Flipt server, which requires the generation of a new API
token.

From the homepage, navigate to **Settings**:

![Flipt settings](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/829afdd2-2b86-4c43-6c3e-dc7a3a37b100/md1x =913x484)

Go to **API Tokens** and click **New Token**:

![Flipt new token button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/06738b72-449c-4ce9-17fc-4d4bf96b4200/md2x =956x472)

Fill in the presented form as follows and click **Create**:

![Flipt new token form](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6ccfa60e-5a45-470f-7d72-97ee49082300/md1x =554x526)

A modal window appears, confirming the token creation.

Click the **Copy** button and store the token somewhere safe, as you'll need to
refer back to its value when configuring your application secrets in Vault.

![Flipt created token modal](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2b827f8e-50e4-4596-f588-ca2de50a8d00/lg1x =525x342)

With that, Flipt is ready for use.

## Step 3 — Configuring Vault

It's time to configure Vault next. The idea here is to generate credentials that
your app can use to pull its secrets from Vault securely. For simplicity, you
can use the most basic authentication method available, which is "Username &
Password." Bear in mind that there are more suitable authentication methods for
production environments, and "Username & Password" is only being used here for
convenience.

Upon startup, Vault generates a new root authentication token that you can use
for the initial setup. You can find the token in the logs of the `vault`
container.

Enter the following command:

```command
docker container logs vault
```

Towards the end, you'll find a similar output:

```text
[output]
. . .
The unseal key and root token are displayed below in case you want to
seal/unseal the Vault or re-authenticate.

Unseal Key: Nr0a3rQ33Dl9bmkXzbcZhviNhGuC94WNdXv600igd3c=
Root Token: hvs.xxxxxxxxxxxxxxxxxxxxxxxx

Development mode should NOT be used in production installations!
```

Copy the root token and navigate to `localhost:8200`.

You should see the Vault login page:

![Vault login page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3f96970c-9478-4807-69a4-accb0b2f4100/md1x =909x561)

Paste the root token into the **Token** field and click **Sign in**:

![Vault filled login form](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a43d57e9-7fc1-4892-714e-4076d1697c00/public =911x564)

On the homepage, you'll notice that some secret engines are already
pre-configured for use. You can store the Flipt API access token in the
key/value secret storage engine labeled `secret/`.

Click **View** on that engine:

![Vault pre-configured secret engines](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8b5ce369-634a-4a98-79cd-3f687ba7d800/md1x =1138x422)

Click on **Create secret**:

![Vault create secret](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5e79b123-a1ed-4c73-6988-0d1fabb43b00/md2x =1138x395)

Fill in the presented form as follows, then click **Save**:

![Vault filled create secret form](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/db40b043-9186-45dc-5fae-8cf248a3a300/lg1x =1167x610)

- `flipt_api_host` specifies the URL where the Flipt API is located. This URL
  should be reachable from your application (note that the port is `8080`, which
  is the port that the service listens on inside the container, and not `8100`,
  which is the port that maps to the service on your host machine).
- `flipt_api_token` contains the value of the API token that you generated
  earlier when initially setting up Flipt.

Retrieving the newly created `demoapp` secret from an application requires an
access policy to be set up first.

Choose **Policies** from the left menu on the screen you were redirected to:

![Vault policies menu option](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5544bb19-14c9-4bb9-fea0-37ec62f8f100/orig =1149x423)

Click **Create ACL policy**:

![Vault policies menu option](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/87efb06c-309b-4b8a-5709-c03135956000/md2x =1238x367)

Specify `demoapp` as the name of your new ACL policy and populate it with the
following contents:

```text
path "secret/data/demoapp" {
  capabilities = ["read"]
}
```

When you're done, click **Create policy**:

![Vault policies menu option](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/459d94c3-e8d1-4c73-0768-b27ea9dcc500/lg2x =1150x710)

It's now time to create a new user account for your application and attach the
`demoapp` policy that grants access to the `demoapp` secret.

Navigate back to the homepage and choose **Access** from the left menu:

![Vault access menu option](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/19dc016c-e4c6-4cb8-c7a5-f58c19e17200/public =1267x405)

Click on **Enable new method**:

![Vault enable new method](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b76fba0c-4190-4539-18f2-61ef85a00d00/md2x =1181x276)

Select **Username & Password**:

![Vault select auth method](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bf1b4b06-593d-4e41-7fb9-23480b106a00/md1x =1136x338)

Leave **Path** to its default value and just click **Enable method**:

![Vault enable auth method](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c53323e1-f198-4089-467c-1e8f38872800/lg2x =1139x345)

On the next screen, click **View method**:

![Vault view auth method](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6673b7d4-7f4c-422d-5c1e-05cfaacc3e00/lg2x =1237x346)

This takes you to a page that allows you to create new users.

Click on **Create user**:

![Vault create user](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9366a83f-26f1-41c2-70b6-d208449e1200/lg1x =1238x409)

In the presented form, specify `demoapp` as the **Username** and `test123` as
the **Password**.

Then click on **Tokens** to expand the token details section:

![Vault create user form](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/29d671af-7fb6-4ebd-fa67-cf1a00bd5200/md2x =1239x477)

Find the **Generated Token's Policies** input field, type in `demoapp`, then
click **Save**:

![Vault create user tokens section](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/44ebf814-105d-46e5-63c6-4c7857fe1900/lg2x =1238x996)

Here, `demoapp` corresponds to the policy name you created a few steps earlier.
By specifying it under **Generated Token's Policies**, you ensure that your
application will inherit this policy when authenticating with Vault. This will
let your application access all values stored in the `demoapp` secret.

The `userpass` authentication method should now display a newly created user
account:

![Vault authentication methods page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0ae89b29-478a-4d9a-2cf1-12015b50a100/lg2x =1238x368)

With that, you have everything necessary for integrating Vault into your
application.

## Step 4 — Updating your application

It's time to update your application to utilize Vault and Flipt.

This requires the installation of some additional Composer packages:

- [csharpru/vault-php](https://packagist.org/packages/csharpru/vault-php) which
  contains everything necessary for communicating with Vault.
- [flipt-io/flipt](https://packagist.org/packages/flipt-io/flipt) which contains
  everything necessary for communicating with Flipt.

Add these packages to your project by typing:

```command
composer require csharpru/vault-php flipt-io/flipt
```

![composer require csharpru/vault-php flipt-io/flipt](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f008e6d8-c20d-4d9e-c96f-435abb8c9000/md2x =1281x1101)

The plan is to supply the application container with all credentials necessary
for establishing an initial connection to the Vault server. For the sake of
simplicity, you'll pass these credentials in the form of environment variables
(in a production environment, you may want to use something more sophisticated,
such as Vault Agent instead).

The application will authenticate with the Vault server using the provided
credentials and pull its corresponding secrets (`flipt_api_host` and
`flipt_api_token`). It will then use these secrets to query Flipt for the value
of the `show_reverse_greeting` feature flag and determine whether to display the
greeting message in reverse or not.

This implies that your project needs some additional abstractions to handle the
construction of Vault and Flipt clients (i.e., factories).

Go ahead and create a new folder for your factories:

```command
mkdir src/Factory
```

You can work on the Vault factory first, as the Flipt factory will rely on
secrets retrieved from Vault for authentication.

Create a new file named `Vault.php` inside the `Factory` folder:

```command
touch src/Factory/Vault.php
```

Populate this file with the following contents:

```php
[label src/Factory/Vault.php]
<?php

namespace Demo\Project\Factory;

use Nyholm\Psr7\Factory\Psr17Factory;
use Vault\AuthenticationStrategies\UserPassAuthenticationStrategy;
use Vault\Client;

class Vault
{
    public function __construct(
       private readonly Psr17Factory $factory
    ) {}

    public function createClientFromEnvironment(): Client
    {
        $host = getenv('VAULT_HOST');
        $user = getenv('VAULT_USER');
        $pass = getenv('VAULT_PASS');

        $factory = $this->factory;
        $client = new Client(
            $factory->createUri($host),
            new \GuzzleHttp\Client(),
            $factory,
            $factory,
        );

        $client->setAuthenticationStrategy(new UserPassAuthenticationStrategy($user, $pass))->authenticate();

        return $client;
    }
}
```

The `Vault` class exposes a single factory method named
`createClientFromEnvironment()`, which creates a new `Vault\Client` instance
using credentials supplied through the environment variables `VAULT_HOST`,
`VAULT_USER`, and `VAULT_PASS`.

It requires an additional `Psr17Factory` object to be passed to its constructor
as a dependency because the underlying `Vault\Client` implementation is designed
to work with various PSR-17 interfaces for constructing requests to the Vault
server and processing responses from it.

Now is a good time to ensure that the environment variables `VAULT_HOST`,
`VAULT_USER`, and `VAULT_PASS` are properly set with the necessary credentials.

Create a new file in the root of your project named `vault.env`:

```command
touch vault.env
```

Populate it with the following contents:

```text
[label vault.env]
VAULT_HOST=http://vault:8200
VAULT_USER=demoapp
VAULT_PASS=test123
```

The `VAULT_USER` and `VAULT_PASS` values correspond to the credentials you
specified earlier when creating your application account on the Vault server.

`VAULT_HOST` assumes that your application will run on the same network as the
`vault` container and therefore uses its DNS name to interact with the Vault
server running inside of it.

You can proceed with implementing the `Flipt` factory.

Create a new file named `Flipt.php` inside the `Factory` folder:

```command
touch src/Factory/Flipt.php
```

Populate this file with the following contents:

```php
[label src/Factory/Flipt.php]
<?php

namespace Demo\Project\Factory;

use Flipt\Client\ClientTokenAuthentication;
use Flipt\Client\FliptClient;

class Flipt
{
    public function createClient(string $host, string $token): FliptClient
    {
        return new FliptClient(
            host: $host,
            authentication: new ClientTokenAuthentication($token),
        );
    }
}
```

The `Flipt` class exposes a factory method named `createClient()` which takes in
an externally specified hostname and an API token and returns a valid
`FliptClient` as a result. This hostname and API token are, namely, the ones
retrieved from the Vault server at boot time.

It's time to integrate the `Flipt` and `Vault` factories into the application.

Open up your `Application.php` file and apply the following changes:

```php
[label src/Application.php]
<?php

namespace Demo\Project;

[highlight]
use Demo\Project\Factory\Flipt;
use Flipt\Client\FliptClient;
[/highlight]
use Nyholm\Psr7\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
[highlight]
use Vault\Client;
[/highlight]

class Application implements RequestHandlerInterface
{
[highlight]
    private FliptClient $flipt;

    public function __construct(Client $vault, Flipt $fliptFactory) {
        $response = $vault->read('/secret/data/demoapp');
        $secret = $response->getData()['data'];
        $this->flipt = $fliptFactory->createClient(
            $secret['flipt_api_host'],
            $secret['flipt_api_token']
        );
    }
[/highlight]

    #[\Override] public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $greeting =  "Hello, world!";
[highlight]
        $flag = $this->flipt->boolean('show_reverse_greeting');

        if ($flag->getEnabled()) {
            $greeting = strrev($greeting);
        }
[/highlight]
        return new Response(body: $greeting);
    }
}
```

The `Application` class now uses a constructor, essentially implementing the
bootstrap phase of the application. The constructor requires an already
initialized `Vault\Client` and a `Flipt` factory to be passed in as parameters.
The `Vault\Client` is used for retrieving the contents of the
`/secret/data/demoapp` secret. The `flipt_api_host` and `flipt_api_token` values
are then extracted from the secret and passed to the `Flipt` factory, which
constructs the `FliptClient`.

The `FliptClient` is then used in the updated `handle()` method of the
`Application` for retrieving the value of the `show_reverse_greeting` feature
flag. If the flag is enabled, the greeting message is reversed. Otherwise, it's
displayed in its regular order.

The final step is to update the front controller to inject a `Vault\Client` and
a `Flipt` factory into the `Application`.

Open up the `index.php` file and apply the following changes:

```php
[label public/index.php]
<?php

require __DIR__ . '/../vendor/autoload.php';

[highlight]
// initialize factories
$psr17Factory = new \Nyholm\Psr7\Factory\Psr17Factory();
$vaultFactory = new \Demo\Project\Factory\Vault($psr17Factory);
$fliptFactory = new \Demo\Project\Factory\Flipt();
[/highlight]

// initialize the Application kernel
[highlight]
$app = new \Demo\Project\Application($vaultFactory->createClientFromEnvironment(), $fliptFactory);
[/highlight]

// create Request object
$worker = \Spiral\RoadRunner\Worker::create();
$creator = new \Spiral\RoadRunner\Http\PSR7Worker($worker, $psr17Factory, $psr17Factory, $psr17Factory);

while ($request = $creator->waitRequest()) {
    // pass Request object to the Application kernel
    $response = $app->handle($request);

    // emit Response
    $creator->respond($response);
}
```

The changes here are trivial. Besides the `Psr17Factory`, you're now also
constructing a `Vault` factory and a `Flipt` factory. The entire factory
initialization section is moved up and now precedes the initialization of the
`Application` kernel. The `Application` construction is updated to take in a
`VaultClient` (created through a call to `createClientFromEnvironment()`) and a
`Flipt` factory.

With that, the application is ready for testing.

## Step 5 — Testing your application

It's time to launch your updated application with RoadRunner.

Unfortunately, the `rr` alias you defined earlier won't work as-is in its
current form, as you need to inject the Vault credentials as environment
variables, and it's not designed to do that. You also need to put the
application container on the same network as the `vault` and `flipt` containers
for DNS resolution to work properly. So this time, let's enter the full Docker
command in the terminal.

The `rr serve` alias currently resolves to the following Docker command:

```command
docker run --rm -it -v ./:/app -w /app -u $(id -u):$(id -g) -p 8080:80 rr-dev-env:0.2.0 rr serve
```

Injecting the Vault credentials as environment variables is then as simple as
adding the option `--env-file vault.env`.

As for launching the container on the proper network, you can run the following
command to determine the current network that the `vault` and `flipt` containers
are running on:

```command
docker ps --format '{{ .ID }} {{ .Names }} {{ .Networks }}'
```

This command will list the IDs and names of all running containers, as well as
the networks they are connected to:

```text
[output]
e152514f397b vault roadrunner-tutorial_default
f248cb05c68c flipt roadrunner-tutorial_default
```

The `vault` and `flipt` containers are both connected to the
`roadrunner-tutorial_default` network. Ensuring that your RoadRunner container
will launch on the same network is then as simple as adding the option
`--network roadrunner-tutorial_default` to your final `docker run` command.

The final command then goes like this:

```command
docker run --rm -it -v ./:/app -w /app -u $(id -u):$(id -g) -p 8080:80 --env-file vault.env --network roadrunner-tutorial_default rr-dev-env:0.2.0 rr serve
```

Go ahead and execute the command, then open up `localhost:8080` and you'll see a
familiar message:

![localhost:8080](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1282dca6-4aca-4350-f0df-3a492051f700/md1x =956x194)

Navigate back to the **Flags** page in Flipt and open the
`show_reverse_greeting` flag for editing:

![Flipt flags page flag disabled](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c08c712b-6c04-4d75-23e1-46fcfb7c9400/lg1x =958x345)

Activate the **Enabled** radio button and click **Update**:

![Flipt enable show_reverse_greeting](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a16b4131-bd16-4a33-994d-8228b510bf00/orig =961x790)

Navigate back to the **Flags** page and ensure the flag shows as **Enabled**:

![Flipt flags page flag enabled](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/099b5863-d125-4b59-1a74-6671980e5600/lg2x =957x350)

Now refresh `localhost:8080` and you should see the "Hello, world!" greeting
displayed in reverse:

![Flipt enable show_reverse_greeting](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b170b221-7912-444a-4a30-3038f865a000/orig =958x215)

## Step 6 — Understanding the benefits

The application successfully integrates with Vault and Flipt, but how does
RoadRunner make a difference here?

As you saw earlier, in every instance of your front controller, the
`Application` class is bootstrapped just once:

```php
[label public/index.php]
$app = new \Demo\Project\Application($vaultFactory->createClientFromEnvironment(), $fliptFactory);
```

All client requests are then processed in a `while` loop that utilizes the very
same `Application` object over and over again:

```php
[label public/index.php]
. . .
while ($request = $creator->waitRequest()) {
    // pass Request object to the Application kernel
[highlight]
    $response = $app->handle($request);
[/highlight]

    // emit Response
    $creator->respond($response);
}
```

This isn't possible in a more traditional setup that makes use of something like
PHP-FPM behind a web server. You have to construct a brand new `Application`
object with each subsequent request to connect to Vault and pull the application
secrets. On my local setup, this operation takes about 70–80 ms.

With RoadRunner, these 70–80 ms are completely eliminated from the time it takes
to process a request. With PHP-FPM, every request includes this time, and you'll
have to resort to caching mechanisms or other workarounds to minimize the impact
on performance, which is not ideal when working with sensitive data, such as
authentication tokens and credentials.

## Final thoughts

As you can see, RoadRunner is a tool worth considering when it comes to
enhancing the performance of your PHP applications. Besides the example
demonstrated in this tutorial, the fact that you can maintain application state
between requests opens the door for numerous other use cases, such as reusing
database connections, aggregating monitoring metrics without an external
backend, and implementing custom in-memory data caching solutions to further
optimize your application's speed and efficiency.

You did everything from scratch in this tutorial and, therefore, had to deal
with a lot of low-level details. However, there are some higher-level
abstractions for popular PHP frameworks like Symfony and Laravel that you can
use to get going much faster and integrate your existing applications with
RoadRunner. I encourage you to check out
[Laravel Octane](https://laravel.com/docs/11.x/octane) and the
[RoadRunner Symfony runtime](https://github.com/php-runtime/roadrunner-symfony-nyholm)
for some good examples.

I also encourage you to check out the [Spiral Framework](https://spiral.dev/).
It's a modern PHP framework authored by the same team that works on RoadRunner.
The Spiral Framework provides seamless integration with RoadRunner out of the
box.

The source code for this tutorial is available on
[GitHub](https://github.com/betterstack-community/roadrunner-tutorial).
For even more information on RoadRunner, consider visiting its
[official website](https://roadrunner.dev/), checking out all of its
[features](https://roadrunner.dev/features), and digging deeper into its
[documentation](https://docs.roadrunner.dev/).

Thanks for reading, and have fun exploring RoadRunner!