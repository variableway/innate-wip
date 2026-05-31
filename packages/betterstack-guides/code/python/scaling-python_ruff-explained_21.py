# Source: https://betterstack.com/community/guides/scaling-python/ruff-explained/
# Original language: python
# Normalized: python
# Block index: 21

[label app.py]
import datetime
import json
import math
from collections import defaultdict
from pathlib import Path

# Existing functions remain unchanged
...

[highlight]
def process_items(items=None):  # Fixed: use None instead of mutable default
    """Process a list of items."""
    if items is None:
        items = []
    return [x for x in items]  # Fixed: simplified comprehension
[/highlight]
# Rest of the code remains unchanged
...