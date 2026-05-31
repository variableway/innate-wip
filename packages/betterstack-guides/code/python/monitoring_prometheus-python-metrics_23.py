# Source: https://betterstack.com/community/guides/monitoring/prometheus-python-metrics/
# Original language: python
# Normalized: python
# Block index: 23

[label main.py]
from flask import Flask, request
from prometheus_client import (
    CollectorRegistry,
    generate_latest,
    CONTENT_TYPE_LATEST,
    Counter,
[highlight]
    Gauge,
[/highlight]
    disable_created_metrics,
)
from dotenv import load_dotenv
import os

. . .

[highlight]
# Define a Gauge metric for tracking active HTTP requests
active_requests_gauge = Gauge(
    "http_active_requests",
    "Number of active connections to the service",
    registry=registry
)

@app.before_request
def before_request():
    """Track start of request processing"""
    active_requests_gauge.inc()
[/highlight]

@app.after_request
def after_request(response):
    """Increment counter after each request"""
    http_requests_total.labels(
        status=str(response.status_code), path=request.path, method=request.method
    ).inc()
[highlight]
    active_requests_gauge.dec()
[/highlight]
    return response


. . .