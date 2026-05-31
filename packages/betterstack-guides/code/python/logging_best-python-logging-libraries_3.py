# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 3

import sys
import logging

logger = logging.getLogger("example")
logger.setLevel(logging.DEBUG)

# Create handlers for logging to the standard output and a file
stdoutHandler = logging.StreamHandler(stream=sys.stdout)
errHandler = logging.FileHandler("error.log")

# Set the log levels on the handlers
stdoutHandler.setLevel(logging.DEBUG)
errHandler.setLevel(logging.ERROR)

# Create a log format using Log Record attributes
fmt = logging.Formatter(
    "%(name)s: %(asctime)s | %(levelname)s | %(filename)s:%(lineno)s | %(process)d >>> %(message)s"
)

# Set the log format on each handler
stdoutHandler.setFormatter(fmt)
errHandler.setFormatter(fmt)

# Add each handler to the Logger object
logger.addHandler(stdoutHandler)
logger.addHandler(errHandler)

logger.info("Server started listening on port 8080")
logger.warning(
    "Disk space on drive '/var/log' is running low. Consider freeing up space"
)

try:
    raise Exception("Failed to connect to database: 'my_db'")
except Exception as e:
    # exc_info=True ensures that a Traceback is included
    logger.error(e, exc_info=True)