# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: python
# Normalized: python
# Block index: 25

import sys
import logging


[highlight]
class LevelFilter(logging.Filter):
    def __init__(self, level):
        self.level = level

    def filter(self, record):
        if record.levelno == self.level:
            return True
[/highlight]


logger = logging.getLogger(__name__)

stdout = logging.StreamHandler(stream=sys.stdout)

fmt = logging.Formatter(
    "%(name)s: %(asctime)s | %(levelname)s | %(filename)s%(lineno)s | %(process)d >>> %(message)s"
)

[highlight]
level_filter = LevelFilter(logging.WARNING)
logger.addFilter(level_filter)
[/highlight]

stdout.setFormatter(fmt)
logger.addHandler(stdout)

logger.setLevel(logging.INFO)

logger.info("An info")
logger.warning("A warning")
logger.error("An error")