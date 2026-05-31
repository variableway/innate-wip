# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-flask/
# Original language: python
# Normalized: python
# Block index: 23

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