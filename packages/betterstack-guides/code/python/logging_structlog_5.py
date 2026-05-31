# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 5

[label app.py]
import structlog

logger = structlog.get_logger()
logger.info("Logging with structlog")