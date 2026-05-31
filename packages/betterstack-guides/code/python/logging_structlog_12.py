# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 12

[label app.py]
import structlog
import logging
[highlight]
import os
[/highlight]

[highlight]
level = os.environ.get("LOG_LEVEL", "INFO").upper()
LOG_LEVEL = getattr(logging, level)
structlog.configure(
    wrapper_class=structlog.make_filtering_bound_logger(LOG_LEVEL))
[/highlight]
logger = structlog.get_logger()

logger.debug("Database connection established")
logger.info("Processing data from the API")
logger.warning("Resource usage is nearing capacity")
logger.error("Failed to save the file. Please check permissions")
logger.critical("System has encountered a critical failure. Shutting down")