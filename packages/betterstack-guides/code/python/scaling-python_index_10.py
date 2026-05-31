# Source: https://betterstack.com/community/guides/scaling-python/index/
# Original language: python
# Normalized: python
# Block index: 10

[label main.py]
import anyio
from timeouts import with_timeout

@with_timeout(2.0)
async def slow_operation():
    print("Slow operation started")
    await anyio.sleep(3)  # This takes longer than the timeout
    print("Slow operation completed")  # This won't print because of the timeout
    return "Result"

@with_timeout(2.0)
async def fast_operation():
    print("Fast operation started")
    await anyio.sleep(1)  # This finishes within the timeout
    print("Fast operation completed")
    return "Success"

async def main():
    try:
        result = await fast_operation()
        print(f"Fast operation result: {result}")
    except TimeoutError as e:
        print(f"Error in fast operation: {e}")
        
    try:
        result = await slow_operation()
        print(f"Slow operation result: {result}")
    except TimeoutError as e:
        print(f"Error in slow operation: {e}")
        
    print("Main function completed")

if __name__ == "__main__":
    anyio.run(main)