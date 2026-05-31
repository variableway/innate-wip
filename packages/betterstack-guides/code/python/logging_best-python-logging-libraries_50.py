# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 50

import sys
import picologging as logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

stdout_handler = logging.StreamHandler(sys.stdout)
fmt = logging.Formatter(
    "%(name)s: %(asctime)s | %(levelname)s | %(process)d >>> %(message)s"
)

stdout_handler.setFormatter(fmt)
logger.addHandler(stdout_handler)

logger.info(
    "Successfully connected to the database '%s' on host '%s'", "my_db", "ubuntu20.04"
)

logger.warning("Detected suspicious activity from IP address: %s", "111.222.333.444")