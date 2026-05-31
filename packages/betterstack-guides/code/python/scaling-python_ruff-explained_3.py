# Source: https://betterstack.com/community/guides/scaling-python/ruff-explained/
# Original language: python
# Normalized: python
# Block index: 3

[label app.py]
import sys
import os
import json

def add_numbers( a,b ):
    """Add two numbers together."""
    result=a+b
    return result

def unused_function():
    """This function is never used."""
    pass

x = 10
y = 20
print(add_numbers(x,y))