# Getting Started with AnyIO in Python

[AnyIO](https://anyio.readthedocs.io/) lets you write asynchronous code in Python that works with different async backends. 

It gives you a single interface to work with asyncio, trio, and other async libraries. This means you can write your code once and run it anywhere.

This guide will show you how to use AnyIO effectively in your Python projects.

[ad-logs]
\
## Prerequisites

Ensure you have installed Python 3.7 or a newer version on your computer. You should already know basic Python and have some experience with asynchronous programming.

## Step 1 — Getting started with AnyIO

Start by creating a new folder for your project and setting up a Python virtual environment:

```command
mkdir anyio-tutorial && cd anyio-tutorial
```

```command
python3 -m venv venv
```

Activate your virtual environment:

```command
source venv/bin/activate
```

Install AnyIO:

```command
pip install anyio
```

Let's create a simple example. Make a file called `main.py` and add this code:

```python
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
```

This example highlights the basic structure of AnyIO programs: define functions with `async def`, use `await` to pause operations, and start the program with `anyio.run()`. By default, AnyIO uses asyncio, but you can easily switch to trio without changing your code.


Run it with:

```command
python main.py
```

You'll see:

```text
[output]
Hello, world!
Goodbye, world!
```
Now that you've seen how to set up a basic AnyIO program and understand its structure, let's move on to the next step. 


## Step 2 — Working with tasks and concurrency

Asynchronous programming allows you to run multiple tasks concurrently, improving performance by handling operations simultaneously, especially for I/O-bound tasks like file reading, network requests, or database queries.

In this step, you'll learn to use AnyIO’s task groups to run multiple tasks simultaneously. Task groups let you manage and execute tasks concurrently, ensuring all tasks finish before moving forward.

Let's see how to implement this using AnyIO:

```python
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
```

The `create_task_group()` creates a group of tasks that run together. You add tasks to the group with `start_soon()`. When you exit the task group, it waits for all tasks to finish.

Run this script:

```command
python main.py
```

You'll see something like:

```text
Task A starting
Task B starting
Task C starting
Task B completed after 1 seconds
Task A completed after 2 seconds
Task C completed after 3 seconds
All tasks completed in 3.00 seconds
```

Notice how the tasks run at the same time, not one after another. If they ran one after another, it would take 6 seconds (2+1+3). But running them together takes only 3 seconds - just the time needed for the longest task.

![Gantt chart showing three tasks executing concurrently over 3 seconds instead of 6 seconds sequentially](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1bbe1083-461d-4a5c-484e-08a8c774aa00/md1x =2740x420)

This shows the power of async programming: you can do multiple things at once without blocking.

## Step 3 — Error handling and cancellation

In real-world async programs, error handling and task cancellation are essential for maintaining stability and ensuring resources aren't wasted when something goes wrong. AnyIO provides built-in tools to handle errors and cancel tasks gracefully. In this step, you'll learn how to manage errors and cancellations in an async program using AnyIO.

We’ll walk through a new example where a task raises an error, and the other tasks in the group are cancelled as a result. This example demonstrates how AnyIO handles errors and ensures that tasks are properly cancelled when one fails.

Here’s the new example:

```python
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
```

In this example, `failing_task()` raises an error after one second. When this happens, the entire task group gets cancelled, including `long_task()`. The `get_cancelled_exc_class()` function gives you the right cancellation exception class.

Run the script:

```command
python main.py
```

You'll see output like:

```text
[output]
Starting failing task
Starting long task
Long task: iteration 0
Long task: iteration 1
Long task was cancelled
  + Exception Group Traceback (most recent call last):
...
    | ValueError: Simulated error
```

When `failing_task()` raises an error, `long_task()` gets cancelled, and the error goes up to the main function where it's caught. This shows AnyIO's structured approach: when one task fails, all related tasks get cancelled to prevent wasting resources.


## Step 4 — Working with timeouts

In asynchronous applications, especially those involving network operations or external services, operations can sometimes hang indefinitely. Timeouts are essential to prevent your application from freezing when something goes wrong. AnyIO provides elegant solutions for implementing timeouts in your async code.

In this step, you'll learn how to use AnyIO's timeout mechanisms to make your applications more resilient. You'll create a reusable timeout decorator that can be applied to any async function.

```python
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
```

This decorator uses AnyIO's `move_on_after()` context manager to set a timeout for any function it wraps. If the function doesn't complete within the specified timeout, the operation is cancelled and a `TimeoutError` is raised.

Now, let's clear the existing code in `main.py` and replace it with the following to test our timeout decorator:

```python
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
```

In this example, we've created two functions with different execution times:
- `fast_operation()` completes within the 2-second timeout
- `slow_operation()` takes 3 seconds and exceeds the timeout

When we run this code, the timeout decorator will allow `fast_operation()` to complete normally, but will cancel `slow_operation()` after 2 seconds and raise a `TimeoutError`.

Run the script:

```command
python main.py
```

You'll see output like:

```text
[output]
Fast operation started
Fast operation completed
Fast operation result: Success
Slow operation started
Error in slow operation: Function slow_operation timed out after 2.0 seconds
Main function completed
```

Notice that `slow_operation()` starts but never completes its execution. The timeout decorator cancels it after 2 seconds and raises a `TimeoutError`, which we catch in the main function.

![Sequence diagram showing a fast operation completing within timeout and a slow operation being cancelled](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b400df86-666e-44c3-b5ef-022794762b00/md2x =1336x1176)

Timeouts are particularly valuable in real-world applications where you interact with external services that might be slow or unresponsive. Implementing timeouts prevents your application from hanging indefinitely when something goes wrong, ensuring a better user experience and more efficient resource usage.


## Final thoughts

In this guide, you've learned how to use AnyIO for Python async programming, covering key concepts like task groups, error handling, and timeouts.

The main advantage of AnyIO is its ability to abstract the differences between asyncio and trio, allowing you to focus on your application logic rather than the complexities of the async frameworks. To dive deeper into AnyIO, check out the official [AnyIO documentation](https://anyio.dev/).

Happy coding!