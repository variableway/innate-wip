# Source: https://betterstack.com/community/guides/logging/python-logging-best-practices/
# Original language: python
# Normalized: python
# Block index: 15

import sys
from loguru import logger

logger.remove(0)
logger.add(
    sys.stdout,
    format="{time:MMMM D, YYYY > HH:mm:ss!UTC} | {level} | {message}",
    serialize=True,
)
logger.info("Incoming API request: GET /api/users/123")