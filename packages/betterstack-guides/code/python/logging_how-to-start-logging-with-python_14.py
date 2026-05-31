# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: python
# Normalized: python
# Block index: 14

import sys
import logging

logger = logging.getLogger("example")

[highlight]
stdout = logging.StreamHandler(stream=sys.stdout)
stdout.setLevel(logging.INFO)

logger.addHandler(stdout)
[/highlight]

logger.info("An info")
logger.warning("A warning")