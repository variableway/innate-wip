# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 35

try:
    1/0
except Exception as e:
    logger.exception(e)