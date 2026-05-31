# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 32

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
logger.info("Comment created", name="John Doe", post_id=2, comment_id="1")
logger.info("Comment created", name="Bob Foster", post_id=2, comment_id="2")
logger.info("Comment created", name="Jane Miles", post_id=2, comment_id="3")