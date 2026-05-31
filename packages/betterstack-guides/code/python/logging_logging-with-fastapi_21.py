# Source: https://betterstack.com/community/guides/logging/logging-with-fastapi/
# Original language: python
# Normalized: python
# Block index: 21

[label main.py]
...
@app.get("/")
async def read_root():
    [highlight]
    logger.info("Root endpoint accessed")
    [/highlight]
    return {"message": "Welcome to the FastAPI Logging Demo"}