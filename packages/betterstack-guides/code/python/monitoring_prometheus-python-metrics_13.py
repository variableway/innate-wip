# Source: https://betterstack.com/community/guides/monitoring/prometheus-python-metrics/
# Original language: python
# Normalized: python
# Block index: 13

[label main.py]
from flask import Flask
[highlight]
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
[/highlight]
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

@app.route('/metrics')
def metrics():
[highlight]
    """ Exposes application metrics in a Prometheus-compatible format. """
    return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}
[/highlight]

. . .