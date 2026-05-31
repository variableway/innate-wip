# Source: https://betterstack.com/community/guides/monitoring/prometheus-python-metrics/
# Original language: python
# Normalized: python
# Block index: 16

[label main.py]
from flask import Flask
[highlight]
from prometheus_client import CollectorRegistry, generate_latest, CONTENT_TYPE_LATEST
[/highlight]
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

[highlight]
# Create a custom registry
registry = CollectorRegistry()
[/highlight]

@app.route('/metrics')
def metrics():
[highlight]
    """ Exposes only explicitly registered metrics. """
    return generate_latest(registry), 200, {'Content-Type': CONTENT_TYPE_LATEST}
[/highlight]

. . .