# Source: https://betterstack.com/community/guides/monitoring/prometheus-python-metrics/
# Original language: python
# Normalized: python
# Block index: 27

[label main.py]
. . .
[highlight]
import threading
import resource
[/highlight]

. . .

[highlight]
# Define a Gauge metric for tracking memory usage
memory_usage_gauge = Gauge(
    "memory_usage_bytes",
    "Current memory usage of the service in bytes",
    ["hostname"],
    registry=registry,
)

def collect_memory_metrics():
    """Background thread to collect memory metrics"""
    while True:
        memory = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        # Multiply by 1024 since maxrss is in KB on Unix
        memory_usage_gauge.labels(hostname="host1.domain.com").set(memory * 1024)
        time.sleep(1)


metrics_thread = threading.Thread(target=collect_memory_metrics, daemon=True)
metrics_thread.start()
[/highlight]

. . .