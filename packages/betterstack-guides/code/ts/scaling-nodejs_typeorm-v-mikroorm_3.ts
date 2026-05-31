# Source: https://betterstack.com/community/guides/scaling-nodejs/typeorm-v-mikroorm/
# Original language: typescript
# Normalized: ts
# Block index: 3

// Building a complex query step by step
const usersWithPosts = await dataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.posts", "post")
    .where("user.isActive = :active", { active: true })
    .getMany();

// Simple queries with find methods
const activeUsers = await userRepository.find({
    where: { isActive: true },
    take: 10
});