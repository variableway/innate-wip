# Source: https://betterstack.com/community/guides/scaling-nodejs/understanding-abortcontroller/
# Original language: javascript
# Normalized: js
# Block index: 12

[label use-multiple-signals.js]
import readline from "readline";

const url = "https://jsonplaceholder.typicode.com/todos/1";

[highlight]
const timeoutMS = 5000;
const timeoutSignal = AbortSignal.timeout(timeoutMS);
const userAbortController = new AbortController();
[/highlight]

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const fetchTodo = async () => {
[highlight]
  const combinedSignal = AbortSignal.any([
    timeoutSignal,
    userAbortController.signal,
  ]);
[/highlight]
  try {
    console.log("Fetching data...");
[highlight]
    const response = await fetch(url, { signal: combinedSignal });
[/highlight]
    const todo = await response.json();
    console.log("Todo:", todo);
  } catch (error) {
[highlight]
    if (timeoutSignal.aborted) {
      console.log(`Operation timed out after ${timeoutMS} ms`);
    } else if (userAbortController.signal.aborted) {
[/highlight]
      console.log("Operation aborted by user");
    } else {
      console.error("Error:", error);
    }
  } finally {
    userAbortController.abort(); // Clean up
    rl.close();
  }
};

// Listen for user input to abort the operation
rl.question("Press Enter to abort the fetch operation:\n", () => {
  console.log("User initiated abort");
[highlight]
  userAbortController.abort();
[/highlight]
});

fetchTodo();