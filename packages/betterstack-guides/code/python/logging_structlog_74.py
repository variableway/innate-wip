# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 74

[label djangoWorldClock/settings.py]
...
from django.shortcuts import render, redirect
import requests
import structlog
[highlight]
from logtail import LogtailHandler
[/highlight]

...
[highlight
LOGTAIL_SOURCE_TOKEN = "your_source_token>"
LOGTAIL_HOST = "https://<your_ingestion_endpoint>"
[/highlight]

LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
    "formatters": {
        "json_formatter": {
            "()": structlog.stdlib.ProcessorFormatter,
            "processor": structlog.processors.JSONRenderer(),
        },
        "plain_console": {
            "()": structlog.stdlib.ProcessorFormatter,
            "processor": structlog.dev.ConsoleRenderer(),
        },
[highlight]
        "logtail_formatter": {"format": "%(message)s"},
[/highlight]
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "plain_console",
        },
        "json_file": {
            "class": "logging.handlers.WatchedFileHandler",
            "filename": "logs/json.log",
            "formatter": "json_formatter",
        },
[highlight]
        "logtail": {
            "class": "logtail.LogtailHandler",
            "source_token": LOGTAIL_SOURCE_TOKEN,
            "host": LOGTAIL_HOST,
            "formatter": "logtail_formatter",
        },
[/highlight]
    },
    "loggers": {
        "django_structlog": {
[highlight]
            "handlers": ["console", "json_file", "logtail"],
[/highlight]
            "level": "INFO",
        },

        "root": {
            "handlers": ["console", "json_file"],
            "level": "INFO",
        },
    },
}

structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.filter_by_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
[highlight]
        structlog.stdlib.render_to_log_kwargs,
[/highlight]
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
[highlight]
    wrapper_class=structlog.stdlib.BoundLogger,
[/highlight]
    cache_logger_on_first_use=True,
)
os.makedirs(os.path.join(BASE_DIR, "logs"), exist_ok=True)