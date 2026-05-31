# Docker Security: 14 Best Practices You Should Know

Docker has revolutionized the way developers build, package, and deploy
applications. Its lightweight containerization technology has become an integral
part of modern software development and deployment pipelines.

However, as with any powerful and widespread tool, Docker has its own set of
security challenges. Ensuring the security of Docker containers is not just a
matter of fortifying the application but involves a comprehensive approach
encompassing the entire ecosystem.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/CelLibFSDoo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

This article delves into the best practices for Docker security, offering a
guide to safeguarding your containerized environments. Our aim is to provide you
with a detailed guide to not only understand the potential security pitfalls in
Docker but also to equip you with the knowledge and tools to address them
effectively.

By implementing these best practices, you will ensure that your Docker
deployments are robust, resilient, and ready to meet the challenges of securing
modern applications.

[summary]
## Side note: Monitor your Docker containers in production

Head over to [Better Stack](https://betterstack.com/uptime) and start monitoring your Docker containers and services. Get instant alerts when containers crash, restart unexpectedly, or become unhealthy.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/YUnoLpCy1qQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[/summary]

## Understanding Docker's security model

Before you can effectively secure your containerized applications, you need to
have a good grasp of
[Docker's security model](https://docs.docker.com/engine/security/). Docker's
approach to security is distinct from traditional virtualization methods,
primarily due to its reliance on the host OS kernel.

Here's an overview of the key elements of its security model:

1. **Kernel Namespaces**: Docker leverages kernel namespaces for process
   isolation. This means each container operates in its own namespace, isolating
   its processes and system resources (like network interfaces and mount points)
   from other containers and the host.

2. **Control Groups (Cgroups)**: Cgroups play an important role in managing and
   limiting container resource usage. They help prevent denial-of-service
   attacks by allocating resources fairly among containers, ensuring that
   excessive resource use by one container doesn't impact others.

3. **Docker Daemon Security**: The Docker daemon requires root privileges by
   default, making it necessary to restrict access to trusted users. Docker's
   REST API endpoint, used for communication, has evolved to enhance security,
   utilizing either a UNIX socket or HTTPS with certificate-based security

4. **Linux Kernel Capabilities**: Docker restricts the capabilities of
   containers, meaning even root-level access within a container is less
   privileged than on the host system. This capability system allows specific
   privileges without full root access, reducing the risk of significant damage
   if an attacker gains root access within a container.

5. **Docker Content Trust Signature Verification**: Docker Engine can be
   configured to run only signed images, enhancing security through image
   signature verification. This feature, set up in the Docker configuration file
   (`daemon.json`), gives you control over enforcing security policies related
   to image usage.

6. **User Namespaces**:
   [Docker's User Namespaces](https://integratedcode.us/2015/10/13/user-namespaces-have-arrived-in-docker/)
   feature maps the container's root user to a non-root user on the host,
   mitigating the risk of container breakout. While not enabled by default, this
   feature is beneficial for containers that need root privileges, offering an
   additional layer of security.

## Docker security best practices: Impact vs. Difficulty

Now that you have a foundational understanding of Docker's security model, let's
explore some best practices to fortify your Docker environment.

The following table offers a comparative analysis of the impact and
implementation difficulty for each practice. Following the table, we will
elaborate on each practice and provide guidance for integrating them into your
Docker setup.

|                                                         | Impact     | Difficulty |
| ------------------------------------------------------- | ---------- | ---------- |
| 1. Use official images                                  | ⭐⭐⭐⭐   | ⭐⭐       |
| 2. Pin Docker image versions                            | ⭐⭐⭐     | ⭐⭐       |
| 3. Keep Docker and its host up to date                  | ⭐⭐⭐⭐   | ⭐⭐⭐⭐   |
| 4. Minimize image size and layers                       | ⭐⭐⭐     | ⭐⭐       |
| 5. Run containers with the least privileges             | ⭐⭐⭐⭐   | ⭐⭐⭐     |
| 6. Implement network segmentation                       | ⭐⭐⭐⭐   | ⭐⭐⭐⭐   |
| 7. Keep sensitive data secure                           | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     |
| 8. Lint your Dockerfiles at build time                  | ⭐⭐⭐⭐   | ⭐⭐       |
| 9. Don't expose the Docker daemon socket                | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   |
| 10. Limit container resource usage                      | ⭐⭐       | ⭐⭐       |
| 11. Run Docker in rootless mode                         | ⭐⭐⭐     | ⭐⭐⭐⭐   |
| 12. Scan images for vulnerabilities                     | ⭐⭐⭐⭐   | ⭐⭐       |
| 13. Verify image authenticity with Docker Content Trust | ⭐⭐⭐     | ⭐⭐⭐     |
| 14. Collect and monitor Docker logs                     | ⭐⭐⭐⭐   | ⭐⭐⭐     |

## 1. Use official images

Utilizing
[official Docker images](https://hub.docker.com/search?q=&type=image&image_filter=official)
is critical for maintaining security, as these images are regularly updated and
patched by reliable entities. This approach significantly lowers the risk of
deploying containers with existing vulnerabilities or malicious code.

The use of official images brings several key benefits. They are regularly
updated for security, originate from verified sources, and are trusted widely
within the Docker community. Their extensive usage and the large community
actively examining them contribute to the quick discovery and rectification of
any potential security issues.

Implementing this practice is straightforward, as it mainly involving the
selection of official images from Docker Hub or other trusted sources for your
container builds.

![docker-official-images.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8127bca3-1c66-4216-db43-ed91523f6300/md1x =2878x1498)

## 2. Pin Docker image versions

To mitigate risks in your Docker containers, it's important to use specific
image versions instead of the `latest` tag. Unspecified versions can lead to
unintentionally deploying containers with known vulnerabilities.

Pinning specific versions allows for predictable builds, controlled updates, and
a more thorough evaluation of security patches. For instance, in your Dockerfile
or when running containers, explicitly specify the version:

```docker
FROM nginx:1.21.3
```

Or when running a container:

```command
docker run -d --name my-container nginx:1.21.3
```

This approach guarantees the use of the Nginx 1.21.3 image, unlike the `latest`
tag, which may not always be the newest version and can lead to
unpredictability.

Regularly updating pinned versions requires a systematic approach, including
testing new versions for compatibility and security. Tools like
[Diun](https://github.com/crazy-max/diun) for notification of base image updates
and [Watchtower](https://github.com/containrrr/watchtower) for automated
container updates can streamline this process.

## 3. Keep Docker and its host up to date

Regularly updating Docker and its components is necessary for maintaining
security. These updates address vulnerabilities in Docker, providing essential
security patches and bug fixes to protect containerized applications from known
threats.

Since containers share the kernel with the host (unlike in virtual machines),
updating the host system is also important to protect against kernel-level
exploits that could compromise the host when executed inside a container.

## 4. Minimize image size and layers

Smaller Docker images mean a smaller attack surface, reducing potential
vulnerability exploitation. They also allow for quicker security scanning,
speeding up vulnerability detection and remediation. Additionally, these images
use resources more efficiently, helping guard against resource exhaustion
attacks.

### Tips for image size and layer reduction

1. **Choose a minimal base image**: Opt for the smallest base image possible,
   like Alpine Linux for compactness and security.

2. **Implement multi-stage builds**:
   [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
   separate the build and runtime environments, producing smaller final images
   by excluding unnecessary files.

3. **Utilize .dockerignore**: Use `.dockerignore` to exclude non-essential files
   from the Docker build context, further reducing image size.

Consider this Dockerfile for a Go application:

```dockerfile
# Builder stage: building the executable
FROM golang:1.20.8-alpine as builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o myapp

# Final stage: build the container to run
FROM scratch as final

COPY --from=builder /app/myapp /
```

This setup involves two stages:

1. **Builder stage**: Compiles the Go app into a statically linked binary using
   an official Alpine-based Go image.

2. **Final stage**: [Scratch](https://hub.docker.com/_/scratch) is an empty
   image, so it can be used for statically linked binaries that do not require
   libc.

This method results in a compact, secure final image with just the necessary
binary, embodying Docker's best practices for security and efficiency.

## 5. Run containers with the least privileges

Operating Docker containers in
[privileged mode](https://docs.docker.com/engine/reference/commandline/run/#privileged)
introduces considerable security risks due to the nearly unrestricted access
they gain to the host system. This access heightens the likelihood of privilege
escalation, enlarges the attack surface, and poses risks to data integrity.

While privileged mode is useful for scenarios such as legacy application
compatibility, hardware interfacing, or kernel operations, its significant
security implications suggest that it should be employed only when absolutely
essential.

In addition to avoiding privileged mode, implement the following practices to
tighten the security of your Docker containers.

- **Set filesystem and volumes to read-only**: Set your container's filesystem
  to
  [read-only](https://nickjanetakis.com/blog/docker-tip-55-creating-read-only-containers)
  to prevent runtime modifications. Use the `--tmpfs` flag for selective write
  access in areas that require it, balancing security with functional needs.

  ```command
  docker run --read-only --tmpfs /tmp ubuntu sh -c 'echo "whatever" > /tmp/file'
  ```

  You can also mount volumes as read-only by appending `:ro` to the `-v` like
  this:

  ```command
  docker run -v volume-name:/path/in/container:ro ubuntu
  ```

- **Prevent privilege escalation**: Include measures to hinder privilege
  escalation within the container. For example, you can use
  `--security-opt=no-new-privileges` in order to prevent using `setuid` or
  `setgid` to escalate privileges.

- **Limit Linux capabilities**: You can minimize the Linux capabilities assigned
  to the root user in the Docker container by dropping all privileges with
  `--cap-drop=all`, and only explicitly adding the capabilities you need using
  `--cap-add`. See
  [this article](https://www.redhat.com/en/blog/secure-your-containers-one-weird-trick)
  for more details.

## 6. Implement network segmentation

In Docker, the default network setting permits unrestricted communication
between containers (using the
[default bridge network](https://docs.docker.com/network/drivers/bridge/#use-the-default-bridge-network)).
Implementing network segmentation is necessary to mitigate these risks and
control the communication flow within your containerized infrastructure.

Network segmentation ensures isolation of container communications, reducing
attack vectors, protecting sensitive workloads, and enforcing access controls to
thwart unauthorized interactions. Even if a container is compromised, attacker's
activities will be confined to it thereby protecting the larger system.

To effectively implement network segmentation in Docker, follow these practices:

- Use
  [custom bridge networks](https://docs.docker.com/network/network-tutorial-standalone/#use-user-defined-bridge-networks)
  to isolate and apply network policies to specific containers.

- Connect each container to the intended network to control their communication
  pathways.

  ```command
  docker run --network mynetwork mycontainer
  ```

- Employ
  [network isolation techniques](https://docs.docker.com/network/packet-filtering-firewalls/),
  like configuring `iptables` rules, to restrict container interactions and
  shield them from unauthorized external access.

- For more advanced features, consider third-party solutions like
  [Calico](https://www.tigera.io/blog/transforming-container-network-security-with-calico-container-firewall),
  which provide comprehensive network security and management capabilities,
  particularly beneficial in complex Docker setups.

Through these strategies, network segmentation in Docker becomes a powerful tool
to enhance the overall security posture of your containerized systems.


[summary]
## Side note: Trace container performance with eBPF

See exactly what's happening inside your Docker containers without agents or instrumentation. [Better Stack](https://betterstack.com/tracing) uses eBPF-based distributed tracing to capture every API call, database query, and network request—with zero performance overhead.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/wQKjCDD7nfk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## 7. Keep sensitive data secure

Docker offers a
[secrets management system](https://docs.docker.com/engine/swarm/secrets/) in
Swarm mode, enabling secure storage and handling of sensitive data. However,
this feature is exclusive to swarm services and not applicable to standalone
containers.

When not using Docker Swarm, here are alternative approaches for managing
sensitive data in your containerized environment:

1. **Environment variables**: For Docker Compose users, sensitive data can be
   stored in environment files and loaded when running services. Ensure these
   files are excluded from your build context with `.dockerigonre`.

2. **External secrets management tools**: Tools like
   [HashiCorp Vault](https://developer.hashicorp.com/hcp/docs/vault-secrets/integrations/docker)
   or
   [AWS Secrets Manager](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html)
   offer advanced features for storing and retrieving secrets, which can be
   integrated with Docker containers.

3. **Configuration management systems**: Using systems like Ansible, Puppet, or
   Chef, sensitive data can be managed in encrypted configuration files, then
   deployed and managed on containers. To ensure the security of credentials,
   tools like
   [Deepfence SecretScanner](https://github.com/deepfence/SecretScanner) can be
   used to detect unprotected secrets in images.

## 8. Linting your Dockerfiles at build time

Adhering to best practices while crafting the Dockerfile can avert numerous
issues. Incorporating a security linter into the build pipeline is a highly
effective step in preventing potential complications down the line.

Once such linter is [hadolint](https://github.com/hadolint/hadolint). It can
scan your local Dockerfiles and integrated into your CI pipeline to ensure
consistent checks at build time.

```command
docker run --rm -i hadolint/hadolint < Dockerfile
```

![hadolint.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a6336216-abc6-44a3-9ba1-47269b4a7700/lg2x =1206x186)

## 9. Don't expose the Docker daemon socket

Securing the Docker daemon socket is essential for the safety of your Docker
environment. The Docker daemon usually communicates through a non-networked UNIX
socket, but it can also use SSH or a TLS (HTTPS) socket, which offers enhanced
security.

Exposing the Docker daemon socket to running containers allows you to invoke the
Docker API from your container to start/stop/build images/containers as if
calling those commands on the host.

```command
docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock docker sh
```

However, it introduces significant security risks and becomes a potential
gateway for attackers to access and control your Docker host. This could lead to
unauthorized command execution, compromising sensitive data like Docker secrets
and API keys.

In production settings, you need to
[protect the Docker daemon socket](https://docs.docker.com/engine/security/protect-access/)
and have your containers communicate with it over either SSH or HTTPS.

## 10. Limit container resource usage

Limiting container resource usage is a key practice for preventing resource
exhaustion, Denial of Service (DoS) attacks, and maintaining fair resource
distribution across containers.

You can limit memory, CPU, maximum number of restarts, maximum number of file
descriptors and maximum number of processes accordingly using various methods
depending on your setup and tools.

When running containers using the `docker run` command, there are
[several flags available](https://docs.docker.com/config/containers/resource_constraints)
to establish resource constraints right at the container's startup.

Similarly, when using Docker Compose, resource limits can be defined directly
within the `docker-compose.yml` file, and container orchestrators like
Kubernetes also let you specify resource limits within their deployment
configurations.

## 11. Run Docker in rootless mode

Docker's rootless mode is a notable security enhancement that graduated from
experimental status in Docker Engine v20.10.

It significantly reduces the potential attack surface area by ensuring that the
Docker daemon and containers are running as an unprivileged user. This means
that even if an attacker breaches the container's security, they would not
possess root access on the host system.

Keep in mind that using rootless mode comes with some
[limitations](https://docs.docker.com/engine/security/rootless/#known-limitations).
You can read more about them, and find the installation and usage instructions
on the
[Docker documentation page](https://docs.docker.com/engine/security/rootless/).

## 12. Scan images for vulnerabilities

Scanning Docker images using static analysis tools is useful for detecting
containers with known vulnerabilities. Once issues are found, they can be
addressed by updating dependencies, applying patches, or switching to safer base
images.

Here are some highly-regarded tools you can explore for this purpose:

- [Clair](https://github.com/coreos/clair)
- [ThreatMapper](https://github.com/deepfence/ThreatMapper)
- [Snyk](https://snyk.io/)
- [Docker Bench for Security](https://github.com/docker/docker-bench-security)
- [SecretScanner](https://github.com/deepfence/SecretScanner)

## 13. Use Docker Content Trust to verify image authenticity

[Docker Content Trust](https://docs.docker.com/engine/security/trust/) (DCT) is
a security feature in Docker that ensures the authenticity and integrity of
container images using digital signatures. It associates these signatures with
image tags, allowing users to verify both the integrity and the publisher of
images from Docker registries.

Some key aspects of DCT include:

- **Image tag signatures**: DCT focuses on the "TAG" part of an image
  identifier, with publishers using keys to sign specific image tags. A
  repository can have a mix of signed and unsigned tags, offering flexibility
  for publishers.

- **Consumer usage**: For consumers, enabling DCT means that `docker` CLI
  commands that operate on tagged images (like `build`, `create`, `pull`, or
  `run`) will require content signatures or explicit content hashes.

- **Key management**: Managing trust keys involves securing the offline root
  key, using repository keys for tag signing, and server-managed keys for
  additional security.

- **Trust verification**: Users can inspect trust data with
  `docker trust inspect` to see signature details for tags or repositories.

In summary, DCT not only secures the transfer and use of Docker images but also
aids in preventing the deployment of tampered or malicious images, significantly
bolstering the overall security posture.

## 14. Collect and monitor Docker logs

[Collecting Docker daemon logs](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/#step-10-managing-docker-daemon-logs)
is instrumental in identifying and responding to security incidents. These logs
offer comprehensive insights into Docker's system-level operations, encompassing
critical aspects such as container lifecycle events, network configurations,
image management, and incoming API requests.

Monitoring these logs helps with detecting unusual activities or changes in
containers and networks, which could indicate unauthorized access or potential
security breaches.

![Better Stack log management dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/66a5d122-d14b-41e8-70c3-ba654e6dfa00/lg2x =2226x934)

With [Better Stack](https://betterstack.com/logs/), you can
get alerted to such issues quickly aiding in prompt recovery before it gets out
of hand.


<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


**Learn more**: [A Complete Guide to Logging in
Docker](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/)

## Final thoughts

In this guide, we covered several essential Docker best practices to help you
secure your containerized environment. These practices not only improve security
but also the efficiency and reliability of Docker-based solutions.

Remember, implementing these practices is just the beginning of your security
journey. Continually updating your security knowledge, staying alert to new
vulnerabilities, and prioritizing security in your development process are
crucial steps to maintaining robust protection.

For further exploration, see the
[official Docker security docs](https://docs.docker.com/engine/security/), this
list of
[Docker security resources](https://github.com/myugan/awesome-docker-security),
and our other [Docker guides](https://betterstack.com/community/guides/scaling-docker/).

Thanks for reading!