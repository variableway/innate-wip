# Source: https://betterstack.com/community/guides/scaling-nodejs/typeorm-v-mikroorm/
# Original language: typescript
# Normalized: ts
# Block index: 6

// Unit of Work pattern
const em = orm.em.fork();

try {
    await em.begin();
    
    const user = new User();
    user.username = "john";
    em.persist(user);
    
    // Send all changes to database at once
    await em.commit();
} catch (err) {
    await em.rollback();
    throw err;
}

// Or use this helper for simpler code
await em.transactional(async (em) => {
    const user = new User();
    user.username = "john";
    em.persist(user);
    // Commits automatically at the end
});