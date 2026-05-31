# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-litestar/
# Original language: python
# Normalized: python
# Block index: 20

[label src/controllers/post.py]
from litestar import Controller, post
from litestar.params import Dependency
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.post import Post
from src.schemas.post import PostCreate, PostResponse


class PostController(Controller):
    """Controller for blog post operations."""

    path = "/api/posts"
    tags = ["posts"]

    @post()
    async def create_post(
        self,
        data: PostCreate,
        db_session: AsyncSession = Dependency(),
    ) -> PostResponse:
        """Create a new blog post."""
        # Create a new post instance
        new_post = Post(
            title=data.title,
            content=data.content,
            published=data.published,
        )

        # Add to database and commit
        db_session.add(new_post)
        await db_session.commit()
        await db_session.refresh(new_post)

        # Return the created post
        return PostResponse(
            id=new_post.id,
            title=new_post.title,
            content=new_post.content,
            published=new_post.published,
            created_at=new_post.created_at,
            updated_at=new_post.updated_at,
        )