# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-tsx/
# Original language: typescript
# Normalized: ts
# Block index: 6

// TSX supports modern TypeScript features
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
  async processData<T>(data: T[]): Promise<T[]> {
    return data.filter(Boolean);
  }
}