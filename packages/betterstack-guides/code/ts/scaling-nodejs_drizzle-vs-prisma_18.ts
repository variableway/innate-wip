# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 18

// Types available after generation
import { PrismaClient, User, Post } from '@prisma/client'

// Client is fully typed based on schema
const prisma = new PrismaClient()

// TypeScript knows User has id, email, name, posts, etc.
const user: User = await prisma.user.findUnique({
  where: { id: 1 }
})

// Error: Property 'nonExistent' does not exist on type 'User'
console.log(user.nonExistent)