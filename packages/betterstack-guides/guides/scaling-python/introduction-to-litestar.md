# Building Web APIs with Litestar: A Beginner's Guide

[Litestar](https://litestar.dev/) is a high-performance, asynchronous API framework for Python designed with type safety, a strong developer experience, and modern features.

It provides a simple approach to building web applications and APIs, offering powerful dependency injection, automatic schema validation, and comprehensive performance optimizations.

In this tutorial, you'll build a blog API using Litestar and SQLAlchemy as the database ORM. We'll cover essential Litestar concepts while implementing CRUD operations like creating, reading, updating, and deleting blog posts.

[ad-logs]

## Prerequisites

Before getting started, ensure you have:

- Python installed on your system (preferably Python 3.13 or higher)
- A basic understanding of Python and async programming concepts

## Step 1 — Setting up the Litestar project

In this section, you'll create the directory structure and install the necessary dependencies for the Litestar API project.

First, create a new directory for your project and navigate into it:

```command
mkdir litestar-blog-api && cd litestar-blog-api
```

Next, create a virtual environment and activate it:

```command
python3 -m venv venv
```
```command
source venv/bin/activate 
```

Install Litestar and other dependencies:

```command
pip install 'litestar[standard]' sqlalchemy aiosqlite greenlet
```

Here's a breakdown of these packages:

- `Litestar[standard]`: The core web framework for building APIs, with the standard extras that include Uvicorn.
- [`SQLAlchemy`](https://www.sqlalchemy.org/): A powerful database toolkit for managing database interactions.
- [`aiosqlite`](https://pypi.org/project/aiosqlite/): It provides asynchronous access to SQLite databases, which is what allows Litestar to work with SQLite in an async fashion.
- [`greenlet`](https://pypi.org/project/greenlet/): Required for SQLAlchemy's async support

Create a new file called `app.py` and set up a basic Litestar application:

```python
[label app.py]
from litestar import Litestar, get


@get("/")
async def hello_world() -> dict:
    """Root endpoint for the API."""
    return {"message": "Welcome to the Blog API"}


app = Litestar([hello_world])
```

This script defines a simple function decorated with `@get("/")`, which responds to GET requests at the root path with a JSON message. 

The `app` object is a Litestar application instance that includes our route handler in the list of route handlers passed as the first argument.

Now, run the application using the Litestar CLI:

```command
litestar run
```

You should see output similar to:

```text
Using Litestar app from app:app
Starting server process ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌──────────────────────────────┬──────────────────────┐
│ Litestar version             │ 2.15.1               │
│ Debug mode                   │ Disabled             │
│ Python Debugger on exception │ Disabled             │
│ CORS                         │ Disabled             │
│ CSRF                         │ Disabled             │
│ OpenAPI                      │ Enabled path=/schema │
│ Compression                  │ Disabled             │
└──────────────────────────────┴──────────────────────┘
INFO:     Started server process [24198]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

This means your Litestar server is running. Open `http://127.0.0.1:8000/` in a browser, or alternatively, use `curl` to test the API:

```command
curl http://127.0.0.1:8000/
```
The output will be:

```json
{
  "message": "Welcome to the Blog API"
}
```

For optimal development experience, run the server in "reload mode," which will automatically restart when you change your code. 

Add the `--reload` flag like this:

```command
litestar run --reload
```
```text
[output]
INFO:     Will watch for changes in these directories: ['/Users/stanley/litestar-project/litestar-blog-api']
...
INFO:     Application startup complete.
```


At this point, your Litestar API is set up and running. In the next step, you'll integrate a database using SQLAlchemy.

## Step 2 — Configuring the database with SQLAlchemy


With the Litestar application set up, the next step is integrating a database to store and manage blog posts. 

Litestar works smoothly with SQLAlchemy to provide robust database interactions. This section will guide you through configuring SQLite as the database backend.

First, create a directory structure for your project components:

```command
mkdir -p src/db src/models src/controllers src/schemas
```

Now, create a database configuration file at `src/db/config.py`:

```python
[label src/db/config.py]
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

# Define the database URL directly
DATABASE_URL = "sqlite+aiosqlite:///blog.db"

# Create async SQLAlchemy engine
engine = create_async_engine(DATABASE_URL, echo=True)

# Create sessionmaker for database sessions
async_session_factory = async_sessionmaker(engine, expire_on_commit=False)


# Base class for SQLAlchemy models
class Base(DeclarativeBase):
    pass


# Dependency function to get database session
async def get_db_session():
    """Dependency for database session."""
    async with async_session_factory() as session:
        yield session
```

The configuration file sets up an async SQLAlchemy engine using the database URL from environment variables, creates a session factory, and defines a `Base` class for your models. The `get_db_session` function will be a dependency that provides database sessions to your route handlers.

Now, create `__init__.py` files to make each directory a proper Python package:

```command
touch src/__init__.py src/db/__init__.py src/models/__init__.py src/controllers/__init__.py src/schemas/__init__.py
```

Next, update your `app.py` file to incorporate the database configuration:

```python
[label app.py]
[highlight]
from contextlib import asynccontextmanager
from typing import AsyncGenerator
[/highlight]

from litestar import Litestar, get
[highlight]
from litestar.di import Provide
from src.db.config import get_db_session, Base, engine
[/highlight]


@get("/")
async def hello_world() -> dict:
    """Root endpoint for the API."""
    return {"message": "Welcome to the Blog API"}

[highlight]
@asynccontextmanager
async def db_lifespan(app: Litestar) -> AsyncGenerator[None, None]:
    """Set up and tear down database connection."""
    # Create tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield
    
    # Dispose of engine on shutdown
    await engine.dispose()


app = Litestar(
    route_handlers=[hello_world],
    dependencies={"db_session": Provide(get_db_session)},
    lifespan=[db_lifespan],
)
[/highlight]
```

The updated code adds a `db_lifespan` context manager that handles database setup and teardown. It creates database tables when the application starts and properly disposes of the database engine when it shuts down. 

It also registers the `get_db_session` function as a dependency, making it available to all route handlers that need database access.


If everything is set up correctly, the Litestar server will auto-restart, and you should see output indicating that the database engine initialized successfully:

```text
[output]
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [26658] using WatchFiles
INFO:     Started server process [26662]
INFO:     Waiting for application startup.
2025-03-12 12:19:30,059 INFO sqlalchemy.engine.Engine BEGIN (implicit)
2025-03-12 12:19:30,059 INFO sqlalchemy.engine.Engine COMMIT
INFO - 2025-03-12 12:19:30,059 - sqlalchemy.engine.Engine - base - BEGIN (implicit)
INFO - 2025-03-12 12:19:30,059 - sqlalchemy.engine.Engine - base - COMMIT
INFO:     Application startup complete.
```

You can confirm the database file's existence by checking your file system:

```command
ls -la
```

```text
[output]
...
-rw-r--r--@ 1 stanley  staff  814 Mar 12 12:15 app.py
-rw-r--r--@ 1 stanley  staff    0 Mar 12 12:19 blog.db
drwxr-xr-x@ 8 stanley  staff  256 Mar 12 12:15 src
...
```
You should see the `blog.db` file in your directory.

The database is now integrated with your Litestar application, but it's currently empty. Next, you'll create a data model for blog posts.


## Step 3 — Defining the post model and schemas

With the database configured, it's time to define a data model for blog posts. In this step, you'll create a SQLAlchemy model that represents the structure of blog posts in the database, complete with proper data types and constraints.

Create a new file at `src/models/post.py`:

```python
[label src/models/post.py]
import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from src.db.config import Base


class Post(Base):
    """SQLAlchemy model for blog posts."""
    
    __tablename__ = "posts"
    
    id: Mapped[str] = mapped_column(
        String(36), 
        primary_key=True, 
        default=lambda: str(uuid.uuid4())
    )
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    published: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    
    def __repr__(self) -> str:
        """String representation of the post."""
        return f"<Post {self.title}>"
```

This model defines a `Post` class with several key attributes:

- `id`: A unique identifier using UUID, stored as a string
- `title`: The post title with a maximum length of 100 characters
- `content`: The main body of the post, stored as text
- `published`: A boolean flag indicating whether the post is published
- `created_at`: A timestamp indicating when the post was created
- `updated_at`: A timestamp that updates whenever the post is modified

The model uses SQLAlchemy 2.0-style type hints with the `Mapped` type for better type safety and IDE integration.

Next, update the `src/db/config.py` file to import the `Post` model to ensure it's registered with the Base metadata:

```python
[label src/db/config.py]
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

.....
[highlight]
# Import models to ensure they're registered with Base
from src.models.post import Post  # noqa
[/highlight]
```

You can verify that the table was created using the SQLite command-line tool:

```command
sqlite3 blog.db
```

```sql
sqlite> .tables
posts
sqlite> .schema posts
CREATE TABLE posts (
        id VARCHAR(36) NOT NULL, 
        title VARCHAR(100) NOT NULL, 
        content TEXT NOT NULL, 
        published BOOLEAN NOT NULL, 
        created_at DATETIME NOT NULL, 
        updated_at DATETIME NOT NULL, 
        PRIMARY KEY (id)
);
sqlite> .exit
```

With the Post model defined, you now have a structured way to interact with the database.

With our database model in place, you need a way to validate incoming request data and serialize database objects to JSON responses. Litestar works well with standard Python dataclasses for request validation and response serialization.

Create a new schema file at `src/schemas/post.py`:

```python
[label src/schemas/post.py]
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class PostBase:
    """Base schema with common post attributes."""
    title: str
    content: str
    published: bool = True


@dataclass
class PostCreate(PostBase):
    """Schema for creating a new post."""
    pass


@dataclass
class PostUpdate:
    """Schema for updating an existing post."""
    title: Optional[str] = None
    content: Optional[str] = None
    published: Optional[bool] = None


@dataclass
class PostResponse:
    """Schema for post responses."""

    id: str
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    published: bool = True
```

These dataclasses define the API schemas, handling different aspects of request validation and response formatting. The `PostBase` schema provides common fields, while `PostCreate` validates new post requests. 

The `PostUpdate` schema ensures only specified fields are modified, and `PostResponse` formats database records into API responses. 

Litestar leverages these schemas to validate incoming data, generate API documentation, serialize models into JSON, and return clear error messages when validation fails.

## Step 4 — Creating blog posts

Now that you have the database model and validation schemas, let's implement the first API endpoint for creating new blog posts. You'll use the controller-based approach for better organization of our route handlers.

Create a new file at `src/controllers/post.py`:

```python
[label src/controllers/post.py]
from litestar import Controller, post
from litestar.params import Dependency
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.post import Post
from src.schemas.post import PostCreate, PostResponse


class PostController(Controller):
    """Controller for blog post operations."""

    path = "/api/posts"
    tags = ["posts"]

    @post()
    async def create_post(
        self,
        data: PostCreate,
        db_session: AsyncSession = Dependency(),
    ) -> PostResponse:
        """Create a new blog post."""
        # Create a new post instance
        new_post = Post(
            title=data.title,
            content=data.content,
            published=data.published,
        )

        # Add to database and commit
        db_session.add(new_post)
        await db_session.commit()
        await db_session.refresh(new_post)

        # Return the created post
        return PostResponse(
            id=new_post.id,
            title=new_post.title,
            content=new_post.content,
            published=new_post.published,
            created_at=new_post.created_at,
            updated_at=new_post.updated_at,
        )
```

The `PostController` class groups blog post-related routes under the `/api/posts` path. The `@post()` decorator registers a POST endpoint at the controller's base path.

The `create_post` method validates incoming data using the `PostCreate` schema, creates a new `Post` instance, saves it to the database, and returns the created post using the `PostResponse` schema.

Now, update your `app.py` file to include the controller:

```python
[label app.py]
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from litestar import Litestar, get
from litestar.di import Provide

from src.db.config import get_db_session, Base, engine
[highlight]
from src.controllers.post import PostController
[/highlight]


@get("/")
async def hello_world() -> dict:
    """Root endpoint for the API."""
    return {"message": "Welcome to the Blog API"}


...
app = Litestar(
[highlight]
    route_handlers=[hello_world, PostController],
[/highlight]
    dependencies={"db_session": Provide(get_db_session)},
    lifespan=[db_lifespan],
)
```

This update adds the `PostController` to the application's route handlers, making the POST endpoint available.

Save your file, and once the changes are detected, the server will restart automatically.


Now you can create a new blog post by sending a POST request to `/api/posts`. Test it using `curl`:

```command
curl -X POST http://127.0.0.1:8000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Litestar Blog Post","content":"This is the content of my first blog post. Litestar makes API development easy and enjoyable!"}' \
  | python3 -m json.tool
```

You should receive a response like this:

```json
[output]
{
    "id": "692381d2-9397-4eac-9b97-32598d648475",
    "title": "My First Litestar Blog Post",
    "content": "This is the content of my first blog post. Litestar makes API development easy and enjoyable!",
    "created_at": "2025-03-12T10:42:35.700944",
    "updated_at": "2025-03-12T10:42:35.700948",
    "published": true
}
```

Litestar automatically generates interactive API documentation, which your browser can access at `http://127.0.0.1:8000/schema/swagger`:


![Screenshot of the interactive API documentation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a8c253cc-e4c2-49ac-785f-91a2c6212200/md1x =3248x1996)

This documentation shows all available endpoints and their expected request and response formats and allows for testing the API directly from the browser. 

## Step 5 — Retrieving blog posts

Now that you can create blog posts, let's implement functionality to retrieve them. First, we'll add a method to get all posts with optional filtering.

Update your `PostController` in `src/controllers/post.py` to add the `get_posts` endpoint:

```python
[label src/controllers/post.py]
[highlight]
from typing import List, Optional
from litestar import Controller, post, get
[/highlight]
from litestar.params import Dependency
[highlight]
from sqlalchemy import select
[/highlight]
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.post import Post
from src.schemas.post import PostCreate, PostResponse


class PostController(Controller):
    """Controller for blog post operations."""
    
    path = "/api/posts"
    tags = ["posts"]
    
    @post()
    async def create_post(
        self,
        data: PostCreate,
        db_session: AsyncSession = Dependency(),
    ) -> PostResponse:
        """Create a new blog post."""
        # Existing code...
        return PostResponse(
         ...
        )
        
        
[highlight]
    @get()
    async def get_posts(
        self,
        db_session: AsyncSession = Dependency(),
        published: Optional[bool] = None,
    ) -> List[PostResponse]:
        """Get a list of blog posts with optional filtering."""
        # Build the query
        query = select(Post)
        
        # Apply filters if specified
        if published is not None:
            query = query.where(Post.published == published)
            
        # Execute query and get results
        result = await db_session.execute(query.order_by(Post.created_at.desc()))
        posts = result.scalars().all()
        
        # Return serialized posts
        return [
            PostResponse(
                id=post.id,
                title=post.title,
                content=post.content,
                published=post.published,
                created_at=post.created_at,
                updated_at=post.updated_at,
            ) 
            for post in posts
        ]
[/highlight]
```

The `get_posts` method allows retrieving blog posts with an optional `published` parameter, enabling filtering based on their publication status. It constructs an SQLAlchemy query, applying the filter if specified, and sorts the results by creation date, ensuring the newest posts appear first.

Finally, it serializes the retrieved posts using the `PostResponse` schema before returning them as a structured response.

Now you can test this endpoint. List all posts:

```command
curl http://127.0.0.1:8000/api/posts | python3 -m json.tool
```

You should see a list of all the posts you've created so far:

```json
[output]
[
    {
        "id": "692381d2-9397-4eac-9b97-32598d648475",
        "title": "My First Litestar Blog Post",
        "content": "This is the content of my first blog post. Litestar makes API development easy and enjoyable!",
        "created_at": "2025-03-12T10:42:35.700944",
        "updated_at": "2025-03-12T10:42:35.700948",
        "published": true
    }
]
```

Now, create a draft post to test filtering:

```command
curl -X POST http://127.0.0.1:8000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Draft Post","content":"This is an unpublished draft post.","published":false}' \
  | python3 -m json.tool
```

Test the filtering functionality by retrieving only published posts:

```command
curl "http://127.0.0.1:8000/api/posts?published=true" | python3 -m json.tool
```

```json
[output]
[
    {
        "id": "692381d2-9397-4eac-9b97-32598d648475",
        "title": "My First Litestar Blog Post",
        "content": "This is the content of my first blog post. Litestar makes API development easy and enjoyable!",
        "created_at": "2025-03-12T10:42:35.700944",
        "updated_at": "2025-03-12T10:42:35.700948",
        "published": true
    }
]
```

This should return only the published posts. Similarly, you can retrieve only draft posts:

```command
curl "http://127.0.0.1:8000/api/posts?published=false" | python3 -m json.tool
```

This should return only the unpublished drafts:

```json
[output]
[
    {
        "id": "0e672f06-e8ac-4ded-a983-ca0b2d771634",
        "title": "Draft Post",
        "content": "This is an unpublished draft post.",
        "created_at": "2025-03-12T11:09:21.098464",
        "updated_at": "2025-03-12T11:09:21.098473",
        "published": false
    }
]
```

Now, let's add the endpoint to retrieve a specific post by its ID. Update your `PostController` again:

```python
[label src/controllers/post.py]
...
class PostController(Controller):
    """Controller for blog post operations."""
    ...
    @get()
    async def get_posts(
        self,
        db_session: AsyncSession = Dependency(),
        published: Optional[bool] = None,
    ) -> List[PostResponse]:
        ...

        # Return serialized posts
        return [
            ...
        ]
[highlight]
    @get("/{post_id:str}")
    async def get_post(
        self,
        post_id: str,
        db_session: AsyncSession = Dependency(),
    ) -> PostResponse:
        """Get a specific blog post by ID."""
        # Query the post
        result = await db_session.execute(select(Post).where(Post.id == post_id))
        post = result.scalars().first()

        # Raise 404 if not found
        if not post:
            from litestar.exceptions import NotFoundException

            raise NotFoundException(f"Post with ID {post_id} not found")

        # Return the serialized post
        return PostResponse(
            id=post.id,
            title=post.title,
            content=post.content,
            published=post.published,
            created_at=post.created_at,
            updated_at=post.updated_at,
        )
[/highlight]
```
This method retrieves a blog post using its ID, which is passed as a path parameter. It queries the database for the matching post and returns it in a structured format using the `PostResponse` schema. 

If the requested post does not exist, it raises a `NotFoundException`, returning a 404 error response.

Test this endpoint by retrieving a specific post by ID (replace with an actual ID from your database):

```command
curl http://127.0.0.1:8000/api/posts/<your_id> | python3 -m json.tool
```

You should receive the specific post details in the response:

```json
[output]
{
    "id": "0e672f06-e8ac-4ded-a983-ca0b2d771634",
    "title": "Draft Post",
    "content": "This is an unpublished draft post.",
    "created_at": "2025-03-12T11:09:21.098464",
    "updated_at": "2025-03-12T11:09:21.098473",
    "published": false
}
```

Try requesting a non-existent post to verify error handling:

```command
curl -v http://127.0.0.1:8000/api/posts/non-existent-id
```

```text
[output]

*   Trying 127.0.0.1:8000...
* Connected to 127.0.0.1 (127.0.0.1) port 8000
> GET /api/posts/non-existent-id HTTP/1.1
> Host: 127.0.0.1:8000
> User-Agent: curl/8.7.1
> Accept: */*
> 
* Request completely sent off
< HTTP/1.1 404 Not Found
< date: Wed, 12 Mar 2025 11:15:28 GMT
< server: uvicorn
< content-type: application/json
< content-length: 69
< 
* Connection #0 to host 127.0.0.1 left intact
{"status_code":404,"detail":"Post with ID non-existent-id not found"}%   
```

You should see a 404 response with an appropriate error message.

Take a moment to check the interactive API documentation at `http://127.0.0.1:8000/schema/swagger` in your browser.

![Screenshot of updated API documentation showing GET endpoints](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/23232bbc-bb93-4ddc-d588-dc2bc775f700/md2x =2984x1718)

You'll notice it now includes the new GET endpoints you've added. The documentation automatically updates to reflect your API's capabilities, showing each endpoint's parameters, request formats, and response structures.

This interactive documentation makes it easy to understand and test your API, even for users who aren't familiar with the implementation details.

With these two endpoints, you've now implemented the read operations for your API. Users can list all posts, filter posts by publication status, and retrieve specific posts by ID.


## Step 6 — Updating blog posts

With the ability to create and retrieve blog posts, the next step is implementing functionality for updating existing posts. This will allow users to modify post content, title, or publication status.

Update your `PostController` in `src/controllers/post.py` to add the PUT method:

```python
[label src/controllers/post.py]
from typing import List, Optional
[highlight]
# Add the put import
from litestar import Controller, post, get, put
[/highlight]
from litestar.params import Dependency
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.post import Post

[highlight]
# Add the PostUpdate import
from src.schemas.post import PostCreate, PostResponse, PostUpdate
[/highlight]


class PostController(Controller):
    """Controller for blog post operations."""
    
    # Existing code...
    
[highlight]
    @put("/{post_id:str}")
    async def update_post(
        self,
        post_id: str,
        data: PostUpdate,
        db_session: AsyncSession = Dependency(),
    ) -> PostResponse:
        """Update a specific blog post."""
        # Query the post
        result = await db_session.execute(
            select(Post).where(Post.id == post_id)
        )
        post = result.scalars().first()
        
        # Raise 404 if not found
        if not post:
            from litestar.exceptions import NotFoundException
            raise NotFoundException(f"Post with ID {post_id} not found")
        
        # Update post fields if provided
        if data.title is not None:
            post.title = data.title
        if data.content is not None:
            post.content = data.content
        if data.published is not None:
            post.published = data.published
        
        # Commit changes
        await db_session.commit()
        await db_session.refresh(post)
        
        # Return updated post
        return PostResponse(
            id=post.id,
            title=post.title,
            content=post.content,
            published=post.published,
            created_at=post.created_at,
            updated_at=post.updated_at,
        )
[/highlight]
```

The `update_post` method handles PUT requests to update an existing post. It first retrieves the post by ID, raises a 404 error if not found, updates only the fields that were provided in the request, and commits the changes to the database.

The method uses the `PostUpdate` schema, which has all fields marked as optional. This allows for partial updates—clients can update only the fields they want to change without having to provide values for fields they don't want to modify.

Now, test the endpoint by updating one of the posts you created earlier. Be sure to replace the post ID with an actual ID from your database:

```command
curl -X PUT http://127.0.0.1:8000/api/posts/692381d2-9397-4eac-9b97-32598d648475 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Blog Post Title","content":"This content has been updated. Litestar makes updating API resources easy!"}' \
  | python3 -m json.tool
```

You should receive a response with the updated post:

```json
[output]
{
    "id": "692381d2-9397-4eac-9b97-32598d648475",
    "title": "Updated Blog Post Title",
    "content": "This content has been updated. Litestar makes updating API resources easy!",
    "created_at": "2025-03-12T10:42:35.700944",
    "updated_at": "2025-03-12T11:24:38.931100",
    "published": true
}
```

Notice that while the `created_at` timestamp remains the same, the `updated_at` timestamp has been updated to reflect the modification time.

You can also try updating just the publication status of a post:

```command
curl -X PUT http://127.0.0.1:8000/api/posts/692381d2-9397-4eac-9b97-32598d648475 \
  -H "Content-Type: application/json" \
  -d '{"published":false}' \
  | python3 -m json.tool
```

The response should show the post with its publication status changed to `false`, while keeping the other fields the same:

```json
[output]
{
    "id": "692381d2-9397-4eac-9b97-32598d648475",
    "title": "Updated Blog Post Title",
    "content": "This content has been updated. Litestar makes updating API resources easy!",
    "created_at": "2025-03-12T10:42:35.700944",
    "updated_at": "2025-03-12T11:25:06.677273",
    "published": false
}
```

The API documentation at `http://127.0.0.1:8000/schema/swagger` will now show the new PUT endpoint, with information about the request body format and possible responses. 


![Screenshot of updated API documentation showing PUT endpoint](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b41985b8-c71a-456d-3d04-3cb956d59f00/md2x =2984x1948)

With the implementation of the PUT endpoint, users can now update existing blog posts. In the next step, you'll complete the CRUD functionality by implementing the DELETE endpoint to allow users to remove blog posts from the database.

## Step 7 — Deleting blog posts

The final step in completing the CRUD functionality of your blog API is to implement the DELETE endpoint. This will allow users to remove blog posts from the database when they're no longer needed.

Update your `PostController` in `src/controllers/post.py` to add the DELETE method:

```python
[label src/controllers/post.py]
from typing import List, Optional
[highlight]
# Add the delete import
from litestar import Controller, post, get, put, delete
[/highlight]
from litestar.params import Dependency
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.post import Post
from src.schemas.post import PostCreate, PostResponse, PostUpdate


class PostController(Controller):
    """Controller for blog post operations."""
    
    # Existing code...
    
    @delete("/{post_id:str}")
    async def delete_post(
        self,
        post_id: str,
        db_session: AsyncSession = Dependency(),
    ) -> None:
        """Delete a specific blog post."""
        # Query the post
        result = await db_session.execute(
            select(Post).where(Post.id == post_id)
        )
        post = result.scalars().first()
        
        # Raise 404 if not found
        if not post:
            from litestar.exceptions import NotFoundException
            raise NotFoundException(f"Post with ID {post_id} not found")
        
        # Delete the post and commit
        await db_session.delete(post)
        await db_session.commit()
```

The `delete_post` method handles DELETE requests for blog posts. It retrieves the post by ID, raises a 404 error if the post isn't found, and then removes it from the database. 

Notice that this endpoint returns `None`, which Litestar will interpret as a 204 No Content response—a standard HTTP status code indicating that the request was successful but there's no content to return.

Now, test the DELETE endpoint. First, make sure you have a post to delete. You can create a new one specifically for testing:

```command
curl -X POST http://127.0.0.1:8000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Post to Delete","content":"This post will be deleted to test the DELETE endpoint."}' \
  | python3 -m json.tool
```

You should receive a response with the newly created post, including its ID:

```json
[output]
{
    "id": "27f80e88-41bc-49c3-98a0-94b5d9dcd42e",
    "title": "Post to Delete",
    "content": "This post will be deleted to test the DELETE endpoint.",
    "created_at": "2025-03-12T11:31:29.473946",
    "updated_at": "2025-03-12T11:31:29.473951",
    "published": true
}
```

Now, delete this post using its ID (replace with the actual ID from your response):

```command
curl -X DELETE http://127.0.0.1:8000/api/posts/<your_id> -v
```

The `-v` (verbose) flag will show the response headers, including the status code:

```text
[output]
*   Trying 127.0.0.1:8000...
* Connected to 127.0.0.1 (127.0.0.1) port 8000
> DELETE /api/posts/27f80e88-41bc-49c3-98a0-94b5d9dcd42e HTTP/1.1
> Host: 127.0.0.1:8000
> User-Agent: curl/8.7.1
> Accept: */*
> 
* Request completely sent off
< HTTP/1.1 204 No Content
< date: Wed, 12 Mar 2025 11:32:49 GMT
< server: uvicorn
< 
* Connection #0 to host 127.0.0.1 left intact
```

The HTTP status code 204 confirms that the post was successfully deleted.

To verify that the post was deleted, try to retrieve it:

```command
curl http://127.0.0.1:8000/api/posts/<your_id>
```

You should receive a 404 Not Found response, confirming that the post has been removed from the database:

```json
[output]
{"status_code":404,"detail":"Post with ID 27f80e88-41bc-49c3-98a0-94b5d9dcd42e not found"}
```

Check the API documentation at `http://127.0.0.1:8000/schema/swagger` to see the new DELETE endpoint added to your API:

![Screenshot of updated API documentation showing DELETE endpoint](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/74c45378-d350-435a-5c77-6af9ba8bfd00/orig =2984x2058)

With that, you have successfully implemented a fully functional blog API using Litestar and SQLAlchemy.


## Final thoughts

Congratulations! You've successfully built a fully functional RESTful API for a blog using Litestar and SQLAlchemy, supporting all CRUD operations, including creating, retrieving, updating, and deleting posts.

To enhance your blog API further, consider adding authentication, pagination, search functionality, model relationships, logging, and automated testing. Litestar’s performance, type safety, and developer-friendly design make it an excellent choice for modern Python APIs.

 For further learning and advanced features, check out the [Litestar documentation](https://docs.litestar.dev/).




