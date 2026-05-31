# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 17

[label app.py]
import structlog

structlog.configure(
    processors=[
        [highlight]
        structlog.processors.add_log_level,
        [/highlight]
        structlog.dev.ConsoleRenderer(),
    ]
)
logger = structlog.get_logger()
logger.info("An info message")