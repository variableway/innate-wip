# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 22

structlog.configure(wrapper_class=structlog.make_filtering_bound_logger(20))