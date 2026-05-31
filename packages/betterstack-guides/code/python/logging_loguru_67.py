# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 67

[label worldClock/views.py]
from django.shortcuts import render, redirect
import requests
import sys
import time
from loguru import logger
[highlight]
from logtail import LogtailHandler
logtail_handler = LogtailHandler(
    source_token="<your_source_token>", 
    host="https://<your_ingesting_host>"
)
[/highlight]
logger.remove(0)
logger.add(
    sys.stderr,
    format="{time:MMMM D, YYYY > HH:mm:ss!UTC} | {level} | {message} | {extra}",
    level="TRACE",
    backtrace=False,
    diagnose=False,
)
[highlight]
logger.add(
    logtail_handler,
    format="{message}",
    level="INFO",
    backtrace=False,
    diagnose=False,
)
[/highlight]
. . .