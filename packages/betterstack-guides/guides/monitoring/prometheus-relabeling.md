# Relabeling in Prometheus: A Complete Guide

[Prometheus](https://betterstack.com/community/guides/monitoring/prometheus/) relabeling provides powerful control over your
monitoring data by dynamically modifying targets, metrics, and alerts at various
stages in the monitoring pipeline.

Common use cases for relabeling include dropping high-cardinality labels or
unnecessary metrics, improving readability by renaming labels or their values,
and excluding specific targets from being scraped.

In this article, we'll explore Prometheus' relabeling feature and its role in
managing and refining metrics.

You'll learn where relabeling fits within Prometheus, its use cases, and provide
practical examples to help you effectively manage [your observability
data](https://betterstack.com/community/guides/observability/what-is-observability/).

Without further ado, let's dive in!

[ad-logs]

## How Prometheus relabeling works

Relabeling is configured through the following fields in the Prometheus
configuration file:

```yaml
[label prometheus.yml]
scrape_configs:
  - job_name: node-exporter
    static_configs:
      - targets:
          - node-exporter-1:9100
[highlight]
    relabel_configs:
[/highlight]
    [ - <relabel_config> ... ]

[highlight]
    metric_relabel_configs:
[/highlight]
    [ - <relabel_config> ... ]

remote_write:
[highlight]
    write_relabel_configs:
[/highlight]
    [ - <relabel_config> ... ]

alerting:
[highlight]
  alert_relabel_configs:
[/highlight]
  [ - <relabel_config> ... ]
```

We have four places where relabeling can be applied as part of the monitoring
workflow. Let's look at each one in turn:

1. `relabel_configs`: Modifies **targets** _before_ scraping, often using
   internal labels prefixed with `__` to filter or adjust scraping behavior.

2. `metric_relabel_configs`: Modifies **metrics** _after_ scraping but before
   _storage_, enabling filtering, renaming, or adding labels.

3. `write_relabel_configs`: Modifies **metrics** _before_ sending them to a
   remote storage system, allowing for data filtering or transformations
   specific to the observability backend.

4. `alert_relabel_configs`: Applied to **alerts** _before_ sending them to the
   [Alertmanager](https://betterstack.com/community/guides/monitoring/prometheus-alertmanager/) to enabling customization of alert
   content and routing.

Each block uses a similar configuration structure, which we'll explore in detail
next.

## Understanding the relabeling configuration

Each relabeling operation is defined by a set of rules that dictate how labels
are transformed. These rules consist of the following key components:

- `source_labels`: These are the labels to use as input for the transformation.
  Its contents are concatenated using the `separator` field and matched against
  the provided `regex`.

- `separator`: The separator is a character used to join multiple
  `source_labels` together. It defaults to `;`.

- `regex`: A regular expression to match against the combined value of the
  `source_labels`. The default is `(.*)`, which matches everything.

- `action`: The type of transformation that should be performed (such as
  `replace`, `drop`, `keep`, etc). The default is `replace`.

- `target_label`: This field specifies the target label that should be modified
  or created.

- `replacement`: This is the new value for the `target_label`. The default is
  `$1` which is the first capturing group in the `regex` field.

- `modulus`: Within `hashmod` operations, this specifies the number of groups
  for targets or metrics.

Here's the full configuration block showing the defaults:

```yaml
[label prometheus.yml]
<relabel_configs|metric_relabel_configs|write_relabel_configs|alert_relabel_configs>:
  - source_labels: [label_name,...]
    separator: ;
    regex: (.*)
    target_label: label_name
    replacement: $1
    action: replace
    modulus: <int> # Only for hashmod
```

Let's dive deeper into each of these components and explore how they work
together to manipulate your labels.

### source_labels and separator

The `source_labels` field specifies the labels that will be used as input for
the transformation. When multiple labels are used, their values are combined
using the `separator`.

Consider these metrics:

```promql
http_requests_total{method="GET", code="200"} 10
http_requests_total{method="POST", code="404"} 2
```

To create a new label combining the method and code, you can use the following
configuration:

```yaml
[label prometheus.yml]
metric_relabel_configs:
  - source_labels: [method, code]
    separator: "_"
```

This will extract the values of the `method` and `code` labels and combine them
with an underscore, resulting in:

```text
GET_200
POST_404
```

### regex

The `regex` field allows you to match and extract specific parts of label values
using a
[RE2-compatible regular expression](https://github.com/google/re2/wiki/syntax).

It works by matching against the combined value extracted from the
`source_labels` (joined by the `separator`, if used). Capture groups can be used
to extract portions of the matched value, which can be referenced later in the
`replacement` field.

Suppose your targets have an `id` label with values like
`app-123.us-east-1.prod`:

```promql
scrape_series_added{id="app-123.us-east-1.prod", job="myapp_exporter", instance="app-123.us-east-1.prod:8080"} 50
```

To extract the `name`, `region`, and `environment` from this label, you can use
the following `regex`:

```yaml
[label prometheus.yml]
relabel_configs:
  - source_labels: [id]
[highlight]
    regex: ^(.*)\.(.*)\.(.*)$
[/highlight]
```

This regex defines three capture groups separated by periods, effectively
splitting the `id` value into its components. It will split a string like
`foo.bar.baz` into `foo`, `bar`, and `baz`.

Note that if `regex` is unspecified, it defaults to `(.*)`, which matches the
entire input. Also, if the regex doesn't match the `source_labels`, the
relabeling operation is skipped for that target or metric.

### replacement

The `replacement` field allows you to reference the groups captured by the
`regex` field. It defaults to `$1`, which represents the first captured group or
the entire extracted value if no `regex` is specified.

Continuing from the previous example where we extracted components from the `id`
label, we can use replacement to change the period separator to underscores:

```yaml
[label prometheus.yml]
relabel_configs:
  - source_labels: [id]
    regex: ^(.*)\.(.*)\.(.*)$
[highlight]
    replacement: $1_$2_$3
[/highlight]
```

This will transform values like:

```text
app-123.us-east-1.prod
```

into:

```text
app-123_us-east-1_prod
```

### target_label

The `target_label` field is the destination for the result of your
transformation. It determines what label will be modified or created based on
the relabeling rule.

If you think of it like addressing an envelope, the `target_label` is the name
you write on the envelope, while the `replacement` is the message you put
inside.

The behavior of `target_label` depends on the specified `action`. With the
default `replace` action, it will create or modify the specified label with the
`replacement` value.

A straightforward use case is adding metadata from service discovery into the
target labels:

```yaml
[label prometheus.yml]
relabel_configs:
  - source_labels: [__meta_kubernetes_namespace]
    target_label: namespace
```

Here, a `namespace` label will be created for each matching target with the
value contained in the `__meta_kubernetes_namespace` service discovery field.

If you're splitting a value into multiple components with the intention of
placing them in their own labels, you'll need to specify multiple relabeling
steps:

```yaml
[label prometheus.yml]
relabel_configs:
  - source_labels: [id]
    regex: ^(.*)\.(.*)\.(.*)$
    replacement: $1 # already the default
    target_label: name

  - source_labels: [id]
    regex: ^(.*)\.(.*)\.(.*)$
    replacement: $2
    target_label: region

  - source_labels: [id]
    regex: ^(.*)\.(.*)\.(.*)$
    replacement: $3
    target_label: env
```

The above configuration will transform metrics like:

```promql
scrape_series_added{id="app-123.us-east-1.prod", job="myapp_exporter", instance="app-123.us-east-1.prod:8080"} 50
```

To:

```promql
scrape_series_added{id="app-123.us-east-1.prod", job="myapp_exporter", instance="app-123.us-east-1.prod:8080", name="app-123", region="us-east-1", env="prod"} 50
```

### action

The `action` field in a relabeling block determines the type of transformation
applied to your labels. The default action is `replace`, which creates or
modifies the `target_label` with the value from `replacement` as you've already
seen.

However, there are other actions available:

#### 1. keep

The `keep` action lets you define an allowlist that keeps only the targets or
metrics matching the specified conditions in `source_labels` and `regex`. Any
data that doesn't match is dropped.

Here's an example:

```yaml
[label prometheus.yml]
relabel_configs:
  - source_labels: [app, region]
    separator: ":"
    regex: frontend:us-west
    action: keep
```

This configuration instructs Prometheus to scrape only targets where the
combined value of app and region (separated by a colon) matches the regex
`frontend:us-west`. Targets that don't match this condition are excluded from
scraping.

#### 2. drop

The `drop` action is the counterpart to `keep`. It defines a `denylist`,
dropping any targets or metrics that match the conditions specified in
`source_labels` and `regex`:

```yaml
[label prometheus.yml]
metric_relabel_configs:
  - source_labels: [__name__]
    regex: go_.* # drop all metrics prefixed with `go_`
    action: drop
```

#### 3. labelkeep and labeldrop

These actions provide a direct way to control which labels are retained or
discarded based on their names:

- `labelkeep`: Retains only the labels whose names match the provided `regex`.
- `labeldrop`: Removes the labels that match the `regex`.

For example, you can remove all other labels except `app` and `env` with:

```yaml
[label prometheus.yml]
relabel_configs:
  - action: labelkeep
    regex: app|env
```

Or you can drop the `job` label with:

```yaml
[label prometheus.yml]
relabel_configs:
  - action: labeldrop
    regex: job
```

#### 4. labelmap

Kubernetes provides extensive metadata about your pods, deployments, and
services through labels. However, these labels often have long, complex names
like `__meta_kubernetes_pod_label_app` or
`__meta_kubernetes_service_annotation_team`, and such labels are automatically
dropped after the relabeling phase.

The `labelmap` action allows you to preserve these labels in your Kubernetes
targets by mapping them to new names:

```yaml
[label prometheus.yml]
scrape_configs:
  - job_name: 'kubernetes-pods'
    relabel_configs:
      - action: labelmap
        regex: __meta_kubernetes_(.*)
        replacement: k8s_${1}
```

This configuration maps any label starting with `__meta_kubernetes_` to a new
label with the `k8s_` prefix. For instance:

```text
k8s_pod_labeL_app
k8s_service_annotation_team
```

#### 5. hashmod

The `hashmod` action is commonly used for distributing scrape targets, metrics,
or other data evenly across a fixed number of groups.

It works by calculating the hash of a label (or a combination of labels),
dividing that hash by a specified number (`modulus`), and using the remainder to
assign the data to a specific group.

For example, imagine you have 1000 microservices, each with a unique
`service_id` label, and you want to distribute them evenly across five
Prometheus servers. You can use the following configuration:

```yaml
[label prometheus.yml]
scrape_configs:
  - job_name: 'my_services'
    relabel_configs:
      - source_labels: [service_id]
        modulus: 5
        target_label: __tmp_hashmod
        action: hashmod
      - source_labels: [__tmp_hashmod]
[highlight]
        regex: 0  # This Prometheus server will scrape services with remainder 0
[/highlight]
        action: keep
```

This configuration calculates the hash of the `service_id` for each service and
divides it by 5. The remainder (0-4) is stored in the `__tmp_hashmod` label.
Then, the `keep` action ensures this Prometheus server only scrapes targets
where `__tmp_hashmod` is `0`.

By repeating this configuration with `regex: 1`, `regex: 2`, etc. for the other
four Prometheus servers, you'll effectively distribute the 1000 microservices
evenly across your five servers, preventing overload and ensuring efficient
monitoring.

#### 6. keepequal and dropequal

`keepequal` and `dropequal` allow you to filter metrics or scrape targets based
on equality comparisons between labels. Both actions evaluate whether the
concatenated values of the specified `source_labels` are equal to the
`target_label`.

With `keepequal`, the metric or target is dropped if the `source_labels` **do
not match** the `target_label`, while `dropequal` discards the metric/target
where the s`ource_labels` value **exactly matches** the `target_label` value.

Here's an example:

```yaml
[label prometheus.yml]
scrape_configs:
  - job_name: 'my_services'
  relabel_configs:
    - source_labels: [ __meta_kubernetes_pod_container_port_number ]
      target_label: __tmp_port
      action: keepequal
```

If the value of `__meta_kubernetes_pod_container_port_number` and `__tmp_port`
are equal, Prometheus will _keep_ this target. Changing the action to
`dropequal` would do the opposite, keeping targets only if those values are
_different_.

Note that you cannot specify other fields besides `source_labels` and
`target_label` with either action. If you include any other fields, you'll
encounter an error like:

```text
parsing YAML file /etc/prometheus/prometheus.yml: keepequal action requires only 'source_labels' and `target_label`, and no other fields"
```

#### 7. uppercase and lowercase

The `uppercase` and `lowercase` actions provide a simple way to standardize the
casing of label values. This is helpful when dealing with data from various
sources that might have inconsistent casing conventions.

For instance, if the `environment` label has the value "production", you can
change it to "PRODUCTION" with the following rule:

```yaml
[label prometheus.yml]
metric_relabel_configs:
  - source_labels: [environment]
    target_label: environment
    action: uppercase
```

---

Now that we've covered the structure of relabeling configurations and the
various actions available, let's explore how you may use them in each relabeling
block.

## Controlling scrap targets and metadata

The `relabel_configs` block modifies or filters target discovery labels _before_
scraping occurs. It determines which targets Prometheus scrapes and how their
metadata is transformed.

It is typically used for modifying target labels, filtering out unwanted targets
by dropping or keeping specific ones, or enriching target information with data
from service discovery or static configurations.

When initializing the scraping process, Prometheus assigns some default labels
such as:

- `__address__`: Set to the target's `<host>:<port>`.
- `__scheme__`: The protocol used to scrape the target (e.g., http or https).
- `__metrics_path__`: The path to the metrics endpoint on the target.
- `__param_<name>`: URL parameters passed to the target.
- `__scrape_interval__`: How often to scrape the target.
- `__scrape_timeout__`: How long to wait for a scrape to complete.
- `__meta_<name>`: Service discovery metadata.

Any label starting with `__` is removed after the relabeling phase.

If you need a temporary label for intermediate steps in your relabeling process,
use the `__tmp` prefix.

Below are some use cases for the `relabel_configs` option:

### 1. Dropping discovered targets

To prevent specific discovered targets from being scraped by Prometheus, use
`action: keep` or `action: drop` within the `relabel_configs` section of your
Prometheus configuration:

```yaml
[label prometheus.yml]
scrape_configs:
  - job_name: "example_pods"
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_name]
        regex: "example.*"
        action: keep
```

This configuration ensures that only pods with names starting with `example` are
scraped.

### 2. Adding or updating scrape target labels

```yaml
[label prometheus.yml]
scrape_configs:
- job_name: "kubernetes-pods"
  kubernetes_sd_configs:
    - role: pod
  relabel_configs:
    - target_label: "environment"
      replacement: "production"

    - source_labels: [__meta_kubernetes_pod_name]
      target_label: "pod"

    - source_labels: [__meta_kubernetes_namespace]
      target_label: "namespace"
```

This configuration adds an `environment` label, and extracts the pod name and
namespace into separate labels.

## Transforming scraped metrics

The `metric_relabel_configs` block is for modifying, filtering, or transforming
individual metrics and their labels after they are scraped but before they are
stored.

Here are some ways to use it:

### 1. Dropping some metrics during a scrape

To address issues like high cardinality or churn rate caused by specific
metrics, you can selectively drop them during scraping:

```yaml
[label prometheus.yml]
scrape_configs:
  - job_name: nginx
    static_configs:
      - targets:
          - nginx-exporter:9113
[highlight]
    metric_relabel_configs:
      - source_labels: [__name__]
        regex: promhttp_.* # Drop all metrics starting with "promhttp_"
        action: drop
[/highlight]
```

### 2. Renaming scraped metrics

Suppose you want to rename a metric to make it more descriptive or consistent
with other names in your environment. You can do it with the following
configuration:

```yaml
[label prometheus.yml]
scrape_configs:
- job_name: "node-exporter"
  static_configs:
    - targets:
        - "node1:9100"
        - "node2:9100"
  metric_relabel_configs:
    - source_labels: [__name__]
      regex: "node_filesystem_avail_bytes"
      target_label: "__name__"
      replacement: "node_disk_free_bytes"
```

## Tailoring metrics for remote storage

The `write_relabel_configs` block allows you to modify metrics before they are
sent to a remote storage system via remote write. This is distinct from
`metric_relabel_configs`, which modifies metrics before they are stored in
Prometheus itself.

Some use cases for this block include:

- Filtering out unnecessary metrics before sending them to remote storage.
- Enforcing naming conventions to match the requirements of the remote system.
- Routing metrics to different remote storage systems based on labels.

```yaml
[label prometheus.yml]
remote_write:
  - url: "http://remote-storage-system:9090/api/v1/write"
    write_relabel_configs:
      - source_labels: [__name__]
        regex: node_.*
        action: keep
      - source_labels: [environment]
        regex: testing
        action: drop
```

## Customizing alert routing and content

The `alert_relabel_configs` block modifies the labels attached to alerts
_before_ they are sent to the Alertmanager. This allows for the customization of
alert routing and content.

For instance, you can add labels like `team` to route alerts to specific teams
or channels:

```yaml
[label prometheus.yml]
alerting:
  alert_relabel_configs:
    - source_labels: [alertname]
      regex: "HighCPU.*"
      target_label: team
      replacement: "ops-team"
      action: replace
```

## Final thoughts

That concludes our exploration of Prometheus relabeling! I hope you gained
valuable insights into this powerful feature and feel more confident in applying
it to your monitoring setup.

If you're looking for an easy way to manage your Prometheus metrics without self
hosting, [Better Stack](https://betterstack.com/telemetry) is an excellent
option.

It provides a fully managed Prometheus-compatible service, along with a suite of
other observability tools like uptime monitoring, log management, and incident
management.

You can easily
[get started with our generous free tier](https://betterstack.com/users/sign-up)
and scale up as needed.

Thanks for reading!
