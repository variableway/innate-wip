# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/
# Original language: python
# Normalized: python
# Block index: 22

[label horus/openweather.py]
sh = logging.StreamHandler()

[highlight]
fh = logging.FileHandler(filename='logging-logs.txt')
[/highlight]