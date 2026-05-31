# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-tsx/
# Original language: typescript
# Normalized: ts
# Block index: 7

// Deno handles all TypeScript features natively
declare global {
  namespace Deno {
    interface Env {
      API_KEY: string;
    }
  }
}

export module UserOperations {
  export const createUser = (name: string) => ({
    name,
    id: crypto.randomUUID(),
  });
}

// Full decorator support with metadata
@Reflect.metadata("role", "controller")
class ApiController {
  // Complete TypeScript feature set available
}