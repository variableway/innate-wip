# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-flask/
# Original language: python
# Normalized: python
# Block index: 30

[label app.py]
from flask import Flask, request, render_template
[highlight]
from flask import session
[/highlight]
from logging.config import dictConfig
import requests

[highlight]
import uuid
[/highlight]

. . .

app = Flask(__name__)
[highlight]
app.secret_key = "<secret_key>"
[/highlight]


@app.route("/")
def home():

    [highlight]
    session["ctx"] = {"request_id": str(uuid.uuid4())}

    app.logger.info("A user visited the home page >>> %s", session["ctx"])
    [/highlight]

    return render_template("home.html")