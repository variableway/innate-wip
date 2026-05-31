# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions-casting/
# Original language: typescript
# Normalized: ts
# Block index: 11

[label src/const.ts]
// Without as const - general types
const config1 = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  methods: ["GET", "POST"]
};

// With as const - literal types
const config2 = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  methods: ["GET", "POST"]
} as const;

// TypeScript infers these types:
// config1: { apiUrl: string, timeout: number, methods: string[] }
// config2: { readonly apiUrl: "https://api.example.com", readonly timeout: 5000, readonly methods: readonly ["GET", "POST"] }

function makeRequest(method: "GET" | "POST") {
  console.log(`Making ${method} request`);
}

// This fails - string not assignable to "GET" | "POST"
// makeRequest(config1.methods[0]);

// This works - tuple type provides literal types
makeRequest(config2.methods[0]);

console.log("Config 1 URL:", config1.apiUrl);
console.log("Config 2 URL:", config2.apiUrl);