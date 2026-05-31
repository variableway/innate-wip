# Switching from Docker Desktop to OrbStack on macOS

For years, Docker Desktop has been the go-to tool for containerization — but let’s be honest, it hasn’t always been smooth sailing. If you're a macOS user, you might have faced [sluggish performance, unexpected crashes](https://www.reddit.com/r/docker/comments/vwq724/wtf_is_up_with_docker_desktop_on_macos), or your computer using many resources.

Fortunately, there's a better way. Enter [OrbStack](https://docs.orbstack.dev/) — a sleek, lightning-fast alternative that addresses many of Docker Desktop’s pain points. OrbStack provides a native macOS experience with faster startup times, efficient resource usage, and features like automatic container domain name assignment. The result? A smoother workflow and a more productive development experience.

This guide walks you through installing OrbStack, migrating from Docker Desktop, and leveraging its features.

[ad-uptime] 

## Prerequisites

Before you start, ensure you have the following:

- Basic familiarity with Docker.
- Homebrew installed on your macOS machine.

## What is OrbStack?

OrbStack is a lightweight and easy-to-use platform that combines container and Linux virtual machine management into a single, streamlined app. Think of it as a supercharged alternative to Docker Desktop built specifically with macOS users in mind.

What makes OrbStack suitable is its fast startup, low CPU and memory usage, optimized networking, and battery-friendly performance. And, it’s simple to use, with features like automatic domain names, seamless file sharing, and built-in debugging tools.

Beyond containers, OrbStack also supports Kubernetes and Linux distributions, allowing you to manage everything you need from one interface. Whether you're debugging, exploring volume files, or running containers, OrbStack makes it all effortless.


## Why switch to OrbStack?

<iframe width="100%" height="315" src="https://www.youtube.com/embed/raUJQms00xY" title="The BEST way to use Docker on MacOS" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


OrbStack offers several advantages over Docker Desktop:

- Faster startup times and better resource utilization.
- Minimal setup, automatic HTTPS, and built-in debugging tools.
- Supports standard Docker CLI, Compose, and third-party tools like VS Code.

Here's how it compares to Docker Desktop:


| Feature                  | OrbStack                              | Docker Desktop                      |
|------------------------------|-------------------------------------------|-----------------------------------------|
| Performance                  | Near-native performance, instant startup | Slower startup, higher resource usage  |
| Resource usage               | Low CPU and memory usage                 | High CPU and memory usage              |
| Networking                   | Automatic domain names, wildcards, HTTPS | Limited networking support             |
| Debugging tools              | Built-in Debug Shell                     | Limited to `docker exec`               |
| File sharing                 | Two-way file sharing                     | One-way file sharing                   |
| GUI                          | Native macOS app                         | Electron-based app                     |
| Pricing                      | Free for personal use, $8/user/month     | Free for personal use, enterprise-tier pricing |

To put these advantages into perspective, the benchmarks speak for themselves. The following screenshot demonstrates that OrbStack performs general tasks approximately 1.3 times faster than Docker Desktop:

![Screenshot of OrbStack benchmarks](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1452f11f-00b7-4a1c-d231-c4eca7dce600/public =3016x1738)

Another benchmark highlights its superiority in building both ARM64 and AMD64 images, where OrbStack proves to be about 1.2 times faster than Docker Desktop:

![Screenshot comparing ARM64 and AMD64 builds](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/365d5751-5b8c-431c-982d-c70751ae7200/md1x =2992x1826)

The advantages extend beyond speed. Resource usage tests show that OrbStack is about 1.7 times more efficient in background power consumption, resulting in quieter fans, extended battery life, and less overall wear on your system.

![Screenshot of resource usage comparison](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bf6d4733-2aef-4b14-6c43-71cc4b9ad400/public =3024x1838)


## Installing OrbStack

Install OrbStack using Homebrew for a quick and hassle-free setup. Open your terminal and run:

```command
brew install orbstack
```

Once installed, launch OrbStack and follow the installation wizard. The interface should look like this when finished:

![Screenshot of the OrbStack interface](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b88a3585-f3eb-4f05-c67b-09a594130100/md2x =2174x1524)

OrbStack includes all necessary tools, including:

- Docker CLI
- Docker Compose
- Compatibility with VS Code Dev Containers

Verify that OrbStack has switched your Docker context by running:

```command
docker context show
```
```text
[output]
orbstack
```

Now that you have installed OrbStack on your machine, you will migrate data from Docker Desktop.

## Migrating data from Docker Desktop

If you’ve been using Docker Desktop, you likely have a range of existing containers, images, and volumes. OrbStack makes it easy to migrate this data and ensures that your existing setup functions smoothly. OrbStack provides a CLI tool called `orb` that allows you to manage various aspects of your Docker environment directly from the command line.

Before proceeding with the migration, it’s a good idea to restart the OrbStack Docker engine to ensure a clean slate. You can do this simply by running:

```command
orb restart docker
```

By taking this step, you help ensure that all your previously running containers, images, and volumes will integrate smoothly into the OrbStack environment.

Then click on **Migrate** in the OrbStack app:

![Screenshot of the OrbStack app showing the "Migrate" option](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6156dd0f-79e6-4380-f294-2795e6a87800/md1x =2174x1524)


Alternatively, you can run the following command:

```command
orb migrate docker
```

The migration may take a few minutes. Once complete, your Docker data will appear in OrbStack.

With the Docker data migrated from Docker Desktop, you can proceed in the next section to learn more about how OrbStack interacts with containers.

## Getting started with OrbStack

After installing OrbStack and migrating your Docker Desktop data, you can now manage containers, images, and volumes through an intuitive graphical interface. Instead of relying solely on the command line, you can interact with your environment directly from the OrbStack application.

Begin by opening the **Images** tab, where you will find all imported or pulled images:

![OrbStack interface showing the Images tab with a list of imported container images](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/322839c8-5543-4258-5f0f-951909de5200/md1x =2174x1524)

You can examine detailed metadata for any image, including tags, labels, and supported architectures, simply by clicking on it:

![OrbStack interface displaying detailed metadata of a selected container image](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/565f2cf5-2645-4bf0-8716-577d85fa4e00/md1x =2174x1524)

If you have many images, use the search feature to quickly locate the one you need:

![OrbStack interface illustrating the search function for filtering container images](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/40c03867-9440-4f1b-86b0-d85716ca2d00/public =2174x1524)

Next, switch to the **Volumes** tab to review and manage your existing volumes:

![OrbStack Volumes tab displaying a list of existing data volumes and their sizes](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/dd919968-617f-4c94-8c21-19cd39bded00/md1x =2174x1524)

Here, you can see how much space each volume occupies and, by clicking on one, view which services are using it as well as when it was created:

![OrbStack volume details panel showing volume creation date and associated services](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/baa9c8f7-9983-4c71-d702-bdae01685900/public =2174x1524)

To view all currently running containers, switch to the **Containers** tab:

![OrbStack Containers tab listing running containers along with their controls for stopping and removing](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/74b5d1b1-88dd-423e-5d5d-0ff48a4e9900/lg2x =2174x1524)

From here, you can easily see how many containers are active. Each container has controls for tasks like stopping or removing it. For example, to pause a container, select the stop button (◼):

![OrbStack interface highlighting the stop button (◼) for halting a running container](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b119fd94-d471-4255-4fbf-0efbb9d9c600/orig =1050x226)

If you need to start a container that is currently stopped, click the start button (▶):

![OrbStack interface showing the start button (▶) for launching a stopped container](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0a4b570f-d2ed-4260-e7f5-9ed8434b7b00/public =1028x220)

### Using the OrbStack menu bar app

OrbStack’s menu bar application provides even faster access to essential features. By clicking the OrbStack icon in your Mac’s menu bar, you can quickly view running containers, images, and volumes:

![OrbStack menu bar app displaying running containers, images, and volumes with quick management actions](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ed19405f-f353-43cd-4a1b-904d8d0c0b00/md1x =458x602)

In the following screenshot, you can see all running services, with options to start or stop them without opening the main interface:

![OrbStack menu bar panel showing a list of running services with start/stop options](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/030bf8e7-3473-4326-1427-a9b6eba5c200/md2x =1298x1674)

With this overview of the OrbStack UI, you are now ready to take advantage of its streamlined environment for managing your containerized applications.


## Automatic container domains
OrbStack simplifies service access by automatically assigning domain names to containers, following the `container-name.orb.local` pattern. Domains are structured as `service.project.orb.local` for Docker Compose projects. 

To access a container’s service, navigate to the **Containers** tab in OrbStack and click the link icon (🔗) associated with the desired container:


![Screenshot of the link icon](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e5644d7d-16d7-452d-c527-658d0c1f5a00/orig =2174x1524)

You’ll also see the ports the container uses, making it easy to know which services are available. Clicking the link icon will open the service interface in your default browser.


![Screenshot of the service interface running](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/53591560-1f29-4329-e38a-43975ee15300/orig =3248x1994)

When you open a container’s web interface in your browser, you’ll notice that the domain name does not include a port number. OrbStack automatically detects standard web ports and routes your service to a user-friendly domain like `https://container-name.orb.local/`, so you don’t need to remember or specify ports for typical web services.

If you need to specify a custom port, OrbStack still allows. In addition, OrbStack handles HTTPS configuration out of the box, including generating and installing certificates for you. There’s no need to spend time setting up a reverse proxy or dealing with self-signed certificates.

Alternatively, visiting `orb.local` in your browser provides an index of all running containers, allowing for easy access to each service:

![Screenshot of a page `orb.local`, which provides an index of all running containers](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/72fb77b2-2b3b-41ee-f07d-415edb3d2a00/md1x =3248x1998)


If you need even more flexibility, OrbStack allows you to configure custom domains and wildcards, making it easy to mirror your production environment or use domain structures that suit your workflow.

For example, to assign custom domains to a container, add the `dev.orbstack.domains` label. Suppose you want your `nginx` container to respond to both `foo.local` and `bar.local`:

```command
docker run --rm -l dev.orbstack.domains=foo.local,bar.local nginx
```

Or with a `docker-compose.yml` file:

```yaml
services:
  nginx:
    image: nginx
    labels:
      - dev.orbstack.domains=foo.local,bar.local
```

OrbStack also supports wildcard domains. For instance, setting `dev.orbstack.domains=*.foo.local,*.bar.local` allows any subdomain of `foo.local` and `bar.local` to resolve to your container. This can be especially useful for microservices architectures or multi-tenant scenarios with numerous subdomains.


## Inspecting logs and files with OrbStack

OrbStack allows you to inspect logs and access files directly from its intuitive interface. These features are essential for troubleshooting issues, monitoring container activity, and maintaining control over your containerized applications.

To view logs, open the OrbStack application and navigate to the **Containers** tab. Select the container you want to inspect, and in the right sidebar, click **Logs**:

![Screenshot showing the container selected and the "Logs" button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/aa6f1e44-65c4-41ed-a070-3b728d6bf900/md2x =2174x1524)

This opens a real-time view of the container’s output, showing critical information such as application errors, startup details, or runtime messages:

![Screenshot showing logs](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9c426385-789b-4741-615c-bf7991525800/md2x =1824x1424)

Logs can help diagnose issues quickly, such as identifying missing dependencies or configuration errors that prevent a container from starting successfully. 


OrbStack also allows you to access and manage container files directly from macOS. Select the container in the same **Containers** tab and click the **Files** button in the sidebar. 

![Screenshot of the **Files** button in the sidebar](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9bfac123-9c8f-44d1-5cd9-89b8d26ef300/lg2x =2174x1524)

This action opens the container’s file system in Finder, where you can view, edit, add, or delete files: 

![Screenshot of Finder displaying a container’s file directory](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a6eccb60-5638-43e9-ace1-e6dd856eb100/public =2206x1590)

With that, let's look at how to debug containers with OrbStack.


## Debugging containers
OrbStack’s Debug Shell makes container debugging effortless with a built-in terminal environment that outshines the traditional `docker exec` command found in Docker Desktop. Its features are tailored to enhance troubleshooting and performance optimization, even for minimal or distroless containers without built-in commands or shell environments. Key features include:

- Access powerful utilities like `htop`, `curl`, `strace`, and `ip` directly from the Debug Shell.
- Shell auto-completion and syntax highlighting
- Integrated editors like `nano` or `vim` for in-container file editing
- Colorful output
- Built-in package manager that can install over 80,000 packages using the `dctl` command or through auto-install prompts
- Support for minimal containers

With these features, OrbStack’s Debug Shell provides unmatched flexibility and functionality, making it an invaluable tool for debugging and managing containers effectively.


This feature is handy for troubleshooting and optimizing performance, even for minimal or distroless containers that lack built-in commands or shell environments.

To start a Debug Shell, you can click the **Debug** button in the OrbStack app:

![Screenshot of the Debug button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/235f7697-dbed-4364-c7ba-cbeb248f1400/orig =2174x1524)

Alternatively, you can open the Debug Shell directly from the terminal using the following command:

```command
orb debug <container name or ID>
```

This launches a terminal session inside the selected container, giving you instant access to tools and utilities without modifying the container itself. Here’s how the Debug Shell appears:

![Screenshot of the terminal](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/73093ad2-4707-4473-bcad-964424d99800/public =1404x1170)

For instance, if you need to monitor resource usage or pinpoint processes consuming excessive CPU or memory, you can run `htop`:

```command
htop
```

Here is an example of the Debug Shell running `htop`:

![Screenshot of Debug Shell terminal with htop running, showing active processes and resource usage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a67dfc48-ad41-45f3-f07e-052dd0903a00/lg1x =1404x1170)

As mentioned, OrbStack’s Debug Shell goes far beyond Docker Desktop’s `docker exec` by including features such as colorful `ls` output, editors like `vim` and `nano`, and access to a wide range of commands like `curl`, `strace`, and `ip`. It even allows package installation with the `dctl` command. For example, you can install and run Neovim with:

```command
dctl install nvim
```

The screenshot below demonstrates Neovim being installed in OrbStack’s Debug Shell using the built-in package manager:

![Screenshot showing `nvim` being installed](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e74639a1-a4b3-4e29-d142-bdc7a9fbbd00/lg2x =1404x1170)

Once installed, Neovim can be launched directly within the Debug Shell for efficient in-container editing. Here’s an example of Neovim running in the terminal:

![Screenshot showing neovim opened](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/86ab28df-440e-4b6f-97b0-f16cc5446100/md2x =1404x1170)

OrbStack simplifies package management further. If a command isn’t found, the Debug Shell will automatically prompt you to install the necessary package.

Installed packages remain available across all containers within the Debug Shell environment, without altering the container itself, ensuring that even read-only containers remain debuggable.
 
## Using Linux machines

OrbStack isn’t limited to containers—it can also run full Linux machines that integrate seamlessly with macOS. These machines behave similarly to traditional VMs, but with significantly less overhead, offering a near-native experience.

To create a new Linux machine, open the **Linux Machines** tab in the OrbStack app and click **New Machine**:

![Screenshot of the Linux Machines tab and New Machine button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3920b504-2769-4919-7b62-7bf13d0b3a00/md2x =2174x1524)

A dialog will appear where you can specify the machine’s name, distribution, version, and CPU type. After entering your details, click **Create**:

![Screenshot of the machine creation dialog in OrbStack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1c820741-2409-4357-17d7-b5a2fd15f400/orig =2174x1524)

Once the machine is ready, you can open a terminal session directly into it:

![Screenshot of a terminal session opened inside a Linux machine](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9998b50f-966d-4e7c-7a0b-60ace54b1300/orig =1404x1170)

From here, installing packages and managing services works exactly as it does in a typical Linux environment:

![Screenshot of package installation in a Linux machine](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/95839fb5-666d-4e38-5dcb-d6cffa40ca00/lg2x =1628x1748)

Your Mac’s files are also accessible from within the Linux machine, allowing for effortless file sharing. Clicking the **Folder** icon in the OrbStack interface opens Finder:

![Screenshot showing the folder icon to open Finder](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2753fb00-d8db-41eb-9e7d-619d9842ed00/lg2x =2174x1524)

Inside the machine, you’ll find your Mac’s files mounted under `/mnt/linux`. You can view and modify the machine’s filesystem directly from Finder, just as you did with containers:

![Screenshot of Finder displaying a Linux machine’s filesystem](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/439a4fec-653c-4bf8-b057-3e29e5b7a600/lg1x =2064x1096)

## Final thoughts
This guide provided step-by-step instructions on installing OrbStack, migrating from Docker Desktop, and using its powerful features to enhance your containerization experience. 


OrbStack represents a significant improvement in container and Linux VM management for macOS users, addressing many of the performance and usability issues commonly associated with Docker Desktop. 


To continue learning more about Docker, see our [tutorial series](https://betterstack.com/community/guides/scaling-docker/)