# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 42

[label app.py]
import structlog
import asyncio

structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ]
)
logger = structlog.get_logger()


async def check_file_type():
    await logger.awarning("Unsupported File", name="file1.t3x")


asyncio.run(check_file_type())