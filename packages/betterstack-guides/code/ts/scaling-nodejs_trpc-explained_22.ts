# Source: https://betterstack.com/community/guides/scaling-nodejs/trpc-explained/
# Original language: typescript
# Normalized: ts
# Block index: 22

[label src/client.ts]
import { createTRPCClient } from '@trpc/client';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from './trpc/router.js';

// Create a tRPC client
const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

async function main() {
[highlight]
    try {
    // Get all users
    console.log('Getting all users:');
    const allUsers = await client.getUsers.query();
    console.log('Users:', allUsers);
    
    // Get a specific user
    console.log('\nGetting user with ID 1:');
    const user1 = await client.getUserById.query({ id: '1' });
    console.log('User:', user1);
    
    // Try creating a new user
    console.log('\nCreating a new user:');
    const newUser = await client.createUser.mutate({
      name: 'Charlie',
      email: 'charlie@example.com',
    });
    console.log('User created:', newUser);
    
  } catch (error) {
    console.error('Error occurred:');
    console.error(error);
  }
[/highlight]
}

main();