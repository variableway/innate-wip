# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-fastapi/
# Original language: python
# Normalized: python
# Block index: 19

[label main.py]
from fastapi import FastAPI
from app.database.config import create_db_and_tables
[highlight]
from app.routes.tasks import router as tasks_router
[/highlight]

app = FastAPI(
    ...
)

[highlight]
# Include routers
app.include_router(tasks_router)
[/highlight]

@app.get("/")
async def root():
    ...