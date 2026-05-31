# Source: https://betterstack.com/community/guides/scaling-python/index/
# Original language: python
# Normalized: python
# Block index: 7

[label main.py]
import anyio
import time

async def failing_task():
    print("Starting failing task")
    await anyio.sleep(1)
    raise ValueError("Simulated error")

async def long_task():
    try:
        print("Starting long task")
        for i in range(5):
            print(f"Long task: iteration {i}")
            await anyio.sleep(1)
        print("Long task completed")
    except anyio.get_cancelled_exc_class():
        print("Long task was cancelled")
        raise

async def main():
    try:
        async with anyio.create_task_group() as tg:
            tg.start_soon(failing_task)
            tg.start_soon(long_task)
            
        print("This line won't be reached")
    except ValueError as e:
        print(f"Caught error: {e}")
        
    print("Main function continuing after error")

if __name__ == "__main__":
    anyio.run(main)