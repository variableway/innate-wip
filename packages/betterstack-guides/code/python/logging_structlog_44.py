# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 44

[label app.py]
import structlog

structlog.configure(

    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ],
)
logger = structlog.get_logger()

try:
    1 / 0
except ZeroDivisionError:
    logger.exception("Cannot divide one by zero!")