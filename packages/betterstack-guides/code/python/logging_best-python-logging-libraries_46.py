# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 46

with handler.applicationbound():
    logger.info(...)

with handler.threadbound():
    logger.info(...)

with handler.greenletbound():
    logger.info(...)