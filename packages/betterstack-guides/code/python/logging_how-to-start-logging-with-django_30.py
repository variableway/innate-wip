# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/
# Original language: python
# Normalized: python
# Block index: 30

[label horus/settings.py]
. . .
'formatters': {
[highlight]
    'base': {
        'format': '{name} at {asctime} ({levelname}) :: {message}',
        'style': '{'
    }
[/highlight]
},
. . .