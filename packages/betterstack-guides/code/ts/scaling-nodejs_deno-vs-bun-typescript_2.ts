# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-bun-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 2

// app.ts - Advanced TypeScript features
import { config } from "@/config";  // Path mapping support

@Injectable()
class UserService {
  async getUser(id: number): Promise<User> {
    return await this.db.user.findById(id);
  }
}