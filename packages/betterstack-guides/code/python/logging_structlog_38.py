# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 38

[label app.py]
import structlog


structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ]
)
logger = structlog.get_logger()

def read_files():
    logger.info("File opened successfully", name="file.txt")


def delete_files():
    logger.warning("File deleted", name="app.log")

read_files()
delete_files()