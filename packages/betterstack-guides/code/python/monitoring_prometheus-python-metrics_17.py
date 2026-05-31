# Source: https://betterstack.com/community/guides/monitoring/prometheus-python-metrics/
# Original language: python
# Normalized: python
# Block index: 17

[label main.py]
from flask import Flask
from prometheus_client import (
    CollectorRegistry,
    generate_latest,
    CONTENT_TYPE_LATEST,
[highlight]
    platform_collector,
    process_collector,
    gc_collector,
[/highlight]
)
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

registry = CollectorRegistry()

[highlight]
# Add default collectors to your registry
gc_collector.GCCollector(registry=registry)
platform_collector.PlatformCollector(registry=registry)
process_collector.ProcessCollector(registry=registry)
[/highlight]

. . .