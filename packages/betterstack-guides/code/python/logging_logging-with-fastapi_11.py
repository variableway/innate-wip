# Source: https://betterstack.com/community/guides/logging/logging-with-fastapi/
# Original language: python
# Normalized: python
# Block index: 11

[label main.py]
# ... previous imports and setup ...

@app.get("/")
async def read_root():
    [highlight]
    logger.debug("This is a debug message")
    logger.info("This is an info message")
    logger.warning("This is a warning message")
    logger.error("This is an error message")
    logger.critical("This is a critical message")
    [/highlight]
    return {"message": "Welcome to the FastAPI Logging Demo"}