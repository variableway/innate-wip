# Source: https://betterstack.com/community/guides/logging/logging-with-fastapi/
# Original language: python
# Normalized: python
# Block index: 14

[label main.py]
from fastapi import FastAPI
import logging
[highlight]
from logging.config import dictConfig
import sys

# Define the logging configuration
log_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "DEBUG",
            "formatter": "default",
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

# Create a logger instance
logger = logging.getLogger("app")
[/highlight]

app = FastAPI(title="Logging Demo API")

@app.get("/")
async def read_root():
[highlight]
    logger.debug("This is a debug message")
[/highlight]
    return {"message": "Welcome to the FastAPI Logging Demo"}
...