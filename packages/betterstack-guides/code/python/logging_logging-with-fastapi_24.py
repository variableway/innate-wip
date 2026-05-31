# Source: https://betterstack.com/community/guides/logging/logging-with-fastapi/
# Original language: python
# Normalized: python
# Block index: 24

"handlers": {
    "time_rotating_file": {
        "class": "logging.handlers.TimedRotatingFileHandler",
        "level": "INFO",
        "formatter": "json",
        "filename": "fastapi.log",
        "when": "midnight",
        "interval": 1,
        "backupCount": 7,
    },
},