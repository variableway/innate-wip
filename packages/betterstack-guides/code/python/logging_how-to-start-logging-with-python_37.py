# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: python
# Normalized: python
# Block index: 37

# notice that the `user` field is missing here
logger.info("Info message", extra={"session_id": "abc123"})