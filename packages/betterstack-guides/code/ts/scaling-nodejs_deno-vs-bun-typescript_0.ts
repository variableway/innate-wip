# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-bun-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 0

// server.ts - Direct TypeScript execution with type checking
interface APIResponse<T> {
  data: T;
  status: 'success' | 'error';
}

const createResponse = <T>(data: T): APIResponse<T> => ({
  data,
  status: 'success'
});

serve((req) => {
  const response = createResponse({ message: "Hello TypeScript!" });
  return new Response(JSON.stringify(response));
});