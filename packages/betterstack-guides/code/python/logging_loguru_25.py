# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 25

[label app.py]
import sys
from loguru import logger

logger.remove(0)
logger.add(sys.stderr, format="{time:MMMM D, YYYY > HH:mm:ss} | {level} | {message} | {extra}")

childLogger = logger.bind(seller_id="001", product_id="123")
childLogger.info("product page opened")
childLogger.info("product updated")
childLogger.info("product page closed")

logger.info("INFO message")