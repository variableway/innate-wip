# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: python
# Normalized: python
# Block index: 44

. . .

logger.info("An info")
logger.warning("A warning")
[highlight]
logger.error("An error", extra={"user_id": "james103", "session_id": "eheo3e"})
[/highlight]