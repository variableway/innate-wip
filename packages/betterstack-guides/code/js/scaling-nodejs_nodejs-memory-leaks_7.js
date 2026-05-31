# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-memory-leaks/
# Original language: javascript
# Normalized: js
# Block index: 7

function increment() {
  const data = [];
  let counter = 0;

  return function inner() {
    data.push(counter++); // data array is now part of the callback's scope
    console.log(counter);
    console.log(data);
  };
}

setInterval(increment(), 1000);