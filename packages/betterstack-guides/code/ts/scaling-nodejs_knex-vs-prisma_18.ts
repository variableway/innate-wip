# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 18

// Tagged template queries
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${email}
`;

// For data modification
const updated = await prisma.$executeRaw`
  UPDATE users SET last_login = NOW() 
  WHERE id = ${userId}
`;

// Dynamic queries need a different method
const orderBy = 'created_at DESC';
const users = await prisma.$queryRawUnsafe(
  `SELECT * FROM users ORDER BY ${orderBy} LIMIT $1`,
  10
);