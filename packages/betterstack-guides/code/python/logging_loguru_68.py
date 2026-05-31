# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 68

# Using Python default logger
logger = logging.getLogger('my_app')

# Using Loguru. This is sufficient, the logger is ready to use.
from loguru import logger