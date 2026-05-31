# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-litestar/
# Original language: python
# Normalized: python
# Block index: 17

[label src/db/config.py]
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

.....
[highlight]
# Import models to ensure they're registered with Base
from src.models.post import Post  # noqa
[/highlight]