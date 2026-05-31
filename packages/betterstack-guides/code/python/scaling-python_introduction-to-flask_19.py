# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-flask/
# Original language: python
# Normalized: python
# Block index: 19

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