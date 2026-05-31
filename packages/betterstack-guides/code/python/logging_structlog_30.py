# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 30

[label app.py]
. . .
structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        set_process_id,
        [highlight]
        structlog.processors.EventRenamer("msg"),
        [/highlight],
        structlog.processors.JSONRenderer(),
    ]
)
. . .