# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 71

from loguru import logger
import logging

handler = logging.FileHandler(filename='my_app.log')

logger.add(handler)