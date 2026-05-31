# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/
# Original language: python
# Normalized: python
# Block index: 44

[label horus/views/index.py]
[highlight]
import environ
from logtail import LogtailHandler
[/highlight]

# ...

[highlight]
env = environ.Env()
env.read_env(env.str('ENV_PATH', '.env'))

lh = LogtailHandler(
    source_token=env('LOGTAIL_SOURCE_TOKEN'),
    host=f"https://{env('LOGTAIL_INGESTING_HOST')}"
)
lh.setFormatter(formatter)
logger.addHandler(lh)
[/highlight]