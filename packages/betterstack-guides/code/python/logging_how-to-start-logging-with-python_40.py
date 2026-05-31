# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: python
# Normalized: python
# Block index: 40

import sys
import logging
[highlight]
from pythonjsonlogger import jsonlogger
[/highlight]

logger = logging.getLogger(__name__)

stdout = logging.StreamHandler(stream=sys.stdout)

[highlight]
fmt = jsonlogger.JsonFormatter(
    "%(name)s %(asctime)s %(levelname)s %(filename)s %(lineno)s %(process)d %(message)s"
)
[/highlight]

stdout.setFormatter(fmt)
logger.addHandler(stdout)

logger.setLevel(logging.INFO)

logger.info("An info")
logger.warning("A warning")
logger.error("An error")