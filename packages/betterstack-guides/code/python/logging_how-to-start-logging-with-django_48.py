# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/
# Original language: python
# Normalized: python
# Block index: 48

[label horus/settings.py]
. . .
LOGGING = {
    # ...
    'handlers': {
        # ...
        'logtail': {
            'class': 'logtail.LogtailHandler',
            'formatter': 'base',
            "source_token": env("LOGTAIL_SOURCE_TOKEN"),
            "host": f"https://{env('LOGTAIL_INGESTING_HOST')}",
        },
        # ...
    },
    # ...
}
. . .