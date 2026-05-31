# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-explained/
# Original language: typescript
# Normalized: ts
# Block index: 7

[label app.ts]
...
const createGreeting = (name: string): Greeting => {
  return {
    message: `Hello, ${name}!`,
    timestamp: new Date(),
  };
};

[highlight]
const greeting = createGreeting("TSX user");
[/highlight]
console.log(greeting);