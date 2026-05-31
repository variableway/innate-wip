# Source: https://betterstack.com/community/guides/scaling-nodejs/typeorm-v-mikroorm/
# Original language: typescript
# Normalized: ts
# Block index: 1

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ length: 50, unique: true })
    username: string;
}

// Using a repository
const userRepository = dataSource.getRepository(User);
const user = new User();
user.username = "john";
await userRepository.save(user);