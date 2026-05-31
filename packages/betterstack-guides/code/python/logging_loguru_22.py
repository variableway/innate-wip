# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 22

[label app.py]
import sys
import json
from loguru import logger


def serialize(record):
    subset = {
        "timestamp": record["time"].timestamp(),
        "message": record["message"],
        "level": record["level"].name,
    }
    return json.dumps(subset)


def patching(record):
    record["extra"]["serialized"] = serialize(record)


logger.remove(0)

logger = logger.patch(patching)
logger.add(sys.stderr, format="{extra[serialized]}")
logger.debug("Happy logging with Loguru!")