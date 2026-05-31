# Source: https://betterstack.com/community/guides/logging/python-logging-best-practices/
# Original language: python
# Normalized: python
# Block index: 18

LOGGING = {
    "formatters": {
        "json": {
            "format": "%(asctime)s %(levelname)s %(message)s",
            [highlight]
            "datefmt": "%Y-%m-%dT%H:%M:%SZ",
            [/highlight]
            "class": "pythonjsonlogger.jsonlogger.JsonFormatter",
        }
    },
}

logging.config.dictConfig(LOGGING)