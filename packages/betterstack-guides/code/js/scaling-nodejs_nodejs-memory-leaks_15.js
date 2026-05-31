# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-memory-leaks/
# Original language: javascript
# Normalized: js
# Block index: 15

function increment() {
  const data = [];
  let counter = 0;

  return function inner() {
  ...
  };
}
[highlight]
const timerId = setInterval(increment(), 1000);

// Clear the timer after 10 seconds
setTimeout(() => {
  clearInterval(timerId);
}, 10000);
[/highlight]