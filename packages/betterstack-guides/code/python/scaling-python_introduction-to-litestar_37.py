# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-litestar/
# Original language: python
# Normalized: python
# Block index: 37

[label src/controllers/post.py]
from typing import List, Optional
[highlight]
# Add the put import
from litestar import Controller, post, get, put
[/highlight]
from litestar.params import Dependency
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.post import Post

[highlight]
# Add the PostUpdate import
from src.schemas.post import PostCreate, PostResponse, PostUpdate
[/highlight]


class PostController(Controller):
    """Controller for blog post operations."""
    
    # Existing code...
    
[highlight]
    @put("/{post_id:str}")
    async def update_post(
        self,
        post_id: str,
        data: PostUpdate,
        db_session: AsyncSession = Dependency(),
    ) -> PostResponse:
        """Update a specific blog post."""
        # Query the post
        result = await db_session.execute(
            select(Post).where(Post.id == post_id)
        )
        post = result.scalars().first()
        
        # Raise 404 if not found
        if not post:
            from litestar.exceptions import NotFoundException
            raise NotFoundException(f"Post with ID {post_id} not found")
        
        # Update post fields if provided
        if data.title is not None:
            post.title = data.title
        if data.content is not None:
            post.content = data.content
        if data.published is not None:
            post.published = data.published
        
        # Commit changes
        await db_session.commit()
        await db_session.refresh(post)
        
        # Return updated post
        return PostResponse(
            id=post.id,
            title=post.title,
            content=post.content,
            published=post.published,
            created_at=post.created_at,
            updated_at=post.updated_at,
        )
[/highlight]