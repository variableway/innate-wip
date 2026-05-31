# Source: https://betterstack.com/community/guides/logging/logging-with-fastapi/
# Original language: python
# Normalized: python
# Block index: 6

[label main.py]
from fastapi import FastAPI
[highlight]
import logging

# Configure basic logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# Create a logger instance
logger = logging.getLogger(__name__)
[/highlight]

app = FastAPI(title="Logging Demo API")

@app.get("/")
async def read_root():
[highlight]
    logger.info("Root endpoint accessed")
[/highlight]
    return {"message": "Welcome to the FastAPI Logging Demo"}

@app.get("/users/{user_id}")
async def read_user(user_id: int):
[highlight]
    logger.info(f"User data requested for user_id: {user_id}")
[/highlight]
    return {"user_id": user_id, "name": "Sample User"}

@app.get("/items/")
async def list_items(skip: int = 0, limit: int = 10):
    [highlight]
    logger.info(f"Item list requested with skip={skip}, limit={limit}")
    [/highlight]
    return {"skip": skip, "limit": limit, "items": []}