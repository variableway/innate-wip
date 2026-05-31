# Source: https://betterstack.com/community/guides/monitoring/prometheus-python-metrics/
# Original language: python
# Normalized: python
# Block index: 32

latency_histogram = Histogram(
    'http_request_duration_seconds',
    'Duration of HTTP requests',
    ['status', 'path', 'method'],
    [highlight]
    buckets=[0.1, 0.5, 1, 2.5, 5, 10],  # Custom buckets in seconds
    [/highlight]
    registry=registry
)