# Source: https://betterstack.com/community/guides/logging/log-levels-explained/
# Original language: python
# Normalized: python
# Block index: 4

import logging
from pythonjsonlogger import jsonlogger

logHandler = logging.StreamHandler()
jsonHandler = logHandler.setFormatter(
    jsonlogger.JsonFormatter(
        "%(name)s %(asctime)s %(levelname)s %(filename)s %(lineno)s %(message)s",
        rename_fields={"levelname": "level", "asctime": "timestamp"},
    )
)
logger = logging.getLogger(__name__)
logger.addHandler(logHandler)

[highlight]
logger.warning("Disk usage warning", extra={"disk_usage": 85.2, "threshold": 80})
[/highlight]