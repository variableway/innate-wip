# Deploying Prometheus on Kubernetes using Helm charts

Monitoring applications in [Kubernetes](https://betterstack.com/community/guides/scaling-docker/kubernetes-getting-started/) environments
is critical for ensuring optimal performance and rapid troubleshooting.

[Prometheus](https://betterstack.com/community/guides/monitoring/prometheus/) has emerged as one of the most powerful monitoring
solutions for containerized applications, especially when deployed on
Kubernetes.

In this comprehensive guide, we'll explore how to deploy Prometheus on
Kubernetes using Helm charts and configure it to collect metrics from various
sources.

[ad-logs]

## Understanding the monitoring landscape

Before diving into the deployment process, let's establish a solid understanding
of the key components that make up our monitoring solution.

### The role of Helm in Kubernetes deployments

Kubernetes applications typically consist of multiple resources: deployments,
services, config maps, secrets, and more. Managing these resources individually
can quickly become complex, especially for applications with numerous components
like Prometheus.

Helm addresses this complexity by acting as a package manager for Kubernetes. It
allows us to define, install, and upgrade applications using a concept called
"charts" - a collection of pre-configured Kubernetes resources.

Helm charts encapsulate all necessary manifest files into a single package that
can be deployed consistently across environments.

Helm's architecture revolves around three main concepts:

1. **Chart**: A package containing all resource definitions needed to run an
   application.
2. **Repository**: A storage location for charts.
3. **Release**: A specific instance of a chart deployed in a cluster.

For our Prometheus deployment, we'll leverage
[community-maintained Helm charts](https://github.com/prometheus-community/helm-charts)
that have been optimized for Kubernetes environments.

![Prometheus Helm chart on GitHub](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/df85bec1-c99c-40a4-2baa-3a16c8ec5800/lg2x =1200x600)

### Prometheus fundamentals

Prometheus is an open-source monitoring and alerting system designed with modern
cloud-native applications in mind. Its architecture centers around a time-series
database that stores metrics data and provides powerful querying capabilities.

The core components of Prometheus include:

1. **Prometheus server**: The central component that scrapes and stores
   time-series data.
2. **Alertmanager**: Handles alerts sent by the Prometheus server.
3. **Push Gateway**: Allows short-lived jobs to push metrics to Prometheus.
4. **Exporters**: Agents that expose metrics from various systems in a format
   Prometheus can consume.

Prometheus collects metrics by periodically "scraping" HTTP endpoints that
expose metrics in its format. These endpoints can be on applications, services,
or specialized exporters that translate system metrics into the Prometheus
format.

One of Prometheus's greatest strengths is its [query language (PromQL)](https://betterstack.com/community/guides/monitoring/promql/),
which allows for flexible and powerful manipulation of time-series data. This
makes it excellent for real-time performance analysis, alerting, and
visualization when paired with tools like
[Grafana](https://betterstack.com/community/guides/monitoring/visualize-prometheus-metrics-grafana/).

### Node exporters and metrics collection

[Node exporters](https://betterstack.com/community/guides/monitoring/monitor-linux-prometheus-node-exporter/) are specialized agents
that expose system-level metrics to Prometheus. They serve as bridges between
your infrastructure components and your monitoring system.

## Deploying Prometheus on Kubernetes using Helm

Let's get our hands dirty by deploying Prometheus on a Kubernetes cluster using
Helm charts. We'll follow a step-by-step approach to set up a production-ready
monitoring solution.

### Setting up the Helm repository

The first step is to add the Prometheus community repository to our Helm
configuration. This repository contains official charts maintained by the
Prometheus community.

```command
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```

```text
[output]
"prometheus-community" has been added to your repositories
```

After adding the repository, we need to update our local Helm cache to fetch the
latest chart information:

```command
helm repo update
```

```text
[output]
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "prometheus-community" chart repository
Update Complete. ⎈Happy Helming!⎈
```

### Installing Prometheus using the default configuration

With the repository configured, we can now install Prometheus using a simple
Helm command. We'll name our release `prometheus`:

```command
helm install prometheus prometheus-community/prometheus
```

This command deploys Prometheus with default settings. When execution completes,
Helm will display information about the deployment, including how to access the
various components:

```text
[output]
NAME: prometheus
LAST DEPLOYED: Sun Apr 13 15:30:52 2025
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
The Prometheus server can be accessed via port 80 on the following DNS name from within your cluster:
prometheus-server.default.svc.cluster.local


Get the Prometheus server URL by running these commands in the same shell:
  export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=prometheus,app.kubernetes.io/instance=prometheus" -o jsonpath="{.items[0].metadata.name}")
  kubectl --namespace default port-forward $POD_NAME 9090


The Prometheus alertmanager can be accessed via port 9093 on the following DNS name from within your cluster:
prometheus-alertmanager.default.svc.cluster.local


Get the Alertmanager URL by running these commands in the same shell:
  export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=alertmanager,app.kubernetes.io/instance=prometheus" -o jsonpath="{.items[0].metadata.name}")
  kubectl --namespace default port-forward $POD_NAME 9093
#################################################################################
######   WARNING: Pod Security Policy has been disabled by default since    #####
######            it deprecated after k8s 1.25+. use                        #####
######            (index .Values "prometheus-node-exporter" "rbac"          #####
###### .          "pspEnabled") with (index .Values                         #####
######            "prometheus-node-exporter" "rbac" "pspAnnotations")       #####
######            in case you still need it.                                #####
################################
```

### Examining the deployed resources

Let's check what Kubernetes resources were created by our Helm deployment:

```command
kubectl get all
```

The output will show all the components that make up our Prometheus deployment:

```text
[output]
NAME                                                     READY   STATUS              RESTARTS   AGE
pod/prometheus-alertmanager-0                            1/1     Running             0          68s
pod/prometheus-kube-state-metrics-6cf54df84c-95q62       1/1     Running             0          68s
pod/prometheus-prometheus-node-exporter-25brd            1/1     Running             0          68s
pod/prometheus-prometheus-pushgateway-544579d549-dhd2k   1/1     Running             0          68s
pod/prometheus-server-87dc57df4-crv5p                    0/2     ContainerCreating   0          68s

NAME                                          TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
service/kubernetes                            ClusterIP   10.96.0.1        <none>        443/TCP    2m9s
service/prometheus-alertmanager               ClusterIP   10.110.188.32    <none>        9093/TCP   68s
service/prometheus-alertmanager-headless      ClusterIP   None             <none>        9093/TCP   68s
service/prometheus-kube-state-metrics         ClusterIP   10.97.85.87      <none>        8080/TCP   68s
service/prometheus-prometheus-node-exporter   ClusterIP   10.96.249.245    <none>        9100/TCP   68s
service/prometheus-prometheus-pushgateway     ClusterIP   10.108.175.217   <none>        9091/TCP   68s
service/prometheus-server                     ClusterIP   10.99.42.106     <none>        80/TCP     68s

NAME                                                 DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE
daemonset.apps/prometheus-prometheus-node-exporter   1         1         1       1            1           kubernetes.io/os=linux   68s

NAME                                                READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/prometheus-kube-state-metrics       1/1     1            1           68s
deployment.apps/prometheus-prometheus-pushgateway   1/1     1            1           68s
deployment.apps/prometheus-server                   0/1     1            0           68s

NAME                                                           DESIRED   CURRENT   READY   AGE
replicaset.apps/prometheus-kube-state-metrics-6cf54df84c       1         1         1       68s
replicaset.apps/prometheus-prometheus-pushgateway-544579d549   1         1         1       68s
replicaset.apps/prometheus-server-87dc57df4                    1         1         0       68s

NAME                                       READY   AGE
statefulset.apps/prometheus-alertmanager   1/1     68s
```

![Kubectl get all](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4aea0346-b4ce-46f6-7d7c-5ab68ec51700/md2x =1982x985)

As we can see, the Helm chart has created a variety of Kubernetes resources,
including:

1. Multiple pods for different Prometheus components.
2. Services to provide network access to each component.
3. A DaemonSet for the node exporter to run on each Kubernetes node.
4. Deployments for the server, push gateway, and kube-state-metrics.
5. A StatefulSet for the [Alertmanager](https://betterstack.com/community/guides/monitoring/prometheus-alertmanager/) component.

We can also verify our Helm release:

```command
helm list
```

This should show our Prometheus deployment:

```text
[output]
NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                   APP VERSION
prometheus      default         1               2025-04-13 15:30:52.710496686 +0100 WAT deployed        prometheus-27.8.0       v3.2.1
```

## Accessing the Prometheus dashboard

The Prometheus services are configured with ClusterIP type services, which means
they're only accessible from within the cluster. To access the dashboard from
our local machine, we need to set up port forwarding.

Let's use the following command to forward the Prometheus server port:

```command
kubectl port-forward $(kubectl get pods -l app.kubernetes.io/name=prometheus,app.kubernetes.io/instance=prometheus -o jsonpath='{.items[0].metadata.name}') 9090
```

This command identifies the Prometheus server pod and sets up port forwarding
from our local port 9090 to the pod's port 9090. You should see output similar
to:

```text
[output]
Forwarding from 127.0.0.1:9090 -> 9090
Forwarding from [::1]:9090 -> 9090
```

With port forwarding active, we can now open a web browser and navigate to
`http://localhost:9090` to access the Prometheus dashboard:

![PROMETHEUS DASHBOARD SCREENSHOT](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7f85541b-ecc7-4d23-46ae-fe45b3d1ba00/lg1x =1533x759)

### Exploring the default targets

One of the first things to check in Prometheus is what targets it's monitoring.
Navigate to **Status > Targets** in the Prometheus UI to see the default monitoring
targets.

![PROMETHEUS TARGETS SCREENSHOT](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/167087bd-3e93-48ff-1846-aa4676ec2e00/orig =2374x1361)

By default, the Prometheus Helm chart configures monitoring for:

1. The Kubernetes API server.
2. Kubernetes nodes via the node exporter.
3. The Prometheus server itself.
4. Kubernetes pods.
5. The Push Gateway.
6. Kubernetes service endpoints.

We can verify that Prometheus is collecting metrics by checking the metrics
endpoint directly. While keeping the port forwarding active, open
`http://localhost:9090/metrics` in a new browser tab. This shows the raw metrics
being exposed by Prometheus itself.

![PROMETHEUS TARGETS SCREENSHOT](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5b7b761b-45a0-4155-7b4a-f5356ce3a300/public =1736x1127)

### Running basic PromQL queries

Prometheus uses a query language called [PromQL](https://betterstack.com/community/guides/monitoring/promql/) to search and analyze
the collected metrics. Let's try some basic queries to get familiar with the
interface.

From the Prometheus homepage, click on the "Graph" tab, and then select "Table"
view. In the expression input box, start typing to see autocomplete suggestions
for available metrics.

For example, let's query the total HTTP requests to the Prometheus server:

```text
prometheus_http_requests_total
```

After executing this query, you'll see a table with results showing the count of
HTTP requests broken down by handler, instance, and job.

![PROMETHEUS QUERY RESULTS SCREENSHOT](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8094d5c7-8aa7-4d95-5f46-b5dbe0f79200/lg2x =2374x1361)

We can filter these results further by adding conditions. For instance, to see
only requests to a specific handler:

```text
prometheus_http_requests_total{handler="/api/v1/query"}
```

This refined query will show only requests to the query API endpoint.

![FILTERED QUERY RESULTS SCREENSHOT](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4d6925f8-bc2f-47fb-d6c2-f046def94100/lg2x =2292x934)

## Customizing Prometheus configuration

While the default setup is useful, real-world deployments often require
customization. Let's modify our Prometheus configuration to monitor additional
targets.

### Preparing a custom values file

Helm charts use values files to customize their behavior. To customize our
Prometheus deployment, we'll create our own values file:

```command
touch prometheus-values.yaml
```

Now, let's edit this file to add custom scrape targets. We'll focus on the
`serverFiles` section, which contains the Prometheus server configuration:

```yaml
[label prometheus-values.yaml]
serverFiles:
  prometheus.yml:
    scrape_configs:
      - job_name: prometheus
        static_configs:
          - targets:
            - localhost:9090
      - job_name: docker-daemon
        static_configs:
          - targets:
            - host.docker.internal:9323
```

In this configuration:

- We've kept the default `prometheus` job that monitors the Prometheus server
  itself.
- We've added a new job named `docker-daemon` to monitor the
  [metrics from the Docker Daemon](https://docs.docker.com/engine/daemon/prometheus/).

Before you proceed, ensure Docker is configured to expose its metrics by editing
your configuration at `/etc/docker/daemon.json` or using Docker Desktop:

```json
[label /etc/docker/daemon.json]
{
  "metrics-addr": "127.0.0.1:9323"
}
```

![Docker Desktop](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b55ce913-82f7-409b-9f83-1b0aac70b300/lg2x =2743x907)

### Applying the custom configuration

To apply our custom configuration, we first need to uninstall the existing
Prometheus release:

```command
helm uninstall prometheus
```

```text
[output]
release "prometheus" uninstalled
```

Now we can reinstall it with our custom values file:

```command
helm install prometheus prometheus-community/prometheus -f prometheus-values.yaml
```

You can also use `helm upgrade` to apply changes to an existing release without
requiring a complete uninstallation:

```command
helm upgrade prometheus prometheus-community/prometheus -f prometheus-values.yaml
```

After the installation/upgrade completes, let's set up port forwarding again:

```command
kubectl port-forward $(kubectl get pods -l app.kubernetes.io/name=prometheus,app.kubernetes.io/instance=prometheus -o jsonpath='{.items[0].metadata.name}') 9090
```

Now when we check the targets page in the Prometheus UI (**Status > Targets**),
we should see our new external node exporter target.

![UPDATED TARGETS SCREENSHOT](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/84e96f21-e240-406b-38d5-978d1e3d5d00/lg1x =2367x1151)

## Final thoughts

Implementing Prometheus on Kubernetes using Helm charts offers a powerful
monitoring solution with remarkable flexibility. By leveraging
community-maintained charts, we can quickly deploy a production-ready monitoring
infrastructure while retaining the ability to customize it for specific
requirements.

The approach demonstrated in this guide allows for monitoring both traditional
and containerized infrastructure components from a single, centralized platform.

As organizations continue to adopt cloud-native technologies, having robust
monitoring solutions like Prometheus becomes increasingly critical for
maintaining reliability and performance.

Thanks for reading!
