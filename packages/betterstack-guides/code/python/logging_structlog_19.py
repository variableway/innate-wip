# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 19

[label app.py]
. . .
structlog.configure(
    processors=[
        structlog.dev.ConsoleRenderer(),
        structlog.processors.add_log_level,
    ]
)