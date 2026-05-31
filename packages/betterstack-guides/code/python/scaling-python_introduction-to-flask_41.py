# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-flask/
# Original language: python
# Normalized: python
# Block index: 41

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