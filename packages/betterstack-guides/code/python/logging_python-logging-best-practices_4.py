# Source: https://betterstack.com/community/guides/logging/python-logging-best-practices/
# Original language: python
# Normalized: python
# Block index: 4

[label main.py]
import logging_config
import logging

logger = logging.getLogger(__name__)

logger.info("An info")
logger.warning("A warning")