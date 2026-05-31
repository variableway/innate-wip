# Source: https://betterstack.com/community/guides/monitoring/prometheus-python-metrics/
# Original language: python
# Normalized: python
# Block index: 24

[label main.py]
. . .
import os
[highlight]
import time
import random
[/highlight]

. . .

@app.route("/")
def hello():
[highlight]
    delay = random.uniform(1, 5)  # Random delay between 1 and 5 seconds
    time.sleep(delay)
[/highlight]
    return "Hello world!"

. . .