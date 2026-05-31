# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/
# Original language: python
# Normalized: python
# Block index: 49

[label horus/settings.py]
LOGGING = {
    # ...
    'loggers': {
        'horus.views.search': {
[highlight]
            'handlers': ['console', 'logtail'],
[/highlight]
            'level': 'INFO'
        },
        'horus.views.weather': {
[highlight]
            'handlers': ['console', 'file', 'logtail'],
[/highlight]
            'level': 'INFO'
        }
    }
}