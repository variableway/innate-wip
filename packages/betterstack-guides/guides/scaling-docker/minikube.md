# A Guide to Local Kubernetes Development with Minikube

[Minikube](https://minikube.sigs.k8s.io/) allows developers to create a
single-node [Kubernetes cluster](https://betterstack.com/community/guides/scaling-docker/kubernetes/) on their local machine. It's an
essential tool for anyone who wants to learn, develop, or test Kubernetes-based
applications without the need for a complete multi-node cluster or cloud
resources.

Minikube offers significant advantages over traditional Kubernetes setups. Its
minimal resource footprint means you can run a functional Kubernetes environment
on your laptop without overwhelming your system.

This allows for rapid creation and deletion of test environments, making it
ideal for iterative development. You can validate your configurations and
deployments locally before committing them to production clusters, saving both
time and potential headaches.

Perhaps most importantly, Minikube provides an approachable way to learn
Kubernetes concepts. Instead of being overwhelmed by the complexity of a full
cluster, you can focus on understanding core concepts in a simplified
environment that still adheres to Kubernetes principles.

[ad-logs]

## Prerequisites

Before installing Minikube, ensure your system meets the following requirements:

- At least 2 CPUs.
- A minimum of 2GB of free memory, though 4GB is recommended for better
  performance.
- Approximately 20GB of available disk space.

You'll also need to have a compatible container or virtual machine manager
instealled. [Docker](https://docs.docker.com/get-started/get-docker/) is the
most common choice and what we'll focus on in this article, but Minikube also
supports VirtualBox, HyperKit, Hyper-V, KVM, and others.

## Installation

[Installing Minikube](https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Fx86-64%2Fstable%2Fbinary+download)
involves a few straightforward steps that prepare your system to run a local
Kubernetes cluster.

Homebrew provides one of the simplest ways to install Minikube across platforms.
Available for macOS and Linux, Homebrew can also be used in Windows through WSL.
This consistent installation method helps avoid platform-specific complications.

To install Minikube using Homebrew, open your terminal and run:

```command
brew install minikube
```

When the installation completes, you'll see output similar to this:

```text
[output]
==> Installing minikube
==> Pouring minikube--1.35.0.x86_64_linux.bottle.tar.gz
==> Caveats
Bash completion has been installed to:
 /home/user/.linuxbrew/etc/bash_completion.d
==> Summary
🍺  /home/user/.linuxbrew/Cellar/minikube/1.35.0: 9 files, 70.0MB
```

For Windows users not using WSL, you can download and install Minikube directly
from the official Minikube releases page. The installation consists of
downloading the executable and adding it to your system path.

### Installing kubectl

While Homebrew's installation of Minikube might include `kubectl` (the
Kubernetes command-line tool), it's considered good practice to
[install it separately](https://kubernetes.io/docs/tasks/tools/).

This ensures you have the latest version and gives you more control over which
version of kubectl you're using, which can be important when working with
different Kubernetes versions.

To install kubectl via Homebrew, execute:

```command
brew install kubectl
```

`kubectl` serves as your primary interface for interacting with any Kubernetes
cluster, including your Minikube cluster. It allows you to deploy applications,
inspect and manage cluster resources, and view logs, making it an essential
companion to Minikube.

---

After installing Minikube and `kubectl`, it's important to verify that they've
been correctly installed and are available in your system path. You can do this
by checking their versions.

For Minikube, run:

```command
minikube version
```

This should return something like:

```text
[output]
minikube version: v1.35.0
commit: 08896fd1dc362c097c925146c4a0d0dac715ace0
```

And for kubectl:

```command
kubectl version --client
```

```text
[output]
Client Version: v1.32.3
Kustomize Version: v5.5.0
```

## Starting your first cluster

With Minikube and `kubectl` installed, you're ready to create your first local
Kubernetes cluster. This process involves initializing a single-node Kubernetes
installation that will run within a container or virtual machine on your system.

The fundamental command to start Minikube is refreshingly simple:

```command
minikube start
```

This command performs several important operations. First, it initializes a
single-node Kubernetes cluster within a container or virtual machine. 

When you
run this for the first time, Minikube will download the necessary container
images, which might take several minutes depending on your internet connection.

It then configures these resources to create a fully functional Kubernetes
environment that adheres to official Kubernetes standards.

Here's an example of what the output might look like:

```text 
[output]
😄  minikube v1.35.0 on Ubuntu 22.04
✨  Using the docker driver based on existing profile
👍  Starting control plane node minikube in cluster minikube
🚜  Pulling base image ...
🔄  Restarting existing docker container for "minikube" ...
🐳  Preparing Kubernetes v1.26.3 on Docker 23.0.2 ...
🔎  Verifying Kubernetes components...
   ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
🌟  Enabled addons: default-storageclass, storage-provisioner
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```

An important thing to note from this output is the last line, which indicates
that `kubectl` has been automatically configured to interact with your new
Minikube cluster. 

This means you can start using `kubectl` commands right away
without additional configuration steps.

### Configuration options

While the basic start command works well for many use cases, Minikube provides
numerous options to customize your cluster according to specific requirements.

If you need to work with a particular version of Kubernetes, perhaps to ensure
compatibility with a production environment or to test an application against a
specific release, you can specify the version:

```command
minikube start --kubernetes-version=v1.24.0
```

This command instructs Minikube to use Kubernetes version 1.24.0 specifically,
rather than the most recent stable version that Minikube would otherwise default
to.

Applications with more demanding resource requirements might need additional
computing power. You can allocate more CPUs and memory to your Minikube cluster:

```command
minikube start --cpus=4 --memory=8192
```

This configuration provides 4 CPUs and 8GB of memory to your Minikube cluster,
which can significantly improve performance for resource-intensive applications.

Minikube supports different virtualization and containerization technologies
through its driver system. While Docker is the default on most systems, you
might want to use an alternative like VirtualBox:

```command
minikube start --driver=virtualbox
```

Each driver has its own characteristics regarding performance, integration with
the host system, and resource usage, so you might experiment with different
options to find what works best for your specific situation.

### Verifying cluster status

After starting Minikube, it's important to verify that your cluster is running
correctly. Minikube provides a dedicated command for checking the status of your
cluster:

```command
minikube status
```

A healthy cluster will show output indicating that the `host`, `kubelet`, and
`apiserver` components are all running:

```text
[output]
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

This output confirms that all the essential components of your Kubernetes
cluster are operational. The host refers to the Minikube virtual machine or
container, the `kubelet` is the primary node agent, and the `apiserver` is the
Kubernetes API server that processes requests to the cluster.

You can also use `kubectl` to get a more detailed view of your cluster's
node(s):

```command
kubectl get nodes
```

This command will show your single Minikube node and its status:

```text 
[output]
NAME       STATUS   ROLES           AGE     VERSION
minikube   Ready    control-plane   3m42s   v1.26.3
```

The "Ready" status indicates that your node is healthy and available to schedule
and run workloads. The "control-plane" role indicates that this node is running
the Kubernetes control plane components, as is expected in a single-node
Minikube cluster.

## Working with the Kubernetes dashboard

One of Minikube's convenient features is the inclusion of the Kubernetes
Dashboard, a web-based user interface for managing your cluster. This graphical
interface provides an intuitive way to interact with your Kubernetes resources.

Minikube makes accessing the dashboard straightforward with a dedicated command:

```command
minikube dashboard
```

When you run this command, Minikube performs several operations in sequence.
First, it ensures that the dashboard add-on is enabled. Then, it starts a proxy
server to securely connect to the dashboard from your local machine. Finally, it
automatically opens your default web browser and navigates to the dashboard URL.

![3.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cbeb356d-313a-49d6-85ab-0227dc386200/md2x =4004x2478)

The dashboard opens in your browser, presenting a comprehensive view of your
cluster. This automatic process works seamlessly when you're running Minikube
locally on a desktop or laptop with a graphical interface.

For scenarios where you're running Minikube on a remote server or when you don't
want the browser to open automatically, you can use the --url flag:

```command
minikube dashboard --url
```

Instead of opening a browser, this command will output a URL that you can use to
access the dashboard:

```text 
[output]
🤔  Verifying dashboard health ...
🚀  Launching proxy ...
🤔  Verifying proxy health ...
http://127.0.0.1:39825/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/
```

This approach gives you more flexibility, allowing you to copy the URL and
access it in a browser of your choice, or to set up additional tunneling if
needed for remote access.

## Deploying sample applications

With your Minikube cluster up and running, you can now deploy applications to
test its functionality. This section walks you through deploying a simple
application and then advances to a more complex deployment scenario.

The most straightforward way to deploy an application is using kubectl's create
deployment command. Let's deploy a simple echo server application to
demonstrate:

```command
kubectl create deployment hello-minikube --image=k8s.gcr.io/echoserver:1.10
```

This command instructs Kubernetes to create a deployment named "hello-minikube"
using the `echoserver` image from Google's container registry. A deployment
manages a replicated application, ensuring that the specified number of
instances (pods) are running at all times.

The output confirms the successful creation of your deployment:

```text
[output]
deployment.apps/hello-minikube created
```

To verify that your deployment is running correctly, you can check its status:

```command
kubectl get deployments
```

The output should indicate that your deployment is ready and available:

```text
[output]
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
hello-minikube   1/1     1            1           30s
```

This output tells you that one pod is ready out of the one desired (1/1), that
all pods are running the latest version (UP-TO-DATE: 1), and that one pod is
available to serve requests (AVAILABLE: 1).

### Exposing services

While your application is now running in the cluster, it's not yet accessible
from outside. To make it accessible, you need to expose it as a Kubernetes
Service.

Services provide a stable endpoint to access one or more pods, abstracting away
the individual pod IPs which can change as pods are created and destroyed.

To expose your deployment as a service:

```command
kubectl expose deployment hello-minikube --type=NodePort --port=8080
```

This command creates a Service of type `NodePort`, which makes the service
accessible on a port on each node in the cluster. The `--port=8080` parameter
specifies the port that the service will be available on within the cluster.

The command produces a confirmation message:

```text
[output]
service/hello-minikube exposed
```

Now let's examine the newly created service:

```command
kubectl get services hello-minikube
```

The output provides details about your service:

```text
[output]
NAME             TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
hello-minikube   NodePort   10.96.184.178   <none>        8080:31234/TCP   45s
```

This shows that your service has been assigned an internal IP address
(CLUSTER-IP) and is mapping port 8080 internally to port 31234 externally. The
external port is randomly assigned by Kubernetes.

### Accessing applications via Minikube

Minikube provides a convenient way to access services that have been exposed
with NodePort. Instead of needing to know the IP address of the Minikube node
and the assigned NodePort, you can use the minikube service command:

```command
minikube service hello-minikube --url
```

This command outputs the complete URL that you can use to access your
application:

```text
[output]
http://192.168.49.2:31234
```

The URL includes the IP address of the Minikube node and the assigned
`NodePort`. You can now access your application by visiting this URL in a
browser or by using tools like curl:

```command
curl $(minikube service hello-minikube --url)
```

This command uses command substitution to pass the URL from minikube service
directly to curl, which then makes an HTTP request to your application. The
response will be the output from the echo server, confirming that your
application is accessible:

```text
[output]
CLIENT VALUES:
client_address=172.17.0.1
command=GET
real path=/
query=nil
request_version=1.1
request_uri=http://192.168.49.2:31234/

SERVER VALUES:
server_version=nginx: 1.10.0 - lua: 10001

HEADERS RECEIVED:
accept=*/*
host=192.168.49.2:31234
user-agent=curl/7.68.0
BODY:
-no body in request-
```

### Creating a more complex deployment

While the command-line approach is quick and convenient for simple applications,
real-world deployments often involve more complex configurations. For such
cases, using YAML configuration files provides more control and reproducibility.

Let's create a more realistic deployment using a YAML configuration file. Save
the following as `nginx-deployment.yaml`:

```text 
[label nginx-deployment.yaml]
apiVersion: apps/v1
kind: Deployment
metadata:
 name: nginx-deployment
 labels:
   app: nginx
spec:
 replicas: 3
 selector:
   matchLabels:
     app: nginx
 template:
   metadata:
     labels:
       app: nginx
   spec:
     containers:
     - name: nginx
       image: nginx:1.21
       ports:
       - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
 name: nginx-service
spec:
 type: NodePort
 selector:
   app: nginx
 ports:
 - port: 80
   targetPort: 80
```

This configuration file defines two Kubernetes resources: a Deployment and a
Service. The Deployment specifies that three replica pods should be created,
each running the nginx:1.21 image. These pods will be labeled with app: nginx.

The Service definition creates a NodePort service that selects pods with the
label app: nginx, making your application accessible from outside the cluster.
The service maps port 80 in the cluster to port 80 on the pods.

Apply this configuration using kubectl:

```command
kubectl apply -f nginx-deployment.yaml
```

The output confirms that both resources have been created:

```text 
[output]
deployment.apps/nginx-deployment created
service/nginx-service created
```

Now you have a deployment of three NGINX pods and a service exposing them. You
can access the service using the same approach as before:

```command
minikube service nginx-service --url
```

This more complex deployment demonstrates how Kubernetes orchestrates multiple
instances of your application, providing load balancing and failover
capabilities. If any of the three nginx pods fails, Kubernetes will
automatically recreate it to maintain the desired state of three replicas.

## Managing Minikube resources

As you work with more demanding applications, you might need to adjust
Minikube's resource allocation or leverage its storage capabilities. This
section explores how to configure resources, provision storage, and share files
between your host and the Minikube environment.

### Configuring memory and CPU allocation

Minikube's default resource allocation may not be sufficient for all use cases,
especially when running multiple or resource-intensive applications.
Fortunately, adjusting these resources is straightforward.

You can configure resources when starting Minikube by using command-line flags:

```command
minikube start --cpus=4 --memory=8192
```

This command allocates 4 CPUs and 8GB of memory to your Minikube cluster,
providing substantially more resources than the default allocation. These
additional resources can make a significant difference in performance,
especially for applications with multiple components or those that process large
amounts of data.

Alternatively, you can adjust the default configuration that Minikube will use
for future starts:

```command
minikube config set memory 8192
minikube config set cpus 4
```

These commands modify Minikube's stored configuration, changing the defaults for
memory and CPU allocation. However, it's important to note that these changes
don't affect an already running cluster. For the changes to take effect, you'll
need to restart your cluster:

```command
minikube stop
minikube start
```

The stop command gracefully shuts down your Minikube cluster, preserving its
state. The subsequent start command creates a new cluster with the updated
resource allocations. This process maintains your existing workloads and
configurations while providing them with the newly allocated resources.

### Storage provisioning

Persistent storage is a crucial requirement for many applications, particularly
those that need to store data that survives pod restarts or rescheduling.
Minikube comes with the default storage class provisioner enabled, allowing you
to use Kubernetes' standard storage mechanisms out of the box.

To use persistent storage, you first need to create a Persistent Volume Claim
(PVC), which requests storage resources in the cluster. Here's an example PVC
definition:

```text [label pvc.yaml]
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
 name: sample-pvc
spec:
 accessModes:
   - ReadWriteOnce
 resources:
   requests:
     storage: 1Gi
```

This YAML defines a PVC that requests 1 gigabyte of storage with the
ReadWriteOnce access mode, which means the volume can be mounted for read/write
access by a single node at a time.

Apply this configuration to create the PVC:

```command
kubectl apply -f pvc.yaml
```

After applying the configuration, you can check that the PVC has been created
and its status:

```command
kubectl get pvc
```

The output should show your PVC in the "Bound" state, indicating that the
storage provisioner has created a corresponding Persistent Volume (PV) and bound
it to your claim:

```text 
[output]
NAME        STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
sample-pvc  Bound    pvc-e8a4fc89-12dc-46e1-8fd3-4ec3a3d715b2   1Gi        RWO            standard       10s
```

You can use this PVC in your deployments by referencing it in the pod
specification. This allows your applications to store data persistently,
ensuring it remains available even if pods are restarted or rescheduled to
different nodes (though in Minikube's case, there's only one node).

### File system mounting between host and cluster

During development, you often need to test changes to your application without
rebuilding containers for every modification. Minikube's mount feature allows
you to mount directories from your local file system into the cluster, providing
a direct link between your development environment and the running containers.

To mount a directory from your host machine to Minikube:

```command
minikube mount /path/on/host:/path/in/minikube
```

This command establishes a bidirectional mount, where changes on either side are
immediately visible on the other. For example:

```command
minikube mount ~/projects/myapp:/app
```

This mounts your local ~/projects/myapp directory to /app in the Minikube
environment. Any changes you make to files in your local directory will be
instantly available to pods that mount the /app path.

The mount command will block the terminal while maintaining the mount
connection. This is by design, as it needs to continue running to serve files
between your host and the Minikube environment.

To use the mounted path in a pod, you can create a pod that references it using
a hostPath volume:

```text [label mount-pod.yaml]
apiVersion: v1
kind: Pod
metadata:
 name: mount-test
spec:
 containers:
 - name: test
   image: nginx
   volumeMounts:
   - mountPath: /usr/share/nginx/html
     name: app-volume
 volumes:
 - name: app-volume
   hostPath:
     path: /app
     type: Directory
```

This configuration creates a pod that mounts the /app directory (which is
connected to your local ~/projects/myapp) to /usr/share/nginx/html in the
container. This means that the NGINX server in the container will serve content
directly from your local development directory.

Apply this configuration:

```command
kubectl apply -f mount-pod.yaml
```

Now any changes you make to files in your local ~/projects/myapp directory will
be immediately visible when accessing the NGINX server in your pod. This
bidirectional mount significantly accelerates the development cycle by
eliminating the need to rebuild and redeploy containers for every code change.

## Advanced Minikube features

As you become more comfortable with Minikube, you can leverage its advanced
features to manage more complex development scenarios, test against different
Kubernetes versions, and extend its functionality.

### Working with multiple profiles

Minikube's profile feature allows you to run multiple Kubernetes clusters side
by side on the same machine. This is particularly useful for testing
applications across different Kubernetes versions or with different
configurations.

To create a new profile, you can use the -p or --profile flag when starting
Minikube:

```command
minikube start -p my-profile
```

This command creates a new Minikube cluster with a separate configuration,
storage, and network from your default cluster. Each profile effectively
represents an isolated Kubernetes environment.

You can list all your profiles to see what clusters are available:

```command
minikube profile list
```

The output shows each profile with its driver, IP address, Kubernetes version,
and status:

```text
[output]
|----------|-----------|---------|--------------|------|---------|---------|-------|--------|
| Profile  | VM Driver | Runtime |      IP      | Port | Version | Status  | Nodes | Active |
|----------|-----------|---------|--------------|------|---------|---------|-------|--------|
| minikube | docker    | docker  | 192.168.49.2 | 8443 | v1.26.3 | Running |     1 |        |
| my-profile| docker   | docker  | 192.168.49.3 | 8443 | v1.26.3 | Running |     1 | *      |
|----------|-----------|---------|--------------|------|---------|---------|-------|--------|
```

The asterisk in the "Active" column indicates which profile kubectl is currently
configured to use. To switch between profiles, you can use the profile command:

```command
minikube profile minikube
```

This command switches the active profile to "minikube," reconfiguring kubectl to
interact with that cluster. This approach allows you to maintain separate
development environments for different projects or testing scenarios without
interference between them.

### Version management

Kubernetes evolves rapidly, with new versions released regularly. To ensure
compatibility with different Kubernetes environments or to test how your
applications work across versions, Minikube allows you to specify which
Kubernetes version to use.

When starting Minikube, you can specify the Kubernetes version:

```command
minikube start --kubernetes-version=v1.24.0
```

This command creates a cluster running Kubernetes version 1.24.0 specifically.
This capability is valuable for ensuring that your applications work correctly
with the Kubernetes version used in production, or for testing compatibility
with upcoming versions before upgrading your production environment.

You can also use different Kubernetes versions in different profiles, allowing
you to maintain multiple clusters with various versions simultaneously:

```command
minikube start -p older-k8s --kubernetes-version=v1.23.0
```

This flexibility enables comprehensive testing across different Kubernetes
releases without needing to reconfigure a single cluster repeatedly.

### Add-ons and extensions

Minikube includes several add-ons that provide additional functionality beyond
the core Kubernetes features. These add-ons can enhance your development
experience by providing tools for monitoring, networking, and more.

To see which add-ons are available and their status:

```command
minikube addons list
```

The output provides a comprehensive overview of available add-ons and their
current status:

```text
[output]
|-----------------------------|----------|--------------|--------------------------------|
|         ADDON NAME          | PROFILE  |    STATUS    |           MAINTAINER           |
|-----------------------------|----------|--------------|--------------------------------|
| dashboard                   | minikube | enabled ✅   | kubernetes                     |
| default-storageclass        | minikube | enabled ✅   | kubernetes                     |
| ingress                     | minikube | disabled     | third-party (unknown)          |
| ingress-dns                 | minikube | disabled     | third-party (unknown)          |
| metrics-server              | minikube | disabled     | kubernetes                     |
|-----------------------------|----------|--------------|--------------------------------|
```

To enable an add-on, such as the metrics-server for monitoring pod resource
usage:

```command
minikube addons enable metrics-server
```

The command output confirms the successful enabling of the add-on:

```text
[output]
💡  metrics-server is an addon maintained by Kubernetes. For any concerns contact minikube on GitHub.
   ▪ Using image k8s.gcr.io/metrics-server/metrics-server:v0.6.1
🌟  The 'metrics-server' addon is enabled
```

Minikube's add-on system includes several important tools that extend its
functionality:

The Ingress controller add-on provides HTTP routing capabilities, allowing you
to route traffic to different services based on hostnames or paths. This
simulates how production Kubernetes environments often handle external traffic.

The Registry add-on provides a local container registry, enabling you to push
and pull images directly within your Minikube environment without needing an
external registry.

The previously mentioned Metrics Server add-on collects resource usage data from
pods and nodes, providing insights into how your applications are consuming
resources.

Another valuable add-on is Helm, the Kubernetes package manager, which
simplifies deploying complex applications that consist of multiple Kubernetes
resources.

These add-ons transform Minikube from a simple Kubernetes environment into a
comprehensive development platform that more closely mirrors production
capabilities.

## Final thoughts

Minikube stands as an exceptional tool for anyone looking to explore Kubernetes
without the complexity and resource demands of a full cluster deployment.

It
delivers a comprehensive Kubernetes experience on your local machine while
maintaining fidelity to how Kubernetes operates in production environments.  

As you progress in your Kubernetes journey, the skills and
knowledge you develop with Minikube transfer directly to larger deployments,
making your investment in learning this tool a valuable one for your career in
container orchestration.

Thanks for reading!