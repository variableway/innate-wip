# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-typescript-swc/
# Original language: typescript
# Normalized: ts
# Block index: 15

[label src/index.ts]
async function main() {
  try {
[highlight]
    console.log('Starting user creation process...');
[/highlight]
    const user = await userService.createUser({
      name: 'Alice Johnson',
      email: 'alice@example.com'
    });

    console.log('User created successfully:', user);
    // ... rest stays the same
  }
}