# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-litestar/
# Original language: python
# Normalized: python
# Block index: 19

[label src/schemas/post.py]
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class PostBase:
    """Base schema with common post attributes."""
    title: str
    content: str
    published: bool = True


@dataclass
class PostCreate(PostBase):
    """Schema for creating a new post."""
    pass


@dataclass
class PostUpdate:
    """Schema for updating an existing post."""
    title: Optional[str] = None
    content: Optional[str] = None
    published: Optional[bool] = None


@dataclass
class PostResponse:
    """Schema for post responses."""

    id: str
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    published: bool = True