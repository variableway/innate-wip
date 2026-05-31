# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 21

import structlog
import logging

[highlight]
structlog.configure(wrapper_class=structlog.make_filtering_bound_logger(logging.INFO))
[/highlight]