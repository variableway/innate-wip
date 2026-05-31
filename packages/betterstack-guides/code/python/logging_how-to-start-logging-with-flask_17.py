# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-flask/
# Original language: python
# Normalized: python
# Block index: 17

[label app.py]
. . .
dictConfig(
    {
        "version": 1,
        . . .
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
                "formatter": "default",
            },
            [highlight]
            "file": {
                "class": "logging.FileHandler",
                "filename": "flask.log",
                "formatter": "default",
            },
            [/highlight]
        },
        [highlight]
        "root": {"level": "DEBUG", "handlers": ["console", "file"]},
        [/highlight]
    }
)
. . .
@app.route("/")
def hello():

    app.logger.info("An info message")

    return "Hello, World!"