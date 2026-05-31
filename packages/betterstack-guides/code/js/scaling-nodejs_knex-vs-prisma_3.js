# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: javascript
# Normalized: js
# Block index: 3

// Generate client first with: npx prisma generate

// In your app
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Now use prisma for database operations
const users = await prisma.user.findMany();