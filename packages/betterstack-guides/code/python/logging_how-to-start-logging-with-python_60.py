# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: python
# Normalized: python
# Block index: 60

import logging

app_logger = logging.getLogger("app")
module_logger = logging.getLogger("app.module")

print(app_logger.parent)
print(module.parent)