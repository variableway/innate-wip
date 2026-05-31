# Source: https://betterstack.com/community/guides/logging/json-logging/
# Original language: go
# Normalized: go
# Block index: 2

import structlog

structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.EventRenamer("msg"),
        structlog.processors.JSONRenderer(),
    ]
)

logger = structlog.get_logger()
logger.info("image uploaded", name="image.jpg", size_bytes=2382)