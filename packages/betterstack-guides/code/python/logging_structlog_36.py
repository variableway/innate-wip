# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 36

[label app.py]
import structlog


def drop_messages(_, __, event_dict):
    if event_dict.get("route") == "login":
        raise structlog.DropEvent
    return event_dict


structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        drop_messages,
        structlog.processors.JSONRenderer(),
    ]
)
logger = structlog.get_logger()
logger.info("User created", name="John Doe", route="login")
logger.info("Post Created", title="My first post", route="post")