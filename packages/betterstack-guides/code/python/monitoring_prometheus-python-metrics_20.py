# Source: https://betterstack.com/community/guides/monitoring/prometheus-python-metrics/
# Original language: python
# Normalized: python
# Block index: 20

[label main.py]
from flask import Flask, request
from prometheus_client import (
    CollectorRegistry,
    generate_latest,
    CONTENT_TYPE_LATEST,
    Counter,
[highlight]
    disable_created_metrics,
[/highlight]
)
from dotenv import load_dotenv
import os

load_dotenv()

[highlight]
disable_created_metrics()
[/highlight]

app = Flask(__name__)

registry = CollectorRegistry()