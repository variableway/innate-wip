# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 7

[label app.py]
import structlog

logger = structlog.get_logger()

logger.debug("Database connection established")
logger.info("Processing data from the API")
logger.warning("Resource usage is nearing capacity")
logger.error("Failed to save the file. Please check permissions")
logger.critical("System has encountered a critical failure. Shutting down")