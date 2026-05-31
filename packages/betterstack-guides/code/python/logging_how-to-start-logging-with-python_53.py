# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: python
# Normalized: python
# Block index: 53

import sys
import logging
from pythonjsonlogger import jsonlogger


logger = logging.getLogger(__name__)

stdoutHandler = logging.StreamHandler(stream=sys.stdout)
[highlight]
fileHandler = logging.FileHandler("logs.txt")
[/highlight]

jsonFmt = jsonlogger.JsonFormatter(
    "%(name)s %(asctime)s %(levelname)s %(filename)s %(lineno)s %(process)d %(message)s",
    rename_fields={"levelname": "severity", "asctime": "timestamp"},
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)

stdoutHandler.setFormatter(jsonFmt)
[highlight]
fileHandler.setFormatter(jsonFmt)
[/highlight]

logger.addHandler(stdoutHandler)
[highlight]
logger.addHandler(fileHandler)
[/highlight]

logger.setLevel(logging.DEBUG)

logger.debug("A debug message")
logger.error("An error message")