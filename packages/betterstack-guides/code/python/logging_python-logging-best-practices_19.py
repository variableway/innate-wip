# Source: https://betterstack.com/community/guides/logging/python-logging-best-practices/
# Original language: python
# Normalized: python
# Block index: 19

[label logging_config.py]
import logging
import logging.config
from pythonjsonlogger import jsonlogger
import re


class SensitiveDataFilter(logging.Filter):
    pattern = re.compile(r"\d{4}-\d{4}-\d{4}-\d{4}")

    def filter(self, record):
        # Modify the log record to mask sensitive data
        record.msg = self.mask_sensitive_data(record.msg)
        return True

    def mask_sensitive_data(self, message):
        # Implement your logic to mask or modify sensitive data
        # For example, redact credit card numbers like this
        message = self.pattern.sub("[REDACTED]", message)
        return message


LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {
        "sensitive_data_filter": {
            "()": SensitiveDataFilter,
        }
    },
    "formatters": {
        "json": {
            "format": "%(asctime)s %(levelname)s %(message)s",
            "datefmt": "%Y-%m-%dT%H:%M:%SZ",
            "class": "pythonjsonlogger.jsonlogger.JsonFormatter",
        }
    },
    "handlers": {
        "stdout": {
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stdout",
            "formatter": "json",
            "filters": ["sensitive_data_filter"],
        }
    },
    "loggers": {"": {"handlers": ["stdout"], "level": "INFO"}},
}


logging.config.dictConfig(LOGGING)