# Getting Started with Kubernetes: A Practical Guide

[Kubernetes](https://kubernetes.io/) (often abbreviated as K8s) is an
open-source platform designed to automate the deployment, scaling, and
management of containerized applications.

While Docker made containers accessible to developers, Kubernetes makes
containers viable for production environments by solving many of the operational
challenges that come with running containers at scale.

It provides a consistent way to deploy applications across environments while
offering powerful features for scaling, healing, and updating applications with
minimal downtime.

Kubernetes uses a declarative approach to application management. You only need
to describe the desired state of your application, and Kubernetes works
continuously to ensure that the current state matches your desired state.

In this article, you will acquaint yourself with the fundamentals of container
orchestration with Kubernetes. Let's get started!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/AMUQzyPvO04" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Prerequisites

Before diving into Kubernetes, you should be familiar with basic container
concepts and have some experience working with containers, particularly Docker.
You should also have Docker installed and running on your local machine.

While not strictly necessary, understanding networking fundamentals and being
comfortable with command-line interfaces will make your Kubernetes journey
smoother.

[ad-logs]

## Setting up your first Kubernetes environment

For beginners, setting up a local Kubernetes environment is the best way to
start learning. [Minikube](https://minikube.sigs.k8s.io/) is a tool that runs a
single-node Kubernetes cluster on your personal computer, making it perfect for
learning and development purposes.

### Installing Minikube

Minikube requires a hypervisor to run the Kubernetes virtual machine. Depending
on your operating system, you might use VirtualBox, HyperKit, Hyper-V, or
Docker. Let's install Minikube on a Linux system using the following commands:

```command
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
```

```command
chmod +x minikube-linux-amd64
```

```command
sudo mv minikube-linux-amd64 /usr/local/bin/minikube
```

You can verify the installation with:

```command
minikube version
```

```text
[output]
minikube version: v1.35.0
commit: dd5d320e41b5451cdf3c01891bc4e13d189586ed-dirty
```

For macOS users, you can use Homebrew for a simpler installation:

```command
brew install minikube
```

If you're on Windows, you can install it using Chocolatey:

```command
choco install minikube
```

### Setting up kubectl

To interact with your Kubernetes cluster, you'll need `kubectl`, the Kubernetes
command-line tool. Here's how to install it on Linux:

```command
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```

```command
chmod +x kubectl
```

```command
sudo mv kubectl /usr/local/bin/
```

```command
kubectl version --client
```

```text
[output]
Client Version: v1.32.3
Kustomize Version: v5.5.0
```

For macOS:

```command
brew install kubectl # Install kubectl using Homebrew
```

For Windows:

```command
choco install kubernetes-cli # Install kubectl using Chocolatey
```

### Starting your Minikube cluster

Now that you have both Minikube and kubectl installed, you can start your local
Kubernetes cluster:

```command
minikube start
```

```text
[output]
😄  minikube v1.35.0 on Fedora 41
✨  Automatically selected the docker driver. Other choices: qemu2, virtualbox, none, ssh
📌  Using Docker driver with root privileges
👍  Starting "minikube" primary control-plane node in "minikube" cluster
🚜  Pulling base image v0.0.46 ...
💾  Downloading Kubernetes v1.32.0 preload ...
    > preloaded-images-k8s-v18-v1...:  333.57 MiB / 333.57 MiB  100.00% 4.58 Mi
    > gcr.io/k8s-minikube/kicbase...:  500.31 MiB / 500.31 MiB  100.00% 4.56 Mi
🔥  Creating docker container (CPUs=2, Memory=16000MB) ...
🐳  Preparing Kubernetes v1.32.0 on Docker 27.4.1 ...
    ▪ Generating certificates and keys ...
    ▪ Booting up control plane ...
    ▪ Configuring RBAC rules ...
🔗  Configuring bridge CNI (Container Networking Interface) ...
🔎  Verifying Kubernetes components...
    ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
🌟  Enabled addons: default-storageclass, storage-provisioner
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```

Starting Minikube for the first time might take a few minutes as it needs to
download the necessary VM images and Kubernetes components. Once it's finished,
your local Kubernetes cluster is up and running.

You can verify everything is working correctly with:

```command
kubectl cluster-info
```

```text
[output]
Kubernetes control plane is running at https://192.168.49.2:8443
CoreDNS is running at https://192.168.49.2:8443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

Congratulations! You now have a fully functional Kubernetes cluster running on
your machine.

## Kubernetes core concepts

Before we deploy our first application, let's understand the fundamental
building blocks of Kubernetes.

### Pods: the basic building blocks

In Kubernetes, the smallest deployable unit is a Pod. A Pod represents a single
instance of a running process in your cluster and can contain one or more
containers.

Containers within a Pod share the same network namespace, meaning they can
communicate with each other using localhost, and they share the same storage
volumes. Pods are designed to be ephemeral - they can be created, destroyed, and
recreated as needed.

Here's what a simple Pod definition looks like:

```yaml
[label pod.yaml]
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.27
    ports:
    - containerPort: 80
```

This YAML file defines a Pod named `nginx-pod` that runs a single container
based on the nginx:1.27 image, exposing port 80.

To create this pod, you would save the definition to a file, and apply it to
your cluster:

```command
kubectl apply -f pod.yaml
```

```text
[output]
pod/nginx-pod created
```

You can view your running pod with:

```command
kubectl get pods
```

```text
[output]
NAME        READY   STATUS    RESTARTS   AGE
nginx-pod   1/1     Running   0          45s
```

While you can create and manage Pods directly, in practice, it's better to use
higher-level abstractions like Deployments, which we'll cover next.

### Deployments and how they manage pods

A Deployment provides declarative updates for Pods. It allows you to describe
the desired state for your application, and Kubernetes will work to maintain
that state. Deployments offer features like:

1. Automatic rolling updates and rollbacks
2. Scaling capabilities
3. Self-healing: if a Pod fails, the Deployment will replace it

Here's a basic Deployment definition:

```yaml
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
        image: nginx:1.27777777
        ports:
        - containerPort: 80
```

This Deployment will create three replicas of the nginx Pod. Let's create it:

```command
# Apply the Deployment
kubectl apply -f nginx-deployment.yaml
```

```text
[output]
deployment.apps/nginx-deployment created
```

Now, check the status of your Deployment:

```command
kubectl get deployments
```

```text
[output]
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3/3     3            3           78s
```

You can also see the Pods that were created by this Deployment:

```command
kubectl get pods -l app=nginx
```

```text
[output]
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-66b6c48dd5-7rz5t   1/1     Running   0          98s
nginx-deployment-66b6c48dd5-txg6j   1/1     Running   0          98s
nginx-deployment-66b6c48dd5-x7zl2   1/1     Running   0          98s
nginx-pod                           1/1     Running   0          5m25s
```

Notice how Kubernetes has created three Pods with generated names, based on the
Deployment name and a random suffix.

### Services and how they enable networking

While Pods provide the runtime environment for your application, Services
provide a consistent way to access these applications. A Service is an
abstraction that defines a logical set of Pods and a policy to access them.

Services are necessary because:

- Pods are ephemeral and can be created or destroyed at any time
- Each Pod gets its own IP address, but these IPs aren't stable
- Services provide a stable endpoint for connecting to the Pods

Here's a simple Service definition:

```yaml
[nginx-service.yaml]
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

This Service selects all Pods with the label `app: nginx` and exposes them on
port 80 within the cluster. Let's create it:

```command
# Apply the Service
kubectl apply -f nginx-service.yaml
```

```text
[output]
service/nginx-service created
```

Now, check the Service:

```command
kubectl get services
```

```text
[output]
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP   24m
nginx-service   ClusterIP   10.101.242.84   <none>        80/TCP    42s
```

The `ClusterIP` service type makes your application accessible only within the
cluster. For development purposes, you might want to access it from your local
machine. Minikube provides a convenient way to do this:

```command
minikube service nginx-service
```

```text
[output]
|-----------|---------------|-------------|--------------|
| NAMESPACE |     NAME      | TARGET PORT |     URL      |
|-----------|---------------|-------------|--------------|
| default   | nginx-service |             | No node port |
|-----------|---------------|-------------|--------------|
😿  service default/nginx-service has no node port
❗  Services [default/nginx-service] have type "ClusterIP" not meant to be exposed, however for local development minikube allows you to access this !
🏃  Starting tunnel for service nginx-service.
|-----------|---------------|-------------|------------------------|
| NAMESPACE |     NAME      | TARGET PORT |          URL           |
|-----------|---------------|-------------|------------------------|
| default   | nginx-service |             | http://127.0.0.1:33051 |
|-----------|---------------|-------------|------------------------|
🎉  Opening service default/nginx-service in default browser...
❗  Because you are using a Docker driver on linux, the terminal needs to be open to run it.
```

This command creates a tunnel to your service and provides a URL you can use to
access it:

![1.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7ca866cb-0eca-4db6-4c80-91285afaf100/orig =2148x1020)

If you need to expose your service to the outside world more permanently, you
would typically use a `NodePort` or `LoadBalancer` service type.

## Your first deployment

Now that we understand the basic building blocks, let's create a complete
application deployment for a simple web application. We'll use a lightweight
Node.js application that displays a hello world message.

First, let's create a Deployment for our application:

```yaml
[label hello-app-deployment.yaml]
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-app
  labels:
    app: hello-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hello-app
  template:
    metadata:
      labels:
        app: hello-app
    spec:
      containers:
      - name: hello-app
        image: paulbouwer/hello-kubernetes:1.10
        ports:
        - containerPort: 8080
        env:
        - name: MESSAGE
          value: "Hello from my Kubernetes cluster!"
```

This Deployment creates two replicas of a container running the
"hello-kubernetes" image. It also sets an environment variable that customizes
the message displayed by the application.

Apply this configuration:

```command
kubectl apply -f hello-app-deployment.yaml
```

```text
[output]
deployment.apps/hello-app created
```

Now, let's create a Service to make the application accessible:

```yaml
[label hello-app-service.yaml]
apiVersion: v1
kind: Service
metadata:
  name: hello-app-service
spec:
  selector:
    app: hello-app
  ports:
  - port: 80
    targetPort: 8080
  type: NodePort
```

This Service maps port 80 to the container's port 8080 and uses the `NodePort`
type, which will make it accessible outside the cluster.

Go ahead and apply the Service with:

```command
kubectl apply -f hello-app-service.yaml
```

```text
[output]
service/hello-app-service created
```

You can access your application using Minikube:

```command
minikube service hello-app-service
```

```text
[output]
|-----------|-------------------|-------------|---------------------------|
| NAMESPACE |       NAME        | TARGET PORT |            URL            |
|-----------|-------------------|-------------|---------------------------|
| default   | hello-app-service |          80 | http://192.168.49.2:31351 |
|-----------|-------------------|-------------|---------------------------|
🎉  Opening service default/hello-app-service in default browser...
```

This will open a browser window showing your application. The `NodePort` service
type automatically assigns a port in the range 30000-32767 and makes the service
accessible through the node's IP address at that port.

![2.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9b292600-fde9-4fcf-8877-6622c4ab3f00/lg1x =2820x1390)

### Understanding YAML configuration files

YAML files are the primary way to define resources in Kubernetes. Although we've
already seen several examples, let's break down the structure of a typical
Kubernetes YAML file:

1. **apiVersion**: Specifies which version of the Kubernetes API you're using to
   create the object
2. **kind**: What kind of object you want to create (Pod, Deployment, Service,
   etc.)
3. **metadata**: Data that helps uniquely identify the object, including a name,
   UID, and optional namespace
4. **spec**: The precise format of the spec depends on the object you're
   creating, but generally contains the desired state for the object

When writing your own YAML files, remember:

- YAML is sensitive to indentation, which uses spaces (not tabs)
- Lists are denoted with hyphens (-)
- Key-value pairs are separated by colons and a space
- Multiline strings can be written using the pipe character (|)

You can also generate YAML templates using kubectl commands with the
`--dry-run=client -o yaml` flags. For example:

```command
kubectl create deployment example --image=nginx --dry-run=client -o yaml
```

This generates the YAML for a Deployment without actually applying it to your
cluster, allowing you to save it to a file for further customization.

### Viewing logs and debugging basics

When troubleshooting your applications in Kubernetes, viewing logs is often the
first step. To view the logs of a Pod:

```command
kubectl get pods -l app=hello-app
```

```text
[output]
NAME                        READY   STATUS    RESTARTS   AGE
hello-app-d5f74c9fb-ltq5g   1/1     Running   0          12m
hello-app-d5f74c9fb-wpnt7   1/1     Running   0          12m
```

```command
# View logs for a specific Pod
kubectl logs hello-app-d5f74c9fb-ltq5g
```

```text
[output]
> hello-kubernetes@1.10.1 start
> node server.js

{"level":30,"time":1742181412962,"pid":18,"hostname":"hello-app-5b568cb498-dflt2","msg":"Listening on: http://hello-app-5b568cb498-dflt2:8080"}
. . .
```

If you want to continuously watch the logs:

```command
kubectl logs -f hello-app-d5f74c9fb-ltq5g
```

For debugging, you might want to get a shell inside a running container:

```command
# Execute a shell in a Pod
kubectl exec -it hello-app-d5f74c9fb-ltq5g -- /bin/sh
```

This command gives you an interactive shell inside the container, allowing you
to explore the filesystem, check environment variables, and more.

To check the details of a specific resource:

```command
kubectl describe pod hello-app-d5f74c9fb-ltq5g
```

```
[output]
Name:             hello-app-5b568cb498-dflt2
Namespace:        default
Priority:         0
Service Account:  default
Node:             minikube/192.168.49.2
Start Time:       Mon, 17 Mar 2025 04:16:38 +0100
Labels:           app=hello-app
                  pod-template-hash=5b568cb498
Annotations:      <none>
Status:           Running
IP:               10.244.0.8
[... additional output omitted for brevity ...]
```

The `describe` command provides a wealth of information about the resource,
including its current status, events, and configuration.

## Basic Kubernetes operations

Let's explore some common operations you'll need when working with Kubernetes.

### Scaling applications up and down

One of Kubernetes' strengths is its ability to scale applications. To scale your
deployment:

```command
kubectl scale deployment hello-app --replicas=4
```

```text
[output]
deployment.apps/hello-app scaled
```

Verify the scaling operation:

```command
kubectl get deployment hello-app
```

```text
[output]
NAME        READY   UP-TO-DATE   AVAILABLE   AGE
hello-app   4/4     4            4           24m
```

```command
kubectl get pods -l app=hello-app
```

```text
[output]
NAME                        READY   STATUS    RESTARTS   AGE
hello-app-d5f74c9fb-ltq5g   1/1     Running   0          24m
hello-app-d5f74c9fb-wpnt7   1/1     Running   0          24m
hello-app-d5f74c9fb-8f7gh   1/1     Running   0          65s
hello-app-d5f74c9fb-tr9p3   1/1     Running   0          65s
```

Kubernetes quickly created two additional Pods to match your desired state. You
can also scale down just as easily:

```command
# Scale back to 2 replicas
kubectl scale deployment hello-app --replicas=2
```

```text
[output]
deployment.apps/hello-app scaled
```

Kubernetes will choose which Pods to terminate and maintain only the desired
number.

### Updating deployments with new versions

Another common operation is updating your application to a new version. Let's
update our hello-app to use a different message:

```command
kubectl set env deployment/hello-app MESSAGE="Updated message from Kubernetes!"
```

```text
[output]
deployment.apps/hello-app env updated
```

This command modifies the environment variable in the Deployment spec.
Kubernetes will automatically create new Pods with the updated configuration and
terminate the old ones, resulting in a rolling update with no downtime.

You can watch the update progress:

```command
# Watch the rollout status
kubectl rollout status deployment/hello-app
```

```text
[output]
Waiting for deployment "hello-app" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "hello-app" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "hello-app" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "hello-app" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "hello-app" rollout to finish: 1 old replicas are pending termination...
deployment "hello-app" successfully rolled out
```

If something goes wrong with your update, you can easily roll back:

```command
kubectl rollout undo deployment/hello-app
```

```text
[output]
deployment.apps/hello-app rolled back
```

This command reverts to the previous configuration, ensuring minimal disruption
to your service.

### ConfigMaps for configuration

While environment variables work for simple configuration, ConfigMaps provide a
more flexible way to manage application configuration:

```yaml
[app-config.yaml]
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  MESSAGE: "Hello from ConfigMap!"
  config.json: |
    {
      "environment": "development",
      "logLevel": "debug",
      "features": {
        "newFeature": true
      }
    }
```

This `ConfigMap` contains both individual configuration values and entire
configuration files. Let's create it:

```command
kubectl apply -f app-config.yaml
```

```text
[output]
configmap/app-config created
```

Now, update the Deployment to use this `ConfigMap`:

```yaml
[label hello-app-with-configmap.yaml]
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-app
  labels:
    app: hello-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hello-app
  template:
    metadata:
      labels:
        app: hello-app
    spec:
      containers:
      - name: hello-app
        image: paulbouwer/hello-kubernetes:1.10
        ports:
        - containerPort: 8080
        env:
        - name: MESSAGE
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: MESSAGE
        volumeMounts:
        - name: config-volume
          mountPath: /app/config
      volumes:
      - name: config-volume
        configMap:
          name: app-config
```

This updated Deployment references the `ConfigMap` in two ways:

1. As an environment variable using `configMapKeyRef`.
2. As a mounted volume, which will create files in the container for each key in
   the `ConfigMap`.

Apply the updated configuration by running:

```command
kubectl apply -f hello-app-with-configmap.yaml
```

```text
[output]
deployment.apps/hello-app configured
```

### Basic troubleshooting commands

When working with Kubernetes, you'll inevitably need to troubleshoot issues.
Here are some essential commands:

- Check the events in your cluster to see what's happening:

```command
# View cluster events
kubectl get events --sort-by='.lastTimestamp'
```

```text
[output]
LAST SEEN   TYPE     REASON              OBJECT                          MESSAGE
35s         Normal   Scheduled           pod/hello-app-9c7b8f6d4-x5m2j   Successfully assigned default/hello-app-9c7b8f6d4-x5m2j to minikube
33s         Normal   Pulled              pod/hello-app-9c7b8f6d4-x5m2j   Container image "paulbouwer/hello-kubernetes:1.10" already present on machine
33s         Normal   Created             pod/hello-app-9c7b8f6d4-x5m2j   Created container hello-app
33s         Normal   Started             pod/hello-app-9c7b8f6d4-x5m2j   Started container hello-app
35s         Normal   SuccessfulCreate    replicaset/hello-app-9c7b8f6d4  Created pod: hello-app-9c7b8f6d4-x5m2j
35s         Normal   ScalingReplicaSet   deployment/hello-app            Scaled up replica set hello-app-9c7b8f6d4 to 1
```

- Get resource usage statistics for your Pods:

```command
# Show resource usage of Pods
kubectl top pods
```

```text
[output]
NAME                         CPU(cores)   MEMORY(bytes)
hello-app-9c7b8f6d4-jntk8    1m           21Mi
hello-app-9c7b8f6d4-x5m2j    1m           21Mi
```

- Check the status of your Deployments:

```command
# Get the status of a Deployment
kubectl rollout status deployment/hello-app
```

```text
[output]
deployment "hello-app" successfully rolled out
```

- View the history of a Deployment's revisions:

```command
# Show Deployment revision history
kubectl rollout history deployment/hello-app
```

```text
[output]
deployment.apps/hello-app
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
3         <none>
```

## Exploring the Kubernetes dashboard

Kubernetes comes with a web-based dashboard for managing and monitoring your
cluster. In Minikube, it's easy to enable:

```command
minikube dashboard
```

```text
[output]
🔌  Enabling dashboard ...
    ▪ Using image docker.io/kubernetesui/dashboard:v2.7.0
    ▪ Using image docker.io/kubernetesui/metrics-scraper:v1.0.8
💡  Some dashboard features require the metrics-server addon. To enable all features please run:

        minikube addons enable metrics-server

🤔  Verifying dashboard health ...
🚀  Launching proxy ...
🤔  Verifying proxy health ...
🎉  Opening http://127.0.0.1:44341/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/ in your default browser...
```

This command enables the dashboard, starts a proxy connection, and opens it in
your default browser:

![3.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cbeb356d-313a-49d6-85ab-0227dc386200/md2x =4004x2478)

The dashboard provides a comprehensive view of your cluster, including:

1. Deployments, Pods, Services, and other resources
2. Resource utilization metrics
3. Logs for your applications
4. The ability to create, edit, and delete resources

While the dashboard is useful for learning and quick inspections, most
experienced Kubernetes users prefer the command line for day-to-day operations.
Nevertheless, it's a valuable tool for visualizing the state of your cluster,
especially when you're getting started.

## Final thoughts

In this guide, we've covered the fundamental concepts and operations needed to
get started with Kubernetes. We've explored how to set up a local Kubernetes
environment using Minikube, learned about core Kubernetes resources like Pods,
Deployments, and Services, and practiced basic operations like scaling and
updating applications.

Kubernetes has a steep learning curve, but the skills you develop are
increasingly valuable in today's cloud-native landscape. By focusing on the
basics and gradually expanding your knowledge, you can build a solid foundation
for working with Kubernetes in real-world scenarios.

Remember that Kubernetes is highly extensible, and there's always more to learn.
The official Kubernetes documentation and community resources are invaluable as
you continue your journey. Good luck, and happy containerizing!
