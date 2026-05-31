# Source: https://betterstack.com/community/guides/monitoring/prometheus-python-metrics/
# Original language: python
# Normalized: python
# Block index: 29

from flask import Flask, request
from prometheus_client import (
    CollectorRegistry,
    generate_latest,
    CONTENT_TYPE_LATEST,
    Counter,
    Gauge,
[highlight]
    Histogram,
[/highlight]
    disable_created_metrics,
)

. . .

[highlight]
# Define a Histogram metric for request duration
latency_histogram = Histogram(
    "http_request_duration_seconds",
    "Duration of HTTP requests",
    ["status", "path", "method"],
    registry=registry,
)
[/highlight]

@app.before_request
def before_request():
    """Track start of request processing"""
    active_requests_gauge.inc()
[highlight]
    request.start_time = time.time()
[/highlight]


@app.after_request
def after_request(response):
    """Increment counter after each request"""
    http_requests_total.labels(
        status=str(response.status_code), path=request.path, method=request.method
    ).inc()
    active_requests_gauge.dec()
[highlight]
    duration = time.time() - request.start_time
    latency_histogram.labels(
        status=str(response.status_code), path=request.path, method=request.method
    ).observe(duration)
[/highlight]
    return response

. . .