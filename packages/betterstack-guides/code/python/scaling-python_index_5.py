# Source: https://betterstack.com/community/guides/scaling-python/index/
# Original language: python
# Normalized: python
# Block index: 5

[label main.py]
import anyio
import time

async def task(name, delay):
    print(f"Task {name} starting")
    await anyio.sleep(delay)
    print(f"Task {name} completed after {delay} seconds")
    return name, delay

async def main():
    start_time = time.time()
    
    async with anyio.create_task_group() as tg:
        # Start multiple tasks that run at the same time
        tg.start_soon(task, "A", 2)
        tg.start_soon(task, "B", 1)
        tg.start_soon(task, "C", 3)
    
    end_time = time.time()
    print(f"All tasks completed in {end_time - start_time:.2f} seconds")

if __name__ == "__main__":
    anyio.run(main)