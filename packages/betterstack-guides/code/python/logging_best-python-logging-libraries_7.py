# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 7

import sys
import logging
[highlight]
from pythonjsonlogger import jsonlogger
[/highlight]

. . .

[highlight]
# The desired Log Record attributes must be included here, and they can be
# renamed if necessary
fmt = jsonlogger.JsonFormatter(
    "%(name)s %(asctime)s %(levelname)s %(filename)s %(lineno)s %(process)d %(message)s",
    rename_fields={"levelname": "severity", "asctime": "timestamp"},
)
[/highlight]

# Set the log format on each handler
stdoutHandler.setFormatter(fmt)
errHandler.setFormatter(fmt)

. . .