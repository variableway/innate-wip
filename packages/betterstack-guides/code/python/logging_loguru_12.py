# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 12

[label app.py]
from loguru import logger
import sys

def level_filter(level):
    def is_level(record):
        return record["level"].name == level
    return is_level

logger.remove(0)
logger.add(sys.stderr, filter=level_filter(level="WARNING"))

logger.warning("A warning message.")