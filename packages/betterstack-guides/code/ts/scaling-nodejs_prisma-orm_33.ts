# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: typescript
# Normalized: ts
# Block index: 33

const getUsersWithMinimalData = async () => {
 return prisma.user.findMany({
   select: {
     id: true,
     name: true,
     email: true,
   }
 });
};