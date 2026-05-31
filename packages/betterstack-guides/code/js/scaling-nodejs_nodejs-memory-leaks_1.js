# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-memory-leaks/
# Original language: javascript
# Normalized: js
# Block index: 1

const user = {
  name: "Stanley",
  email: "user1@mail.com",
};

function printUser() {
  console.log(`name is ${name}`);
}

const interests = ["bikes", "motorcycles"];