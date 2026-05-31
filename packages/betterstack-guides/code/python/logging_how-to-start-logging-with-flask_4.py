# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-flask/
# Original language: python
# Normalized: python
# Block index: 4

[label app.py]
. . .
@app.route("/info")
def info():
    [highlight]
    app.logger.info("Hello, World!")
    [/highlight]
    return "Hello, World! (info)"


@app.route("/warning")
def warning():
    [highlight]
    app.logger.warning("A warning message.")
    [/highlight]
    return "A warning message. (warning)"
...