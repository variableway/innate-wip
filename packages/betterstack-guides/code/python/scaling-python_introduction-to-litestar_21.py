# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-litestar/
# Original language: python
# Normalized: python
# Block index: 21

[label app.py]
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from litestar import Litestar, get
from litestar.di import Provide

from src.db.config import get_db_session, Base, engine
[highlight]
from src.controllers.post import PostController
[/highlight]


@get("/")
async def hello_world() -> dict:
    """Root endpoint for the API."""
    return {"message": "Welcome to the Blog API"}


...
app = Litestar(
[highlight]
    route_handlers=[hello_world, PostController],
[/highlight]
    dependencies={"db_session": Provide(get_db_session)},
    lifespan=[db_lifespan],
)