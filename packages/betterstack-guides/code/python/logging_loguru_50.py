# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 50

[label worldClock/views.py]
from django.shortcuts import render, redirect
import requests
[highlight]
import sys
import time
from loguru import logger

logger.remove(0)
logger.add(sys.stderr, format="{time:MMMM D, YYYY > HH:mm:ss!UTC} | {level} | {message} | {extra}")
[/highlight]

. . .