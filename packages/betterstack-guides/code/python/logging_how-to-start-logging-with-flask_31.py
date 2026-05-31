# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-flask/
# Original language: python
# Normalized: python
# Block index: 31

[label app.py]
. . .
@app.route("/search", methods=["POST"])
def search():

    # Get the search query
    query = request.form["q"]
    [highlight]
    app.logger.info(
        "A user performed a search. | query: %s >>> %s", query, session["ctx"]
    )
    [/highlight]
    headers = {
        'User-Agent': 'Flask World Clock App (your-email@example.com)'
    }
    # Pass the search query to the Nominatim API to get a location
    location = requests.get(
        "https://nominatim.openstreetmap.org/search",
        {"q": query, "format": "json", "limit": "1"},
    ).json()

    # If a location is found, pass the coordinate to the Time API to get the current time
    if location:

        [highlight]
        app.logger.info(
            "A location is found. | location: %s >>> %s", location, session["ctx"]
        )
        [/highlight]

        coordinate = [location[0]["lat"], location[0]["lon"]]

        time = requests.get(
            "https://timeapi.io/api/Time/current/coordinate",
            {"latitude": coordinate[0], "longitude": coordinate[1]},
        )

        return render_template("success.html", location=location[0], time=time.json())

    # If a location is NOT found, return the error page
    else:

        [highlight]
        app.logger.info("A location is NOT found. >>> %s", session["ctx"])
        [/highlight]

        return render_template("fail.html")