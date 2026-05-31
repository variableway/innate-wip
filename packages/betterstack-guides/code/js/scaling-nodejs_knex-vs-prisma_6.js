# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: prisma
# Normalized: js
# Block index: 6

// prisma/schema.prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id       Int     @id @default(autoincrement())
  title    String
  author   User    @relation(fields: [authorId], references: [id])
  authorId Int     @map("author_id")
}