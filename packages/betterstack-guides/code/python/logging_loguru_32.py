# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 32

[label app.py]
[label app.py]
import sys
from loguru import logger

logger.remove(0)
logger.add(sys.stderr, format="{time:MMMM D, YYYY > HH:mm:ss} | {level} | {message} | {extra}")
[highlight]
def test(x):
    return 50/x

with logger.catch():
    test(0)
[/highlight]