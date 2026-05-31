# Source: https://betterstack.com/community/guides/scaling-python/index/
# Original language: python
# Normalized: python
# Block index: 3

[label main.py]
import anyio

async def hello_world():
    print("Hello, world!")
    await anyio.sleep(1)
    print("Goodbye, world!")

async def main():
    await hello_world()

if __name__ == "__main__":
    anyio.run(main)