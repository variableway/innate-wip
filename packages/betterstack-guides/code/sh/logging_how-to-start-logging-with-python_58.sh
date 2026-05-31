# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: command
# Normalized: sh
# Block index: 58

from logging.handlers import RotatingFileHandler

fileHandler = RotatingFileHandler("logs.txt", backupCount=5, maxBytes=5000000)