# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-fastapi/
# Original language: python
# Normalized: python
# Block index: 4

[label main.py]
from fastapi import FastAPI

app = FastAPI(
    title="Task Management API",
    description="API for managing tasks with FastAPI, SQLModel, and Pydantic",
    version="0.1.0"
)

@app.get("/")
async def root():
    """Health check endpoint for the API."""
    return {"message": "Welcome to the Task Management API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)