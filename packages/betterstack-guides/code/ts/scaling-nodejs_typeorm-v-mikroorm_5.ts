# Source: https://betterstack.com/community/guides/scaling-nodejs/typeorm-v-mikroorm/
# Original language: typescript
# Normalized: ts
# Block index: 5

// Detailed transaction control
const queryRunner = dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();

try {
    const user = new User();
    user.username = "john";
    await queryRunner.manager.save(user);
    // More operations...
    await queryRunner.commitTransaction();
} catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
}

// Or use a decorator for cleaner code
@Transaction()
async createUserWithProfile(
    @TransactionManager() manager: EntityManager,
    userData: UserDto
) {
    const user = new User();
    user.username = userData.username;
    await manager.save(user);
    // More operations...
    return user;
}