# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-bun-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 6

// advanced.ts - Path mapping and decorators
import { config } from "config";  // Resolved via tsconfig paths
import "reflect-metadata";

function Injectable(target: Function) {
  const params = Reflect.getMetadata("design:paramtypes", target);
  console.log("Dependencies:", params);
}

@Injectable
class UserService {
  constructor(private config: typeof config) {}
}