# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 15

[label app.py]
import structlog

structlog.configure(
    [highlight]
    processors=[
        structlog.dev.ConsoleRenderer(),
    ]
    [/highlight]
)
logger = structlog.get_logger()
logger.info("An info message")