# Source: https://betterstack.com/community/guides/scaling-python/ruff-explained/
# Original language: python
# Normalized: python
# Block index: 19

[label app.py]
import datetime
import json
import math
from collections import defaultdict
from pathlib import Path

# Existing functions remain unchanged
...

[highlight]
def process_items(items=[]):  # Bugbear will flag mutable default argument
    """Process a list of items."""
    return [x for x in items for y in items]  # Bugbear will flag nested comprehension
[/highlight]

x = 10
y = 20
print(add_numbers(x, y))
print(get_current_time())
print(calculate_stats([1, 2, 3, 4, 5]))