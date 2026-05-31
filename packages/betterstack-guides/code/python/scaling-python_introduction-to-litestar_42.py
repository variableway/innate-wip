# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-litestar/
# Original language: python
# Normalized: python
# Block index: 42

[label src/controllers/post.py]
from typing import List, Optional
[highlight]
# Add the delete import
from litestar import Controller, post, get, put, delete
[/highlight]
from litestar.params import Dependency
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.post import Post
from src.schemas.post import PostCreate, PostResponse, PostUpdate


class PostController(Controller):
    """Controller for blog post operations."""
    
    # Existing code...
    
    @delete("/{post_id:str}")
    async def delete_post(
        self,
        post_id: str,
        db_session: AsyncSession = Dependency(),
    ) -> None:
        """Delete a specific blog post."""
        # Query the post
        result = await db_session.execute(
            select(Post).where(Post.id == post_id)
        )
        post = result.scalars().first()
        
        # Raise 404 if not found
        if not post:
            from litestar.exceptions import NotFoundException
            raise NotFoundException(f"Post with ID {post_id} not found")
        
        # Delete the post and commit
        await db_session.delete(post)
        await db_session.commit()