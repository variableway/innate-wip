# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-flask/
# Original language: python
# Normalized: python
# Block index: 41

[label example.py]
. . .
dictConfig(
    {
        "version": 1,
        "formatters": {
            "default": {
                "format": "[%(asctime)s] %(levelname)s | %(module)s >>> %(message)s",
                "datefmt": "%B %d, %Y %H:%M:%S %Z",
            },
            "extra": {
                "format": "[%(asctime)s] %(levelname)s | %(module)s >>> %(message)s >>> User: %(user)s",
                "datefmt": "%B %d, %Y %H:%M:%S %Z",
            },
        },
        "handlers": {
            "console1": {
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
                "formatter": "default",
            },
            "console2": {
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
                "formatter": "extra",
            },
        },
        "root": {"level": "DEBUG", "handlers": ["console1"]},
        "loggers": {
            "extra": {
                "level": "DEBUG",
                "handlers": ["console2"],
                "propagate": False,
            }
        },
    }
)
. . .