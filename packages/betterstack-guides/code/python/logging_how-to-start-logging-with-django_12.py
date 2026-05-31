# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/
# Original language: python
# Normalized: python
# Block index: 12

[label horus/views/index.py]
. . .
formatter = logging.Formatter('%(name)s at %(asctime)s (%(levelname)s) :: %(message)s')
. . .