# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-flask/
# Original language: python
# Normalized: python
# Block index: 36

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