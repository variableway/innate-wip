# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 9

[label app.py]
import structlog
[highlight]
import logging
[/highlight]


[highlight]
structlog.configure(
    wrapper_class=structlog.make_filtering_bound_logger(logging.WARNING)
)
[/highlight]
logger = structlog.get_logger()
. . .