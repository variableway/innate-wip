# Source: https://betterstack.com/community/guides/logging/logging-with-fastapi/
# Original language: python
# Normalized: python
# Block index: 26

[label main.py]
from fastapi import FastAPI
import logging
from logging.config import dictConfig
import sys
import json
from datetime import datetime
[highlight]
from logtail import LogtailHandler
[/highlight]

# Custom JSON formatter
class JsonFormatter(logging.Formatter):
    def format(self, record):
        ...

# Define the logging configuration
log_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"json": {"()": JsonFormatter}},
    "handlers": {
        "console": {
            ....
        },
        "rotating_file": {
            ...
        },
        [highlight]
        "logtail": {
            "class": "logtail.LogtailHandler",
            "level": "INFO",
            "source_token": "insert_your_token",  # Replace with your actual token
            "host": "insert_your_injestion_host",
        }
        [/highlight]
    },
    "loggers": {
        "app": {
            [highlight]
            "handlers": ["console", "rotating_file", "logtail"],
            [/highlight]
            "level": "DEBUG", 
            "propagate": False
        },
    },
    "root": {"handlers": ["console"], "level": "DEBUG"},
}
...