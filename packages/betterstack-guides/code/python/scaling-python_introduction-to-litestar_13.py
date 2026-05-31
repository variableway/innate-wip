# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-litestar/
# Original language: python
# Normalized: python
# Block index: 13

[label app.py]
[highlight]
from contextlib import asynccontextmanager
from typing import AsyncGenerator
[/highlight]

from litestar import Litestar, get
[highlight]
from litestar.di import Provide
from src.db.config import get_db_session, Base, engine
[/highlight]


@get("/")
async def hello_world() -> dict:
    """Root endpoint for the API."""
    return {"message": "Welcome to the Blog API"}

[highlight]
@asynccontextmanager
async def db_lifespan(app: Litestar) -> AsyncGenerator[None, None]:
    """Set up and tear down database connection."""
    # Create tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield
    
    # Dispose of engine on shutdown
    await engine.dispose()


app = Litestar(
    route_handlers=[hello_world],
    dependencies={"db_session": Provide(get_db_session)},
    lifespan=[db_lifespan],
)
[/highlight]