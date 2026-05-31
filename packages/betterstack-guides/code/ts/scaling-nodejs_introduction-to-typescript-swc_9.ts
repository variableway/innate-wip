# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-typescript-swc/
# Original language: typescript
# Normalized: ts
# Block index: 9

[label src/index.ts]
async function main() {
  try {
    const user = await userService.createUser({
      name: 'Alice Johnson',
      email: 'alice@example.com',
[highlight]
      invalidProperty: true // This property doesn't exist in Omit<User, 'id' | 'createdAt'>
[/highlight]
    });

    console.log('User created successfully:', user);

    const allUsers = await userService.getAllUsers();
    console.log('All users:', allUsers);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}