# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-flask/
# Original language: python
# Normalized: python
# Block index: 20

[label app.py]
. . .

dictConfig(
    {
        "version": 1,
        . . .
        "handlers": {
            [highlight]
            "time-rotate": {
                "class": "logging.handlers.TimedRotatingFileHandler",
                "filename": "flask.log",
                "when": "D",
                "interval": 10,
                "backupCount": 5,
                "formatter": "default",
            },
            [/highlight]
        },
        "root": {
            "level": "DEBUG",
            [highlight]
            "handlers": ["time-rotate"],
            [/highlight]
        },
    }
)
. . .