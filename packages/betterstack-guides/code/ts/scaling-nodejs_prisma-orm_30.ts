# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: typescript
# Normalized: ts
# Block index: 30

// Example: Logging all queries
prisma.$use(async (params, next) => {
 const before = Date.now();

 const result = await next(params);

 const after = Date.now();
 console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

 return result;
});