# Source: https://betterstack.com/community/guides/scaling-python/ruff-explained/
# Original language: python
# Normalized: python
# Block index: 25

[label app.py]
import datetime
import json
import math
from collections import defaultdict
from pathlib import Path
[highlight]
from typing import Any, Dict, List, Optional
[/highlight]

[highlight]
def add_numbers(a: float, b: float) -> float:
[/highlight]
    """Add two numbers together."""
    result = a + b
    return result

[highlight]
def get_current_time() -> datetime.datetime:
[/highlight]
    ....

[highlight]
def read_config() -> Dict[str, Any]:
[/highlight]
    ...

[highlight]
def calculate_stats(values: List[float]) -> Dict[str, float]:
[/highlight]
    ...
[highlight]
def process_items(items: Optional[List[str]] = None) -> List[str]:
[/highlight]
    ...