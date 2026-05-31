# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-flask/
# Original language: python
# Normalized: python
# Block index: 28

[label app.py]
from flask import Flask, request, render_template
import requests

app = Flask(__name__)


@app.route("/")
def home():

    return render_template("home.html")


@app.route("/search", methods=["POST"])
def search():

    # Get the search query
    query = request.form["q"]

    # Add proper headers for Nominatim API
    headers = {
        'User-Agent': 'Flask World Clock App (your-email@example.com)'
    }

    # Pass the search query to the Nominatim API to get a location
    location = requests.get(
        "https://nominatim.openstreetmap.org/search",
        params={"q": query, "format": "json", "limit": "1"},
        headers=headers
    ).json()

    # If a location is found, pass the coordinate to the Time API to get the current time
    if location:
        coordinate = [location[0]["lat"], location[0]["lon"]]

        time = requests.get(
            "https://timeapi.io/api/Time/current/coordinate",
            {"latitude": coordinate[0], "longitude": coordinate[1]},
        )

        return render_template("success.html", location=location[0], time=time.json())

    # If a location is NOT found, return the error page
    else:

        return render_template("fail.html")