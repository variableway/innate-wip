# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-flask/
# Original language: python
# Normalized: python
# Block index: 15

[label app.py]
. . .

dictConfig(
    {
        "version": 1,
        "formatters": {
            "default": {
                "format": "[%(asctime)s] %(levelname)s | %(module)s >>> %(message)s",
                [highlight]
                "datefmt": "%B %d, %Y %H:%M:%S %Z",
                [/highlight]
            }
        },
        . . .
    }
)

. . .