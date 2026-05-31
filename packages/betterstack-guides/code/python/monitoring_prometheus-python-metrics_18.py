# Source: https://betterstack.com/community/guides/monitoring/prometheus-python-metrics/
# Original language: python
# Normalized: python
# Block index: 18

[label main.py]
[highlight]
from flask import Flask, request
[/highlight]
from prometheus_client import (
    CollectorRegistry,
    generate_latest,
    CONTENT_TYPE_LATEST,
[highlight]
    Counter,
[/highlight]
)
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# Create a custom registry
registry = CollectorRegistry()

[highlight]
# Create a counter metric
http_requests_total = Counter(
    "http_requests_total",
    "Total number of HTTP requests received",
    ["status", "path", "method"],
    registry=registry,
)


@app.after_request
def after_request(response):
    """Increment counter after each request"""
    http_requests_total.labels(
        status=str(response.status_code), path=request.path, method=request.method
    ).inc()
    return response
[/highlight]

. . .