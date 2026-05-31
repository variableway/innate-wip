# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 63

logger.add(
    sys.stderr,
    format="{time:MMMM D, YYYY > HH:mm:ss!UTC} | {level} | {message} | {extra}",
    level="TRACE",
    [highlight]
    backtrace=False,
    diagnose=False
    [/highlight]
)