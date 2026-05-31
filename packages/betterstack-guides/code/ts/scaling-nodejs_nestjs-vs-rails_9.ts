# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: typescript
# Normalized: ts
# Block index: 9

async findPostsWithAuthors() {
  return this.prisma.post.findMany({
    where: { published: true },
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  });
}