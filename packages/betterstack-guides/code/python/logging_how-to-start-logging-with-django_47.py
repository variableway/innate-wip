# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/
# Original language: python
# Normalized: python
# Block index: 47

[label horus/openweather.py]
. . .

lh = LogtailHandler(
    source_token=env('LOGTAIL_SOURCE_TOKEN'),
    host=f"https://{env('LOGTAIL_INGESTING_HOST')}"
)
lh.setFormatter(formatter)
logger.addHandler(lh)
. . .