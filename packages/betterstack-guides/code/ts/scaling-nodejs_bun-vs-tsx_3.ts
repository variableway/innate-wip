# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-tsx/
# Original language: typescript
# Normalized: ts
# Block index: 3

// TSX handles complex TypeScript patterns excellently
import type { UserPreferences } from './types.js';

interface APIResponse<T> {
  data: T;
  status: 'success' | 'error';
  timestamp: number;
}

class DataProcessor<T extends Record<string, any>> {
  process(input: T): APIResponse<T> {
    return {
      data: input,
      status: 'success',
      timestamp: Date.now()
    };
  }
}