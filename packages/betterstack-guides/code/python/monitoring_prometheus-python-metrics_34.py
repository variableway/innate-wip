# Source: https://betterstack.com/community/guides/monitoring/prometheus-python-metrics/
# Original language: python
# Normalized: python
# Block index: 34

from flask import Flask, request
from prometheus_client import (
    CollectorRegistry,
    generate_latest,
    CONTENT_TYPE_LATEST,
    Counter,
    Gauge,
    Histogram,
[highlight]
    Summary,
[/highlight]
    disable_created_metrics,
)
from dotenv import load_dotenv
import os
import time
import random
[highlight]
import requests
[/highlight]

. . .

[highlight]
posts_latency_summary = Summary(
    "post_request_duration_seconds",
    "Duration of requests to https://jsonplaceholder.typicode.com/posts",
    ["method"],
    registry=registry,
)
[/highlight]


. . .

[highlight]
@app.route("/posts")
def get_posts():
    start_time = time.time()

    try:
        response = requests.get("https://jsonplaceholder.typicode.com/posts")
        response.raise_for_status()
    except requests.RequestException as e:
        return str(e), 500
    finally:
        # Record the request duration in the summary
        duration = time.time() - start_time
        posts_latency_summary.labels(method="GET").observe(duration)

    return response.json()
[/highlight]
. . .