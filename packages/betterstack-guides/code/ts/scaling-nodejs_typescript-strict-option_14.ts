# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-strict-option/
# Original language: typescript
# Normalized: ts
# Block index: 14

[label src/strict-checks.ts]
class UserProfile {
  name: string;
  email: string;
  age?: number;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  getDisplayName(): string {
    return this.name.toUpperCase();
  }

  getAge(): number {
    return this.age;
  }
}

function greet(name: string | null): string {
  if (name) {
    return `Hello, ${name}!`;
  }
  return "Hello, stranger!";
}

const profile = new UserProfile("Alice", "alice@example.com");
console.log(profile.getDisplayName());
console.log(`Age: ${profile.getAge()}`);
console.log(greet(null));