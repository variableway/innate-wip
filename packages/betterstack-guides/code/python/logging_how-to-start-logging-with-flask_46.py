# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-flask/
# Original language: python
# Normalized: python
# Block index: 46

[label app.py]
. . .
dictConfig(
    {
        "version": 1,
        "formatters": {
            ...
        },
        "handlers": {
            "console": {
                ...
            },
            "file": {
                ...
            },
            [highlight]
            "logtail": {
                "class": "logtail.LogtailHandler",
                "source_token": "<your_source_token>",
                "host": "https://<your_ingesting_host>",
                "formatter": "default",
            },
            [/highlight]
        },
[highlight]
        "root": {"level": "DEBUG", "handlers": ["console", "file", "logtail"]},
[/highligt]
        "loggers": {
            "extra": {
                "level": "INFO",
                "handlers": ["file"],
                "propagate": False,
            }
        },
    }
)

# Rest of your Flask app code...