# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 67

[label worldClock/views.py]
from django.shortcuts import render, redirect
import requests
[highlight]
import structlog

logger = structlog.get_logger(__name__)
[/highlight]


def home(request):
[highlight]
    logger.debug("homepage visited")
[/highlight]
    return render(request, "home.html")


def search(request):
    # If the request method is not POST, redirect to the home page
    if request.method != "POST":
[highlight]
        logger.info(
            "redirecting %s request to %s to '/'",
            method=request.method,
            path=request.path,
        )
[/highlight]
        return redirect("/")

    # Get the search query
    query = request.POST.get("q", "")
[highlight]
    searchLogger = logger.bind(query=query)
    searchLogger.info("incoming search query for %s", query, query=query)
[/highlight]

    try:
        # Add proper headers for Nominatim API
        headers = {"User-Agent": "Django World Clock App (your-email@example.com)"}

        # Pass the search query to the Nominatim API to get a location
        location_response = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={"q": query, "format": "json", "limit": "1"},
            headers=headers,
        )
[highlight]
        searchLogger.bind(location=location_response).debug("Nominatim API response")
[/highlight]
        # Check if the response is successful before trying to parse JSON
        if location_response.status_code == 200:
            location = location_response.json()
        else:
            return render(request, "500.html")

        # If a location is found, pass the coordinate to the Time API to get the current time
        if location:
            coordinate = [location[0]["lat"], location[0]["lon"]]

            time_response = requests.get(
                "https://timeapi.io/api/Time/current/coordinate",
                params={"latitude": coordinate[0], "longitude": coordinate[1]},
            )
[highlight]
            searchLogger.bind(time=time_response).debug("Time API response")
            searchLogger.bind(coordinate=coordinate).debug(
                "Search query %s succeeded without errors", query
            )
[/highlight]
            if time_response.status_code == 200:
                return render(
                    request,
                    "success.html",
                    {"location": location[0], "time": time_response.json()},
                )
            else:
                return render(request, "500.html")
        # If a location is NOT found, return the error page
        else:
[highlight]
            searchLogger.info("location %s not found", query, query=query)
[/highlight]
            return render(request, "fail.html")

    except Exception as error:
[highlight]
        searchLogger.exception(error)
[/highlight]
        return render(request, "500.html")