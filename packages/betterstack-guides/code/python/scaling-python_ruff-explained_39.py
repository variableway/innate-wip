# Source: https://betterstack.com/community/guides/scaling-python/ruff-explained/
# Original language: python
# Normalized: python
# Block index: 39

[label app.py]
import math
import json
import datetime  # Unsorted imports

def problematic_function( x,y):  # Spacing issues
    result=x+y  # Missing spaces around operator
    return result