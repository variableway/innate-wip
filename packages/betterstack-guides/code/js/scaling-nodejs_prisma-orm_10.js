# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: prisma
# Normalized: js
# Block index: 10

[label schema.prisma]
generator client {
 provider = "prisma-client-js"
}

datasource db {
 provider = "postgresql"
 url      = env("DATABASE_URL")
}

[highlight]
model User {
 id        Int       @id @default(autoincrement())
 email     String    @unique
 name      String?
 password  String
 createdAt DateTime  @default(now()) @map("created_at")
 updatedAt DateTime  @updatedAt @map("updated_at")
 posts     Post[]
 comments  Comment[]

 @@map("users")
}

model Post {
 id        Int       @id @default(autoincrement())
 title     String
 content   String?
 published Boolean   @default(false)
 createdAt DateTime  @default(now()) @map("created_at")
 updatedAt DateTime  @updatedAt @map("updated_at")
 authorId  Int       @map("author_id")
 author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
 comments  Comment[]

 @@map("posts")
}

model Comment {
 id        Int      @id @default(autoincrement())
 content   String
 createdAt DateTime @default(now()) @map("created_at")
 updatedAt DateTime @updatedAt @map("updated_at")
 postId    Int      @map("post_id")
 post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
 authorId  Int      @map("author_id")
 author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

 @@map("comments")
}
[/highlight]