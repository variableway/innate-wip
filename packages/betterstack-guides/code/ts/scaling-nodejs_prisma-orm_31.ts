# Source: https://betterstack.com/community/guides/scaling-nodejs/prisma-orm/
# Original language: typescript
# Normalized: ts
# Block index: 31

// Example: Create a new user with posts and comments in one query
const createCompleteUserProfile = async () => {
 return prisma.user.create({
   data: {
     email: 'newuser@example.com',
     name: 'New User',
     password: 'securepassword',
     posts: {
       create: [
         {
           title: 'My First Post',
           content: 'Hello world!',
           comments: {
             create: [
               {
                 content: 'Great first post!',
                 author: {
                   connect: { email: 'existinguser@example.com' }
                 }
               }
             ]
           }
         }
       ]
     }
   },
   include: {
     posts: {
       include: {
         comments: true
       }
     }
   }
 });
};