# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 23

import structlog
import platform

logger = structlog.get_logger()

[highlight]
logger = logger.bind(python_version=platform.python_version(), os="linux")
[/highlight]

. . .