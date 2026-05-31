# Deploying Grafana on Kubernetes using Helm Charts

Visualizing metrics is just as important as collecting them for effective
monitoring of applications running in Kubernetes environments.

[Grafana](https://betterstack.com/community/guides/monitoring/visualize-prometheus-metrics-grafana/) has become a prominent tool for
creating insightful dashboards that transform raw metrics into actionable
intelligence.

In this comprehensive guide, we'll explore how to deploy Grafana on Kubernetes
using Helm charts and set it up to visualize metrics from various sources.

[ad-logs]

## Understanding the metrics visualization landscape

Before diving into the deployment process, let's establish a solid understanding
of the key components that make up our visualization solution.

### The role of Helm in Kubernetes deployments

Kubernetes applications are typically composed of multiple resources:
deployments, services, config maps, secrets, and more. Managing these resources
individually becomes increasingly complex, especially for applications with
numerous components.

Helm simplifies this complexity by acting as a package manager for Kubernetes.
It enables us to define, install, and upgrade applications using "charts" -
collections of pre-configured Kubernetes resources. Helm charts encapsulate all
necessary manifest files into a single package that can be deployed consistently
across environments.

The architecture of Helm is built around three fundamental concepts:

1. **Chart**: A package containing all resource definitions needed to run an
   application.
2. **Repository**: A storage location for charts.
3. **Release**: A specific instance of a chart deployed in a cluster.

For our Grafana deployment, we'll leverage community-maintained Helm charts that
have been optimized for Kubernetes environments.

### Grafana fundamentals

Grafana is an open-source visualization and analytics platform designed to work
with various data sources. While it's most commonly used with time-series
databases like [Prometheus](https://betterstack.com/community/guides/monitoring/prometheus/), Grafana supports a wide range of data
sources including InfluxDB, Elasticsearch, MySQL, PostgreSQL, and many others.

The core features of Grafana include:

1. **Dashboard Creation**: Intuitive interface for building custom dashboards
   with various visualization types
2. **Data Source Integration**: Connect to multiple data sources and combine
   their data in a single dashboard
3. **Alerting**: Define alert rules based on threshold conditions
4. **User Management**: Control access to dashboards with role-based permissions
5. **Annotations**: Add contextual information to graphs, such as deployment
   events

What makes Grafana particularly powerful is its ability to transform complex
data into meaningful visualizations. Using its query editors, you can craft
specific queries for each data source and display the results using various
visualization panels: graphs, gauges, tables, heatmaps, and more.

### The Grafana ecosystem

While Grafana itself is focused on visualization, the broader Grafana ecosystem
includes several related tools:

1. **Loki**: A horizontally-scalable, highly-available log aggregation system
   designed to be very cost-effective.
2. **Tempo**: A high-scale distributed tracing backend.
3. **Mimir**: A highly scalable Prometheus-compatible metrics solution.

Together, these tools form what's sometimes referred to as the "Grafana LGTM
stack" (Loki, Grafana, Tempo, Mimir), which provides comprehensive observability
capabilities.

For this guide, we'll focus specifically on deploying Grafana, but it's worth
understanding that it's part of a broader ecosystem.

## Deploying Grafana on Kubernetes using Helm

Let's get practical by deploying Grafana on a Kubernetes cluster using Helm
charts. We'll follow a step-by-step approach to set up a production-ready
visualization platform.

### Setting up the Helm repository

The first step is to add the Grafana repository to our Helm configuration. This
repository contains official charts maintained by the Grafana team.

```command
helm repo add grafana https://grafana.github.io/helm-charts
```

```text
[output]
"grafana" has been added to your repositories
```

After adding the repository, we need to update our local Helm cache to fetch the
latest chart information:

```command
helm repo update
```

```text
[output]
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "grafana" chart repository
...Successfully got an update from the "prometheus-community" chart repository
Update Complete. ⎈Happy Helming!⎈
```

### Installing Grafana using default configuration

With the repository configured, we can now install Grafana using a simple Helm
command. We'll name our release "grafana":

```command
helm install grafana grafana/grafana
```

This command deploys Grafana with default settings. When execution completes,
Helm will display information about the deployment, including how to access the
various components:

```text
[output]
NAME: grafana
LAST DEPLOYED: Sun Apr 13 17:21:48 2025
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
1. Get your 'admin' user password by running:

   kubectl get secret --namespace default grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo


2. The Grafana server can be accessed via port 80 on the following DNS name from within your cluster:

   grafana.default.svc.cluster.local

   Get the Grafana URL to visit by running these commands in the same shell:
     export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=grafana" -o jsonpath="{.items[0].metadata.name}")
     kubectl --namespace default port-forward $POD_NAME 3000

3. Login with the password from step 1 and the username: admin
#################################################################################
######   WARNING: Persistence is disabled!!! You will lose your data when   #####
######            the Grafana pod is terminated.                            #####
################################################################################
```

### Examining the deployed resources

Let's check what Kubernetes resources were created by our Helm deployment:

```command
kubectl get all -l "app.kubernetes.io/name=grafana"
```

The output will show the components that make up our Grafana deployment:

```text
[output]
NAME                           READY   STATUS              RESTARTS   AGE
pod/grafana-6ddc59dff5-jqwfv   0/1     ContainerCreating   0          35s

NAME              TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
service/grafana   ClusterIP   10.97.116.140   <none>        80/TCP    35s

NAME                      READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/grafana   0/1     1            0           35s

NAME                                 DESIRED   CURRENT   READY   AGE
replicaset.apps/grafana-6ddc59dff5   1         1         0       35s
```

![Grafana K8s](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d548d73c-f5f4-4278-4aef-990af4ae4800/md2x =1286x571)

As we can see, the Helm chart has created several Kubernetes resources:

1. A pod running the Grafana application.
2. A service to provide network access to Grafana.
3. A deployment to manage the Grafana pod.
4. A replica set created by the deployment.

We can also verify our Helm release:

```command
helm list
```

This should show our Grafana deployment:

```text
[output]
NAME    NAMESPACE       REVISION        UPDATED                                 STATUS          CHART           APP VERSION
grafana default         1               2025-04-13 17:21:48.507199693 +0100 WAT deployed        grafana-8.11.4  11.6.0
```

## Accessing the Grafana dashboard

The Grafana service is configured with a ClusterIP type service, which means
it's only accessible from within the cluster. To access the dashboard from our
local machine, we need to set up port forwarding.

First, let's retrieve the admin password that was automatically generated during
installation:

```command
kubectl get secret grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```

This command retrieves the admin password from the Kubernetes secret and decodes
it. You should see output similar to:

```text
[output]
XZuXrK16lD68JBgiuazgpSaRM0zkxtPRWnE8FqKJ
```

Now, let's use the following command to forward the Grafana server port:

```command
kubectl port-forward $(kubectl get pods -l "app.kubernetes.io/name=grafana" -o jsonpath='{.items[0].metadata.name}') 3000:3000
```

This command identifies the Grafana pod and sets up port forwarding from our
local port 3000 to the pod's port 3000. You should see output similar to:

```text
[output]
Forwarding from 127.0.0.1:3000 -> 3000
Forwarding from [::1]:3000 -> 3000
```

With port forwarding active, we can now open a web browser and navigate to
`http://localhost:3000` to access the Grafana dashboard. Log in using the
username `admin` and the password we retrieved earlier.

![GRAFANA LOGIN SCREENSHOT](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/129a9001-50ca-4448-7ce8-29f4719a2c00/orig =2367x1177)

After logging in, you'll be presented with the Grafana home dashboard.

![GRAFANA HOME DASHBOARD SCREENSHOT](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/904e8494-a89c-4f9e-0318-bbf323e63700/lg2x =2367x1338)

## Customizing Grafana configuration

While the default setup is functional, real-world deployments often require
customization. Let's modify our Grafana configuration to add data sources and
provide a better user experience.

### Preparing a custom values file

Helm charts use values files to customize their behavior. To customize our
Grafana deployment, we'll create our own values file:

```command
touch grafana-values.yaml
```

Now, let's edit this file to customize our Grafana deployment:

```yaml
[label grafana-values.yaml]
adminPassword: "strongpassword"

persistence:
  enabled: true
  size: 10Gi
  storageClassName: standard

datasources:
  datasources.yaml:
    apiVersion: 1
    datasources:
    - name: Prometheus
      type: prometheus
      url: http://prometheus-server.default.svc.cluster.local
      access: proxy
      isDefault: true

dashboardProviders:
  dashboardproviders.yaml:
    apiVersion: 1
    providers:
    - name: 'default'
      orgId: 1
      folder: ''
      type: file
      disableDeletion: false
      editable: true
      options:
        path: /var/lib/grafana/dashboards/default

dashboards:
  default:
    kubernetes:
      gnetId: 15661
      revision: 1
      datasource: Prometheus
    node-exporter:
      gnetId: 1860
      revision: 27
      datasource: Prometheus
```

In this configuration:

- We've set a custom admin password.
- We've enabled persistent storage to preserve dashboards and settings.
- We've configured Prometheus as a data source, assuming we have Prometheus
  deployed in the same namespace.
- We've set up dashboard providers to load dashboards from files.
- We've specified two dashboards to be automatically imported from grafana.com:
  a Kubernetes overview dashboard and a Node Exporter dashboard.

### Applying the custom configuration

To apply our custom configuration, we first need to uninstall the existing
Grafana release:

```command
helm uninstall grafana
```

Now we can reinstall it with our custom values file:

```command
helm install grafana grafana/grafana -f grafana-values.yaml
```

After the installation completes, let's set up port forwarding again:

```command
kubectl port-forward $(kubectl get pods -l "app.kubernetes.io/name=grafana" -o jsonpath='{.items[0].metadata.name}') 3000:3000
```

Now when we access Grafana at `http://localhost:3000` and log in with the
username `admin` and the password `strongpassword`, we should see our
pre-configured dashboards and data sources.

## Final thoughts

Deploying Grafana on Kubernetes using Helm charts provides a flexible and
powerful visualization platform for your monitoring data.

By leveraging community-maintained charts, we can quickly set up a
production-ready visualization infrastructure while retaining the ability to
customize it for specific requirements.

The approach demonstrated in this guide allows for integrating metrics, logs,
and traces from various sources into cohesive, insightful dashboards.

As organizations continue to adopt cloud-native technologies, having robust
visualization tools like Grafana becomes increasingly important for
understanding system behavior, diagnosing issues, and making data-driven
decisions.

Grafana's rich ecosystem of data source integrations, visualization options, and
extensibility makes it an excellent choice for building a comprehensive
observability platform.