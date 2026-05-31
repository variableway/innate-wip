# Building Production-Ready Docker Images for PHP Apps

Docker is a powerful tool that allows you to package your applications along
with all their dependencies into small, independent units called images. These
images can then be easily deployed on any Docker-compatible orchestration
platform, making it simple to ensure consistency across different development
and production environments.

Besides providing increased portability, this opens up an opportunity for
developers to run their code on a vast number of popular cloud application
platforms without having to worry about any underlying infrastructure. This
makes it a lot easier to build, test, and deploy PHP applications consistently
and efficiently.

Broadly speaking, deploying PHP applications with Docker entails two steps:
creating a Docker image and then deploying this image to the cloud as a
container. The following article will focus on the first stage, namely,
preparing a Docker image for production deployment.

This will include understanding what a Docker image is in the first place,
learning about essential PHP internals, putting together a `Dockerfile`, and
ultimately building a fully customized Docker image for running a PHP
application in production.

By the end of this article, you'll have a solid understanding of how PHP
applications operate in a containerized environment and be able to leverage this
knowledge to effectively deploy your PHP applications using Docker on any cloud
platform of your choice.

[ad-uptime]

## Prerequisites

- Prior PHP development experience.
- Familiarity with the Linux command-line.
- Access to a Linux system with
  [Docker Engine](https://docs.docker.com/engine/install/) installed.

## Creating a Docker image

Creating a Docker image starts with the `Dockerfile`. This is just a text file
containing instructions that Docker can interpret to produce an image. These
instructions include specifying a base image, copying application-specific
files, installing dependencies, and defining which command to run when a
container is started. Once a `Dockerfile` is created, it can be used to build an
image using the `docker build` command. After an image is built, it can be
deployed and run as a container using the `docker run` command.

It's easy to confuse the difference between an image and a container. You can
think of an image as a blueprint. A container engine like Docker can use such
blueprints to construct containers. Just as in object-oriented programming
(OOP), where an object is an instance of a class, you can think of a container
as an instance of an image—a concrete product made from the original blueprint.

When you invoke `docker run` and specify an image name, the Docker Engine goes
ahead and locates that blueprint, reads it, and constructs a container based on
the instructions found within.

Among other things, the two most essential components that an image specifies
are:

- Configuration data, providing details about the command to be executed inside
  the container, its default arguments, the environment variables available for
  injection, and many more.
- A group of filesystem layers forming the root filesystem of the container,
  housing all the software packages and libraries necessary for running the
  provided application, and isolating the container from the host system that it
  will be running on.

## Choosing a base image

You need a Docker image capable of executing PHP code to run a PHP application.
While you can certainly build one from scratch, it is usually more efficient and
practical to start with a base image that already contains most of the
dependencies needed to execute your application and extend it with whatever else
is necessary.

One common choice is the [official PHP image](https://hub.docker.com/_/php)
available on [Docker Hub](https://hub.docker.com/). This image comes in a
variety of flavors, covering a lot of different PHP versions and setups. Each
flavor contains a fully functioning PHP interpreter and additional tools,
enabling easier customization. Being an official Docker image means it is
regularly updated and maintained by the community, making it a great starting
point for your PHP projects.

If your application can support this, it's always a good idea to run it on PHP's
most recent stable release. This ensures that your application can use all the
latest language features and security updates. You can find this information on
the [PHP supported versions page](https://www.php.net/supported-versions.php).

At the time of this writing, the latest actively supported version of PHP is
`8.3`:

![PHP supported versions page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9f8598df-2bd4-4872-b63a-32706fa61600/lg1x =921x239)

If you click on the `8.3` link, you'll be redirected to the
[PHP downloads page](https://www.php.net/downloads.php), where the most recent
patch release of `8.3` is listed at the very top.

At the time of this writing, this version is `8.3.3`:

![PHP downloads page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b4fbd521-6d97-4750-9262-710d081ae600/orig =1070x331)

Let's explore the [official PHP image](https://hub.docker.com/_/php/tags) on
Docker Hub and search for version `8.3.3`:

![Docker Hub PHP image search](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/419b10c0-89a0-4598-aa7f-82a06f787700/md2x =1263x594)

This returns over 50 results! With so many options available, deciding which one
to use as a base image for your application can be difficult. However, if you
carefully examine all the available tags, you'll notice that exactly half of
them begin with the prefix `8.3.3RC1`. These images are all release candidates,
and you can safely discard them.

As explained on the [official PHP QA page](https://qa.php.net/rc.php):

> Release candidates are NOT for production use, they are for testing purposes
> only.

You can filter these out easily by typing `8.3.3-` instead of `8.3.3` in the
search box:

![PHP images without release candidates](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/18fc552d-6003-4963-0a53-17bc8baa4e00/md2x =1263x596)

This is, however, only a little better, as the updated result set still reports
over 20 matching images. As previously discussed, these images correspond to
different PHP flavors.

Every PHP version on Docker Hub is available in various image flavors. These are
published automatically with every new PHP release, and their tag names
generally adhere to the following naming schema:

```text
<PHP version>-<variant>-<OS>
```

- `<PHP version>` is the [semantic version](https://semver.org/) number
  corresponding to the PHP release shipped with that particular Docker image; it
  is formatted as `MAJOR.MINOR.PATCH`.
- `<variant>` is one of `apache`, `cli`, `fpm`, or `zts`.
  - `apache` supplies a PHP interpreter compiled as a shared Apache 2.0 module,
    bundled together with a complete installation of the
    [Apache 2.0](https://httpd.apache.org/) web server.
  - `cli` supplies a PHP interpreter compiled for command-line usage (e.g., for
    executing PHP scripts from the terminal).
  - `fpm` supplies a PHP interpreter compiled as a FastCGI processor (e.g., for
    integrating with third-party web servers supporting the FastCGI protocol).
  - `zts` is almost the same as `cli` but with Zend Thread Safety enabled in the
    PHP interpreter (hence `zts`), allowing users to run multithreaded
    applications that rely on extensions such as
    [pthreads](https://www.php.net/manual/en/intro.pthreads.php) (now
    deprecated) or [parallel](https://www.php.net/manual/en/intro.parallel.php).
- `<OS>` refers to the base operating system image on which the PHP installation
  was carried out. Among other things, this determines the root filesystem's
  initial contents and what system packages and libraries are available by
  default. As new OS images are released and older ones are retired, the options
  available here change, but generally speaking, there's usually a branch based
  on a more lightweight Linux distribution (such as
  [Alpine](https://www.alpinelinux.org/)) and another one based on a more
  comprehensive distribution (such as [Debian](https://www.debian.org/)). For
  PHP `8.3.3` in particular, the possible options are:
  - `bookworm` based on the `debian:bookworm-slim` image.
  - `bullseye` based on the `debian:bullseye-slim` image.
  - `alpine3.18` based on the `alpine:3.18` image.
  - `alpine3.19` based on the `alpine:3.19` image.

It's worth noting that none of the Alpine images have an `apache` flavor. The
image maintainers decided against this because the `apache2` packages on Debian
and Alpine have different default configurations. On Debian, Apache employs a
hierarchical configuration file layout that makes adding and removing modules
and configuration directives easier to automate. Supporting an `apache` flavor
would have required significant changes, so the maintainers decided not to do
it. To some extent, it would have also drifted away from the lightweight
philosophy of the Alpine image.

When running PHP applications in production, you'd almost surely want to put a
web server such as [NGINX](https://www.nginx.com/) or [Caddy](https://betterstack.com/community/guides/web-servers/caddy/) in front of
your PHP application. While a popular choice, Apache may not be able to provide
the same level of performance. Both NGINX and Caddy can interface with PHP
through the FastCGI protocol, so you need to make sure that your image contains
a PHP interpreter compiled as FastCGI processor. As we discussed above, the
`fpm` flavor offers precisely that, so you can further narrow your search down
to `8.3.3-fpm`:

![Docker Hub PHP FPM images](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5d59974d-b4f5-4dbf-fa1d-7134699ecc00/lg2x =1266x584)

This reduces the result set to 6 matches.

As you're targeting a production environment, it's important to consider the
size and efficiency of your image. Smaller images are generally preferred for
production environments, as they reduce deployment times and improve scalability
(they're faster to pull over the network and load into memory when starting
containers). This makes each Alpine variant a better choice than the larger
Debian variants.

Keeping the underlying Linux libraries up-to-date is also important, as this
helps you safeguard your environment from potential security threats. Using a
newer Linux image ensures that your container will run with the latest security
patches and updates. Alpine 3.19 is therefore a more preferable choice than
Alpine 3.18.

An image that fulfills all of these requirements is `php:8.3.3-fpm-alpine3.19`:

![Docker Hub suitable PHP FPM image](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/950dba28-1bcf-45bf-2b57-181b555ff700/public =1267x599)

## Exploring php-fpm

The `php:8.3.3-fpm-alpine3.19` image runs PHP as a FastCGI processor. This means
that the PHP interpreter in this image is wrapped in a FastCGI server. The
compiler outputs a binary file named `php-fpm` when PHP is compiled as a FastCGI
processor which contains both the PHP interpreter and the PHP FastCGI Process
Manager.

When you launch a `php-fpm` binary from the command line, it assumes the role of
a master process. This master process initiates the FastCGI server, establishing
a new TCP socket that (by default) listens on port `9000` for incoming
connections, and forks as many `php-fpm` worker processes as necessary in
compliance with the specified worker pool configuration (2 children by default).

When a new FastCGI request arrives, one of the available worker processes
accepts the incoming connection, locates the primary PHP script requested for
execution, passes it through the PHP interpreter for processing, then transmits
the generated output back to the original requester over TCP (in this case, the
web server):

![FPM request flow diagram](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/416b8c68-a1b5-45d7-ff2c-4d581573a200/md1x =1448x232)

This is best illustrated with an example.

Start a new container using the `php:8.3.3-fpm-alpine3.19` image:

```command
docker run -d --rm --name fpm-example php:8.3.3-fpm-alpine3.19
```

The `-d` option tells Docker to run this container in the background, the `--rm`
option ensures its removal after you're done working with it, and the `--name`
option assigns it the name `fpm-example` so it's easier to refer to this
container in subsequent commands.

Execute the following command:

```command
docker exec fpm-example ps -o pid,ppid,user,args
```

The `ps` command lists all processes currently running inside the container. The
`-o` argument alters the default output format by requesting the parent process
ID (`PPID`) to be included in the `ps` response. This produces the following
output:

```text
[output]
PID   PPID  USER     COMMAND
    1     0 root     php-fpm: master process (/usr/local/etc/php-fpm.conf)
    7     1 www-data php-fpm: pool www
    8     1 www-data php-fpm: pool www
    9     0 root     ps -o pid,ppid,user,args
```

The output confirms that the main process running inside the container is the
`php-fpm` master process, and that this process has two `php-fpm` child
processes, both belonging to the worker pool `www` (the default worker pool that
the `php-fpm` container is configured to work with).

You can further use `netstat` to see the socket that the master `php-fpm`
process is listening on:

```command
docker exec fpm-example netstat -lp
```

This produces an output confirming that the main `php-fpm` process has
successfully established a listening socket on port `9000` and is ready to
accept incoming connections on that port:

```text
[output]
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
[highlight]
tcp        0      0 :::9000                 :::*                    LISTEN      1/php-fpm.conf)
[/highlight]
Active UNIX domain sockets (only servers)
Proto RefCnt Flags       Type       State         I-Node PID/Program name    Path
```

The FastCGI server that `php-fpm` started seems to be up and running, but to
give it some actual work and try it out, you'll be better off with a web server
sitting in front of it. FastCGI is a binary protocol, and forming raw FastCGI
requests can be quite tedious compared to sending HTTP requests to a web server
and letting it perform the HTTP-to-FastCGI translation on your behalf.

You'll learn everything about this in the following section.

## Configuring a web server

FastCGI (much like HTTP) is simply an application layer protocol. It uses TCP
for transport (although it could also use Unix sockets locally) to transmit data
encoded in a special binary format. That binary format is detailed in the
[official FastCGI specification](https://fast-cgi.github.io/spec), but its inner
workings are beyond the scope of this article. The main point is that a raw
FastCGI request cannot be easily represented in plain text, so forming one is,
naturally, a little more involving than an HTTP request.

On the other hand, HTTP requests can be easily expressed in plain text, making
them a lot easier for human users to construct and comprehend. Web browsers,
REST APIs, and associated tools can all speak HTTP fluently but have a hard time
communicating in FastCGI. That's where web servers like NGINX can help by
converting your HTTP requests to FastCGI and then forwarding them to `php-fpm`
for processing.

Let's add an `nginx` container and configure it to communicate with the
`php-fpm` container you launched earlier.

Just like PHP, NGINX has an [official image](https://hub.docker.com/_/nginx)
available on Docker Hub. And just like PHP, this image comes in many different
flavors, so you need to go through a similar cadence.

Navigate to the [NGINX download page](https://nginx.org/en/download.html) and
locate the latest available release:

![Nginx download page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7fcac467-1df6-4be7-0882-b19c77d13a00/lg1x =820x231)

You'll see a mainline version and a stable version. There's usually some
confusion when it comes to choosing the right version for a production
environment. The official
[NGINX installation guide](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)
makes the following suggestion:

![Nginx version recommendation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1350639b-ef3e-4915-a651-7fb480061b00/orig =940x199)

To stay on the safe side, steer towards the stable version. Navigate to
[Docker Hub](https://hub.docker.com/_/nginx/tags?name=1.24.0) and search for
version `1.24.0`:

![Nginx version search](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/06ac9d30-f21f-44af-9f18-657e29a54c00/lg1x =1263x529)

This reduces the result set to 10 matches, corresponding to all the different
`nginx` image flavors. The naming schema for NGINX images is not as
straightforward as with the official PHP image, but it can still be roughly
expressed as:

```text
<NGINX version>-<OS>-<variant>
```

There are some specifics to be aware of, though.

In general, you can still choose between a lightweight Alpine version and a
comprehensive Debian version, so you can narrow your search to the Alpine
versions alone for the same reasons as before:

![NGINX Alpine image version search](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2e4482b5-dca9-4801-3f26-eab1ccaefc00/lg1x =1259x512)

This leaves you with six flavors to choose from. Half of them are tagged as
`1.24.0-alpine3.17` and the other half as just `1.24.0-alpine`. It may not be
immediately obvious, but these options are not identical. The `alpine3.17`
images are based on Alpine 3.17, while the `alpine` images are based on the
newer Alpine 3.18 distribution. For reasons explained earlier, you'd want to use
the newer version, so this leaves you with three potential options:

- `1.24.0-alpine`
- `1.24.0-alpine-perl`
- `1.24.0-alpine-slim`

You might be thinking that `nginx:1.24.0-alpine` is just an alias for one of the
other two options (like in the PHP image where `php:8.3.3-alpine` aliases
`8.3.3-cli-alpine3.19`), but that's not the case here. `nginx:1.24.0-alpine` is
a whole different flavor that adds things on top of `nginx:1.24.0-alpine-slim`.

In general, the `nginx` image hierarchy looks like this:

![Nginx Alpine image relations](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e28d739a-5b21-4575-1942-3f886506c500/lg2x =359x314)

- `nginx:1.24.0-alpine-slim` is the smallest possible image, installing NGINX
  directly on `alpine:3.18`.
- `nginx:1.24.0-alpine` is a slightly larger image, bringing in some additional
  NGINX dynamic modules, such as
  [GeoIP](https://docs.nginx.com/nginx/admin-guide/dynamic-modules/geoip/),
  [Image-Filter](https://docs.nginx.com/nginx/admin-guide/dynamic-modules/image-filter/),
  [njs](https://docs.nginx.com/nginx/admin-guide/dynamic-modules/nginscript/),
  and [XSLT](https://docs.nginx.com/nginx/admin-guide/dynamic-modules/xslt/).
- `nginx:1.24.0-alpine-perl` further introduces the
  [Perl](https://docs.nginx.com/nginx/admin-guide/dynamic-modules/perl/) module
  (in addition to the 4 modules mentioned previously).

None of the dynamic modules listed above are mandatory for getting `php-fpm`
integrated with NGINX. Therefore, you can safely use `nginx:1.24.0-alpine-slim`
as your NGINX image in this tutorial.

Go ahead and start a new `nginx` container:

```command
docker run -d --rm --name nginx-example -p 8080:80 nginx:1.24.0-alpine-slim
```

In addition to the `-d`, `-rm`, and `--name` options you previously specified
when starting the `php-fpm` container, the `-p 8080:80` option tells Docker to
map port `8080` on the host machine to port `80` inside the container, allowing
you to access NGINX through `localhost:8080`.

Navigate to `localhost:8080` to verify that everything works. You should see the
following welcome page:

![NGINX welcome page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ba27b2b3-4cce-4241-9a6a-b08ba9a79c00/lg2x =960x263)

When you launch NGINX, it starts with a very minimal default configuration. The
default virtual server is defined in `/etc/nginx/conf.d/default.conf` and its
initial settings boil down to:

```text
[label /etc/nginx/conf.d/default.conf]
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

You'll have to modify these settings to enable communication with the `php-fpm`
server started earlier. Create a new file locally named `default.conf` and paste
the following contents:

```text
[label default.conf]
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

[highlight]
    location ~ \.php$ {
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_param  SCRIPT_FILENAME  $fastcgi_script_name;
        include        fastcgi_params;
    }
[/highlight]
}
```

As you can see, the only significant changes are the removal of the `error_page`
directive and its related `location` block, and the addition of a new `location`
block telling NGINX how to deal with `*.php` files.

Removing the `error_page` directive prevents NGINX from displaying the default
error page when encountering `5XX` errors. The default error page looks like
this:

![Default nginx 5xx error page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6cde736b-dc88-48cb-637f-209782ef5b00/lg2x =961x259)

By excluding it, `5XX` errors will be shown in the following format instead:

![Plain-text nginx error page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fdd14c46-8479-4791-41ff-4744a77a7c00/lg2x =958x175)

This will come in handy later when you troubleshoot the connectivity between
`php-fpm` and `nginx`, as the HTTP error code is now clearly visible on the
error page.

As for the newly introduced `location` block:

```text
location ~ \.php$ {
    fastcgi_pass   127.0.0.1:9000;
    fastcgi_param  SCRIPT_FILENAME  $fastcgi_script_name;
    include        fastcgi_params;
}
```

- `location ~ \.php$` tells `nginx` to capture all HTTP requests to URIs ending
  in `.php` (e.g., `http://localhost:8080/test.php` is one such URL).
- `fastcgi_pass 127.0.0.1:9000` tells `nginx` to translate such requests to
  FastCGI and pass them for processing to the FastCGI server located at
  `127.0.0.1:9000`.
- `fastcgi_param SCRIPT_FILENAME` and `include fastcgi_params` tell `nginx` to
  add a specific set of key-value pairs (think request variables) to the FastCGI
  request before sending it to the FastCGI server at `127.0.0.1:9000` for
  processing.

To apply the updated configuration, copy the newly created file to the `nginx`
container by issuing:

```command
docker cp default.conf nginx-example:/etc/nginx/conf.d/default.conf
```

Then, force `nginx` to reload its configuration by typing:

```command
docker exec nginx-example nginx -s reload
```

```text
[output]
2024/03/03 08:27:44 [notice] 46#46: signal process started
```

Now, try to access a PHP script from your browser (e.g., `test.php`):

![502 Bad Gateway](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a0f302ea-4ade-455b-a2e8-aa363b155000/md1x =960x197)

A 502 Bad Gateway error appears.

Examine the logs from the NGINX container:

```command
docker logs -n 5 nginx-example
```

The `-n 5` option limits the output to the five most recent log entries. Among
them, you'll notice:

```text
[output]
2024/03/03 09:19:22 [error] 48#48: *1 connect() failed (111: Connection refused) while connecting to upstream, client: 172.17.0.1, server: localhost, request: "GET /test.php HTTP/1.1", upstream: "fastcgi://127.0.0.1:9000", host: "localhost:8080"
172.17.0.1 - - [03/Mar/2024:09:19:22 +0000] "GET /test.php HTTP/1.1" 502 559 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" "-"
```

The logs indicate that `fastcgi://127.0.0.1:9000` refused the connection request
initiated by NGINX.

This makes perfect sense because `127.0.0.1` is a loopback address that points
to the same container that the `nginx` process is running in, whereas the
`php-fpm` process is running inside a whole different container.

To locate the IP address of the `php-fpm` container, type:

```command
docker inspect -f '{{.NetworkSettings.IPAddress}}' fpm-example
```

You'll get a similar output:

```text
[output]
172.17.0.2
```

Change the NGINX config to reflect this address:

```text
[label default.conf]
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    location ~ \.php$ {
[highlight]
        fastcgi_pass   172.17.0.2:9000;
[/highlight]
        fastcgi_param  SCRIPT_FILENAME  $fastcgi_script_name;
        include        fastcgi_params;
    }
}
```

Copy the updated configuration file to the `nginx` container once again:

```command
docker cp default.conf nginx-example:/etc/nginx/conf.d/default.conf
```

Then force another reload of the configuration:

```command
docker exec nginx-example nginx -s reload
```

This time `localhost:8080/test.php` returns a different error:

![File not found error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cede35cc-70fe-4275-6635-b5b22c917300/md2x =965x229)

Examine the NGINX logs again:

```command
docker logs -n 5 nginx-example
```

Towards the bottom, you'll see a message stating:

```text
[output]
172.17.0.1 - - [03/Mar/2024:09:30:45 +0000] "GET /test.php HTTP/1.1" 404 27 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" "-"
```

The `Connection refused` error is no longer present, so it appears that `nginx`
successfully connected to the `php-fpm` upstream. What might be causing the 404
error, then?

The answer lies in the `php-fpm` logs:

```command
docker logs -n 5 fpm-example
```

There, you'll find a similar message:

```text
[output]
172.17.0.3 -  03/Mar/2024:09:30:45 +0000 "GET /test.php" 404
```

Indeed, the `nginx` request reached the `php-fpm` server; however, `php-fpm` was
unable to locate a script with the name `test.php` locally and was therefore
unable to fulfill the request.

This also makes perfect sense. You launched the `php-fpm` container without
adding any PHP scripts, so its working directory is practically empty.

You can determine the default working directory of the `php-fpm` container by
typing:

```command
docker inspect -f '{{.Config.WorkingDir}}' fpm-example
```

As the output confirms, this defaults to `/var/www/html`:

```text
[output]
/var/www/html
```

Issue the following command to examine its contents:

```command
docker exec fpm-example ls -Al /var/www/html
```

Indeed, the directory is empty:

```text
[output]
total 0
```

Create a new file named `test.php` locally and populate it with the following
contents:

```php
[label test.php]
<?php

phpinfo();
```

Copy `test.php` to `/var/www/html` in the container by typing:

```command
docker cp test.php fpm-example:/var/www/html
```

List the contents once again, and you should see the new file there:

```command
docker exec fpm-example ls -Al /var/www/html
```

```text
[output]
total 4
-rw-rw-r--    1 1000     1000            18 Mar  3 09:46 test.php
```

Nothing seems to have changed if you repeat the HTTP request, though:

![File not found error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6b07a620-3b2f-4b76-74bb-bd0c46055e00/lg1x =965x229)

Why is that? The answer lies back in the PHP `location` block of your NGINX
configuration:

```text
[label default.conf]
server {
. . .

    location ~ \.php$ {
        fastcgi_pass   172.17.0.2:9000;
        fastcgi_param  SCRIPT_FILENAME  $fastcgi_script_name;
        include        fastcgi_params;
    }
}
```

The `SCRIPT_FILENAME` FastCGI parameter is what determines the exact location of
a PHP script inside the `php-fpm` container. The `$fastcgi_script_name` variable
contains only the name of that script (in your case, `test.php`). When `php-fpm`
receives `test.php` as the `SCRIPT_FILENAME`, it tries to locate it in the root
filesystem folder (`/test.php`). However, there's no such file inside the
`php-fpm` container, which you can verify by typing:

```command
docker exec fpm-example ls -Al /test.php
```

```text
[output]
ls: /test.php: No such file or directory
```

The script is actually located at `/var/www/html/test.php`, and your NGINX
configuration needs to reflect this. Modify it one last time as follows:

```text
[label default.conf]
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    location ~ \.php$ {
[highlight]
        root           /var/www/html;
[/highlight]
        fastcgi_pass   172.17.0.2:9000;
[highlight]
        fastcgi_param  SCRIPT_FILENAME  $document_root/$fastcgi_script_name;
[/highlight]
        include        fastcgi_params;
    }
}
```

By adding the `root` directive, you're explicitly stating that PHP scripts are
located at `/var/www/html` inside the `php-fpm` container. You're then further
passing this value when forming the `SCRIPT_FILENAME` FastCGI parameter by
referencing the `$document_root` variable, so the FastCGI server will now be
looking for a `/var/www/html/test.php` instead of `/test.php`.

You know the drill now. Copy the updated configuration to the NGINX container,
then reload it:

```command
docker cp default.conf nginx-example:/etc/nginx/conf.d/default.conf
```

```command
docker exec nginx-example nginx -s reload
```

Now refresh `localhost:8080/test.php`:

![phpinfo() page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e5cb6e22-68a0-4f6c-c294-cc732461c200/orig =959x852)

It works! The `phpinfo()` page loads up successfully.

Well done! You have configured NGINX and `php-fpm` to work together. In the next
section, you'll expand on this knowledge and build a custom image for running an
actual PHP application (a simple REST API built with
[Laravel](https://laravel.com/)).

You're not going to need the `nginx-example` and `fpm-example` anymore, so
please remove them before continuing further:

```command
docker stop nginx-example fpm-example
```

**Learn more**: [Getting Started with Logging in Docker Containers](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/)

## Building custom images for PHP applications

From this point on in the tutorial, you'll be working with a small Laravel
application called the
[Product API](https://github.com/betterstack-community/product-api). The Product
API is a very basic REST API that allows users to create, read, update, and
delete products. It will serve as a practical example for you to expand what
you've learned so far and produce a fully customized Docker image for running a
PHP application.

Go ahead and clone the application repository locally:

```command
git clone https://github.com/betterstack-community/product-api.git
```

To run a PHP application as a Docker container in production, you need at least
two things:

- Its source code should be present inside the container image itself.
- The PHP interpreter inside the container image should be capable of executing
  that source code (i.e., it should run the correct PHP version and have all
  required PHP extensions).

The Product API source code is certainly not available in any of the official
PHP images, so you need to find a way to add it. This is an excellent reason for
creating a custom Docker image.

Start by creating a new `Dockerfile` within your `product-api` project:

```command
cd product-api
```

```command
touch Dockerfile
```

Open up your `Dockerfile` and add the following line:

```text
[label Dockerfile]
FROM php:8.3.3-fpm-alpine3.19
```

The `FROM` instruction specifies a base image for your PHP application. As you
saw earlier, `php:8.3.3-fpm-alpine3.19` is a good starting point. You'll be
putting the Product API behind NGINX, and the `php:8.3.3-fpm-alpine3.19` image
already contains a PHP interpreter compiled to run as a FastCGI processor, so a
lot of the groundwork has already been carried out for you.

The next step is to add the application source code to the image. You can
accomplish this through the `COPY` instruction. As you remember, the default
working directory in the `php:8.3.3-fpm-alpine3.19` image is `/var/www/html`, so
you can store your application files there (you can always customize the working
directory through the `WORKDIR` instruction if you find it necessary, but let's
stick with the default one for now).

Modify your `Dockerfile` as follows:

```text
[label Dockerfile]
FROM php:8.3.3-fpm-alpine3.19

[highlight]
COPY . /var/www/html
[/highlight]
```

This will copy the entire contents of your `product-api` directory into the
image.

You can now try building an image from this `Dockerfile` by running the
following command:

```command
docker build -t product-api:0.1.0 .
```

After a moment, the build completes, and a new image tagged as
`product-api:0.1.0` appears in your local library.

You can confirm this with:

```command
docker image ls product-api
```

```text
[output]
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
product-api   0.1.0     e1ad9dcffccc   3 minutes ago   83.6MB
```

Go ahead and launch a container from this image:

```command
docker run --rm --name product-api product-api:0.1.0
```

The container starts successfully, with `php-fpm` reporting that it's ready to
start accepting connections:

```text
[output]
[03-Mar-2024 10:57:53] NOTICE: fpm is running, pid 1
[03-Mar-2024 10:57:53] NOTICE: ready to handle connections
```

Hit `Ctrl+C` to terminate the container. There is some preliminary work you need
to do before introducing the NGINX server that the `product-api` container will
be operating behind.

Remember how, in earlier examples, you had to determine the IP address of the
`php-fpm` container manually to be able to configure NGINX properly? In a
production environment, you can't rely on doing this by hand.

You can, however, use DNS resolution to route traffic to the correct container
automatically. Setting this up varies from provider to provider, but locally,
you can use Docker's embedded DNS server, which routes traffic based on the
container's name.

To set this up, you only need to attach your containers to a custom bridge
network.

To create one, run:

```command
docker network create product-api-network
```

Now, start a new `product-api` container and attach it to that network using the
`--network` option:

```command
docker run -d --rm --name product-api --network product-api-network product-api:0.1.0
```

Product API is a Laravel application and the official Laravel documentation
already provides a
[sample configuration file](https://laravel.com/docs/10.x/deployment#nginx) for
NGINX that you can use as a starting point for configuring your web server.

You'll still have to tweak a couple of things, though:

- Change the `root` directive in the main `server` block to
  `/usr/share/nginx/html` to match the default workdir of the official `nginx`
  image.
- Change the `try_files` directive in the `location /` block to
  `$uri /index.php?$query_string`. This prevents NGINX from trying to output
  directory listings and redirects all requests for non-existent static files to
  `php-fpm` directly.
- Change the content of the `location ~ \.php$` block to:

  ```text
  root /var/www/html/public;
  fastcgi_pass product-api:9000;
  fastcgi_param SCRIPT_FILENAME $document_root/$fastcgi_script_name;
  include fastcgi_params;
  ```

  These changes will ensure that the IP address of the FastCGI server running
  inside the `php-fpm` container will be resolved using the `product-api` DNS
  name. Furthermore, it will ensure that the FastCGI server will look for the
  Laravel `public` folder using `/var/www/html/public` rather than
  `/usr/share/nginx/html` as the file path.

The final file should read:

```text
[label laravel.conf]
server {
    listen 80;
    listen [::]:80;
    server_name example.com;
[highlight]
    root /usr/share/nginx/html;
[/highlight]

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
[highlight]
        try_files $uri /index.php?$query_string;
[/highlight]
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
[highlight]
        root /var/www/html/public;
        fastcgi_pass product-api:9000;
        fastcgi_param SCRIPT_FILENAME $document_root/$fastcgi_script_name;
[/highlight]
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

You may optionally also remove the `server_name` directive and add a
`default_server` parameter to the `listen` directives instead, as follows:

```text
[label laravel.conf]
server {
    listen 80 default_server;
    listen [::]:80 default_server;
. . .
```

This is, however, not required for running this example locally, as the default
`nginx` image comes with only one virtual server defined, and on such occasions,
that server automatically assumes the role of a default server for all
`address:port` pairs specified.

Without further ado, go ahead and start the NGINX server:

```command
docker run -d --rm --name web-server --network product-api-network -p 8080:80 -v ./laravel.conf:/etc/nginx/conf.d/default.conf nginx:1.24.0-alpine-slim
```

Using the `-v` option replaces the `/etc/nginx/conf.d/default.conf` file inside
the container with the `laravel.conf` you created through a volume mount. This
ensures that further updates to that file will automatically get propagated to
the container, sparing you from having to issue the following command over and
over again:

```command
docker cp laravel.conf nginx-example:/etc/nginx/conf.d/default.conf
```

Open up a new browser tab and navigate to `localhost:8080`:

![PHP autoload error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3b290310-a122-4d43-46df-1bc50c45f700/md2x =961x184)

NGINX seems to be successfully communicating with `php-fpm`, which is great
news! However, the error indicates that the Product API cannot locate its
`autoload.php` file. This is another important thing to keep in mind. To be able
to run your PHP applications in production, you must ensure that all required
dependencies are available inside the container. You cloned the repository and
copied the source code to the container image but not the
[Composer](https://getcomposer.org/) dependencies.

The official PHP image doesn't come with Composer pre-installed, so you have to
find a way to bring it into your custom image to be able to install the required
dependencies. You can achieve this through a
[multi-stage build](https://docs.docker.com/build/building/multi-stage/#use-multi-stage-builds),
using the [official Composer image](https://hub.docker.com/_/composer). You can
just use the latest version of Composer, which at the time of this writing is
`2.7.1`.

Go ahead and modify your `Dockerfile` as follows:

```text
[label Dockerfile]
[highlight]
FROM composer:2.7.1
[/highlight]

FROM php:8.3.3-fpm-alpine3.19

COPY . /var/www/html

[highlight]
COPY --from=0 /usr/bin/composer /usr/bin/composer
[/highlight]
```

These changes will tell the Docker Engine to load the `/usr/bin/composer` file
from the `composer:2.7.1` image and place it into your custom PHP image.

This now allows you to run `composer install` to fetch the required
dependencies:

```text
[label Dockerfile]
FROM composer:2.7.1

FROM php:8.3.3-fpm-alpine3.19

COPY . /var/www/html

COPY --from=0 /usr/bin/composer /usr/bin/composer

[highlight]
RUN composer install
[/highlight]
```

With all of these changes in place, go ahead and build a new version of the
image:

```command
docker build -t product-api:0.2.0 .
```

Terminate the previous `product-api` container and replace it with a container
running the newest image:

```command
docker stop product-api
```

```command
docker run -d --rm --name product-api --network product-api-network product-api:0.2.0
```

Refresh `localhost:8080` in your browser:

![500 internal server error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/dfb860d6-48d2-43a0-62b3-e77207f18b00/public =955x436)

It seems like the autoloader issue is now gone, yet you are getting a cryptic
500 Internal Server Error.

There's not much information in the `product-api` container logs as well:

```command
docker logs -n 5 product-api
```

```text
[output]
[04-Mar-2024 07:58:57] NOTICE: fpm is running, pid 1
[04-Mar-2024 07:58:57] NOTICE: ready to handle connections
172.19.0.3 -  04/Mar/2024:07:59:14 +0000 "GET /index.php" 500
```

Something is concealing the specific problem causing the error.

Fortunately, Laravel has a mechanism that allows putting your application in
debug mode. This enables a very verbose level of error logging, which can often
aid you in pinpointing the exact issues in your application. Debug mode is
activated by setting the `APP_DEBUG` environment variable to `true` before
booting up your application.

Create a new file named `laravel.env` and add the following line:

```text
[label laravel.env]
APP_DEBUG=true
```

You'll use this file to pass environment variables to the `product-api`
container at runtime.

Stop the `product-api` container first with:

```command
docker stop product-api
```

Then restart it with the following command:

```command
docker run -d --rm --name product-api --network product-api-network --env-file laravel.env product-api:0.2.0
```

The `--env-file` option reads environment variable definitions from the
`laravel.env` file and makes them available to the `product-api` container.

Refresh `localhost:8080` once again:

![Failed to open stream error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0782c8a5-3e42-40c6-6315-e08bd92bed00/lg1x =961x275)

The error indicates that Laravel is unable to open the
`/var/www/html/storage/laravel.log` file for writing due to a permission denied
error. The cause may not seem immediately obvious, but it can be easily
identified with little investigation.

Execute the following command:

```command
docker exec product-api ps
```

Note how the `php-fpm: pool www` processes run as the `www-data` user:

```text
[output]
PID   USER     TIME  COMMAND
    1 root      0:00 php-fpm: master process (/usr/local/etc/php-fpm.conf)
    7 www-data  0:00 php-fpm: pool www
    8 www-data  0:00 php-fpm: pool www
    9 root      0:00 ps
```

Now run:

```command
docker exec product-api ls -l /var/www/html
```

Note how all application files and folders (including the `storage` directory in
question) are owned by the `root` user:

```text
[output]
total 368
-rw-rw-r--    1 root     root          4109 Mar  3 10:24 README.md
drwxrwxr-x    7 root     root          4096 Mar  3 10:24 app
-rwxrwxr-x    1 root     root           350 Mar  3 10:24 artisan
drwxrwxr-x    1 root     root          4096 Mar  3 10:24 bootstrap
-rw-rw-r--    1 root     root          2029 Mar  3 10:24 composer.json
-rw-rw-r--    1 root     root        301938 Mar  3 10:24 composer.lock
drwxrwxr-x    2 root     root          4096 Mar  3 10:24 config
drwxrwxr-x    5 root     root          4096 Mar  3 10:24 database
-rw-rw-r--    1 root     root           244 Mar  3 10:24 package.json
-rw-rw-r--    1 root     root          1191 Mar  3 10:24 phpunit.xml
drwxrwxr-x    2 root     root          4096 Mar  3 10:24 public
drwxrwxr-x    5 root     root          4096 Mar  3 10:24 resources
drwxrwxr-x    2 root     root          4096 Mar  3 10:24 routes
drwxrwxr-x    5 root     root          4096 Mar  3 10:24 storage
drwxrwxr-x    4 root     root          4096 Mar  3 10:24 tests
drwxr-xr-x   41 root     root          4096 Mar  4 07:57 vendor
-rw-rw-r--    1 root     root           263 Mar  3 10:24 vite.config.js
```

The system prevents writes to the `/var/www/html/storage/laravel.log` file,
because the `www-data` user is neither the owner of this file nor a member of
the `root` user group.

The best way to fix this and any subsequent file permission errors is to ensure
that all the application files that are packaged into your Docker image belong
to the same user and group as the one running the `php-fpm` worker processes.

With that in mind, modify your `Dockerfile` as follows:

```text
[label Dockerfile]
FROM composer:2.7.1

FROM php:8.3.3-fpm-alpine3.19

[highlight]
COPY --chown=www-data:www-data . /var/www/html
[/highlight]

COPY --from=0 /usr/bin/composer /usr/bin/composer

RUN composer install
```

The `--chown` parameter to the `COPY` instruction ensures all application files
will be owned by the `www-data` user inside the container.

This will take care of the application files but won't affect the `vendor`
folder, as commands inside the Docker container run as `root` by default. You'll
therefore need a `USER` instruction right before `RUN` to ensure that `composer`
will run and install packages as the `www-data` user:

```text
[label Dockerfile]
FROM composer:2.7.1

FROM php:8.3.3-fpm-alpine3.19

COPY --chown=www-data:www-data . /var/www/html

COPY --from=0 /usr/bin/composer /usr/bin/composer

[highlight]
USER www-data
[/highlight]

RUN composer install
```

This will, however, affect the `php-fpm` master process, which requires running
as `root`, so as a last step, make sure to restore `root` as the default user:

```text
[label Dockerfile]
FROM composer:2.7.1

FROM php:8.3.3-fpm-alpine3.19

COPY --chown=www-data:www-data . /var/www/html

COPY --from=0 /usr/bin/composer /usr/bin/composer

USER www-data

RUN composer install

[highlight]
USER root
[/highlight]
```

Go ahead and rebuild the image:

```command
docker build -t product-api:0.3.0 .
```

Then, stop the old container and replace it with a new one running the most
recent image:

```command
docker stop product-api
```

```command
docker run -d --rm --name product-api --network product-api-network --env-file laravel.env product-api:0.3.0
```

Refresh the page. This time, the error says:

![Application key error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8c0327f2-2e6b-41e6-df8f-243b46df8800/md2x =961x374)

Indeed, Laravel requires an application key to boot up, but it seems you solved
the original file permission error.

Typically, an application key is generated locally (during development) and
supplied as an environment variable in production.

Assuming you already have this key generated locally, place it in your
`laravel.env` file as follows:

```text
[label laravel.env]
APP_DEBUG=true
[highlight]
APP_KEY=<your_app_key>
[/highlight]
```

If you can't generate one yourself right now and want to continue with the
tutorial, feel free to use the following pre-generated key, but please do not
use this key in an actual production application! Application keys are sensitive
information and should always be kept secret!

```text
[label laravel.env]
APP_DEBUG=true
[highlight]
APP_KEY=base64:a2nQ3bQFHbjU50y1oeeaNxfFpDCsF5t4egS/zEiY5lQ=
[/highlight]
```

To enable the newly added environment variable, recreate the `product-api`
container:

```command
docker stop product-api
```

```command
docker run -d --rm --name product-api --network product-api-network --env-file laravel.env product-api:0.3.0
```

Refresh the page again. This time, the application redirects you to
`localhost:8080/api/products`:

![SQL driver error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c0e748c9-1a20-47af-de1b-a1c66a0c0100/lg2x =961x283)

Good! The file permission and application key errors are both gone, but now an
SQL error appears because the required database driver seems to be missing from
the underlying PHP installation.

Let's solve this problem in the next section!

## Installing PHP extensions

Unless otherwise specified, the Product API uses the MySQL driver by default.
Thus far, you've never had to configure a MySQL database for the application, so
now is a good time to do that. For that purpose, you can use the
[official MySQL image](https://hub.docker.com/_/mysql).

With MySQL, you can choose between an innovation and a stable release version.
This is similar to the mainline/stable release strategy employed by NGINX, so
let's stick to using the latest stable MySQL version, which at the time of this
writing is `8.0.36`.

Launching a new MySQL container requires some preliminary setup. Namely, certain
environment variables have to be specified.

Go ahead and create a new file named `mysql.env` with the following contents:

```text
[label mysql.env]
MYSQL_ROOT_PASSWORD=test123
MYSQL_USER=product_api
MYSQL_PASSWORD=test123
MYSQL_DATABASE=product_api
```

Then, launch the MySQL container by typing:

```command
docker run -d --rm --name db --network product-api-network --env-file mysql.env mysql:8.0.36
```

You also need to configure Laravel to communicate with this container.

For that purpose, modify your `laravel.env` file as follows:

```text
[label laravel.env]
APP_DEBUG=true
APP_KEY=base64:a2nQ3bQFHbjU50y1oeeaNxfFpDCsF5t4egS/zEiY5lQ=
[highlight]
DB_HOST=db
DB_USERNAME=product_api
DB_PASSWORD=test123
DB_DATABASE=product_api
[/highlight]
```

Recreate the Product API container, as usual, to pick up the environment
variable changes:

```command
docker stop product-api
```

```command
docker run -d --rm --name product-api --network product-api-network --env-file laravel.env product-api:0.3.0
```

You can now start troubleshooting the `could not find driver` error.

In the PHP world, `could not find driver` is a well-known `PDOException`
message. The [PDO extension](https://www.php.net/manual/en/book.pdo.php) (PHP
Data Objects) supplies a database abstraction layer, providing developers a
unified interface for integrating with databases built by different vendors.
However, each database requires a vendor-specific
[PDO driver](https://www.php.net/manual/en/pdo.drivers.php) to work properly.

By default, the PHP interpreter inside the official PHP image comes pre-compiled
with only the
[PDO SQLite driver](https://www.php.net/manual/en/ref.pdo-sqlite.php) and
nothing more.

You can confirm this by running:

```command
docker exec product-api php-fpm -m
```

The output lists all extensions available to `php-fpm` inside the `product-api`
container:

```text
[output]
[PHP Modules]
cgi-fcgi
Core
ctype
curl
date
dom
fileinfo
filter
hash
iconv
json
libxml
mbstring
mysqlnd
openssl
pcre
[highlight]
PDO
pdo_sqlite
[/highlight]
Phar
posix
random
readline
Reflection
session
SimpleXML
sodium
SPL
sqlite3
standard
tokenizer
xml
xmlreader
xmlwriter
zlib

[Zend Modules]
```

The list confirms that the `pdo_mysql` extension is missing. You need to install
it to be able to communicate with the MySQL container you just created.

Installing and configuring additional extensions for PHP images is a common task
so the base PHP Docker image comes with a rich set of helper scripts that make
the process straightforward.

You can find these scripts at `/usr/local/bin` inside the `product-api`
container:

```command
docker exec product-api ls -Al /usr/local/bin
```

```text
[output]
total 20560
-rwxrwxr-x    1 root     root           122 Feb 16 21:27 docker-php-entrypoint
-rwxrwxr-x    1 root     root          1449 Feb 16 21:27 docker-php-ext-configure
-rwxrwxr-x    1 root     root          2669 Feb 16 21:27 docker-php-ext-enable
-rwxrwxr-x    1 root     root          2963 Feb 16 21:27 docker-php-ext-install
-rwxrwxr-x    1 root     root           587 Feb 16 21:22 docker-php-source
-rwxr-xr-x    1 root     root           817 Feb 16 21:30 pear
-rwxr-xr-x    1 root     root           838 Feb 16 21:30 peardev
-rwxr-xr-x    1 root     root           751 Feb 16 21:30 pecl
lrwxrwxrwx    1 root     root             9 Feb 16 21:30 phar -> phar.phar
-rwxr-xr-x    1 root     root         15242 Feb 16 21:30 phar.phar
-rwxr-xr-x    1 root     root      20989776 Feb 16 21:30 php
-rwxr-xr-x    1 root     root          3024 Feb 16 21:30 php-config
-rwxr-xr-x    1 root     root          4531 Feb 16 21:30 phpize
```

The one you want to use in particular for installing a PHP extension is called
`docker-php-ext-install`. It is invoked as follows:

```command
docker exec product-api docker-php-ext-install pdo_mysql
```

But, besides for testing, there's no point in doing this at runtime. All
required extensions should be part of the final image itself.

If you nevertheless decide to test this at runtime, don't forget that if you
install a new PHP extension while the original `php-fpm` master process is
running, you'll need to force a reload of the PHP configuration afterward to
ensure that the `php-fpm` process picks up the new extension.

This can be done by running either:

```command
docker restart product-api
```

or

```command
docker exec product-api kill -USR2 1
```

Go ahead and update your `Dockerfile` with the desired `docker-php-ext-install`
command:

```text
[label Dockerfile]
FROM composer:2.7.1

FROM php:8.3.3-fpm-alpine3.19

[highlight]
RUN docker-php-ext-install pdo_mysql
[/highlight]

COPY --chown=www-data:www-data . /var/www/html

COPY --from=0 /usr/bin/composer /usr/bin/composer

USER www-data

RUN composer install

USER root
```

Now rebuild the image:

```command
docker build -t product-api:0.4.0 .
```

Stop the old container and replace it with a container using the latest image:

```command
docker stop product-api
```

```command
docker run -d --rm --name product-api --network product-api-network --env-file laravel.env product-api:0.4.0
```

Refresh the `localhost:8080` web page:

![Base table not found error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7f5d6b54-3cb4-4fce-276c-73da62bdea00/public =958x458)

That (almost) worked! The Product API is successfully communicating with the
underlying database, and indeed, a database table seems to be missing, but this
is purely an application error, not related to the Docker image itself.

Before fixing this application error in the next section, let's wrap the current
discussion up by clarifying what `docker-php-ext-install` really does behind the
scenes.

First and foremost, every official PHP image includes the PHP source code
compressed as an XZ archive. The archive is located at `/usr/src/php.tar.xz`,
which you can confirm by running the command below:

```command
docker exec product-api ls -Alh /usr/src
```

```text
[output]
total 12M
-rw-r--r--    1 root     root       11.9M Feb 16 21:22 php.tar.xz
-rw-r--r--    1 root     root         833 Feb 16 21:22 php.tar.xz.asc
```

In PHP, extensions such as `pdo_mysql` can be linked to the main `php-fpm`
binary executable, either statically or dynamically. Static linking means that
the compiled extension is embedded into the `php-fpm` binary itself (increasing
its total size but slightly speeding up script execution times) while dynamic
linking means that the `php-fpm` executable loads the extension at runtime
(after the `php-fpm` master process starts).

When you invoke `docker-php-ext-install`, it orchestrates other helper scripts
to perform the actual installation. This happens in the following sequence:

1. `docker-php-source` extracts the PHP source code from `php.tar.xz` to
   `/usr/php/src`. This exposes the source code of the `pdo_mysql` extension at
   `/usr/src/php/ext/pdo_mysql` inside the container.
2. `docker-php-ext-configure` prepares the PHP build system for compiling the
   `pdo_mysql` extension as a shared library. This brings in all the Linux
   libraries required for the compilation process and generates a `Makefile`
   inside the `/usr/src/php/ext/pdo_mysql` folder.
3. `docker-php-ext-install` starts the compilation through the generated
   `Makefile`. The resulting output is a `pdo_mysql.so` file copied to the PHP
   extension directory reported by `php-config --extension-dir` (e.g.,
   `/usr/local/lib/php/extensions/no-debug-non-zts-20230831`).
4. Finally, `docker-php-ext-enable` creates a new INI file in the directory
   reported by `php-config --ini-dir` (e.g., `/usr/local/etc/php/conf.d`)
   containing an `extension=pdo_mysql.so` directive that informs the `php-fpm`
   master process to load this extension dynamically at runtime.

![docker-php-ext-install orchestration](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e33143bf-1560-4607-66cc-2e20560b4d00/lg2x =769x290)

With all of this clarified, you can proceed to resolve the application error you
encountered (regarding the missing `products` table) in the next section.

## Running database migrations

In the previous section, you encountered an error indicating that a database
table was missing:

![Base table not found error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d2cd3ca1-72a3-4552-6cd0-caa756aa4400/md1x =958x458)

Laravel also suggested that you might have forgotten to run your database
migrations. Indeed, the database you created earlier was never seeded with any
data.

When running apps in production, it's always a good idea to exert strict control
over your migration procedure. Because of that, executing database migrations
should better be done outside the main container serving your application.

For smaller and non-critical applications, migrations can be executed through
manual invocation using a separate container. For larger applications relying on
automated deployment, the migration command may be defined as either an
individual step in the CI/CD pipeline or an entirely separate CI job.

In Laravel, migrations are executed through the `php artisan migrate` command.
Your custom image already includes the `artisan` CLI, so executing the
migrations is as simple as launching a new container with the following command:

```command
docker run -it --rm --name product-api-migrations --network product-api-network  --env-file laravel.env product-api:0.4.0 php artisan migrate
```

The added `-it` option launches the container in interactive mode, as Laravel
will prompt you to confirm the migration since the application is running in
production mode.

An interactive prompt appears, asking you to confirm the migration:

![Pending migration prompt](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/579cefae-430c-4fd0-af63-fa6bf7adf400/md2x =959x255)

Select "Yes" and hit Enter:

![Completed migration output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e6555763-efeb-4c2c-ec09-d90dc23aeb00/md2x =959x423)

The migration completes successfully in a couple of seconds, creating an empty
`products` table inside the `products_api` MySQL database.

For the sake of testing, you can seed this table with some records by running:

```command
docker run -it --rm --name product-api-migrations --network product-api-network  --env-file laravel.env product-api:0.4.0 php artisan db:seed ProductSeeder
```

Please bear in mind, though, that seeding is an operation that should only be
performed locally for testing. Never seed an actual production database with
random data!

A prompt similar to the database migration prompt appears, requesting you to
confirm the operation:

![Pending seed prompt](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/eae52ff5-45ff-4f39-25e5-ccac5a09eb00/md1x =961x245)

Select "Yes" and hit Enter once again:

![Completed seed output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5e6b3191-d86a-4ccb-a7f8-997a85286a00/md1x =961x331)

Now go ahead and refresh `localhost:8080`:

![Seeded application output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6ac506fb-1d57-485a-da8f-4745a5ec2f00/lg1x =960x888)

Congratulations! The application now loads up properly!

## Reducing the image size

At this point, you have a fully working Docker image capable of running your
application code in production.

However, before wrapping this article up, you can perform a small optimization
to reduce the final size of your image. Remember that keeping the total size
small leads to faster deployment times and lower resource usage.

Run the following command:

```command
docker image ls product-api
```

You'll notice that the current size of your image is 165MB.

```text
[output]
REPOSITORY    TAG       IMAGE ID       CREATED      SIZE
product-api   0.4.0     f248952dc850   2 days ago   165MB
product-api   0.3.0     aa2d310eeda2   3 days ago   165MB
product-api   0.2.0     931726fe3518   3 days ago   165MB
product-api   0.1.0     e1ad9dcffccc   3 days ago   83.6MB
```

Earlier, when installing the required Composer packages into the image, you did
so by running `composer install`. However, like all PHP frameworks, Laravel
comes with many development dependencies that are useful while prototyping your
application locally but aren't needed for production. You can easily save some
storage space by removing these dependencies from your final image.

Go ahead and change your `Dockerfile` as follows:

```text
[label Dockerfile]
FROM composer:2.7.1

FROM php:8.3.3-fpm-alpine3.19

RUN docker-php-ext-install pdo_mysql

COPY --chown=www-data:www-data . /var/www/html

COPY --from=0 /usr/bin/composer /usr/bin/composer

USER www-data

[highlight]
RUN composer install --no-dev
[/highlight]

USER root
```

The `--no-dev` option instructs Composer to skip installing development
packages.

Rebuild your image and check its size:

```command
docker build -t product-api:0.5.0 .
```

```command
docker image ls product-api
```

The resulting image is 50MB smaller! A significant improvement.

```text
[output]
REPOSITORY    TAG       IMAGE ID       CREATED          SIZE
product-api   0.5.0     50fea22206db   5 seconds ago    115MB
product-api   0.4.0     f248952dc850   2 days ago       165MB
product-api   0.3.0     aa2d310eeda2   3 days ago       165MB
product-api   0.2.0     931726fe3518   3 days ago       165MB
product-api   0.1.0     e1ad9dcffccc   3 days ago       83.6MB
```

Using the Docker image you created, the Product API can now be easily launched
in a production environment as a Docker container.

## Final thoughts

Congratulations on following through to the end of this article!

You've learned so much! From understanding what a Docker image is and how to
choose one as a base for customization through comprehending important PHP
internals and learning how to install PHP extensions to successfully putting
together a `Dockerfile` and building a fully functional Docker image that runs
an actual PHP application. This was a lot of work, so well done!

Hopefully, all of this knowledge will be of good use in your future projects.
Remember, practice makes perfect, so don't hesitate to experiment with different
images and configurations, and to keep exploring and building on what you've
learned to continue improving your PHP and Docker skills.

Stay tuned for the next part of this series, where you'll learn how to deploy
and operate the Docker image you created in production.

Thanks for reading, and until next time!