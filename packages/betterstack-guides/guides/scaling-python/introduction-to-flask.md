# Building Web APIs with Flask: A Beginner's Guide

Flask is a lightweight web framework for Python that simplifies the development of web applications and APIs. It provides an intuitive way to build APIs, making it an excellent choice if you're looking to create scalable and maintainable web services.

In this tutorial, you'll build a blog API using Flask and SQLite as the database backend. We'll cover essential Flask concepts while implementing CRUD operations: creating, reading, updating, and deleting blog posts.

## Prerequisites

Before getting started, ensure you have:

- Python installed on your system (preferably the latest version, Python 3.13 or higher)
- A basic understanding of Python and web development


## Step 1 — Setting up the Flask project
In this section, you'll create the directory structure and install the necessary dependencies for the Flask API project.

First, create a new directory for your project and navigate into it:

```command
mkdir flask-blog-api && cd flask-blog-api
```

Next, create a virtual environment and activate it:

```command
python3 -m venv venv
```
```command
source venv/bin/activate 
```

Install Flask and other dependencies:

```command
pip install flask flask-sqlalchemy flask-smorest marshmallow
```
Here’s a breakdown of these packages:

- `Flask` – The core web framework.
- `Flask-SQLAlchemy` – A powerful database toolkit for managing database interactions.
- `Flask-Smorest` – A structured way to build REST APIs with OpenAPI support.
- `Marshmallow` – A library for serializing, deserializing, and validating data.


Create a new file called `app.py` and set up a basic Flask application:

```python
[label app.py]
from flask import Flask


def create_app():
    app = Flask(__name__)

    @app.route("/", methods=["GET"])
    def hello_world():
        return {"message": "Welcome to the Blog API"}

    return app


# Create the app instance
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
```
This script defines a `create_app()` function that initializes and returns a Flask application. It registers a simple route at `/`, which responds with a JSON message. When executed directly, the script runs the application in debug mode.

Now, run the application:

```command
python app.py
```

You should see output similar to:

```text
* Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 143-317-528
```

This means your Flask server is running. Open `http://127.0.0.1:5000/` in a browser, or alternatively, use `curl` to test the API:

```command
curl http://127.0.0.1:5000/
```

The output will be:

```json
[output]
{
  "message": "Welcome to the Blog API"
}
```

At this point, your Flask API is set up and running. In the next step, you’ll integrate a database using SQLAlchemy.

## Step 2 — Configuring the database with SQLAlchemy  

With the Flask application set up, the next step is integrating a database to store and manage blog posts. Flask-SQLAlchemy simplifies database interactions, allowing you to define models and perform queries with Python instead of raw SQL. This section will guide you through configuring SQLite as the database backend.    



To begin, update your app.py file to include SQLAlchemy configuration:

```python
[label app.py]
from flask import Flask
[highlight]
from flask_sqlalchemy import SQLAlchemy
import os

# Initialize SQLAlchemy
db = SQLAlchemy()
[/highlight]
def create_app():
    app = Flask(__name__)
[highlight]   
    # Configure database
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///blog.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    # Initialize the app with the database
    db.init_app(app)
[/highlight]
    
    @app.route("/", methods=["GET"])
    def hello_world():
        return {"message": "Welcome to the Blog API"}
[highlight]   
    # Ensure database tables are created before running the app
    with app.app_context():
        db.create_all()
[/highlight]
        
    return app

# Create the app instance
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
```  

The updated code initializes SQLAlchemy, configures the database connection, and binds it to the Flask app. It checks for a `DATABASE_URL` environment variable, defaulting to SQLite if not found. `db.init_app(app)` sets up the database, and `db.create_all()` ensures tables exist within an application context. These changes integrate the database, preparing it for future operations.



If everything is set up correctly, the Flask server will start upon saving, and the database file `blog.db` will be created inside the `instance/` directory.

You can confirm its existence and directory structure by listing the files:

```command
tree
```

```text
[output
...
├── app.py
├── instance
│   └── blog.db
```

The database is now integrated with your Flask application, but it's currently empty.


## Step 3 — Creating the post model

With the database configured, it's time to define a data model for blog posts. In this step, you'll create a SQLAlchemy model that represents the structure of blog posts in the database, complete with proper data types and constraints.

First, create a dedicated models directory to keep your code organized:

```command
mkdir -p models
```
```command
touch models/__init__.py
```
```command
touch models/post.py
```

Now, create the Post model in the `models/post.py` file:

```python
[label models/post.py]
from datetime import datetime
import uuid
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Post(db.Model):
    __tablename__ = "posts"
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    published = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<Post {self.title}>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "published": self.published,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
```

This model defines a `Post` class with several key attributes:

- `id`: A unique identifier using UUID, stored as a string
- `title`: The post title with a maximum length of 100 characters
- `content`: The main body of the post, stored as text
- `published`: A boolean flag indicating whether the post is published
- `created_at`: A timestamp indicating when the post was created
- `updated_at`: A timestamp that updates whenever the post is modified

The `__repr__` method provides a readable string representation of the Post object, while the `to_dict` method converts a Post instance to a dictionary for easy JSON serialization.

Now, update your `app.py` file to use this model:

```python
[label app.py]
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
[highlight]
// remove db = SQLAlchemy()

# Import the Post model
from models.post import db, Post
[/highlight]

def create_app():
    app = Flask(__name__)
    
    # Configure database
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///blog.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    # Initialize the app with the database
    db.init_app(app)
    
    @app.route("/", methods=["GET"])
    def hello_world():
        return {"message": "Welcome to the Blog API"}
    
    # Ensure database tables are created before running the app
    with app.app_context():
        db.create_all()
        
    return app

# Create the app instance
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
```


If everything is set up correctly, the Flask server will auto-restart and the `posts` table will be created in the database. You won't notice any visual changes yet, but the foundation for storing blog posts is now in place.

You can verify that the table was created by using the SQLite command-line tool:

```command
sqlite3 instance/blog.db
```

```sql
sqlite> .tables
posts
sqlite> .schema posts
CREATE TABLE posts (
        id VARCHAR(36) NOT NULL, 
        title VARCHAR(100) NOT NULL, 
        content TEXT NOT NULL, 
        published BOOLEAN, 
        created_at DATETIME, 
        updated_at DATETIME, 
        PRIMARY KEY (id)
);
sqlite> .exit
```

With the Post model defined, you now have a structured way to interact with the database. This model will serve as the foundation for the CRUD operations you'll implement in the next steps.

The table structure includes all necessary fields for managing blog posts, and the UUIDs ensure each post has a unique identifier across the system.


## Step 4 — Creating the post schema with Marshmallow

With our database model in place, you now need a way to validate incoming request data and serialize database objects to JSON responses. Marshmallow is a powerful library that provides this functionality, ensuring data consistency and proper formatting across our API.

First, create a schemas directory to organize your validation schemas:

```command
mkdir -p schemas
```
```command
touch schemas/__init__.py
```
```command
touch schemas/post.py
```

Next, define the Post schema in the `schemas/post.py` file:

```python
[label schemas/post.py]
from marshmallow import Schema, fields, validate

class PostSchema(Schema):
    id = fields.String(dump_only=True)
    title = fields.String(required=True, validate=validate.Length(min=3, max=100))
    content = fields.String(required=True, validate=validate.Length(min=10))
    published = fields.Boolean(missing=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class PostQuerySchema(Schema):
    published = fields.Boolean(missing=None)
```

The `PostSchema` class defines the expected structure for blog post objects, enforcing validation rules to ensure data consistency:

  - `id`: A string field that's only included in responses, not in requests
  - `title`: A required string between 3-100 characters
  - `content`: A required string with a minimum length of 10 characters
  - `published`: A boolean that defaults to True if not provided
  - `created_at` and `updated_at`: DateTime fields only included in responses

The `PostQuerySchema` class is used for filtering posts when querying the database. It includes an optional `published` field that allows users to filter posts based on their publication status.


Now, update `app.py` to integrate Flask-Smorest for our API documentation:

```python
[label app.py]
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
[highlight]
from flask_smorest import Api
[/highlight]
import os

# Import the Post model
from models.post import db, Post

def create_app():
    app = Flask(__name__)
    
    # Configure database
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///blog.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
[highlight]
    # Configure API documentation
    app.config["API_TITLE"] = "Blog API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/api/docs"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger"
    app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
[/highlight]
    
    # Initialize the app with the database
    db.init_app(app)
    
[highlight]
    # Initialize API
    api = Api(app)
[/highlight]
    
    @app.route("/", methods=["GET"])
    ...
```

The updated code configures Flask-Smorest, which provides:

- Automatic request validation based on our schemas
- Serialization of response data
- Interactive API documentation through Swagger UI
- OpenAPI specification generation


When you save, the server will restart. You can now access the API documentation at `http://127.0.0.1:5000/api/docs/swagger`, although it won't show any endpoints yet since we haven't defined them.

![Screenshot of the API documentation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cab94ece-051d-4c1d-907f-2993608a4100/lg1x =3248x1994)

The Marshmallow schemas you’ve created provide several advantages. They ensure that only properly formatted data is accepted through validation while offering clear error messages to help API users understand issues. 

Automatic type conversion simplifies data transformations, and the schemas also contribute to generating API documentation seamlessly.

In the next step, you'll create the API resources and endpoints to handle CRUD operations for blog posts, starting with the create endpoint.

## Step 5 — Implementing the POST endpoint for creating blog posts

Now that you have your database model and validation schema, it's time to create your first API endpoint for creating new blog posts. You'll use Flask-Smorest to handle request validation and response serialization.

First, create a directory for our API resources:

```command
mkdir -p resources
```
```command
touch resources/__init__.py
```
```command
touch resources/post.py
```

Now, create the post resource in the `resources/post.py` file with your first endpoint for creating posts:

```python
[label resources/post.py]
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from models.post import db, Post
from schemas.post import PostSchema, PostQuerySchema

# Create a blueprint for post-related endpoints
blp = Blueprint(
    "posts", "posts",
    description="Operations on blog posts"
)

@blp.route("/api/posts")
class PostList(MethodView):
    @blp.arguments(PostSchema)
    @blp.response(201, PostSchema)
    def post(self, post_data):
        """Create a new blog post"""
        new_post = Post(
            title=post_data["title"],
            content=post_data["content"],
            published=post_data.get("published", True)
        )
        
        try:
            db.session.add(new_post)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))
            
        return new_post
```

This code defines a blueprint that groups blog post-related routes under `"posts"`. 

The `PostList` class, which inherits from `MethodView`, defines a `POST` endpoint for creating posts. 

Incoming request data is validated using the `PostSchema`, ensuring the correct structure. The validated data is then used to create a new `Post` instance, which is added to the database.

If an error occurs during the commit process, the transaction is rolled back to prevent data corruption.

Next, update the `app.py` file to register your blueprint:

```python
[label app.py]
...
# Import the Post model and blueprint
from models.post import db, Post
[highlight]
from resources.post import blp as post_blueprint
[/highlight]

def create_app():
    app = Flask(__name__)
    
    ...    
    # Initialize API
    api = Api(app)
    
    [highlight]
    # Register blueprints
    api.register_blueprint(post_blueprint)
    [/highlight]
    
    @app.route("/", methods=["GET"])
    ...
```

This ensures that the post-related routes are included in your Flask API.

When you save the file, the server should restart automatically. If it doesn’t, manually restart it to apply the changes:

```command
python app.py
```

Now you can create a new blog post by sending a POST request to `/api/posts`. Test it using `curl`:

```command
curl -X POST http://127.0.0.1:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Blog Post","content":"This is the content of my first blog post. Flask makes API development easy and enjoyable!"}' \
  | python3 -m json.tool
```

You should receive a response like this:

```json
[output]
{
    "content": "This is the content of my first blog post. Flask makes API development easy and enjoyable!",
    "created_at": "2025-02-27T10:49:38.369401",
    "id": "3257de2a-ddae-4070-90d4-1b04a367bb07",
    "published": true,
    "title": "My First Blog Post",
    "updated_at": "2025-02-27T10:49:38.369421"
}
```

You can also explore the API documentation at `http://127.0.0.1:5000/api/docs/swagger` in the browser:

![post is now in the documentation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a81bc571-5719-4259-02fc-58c575e56300/lg2x =3248x1994)

The interface displays the "Blog API v1" title at the top, with an expandable "posts" section showing available operations, including the POST endpoint at `/api/post`.


When expanded, the POST endpoint details the required request body format, expected response codes, and example request/response pairs:

![Screenshot of the documentation expanded](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bb64a29c-da40-4a0e-8796-90b37d9a7d00/lg1x =3024x4114)

Now test the validation by trying to create a post with an invalid title (too short):

```command
curl -X POST http://127.0.0.1:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hi","content":"This content is valid but the title is too short."}' \
  | python3 -m json.tool
```

You should receive a validation error:

```json
[output]
{
    "code": 422,
    "errors": {
        "json": {
            "title": [
                "Length must be between 3 and 100."
            ]
        }
    },
    "status": "Unprocessable Entity"
}
```

This demonstrates how Marshmallow validates incoming data before reaching our endpoint function, ensuring data integrity.

The POST endpoint you've created follows REST principles:

- Using the appropriate HTTP method (POST) for resource creation
- Returning a 201 status code to indicate successful creation
- Including the complete resource in the response
- Providing clear validation errors when input is invalid

In the next step, you'll implement the endpoint for retrieving blog posts.

[ad-logs]

## Step 6 — Implementing the GET endpoint for retrieving blog posts

Now that you can create blog posts, the next step is to implement functionality to retrieve them. In this section, you'll create an endpoint to list all posts with optional filtering by publication status.

First, update the `resources/post.py` file to add a GET method to the existing `PostList` class:

```python
[label resources/post.py]
...
@blp.route("/api/posts")
class PostList(MethodView):
[highlight]
    @blp.response(200, PostSchema(many=True))
    @blp.arguments(PostQuerySchema, location="query")
    def get(self, query_args):
        """Get a list of blog posts"""
        query = Post.query
        
        # Filter by publication status if specified
        if query_args.get("published") is not None:
            query = query.filter(Post.published == query_args["published"])
            
        # Order by most recent first
        query = query.order_by(Post.created_at.desc())
        
        return query.all()
[/highlight]  
  
    # Existing post method stays the same
    @blp.arguments(PostSchema)
    @blp.response(201, PostSchema)
    def post(self, post_data):
        """Create a new blog post"""
        # ... existing code
```
This method allows filtering posts based on query parameters and returns them in a structured format. 

The `@blp.response(200, PostSchema(many=True))` decorator ensures the response follows the `PostSchema` format, while `@blp.arguments(PostQuerySchema, location="query")` processes optional query parameters.

 Inside the method, the database query starts by selecting all posts. If a **published status** filter is provided, the query applies a filter to return only matching posts.

Additionally, posts are sorted by creation date in descending order, ensuring the most recent posts appear first. 

The method then returns the filtered and sorted posts as JSON. The existing `POST` method remains unchanged, continuing to handle blog post creation.

With that, save the new changes.

Now use `curl` to retrieve all posts:

```command
curl http://127.0.0.1:5000/api/posts | python3 -m json.tool
```

You should see all the posts you've created so far:

```json
[output]
[
    {
        "content": "This is the content of my first blog post. Flask makes API development easy and enjoyable!",
        "created_at": "2025-02-27T10:49:38.369401",
        "id": "3257de2a-ddae-4070-90d4-1b04a367bb07",
        "published": true,
        "title": "My First Blog Post",
        "updated_at": "2025-02-27T10:49:38.369421"
    }
]
```

Now let's create another post to see how filtering works:

```command
curl -X POST http://127.0.0.1:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Draft Post","content":"This is an unpublished draft post.","published":false}' \
  | python3 -m json.tool
```

After creating the draft post, test the filtering functionality by retrieving only published posts:

```command
curl "http://127.0.0.1:5000/api/posts?published=true" | python3 -m json.tool
```

This should return only the published posts:

```json
[output]
[
    {
        "content": "This is the content of my first blog post. Flask makes API development easy and enjoyable!",
        "created_at": "2025-02-27T10:49:38.369401",
        "id": "3257de2a-ddae-4070-90d4-1b04a367bb07",
        "published": true,
        "title": "My First Blog Post",
        "updated_at": "2025-02-27T10:49:38.369421"
    }
]
```

Similarly, you can retrieve only draft posts:

```command
curl "http://127.0.0.1:5000/api/posts?published=false" | python3 -m json.tool
```

This should return only the unpublished drafts:

```json
[output]
[
    {
        "content": "This is an unpublished draft post.",
        "created_at": "2025-02-27T11:24:18.867765",
        "id": "13c21de2-499e-4047-bb62-5dd55ce22e2f",
        "published": false,
        "title": "Draft Post",
        "updated_at": "2025-02-27T11:24:18.867775"
    }
]
```

You can also check the Swagger UI documentation at `http://127.0.0.1:5000/api/docs/swagger`, which now shows the GET endpoint with its parameters:

![GET endpoint in the documentation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7c22b4fc-1150-46c4-3356-0669ecaf9500/lg1x =3024x4066)

Now that you can list and filter all posts by publication status, you will implement the endpoint for retrieving a single post by its ID. 

Add the following code to the `resources/post.py` file:

```python
[label resources/post.py]
...
@blp.route("/api/posts")
class PostList(MethodView):
    @blp.response(200, PostSchema(many=True))
    ...

[highlight]
@blp.route("/api/posts/<string:post_id>")
class PostResource(MethodView):
    @blp.response(200, PostSchema)
    def get(self, post_id):
        """Get a specific blog post by ID"""
        post = Post.query.get_or_404(
            post_id, 
            description=f"Post with ID {post_id} not found"
        )
        return post
[/highlight]
```

This code adds a new `PostResource` class with a GET method that:

- Takes a post ID as a URL parameter
- Uses SQLAlchemy's `get_or_404` method to retrieve the post or return a 404 error
- Returns the post serialized according to `PostSchema`

Test this endpoint by retrieving one of your posts by its ID (replace with an actual ID from your previous GET response):

```command
curl http://127.0.0.1:5000/api/posts/3257de2a-ddae-4070-90d4-1b04a367bb07 | python3 -m json.tool
```

You should receive the specific post:

```json
[output]
{
    "content": "This is the content of my first blog post. Flask makes API development easy and enjoyable!",
    "created_at": "2025-02-27T10:49:38.369401",
    "id": "3257de2a-ddae-4070-90d4-1b04a367bb07",
    "published": true,
    "title": "My First Blog Post",
    "updated_at": "2025-02-27T10:49:38.369421"
}
```

Try requesting a non-existent post to see the 404 error handling:

```command
curl http://127.0.0.1:5000/api/posts/non-existent-id | python3 -m json.tool
```

```json
[output]
{
    "code": 404,
    "status": "Not Found"
}
```

You've now successfully implemented two GET endpoints for your blog API.


In the next step, you'll implement an endpoint for updating the blog posts.

## Step 7 — Implementing the PUT endpoint for updating blog posts

Now that you have the functionality to create and retrieve blog posts, the next step is to implement the ability to update existing posts. This will allow users to modify post content, title, or publication status after creation.

Update the `PostResource` class in your `resources/post.py` file to add a PUT method:

```python
[label resources/post.py]
@blp.route("/api/posts/<string:post_id>")
class PostResource(MethodView):
    @blp.response(200, PostSchema)
    def get(self, post_id):
        """Get a specific blog post by ID"""
        post = Post.query.get_or_404(
            post_id, 
            description=f"Post with ID {post_id} not found"
        )
        return post
 [highlight]       
    @blp.arguments(PostSchema)
    @blp.response(200, PostSchema)
    def put(self, post_data, post_id):
        """Update a specific blog post"""
        post = Post.query.get_or_404(
            post_id,
            description=f"Post with ID {post_id} not found"
        )
        
        # Update post fields
        post.title = post_data["title"]
        post.content = post_data["content"]
        
        # Only update published status if provided
        if "published" in post_data:
            post.published = post_data["published"]
            
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))
            
        return post
[/highlight]
```

The `put` method in `PostResource` accepts validated post data along with the post ID from the URL. 

It first retrieves the corresponding post using `get_or_404`, ensuring a `404 Not Found` response if the post does not exist.

 Once the post is found, it updates the title and content based on the request payload, and if the published status is included, it is also updated.

 The changes are then committed to the database, with built-in error handling to rollback the transaction in case of an issue. 

Finally, the updated post is returned, serialized using `PostSchema`, ensuring consistency in the API response structure. 

Now, test the endpoint by updating one of the posts you created earlier. 

Be sure to replace the post ID with an actual ID from your database:

```command
curl -X PUT http://127.0.0.1:5000/api/posts/3257de2a-ddae-4070-90d4-1b04a367bb07 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Blog Post Title","content":"This content has been updated. Flask makes updating API resources easy!"}' \
  | python3 -m json.tool
```

You should receive a response with the updated post:

```json
[output]
{
    "content": "This content has been updated. Flask makes updating API resources easy!",
    "created_at": "2025-02-27T10:49:38.369401",
    "id": "3257de2a-ddae-4070-90d4-1b04a367bb07",
    "published": true,
    "title": "Updated Blog Post Title",
    "updated_at": "2025-02-27T11:38:49.893972"
}
```

Notice that while the `created_at` timestamp remains the same, the `updated_at` timestamp has been updated to reflect the modification time.

You can also try updating the publication status of a post:

```command
curl -X PUT http://127.0.0.1:5000/api/posts/3257de2a-ddae-4070-90d4-1b04a367bb07 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Blog Post Title","content":"This content has been updated. Flask makes updating API resources easy!","published":false}' \
  | python3 -m json.tool
```

The response should show the post with its publication status changed to `false`:

```json
[output]
{
    "content": "This content has been updated. Flask makes updating API resources easy!",
    "created_at": "2025-02-27T10:49:38.369401",
    "id": "3257de2a-ddae-4070-90d4-1b04a367bb07",
    "published": false,
    "title": "Updated Blog Post Title",
    "updated_at": "2025-02-27T11:39:22.845589"
}
```

To verify that validation is still working, try updating a post with an invalid title (too short):

```command
curl -X PUT http://127.0.0.1:5000/api/posts/3257de2a-ddae-4070-90d4-1b04a367bb07 \
  -H "Content-Type: application/json" \
  -d '{"title":"Hi","content":"This content is valid but the title is too short."}' \
  | python3 -m json.tool
```

You should receive a validation error:

```json
[output]
{
    "code": 422,
    "errors": {
        "json": {
            "title": [
                "Length must be between 3 and 100."
            ]
        }
    },
    "status": "Unprocessable Entity"
}
```

Your API documentation is also automatically updated to include the new PUT endpoint. You can check this by visiting the Swagger UI at `http://127.0.0.1:5000/api/docs/swagger`:


![Screenshot of the updated documentation with Swagger API](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3c25d060-1539-4a85-7e72-2a3337c98c00/lg2x =3024x1650)

With the implementation of the PUT endpoint, users can now update existing blog posts. 

In the next step, you'll complete the CRUD functionality by implementing the DELETE endpoint to allow users to remove blog posts from the database.

## Step 8 — Implementing the DELETE endpoint for removing blog posts

To complete the CRUD functionality of your blog API, the final step is to implement the DELETE endpoint for removing blog posts from the database. This will allow users to delete posts they no longer need permanently.

Update the `PostResource` class in your `resources/post.py` file to add a DELETE method:

```python
[label resources/post.py]
...
@blp.route("/api/posts/<string:post_id>")
class PostResource(MethodView):
    @blp.response(200, PostSchema)
    def get(self, post_id):
        ...        
    @blp.arguments(PostSchema)
    @blp.response(200, PostSchema)
    def put(self, post_data, post_id):
        """Update a specific blog post"""
        # ... existing code
[highlight] 
    @blp.response(204)
    def delete(self, post_id):
        """Delete a specific blog post"""
        post = Post.query.get_or_404(
            post_id,
            description=f"Post with ID {post_id} not found"
        )
        
        try:
            db.session.delete(post)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            abort(500, message=str(e))
            
        return ""
[/highlight]
```

This `delete()` method lets users permanently remove a blog post from the database. 

It takes the post ID from the URL and retrieves the corresponding post using `get_or_404`, ensuring that a `404 Not Found` response is returned if the post does not exist. 

Once the post is found, it is deleted from the database, and changes are committed. A rollback is triggered to maintain database integrity if an error occurs during the process.

The method then returns a `204 No Content` status code, signifying that the deletion was successful and that no further response body is needed. 



Now, test the DELETE endpoint. First, make sure we have a post to delete. You can create a new one specifically for testing:

```command
curl -X POST http://127.0.0.1:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Post to Delete","content":"This post will be deleted to test the DELETE endpoint."}' \
  | python3 -m json.tool
```

You should receive a response with the newly created post, including its ID:

```json
[output]
{
    "content": "This post will be deleted to test the DELETE endpoint.",
    "created_at": "2025-02-27T11:50:47.532310",
    "id": "84e1072a-c729-4dc1-b8c4-38f6a728caa2",
    "published": true,
    "title": "Post to Delete",
    "updated_at": "2025-02-27T11:50:47.532326"
}
```

Now, delete this post using its ID:

```command
curl -X DELETE http://127.0.0.1:5000/api/posts/5f9c2d1e-3b8a-47f6-95e4-109c87d65432 -v
```

The `-v` (verbose) flag will show the response headers, including the status code:

```text
[output]

*   Trying 127.0.0.1:5000...
* Connected to 127.0.0.1 (127.0.0.1) port 5000
> DELETE /api/posts/84e1072a-c729-4dc1-b8c4-38f6a728caa2 HTTP/1.1
> Host: 127.0.0.1:5000
> User-Agent: curl/8.7.1
> Accept: */*
> 
* Request completely sent off
[highlight]
< HTTP/1.1 204 NO CONTENT
[/highlight]
< Server: Werkzeug/3.1.3 Python/3.13.2
< Date: Thu, 27 Feb 2025 11:52:37 GMT
< Content-Type: application/json
< Connection: close
< 
* Closing connection
```

The HTTP status code 204 confirms that the post was successfully deleted. 

Your API documentation is automatically updated to include the new DELETE endpoint. You can check this by visiting the Swagger UI at `http://127.0.0.1:5000/api/docs/swagger`.

![Screenshot of the Delete endpoingin the documentation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/28a933d9-59d4-4b44-db91-e61ba75bac00/md2x =3248x1994)


## Final thoughts

Congratulations! You've built a fully functional RESTful API for a blog using Flask, supporting all CRUD operations: creating, retrieving, updating, and deleting posts. 

To take your Flask API skills further, explore the official documentation for [Flask](https://flask.palletsprojects.com/), [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/), and [Flask-Smorest](https://flask-smorest.readthedocs.io/).

These resources offer insights and best practices to help you build more advanced and scalable applications.
