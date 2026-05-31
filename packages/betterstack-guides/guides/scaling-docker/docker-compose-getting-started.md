# A Beginner's Guide to Docker Compose

Docker Compose is a tool used for defining and managing multi-container Docker
applications, automating the process of building, running, and linking multiple
services like web servers, databases, and caching services.

It simplifies running complex applications by allowing you to start all
necessary services with a single command, ensuring proper sequence and
communication between them.

Docker Compose operates in two modes: standalone mode and Docker Swarm mode,
each with unique features. This guide focuses primarily on the standalone mode,
covering installation, basic setup, and usage for deploying full stack
applications.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/cyGF_PLBx4c" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Prerequisites

To follow along in this tutorial, ensure that you meet the following
requirements:

- You should have a good understanding of Docker and its various commands.
- You should be proficient in using the Linux command-line interface.

Please note, all the commands in this article have been tested and verified on a
fresh installation of Ubuntu 22.04.

[ad-logs-small]

## Step 1 — Setting up a demo application

To effectively grasp the concepts we'll explore in this guide, we'll prepare a
full-stack application to illustrate the functionality of Docker Compose.

In this tutorial, you'll engage with a Todo List application built using Vue.js.
This application interacts with a Node.js API, which subsequently manages data
in a MongoDB database.

Start by forking the GitHub repository available at
[this link](https://github.com/betterstack-community/docker-compose-tutorial).
After forking, clone the repository to your local system using the following Git
command:

```command
git clone git@github.com:betterstack-community/docker-compose-tutorial.git
```

Next, navigate into the repository and open it in your preferred code editor
with these commands:

```command
cd docker-compose
```

```command
code .
```

This repository consists of two main directories: `frontend` and `backend`. The
former houses a VueJS application, while the latter directory includes a Node.js
API.

Verify the contents of the repository by running:

```command
tree
```

```text
[output]
.
├── backend
│   ├── Dockerfile
│   ├── index.js
│   ├── Models
│   │   └── Todo.js
│   ├── package.json
│   └── package-lock.json
└── frontend
    ├── Dockerfile
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── public
    │   └── favicon.ico
    ├── README.md
    ├── src
    │   ├── App.vue
    │   ├── components
    │   │   └── TodoList.vue
    │   ├── index.css
    │   └── main.js
    └── vite.config.js

6 directories, 16 files
```

The demo application operates as follows:

- The Node.js server establishes endpoints for creating, listing, updating, and
  deleting todo items. It also connects to a MongoDB database for storing these
  items.

- The Vue.js application utilizes the Todo API endpoints to perform create,
  list, update, and delete operations on Todos.

- Both the `frontend` and `backend` directories contain a Dockerfile, which
  includes instructions for building the respective application images.

Next, you'll install Docker and Docker Compose.

## Step 2 — Installing Docker and Docker Compose

To utilize Docker and Docker Compose in your project, you need to install them
first. You can install Docker through Docker Desktop or Docker Engine.
Depending on your operating system, follow the appropriate links for installing
Docker Desktop:

- [Windows](https://docs.docker.com/desktop/install/windows-install/).
- [macOS](https://docs.docker.com/desktop/install/mac-install/).
- [Linux](https://docs.docker.com/engine/install/binaries/#install-static-binaries)

Before proceeding to the next section, confirm that both Docker and Docker
Compose are installed using the commands below:

```command
docker --version
```

```text
[output]
Docker version 24.0.6, build ed223bc
```

```command
docker compose version
```

```text
[output]
Docker Compose version v2.21.0
```

## Step 3 — Configuring Docker Compose

Docker Compose uses a YAML file with a declarative syntax to define the
components of your application, including services, configurations, and
dependencies. This file specifies container images, environment variables,
network settings, and volume mounts.

Typically, Docker Compose searches for a file named `docker-compose.yml` in
the current directory. If you use a different name, you must point to it using
the `-f` or `--file` flag in Docker Compose commands.

Begin by creating a `docker-compose.yml` file at your project's root directory
with the following configuration:

```yaml
[label docker-compose.yml]
version: '3.8'

services:

  frontend:
    build: ./frontend
    ports:
      - "5173:80"
    networks:
      - my-network
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    networks:
      - my-network
    depends_on:
      - database

  database:
    image: mongo
    volumes:
      - mongodb_data:/data/db
    networks:
      - my-network


networks:
  my-network:

volumes:
  mongodb_data:
```

This configuration includes:

- `version`: The version of the
  [Compose specification](https://github.com/compose-spec/compose-spec/blob/master/spec.md),
  here it is 3.8.

- `services`: Defines the application services. In this example, there are three
  services:

  1. `frontend`:
     - Built from the Dockerfile in the `frontend` directory.
     - Maps container port 80 to host port 5173.
     - Depends on `backend`.
     - Uses `my-network` for communication.
  2. `backend`:
     - Built from the Dockerfile in the `backend` directory.
     - Maps container port 3000 to the same port on the host.
     - Depends on database.
     - Uses `my-network` for communication.
  3. `database`:
     - Uses the official MongoDB image.
     - Mounts `mongodb_data` volume to `/data/db` in the container.
     - Uses `my-network` for communication.

- `networks`: Defines a custom network (`my-network`) for inter-service
  communication.

- `volumes`: Declares the `mongodb_data` volume for persistent data storage,
  allowing for easier management independent of Docker commands.

## Step 4 — Building and running services with Docker Compose

With your `docker-compose.yml` file ready, it's time to build and run your
services using Docker Compose, as detailed in this section.

Execute the following command:

```command
docker compose up
```

This command builds or pulls the images for your services and launches them as
Docker containers. The expected output will look like this:

```text
[output]
[+] Running 4/4
 ✔ Network docker-compose_my-network    C...                                     0.1s
 ✔ Container docker-compose-database-1  Created                                  0.1s
 ✔ Container docker-compose-backend-1   Created                                  0.0s
 ✔ Container docker-compose-frontend-1  Created                                  0.1s
Attaching to docker-compose-backend-1, docker-compose-database-1, docker-compose-frontend-1
...
docker-compose-backend-1   | MongoDB connected
docker-compose-database-1  | {"t":{"$date":"2023-10-11T22:22:24.511+00:00"},"s":"I",  "c":"NETWORK",  "id":22943,   "ctx":"listener","msg":"Connection accepted","attr":{"remote":"172.30.0.3:43190","uuid":{"uuid":{"$uuid":"32276766-6e59-48ba-afbf-5db8b7d7d3d5"}},"connectionId":2,"connectionCount":2}}
docker-compose-database-1  | {"t":{"$date":"2023-10-11T22:22:24.516+00:00"},"s":"I",  "c":"NETWORK",  "id":51800,   "ctx":"conn2","msg":"client metadata","attr":{"remote":"172.30.0.3:43190","client":"conn2","doc":{"driver":{"name":"nodejs|Mongoose","version":"5.9.0|7.6.1"},"platform":"Node.js v18.18.0, LE","os":{"name":"linux","architecture":"x64","version":"6.2.0-31-generic","type":"Linux"}}}}
...
```

In the above output, containers for `frontend`, `backend`, and database services
are named `docker-compose-frontend-1`, `docker-compose-backend-1`, and
`docker-compose-database-1`, respectively.

To check the running containers, use:

```command
docker compose ps
```

This displays the running Docker containers, the service names, listening ports,
and other relevant information:

```text
[output]
NAME                        IMAGE                     COMMAND                                          SERVICE    CREATED         STATUS         PORTS
docker-compose-backend-1    docker-compose-backend    "docker-entrypoint.sh npm start"                 backend    2 minutes ago   Up 2 minutes   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp
docker-compose-database-1   mongo                     "docker-entrypoint.sh mongod"                    database   2 minutes ago   Up 2 minutes   27017/tcp
docker-compose-frontend-1   docker-compose-frontend   "/docker-entrypoint.sh nginx -g 'daemon off;'"   frontend   2 minutes ago   Up 2 minutes   0.0.0.0:5173->80/tcp, :::5173->80/tcp
```

Access the Vue.js app by visiting `http://localhost:5173/` in your browser. Add
a new todo item to verify that everything is functioning correctly.

![1.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/52687bbe-7fda-4614-8fc3-d37dfcf55900/orig =3200x1334)

To view the logs for any of the services, use:

```command
docker compose logs <service-name>
```

For example, to view MongoDB logs:

```command
docker compose logs database
```

You'll see logs similar to these:

```text
[output]
docker-compose-database-1  | {"t":{"$date":"2023-10-11T22:22:35.024+00:00"},"s":"I",  "c":"NETWORK",  "id":51800,   "ctx":"conn3","msg":"client metadata","attr":{"remote":"172.30.0.3:44760","client":"conn3","doc":{"driver":{"name":"nodejs|Mongoose","version":"5.9.0|7.6.1"},"platform":"Node.js v18.18.0, LE","os":{"name":"linux","architecture":"x64","version":"6.2.0-31-generic","type":"Linux"}}}}
```

Once you are done, press `CTRL-C` in the terminal running docker compose up to
gracefully shut down all containers:

```text
[output]
^CGracefully stopping... (press Ctrl+C again to force)
Aborting on container exit...
[+] Stopping 3/3
 ✔ Container docker-compose-frontend-1  Stopped                                   0.3s
 ✔ Container docker-compose-backend-1   Stopped                                  10.3s
 ✔ Container docker-compose-database-1  Stopped                                   0.3s
canceled
```

This completes the orchestration of a full-stack application with Docker
Compose.

## Final thoughts

In this tutorial, we provided a comprehensive guide to using Docker Compose, a powerful tool for managing multi-container Docker applications. 

Through this article, you've learned how to set up, configure, and manage a full-stack application with multiple interdependent services. For further exploration, see the [Docker Compose documentation](https://docs.docker.com/compose/).

Happy containerizing!