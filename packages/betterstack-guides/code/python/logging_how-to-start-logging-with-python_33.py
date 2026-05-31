# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/
# Original language: python
# Normalized: python
# Block index: 33

. . .
fmt = logging.Formatter(
    "%(name)s: %(asctime)s | %(levelname)s | %(filename)s%(lineno)s | %(process)d | %(user)s | %(session_id)s >>> %(message)s"
)
. . .