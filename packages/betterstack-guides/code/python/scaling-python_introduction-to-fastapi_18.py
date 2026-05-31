# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-fastapi/
# Original language: python
# Normalized: python
# Block index: 18

[label app/routes/tasks.py]
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from app.database.config import get_session
from app.models.task import Task, TaskCreate, TaskRead

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])

@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(*, session: Session = Depends(get_session), task: TaskCreate):
    """
    Create a new task.
    
    - **title**: Required. The title of the task.
    - **description**: Optional. Detailed description of the task.
    - **priority**: Optional. Priority level (1-5), defaults to 1.
    - **completed**: Optional. Task completion status, defaults to False.
    """
    # Convert TaskCreate model to Task model
    db_task = Task.from_orm(task)
    
    # Add to database
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    
    return db_task