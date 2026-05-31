# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-flask/
# Original language: python
# Normalized: python
# Block index: 13

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