# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-fastapi/
# Original language: python
# Normalized: python
# Block index: 24

[label app/routes/tasks.py]
...
@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(*, session: Session = Depends(get_session), task: TaskCreate):
    ...

[highlight]
@router.get("/", response_model=List[TaskRead])
def read_tasks(
    *,
    session: Session = Depends(get_session),
    offset: int = 0,
    limit: int = 100,
    completed: bool = None
):
    """
    Retrieve a list of tasks with optional filtering.
    
    - **offset**: Number of tasks to skip (for pagination).
    - **limit**: Maximum number of tasks to return (for pagination).
    - **completed**: Filter by completion status.
    """
    query = select(Task)
    
    # Apply completion status filter if provided
    if completed is not None:
        query = query.where(Task.completed == completed)
    
    # Apply pagination
    tasks = session.exec(query.offset(offset).limit(limit)).all()
    return tasks
[/highlight]