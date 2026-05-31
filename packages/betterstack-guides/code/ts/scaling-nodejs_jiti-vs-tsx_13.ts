# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-tsx/
# Original language: typescript
# Normalized: ts
# Block index: 13

// TSX supports modern TypeScript features via esbuild
class UserService {
  @injectable()
  async getUser(id: string): Promise<User> {
    return await this.repository.findById(id);
  }
}