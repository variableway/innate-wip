# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-laravel/
# Original language: typescript
# Normalized: ts
# Block index: 10

// schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now())
}

// users.service.ts
async findUserWithPosts(email: string) {
  return this.prisma.user.findUnique({ 
    where: { email },
    include: { posts: true }
  });
}