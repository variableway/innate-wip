# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: prisma
# Normalized: js
# Block index: 8

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
}