# How to Increase Prometheus Storage Retention

If you're using Prometheus for monitoring, you've probably encountered its storage limitations. By default, Prometheus only keeps your metrics for 15 days. This works fine when you're just starting out, but quickly becomes a problem when looking at long-term trends or meeting compliance requirements.

This guide will show you exactly how to increase your Prometheus retention period, so you can keep your valuable monitoring data for weeks, months, or even years.


## Understanding Prometheus storage retention

![Prometheus Storage Retention Overview](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e3531c4a-4c6a-45eb-c58c-9067d050d500/orig =2070x1150)

Prometheus stores all your metrics in a time-series database on disk. The retention setting simply controls how long Prometheus keeps this data before automatically deleting it to free up space.

Prometheus controls data retention with two main settings:

```
--storage.tsdb.retention.time    # How long to keep your data
--storage.tsdb.retention.size    # Maximum size allowed for storage
```

The default is 15 days, regardless of size. When you hit either the time or size limit, Prometheus starts removing older data to make room for new metrics. This works for immediate needs but falls short when you need historical data.

## Why you should increase Prometheus retention

Keeping your metrics longer gives you several significant benefits. You can spot gradual performance trends you'd miss with just two weeks of data. You'll make better infrastructure decisions based on actual historical usage. 

You can find weekly, monthly, or seasonal patterns in your systems' behavior. If you have compliance requirements, longer retention helps you meet them. And when troubleshooting complex issues, having months of historical context enables you to find the root cause faster.

For example, a memory leak that increases usage by just 1% per day might seem harmless in a two-week window, but over 60 days, you'd see it's headed for a serious problem.

## Checking your current retention settings

Before making changes, check your current setup. The fastest way is to query the Prometheus API:

```command
curl -s http://localhost:9090/api/v1/status/runtimeinfo | grep retention
```

```text
[output]
"storageRetention": "15d"
```

You can also check your Prometheus config file or command-line arguments:

```command
ps aux | grep prometheus | grep retention
```

Note that these commands might return empty results if you haven't explicitly set retention options. This doesn't mean there's an error – it just indicates Prometheus is using its default 15-day retention period.

Or visit the Prometheus web interface and go to **Status > Configuration** to see all current settings:

![Screenshot of the Prometheus web interface](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5f395ebf-1c89-41b8-720c-19823e696400/lg1x =3248x1994)

Even in the web interface, you might not see storage settings listed if you haven't configured them explicitly. In this case, Prometheus is using the default values.

## Configuring Prometheus for longer metric retention

Prometheus doesn’t provide a central configuration file for retention settings—instead, these flags need to be passed directly to the Prometheus process. How you do that depends on how Prometheus is deployed.

Below, we’ll walk through how to increase retention time in three common deployment environments: systemd-based setups, Docker Compose, and Kubernetes.

Each method involves passing the `--storage.tsdb.retention.time` flag to your Prometheus process with your desired retention value (e.g. `90d` for 90 days).


### Method 1: Modifying the Prometheus service file

If you installed Prometheus directly on a server and manage it with **systemd**, you’ll need to update the systemd service definition to include the new retention time.

Open the Prometheus service file:

```command
sudo nano /etc/systemd/system/prometheus.service
```

Find the `ExecStart` line and add or update the retention flag:

```text
[label /etc/systemd/system/prometheus.service]
[Service]
ExecStart=/usr/local/bin/prometheus \
    --config.file=/etc/prometheus/prometheus.yml \
[highlight]
    --storage.tsdb.path=/var/lib/prometheus \
    --storage.tsdb.retention.time=90d
[/highlight]
```

Save the file and reload systemd:

```command
sudo systemctl daemon-reload
```

Restart Prometheus:

```command
sudo systemctl restart prometheus
```

Verify your changes took effect:

```command
curl -s http://localhost:9090/api/v1/status/runtimeinfo | grep retention
```

```text
[output]
"storageRetention": "90d"
```

### Method 2: Updating Docker Compose configuration

If you’re running Prometheus using **Docker Compose**, you must update the `command` section in your `docker-compose.yml` file to pass the retention time flag.


Open your `docker-compose.yml` file:

```command
nano docker-compose.yml
```

Update the Prometheus service section:

```yaml
[label docker-compose.yml]
services:
  prometheus:
    image: prom/prometheus:v2.48.0
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
[highlight]
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=90d'
[/highlight]
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    restart: unless-stopped

volumes:
  prometheus_data:
```

Apply the changes:

```command
docker-compose down
```
```command
docker-compose up -d
```

Check that it worked:

```command
docker-compose exec prometheus prometheus --help | grep retention
```

### Method 3: Kubernetes ConfigMap/deployment
If you're running Prometheus in **Kubernetes**, the retention time must be passed as an argument to the Prometheus container—usually within a StatefulSet or Deployment managed by your monitoring stack (like kube-prometheus-stack).

Edit your Prometheus StatefulSet:

```command
kubectl edit statefulset prometheus -n monitoring
```

Add the retention flag to the container args:

```yaml
spec:
  containers:
  - name: prometheus
    args:
      - '--config.file=/etc/prometheus/prometheus.yml'
[highlight]
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=90d'
[/highlight]
```

Save changes and Kubernetes will automatically update your pods.

Verify the new settings:

```command
kubectl exec -it prometheus-0 -n monitoring -- \
  curl -s http://localhost:9090/api/v1/status/runtimeinfo | grep retention
```

## Storage considerations for extended retention

When you increase retention, you need more disk space. Here's how to figure out how much you'll need.

### Estimating storage requirements

You can estimate your storage needs with this simple formula:

```
Daily Storage = Ingestion Rate × 24 hours × Bytes per Sample
```

For example, if you collect 10,000 samples per second at around 2 bytes per sample (compressed):

```
10,000 samples/sec × 86,400 seconds × 2 bytes = ~1.7 GB per day
```

For 90 days of retention, you'd need approximately:

```
1.7 GB × 90 days = 153 GB of storage
```

To check your actual ingestion rate:

```command
curl -s "http://localhost:9090/api/v1/query?query=rate(prometheus_tsdb_head_samples_appended_total[1h])" | jq
```

### Optimizing storage efficiency

To maximize storage efficiency with longer retention:

Enable TSDB compression to reduce disk usage by 50-70%:

```text
--storage.tsdb.wal-compression
```

Create recording rules to pre-aggregate metrics that you frequently query. This reduces the number of raw time series you need to store.

Consider increasing the scrape interval for metrics that don't need high-resolution sampling.

Set up an alert for when storage is running low:

```yaml
- alert: PrometheusStorageFilling
  expr: (predict_linear(prometheus_tsdb_storage_blocks_bytes[1h], 24 * 3600) / prometheus_tsdb_storage_blocks_bytes_total) > 0.8
  for: 1h
  labels:
    severity: warning
  annotations:
    summary: "Prometheus storage is filling up"
    description: "Prometheus storage is predicted to fill within 24 hours."
```


## Implementing remote storage for long-term retention

If you need to keep metrics for months or years, consider using remote storage options.

![Prometheus Remote Storage Architecture](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3847453c-415c-48a1-e81f-c15a7ced2500/orig =2156x1336)

While solutions like Thanos, or Corter can handle years of data, Better Stack offers a more straightforward approach to remote storage with excellent performance.


[Better Stack's Telemetry platform](https://betterstack.com/docs/logs/ingesting-data/metrics/prometheus-scrape/) makes setting up remote storage for your Prometheus metrics remarkably easy. You can forward metrics from your existing Prometheus instance using Vector with Prometheus Remote-Write.

First, install Vector on your system:

```command
bash -c "$(curl -L https://setup.vector.dev)"
```
```command
apt-get install vector
```

Configure Vector to receive Prometheus metrics and forward them to Better Stack:

```yaml
sources:
  better_stack_prometheus_source_$SOURCE_TOKEN:
    type: "prometheus_remote_write"
    address: "0.0.0.0:9090"

...
sinks:
  better_stack_http_sink_$SOURCE_TOKEN:
    type: "http"
    inputs:
      - "better_stack_prometheus_transform_$SOURCE_TOKEN"
    uri: "https://$INGESTING_HOST/metrics"
    method: "post"
    encoding:
      codec: "json"
    compression: "gzip"
    auth:
      strategy: "bearer"
      token: "$SOURCE_TOKEN"
```

Update your Prometheus configuration to write to Vector:

```yaml
remote_write:
  - url: 'http://localhost:9090'
```

Restart Vector and reload Prometheus:

```command
systemctl restart vector
```
```command
ps -A | grep prometheus | tr -s ' ' | xargs | cut -f1 -d' ' | xargs kill -HUP
```

This approach lets you keep your recent data in Prometheus for fast local queries while sending everything to Better Stack for long-term storage and analysis. Better Stack handles all the complexities of storage optimization, downsampling, and query efficiency, so you don't have to manage a complex storage infrastructure.

![Screenshot of Better Stack dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5c3c88e3-9244-4f5e-2113-ecfc5d318800/public =1224x1351)


Unlike traditional setups with Thanos that require configuring object storage like S3:

```yaml
type: S3
config:
  bucket: "thanos"
  endpoint: "minio:9000"
  access_key: "access-key"
  secret_key: "secret-key"
  insecure: true
```

Better Stack eliminates this complexity with a fully managed solution that scales with your needs.

## Troubleshooting common retention issues

Here are solutions to common problems you might face when increasing retention.

### Disk usage growing too fast

If your disk usage shoots up after increasing retention:

```command
df -h /var/lib/prometheus
```

```text
[output]
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       100G   85G   15G  85% /
```

**Solution**: Set up monitoring to predict storage growth and automatically expand volumes before they fill up.

### Slow query performance

If queries covering months of data become painfully slow:

```command
time curl -s "http://localhost:9090/api/v1/query?query=rate(node_cpu_seconds_total[30d])"
```

```text
[output]
real    0m3.452s
user    0m0.004s
sys     0m0.004s
```

**Solution**: Create recording rules for common queries and consider using remote storage with downsampling for historical data.

### Failed compaction

If you see storage compaction errors in logs:

```text
level=error ts=2023-06-15T14:22:00Z msg="Compaction failed" err="write: no space left on device"
```

**Solution**: Ensure you have at least 30% free space on your storage volume for TSDB compaction to work properly.

[ad-logs]

## Best practices for Prometheus retention management

Managing retention isn't just about setting a number of days—it's about balancing performance, cost, and usability. These proven practices help keep your Prometheus setup efficient, reliable, and ready for long-term insights:

- Use a tiered retention strategy: short-term in local Prometheus, medium-term in remote storage, long-term with downsampling  
- Monitor disk usage growth and set alerts for low storage  
- Check query performance across different time ranges  
- Identify and reduce high-cardinality metrics  
- Remove metrics that are no longer needed  
- Adjust retention periods based on real usage patterns  
- Document your chosen retention periods and the reasons behind them  
- Keep a changelog of retention and storage configuration updates  
- Write clear instructions for expanding storage or troubleshooting retention issues  



## Final thoughts

Increasing Prometheus retention gives you powerful insights from longer-term data analysis. It helps you spot trends, plan capacity more effectively, and troubleshoot complex issues with better context.

Your retention strategy should match your specific needs, compliance requirements, and available resources. Whether you choose to extend local storage or implement remote storage, the key is finding the right balance between retention length, system performance, and cost.

For very large deployments or extremely long retention requirements, consider specialized solutions like Better Stack that build on Prometheus while addressing the challenges of long-term storage and querying massive time-series datasets.
