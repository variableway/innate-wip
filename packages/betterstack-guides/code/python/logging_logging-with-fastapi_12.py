# Source: https://betterstack.com/community/guides/logging/logging-with-fastapi/
# Original language: python
# Normalized: python
# Block index: 12

[label main.py]
from fastapi import FastAPI
import logging

# Configure basic logging
logging.basicConfig(
[highlight]
    level=logging.DEBUG,  # Changed from INFO to DEBUG
[/highlight]
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# Create a logger instance
logger = logging.getLogger(__name__)
...