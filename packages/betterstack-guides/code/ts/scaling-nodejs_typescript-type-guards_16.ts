# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-type-guards/
# Original language: typescript
# Normalized: ts
# Block index: 16

[label src/nullable-guards.ts]
interface Config {
  apiKey?: string;
  timeout?: number;
  retries?: number;
}

function initializeApi(config: Config | null): void {
  // Guard against null config
  if (!config) {
    console.log('Using default configuration');
    return;
  }
  
  // Guard against missing apiKey
  if (!config.apiKey) {
    throw new Error('API key is required');
  }
  
  // TypeScript knows these are defined here
  console.log(`Initializing with key: ${config.apiKey}`);
  console.log(`Timeout: ${config.timeout ?? 5000}ms`);
  console.log(`Retries: ${config.retries ?? 3}`);
}

// Test with different configs
initializeApi(null);

initializeApi({
  apiKey: 'abc123',
  timeout: 3000
});

try {
  initializeApi({});
} catch (error) {
  console.log('Error:', (error as Error).message);
}