# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: python
# Normalized: python
# Block index: 9

import logging

logging.basicConfig(
    format="%(levelname)s | %(asctime)s | %(message)s",
    [highlight]
    datefmt="%Y-%m-%dT%H:%M:%SZ",
    [/highlight]
)
logging.warning("Something bad is going to happen")