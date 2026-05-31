# Source: https://betterstack.com/community/guides/scaling-nodejs/tanstack-for-beginners/
# Original language: javascript
# Normalized: js
# Block index: 2

[label src/queryClient.js]
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});