# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-flask/
# Original language: python
# Normalized: python
# Block index: 22

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