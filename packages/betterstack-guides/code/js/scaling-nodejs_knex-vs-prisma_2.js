# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: prisma
# Normalized: js
# Block index: 2

// prisma/schema.prisma (simplified)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

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
  authorId Int
}