# Source: https://betterstack.com/community/guides/scaling-nodejs/typeorm-v-mikroorm/
# Original language: typescript
# Normalized: ts
# Block index: 4

// Define a custom repository with your query methods
@Repository(User)
export class UserRepository extends EntityRepository<User> {
    // Custom query method
    findActiveWithRecentPosts(date: Date): Promise<User[]> {
        return this.createQueryBuilder("user")
            .leftJoinAndSelect("user.posts", "post")
            .where({ isActive: true })
            .getResult();
    }
}

// Using the repository
const userRepository = em.getRepository(User);
const usersWithRecentPosts = await userRepository.findActiveWithRecentPosts(
    new Date("2023-01-01")
);