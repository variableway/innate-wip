# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/
# Original language: python
# Normalized: python
# Block index: 25

[label horus/openweather.py]
   # ...
   if not response.ok or len(response.json()) == 0:
   [highlight]
       logger.error(
           'search_countries failed as response returned not OK or no results in returned search')
   [/highlight]
   # ...