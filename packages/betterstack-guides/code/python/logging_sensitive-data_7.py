# Source: https://betterstack.com/community/guides/logging/sensitive-data/
# Original language: python
# Normalized: python
# Block index: 7

import logging
import json
from pythonjsonlogger import jsonlogger


logger = logging.getLogger(__name__)

logger.setLevel(logging.DEBUG)

formatter = jsonlogger.JsonFormatter()

stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)

logger.addHandler(stream_handler)

[highlight]
# Define sensitive keys to redact
keys_to_redact = ["password"]

redact_filter = RedactFilter(keys_to_redact)
logger.addFilter(redact_filter)
[/highlight]

log_data = {
    'message': 'A user just logged in.',
    'email': 'jack@gmail.com',
    'password': 'pswd123',
}

logger.info(log_data)