# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 14

from loguru import logger
import sys
import json

def serialize(record):
    subset = {
        "timestamp": record["time"].timestamp(),
        "message": record["message"],
        "level": record["level"].name,
        "file": record["file"].name,
        "context": record["extra"],
    }
    return json.dumps(subset)

def patching(record):
    record["extra"]["serialized"] = serialize(record)

logger.remove(0)

logger = logger.patch(patching)
logger.add(sys.stderr, format="{extra[serialized]}")

logger.bind(user_id="USR-1243", doc_id="DOC-2348").debug("Processing document")