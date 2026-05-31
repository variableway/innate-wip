# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: python
# Normalized: python
# Block index: 46

import sys
import logging
from pythonjsonlogger import jsonlogger

logger = logging.getLogger(__name__)

stdoutHandler = logging.StreamHandler(stream=sys.stdout)

jsonFmt = jsonlogger.JsonFormatter(
    "%(name)s %(asctime)s %(levelname)s %(filename)s %(lineno)s %(process)d %(message)s",
    rename_fields={"levelname": "severity", "asctime": "timestamp"},
    )
    datefmt="%Y-%m-%dT%H:%M:%SZ",

stdoutHandler.setFormatter(jsonFmt)
logger.addHandler(stdoutHandler)

logger.setLevel(logging.INFO)

[highlight]
try:
    1 / 0
except ZeroDivisionError as e:
    logger.error(e, exc_info=True)
    logger.exception(e)
    logger.critical(e, exc_info=True)
[/highlight]