# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-strict-option/
# Original language: typescript
# Normalized: ts
# Block index: 17

[label src/nullable-handling.ts]
interface User {
  name: string;
  email: string;
  phone?: string;
}

function formatUser(user: User | null): string {
  if (!user) {
    return "No user provided";
  }

  let result = `${user.name} (${user.email})`;

  if (user.phone) {
    result += ` - ${user.phone}`;
  }

  return result;
}

function getUserEmail(user: User | null | undefined): string {
  return user?.email ?? "no-email@example.com";
}

function processUsers(users: User[] | null): void {
  if (!users) {
    console.log("No users to process");
    return;
  }

  for (const user of users) {
    console.log(formatUser(user));
  }
}

const validUser: User = {
  name: "Alice",
  email: "alice@example.com",
  phone: "555-0100"
};

const userWithoutPhone: User = {
  name: "Bob",
  email: "bob@example.com"
};

console.log(formatUser(validUser));
console.log(formatUser(userWithoutPhone));
console.log(formatUser(null));
console.log(getUserEmail(validUser));
console.log(getUserEmail(null));
processUsers([validUser, userWithoutPhone]);
processUsers(null);