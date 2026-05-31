# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 20

[label app.py]
from loguru import logger
import sys

logger.remove(0)
[highlight]
logger.add(sys.stderr, format="{time:MMMM D, YYYY > HH:mm:ss!UTC} | {level} | {message}", serialize=True)
[/highlight]
logger.debug("Happy logging with Loguru!")