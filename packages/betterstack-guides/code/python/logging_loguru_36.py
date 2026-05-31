# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 36

[label app.py]
from loguru import logger

logger.add("loguru.log")
logger.debug("A debug message.")