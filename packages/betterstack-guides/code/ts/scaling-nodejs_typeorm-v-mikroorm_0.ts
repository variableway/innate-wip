# Source: https://betterstack.com/community/guides/scaling-nodejs/typeorm-v-mikroorm/
# Original language: typescript
# Normalized: ts
# Block index: 0

// Active Record style
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ length: 50, unique: true })
    username: string;
    
    // Method that saves itself
    async setUsername(name: string) {
        this.username = name;
        return this.save();
    }
}

// Using it
const user = new User();
user.username = "john";
await user.save();