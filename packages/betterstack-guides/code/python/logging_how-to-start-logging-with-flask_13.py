# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-flask/
# Original language: python
# Normalized: python
# Block index: 13

[label app.py]
. . .

dictConfig(
    {
        "version": 1,
        "formatters": {
            "default": {
        [highlight]
                "format": "[%(asctime)s] %(levelname)s | %(module)s >>> %(message)s",
        [/highlight]
            }
        },
        . . .
    }
)

. . .

@app.route("/")
def hello():
    [highlight]
    app.logger.info("An info message")
    [/highlight]
    return "Hello, World!"