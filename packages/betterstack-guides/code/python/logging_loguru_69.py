# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 69

# Using Python default logger
logger.setLevel(logging.INFO)

formatter = logging.Formatter(. . .)
handler = logging.Handler(. . .)

handler.setFormatter(formatter)

filter = logging.Filter(. . .)

. . .

logger.addHandler(handler)
logger.addFilter(filter)