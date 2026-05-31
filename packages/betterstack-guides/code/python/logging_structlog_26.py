# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 26

[label app.py]
import structlog
[highlight]
import os
[/highlight]

[highlight]
def set_process_id(_, __, event_dict):
    event_dict["process_id"] = os.getpid()
    return event_dict
[/highlight]


structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        [highlight]
        set_process_id,
        [/highlight]
        structlog.dev.ConsoleRenderer(),
    ]
)
. . .