# Deploying the OpenTelemetry Helm Chart in Kubernetes

Modern observability requires robust telemetry collection, and the
[OpenTelemetry Collector](https://betterstack.com/community/guides/observability/opentelemetry-collector/) has emerged as a powerful
solution for this need. However, deploying and managing the Collector in
production environments poses unique challenges, especially at scale. This is
where Kubernetes and Helm together provide an elegant solution, simplifying both
deployment and ongoing maintenance.

While the OpenTelemetry Collector offers exceptional flexibility for handling
telemetry data, setting it up manually can be time-consuming. Configuring the
Collector, determining hosting options, and creating deployment manifests
requires significant effort. Fortunately, the OpenTelemetry team maintains
official Helm charts that streamline this process considerably.

Kubernetes provides an ideal platform for running the Collector due to its
container orchestration capabilities, while Helm's templating power helps manage
the configuration complexity. Together, they create a deployment experience
that's both powerful and approachable.

Let's look at how to set them up in this article.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/ZJzQLSfuNUI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Understanding the key concepts

Before diving into the deployment, let's establish some key concepts that make
working with the OpenTelemetry Collector in Kubernetes more efficient.

### Config file and default values

The Collector's behavior is controlled by a YAML configuration file, which
defines receivers, processors, exporters, and service pipelines. One of the
significant advantages of the Helm chart is that it provides sensible defaults
for many parameters, which means your custom configuration can be much more
concise, focusing only on what you need to override.

### Presets for simplified configuration

Presets are pre-configured bundles of functionality that handle complex setups
with minimal user input. They're especially valuable when the functionality
requires more than just configuration, such as specific Kubernetes permissions.
For instance, enabling the Kubernetes attributes preset automatically sets up
the necessary RBAC permissions and configures the
[k8sattributes processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/k8sattributesprocessor/README.md),
which enriches telemetry data with Kubernetes metadata.

### Environment variable substitution

The Collector supports replacing placeholders in its configuration with
environment variables at runtime. This feature allows you to keep sensitive
information (like API keys) out of your configuration files and simplifies
deployment across different environments.

```yaml
exporters:
  otlp:
    endpoint: api.example.com:443
    headers:
      api-key: ${API_KEY}
```

In this example, `${API_KEY}` will be replaced with the value of the environment
variable when the Collector starts.

### Deployment modes

The OpenTelemetry Helm chart supports various Kubernetes deployment strategies.
The two most common are:

1. **Deployment**: Standard Kubernetes deployment that allows easy scaling and
   management of pods
2. **DaemonSet**: Ensures one instance of the Collector runs on each node in the
   cluster

The `DaemonSet` approach is particularly valuable when you want to collect
telemetry data close to the source, reducing cross-node network traffic and
improving data locality.

## Prerequisites

Before deploying the OpenTelemetry Collector with Helm, ensure you have:

1. A functioning Kubernetes cluster (version 1.16 or later).
2. Helm 3 installed and configured.
3. Appropriate permissions to deploy resources in your cluster.
4. A basic understanding of your telemetry needs and backend systems.

For our example, we'll use a simple two-node Kubernetes cluster, though the
approach scales to much larger environments.

[ad-uptime]

## Preparing for deployment

Let's begin by adding the
[OpenTelemetry Helm repository](https://github.com/open-telemetry/opentelemetry-helm-charts)
to your Helm configuration:

```command
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
```

```command
helm repo update
```

This command adds the official OpenTelemetry Helm repository and updates your
local repository cache. Now you can access the OpenTelemetry Collector chart and
begin planning your deployment strategy.

Consider whether a Deployment or `DaemonSet` makes more sense for your
environment. For most cases where you're collecting telemetry directly from
application nodes, a `DaemonSet` provides better data locality and reduces
network overhead since each node has its own Collector instance.

## Configuring the Collector

Now let's create a `values.yaml` file that overrides the default configurations
to suit our needs. This is where the Helm chart's power becomes evident as you
only need to specify what differs from the defaults.

Let's create a configuration that:

1. Uses a `DaemonSet` deployment model.
2. Sets appropriate resource limits.
3. Pins to a specific Collector version.
4. Enables Kubernetes attribute enrichment.
5. Configures receivers, exporters, and pipelines.

```yaml
[label values.yaml]
mode: daemonset
resources:
  limits:
    cpu: 1
    memory: 1Gi
  requests:
    cpu: 200m
    memory: 400Mi
image:
  tag: "0.81.0"

# Enable Kubernetes attributes enrichment
presets:
  kubernetesAttributes:
    enabled: true

# Collector configuration
config:
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: 0.0.0.0:4317
        http:
          endpoint: 0.0.0.0:4318
          cors:
            allowed_origins:
              - http://*
              - https://*

  processors:
    batch:
      send_batch_size: 8192
      timeout: 5s
    memory_limiter:
      check_interval: 5s
      limit_mib: 800
      spike_limit_mib: 150

  exporters:
    otlp:
      endpoint: observability.example.com:443
      headers:
        api-key: ${OBSERVABILITY_API_KEY}
    otlp/metrics:
      endpoint: metrics.example.com:443
      headers:
        api-key: ${METRICS_API_KEY}

  service:
    pipelines:
      traces:
        receivers: [otlp]
        processors: [memory_limiter, batch, k8sattributes]
        exporters: [otlp]
      metrics:
        receivers: [otlp]
        processors: [memory_limiter, batch, k8sattributes]
        exporters: [otlp/metrics]
```

Let's examine the key sections of this configuration:

### Deployment settings

The top portion configures how the Collector is deployed in Kubernetes:

```yaml
mode: daemonset
resources:
  limits:
    cpu: 1
    memory: 1Gi
  requests:
    cpu: 200m
    memory: 400Mi
image:
  tag: "0.81.0"
```

This configuration sets the deployment mode to `DaemonSet`, allocates resources
appropriately (1 CPU and 1GB RAM limits), and pins to a specific version of the
Collector (`0.81.0`) for stability.

Specifying a particular version instead of using "latest" is a good practice for
production deployments, as it ensures consistency and prevents unexpected
changes during updates.

### Presets for enhanced functionality

```yaml
presets:
  kubernetesAttributes:
    enabled: true
```

The `kubernetesAttributes` preset automatically configures the Collector to
enrich telemetry data with Kubernetes metadata like pod names, namespaces, and
node information. This is immensely valuable for troubleshooting and filtering
telemetry data in your observability backend.

Enabling this preset not only adds the k8sattributes processor to your pipeline
but also handles the necessary RBAC permissions for accessing the Kubernetes
API.

### Receiver configuration

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
        cors:
          allowed_origins:
            - http://*
            - https://*
```

This configuration sets up both gRPC and HTTP OTLP receivers with CORS enabled
for the HTTP endpoint. The CORS settings allow browsers from any origin to send
telemetry data to the Collector, which is useful for web applications.

### Processor configuration

```yaml
processors:
  batch:
    send_batch_size: 8192
    timeout: 5s
  memory_limiter:
    check_interval: 5s
    limit_mib: 800
    spike_limit_mib: 150
```

The batch processor buffers telemetry data before sending it to exporters,
improving efficiency. The memory_limiter processor helps prevent out-of-memory
situations by monitoring memory usage and applying backpressure when necessary.

### Exporter configuration

```yaml
exporters:
  otlp:
    endpoint: observability.example.com:443
    headers:
      api-key: ${OBSERVABILITY_API_KEY}
  otlp/metrics:
    endpoint: metrics.example.com:443
    headers:
      api-key: ${METRICS_API_KEY}
```

This sets up two exporters: one for traces and another for metrics. Each has its
own endpoint and API key, which will be populated from environment variables.
Using different exporters allows for sending different telemetry types to
different backends or different projects within the same backend.

### Service pipelines

```yaml
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch, k8sattributes]
      exporters: [otlp]
    metrics:
      receivers: [otlp]
      processors: [memory_limiter, batch, k8sattributes]
      exporters: [otlp/metrics]
```

The service section defines pipelines that connect receivers, processors, and
exporters. Each pipeline creates a complete flow for a specific telemetry type.
Note that the k8sattributes processor is included in each pipeline, courtesy of
the preset we enabled.

## Deployment implementation

Before applying the configuration, it's good practice to perform a dry run to
validate everything:

```command
helm install my-otel-collector open-telemetry/opentelemetry-collector \
  --values collector-values.yaml \
  --set extraEnvs[0].name=<observability_api_key> \
  --set extraEnvs[0].value=<secret-key-123> \
  --set extraEnvs[1].name=<metrics_api_key> \
  --set extraEnvs[1].value=<metrics-key-456> \
  --dry-run
```

The `--set` parameters inject environment variables that will be available to
the Collector for placeholder substitution. For production deployments, you
should use Kubernetes secrets instead of passing sensitive values directly in
the command line.

Review the generated output carefully, paying attention to the `ConfigMap` that
contains your Collector configuration to ensure everything looks correct.

Once satisfied, remove the `--dry-run` flag to perform the actual deployment:

```command
[helm-install]
helm install my-otel-collector open-telemetry/opentelemetry-collector \
  --values collector-values.yaml \
  --set extraEnvs[0].name=<observability_api_key> \
  --set extraEnvs[0].value=<secret-key-123> \
  --set extraEnvs[1].name=<metrics_api_key> \
  --set extraEnvs[1].value=<metrics-key-456>
```

This will deploy the OpenTelemetry Collector according to your configuration.
Verify the deployment status:

```command
kubectl get pods -l app.kubernetes.io/name=opentelemetry-collector
```

```text
[output]
NAME                                READY   STATUS    RESTARTS   AGE
my-otel-collector-daemonset-8x4fg   1/1     Running   0          45s
my-otel-collector-daemonset-p2jlm   1/1     Running   0          45s
```

You should see one pod per node in your cluster when using the `DaemonSet` mode.

## Advanced configuration options

For production deployments, you should store sensitive information like API keys
in Kubernetes secrets:

```command
kubectl create secret generic otel-secrets \
  --from-literal=observability-api-key=<secret-key-123> \
  --from-literal=metrics-api-key=<metrics-key-456>
```

Then modify your `values.yaml` to use these secrets:

```yaml
[label values.yaml]
extraEnvs:
  - name: OBSERVABILITY_API_KEY
    valueFrom:
      secretKeyRef:
        name: otel-secrets
        key: observability-api-key
  - name: METRICS_API_KEY
    valueFrom:
      secretKeyRef:
        name: otel-secrets
        key: metrics-api-key
```

### Configuring for high-volume telemetry

For environments with high telemetry volume, adjust the processors for better
performance:

```yaml
processors:
  batch:
    send_batch_size: 16384
    timeout: 10s
  memory_limiter:
    check_interval: 2s
    limit_mib: 1800
    spike_limit_mib: 500
```

Increase resource allocations as well:

```yaml
resources:
  limits:
    cpu: 2
    memory: 2Gi
  requests:
    cpu: 500m
    memory: 1Gi
```

### Monitoring the Collector

The OpenTelemetry Collector can monitor itself. You only need to add these
configurations to your `values.yaml`:

```yaml
config:
  receivers:
    prometheus:
      config:
        scrape_configs:
          - job_name: 'otel-collector'
            scrape_interval: 10s
            static_configs:
              - targets: ['${MY_POD_IP}:8888']
  service:
    telemetry:
      metrics:
        address: 0.0.0.0:8888
```

This enables the Collector's internal metrics endpoint and configures it to
scrape itself.

### Updating the Collector

When updating the Collector to a new version, change the image tag in your
values file and apply the update:

```command
helm upgrade my-otel-collector open-telemetry/opentelemetry-collector \
  --values updated-values.yaml
```

The Helm chart handles the rollout strategy, ensuring minimal disruption to
telemetry collection.

## Real-world implementation example

Let's consider a complete example for sending telemetry to an observability
platform like Better Stack:

```yaml
[label values.yaml]
mode: daemonset
resources:
  limits:
    cpu: 1
    memory: 1Gi
  requests:
    cpu: 200m
    memory: 400Mi
image:
  tag: "0.81.0"

presets:
  kubernetesAttributes:
    enabled: true

config:
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: 0.0.0.0:4317
        http:
          endpoint: 0.0.0.0:4318
          cors:
            allowed_origins:
              - http://*
              - https://*

  processors:
    batch:
      send_batch_size: 10000
      timeout: 10s
    memory_limiter:
      check_interval: 5s
      limit_mib: 800
      spike_limit_mib: 200

  exporters:
    otlphttp/betterstack:
    endpoint: ${INGESTING_HOST}
    headers:
      Authorization: "Bearer ${SOURCE_TOKEN}"

  service:
    pipelines:
      logs:
        receivers: [otlp]
        processors: [memory_limiter, batch, k8sattributes]
        exporters: [otlphttp/betterstack]
```

In this configuration:

1. We're using multiple exporters to send different telemetry types to different
   datasets.
2. We've configured robust processors to handle high volumes efficiently.
3. We've enabled the Kubernetes attributes preset for metadata enrichment.
4. CORS is configured to allow web applications to send telemetry.

Deploy this with appropriate API key handling:

```command
kubectl create secret generic betterstack-secrets \
  --from-literal=source-token=<your-betterstack-source-token> \
  --from-literal=ingesting-host=<your-betterstack-ingesting-host>
```

```command
helm install betterstack-collector open-telemetry/opentelemetry-collector \
  --values values.yaml \
  --set extraEnvs[0].name=SOURCE_TOKEN \
  --set extraEnvs[0].valueFrom.secretKeyRef.name=betterstack-secrets \
  --set extraEnvs[0].valueFrom.secretKeyRef.key=source-token \
  --set extraEnvs[0].name=INGESTING_HOST \
  --set extraEnvs[0].valueFrom.secretKeyRef.name=betterstack-secrets \
  --set extraEnvs[0].valueFrom.secretKeyRef.key=ingesting-host
```

## Final thoughts

The OpenTelemetry Collector combined with Kubernetes and Helm provides a
powerful, flexible foundation for your observability infrastructure.

With sensible defaults, powerful presets, and Kubernetes-native deployment
options, you can quickly deploy a robust telemetry pipeline that grows with your
needs.

This approach simplifies both initial deployment and ongoing maintenance,
letting you focus on deriving insights from your telemetry data rather than
managing the collection infrastructure.

Thanks for reading!
