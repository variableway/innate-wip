# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-flask/
# Original language: python
# Normalized: python
# Block index: 42

. . .
extra = logging.getLogger("extra")


@app.route("/")
def hello():
    [highlight]
    extra.info("A user has visited the home page", extra={"user": "Jack"})
    [/highlight]
    return "Hello, World!"