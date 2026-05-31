# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: python
# Normalized: python
# Block index: 23

import sys
import logging
import colorlog

logger = logging.getLogger("example")

stdout = colorlog.StreamHandler(stream=sys.stdout)

fmt = colorlog.ColoredFormatter(
    "%(name)s: %(white)s%(asctime)s%(reset)s | %(log_color)s%(levelname)s%(reset)s | %(blue)s%(filename)s:%(lineno)s%(reset)s | %(process)d >>> %(log_color)s%(message)s%(reset)s"
)

stdout.setFormatter(fmt)
logger.addHandler(stdout)

logger.setLevel(logging.DEBUG)

logger.debug("A debug message")
logger.info("An info message")
logger.warning("A warning message")
logger.error("An error message")
logger.critical("A critical message")