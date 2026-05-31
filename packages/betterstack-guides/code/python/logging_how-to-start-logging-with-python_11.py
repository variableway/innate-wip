# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: python
# Normalized: python
# Block index: 11

import logging

logging.basicConfig(
    format="%(name)s: %(asctime)s | %(levelname)s | %(filename)s:%(lineno)s | %(process)d >>> %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)

logging.warning("system disk is 85% full")
logging.error("unexpected error")