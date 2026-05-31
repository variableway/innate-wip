# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/
# Original language: python
# Normalized: python
# Block index: 21

[label horus/openweather.py]
logger = logging.getLogger('horus.openweather')
logger.setLevel(logging.INFO)
formatter = logging.Formatter(
    '%(name)s at %(asctime)s (%(levelname)s) :: %(message)s')