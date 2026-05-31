# Source: https://betterstack.com/community/guides/scaling-nodejs/trpc-explained/
# Original language: typescript
# Normalized: ts
# Block index: 18

[label src/client.ts]
import { createTRPCClient } from '@trpc/client';
import { httpBatchLink } from '@trpc/client';
[highlight]
import type { AppRouter } from './trpc/router.js';
[/highlight]

// Create a tRPC client
const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

async function main() {
...
}

main();