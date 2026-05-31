# Getting Started with Kind for Local Kubernetes Development

Kind was originally created to facilitate Kubernetes' own conformance testing,
but it has evolved into a powerful tool for local development and continuous
integration workflows. By using Docker containers to simulate Kubernetes nodes,
Kind offers a remarkably lightweight yet fully functional Kubernetes
environment.

The name "Kind" stands for "**Kubernetes IN Docker**" which aptly describes how
it works. Instead of virtualizing entire machines, Kind uses Docker containers
to represent Kubernetes nodes. This approach dramatically reduces resource
consumption while preserving the essential behavior of a real Kubernetes
cluster.

For developers working on Kubernetes-native applications, Kind provides an ideal
environment to test deployments, debug issues, and validate changes before
committing them to production environments.

In this article, we'll discuss setting up a local Kubernetes development
environment with Kind.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/oyD048gDg_k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Prerequisites

Before diving into Kind, you'll need to ensure your development environment
meets the necessary requirements:

- [Docker](https://docs.docker.com/get-started/get-docker/): Since Kind runs
  nodes as containers, Docker is essential. You'll need a recent version of
  Docker installed and running on your system.

- [kubectl](https://kubernetes.io/docs/reference/kubectl/): The Kubernetes
  command-line tool is necessary for interacting with your Kind clusters after
  they're created.

- [Go](https://go.dev/doc/install): While not strictly required for using Kind,
  it's needed if you want to build Kind from source or contribute to its
  development.

For the optimal experience, ensure that Docker has enough resources allocated.
On Docker Desktop, you can adjust resource limits in the application settings.

![Screenshot From 2025-03-31 09-07-07.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/548681d1-cbe6-4287-a465-fc96c3ab6b00/md2x
=3912x2632)

## Installation

Installing Kind is straightforward across all supported platforms. Let's explore
the various installation methods.

The most universal way to install Kind is through its pre-built binaries, which
are available for Linux, macOS, and Windows.

For Linux and macOS users, you can download and install Kind with a simple
command:

```command
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-$(uname)-amd64
```

```command
chmod +x ./kind && sudo mv ./kind /usr/local/bin/kind
```

This command downloads the appropriate Kind binary, makes it executable, and
moves it to a directory in your PATH for easy access.

For macOS users with Homebrew, the installation is even simpler:

```command
brew install kind
```

Windows users can install Kind using Chocolatey:

```command
choco install kind
```

Or with PowerShell:

```command
curl.exe -Lo kind-windows-amd64.exe https://kind.sigs.k8s.io/dl/v0.20.0/kind-windows-amd64
```

```command
Move-Item .\kind-windows-amd64.exe c:\some-dir-in-your-PATH\kind.exe
```

### Installing kubectl

Since you'll need `kubectl` to interact with your Kind clusters, make sure it's
installed on your system.

On Linux, you can install `kubectl` via the package manager:

```command
sudo apt-get update && sudo apt-get install -y kubectl
```

On macOS with Homebrew:

```command
brew install kubectl
```

On Windows with Chocolatey:

```command
choco install kubernetes-cli
```

Alternatively, you can download `kubectl` directly from the Kubernetes release
page for any platform.

### Verifying installation

After installing Kind and `kubectl`, verify that they're working correctly by
checking their versions:

```command
kind version
```

This should output something like:

```text
[output]
kind v0.20.0 go1.20.4 linux/amd64
```

Similarly, check `kubectl`:

```command
kubectl version --client
```

With both tools successfully installed, you're ready to create your first Kind
cluster.

## Creating your first cluster

Creating a Kind cluster is remarkably simple, especially compared to setting up
traditional Kubernetes environments. Let's explore the basic creation process
and some of the available configuration options.

The simplest way to create a Kind cluster is with the default configuration:

```command
kind create cluster
```

This command creates a single-node Kubernetes cluster running inside a Docker
container. The output will look something like this:

```text
[output]
Creating cluster "kind" ...
✓ Ensuring node image (kindest/node:v1.27.3) 🖼
✓ Preparing nodes 📦
✓ Writing configuration 📜
✓ Starting control-plane 🕹️
✓ Installing CNI 🔌
✓ Installing StorageClass 💾
Set kubectl context to "kind-kind"
You can now use your cluster with:

kubectl cluster-info --context kind-kind

Have a question, bug, or feature request? Let us know! https://kind.sigs.k8s.io/#community 🙂
```

This output tells you that Kind has:

1. Downloaded the node image (if not already present)
2. Prepared the node container
3. Created the necessary configuration
4. Started the control plane components
5. Installed the Container Network Interface (CNI)
6. Set up the default storage class
7. Configured `kubectl` to use this cluster

The cluster name defaults to "kind" if not specified. You can verify that your
cluster is running with:

```command
kubectl cluster-info --context kind-kind
```

This should show information about your Kubernetes control plane and CoreDNS
service.

### Multi-node clusters

One of Kind's strengths is its ability to create multi-node clusters, which more
closely resemble production environments. To create a multi-node cluster, you'll
need to define a configuration file.

Create a file named `multi-node.yaml` with the following content:

```yaml
[label multi-node.yaml]
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
- role: worker
```

This configuration defines a cluster with one control plane node and two worker
nodes. To create this cluster:

```command
kind create cluster --name multi-node-cluster --config multi-node.yaml
```

After the cluster is created, you can verify that all nodes are running:

```command
kubectl get nodes --context kind-multi-node-cluster
```

You should see output similar to this:

```text
[output]
NAME                                 STATUS   ROLES           AGE     VERSION
multi-node-cluster-control-plane     Ready    control-plane   2m30s   v1.27.3
multi-node-cluster-worker            Ready    <none>          2m      v1.27.3
multi-node-cluster-worker2           Ready    <none>          2m      v1.27.3
```

### Configuration options

Kind offers numerous configuration options to customize your clusters. Let's
explore some of the most useful ones.

You can specify which Kubernetes version to use by defining the node image in
your configuration file:

```text
[label specific-version.yaml]
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
 image: kindest/node:v1.25.11
- role: worker
 image: kindest/node:v1.25.11
```

This configuration creates a cluster using Kubernetes v1.25.11. Kind maintains
images for various Kubernetes versions, which you can find in the Kind
documentation.

#### Port mapping

To expose services in your Kind cluster to the host system, you can configure
port mappings:

```text
[label port-mapping.yaml]
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
 extraPortMappings:
 - containerPort: 30080
   hostPort: 8080
   protocol: TCP
```

This configuration maps port 30080 in the control plane node to port 8080 on
your host. This is particularly useful for testing NodePort and Ingress
services.

#### Extra mounts

You can also mount files or directories from your host into the Kind nodes:

```yaml
[label extra-mounts.yaml]
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
 extraMounts:
 - hostPath: /path/to/my/files
   containerPath: /files
```

This configuration mounts `/path/to/my/files` from your host to `/files` in the
control plane node, allowing you to easily share configuration files or other
resources with your Kind cluster.

## Working with the Kubernetes dashboard

The Kubernetes Dashboard provides a web-based UI for managing and monitoring
your cluster. While Kind doesn't include the dashboard by default, you can
easily deploy it to enhance your development experience.

### Deploying the dashboard

To deploy the Kubernetes Dashboard to your Kind cluster, you can use the
official manifest:

```command
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```

This command creates the necessary resources for the dashboard in a dedicated
namespace called `kubernetes-dashboard`.

### Creating a dashboard user

For security reasons, you'll need to create a user to access the dashboard.
Create a file named `dashboard-adminuser.yaml` with the following content:

```yaml
[label dashboard-adminuser.yaml]
apiVersion: v1
kind: ServiceAccount
metadata:
 name: admin-user
 namespace: kubernetes-dashboard
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
 name: admin-user
roleRef:
 apiGroup: rbac.authorization.k8s.io
 kind: ClusterRole
 name: cluster-admin
subjects:
- kind: ServiceAccount
 name: admin-user
 namespace: kubernetes-dashboard
```

Apply this configuration:

```command
kubectl apply -f dashboard-adminuser.yaml
```

### Accessing the dashboard

To access the dashboard, you need to create a secure channel to your cluster
using `kubectl`'s proxy feature:

```command
kubectl proxy
```

This command starts a proxy server on localhost, allowing you to access the
dashboard at:

`http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/`

To log in, you'll need a token. Generate one with:

```command
kubectl -n kubernetes-dashboard create token admin-user
```

Copy the generated token and paste it into the dashboard login page.

Once logged in, you'll see the main dashboard interface, which provides a
comprehensive view of your cluster resources.

![3.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cbeb356d-313a-49d6-85ab-0227dc386200/md2x =4004x2478)

## Deploying applications to Kind

With your Kind cluster up and running, you can now deploy applications to test
and validate their behavior in a Kubernetes environment.

Let's start with a simple deployment of NGINX. Create a file named
`nginx-deployment.yaml`:

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
   nodePort: 30080
```

This configuration creates a deployment with three NGINX pods and a NodePort
service that exposes them on port 30080. Apply this configuration:

```command
kubectl apply -f nginx-deployment.yaml
```

Verify that the deployment is running:

```command
kubectl get deployments
```

You should see output like:

```text
[output]
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3/3     3            3           30s
```

And check that the service is created:

```command
kubectl get services
```

Output:

```text
[output]
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP        10m
nginx-service   NodePort    10.96.131.245   <none>        80:30080/TCP   45s
```

If you created your cluster with port mapping as shown earlier, you should now
be able to access the NGINX service at http://localhost:8080.

### Using Ingress resources

For more sophisticated routing, you can use Kubernetes Ingress resources. First,
you'll need to enable the Ingress controller in your Kind cluster.

Create a new configuration file named `ingress-cluster.yaml`:

```yaml
[label ingress-cluster.yaml]
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
 kubeadmConfigPatches:
 - |
   kind: InitConfiguration
   nodeRegistration:
     kubeletExtraArgs:
       node-labels: "ingress-ready=true"
 extraPortMappings:
 - containerPort: 80
   hostPort: 80
   protocol: TCP
 - containerPort: 443
   hostPort: 443
   protocol: TCP
```

Create a new cluster with this configuration:

```command
kind create cluster --name ingress-cluster --config ingress-cluster.yaml
```

Install the NGINX Ingress controller with specific patches for Kind:

```command
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

Wait for the Ingress controller to be ready:

```command
kubectl wait --namespace ingress-nginx \
 --for=condition=ready pod \
 --selector=app.kubernetes.io/component=controller \
 --timeout=90s
```

Now, deploy a sample application:

```yaml
[label hello-app.yaml]
apiVersion: apps/v1
kind: Deployment
metadata:
 name: hello-app
spec:
 replicas: 3
 selector:
   matchLabels:
     app: hello
 template:
   metadata:
     labels:
       app: hello
   spec:
     containers:
     - name: hello
       image: gcr.io/google-samples/hello-app:1.0
       ports:
       - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
 name: hello-service
spec:
 selector:
   app: hello
 ports:
 - port: 80
   targetPort: 8080
```

Apply this configuration:

```command
kubectl apply -f hello-app.yaml
```

Finally, create an Ingress resource to route traffic to your application:

```yaml
[label hello-ingress.yaml]
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
 name: hello-ingress
spec:
 rules:
 - http:
     paths:
     - path: /hello
       pathType: Prefix
       backend:
         service:
           name: hello-service
           port:
             number: 80
```

Apply the Ingress configuration:

```command
kubectl apply -f hello-ingress.yaml
```

Now you should be able to access your application at `http://localhost/hello`.

### Volume mounting and persistent storage

For applications that require persistent storage, Kind supports Persistent
Volumes and Persistent Volume Claims.

First, create a PVC:

```yaml
[label pvc.yaml]
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
 name: data-pvc
spec:
 accessModes:
   - ReadWriteOnce
 resources:
   requests:
     storage: 1Gi
```

Apply this configuration:

```command
kubectl apply -f pvc.yaml
```

Now create a deployment that uses this PVC:

```yaml
[label stateful-app.yaml]
apiVersion: apps/v1
kind: Deployment
metadata:
 name: stateful-app
spec:
 replicas: 1
 selector:
   matchLabels:
     app: stateful
 template:
   metadata:
     labels:
       app: stateful
   spec:
     containers:
     - name: app
       image: nginx
       volumeMounts:
       - mountPath: /data
         name: data-volume
     volumes:
     - name: data-volume
       persistentVolumeClaim:
         claimName: data-pvc
```

Apply this configuration:

```command
kubectl apply -f stateful-app.yaml
```

Kind's built-in storage provisioner will automatically create a Persistent
Volume to satisfy the PVC, and your application will have access to persistent
storage that survives pod restarts.

## Managing Kind resources

One of Kind's strengths is its ability to run multiple clusters simultaneously,
which is useful for testing multi-cluster scenarios or isolating different
projects.

To list all your Kind clusters:

```command
kind get clusters
```

You can switch between clusters by specifying the context in your `kubectl`
commands:

```command
kubectl config use-context kind-cluster-name
```

Or by providing the context flag:

```command
kubectl --context kind-cluster-name get pods
```

When you're done with a cluster, you can delete it:

```command
kind delete cluster --name cluster-name
```

### Loading Docker images into Kind

One common development workflow involves building Docker images locally and
using them in your Kind cluster. Since Kind runs in its own Docker network, you
need to explicitly load images into the Kind cluster.

Build your image normally:

```command
docker build -t my-app:latest .
```

Then load it into your Kind cluster:

```command
kind load docker-image my-app:latest
```

You can specify which cluster to load the image into:

```command
kind load docker-image my-app:latest --name cluster-name
```

Now you can create deployments that reference this image:

```yaml
[label local-image-deployment.yaml]
apiVersion: apps/v1
kind: Deployment
metadata:
 name: my-app
spec:
 replicas: 1
 selector:
   matchLabels:
     app: my-app
 template:
   metadata:
     labels:
       app: my-app
   spec:
     containers:
     - name: my-app
       image: my-app:latest
       imagePullPolicy: Never
```

Note the `imagePullPolicy: Never`, which tells Kubernetes to use the local image
rather than trying to pull it from a registry.

### Export logs from cluster

When troubleshooting, it's often useful to collect logs from your Kind cluster.
Kind provides a command to export logs to a directory:

```command
kind export logs ./kind-logs
```

This command collects logs from all nodes in the cluster and saves them to the
specified directory. You can specify which cluster to collect logs from:

```command
kind export logs ./kind-logs --name cluster-name
```

The collected logs include:

- Kubernetes component logs (API server, scheduler, etc.)
- Container runtime logs
- Node logs
- System logs

These logs can be invaluable for diagnosing issues in your cluster or the
applications running on it.

## Advanced Kind features

Kind offers several advanced features that make it a powerful tool for
Kubernetes development and testing.

### Custom node configurations

For advanced scenarios, you might need to customize the configuration of
individual nodes. Kind allows you to apply `kubeadm` configuration patches to
control various aspects of node initialization.

Here's an example of a custom node configuration:

```yaml
[label custom-nodes.yaml]
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
 kubeadmConfigPatches:
 - |
   kind: InitConfiguration
   nodeRegistration:
     kubeletExtraArgs:
       system-reserved: memory=2Gi
- role: worker
 kubeadmConfigPatches:
 - |
   kind: JoinConfiguration
   nodeRegistration:
     kubeletExtraArgs:
       eviction-hard: 'memory.available<10%'
```

This configuration customizes resource reservation on the control plane and
eviction thresholds on the worker node. These sorts of customizations allow you
to test how your applications behave under specific node configurations.

### Integration with container registries

For more complex development workflows, you might want to use a container
registry within your Kind cluster. You can deploy a local registry and configure
Kind to use it:

First, create a Docker network for the registry and Kind to communicate:

```command
docker network create kind-registry
```

Run a local registry:

```command
docker run -d --name registry --network kind-registry -p 5000:5000 registry:2
```

Then create a Kind cluster configured to use this registry:

```text
[label registry-cluster.yaml]
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
containerdConfigPatches:
- |-
 [plugins."io.containerd.grpc.v1.cri".registry.mirrors."localhost:5000"]
   endpoint = ["http://registry:5000"]
nodes:
- role: control-plane
 extraPortMappings:
 - containerPort: 5000
   hostPort: 5000
```

Create the cluster:

```command
kind create cluster --name registry-cluster --config registry-cluster.yaml
```

Connect the Kind cluster to the registry network:

```command
docker network connect kind-registry registry-cluster-control-plane
```

Now you can push images to your local registry:

```command
docker build -t localhost:5000/my-app:latest .
docker push localhost:5000/my-app:latest
```

And use them in your deployments:

```yaml
[label registry-deployment.yaml]
apiVersion: apps/v1
kind: Deployment
metadata:
 name: my-app
spec:
 replicas: 1
 selector:
   matchLabels:
     app: my-app
 template:
   metadata:
     labels:
       app: my-app
   spec:
     containers:
     - name: my-app
       image: localhost:5000/my-app:latest
```

This setup allows you to test the full CI/CD workflow, including image pushing
and pulling, within your local development environment.

### Testing Kubernetes operators

Kind provides an excellent environment for testing Kubernetes operators—software
extensions that use custom resources to manage applications and their
components.

To test an operator in Kind, first create a cluster:

```command
kind create cluster --name operator-test
```

Install the operator SDK's OLM (Operator Lifecycle Manager):

```command
operator-sdk olm install
```

Deploy your operator:

```command
kubectl apply -f operator-deployment.yaml
```

Create custom resources for your operator to manage:

```command
kubectl apply -f custom-resource.yaml
```

You can then monitor the operator's behavior and verify that it correctly
manages the custom resources in response to changes.

This approach allows operator developers to rapidly iterate on their code
without needing to deploy to a remote cluster for each test cycle.

## Final thoughts

As Kubernetes continues to evolve as the industry standard for container
orchestration, Kind bridges the crucial gap between local development and
production deployment, cementing its place as an essential tool in the modern
developer's toolkit.

Thanks for reading!
