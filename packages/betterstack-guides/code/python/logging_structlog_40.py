# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 40

[label app.py]
import structlog

[highlight]
def filter_function(_, __, event_dict):
    if event_dict.get("func_name") == "delete_files":
        raise structlog.DropEvent

    return event_dict
[/highlight]

structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        [highlight]
        structlog.processors.CallsiteParameterAdder(
            [structlog.processors.CallsiteParameter.FUNC_NAME]
        ),
        filter_function,
        [/highlight]
        structlog.processors.JSONRenderer(),
    ]
)
logger = structlog.get_logger()
. . .