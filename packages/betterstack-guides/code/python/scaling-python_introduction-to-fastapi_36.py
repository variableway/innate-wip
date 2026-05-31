# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-fastapi/
# Original language: python
# Normalized: python
# Block index: 36

[label app/routes/tasks.py]
...
@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    *,
    session: Session = Depends(get_session),
    task_id: str,
    task: TaskCreate
):
    """
    Update a task completely.
    
    - **task_id**: The unique identifier of the task.
    - Request body: All task fields (even unchanged ones).
    """
    db_task = session.get(Task, task_id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found"
        )
    
    # Update all attributes
    task_data = task.dict()
    for key, value in task_data.items():
        setattr(db_task, key, value)
    
    # Update in database
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    
    return db_task