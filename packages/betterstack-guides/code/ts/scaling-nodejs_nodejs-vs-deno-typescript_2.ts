# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-vs-deno-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 2

// Deno supports all TypeScript features without flags
enum Status {
  Active,
  Inactive,
}
namespace UserModule {
  export class Service {
    constructor(private readonly apiKey: string) {}
  }
}

@decorator
class Component {
  // Full TypeScript feature support
}