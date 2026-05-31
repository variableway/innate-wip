# Source: https://betterstack.com/community/guides/scaling-nodejs/trpc-explained/
# Original language: typescript
# Normalized: ts
# Block index: 13

[label src/client.ts]
import { createTRPCClient } from '@trpc/client';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from './index.js';

// Create a tRPC client (using the newer non-deprecated approach)
const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

async function main() {
  try {
    // Create a new user
    console.log('Creating a new user:');
    const newUser = await client.createUser.mutate({
      name: 'Charlie',
      email: 'charlie@example.com',
    });
    console.log('User created:', newUser);
    
    // Try creating a user with the same email (should fail)
    console.log('\nTrying to create a user with the same email:');
    try {
      await client.createUser.mutate({
        name: 'Charlie2',
        email: 'charlie@example.com', // Same email as before
      });
    } catch (error: any) { // Type the error as any to access the message property
      console.error('Error:', error.message);
    }
    
    // Try with invalid data (should fail validation)
    console.log('\nTrying with invalid data:');
    try {
      await client.createUser.mutate({
        name: 'D', // Too short
        email: 'not-an-email',
      });
    } catch (error: any) { // Type the error as any to access the message property
      console.error('Validation error:', error.message);
    }
  } catch (error: any) { // Type the error as any to access the message property
    console.error('Unexpected error:', error.message);
  }
}

main();