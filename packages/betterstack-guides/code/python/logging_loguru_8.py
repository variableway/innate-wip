# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 8

[label app.py]
from loguru import logger
[highlight]
import sys

logger.remove(0)
logger.add(sys.stderr, level="INFO")
[/highlight]

. . .