# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: python
# Normalized: python
# Block index: 59

from logging.handlers import TimedRotatingFileHandler

fileHandler = TimedRotatingFileHandler(
    "logs.txt", backupCount=5, when="midnight"
)