# Source: https://betterstack.com/community/guides/scaling-python/index/
# Original language: python
# Normalized: python
# Block index: 9

[label timeouts.py]
import functools
from anyio import move_on_after
from typing import Optional, TypeVar, Callable, Any

T = TypeVar('T')

def with_timeout(timeout: float):
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            with move_on_after(timeout) as cancel_scope:
                return await func(*args, **kwargs)
                
            if cancel_scope.cancelled_caught:
                raise TimeoutError(f"Function {func.__name__} timed out after {timeout} seconds")
                
        return wrapper
    return decorator