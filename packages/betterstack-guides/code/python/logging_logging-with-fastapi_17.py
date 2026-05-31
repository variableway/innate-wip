# Source: https://betterstack.com/community/guides/logging/logging-with-fastapi/
# Original language: python
# Normalized: python
# Block index: 17

[label main.py]
from fastapi import FastAPI
import logging
from logging.config import dictConfig
import sys
[highlight]
import json
from datetime import datetime

# Custom JSON formatter
class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "module": record.module,
            "line": record.lineno,
            "message": record.getMessage()
        }
        
        # Add exception info if available
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_record)
[/highlight]

# Define the logging configuration
log_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        [highlight]
        "json": {
            "()": JsonFormatter
        }
        [/highlight]
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "DEBUG",
            [highlight]
            "formatter": "json",
            [/highlight]
            "stream": "ext://sys.stdout",
        },
    },
    "loggers": {
        "app": {"handlers": ["console"], "level": "DEBUG", "propagate": False},
    },
    "root": {"handlers": ["console"], "level": "DEBUG"},
}

# Apply the configuration
dictConfig(log_config)

...