# Source: https://betterstack.com/community/guides/monitoring/prometheus-python-metrics/
# Original language: python
# Normalized: python
# Block index: 43

posts_latency_summary = Summary(
    "post_request_duration_seconds",
    "Duration of requests to https://jsonplaceholder.typicode.com/posts",
    ["method"],
[highlight]
    invariants=((0.50, 0.05), (0.75, 0.02), (0.90, 0.01), (0.95, 0.005), (0.99, 0.001)),
[/highlight]
    registry=registry,
)