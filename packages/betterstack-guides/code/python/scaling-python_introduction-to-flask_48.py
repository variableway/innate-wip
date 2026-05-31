# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-flask/
# Original language: python
# Normalized: python
# Block index: 48

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