# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 12

from loguru import logger
import sys

logger.remove(0) # remove the default handler configuration
logger.add(sys.stdout, level="INFO", serialize=True)

. . .