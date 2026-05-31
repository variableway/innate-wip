# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-litestar/
# Original language: python
# Normalized: python
# Block index: 4

[label app.py]
from litestar import Litestar, get


@get("/")
async def hello_world() -> dict:
    """Root endpoint for the API."""
    return {"message": "Welcome to the Blog API"}


app = Litestar([hello_world])