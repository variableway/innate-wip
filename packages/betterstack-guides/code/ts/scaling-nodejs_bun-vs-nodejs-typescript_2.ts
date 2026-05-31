# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-nodejs-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 2

// Bun supports modern TypeScript seamlessly
enum ProjectPhase {
  Planning = 'planning',
  Development = 'development',
  Testing = 'testing'
}

namespace APITypes {
  export interface UserRequest {
    id: string;
    preferences: UserPreferences;
  }
  
  export class RequestValidator {
    validate(request: UserRequest): boolean {
      return request.id.length > 0;
    }
  }
}

// Decorators work with proper tsconfig setup
@controller('/api')
class UserController {
  constructor(
    private readonly service: UserService,
    public readonly version: number = 1
  ) {}
}