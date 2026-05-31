# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/
# Original language: python
# Normalized: python
# Block index: 32

[label horus/settings.py]
. . .
'loggers': {
[highlight]
    'horus.views.search': {
        'handlers': ['console'],
        'level': 'INFO'
    }
[/highlight]
}
. . .