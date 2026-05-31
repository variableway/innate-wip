# Source: https://betterstack.com/community/guides/scaling-nodejs/typeorm-v-mikroorm/
# Original language: typescript
# Normalized: ts
# Block index: 13

// Repository methods are properly typed
const userRepository = dataSource.getRepository(User);
const user = await userRepository.findOneBy({ id: 1 }); 
// user is typed as User | null

// Relationship types are enforced
const post = new Post();
post.title = "Hello TypeORM";
post.author = 123; // Error: Type 'number' is not assignable to type 'User'