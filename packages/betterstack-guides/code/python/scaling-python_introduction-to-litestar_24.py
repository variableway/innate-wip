# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-litestar/
# Original language: python
# Normalized: python
# Block index: 24

[label src/controllers/post.py]
[highlight]
from typing import List, Optional
from litestar import Controller, post, get
[/highlight]
from litestar.params import Dependency
[highlight]
from sqlalchemy import select
[/highlight]
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
        # Existing code...
        return PostResponse(
         ...
        )
        
        
[highlight]
    @get()
    async def get_posts(
        self,
        db_session: AsyncSession = Dependency(),
        published: Optional[bool] = None,
    ) -> List[PostResponse]:
        """Get a list of blog posts with optional filtering."""
        # Build the query
        query = select(Post)
        
        # Apply filters if specified
        if published is not None:
            query = query.where(Post.published == published)
            
        # Execute query and get results
        result = await db_session.execute(query.order_by(Post.created_at.desc()))
        posts = result.scalars().all()
        
        # Return serialized posts
        return [
            PostResponse(
                id=post.id,
                title=post.title,
                content=post.content,
                published=post.published,
                created_at=post.created_at,
                updated_at=post.updated_at,
            ) 
            for post in posts
        ]
[/highlight]