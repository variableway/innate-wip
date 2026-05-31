# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-flask/
# Original language: python
# Normalized: python
# Block index: 19

[label app.py]
. . .

dictConfig(
    {
        "version": 1,
        . . .
        "handlers": {
            [highlight]
            "size-rotate": {
                "class": "logging.handlers.RotatingFileHandler",
                "filename": "flask.log",
                "maxBytes": 1000000,
                "backupCount": 5,
                "formatter": "default",
            },
            [/highlight]
        },
        [highlight]
        "root": {"level": "DEBUG", "handlers": ["size-rotate"]},
        [/highlight]
    }
)
. . .