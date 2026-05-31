# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-vs-native-nodejs-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 2

// TSX supports everything you throw at it
enum Status {
  Pending = 'pending',
  Complete = 'complete'
}

namespace UserService {
  export interface Config {
    apiUrl: string;
  }
  
  export class Client {
    constructor(private config: Config) {}
  }
}

class User {
  constructor(
    private name: string,  // Parameter properties work
    public readonly id: number
  ) {}
}