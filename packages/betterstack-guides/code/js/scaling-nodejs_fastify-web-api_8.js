# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/
# Original language: prisma
# Normalized: js
# Block index: 8

[label prisma/schema.prisma]
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
[highlight]
  provider = "sqlite"
[/highlight]
  url      = env("DATABASE_URL")
}

[highlight]
model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  published Boolean  @default(true)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("posts")
}
[/highlight]