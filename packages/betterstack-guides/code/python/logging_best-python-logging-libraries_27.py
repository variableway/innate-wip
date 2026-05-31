# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 27

structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        [highlight]
        structlog.processors.dict_tracebacks,
        [/highlight]
        structlog.processors.JSONRenderer(),
    ]
)