# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/
# Original language: python
# Normalized: python
# Block index: 39

[label settings.py]
LOGGING = {
    # ...
    'handlers': {
        # ...
        'file': {
            'class': 'logging.FileHandler',
            'formatter': 'base',
[highlight]
            'level': 'WARNING',
            'filename': 'django-logs.txt'
[/highlight]
        }
    },
    # ...
}