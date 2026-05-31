# Building Web APIs with FastAPI: A Beginner's Guide

FastAPI is a modern, high-performance web framework for building APIs with Python. It provides automatic data validation, serialization, and interactive documentation, making it an excellent choice for developing reliable and maintainable web services.

In this tutorial, you'll build a task management API using FastAPI and SQLite as the database backend. We'll leverage SQLModel for database interactions and Pydantic for data validation, implementing CRUD operations: creating, reading, updating, and deleting tasks.

## Prerequisites

Before getting started, ensure you have:

- Python installed on your system (preferably Python 3.13 or higher)
- A basic understanding of Python and web development concepts

## Step 1 — Setting up the FastAPI project

In this section, you'll create the directory structure and install the necessary dependencies for the FastAPI project.

First, create a new directory for your project and navigate into it:

```command
mkdir fastapi-task-api && cd fastapi-task-api
```

Next, create a virtual environment and activate it:

```command
python3 -m venv venv
```
```command
source venv/bin/activate 
```

Install FastAPI and other dependencies:

```command
pip install fastapi uvicorn sqlmodel python-dotenv
```

Here's a breakdown of these packages:

- `FastAPI` – The web framework for building APIs.
- `Uvicorn` – An ASGI server required to run FastAPI applications.
- `SQLModel` – A library that combines SQLAlchemy and Pydantic for database interactions.
- `python-dotenv` – A package for working with environment variables.

Create a new file called `main.py` and set up a basic FastAPI application:

```python
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
```

This script initializes a FastAPI application with metadata for the automatic documentation. It registers a simple route at `/`, which responds with a JSON message.

 When executed directly, the script runs the application using Uvicorn with the reload option enabled for development.

Now, run the application:

```command
python main.py
```

You should see output similar to:

```text
[output]
INFO:     Will watch for changes in these directories: ['/Users/stanley/fast-api/fastapi-task-api']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [21967] using StatReload
INFO:     Started server process [21969]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

This means your FastAPI server is running. Open `http://127.0.0.1:8000/` in a browser to see the welcome message, or use `curl` to test the API:

```command
curl http://127.0.0.1:8000/
```

The output will be:

```json
[output]
{
  "message": "Welcome to the Task Management API"
}
```

FastAPI also provides automatic interactive documentation. Visit `http://127.0.0.1:8000/docs` to explore the Swagger UI documentation for your API:

![Screenshot of the Swagger UI documentation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/367e129c-7996-472f-477f-e6848cc6a100/lg2x =3248x1994)

At this point, your FastAPI application is set up and running. In the next step, you'll configure the database using SQLModel.

## Step 2 — Configuring the database with SQLModel

With the FastAPI application set up, the next step is to integrate a database to store and manage tasks. SQLModel simplifies database interactions by combining SQLAlchemy's ORM capabilities with Pydantic's validation features.

First, let's organize our project structure. Create the following directories:


```command
mkdir -p app app/models app/database
```
This command creates the necessary directories for the project. The `-p` flag ensures parent directories are created as needed and prevents errors if directories already exist.

Following that, create the following files in the newly created directories:

```command
touch app/__init__.py app/models/__init__.py app/database/__init__.py
```
This command creates empty Python files that mark each directory as a package, enabling clean imports between modules and establishing the application's namespace hierarchy. 

These files can later contain initialization code, shared utilities, or package metadata.


Next, create a file for database configuration:

```command
touch app/database/config.py
```

Now, update the `app/database/config.py` file with the following code:

```python
[label app/database/config.py]
import os
from sqlmodel import SQLModel, create_engine, Session

# Get database URL from environment variable or use default SQLite URL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tasks.db")

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL, 
    echo=True,  # Set to False in production
    connect_args={"check_same_thread": False}  # Only needed for SQLite
)

def create_db_and_tables():
    """Create all tables in the database."""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Create a new database session."""
    with Session(engine) as session:
        yield session
```

This code sets up the database connection using SQLModel. It defines two key functions:

- `create_db_and_tables()`: Creates all the tables defined in our models.
- `get_session()`: A dependency function that provides a database session for our endpoints.

The `echo=True` parameter enables SQL query logging for development, and `connect_args={"check_same_thread": False}` allows SQLite to work with FastAPI's asynchronous nature.

Now, let's create a task model using SQLModel. Create a new file:

```command
touch app/models/task.py
```

Update the `app/models/task.py` file with the following code:

```python
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
```

The `TaskBase` class serves as the foundation, containing shared fields like `title`, `description`, `priority`, and `completed` status. The `Task` class extends `TaskBase` and represents the database model, adding a unique `id` field generated using UUID, along with `created_at` and `updated_at` timestamps.

Three additional models are defined to handle different operations. The `TaskCreate` class validates data when creating new tasks, while the `TaskRead` class structures the data when retrieving tasks from the database.

Lastly, the `TaskUpdate` class allows partial updates, where fields can be optionally modified. 

Using inheritance and type hinting enables automatic validation, serialization, and documentation.

Following that, update the `main.py` file to include the database initialization:

```python
[label main.py]
from fastapi import FastAPI
[highlight]
from app.database.config import create_db_and_tables
[/highlight]

app = FastAPI(
    title="Task Management API",
    description="API for managing tasks with FastAPI, SQLModel, and Pydantic",
    version="0.1.0"
)

@app.get("/")
async def root():
    """Health check endpoint for the API."""
    return {"message": "Welcome to the Task Management API"}

[highlight]
@app.on_event("startup")
def on_startup():
    """Initialize database when the application starts."""
    create_db_and_tables()
[/highlight]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

You've added an event handler using `@app.on_event("startup")` that calls `create_db_and_tables()` when the application starts, ensuring that all necessary tables exist.

When you save the file, the application server should restart automatically. If it doesn’t, you can manually restart it by running the following command:


```command
python main.py
```

You'll see additional SQL output in the console showing that the tables are being created:

```text
[output]
INFO:     Started server process [7654]
INFO:     Waiting for application startup.
2025-02-28 14:15:37.123 INFO sqlalchemy.engine.Engine BEGIN (implicit)
2025-02-28 14:15:37.124 INFO sqlalchemy.engine.Engine PRAGMA main.table_info("task")
2025-02-28 14:15:37.125 INFO sqlalchemy.engine.Engine [raw sql] ()
2025-02-28 14:15:37.126 INFO sqlalchemy.engine.Engine CREATE TABLE task (
    id VARCHAR NOT NULL, 
    title VARCHAR NOT NULL, 
    description VARCHAR, 
    priority INTEGER NOT NULL, 
    completed BOOLEAN NOT NULL, 
    created_at TIMESTAMP NOT NULL, 
    updated_at TIMESTAMP NOT NULL, 
    PRIMARY KEY (id)
)
2025-02-28 14:15:37.127 INFO sqlalchemy.engine.Engine [no key 0.00031s] ()
2025-02-28 14:15:37.128 INFO sqlalchemy.engine.Engine CREATE INDEX ix_task_id ON task (id)
...
INFO:     Application startup complete.
```

The database is now integrated with your FastAPI application. You will see a `tasks.db` file in your project directory.  

```text
[output]
...
├── app
│   ├── ...
├── main.py
├── tasks.db
```

Now that you have set up the database, it's time to build the functionality that interacts with it. In the next step, you'll implement the endpoint for creating tasks.

## Step 3 — Implementing the POST endpoint for creating tasks

Now that your models and database configuration are set up, let's implement the first API endpoint for creating new tasks. You'll organize your code by creating a separate module for all task-related routes.

To organize your route handlers, first create the necessary directory and files with the following command:  

```command
mkdir app/routes && touch app/routes/__init__.py app/routes/tasks.py
```
Now, update the `app/routes/tasks.py` file with the following code:

```python
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
```

This code defines a `POST` endpoint for creating tasks. When a request is sent, FastAPI validates the input using the `TaskCreate` model. 

The function then converts the request data into a database-compatible `Task` model and saves it to the database using SQLModel. 

Once committed, the newly created task is returned as a response. This structured approach ensures efficient task management while maintaining data integrity.
Next, update the `main.py` file to include the task routes:

```python
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
```

With the task routes included, save your file and use `curl` to create a new task.


```command
curl -X POST http://127.0.0.1:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn FastAPI","description":"Complete the FastAPI tutorial and build a project","priority":2}' \
  | python3 -m json.tool
```

You should receive a response like this:

```json
[output]
{
    "title": "Learn FastAPI",
    "description": "Complete the FastAPI tutorial and build a project",
    "priority": 2,
    "completed": false,
    "id": "5b499058-a5d6-4c85-8a88-0d1dd4600fac",
    "created_at": "2025-02-28T10:44:55.434117",
    "updated_at": "2025-02-28T10:44:55.434124"
}
```

You can also test the validation by trying to create a task with an invalid priority (outside the 1-5 range):

```command
curl -X POST http://127.0.0.1:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Invalid Task","priority":10}' \
  | python3 -m json.tool
```

You'll receive a validation error:

```json
[output]
{
    "detail": [
        {
            "type": "less_than_equal",
            "loc": [
                "body",
                "priority"
            ],
            "msg": "Input should be less than or equal to 5",
            "input": 10,
            "ctx": {
                "le": 5
            }
        }
    ]
}
```

This shows that Pydantic's validation is working automatically to ensure data consistency.

Now, visit `http://127.0.0.1:8000/docs` in your browser to see the interactive Swagger UI, which includes information about your task creation endpoint.

![Screenshot of Swagger UI with information about your task creating endpoint](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/79bfc54b-c2e9-49a8-ab14-3825a7148300/lg2x =3024x4224)

Now that you can create tasks, it's time to add functionality to retrieve them.

## Step 4 — Implementing GET endpoints for retrieving tasks

Now that you can create tasks, let's implement endpoints to retrieve them. We'll start with an endpoint for listing all tasks with optional filtering.

Update the `app/routes/tasks.py` file to add the first GET endpoint:

```python
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
```
The highlighted code defines a GET endpoint that retrieves a list of tasks with optional filtering and pagination. It is registered under `/api/tasks/` and returns a list of tasks formatted using the `TaskRead` model.  

To enable pagination, the `offset` and `limit` parameters allow clients to skip a specified number of tasks and limit the number of results returned. 

Additionally, the `completed` parameter enables filtering tasks by their completion status. The query is adjusted to return only completed or incomplete tasks if provided.  

The endpoint constructs a database query using `select(Task)`, applies filters if necessary, and retrieves the results using `session.exec()`. 

The final list of tasks is then returned, ensuring efficient task retrieval with flexibility for filtering and pagination.

Now, test the endpoint for retrieving all tasks. First, let's create a few tasks to have some data to work with:

```command
curl -X POST http://127.0.0.1:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn FastAPI","description":"Complete the FastAPI tutorial and build a project","priority":2}' \
  | python3 -m json.tool
```
```command
curl -X POST http://127.0.0.1:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Write Documentation","description":"Document the API endpoints and models","priority":3,"completed":true}' \
  | python3 -m json.tool
```

Next, test retrieving all tasks:

```command
curl http://127.0.0.1:8000/api/tasks/ | python3 -m json.tool
```

You should see a response with all your tasks:

```json
[output]
[
    {
        ...
    },
    {
        "title": "Learn FastAPI",
        "description": "Complete the FastAPI tutorial and build a project",
        "priority": 2,
        "completed": false,
        "id": "1ff677f3-82e4-47a3-a228-58650136622b",
        "created_at": "2025-02-28T10:58:15.735311",
        "updated_at": "2025-02-28T10:58:15.735325"
    },
    {
        "title": "Write Documentation",
        "description": "Document the API endpoints and models",
        "priority": 3,
        "completed": true,
        "id": "d5477b21-1b1a-4745-b2b5-01da0f65a679",
        "created_at": "2025-02-28T10:59:22.476886",
        "updated_at": "2025-02-28T10:59:22.476901"
    }
]
```

You can also test filtering for completed tasks:

```command
curl "http://127.0.0.1:8000/api/tasks/?completed=true" | python3 -m json.tool
```

This should return only the tasks marked as completed:

```json
[output]
[
    {
        "title": "Write Documentation",
        "description": "Document the API endpoints and models",
        "priority": 3,
        "completed": true,
        "id": "d5477b21-1b1a-4745-b2b5-01da0f65a679",
        "created_at": "2025-02-28T10:59:22.476886",
        "updated_at": "2025-02-28T10:59:22.476901"
    }
] 
```

Now that you have confirmed that the list endpoint works, you will implement the endpoint to retrieve a specific task by ID.

Add the following code to `app/routes/tasks.py`:

```python
[label app/routes/tasks.py]
...
@router.get("/{task_id}", response_model=TaskRead)
def read_task(*, session: Session = Depends(get_session), task_id: str):
    """
    Retrieve a specific task by ID.
    
    - **task_id**: The unique identifier of the task.
    """
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found"
        )
    return task
```

Test retrieving a specific task by its ID. Make sure to use an ID from your previous responses:

```command
 curl "http://127.0.0.1:8000/api/tasks/d5477b21-1b1a-4745-b2b5-01da0f65a679" | python3 -m json.tool
```

You should receive the specific task:

```json
[output]
{
    "title": "Write Documentation",
    "description": "Document the API endpoints and models",
    "priority": 3,
    "completed": true,
    "id": "d5477b21-1b1a-4745-b2b5-01da0f65a679",
    "created_at": "2025-02-28T10:59:22.476886",
    "updated_at": "2025-02-28T10:59:22.476901"
}
```

Try requesting a non-existent task to see the 404 error handling:

```command
curl "http://127.0.0.1:8000/api/tasks/non-existent-id" | python3 -m json.tool
```

```json
[output]
{
    "detail": "Task with ID non-existent-id not found"
}
```

The interactive documentation at `http://127.0.0.1:8000/docs` is also automatically updated to include these new endpoints, complete with all the parameters and response models:

![Swagger UI displaying new endpoints](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9746a640-1ff3-4cd1-6a1d-d23df2537100/lg1x =3024x1842)

Now that you have implemented task retrieval, the next step is to provide users with the ability to update existing tasks efficiently.


## Step 5 — Implementing the PUT endpoint for updating tasks

Now that you can create and retrieve tasks, the next step is to allow updates. You'll implement a PUT endpoint for performing full updates, meaning that all task fields must be provided in the request body. This ensures that the entire task is replaced with the new data, maintaining consistency across updates.

Update the `app/routes/tasks.py` file to add the PUT endpoint:

```python
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
```

Test the PUT endpoint for full updates. This requires providing all task fields, even if they remain unchanged(Remember to replace with your actual task ID):

```command
curl -X PUT "http://127.0.0.1:8000/api/tasks/<your_task_id>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn FastAPI in Depth","description":"Complete the advanced FastAPI tutorial","priority":4,"completed":true}' \
  | python3 -m json.tool
```

You should see a response with all fields updated:

```json
[output]
{
    "title": "Learn FastAPI in Depth",
    "description": "Complete the advanced FastAPI tutorial",
    "priority": 4,
    "completed": true,
    "id": "d5477b21-1b1a-4745-b2b5-01da0f65a679",
    "created_at": "2025-02-28T10:59:22.476886",
    "updated_at": "2025-02-28T11:14:41.070992"
}
```

Notice that the `updated_at` timestamp has been automatically updated to reflect the modification time.

Now that you've confirmed the PUT endpoint works for full updates, check the interactive documentation at `http://127.0.0.1:8000/docs`:

![Screenshot of the swagger documentation wit the update ](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e08b73a1-1fa1-43ef-ebeb-7b5a8b65cc00/lg2x =3024x1952)

The documentation now includes the update endpoint, providing a clear interface for testing and verifying task updates directly from the browser.

## Step 6 — Implementing the DELETE endpoint for removing tasks

To complete the CRUD functionality of your task API, the final step is to implement a DELETE endpoint. This will allow users to remove tasks from the database.

Update the `app/routes/tasks.py` file to add the delete endpoint:

```python
[label app/routes/tasks.py]
...
@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(*, session: Session = Depends(get_session), task_id: str):
    """
    Delete a task.
    
    - **task_id**: The unique identifier of the task.
    """
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found"
        )
    
    # Delete from database
    session.delete(task)
    session.commit()
    
    # Return no content
    return None
```

This `DELETE` endpoint allows users to remove tasks by providing a valid task ID. When called, it first retrieves the task from the database. If the task doesn't exist, it raises a `404 Not Found` error. Otherwise, it deletes the task and commits the changes. The endpoint returns a `204 No Content` status code, indicating that the operation was successful without requiring a response body.

Now, test this endpoint by deleting one of your tasks(replace with your actual task ID):

```command
curl -X DELETE "http://127.0.0.1:8000/api/tasks/<your_task_id>" -v
```

The `-v` (verbose) flag will show the response headers, including the status code:

```text
[output]
*   Trying 127.0.0.1:8000...
* Connected to 127.0.0.1 (127.0.0.1) port 8000
> DELETE /api/tasks/d5477b21-1b1a-4745-b2b5-01da0f65a679 HTTP/1.1
> Host: 127.0.0.1:8000
> User-Agent: curl/8.7.1
> Accept: */*
> 
* Request completely sent off
< HTTP/1.1 204 No Content
< date: Fri, 28 Feb 2025 11:23:51 GMT
< server: uvicorn
< content-type: application/json
< 
* Connection #0 to host 127.0.0.1 left intact
```

The HTTP status code 204 confirms that the task was successfully deleted. You can verify this by trying to retrieve the deleted task:

```command
curl http://127.0.0.1:8000/api/tasks/<your_task_id>
```

You should receive a 404 Not Found response:

```json
{"detail":"Task with ID d5477b21-1b1a-4745-b2b5-01da0f65a679 not found"}
```

With the `DELETE` endpoint in place, your task management API now fully supports Create, Read, Update, and Delete (CRUD) operations.

[ad-logs]

## Final thoughts

This article has guided you through building a production-ready RESTful API using FastAPI while ensuring type safety and data validation throughout your application. 

To deepen your understanding of FastAPI and enhance your skills, consider exploring the official documentation for [FastAPI](https://fastapi.tiangolo.com/), [SQLModel](https://sqlmodel.tiangolo.com/), and [Pydantic](https://pydantic-docs.helpmanual.io/). These resources provide valuable insights, best practices, and advanced techniques to help you build even more robust and scalable applications.


Thanks for reading and happy coding!