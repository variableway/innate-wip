# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 23

[label app.py]
. . .
structlog.configure(
    processors=[
        [highlight]
        structlog.processors.TimeStamper(fmt="iso"),
        [/highlight]
        structlog.processors.add_log_level,
        structlog.dev.ConsoleRenderer(),
    ]
)
. . .