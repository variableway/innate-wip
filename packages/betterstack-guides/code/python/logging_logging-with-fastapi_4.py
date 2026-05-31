# Source: https://betterstack.com/community/guides/logging/logging-with-fastapi/
# Original language: python
# Normalized: python
# Block index: 4

[label main.py]
from fastapi import FastAPI

app = FastAPI(title="Logging Demo API")

@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI Logging Demo"}

@app.get("/users/{user_id}")
async def read_user(user_id: int):
    return {"user_id": user_id, "name": "Sample User"}

@app.get("/items/")
async def list_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit, "items": []}