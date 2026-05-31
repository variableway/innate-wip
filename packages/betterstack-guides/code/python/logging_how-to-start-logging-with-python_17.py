# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: python
# Normalized: python
# Block index: 17

[label example.py]
import sys
import logging

logger = logging.getLogger("example")

stdout = logging.StreamHandler(stream=sys.stdout)

[highlight]
fmt = logging.Formatter(
    "%(name)s: %(asctime)s | %(levelname)s | %(filename)s:%(lineno)s | %(process)d >>> %(message)s"
)

stdout.setFormatter(fmt)
[/highlight]
logger.addHandler(stdout)

logger.setLevel(logging.INFO)

logger.info("An info")
logger.warning("A warning")