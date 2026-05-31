# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 11

. . .
structlog.configure(
    wrapper_class=structlog.make_filtering_bound_logger(30)
    )
. . .