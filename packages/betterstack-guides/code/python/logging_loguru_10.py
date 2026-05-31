# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 10

[label app.py]
from loguru import logger

[highlight]
logger.level("FATAL", no=60, color="<red>", icon="!!!")
logger.log("FATAL", "A user updated some information.")
[/highlight]