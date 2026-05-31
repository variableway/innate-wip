# Source: https://betterstack.com/community/guides/scaling-nodejs/understanding-abortcontroller/
# Original language: javascript
# Normalized: js
# Block index: 5

[label fetch-data.js]
const url = "https://jsonplaceholder.typicode.com/todos/1";

const controller = new AbortController();
const signal = controller.signal;

const fetchTodo = async () => {
  try {
    console.log("Fetching data...");
    const response = await fetch(url, { signal });
    const todo = await response.json();
    console.log("Todo:", todo);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Operation aborted");
    } else {
      console.error("Error:", error);
    }
  }
};


 // Set a timeout to abort the fetch after 5 seconds
setTimeout(() => controller.abort(), 5000);

fetchTodo();