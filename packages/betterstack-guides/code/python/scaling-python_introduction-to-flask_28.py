# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-flask/
# Original language: python
# Normalized: python
# Block index: 28

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