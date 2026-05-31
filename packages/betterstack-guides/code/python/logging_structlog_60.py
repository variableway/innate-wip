# Source: https://betterstack.com/community/guides/logging/structlog/
# Original language: python
# Normalized: python
# Block index: 60

[label djangoWorldClock/settings.py]
MIDDLEWARE = [
    # . . .
    'django_structlog.middlewares.RequestMiddleware',
]