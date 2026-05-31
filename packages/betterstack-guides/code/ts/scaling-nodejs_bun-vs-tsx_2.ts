# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-tsx/
# Original language: typescript
# Normalized: ts
# Block index: 2

// Bun supports modern TypeScript out of the box
enum ProjectStatus {
  Planning = 'planning',
  InProgress = 'in-progress',
  Complete = 'complete'
}

namespace DatabaseConfig {
  export interface Connection {
    host: string;
    port: number;
  }
  
  export class Client {
    constructor(private config: Connection) {}
  }
}

// Experimental decorators work with tsconfig
@injectable()
class UserService {
  constructor(
    private readonly apiKey: string,
    public readonly version: number = 1
  ) {}
}