# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-explained/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label app.ts]
interface Greeting {
  message: string;
  timestamp: Date;
}

const createGreeting = (name: string): Greeting => {
  return {
    message: `Hello, ${name}!`,
    timestamp: new Date()
  };
};

const greeting = createGreeting('TypeScript Developer');
console.log(greeting);