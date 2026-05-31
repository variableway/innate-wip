# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 46

[label app.py]
. . .
structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        [highlight]
        structlog.processors.dict_tracebacks,
        [/highlight]
        structlog.processors.JSONRenderer(),
    ],
)
. . .