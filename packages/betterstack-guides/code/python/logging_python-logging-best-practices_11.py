# Source: https://betterstack.com/community/guides/logging/python-logging-best-practices/
# Original language: python
# Normalized: python
# Block index: 11

LOGGING = {
    # the rest of your config
    "loggers": {"": {"handlers": ["stdout"], "level": "ERROR"}},
}

logging.config.dictConfig(LOGGING)