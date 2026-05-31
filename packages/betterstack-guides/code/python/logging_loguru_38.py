# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 38

[label app.py]
from loguru import logger

[highlight]
logger.add("loguru.log", rotation="5 seconds")
[/highlight]
logger.debug("A debug message.")