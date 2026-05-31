# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 34

[label app.py]
. . .
logger = structlog.get_logger()
[highlight]
post_logger = logger.bind(post_id=2)

post_logger.info("Comment created", name="John Doe", comment_id="1")
post_logger.info("Comment created", name="Bob Foster", comment_id="2")
post_logger.info("Comment created", name="Jane Miles", comment_id="3")
[/highlight]