# Source: https://betterstack.com/community/guides/scaling-python/ruff-explained/
# Original language: python
# Normalized: python
# Block index: 42

[label app.py]
[highlight]
def problematic_function(x: float, y: float) -> float:  # Added type annotations
[/highlight]
    result = x + y
    return result