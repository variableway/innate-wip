# Source: https://betterstack.com/community/guides/scaling-nodejs/trpc-explained/
# Original language: typescript
# Normalized: ts
# Block index: 17

[label src/index.ts]
import express from 'express';
import cors from 'cors';
[highlight]
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc/router.js';
[/highlight]

// remove all the code until the create express app line
// Create Express app
const app = express();

// Middleware
app.use(cors());
[highlight]
app.use(express.json());
// Add a test route to make sure Express is working
app.get('/', (req, res) => {
  res.send('Server is running! tRPC endpoint available at /trpc');
});
[/highlight]

// Add tRPC middleware to Express
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
[highlight]
    onError: ({ error }) => {
      console.error('tRPC error:', error);
    },
[/highlight]
  })
);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
[highlight]
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`tRPC API endpoint available at http://localhost:${PORT}/trpc`);
[/highlight]
});