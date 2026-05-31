# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-flask/
# Original language: python
# Normalized: python
# Block index: 44

[label app.py]
...
@app.route("/")
def home():
    [highlight]
    session["ctx"] = {"request_id": str(uuid.uuid4())}

    app.logger.info("A user visited the home page >>> %s", session["ctx"])

    return render_template("home.html")
    [/highlight]
...