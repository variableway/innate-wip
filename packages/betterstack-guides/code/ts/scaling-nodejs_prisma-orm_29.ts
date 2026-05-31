# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: typescript
# Normalized: ts
# Block index: 29

// Example: Creating a user and their first post in a transaction
const createUserWithPost = async (userData, postData) => {
 return prisma.$transaction(async (tx) => {
   const user = await tx.user.create({
     data: userData
   });

   const post = await tx.post.create({
     data: {
       ...postData,
       author: {
         connect: { id: user.id }
       }
     }
   });

   return { user, post };
 });
};