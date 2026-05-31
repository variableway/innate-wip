# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-fastapi/
# Original language: python
# Normalized: python
# Block index: 13

[label app/models/task.py]
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel
import uuid


def generate_uuid():
    """Generate a unique UUID for a task."""
    return str(uuid.uuid4())


class TaskBase(SQLModel):
    """Base model for task data."""
    title: str = Field(index=True)
    description: Optional[str] = Field(default=None)
    priority: int = Field(default=1, ge=1, le=5)
    completed: bool = Field(default=False)


class Task(TaskBase, table=True):
    """Database model for tasks."""
    id: str = Field(
        default_factory=generate_uuid,
        primary_key=True,
        index=True
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"onupdate": datetime.utcnow}
    )


class TaskCreate(TaskBase):
    """Model for creating a new task."""
    pass


class TaskRead(TaskBase):
    """Model for reading a task."""
    id: str
    created_at: datetime
    updated_at: datetime


class TaskUpdate(SQLModel):
    """Model for updating a task."""
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[int] = None
    completed: Optional[bool] = None