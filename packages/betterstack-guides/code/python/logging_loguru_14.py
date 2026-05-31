# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 14

[label app.py]
import sys
from loguru import logger

logger.remove(0)
[highlight]
logger.add(sys.stderr, format="{time} | {level} | {message}")
[/highlight]

logger.debug("Happy logging with Loguru!")