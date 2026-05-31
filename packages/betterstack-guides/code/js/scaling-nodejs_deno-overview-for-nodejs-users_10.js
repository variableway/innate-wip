# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-overview-for-nodejs-users/
# Original language: javascript
# Normalized: js
# Block index: 10

[label app.js]
async function fetchTodo(id) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${id}`
  );
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return await response.json();
}

fetchTodo(1).then((todo) => {
  console.log("Fetched To-Do Item:", todo);
});