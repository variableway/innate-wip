# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/
# Original language: python
# Normalized: python
# Block index: 40

[label horus/settings.py]
LOGGING = {
    # ...
    'loggers': {
        # ...
        'horus.views.weather': {
            'handlers': ['console', 'file'],
            'level': 'INFO'
        }
    }
}