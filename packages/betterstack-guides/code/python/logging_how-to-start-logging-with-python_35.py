# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: python
# Normalized: python
# Block index: 35

# the message field here clashes with the `message` LogRecord attribute
logger.info(
  "Info message",
  extra={"user": "johndoe", "session_id": "abc123", "message": "override info
  message"},
)