# Source: https://betterstack.com/community/guides/scaling-nodejs/typeorm-v-mikroorm/
# Original language: typescript
# Normalized: ts
# Block index: 14

// Fully typed repositories
const userRepository = em.getRepository(User);
const user = await userRepository.findOne({ id: 1 }); 
// Precisely typed as User | null

// Custom repositories with typed methods
@Repository(User)
export class UserRepository extends EntityRepository<User> {
    findByEmail(email: string): Promise<User | null> {
        return this.findOne({ email });
    }
}