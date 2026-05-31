# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-flask/
# Original language: python
# Normalized: python
# Block index: 37

[label app.py]
from flask import Flask, request, render_template
from flask import session
from logging.config import dictConfig

[highlight]
import logging
[/highlight]
import requests
import uuid


dictConfig(
    {
        "version": 1,
        "formatters": {
            . . .
        },
        "handlers": {
            . . .
        },
        [highlight]
        "root": {"level": "DEBUG", "handlers": ["console"]},
        [/highlight]

        [highlight]
        "loggers": {
            "extra": {
                "level": "INFO",
                "handlers": ["file"],
                "propagate": False,
            }
        },
        [/highlight]
    }
)

[highlight]
root = logging.getLogger("root")
extra = logging.getLogger("extra")
[/highlight]

app = Flask(__name__)


@app.route("/")
def hello():
[highlight]
    root.debug("A debug message")
    root.info("An info message")
    root.warning("A warning message")
    root.error("An error message")
    root.critical("A critical message")

    extra.debug("A debug message")
    extra.info("An info message")
    extra.warning("A warning message")
    extra.error("An error message")
    extra.critical("A critical message")

    return "Hello, World!"
[/highlight]