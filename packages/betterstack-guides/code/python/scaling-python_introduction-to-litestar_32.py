# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-litestar/
# Original language: python
# Normalized: python
# Block index: 32

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