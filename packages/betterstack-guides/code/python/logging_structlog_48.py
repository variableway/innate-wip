# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 48

[label app.py]
import structlog
[highlight]
from pathlib import Path
[/highlight]

structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.StackInfoRenderer(),
        structlog.dev.set_exc_info,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ],
    [highlight]
    logger_factory=structlog.WriteLoggerFactory(
        file=Path("app").with_suffix(".log").open("wt")
    ),
    [/highlight]
)

logger = structlog.get_logger()
[highlight]
logger.info("Info message")
logger.error("Error message")
[/highlight]