# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 47

import sys
import logbook

logger = logbook.Logger(__name__)

handler = logbook.StreamHandler(sys.stdout, level="INFO")
[highlight]
handler.format_string = "{record.channel} | {record.level_name} | {record.message}"
[/highlight]
handler.push_application()

logger.info("Successfully connected to the database 'my_db' on host 'ubuntu'")

logger.warning("Detected suspicious activity from IP address: 111.222.333.444")