# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 9

logger.info(
    "Server started listening on port 8080",
    extra={"python_version": 3.10, "os": "linux", "host": "fedora 38"},
)