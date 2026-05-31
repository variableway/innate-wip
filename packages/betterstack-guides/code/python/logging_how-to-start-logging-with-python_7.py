# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: python
# Normalized: python
# Block index: 7

[label formatting.py]
import logging

[highlight]
logging.basicConfig(format="%(levelname)s | %(asctime)s | %(message)s")
[/highlight]
logging.warning("Something bad is going to happen")