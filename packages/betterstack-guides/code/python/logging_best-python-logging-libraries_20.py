# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 20

import structlog

logger = structlog.get_logger()

logger.debug("Database query executed in 0.025 seconds")
logger.info(
    "Processing file 'data.csv' completed. 1000 records were imported",
    file="data.csv",
    elapsed_ms=300,
    num_records=1000,
)
logger.warning(
    "Unable to load configuration file 'config.ini'. Using default settings instead",
    file="config.ini",
)

try:
    1 / 0
except ZeroDivisionError as e:
    logger.exception(
        "Division by zero error occurred during calculation. Check the input values",
        exc_info=e,
    )
logger.critical("Application crashed due to an unhandled exception")